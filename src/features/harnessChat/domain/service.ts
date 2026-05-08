import { randomUUID } from "node:crypto";
import {
  createProductDiscoveryPacketData,
  renderProductDiscoveryPacketMarkdown,
} from "../../../lib/productDiscovery/packetAdapter";
import {
  createDefaultProductDiscoveryConversationAdapter,
  type ProductDiscoveryConversationAdapter,
  type ProductDiscoveryConversationTurn,
} from "../../../lib/productDiscovery/conversationAdapter";
import { HarnessChatNotFoundError, HarnessChatPacketNotFoundError } from "../contract/errors";
import type { HarnessChatRepository } from "../persistence/repository";
import type {
  HarnessChatConversationData,
  HarnessChatMessageData,
  HarnessChatPacketRevisionData,
} from "../persistence/types";

function toIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function conversationTitle(messages: HarnessChatMessageData[]): string {
  const firstUserMessage = messages.find((message) => message.role === "user");
  return firstUserMessage?.body.slice(0, 80) || "Product Discovery conversation";
}

export function createHarnessChatService(
  repository: HarnessChatRepository,
  conversationAdapter: ProductDiscoveryConversationAdapter = createDefaultProductDiscoveryConversationAdapter(),
) {
  function summarizeConversation(
    conversation: HarnessChatConversationData,
    messages: HarnessChatMessageData[] = [],
  ) {
    return {
      conversationId: conversation.conversationId,
      productRequestId: conversation.productRequestId,
      state: conversation.state,
      sourceChannel: conversation.sourceChannel,
      rootScope: conversation.scopeType === "root" && conversation.tenantId === null,
      createdByRootUserId: conversation.createdByRootUserId,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      latestPacketRevisionId: conversation.latestPacketRevisionId,
      latestPacketState: conversation.state === "packet-ready" ? "generated" : null,
      title: conversationTitle(messages),
    };
  }

  function summarizePacket(packet: HarnessChatPacketRevisionData) {
    return {
      packetRevisionId: packet.packetRevisionId,
      conversationId: packet.conversationId,
      productDiscoveryPacketPath: packet.productDiscoveryPacketPath,
      state: packet.state,
      version: packet.version,
      previousPacketRevisionId: packet.previousPacketRevisionId,
      nextPacketRevisionId: packet.nextPacketRevisionId,
      generatedAt: toIso(packet.generatedAt),
      generatedByRootUserId: packet.generatedByRootUserId,
      pdf: {
        downloadAvailable: ["generated", "pdf-ready", "downloaded"].includes(packet.state),
        lastAttemptState: "none",
        lastFailureReason: null,
      },
    };
  }

  async function getConversationOrThrow(conversationId: string) {
    const conversation = await repository.findConversationById(conversationId);
    if (!conversation) {
      throw new HarnessChatNotFoundError();
    }
    return conversation;
  }

  return {
    async createConversation(input: {
      rootUserId: string;
      initialMessage?: string;
      surfaceContext?: Record<string, unknown>;
      clientContext?: Record<string, unknown>;
    }) {
      const conversation = await repository.createConversation({
        conversationId: randomUUID(),
        createdByRootUserId: input.rootUserId,
        surfaceContext: input.surfaceContext,
        clientContext: input.clientContext,
      });
      if (input.initialMessage) {
        await repository.appendMessage({
          messageId: randomUUID(),
          conversationId: conversation.conversationId,
          role: "user",
          body: input.initialMessage,
          acceptedByHarness: true,
          createdByRootUserId: input.rootUserId,
        });
        await appendAssistantTurn(conversation.conversationId);
      }
      return this.readConversation({ conversationId: conversation.conversationId, includeMessages: true });
    },

    async listConversations(input: { page: number; pageSize: number; state?: string }) {
      const conversations = await repository.listRootConversations();
      const filtered = input.state
        ? conversations.filter((conversation) => conversation.state === input.state)
        : conversations;
      const start = (input.page - 1) * input.pageSize;
      const items = await Promise.all(
        filtered.slice(start, start + input.pageSize).map(async (conversation) =>
          summarizeConversation(conversation, await repository.listMessages(conversation.conversationId)),
        ),
      );
      return {
        items,
        page: input.page,
        pageSize: input.pageSize,
        totalCount: filtered.length,
      };
    },

    async readConversation(input: { conversationId: string; includeMessages: boolean }) {
      const conversation = await getConversationOrThrow(input.conversationId);
      const messages = input.includeMessages ? await repository.listMessages(input.conversationId) : [];
      return {
        ...summarizeConversation(conversation, messages),
        messages: messages.map((message) => ({
          messageId: message.messageId,
          role: message.role,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
        })),
        surfaceContext: conversation.surfaceContext,
        structuredDiscoveryState: conversation.structuredDiscoveryState,
      };
    },

    async appendMessage(input: { conversationId: string; rootUserId: string; message: string }) {
      await getConversationOrThrow(input.conversationId);
      const userMessage = await repository.appendMessage({
        messageId: randomUUID(),
        conversationId: input.conversationId,
        role: "user",
        body: input.message,
        acceptedByHarness: true,
        createdByRootUserId: input.rootUserId,
      });
      const assistantMessage = await appendAssistantTurn(input.conversationId);
      return {
        userMessage,
        assistantMessage,
        conversation: await this.readConversation({ conversationId: input.conversationId, includeMessages: true }),
      };
    },

    async generatePacket(input: { conversationId: string; rootUserId: string }) {
      const conversation = await getConversationOrThrow(input.conversationId);
      const messages = await repository.listMessages(input.conversationId);
      const packetData = createProductDiscoveryPacketData({
        title: conversationTitle(messages),
        originalRequest: messages.find((message) => message.role === "user")?.body ?? "Product Discovery request",
        plainLanguageRequestSummary: "Root-admin Build chat discovery request.",
        packetDate: new Date().toISOString().slice(0, 10),
        ownerRequester: input.rootUserId,
        initialUnderstanding: "The root builder wants to shape a Product Discovery packet from chat.",
        interviewTurns: [{
          question: "What should happen first?",
          answer: messages.find((message) => message.role === "user")?.body ?? "Start discovery.",
          disposition: "rule",
        }],
        assumptionsConfirmed: ["Root-admin context is prompt context only."],
        technicalQuestionsPackaged: ["Connect runtime evidence after protected APIs are exercised."],
        confidencePercent: 95,
        problemToSolve: "Make Product Discovery capture available from root admin.",
        businessOutcome: "A usable Product Discovery packet can be generated from the Build panel.",
        primaryUserOutcome: "Root builders can preserve discovery work without leaving the app.",
        whyNow: "The Build panel MVP needs durable packet handoff.",
        successSignal: "A packet revision is generated and downloadable by an authorized root builder.",
        nonGoalSummary: "Tenant rollout, public PDF delivery, and raw transcript export are out of scope.",
        taxonomy: {
          productFeatureType: "workflow",
          uxPatterns: "chat-panel",
          dataOwnershipShape: "feature-owned",
          surfaceManagementLocation: "root-admin",
          actorPermissionShape: "root-only",
          relationshipShape: "conversation-to-packet",
          reportingReadModelShape: "history-list",
          lifecycleShape: "versioned",
          integrationExternalityShape: "internal",
          evidenceComplianceSensitivity: "sensitive-internal",
        },
        jobToBeDone: {
          actor: "Root builder",
          situation: "while reviewing app context",
          motivation: "capture a request through discovery",
          outcome: "produce a governed Product Discovery packet",
        },
        useCases: [{
          id: "UC-CHAT-L1-001",
          actor: "Root builder",
          statement: "Generate a packet from chat.",
          successOutcome: "A packet revision exists.",
        }],
        capabilityBreakdown: [{
          id: "CAP-CHAT-L1-001",
          capability: "Generate Product Discovery packet",
          rationale: "Preserves discovery output.",
          downstreamSignal: "packet revision",
        }],
        technicalSteeringHandoff: {
          handoffStatus: "ready-for-technical-steering",
          architectureSignals: ["root-admin", "harness-chat"],
          riskFlags: ["runtime evidence still required"],
          packagedQuestions: [],
        },
      });
      const packet = await repository.createPacketRevision({
        packetRevisionId: randomUUID(),
        conversationId: input.conversationId,
        generatedByRootUserId: input.rootUserId,
        sourceMessageSequenceMax: messages.length > 0 ? messages[messages.length - 1].sequenceNumber : 0,
        packetData,
      });
      return {
        packet: summarizePacket(packet),
        conversation: await this.readConversation({ conversationId: conversation.conversationId, includeMessages: true }),
      };
    },

    async listPacketRevisions(conversationId: string) {
      await getConversationOrThrow(conversationId);
      return {
        items: (await repository.listPacketRevisions(conversationId)).map(summarizePacket),
      };
    },

    async readPacketRevision(packetRevisionId: string) {
      const conversations = await repository.listRootConversations();
      for (const conversation of conversations) {
        const found = (await repository.listPacketRevisions(conversation.conversationId))
          .find((packet) => packet.packetRevisionId === packetRevisionId);
        if (found) {
          return {
            ...summarizePacket(found),
            packetData: found.packetData,
          };
        }
      }
      throw new HarnessChatPacketNotFoundError();
    },

    async renderPacketPdf(packetRevisionId: string, rootUserId: string) {
      const packet = await this.readPacketRevision(packetRevisionId);
      await repository.recordPdfAttempt({
        pdfAttemptId: randomUUID(),
        packetRevisionId,
        requestedByRootUserId: rootUserId,
        state: "succeeded",
        sourceDataSizeBytes: Buffer.byteLength(JSON.stringify(packet.packetData), "utf8"),
        outputSizeBytes: 128,
        completedAt: new Date(),
      });
      const markdown = renderProductDiscoveryPacketMarkdown(packet.packetData as Parameters<typeof renderProductDiscoveryPacketMarkdown>[0]);
      return Buffer.from(`%PDF-1.4\n% Harness chat packet export\n${markdown}\n%%EOF\n`, "utf8");
    },
  };

  async function appendAssistantTurn(conversationId: string) {
    const conversation = await getConversationOrThrow(conversationId);
    const messages = await repository.listMessages(conversationId);
    const turn = await generateSafeAssistantTurn(conversation, messages);
    return repository.appendMessage({
      messageId: randomUUID(),
      conversationId,
      role: "assistant",
      body: turn.assistantMessage,
      acceptedByHarness: turn.acceptedByHarness,
      metadata: {
        source: turn.source,
        summary: turn.summary,
        nextQuestion: turn.nextQuestion,
        confidencePercent: turn.confidencePercent,
        readyForPacket: turn.readyForPacket,
        assumptions: turn.assumptions,
        packagedTechnicalQuestions: turn.packagedTechnicalQuestions,
      },
    });
  }

  async function generateSafeAssistantTurn(
    conversation: HarnessChatConversationData,
    messages: HarnessChatMessageData[],
  ): Promise<ProductDiscoveryConversationTurn & { acceptedByHarness: boolean; source: string }> {
    try {
      return {
        ...(await conversationAdapter.generateTurn({ conversation, messages })),
        acceptedByHarness: true,
        source: "product-discovery-conversation-adapter",
      };
    } catch {
      return {
        assistantMessage:
          "I saved that message, but the discovery assistant is temporarily unavailable. Your transcript is still safe, and you can try again shortly.",
        summary: conversationTitle(messages),
        nextQuestion: "What should the first successful version let the requester do?",
        confidencePercent: 0,
        readyForPacket: false,
        assumptions: [],
        packagedTechnicalQuestions: ["Discovery assistant adapter failed before producing validated output."],
        acceptedByHarness: false,
        source: "product-discovery-conversation-adapter-fallback",
      };
    }
  }
}
