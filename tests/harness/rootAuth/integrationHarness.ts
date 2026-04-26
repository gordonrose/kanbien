import express, { type Express } from "express";
import helmet from "helmet";
import { createRootAuthRouter } from "../../../src/features/rootAuth/transport/router";
import {
  ROOT_AUTHZ_CAPABILITY_CATALOG,
  ROOT_USER_ADMIN_ROLE_KEY,
} from "../../../src/features/rootRoles/domain/capabilityCatalog";
import { createRootRolesService } from "../../../src/features/rootRoles/domain/service";
import {
  createRootRolesRouter,
  createRootUserRoleAssignmentsRouter,
} from "../../../src/features/rootRoles/transport/router";
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
import type { AssetsService } from "../../../src/features/assets";
import type { RootRolesRepository } from "../../../src/features/rootRoles/persistence/repository";
import type {
  RootCapabilityCatalogItem,
  RootRoleAssignmentData,
  RootRoleData,
  RootUserEligibilityState,
} from "../../../src/features/rootRoles/domain/types";
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

export interface RootRoleAuditEventRecord {
  actorRootUserId: string;
  targetRootUserId?: string;
  rootRoleId?: string;
  assignmentId?: string;
  eventType: string;
  eventOutcome: "success" | "failure";
  reason?: string;
  beforeState?: unknown;
  afterState?: unknown;
  occurredAt: Date;
}

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
  setRootUserCapabilities(rootUserId: string, capabilityKeys: string[]): void;
  getRootUserCapabilities(rootUserId: string): string[];
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
  getRootRoleAuditEvents(): RootRoleAuditEventRecord[];
  getSessionIdsForAuthPrincipal(authPrincipalId: string): string[];
  getSshKeyIdsForAuthPrincipal(authPrincipalId: string): string[];
  getActiveLockdowns(): ActiveLockdownRecord[];
}

