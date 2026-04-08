import type {
  OutboundChannel,
  OutboundEmailAttemptStatus,
  OutboundEmailData,
  OutboundEmailDetailsData,
  OutboundEmailStatus,
} from "../domain/types";

export interface OutboundEmailRecord {
  email_id: string;
  channel: OutboundChannel;
  notification_type: string;
  template_key: string | null;
  tenant_id: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  recipient_email: string;
  normalized_recipient_email: string;
  subject: string;
  normalized_subject: string;
  status: OutboundEmailStatus;
  provider: string;
  created_by_actor_type: string;
  created_by_actor_id: string;
  requested_at: Date;
  sent_at: Date | null;
  last_attempt_at: Date | null;
  last_error_code: string | null;
  last_error_summary: string | null;
  duplicate_guard_fingerprint: string;
}

export interface OutboundEmailContentRecord {
  content_snapshot_id: string;
  email_id: string;
  content_version_number: number;
  subject: string;
  body_text: string;
  contains_redacted_verification_link: boolean;
  contains_redacted_reset_link: boolean;
  created_at: Date;
}

export interface OutboundEmailAttemptRecord {
  attempt_id: string;
  email_id: string;
  content_snapshot_id: string;
  content_version_number: number;
  attempt_number: number;
  status: OutboundEmailAttemptStatus;
  provider_message_id: string | null;
  provider_response_code: string | null;
  provider_error_summary: string | null;
  attempted_at: Date;
  resent_by_actor_type: string | null;
  resent_by_actor_id: string | null;
  resend_reason: string | null;
}

export interface CreateLogicalEmailInput {
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
  duplicateGuardFingerprint: string;
}

export interface CreateContentSnapshotInput {
  contentSnapshotId: string;
  emailId: string;
  subject: string;
  bodyText: string;
  containsRedactedVerificationLink: boolean;
  containsRedactedResetLink: boolean;
}

export interface RecordAttemptInput {
  attemptId: string;
  emailId: string;
  contentSnapshotId: string;
  status: OutboundEmailAttemptStatus;
  providerMessageId: string | null;
  providerResponseCode: string | null;
  providerErrorSummary: string | null;
  resentByActorType: string | null;
  resentByActorId: string | null;
  resendReason: string | null;
}

export interface RecentDuplicateLookup {
  normalizedRecipientEmail: string;
  duplicateGuardFingerprint: string;
  requestedAfter: Date;
}

export interface OutboundEmailRepositoryListResult {
  items: Array<OutboundEmailData & { latestAttempt: OutboundEmailDetailsData["latestAttempt"] }>;
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}
