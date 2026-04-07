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
}

interface TenantListResponse {
  items: Array<{
    tenantId: string;
    bizId: string;
    name: string;
    category: "customer" | "demo" | "test";
    status: "draft" | "live" | "disabled" | "inactive";
    deletedAt: string | null;
    createdByRootAdminUserId?: string;
  }>;
  page: number;
  pageSize: number;
}

describe("tenants integration flows", () => {
  it("TC-TENANTS-INT-001 TC-TENANTS-INT-002 and TC-TENANTS-INT-003 create, mount, delete, reactivate, and remove tenant routes through an authenticated root session", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const createResponse = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "Tenant-Alpha",
        name: "Tenant Alpha",
        category: "customer",
      },
    });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      bizId: "tenant-alpha",
      status: "draft",
      createdByRootAdminUserId: identity.rootUserId,
    });

    const listResponse = await invokeJson<TenantListResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items[0]?.createdByRootAdminUserId).toBeUndefined();

    const exactResponse = await invokeJson<TenantResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/${createResponse.body.tenantId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(exactResponse.status).toBe(200);
    expect(exactResponse.body.createdByRootAdminUserId).toBe(identity.rootUserId);

    const deletedResponse = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${createResponse.body.tenantId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(deletedResponse.status).toBe(200);
    expect(deletedResponse.body.status).toBe("inactive");
    expect(deletedResponse.body.deletedAt).not.toBeNull();

    const deletedExact = await invokeJson<TenantResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/deleted/${createResponse.body.tenantId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(deletedExact.status).toBe(200);

    const reactivated = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${createResponse.body.tenantId}/reactivate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(reactivated.status).toBe(200);
    expect(reactivated.body.status).toBe("draft");
    expect(reactivated.body.deletedAt).toBeNull();

    const removed = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${createResponse.body.tenantId}/remove`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        confirm: true,
        reason: "cleanup test tenant",
      },
    });
    expect(removed.status).toBe(200);

    const afterRemove = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: `/v1/tenants/${createResponse.body.tenantId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(afterRemove.status).toBe(404);
    expect(afterRemove.body.code).toBe("TENANT_NOT_FOUND");
  });

  it("TC-TENANTS-INT-004 keeps visible and deleted list filters separated", async () => {
    const harness = createRootAuthIntegrationHarness();
    const repository = createInMemoryTenantsRepository();
    mountTenantsFeature(harness.app, harness, repository);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const active = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "customer-live",
        name: "Customer Live",
        category: "customer",
        status: "live",
      },
    });
    expect(active.status).toBe(201);

    const deleted = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "demo-disabled",
        name: "Demo Disabled",
        category: "demo",
        status: "disabled",
      },
    });
    expect(deleted.status).toBe(201);

    await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${deleted.body.tenantId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    const visibleList = await invokeJson<TenantListResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants?category=customer&status=live",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(visibleList.status).toBe(200);
    expect(visibleList.body.items.map((item) => item.tenantId)).toEqual([active.body.tenantId]);

    const deletedList = await invokeJson<TenantListResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants/deleted?category=demo&status=inactive",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(deletedList.status).toBe(200);
    expect(deletedList.body.items.map((item) => item.tenantId)).toEqual([
      deleted.body.tenantId,
    ]);
  });

  it("TC-TENANTS-EDGE-003 and TC-TENANTS-EDGE-004 keep remove distinct from soft delete and preserve pagination defaults", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "tenant-edge",
        name: "Tenant Edge",
        category: "customer",
      },
    });
    expect(created.status).toBe(201);

    const defaultList = await invokeJson<TenantListResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(defaultList.status).toBe(200);
    expect(defaultList.body.page).toBe(1);
    expect(defaultList.body.pageSize).toBe(25);

    await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${created.body.tenantId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    const deletedExact = await invokeJson<TenantResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/deleted/${created.body.tenantId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(deletedExact.status).toBe(200);

    await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${created.body.tenantId}/remove`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        confirm: true,
        reason: "remove after soft delete",
      },
    });

    const deletedAfterRemove = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: `/v1/tenants/deleted/${created.body.tenantId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(deletedAfterRemove.status).toBe(404);
    expect(deletedAfterRemove.body.code).toBe("TENANT_NOT_FOUND");
  });
});
