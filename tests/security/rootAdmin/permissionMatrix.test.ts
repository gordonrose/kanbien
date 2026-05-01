import { describe, expect, it } from "vitest";

import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantAdminsRepository,
  mountTenantAdminsFeature,
} from "../../helpers/tenantAdminsHarness";
import {
  createInMemoryTenantsRepository,
  loginViaPasswordAndSsh,
  mountTenantsFeature,
} from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
}

interface MatrixRoute {
  family: string;
  capability: string;
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  path: string;
  body?: Record<string, unknown>;
}

describe("root-admin permission matrix", () => {
  it("TC-ROOT-ROLES-SEC-005 TC-ROOT-USERS-SEC-001 TC-TENANTS-SEC-002 and TC-TENANT-ADMINS-SEC-002 deny mapped protected routes when the root operator lacks the route capability", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    mountTenantAdminsFeature(harness.app, harness, {
      repository: createInMemoryTenantAdminsRepository(),
    });

    const identity = harness.seedAuthIdentity();
    const tenantAdminTenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const targetRootUser = harness.seedRootUser({
      rootUserId: "bbbbbbbb-0000-4000-8000-000000000001",
      email: "matrix-target@example.test",
      firstName: "Matrix",
      lastName: "Target",
    });
    const session = await loginViaPasswordAndSsh(harness, identity);
    const authHeaders = { authorization: `Bearer ${session.sessionId}` };

    const tenant = await invokeJson<{ tenantId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: authHeaders,
      body: {
        bizId: "matrix-tenant",
        name: "Matrix Tenant",
        category: "customer",
      },
    });
    expect(tenant.status).toBe(201);

    const tenantAdmin = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: `/v1/tenants/${tenantAdminTenantId}/admins`,
      headers: authHeaders,
      body: {
        email: "matrix-admin@example.test",
      },
    });
    expect(tenantAdmin.status).toBe(201);

    const rootRole = await invokeJson<{ rootRoleId: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: authHeaders,
      body: {
        roleKey: "MatrixRootRole",
        displayName: "Matrix Root Role",
        description: "Role used by the root-admin permission matrix.",
      },
    });
    expect(rootRole.status).toBe(201);

    const replacementRootRole = await invokeJson<{ rootRoleId: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: authHeaders,
      body: {
        roleKey: "MatrixReplacementRootRole",
        displayName: "Matrix Replacement Root Role",
        description: "Replacement role used by the root-admin permission matrix.",
      },
    });
    expect(replacementRootRole.status).toBe(201);

    const roleAssignment = await invokeJson<{ rootRoleAssignmentId: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${targetRootUser.rootUserId}/root-role-assignments`,
      headers: authHeaders,
      body: {
        rootRoleId: rootRole.body.rootRoleId,
      },
    });
    expect(roleAssignment.status).toBe(201);

    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/tenants/${tenant.body.tenantId}/delete`,
      headers: authHeaders,
      body: {},
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/tenants/${tenant.body.tenantId}/reactivate`,
      headers: authHeaders,
      body: {},
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/delete`,
      headers: authHeaders,
      body: {},
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/reactivate`,
      headers: authHeaders,
      body: {},
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/root-roles/${replacementRootRole.body.rootRoleId}/deactivate`,
      headers: authHeaders,
      body: {},
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/root-roles/${replacementRootRole.body.rootRoleId}/reactivate`,
      headers: authHeaders,
      body: {},
    });

    harness.setRootUserCapabilities(identity.rootUserId, []);

    const matrix: MatrixRoute[] = [
      {
        family: "root-auth",
        capability: "root-auth.principal.create",
        method: "POST",
        path: "/v1/root-auth/principals",
        body: {},
      },
      {
        family: "root-auth",
        capability: "root-auth.password.change.own",
        method: "POST",
        path: "/v1/root-auth/password/change",
        body: {},
      },
      {
        family: "root-auth",
        capability: "root-auth.ssh-key.create.own",
        method: "POST",
        path: "/v1/root-auth/ssh-keys",
        body: {},
      },
      {
        family: "root-auth",
        capability: "root-auth.ssh-key.read.own",
        method: "GET",
        path: "/v1/root-auth/ssh-keys",
      },
      {
        family: "root-auth",
        capability: "root-auth.ssh-key.revoke.own",
        method: "DELETE",
        path: "/v1/root-auth/ssh-keys/key-matrix",
      },
      {
        family: "root-auth",
        capability: "root-auth.session.read.own",
        method: "GET",
        path: "/v1/root-auth/sessions",
      },
      {
        family: "root-auth",
        capability: "root-auth.session.revoke.own",
        method: "POST",
        path: `/v1/root-auth/sessions/${session.sessionId}/revoke`,
        body: {},
      },
      {
        family: "root-auth",
        capability: "root-auth.session.logout.own",
        method: "POST",
        path: "/v1/root-auth/logout",
        body: {},
      },
      {
        family: "root-users",
        capability: "root-user.create",
        method: "POST",
        path: "/v1/root-users",
        body: {},
      },
      {
        family: "root-users",
        capability: "root-user.read.visible",
        method: "GET",
        path: "/v1/root-users",
      },
      {
        family: "root-users",
        capability: "root-user.read.active",
        method: "GET",
        path: "/v1/root-users/active",
      },
      {
        family: "root-users",
        capability: "root-user.read.deleted",
        method: "GET",
        path: "/v1/root-users/deleted",
      },
      {
        family: "root-users",
        capability: "root-user.update",
        method: "PATCH",
        path: `/v1/root-users/${targetRootUser.rootUserId}`,
        body: {},
      },
      {
        family: "root-users",
        capability: "root-user.delete",
        method: "DELETE",
        path: `/v1/root-users/${targetRootUser.rootUserId}`,
      },
      {
        family: "root-users",
        capability: "root-user.remove",
        method: "POST",
        path: `/v1/root-users/${targetRootUser.rootUserId}/remove`,
        body: {},
      },
      {
        family: "root-users",
        capability: "root-user.reactivate",
        method: "POST",
        path: `/v1/root-users/${targetRootUser.rootUserId}/reactivate`,
        body: {},
      },
      {
        family: "tenants",
        capability: "tenant.create",
        method: "POST",
        path: "/v1/tenants",
        body: {},
      },
      {
        family: "tenants",
        capability: "tenant.list",
        method: "GET",
        path: "/v1/tenants",
      },
      {
        family: "tenants",
        capability: "tenant.read",
        method: "GET",
        path: `/v1/tenants/${tenant.body.tenantId}`,
      },
      {
        family: "tenants",
        capability: "tenant.update",
        method: "PATCH",
        path: `/v1/tenants/${tenant.body.tenantId}`,
        body: {},
      },
      {
        family: "tenants",
        capability: "tenant.list.deleted",
        method: "GET",
        path: "/v1/tenants/deleted",
      },
      {
        family: "tenants",
        capability: "tenant.read.deleted",
        method: "GET",
        path: `/v1/tenants/deleted/${tenant.body.tenantId}`,
      },
      {
        family: "tenants",
        capability: "tenant.delete",
        method: "POST",
        path: `/v1/tenants/${tenant.body.tenantId}/delete`,
        body: {},
      },
      {
        family: "tenants",
        capability: "tenant.reactivate",
        method: "POST",
        path: `/v1/tenants/${tenant.body.tenantId}/reactivate`,
        body: {},
      },
      {
        family: "tenants",
        capability: "tenant.remove",
        method: "POST",
        path: `/v1/tenants/${tenant.body.tenantId}/remove`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.create",
        method: "POST",
        path: `/v1/tenants/${tenantAdminTenantId}/admins`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.list",
        method: "GET",
        path: `/v1/tenants/${tenantAdminTenantId}/admins`,
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.read",
        method: "GET",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}`,
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.update",
        method: "PATCH",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.verification.send",
        method: "POST",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/verification/send`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.verification.resend",
        method: "POST",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/verification/resend`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.onboarding.restart",
        method: "POST",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/onboarding/restart`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.delete",
        method: "POST",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/delete`,
        body: {},
      },
      {
        family: "tenant-admins",
        capability: "tenant-admin.reactivate",
        method: "POST",
        path: `/v1/tenants/${tenantAdminTenantId}/admins/${tenantAdmin.body.tenantAdminId}/reactivate`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.create",
        method: "POST",
        path: "/v1/root-roles",
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.list",
        method: "GET",
        path: "/v1/root-roles",
      },
      {
        family: "root-roles",
        capability: "root-role.read",
        method: "GET",
        path: `/v1/root-roles/${rootRole.body.rootRoleId}`,
      },
      {
        family: "root-roles",
        capability: "root-role.update",
        method: "PATCH",
        path: `/v1/root-roles/${rootRole.body.rootRoleId}`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.delete",
        method: "POST",
        path: `/v1/root-roles/${rootRole.body.rootRoleId}/deactivate`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.reactivate",
        method: "POST",
        path: `/v1/root-roles/${replacementRootRole.body.rootRoleId}/reactivate`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.capability-catalog.read",
        method: "GET",
        path: `/v1/root-roles/${rootRole.body.rootRoleId}/eligible-authz-capabilities`,
      },
      {
        family: "root-roles",
        capability: "root-role.capability-assignment.read",
        method: "GET",
        path: `/v1/root-roles/${rootRole.body.rootRoleId}/capability-assignments`,
      },
      {
        family: "root-roles",
        capability: "root-role.capability-assignment.update",
        method: "PUT",
        path: `/v1/root-roles/${rootRole.body.rootRoleId}/capability-assignments`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.assignment.assign",
        method: "POST",
        path: `/v1/root-users/${targetRootUser.rootUserId}/root-role-assignments`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.assignment.unassign",
        method: "POST",
        path: `/v1/root-users/${targetRootUser.rootUserId}/root-role-assignments/${roleAssignment.body.rootRoleAssignmentId}/unassign`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.assignment.list",
        method: "GET",
        path: `/v1/root-users/${targetRootUser.rootUserId}/root-roles`,
      },
      {
        family: "root-roles",
        capability: "root-role.assignment.replace",
        method: "POST",
        path: `/v1/root-users/${targetRootUser.rootUserId}/root-role-assignments/replace`,
        body: {},
      },
      {
        family: "root-roles",
        capability: "root-role.effective-permissions.read",
        method: "GET",
        path: `/v1/root-users/${targetRootUser.rootUserId}/effective-permissions`,
      },
    ];

    for (const route of matrix) {
      const response = await invokeJson<ErrorResponse>(harness.app, {
        method: route.method,
        path: route.path,
        headers: authHeaders,
        body: route.body,
      });

      expect(response.status, `${route.family} ${route.method} ${route.path} requires ${route.capability}`).toBe(403);
      expect(response.body.code, `${route.family} ${route.method} ${route.path}`).toBe("FORBIDDEN");
    }
  });
});
