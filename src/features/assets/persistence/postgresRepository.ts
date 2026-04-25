import type { Pool } from "pg";
import type {
  Asset,
  AssetActorContext,
  AssetCleanupStatus,
  AssetScope,
  AssetUploadIntent,
  AssetLifecycleStatus,
  AssetPiiPosture,
  AssetProcessingStatus,
  AssetVisibility,
  ChecksumVerificationStatus,
  ContentVerificationStatus,
} from "../domain/types";
import type {
  AssetsRepository,
  CompleteUploadRecordInput,
  CreateUploadIntentRecordInput,
  RejectUploadRecordInput,
} from "./repository";
import type { AssetRecord, AssetUploadIntentRecord } from "./types";

function toIso(value: Date): string {
  return value.toISOString();
}

function toAsset(record: AssetRecord): Asset {
  return {
    assetId: record.asset_id,
    scopeType: record.scope_type,
    tenantId: record.tenant_id,
    kind: record.kind,
    visibility: record.visibility as AssetVisibility,
    originalFilename: record.original_filename,
    storageProvider: record.storage_provider,
    storageKey: record.storage_key,
    claimedContentType: record.claimed_content_type,
    verifiedContentType: record.verified_content_type,
    byteSize: Number(record.byte_size),
    expectedChecksumSha256: record.expected_checksum_sha256,
    observedChecksumSha256: record.observed_checksum_sha256,
    checksumVerificationStatus:
      record.checksum_verification_status as ChecksumVerificationStatus,
    contentVerificationStatus:
      record.content_verification_status as ContentVerificationStatus,
    lifecycleStatus: record.lifecycle_status as AssetLifecycleStatus,
    processingStatus: record.processing_status as AssetProcessingStatus,
    piiPosture: record.pii_posture as AssetPiiPosture,
    cleanupStatus: record.cleanup_status as AssetCleanupStatus,
    cleanupFailureReason: record.cleanup_failure_reason,
    rejectionReason: record.rejection_reason,
    createdByActorType: record.created_by_actor_type,
    createdByActorId: record.created_by_actor_id,
    createdAt: toIso(record.created_at),
    updatedAt: toIso(record.updated_at),
    deletedAt: record.deleted_at ? toIso(record.deleted_at) : null,
  };
}

function toUploadIntent(record: AssetUploadIntentRecord): AssetUploadIntent {
  return {
    uploadIntentId: record.upload_intent_id,
    assetId: record.asset_id,
    status: record.status,
    actorType: record.actor_type,
    actorId: record.actor_id,
    scopeType: record.scope_type,
    tenantId: record.tenant_id,
    storageKey: record.storage_key,
    expectedContentType: record.expected_content_type,
    maxByteSize: Number(record.max_byte_size),
    expectedChecksumSha256: record.expected_checksum_sha256,
    expiresAt: toIso(record.expires_at),
    completedAt: record.completed_at ? toIso(record.completed_at) : null,
  };
}

