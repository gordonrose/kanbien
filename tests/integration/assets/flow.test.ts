import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { invokeJson, invokeRaw } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountAssetsFeature, writeLocalAssetObject } from "../../helpers/assetsHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface CreateIntentResponse {
  asset: {
    assetId: string;
    storageKey: string;
    piiPosture: string;
    lifecycleStatus: string;
  };
  uploadIntent: {
    uploadIntentId: string;
    expiresAt: string;
  };
}

interface AssetResponse {
  assetId: string;
  lifecycleStatus: string;
  verifiedContentType: string | null;
  contentVerificationStatus: string;
  deletedAt: string | null;
}

describe("assets integration flows", () => {
  it("TC-ASSETS-INT-009 uploads browser-provided bytes through the same-origin asset seam before completion", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-browser-upload-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "asset.create",
      "asset.read",
      "asset.content.read",
    ]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<CreateIntentResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/png",
        byteSize: 7,
        visibility: "private",
        originalFilename: "profile.png",
      },
    });
    expect(created.status).toBe(201);

    const uploaded = await invokeRaw<AssetResponse>(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/upload-bytes?uploadIntentId=${created.body.uploadIntent.uploadIntentId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
        "content-type": "image/png",
      },
      body: Buffer.from("profile"),
    });
    expect(uploaded.status).toBe(200);
    expect(uploaded.body).toMatchObject({
      assetId: created.body.asset.assetId,
      lifecycleStatus: "pending_upload",
    });

    const completed = await invokeJson<AssetResponse>(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/complete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        uploadIntentId: created.body.uploadIntent.uploadIntentId,
      },
    });
    expect(completed.status).toBe(200);
    expect(completed.body).toMatchObject({
      lifecycleStatus: "ready",
      verifiedContentType: "image/png",
      contentVerificationStatus: "metadata_verified",
    });

    const content = await invokeJson<string>(harness.app, {
      method: "GET",
      path: `/v1/assets/${created.body.asset.assetId}/content`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(content.status).toBe(200);
    expect(content.body).toBe("profile");
  });

  it("TC-ASSETS-INT-001 TC-ASSETS-INT-002 TC-ASSETS-INT-004 TC-ASSETS-INT-005 TC-ASSETS-INT-008 creates, completes, reads, streams, and deletes a private image asset", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-flow-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "asset.create",
      "asset.read",
      "asset.content.read",
      "asset.delete",
    ]);
    const session = await loginViaPasswordAndSsh(harness, identity);
    const tenantId = "00000000-0000-4000-8000-000000000201";

    const created = await invokeJson<CreateIntentResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "tenant",
        tenantId,
        kind: "image",
        contentType: "image/png",
        byteSize: 4,
        visibility: "private",
        originalFilename: "logo.png",
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.asset).toMatchObject({
      piiPosture: "possible",
      lifecycleStatus: "pending_upload",
    });

    await writeLocalAssetObject({
      storageRoot,
      storageKey: created.body.asset.storageKey,
      content: "logo",
    });

    const completed = await invokeJson<AssetResponse>(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/complete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        uploadIntentId: created.body.uploadIntent.uploadIntentId,
      },
    });
    expect(completed.status).toBe(200);
    expect(completed.body).toMatchObject({
      lifecycleStatus: "ready",
      verifiedContentType: "image/png",
      contentVerificationStatus: "metadata_verified",
    });

    const metadata = await invokeJson<AssetResponse>(harness.app, {
      method: "GET",
      path: `/v1/assets/${created.body.asset.assetId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(metadata.status).toBe(200);
    expect(JSON.stringify(metadata.body)).not.toContain("signed");

    const content = await invokeJson<string>(harness.app, {
      method: "GET",
      path: `/v1/assets/${created.body.asset.assetId}/content`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(content.status).toBe(200);
    expect(content.headers["x-content-type-options"]).toBe("nosniff");
    expect(content.body).toBe("logo");

    const deleted = await invokeJson<AssetResponse>(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body.lifecycleStatus).toBe("deleted");

    const afterDelete = await invokeJson(harness.app, {
      method: "GET",
      path: `/v1/assets/${created.body.asset.assetId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(afterDelete.status).toBe(404);
  });

  it("TC-ASSETS-INT-003 TC-ASSETS-SEC-006 accepts safe SVG and rejects unsafe SVG before readiness", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-svg-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["asset.create"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<CreateIntentResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/svg+xml",
        byteSize: 36,
        visibility: "private",
      },
    });
    expect(created.status).toBe(201);
    await writeLocalAssetObject({
      storageRoot,
      storageKey: created.body.asset.storageKey,
      content: `<svg><script>alert(1)</script></svg>`,
    });

    const rejected = await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/complete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        uploadIntentId: created.body.uploadIntent.uploadIntentId,
      },
    });

    expect(rejected.status).toBe(422);
  });

  it("TC-ASSETS-INT-006 cleans up expired pending upload objects through the support seam", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-cleanup-"));
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["asset.create", "asset.cleanup"]);
    const session = await loginViaPasswordAndSsh(harness, identity);
    const created = await invokeJson<CreateIntentResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/png",
        byteSize: 4,
        visibility: "private",
      },
    });
    const intent = mounted.repository.intents.get(created.body.uploadIntent.uploadIntentId)!;
    intent.expiresAt = new Date(Date.now() - 1000).toISOString();
    await writeLocalAssetObject({
      storageRoot,
      storageKey: created.body.asset.storageKey,
      content: "logo",
    });

    const cleanup = await invokeJson<{
      expiredIntents: number;
      rejectedAssets: number;
      deletedObjects: number;
    }>(harness.app, {
      method: "POST",
      path: "/v1/assets/internal/cleanup-expired-uploads",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        batchSize: 100,
        retryFailedOnly: false,
        dryRun: false,
      },
    });

    expect(cleanup.status).toBe(200);
    expect(cleanup.body).toMatchObject({
      expiredIntents: 1,
      rejectedAssets: 1,
      deletedObjects: 1,
    });
    expect(mounted.repository.assets.get(created.body.asset.assetId)).toMatchObject({
      lifecycleStatus: "rejected",
      cleanupStatus: "deleted",
    });
  });
});
