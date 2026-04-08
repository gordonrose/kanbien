import type { Pool } from "pg";
import type {
  ListOutboundEmailsInput,
  OutboundEmailAttemptData,
  OutboundEmailContentVersionData,
  OutboundEmailData,
  OutboundEmailDetailsData,
} from "../domain/types";
import type { NotificationDeliveryRepository } from "./repository";
import type {
  CreateContentSnapshotInput,
  CreateLogicalEmailInput,
  OutboundEmailAttemptRecord,
  OutboundEmailContentRecord,
  OutboundEmailRecord,
  OutboundEmailRepositoryListResult,
  RecordAttemptInput,
  RecentDuplicateLookup,
} from "./types";

const ORDER_BY_MAP: Record<ListOutboundEmailsInput["orderBy"], string> = {
  requestedAt: "e.requested_at",
  sentAt: "e.sent_at",
  subject: "e.subject",
  recipientEmail: "e.recipient_email",
  status: "e.status",
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function toEmailData(
  record: OutboundEmailRecord & {
    attempt_count?: string | number;
    latest_attempt_status?: OutboundEmailData["latestAttemptStatus"];
  },
): OutboundEmailData {
  return {
    emailId: record.email_id,
    channel: record.channel,
    notificationType: record.notification_type,
    templateKey: record.template_key,
    tenantId: record.tenant_id,
    relatedEntityType: record.related_entity_type,
    relatedEntityId: record.related_entity_id,
    recipientEmail: record.recipient_email,
    subject: record.subject,
    status: record.status,
    provider: record.provider,
    createdByActorType: record.created_by_actor_type,
    createdByActorId: record.created_by_actor_id,
    requestedAt: record.requested_at,
    sentAt: record.sent_at,
    lastAttemptAt: record.last_attempt_at,
    latestAttemptStatus: record.latest_attempt_status ?? null,
    attemptCount: Number(record.attempt_count ?? 0),
  };
}

function toContent(record: OutboundEmailContentRecord): OutboundEmailContentVersionData {
  return {
    contentSnapshotId: record.content_snapshot_id,
    emailId: record.email_id,
    contentVersionNumber: record.content_version_number,
    subject: record.subject,
    bodyText: record.body_text,
    containsRedactedVerificationLink: record.contains_redacted_verification_link,
    containsRedactedResetLink: record.contains_redacted_reset_link,
    createdAt: record.created_at,
  };
}

function toAttempt(record: OutboundEmailAttemptRecord): OutboundEmailAttemptData {
  return {
    attemptId: record.attempt_id,
    emailId: record.email_id,
    contentSnapshotId: record.content_snapshot_id,
    contentVersionNumber: record.content_version_number,
    attemptNumber: record.attempt_number,
    status: record.status,
    providerMessageId: record.provider_message_id,
    providerResponseCode: record.provider_response_code,
    providerErrorSummary: record.provider_error_summary,
    attemptedAt: record.attempted_at,
    resentByActorType: record.resent_by_actor_type,
    resentByActorId: record.resent_by_actor_id,
    resendReason: record.resend_reason,
  };
}

function buildFilters(input: ListOutboundEmailsInput, values: unknown[]): string[] {
  const clauses: string[] = [];
  const { filters } = input;

  if (filters.tenantId) {
    values.push(filters.tenantId);
    clauses.push(`e.tenant_id = $${values.length}`);
  }
  if (filters.notificationType) {
    values.push(normalizeText(filters.notificationType));
    clauses.push(`LOWER(e.notification_type) = $${values.length}`);
  }
  if (filters.recipientEmail) {
    values.push(`${normalizeText(filters.recipientEmail)}%`);
    clauses.push(`e.normalized_recipient_email LIKE $${values.length}`);
  }
  if (filters.relatedEntityType) {
    values.push(normalizeText(filters.relatedEntityType));
    clauses.push(`LOWER(e.related_entity_type) = $${values.length}`);
  }
  if (filters.relatedEntityId) {
    values.push(filters.relatedEntityId);
    clauses.push(`e.related_entity_id = $${values.length}`);
  }
  if (filters.subject) {
    values.push(`${normalizeText(filters.subject)}%`);
    clauses.push(`e.normalized_subject LIKE $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    clauses.push(`e.status = $${values.length}`);
  }
  if (filters.provider) {
    values.push(normalizeText(filters.provider));
    clauses.push(`LOWER(e.provider) = $${values.length}`);
  }
  if (filters.createdByActorType) {
    values.push(normalizeText(filters.createdByActorType));
    clauses.push(`LOWER(e.created_by_actor_type) = $${values.length}`);
  }
  if (filters.createdByActorId) {
    values.push(filters.createdByActorId);
    clauses.push(`e.created_by_actor_id = $${values.length}`);
  }
  if (filters.requestedAtFrom) {
    values.push(filters.requestedAtFrom);
    clauses.push(`e.requested_at >= $${values.length}`);
  }
  if (filters.requestedAtTo) {
    values.push(filters.requestedAtTo);
    clauses.push(`e.requested_at <= $${values.length}`);
  }
  if (filters.sentAtFrom) {
    values.push(filters.sentAtFrom);
    clauses.push(`e.sent_at >= $${values.length}`);
  }
  if (filters.sentAtTo) {
    values.push(filters.sentAtTo);
    clauses.push(`e.sent_at <= $${values.length}`);
  }

  return clauses;
}

export function createPostgresNotificationDeliveryRepository(
  dbPool: Pool,
): NotificationDeliveryRepository {
  async function findAttemptsForEmail(emailId: string): Promise<OutboundEmailAttemptData[]> {
    const result = await dbPool.query<OutboundEmailAttemptRecord>(
      `
        SELECT a.*, c.content_version_number
        FROM outbound_email_attempt a
        JOIN outbound_email_content c
          ON c.content_snapshot_id = a.content_snapshot_id
        WHERE a.email_id = $1
        ORDER BY a.attempt_number ASC
      `,
      [emailId],
    );
    return result.rows.map(toAttempt);
  }

  async function findContentVersionsForEmail(emailId: string): Promise<OutboundEmailContentVersionData[]> {
    const result = await dbPool.query<OutboundEmailContentRecord>(
      `
        SELECT *
        FROM outbound_email_content
        WHERE email_id = $1
        ORDER BY content_version_number ASC
      `,
      [emailId],
    );
    return result.rows.map(toContent);
  }

  async function findEmailRecordById(emailId: string): Promise<OutboundEmailData | null> {
    const result = await dbPool.query<
      OutboundEmailRecord & {
        attempt_count: string;
        latest_attempt_status: OutboundEmailData["latestAttemptStatus"];
      }
    >(
      `
        SELECT
          e.*,
          COUNT(a.attempt_id) AS attempt_count,
          MAX(a.status) FILTER (WHERE a.attempt_number = latest.latest_attempt_number) AS latest_attempt_status
        FROM outbound_email e
        LEFT JOIN outbound_email_attempt a
          ON a.email_id = e.email_id
        LEFT JOIN (
          SELECT email_id, MAX(attempt_number) AS latest_attempt_number
          FROM outbound_email_attempt
          GROUP BY email_id
        ) latest
          ON latest.email_id = e.email_id
        WHERE e.email_id = $1
        GROUP BY e.email_id
      `,
      [emailId],
    );

    return result.rows[0] ? toEmailData(result.rows[0]) : null;
  }

  return {
    async findRecentDuplicateRequest(input: RecentDuplicateLookup) {
      const result = await dbPool.query(
        `
          SELECT email_id
          FROM outbound_email
          WHERE normalized_recipient_email = $1
            AND duplicate_guard_fingerprint = $2
            AND requested_at >= $3
          LIMIT 1
        `,
        [input.normalizedRecipientEmail, input.duplicateGuardFingerprint, input.requestedAfter],
      );
      return (result.rowCount ?? 0) > 0;
    },

    async createLogicalEmail(input: CreateLogicalEmailInput) {
      await dbPool.query(
        `
          INSERT INTO outbound_email (
            email_id,
            channel,
            notification_type,
            template_key,
            tenant_id,
            related_entity_type,
            related_entity_id,
            recipient_email,
            normalized_recipient_email,
            subject,
            normalized_subject,
            status,
            provider,
            created_by_actor_type,
            created_by_actor_id,
            requested_at,
            sent_at,
            last_attempt_at,
            last_error_code,
            last_error_summary,
            duplicate_guard_fingerprint
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NULL,NULL,NULL,NULL,$17
          )
        `,
        [
          input.emailId,
          input.channel,
          input.notificationType,
          input.templateKey,
          input.tenantId,
          input.relatedEntityType,
          input.relatedEntityId,
          input.recipientEmail,
          normalizeText(input.recipientEmail),
          input.subject,
          normalizeText(input.subject),
          input.status,
          input.provider,
          input.createdByActorType,
          input.createdByActorId,
          input.requestedAt,
          input.duplicateGuardFingerprint,
        ],
      );
    },

    async createContentSnapshot(input: CreateContentSnapshotInput) {
      const versionResult = await dbPool.query<{ next_version: number }>(
        `
          SELECT COALESCE(MAX(content_version_number), 0) + 1 AS next_version
          FROM outbound_email_content
          WHERE email_id = $1
        `,
        [input.emailId],
      );
      const version = Number(versionResult.rows[0]?.next_version ?? 1);
      const result = await dbPool.query<OutboundEmailContentRecord>(
        `
          INSERT INTO outbound_email_content (
            content_snapshot_id,
            email_id,
            content_version_number,
            subject,
            body_text,
            contains_redacted_verification_link,
            contains_redacted_reset_link,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
          RETURNING *
        `,
        [
          input.contentSnapshotId,
          input.emailId,
          version,
          input.subject,
          input.bodyText,
          input.containsRedactedVerificationLink,
          input.containsRedactedResetLink,
        ],
      );
      return toContent(result.rows[0]);
    },

    async recordAttempt(input: RecordAttemptInput) {
      const attemptNumberResult = await dbPool.query<{ next_attempt: number }>(
        `
          SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt
          FROM outbound_email_attempt
          WHERE email_id = $1
        `,
        [input.emailId],
      );
      const attemptNumber = Number(attemptNumberResult.rows[0]?.next_attempt ?? 1);
      const attemptedAt = new Date();

      await dbPool.query(
        `
          INSERT INTO outbound_email_attempt (
            attempt_id,
            email_id,
            content_snapshot_id,
            attempt_number,
            status,
            provider_message_id,
            provider_response_code,
            provider_error_summary,
            attempted_at,
            resent_by_actor_type,
            resent_by_actor_id,
            resend_reason
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `,
        [
          input.attemptId,
          input.emailId,
          input.contentSnapshotId,
          attemptNumber,
          input.status,
          input.providerMessageId,
          input.providerResponseCode,
          input.providerErrorSummary,
          attemptedAt,
          input.resentByActorType,
          input.resentByActorId,
          input.resendReason,
        ],
      );

      await dbPool.query(
        `
          UPDATE outbound_email
          SET
            status = $2,
            sent_at = CASE WHEN $2 = 'sent' THEN COALESCE(sent_at, $3) ELSE sent_at END,
            last_attempt_at = $3,
            last_error_code = CASE WHEN $2 = 'failed' THEN $4 ELSE NULL END,
            last_error_summary = CASE WHEN $2 = 'failed' THEN $5 ELSE NULL END,
            subject = c.subject,
            normalized_subject = LOWER(c.subject)
          FROM outbound_email_content c
          WHERE outbound_email.email_id = $1
            AND c.content_snapshot_id = $6
        `,
        [
          input.emailId,
          input.status,
          attemptedAt,
          input.providerResponseCode,
          input.providerErrorSummary,
          input.contentSnapshotId,
        ],
      );

      const details = await this.findById(input.emailId);
      if (!details) {
        throw new Error("Expected outbound email to exist after recording attempt.");
      }
      return details;
    },

    async findById(emailId: string) {
      const email = await findEmailRecordById(emailId);
      if (!email) {
        return null;
      }
      const [attempts, contentVersions] = await Promise.all([
        findAttemptsForEmail(emailId),
        findContentVersionsForEmail(emailId),
      ]);
      const latestAttempt = attempts[attempts.length - 1] ?? null;
      return {
        ...email,
        latestAttemptStatus: latestAttempt?.status ?? null,
        attemptCount: attempts.length,
        latestAttempt,
        attempts,
        contentVersions,
      } satisfies OutboundEmailDetailsData;
    },

    async list(input: ListOutboundEmailsInput): Promise<OutboundEmailRepositoryListResult> {
      const values: unknown[] = [];
      const filters = buildFilters(input, values);
      const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
      const totals = await dbPool.query<{ total_searchable_records: string; total_matching_records: string }>(
        `
          SELECT
            (SELECT COUNT(*) FROM outbound_email) AS total_searchable_records,
            (SELECT COUNT(*) FROM outbound_email e ${whereClause}) AS total_matching_records
        `,
        values,
      );

      const orderBy = ORDER_BY_MAP[input.orderBy];
      const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
      values.push(input.pageSize);
      values.push((input.page - 1) * input.pageSize);
      const result = await dbPool.query<
        OutboundEmailRecord & {
          attempt_count: string;
          latest_attempt_status: OutboundEmailData["latestAttemptStatus"];
          latest_attempt_id: string | null;
          latest_content_snapshot_id: string | null;
          latest_content_version_number: number | null;
          latest_attempt_number: number | null;
          latest_provider_message_id: string | null;
          latest_provider_response_code: string | null;
          latest_provider_error_summary: string | null;
          latest_attempted_at: Date | null;
          latest_resend_reason: string | null;
        }
      >(
        `
          WITH latest_attempts AS (
            SELECT DISTINCT ON (a.email_id)
              a.email_id,
              a.attempt_id AS latest_attempt_id,
              a.content_snapshot_id AS latest_content_snapshot_id,
              c.content_version_number AS latest_content_version_number,
              a.attempt_number AS latest_attempt_number,
              a.status AS latest_attempt_status,
              a.provider_message_id AS latest_provider_message_id,
              a.provider_response_code AS latest_provider_response_code,
              a.provider_error_summary AS latest_provider_error_summary,
              a.attempted_at AS latest_attempted_at,
              a.resend_reason AS latest_resend_reason
            FROM outbound_email_attempt a
            JOIN outbound_email_content c
              ON c.content_snapshot_id = a.content_snapshot_id
            ORDER BY a.email_id, a.attempt_number DESC
          )
          SELECT
            e.*,
            COALESCE(attempt_counts.attempt_count, 0) AS attempt_count,
            latest_attempts.latest_attempt_status,
            latest_attempts.latest_attempt_id,
            latest_attempts.latest_content_snapshot_id,
            latest_attempts.latest_content_version_number,
            latest_attempts.latest_attempt_number,
            latest_attempts.latest_provider_message_id,
            latest_attempts.latest_provider_response_code,
            latest_attempts.latest_provider_error_summary,
            latest_attempts.latest_attempted_at,
            latest_attempts.latest_resend_reason
          FROM outbound_email e
          LEFT JOIN (
            SELECT email_id, COUNT(*) AS attempt_count
            FROM outbound_email_attempt
            GROUP BY email_id
          ) attempt_counts
            ON attempt_counts.email_id = e.email_id
          LEFT JOIN latest_attempts
            ON latest_attempts.email_id = e.email_id
          ${whereClause}
          ORDER BY ${orderBy} ${orderDirection}, e.email_id ${orderDirection}
          LIMIT $${values.length - 1}
          OFFSET $${values.length}
        `,
        values,
      );

      return {
        items: result.rows.map((row) => {
          const email = toEmailData(row);
          const latestAttempt =
            row.latest_attempt_id && row.latest_content_snapshot_id && row.latest_attempt_number
              ? {
                  attemptId: row.latest_attempt_id,
                  emailId: row.email_id,
                  contentSnapshotId: row.latest_content_snapshot_id,
                  contentVersionNumber: Number(row.latest_content_version_number),
                  attemptNumber: Number(row.latest_attempt_number),
                  status: row.latest_attempt_status ?? "failed",
                  providerMessageId: row.latest_provider_message_id,
                  providerResponseCode: row.latest_provider_response_code,
                  providerErrorSummary: row.latest_provider_error_summary,
                  attemptedAt: row.latest_attempted_at!,
                  resentByActorType: null,
                  resentByActorId: null,
                  resendReason: row.latest_resend_reason,
                }
              : null;

          return {
            ...email,
            latestAttempt,
          };
        }),
        totalSearchableRecords: Number(totals.rows[0]?.total_searchable_records ?? 0),
        totalMatchingRecords: Number(totals.rows[0]?.total_matching_records ?? 0),
      };
    },
  };
}
