import { describe, expect, it } from "vitest";
import type { AssetsService } from "../../../src/features/assets";
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
  updatedAt: string;
}

interface RootUserListResponse {
  items: RootUserResponse[];
  page: number;
  pageSize: number;
}

interface ErrorResponse {
  code: string;
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

describe("rootUsers audit visibility", () => {
  it("keeps profile-picture link and clear mutations audit-visible", async () => {
    const assetsService = {
      validateAssetForSubject: async () => undefined,
    } as unknown as AssetsService;
    const harness = createRootAuthIntegrationHarness({ assetsService });
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "profile-picture.audit.root@example.test",
        profilePictureAssetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        profilePictureAltText: "Profile portrait",
      },
    });
    expect(created.status).toBe(201);

    const cleared = await invokeJson<RootUserResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        profilePictureAssetId: null,
      },
    });
    expect(cleared.status).toBe(200);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_user_profile_picture_linked",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
        expect.objectContaining({
          eventType: "root_user_profile_picture_cleared",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });

  it("TC-ROOT-USERS-AUD-001 keeps lifecycle mutations operator-visible through authenticated backend responses", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "audit.root@example.test",
        firstName: "Audit",
        lastName: "Root",
      },
    });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      email: "audit.root@example.test",
      anonymized: false,
      status: "active",
      deletedAt: null,
    });

    const updated = await invokeJson<RootUserResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        firstName: "Updated",
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.firstName).toBe("Updated");

    const deleted = await invokeJson<RootUserResponse>(harness.app, {
      method: "DELETE",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body.deletedAt).not.toBeNull();

    const deletedList = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users/deleted",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deletedList.status).toBe(200);
    expect(deletedList.body.items.map((item) => item.rootUserId)).toContain(created.body.rootUserId);

    const reactivated = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${created.body.rootUserId}/reactivate`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(reactivated.status).toBe(200);
    expect(reactivated.body.deletedAt).toBeNull();

    const removed = await invokeJson<RootUserResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${created.body.rootUserId}/remove`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {},
    });
    expect(removed.status).toBe(200);
    expect(removed.body.anonymized).toBe(true);
    expect(removed.body.status).toBe("inactive");
  });

  it("TC-ROOT-ROLES-AUD-003 keeps newly gated rootUsers denials visible through platform security audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["root-user.read.visible"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "denied.root@example.test",
        firstName: "Denied",
        lastName: "Root",
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
