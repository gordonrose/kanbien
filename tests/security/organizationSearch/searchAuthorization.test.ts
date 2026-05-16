import { describe, expect, it } from "vitest";
import type { OrganizationSearchRepository } from "../../../src/features/organizationSearch/persistence/types";
import { createOrganizationSearchService } from "../../../src/features/organizationSearch/domain/service";
import { createRootOrganizationSearchRouter } from "../../../src/features/organizationSearch/transport/router";
import { createRequireRootSession } from "../../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { env } from "../../../src/config/env";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

function createEmptySearchRepository(): OrganizationSearchRepository {
  return {
    async search(input) {
      return [
        {
          resultType: input.resultType ?? "organizations",
          items: [],
          totalMatchingRecords: 0,
        },
      ];
    },
  };
}

function mountRootSearch(harness: ReturnType<typeof createRootAuthIntegrationHarness>) {
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
  harness.app.use(
    "/v1/root-admin/tenants/:tenantId/organization-search",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createRootOrganizationSearchRouter(
      createOrganizationSearchService(createEmptySearchRepository()),
      capabilityChecker,
      harness.platformSecurityRepository,
    ),
  );
}

describe("organizationSearch authorization", () => {
  it("TC-ORG-S013-SEC-001 requires root authentication and organization search capability", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountRootSearch(harness);
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

    const missing = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organization-search`,
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.read"]);
    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organization-search`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.root.search"]);
    const allowed = await invokeJson<{ groups: unknown[] }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organization-search`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);
    expect(allowed.body.groups).toHaveLength(9);
  });

  it("TC-ORG-S013-SEC-002 rejects unsupported filters instead of silently applying browser-only filtering", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountRootSearch(harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<{ code: string; details?: { field?: string; reason?: string } }>(
      harness.app,
      {
        method: "GET",
        path:
          "/v1/root-admin/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/organization-search?unsupported=value",
        headers: { authorization: `Bearer ${session.sessionId}` },
      },
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: "ORGANIZATION_SEARCH_INVALID_REQUEST",
      details: { field: "unsupported", reason: "unsupported_filter" },
    });
  });
});

