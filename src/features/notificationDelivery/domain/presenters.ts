import type {
  CountValue,
  OutboundEmailAttemptData,
  OutboundEmailContentVersionData,
  OutboundEmailData,
  OutboundEmailDetailsData,
  OutboundEmailListResult,
} from "./types";
import type {
  OutboundEmailAttemptResponse,
  OutboundEmailContentVersionResponse,
  OutboundEmailLatestAttemptResponse,
  OutboundEmailResponse,
  OutboundEmailSummaryResponse,
  PaginatedOutboundEmailsResponse,
} from "../contract/types";

function toCountValue(value: number): CountValue {
  return value > 10000 ? "10000+" : value;
}

export function toAttemptSummary(record: OutboundEmailAttemptData): OutboundEmailLatestAttemptResponse {
  return {
    attemptId: record.attemptId,
    contentSnapshotId: record.contentSnapshotId,
    contentVersionNumber: record.contentVersionNumber,
    attemptNumber: record.attemptNumber,
    status: record.status,
    providerMessageId: record.providerMessageId,
    providerResponseCode: record.providerResponseCode,
    providerErrorSummary: record.providerErrorSummary,
    attemptedAt: record.attemptedAt.toISOString(),
    resendReason: record.resendReason,
  };
}

export function toAttempt(record: OutboundEmailAttemptData): OutboundEmailAttemptResponse {
  return {
    ...toAttemptSummary(record),
    resentByActorType: record.resentByActorType,
    resentByActorId: record.resentByActorId,
  };
}

export function toContentVersion(
  record: OutboundEmailContentVersionData,
): OutboundEmailContentVersionResponse {
  return {
    contentSnapshotId: record.contentSnapshotId,
    contentVersionNumber: record.contentVersionNumber,
    subject: record.subject,
    bodyText: record.bodyText,
    containsRedactedVerificationLink: record.containsRedactedVerificationLink,
    containsRedactedResetLink: record.containsRedactedResetLink,
    createdAt: record.createdAt.toISOString(),
  };
}

export function toOutboundEmailSummary(
  record: OutboundEmailData,
  latestAttempt: OutboundEmailAttemptData | null,
): OutboundEmailSummaryResponse {
  return {
    emailId: record.emailId,
    channel: record.channel,
    notificationType: record.notificationType,
    templateKey: record.templateKey,
    tenantId: record.tenantId,
    relatedEntityType: record.relatedEntityType,
    relatedEntityId: record.relatedEntityId,
    recipientEmail: record.recipientEmail,
    subject: record.subject,
    status: record.status,
    provider: record.provider,
    createdByActorType: record.createdByActorType,
    createdByActorId: record.createdByActorId,
    requestedAt: record.requestedAt.toISOString(),
    sentAt: record.sentAt ? record.sentAt.toISOString() : null,
    lastAttemptAt: record.lastAttemptAt ? record.lastAttemptAt.toISOString() : null,
    latestAttemptStatus: record.latestAttemptStatus,
    attemptCount: record.attemptCount,
    latestAttempt: latestAttempt ? toAttemptSummary(latestAttempt) : null,
  };
}

export function toOutboundEmail(record: OutboundEmailDetailsData): OutboundEmailResponse {
  return {
    ...toOutboundEmailSummary(record, record.latestAttempt),
    contentVersions: record.contentVersions.map(toContentVersion),
    attempts: record.attempts.map(toAttempt),
  };
}

export function toOutboundEmailListResult(
  result: OutboundEmailListResult,
  latestAttemptsByEmailId: Map<string, OutboundEmailAttemptData | null>,
): PaginatedOutboundEmailsResponse {
  return {
    items: result.items.map((item) =>
      toOutboundEmailSummary(item, latestAttemptsByEmailId.get(item.emailId) ?? null),
    ),
    page: result.page,
    pageSize: result.pageSize,
    totalPages: Math.ceil(Math.min(Number(result.totalMatchingRecords), 10000) / result.pageSize),
    totalSearchableRecords: toCountValue(Number(result.totalSearchableRecords)),
    totalMatchingRecords: toCountValue(Number(result.totalMatchingRecords)),
  };
}
