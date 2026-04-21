import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppSurfaceDiscoveryRepository,
  createStaticDiscoveryProvider,
  mountWebAppSurfaceDiscoveryFeature,
} from "../../helpers/webAppSurfaceDiscoveryHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

describe("webAppSurfaceDiscovery security flows", () => {
  it("TC-WEB-APP-SURF-DISC-SEC-001 rejects missing authenticated sessions on protected discovery routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [createStaticDiscoveryProvider("login-empty-provider", "login", [])],
    );

    const missing = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/surfaces",
    });

    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const missingStructure = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/structure",
    });

    expect(missingStructure.status).toBe(401);
    expect(missingStructure.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-WEB-APP-SURF-DISC-SEC-003 denies privileged discovery run without the required capability and keeps denial audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [createStaticDiscoveryProvider("login-empty-provider", "login", [])],
    );
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-surface-discovery.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-surface-discovery/runs",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
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

  it("TC-WEB-APP-SURF-DISC-SEC-004 rejects unexpected system-managed fields supplied by clients", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [createStaticDiscoveryProvider("login-empty-provider", "login", [])],
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const invalid = await invokeJson<{ code: string; details?: { field?: string; reason?: string } }>(
      harness.app,
      {
        method: "POST",
        path: "/v1/web-app-surface-discovery/runs",
        headers: { authorization: `Bearer ${session.sessionId}` },
        body: {
          scopeKey: "current-approved-root-families",
          triggerKind: "manual",
          webAppDiscoveryRunId: "11111111-1111-4111-8111-111111111111",
        },
      },
    );

    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "webAppDiscoveryRunId",
        reason: "unexpected_field",
      },
    });
  });

  it("TC-WEB-APP-SURF-DISC-SEC-002 denies structure-tree reads without the required structure-read capability", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [createStaticDiscoveryProvider("login-empty-provider", "login", [])],
    );
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-surface-discovery.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/web-app-surface-discovery/structure",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });
});
