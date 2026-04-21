import { generateKeyPairSync, sign } from "node:crypto";
import { vi } from "vitest";
import {
  createRootAuthService,
  type RootAuthService,
} from "../../../src/features/rootAuth/domain/service";
import { parseEd25519PublicKey } from "../../../src/features/rootAuth/domain/ssh";
import type { RootAuthRepository } from "../../../src/features/rootAuth/persistence/repository";
import type {
  AuthLoginChallengeRecord,
  AuthPrincipalRecord,
  AuthPrincipalWithRootUserRecord,
  AuthSessionRecord,
  AuthSshPublicKeyRecord,
} from "../../../src/features/rootAuth/persistence/types";
import type { RootUsersAuthStateReader } from "../../../src/features/rootUsers";
import type { RootUserAuthState } from "../../../src/features/rootUsers";
import type { PlatformSecurityRepository } from "../../../src/lib/security/repository";

export const sampleEd25519PublicKey =
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE+fWomSs6CBXFwaDSUYCy2FHG5UtnFJF7RE/O1hoozG fixture-root-auth@example.test";

export interface RootAuthServiceHarness {
  service: RootAuthService;
  authRepository: RootAuthRepository;
  rootUsersAuthStateReader: RootUsersAuthStateReader;
  platformSecurityRepository: PlatformSecurityRepository;
}

export interface Ed25519KeyMaterial {
  publicKeyOpenSsh: string;
  fingerprint: string;
  signChallengeText(challengeText: string): string;
}

export function createRootUserAuthState(overrides: Partial<RootUserAuthState> = {}): RootUserAuthState {
  return {
    rootUserId: "ru_123",
    email: "root@example.test",
    status: "active",
    anonymized: false,
    deletedAt: null,
    ...overrides,
  };
}

export function createAuthPrincipalWithRootUserRecord(
  overrides: Partial<AuthPrincipalWithRootUserRecord> = {},
): AuthPrincipalWithRootUserRecord {
  const now = new Date("2026-03-26T00:00:00.000Z");
  return {
    auth_principal_id: "ap_123",
    login_email: "root@example.test",
    login_email_normalized: "root@example.test",
    auth_status: "active",
    password_changed_at: now,
    created_at: now,
    updated_at: now,
    root_user_id: "ru_123",
    ...overrides,
  };
}

export function createAuthSshPublicKeyRecord(
  overrides: Partial<AuthSshPublicKeyRecord> = {},
): AuthSshPublicKeyRecord {
  const now = new Date("2026-03-26T00:00:00.000Z");
  return {
    auth_ssh_public_key_id: "key_123",
    auth_principal_id: "ap_123",
    label: "laptop",
    algorithm: "ssh-ed25519",
    public_key_openssh: sampleEd25519PublicKey,
    fingerprint: "SHA256:testfingerprint",
    status: "active",
    created_at: now,
    revoked_at: null,
    ...overrides,
  };
}

export function createAuthSessionRecord(
  overrides: Partial<AuthSessionRecord> = {},
): AuthSessionRecord {
  const authenticatedAt = new Date("2026-03-26T00:00:00.000Z");
  const expiresAt = new Date("2026-03-26T08:00:00.000Z");
  return {
    session_id: "sess_123",
    auth_principal_id: "ap_123",
    root_user_id: "ru_123",
    authenticated_at: authenticatedAt,
    expires_at: expiresAt,
    revoked_at: null,
    created_at: authenticatedAt,
    ...overrides,
  };
}

export function createAuthLoginChallengeRecord(
  overrides: Partial<AuthLoginChallengeRecord> = {},
): AuthLoginChallengeRecord {
  const now = new Date("2026-03-26T00:00:00.000Z");
  return {
    challenge_id: "chal_123",
    auth_principal_id: "ap_123",
    purpose: "root-login",
    challenge_text: "challenge",
    expires_at: new Date("2026-03-26T00:05:00.000Z"),
    used_at: null,
    created_at: now,
    ...overrides,
  };
}

