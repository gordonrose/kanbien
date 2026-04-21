import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryWebAppHierarchyRepository,
  createModuleRecord,
  createPageRecord,
  loginViaPasswordAndSsh,
} from "../../helpers/webAppHierarchyBuilderHarness";
import {
  createInMemoryWebAppPageSettingsRepository,
  createStubWebAppHierarchySettingsSeam,
  mountWebAppPageSettingsFeature,
} from "../../helpers/webAppPageSettingsHarness";

interface ErrorResponse {
  code: string;
}

describe("web app page settings audit visibility", () => {
  it("TC-WEB-PAGE-SET-AUD-001 keeps successful page-settings mutations operator-visible through deterministic responses", async () => {
    const harness = createRootAuthIntegrationHarness();
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
    });
    mountWebAppPageSettingsFeature(
      harness.app,
      harness,
      createInMemoryWebAppPageSettingsRepository(),
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const updated = await invokeJson<{
      hasStoredSettings: boolean;
      effectiveIconKey: string;
      updatedAt: string | null;
    }>(harness.app, {
      method: "PUT",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        iconKey: "page-home",
        showInTopNav: true,
      },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      hasStoredSettings: true,
      effectiveIconKey: "page-home",
    });
    expect(updated.body.updatedAt).toEqual(expect.any(String));
  });

  it("TC-WEB-PAGE-SET-AUD-002 keeps denied page-settings mutations visible through platform security audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    const hierarchyRepository = createInMemoryWebAppHierarchyRepository({
      modules: [createModuleRecord()],
      pages: [createPageRecord()],
    });
    mountWebAppPageSettingsFeature(
      harness.app,
      harness,
      createInMemoryWebAppPageSettingsRepository(),
      createStubWebAppHierarchySettingsSeam(hierarchyRepository),
    );
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-page-settings.read"]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "PUT",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        iconKey: "page-home",
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
