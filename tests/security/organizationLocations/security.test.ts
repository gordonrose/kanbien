import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { createOrganizationRecord, createInMemoryOrganizationCoreRepository } from "../../helpers/organizationCoreHarness";
import {
  MemoryLocationRepository,
  mountRootOrganizationLocationsFeature,
} from "../../helpers/organizationLocationsHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  details?: {
    field?: string;
    reason?: string;
  };
}

describe("organizationLocations security", () => {
  it("TC-ORG-S005-SEC-001 requires root authentication and location capabilities", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const organizationId = "22222222-2222-4222-8222-222222222222";
    mountRootOrganizationLocationsFeature(
      harness.app,
      harness,
      createInMemoryOrganizationCoreRepository([createOrganizationRecord({ tenantId, organizationId })]),
      new MemoryLocationRepository(),
    );

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations`,
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const allowed = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.location.manage"]);
    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-ORG-S005-SEC-002 rejects system-managed and malformed location fields", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const organizationId = "22222222-2222-4222-8222-222222222222";
    mountRootOrganizationLocationsFeature(
      harness.app,
      harness,
      createInMemoryOrganizationCoreRepository([createOrganizationRecord({ tenantId, organizationId })]),
      new MemoryLocationRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-admin/tenants/${tenantId}/organizations/${organizationId}/locations`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        locationId: "11111111-1111-4111-8111-111111111111",
        locationName: "Legal Name Ltd",
      },
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: "ORGANIZATION_LOCATION_INVALID_REQUEST",
      details: {
        field: "locationId",
        reason: "unexpected_field",
      },
    });
  });
});
