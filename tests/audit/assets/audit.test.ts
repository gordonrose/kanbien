import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountAssetsFeature, writeLocalAssetObject } from "../../helpers/assetsHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface CreateIntentResponse {
  asset: {
    assetId: string;
    storageKey: string;
  };
  uploadIntent: {
    uploadIntentId: string;
  };
}

describe("assets audit visibility", () => {
  it("TC-ASSETS-AUD-001 records successful upload intent, completion, delete, and cleanup support actions", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-audit-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "asset.create",
      "asset.delete",
      "asset.cleanup",
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
        byteSize: 4,
        visibility: "private",
      },
    });
    await writeLocalAssetObject({
      storageRoot,
      storageKey: created.body.asset.storageKey,
      content: "logo",
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/complete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        uploadIntentId: created.body.uploadIntent.uploadIntentId,
      },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/assets/internal/cleanup-expired-uploads",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventType: "asset_upload_intent_created", eventOutcome: "success" }),
        expect.objectContaining({ eventType: "asset_upload_completed", eventOutcome: "success" }),
        expect.objectContaining({ eventType: "asset_deleted", eventOutcome: "success" }),
        expect.objectContaining({ eventType: "asset_cleanup_ran", eventOutcome: "success" }),
      ]),
    );
  });

  it("TC-ASSETS-AUD-002 records completion mismatches without logging raw bytes", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-audit-fail-"));
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
        contentType: "image/png",
        byteSize: 4,
        visibility: "private",
      },
    });
    await writeLocalAssetObject({
      storageRoot,
      storageKey: created.body.asset.storageKey,
      content: "too-large",
    });

    const failed = await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/assets/${created.body.asset.assetId}/complete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        uploadIntentId: created.body.uploadIntent.uploadIntentId,
      },
    });

    expect(failed.status).toBe(422);
    const auditEvents = harness.getSecurityAuditEvents();
    expect(auditEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "asset_upload_completion_mismatch",
          eventOutcome: "failure",
        }),
      ]),
    );
    expect(JSON.stringify(auditEvents)).not.toContain("too-large");
  });
});
