import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { createOrganizationRecord, createInMemoryOrganizationCoreRepository } from "../../helpers/organizationCoreHarness";
import {
  MemoryLegalProfileRepository,
  mountRootOrganizationLegalDetailsFeature,
} from "../../helpers/organizationLegalDetailsHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  details?: {
    field?: string;
    reason?: string;
  };
}

describe("organizationLegalDetails security", () => {
  it("TC-ORG-S005-SEC-001 requires root authentication and legal-profile capabilities", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const organizationId = "22222222-2222-4222-8222-222222222222";
    mountRootOrganizationLegalDetailsFeature(
      harness.app,
      harness,
      createInMemoryOrganizationCoreRepository([createOrganizationRecord({ tenantId, organizationId })]),
      new MemoryLegalProfileRepository(),
    );

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/legal-profiles`,
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const allowed = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/legal-profiles`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.legal-profile.manage"]);
    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/legal-profiles`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-ORG-S005-SEC-002 rejects system-managed and malformed legal-profile fields", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const organizationId = "22222222-2222-4222-8222-222222222222";
    mountRootOrganizationLegalDetailsFeature(
      harness.app,
      harness,
      createInMemoryOrganizationCoreRepository([createOrganizationRecord({ tenantId, organizationId })]),
      new MemoryLegalProfileRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/legal-profiles`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        legalProfileId: "11111111-1111-4111-8111-111111111111",
        legalName: "Legal Name Ltd",
      },
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: "ORGANIZATION_LEGAL_PROFILE_INVALID_REQUEST",
      details: {
        field: "legalProfileId",
        reason: "unexpected_field",
      },
    });
  });
});