export function createPostgresAssetsRepository(dbPool: Pool): AssetsRepository {
  async function findAssetById(assetId: string): Promise<Asset | null> {
    const result = await dbPool.query<AssetRecord>(
      `SELECT * FROM assets WHERE asset_id = $1`,
      [assetId],
    );
    return result.rows[0] ? toAsset(result.rows[0]) : null;
  }

  async function findUploadIntentById(uploadIntentId: string): Promise<AssetUploadIntent | null> {
    const result = await dbPool.query<AssetUploadIntentRecord>(
      `SELECT * FROM asset_upload_intents WHERE upload_intent_id = $1`,
      [uploadIntentId],
    );
    return result.rows[0] ? toUploadIntent(result.rows[0]) : null;
  }

  return {
    async countPendingUploadsForActor(actor: AssetActorContext) {
      const result = await dbPool.query<{ count: string }>(
        `
          SELECT COUNT(*)::TEXT AS count
          FROM asset_upload_intents
          WHERE status = 'pending'
            AND actor_type = $1
            AND actor_id = $2
            AND expires_at > NOW()
        `,
        [actor.actorType, actor.actorId],
      );
      return Number(result.rows[0]?.count ?? 0);
    },
    async countPendingUploadsForTenant(tenantId: string) {
      const result = await dbPool.query<{ count: string }>(
        `
          SELECT COUNT(*)::TEXT AS count
          FROM asset_upload_intents
          WHERE status = 'pending'
            AND tenant_id = $1
            AND expires_at > NOW()
        `,
        [tenantId],
      );
      return Number(result.rows[0]?.count ?? 0);
    },
    async sumTenantUploadBytesSince(tenantId: string, since: Date) {
      const result = await dbPool.query<{ total: string | null }>(
        `
          SELECT COALESCE(SUM(a.byte_size), 0)::TEXT AS total
          FROM assets a
          WHERE a.tenant_id = $1
            AND a.created_at >= $2
        `,
        [tenantId, since],
      );
      return Number(result.rows[0]?.total ?? 0);
    },
    async sumTenantStoredReadyBytes(tenantId: string) {
      const result = await dbPool.query<{ total: string | null }>(
        `
          SELECT COALESCE(SUM(byte_size), 0)::TEXT AS total
          FROM assets
          WHERE tenant_id = $1
            AND deleted_at IS NULL
            AND lifecycle_status IN ('pending_upload', 'uploaded', 'ready')
            AND cleanup_status <> 'deleted'
        `,
        [tenantId],
      );
      return Number(result.rows[0]?.total ?? 0);
    },
    async createUploadIntent(input: CreateUploadIntentRecordInput) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const assetResult = await client.query<AssetRecord>(
          `
            INSERT INTO assets (
              asset_id,
              scope_type,
              tenant_id,
              kind,
              visibility,
              original_filename,
              storage_provider,
              storage_key,
              claimed_content_type,
              verified_content_type,
              byte_size,
              expected_checksum_sha256,
              observed_checksum_sha256,
              checksum_verification_status,
              content_verification_status,
              lifecycle_status,
              processing_status,
              pii_posture,
              cleanup_status,
              cleanup_failure_reason,
              cleanup_attempted_at,
              rejection_reason,
              created_by_actor_type,
              created_by_actor_id,
              created_at,
              updated_at,
              deleted_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, $10, $11, NULL,
              $12, 'claimed_only', 'pending_upload', 'not_required', $13,
              'pending', NULL, NULL, NULL, $14, $15, NOW(), NOW(), NULL
            )
            RETURNING *
          `,
          [
            input.assetId,
            input.scope.scopeType,
            input.scope.tenantId ?? null,
            input.kind,
            input.visibility,
            input.originalFilename ?? null,
            input.storageProvider,
            input.storageKey,
            input.contentType,
            input.byteSize,
            input.expectedChecksumSha256 ?? null,
            input.expectedChecksumSha256 ? "unavailable" : "not_provided",
            input.piiPosture ?? "possible",
            input.actor.actorType,
            input.actor.actorId,
          ],
        );
        const intentResult = await client.query<AssetUploadIntentRecord>(
          `
            INSERT INTO asset_upload_intents (
              upload_intent_id,
              asset_id,
              status,
              actor_type,
              actor_id,
              scope_type,
              tenant_id,
              storage_key,
              expected_content_type,
              max_byte_size,
              expected_checksum_sha256,
              expires_at,
              completed_at,
              created_at,
              updated_at
            )
            VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11, NULL, NOW(), NOW())
            RETURNING *
          `,
          [
            input.uploadIntentId,
            input.assetId,
            input.actor.actorType,
            input.actor.actorId,
            input.scope.scopeType,
            input.scope.tenantId ?? null,
            input.storageKey,
            input.contentType,
            input.maxByteSize,
            input.expectedChecksumSha256 ?? null,
            input.expiresAt,
          ],
        );
        await client.query("COMMIT");
        return {
          asset: toAsset(assetResult.rows[0]),
          uploadIntent: toUploadIntent(intentResult.rows[0]),
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    findAssetById,
    findUploadIntentById,
    async completeUpload(input: CompleteUploadRecordInput) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        const intentResult = await client.query<AssetUploadIntentRecord>(
          `
            UPDATE asset_upload_intents
            SET status = 'completed', completed_at = NOW(), updated_at = NOW()
            WHERE upload_intent_id = $1
              AND asset_id = $2
              AND status = 'pending'
            RETURNING *
          `,
          [input.uploadIntentId, input.assetId],
        );
        if (!intentResult.rows[0]) {
          await client.query("ROLLBACK");
          return null;
        }
        const assetResult = await client.query<AssetRecord>(
          `
            UPDATE assets
            SET lifecycle_status = 'ready',
                verified_content_type = $3,
                observed_checksum_sha256 = $4,
                checksum_verification_status = $5,
                content_verification_status = $6,
                cleanup_status = 'not_required',
                cleanup_failure_reason = NULL,
                rejection_reason = NULL,
                updated_at = NOW()
            WHERE asset_id = $1
              AND storage_key = $2
              AND lifecycle_status = 'pending_upload'
              AND deleted_at IS NULL
            RETURNING *
          `,
          [
            input.assetId,
            intentResult.rows[0].storage_key,
            input.verifiedContentType,
            input.observedChecksumSha256,
            input.checksumVerificationStatus,
            input.contentVerificationStatus,
          ],
        );
        if (!assetResult.rows[0]) {
          await client.query("ROLLBACK");
          return null;
        }
        await client.query("COMMIT");
        return toAsset(assetResult.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async rejectUpload(input: RejectUploadRecordInput) {
      const client = await dbPool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          `
            UPDATE asset_upload_intents
            SET status = 'rejected', updated_at = NOW()
            WHERE upload_intent_id = $1
              AND asset_id = $2
              AND status = 'pending'
          `,
          [input.uploadIntentId, input.assetId],
        );
        const assetResult = await client.query<AssetRecord>(
          `
            UPDATE assets
            SET lifecycle_status = 'rejected',
                rejection_reason = $2,
                checksum_verification_status = COALESCE($3, checksum_verification_status),
                content_verification_status = COALESCE($4, content_verification_status),
                updated_at = NOW()
            WHERE asset_id = $1
              AND deleted_at IS NULL
            RETURNING *
          `,
          [
            input.assetId,
            input.rejectionReason,
            input.checksumVerificationStatus ?? null,
            input.contentVerificationStatus ?? null,
          ],
        );
        await client.query("COMMIT");
        return assetResult.rows[0] ? toAsset(assetResult.rows[0]) : null;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async softDeleteAsset(assetId: string) {
      const result = await dbPool.query<AssetRecord>(
        `
          UPDATE assets
          SET lifecycle_status = 'deleted',
              deleted_at = NOW(),
              updated_at = NOW()
          WHERE asset_id = $1
            AND deleted_at IS NULL
          RETURNING *
        `,
        [assetId],
      );
      return result.rows[0] ? toAsset(result.rows[0]) : null;
    },
    async findExpiredCleanupCandidates(input) {
      const result = await dbPool.query<AssetRecord & AssetUploadIntentRecord>(
        `
          SELECT a.*, i.*
          FROM asset_upload_intents i
          JOIN assets a ON a.asset_id = i.asset_id
          WHERE (
              ($3 = FALSE AND i.status = 'pending' AND i.expires_at <= $1)
              OR ($3 = TRUE AND a.cleanup_status = 'failed_retryable')
            )
          ORDER BY i.expires_at ASC
          LIMIT $2
        `,
        [input.now, input.batchSize, input.retryFailedOnly],
      );
      return result.rows.map((row) => ({
        asset: toAsset(row),
        uploadIntent: toUploadIntent(row),
      }));
    },
    async markCleanupResult(input) {
      await dbPool.query(
        `
          UPDATE asset_upload_intents
          SET status = $3,
              updated_at = NOW()
          WHERE upload_intent_id = $1
            AND asset_id = $2
        `,
        [input.uploadIntentId, input.assetId, input.intentStatus],
      );
      await dbPool.query(
        `
          UPDATE assets
          SET lifecycle_status = $2,
              rejection_reason = $3,
              cleanup_status = $4,
              cleanup_failure_reason = $5,
              cleanup_attempted_at = NOW(),
              updated_at = NOW()
          WHERE asset_id = $1
        `,
        [
          input.assetId,
          input.assetLifecycleStatus,
          input.rejectionReason,
          input.cleanupStatus,
          input.cleanupFailureReason ?? null,
        ],
      );
    },
    assertScopeMatches(asset: Asset, scope: AssetScope) {
      return asset.scopeType === scope.scopeType && (asset.tenantId ?? null) === (scope.tenantId ?? null);
    },
  };
}
