import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresAssetsRepository } from "../../../src/features/assets/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("assets postgres repository", () => {
  let pool: Pool;
  const actor = {
    actorType: "root" as const,
    actorId: "11111111-1111-4111-8111-111111111111",
  };
  const tenantId = "22222222-2222-4222-8222-222222222222";

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "assets",
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ASSETS-INT-001 TC-ASSETS-INT-002 persists upload intent and ready lifecycle facts durably", async () => {
    const repository = createPostgresAssetsRepository(pool);

    const created = await repository.createUploadIntent({
      actor,
      scope: { scopeType: "tenant", tenantId },
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
      originalFilename: "logo.png",
      expectedChecksumSha256: null,
      piiPosture: "possible",
      assetId: "33333333-3333-4333-8333-333333333333",
      uploadIntentId: "44444444-4444-4444-8444-444444444444",
      storageProvider: "local-filesystem",
      storageKey: "tenant/222/assets/333/444.png",
      expiresAt: new Date(Date.now() + 60_000),
      maxByteSize: 5 * 1024 * 1024,
    });

    expect(created.asset).toMatchObject({
      tenantId,
      lifecycleStatus: "pending_upload",
      piiPosture: "possible",
      cleanupStatus: "pending",
    });
    expect(await repository.countPendingUploadsForActor(actor)).toBe(1);
    expect(await repository.countPendingUploadsForTenant(tenantId)).toBe(1);
    expect(await repository.sumTenantStoredReadyBytes(tenantId)).toBe(128);

    const completed = await repository.completeUpload({
      assetId: created.asset.assetId,
      uploadIntentId: created.uploadIntent.uploadIntentId,
      verifiedContentType: "image/png",
      observedChecksumSha256: null,
      checksumVerificationStatus: "not_provided",
      contentVerificationStatus: "metadata_verified",
    });

    expect(completed).toMatchObject({
      assetId: created.asset.assetId,
      lifecycleStatus: "ready",
      verifiedContentType: "image/png",
      cleanupStatus: "not_required",
    });
  });

  it("TC-ASSETS-INT-005 TC-ASSETS-INT-006 preserves soft-delete and cleanup retry state", async () => {
    const repository = createPostgresAssetsRepository(pool);
    const created = await repository.createUploadIntent({
      actor,
      scope: { scopeType: "tenant", tenantId },
      kind: "image",
      contentType: "image/png",
      byteSize: 128,
      visibility: "private",
      expectedChecksumSha256: null,
      piiPosture: "possible",
      assetId: "55555555-5555-4555-8555-555555555555",
      uploadIntentId: "66666666-6666-4666-8666-666666666666",
      storageProvider: "local-filesystem",
      storageKey: "tenant/222/assets/555/666.png",
      expiresAt: new Date(Date.now() - 60_000),
      maxByteSize: 5 * 1024 * 1024,
    });

    const candidates = await repository.findExpiredCleanupCandidates({
      now: new Date(),
      batchSize: 10,
      retryFailedOnly: false,
    });
    expect(candidates.map((candidate) => candidate.asset.assetId)).toEqual([created.asset.assetId]);

    await repository.markCleanupResult({
      assetId: created.asset.assetId,
      uploadIntentId: created.uploadIntent.uploadIntentId,
      intentStatus: "expired",
      assetLifecycleStatus: "rejected",
      cleanupStatus: "failed_retryable",
      rejectionReason: "upload_expired",
      cleanupFailureReason: "delete timeout",
    });

    const retryCandidates = await repository.findExpiredCleanupCandidates({
      now: new Date(),
      batchSize: 10,
      retryFailedOnly: true,
    });
    expect(retryCandidates).toHaveLength(1);
    expect(retryCandidates[0].asset).toMatchObject({
      lifecycleStatus: "rejected",
      cleanupStatus: "failed_retryable",
      cleanupFailureReason: "delete timeout",
    });

    const deleted = await repository.softDeleteAsset(created.asset.assetId);
    expect(deleted).toMatchObject({
      lifecycleStatus: "deleted",
    });
    expect(deleted?.deletedAt).not.toBeNull();
  });
});
