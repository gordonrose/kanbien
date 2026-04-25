import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createAssetsService } from "../../src/features/assets/domain/service";
import type {
  Asset,
  AssetActorContext,
  AssetScope,
  AssetUploadIntent,
  UploadIntentStatus,
  AssetCleanupStatus,
} from "../../src/features/assets/domain/types";
import type {
  AssetsRepository,
  CleanupCandidate,
  CompleteUploadRecordInput,
  CreateUploadIntentRecordInput,
  RejectUploadRecordInput,
} from "../../src/features/assets/persistence/repository";
import { createAssetsRouter } from "../../src/features/assets/transport/router";
import { createLocalStorageAdapter } from "../../src/lib/storage/localStorageAdapter";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function cloneAsset(asset: Asset): Asset {
  return { ...asset };
}

function cloneIntent(intent: AssetUploadIntent): AssetUploadIntent {
  return { ...intent };
}

export function createInMemoryAssetsRepository(): AssetsRepository & {
  assets: Map<string, Asset>;
  intents: Map<string, AssetUploadIntent>;
} {
  const assets = new Map<string, Asset>();
  const intents = new Map<string, AssetUploadIntent>();

  function nowIso(): string {
    return new Date().toISOString();
  }

  return {
    assets,
    intents,
    async countPendingUploadsForActor(actor: AssetActorContext) {
      return [...intents.values()].filter(
        (intent) =>
          intent.status === "pending" &&
          intent.actorType === actor.actorType &&
          intent.actorId === actor.actorId &&
          new Date(intent.expiresAt).getTime() > Date.now(),
      ).length;
    },
    async countPendingUploadsForTenant(tenantId: string) {
      return [...intents.values()].filter(
        (intent) =>
          intent.status === "pending" &&
          intent.tenantId === tenantId &&
          new Date(intent.expiresAt).getTime() > Date.now(),
      ).length;
    },
    async sumTenantUploadBytesSince(tenantId: string, since: Date) {
      return [...assets.values()]
        .filter((asset) => asset.tenantId === tenantId && new Date(asset.createdAt) >= since)
        .reduce((sum, asset) => sum + asset.byteSize, 0);
    },
    async sumTenantStoredReadyBytes(tenantId: string) {
      return [...assets.values()]
        .filter(
          (asset) =>
            asset.tenantId === tenantId &&
            asset.deletedAt === null &&
            ["pending_upload", "uploaded", "ready"].includes(asset.lifecycleStatus) &&
            asset.cleanupStatus !== "deleted",
        )
        .reduce((sum, asset) => sum + asset.byteSize, 0);
    },
    async createUploadIntent(input: CreateUploadIntentRecordInput) {
      const timestamp = nowIso();
      const asset: Asset = {
        assetId: input.assetId,
        scopeType: input.scope.scopeType,
        tenantId: input.scope.tenantId ?? null,
        kind: input.kind,
        visibility: input.visibility,
        originalFilename: input.originalFilename ?? null,
        storageProvider: input.storageProvider,
        storageKey: input.storageKey,
        claimedContentType: input.contentType,
        verifiedContentType: null,
        byteSize: input.byteSize,
        expectedChecksumSha256: input.expectedChecksumSha256 ?? null,
        observedChecksumSha256: null,
        checksumVerificationStatus: input.expectedChecksumSha256 ? "unavailable" : "not_provided",
        contentVerificationStatus: "claimed_only",
        lifecycleStatus: "pending_upload",
        processingStatus: "not_required",
        piiPosture: input.piiPosture ?? "possible",
        cleanupStatus: "pending",
        cleanupFailureReason: null,
        rejectionReason: null,
        createdByActorType: input.actor.actorType,
        createdByActorId: input.actor.actorId,
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      };
      const intent: AssetUploadIntent = {
        uploadIntentId: input.uploadIntentId,
        assetId: input.assetId,
        status: "pending",
        actorType: input.actor.actorType,
        actorId: input.actor.actorId,
        scopeType: input.scope.scopeType,
        tenantId: input.scope.tenantId ?? null,
        storageKey: input.storageKey,
        expectedContentType: input.contentType,
        maxByteSize: input.maxByteSize,
        expectedChecksumSha256: input.expectedChecksumSha256 ?? null,
        expiresAt: input.expiresAt.toISOString(),
        completedAt: null,
      };
      assets.set(asset.assetId, asset);
      intents.set(intent.uploadIntentId, intent);
      return { asset: cloneAsset(asset), uploadIntent: cloneIntent(intent) };
    },
    async findAssetById(assetId: string) {
      const asset = assets.get(assetId);
      return asset ? cloneAsset(asset) : null;
    },
    async findUploadIntentById(uploadIntentId: string) {
      const intent = intents.get(uploadIntentId);
      return intent ? cloneIntent(intent) : null;
    },
    async completeUpload(input: CompleteUploadRecordInput) {
      const asset = assets.get(input.assetId);
      const intent = intents.get(input.uploadIntentId);
      if (!asset || !intent || intent.status !== "pending") {
        return null;
      }
      intent.status = "completed";
      intent.completedAt = nowIso();
      asset.lifecycleStatus = "ready";
      asset.verifiedContentType = input.verifiedContentType;
      asset.observedChecksumSha256 = input.observedChecksumSha256;
      asset.checksumVerificationStatus = input.checksumVerificationStatus;
      asset.contentVerificationStatus = input.contentVerificationStatus;
      asset.cleanupStatus = "not_required";
      asset.updatedAt = nowIso();
      return cloneAsset(asset);
    },
    async rejectUpload(input: RejectUploadRecordInput) {
      const asset = assets.get(input.assetId);
      const intent = intents.get(input.uploadIntentId);
      if (intent && intent.status === "pending") {
        intent.status = "rejected";
      }
      if (!asset) {
        return null;
      }
      asset.lifecycleStatus = "rejected";
      asset.rejectionReason = input.rejectionReason;
      asset.checksumVerificationStatus =
        input.checksumVerificationStatus ?? asset.checksumVerificationStatus;
      asset.contentVerificationStatus =
        input.contentVerificationStatus ?? asset.contentVerificationStatus;
      asset.updatedAt = nowIso();
      return cloneAsset(asset);
    },
    async softDeleteAsset(assetId: string) {
      const asset = assets.get(assetId);
      if (!asset || asset.deletedAt) {
        return null;
      }
      asset.lifecycleStatus = "deleted";
      asset.deletedAt = nowIso();
      asset.updatedAt = nowIso();
      return cloneAsset(asset);
    },
    async findExpiredCleanupCandidates(input): Promise<CleanupCandidate[]> {
      return [...intents.values()]
        .filter((intent) => {
          const asset = assets.get(intent.assetId);
          if (!asset) {
            return false;
          }
          if (input.retryFailedOnly) {
            return asset.cleanupStatus === "failed_retryable";
          }
          return intent.status === "pending" && new Date(intent.expiresAt) <= input.now;
        })
        .slice(0, input.batchSize)
        .map((intent) => ({
          uploadIntent: cloneIntent(intent),
          asset: cloneAsset(assets.get(intent.assetId)!),
        }));
    },
    async markCleanupResult(input: {
      assetId: string;
      uploadIntentId: string;
      intentStatus: UploadIntentStatus;
      assetLifecycleStatus: "rejected";
      cleanupStatus: AssetCleanupStatus;
      rejectionReason: string;
      cleanupFailureReason?: string | null;
    }) {
      const intent = intents.get(input.uploadIntentId);
      const asset = assets.get(input.assetId);
      if (intent) {
        intent.status = input.intentStatus;
      }
      if (asset) {
        asset.lifecycleStatus = input.assetLifecycleStatus;
        asset.cleanupStatus = input.cleanupStatus;
        asset.cleanupFailureReason = input.cleanupFailureReason ?? null;
        asset.rejectionReason = input.rejectionReason;
        asset.updatedAt = nowIso();
      }
    },
    assertScopeMatches(asset: Asset, scope: AssetScope) {
      return asset.scopeType === scope.scopeType && (asset.tenantId ?? null) === (scope.tenantId ?? null);
    },
  };
}

export async function writeLocalAssetObject(input: {
  storageRoot: string;
  storageKey: string;
  content: Buffer | string;
}): Promise<void> {
  const objectPath = path.join(input.storageRoot, input.storageKey);
  await mkdir(path.dirname(objectPath), { recursive: true });
  await writeFile(objectPath, input.content);
}

export function mountAssetsFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  options: {
    storageRoot: string;
    repository?: ReturnType<typeof createInMemoryAssetsRepository>;
  },
) {
  const repository = options.repository ?? createInMemoryAssetsRepository();
  const storage = createLocalStorageAdapter(options.storageRoot);
  const service = createAssetsService(repository, storage);
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession
        ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}`
        : null,
  });

  app.use(
    "/v1/assets",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createAssetsRouter(
      service,
      {
        hasCapability: async ({ rootUserId, capabilityKey }) =>
          harness.getRootUserCapabilities(rootUserId).includes(capabilityKey),
      },
      harness.platformSecurityRepository,
    ),
  );

  return { repository, storage, service };
}
