import { afterEach, describe, expect, it, vi } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  createRootAuthIntegrationHarness,
  type RootAuthIntegrationHarness,
  type SeededAuthIdentity,
} from "../../harness/rootAuth/integrationHarness";
import { createEd25519KeyMaterial } from "../../harness/rootAuth/serviceHarness";

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

interface ErrorResponse {
  code: string;
  message?: string;
  details?: unknown;
}

interface SshKeySummary {
  keyId: string;
  label: string;
  algorithm: string;
  fingerprint: string;
  status: "active" | "revoked";
  createdAt: string;
  revokedAt: string | null;
}

function extractChallengeField(challengeText: string, key: string): string | null {
  const part = challengeText
    .split("|")
    .find((item) => item.startsWith(`${key}=`));

  return part ? part.slice(key.length + 1) : null;
}

async function startPasswordStage(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
  overrides?: { email?: string; password?: string },
) {
  return invokeJson<PasswordStageResponse | ErrorResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/password",
    body: {
      email: overrides?.email ?? identity.loginEmail,
      password: overrides?.password ?? identity.password,
    },
  });
}

async function completeSshStage(
  harness: RootAuthIntegrationHarness,
  body: {
    challengeId: string;
    publicKeyFingerprint: string;
    signature: string;
  },
) {
  return invokeJson<SessionResponse | ErrorResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/ssh",
    body,
  });
}

