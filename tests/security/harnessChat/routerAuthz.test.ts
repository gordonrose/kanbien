import express, { type RequestHandler } from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createHarnessChatRouter } from "../../../src/features/harnessChat/transport/router";
import type { RootCapabilityChecker } from "../../../src/lib/authz/middleware";

const ROOT_USER_ID = "00000000-0000-4000-8000-000000000001";
const AUTH_PRINCIPAL_ID = "00000000-0000-4000-8000-000000000002";
const CONVERSATION_ID = "00000000-0000-4000-8000-000000000003";
const PACKET_REVISION_ID = "00000000-0000-4000-8000-000000000004";

function createRootSessionMiddleware(): RequestHandler {
  return (request, _response, next) => {
    request.rootSession = {
      sessionId: "session-1",
      authPrincipalId: AUTH_PRINCIPAL_ID,
      rootUserId: ROOT_USER_ID,
      authenticatedAt: "2026-05-08T00:00:00.000Z",
      expiresAt: "2026-05-08T01:00:00.000Z",
    };
    next();
  };
}

function createService() {
  return {
    createConversation: vi.fn(),
    listConversations: vi.fn(),
    readConversation: vi.fn(),
    updateConversation: vi.fn(),
    appendMessage: vi.fn(),
    editMessage: vi.fn(),
    generatePacket: vi.fn(),
    listPacketRevisions: vi.fn(),
    readPacketRevision: vi.fn(),
    renderPacketPdf: vi.fn(),
  } satisfies Parameters<typeof createHarnessChatRouter>[0];
}

function createDeniedSubject() {
  const service = createService();
  const checker: RootCapabilityChecker = {
    hasCapability: vi.fn(async () => false),
  };
  const app = express();
  app.use(express.json());
  app.use(createRootSessionMiddleware());
  app.use("/v1/root-admin/harness-chat", createHarnessChatRouter(service, checker));
  return { app, checker, service };
}

describe("harness chat route authorization", () => {
  it.each([
    {
      method: "post" as const,
      path: "/v1/root-admin/harness-chat/conversations",
      body: { sourceChannel: "app" },
      capabilityKey: "harness-chat.root.conversation.create",
    },
    {
      method: "get" as const,
      path: "/v1/root-admin/harness-chat/conversations",
      capabilityKey: "harness-chat.root.conversation.read",
    },
    {
      method: "post" as const,
      path: `/v1/root-admin/harness-chat/conversations/${CONVERSATION_ID}/messages`,
      body: { message: "Please capture this." },
      capabilityKey: "harness-chat.root.message.append",
    },
    {
      method: "post" as const,
      path: `/v1/root-admin/harness-chat/conversations/${CONVERSATION_ID}/packet-generations`,
      body: { reason: "user-requested" },
      capabilityKey: "harness-chat.root.packet.generate",
    },
    {
      method: "get" as const,
      path: `/v1/root-admin/harness-chat/packet-revisions/${PACKET_REVISION_ID}/pdf`,
      capabilityKey: "harness-chat.root.packet.downloadPdf",
    },
  ])("denies $method $path without the required root capability", async ({ method, path, body, capabilityKey }) => {
    const { app, checker, service } = createDeniedSubject();
    const response = method === "post"
      ? await request(app).post(path).send(body ?? {})
      : await request(app).get(path);

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      code: "FORBIDDEN",
      details: { reason: "missing_capability" },
    });
    expect(checker.hasCapability).toHaveBeenCalledWith({
      rootUserId: ROOT_USER_ID,
      capabilityKey,
    });
    expect(service.createConversation).not.toHaveBeenCalled();
    expect(service.listConversations).not.toHaveBeenCalled();
    expect(service.readConversation).not.toHaveBeenCalled();
    expect(service.appendMessage).not.toHaveBeenCalled();
    expect(service.generatePacket).not.toHaveBeenCalled();
    expect(service.renderPacketPdf).not.toHaveBeenCalled();
  });
});
