import { afterEach, describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
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
  details?: { field?: string; reason?: string };
}

function snapshotPlatformSecurityConfig() {
  return {
    enabled: env.platformSecurity.enabled,
    authenticatedGeneral: { ...env.platformSecurity.rateLimitPolicies.authenticatedGeneral },
  };
}

const originalPlatformSecurityConfig = snapshotPlatformSecurityConfig();
const mutablePlatformSecurity = env.platformSecurity as {
  enabled: boolean;
  rateLimitPolicies: {
    authenticatedGeneral: { windowSeconds: number; maxAttempts: number };
  };
};

function restorePlatformSecurityConfig() {
  mutablePlatformSecurity.enabled = originalPlatformSecurityConfig.enabled;
  Object.assign(
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral,
    originalPlatformSecurityConfig.authenticatedGeneral,
  );
}

afterEach(() => {
  restorePlatformSecurityConfig();
});

describe("web app page settings security flows", () => {
  it("TC-WEB-APP-PAGE-SETTINGS-SEC-001 rejects missing sessions and enforces exact capability gates", async () => {
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

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
    });
    expect(missing.status).toBe(401);

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    harness.setRootUserCapabilities(identity.rootUserId, ["web-app-page-settings.read"]);

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
  });

  it("TC-WEB-APP-PAGE-SETTINGS-SEC-002 rejects unexpected fields and malformed options reads", async () => {
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

    const invalidUpdate = await invokeJson<ErrorResponse>(harness.app, {
      method: "PUT",
      path: "/v1/web-app-page-settings/pages/22222222-2222-4222-8222-222222222222",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        iconKey: "page-home",
        updatedAt: "2026-04-20T00:00:00.000Z",
      },
    });
    expect(invalidUpdate.status).toBe(400);
    expect(invalidUpdate.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "updatedAt",
        reason: "unexpected_field",
      },
    });

    const invalidOptions = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/web-app-page-settings/options?webAppPageId=not-a-uuid",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(invalidOptions.status).toBe(400);
    expect(invalidOptions.body.code).toBe("INVALID_REQUEST");
  });
});
