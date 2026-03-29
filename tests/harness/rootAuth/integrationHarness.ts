import express, { type Express } from "express";
import helmet from "helmet";
import { createRootAuthRouter } from "../../../src/features/rootAuth/transport/router";
import { createRootUsersRouter } from "../../../src/features/rootUsers/transport/router";
import { createRootUsersService } from "../../../src/features/rootUsers/domain/service";
import { createRequireRootSession } from "../../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../../src/lib/security/rateLimit";
import { env } from "../../../src/config/env";
import type { RootAuthRepository } from "../../../src/features/rootAuth/persistence/repository";
import type {
  AuthLoginChallengeRecord,
  AuthPrincipalRecord,
  AuthPrincipalWithRootUserRecord,
  AuthSessionRecord,
  AuthSshPublicKeyRecord,
  CreateAuthAuditEventInput,
} from "../../../src/features/rootAuth/persistence/types";
import type { RootUsersRepository } from "../../../src/features/rootUsers/persistence/repository";
import type { RootUserAuthState, RootUserData } from "../../../src/features/rootUsers/domain/types";
import type { PlatformSecurityRepository } from "../../../src/lib/security/repository";
import type {
  ActiveLockdownRecord,
  CounterInput,
  CreateLockdownInput,
  LockdownLookup,
  SecurityAuditEventInput,
} from "../../../src/lib/security/types";
import { createEd25519KeyMaterial, type Ed25519KeyMaterial } from "./serviceHarness";

interface StoredPrincipal {
  record: AuthPrincipalRecord;
  rootUserId: string;
  password: string;
}

interface StoredRootUser extends RootUserData {}

export interface SeededAuthIdentity {
  rootUserId: string;
  authPrincipalId: string;
  loginEmail: string;
  password: string;
  sshKey: Ed25519KeyMaterial;
}

export interface RootAuthIntegrationHarness {
  app: Express;
  authRepository: RootAuthRepository;
  rootUsersRepository: RootUsersRepository;
  platformSecurityRepository: PlatformSecurityRepository;
  seedRootUser(overrides?: Partial<StoredRootUser>): StoredRootUser;
  deleteSeededRootUser(rootUserId: string): void;
  seedAuthIdentity(options?: {
    rootUser?: Partial<StoredRootUser>;
    loginEmail?: string;
    password?: string;
  }): SeededAuthIdentity;
  bootstrapAuthForRootUser(options: {
    rootUserId: string;
    loginEmail?: string;
    password?: string;
    keyLabel?: string;
    authPrincipalId?: string;
  }): SeededAuthIdentity;
  getAuthAuditEvents(): CreateAuthAuditEventInput[];
  getSecurityAuditEvents(): SecurityAuditEventInput[];
  getSessionIdsForAuthPrincipal(authPrincipalId: string): string[];
  getSshKeyIdsForAuthPrincipal(authPrincipalId: string): string[];
  getActiveLockdowns(): ActiveLockdownRecord[];
}

