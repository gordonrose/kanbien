import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createOrganizationCoreService } from "../../src/features/organizationCore/domain/service";
import type {
  OrganizationData,
  OrganizationLifecycleStatus,
} from "../../src/features/organizationCore/domain/types";
import type { OrganizationCoreRepository } from "../../src/features/organizationCore/persistence/repository";
import type {
  CreateOrganizationRecordInput,
  OrganizationAuditEventInput,
  OrganizationRepositoryListInput,
  OrganizationRepositoryListResult,
  UpdateOrganizationRecordInput,
} from "../../src/features/organizationCore/persistence/types";
import { createRootOrganizationCoreRouter } from "../../src/features/organizationCore/transport/router";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function now(offset = 0): Date {
  return new Date(Date.UTC(2026, 4, 15, 9, offset, 0));
}

export function createOrganizationRecord(
  overrides: Partial<OrganizationData> = {},
): OrganizationData {
  return {
    organizationId: "11111111-1111-4111-8111-111111111111",
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    parentOrganizationId: null,
    name: "Organization Alpha",
    normalizedName: "organization alpha",
    organizationTypeReferenceValueId: null,
    lifecycleStatus: "active",
    archivedAt: null,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
    ...overrides,
  };
}

function matchesPrefix(value: string, prefix?: string): boolean {
  return !prefix || value.toLowerCase().startsWith(prefix.toLowerCase());
}

function matchesRange(value: Date, from?: string, to?: string): boolean {
  if (from && value.getTime() < new Date(from).getTime()) return false;
  if (to && value.getTime() > new Date(to).getTime()) return false;
  return true;
}

function applyFilters(
  items: OrganizationData[],
  filters: OrganizationRepositoryListInput["filters"],
): OrganizationData[] {
  return items.filter((item) => {
    if (!matchesPrefix(item.name, filters.namePrefix)) return false;
    if (filters.parentOrganizationId !== undefined && item.parentOrganizationId !== filters.parentOrganizationId) return false;
    if (filters.lifecycleStatus && item.lifecycleStatus !== filters.lifecycleStatus) return false;
    if (!matchesRange(item.createdAt, filters.createdAtFrom, filters.createdAtTo)) return false;
    if (!matchesRange(item.updatedAt, filters.updatedAtFrom, filters.updatedAtTo)) return false;
    return true;
  });
}

function compareOrganizations(
  left: OrganizationData,
  right: OrganizationData,
  orderBy: string,
  orderDirection: "asc" | "desc",
): number {
  const factor = orderDirection === "asc" ? 1 : -1;
  const valueFor = (record: OrganizationData) => {
    if (orderBy === "name") return record.name;
    if (orderBy === "createdAt") return record.createdAt.getTime();
    return record.updatedAt.getTime();
  };
  const leftValue = valueFor(left);
  const rightValue = valueFor(right);
  if (leftValue < rightValue) return -1 * factor;
  if (leftValue > rightValue) return 1 * factor;
  return left.organizationId.localeCompare(right.organizationId) * factor;
}

