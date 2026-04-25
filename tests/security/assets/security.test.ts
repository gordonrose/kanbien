import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountAssetsFeature } from "../../helpers/assetsHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  details?: { field?: string; reason?: string };
}

describe("assets security flows", () => {
  it("TC-ASSETS-SEC-001 rejects missing sessions and missing capability grants", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-security-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });

    const unauthenticated = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/png",
        byteSize: 4,
        visibility: "private",
      },
    });
    expect(unauthenticated.status).toBe(401);
    expect(unauthenticated.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, []);
    const session = await loginViaPasswordAndSsh(harness, identity);
    const denied = await invokeJson<ErrorResponse>(harness.app, {
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

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });

  it("TC-ASSETS-SEC-004 TC-ASSETS-SEC-005 rejects raw storage leakage and public visibility", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-leak-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["asset.create"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const publicDenied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/png",
        byteSize: 4,
        visibility: "public",
      },
    });

    expect(publicDenied.status).toBe(403);
    expect(publicDenied.body.details?.reason).toBe("public_visibility_not_approved");

    const created = await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/png",
        byteSize: 4,
        visibility: "private",
        id: "client-supplied",
      },
    });

    expect(created.status).toBe(400);
    expect(JSON.stringify(created.body)).not.toContain(storageRoot);
  });

  it("TC-ASSETS-EDGE-013 rejects unsupported MIME types and oversized SVGs before storage keys become usable", async () => {
    const storageRoot = await mkdtemp(path.join(os.tmpdir(), "kanbien-assets-limits-"));
    const harness = createRootAuthIntegrationHarness();
    mountAssetsFeature(harness.app, harness, { storageRoot });
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["asset.create"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const unsupported = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "application/pdf",
        byteSize: 4,
        visibility: "private",
      },
    });
    const oversizedSvg = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/assets/upload-intents",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeType: "root",
        kind: "image",
        contentType: "image/svg+xml",
        byteSize: 1024 * 1024 + 1,
        visibility: "private",
      },
    });

    expect(unsupported.status).toBe(400);
    expect(oversizedSvg.status).toBe(409);
  });
});
