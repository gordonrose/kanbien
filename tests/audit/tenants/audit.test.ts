import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantsRepository,
  loginViaPasswordAndSsh,
  mountTenantsFeature,
} from "../../helpers/tenantsHarness";

interface TenantResponse {
  tenantId: string;
  bizId: string;
  name: string;
  category: "customer" | "demo" | "test";
  status: "draft" | "live" | "disabled" | "inactive";
  createdByRootAdminUserId: string;
  deletedAt: string | null;
  updatedAt: string;
}

interface TenantListResponse {
  items: TenantResponse[];
  page: number;
  pageSize: number;
}

interface ErrorResponse {
  code: string;
}

describe("tenants audit visibility", () => {
  it("TC-TENANTS-AUD-001 keeps successful tenant lifecycle mutations operator-visible through authenticated backend responses", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        bizId: "audit-tenant",
        name: "Audit Tenant",
        category: "customer",
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.createdByRootAdminUserId).toBe(identity.rootUserId);

    const updated = await invokeJson<TenantResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/tenants/${created.body.tenantId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        status: "live",
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("live");

    const deleted = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${created.body.tenantId}/delete`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body.deletedAt).not.toBeNull();

    const deletedList = await invokeJson<TenantListResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants/deleted",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deletedList.status).toBe(200);
    expect(deletedList.body.items.map((item) => item.tenantId)).toContain(created.body.tenantId);

    const reactivated = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${created.body.tenantId}/reactivate`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(reactivated.status).toBe(200);
    expect(reactivated.body.deletedAt).toBeNull();

    const removed = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${created.body.tenantId}/remove`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        confirm: true,
        reason: "cleanup audit tenant",
      },
    });
    expect(removed.status).toBe(200);
  });

  it("TC-TENANTS-AUD-002 keeps denied privileged tenant actions visible through platform security audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["tenant.read"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        bizId: "denied-tenant",
        name: "Denied Tenant",
        category: "customer",
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
          ipAddress: "127.0.0.1",
        }),
      ]),
    );
  });
});
