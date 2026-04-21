import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppSurfaceDiscoveryRepository,
  createStaticDiscoveryProvider,
  mountWebAppSurfaceDiscoveryFeature,
} from "../../helpers/webAppSurfaceDiscoveryHarness";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

describe("webAppSurfaceDiscovery audit visibility", () => {
  it("TC-WEB-APP-SURF-DISC-AUD-001 keeps successful discovery runs operator-visible through deterministic run responses", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountWebAppSurfaceDiscoveryFeature(
      harness.app,
      harness,
      createInMemoryWebAppSurfaceDiscoveryRepository(),
      [
        createStaticDiscoveryProvider("design-system-file-routes", "design-system", [
          {
            rootFamilyId: "design-system",
            surfaceKind: "page-route",
            locatorType: "path",
            routePath: "/design-system/components/top-nav",
            routeHash: null,
            canonicalLocator: "/design-system/components/top-nav",
            displayLabel: "Top Nav",
            userFacingDisposition: "user-facing",
            providerKey: "design-system-file-routes",
            implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
          },
        ]),
      ],
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{
      status: string;
      createdCount: number;
      structureCreatedCount: number;
    }>(harness.app, {
      method: "POST",
      path: "/v1/web-app-surface-discovery/runs",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
      },
    });

    expect(created.status).toBe(200);
    expect(created.body.status).toBe("succeeded");
    expect(created.body.createdCount).toBe(1);
    expect(created.body.structureCreatedCount).toBeGreaterThan(0);
  });

  it("TC-WEB-APP-SURF-DISC-AUD-002 keeps denied privileged discovery actions visible through platform security audit events", async () => {
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
          authPrincipalId: identity.authPrincipalId,
        }),
      ]),
    );
  });
});
