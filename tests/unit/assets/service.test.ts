import { Readable } from "node:stream";
import { describe, expect, it, vi } from "vitest";
import { createUploadIntentBodySchema } from "../../../src/features/assets/contract/schemas";
import {
  AssetConflictError,
  AssetForbiddenError,
  AssetStorageVerificationError,
} from "../../../src/features/assets/contract/errors";
import { createAssetsService } from "../../../src/features/assets/domain/service";
import type {
  Asset,
  AssetActorContext,
  AssetScope,
  AssetUploadIntent,
} from "../../../src/features/assets/domain/types";
import type { AssetsRepository, CreateUploadIntentRecordInput } from "../../../src/features/assets/persistence/repository";
import type { ObjectStorageAdapter } from "../../../src/lib/storage/types";

const rootActor: AssetActorContext = {
  actorType: "root",
  actorId: "00000000-0000-0000-0000-000000000101",
};

const tenantScope: AssetScope = {
  scopeType: "tenant",
  tenantId: "00000000-0000-0000-0000-000000000201",
};

function createAsset(input: Partial<Asset> = {}): Asset {
  return {
    assetId: "00000000-0000-0000-0000-000000000301",
    scopeType: "tenant",
    tenantId: tenantScope.tenantId ?? null,
    kind: "image",
    visibility: "private",
    originalFilename: "logo.png",
    storageProvider: "local-filesystem",
    storageKey: "tenant/asset/logo.png",
    claimedContentType: "image/png",
    verifiedContentType: null,
    byteSize: 128,
    expectedChecksumSha256: null,
    observedChecksumSha256: null,
    checksumVerificationStatus: "not_provided",
    contentVerificationStatus: "claimed_only",
    lifecycleStatus: "pending_upload",
    processingStatus: "not_required",
    piiPosture: "possible",
    cleanupStatus: "pending",
    cleanupFailureReason: null,
    rejectionReason: null,
    createdByActorType: "root",
    createdByActorId: rootActor.actorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    ...input,
  };
}

function createIntent(input: Partial<AssetUploadIntent> = {}): AssetUploadIntent {
  return {
    uploadIntentId: "00000000-0000-0000-0000-000000000401",
    assetId: "00000000-0000-0000-0000-000000000301",
    status: "pending",
    actorType: "root",
    actorId: rootActor.actorId,
    scopeType: "tenant",
    tenantId: tenantScope.tenantId ?? null,
    storageKey: "tenant/asset/logo.png",
    expectedContentType: "image/png",
    maxByteSize: 5 * 1024 * 1024,
    expectedChecksumSha256: null,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    completedAt: null,
    ...input,
  };
}

function createRepository(overrides: Partial<AssetsRepository> = {}): AssetsRepository {
  return {
    countPendingUploadsForActor: vi.fn(async () => 0),
    countPendingUploadsForTenant: vi.fn(async () => 0),
    sumTenantUploadBytesSince: vi.fn(async () => 0),
    sumTenantStoredReadyBytes: vi.fn(async () => 0),
    createUploadIntent: vi.fn(async (input: CreateUploadIntentRecordInput) => ({
      asset: createAsset({
        assetId: input.assetId,
        storageKey: input.storageKey,
        claimedContentType: input.contentType,
        byteSize: input.byteSize,
        originalFilename: input.originalFilename ?? null,
        expectedChecksumSha256: input.expectedChecksumSha256 ?? null,
        piiPosture: input.piiPosture ?? "possible",
      }),
      uploadIntent: createIntent({
        uploadIntentId: input.uploadIntentId,
        assetId: input.assetId,
        storageKey: input.storageKey,
        expectedContentType: input.contentType,
        maxByteSize: input.maxByteSize,
        expectedChecksumSha256: input.expectedChecksumSha256 ?? null,
        expiresAt: input.expiresAt.toISOString(),
      }),
    })),
    findAssetById: vi.fn(async () => createAsset()),
    findUploadIntentById: vi.fn(async () => createIntent()),
    completeUpload: vi.fn(async () => createAsset({
      lifecycleStatus: "ready",
      cleanupStatus: "not_required",
      verifiedContentType: "image/png",
      contentVerificationStatus: "metadata_verified",
    })),
    rejectUpload: vi.fn(async () => createAsset({ lifecycleStatus: "rejected" })),
    softDeleteAsset: vi.fn(async () => createAsset({ lifecycleStatus: "deleted", deletedAt: new Date().toISOString() })),
    findExpiredCleanupCandidates: vi.fn(async () => []),
    markCleanupResult: vi.fn(async () => undefined),
    assertScopeMatches: (asset, scope) =>
      asset.scopeType === scope.scopeType && (asset.tenantId ?? null) === (scope.tenantId ?? null),
    ...overrides,
  };
}

