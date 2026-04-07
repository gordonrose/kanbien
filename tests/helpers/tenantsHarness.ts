import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createTenantsService } from "../../src/features/tenants/domain/service";
import type {
  TenantCategory,
  TenantData,
  TenantListInput,
  TenantStatus,
} from "../../src/features/tenants/domain/types";
import type { TenantsRepository } from "../../src/features/tenants/persistence/repository";
import { createTenantsRouter } from "../../src/features/tenants/transport/router";
import type {
  CreateTenantRecordInput,
  TenantRepositoryListResult,
  UpdateTenantRecordInput,
} from "../../src/features/tenants/persistence/types";
import { invokeJson } from "../harness/http";
import type {
  RootAuthIntegrationHarness,
  SeededAuthIdentity,
} from "../harness/rootAuth/integrationHarness";

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

function normalizeBizId(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function matchesPrefix(value: string, prefix: string | undefined): boolean {
  if (!prefix) {
    return true;
  }
  return value.toLowerCase().startsWith(prefix.toLowerCase());
}

function matchesRange(value: Date | null, from?: string, to?: string): boolean {
  if (from && (!value || value.getTime() < new Date(from).getTime())) {
    return false;
  }
  if (to && (!value || value.getTime() > new Date(to).getTime())) {
    return false;
  }
  return true;
}

function compareTenants(
  a: TenantData,
  b: TenantData,
  orderBy: string,
  direction: "asc" | "desc",
): number {
  const factor = direction === "asc" ? 1 : -1;
  const valueFor = (record: TenantData) => {
    switch (orderBy) {
      case "bizId":
        return record.bizId;
      case "name":
        return record.name;
      case "category":
        return record.category;
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
  return a.tenantId.localeCompare(b.tenantId) * factor;
}

function applyFilters(items: TenantData[], filters: TenantListInput["filters"]): TenantData[] {
  return items.filter((item) => {
    if (!matchesPrefix(item.bizId, filters.bizIdPrefix)) {
      return false;
    }
    if (!matchesPrefix(item.name, filters.namePrefix)) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.status && item.status !== filters.status) {
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
    return true;
  });
}

function paginate(
  items: TenantData[],
  input: TenantListInput,
): Pick<TenantRepositoryListResult, "items" | "totalMatchingRecords"> {
  const matching = applyFilters(items, input.filters);
  const sorted = [...matching].sort((a, b) =>
    compareTenants(a, b, input.orderBy, input.orderDirection),
  );
  const start = (input.page - 1) * input.pageSize;
  return {
    items: sorted.slice(start, start + input.pageSize),
    totalMatchingRecords: matching.length,
  };
}

export function createTenantRecord(overrides: Partial<TenantData> = {}): TenantData {
  const now = new Date("2026-04-07T00:00:00.000Z");
  return {
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    bizId: "tenant-alpha",
    name: "Tenant Alpha",
    category: "customer",
    status: "draft",
    preDeleteStatus: null,
    createdByRootAdminUserId: "11111111-1111-1111-1111-111111111111",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

export function createInMemoryTenantsRepository(
  seed: TenantData[] = [],
): TenantsRepository & { records: Map<string, TenantData> } {
  const records = new Map(seed.map((record) => [record.tenantId, { ...record }]));

  return {
    records,
    async create(input: CreateTenantRecordInput) {
      const now = new Date("2026-04-07T01:00:00.000Z");
      const record: TenantData = {
        tenantId: input.tenantId,
        bizId: normalizeBizId(input.bizId),
        name: input.name.trim(),
        category: input.category,
        status: input.status,
        preDeleteStatus: null,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
      records.set(record.tenantId, record);
      return { ...record };
    },
    async findVisibleById(tenantId) {
      const record = records.get(tenantId) ?? null;
      return record && record.deletedAt === null ? { ...record } : null;
    },
    async findDeletedById(tenantId) {
      const record = records.get(tenantId) ?? null;
      return record && record.deletedAt !== null ? { ...record } : null;
    },
    async findAnyById(tenantId) {
      const record = records.get(tenantId) ?? null;
      return record ? { ...record } : null;
    },
    async findNonDeletedByBizId(bizId) {
      const normalized = normalizeBizId(bizId);
      const record =
        [...records.values()].find(
          (item) => normalizeBizId(item.bizId) === normalized && item.deletedAt === null,
        ) ?? null;
      return record ? { ...record } : null;
    },
    async listVisible(input) {
      const visible = [...records.values()].filter((item) => item.deletedAt === null);
      const { items, totalMatchingRecords } = paginate(visible, input);
      return {
        items: items.map((item) => ({ ...item })),
        totalSearchableRecords: visible.length,
        totalMatchingRecords,
      };
    },
    async listDeleted(input) {
      const deleted = [...records.values()].filter((item) => item.deletedAt !== null);
      const { items, totalMatchingRecords } = paginate(deleted, input);
      return {
        items: items.map((item) => ({ ...item })),
        totalSearchableRecords: deleted.length,
        totalMatchingRecords,
      };
    },
    async update(input: UpdateTenantRecordInput) {
      const current = records.get(input.tenantId)!;
      const next: TenantData = {
        ...current,
        name: input.name !== undefined ? input.name.trim() : current.name,
        category: input.category ?? current.category,
        status: input.status ?? current.status,
        updatedAt: new Date("2026-04-07T02:00:00.000Z"),
      };
      records.set(next.tenantId, next);
      return { ...next };
    },
    async softDelete(tenantId: string) {
      const current = records.get(tenantId)!;
      const next: TenantData = {
        ...current,
        preDeleteStatus: current.status,
        status: "inactive",
        deletedAt: new Date("2026-04-07T03:00:00.000Z"),
        updatedAt: new Date("2026-04-07T03:00:00.000Z"),
      };
      records.set(tenantId, next);
      return { ...next };
    },
    async reactivate(tenantId: string) {
      const current = records.get(tenantId)!;
      const next: TenantData = {
        ...current,
        status: current.preDeleteStatus ?? current.status,
        preDeleteStatus: null,
        deletedAt: null,
        updatedAt: new Date("2026-04-07T04:00:00.000Z"),
      };
      records.set(tenantId, next);
      return { ...next };
    },
    async remove(tenantId: string) {
      const current = records.get(tenantId)!;
      records.delete(tenantId);
      return { ...current };
    },
  };
}

export async function loginViaPasswordAndSsh(
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
  if (passwordResponse.status !== 200) {
    throw new Error(`Expected password-stage login success, received ${passwordResponse.status}`);
  }

  const sshResponse = await invokeJson<SessionResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/ssh",
    body: {
      challengeId: passwordResponse.body.challengeId,
      publicKeyFingerprint: identity.sshKey.fingerprint,
      signature: identity.sshKey.signChallengeText(passwordResponse.body.challengeText),
    },
  });
  if (sshResponse.status !== 200) {
    throw new Error(`Expected ssh-stage login success, received ${sshResponse.status}`);
  }
  return sshResponse.body;
}

export function mountTenantsFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: TenantsRepository,
) {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession
        ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}`
        : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };

  app.use(
    "/v1/tenants",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createTenantsRouter(
      createTenantsService(repository),
      capabilityChecker,
      harness.platformSecurityRepository,
    ),
  );
}
