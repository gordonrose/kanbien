import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  createRootAuthIntegrationHarness,
  type RootAuthIntegrationHarness,
  type RootRoleAuditEventRecord,
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
}

interface AssignmentSummary {
  rootRoleAssignmentId: string;
  rootUserId: string;
  rootRoleId: string;
  roleKey: string;
}

interface ErrorResponse {
  code: string;
}

function findRootRoleEvents(
  harness: RootAuthIntegrationHarness,
  eventType: string,
): RootRoleAuditEventRecord[] {
  return harness.getRootRoleAuditEvents().filter((event) => event.eventType === eventType);
}

function findSecurityEvents(
  harness: RootAuthIntegrationHarness,
  eventType: string,
) {
  return harness.getSecurityAuditEvents().filter((event) => event.eventType === eventType);
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

describe("rootRoles audit visibility", () => {
  it("TC-ROOT-ROLES-AUD-001 writes durable audit evidence for root-role and assignment mutations", async () => {
    const harness = createRootAuthIntegrationHarness();
    const actor = harness.seedAuthIdentity();
    const target = harness.seedRootUser({
      rootUserId: "33333333-3333-4333-8333-333333333333",
      email: "audit-target@example.test",
      firstName: "Audit",
      lastName: "Target",
    });
    const session = await loginViaPasswordAndSsh(harness, actor);

    const createdRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserAuditor",
        displayName: "Root User Auditor",
        description: "Read focused root role",
      },
    });
    expect(createdRole.status).toBe(201);

    const updatedRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "PATCH",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        displayName: "Root User Auditor Updated",
      },
    });
    expect(updatedRole.status).toBe(200);

    const updatedGrants = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/capability-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        capabilityKeys: ["root-user.read.visible", "root-role.read"],
        reason: "prepare read-only audit role",
      },
    });
    expect(updatedGrants.status).toBe(200);

    const assigned = await invokeJson<AssignmentSummary>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootRoleId: createdRole.body.rootRoleId,
        reason: "grant audit access",
      },
    });
    expect(assigned.status).toBe(201);

    const replacementRole = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserSupport",
        displayName: "Root User Support",
        description: "Support-focused root role",
      },
    });
    expect(replacementRole.status).toBe(201);

    const replacementGrants = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "PUT",
      path: `/v1/root-roles/${replacementRole.body.rootRoleId}/capability-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        capabilityKeys: ["root-user.read.active"],
        reason: "prepare support role",
      },
    });
    expect(replacementGrants.status).toBe(200);

    const replaced = await invokeJson<{ permissions: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments/replace`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        sourceRootRoleAssignmentId: assigned.body.rootRoleAssignmentId,
        targetRootRoleId: replacementRole.body.rootRoleId,
        reason: "promote to support role",
      },
    });
    expect(replaced.status).toBe(200);

    const deactivated = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/deactivate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(deactivated.status).toBe(200);

    const reactivated = await invokeJson<RootRoleSummary>(harness.app, {
      method: "POST",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/reactivate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(reactivated.status).toBe(200);

    expect(findRootRoleEvents(harness, "root_role_created")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          rootRoleId: createdRole.body.rootRoleId,
          eventOutcome: "success",
        }),
      ]),
    );
    expect(findRootRoleEvents(harness, "root_role_updated")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          rootRoleId: createdRole.body.rootRoleId,
          eventOutcome: "success",
        }),
      ]),
    );
    expect(findRootRoleEvents(harness, "root_role_capability_grants_replaced")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          rootRoleId: createdRole.body.rootRoleId,
          reason: "prepare read-only audit role",
          beforeState: [],
          afterState: ["root-role.read", "root-user.read.visible"],
        }),
      ]),
    );
    expect(findRootRoleEvents(harness, "root_role_assignment_created")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          targetRootUserId: target.rootUserId,
          rootRoleId: createdRole.body.rootRoleId,
          assignmentId: assigned.body.rootRoleAssignmentId,
          reason: "grant audit access",
        }),
      ]),
    );
    expect(findRootRoleEvents(harness, "root_role_assignment_replaced")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          targetRootUserId: target.rootUserId,
          rootRoleId: replacementRole.body.rootRoleId,
          reason: "promote to support role",
        }),
      ]),
    );
    expect(findRootRoleEvents(harness, "root_role_deactivated")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          rootRoleId: createdRole.body.rootRoleId,
        }),
      ]),
    );
    expect(findRootRoleEvents(harness, "root_role_reactivated")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorRootUserId: actor.rootUserId,
          rootRoleId: createdRole.body.rootRoleId,
        }),
      ]),
    );
  });

  it("TC-ROOT-ROLES-AUD-002 keeps denied privileged root-role actions operator-visible through platform security audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    const actor = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, actor);

    harness.setRootUserCapabilities(actor.rootUserId, ["root-role.read"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserDenied",
        displayName: "Root User Denied",
        description: "Should be blocked",
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    expect(findSecurityEvents(harness, "root_capability_denied")).toEqual([
      expect.objectContaining({
        rootUserId: actor.rootUserId,
        authPrincipalId: actor.authPrincipalId,
        eventOutcome: "failure",
        ipAddress: "127.0.0.1",
      }),
    ]);
  });
});