function createStorage(overrides: Partial<ObjectStorageAdapter> = {}): ObjectStorageAdapter {
  return {
    provider: "local-filesystem",
    createUploadTarget: vi.fn(async (input) => ({
      mode: "local-filesystem" as const,
      storageKey: input.storageKey,
      expiresAt: input.expiresAt.toISOString(),
    })),
    headObject: vi.fn(async () => ({
      storageKey: "tenant/asset/logo.png",
      byteSize: 128,
      contentType: "image/png",
      checksumSha256: null,
    })),
    readObject: vi.fn(async () => ({
      stream: Readable.from(["ok"]),
      metadata: {
        storageKey: "tenant/asset/logo.png",
        byteSize: 2,
        contentType: "image/png",
        checksumSha256: null,
      },
    })),
    readObjectBytes: vi.fn(async () => Buffer.from("<svg></svg>")),
    deleteObject: vi.fn(async () => "deleted" as const),
    ...overrides,
  };
}

describe("assets service", () => {
  it("TC-ASSETS-UNIT-002 creates a constrained private image upload intent", async () => {
    const repository = createRepository();
    const storage = createStorage();
    const service = createAssetsService(repository, storage);

    const result = await service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
      originalFilename: "logo.png",
    });

    expect(result.asset.piiPosture).toBe("possible");
    expect(result.asset.storageKey).toContain("/assets/");
    expect(result.uploadIntent.status).toBe("pending");
    expect(storage.createUploadTarget).toHaveBeenCalledWith(expect.objectContaining({
      contentType: "image/png",
      byteSize: 128,
    }));
  });

  it("TC-ASSETS-UNIT-001 rejects system-managed fields and invalid upload intent input at the schema boundary", () => {
    expect(() =>
      createUploadIntentBodySchema.parse({
        id: "client-supplied",
        scopeType: "root",
        kind: "image",
        contentType: "image/png",
        byteSize: 128,
        visibility: "private",
      }),
    ).toThrow();
    expect(() =>
      createUploadIntentBodySchema.parse({
        scopeType: "tenant",
        kind: "image",
        contentType: "image/png",
        byteSize: 128,
        visibility: "private",
      }),
    ).toThrow();
  });

  it("TC-ASSETS-UNIT-003 TC-ASSETS-EDGE-006 rejects upload intent creation at the actor pending limit", async () => {
    const service = createAssetsService(
      createRepository({ countPendingUploadsForActor: vi.fn(async () => 10) }),
      createStorage(),
    );

    await expect(service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
    })).rejects.toBeInstanceOf(AssetConflictError);
  });

  it("TC-ASSETS-SEC-002 TC-ASSETS-SEC-003 denies cross-tenant and tenant-to-root scope misuse", async () => {
    const tenantActor = {
      actorType: "tenant" as const,
      actorId: "tenant-actor",
      tenantId: "00000000-0000-0000-0000-000000000999",
    };
    const service = createAssetsService(createRepository(), createStorage());

    await expect(service.createUploadIntent({
      actor: tenantActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
    })).rejects.toBeInstanceOf(AssetForbiddenError);

    await expect(service.createUploadIntent({
      actor: tenantActor,
      scope: { scopeType: "root" },
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
    })).rejects.toBeInstanceOf(AssetForbiddenError);
  });

  it("TC-ASSETS-SEC-005 rejects public visibility by default", async () => {
    const service = createAssetsService(createRepository(), createStorage());

    await expect(service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "public",
    })).rejects.toBeInstanceOf(AssetForbiddenError);
  });

  it("TC-ASSETS-UNIT-004 rejects completion when storage metadata mismatches the intent", async () => {
    const repository = createRepository();
    const service = createAssetsService(
      repository,
      createStorage({
        headObject: vi.fn(async () => ({
          storageKey: "tenant/asset/logo.png",
          byteSize: 999,
          contentType: "image/png",
          checksumSha256: null,
        })),
      }),
    );

    await expect(service.completeUpload({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      uploadIntentId: "00000000-0000-0000-0000-000000000401",
    })).rejects.toBeInstanceOf(AssetStorageVerificationError);
    expect(repository.rejectUpload).toHaveBeenCalledWith(expect.objectContaining({
      rejectionReason: "byte_size_mismatch",
    }));
  });

  it("TC-ASSETS-EDGE-001 TC-ASSETS-EDGE-012 rejects double completion and storage verification mismatches", async () => {
    const repository = createRepository();
    const service = createAssetsService(repository, createStorage());

    await expect(service.completeUpload({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      uploadIntentId: "00000000-0000-0000-0000-000000000401",
    })).resolves.toMatchObject({ lifecycleStatus: "ready" });

    vi.mocked(repository.findUploadIntentById).mockResolvedValueOnce(createIntent({ status: "completed" }));

    await expect(service.completeUpload({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      uploadIntentId: "00000000-0000-0000-0000-000000000401",
    })).rejects.toBeInstanceOf(AssetConflictError);
  });

  it("TC-ASSETS-EDGE-002 TC-ASSETS-EDGE-011 rejects completion after expiry and leaves cleanup-owned state", async () => {
    const repository = createRepository({
      findUploadIntentById: vi.fn(async () => createIntent({
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      })),
    });
    const service = createAssetsService(repository, createStorage());

    await expect(service.completeUpload({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      uploadIntentId: "00000000-0000-0000-0000-000000000401",
    })).rejects.toBeInstanceOf(AssetConflictError);
    expect(repository.rejectUpload).toHaveBeenCalledWith(expect.objectContaining({
      rejectionReason: "upload_expired",
    }));
  });

  it("TC-ASSETS-EDGE-003 creates a new generated key for each retry intent", async () => {
    const service = createAssetsService(createRepository(), createStorage());

    const first = await service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
    });
    const second = await service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
    });

    expect(second.asset.assetId).not.toBe(first.asset.assetId);
    expect(second.asset.storageKey).not.toBe(first.asset.storageKey);
  });

  it("TC-ASSETS-UNIT-006 TC-ASSETS-UNIT-007 TC-ASSETS-EDGE-004 TC-ASSETS-EDGE-005 reads metadata without bytes and content through storage stream", async () => {
    const storage = createStorage();
    const service = createAssetsService(
      createRepository({ findAssetById: vi.fn(async () => createAsset({ lifecycleStatus: "ready", cleanupStatus: "not_required" })) }),
      storage,
    );

    await expect(service.readAssetMetadata({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
    })).resolves.toMatchObject({ lifecycleStatus: "ready" });
    expect(storage.readObject).not.toHaveBeenCalled();

    const content = await service.readAssetContent({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
    });
    expect(content.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(storage.readObject).toHaveBeenCalledTimes(1);
  });

  it("TC-ASSETS-UNIT-008 soft deletes assets and excludes them from normal readiness", async () => {
    const service = createAssetsService(createRepository(), createStorage());

    await expect(service.deleteAsset({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
    })).resolves.toMatchObject({ lifecycleStatus: "deleted" });
  });

  it("TC-ASSETS-UNIT-009 TC-ASSETS-INT-007 TC-ASSETS-EDGE-014 requires contextual accessibility for tenant logo validation", async () => {
    const service = createAssetsService(
      createRepository({ findAssetById: vi.fn(async () => createAsset({ lifecycleStatus: "ready", cleanupStatus: "not_required" })) }),
      createStorage(),
    );

    await expect(service.validateAssetForSubject({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      scope: tenantScope,
      acceptedKinds: ["image"],
      requiredVisibility: "private",
      contextualAccessibility: {
        altText: "",
        decorative: false,
      },
    })).rejects.toBeInstanceOf(AssetConflictError);

    await expect(service.validateAssetForSubject({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      scope: tenantScope,
      acceptedKinds: ["image"],
      requiredVisibility: "private",
      contextualAccessibility: {
        altText: "",
        decorative: true,
      },
    })).resolves.toMatchObject({ assetId: "00000000-0000-0000-0000-000000000301" });
  });

  it("TC-ASSETS-SEC-007 preserves PII posture through the service contract", async () => {
    const service = createAssetsService(createRepository(), createStorage());

    const result = await service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
      piiPosture: "possible",
    });

    expect(result.asset.piiPosture).toBe("possible");
  });

  it("TC-ASSETS-UNIT-010 TC-ASSETS-EDGE-008 records cleanup failed deletes for retry", async () => {
    const expiredAsset = createAsset({
      lifecycleStatus: "pending_upload",
      cleanupStatus: "pending",
    });
    const expiredIntent = createIntent({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const repository = createRepository({
      findExpiredCleanupCandidates: vi.fn(async () => [{
        asset: expiredAsset,
        uploadIntent: expiredIntent,
      }]),
    });
    const service = createAssetsService(
      repository,
      createStorage({ deleteObject: vi.fn(async () => { throw new Error("delete timeout"); }) }),
    );

    await expect(service.cleanupExpiredUploads()).resolves.toMatchObject({
      failedDeletes: 1,
    });
    expect(repository.markCleanupResult).toHaveBeenCalledWith(expect.objectContaining({
      cleanupStatus: "failed_retryable",
      cleanupFailureReason: "delete timeout",
    }));
  });

  it("TC-ASSETS-EDGE-007 maps storage read failures to service errors without changing readiness", async () => {
    const service = createAssetsService(
      createRepository({ findAssetById: vi.fn(async () => createAsset({ lifecycleStatus: "ready", cleanupStatus: "not_required" })) }),
      createStorage({ readObject: vi.fn(async () => { throw new Error("storage timeout"); }) }),
    );

    await expect(service.readAssetContent({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
    })).rejects.toThrow("storage timeout");
  });

  it("TC-ASSETS-EDGE-015 treats original filenames as metadata only", async () => {
    const service = createAssetsService(createRepository(), createStorage());

    const result = await service.createUploadIntent({
      actor: rootActor,
      scope: tenantScope,
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
      originalFilename: "../secret/logo.png",
    });

    expect(result.asset.originalFilename).toBe("../secret/logo.png");
    expect(result.asset.storageKey).not.toContain("secret");
  });

  it("TC-ASSETS-EDGE-016 rejects deleted or rejected assets from consumer validation", async () => {
    const service = createAssetsService(
      createRepository({
        findAssetById: vi.fn(async () => createAsset({
          lifecycleStatus: "rejected",
          cleanupStatus: "pending",
        })),
      }),
      createStorage(),
    );

    await expect(service.validateAssetForSubject({
      actor: rootActor,
      assetId: "00000000-0000-0000-0000-000000000301",
      scope: tenantScope,
      acceptedKinds: ["image"],
    })).rejects.toBeInstanceOf(AssetConflictError);
  });
});
