import { describe, expect, it, vi } from "vitest";
import { createHarnessChatService } from "../../../src/features/harnessChat/domain/service";
import type { HarnessChatRepository } from "../../../src/features/harnessChat/persistence/repository";
import type {
  AppendHarnessChatMessageInput,
  CompleteHarnessChatLlmUsageAttemptInput,
  CreateHarnessChatConversationInput,
  CreateHarnessChatPacketRevisionInput,
  HarnessChatConversationData,
  HarnessChatLlmUsageAttemptData,
  HarnessChatMessageData,
  HarnessChatPacketRevisionData,
  HarnessChatPdfAttemptData,
  RecordHarnessChatPdfAttemptInput,
  ReserveHarnessChatLlmUsageAttemptInput,
} from "../../../src/features/harnessChat/persistence/types";
import type { ProductDiscoveryConversationAdapter } from "../../../src/lib/productDiscovery/conversationAdapter";

const ROOT_USER_ID = "00000000-0000-4000-8000-000000000001";
const CONVERSATION_ID = "00000000-0000-4000-8000-000000000002";
const NOW = new Date("2026-05-08T00:00:00.000Z");

function createRepository(): HarnessChatRepository {
  const conversations = new Map<string, HarnessChatConversationData>();
  const messages = new Map<string, HarnessChatMessageData[]>();
  const packetRevisions = new Map<string, HarnessChatPacketRevisionData[]>();
  const pdfAttempts = new Map<string, HarnessChatPdfAttemptData[]>();
  const llmUsageAttempts = new Map<string, HarnessChatLlmUsageAttemptData[]>();

  return {
    async createConversation(input: CreateHarnessChatConversationInput) {
      const conversation: HarnessChatConversationData = {
        conversationId: CONVERSATION_ID,
        productRequestId: input.productRequestId ?? null,
        scopeType: "root",
        tenantId: null,
        createdByRootUserId: input.createdByRootUserId,
        state: "active",
        sourceChannel: "app",
        surfaceContext: input.surfaceContext ?? {},
        clientContext: input.clientContext ?? {},
        structuredDiscoveryState: input.structuredDiscoveryState ?? {},
        compactTranscriptSummary: input.compactTranscriptSummary ?? null,
        latestPacketRevisionId: null,
        retentionPosture: "indefinite",
        createdAt: NOW,
        updatedAt: NOW,
        deletedAt: null,
      };
      conversations.set(CONVERSATION_ID, conversation);
      messages.set(CONVERSATION_ID, []);
      return conversation;
    },
    async appendMessage(input: AppendHarnessChatMessageInput) {
      const conversationMessages = messages.get(input.conversationId) ?? [];
      const message: HarnessChatMessageData = {
        messageId: input.messageId,
        conversationId: input.conversationId,
        sequenceNumber: conversationMessages.length + 1,
        role: input.role,
        body: input.body,
        acceptedByHarness: input.acceptedByHarness ?? true,
        createdByRootUserId: input.createdByRootUserId ?? null,
        metadata: input.metadata ?? null,
        createdAt: NOW,
      };
      conversationMessages.push(message);
      messages.set(input.conversationId, conversationMessages);
      return message;
    },
    async findConversationById(conversationId: string) {
      return conversations.get(conversationId) ?? null;
    },
    async listRootConversations() {
      return [...conversations.values()];
    },
    async listMessages(conversationId: string) {
      return messages.get(conversationId) ?? [];
    },
    async updateConversation(input) {
      const conversation = conversations.get(input.conversationId);
      if (!conversation) {
        return null;
      }
      conversation.state = input.state ?? conversation.state;
      conversation.compactTranscriptSummary = input.compactTranscriptSummary ?? conversation.compactTranscriptSummary;
      conversation.updatedAt = NOW;
      return conversation;
    },
    async updateUserMessageAndDeleteDownstream(input) {
      const conversationMessages = messages.get(input.conversationId) ?? [];
      const index = conversationMessages.findIndex((message) =>
        message.messageId === input.messageId &&
        message.role === "user" &&
        message.createdByRootUserId === input.rootUserId,
      );
      if (index < 0) {
        return null;
      }
      const existing = conversationMessages[index];
      const updated = {
        ...existing,
        body: input.body,
        metadata: {
          ...(existing.metadata ?? {}),
          ...(input.metadata ?? {}),
        },
      };
      messages.set(input.conversationId, [...conversationMessages.slice(0, index), updated]);
      const conversation = conversations.get(input.conversationId);
      if (conversation) {
        conversation.latestPacketRevisionId = null;
        conversation.state = "active";
        conversation.updatedAt = NOW;
      }
      return updated;
    },
    async createPacketRevision(input: CreateHarnessChatPacketRevisionInput) {
      const revisions = packetRevisions.get(input.conversationId) ?? [];
      const revision: HarnessChatPacketRevisionData = {
        packetRevisionId: input.packetRevisionId,
        conversationId: input.conversationId,
        productRequestId: input.productRequestId ?? null,
        version: revisions.length + 1,
        state: input.state ?? "generated",
        productDiscoveryPacketPath: input.productDiscoveryPacketPath ?? null,
        packetData: input.packetData,
        sourceMessageSequenceMax: input.sourceMessageSequenceMax,
        previousPacketRevisionId: null,
        nextPacketRevisionId: null,
        generatedByRootUserId: input.generatedByRootUserId,
        generatedAt: NOW,
        supersededAt: null,
        createdAt: NOW,
        updatedAt: NOW,
      };
      revisions.push(revision);
      packetRevisions.set(input.conversationId, revisions);
      const conversation = conversations.get(input.conversationId);
      if (conversation) {
        conversation.latestPacketRevisionId = revision.packetRevisionId;
        conversation.state = "packet-ready";
        conversation.updatedAt = NOW;
      }
      return revision;
    },
    async findCurrentPacketRevision(conversationId: string) {
      const revisions = packetRevisions.get(conversationId) ?? [];
      return revisions[revisions.length - 1] ?? null;
    },
    async listPacketRevisions(conversationId: string) {
      return packetRevisions.get(conversationId) ?? [];
    },
    async markPacketDownloaded(packetRevisionId: string) {
      for (const revisions of packetRevisions.values()) {
        const packet = revisions.find((item) => item.packetRevisionId === packetRevisionId);
        if (packet) {
          packet.state = "downloaded";
          packet.updatedAt = NOW;
          return packet;
        }
      }
      return null;
    },
    async recordPdfAttempt(input: RecordHarnessChatPdfAttemptInput) {
      const attempts = pdfAttempts.get(input.packetRevisionId) ?? [];
      const attempt: HarnessChatPdfAttemptData = {
        pdfAttemptId: input.pdfAttemptId,
        packetRevisionId: input.packetRevisionId,
        requestedByRootUserId: input.requestedByRootUserId,
        state: input.state,
        safeFailureReason: input.safeFailureReason ?? null,
        sourceDataSizeBytes: input.sourceDataSizeBytes ?? null,
        renderedHtmlSizeBytes: input.renderedHtmlSizeBytes ?? null,
        outputSizeBytes: input.outputSizeBytes ?? null,
        durationMs: input.durationMs ?? null,
        retryOfAttemptId: input.retryOfAttemptId ?? null,
        startedAt: input.startedAt ?? null,
        completedAt: input.completedAt ?? null,
        createdAt: NOW,
      };
      attempts.push(attempt);
      pdfAttempts.set(input.packetRevisionId, attempts);
      return attempt;
    },
    async listPdfAttempts(packetRevisionId: string) {
      return pdfAttempts.get(packetRevisionId) ?? [];
    },
    async reserveLlmUsageAttempt(input: ReserveHarnessChatLlmUsageAttemptInput) {
      const attempts = [...llmUsageAttempts.values()].flat();
      const providerModelAttempts = attempts.filter((attempt) =>
        attempt.provider === input.provider &&
        attempt.model === input.model &&
        ["reserved", "succeeded", "failed"].includes(attempt.state),
      );
      const dayCount = providerModelAttempts.filter((attempt) =>
        attempt.requestDay.toISOString().slice(0, 10) === NOW.toISOString().slice(0, 10),
      ).length;
      const monthCount = providerModelAttempts.filter((attempt) =>
        attempt.requestMonth.toISOString().slice(0, 7) === NOW.toISOString().slice(0, 7),
      ).length;
      const state = dayCount >= input.dailyRequestLimit || monthCount >= input.monthlyRequestLimit
        ? "blocked"
        : "reserved";
      const attempt: HarnessChatLlmUsageAttemptData = {
        llmUsageAttemptId: input.llmUsageAttemptId,
        conversationId: input.conversationId,
        provider: input.provider,
        model: input.model,
        state,
        safeFailureReason: dayCount >= input.dailyRequestLimit
          ? "daily_request_limit"
          : monthCount >= input.monthlyRequestLimit
            ? "monthly_request_limit"
            : null,
        requestDay: new Date("2026-05-08T00:00:00.000Z"),
        requestMonth: new Date("2026-05-01T00:00:00.000Z"),
        dailyRequestLimit: input.dailyRequestLimit,
        monthlyRequestLimit: input.monthlyRequestLimit,
        inputChars: input.inputChars,
        transcriptMessageCount: input.transcriptMessageCount,
        outputChars: null,
        errorCode: null,
        createdAt: NOW,
        completedAt: state === "blocked" ? NOW : null,
      };
      const conversationAttempts = llmUsageAttempts.get(input.conversationId) ?? [];
      conversationAttempts.push(attempt);
      llmUsageAttempts.set(input.conversationId, conversationAttempts);
      return attempt;
    },
    async completeLlmUsageAttempt(input: CompleteHarnessChatLlmUsageAttemptInput) {
      for (const attempts of llmUsageAttempts.values()) {
        const attempt = attempts.find((item) => item.llmUsageAttemptId === input.llmUsageAttemptId);
        if (attempt) {
          attempt.state = input.state;
          attempt.safeFailureReason = input.safeFailureReason ?? null;
          attempt.outputChars = input.outputChars ?? null;
          attempt.errorCode = input.errorCode ?? null;
          attempt.completedAt = input.completedAt ?? NOW;
          return attempt;
        }
      }
      throw new Error("usage attempt not found");
    },
    async listLlmUsageAttempts(conversationId: string) {
      return llmUsageAttempts.get(conversationId) ?? [];
    },
  };
}

