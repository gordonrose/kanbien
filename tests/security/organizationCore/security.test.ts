import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";
import {
  createInMemoryOrganizationCoreRepository,
  mountRootOrganizationCoreFeature,
} from "../../helpers/organizationCoreHarness";

interface ErrorResponse {
  code: string;
  details?: {
    field?: string;
    reason?: string;
  };
}

describe("organizationCore security", () => {
  it("TC-ORG-S004-SEC-001 requires root authentication and per-route organization capabilities", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountRootOrganizationCoreFeature(
      harness.app,
      harness,
      createInMemoryOrganizationCoreRepository(),
    );
    const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/${tenantId}/organizations`,
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const allowed = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: `/v1/root-admin/tenants/${tenantId}/organizations`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["organization.read"]);
    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/${tenantId}/organizations`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-ORG-S004-SEC-002 rejects system-managed and malformed organization fields", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountRootOrganizationCoreFeature(
      harness.app,
      harness,
      createInMemoryOrganizationCoreRepository(),
    );
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/organizations",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        organizationId: "11111111-1111-4111-8111-111111111111",
        name: "Org",
      },
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "organizationId",
        reason: "unexpected_field",
      },
    });
  });
});
