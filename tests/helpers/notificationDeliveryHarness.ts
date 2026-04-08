import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createNotificationDeliveryService } from "../../src/features/notificationDelivery/domain/service";
import type {
  GetOutboundEmailInput,
  ListOutboundEmailsInput,
  OutboundEmailAttemptData,
  OutboundEmailContentVersionData,
  OutboundEmailData,
  OutboundEmailDetailsData,
} from "../../src/features/notificationDelivery/domain/types";
import type {
  NotificationEmailProvider,
  ProviderSendResult,
  SendProviderEmailInput,
} from "../../src/features/notificationDelivery/domain/provider";
import type { NotificationDeliveryRepository } from "../../src/features/notificationDelivery/persistence/repository";
import { createNotificationDeliveryRouter } from "../../src/features/notificationDelivery/transport/router";
import type {
  CreateContentSnapshotInput,
  CreateLogicalEmailInput,
  OutboundEmailRepositoryListResult,
  RecordAttemptInput,
  RecentDuplicateLookup,
} from "../../src/features/notificationDelivery/persistence/types";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function matchesRange(value: Date | null, from?: string, to?: string): boolean {
  if (from && (!value || value.getTime() < new Date(from).getTime())) {
    return false;
  }
  if (to && (!value || value.getTime() > new Date(to).getTime())) {
    return false;
  }
  return true;
}

function matchesListFilters(email: OutboundEmailDetailsData, input: ListOutboundEmailsInput): boolean {
  const { filters } = input;
  if (filters.tenantId && email.tenantId !== filters.tenantId) {
    return false;
  }
  if (filters.notificationType && normalizeText(email.notificationType) !== normalizeText(filters.notificationType)) {
    return false;
  }
  if (filters.recipientEmail && !normalizeText(email.recipientEmail).startsWith(normalizeText(filters.recipientEmail))) {
    return false;
  }
  if (filters.relatedEntityType && normalizeText(email.relatedEntityType ?? "") !== normalizeText(filters.relatedEntityType)) {
    return false;
  }
  if (filters.relatedEntityId && email.relatedEntityId !== filters.relatedEntityId) {
    return false;
  }
  if (filters.subject && !normalizeText(email.subject).startsWith(normalizeText(filters.subject))) {
    return false;
  }
  if (filters.status && email.status !== filters.status) {
    return false;
  }
  if (filters.provider && normalizeText(email.provider) !== normalizeText(filters.provider)) {
    return false;
  }
  if (filters.createdByActorType && normalizeText(email.createdByActorType) !== normalizeText(filters.createdByActorType)) {
    return false;
  }
  if (filters.createdByActorId && email.createdByActorId !== filters.createdByActorId) {
    return false;
  }
  if (!matchesRange(email.requestedAt, filters.requestedAtFrom, filters.requestedAtTo)) {
    return false;
  }
  if (!matchesRange(email.sentAt, filters.sentAtFrom, filters.sentAtTo)) {
    return false;
  }
  return true;
}

function compareEmails(
  left: OutboundEmailDetailsData,
  right: OutboundEmailDetailsData,
  orderBy: ListOutboundEmailsInput["orderBy"],
  direction: ListOutboundEmailsInput["orderDirection"],
): number {
  const factor = direction === "asc" ? 1 : -1;
  const valueFor = (email: OutboundEmailDetailsData) => {
    switch (orderBy) {
      case "sentAt":
        return email.sentAt?.getTime() ?? Number.NEGATIVE_INFINITY;
      case "subject":
        return email.subject;
      case "recipientEmail":
        return email.recipientEmail;
      case "status":
        return email.status;
      case "requestedAt":
      default:
        return email.requestedAt.getTime();
    }
  };

  const leftValue = valueFor(left);
  const rightValue = valueFor(right);
  if (leftValue < rightValue) {
    return -1 * factor;
  }
  if (leftValue > rightValue) {
    return 1 * factor;
  }
  return left.emailId.localeCompare(right.emailId) * factor;
}

export class FakeNotificationEmailProvider implements NotificationEmailProvider {
  public readonly providerName: string;
  public readonly sentInputs: SendProviderEmailInput[] = [];
  private readonly queuedResults: ProviderSendResult[] = [];

  constructor(providerName = "fake-provider") {
    this.providerName = providerName;
  }

  queueResult(result: ProviderSendResult) {
    this.queuedResults.push(result);
  }

  async send(input: SendProviderEmailInput): Promise<ProviderSendResult> {
    this.sentInputs.push(input);
    return (
      this.queuedResults.shift() ?? {
        success: true,
        providerMessageId: `msg-${this.sentInputs.length}`,
        providerResponseCode: "202",
      }
    );
  }
}

