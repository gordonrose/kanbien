export type OutboundChannel = "email";
export type OutboundEmailStatus = "pending" | "sent" | "failed";
export type OutboundEmailAttemptStatus = "sent" | "failed";
export type CountValue = number | "10000+";

export interface OutboundEmailLatestAttemptResponse {
  attemptId: string;
  contentSnapshotId: string;
  contentVersionNumber: number;
  attemptNumber: number;
  status: OutboundEmailAttemptStatus;
  providerMessageId: string | null;
  providerResponseCode: string | null;
  providerErrorSummary: string | null;
  attemptedAt: string;
  resendReason: string | null;
}

export interface OutboundEmailSummaryResponse {
  emailId: string;
  channel: OutboundChannel;
  notificationType: string;
  templateKey: string | null;
  tenantId: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  recipientEmail: string;
  subject: string;
  status: OutboundEmailStatus;
  provider: string;
  createdByActorType: string;
  createdByActorId: string;
  requestedAt: string;
  sentAt: string | null;
  lastAttemptAt: string | null;
  latestAttemptStatus: OutboundEmailAttemptStatus | null;
  attemptCount: number;
  latestAttempt: OutboundEmailLatestAttemptResponse | null;
}

export interface OutboundEmailContentVersionResponse {
  contentSnapshotId: string;
  contentVersionNumber: number;
  subject: string;
  bodyText: string;
  containsRedactedVerificationLink: boolean;
  containsRedactedResetLink: boolean;
  createdAt: string;
}

export interface OutboundEmailAttemptResponse extends OutboundEmailLatestAttemptResponse {
  resentByActorType: string | null;
  resentByActorId: string | null;
}

export interface OutboundEmailResponse extends OutboundEmailSummaryResponse {
  contentVersions: OutboundEmailContentVersionResponse[];
  attempts: OutboundEmailAttemptResponse[];
}

export interface PaginatedOutboundEmailsResponse {
  items: OutboundEmailSummaryResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}