describe("harness chat service Product Discovery conversation adapter", () => {
  it("persists the schema-validated adapter assistant turn", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => ({
        assistantMessage: "Who is this discovery request for?",
        summary: "Builder wants guided discovery.",
        nextQuestion: "Who is this for?",
        nextStep: "ask_business_question" as const,
        confidencePercent: 64,
        readyForPacket: false,
        assumptions: ["Root-admin context is prompt-only."],
        packagedTechnicalQuestions: ["Which persistent artifact owns packet readiness?"],
      })),
    };
    const service = createHarnessChatService(repository, adapter);

    const created = await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Help me shape a request.",
      surfaceContext: { pageKey: "overview" },
    });

    expect(adapter.generateTurn).toHaveBeenCalledOnce();
    expect(created.messages).toHaveLength(2);
    expect(created.messages[1]).toMatchObject({
      role: "assistant",
      body: "Who is this discovery request for?\n\nWho is this for?",
    });
    const storedMessages = await repository.listMessages(CONVERSATION_ID);
    expect(storedMessages[1]?.metadata).toMatchObject({
      source: "product-discovery-conversation-adapter",
      summary: "Builder wants guided discovery.",
      nextStep: "ask_business_question",
      readyForPacket: false,
    });
  });

  it("composes the visible assistant turn from the adapter summary and next question", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => ({
        assistantMessage: "Got it. The user wants expired sessions to return them to sign-in instead of leaving them stranded.",
        summary: "Session expiry should redirect to login.",
        nextQuestion: "When the session expires, should the app preserve where they were trying to work so they can resume after signing in?",
        nextStep: "ask_business_question" as const,
        confidencePercent: 58,
        readyForPacket: false,
        assumptions: ["Rule: expired sessions should not leave users on the stale page."],
        packagedTechnicalQuestions: [],
      })),
    };
    const service = createHarnessChatService(repository, adapter);

    const created = await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Fix automatic logout when the session expires.",
    });

    expect(created.messages[1]).toMatchObject({
      role: "assistant",
      body: [
        "Got it. The user wants expired sessions to return them to sign-in instead of leaving them stranded.",
        "When the session expires, should the app preserve where they were trying to work so they can resume after signing in?",
      ].join("\n\n"),
    });
  });

  it("stores a safe fallback assistant turn when the adapter fails", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => {
        throw new Error("model unavailable");
      }),
    };
    const service = createHarnessChatService(repository, adapter);

    const created = await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Help me shape a request.",
    });

    expect(created.messages[1]).toMatchObject({
      role: "assistant",
      body: expect.stringContaining("temporarily unavailable"),
    });
    const storedMessages = await repository.listMessages(CONVERSATION_ID);
    expect(storedMessages[1]).toMatchObject({
      acceptedByHarness: false,
      metadata: expect.objectContaining({
        source: "product-discovery-conversation-adapter-fallback",
        nextStep: "ask_business_question",
      }),
    });
  });

  it("persists calibrated ready turns as final packet confirmation", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => ({
        assistantMessage:
          "That is enough to define the first version: the author edits their own message inline, saving rewrites the conversation from that point, and the corrected thread replaces downstream messages in place.",
        summary: "Inline author-only message edits rewrite downstream chat in place.",
        nextQuestion: "I think I have everything needed. Do you have any final follow-up, or should I produce the packet for download?",
        nextStep: "ready_for_packet" as const,
        confidencePercent: 88,
        readyForPacket: true,
        assumptions: [
          "Rule: only the original author can edit their own message.",
          "Rule: saving an edit rewrites the conversation from that point.",
          "Usual case: low-risk labels use standard product wording unless corrected.",
        ],
        packagedTechnicalQuestions: ["Define durable regeneration and truncation behavior for downstream messages."],
      })),
    };
    const service = createHarnessChatService(repository, adapter);

    const created = await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "When I edit a message, it should edit mine and regenerate later replies.",
    });

    expect(created.messages[1]).toMatchObject({
      role: "assistant",
      body: expect.stringContaining("should I produce the packet for download?"),
    });
    expect(created.messages[1]?.body).toContain("That is enough to define the first version");
    const storedMessages = await repository.listMessages(CONVERSATION_ID);
    expect(storedMessages[1]?.metadata).toMatchObject({
      nextQuestion: "I think I have everything needed. Do you have any final follow-up, or should I produce the packet for download?",
      nextStep: "ready_for_packet",
      readyForPacket: true,
    });
  });

  it("generates a packet after the ready confirmation when the requester has no follow-up", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => ({
        assistantMessage:
          "That is enough to define the first version: the author edits their own message inline, saving rewrites the conversation from that point, and the corrected thread replaces downstream messages in place.",
        summary: "Inline author-only message edits rewrite downstream chat in place.",
        nextQuestion: "I think I have everything needed. Do you have any final follow-up, or should I produce the packet for download?",
        nextStep: "ready_for_packet" as const,
        confidencePercent: 95,
        readyForPacket: true,
        assumptions: [
          "Rule: only the original author can edit their own message.",
          "Rule: saving an edit rewrites the conversation from that point.",
        ],
        packagedTechnicalQuestions: ["Define durable regeneration and truncation behavior for downstream messages."],
      })),
    };
    const service = createHarnessChatService(repository, adapter);

    await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "When I edit a message, it should edit mine and regenerate later replies.",
    });
    const response = await service.appendMessage({
      conversationId: CONVERSATION_ID,
      rootUserId: ROOT_USER_ID,
      message: "nope",
    });

    expect(adapter.generateTurn).toHaveBeenCalledTimes(1);
    expect(response.assistantMessage).toMatchObject({
      role: "assistant",
      body: "Product Discovery packet is ready to download.",
      metadata: expect.objectContaining({
        source: "product-discovery-packet-confirmation",
        packetRevisionId: expect.any(String),
      }),
    });
    expect(response.packet).toMatchObject({
      state: "generated",
      pdf: {
        downloadAvailable: true,
      },
    });
    expect(response.conversation).toMatchObject({
      state: "packet-ready",
      latestPacketRevisionId: response.packet?.packetRevisionId,
    });
  });

  it("renders generated packet downloads as valid PDF bytes", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => ({
        assistantMessage: "I think I have everything needed.",
        summary: "Root builder wants a downloadable discovery packet.",
        nextQuestion: "I think I have everything needed. Do you have any final follow-up, or should I produce the packet for download?",
        nextStep: "ready_for_packet" as const,
        confidencePercent: 95,
        readyForPacket: true,
        assumptions: ["Rule: produce a downloadable packet after confirmation."],
        packagedTechnicalQuestions: ["Confirm PDF rendering details during Technical Steering."],
      })),
    };
    const service = createHarnessChatService(repository, adapter);

    await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Create a packet I can download.",
    });
    const response = await service.appendMessage({
      conversationId: CONVERSATION_ID,
      rootUserId: ROOT_USER_ID,
      message: "nope",
    });
    const pdf = await service.renderPacketPdf(response.packet?.packetRevisionId ?? "", ROOT_USER_ID);
    const pdfText = pdf.toString("utf8");

    expect(pdfText.startsWith("%PDF-1.4\n")).toBe(true);
    expect(pdfText).toContain("/Type /Catalog");
    expect(pdfText).toContain("xref\n");
    expect(pdfText.trimEnd().endsWith("%%EOF")).toBe(true);
    await expect(repository.listPdfAttempts(response.packet?.packetRevisionId ?? "")).resolves.toMatchObject([
      {
        state: "succeeded",
        outputSizeBytes: pdf.length,
      },
    ]);
  });

  it("records durable usage attempts around adapter calls", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => ({
        assistantMessage: "Who is this discovery request for?",
        summary: "Builder wants guided discovery.",
        nextQuestion: "Who is this for?",
        nextStep: "ask_business_question" as const,
        confidencePercent: 64,
        readyForPacket: false,
        assumptions: [],
        packagedTechnicalQuestions: [],
      })),
    };
    const service = createHarnessChatService(repository, adapter, {
      enabled: true,
      provider: "openai",
      model: "gpt-test",
      dailyRequestLimit: 20,
      monthlyRequestLimit: 300,
    });

    await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Help me shape a request.",
    });

    await expect(repository.listLlmUsageAttempts(CONVERSATION_ID)).resolves.toMatchObject([
      {
        provider: "openai",
        model: "gpt-test",
        state: "succeeded",
        outputChars: expect.any(Number),
        transcriptMessageCount: 1,
      },
    ]);
  });

  it("does not call the adapter when durable usage limits are reached", async () => {
    const repository = createRepository();
    const adapter: ProductDiscoveryConversationAdapter = {
      generateTurn: vi.fn(async () => {
        throw new Error("should not be called");
      }),
    };
    const service = createHarnessChatService(repository, adapter, {
      enabled: true,
      provider: "openai",
      model: "gpt-test",
      dailyRequestLimit: 0 as unknown as number,
      monthlyRequestLimit: 300,
    });

    const created = await service.createConversation({
      rootUserId: ROOT_USER_ID,
      initialMessage: "Help me shape a request.",
    });

    expect(adapter.generateTurn).not.toHaveBeenCalled();
    expect(created.messages[1]).toMatchObject({
      role: "assistant",
      body: expect.stringContaining("local usage limit"),
    });
    await expect(repository.listLlmUsageAttempts(CONVERSATION_ID)).resolves.toMatchObject([
      {
        state: "blocked",
        safeFailureReason: "daily_request_limit",
      },
    ]);
  });
});
