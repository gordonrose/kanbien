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
  page: number;
  pageSize: number;
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: {
    field?: string;
    reason?: string;
  };
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

describe("rootUsers integration flows", () => {
  it("TC-ROOT-USERS-INT-001 creates and reads protected rootUsers routes through an authenticated root session", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const createResponse = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "Created.Root@Example.test",
        firstName: "Created",
        lastName: "Root",
      },
    });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.email).toBe("created.root@example.test");

    const listResponse = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items.map((item) => item.email)).toContain("created.root@example.test");

    const exactById = await invokeJson<RootUserResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${createResponse.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(exactById.status).toBe(200);
    expect(exactById.body.rootUserId).toBe(createResponse.body.rootUserId);

    const exactByEmail = await invokeJson<RootUserResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users?email=created.root@example.test",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(exactByEmail.status).toBe(200);
    expect(exactByEmail.body.email).toBe("created.root@example.test");
  });

  it("TC-ROOT-USERS-INT-002 exposes root-user lifecycle state through the auth seam for rootAuth sign-in enforcement", async () => {
    for (const rootUser of [
      {
        rootUserId: "22222222-2222-2222-2222-222222222222",
        email: "inactive@example.test",
        status: "inactive" as const,
      },
      {
        rootUserId: "33333333-3333-3333-3333-333333333333",
        email: "deleted@example.test",
        deletedAt: new Date("2026-03-28T00:00:00.000Z"),
      },
      {
        rootUserId: "44444444-4444-4444-4444-444444444444",
        email: "anon@example.test",
        anonymized: true,
      },
    ]) {
      const harness = createRootAuthIntegrationHarness();
      const identity = harness.seedAuthIdentity({ rootUser, loginEmail: rootUser.email });

      const loginResponse = await invokeJson<{ code: string }>(harness.app, {
        method: "POST",
        path: "/v1/root-auth/login/password",
        body: {
          email: identity.loginEmail,
          password: identity.password,
        },
      });

      expect(loginResponse.status).toBe(403);
      expect(loginResponse.body.code).toBe("ROOT_USER_SIGN_IN_BLOCKED");
    }
  });

  it("TC-ROOT-USERS-INT-003 applies create -> delete -> deleted list -> reactivate -> remove lifecycle transitions", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const createResponse = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "lifecycle@example.test",
        firstName: "Life",
        lastName: "Cycle",
      },
    });
    expect(createResponse.status).toBe(201);

    const deleteResponse = await invokeJson<RootUserResponse>(harness.app, {
      method: "DELETE",
      path: `/v1/root-users/${createResponse.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.deletedAt).not.toBeNull();

    const deletedList = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users/deleted",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deletedList.status).toBe(200);
    expect(deletedList.body.items.map((item) => item.rootUserId)).toContain(createResponse.body.rootUserId);

    const reactivateResponse = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${createResponse.body.rootUserId}/reactivate`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(reactivateResponse.status).toBe(200);
    expect(reactivateResponse.body.deletedAt).toBeNull();

    const removeResponse = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${createResponse.body.rootUserId}/remove`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.anonymized).toBe(true);

    const secondReactivate = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${createResponse.body.rootUserId}/reactivate`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(secondReactivate.status).toBe(409);
    expect(secondReactivate.body.code).toBe("ROOT_USER_ALREADY_ANONYMIZED");
  });

  it("TC-ROOT-USERS-INT-001 also proves active-list filtering, deleted-list excludeAnonymized, and exact duplicate-error payloads", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const activeAlpha = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "alpha.active@example.test",
        firstName: "Alpha",
        lastName: "Active",
      },
    });
    const activeBeta = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "beta.active@example.test",
        firstName: "Alpha",
        lastName: "Beta",
      },
    });
    const deletedVisible = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "deleted.visible@example.test",
        firstName: "Deleted",
        lastName: "Visible",
      },
    });
    const deletedAnonymized = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "deleted.anon@example.test",
        firstName: "Deleted",
        lastName: "Anon",
      },
    });
    expect(activeAlpha.status).toBe(201);
    expect(activeBeta.status).toBe(201);
    expect(deletedVisible.status).toBe(201);
    expect(deletedAnonymized.status).toBe(201);

    await invokeJson(harness.app, {
      method: "PATCH",
      path: `/v1/root-users/${activeBeta.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        status: "inactive",
      },
    });
    await invokeJson(harness.app, {
      method: "DELETE",
      path: `/v1/root-users/${deletedVisible.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    await invokeJson(harness.app, {
      method: "DELETE",
      path: `/v1/root-users/${deletedAnonymized.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: `/v1/root-users/${deletedAnonymized.body.rootUserId}/remove`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });

    const activeList = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users/active?firstNamePrefix=alp&orderBy=email&orderDirection=asc",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(activeList.status).toBe(200);
    expect(activeList.body.items.map((item) => item.email)).toEqual([
      "alpha.active@example.test",
    ]);

    const deletedList = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users/deleted?excludeAnonymized=true&firstNamePrefix=del&orderBy=email&orderDirection=asc",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deletedList.status).toBe(200);
    expect(deletedList.body.items.map((item) => item.rootUserId)).toEqual([
      deletedVisible.body.rootUserId,
    ]);

    const duplicateCreate = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "ALPHA.ACTIVE@example.test",
        firstName: "Duplicate",
      },
    });
    expect(duplicateCreate.status).toBe(409);
    expect(duplicateCreate.body).toEqual({
      code: "ROOT_USER_EMAIL_ALREADY_EXISTS",
      message: "That email address is already in use by another active root user.",
      details: {
        field: "email",
        reason: "duplicate_active_email",
      },
    });
  });
});
