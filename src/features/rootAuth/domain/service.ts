import { randomBytes } from "node:crypto";
import { env } from "../../../config/env";
import { createRootAuthAbuseProtection } from "../../../lib/security/rootAuthAbuse";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { RootUsersAuthStateReader } from "../../rootUsers";
import {
  AuthPrincipalEmailAlreadyExistsError,
  AuthLockedDownError,
  DuplicateSshPublicKeyError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  RootUserNotFoundError,
  SessionNotFoundError,
  SshChallengeAlreadyUsedError,
  SshChallengeExpiredError,
  SshChallengeNotFoundError,
  SshPublicKeyNotFoundError,
} from "../contract/errors";
import { createPrefixedId } from "./ids";
import { assertPasswordPolicy } from "./password";
import { assertRootUserCanAuthenticate } from "./rootUserAccess";
import { parseEd25519PublicKey, verifyRootLoginSignature } from "./ssh";
import type {
  AddRootUserSshPublicKeyInput,
  ChangeRootUserPasswordInput,
  CompleteRootUserSshChallengeInput,
  LoginRootUserWithPasswordInput,
  LogoutRootUserSessionInput,
  RevokeRootUserSessionInput,
  RevokeRootUserSshPublicKeyInput,
  RootAuthChallengeResult,
  RootAuthLoginSshKeyOption,
  RootAuthSessionSummary,
  RootAuthSshKeySummary,
} from "./types";
import type { RootAuthRepository } from "../persistence/repository";

function createChallengeText(authPrincipalId: string, challengeId: string, expiresAt: Date): string {
  const nonce = randomBytes(16).toString("base64url");

  return [
    `challengeId=${challengeId}`,
    `authPrincipalId=${authPrincipalId}`,
    "purpose=root-login",
    `nonce=${nonce}`,
    `expiresAt=${expiresAt.toISOString()}`,
    "aud=kanbien-platform",
  ].join("|");
}

function toSessionSummary(session: {
  session_id: string;
  auth_principal_id: string;
  root_user_id: string;
  authenticated_at: Date;
  expires_at: Date;
}): RootAuthSessionSummary {
  return {
    status: "AUTHENTICATED",
    sessionId: session.session_id,
    authPrincipalId: session.auth_principal_id,
    rootUserId: session.root_user_id,
    authenticatedAt: session.authenticated_at.toISOString(),
    expiresAt: session.expires_at.toISOString(),
  };
}

function toSshKeySummary(record: {
  auth_ssh_public_key_id: string;
  label: string;
  algorithm: string;
  fingerprint: string;
  status: "active" | "revoked";
  created_at: Date;
  revoked_at: Date | null;
}): RootAuthSshKeySummary {
  return {
    keyId: record.auth_ssh_public_key_id,
    label: record.label,
    algorithm: record.algorithm,
    fingerprint: record.fingerprint,
    status: record.status,
    createdAt: record.created_at.toISOString(),
    revokedAt: record.revoked_at ? record.revoked_at.toISOString() : null,
  };
}

function toLoginSshKeyOption(record: {
  auth_ssh_public_key_id: string;
  label: string;
  fingerprint: string;
}): RootAuthLoginSshKeyOption {
  return {
    keyId: record.auth_ssh_public_key_id,
    label: record.label,
    fingerprint: record.fingerprint,
  };
}