export function createInMemoryNotificationDeliveryRepository(
  seed: OutboundEmailDetailsData[] = [],
): NotificationDeliveryRepository & { records: Map<string, OutboundEmailDetailsData> } {
  const records = new Map(seed.map((record) => [record.emailId, record]));

  function clone(record: OutboundEmailDetailsData): OutboundEmailDetailsData {
    return {
      ...record,
      requestedAt: new Date(record.requestedAt),
      sentAt: record.sentAt ? new Date(record.sentAt) : null,
      lastAttemptAt: record.lastAttemptAt ? new Date(record.lastAttemptAt) : null,
      latestAttempt: record.latestAttempt
        ? {
            ...record.latestAttempt,
            attemptedAt: new Date(record.latestAttempt.attemptedAt),
          }
        : null,
      attempts: record.attempts.map((attempt) => ({
        ...attempt,
        attemptedAt: new Date(attempt.attemptedAt),
      })),
      contentVersions: record.contentVersions.map((content) => ({
        ...content,
        createdAt: new Date(content.createdAt),
      })),
    };
  }

  return {
    records,
    async findRecentDuplicateRequest(input: RecentDuplicateLookup) {
      return [...records.values()].some(
        (record) =>
          normalizeText(record.recipientEmail) === input.normalizedRecipientEmail &&
          (record as OutboundEmailDetailsData & { duplicateGuardFingerprint?: string }).duplicateGuardFingerprint ===
            input.duplicateGuardFingerprint &&
          record.requestedAt.getTime() >= input.requestedAfter.getTime(),
      );
    },
    async createLogicalEmail(input: CreateLogicalEmailInput) {
      records.set(input.emailId, {
        emailId: input.emailId,
        channel: input.channel,
        notificationType: input.notificationType,
        templateKey: input.templateKey,
        tenantId: input.tenantId,
        relatedEntityType: input.relatedEntityType,
        relatedEntityId: input.relatedEntityId,
        recipientEmail: input.recipientEmail,
        subject: input.subject,
        status: input.status,
        provider: input.provider,
        createdByActorType: input.createdByActorType,
        createdByActorId: input.createdByActorId,
        requestedAt: input.requestedAt,
        sentAt: null,
        lastAttemptAt: null,
        latestAttemptStatus: null,
        attemptCount: 0,
        latestAttempt: null,
        attempts: [],
        contentVersions: [],
        duplicateGuardFingerprint: input.duplicateGuardFingerprint,
      } as OutboundEmailDetailsData & { duplicateGuardFingerprint: string });
    },
    async createContentSnapshot(input: CreateContentSnapshotInput) {
      const record = records.get(input.emailId)!;
      const content: OutboundEmailContentVersionData = {
        contentSnapshotId: input.contentSnapshotId,
        emailId: input.emailId,
        contentVersionNumber: record.contentVersions.length + 1,
        subject: input.subject,
        bodyText: input.bodyText,
        containsRedactedVerificationLink: input.containsRedactedVerificationLink,
        containsRedactedResetLink: input.containsRedactedResetLink,
        createdAt: new Date(),
      };
      record.contentVersions.push(content);
      return { ...content };
    },
    async recordAttempt(input: RecordAttemptInput) {
      const record = records.get(input.emailId)!;
      const content = record.contentVersions.find(
        (item) => item.contentSnapshotId === input.contentSnapshotId,
      )!;
      const attemptedAt = new Date();
      const attempt: OutboundEmailAttemptData = {
        attemptId: input.attemptId,
        emailId: input.emailId,
        contentSnapshotId: input.contentSnapshotId,
        contentVersionNumber: content.contentVersionNumber,
        attemptNumber: record.attempts.length + 1,
        status: input.status,
        providerMessageId: input.providerMessageId,
        providerResponseCode: input.providerResponseCode,
        providerErrorSummary: input.providerErrorSummary,
        attemptedAt,
        resentByActorType: input.resentByActorType,
        resentByActorId: input.resentByActorId,
        resendReason: input.resendReason,
      };
      record.attempts.push(attempt);
      record.latestAttempt = attempt;
      record.latestAttemptStatus = attempt.status;
      record.attemptCount = record.attempts.length;
      record.lastAttemptAt = attemptedAt;
      record.subject = content.subject;
      if (attempt.status === "sent") {
        record.status = "sent";
        record.sentAt ??= attemptedAt;
      } else {
        record.status = "failed";
      }
      return clone(record);
    },
    async findById(emailId: string) {
      const record = records.get(emailId);
      return record ? clone(record) : null;
    },
    async list(input: ListOutboundEmailsInput): Promise<OutboundEmailRepositoryListResult> {
      const searchable = [...records.values()];
      const matching = searchable.filter((item) => matchesListFilters(item, input));
      const sorted = [...matching].sort((left, right) =>
        compareEmails(left, right, input.orderBy, input.orderDirection),
      );
      const start = (input.page - 1) * input.pageSize;
      return {
        items: sorted.slice(start, start + input.pageSize).map((item) => ({
          ...clone(item),
          latestAttempt: item.latestAttempt ? { ...item.latestAttempt } : null,
        })),
        totalSearchableRecords: searchable.length,
        totalMatchingRecords: matching.length,
      };
    },
  };
}

export function mountNotificationDeliveryFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  options?: {
    repository?: NotificationDeliveryRepository;
    provider?: NotificationEmailProvider;
  },
) {
  const repository =
    options?.repository ?? createInMemoryNotificationDeliveryRepository();
  const provider = options?.provider ?? new FakeNotificationEmailProvider();
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession
        ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}`
        : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };

  app.use(
    "/v1/notification-delivery",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createNotificationDeliveryRouter(
      createNotificationDeliveryService(repository, provider),
      capabilityChecker,
      harness.platformSecurityRepository,
    ),
  );

  return { repository, provider };
}