export interface RootAuthIntegrationHarnessOptions {
  platformSecurityEnabled?: boolean;
  assetsService?: AssetsService;
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
    profilePictureAssetId: null,
    profilePictureAltText: null,
    profilePictureDecorative: false,
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
        profilePictureAssetId: input.profilePictureAssetId ?? null,
        profilePictureAltText: input.profilePictureAssetId ? input.profilePictureAltText ?? null : null,
        profilePictureDecorative: input.profilePictureAssetId
          ? input.profilePictureDecorative ?? false
          : false,
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
        profilePictureAssetId:
          input.profilePictureAssetId !== undefined
            ? input.profilePictureAssetId
            : current.profilePictureAssetId,
        profilePictureAltText:
          input.profilePictureAltText !== undefined
            ? input.profilePictureAltText
            : current.profilePictureAltText,
        profilePictureDecorative:
          input.profilePictureDecorative !== undefined
            ? input.profilePictureDecorative
            : current.profilePictureDecorative,
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
        profilePictureAssetId: null,
        profilePictureAltText: null,
        profilePictureDecorative: false,
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

function createRootUserAdminRole(): RootRoleData {
  const now = new Date("2026-03-26T00:00:00.000Z");
  return {
    rootRoleId: "00000000-0000-0000-0000-000000000001",
    roleKey: ROOT_USER_ADMIN_ROLE_KEY,
    displayName: "Root User Admin",
    description: "Protected bootstrap root operator role.",
    protected: true,
    createdAt: now,
    updatedAt: now,
    deactivatedAt: null,
    activeGrantCount: ROOT_AUTHZ_CAPABILITY_CATALOG.length,
  };
}

function createInMemoryRootRolesRepository(
  rootUsers: Map<string, StoredRootUser>,
) {
  const roles = new Map<string, RootRoleData>();
  const roleGrants = new Map<string, RootCapabilityCatalogItem[]>();
  const assignments = new Map<string, RootRoleAssignmentData>();
  const auditEvents: RootRoleAuditEventRecord[] = [];
  const rootUserAdminRole = createRootUserAdminRole();
  roles.set(rootUserAdminRole.rootRoleId, rootUserAdminRole);
  roleGrants.set(
    rootUserAdminRole.rootRoleId,
    ROOT_AUTHZ_CAPABILITY_CATALOG.map((entry) => ({
      capabilityKey: entry.capabilityKey,
      description: entry.description,
      mandatory: entry.mandatoryForRootUserAdmin,
      protected: entry.protectedForRootUserAdmin,
    })),
  );

  function syncBootstrapAssignment(rootUserId: string): void {
    const rootUser = rootUsers.get(rootUserId);
    if (!rootUser || rootUser.anonymized) {
      return;
    }
    const existing = [...assignments.values()].find(
      (assignment) =>
        assignment.rootUserId === rootUserId &&
        assignment.rootRoleId === rootUserAdminRole.rootRoleId &&
        assignment.unassignedAt === null,
    );
    if (existing) {
      return;
    }
    assignments.set(`assign_${rootUserId}`, {
      rootRoleAssignmentId: `assign_${rootUserId}`,
      rootUserId,
      rootRoleId: rootUserAdminRole.rootRoleId,
      roleKey: rootUserAdminRole.roleKey,
      displayName: rootUserAdminRole.displayName,
      protected: true,
      assignedAt: new Date("2026-03-26T00:00:00.000Z"),
      unassignedAt: null,
    });
  }

  function getEffectivePermissionsForRootUser(rootUserId: string) {
    const activeAssignments = [...assignments.values()].filter(
      (assignment) => assignment.rootUserId === rootUserId && assignment.unassignedAt === null,
    );
    const byCapability = new Map<string, string[]>();
    for (const assignment of activeAssignments) {
      for (const grant of roleGrants.get(assignment.rootRoleId) ?? []) {
        const grantedByRoleKeys = byCapability.get(grant.capabilityKey) ?? [];
        if (!grantedByRoleKeys.includes(assignment.roleKey)) {
          grantedByRoleKeys.push(assignment.roleKey);
        }
        byCapability.set(grant.capabilityKey, grantedByRoleKeys);
      }
    }
    return {
      rootUserId,
      roles: activeAssignments,
      permissions: [...byCapability.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([capabilityKey, grantedByRoleKeys]) => ({
          capabilityKey,
          grantedByRoleKeys,
        })),
    };
  }

  function pushAuditEvent(input: Omit<RootRoleAuditEventRecord, "occurredAt">): void {
    auditEvents.push({
      ...input,
      occurredAt: new Date(),
    });
  }

  const repository: RootRolesRepository = {
    async hasCapability(rootUserId, capabilityKey) {
      return getEffectivePermissionsForRootUser(rootUserId).permissions.some(
        (permission) => permission.capabilityKey === capabilityKey,
      );
    },
    async createRole(input) {
      const role: RootRoleData = {
        rootRoleId: input.rootRoleId,
        roleKey: input.roleKey.trim(),
        displayName: input.displayName.trim(),
        description: input.description.trim(),
        protected: input.isProtected,
        createdAt: new Date(),
        updatedAt: new Date(),
        deactivatedAt: null,
        activeGrantCount: 0,
      };
      roles.set(role.rootRoleId, role);
      roleGrants.set(role.rootRoleId, []);
      pushAuditEvent({
        actorRootUserId: input.actorRootUserId,
        rootRoleId: role.rootRoleId,
        eventType: "root_role_created",
        eventOutcome: "success",
        afterState: role,
      });
      return role;
    },
    async findRoleById(rootRoleId) {
      return roles.get(rootRoleId) ?? null;
    },
    async findRoleByKey(roleKey) {
      return (
        [...roles.values()].find(
          (role) =>
            role.roleKey.trim().toLowerCase() === roleKey.trim().toLowerCase() &&
            role.deactivatedAt === null,
        ) ?? null
      );
    },
    async listRoles(input) {
      const items = [...roles.values()].filter(
        (role) => input.includeInactive || role.deactivatedAt === null,
      );
      return {
        items,
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async updateRole(input) {
      const current = roles.get(input.rootRoleId);
      if (!current) {
        return null;
      }
      const next = {
        ...current,
        displayName: input.displayName ?? current.displayName,
        description: input.description ?? current.description,
        updatedAt: new Date(),
      };
      roles.set(next.rootRoleId, next);
      pushAuditEvent({
        actorRootUserId: input.actorRootUserId,
        rootRoleId: next.rootRoleId,
        eventType: "root_role_updated",
        eventOutcome: "success",
        beforeState: current,
        afterState: next,
      });
      return next;
    },
    async deactivateRole(rootRoleId, actorRootUserId) {
      const current = roles.get(rootRoleId);
      if (!current) {
        return null;
      }
      const next = { ...current, deactivatedAt: new Date(), updatedAt: new Date() };
      roles.set(rootRoleId, next);
      pushAuditEvent({
        actorRootUserId,
        rootRoleId,
        eventType: "root_role_deactivated",
        eventOutcome: "success",
        beforeState: current,
        afterState: next,
      });
      return next;
    },
    async reactivateRole(rootRoleId, actorRootUserId) {
      const current = roles.get(rootRoleId);
      if (!current) {
        return null;
      }
      const next = { ...current, deactivatedAt: null, updatedAt: new Date() };
      roles.set(rootRoleId, next);
      pushAuditEvent({
        actorRootUserId,
        rootRoleId,
        eventType: "root_role_reactivated",
        eventOutcome: "success",
        beforeState: current,
        afterState: next,
      });
      return next;
    },
    async listEligibleCapabilities(input) {
      void input.rootRoleId;
      const items = ROOT_AUTHZ_CAPABILITY_CATALOG.map((entry) => ({
        capabilityKey: entry.capabilityKey,
        description: entry.description,
        mandatory: entry.mandatoryForRootUserAdmin,
        protected: entry.protectedForRootUserAdmin,
      }));
      return {
        items: items.slice((input.page - 1) * input.pageSize, input.page * input.pageSize),
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async listRoleCapabilityAssignments(input) {
      const items = roleGrants.get(input.rootRoleId) ?? [];
      return {
        items: items.slice((input.page - 1) * input.pageSize, input.page * input.pageSize),
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async replaceRoleCapabilityGrants(input) {
      const beforeKeys = (roleGrants.get(input.rootRoleId) ?? [])
        .map((item) => item.capabilityKey)
        .sort();
      const role = roles.get(input.rootRoleId);
      const items = input.capabilityKeys.map((capabilityKey) => {
        const entry = ROOT_AUTHZ_CAPABILITY_CATALOG.find((item) => item.capabilityKey === capabilityKey)!;
        return {
          capabilityKey: entry.capabilityKey,
          description: entry.description,
          mandatory:
            role?.roleKey === ROOT_USER_ADMIN_ROLE_KEY ? entry.mandatoryForRootUserAdmin : false,
          protected:
            role?.roleKey === ROOT_USER_ADMIN_ROLE_KEY ? entry.protectedForRootUserAdmin : false,
        };
      });
      roleGrants.set(input.rootRoleId, items);
      pushAuditEvent({
        actorRootUserId: input.actorRootUserId,
        rootRoleId: input.rootRoleId,
        eventType: "root_role_capability_grants_replaced",
        eventOutcome: "success",
        reason: input.reason,
        beforeState: beforeKeys,
        afterState: items.map((item) => item.capabilityKey).sort(),
      });
      return {
        items,
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async createRoleAssignment(input) {
      const role = roles.get(input.rootRoleId)!;
      const assignment: RootRoleAssignmentData = {
        rootRoleAssignmentId: input.assignmentId,
        rootUserId: input.rootUserId,
        rootRoleId: input.rootRoleId,
        roleKey: role.roleKey,
        displayName: role.displayName,
        protected: role.protected,
        assignedAt: new Date(),
        unassignedAt: null,
      };
      assignments.set(assignment.rootRoleAssignmentId, assignment);
      pushAuditEvent({
        actorRootUserId: input.actorRootUserId,
        targetRootUserId: input.rootUserId,
        rootRoleId: input.rootRoleId,
        assignmentId: assignment.rootRoleAssignmentId,
        eventType: "root_role_assignment_created",
        eventOutcome: "success",
        reason: input.reason,
        afterState: assignment,
      });
      return assignment;
    },
    async unassignRoleAssignment(input) {
      const current = assignments.get(input.rootRoleAssignmentId);
      if (!current || current.rootUserId !== input.rootUserId || current.unassignedAt) {
        return null;
      }
      const next = { ...current, unassignedAt: new Date() };
      assignments.set(next.rootRoleAssignmentId, next);
      pushAuditEvent({
        actorRootUserId: input.actorRootUserId,
        targetRootUserId: input.rootUserId,
        rootRoleId: next.rootRoleId,
        assignmentId: next.rootRoleAssignmentId,
        eventType: "root_role_assignment_unassigned",
        eventOutcome: "success",
        reason: input.reason,
        beforeState: current,
        afterState: next,
      });
      return next;
    },
    async listRootUserAssignments(input) {
      const items = [...assignments.values()].filter(
        (assignment) => assignment.rootUserId === input.rootUserId && assignment.unassignedAt === null,
      );
      return {
        items: items.slice((input.page - 1) * input.pageSize, input.page * input.pageSize),
        totalSearchableRecords: items.length,
        totalMatchingRecords: items.length,
      };
    },
    async replaceRoleAssignment(input) {
      const source = [...assignments.values()].find(
        (assignment) =>
          assignment.rootUserId === input.rootUserId &&
          assignment.unassignedAt === null &&
          (assignment.rootRoleAssignmentId === input.sourceRootRoleAssignmentId ||
            assignment.rootRoleId === input.sourceRootRoleId),
      );
      if (!source) {
        throw new Error("Missing source role assignment");
      }
      assignments.set(source.rootRoleAssignmentId, { ...source, unassignedAt: new Date() });
      const role = roles.get(input.targetRootRoleId)!;
      const nextAssignment: RootRoleAssignmentData = {
        rootRoleAssignmentId: `replace_${input.rootUserId}_${input.targetRootRoleId}`,
        rootUserId: input.rootUserId,
        rootRoleId: input.targetRootRoleId,
        roleKey: role.roleKey,
        displayName: role.displayName,
        protected: role.protected,
        assignedAt: new Date(),
        unassignedAt: null,
      };
      assignments.set(nextAssignment.rootRoleAssignmentId, nextAssignment);
      pushAuditEvent({
        actorRootUserId: input.actorRootUserId,
        targetRootUserId: input.rootUserId,
        rootRoleId: input.targetRootRoleId,
        assignmentId: nextAssignment.rootRoleAssignmentId,
        eventType: "root_role_assignment_replaced",
        eventOutcome: "success",
        reason: input.reason,
        beforeState: source,
        afterState: nextAssignment,
      });
      return getEffectivePermissionsForRootUser(input.rootUserId);
    },
    async getEffectivePermissions(rootUserId) {
      return getEffectivePermissionsForRootUser(rootUserId);
    },
    async countActiveAssignmentsForRoleKey(roleKey) {
      return [...assignments.values()].filter(
        (assignment) => assignment.roleKey === roleKey && assignment.unassignedAt === null,
      ).length;
    },
    async countActiveAssignmentsForRootUser(rootUserId) {
      return [...assignments.values()].filter(
        (assignment) => assignment.rootUserId === rootUserId && assignment.unassignedAt === null,
      ).length;
    },
    async findActiveAssignmentByRole(rootUserId, rootRoleId) {
      return (
        [...assignments.values()].find(
          (assignment) =>
            assignment.rootUserId === rootUserId &&
            assignment.rootRoleId === rootRoleId &&
            assignment.unassignedAt === null,
        ) ?? null
      );
    },
    async findActiveAssignmentById(rootUserId, rootRoleAssignmentId) {
      return (
        [...assignments.values()].find(
          (assignment) =>
            assignment.rootUserId === rootUserId &&
            assignment.rootRoleAssignmentId === rootRoleAssignmentId &&
            assignment.unassignedAt === null,
        ) ?? null
      );
    },
  };

  function setRootUserCapabilities(rootUserId: string, capabilityKeys: string[]) {
    syncBootstrapAssignment(rootUserId);
    const rootUserAdminAssignment = [...assignments.values()].find(
      (assignment) =>
        assignment.rootUserId === rootUserId &&
        assignment.roleKey === ROOT_USER_ADMIN_ROLE_KEY &&
        assignment.unassignedAt === null,
    );
    if (!rootUserAdminAssignment) {
      return;
    }
    const items = capabilityKeys.map((capabilityKey) => {
      const entry = ROOT_AUTHZ_CAPABILITY_CATALOG.find((item) => item.capabilityKey === capabilityKey);
      return {
        capabilityKey,
        description: entry?.description ?? capabilityKey,
        mandatory: entry?.mandatoryForRootUserAdmin ?? false,
        protected: entry?.protectedForRootUserAdmin ?? false,
      };
    });
    roleGrants.set(rootUserAdminAssignment.rootRoleId, items);
  }

  function getRootUserCapabilities(rootUserId: string): string[] {
    return getEffectivePermissionsForRootUser(rootUserId).permissions.map(
      (permission) => permission.capabilityKey,
    );
  }

  return {
    repository,
    syncBootstrapAssignment,
    setRootUserCapabilities,
    getRootUserCapabilities,
    getAuditEvents() {
      return [...auditEvents];
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
  const rootRolesHarness = createInMemoryRootRolesRepository(rootUsers);
  const capabilityChecker = {
    hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return rootRolesHarness.repository.hasCapability(input.rootUserId, input.capabilityKey);
    },
  };
  const rootRolesService = createRootRolesService(rootRolesHarness.repository, {
    findAuthStateById: async (rootUserId: string) => {
      const record = rootUsers.get(rootUserId);
      return record
        ? ({
            rootUserId: record.rootUserId,
            status: record.status,
            anonymized: record.anonymized,
            deletedAt: record.deletedAt,
          } satisfies RootUserEligibilityState)
        : null;
    },
  });
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
      capabilityChecker,
    ),
  );

  const requireRootSession = createRequireRootSession(authRepository, {
    allowBrowserCookie: true,
  });
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
    "/v1/root-roles",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createRootRolesRouter(rootRolesService, capabilityChecker, platformSecurityRepository),
  );
  app.use(
    "/v1/root-users",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createRootUserRoleAssignmentsRouter(
      rootRolesService,
      capabilityChecker,
      platformSecurityRepository,
    ),
    createRootUsersRouter(
      createRootUsersService(rootUsersRepository, options.assetsService),
      capabilityChecker,
      platformSecurityRepository,
    ),
  );

  return {
    app,
    authRepository,
    rootUsersRepository,
    platformSecurityRepository,
    seedRootUser(overrides = {}) {
      const record = createRootUserRecord(overrides);
      rootUsers.set(record.rootUserId, record);
      rootRolesHarness.syncBootstrapAssignment(record.rootUserId);
      return record;
    },
    deleteSeededRootUser(rootUserId: string) {
      rootUsers.delete(rootUserId);
    },
    setRootUserCapabilities(rootUserId: string, capabilityKeys: string[]) {
      rootRolesHarness.setRootUserCapabilities(rootUserId, capabilityKeys);
    },
    getRootUserCapabilities(rootUserId: string) {
      return rootRolesHarness.getRootUserCapabilities(rootUserId);
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
      rootRolesHarness.syncBootstrapAssignment(rootUser.rootUserId);

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
    getRootRoleAuditEvents() {
      return rootRolesHarness.getAuditEvents();
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