export interface CreateRootUserAuthPrincipalInput {
  rootUserId: string;
  loginEmail: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RootAuthService {
  createRootUserAuthPrincipal(input: CreateRootUserAuthPrincipalInput): Promise<{
    authPrincipalId: string;
    rootUserId: string;
    loginEmail: string;
  }>;
  loginRootUserWithPassword(input: LoginRootUserWithPasswordInput): Promise<RootAuthChallengeResult>;
  completeRootUserSshChallenge(input: CompleteRootUserSshChallengeInput): Promise<RootAuthSessionSummary>;
  changeRootUserPassword(input: ChangeRootUserPasswordInput): Promise<{ status: "PASSWORD_CHANGED" }>;
  addRootUserSshPublicKey(input: AddRootUserSshPublicKeyInput): Promise<RootAuthSshKeySummary>;
  revokeRootUserSshPublicKey(input: RevokeRootUserSshPublicKeyInput): Promise<{ status: "SSH_KEY_REVOKED" }>;
  logoutRootUserSession(input: LogoutRootUserSessionInput): Promise<{ status: "LOGGED_OUT" }>;
  revokeRootUserSession(input: RevokeRootUserSessionInput): Promise<{ status: "SESSION_REVOKED" }>;
  listRootUserSshPublicKeys(authPrincipalId: string): Promise<RootAuthSshKeySummary[]>;
  listRootUserSessions(authPrincipalId: string): Promise<RootAuthSessionSummary[]>;
}

export function createRootAuthService(
  authRepository: RootAuthRepository,
  rootUsersAuthStateReader: RootUsersAuthStateReader,
  platformSecurityRepository: PlatformSecurityRepository,
): RootAuthService {
  const abuseProtection = createRootAuthAbuseProtection(
    platformSecurityRepository,
    {
      enabled: env.platformSecurity.enabled,
      ...env.platformSecurity.authAbuse,
    },
    () => new AuthLockedDownError(),
  );

  return {
    async createRootUserAuthPrincipal(input) {
      assertPasswordPolicy(input.password, env.rootAuth.passwordMinLength);

      const rootUser = await rootUsersAuthStateReader.findAuthStateById(input.rootUserId);

      if (!rootUser) {
        throw new RootUserNotFoundError();
      }

      const normalizedEmail = input.loginEmail.trim().toLowerCase();
      const existing = await authRepository.findPrincipalByNormalizedEmail(normalizedEmail);

      if (existing) {
        throw new AuthPrincipalEmailAlreadyExistsError();
      }

      const authPrincipalId = createPrefixedId("ap");
      await authRepository.createAuthPrincipal({
        authPrincipalId,
        loginEmail: normalizedEmail,
        loginEmailNormalized: normalizedEmail,
        password: input.password,
      });
      await authRepository.createRootUserLink({
        linkId: createPrefixedId("link"),
        authPrincipalId,
        rootUserId: input.rootUserId,
      });
      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId,
        rootUserId: input.rootUserId,
        eventType: "auth_principal_created",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: new Date(),
      });

      return {
        authPrincipalId,
        rootUserId: input.rootUserId,
        loginEmail: normalizedEmail,
      };
    },
    async loginRootUserWithPassword(input) {
      const normalizedEmail = input.email.trim().toLowerCase();
      await abuseProtection.assertPasswordAttemptAllowed({
        normalizedEmail,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
      const principal = await authRepository.findPrincipalByNormalizedEmail(normalizedEmail);

      if (!principal) {
        await authRepository.createAuditEvent({
          eventId: createPrefixedId("evt"),
          eventType: "login_password_stage",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
        await abuseProtection.recordPasswordAttemptFailure({
          normalizedEmail,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw new InvalidCredentialsError();
      }

      const accepted = await authRepository.verifyPassword(principal.auth_principal_id, input.password);

      if (!accepted) {
        await authRepository.createAuditEvent({
          eventId: createPrefixedId("evt"),
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          eventType: "login_password_stage",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
        await abuseProtection.recordPasswordAttemptFailure({
          normalizedEmail,
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw new InvalidCredentialsError();
      }

      const rootUser = await rootUsersAuthStateReader.findAuthStateById(principal.root_user_id);

      if (!rootUser) {
        throw new InvalidCredentialsError();
      }

      try {
        assertRootUserCanAuthenticate(rootUser);
      } catch (error) {
        await authRepository.createAuditEvent({
          eventId: createPrefixedId("evt"),
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          eventType: "login_password_stage",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
        await abuseProtection.recordPasswordAttemptFailure({
          normalizedEmail,
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw error;
      }

      const challengeId = createPrefixedId("chal");
      const expiresAt = new Date(Date.now() + env.rootAuth.challengeTtlSeconds * 1000);
      const challengeText = createChallengeText(principal.auth_principal_id, challengeId, expiresAt);

      await authRepository.createChallenge({
        challengeId,
        authPrincipalId: principal.auth_principal_id,
        purpose: "root-login",
        challengeText,
        expiresAt,
      });
      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        eventType: "login_password_stage",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: new Date(),
      });
      const availableSshKeys = (await authRepository.listSshPublicKeys(principal.auth_principal_id))
        .filter((record) => record.status === "active" && record.revoked_at === null)
        .map(toLoginSshKeyOption);

      return {
        status: "SSH_CHALLENGE_REQUIRED",
        challengeId,
        challengeText,
        availableSshKeys,
      };
    },
    async completeRootUserSshChallenge(input) {
      const challenge = await authRepository.findChallengeById(input.challengeId);

      if (!challenge) {
        throw new SshChallengeNotFoundError();
      }

      if (challenge.used_at) {
        throw new SshChallengeAlreadyUsedError();
      }

      if (challenge.expires_at.getTime() <= Date.now()) {
        throw new SshChallengeExpiredError();
      }

      const principal = await authRepository.findPrincipalById(challenge.auth_principal_id);

      if (!principal) {
        throw new InvalidCredentialsError();
      }

      await abuseProtection.assertSshAttemptAllowed({
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      const rootUser = await rootUsersAuthStateReader.findAuthStateById(principal.root_user_id);

      if (!rootUser) {
        throw new InvalidCredentialsError();
      }

      try {
        assertRootUserCanAuthenticate(rootUser);
      } catch (error) {
        await authRepository.createAuditEvent({
          eventId: createPrefixedId("evt"),
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          eventType: "login_ssh_stage",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
        await abuseProtection.recordSshAttemptFailure({
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw error;
      }

      try {
        const sshKeyRecord = await authRepository.findActiveSshKeyByFingerprint(
          principal.auth_principal_id,
          input.publicKeyFingerprint,
        );

        if (!sshKeyRecord) {
          throw new InvalidCredentialsError();
        }

        const parsedKey = parseEd25519PublicKey(sshKeyRecord.public_key_openssh);
        verifyRootLoginSignature(challenge.challenge_text, input.signature, parsedKey);
      } catch (error) {
        await authRepository.createAuditEvent({
          eventId: createPrefixedId("evt"),
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          eventType: "login_ssh_stage",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
        await abuseProtection.recordSshAttemptFailure({
          authPrincipalId: principal.auth_principal_id,
          rootUserId: principal.root_user_id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw error;
      }

      const usedAt = new Date();
      await authRepository.markChallengeUsed(challenge.challenge_id, usedAt);

      const authenticatedAt = new Date();
      const session = await authRepository.createSession({
        sessionId: createPrefixedId("sess"),
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        authenticatedAt,
        expiresAt: new Date(authenticatedAt.getTime() + env.rootAuth.sessionTtlSeconds * 1000),
      });

      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: principal.auth_principal_id,
        rootUserId: principal.root_user_id,
        eventType: "login_ssh_stage",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: authenticatedAt,
      });
      await abuseProtection.clearAccountFailureState({
        normalizedEmail: principal.login_email_normalized,
        authPrincipalId: principal.auth_principal_id,
        ipAddress: input.ipAddress,
      });

      return toSessionSummary(session);
    },
    async changeRootUserPassword(input) {
      assertPasswordPolicy(input.newPassword, env.rootAuth.passwordMinLength);

      const accepted = await authRepository.verifyPassword(input.authPrincipalId, input.currentPassword);

      if (!accepted) {
        await authRepository.createAuditEvent({
          eventId: createPrefixedId("evt"),
          authPrincipalId: input.authPrincipalId,
          rootUserId: input.rootUserId,
          eventType: "password_change_rejected",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
        throw new InvalidCurrentPasswordError();
      }

      const changedAt = new Date();
      await authRepository.setPassword(input.authPrincipalId, input.newPassword, changedAt);
      await authRepository.revokeOtherSessions(input.authPrincipalId, input.currentSessionId);
      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        eventType: "password_changed",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: changedAt,
      });

      return { status: "PASSWORD_CHANGED" as const };
    },
    async addRootUserSshPublicKey(input) {
      const parsedKey = parseEd25519PublicKey(input.publicKey);
      const existing = await authRepository.findActiveSshKeyByFingerprint(
        input.authPrincipalId,
        parsedKey.fingerprint,
      );

      if (existing) {
        throw new DuplicateSshPublicKeyError();
      }

      const record = await authRepository.addSshPublicKey({
        keyId: createPrefixedId("key"),
        authPrincipalId: input.authPrincipalId,
        label: input.label.trim(),
        algorithm: parsedKey.algorithm,
        publicKeyOpenSsh: parsedKey.publicKeyOpenSsh,
        fingerprint: parsedKey.fingerprint,
      });
      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        eventType: "ssh_key_added",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: new Date(),
      });

      return toSshKeySummary(record);
    },
    async revokeRootUserSshPublicKey(input) {
      const revoked = await authRepository.revokeSshPublicKey(
        input.keyId,
        input.authPrincipalId,
        new Date(),
      );

      if (!revoked) {
        throw new SshPublicKeyNotFoundError();
      }

      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        eventType: "ssh_key_revoked",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: new Date(),
      });

      return { status: "SSH_KEY_REVOKED" as const };
    },
    async logoutRootUserSession(input) {
      const revoked = await authRepository.revokeSession(input.sessionId, input.authPrincipalId);

      if (!revoked) {
        throw new SessionNotFoundError();
      }

      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        eventType: "session_revoked",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: new Date(),
      });

      return { status: "LOGGED_OUT" as const };
    },
    async revokeRootUserSession(input) {
      const ownedSession = await authRepository.findOwnedSession(input.sessionId, input.authPrincipalId);

      if (!ownedSession) {
        throw new SessionNotFoundError();
      }

      await authRepository.revokeSession(input.sessionId, input.authPrincipalId);
      await authRepository.createAuditEvent({
        eventId: createPrefixedId("evt"),
        authPrincipalId: input.authPrincipalId,
        rootUserId: input.rootUserId,
        eventType: "session_revoked",
        eventOutcome: "success",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        occurredAt: new Date(),
      });

      return { status: "SESSION_REVOKED" as const };
    },
    async listRootUserSshPublicKeys(authPrincipalId) {
      const records = await authRepository.listSshPublicKeys(authPrincipalId);
      return records.map(toSshKeySummary);
    },
    async listRootUserSessions(authPrincipalId) {
      const sessions = await authRepository.listSessions(authPrincipalId);
      return sessions.map(toSessionSummary);
    },
  };
}
