import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  createRootAuthIntegrationHarness,
  type RootAuthIntegrationHarness,
  type SeededAuthIdentity,
} from "../../harness/rootAuth/integrationHarness";

interface PasswordStageResponse {
  status: "SSH_CHALLENGE_REQUIRED";
  challengeId: string;
  challengeText: string;
}

interface SessionResponse {
  status: "AUTHENTICATED";
  sessionId: string;
  rootUserId: string;
}

interface RootRoleSummary {
  rootRoleId: string;
  roleKey: string;
  displayName: string;
  description: string;
  protected: boolean;
  assignable: boolean;
  deactivatedAt: string | null;
}

interface RootRoleListResponse {
  items: RootRoleSummary[];
  page: number;
  pageSize: number;
}

interface EffectivePermissionsResponse {
  rootUserId: string;
  roles: Array<{ roleKey: string }>;
  permissions: Array<{ capabilityKey: string; grantedByRoleKeys: string[] }>;
}

async function loginViaPasswordAndSsh(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
): Promise<SessionResponse> {
  const passwordResponse = await invokeJson<PasswordStageResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/password",
    body: {
      email: identity.loginEmail,
      password: identity.password,
    },
  });
  expect(passwordResponse.status).toBe(200);

  const sshResponse = await invokeJson<SessionResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/ssh",
    body: {
      challengeId: passwordResponse.body.challengeId,
      publicKeyFingerprint: identity.sshKey.fingerprint,
      signature: identity.sshKey.signChallengeText(passwordResponse.body.challengeText),
    },
  });
  expect(sshResponse.status).toBe(200);
  return sshResponse.body;
}

