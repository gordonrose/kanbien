import { randomUUID } from "node:crypto";
import {
  createProductDiscoveryPacketData,
  renderProductDiscoveryPacketMarkdown,
} from "../../../lib/productDiscovery/packetAdapter";
import { renderProductDiscoveryPacketPdf } from "../../../lib/productDiscovery/pdfRenderer";
import {
  createDefaultProductDiscoveryConversationAdapter,
  ProductDiscoveryConversationGuardrailError,
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

function messageBody(message: HarnessChatMessageData | undefined): string {
  return String(message?.body ?? "").trim();
}

function latestUserMessage(messages: HarnessChatMessageData[]): HarnessChatMessageData | undefined {
  return [...messages].reverse().find((message) => message.role === "user");
}

function latestAssistantMessage(messages: HarnessChatMessageData[]): HarnessChatMessageData | undefined {
  return [...messages].reverse().find((message) => message.role === "assistant");
}

function isReadyForPacketConfirmationPending(messages: HarnessChatMessageData[]): boolean {
  const assistant = latestAssistantMessage(messages);
  return assistant?.metadata?.readyForPacket === true && assistant.metadata.nextStep === "ready_for_packet";
}

function isPacketGenerationConfirmation(message: string): boolean {
  const normalized = message.trim().toLowerCase().replace(/[.!?]+$/g, "");
  if (!normalized) {
    return false;
  }

  return [
    "no",
    "nope",
    "no thanks",
    "no thank you",
    "no follow up",
    "no follow ups",
    "no follow-up",
    "no follow-ups",
    "nothing else",
    "that's all",
    "that is all",
    "all good",
    "produce the packet",
    "generate the packet",
    "create the packet",
    "make the packet",
    "download the packet",
    "yes produce the packet",
    "yes generate the packet",
    "yes create the packet",
    "go ahead",
  ].includes(normalized);
}

function stringArrayMetadata(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function numberMetadata(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export interface HarnessChatLlmUsageGuardrailConfig {
  enabled: boolean;
  provider: string;
  model: string;
  dailyRequestLimit: number;
  monthlyRequestLimit: number;
}

export function createDefaultHarnessChatLlmUsageGuardrailConfig(): HarnessChatLlmUsageGuardrailConfig {
  return {
    enabled: Boolean(process.env.OPENAI_API_KEY?.trim()) && parseBooleanEnv(process.env.OPENAI_ENABLED, true),
    provider: "openai",
    model: process.env.OPENAI_MODEL?.trim() || "gpt-5.2",
    dailyRequestLimit: parsePositiveIntegerEnv(process.env.OPENAI_DAILY_REQUEST_LIMIT) ?? 20,
    monthlyRequestLimit: parsePositiveIntegerEnv(process.env.OPENAI_MONTHLY_REQUEST_LIMIT) ?? 300,
  };
}

export function createHarnessChatService(
  repository: HarnessChatRepository,
  conversationAdapter: ProductDiscoveryConversationAdapter = createDefaultProductDiscoveryConversationAdapter(),
  llmUsageGuardrailConfig: HarnessChatLlmUsageGuardrailConfig = createDefaultHarnessChatLlmUsageGuardrailConfig(),
) {
  function summarizeConversation(
    conversation: HarnessChatConversationData,
    messages: HarnessChatMessageData[] = [],
    latestPacket?: HarnessChatPacketRevisionData | null,
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
      latestPacketState: latestPacket?.state ?? (conversation.state === "packet-ready" ? "generated" : null),
      title: conversation.compactTranscriptSummary || conversationTitle(messages),
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
        filtered.slice(start, start + input.pageSize).map(async (conversation) => {
          const [messages, packet] = await Promise.all([
            repository.listMessages(conversation.conversationId),
            conversation.latestPacketRevisionId ? repository.findCurrentPacketRevision(conversation.conversationId) : Promise.resolve(null),
          ]);
          return summarizeConversation(conversation, messages, packet);
        }),
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
      const packet = conversation.latestPacketRevisionId ? await repository.findCurrentPacketRevision(input.conversationId) : null;
      return {
        ...summarizeConversation(conversation, messages, packet),
        messages: messages.map((message) => ({
          messageId: message.messageId,
          role: message.role,
          body: message.body,
          metadata: message.metadata,
          createdAt: message.createdAt.toISOString(),
        })),
        surfaceContext: conversation.surfaceContext,
        structuredDiscoveryState: conversation.structuredDiscoveryState,
      };
    },

    async updateConversation(input: {
      conversationId: string;
      title?: string | null;
      state?: "active" | "closed";
    }) {
      const conversation = await repository.updateConversation({
        conversationId: input.conversationId,
        state: input.state,
        compactTranscriptSummary: input.title ?? undefined,
      });
      if (!conversation) {
        throw new HarnessChatNotFoundError();
      }
      return this.readConversation({ conversationId: conversation.conversationId, includeMessages: true });
    },

    async editMessage(input: { conversationId: string; messageId: string; rootUserId: string; message: string }) {
      const updated = await repository.updateUserMessageAndDeleteDownstream({
        conversationId: input.conversationId,
        messageId: input.messageId,
        rootUserId: input.rootUserId,
        body: input.message,
        metadata: {
          edited: true,
          editedAt: new Date().toISOString(),
          rewriteDownstream: true,
        },
      });
      if (!updated) {
        throw new HarnessChatNotFoundError();
      }
      const assistantMessage = await appendAssistantTurn(input.conversationId);
      return {
        userMessage: updated,
        assistantMessage,
        conversation: await this.readConversation({ conversationId: input.conversationId, includeMessages: true }),
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

      const messagesAfterUserReply = await repository.listMessages(input.conversationId);
      if (
        isReadyForPacketConfirmationPending(messagesAfterUserReply) &&
        isPacketGenerationConfirmation(input.message)
      ) {
        const packet = await createPacketRevision(input.conversationId, input.rootUserId);
        const assistantMessage = await repository.appendMessage({
          messageId: randomUUID(),
          conversationId: input.conversationId,
          role: "assistant",
          body: "Product Discovery packet is ready to download.",
          acceptedByHarness: true,
          metadata: {
            source: "product-discovery-packet-confirmation",
            packetRevisionId: packet.packetRevisionId,
            readyForPacket: true,
            nextStep: "ready_for_packet",
          },
        });
        return {
          userMessage,
          assistantMessage,
          packet: summarizePacket(packet),
          conversation: await this.readConversation({ conversationId: input.conversationId, includeMessages: true }),
        };
      }

      const assistantMessage = await appendAssistantTurn(input.conversationId);
      return {
        userMessage,
        assistantMessage,
        conversation: await this.readConversation({ conversationId: input.conversationId, includeMessages: true }),
      };
    },

    async generatePacket(input: { conversationId: string; rootUserId: string }) {
      const conversation = await getConversationOrThrow(input.conversationId);
      const packet = await createPacketRevision(input.conversationId, input.rootUserId);
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
      const markdown = renderProductDiscoveryPacketMarkdown(packet.packetData as Parameters<typeof renderProductDiscoveryPacketMarkdown>[0]);
      const pdf = await renderProductDiscoveryPacketPdf(markdown);
      await repository.markPacketDownloaded(packetRevisionId);
      await repository.recordPdfAttempt({
        pdfAttemptId: randomUUID(),
        packetRevisionId,
        requestedByRootUserId: rootUserId,
        state: "succeeded",
        sourceDataSizeBytes: Buffer.byteLength(JSON.stringify(packet.packetData), "utf8"),
        outputSizeBytes: pdf.length,
        completedAt: new Date(),
      });
      return pdf;
    },
  };

  async function createPacketRevision(conversationId: string, rootUserId: string) {
    const messages = await repository.listMessages(conversationId);
    const readyMessage = latestAssistantMessage(messages);
    const readyMetadata = readyMessage?.metadata ?? {};
    const firstUserMessage = messages.find((message) => message.role === "user");
    const latestUser = latestUserMessage(messages);
    const summary = typeof readyMetadata.summary === "string" && readyMetadata.summary.trim()
      ? readyMetadata.summary
      : "Root-admin Build chat discovery request.";
    const assumptions = stringArrayMetadata(readyMetadata.assumptions);
    const packagedTechnicalQuestions = stringArrayMetadata(readyMetadata.packagedTechnicalQuestions);
    const confidencePercent = Math.max(95, numberMetadata(readyMetadata.confidencePercent, 95));
    const packetData = createProductDiscoveryPacketData({
      title: conversationTitle(messages),
      originalRequest: messageBody(firstUserMessage) || "Product Discovery request",
      plainLanguageRequestSummary: summary,
      packetDate: new Date().toISOString().slice(0, 10),
      ownerRequester: rootUserId,
      initialUnderstanding: summary,
      interviewTurns: [{
        question: "What should the normal successful version do?",
        answer: messageBody(latestUser) || messageBody(firstUserMessage) || "The requester confirmed the discovery direction.",
        disposition: "rule",
      }],
      assumptionsConfirmed: assumptions.length > 0 ? assumptions : ["Root-admin context is prompt context only."],
      technicalQuestionsPackaged: packagedTechnicalQuestions.length > 0
        ? packagedTechnicalQuestions
        : ["Technical implementation details should be handled after Product Discovery."],
      confidencePercent,
      problemToSolve: summary,
      businessOutcome: "A Product Discovery packet can be generated from the Build panel conversation.",
      primaryUserOutcome: "Root builders can preserve confirmed discovery work without leaving the app.",
      whyNow: "The Build panel needs a deterministic handoff from conversation to downloadable packet.",
      successSignal: "A packet revision is generated and downloadable by an authorized root builder.",
      nonGoalSummary: "Public packet delivery and broad artifact migration are out of scope for this packet.",
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
        situation: "while shaping a change request",
        motivation: "capture enough discovery detail",
        outcome: "produce a governed Product Discovery packet",
      },
      useCases: [{
        id: "UC-CHAT-L1-001",
        actor: "Root builder",
        statement: "Generate a Product Discovery packet from a confirmed chat.",
        successOutcome: "A packet revision exists and can be downloaded.",
      }],
      capabilityBreakdown: [{
        id: "CAP-CHAT-L1-001",
        capability: "Generate Product Discovery packet",
        rationale: "Preserves confirmed discovery output.",
        downstreamSignal: "packet revision",
      }],
      technicalSteeringHandoff: {
        handoffStatus: "ready-for-technical-steering",
        architectureSignals: ["root-admin", "harness-chat"],
        riskFlags: ["runtime evidence still required"],
        packagedQuestions: packagedTechnicalQuestions.length > 0
          ? packagedTechnicalQuestions
          : ["Confirm implementation details during Technical Steering."],
      },
    });
    return repository.createPacketRevision({
      packetRevisionId: randomUUID(),
      conversationId,
      generatedByRootUserId: rootUserId,
      sourceMessageSequenceMax: messages.length > 0 ? messages[messages.length - 1].sequenceNumber : 0,
      packetData,
    });
  }

  async function appendAssistantTurn(conversationId: string) {
    const conversation = await getConversationOrThrow(conversationId);
    const messages = await repository.listMessages(conversationId);
    const turn = await generateSafeAssistantTurn(conversation, messages);
    return repository.appendMessage({
      messageId: randomUUID(),
      conversationId,
      role: "assistant",
      body: composeVisibleDiscoveryMessage(turn),
      acceptedByHarness: turn.acceptedByHarness,
      metadata: {
        source: turn.source,
        summary: turn.summary,
        nextQuestion: turn.nextQuestion,
        nextStep: turn.nextStep,
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
    const usageAttempt = llmUsageGuardrailConfig.enabled
      ? await repository.reserveLlmUsageAttempt({
        llmUsageAttemptId: randomUUID(),
        conversationId: conversation.conversationId,
        provider: llmUsageGuardrailConfig.provider,
        model: llmUsageGuardrailConfig.model,
        dailyRequestLimit: llmUsageGuardrailConfig.dailyRequestLimit,
        monthlyRequestLimit: llmUsageGuardrailConfig.monthlyRequestLimit,
        inputChars: Buffer.byteLength(JSON.stringify({
          conversationId: conversation.conversationId,
          surfaceContext: conversation.surfaceContext,
          structuredDiscoveryState: conversation.structuredDiscoveryState,
          transcript: messages.map((message) => ({
            role: message.role,
            body: message.body,
            createdAt: message.createdAt.toISOString(),
          })),
        }), "utf8"),
        transcriptMessageCount: messages.length,
      })
      : null;

    if (usageAttempt?.state === "blocked") {
      return {
        assistantMessage:
          "I saved that message, but the discovery assistant is paused by the local usage limit. Your transcript is still safe, and scripted discovery can continue.",
        summary: conversationTitle(messages),
        nextQuestion: "What should the first successful version let the requester do?",
        nextStep: "ask_business_question",
        confidencePercent: 0,
        readyForPacket: false,
        assumptions: [],
        packagedTechnicalQuestions: [`OpenAI usage blocked by ${usageAttempt.safeFailureReason ?? "local guardrail"}.`],
        acceptedByHarness: false,
        source: "product-discovery-conversation-usage-guardrail",
      };
    }

    try {
      const adapterTurn = await conversationAdapter.generateTurn({ conversation, messages });
      if (usageAttempt) {
        await repository.completeLlmUsageAttempt({
          llmUsageAttemptId: usageAttempt.llmUsageAttemptId,
          state: "succeeded",
          outputChars: Buffer.byteLength(adapterTurn.assistantMessage, "utf8"),
        });
      }
      return {
        ...adapterTurn,
        acceptedByHarness: true,
        source: "product-discovery-conversation-adapter",
      };
    } catch (error) {
      if (usageAttempt) {
        await repository.completeLlmUsageAttempt({
          llmUsageAttemptId: usageAttempt.llmUsageAttemptId,
          state: "failed",
          safeFailureReason: error instanceof ProductDiscoveryConversationGuardrailError
            ? "guardrail_error"
            : "provider_error",
          errorCode: error instanceof Error ? error.name : "unknown_error",
        });
      }
      return {
        assistantMessage:
          "I saved that message, but the discovery assistant is temporarily unavailable. Your transcript is still safe, and you can try again shortly.",
        summary: conversationTitle(messages),
        nextQuestion: "What should the first successful version let the requester do?",
        nextStep: "ask_business_question",
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

function parseBooleanEnv(value: string | undefined, fallback: boolean) {
  if (value === undefined || value.trim() === "") {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function parsePositiveIntegerEnv(value: string | undefined) {
  if (value === undefined || value.trim() === "") {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function normalizeDiscoveryText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function composeVisibleDiscoveryMessage(turn: ProductDiscoveryConversationTurn) {
  const assistantMessage = turn.assistantMessage.trim();
  const nextQuestion = turn.nextQuestion.trim();
  if (!nextQuestion || normalizeDiscoveryText(assistantMessage).includes(normalizeDiscoveryText(nextQuestion))) {
    return assistantMessage;
  }

  return `${assistantMessage}\n\n${nextQuestion}`;
}
