import { describe, expect, it, vi } from "vitest";
import {
  AuthLockedDownError,
  AuthPrincipalEmailAlreadyExistsError,
  DuplicateSshPublicKeyError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  InvalidNewPasswordError,
  InvalidSshPublicKeyError,
  RootUserNotFoundError,
  RootUserSignInBlockedError,
  SessionNotFoundError,
  SshChallengeAlreadyUsedError,
  SshChallengeExpiredError,
  SshChallengeNotFoundError,
  SshPublicKeyNotFoundError,
} from "../../../src/features/rootAuth/contract/errors";
import {
  createAuthPrincipalWithRootUserRecord,
  createAuthLoginChallengeRecord,
  createAuthSessionRecord,
  createAuthSshPublicKeyRecord,
  createEd25519KeyMaterial,
  createRootAuthServiceHarness,
  createRootUserAuthState,
  sampleEd25519PublicKey,
} from "../../harness/rootAuth/serviceHarness";

describe("rootAuth service unit tests", () => {
  it("TC-ROOT-AUTH-UNIT-001 creates an auth principal, link, and audit event on success", async () => {
    const harness = createRootAuthServiceHarness();
    harness.rootUsersAuthStateReader.findAuthStateById = async () =>
      createRootUserAuthState({ rootUserId: "ru_abc" });

    const result = await harness.service.createRootUserAuthPrincipal({
      rootUserId: "ru_abc",
      loginEmail: " Root.Admin@Example.TEST ",
      password: "StrongPass1!",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(result.rootUserId).toBe("ru_abc");
    expect(result.authPrincipalId).toMatch(/^ap_/);
    expect(result.loginEmail).toBe("root.admin@example.test");
    expect(harness.authRepository.findPrincipalByNormalizedEmail).toHaveBeenCalledWith(
      "root.admin@example.test",
    );
    expect(harness.authRepository.createAuthPrincipal).toHaveBeenCalledWith(
      expect.objectContaining({
        authPrincipalId: expect.stringMatching(/^ap_/),
        loginEmail: "root.admin@example.test",
        loginEmailNormalized: "root.admin@example.test",
        password: "StrongPass1!",
      }),
    );
    expect(harness.authRepository.createRootUserLink).toHaveBeenCalledWith(
      expect.objectContaining({
        linkId: expect.stringMatching(/^link_/),
        authPrincipalId: result.authPrincipalId,
        rootUserId: "ru_abc",
      }),
    );
    expect(harness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        authPrincipalId: result.authPrincipalId,
        rootUserId: "ru_abc",
        eventType: "auth_principal_created",
        eventOutcome: "success",
      }),
    );
  });

  it("TC-ROOT-AUTH-UNIT-001 rejects missing linked root users without persisting partial records", async () => {
    const harness = createRootAuthServiceHarness();

    await expect(
      harness.service.createRootUserAuthPrincipal({
        rootUserId: "ru_missing",
        loginEmail: "root@example.test",
        password: "StrongPass1!",
      }),
    ).rejects.toBeInstanceOf(RootUserNotFoundError);

    expect(harness.authRepository.createAuthPrincipal).not.toHaveBeenCalled();
    expect(harness.authRepository.createRootUserLink).not.toHaveBeenCalled();
    expect(harness.authRepository.createAuditEvent).not.toHaveBeenCalled();
  });

  it("TC-ROOT-AUTH-UNIT-001 and TC-ROOT-AUTH-EDGE-001 reject duplicate normalized login emails", async () => {
    const harness = createRootAuthServiceHarness();
    harness.rootUsersAuthStateReader.findAuthStateById = async () => createRootUserAuthState();
    harness.authRepository.findPrincipalByNormalizedEmail = async () =>
      createAuthPrincipalWithRootUserRecord();

    await expect(
      harness.service.createRootUserAuthPrincipal({
        rootUserId: "ru_123",
        loginEmail: "ROOT@example.test",
        password: "StrongPass1!",
      }),
    ).rejects.toBeInstanceOf(AuthPrincipalEmailAlreadyExistsError);

    expect(harness.authRepository.createAuthPrincipal).not.toHaveBeenCalled();
    expect(harness.authRepository.createRootUserLink).not.toHaveBeenCalled();
  });

  it("TC-ROOT-AUTH-UNIT-001 rejects passwords that fail policy before persistence", async () => {
    const harness = createRootAuthServiceHarness();

    await expect(
      harness.service.createRootUserAuthPrincipal({
        rootUserId: "ru_123",
        loginEmail: "root@example.test",
        password: "weak",
      }),
    ).rejects.toMatchObject({
      code: "INVALID_NEW_PASSWORD",
    });

    expect(harness.rootUsersAuthStateReader.findAuthStateById).not.toHaveBeenCalled();
    expect(harness.authRepository.createAuthPrincipal).not.toHaveBeenCalled();
  });

  it("TC-ROOT-AUTH-UNIT-005 stores a valid ssh-ed25519 key and writes an audit event", async () => {
    const harness = createRootAuthServiceHarness();
    harness.authRepository.addSshPublicKey = vi.fn(async (input) =>
      createAuthSshPublicKeyRecord({
        auth_ssh_public_key_id: input.keyId,
        auth_principal_id: input.authPrincipalId,
        label: input.label,
        algorithm: input.algorithm,
        public_key_openssh: input.publicKeyOpenSsh,
        fingerprint: input.fingerprint,
      }),
    );

    const result = await harness.service.addRootUserSshPublicKey({
      authPrincipalId: "ap_123",
      rootUserId: "ru_123",
      label: " Laptop Key ",
      publicKey: sampleEd25519PublicKey,
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(result).toMatchObject({
      keyId: expect.stringMatching(/^key_/),
      label: "Laptop Key",
      algorithm: "ssh-ed25519",
      fingerprint: expect.stringMatching(/^SHA256:/),
      status: "active",
      revokedAt: null,
    });
    expect(harness.authRepository.findActiveSshKeyByFingerprint).toHaveBeenCalledWith(
      "ap_123",
      result.fingerprint,
    );
    expect(harness.authRepository.addSshPublicKey).toHaveBeenCalledWith(
      expect.objectContaining({
        keyId: expect.stringMatching(/^key_/),
        authPrincipalId: "ap_123",
        label: "Laptop Key",
        algorithm: "ssh-ed25519",
        publicKeyOpenSsh: sampleEd25519PublicKey,
        fingerprint: result.fingerprint,
      }),
    );
    expect(harness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        eventType: "ssh_key_added",
        eventOutcome: "success",
      }),
    );
  });

  it("TC-ROOT-AUTH-UNIT-005 and TC-ROOT-AUTH-EDGE-005 reject malformed and duplicate public keys", async () => {
    const malformedHarness = createRootAuthServiceHarness();

    await expect(
      malformedHarness.service.addRootUserSshPublicKey({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        label: "Laptop",
        publicKey: "not-a-valid-key",
      }),
    ).rejects.toBeInstanceOf(InvalidSshPublicKeyError);

    expect(malformedHarness.authRepository.addSshPublicKey).not.toHaveBeenCalled();

    const duplicateHarness = createRootAuthServiceHarness();
    duplicateHarness.authRepository.findActiveSshKeyByFingerprint = async () =>
      createAuthSshPublicKeyRecord();

    await expect(
      duplicateHarness.service.addRootUserSshPublicKey({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        label: "Laptop",
        publicKey: sampleEd25519PublicKey,
      }),
    ).rejects.toBeInstanceOf(DuplicateSshPublicKeyError);

    expect(duplicateHarness.authRepository.addSshPublicKey).not.toHaveBeenCalled();
  });

  it("TC-ROOT-AUTH-UNIT-002 returns SSH_CHALLENGE_REQUIRED and writes a success audit event without creating a session", async () => {
    const harness = createRootAuthServiceHarness();
    const principal = createAuthPrincipalWithRootUserRecord({
      login_email: "root.admin@example.test",
      login_email_normalized: "root.admin@example.test",
    });
    harness.authRepository.findPrincipalByNormalizedEmail = async () => principal;
    harness.authRepository.verifyPassword = async () => true;
    harness.rootUsersAuthStateReader.findAuthStateById = async () =>
      createRootUserAuthState({ rootUserId: principal.root_user_id });

    const result = await harness.service.loginRootUserWithPassword({
      email: " Root.Admin@Example.TEST ",
      password: "StrongPass1!",
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(result).toMatchObject({
      status: "SSH_CHALLENGE_REQUIRED",
      challengeId: expect.stringMatching(/^chal_/),
      challengeText: expect.stringContaining(`authPrincipalId=${principal.auth_principal_id}`),
    });
    expect(harness.authRepository.createChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        challengeId: result.challengeId,
        authPrincipalId: principal.auth_principal_id,
        purpose: "root-login",
        challengeText: result.challengeText,
      }),
    );
    expect(harness.authRepository.createSession).not.toHaveBeenCalled();
    expect(harness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        eventType: "login_password_stage",
        eventOutcome: "success",
      }),
    );
  });

  it("TC-ROOT-AUTH-UNIT-002 returns generic invalid credentials for unknown emails and wrong passwords", async () => {
    const unknownHarness = createRootAuthServiceHarness();

    await expect(
      unknownHarness.service.loginRootUserWithPassword({
        email: "missing@example.test",
        password: "StrongPass1!",
        ipAddress: "127.0.0.1",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(unknownHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "login_password_stage",
        eventOutcome: "failure",
      }),
    );

    const wrongPasswordHarness = createRootAuthServiceHarness();
    const principal = createAuthPrincipalWithRootUserRecord();
    wrongPasswordHarness.authRepository.findPrincipalByNormalizedEmail = async () => principal;
    wrongPasswordHarness.authRepository.verifyPassword = async () => false;

    await expect(
      wrongPasswordHarness.service.loginRootUserWithPassword({
        email: principal.login_email,
        password: "WrongPass1!",
        ipAddress: "127.0.0.1",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(wrongPasswordHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        eventType: "login_password_stage",
        eventOutcome: "failure",
      }),
    );
    expect(wrongPasswordHarness.authRepository.createChallenge).not.toHaveBeenCalled();
  });

  it("TC-ROOT-AUTH-UNIT-002 blocks inactive linked root users and surfaces lockdowns", async () => {
    const blockedHarness = createRootAuthServiceHarness();
    const principal = createAuthPrincipalWithRootUserRecord();
    blockedHarness.authRepository.findPrincipalByNormalizedEmail = async () => principal;
    blockedHarness.authRepository.verifyPassword = async () => true;
    blockedHarness.rootUsersAuthStateReader.findAuthStateById = async () =>
      createRootUserAuthState({ rootUserId: principal.root_user_id, status: "inactive" });

    await expect(
      blockedHarness.service.loginRootUserWithPassword({
        email: principal.login_email,
        password: "StrongPass1!",
        ipAddress: "127.0.0.1",
      }),
    ).rejects.toBeInstanceOf(RootUserSignInBlockedError);

    expect(blockedHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "login_password_stage",
        eventOutcome: "failure",
      }),
    );

    const lockedHarness = createRootAuthServiceHarness();
    lockedHarness.platformSecurityRepository.findActiveLockdowns = async () => [
      {
        lockdown_id: "lock_123",
        subject_scope: "account",
        subject_key: "root@example.test",
        signal: "login_password",
        reason: "repeated_password_failures_account",
        endpoint_class: "public-auth",
        started_at: new Date("2026-03-26T00:00:00.000Z"),
        expires_at: new Date("2026-03-26T00:10:00.000Z"),
        created_at: new Date("2026-03-26T00:00:00.000Z"),
      },
    ];

    await expect(
      lockedHarness.service.loginRootUserWithPassword({
        email: "root@example.test",
        password: "StrongPass1!",
        ipAddress: "127.0.0.1",
      }),
    ).rejects.toBeInstanceOf(AuthLockedDownError);
  });

  it("TC-ROOT-AUTH-UNIT-003 creates a session only after a valid SSH proof succeeds", async () => {
    const harness = createRootAuthServiceHarness();
    const principal = createAuthPrincipalWithRootUserRecord();
    const key = createEd25519KeyMaterial();
    const challenge = createAuthLoginChallengeRecord({
      auth_principal_id: principal.auth_principal_id,
      challenge_text: "challenge=text",
      expires_at: new Date(Date.now() + 60_000),
    });
    harness.authRepository.findChallengeById = async () => challenge;
    harness.authRepository.findPrincipalById = async () => principal;
    harness.rootUsersAuthStateReader.findAuthStateById = async () =>
      createRootUserAuthState({ rootUserId: principal.root_user_id });
    harness.authRepository.findActiveSshKeyByFingerprint = async () =>
      createAuthSshPublicKeyRecord({
        auth_principal_id: principal.auth_principal_id,
        public_key_openssh: key.publicKeyOpenSsh,
        fingerprint: key.fingerprint,
      });

    const result = await harness.service.completeRootUserSshChallenge({
      challengeId: challenge.challenge_id,
      publicKeyFingerprint: key.fingerprint,
      signature: key.signChallengeText(challenge.challenge_text),
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    });

    expect(harness.authRepository.markChallengeUsed).toHaveBeenCalledWith(
      challenge.challenge_id,
      expect.any(Date),
    );
    expect(harness.authRepository.createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: expect.stringMatching(/^sess_/),
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
      }),
    );
    expect(harness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        eventType: "login_ssh_stage",
        eventOutcome: "success",
      }),
    );
    expect(result).toMatchObject({
      status: "AUTHENTICATED",
      sessionId: expect.stringMatching(/^sess_/),
      rootUserId: principal.root_user_id,
    });
  });

  it("TC-ROOT-AUTH-UNIT-003 rejects missing, expired, and already-used SSH challenges", async () => {
    const missingHarness = createRootAuthServiceHarness();
    await expect(
      missingHarness.service.completeRootUserSshChallenge({
        challengeId: "chal_missing",
        publicKeyFingerprint: "SHA256:any",
        signature: "bad",
      }),
    ).rejects.toBeInstanceOf(SshChallengeNotFoundError);

    const expiredHarness = createRootAuthServiceHarness();
    expiredHarness.authRepository.findChallengeById = async () =>
      createAuthLoginChallengeRecord({
        expires_at: new Date(Date.now() - 60_000),
      });
    await expect(
      expiredHarness.service.completeRootUserSshChallenge({
        challengeId: "chal_expired",
        publicKeyFingerprint: "SHA256:any",
        signature: "bad",
      }),
    ).rejects.toBeInstanceOf(SshChallengeExpiredError);

    const usedHarness = createRootAuthServiceHarness();
    usedHarness.authRepository.findChallengeById = async () =>
      createAuthLoginChallengeRecord({
        used_at: new Date("2026-03-26T00:01:00.000Z"),
      });
    await expect(
      usedHarness.service.completeRootUserSshChallenge({
        challengeId: "chal_used",
        publicKeyFingerprint: "SHA256:any",
        signature: "bad",
      }),
    ).rejects.toBeInstanceOf(SshChallengeAlreadyUsedError);
  });

  it("TC-ROOT-AUTH-UNIT-004 changes the password, revokes other sessions, and audits success or failure", async () => {
    const successHarness = createRootAuthServiceHarness();
    successHarness.authRepository.verifyPassword = async () => true;

    const success = await successHarness.service.changeRootUserPassword({
      authPrincipalId: "ap_123",
      rootUserId: "ru_123",
      currentSessionId: "sess_current",
      currentPassword: "StrongPass1!",
      newPassword: "NewStrongPass1!",
      ipAddress: "127.0.0.1",
    });

    expect(success).toEqual({ status: "PASSWORD_CHANGED" });
    expect(successHarness.authRepository.setPassword).toHaveBeenCalledWith(
      "ap_123",
      "NewStrongPass1!",
      expect.any(Date),
    );
    expect(successHarness.authRepository.revokeOtherSessions).toHaveBeenCalledWith(
      "ap_123",
      "sess_current",
    );
    expect(successHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "password_changed",
        eventOutcome: "success",
      }),
    );

    const failureHarness = createRootAuthServiceHarness();
    failureHarness.authRepository.verifyPassword = async () => false;

    await expect(
      failureHarness.service.changeRootUserPassword({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        currentSessionId: "sess_current",
        currentPassword: "WrongPass1!",
        newPassword: "NewStrongPass1!",
      }),
    ).rejects.toBeInstanceOf(InvalidCurrentPasswordError);

    expect(failureHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "password_change_rejected",
        eventOutcome: "failure",
      }),
    );
  });

  it("TC-ROOT-AUTH-UNIT-006 and TC-ROOT-AUTH-EDGE-006 revoke active SSH keys and reject missing ones", async () => {
    const successHarness = createRootAuthServiceHarness();
    successHarness.authRepository.revokeSshPublicKey = async () => true;

    await expect(
      successHarness.service.revokeRootUserSshPublicKey({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        keyId: "key_123",
      }),
    ).resolves.toEqual({ status: "SSH_KEY_REVOKED" });

    expect(successHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "ssh_key_revoked",
        eventOutcome: "success",
      }),
    );

    const missingHarness = createRootAuthServiceHarness();
    await expect(
      missingHarness.service.revokeRootUserSshPublicKey({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        keyId: "key_missing",
      }),
    ).rejects.toBeInstanceOf(SshPublicKeyNotFoundError);
  });

  it("TC-ROOT-AUTH-UNIT-007, TC-ROOT-AUTH-UNIT-008, and TC-ROOT-AUTH-EDGE-006 handle logout and revoke not-found session cases deterministically", async () => {
    const logoutHarness = createRootAuthServiceHarness();
    logoutHarness.authRepository.revokeSession = async () => true;

    await expect(
      logoutHarness.service.logoutRootUserSession({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        sessionId: "sess_123",
      }),
    ).resolves.toEqual({ status: "LOGGED_OUT" });

    expect(logoutHarness.authRepository.createAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "session_revoked",
        eventOutcome: "success",
      }),
    );

    const missingLogoutHarness = createRootAuthServiceHarness();
    await expect(
      missingLogoutHarness.service.logoutRootUserSession({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        sessionId: "sess_missing",
      }),
    ).rejects.toBeInstanceOf(SessionNotFoundError);

    const revokeHarness = createRootAuthServiceHarness();
    revokeHarness.authRepository.findOwnedSession = vi.fn(async () => createAuthSessionRecord());
    revokeHarness.authRepository.revokeSession = async () => true;

    await expect(
      revokeHarness.service.revokeRootUserSession({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        sessionId: "sess_owned",
      }),
    ).resolves.toEqual({ status: "SESSION_REVOKED" });

    expect(revokeHarness.authRepository.findOwnedSession).toHaveBeenCalledWith("sess_owned", "ap_123");

    const missingOwnedHarness = createRootAuthServiceHarness();
    await expect(
      missingOwnedHarness.service.revokeRootUserSession({
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        sessionId: "sess_missing",
      }),
    ).rejects.toBeInstanceOf(SessionNotFoundError);
  });

  it("TC-ROOT-AUTH-UNIT-009 and TC-ROOT-AUTH-EDGE-007 return safe ssh public key summaries and support empty lists", async () => {
    const harness = createRootAuthServiceHarness();
    harness.authRepository.listSshPublicKeys = async () => [
      createAuthSshPublicKeyRecord(),
      createAuthSshPublicKeyRecord({
        auth_ssh_public_key_id: "key_456",
        label: "archive",
        status: "revoked",
        revoked_at: new Date("2026-03-26T01:00:00.000Z"),
      }),
    ];

    const result = await harness.service.listRootUserSshPublicKeys("ap_123");
    const empty = await createRootAuthServiceHarness().service.listRootUserSshPublicKeys("ap_999");

    expect(result).toEqual([
      {
        keyId: "key_123",
        label: "laptop",
        algorithm: "ssh-ed25519",
        fingerprint: "SHA256:testfingerprint",
        status: "active",
        createdAt: "2026-03-26T00:00:00.000Z",
        revokedAt: null,
      },
      {
        keyId: "key_456",
        label: "archive",
        algorithm: "ssh-ed25519",
        fingerprint: "SHA256:testfingerprint",
        status: "revoked",
        createdAt: "2026-03-26T00:00:00.000Z",
        revokedAt: "2026-03-26T01:00:00.000Z",
      },
    ]);
    expect(empty).toEqual([]);
  });

  it("TC-ROOT-AUTH-UNIT-010 returns owned sessions with safe summary metadata and supports empty lists", async () => {
    const harness = createRootAuthServiceHarness();
    harness.authRepository.listSessions = async () => [
      createAuthSessionRecord(),
      createAuthSessionRecord({
        session_id: "sess_456",
        authenticated_at: new Date("2026-03-26T02:00:00.000Z"),
        expires_at: new Date("2026-03-26T10:00:00.000Z"),
      }),
    ];

    const populated = await harness.service.listRootUserSessions("ap_123");
    const empty = await createRootAuthServiceHarness().service.listRootUserSessions("ap_999");

    expect(populated).toEqual([
      {
        status: "AUTHENTICATED",
        sessionId: "sess_123",
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        authenticatedAt: "2026-03-26T00:00:00.000Z",
        expiresAt: "2026-03-26T08:00:00.000Z",
      },
      {
        status: "AUTHENTICATED",
        sessionId: "sess_456",
        authPrincipalId: "ap_123",
        rootUserId: "ru_123",
        authenticatedAt: "2026-03-26T02:00:00.000Z",
        expiresAt: "2026-03-26T10:00:00.000Z",
      },
    ]);
    expect(empty).toEqual([]);
  });
});