describe("rootRoles integration flows", () => {
  it("TC-ROOT-ROLES-INT-001 reaches protected rootRoles routes through an authenticated root session", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<RootRoleListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.items.map((item) => item.roleKey)).toContain("RootUserAdmin");
  });

  it("TC-ROOT-ROLES-INT-001 loads the bootstrap role and its eligible capability catalog by exact UUID", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const bootstrapRoleId = "00000000-0000-0000-0000-000000000001";

    const roleResponse = await invokeJson<RootRoleSummary>(harness.app, {
      method: "GET",
      path: `/v1/root-roles/${bootstrapRoleId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });

    expect(roleResponse.status).toBe(200);
    expect(roleResponse.body).toMatchObject({
      rootRoleId: bootstrapRoleId,
      roleKey: "RootUserAdmin",
    });

    const eligibleResponse = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(
      harness.app,
      {
        method: "GET",
        path: `/v1/root-roles/${bootstrapRoleId}/eligible-authz-capabilities?page=1&pageSize=100`,
        headers: {
          authorization: `Bearer ${session.sessionId}`,
        },
      },
    );

    expect(eligibleResponse.status).toBe(200);
    expect(eligibleResponse.body.items.length).toBeGreaterThan(0);
    expect(
      eligibleResponse.body.items.some((item) => item.capabilityKey === "root-role.read"),
    ).toBe(true);
  });

  it("TC-ROOT-ROLES-INT-002 assigns a new role to an eligible root user and exposes effective permissions through the rootUsers seam", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const target = harness.seedRootUser({
      rootUserId: "22222222-2222-4222-8222-222222222222",
      email: "target@example.test",
      firstName: "Target",
      lastName: "User",
    });
    const session = await loginViaPasswordAndSsh(harness, identity);

    const createdRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        roleKey: "RootUserReadOnly",
        displayName: "Root User Read Only",
        description: "Read-only root role",
      },
    });
    expect(createdRole.status).toBe(201);

    const updatedGrants = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/capability-assignments`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        capabilityKeys: ["root-user.read.visible", "root-role.read"],
      },
    });
    expect(updatedGrants.status).toBe(200);

    const assigned = await invokeJson<{ rootUserId: string; roleKey: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        rootRoleId: createdRole.body.rootRoleId,
      },
    });
    expect(assigned.status).toBe(201);
    expect(assigned.body.rootUserId).toBe(target.rootUserId);

    const effective = await invokeJson<EffectivePermissionsResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${target.rootUserId}/effective-permissions`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(effective.status).toBe(200);
    expect(effective.body.permissions.map((item) => item.capabilityKey)).toEqual(
      expect.arrayContaining(["root-user.read.visible", "root-role.read"]),
    );
  });

  it("TC-ROOT-ROLES-INT-003 and TC-ROOT-ROLES-EDGE-003 retire roles from future assignment while keeping existing effective access inspectable", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const target = harness.seedRootUser({
      rootUserId: "44444444-4444-4444-8444-444444444444",
      email: "lifecycle-target@example.test",
      firstName: "Lifecycle",
      lastName: "Target",
    });
    const session = await loginViaPasswordAndSsh(harness, identity);

    const createdRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserLifecycle",
        displayName: "Root User Lifecycle",
        description: "Lifecycle-focused role",
      },
    });
    expect(createdRole.status).toBe(201);

    const updatedGrants = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/capability-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        capabilityKeys: ["root-user.read.visible", "root-role.read"],
      },
    });
    expect(updatedGrants.status).toBe(200);

    const assigned = await invokeJson<{ rootRoleAssignmentId: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { rootRoleId: createdRole.body.rootRoleId },
    });
    expect(assigned.status).toBe(201);

    const deactivated = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/deactivate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(deactivated.status).toBe(200);
    expect(deactivated.body.assignable).toBe(false);

    const duplicateAfterDeactivate = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { rootRoleId: createdRole.body.rootRoleId },
    });
    expect(duplicateAfterDeactivate.status).toBe(409);
    expect(duplicateAfterDeactivate.body.code).toBe("ROOT_ROLE_INACTIVE");

    const effective = await invokeJson<EffectivePermissionsResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${target.rootUserId}/effective-permissions`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(effective.status).toBe(200);
    expect(effective.body.permissions.map((item) => item.capabilityKey)).toEqual(
      expect.arrayContaining(["root-user.read.visible", "root-role.read"]),
    );

    const assignmentList = await invokeJson<{ items: Array<{ rootRoleAssignmentId: string }> }>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${target.rootUserId}/root-roles`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(assignmentList.status).toBe(200);
    expect(assignmentList.body.items).toEqual(
      expect.arrayContaining([
      expect.objectContaining({ rootRoleAssignmentId: assigned.body.rootRoleAssignmentId }),
      ]),
    );
  });

  it("TC-ROOT-ROLES-INT-004 atomically replaces one root-role assignment with another without leaving the target user unassigned", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const target = harness.seedRootUser({
      rootUserId: "55555555-5555-4555-8555-555555555555",
      email: "replace-target@example.test",
      firstName: "Replace",
      lastName: "Target",
    });
    const session = await loginViaPasswordAndSsh(harness, identity);

    const sourceRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserSource",
        displayName: "Root User Source",
        description: "Source role",
      },
    });
    expect(sourceRole.status).toBe(201);

    const targetRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserTarget",
        displayName: "Root User Target",
        description: "Target role",
      },
    });
    expect(targetRole.status).toBe(201);

    await invokeJson(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${sourceRole.body.rootRoleId}/capability-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { capabilityKeys: ["root-user.read.visible"] },
    });
    await invokeJson(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${targetRole.body.rootRoleId}/capability-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { capabilityKeys: ["root-user.read.active", "root-role.read"] },
    });

    const assigned = await invokeJson<{ rootRoleAssignmentId: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { rootRoleId: sourceRole.body.rootRoleId },
    });
    expect(assigned.status).toBe(201);

    const replaced = await invokeJson<EffectivePermissionsResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments/replace`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        sourceRootRoleAssignmentId: assigned.body.rootRoleAssignmentId,
        targetRootRoleId: targetRole.body.rootRoleId,
      },
    });
    expect(replaced.status).toBe(200);
    expect(replaced.body.roles.map((item) => item.roleKey)).toEqual(
      expect.arrayContaining(["RootUserAdmin", "RootUserTarget"]),
    );
    expect(replaced.body.permissions.map((item) => item.capabilityKey)).toEqual(
      expect.arrayContaining(["root-user.read.active", "root-role.read"]),
    );
  });
});
