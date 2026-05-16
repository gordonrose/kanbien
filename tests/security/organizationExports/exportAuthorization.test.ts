import { describe, expect, it, vi } from "vitest";
import type { OrganizationExportsService } from "../../../src/features/organizationExports";
import { createRootOrganizationExportsRouter } from "../../../src/features/organizationExports/transport/router";
import { createRequireRootSession } from "../../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { env } from "../../../src/config/env";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

function mountRootExports(harness: ReturnType<typeof createRootAuthIntegrationHarness>) {
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
      request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };
  const service = {
    createExport: vi.fn(async () => ({ organizationExportId: "export-1", status: "queued" })),
  } as unknown as OrganizationExportsService;
  harness.app.use(
    "/v1/root-admin/tenants/:tenantId/organization-exports",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createRootOrganizationExportsRouter(service, capabilityChecker, harness.platformSecurityRepository),
  );
  return service;
}

describe("organizationExports authorization", () => {
  it("TC-ORG-S015-SEC-001 requires root authentication and export capability", async () => {
    const harness = createRootAuthIntegrationHarness();
    const service = mountRootExports(harness);
    const path = "/v1/root-admin/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/organization-exports";
    const body = {
      sourceOrganizationId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      selectedSections: ["organizations"],
      visibilityScope: "current_only",
      organizationScope: "selected_organization_only",
    };

    const missing = await invokeJson<{ code: string }>(harness.app, { method: "POST", path, body });
    expect(missing.status).toBe(401);

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    harness.setRootUserCapabilities(identity.rootUserId, ["organization.root.search"]);
    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path,
      body,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.root.export.manage"]);
    const allowed = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path,
      body,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(202);
    expect(allowed.body.status).toBe("queued");
    expect(service.createExport).toHaveBeenCalledOnce();
  });
});
