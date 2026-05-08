import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresHarnessChatRepository } from "../../../src/features/harnessChat";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("harnessChat postgres repository", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "harnessChat",
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-CHAT-L1-INT-001 stores root-scoped conversations and ordered transcript messages durably", async () => {
    const repository = createPostgresHarnessChatRepository(pool);

    const conversation = await repository.createConversation({
      conversationId: "11111111-1111-4111-8111-111111111111",
      createdByRootUserId: "00000000-0000-0000-0000-000000000001",
      surfaceContext: {
        route: "/root-admin/users",
        module: "Root users",
        role: "Root builder",
      },
      clientContext: {
        locale: "en-US",
        timezone: "UTC",
      },
    });
    const firstMessage = await repository.appendMessage({
      messageId: "22222222-2222-4222-8222-222222222222",
      conversationId: conversation.conversationId,
      role: "user",
      body: "I need to shape a root-admin discovery request.",
      acceptedByHarness: true,
      createdByRootUserId: "00000000-0000-0000-0000-000000000001",
      metadata: {
        source: "root-admin-build-panel",
      },
    });
    const secondMessage = await repository.appendMessage({
      messageId: "33333333-3333-4333-8333-333333333333",
      conversationId: conversation.conversationId,
      role: "assistant",
      body: "I will keep the context visible without treating it as authority.",
    });

    const persistedConversation = await repository.findConversationById(conversation.conversationId);
    const messages = await repository.listMessages(conversation.conversationId);
    const rootHistory = await repository.listRootConversations();

    expect(conversation.scopeType).toBe("root");
    expect(conversation.tenantId).toBeNull();
    expect(conversation.retentionPosture).toBe("indefinite");
    expect(conversation.surfaceContext).toMatchObject({ module: "Root users" });
    expect(firstMessage.sequenceNumber).toBe(1);
    expect(secondMessage.sequenceNumber).toBe(2);
    expect(messages.map((message) => message.sequenceNumber)).toEqual([1, 2]);
    expect(messages.map((message) => message.role)).toEqual(["user", "assistant"]);
    expect(persistedConversation?.updatedAt.getTime()).toBeGreaterThanOrEqual(conversation.updatedAt.getTime());
    expect(rootHistory.map((item) => item.conversationId)).toContain(conversation.conversationId);
  });

  it("TC-CHAT-L1-EDGE-001 rejects empty transcript messages and invalid root tenant scope", async () => {
    const repository = createPostgresHarnessChatRepository(pool);

    await repository.createConversation({
      conversationId: "44444444-4444-4444-8444-444444444444",
      createdByRootUserId: "00000000-0000-0000-0000-000000000001",
    });

    await expect(repository.appendMessage({
      messageId: "55555555-5555-4555-8555-555555555555",
      conversationId: "44444444-4444-4444-8444-444444444444",
      role: "user",
      body: "   ",
      createdByRootUserId: "00000000-0000-0000-0000-000000000001",
    })).rejects.toThrow();

    await expect(pool.query(
      `
        INSERT INTO harness_chat_conversations (
          conversation_id,
          scope_type,
          tenant_id,
          created_by_root_user_id,
          state,
          source_channel,
          surface_context,
          client_context,
          structured_discovery_state,
          retention_posture
        )
        VALUES (
          '66666666-6666-4666-8666-666666666666',
          'root',
          '77777777-7777-4777-8777-777777777777',
          '00000000-0000-0000-0000-000000000001',
          'active',
          'app',
          '{}'::jsonb,
          '{}'::jsonb,
          '{}'::jsonb,
          'indefinite'
        )
      `,
    )).rejects.toThrow();
  });

  it("TC-CHAT-L1-INT-002 versions packet revisions, supersedes current packet, and records PDF attempt evidence", async () => {
    const repository = createPostgresHarnessChatRepository(pool);

    await repository.createConversation({
      conversationId: "88888888-8888-4888-8888-888888888888",
      createdByRootUserId: "00000000-0000-0000-0000-000000000001",
    });
    await repository.appendMessage({
      messageId: "99999999-9999-4999-8999-999999999999",
      conversationId: "88888888-8888-4888-8888-888888888888",
      role: "user",
      body: "Generate the first packet.",
      createdByRootUserId: "00000000-0000-0000-0000-000000000001",
    });

    const first = await repository.createPacketRevision({
      packetRevisionId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      conversationId: "88888888-8888-4888-8888-888888888888",
      generatedByRootUserId: "00000000-0000-0000-0000-000000000001",
      sourceMessageSequenceMax: 1,
      packetData: {
        title: "First packet",
        status: "approved",
      },
      productDiscoveryPacketPath: "docs/workspace/product-requests/example/request.md",
    });
    const second = await repository.createPacketRevision({
      packetRevisionId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      conversationId: "88888888-8888-4888-8888-888888888888",
      generatedByRootUserId: "00000000-0000-0000-0000-000000000001",
      sourceMessageSequenceMax: 1,
      packetData: {
        title: "Second packet",
        status: "approved",
      },
    });
    const pdfAttempt = await repository.recordPdfAttempt({
      pdfAttemptId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      packetRevisionId: second.packetRevisionId,
      requestedByRootUserId: "00000000-0000-0000-0000-000000000001",
      state: "failed",
      safeFailureReason: "render_timeout",
      sourceDataSizeBytes: 1200,
      renderedHtmlSizeBytes: 2400,
      durationMs: 10000,
      startedAt: new Date("2026-05-08T00:00:00.000Z"),
      completedAt: new Date("2026-05-08T00:00:10.000Z"),
    });

    const revisions = await repository.listPacketRevisions("88888888-8888-4888-8888-888888888888");
    const current = await repository.findCurrentPacketRevision("88888888-8888-4888-8888-888888888888");
    const conversation = await repository.findConversationById("88888888-8888-4888-8888-888888888888");
    const attempts = await repository.listPdfAttempts(second.packetRevisionId);

    expect(first.version).toBe(1);
    expect(second.version).toBe(2);
    expect(second.previousPacketRevisionId).toBe(first.packetRevisionId);
    expect(revisions.map((revision) => revision.state)).toEqual(["superseded", "generated"]);
    expect(revisions[0]?.nextPacketRevisionId).toBe(second.packetRevisionId);
    expect(revisions[0]?.supersededAt).toBeInstanceOf(Date);
    expect(current?.packetRevisionId).toBe(second.packetRevisionId);
    expect(conversation?.state).toBe("packet-ready");
    expect(conversation?.latestPacketRevisionId).toBe(second.packetRevisionId);
    expect(pdfAttempt.safeFailureReason).toBe("render_timeout");
    expect(attempts).toHaveLength(1);
  });
});
