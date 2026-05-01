import { describe, expect, it } from "vitest";

import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantsRepository,
  loginViaPasswordAndSsh,
  mountTenantsFeature,
} from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  message: string;
}

interface RootUserResponse {
  rootUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  anonymized: boolean;
  status: "active" | "inactive";
  deletedAt: string | null;
}

interface RootUserListResponse {
  items: RootUserResponse[];
}

interface TenantResponse {
  tenantId: string;
  bizId: string;
  status: string;
}

interface RootRoleSummary {
  rootRoleId: string;
  roleKey: string;
}

describe("root-admin operator e2e journeys", () => {
  it("JY-ROOT-ADMIN-001 completes a root operator session across root-users, tenants, and root-roles seams", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const target = harness.seedRootUser({
      rootUserId: "77777777-7777-4777-8777-777777777777",
      email: "journey-target@example.test",
      firstName: "Journey",
      lastName: "Target",
    });
    const session = await loginViaPasswordAndSsh(harness, identity);
    const authHeaders = { authorization: `Bearer ${session.sessionId}` };

    const createdRootUser = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: authHeaders,
      body: {
        email: "Journey.Created@Example.test",
        firstName: "Journey",
        lastName: "Created",
      },
    });
    expect(createdRootUser.status).toBe(201);
    expect(createdRootUser.body.email).toBe("journey.created@example.test");

    const listedRootUsers = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users?pageSize=100",
      headers: authHeaders,
    });
    expect(listedRootUsers.status).toBe(200);
    expect(listedRootUsers.body.items.map((item) => item.rootUserId)).toEqual(
      expect.arrayContaining([identity.rootUserId, target.rootUserId, createdRootUser.body.rootUserId]),
    );

    const createdTenant = await invokeJson<TenantResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: authHeaders,
      body: {
        bizId: "Journey-Tenant",
        name: "Journey Tenant",
        category: "customer",
      },
    });
    expect(createdTenant.status).toBe(201);
    expect(createdTenant.body).toMatchObject({
      bizId: "journey-tenant",
      status: "draft",
    });

    const createdRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: authHeaders,
      body: {
        roleKey: "JourneyRootReader",
        displayName: "Journey Root Reader",
        description: "Journey e2e read role",
      },
    });
    expect(createdRole.status).toBe(201);

    const grantUpdate = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/capability-assignments`,
      headers: authHeaders,
      body: {
        capabilityKeys: ["root-user.read.visible", "root-role.read"],
      },
    });
    expect(grantUpdate.status).toBe(200);

    const assigned = await invokeJson<{ rootUserId: string; roleKey: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: authHeaders,
      body: {
        rootRoleId: createdRole.body.rootRoleId,
      },
    });
    expect(assigned.status).toBe(201);
    expect(assigned.body).toMatchObject({
      rootUserId: target.rootUserId,
      roleKey: "JourneyRootReader",
    });

    const logout = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/logout",
      headers: authHeaders,
    });
    expect(logout.status).toBe(200);

    const afterLogout = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: authHeaders,
    });
    expect(afterLogout.status).toBe(401);
    expect(afterLogout.body.code).toBe("INVALID_SESSION");
  });

  it("JY-ROOT-ADMIN-002 denies root-admin object access for missing session and missing capability states", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, [
      "root-auth.password.change.own",
      "root-auth.session.read.own",
      "root-auth.session.logout.own",
    ]);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const missingSession = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
    });
    expect(missingSession.status).toBe(401);
    expect(missingSession.body.code).toBe("UNAUTHORIZED");

    const missingRootUserCapability = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(missingRootUserCapability.status).toBe(403);
    expect(missingRootUserCapability.body.code).toBe("FORBIDDEN");

    const missingTenantCapability = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "Denied-Tenant",
        name: "Denied Tenant",
        category: "customer",
      },
    });
    expect(missingTenantCapability.status).toBe(403);
    expect(missingTenantCapability.body.code).toBe("FORBIDDEN");
  });

  it("TC-ROOT-USERS-E2E-001 and JY-ROOT-ADMIN-003 prove root-users lifecycle readback and denied capability states", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const authHeaders = { authorization: `Bearer ${session.sessionId}` };

    const created = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: authHeaders,
      body: {
        email: "Lifecycle.Root@Example.test",
        firstName: "Lifecycle",
        lastName: "Original",
      },
    });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      email: "lifecycle.root@example.test",
      firstName: "Lifecycle",
      lastName: "Original",
      anonymized: false,
      status: "active",
      deletedAt: null,
    });

    const updated = await invokeJson<RootUserResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: authHeaders,
      body: {
        firstName: "Lifecycle",
        lastName: "Updated",
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      rootUserId: created.body.rootUserId,
      firstName: "Lifecycle",
      lastName: "Updated",
    });

    const exactRead = await invokeJson<RootUserResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: authHeaders,
    });
    expect(exactRead.status).toBe(200);
    expect(exactRead.body.lastName).toBe("Updated");

    const visibleList = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users?pageSize=100",
      headers: authHeaders,
    });
    expect(visibleList.status).toBe(200);
    expect(visibleList.body.items.map((item) => item.rootUserId)).toContain(created.body.rootUserId);

    const deleted = await invokeJson<RootUserResponse>(harness.app, {
      method: "DELETE",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: authHeaders,
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body.deletedAt).not.toBeNull();

    const hiddenAfterDelete = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: authHeaders,
    });
    expect(hiddenAfterDelete.status).toBe(404);
    expect(hiddenAfterDelete.body.code).toBe("ROOT_USER_NOT_FOUND");

    const deletedList = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users/deleted?pageSize=100",
      headers: authHeaders,
    });
    expect(deletedList.status).toBe(200);
    expect(deletedList.body.items.map((item) => item.rootUserId)).toContain(created.body.rootUserId);

    const reactivated = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${created.body.rootUserId}/reactivate`,
      headers: authHeaders,
      body: {},
    });
    expect(reactivated.status).toBe(200);
    expect(reactivated.body.deletedAt).toBeNull();

    const removed = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${created.body.rootUserId}/remove`,
      headers: authHeaders,
      body: {},
    });
    expect(removed.status).toBe(200);
    expect(removed.body.anonymized).toBe(true);

    const deniedReactivation = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${created.body.rootUserId}/reactivate`,
      headers: authHeaders,
      body: {},
    });
    expect(deniedReactivation.status).toBe(409);
    expect(deniedReactivation.body.code).toBe("ROOT_USER_ALREADY_ANONYMIZED");

    const limitedIdentity = harness.seedAuthIdentity({
      rootUser: {
        rootUserId: "88888888-8888-4888-8888-888888888888",
        email: "limited-root@example.test",
        firstName: "Limited",
        lastName: "Root",
      },
      loginEmail: "limited-root@example.test",
    });
    harness.setRootUserCapabilities(limitedIdentity.rootUserId, [
      "root-auth.password.change.own",
      "root-auth.session.read.own",
      "root-auth.session.logout.own",
      "root-user.read.visible",
    ]);
    const limitedSession = await loginViaPasswordAndSsh(harness, limitedIdentity);

    const deniedUpdate = await invokeJson<ErrorResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/root-users/${identity.rootUserId}`,
      headers: { authorization: `Bearer ${limitedSession.sessionId}` },
      body: {
        firstName: "Denied",
      },
    });
    expect(deniedUpdate.status).toBe(403);
    expect(deniedUpdate.body.code).toBe("FORBIDDEN");
  });
});
