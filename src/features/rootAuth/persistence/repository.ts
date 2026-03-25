import type {
  ActiveAuthSessionRecord,
  AddAuthSshPublicKeyInput,
  AuthLoginChallengeRecord,
  AuthPrincipalRecord,
  AuthPrincipalWithRootUserRecord,
  AuthSessionRecord,
  AuthSshPublicKeyRecord,
  CreateAuthAuditEventInput,
  CreateAuthChallengeInput,
  CreateAuthLinkInput,
  CreateAuthPrincipalInput,
  CreateAuthSessionInput,
} from "./types";

export interface RootAuthSessionLookupRepository {
  findActiveSessionById(sessionId: string): Promise<ActiveAuthSessionRecord | null>;
}

export interface RootAuthRepository extends RootAuthSessionLookupRepository {
  createAuthPrincipal(input: CreateAuthPrincipalInput): Promise<AuthPrincipalRecord>;
  createRootUserLink(input: CreateAuthLinkInput): Promise<void>;
  findPrincipalByNormalizedEmail(email: string): Promise<AuthPrincipalWithRootUserRecord | null>;
  findPrincipalById(authPrincipalId: string): Promise<AuthPrincipalWithRootUserRecord | null>;
  verifyPassword(authPrincipalId: string, password: string): Promise<boolean>;
  createChallenge(input: CreateAuthChallengeInput): Promise<AuthLoginChallengeRecord>;
  findChallengeById(challengeId: string): Promise<AuthLoginChallengeRecord | null>;
  markChallengeUsed(challengeId: string, usedAt: Date): Promise<void>;
  createSession(input: CreateAuthSessionInput): Promise<AuthSessionRecord>;
  revokeSession(sessionId: string, authPrincipalId: string): Promise<boolean>;
  revokeOtherSessions(authPrincipalId: string, exceptSessionId: string): Promise<void>;
  setPassword(authPrincipalId: string, newPassword: string, changedAt: Date): Promise<void>;
  addSshPublicKey(input: AddAuthSshPublicKeyInput): Promise<AuthSshPublicKeyRecord>;
  findActiveSshKeyByFingerprint(
    authPrincipalId: string,
    fingerprint: string,
  ): Promise<AuthSshPublicKeyRecord | null>;
  listSshPublicKeys(authPrincipalId: string): Promise<AuthSshPublicKeyRecord[]>;
  revokeSshPublicKey(keyId: string, authPrincipalId: string, revokedAt: Date): Promise<boolean>;
  listSessions(authPrincipalId: string): Promise<AuthSessionRecord[]>;
  findOwnedSession(sessionId: string, authPrincipalId: string): Promise<AuthSessionRecord | null>;
  createAuditEvent(input: CreateAuthAuditEventInput): Promise<void>;
}
