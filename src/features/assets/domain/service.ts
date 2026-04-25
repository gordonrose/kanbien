import { randomUUID } from "node:crypto";
import type { ObjectStorageAdapter } from "../../../lib/storage/types";
import {
  AssetConflictError,
  AssetForbiddenError,
  AssetNotFoundError,
  AssetStorageVerificationError,
} from "../contract/errors";
import type { AssetsRepository } from "../persistence/repository";
import { verifySvgIsSafe } from "./svgSanitizer";
import type {
  Asset,
  AssetActorContext,
  AssetScope,
  AssetVisibility,
  CleanupExpiredUploadsInput,
  CleanupExpiredUploadsResult,
  CompleteUploadInput,
  CreateUploadIntentInput,
  CreateUploadIntentResult,
  DeleteAssetInput,
  ReadAssetContentResult,
  ReadAssetInput,
  ValidateAssetForSubjectInput,
} from "./types";
import {
  ASSET_UPLOAD_INTENT_TTL_MINUTES,
  DAILY_UPLOAD_BYTES_PER_TENANT,
  MAX_PENDING_UPLOADS_PER_ACTOR,
  MAX_PENDING_UPLOADS_PER_TENANT,
  RASTER_IMAGE_MAX_BYTES,
  STORED_ASSET_BYTES_PER_TENANT,
  SVG_IMAGE_MAX_BYTES,
} from "./types";

const RASTER_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_IMAGE_TYPES = new Set([...RASTER_IMAGE_TYPES, "image/svg+xml"]);

function normalizeChecksum(value?: string | null): string | null {
  return value ? value.trim().toLowerCase() : null;
}

function scopeEqualsActor(actor: AssetActorContext, scope: AssetScope): boolean {
  if (actor.actorType === "internal") {
    return true;
  }
  if (scope.scopeType === "root") {
    return actor.actorType === "root";
  }
  if (actor.actorType === "root") {
    return true;
  }
  return actor.actorType === "tenant" && actor.tenantId === scope.tenantId;
}

function assertActorCanUseScope(actor: AssetActorContext, scope: AssetScope): void {
  if (!scopeEqualsActor(actor, scope)) {
    throw new AssetForbiddenError({ field: "tenantId", reason: "scope_mismatch" });
  }
}

function assertAssetVisibleToActor(actor: AssetActorContext, asset: Asset): void {
  assertActorCanUseScope(actor, {
    scopeType: asset.scopeType,
    tenantId: asset.tenantId,
  });
}

function maxBytesForContentType(contentType: string): number {
  return contentType === "image/svg+xml" ? SVG_IMAGE_MAX_BYTES : RASTER_IMAGE_MAX_BYTES;
}

function createStorageKey(input: {
  scope: AssetScope;
  assetId: string;
  uploadIntentId: string;
  contentType: string;
}): string {
  const extension =
    input.contentType === "image/png"
      ? "png"
      : input.contentType === "image/jpeg"
        ? "jpg"
        : input.contentType === "image/webp"
          ? "webp"
          : "svg";
  const scopePrefix =
    input.scope.scopeType === "tenant" ? `tenant/${input.scope.tenantId}` : "root";
  return `${scopePrefix}/assets/${input.assetId}/${input.uploadIntentId}.${extension}`;
}

function ensureReadyAsset(asset: Asset): void {
  if (asset.deletedAt || asset.lifecycleStatus === "deleted") {
    throw new AssetNotFoundError({ field: "assetId", reason: "deleted" });
  }
  if (asset.lifecycleStatus !== "ready" || asset.cleanupStatus === "failed_retryable") {
    throw new AssetConflictError("That asset is not ready for normal use.", {
      field: "assetId",
      reason: "not_ready",
    });
  }
}

export interface AssetsService {
  createUploadIntent(input: CreateUploadIntentInput): Promise<CreateUploadIntentResult>;
  completeUpload(input: CompleteUploadInput): Promise<Asset>;
  readAssetMetadata(input: ReadAssetInput): Promise<Asset>;
  readAssetContent(input: ReadAssetInput): Promise<ReadAssetContentResult>;
  deleteAsset(input: DeleteAssetInput): Promise<Asset>;
  validateAssetForSubject(input: ValidateAssetForSubjectInput): Promise<Asset>;
  cleanupExpiredUploads(input?: CleanupExpiredUploadsInput): Promise<CleanupExpiredUploadsResult>;
}

