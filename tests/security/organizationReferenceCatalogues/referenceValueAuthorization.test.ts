import { describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
import type { OrganizationReferenceCataloguesService } from "../../../src/features/organizationReferenceCatalogues/domain/service";
import { createRootOrganizationReferenceCataloguesRouter } from "../../../src/features/organizationReferenceCatalogues/transport/router";
import { createRequireRootSession } from "../../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  details?: {
    field?: string;
    reason?: string;
  };
}

function createStubService(): OrganizationReferenceCataloguesService {
  const now = new Date().toISOString();
  return {
    async createReferenceValue(input) {
      return {
        referenceValueId: "11111111-1111-4111-8111-111111111111",
        referenceType: input.referenceType,
        referenceValueKey: input.referenceValueKey,
        label: input.label,
        replacementReferenceValueId: null,
        lifecycleStatus: "active",
        archivedAt: null,
        deprecatedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    },
    async listReferenceValues(input) {
      return { items: [], page: input.page, pageSize: input.pageSize, totalPages: 1, totalMatchingRecords: 0, totalSearchableRecords: 0 };
    },
    async updateReferenceValueLabel(input) {
      return {
        referenceValueId: input.referenceValueId,
        referenceType: "organization_type",
        referenceValueKey: "charity",
        label: input.label,
        replacementReferenceValueId: null,
        lifecycleStatus: "active",
        archivedAt: null,
        deprecatedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    },
    async archiveReferenceValue(input) {
      return {
        referenceValueId: input.referenceValueId,
        referenceType: "organization_type",
        referenceValueKey: "charity",
        label: "Charity",
        replacementReferenceValueId: null,
        lifecycleStatus: "archived",
        archivedAt: now,
        deprecatedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    },
    async deprecateReferenceValue(input) {
      return {
        referenceValueId: input.referenceValueId,
        referenceType: "organization_type",
        referenceValueKey: "charity",
        label: "Charity",
        replacementReferenceValueId: null,
        lifecycleStatus: "deprecated",
        archivedAt: null,
        deprecatedAt: now,
        createdAt: now,
        updatedAt: now,
      };
    },
    async replaceReferenceValue(input) {
      return {
        referenceValueId: input.referenceValueId,
        referenceType: "organization_type",
        referenceValueKey: "charity",
        label: "Charity",
        replacementReferenceValueId: input.replacementReferenceValueId,
        lifecycleStatus: "replaced",
        archivedAt: null,
        deprecatedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    },
    async assertReferenceValueUsable(referenceValueId) {
      return {
        referenceValueId,
        referenceType: "organization_type",
        referenceValueKey: "charity",
        label: "Charity",
        replacementReferenceValueId: null,
        lifecycleStatus: "active",
        archivedAt: null,
        deprecatedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    },
  };
}

describe("organizationReferenceCatalogues security", () => {
  it("TC-ORG-FOUNDATION-SEC-003 requires root manage capability for reference-value mutation", async () => {
    const harness = createRootAuthIntegrationHarness();
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
      "/v1/root-admin/organization-reference-values",
      requireRootSession,
      authenticatedGeneralRateLimit,
      createRootOrganizationReferenceCataloguesRouter(
        createStubService(),
        capabilityChecker,
        harness.platformSecurityRepository,
      ),
    );

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-admin/organization-reference-values",
      body: { referenceType: "organization_type", referenceValueKey: "charity", label: "Charity" },
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    harness.setRootUserCapabilities(identity.rootUserId, ["organization.reference-value.read"]);
    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-admin/organization-reference-values",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { referenceType: "organization_type", referenceValueKey: "charity", label: "Charity" },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.reference-value.manage"]);
    const allowed = await invokeJson<{ referenceValueId: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-admin/organization-reference-values",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { referenceType: "organization_type", referenceValueKey: "charity", label: "Charity" },
    });
    expect(allowed.status).toBe(201);
    expect(allowed.body.referenceValueId).toBe("11111111-1111-4111-8111-111111111111");
  });
});