export function createEd25519KeyMaterial(): Ed25519KeyMaterial {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const jwk = publicKey.export({ format: "jwk" }) as { x: string };
  const keyBytes = Buffer.from(jwk.x.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const algorithm = Buffer.from("ssh-ed25519", "utf8");
  const body = Buffer.concat([
    Buffer.from([0, 0, 0, algorithm.length]),
    algorithm,
    Buffer.from([0, 0, 0, keyBytes.length]),
    keyBytes,
  ]);
  const publicKeyOpenSsh = `ssh-ed25519 ${body.toString("base64")} generated@test`;
  const parsed = parseEd25519PublicKey(publicKeyOpenSsh);

  return {
    publicKeyOpenSsh,
    fingerprint: parsed.fingerprint,
    signChallengeText(challengeText: string) {
      return sign(null, Buffer.from(challengeText, "utf8"), privateKey).toString("base64");
    },
  };
}

export function createRootAuthServiceHarness(): RootAuthServiceHarness {
  const authRepository: RootAuthRepository = {
    createAuthPrincipal: vi.fn(async (input) => {
      const now = new Date("2026-03-26T00:00:00.000Z");
      const record: AuthPrincipalRecord = {
        auth_principal_id: input.authPrincipalId,
        login_email: input.loginEmail,
        login_email_normalized: input.loginEmailNormalized,
        auth_status: "active",
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      };
      return record;
    }),
    createRootUserLink: vi.fn(async () => undefined),
    findPrincipalByNormalizedEmail: vi.fn(async () => null),
    findPrincipalById: vi.fn(async () => null),
    verifyPassword: vi.fn(async () => false),
    createChallenge: vi.fn(async (input) => createAuthLoginChallengeRecord({
      challenge_id: input.challengeId,
      auth_principal_id: input.authPrincipalId,
      purpose: input.purpose,
      challenge_text: input.challengeText,
      expires_at: input.expiresAt,
    })),
    findChallengeById: vi.fn(async () => null),
    markChallengeUsed: vi.fn(async () => undefined),
    createSession: vi.fn(async (input) => createAuthSessionRecord({
      session_id: input.sessionId,
      auth_principal_id: input.authPrincipalId,
      root_user_id: input.rootUserId,
      authenticated_at: input.authenticatedAt,
      expires_at: input.expiresAt,
    })),
    revokeSession: vi.fn(async () => false),
    revokeOtherSessions: vi.fn(async () => undefined),
    setPassword: vi.fn(async () => undefined),
    addSshPublicKey: vi.fn(async (input) => createAuthSshPublicKeyRecord({
      auth_ssh_public_key_id: input.keyId,
      auth_principal_id: input.authPrincipalId,
      label: input.label,
      algorithm: input.algorithm,
      public_key_openssh: input.publicKeyOpenSsh,
      fingerprint: input.fingerprint,
    })),
    findActiveSshKeyByFingerprint: vi.fn(async () => null),
    listSshPublicKeys: vi.fn(async () => []),
    revokeSshPublicKey: vi.fn(async () => false),
    listSessions: vi.fn(async () => []),
    findOwnedSession: vi.fn(async () => null),
    createAuditEvent: vi.fn(async () => undefined),
    findActiveSessionById: vi.fn(async () => null),
    touchSession: vi.fn(async () => null),
  };

  const rootUsersAuthStateReader: RootUsersAuthStateReader = {
    findAuthStateById: vi.fn(async () => null),
  };

  const platformSecurityRepository: PlatformSecurityRepository = {
    incrementCounter: vi.fn(async () => 0),
    clearCounters: vi.fn(async () => undefined),
    findActiveLockdowns: vi.fn(async () => []),
    createLockdown: vi.fn(async () => false),
    createSecurityAuditEvent: vi.fn(async () => undefined),
  };

  return {
    service: createRootAuthService(
      authRepository,
      rootUsersAuthStateReader,
      platformSecurityRepository,
    ),
    authRepository,
    rootUsersAuthStateReader,
    platformSecurityRepository,
  };
}