async function loginViaPasswordAndSsh(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
) {
  const passwordStage = await startPasswordStage(harness, identity);
  expect(passwordStage.status).toBe(200);
  expect(passwordStage.body).toMatchObject({ status: "SSH_CHALLENGE_REQUIRED" });

  const challenge = passwordStage.body as PasswordStageResponse;
  const sshStage = await completeSshStage(harness, {
    challengeId: challenge.challengeId,
    publicKeyFingerprint: identity.sshKey.fingerprint,
    signature: identity.sshKey.signChallengeText(challenge.challengeText),
  });

  expect(sshStage.status).toBe(200);
  expect(sshStage.body).toMatchObject({ status: "AUTHENTICATED" });

  return sshStage.body as SessionResponse;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("rootAuth security flows", () => {
  it("TC-ROOT-AUTH-SEC-001 keeps unknown-email and wrong-password failures externally generic", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    const unknownEmail = await startPasswordStage(harness, identity, {
      email: "missing-user@example.test",
    });
    const wrongPassword = await startPasswordStage(harness, identity, {
      password: "WrongPass1!",
    });

    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.body).toEqual(wrongPassword.body);
    expect(unknownEmail.body).toMatchObject({
      code: "INVALID_CREDENTIALS",
      message: "The supplied credentials were not accepted.",
    });
  });

  it("TC-ROOT-AUTH-SEC-002 does not create an authenticated session after the password stage alone", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    const passwordStage = await startPasswordStage(harness, identity);

    expect(passwordStage.status).toBe(200);
    expect(passwordStage.body).toMatchObject({ status: "SSH_CHALLENGE_REQUIRED" });
    expect(harness.getSessionIdsForAuthPrincipal(identity.authPrincipalId)).toHaveLength(0);

    const unauthorizedProtectedRoute = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${(passwordStage.body as PasswordStageResponse).challengeId}`,
      },
    });

    expect(unauthorizedProtectedRoute.status).toBe(401);
    expect(unauthorizedProtectedRoute.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-AUTH-SEC-003 enforces single-use, expiry, and principal-bound SSH challenges", async () => {
    // Also covers TC-ROOT-AUTH-EDGE-002 and TC-ROOT-AUTH-EDGE-003.
    const replayHarness = createRootAuthIntegrationHarness();
    const replayIdentity = replayHarness.seedAuthIdentity();
    const replayPasswordStage = await startPasswordStage(replayHarness, replayIdentity);
    expect(replayPasswordStage.status).toBe(200);

    const replayChallenge = replayPasswordStage.body as PasswordStageResponse;
    expect(extractChallengeField(replayChallenge.challengeText, "purpose")).toBe("root-login");
    expect(extractChallengeField(replayChallenge.challengeText, "authPrincipalId")).toBe(
      replayIdentity.authPrincipalId,
    );

    const firstUse = await completeSshStage(replayHarness, {
      challengeId: replayChallenge.challengeId,
      publicKeyFingerprint: replayIdentity.sshKey.fingerprint,
      signature: replayIdentity.sshKey.signChallengeText(replayChallenge.challengeText),
    });
    expect(firstUse.status).toBe(200);
    expect(replayHarness.getSessionIdsForAuthPrincipal(replayIdentity.authPrincipalId)).toHaveLength(1);

    const replayAttempt = await completeSshStage(replayHarness, {
      challengeId: replayChallenge.challengeId,
      publicKeyFingerprint: replayIdentity.sshKey.fingerprint,
      signature: replayIdentity.sshKey.signChallengeText(replayChallenge.challengeText),
    });
    expect(replayAttempt.status).toBe(409);
    expect((replayAttempt.body as ErrorResponse).code).toBe("SSH_CHALLENGE_ALREADY_USED");
    expect(replayHarness.getSessionIdsForAuthPrincipal(replayIdentity.authPrincipalId)).toHaveLength(1);

    const principalBoundHarness = createRootAuthIntegrationHarness();
    const primaryIdentity = principalBoundHarness.seedAuthIdentity();
    principalBoundHarness.seedRootUser({
      rootUserId: "66666666-6666-6666-6666-666666666666",
      email: "other@example.test",
      firstName: "Other",
      lastName: "Root",
    });
    const otherIdentity = principalBoundHarness.bootstrapAuthForRootUser({
      rootUserId: "66666666-6666-6666-6666-666666666666",
      authPrincipalId: "ap_other",
      loginEmail: "other@example.test",
      password: "OtherPass1!",
      keyLabel: "other",
    });

    const boundPasswordStage = await startPasswordStage(principalBoundHarness, primaryIdentity);
    expect(boundPasswordStage.status).toBe(200);

    const boundChallenge = boundPasswordStage.body as PasswordStageResponse;
    const wrongPrincipalAttempt = await completeSshStage(principalBoundHarness, {
      challengeId: boundChallenge.challengeId,
      publicKeyFingerprint: otherIdentity.sshKey.fingerprint,
      signature: otherIdentity.sshKey.signChallengeText(boundChallenge.challengeText),
    });
    expect(wrongPrincipalAttempt.status).toBe(401);
    expect((wrongPrincipalAttempt.body as ErrorResponse).code).toBe("INVALID_CREDENTIALS");

    const expiryBaseTime = new Date("2026-03-26T00:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(expiryBaseTime);
    const expiryHarness = createRootAuthIntegrationHarness();
    const expiryIdentity = expiryHarness.seedAuthIdentity();
    const expiringPasswordStage = await startPasswordStage(expiryHarness, expiryIdentity);
    expect(expiringPasswordStage.status).toBe(200);

    const expiringChallenge = expiringPasswordStage.body as PasswordStageResponse;
    const expiresAtRaw = extractChallengeField(expiringChallenge.challengeText, "expiresAt");
    expect(expiresAtRaw).not.toBeNull();
    vi.setSystemTime(new Date(expiresAtRaw!));

    const expiredAttempt = await completeSshStage(expiryHarness, {
      challengeId: expiringChallenge.challengeId,
      publicKeyFingerprint: expiryIdentity.sshKey.fingerprint,
      signature: expiryIdentity.sshKey.signChallengeText(expiringChallenge.challengeText),
    });
    expect(expiredAttempt.status).toBe(409);
    expect((expiredAttempt.body as ErrorResponse).code).toBe("SSH_CHALLENGE_EXPIRED");
  });

  it("TC-ROOT-AUTH-SEC-004 accepts only supported SSH algorithms, rejects revoked-key auth, and does not return secret key material", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const activeSession = await loginViaPasswordAndSsh(harness, identity);

    const unsupportedKey = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/ssh-keys",
      body: {
        label: "rsa-key",
        publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ==",
      },
      headers: {
        authorization: `Bearer ${activeSession.sessionId}`,
      },
    });
    expect(unsupportedKey.status).toBe(400);
    expect(unsupportedKey.body.code).toBe("UNSUPPORTED_SSH_KEY_ALGORITHM");

    const extraKey = createEd25519KeyMaterial();
    const addKey = await invokeJson<SshKeySummary>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/ssh-keys",
      body: {
        label: "temporary",
        publicKey: extraKey.publicKeyOpenSsh,
      },
      headers: {
        authorization: `Bearer ${activeSession.sessionId}`,
      },
    });

    expect(addKey.status).toBe(201);
    expect(addKey.body).toMatchObject({
      algorithm: "ssh-ed25519",
      fingerprint: extraKey.fingerprint,
      status: "active",
    });
    expect(addKey.body).not.toHaveProperty("publicKey");
    expect(addKey.body).not.toHaveProperty("privateKey");

    const listKeys = await invokeJson<{ items: SshKeySummary[] }>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/ssh-keys",
      headers: {
        authorization: `Bearer ${activeSession.sessionId}`,
      },
    });
    expect(listKeys.status).toBe(200);
    expect(listKeys.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyId: addKey.body.keyId,
          fingerprint: extraKey.fingerprint,
        }),
      ]),
    );
    for (const item of listKeys.body.items) {
      expect(item).not.toHaveProperty("publicKey");
      expect(item).not.toHaveProperty("privateKey");
    }

    const revokeKey = await invokeJson<{ status: string }>(harness.app, {
      method: "DELETE",
      path: `/v1/root-auth/ssh-keys/${addKey.body.keyId}`,
      headers: {
        authorization: `Bearer ${activeSession.sessionId}`,
      },
    });
    expect(revokeKey.status).toBe(200);

    const passwordStage = await startPasswordStage(harness, identity);
    expect(passwordStage.status).toBe(200);

    const revokedKeyAttempt = await completeSshStage(harness, {
      challengeId: (passwordStage.body as PasswordStageResponse).challengeId,
      publicKeyFingerprint: extraKey.fingerprint,
      signature: extraKey.signChallengeText(
        (passwordStage.body as PasswordStageResponse).challengeText,
      ),
    });

    expect(revokedKeyAttempt.status).toBe(401);
    expect((revokedKeyAttempt.body as ErrorResponse).code).toBe("INVALID_CREDENTIALS");
  });

  it("TC-ROOT-AUTH-SEC-005 rejects missing, invalid, and revoked bearer sessions on protected routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    const missingRootAuthBearer = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
    });
    expect(missingRootAuthBearer.status).toBe(401);
    expect(missingRootAuthBearer.body.code).toBe("UNAUTHORIZED");

    const missingRootUsersBearer = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
    });
    expect(missingRootUsersBearer.status).toBe(401);
    expect(missingRootUsersBearer.body.code).toBe("UNAUTHORIZED");

    const invalidSession = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: "Bearer sess_invalid",
      },
    });
    expect(invalidSession.status).toBe(401);
    expect(invalidSession.body.code).toBe("INVALID_SESSION");

    const session = await loginViaPasswordAndSsh(harness, identity);
    const logout = await invokeJson<{ status: "LOGGED_OUT" }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/logout",
      body: {},
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(logout.status).toBe(200);

    const revokedSession = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(revokedSession.status).toBe(401);
    expect(revokedSession.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-AUTH-SEC-006 re-checks lifecycle eligibility during SSH completion so stage two cannot bypass sign-in blocking", async () => {
    const cases = [
      {
        rootUserId: "77777777-7777-7777-7777-777777777777",
        email: "inactive@example.test",
        applyBlock: async (harness: RootAuthIntegrationHarness, rootUserId: string) => {
          await harness.rootUsersRepository.update({ rootUserId, status: "inactive" });
        },
      },
      {
        rootUserId: "88888888-8888-8888-8888-888888888888",
        email: "deleted@example.test",
        applyBlock: async (harness: RootAuthIntegrationHarness, rootUserId: string) => {
          await harness.rootUsersRepository.softDelete(rootUserId);
        },
      },
      {
        rootUserId: "99999999-9999-9999-9999-999999999999",
        email: "anon@example.test",
        applyBlock: async (harness: RootAuthIntegrationHarness, rootUserId: string) => {
          await harness.rootUsersRepository.remove(
            rootUserId,
            "anon+blocked@example.test",
            "Removed",
            "User",
          );
        },
      },
    ] as const;

    for (const testCase of cases) {
      const harness = createRootAuthIntegrationHarness();
      const identity = harness.seedAuthIdentity({
        rootUser: {
          rootUserId: testCase.rootUserId,
          email: testCase.email,
        },
      });

      const passwordStage = await startPasswordStage(harness, identity);
      expect(passwordStage.status).toBe(200);

      await testCase.applyBlock(harness, identity.rootUserId);

      const sshStage = await completeSshStage(harness, {
        challengeId: (passwordStage.body as PasswordStageResponse).challengeId,
        publicKeyFingerprint: identity.sshKey.fingerprint,
        signature: identity.sshKey.signChallengeText(
          (passwordStage.body as PasswordStageResponse).challengeText,
        ),
      });

      expect(sshStage.status).toBe(403);
      expect((sshStage.body as ErrorResponse).code).toBe("ROOT_USER_SIGN_IN_BLOCKED");
      expect(harness.getSessionIdsForAuthPrincipal(identity.authPrincipalId)).toHaveLength(0);
    }
  });
});
