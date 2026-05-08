import express, { type RequestHandler } from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createHarnessChatRouter } from "../../../src/features/harnessChat/transport/router";
import type { RootCapabilityChecker } from "../../../src/lib/authz/middleware";

const ROOT_USER_ID = "00000000-0000-4000-8000-000000000001";
const AUTH_PRINCIPAL_ID = "00000000-0000-4000-8000-000000000002";
const CONVERSATION_ID = "00000000-0000-4000-8000-000000000003";
const PACKET_REVISION_ID = "00000000-0000-4000-8000-000000000004";
const NOW_ISO = "2026-05-08T00:00:00.000Z";

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
  const conversationResponse = {
    conversationId: CONVERSATION_ID,
    productRequestId: null,
    state: "draft" as const,
    sourceChannel: "app" as const,
    rootScope: true,
    createdByRootUserId: ROOT_USER_ID,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    latestPacketRevisionId: null,
    latestPacketState: null,
    title: "Product Discovery conversation",
    messages: [],
    surfaceContext: {},
    structuredDiscoveryState: {},
  };
  const packetResponse = {
    packetRevisionId: PACKET_REVISION_ID,
    conversationId: CONVERSATION_ID,
    productDiscoveryPacketPath: null,
    state: "generated" as const,
    version: 1,
    previousPacketRevisionId: null,
    nextPacketRevisionId: null,
    generatedAt: NOW_ISO,
    generatedByRootUserId: ROOT_USER_ID,
    pdf: {
      downloadAvailable: true,
      lastAttemptState: "none",
      lastFailureReason: null,
    },
  };
  const messageData = {
    messageId: "00000000-0000-4000-8000-000000000005",
    conversationId: CONVERSATION_ID,
    sequenceNumber: 1,
    role: "user" as const,
    body: "Please capture this.",
    acceptedByHarness: true,
    createdByRootUserId: ROOT_USER_ID,
    metadata: null,
    createdAt: new Date(NOW_ISO),
  };
  return {
    createConversation: vi.fn(async () => conversationResponse),
    listConversations: vi.fn(async () => ({
      items: [],
      page: 1,
      pageSize: 25,
      totalCount: 0,
    })),
    readConversation: vi.fn(async (input: { conversationId: string; includeMessages: boolean }) => ({
      ...conversationResponse,
      messages: input.includeMessages
        ? [{
          messageId: messageData.messageId,
          role: messageData.role,
          body: messageData.body,
          createdAt: NOW_ISO,
        }]
        : [],
    })),
    appendMessage: vi.fn(async () => ({
      userMessage: messageData,
      assistantMessage: {
        ...messageData,
        messageId: "00000000-0000-4000-8000-000000000006",
        sequenceNumber: 2,
        role: "assistant" as const,
        createdByRootUserId: null,
      },
      conversation: conversationResponse,
    })),
    generatePacket: vi.fn(async () => ({
      packet: packetResponse,
      conversation: conversationResponse,
    })),
    listPacketRevisions: vi.fn(async () => ({
      items: [packetResponse],
    })),
    readPacketRevision: vi.fn(async () => ({
      ...packetResponse,
      packetData: {},
    })),
    renderPacketPdf: vi.fn(async () => Buffer.from("%PDF-1.4\n%%EOF\n", "utf8")),
  } satisfies Parameters<typeof createHarnessChatRouter>[0];
}

function createSubject() {
  const service = createService();
  const checker: RootCapabilityChecker = {
    hasCapability: vi.fn(async () => true),
  };
  const app = express();
  app.use(express.json());
  app.use(createRootSessionMiddleware());
  app.use("/v1/root-admin/harness-chat", createHarnessChatRouter(service, checker));
  return { app, checker, service };
}

describe("harness chat protected route contract", () => {
  it("creates a conversation from the authenticated root session and rejects system-managed fields", async () => {
    const { app, service } = createSubject();

    const created = await request(app)
      .post("/v1/root-admin/harness-chat/conversations")
      .send({
        sourceChannel: "app",
        initialMessage: "Help me shape this request.",
        surfaceContext: { page: "build" },
      });

    expect(created.status).toBe(201);
    expect(service.createConversation).toHaveBeenCalledWith({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Help me shape this request.",
      surfaceContext: { page: "build" },
      clientContext: undefined,
    });

    const rejected = await request(app)
      .post("/v1/root-admin/harness-chat/conversations")
      .send({
        sourceChannel: "app",
        conversationId: CONVERSATION_ID,
      });

    expect(rejected.status).toBe(400);
    expect(rejected.body).toMatchObject({
      code: "HARNESS_CHAT_INVALID_REQUEST",
      details: {
        field: "conversationId",
        reason: "unexpected_field",
      },
    });
  });

  it("parses includeMessages=false as false instead of a truthy string", async () => {
    const { app, service } = createSubject();

    const response = await request(app)
      .get(`/v1/root-admin/harness-chat/conversations/${CONVERSATION_ID}`)
      .query({ includeMessages: "false" });

    expect(response.status).toBe(200);
    expect(response.body.messages).toEqual([]);
    expect(service.readConversation).toHaveBeenCalledWith({
      conversationId: CONVERSATION_ID,
      includeMessages: false,
    });
  });

  it("serves generated packet PDF bytes through the protected download route", async () => {
    const { app, service } = createSubject();

    const response = await request(app)
      .get(`/v1/root-admin/harness-chat/packet-revisions/${PACKET_REVISION_ID}/pdf`);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/pdf");
    expect(Buffer.from(response.body).toString("utf8")).toContain("%PDF-1.4");
    expect(service.renderPacketPdf).toHaveBeenCalledWith(PACKET_REVISION_ID, ROOT_USER_ID);
  });
});