export interface RootAuthIntegrationHarnessOptions {
  platformSecurityEnabled?: boolean;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeOptionalName(value: string | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return value.trim().toLowerCase();
}

function matchesPrefix(value: string | null | undefined, prefix: string | undefined): boolean {
  if (!prefix) {
    return true;
  }
  return (value ?? "").toLowerCase().startsWith(prefix.toLowerCase());
}

function matchesRange(
  value: Date | null,
  from: string | undefined,
  to: string | undefined,
): boolean {
  if (from && (!value || value.getTime() < new Date(from).getTime())) {
    return false;
  }
  if (to && (!value || value.getTime() > new Date(to).getTime())) {
    return false;
  }
  return true;
}

function compareRootUsers(a: StoredRootUser, b: StoredRootUser, orderBy: string, direction: "asc" | "desc"): number {
  const factor = direction === "asc" ? 1 : -1;
  const valueFor = (record: StoredRootUser) => {
    switch (orderBy) {
      case "email":
        return record.email;
      case "firstName":
        return record.firstName ?? "";
      case "lastName":
        return record.lastName ?? "";
      case "status":
        return record.status;
      case "createdAt":
        return record.createdAt.getTime();
      case "deletedAt":
        return record.deletedAt?.getTime() ?? Number.NEGATIVE_INFINITY;
      case "updatedAt":
      default:
        return record.updatedAt.getTime();
    }
  };
  const left = valueFor(a);
  const right = valueFor(b);
  if (left < right) {
    return -1 * factor;
  }
  if (left > right) {
    return 1 * factor;
  }
  return a.rootUserId.localeCompare(b.rootUserId) * factor;
}

function applyRootUserFilters(items: StoredRootUser[], filters: import("../../../src/features/rootUsers/domain/types").RootUserListFilters): StoredRootUser[] {
  return items.filter((item) => {
    if (!matchesPrefix(item.email, filters.emailPrefix)) {
      return false;
    }
    if (!matchesPrefix(item.firstName, filters.firstNamePrefix)) {
      return false;
    }
    if (!matchesPrefix(item.lastName, filters.lastNamePrefix)) {
      return false;
    }
    if (!matchesRange(item.createdAt, filters.createdAtFrom, filters.createdAtTo)) {
      return false;
    }
    if (!matchesRange(item.updatedAt, filters.updatedAtFrom, filters.updatedAtTo)) {
      return false;
    }
    if (!matchesRange(item.deletedAt, filters.deletedAtFrom, filters.deletedAtTo)) {
      return false;
    }
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    if (filters.excludeAnonymized === true && item.anonymized) {
      return false;
    }
    return true;
  });
}

function paginateAndSortRootUsers(
  items: StoredRootUser[],
  input: import("../../../src/features/rootUsers/domain/types").RootUserListInput,
) {
  const matching = applyRootUserFilters(items, input.filters);
  const sorted = [...matching].sort((a, b) => compareRootUsers(a, b, input.orderBy, input.orderDirection));
  const start = (input.page - 1) * input.pageSize;
  return {
    items: sorted.slice(start, start + input.pageSize),
    totalMatchingRecords: matching.length,
  };
}

function createRootUserRecord(overrides: Partial<StoredRootUser> = {}): StoredRootUser {
  const now = new Date("2026-03-26T00:00:00.000Z");
  return {
    rootUserId: "11111111-1111-1111-1111-111111111111",
    email: "root@example.test",
    firstName: "Root",
    lastName: "Admin",
    anonymized: false,
    status: "active",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

function toAuthState(record: StoredRootUser): RootUserAuthState {
  return {
    rootUserId: record.rootUserId,
    email: record.email,
    status: record.status,
    anonymized: record.anonymized,
    deletedAt: record.deletedAt,
  };
}

function createInMemoryPlatformSecurityRepository(): PlatformSecurityRepository {
  const counters = new Map<string, number>();
  const lockdowns: ActiveLockdownRecord[] = [];
  const securityAuditEvents: SecurityAuditEventInput[] = [];
  const repository: PlatformSecurityRepository = {
    incrementCounter: async (input: CounterInput) => {
      const key = [input.namespace, input.subjectScope, input.subjectKey, input.signal].join("|");
      const next = (counters.get(key) ?? 0) + 1;
      counters.set(key, next);
      return next;
    },
    clearCounters: async (namespace, subjectScope, subjectKey, signal) => {
      counters.delete([namespace, subjectScope, subjectKey, signal].join("|"));
    },
    findActiveLockdowns: async (lookups: LockdownLookup[], signal: string, now: Date) =>
      lockdowns.filter(
        (item) =>
          item.signal === signal &&
          item.expires_at.getTime() > now.getTime() &&
          lookups.some(
            (lookup) =>
              lookup.subjectScope === item.subject_scope && lookup.subjectKey === item.subject_key,
          ),
      ),
    createLockdown: async (input: CreateLockdownInput) => {
      const exists = lockdowns.some(
        (item) =>
          item.subject_scope === input.subjectScope &&
          item.subject_key === input.subjectKey &&
          item.signal === input.signal &&
          item.expires_at.getTime() > input.startedAt.getTime(),
      );

      if (exists) {
        return false;
      }

      lockdowns.push({
        lockdown_id: input.lockdownId,
        subject_scope: input.subjectScope,
        subject_key: input.subjectKey,
        signal: input.signal,
        reason: input.reason,
        endpoint_class: input.endpointClass,
        started_at: input.startedAt,
        expires_at: input.expiresAt,
        created_at: input.startedAt,
      });
      return true;
    },
    createSecurityAuditEvent: async (input: SecurityAuditEventInput) => {
      securityAuditEvents.push(input);
    },
  };

  (repository as unknown as { __securityAuditEvents: SecurityAuditEventInput[] }).__securityAuditEvents =
    securityAuditEvents;
  (repository as unknown as { __lockdowns: ActiveLockdownRecord[] }).__lockdowns = lockdowns;

  return repository;
}

function createInMemoryRootUsersRepository(store: Map<string, StoredRootUser>): RootUsersRepository {
  return {
    create: async (input) => {
      const record = createRootUserRecord({
        rootUserId: input.rootUserId,
        email: normalizeEmail(input.email),
        firstName: input.firstName,
        lastName: input.lastName,
      });
      store.set(record.rootUserId, record);
      return record;
    },
    findAuthStateById: async (rootUserId) => {
      const record = store.get(rootUserId);
      return record ? toAuthState(record) : null;
    },
    findVisibleById: async (rootUserId) => {
      const record = store.get(rootUserId);
      if (!record || record.deletedAt || record.anonymized) {
        return null;
      }
      return record;
    },
    findVisibleByEmail: async (email) => {
      const normalized = normalizeEmail(email);
      return [...store.values()].find((record) => !record.deletedAt && !record.anonymized && record.email === normalized) ?? null;
    },
    findAnyById: async (rootUserId) => store.get(rootUserId) ?? null,
    findNonDeletedByEmail: async (email) => {
      const normalized = normalizeEmail(email);
      return [...store.values()].find((record) => !record.deletedAt && record.email === normalized) ?? null;
    },
    listAll: async (input) => {
      const searchable = [...store.values()].filter((item) => !item.deletedAt && !item.anonymized);
      const result = paginateAndSortRootUsers(searchable, input);
      return {
        items: result.items,
        totalSearchableRecords: searchable.length,
        totalMatchingRecords: result.totalMatchingRecords,
      };
    },
    listActive: async (input) => {
      const searchable = [...store.values()].filter(
        (item) => !item.deletedAt && !item.anonymized && item.status === "active",
      );
      const result = paginateAndSortRootUsers(searchable, input);
      return {
        items: result.items,
        totalSearchableRecords: searchable.length,
        totalMatchingRecords: result.totalMatchingRecords,
      };
    },
    listDeleted: async (input) => {
      const searchable = [...store.values()].filter((item) => item.deletedAt);
      const result = paginateAndSortRootUsers(searchable, input);
      return {
        items: result.items,
        totalSearchableRecords: searchable.length,
        totalMatchingRecords: result.totalMatchingRecords,
      };
    },
    update: async (input) => {
      const current = store.get(input.rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next: StoredRootUser = {
        ...current,
        email: input.email ? normalizeEmail(input.email) : current.email,
        firstName: input.firstName ?? current.firstName,
        lastName: input.lastName ?? current.lastName,
        status: input.status ?? current.status,
        updatedAt: new Date(),
      };
      store.set(next.rootUserId, next);
      return next;
    },
    softDelete: async (rootUserId) => {
      const current = store.get(rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next = { ...current, deletedAt: new Date(), updatedAt: new Date() };
      next.status = "inactive";
      store.set(rootUserId, next);
      return next;
    },
    remove: async (rootUserId, anonymizedEmail, anonymizedFirstName, anonymizedLastName) => {
      const current = store.get(rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next = {
        ...current,
        email: anonymizedEmail,
        firstName: anonymizedFirstName,
        lastName: anonymizedLastName,
        anonymized: true,
        status: "inactive" as const,
        deletedAt: new Date(),
        updatedAt: new Date(),
      };
      store.set(rootUserId, next);
      return next;
    },
    reactivate: async (rootUserId) => {
      const current = store.get(rootUserId);
      if (!current) {
        throw new Error("Missing root user");
      }
      const next = { ...current, deletedAt: null, updatedAt: new Date() };
      next.status = "active";
      store.set(rootUserId, next);
      return next;
    },
  };
}

function createInMemoryRootAuthRepository(
  principals: Map<string, StoredPrincipal>,
  challenges: Map<string, AuthLoginChallengeRecord>,
  sessions: Map<string, AuthSessionRecord>,
  sshKeys: Map<string, AuthSshPublicKeyRecord>,
  auditEvents: CreateAuthAuditEventInput[],
): RootAuthRepository {
  function findPrincipalWithRootUser(authPrincipalId: string): AuthPrincipalWithRootUserRecord | null {
    const stored = principals.get(authPrincipalId);
    return stored
      ? {
          ...stored.record,
          root_user_id: stored.rootUserId,
        }
      : null;
  }

  return {
    createAuthPrincipal: async (input) => {
      const now = new Date();
      const record: AuthPrincipalRecord = {
        auth_principal_id: input.authPrincipalId,
        login_email: input.loginEmail,
        login_email_normalized: input.loginEmailNormalized,
        auth_status: "active",
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      };
      principals.set(record.auth_principal_id, {
        record,
        rootUserId: "",
        password: input.password,
      });
      return record;
    },
    createRootUserLink: async (input) => {
      const stored = principals.get(input.authPrincipalId);
      if (!stored) {
        throw new Error("Missing principal");
      }
      stored.rootUserId = input.rootUserId;
      principals.set(input.authPrincipalId, stored);
    },
    findPrincipalByNormalizedEmail: async (email) => {
      const normalized = normalizeEmail(email);
      const stored = [...principals.values()].find(
        (item) => item.record.login_email_normalized === normalized && item.rootUserId,
      );
      return stored
        ? {
            ...stored.record,
            root_user_id: stored.rootUserId,
          }
        : null;
    },
    findPrincipalById: async (authPrincipalId) => findPrincipalWithRootUser(authPrincipalId),
    verifyPassword: async (authPrincipalId, password) => principals.get(authPrincipalId)?.password === password,
    createChallenge: async (input) => {
      const record: AuthLoginChallengeRecord = {
        challenge_id: input.challengeId,
        auth_principal_id: input.authPrincipalId,
        purpose: input.purpose,
        challenge_text: input.challengeText,
        expires_at: input.expiresAt,
        used_at: null,
        created_at: new Date(),
      };
      challenges.set(record.challenge_id, record);
      return record;
    },
    findChallengeById: async (challengeId) => challenges.get(challengeId) ?? null,
    markChallengeUsed: async (challengeId, usedAt) => {
      const current = challenges.get(challengeId);
      if (current) {
        challenges.set(challengeId, { ...current, used_at: usedAt });
      }
    },
    createSession: async (input) => {
      const record: AuthSessionRecord = {
        session_id: input.sessionId,
        auth_principal_id: input.authPrincipalId,
        root_user_id: input.rootUserId,
        authenticated_at: input.authenticatedAt,
        expires_at: input.expiresAt,
        revoked_at: null,
        created_at: input.authenticatedAt,
      };
      sessions.set(record.session_id, record);
      return record;
    },
    revokeSession: async (sessionId, authPrincipalId) => {
      const current = sessions.get(sessionId);
      if (!current || current.auth_principal_id !== authPrincipalId || current.revoked_at) {
        return false;
      }
      sessions.set(sessionId, { ...current, revoked_at: new Date() });
      return true;
    },
    revokeOtherSessions: async (authPrincipalId, exceptSessionId) => {
      for (const [sessionId, session] of sessions.entries()) {
        if (session.auth_principal_id === authPrincipalId && sessionId !== exceptSessionId && !session.revoked_at) {
          sessions.set(sessionId, { ...session, revoked_at: new Date() });
        }
      }
    },
    setPassword: async (authPrincipalId, newPassword, changedAt) => {
      const current = principals.get(authPrincipalId);
      if (!current) {
        throw new Error("Missing principal");
      }
      principals.set(authPrincipalId, {
        ...current,
        password: newPassword,
        record: {
          ...current.record,
          password_changed_at: changedAt,
          updated_at: changedAt,
        },
      });
    },
    addSshPublicKey: async (input) => {
      const record: AuthSshPublicKeyRecord = {
        auth_ssh_public_key_id: input.keyId,
        auth_principal_id: input.authPrincipalId,
        label: input.label,
        algorithm: input.algorithm,
        public_key_openssh: input.publicKeyOpenSsh,
        fingerprint: input.fingerprint,
        status: "active",
        created_at: new Date(),
        revoked_at: null,
      };
      sshKeys.set(record.auth_ssh_public_key_id, record);
      return record;
    },
    findActiveSshKeyByFingerprint: async (authPrincipalId, fingerprint) =>
      [...sshKeys.values()].find(
        (item) =>
          item.auth_principal_id === authPrincipalId &&
          item.fingerprint === fingerprint &&
          item.status === "active" &&
          !item.revoked_at,
      ) ?? null,
    listSshPublicKeys: async (authPrincipalId) =>
      [...sshKeys.values()].filter((item) => item.auth_principal_id === authPrincipalId),
    revokeSshPublicKey: async (keyId, authPrincipalId, revokedAt) => {
      const current = sshKeys.get(keyId);
      if (!current || current.auth_principal_id !== authPrincipalId || current.revoked_at) {
        return false;
      }
      sshKeys.set(keyId, { ...current, status: "revoked", revoked_at: revokedAt });
      return true;
    },
    listSessions: async (authPrincipalId) =>
      [...sessions.values()].filter((item) => item.auth_principal_id === authPrincipalId),
    findOwnedSession: async (sessionId, authPrincipalId) => {
      const current = sessions.get(sessionId);
      return current && current.auth_principal_id === authPrincipalId ? current : null;
    },
    createAuditEvent: async (input) => {
      auditEvents.push(input);
    },
    findActiveSessionById: async (sessionId) => {
      const current = sessions.get(sessionId);
      if (!current || current.revoked_at || current.expires_at.getTime() <= Date.now()) {
        return null;
      }
      return current;
    },
    touchSession: async (sessionId, expiresAt) => {
      const current = sessions.get(sessionId);
      if (!current || current.revoked_at || current.expires_at.getTime() <= Date.now()) {
        return null;
      }
      const next = { ...current, expires_at: expiresAt };
      sessions.set(sessionId, next);
      return next;
    },
  };
}

export function createRootAuthIntegrationHarness(
  options: RootAuthIntegrationHarnessOptions = {},
): RootAuthIntegrationHarness {
  const rootUsers = new Map<string, StoredRootUser>();
  const principals = new Map<string, StoredPrincipal>();
  const challenges = new Map<string, AuthLoginChallengeRecord>();
  const sessions = new Map<string, AuthSessionRecord>();
  const sshKeys = new Map<string, AuthSshPublicKeyRecord>();
  const auditEvents: CreateAuthAuditEventInput[] = [];
  const rootUsersRepository = createInMemoryRootUsersRepository(rootUsers);
  const authRepository = createInMemoryRootAuthRepository(
    principals,
    challenges,
    sessions,
    sshKeys,
    auditEvents,
  );
  const platformSecurityRepository = createInMemoryPlatformSecurityRepository();
  const securityEvents = (platformSecurityRepository as unknown as {
    __securityAuditEvents?: SecurityAuditEventInput[];
  }).__securityAuditEvents;
  const activeLockdowns = (platformSecurityRepository as unknown as {
    __lockdowns?: ActiveLockdownRecord[];
  }).__lockdowns;
  const rootUsersAuthStateReader = {
    findAuthStateById: async (rootUserId: string) => {
      const record = rootUsers.get(rootUserId);
      return record ? toAuthState(record) : null;
    },
  };
  const rootUsersBrowserSummaryReader = {
    findBrowserSummaryById: async (rootUserId: string) => {
      const record = rootUsers.get(rootUserId);
      if (!record || record.deletedAt) {
        return null;
      }
      return {
        rootUserId: record.rootUserId,
        email: record.email,
        ...(record.firstName ? { firstName: record.firstName } : {}),
        ...(record.lastName ? { lastName: record.lastName } : {}),
      };
    },
  };

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  const platformSecurityEnabled = options.platformSecurityEnabled ?? env.platformSecurity.enabled;
  const publicReadRateLimit = createRateLimitMiddleware({
    enabled: platformSecurityEnabled,
    repository: platformSecurityRepository,
    policy: {
      endpointClass: "public-read",
      windowSeconds: env.platformSecurity.rateLimitPolicies.publicRead.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.publicRead.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "ip",
    getSubjectKey: (request) => request.ip ?? null,
  });
  app.get("/v1/health", publicReadRateLimit, (_request, response) => {
    response.status(200).json({ ok: true });
  });
  app.use(
    "/v1/root-auth",
    createRootAuthRouter(
      authRepository,
      rootUsersAuthStateReader,
      rootUsersBrowserSummaryReader,
      platformSecurityRepository,
    ),
  );

  const requireRootSession = createRequireRootSession(authRepository);
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: platformSecurityEnabled,
    repository: platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
  });
  app.use(
    "/v1/root-users",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createRootUsersRouter(createRootUsersService(rootUsersRepository)),
  );

  return {
    app,
    authRepository,
    rootUsersRepository,
    platformSecurityRepository,
    seedRootUser(overrides = {}) {
      const record = createRootUserRecord(overrides);
      rootUsers.set(record.rootUserId, record);
      return record;
    },
    deleteSeededRootUser(rootUserId: string) {
      rootUsers.delete(rootUserId);
    },
    seedAuthIdentity(options = {}) {
      const rootUserOverrides = options.rootUser ?? {};
      const rootUser = createRootUserRecord({
        rootUserId: rootUserOverrides.rootUserId ?? "11111111-1111-1111-1111-111111111111",
        email: normalizeEmail(rootUserOverrides.email ?? "root@example.test"),
        ...(rootUserOverrides.firstName !== undefined ? { firstName: rootUserOverrides.firstName } : {}),
        ...(rootUserOverrides.lastName !== undefined ? { lastName: rootUserOverrides.lastName } : {}),
        ...(rootUserOverrides.anonymized !== undefined ? { anonymized: rootUserOverrides.anonymized } : {}),
        ...(rootUserOverrides.status !== undefined ? { status: rootUserOverrides.status } : {}),
        ...(rootUserOverrides.deletedAt !== undefined ? { deletedAt: rootUserOverrides.deletedAt } : {}),
        ...(rootUserOverrides.createdAt !== undefined ? { createdAt: rootUserOverrides.createdAt } : {}),
        ...(rootUserOverrides.updatedAt !== undefined ? { updatedAt: rootUserOverrides.updatedAt } : {}),
      });
      rootUsers.set(rootUser.rootUserId, rootUser);

      const authPrincipalId =
        rootUserOverrides.rootUserId !== undefined
          ? `ap_${rootUserOverrides.rootUserId.replace(/-/g, "").slice(0, 12)}`
          : `ap_${rootUser.rootUserId.replace(/-/g, "").slice(0, 12)}`;
      const loginEmail = normalizeEmail(options.loginEmail ?? rootUser.email);
      const password = options.password ?? "StrongPass1!";
      const now = new Date("2026-03-26T00:00:00.000Z");
      const principalRecord: AuthPrincipalRecord = {
        auth_principal_id: authPrincipalId,
        login_email: loginEmail,
        login_email_normalized: loginEmail,
        auth_status: "active",
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      };
      principals.set(authPrincipalId, {
        record: principalRecord,
        rootUserId: rootUser.rootUserId,
        password,
      });

      const key = createEd25519KeyMaterial();
      const keyId = `key_${authPrincipalId}`;
      sshKeys.set(keyId, {
        auth_ssh_public_key_id: keyId,
        auth_principal_id: authPrincipalId,
        label: "seeded",
        algorithm: "ssh-ed25519",
        public_key_openssh: key.publicKeyOpenSsh,
        fingerprint: key.fingerprint,
        status: "active",
        created_at: now,
        revoked_at: null,
      });

      return {
        rootUserId: rootUser.rootUserId,
        authPrincipalId,
        loginEmail,
        password,
        sshKey: key,
      };
    },
    bootstrapAuthForRootUser(options) {
      const rootUser = rootUsers.get(options.rootUserId);
      if (!rootUser) {
        throw new Error(`Missing root user for bootstrap: ${options.rootUserId}`);
      }

      const authPrincipalId = options.authPrincipalId ?? `ap_bootstrap_${rootUser.rootUserId.replace(/-/g, "").slice(0, 8)}`;
      const loginEmail = normalizeEmail(options.loginEmail ?? rootUser.email);
      const password = options.password ?? "StrongPass1!";
      const existing = principals.get(authPrincipalId);
      const now = new Date("2026-03-26T00:00:00.000Z");

      if (!existing) {
        principals.set(authPrincipalId, {
          record: {
            auth_principal_id: authPrincipalId,
            login_email: loginEmail,
            login_email_normalized: loginEmail,
            auth_status: "active",
            password_changed_at: now,
            created_at: now,
            updated_at: now,
          },
          rootUserId: rootUser.rootUserId,
          password,
        });
      }

      const key = createEd25519KeyMaterial();
      const existingKey = [...sshKeys.values()].find(
        (item) => item.auth_principal_id === authPrincipalId && item.label === (options.keyLabel ?? "bootstrap"),
      );

      if (!existingKey) {
        sshKeys.set(`key_${authPrincipalId}`, {
          auth_ssh_public_key_id: `key_${authPrincipalId}`,
          auth_principal_id: authPrincipalId,
          label: options.keyLabel ?? "bootstrap",
          algorithm: "ssh-ed25519",
          public_key_openssh: key.publicKeyOpenSsh,
          fingerprint: key.fingerprint,
          status: "active",
          created_at: now,
          revoked_at: null,
        });
      }

      return {
        rootUserId: rootUser.rootUserId,
        authPrincipalId,
        loginEmail,
        password,
        sshKey: existingKey
          ? {
              publicKeyOpenSsh: existingKey.public_key_openssh,
              fingerprint: existingKey.fingerprint,
              signChallengeText: key.signChallengeText,
            }
          : key,
      };
    },
    getAuthAuditEvents() {
      return [...auditEvents];
    },
    getSecurityAuditEvents() {
      return securityEvents ? [...securityEvents] : [];
    },
    getActiveLockdowns() {
      return activeLockdowns ? [...activeLockdowns] : [];
    },
    getSessionIdsForAuthPrincipal(authPrincipalId: string) {
      return [...sessions.values()]
        .filter((item) => item.auth_principal_id === authPrincipalId)
        .map((item) => item.session_id);
    },
    getSshKeyIdsForAuthPrincipal(authPrincipalId: string) {
      return [...sshKeys.values()]
        .filter((item) => item.auth_principal_id === authPrincipalId)
        .map((item) => item.auth_ssh_public_key_id);
    },
  };
}
