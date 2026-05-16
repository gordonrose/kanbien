import type { Pool } from "pg";
import type { OrganizationExportRecord } from "../domain/types";
import type { OrganizationExportRepository } from "./types";

interface ExportRow {
  organization_export_id: string;
  tenant_id: string;
  source_organization_id: string;
  actor_type: OrganizationExportRecord["actorType"];
  actor_id: string;
  auth_principal_id: string | null;
  authority_world: OrganizationExportRecord["authorityWorld"];
  selected_sections: string[];
  visibility_scope: OrganizationExportRecord["visibilityScope"];
  organization_scope: OrganizationExportRecord["organizationScope"];
  status: OrganizationExportRecord["status"];
  job_id: string | null;
  storage_key: string | null;
  pin_secret_encrypted: string | null;
  pin_viewed_at: Date | null;
  download_attempt_count: number;
  notification_status: OrganizationExportRecord["notificationStatus"];
  size_bytes: number | null;
  checksum_sha256: string | null;
  failure_category: string | null;
  generated_at: Date | null;
  expires_at: Date | null;
  cleanup_eligible_at: Date | null;
  cleanup_failure_category: string | null;
  cleanup_attempt_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

function toRecord(row: ExportRow): OrganizationExportRecord {
  return {
    organizationExportId: row.organization_export_id,
    tenantId: row.tenant_id,
    sourceOrganizationId: row.source_organization_id,
    actorType: row.actor_type,
    actorId: row.actor_id,
    authPrincipalId: row.auth_principal_id,
    authorityWorld: row.authority_world,
    selectedSections: row.selected_sections as OrganizationExportRecord["selectedSections"],
    visibilityScope: row.visibility_scope,
    organizationScope: row.organization_scope,
    status: row.status,
    jobId: row.job_id,
    storageKey: row.storage_key,
    pinSecretEncrypted: row.pin_secret_encrypted,
    pinViewedAt: row.pin_viewed_at,
    downloadAttemptCount: row.download_attempt_count,
    notificationStatus: row.notification_status,
    sizeBytes: row.size_bytes,
    checksumSha256: row.checksum_sha256,
    failureCategory: row.failure_category,
    generatedAt: row.generated_at,
    expiresAt: row.expires_at,
    cleanupEligibleAt: row.cleanup_eligible_at,
    cleanupFailureCategory: row.cleanup_failure_category,
    cleanupAttemptCount: row.cleanup_attempt_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function createPostgresOrganizationExportRepository(pool: Pool): OrganizationExportRepository {
  async function findById(tenantId: string, exportId: string) {
    const result = await pool.query<ExportRow>(
      "SELECT * FROM organization_export WHERE tenant_id = $1 AND organization_export_id = $2 LIMIT 1",
      [tenantId, exportId],
    );
    return result.rows[0] ? toRecord(result.rows[0]) : null;
  }

  async function updateStatus(exportId: string, status: string, extra = "") {
    const result = await pool.query<ExportRow>(
      `
        UPDATE organization_export
        SET status = $2,
            updated_at = NOW()
            ${extra}
        WHERE organization_export_id = $1
        RETURNING *
      `,
      [exportId, status],
    );
    return result.rows[0] ? toRecord(result.rows[0]) : null;
  }

  return {
    async create(input) {
      const result = await pool.query<ExportRow>(
        `
          INSERT INTO organization_export (
            organization_export_id, tenant_id, source_organization_id, actor_type, actor_id,
            auth_principal_id, authority_world, selected_sections, visibility_scope,
            organization_scope, status, notification_status, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'queued', 'pending', NOW(), NOW())
          RETURNING *
        `,
        [
          input.organizationExportId,
          input.tenantId,
          input.sourceOrganizationId,
          input.actorType,
          input.actorId,
          input.authPrincipalId ?? null,
          input.actorType === "root-user" ? "root" : "tenant",
          input.selectedSections,
          input.visibilityScope,
          input.organizationScope,
        ],
      );
      return toRecord(result.rows[0]);
    },
    async list(input) {
      const values: unknown[] = [input.tenantId, input.actorId];
      const statusFilter = input.status
        ? (() => {
            values.push(input.status);
            return `AND status = $${values.length}`;
          })()
        : "";
      const total = await pool.query<{ total: string }>(
        `
          SELECT COUNT(*) AS total
          FROM organization_export
          WHERE tenant_id = $1 AND actor_id = $2 AND deleted_at IS NULL ${statusFilter}
        `,
        values,
      );
      values.push(input.pageSize, (input.page - 1) * input.pageSize);
      const rows = await pool.query<ExportRow>(
        `
          SELECT *
          FROM organization_export
          WHERE tenant_id = $1 AND actor_id = $2 AND deleted_at IS NULL ${statusFilter}
          ORDER BY created_at DESC, organization_export_id ASC
          LIMIT $${values.length - 1} OFFSET $${values.length}
        `,
        values,
      );
      return { items: rows.rows.map(toRecord), totalMatchingRecords: Number(total.rows[0]?.total ?? 0) };
    },
    findById,
    async listCleanupEligible(input) {
      const result = await pool.query<ExportRow>(
        `
          SELECT *
          FROM organization_export
          WHERE cleanup_eligible_at IS NOT NULL
            AND cleanup_eligible_at <= $1
            AND storage_key IS NOT NULL
            AND status IN ('expired', 'deleted', 'cleanup_failed')
          ORDER BY cleanup_eligible_at ASC, created_at ASC
          LIMIT $2
        `,
        [input.now, input.limit],
      );
      return result.rows.map(toRecord);
    },
    async listRunningOlderThan(input) {
      const result = await pool.query<ExportRow>(
        `
          SELECT *
          FROM organization_export
          WHERE status = 'running'
            AND updated_at <= $1
          ORDER BY updated_at ASC, created_at ASC
          LIMIT $2
        `,
        [input.olderThan, input.limit],
      );
      return result.rows.map(toRecord);
    },
    async updateJobId(exportId, jobId) {
      await pool.query("UPDATE organization_export SET job_id = $2, updated_at = NOW() WHERE organization_export_id = $1", [exportId, jobId]);
    },
    async markRunning(exportId, jobId) {
      const result = await pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET status = 'running',
              job_id = COALESCE($2, job_id),
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [exportId, jobId],
      );
      return result.rows[0] ? toRecord(result.rows[0]) : null;
    },
    async markReady(input) {
      const result = await pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET status = 'ready',
              storage_key = $2,
              pin_secret_encrypted = $3,
              size_bytes = $4,
              checksum_sha256 = $5,
              generated_at = $6,
              expires_at = $7,
              notification_status = 'pending',
              failure_category = NULL,
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [
          input.exportId,
          input.storageKey,
          input.pinSecretEncrypted,
          input.sizeBytes,
          input.checksumSha256,
          input.generatedAt,
          input.expiresAt,
        ],
      );
      return result.rows[0] ? toRecord(result.rows[0]) : null;
    },
    markFailed: (exportId, failureCategory) =>
      pool.query<ExportRow>(
        "UPDATE organization_export SET status = 'failed', failure_category = $2, notification_status = 'pending', updated_at = NOW() WHERE organization_export_id = $1 RETURNING *",
        [exportId, failureCategory],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    markCancelRequested: (exportId) => updateStatus(exportId, "cancel_requested"),
    markCancelled: (exportId) => updateStatus(exportId, "cancelled"),
    markRetrying: (input) =>
      pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET status = 'retrying',
              selected_sections = $2,
              visibility_scope = $3,
              organization_scope = $4,
              failure_category = NULL,
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [input.exportId, input.selectedSections, input.visibilityScope, input.organizationScope],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    markDeleted: (exportId) =>
      updateStatus(exportId, "deleted", ", deleted_at = NOW(), cleanup_eligible_at = NOW()"),
    markExpired: (exportId) =>
      updateStatus(exportId, "expired", ", cleanup_eligible_at = NOW()"),
    markCleanupFailed: (exportId, failureCategory) =>
      pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET status = 'cleanup_failed',
              cleanup_failure_category = $2,
              cleanup_attempt_count = cleanup_attempt_count + 1,
              cleanup_eligible_at = NOW(),
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [exportId, failureCategory],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    markCleanupRetry: (input) =>
      pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET status = 'cleanup_failed',
              cleanup_failure_category = $2,
              cleanup_attempt_count = cleanup_attempt_count + 1,
              cleanup_eligible_at = $3,
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [input.exportId, input.failureCategory, input.nextEligibleAt],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    markCleanupOperatorReview: (exportId, failureCategory) =>
      pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET status = 'cleanup_failed',
              cleanup_failure_category = $2,
              cleanup_attempt_count = cleanup_attempt_count + 1,
              cleanup_eligible_at = NULL,
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [exportId, failureCategory],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    markCleanupComplete: (exportId) =>
      pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET storage_key = NULL,
              pin_secret_encrypted = NULL,
              cleanup_failure_category = NULL,
              cleanup_eligible_at = NULL,
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [exportId],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    markNotificationStatus: (exportId, status) =>
      pool.query<ExportRow>(
        `
          UPDATE organization_export
          SET notification_status = $2,
              updated_at = NOW()
          WHERE organization_export_id = $1
          RETURNING *
        `,
        [exportId, status],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    recordPinViewed: (exportId) =>
      pool.query<ExportRow>(
        "UPDATE organization_export SET pin_viewed_at = NOW(), updated_at = NOW() WHERE organization_export_id = $1 RETURNING *",
        [exportId],
      ).then((result) => result.rows[0] ? toRecord(result.rows[0]) : null),
    async incrementDownloadCount(exportId) {
      await pool.query(
        "UPDATE organization_export SET download_attempt_count = download_attempt_count + 1, updated_at = NOW() WHERE organization_export_id = $1",
        [exportId],
      );
    },
    async recordAttempt(input) {
      await pool.query(
        `
          INSERT INTO organization_export_attempt (
            organization_export_attempt_id, organization_export_id, job_id, status,
            failure_category, failure_summary, started_at, finished_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), CASE WHEN $4 = 'running' THEN NULL ELSE NOW() END)
        `,
        [
          input.attemptId,
          input.organizationExportId,
          input.jobId,
          input.status,
          input.failureCategory ?? null,
          input.failureSummary ?? null,
        ],
      );
    },
    async recordAuditEvent(input) {
      await pool.query(
        `
          INSERT INTO organization_export_audit_event (
            organization_export_audit_event_id, organization_export_id, tenant_id, actor_type,
            actor_id, event_type, event_outcome, event_details, occurred_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          input.eventId,
          input.organizationExportId,
          input.tenantId,
          input.actorType,
          input.actorId,
          input.eventType,
          input.eventOutcome,
          JSON.stringify(input.eventDetails),
          input.occurredAt,
        ],
      );
    },
  };
}
