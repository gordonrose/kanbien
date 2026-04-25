import type {
  Asset,
  AssetActorContext,
  AssetCleanupStatus,
  AssetScope,
  AssetUploadIntent,
  ChecksumVerificationStatus,
  ContentVerificationStatus,
  CreateUploadIntentInput,
  UploadIntentStatus,
} from "../domain/types";

export interface CreateUploadIntentRecordInput extends CreateUploadIntentInput {
  assetId: string;
  uploadIntentId: string;
  storageProvider: string;
  storageKey: string;
  expiresAt: Date;
  maxByteSize: number;
}

export interface CompleteUploadRecordInput {
  assetId: string;
  uploadIntentId: string;
  verifiedContentType: string;
  observedChecksumSha256: string | null;
  checksumVerificationStatus: ChecksumVerificationStatus;
  contentVerificationStatus: ContentVerificationStatus;
}

export interface RejectUploadRecordInput {
  assetId: string;
  uploadIntentId: string;
  rejectionReason: string;
  checksumVerificationStatus?: ChecksumVerificationStatus;
  contentVerificationStatus?: ContentVerificationStatus;
}

export interface CleanupCandidate {
  asset: Asset;
  uploadIntent: AssetUploadIntent;
}

export interface AssetsRepository {
  countPendingUploadsForActor(actor: AssetActorContext): Promise<number>;
  countPendingUploadsForTenant(tenantId: string): Promise<number>;
  sumTenantUploadBytesSince(tenantId: string, since: Date): Promise<number>;
  sumTenantStoredReadyBytes(tenantId: string): Promise<number>;
  createUploadIntent(input: CreateUploadIntentRecordInput): Promise<{
    asset: Asset;
    uploadIntent: AssetUploadIntent;
  }>;
  findAssetById(assetId: string): Promise<Asset | null>;
  findUploadIntentById(uploadIntentId: string): Promise<AssetUploadIntent | null>;
  completeUpload(input: CompleteUploadRecordInput): Promise<Asset | null>;
  rejectUpload(input: RejectUploadRecordInput): Promise<Asset | null>;
  softDeleteAsset(assetId: string): Promise<Asset | null>;
  findExpiredCleanupCandidates(input: {
    now: Date;
    batchSize: number;
    retryFailedOnly: boolean;
  }): Promise<CleanupCandidate[]>;
  markCleanupResult(input: {
    assetId: string;
    uploadIntentId: string;
    intentStatus: UploadIntentStatus;
    assetLifecycleStatus: "rejected";
    cleanupStatus: AssetCleanupStatus;
    rejectionReason: string;
    cleanupFailureReason?: string | null;
  }): Promise<void>;
  assertScopeMatches(asset: Asset, scope: AssetScope): boolean;
}