export function createInMemoryOrganizationCoreRepository(
  seed: OrganizationData[] = [],
): OrganizationCoreRepository & {
  records: Map<string, OrganizationData>;
  auditEvents: OrganizationAuditEventInput[];
} {
  const records = new Map(seed.map((record) => [record.organizationId, { ...record }]));
  const auditEvents: OrganizationAuditEventInput[] = [];

  function clone(record: OrganizationData): OrganizationData {
    return { ...record };
  }

  function find(
    tenantId: string,
    organizationId: string,
    lifecycleStatus?: OrganizationLifecycleStatus,
  ): OrganizationData | null {
    const record = records.get(organizationId);
    if (!record || record.tenantId !== tenantId || record.deletedAt) return null;
    if (lifecycleStatus && record.lifecycleStatus !== lifecycleStatus) return null;
    return clone(record);
  }

  return {
    records,
    auditEvents,
    async create(input: CreateOrganizationRecordInput) {
      const record = createOrganizationRecord({
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        parentOrganizationId: input.parentOrganizationId,
        name: input.name.trim(),
        normalizedName: normalizeName(input.name),
        organizationTypeReferenceValueId: input.organizationTypeReferenceValueId,
        createdAt: now(1),
        updatedAt: now(1),
      });
      records.set(record.organizationId, record);
      return clone(record);
    },
    async findActiveById(tenantId, organizationId) {
      return find(tenantId, organizationId, "active");
    },
    async findArchivedById(tenantId, organizationId) {
      return find(tenantId, organizationId, "archived");
    },
    async findNonDeletedById(tenantId, organizationId) {
      return find(tenantId, organizationId);
    },
    async findActiveByName(tenantId, name) {
      const normalized = normalizeName(name);
      const record =
        [...records.values()].find(
          (item) =>
            item.tenantId === tenantId &&
            item.normalizedName === normalized &&
            item.lifecycleStatus === "active" &&
            item.deletedAt === null,
        ) ?? null;
      return record ? clone(record) : null;
    },
    async listActive(input): Promise<OrganizationRepositoryListResult> {
      const active = [...records.values()].filter(
        (item) =>
          item.tenantId === input.tenantId &&
          item.lifecycleStatus === "active" &&
          item.deletedAt === null,
      );
      const matching = applyFilters(active, input.filters);
      const sorted = [...matching].sort((left, right) =>
        compareOrganizations(left, right, input.orderBy, input.orderDirection),
      );
      const start = (input.page - 1) * input.pageSize;
      return {
        items: sorted.slice(start, start + input.pageSize).map(clone),
        totalSearchableRecords: active.length,
        totalMatchingRecords: matching.length,
      };
    },
    async update(input: UpdateOrganizationRecordInput) {
      const current = find(input.tenantId, input.organizationId, "active");
      if (!current) return null;
      const next = {
        ...current,
        name: input.name !== undefined ? input.name.trim() : current.name,
        normalizedName: input.name !== undefined ? normalizeName(input.name) : current.normalizedName,
        organizationTypeReferenceValueId:
          input.organizationTypeReferenceValueId !== undefined
            ? input.organizationTypeReferenceValueId
            : current.organizationTypeReferenceValueId,
        updatedAt: now(2),
      };
      records.set(next.organizationId, next);
      return clone(next);
    },
    async move(tenantId, organizationId, parentOrganizationId) {
      const current = find(tenantId, organizationId, "active");
      if (!current) return null;
      const next = { ...current, parentOrganizationId, updatedAt: now(3) };
      records.set(next.organizationId, next);
      return clone(next);
    },
    async archive(tenantId, organizationIds) {
      let target: OrganizationData | null = null;
      for (const organizationId of organizationIds) {
        const current = find(tenantId, organizationId, "active");
        if (!current) continue;
        const next = {
          ...current,
          lifecycleStatus: "archived" as const,
          archivedAt: now(4),
          updatedAt: now(4),
        };
        records.set(next.organizationId, next);
        if (organizationId === organizationIds[0]) target = next;
      }
      return target ? clone(target) : null;
    },
    async restore(tenantId, organizationId) {
      const current = find(tenantId, organizationId, "archived");
      if (!current) return null;
      const next = { ...current, lifecycleStatus: "active" as const, archivedAt: null, updatedAt: now(5) };
      records.set(next.organizationId, next);
      return clone(next);
    },
    async softDelete(tenantId, organizationId) {
      const current = find(tenantId, organizationId);
      if (!current) return null;
      const next = { ...current, deletedAt: now(6), updatedAt: now(6) };
      records.set(next.organizationId, next);
      return clone(next);
    },
    async listActiveChildren(tenantId, organizationId) {
      return [...records.values()]
        .filter(
          (item) =>
            item.tenantId === tenantId &&
            item.parentOrganizationId === organizationId &&
            item.lifecycleStatus === "active" &&
            item.deletedAt === null,
        )
        .map(clone);
    },
    async listNonDeletedDescendants(tenantId, organizationId) {
      const descendants: OrganizationData[] = [];
      const visit = (parentId: string) => {
        for (const record of records.values()) {
          if (record.tenantId !== tenantId || record.deletedAt || record.parentOrganizationId !== parentId) {
            continue;
          }
          descendants.push(record);
          visit(record.organizationId);
        }
      };
      visit(organizationId);
      return descendants.map(clone);
    },
    async recordAuditEvent(input) {
      auditEvents.push(input);
    },
  };
}

export function mountRootOrganizationCoreFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: OrganizationCoreRepository,
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

  const router = createRootOrganizationCoreRouter(
    createOrganizationCoreService(repository),
    capabilityChecker,
    harness.platformSecurityRepository,
  );

  app.use("/v1/tenants/:tenantId/organizations", requireRootSession, authenticatedGeneralRateLimit, router);
  app.use(
    "/v1/root-admin/tenants/:tenantId/organizations",
    requireRootSession,
    authenticatedGeneralRateLimit,
    router,
  );
}
