export type OutboundChannel = "email";
export type OutboundEmailStatus = "pending" | "sent" | "failed";
export type OutboundEmailAttemptStatus = "sent" | "failed";
export type CountValue = number | "10000+";

export interface OutboundEmailData {
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
  requestedAt: Date;
  sentAt: Date | null;
  lastAttemptAt: Date | null;
  latestAttemptStatus: OutboundEmailAttemptStatus | null;
  attemptCount: number;
}

export interface OutboundEmailContentVersionData {
  contentSnapshotId: string;
  emailId: string;
  contentVersionNumber: number;
  subject: string;
  bodyText: string;
  containsRedactedVerificationLink: boolean;
  containsRedactedResetLink: boolean;
  createdAt: Date;
}

export interface OutboundEmailAttemptData {
  attemptId: string;
  emailId: string;
  contentSnapshotId: string;
  contentVersionNumber: number;
  attemptNumber: number;
  status: OutboundEmailAttemptStatus;
  providerMessageId: string | null;
  providerResponseCode: string | null;
  providerErrorSummary: string | null;
  attemptedAt: Date;
  resentByActorType: string | null;
  resentByActorId: string | null;
  resendReason: string | null;
}

export interface OutboundEmailDetailsData extends OutboundEmailData {
  latestAttempt: OutboundEmailAttemptData | null;
  contentVersions: OutboundEmailContentVersionData[];
  attempts: OutboundEmailAttemptData[];
}

export interface SendEmailInput {
  recipientEmail: string;
  subject: string;
  bodyText: string;
  notificationType: string;
  tenantId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  templateKey?: string;
  createdByActorType: string;
  createdByActorId: string;
  redactions?: RedactionRule[];
}

export interface ResendEmailInput {
  emailId: string;
  resentByActorType: string;
  resentByActorId: string;
  resendReason?: string;
  subject?: string;
  bodyText?: string;
  redactions?: RedactionRule[];
}

export interface GetOutboundEmailInput {
  emailId: string;
}

export interface OutboundEmailListFilters {
  tenantId?: string;
  notificationType?: string;
  recipientEmail?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  subject?: string;
  status?: OutboundEmailStatus;
  provider?: string;
  createdByActorType?: string;
  createdByActorId?: string;
  requestedAtFrom?: string;
  requestedAtTo?: string;
  sentAtFrom?: string;
  sentAtTo?: string;
}

export interface ListOutboundEmailsInput {
  page: number;
  pageSize: number;
  orderBy: "requestedAt" | "sentAt" | "subject" | "recipientEmail" | "status";
  orderDirection: "asc" | "desc";
  filters: OutboundEmailListFilters;
}

export interface OutboundEmailListResult {
  items: OutboundEmailData[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface SanitizedContent {
  subject: string;
  bodyText: string;
  containsRedactedVerificationLink: boolean;
  containsRedactedResetLink: boolean;
}

export interface RedactionRule {
  rawValue: string;
  placeholder: "[VERIFICATION LINK]" | "[RESET LINK]";
}
