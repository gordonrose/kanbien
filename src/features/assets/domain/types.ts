import type { ObjectStorageUploadTarget } from "../../../lib/storage/types";

export const ASSET_UPLOAD_INTENT_TTL_MINUTES = 15;
export const RASTER_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const SVG_IMAGE_MAX_BYTES = 1 * 1024 * 1024;
export const MAX_PENDING_UPLOADS_PER_ACTOR = 10;
export const MAX_PENDING_UPLOADS_PER_TENANT = 50;
export const DAILY_UPLOAD_BYTES_PER_TENANT = 250 * 1024 * 1024;
export const STORED_ASSET_BYTES_PER_TENANT = 1024 * 1024 * 1024;

export type AssetKind = "image" | "video" | "audio" | "document" | "other";
export type AssetVisibility = "private" | "public";
export type AssetScopeType = "root" | "tenant";
export type AssetLifecycleStatus =
  | "pending_upload"
  | "uploaded"
  | "ready"
  | "rejected"
  | "deleted";
export type AssetProcessingStatus =
  | "not_required"
  | "pending"
  | "processing"
  | "ready"
  | "failed"
  | "rejected";
export type AssetPiiPosture = "unknown" | "none" | "possible" | "contains";
export type UploadIntentStatus = "pending" | "completed" | "expired" | "rejected";
export type ChecksumVerificationStatus =
  | "not_provided"
  | "provider_verified"
  | "backend_verified"
  | "unavailable"
  | "mismatched";
export type ContentVerificationStatus =
  | "claimed_only"
  | "metadata_verified"
  | "svg_sanitized"
  | "failed";
export type AssetCleanupStatus =
  | "not_required"
  | "pending"
  | "deleted"
  | "object_missing"
  | "failed_retryable";

export interface AssetActorContext {
  actorType: "root" | "tenant" | "internal";
  actorId: string;
  authPrincipalId?: string | null;
  tenantId?: string | null;
}

export interface AssetScope {
  scopeType: AssetScopeType;
  tenantId?: string | null;
}

export interface Asset {
  assetId: string;
  scopeType: AssetScopeType;
  tenantId: string | null;
  kind: AssetKind;
  visibility: AssetVisibility;
  originalFilename: string | null;
  storageProvider: string;
  storageKey: string;
  claimedContentType: string;
  verifiedContentType: string | null;
  byteSize: number;
  expectedChecksumSha256: string | null;
  observedChecksumSha256: string | null;
  checksumVerificationStatus: ChecksumVerificationStatus;
  contentVerificationStatus: ContentVerificationStatus;
  lifecycleStatus: AssetLifecycleStatus;
  processingStatus: AssetProcessingStatus;
  piiPosture: AssetPiiPosture;
  cleanupStatus: AssetCleanupStatus;
  cleanupFailureReason: string | null;
  rejectionReason: string | null;
  createdByActorType: string;
  createdByActorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AssetUploadIntent {
  uploadIntentId: string;
  assetId: string;
  status: UploadIntentStatus;
  actorType: string;
  actorId: string;
  scopeType: AssetScopeType;
  tenantId: string | null;
  storageKey: string;
  expectedContentType: string;
  maxByteSize: number;
  expectedChecksumSha256: string | null;
  expiresAt: string;
  completedAt: string | null;
}

export interface CreateUploadIntentInput {
  actor: AssetActorContext;
  scope: AssetScope;
  kind: AssetKind;
  contentType: string;
  byteSize: number;
  visibility: AssetVisibility;
  originalFilename?: string | null;
  expectedChecksumSha256?: string | null;
  piiPosture?: AssetPiiPosture;
}

export interface CreateUploadIntentResult {
  asset: Asset;
  uploadIntent: AssetUploadIntent;
  uploadTarget: ObjectStorageUploadTarget;
}

export interface CompleteUploadInput {
  actor: AssetActorContext;
  assetId: string;
  uploadIntentId: string;
  checksumSha256?: string | null;
}

export interface UploadAssetBytesInput {
  actor: AssetActorContext;
  assetId: string;
  uploadIntentId: string;
  content: Buffer;
  contentType: string;
}

export interface ReadAssetInput {
  actor: AssetActorContext;
  assetId: string;
}

export interface ReadAssetContentResult {
  asset: Asset;
  stream: NodeJS.ReadableStream;
  headers: Record<string, string>;
}

export interface DeleteAssetInput {
  actor: AssetActorContext;
  assetId: string;
}

export interface ValidateAssetForSubjectInput {
  actor: AssetActorContext;
  assetId: string;
  scope: AssetScope;
  acceptedKinds: AssetKind[];
  requiredVisibility?: AssetVisibility;
  contextualAccessibility?: {
    altText?: string | null;
    decorative?: boolean;
  };
}

export interface CleanupExpiredUploadsInput {
  now?: Date;
  batchSize?: number;
  retryFailedOnly?: boolean;
  dryRun?: boolean;
}

export interface CleanupExpiredUploadsResult {
  expiredIntents: number;
  rejectedAssets: number;
  deletedObjects: number;
  missingObjects: number;
  failedDeletes: number;
}