export function createAssetsService(
  repository: AssetsRepository,
  storage: ObjectStorageAdapter,
): AssetsService {
  return {
    async createUploadIntent(input) {
      assertActorCanUseScope(input.actor, input.scope);
      if (input.kind !== "image" || !ALLOWED_IMAGE_TYPES.has(input.contentType)) {
        throw new AssetConflictError("Only approved image uploads are supported in asset foundation v1.", {
          field: "contentType",
          reason: "unsupported_asset_type",
        });
      }
      if (input.visibility !== "private") {
        throw new AssetForbiddenError({ field: "visibility", reason: "public_visibility_not_approved" });
      }
      const maxByteSize = maxBytesForContentType(input.contentType);
      if (input.byteSize > maxByteSize) {
        throw new AssetConflictError("The requested asset exceeds the approved size limit.", {
          field: "byteSize",
          reason: "asset_too_large",
        });
      }
      const pendingActorCount = await repository.countPendingUploadsForActor(input.actor);
      if (pendingActorCount >= MAX_PENDING_UPLOADS_PER_ACTOR) {
        throw new AssetConflictError("This actor has too many pending uploads.", {
          field: "actor",
          reason: "pending_actor_limit",
        });
      }
      if (input.scope.scopeType === "tenant" && input.scope.tenantId) {
        const [pendingTenantCount, dailyBytes, storedBytes] = await Promise.all([
          repository.countPendingUploadsForTenant(input.scope.tenantId),
          repository.sumTenantUploadBytesSince(
            input.scope.tenantId,
            new Date(Date.now() - 24 * 60 * 60 * 1000),
          ),
          repository.sumTenantStoredReadyBytes(input.scope.tenantId),
        ]);
        if (pendingTenantCount >= MAX_PENDING_UPLOADS_PER_TENANT) {
          throw new AssetConflictError("This tenant has too many pending uploads.", {
            field: "tenantId",
            reason: "pending_tenant_limit",
          });
        }
        if (dailyBytes + input.byteSize > DAILY_UPLOAD_BYTES_PER_TENANT) {
          throw new AssetConflictError("This tenant has reached the daily upload byte limit.", {
            field: "byteSize",
            reason: "daily_upload_bytes_limit",
          });
        }
        if (storedBytes + input.byteSize > STORED_ASSET_BYTES_PER_TENANT) {
          throw new AssetConflictError("This tenant has reached the stored asset quota.", {
            field: "byteSize",
            reason: "stored_asset_quota",
          });
        }
      }

      const assetId = randomUUID();
      const uploadIntentId = randomUUID();
      const expiresAt = new Date(Date.now() + ASSET_UPLOAD_INTENT_TTL_MINUTES * 60 * 1000);
      const storageKey = createStorageKey({
        scope: input.scope,
        assetId,
        uploadIntentId,
        contentType: input.contentType,
      });
      const persisted = await repository.createUploadIntent({
        ...input,
        expectedChecksumSha256: normalizeChecksum(input.expectedChecksumSha256),
        piiPosture: input.piiPosture ?? "possible",
        assetId,
        uploadIntentId,
        storageProvider: storage.provider,
        storageKey,
        expiresAt,
        maxByteSize,
      });
      const uploadTarget = await storage.createUploadTarget({
        storageKey,
        contentType: input.contentType,
        byteSize: input.byteSize,
        expiresAt,
        checksumSha256: normalizeChecksum(input.expectedChecksumSha256),
      });

      return {
        ...persisted,
        uploadTarget,
      };
    },
    async completeUpload(input) {
      const [asset, intent] = await Promise.all([
        repository.findAssetById(input.assetId),
        repository.findUploadIntentById(input.uploadIntentId),
      ]);
      if (!asset || !intent || intent.assetId !== asset.assetId) {
        throw new AssetNotFoundError({ field: "assetId", reason: "missing_asset_or_intent" });
      }
      assertAssetVisibleToActor(input.actor, asset);
      if (intent.actorType !== input.actor.actorType || intent.actorId !== input.actor.actorId) {
        throw new AssetForbiddenError({ field: "uploadIntentId", reason: "actor_mismatch" });
      }
      if (intent.status !== "pending" || asset.lifecycleStatus !== "pending_upload") {
        throw new AssetConflictError("That upload intent is no longer pending.", {
          field: "uploadIntentId",
          reason: "intent_not_pending",
        });
      }
      if (new Date(intent.expiresAt).getTime() <= Date.now()) {
        await repository.rejectUpload({
          assetId: asset.assetId,
          uploadIntentId: intent.uploadIntentId,
          rejectionReason: "upload_expired",
        });
        throw new AssetConflictError("That upload intent has expired.", {
          field: "uploadIntentId",
          reason: "intent_expired",
        });
      }
      const metadata = await storage.headObject(intent.storageKey);
      if (!metadata) {
        throw new AssetStorageVerificationError("The uploaded object was not found.", {
          field: "storageKey",
          reason: "object_missing",
        });
      }
      if (metadata.byteSize !== asset.byteSize || metadata.byteSize > intent.maxByteSize) {
        await repository.rejectUpload({
          assetId: asset.assetId,
          uploadIntentId: intent.uploadIntentId,
          rejectionReason: "byte_size_mismatch",
        });
        throw new AssetStorageVerificationError("The uploaded object size does not match the intent.", {
          field: "byteSize",
          reason: "byte_size_mismatch",
        });
      }
      if (metadata.contentType !== intent.expectedContentType) {
        await repository.rejectUpload({
          assetId: asset.assetId,
          uploadIntentId: intent.uploadIntentId,
          rejectionReason: "content_type_mismatch",
        });
        throw new AssetStorageVerificationError("The uploaded object content type does not match the intent.", {
          field: "contentType",
          reason: "content_type_mismatch",
        });
      }

      const observedChecksum = normalizeChecksum(input.checksumSha256 ?? metadata.checksumSha256);
      let checksumStatus: "not_provided" | "provider_verified" | "backend_verified" | "mismatched" =
        asset.expectedChecksumSha256 ? "provider_verified" : "not_provided";
      if (asset.expectedChecksumSha256) {
        if (observedChecksum !== asset.expectedChecksumSha256) {
          await repository.rejectUpload({
            assetId: asset.assetId,
            uploadIntentId: intent.uploadIntentId,
            rejectionReason: "checksum_mismatch",
            checksumVerificationStatus: "mismatched",
          });
          throw new AssetStorageVerificationError("The uploaded object checksum does not match the intent.", {
            field: "checksumSha256",
            reason: "checksum_mismatch",
          });
        }
        checksumStatus = input.checksumSha256 ? "backend_verified" : "provider_verified";
      }

      const contentVerificationStatus =
        asset.claimedContentType === "image/svg+xml"
          ? (() => {
              return "svg_sanitized" as const;
            })()
          : "metadata_verified";
      if (asset.claimedContentType === "image/svg+xml") {
        const svgBytes = await storage.readObjectBytes(intent.storageKey, SVG_IMAGE_MAX_BYTES);
        const sanitizerResult = verifySvgIsSafe(svgBytes);
        if (!sanitizerResult.ok) {
          await repository.rejectUpload({
            assetId: asset.assetId,
            uploadIntentId: intent.uploadIntentId,
            rejectionReason: `svg_${sanitizerResult.reason ?? "unsafe"}`,
            contentVerificationStatus: "failed",
          });
          throw new AssetStorageVerificationError("The uploaded SVG did not pass sanitizer verification.", {
            field: "content",
            reason: sanitizerResult.reason ?? "unsafe_svg",
          });
        }
      }

      const completed = await repository.completeUpload({
        assetId: asset.assetId,
        uploadIntentId: intent.uploadIntentId,
        verifiedContentType: metadata.contentType,
        observedChecksumSha256: observedChecksum,
        checksumVerificationStatus: checksumStatus,
        contentVerificationStatus,
      });
      if (!completed) {
        throw new AssetConflictError("The upload could not be completed because its state changed.", {
          field: "uploadIntentId",
          reason: "state_changed",
        });
      }
      return completed;
    },
    async readAssetMetadata(input) {
      const asset = await repository.findAssetById(input.assetId);
      if (!asset) {
        throw new AssetNotFoundError({ field: "assetId", reason: "missing" });
      }
      assertAssetVisibleToActor(input.actor, asset);
      ensureReadyAsset(asset);
      return asset;
    },
    async readAssetContent(input) {
      const asset = await this.readAssetMetadata(input);
      const object = await storage.readObject(asset.storageKey);
      return {
        asset,
        stream: object.stream,
        headers: {
          "Content-Type": asset.verifiedContentType ?? asset.claimedContentType,
          "Content-Length": String(object.metadata.byteSize),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, max-age=60",
          "Content-Disposition": "inline",
        },
      };
    },
    async deleteAsset(input) {
      const asset = await repository.findAssetById(input.assetId);
      if (!asset) {
        throw new AssetNotFoundError({ field: "assetId", reason: "missing" });
      }
      assertAssetVisibleToActor(input.actor, asset);
      if (asset.deletedAt || asset.lifecycleStatus === "deleted") {
        throw new AssetConflictError("That asset has already been deleted.", {
          field: "assetId",
          reason: "already_deleted",
        });
      }
      const deleted = await repository.softDeleteAsset(input.assetId);
      if (!deleted) {
        throw new AssetNotFoundError({ field: "assetId", reason: "missing" });
      }
      return deleted;
    },
    async validateAssetForSubject(input) {
      const asset = await repository.findAssetById(input.assetId);
      if (!asset) {
        throw new AssetNotFoundError({ field: "assetId", reason: "missing" });
      }
      assertAssetVisibleToActor(input.actor, asset);
      if (!repository.assertScopeMatches(asset, input.scope)) {
        throw new AssetForbiddenError({ field: "tenantId", reason: "scope_mismatch" });
      }
      ensureReadyAsset(asset);
      if (!input.acceptedKinds.includes(asset.kind)) {
        throw new AssetConflictError("That asset kind is not valid for this consumer.", {
          field: "kind",
          reason: "incompatible_kind",
        });
      }
      if (input.requiredVisibility && asset.visibility !== input.requiredVisibility) {
        throw new AssetConflictError("That asset visibility is not valid for this consumer.", {
          field: "visibility",
          reason: "incompatible_visibility",
        });
      }
      const accessibility = input.contextualAccessibility;
      if (accessibility) {
        const hasAlt = typeof accessibility.altText === "string" && accessibility.altText.trim().length > 0;
        if (!hasAlt && accessibility.decorative !== true) {
          throw new AssetConflictError("This consumer requires contextual alt text or decorative posture.", {
            field: "contextualAccessibility",
            reason: "missing_contextual_accessibility",
          });
        }
      }
      return asset;
    },
    async cleanupExpiredUploads(input = {}) {
      const now = input.now ?? new Date();
      const candidates = await repository.findExpiredCleanupCandidates({
        now,
        batchSize: input.batchSize ?? 100,
        retryFailedOnly: input.retryFailedOnly ?? false,
      });
      const result: CleanupExpiredUploadsResult = {
        expiredIntents: 0,
        rejectedAssets: 0,
        deletedObjects: 0,
        missingObjects: 0,
        failedDeletes: 0,
      };
      for (const candidate of candidates) {
        result.expiredIntents += candidate.uploadIntent.status === "pending" ? 1 : 0;
        result.rejectedAssets += candidate.asset.lifecycleStatus === "pending_upload" ? 1 : 0;
        if (input.dryRun) {
          continue;
        }
        try {
          const deleteResult = await storage.deleteObject(candidate.asset.storageKey);
          if (deleteResult === "deleted") {
            result.deletedObjects += 1;
          } else {
            result.missingObjects += 1;
          }
          await repository.markCleanupResult({
            assetId: candidate.asset.assetId,
            uploadIntentId: candidate.uploadIntent.uploadIntentId,
            intentStatus: "expired",
            assetLifecycleStatus: "rejected",
            cleanupStatus: deleteResult === "deleted" ? "deleted" : "object_missing",
            rejectionReason: "upload_expired",
          });
        } catch (error) {
          result.failedDeletes += 1;
          await repository.markCleanupResult({
            assetId: candidate.asset.assetId,
            uploadIntentId: candidate.uploadIntent.uploadIntentId,
            intentStatus: "expired",
            assetLifecycleStatus: "rejected",
            cleanupStatus: "failed_retryable",
            rejectionReason: "upload_expired",
            cleanupFailureReason: error instanceof Error ? error.message : "unknown_delete_failure",
          });
        }
      }
      return result;
    },
  };
}
