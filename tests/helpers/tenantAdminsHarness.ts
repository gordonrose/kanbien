import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createNotificationDeliveryService } from "../../src/features/notificationDelivery/domain/service";
import type { NotificationEmailWriter } from "../../src/features/notificationDelivery";
import type { VisibleTenantsReader } from "../../src/features/tenants";
import { createTenantAdminsService } from "../../src/features/tenantAdmins/domain/service";
import type {
  TenantAdminData,
  TenantAdminListInput,
  TenantAdminVerificationTokenData,
} from "../../src/features/tenantAdmins/domain/types";
import type { TenantAdminsRepository } from "../../src/features/tenantAdmins/persistence/repository";
import {
  createTenantAdminsRouter,
  createTenantAdminVerificationRouter,
} from "../../src/features/tenantAdmins/transport/router";
import type {
  CreateTenantAdminRecordInput,
  CreateTenantAdminVerificationTokenRecordInput,
  UpdateTenantAdminRecordInput,
} from "../../src/features/tenantAdmins/persistence/types";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";
import {
  createInMemoryNotificationDeliveryRepository,
  FakeNotificationEmailProvider,
} from "./notificationDeliveryHarness";
import { createTenantRecord, loginViaPasswordAndSsh } from "./tenantsHarness";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function matchesPrefix(value: string | null, prefix: string | undefined): boolean {
  if (!prefix) {
    return true;
  }
  return (value ?? "").toLowerCase().startsWith(prefix.toLowerCase());
}

function matchesRange(value: Date, from?: string, to?: string): boolean {
  if (from && value.getTime() < new Date(from).getTime()) {
    return false;
  }
  if (to && value.getTime() > new Date(to).getTime()) {
    return false;
  }
  return true;
}

function compareTenantAdmins(
  left: TenantAdminData,
  right: TenantAdminData,
  orderBy: TenantAdminListInput["orderBy"],
  orderDirection: TenantAdminListInput["orderDirection"],
): number {
  const factor = orderDirection === "asc" ? 1 : -1;
  const getValue = (record: TenantAdminData) => {
    switch (orderBy) {
      case "createdAt":
        return record.createdAt.getTime();
      case "email":
        return record.email;
      case "firstName":
        return record.firstName ?? "";
      case "lastName":
        return record.lastName ?? "";
      case "updatedAt":
      default:
        return record.updatedAt.getTime();
    }
  };
  const leftValue = getValue(left);
  const rightValue = getValue(right);
  if (leftValue < rightValue) {
    return -1 * factor;
  }
  if (leftValue > rightValue) {
    return 1 * factor;
  }
  return left.tenantAdminId.localeCompare(right.tenantAdminId) * factor;
}

export function createTenantAdminRecord(
  overrides: Partial<TenantAdminData> = {},
): TenantAdminData {
  const now = new Date("2026-04-08T00:00:00.000Z");
  return {
    tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    email: "admin@example.com",
    normalizedEmail: "admin@example.com",
    firstName: "Alex",
    lastName: "Admin",
    emailVerificationStatus: "pending",
    emailVerifiedAt: null,
    lastVerificationEmailRequestedAt: null,
    createdByRootAdminUserId: "11111111-1111-1111-1111-111111111111",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}

export function createInMemoryTenantAdminsRepository(
  seed: TenantAdminData[] = [],
): TenantAdminsRepository & {
  records: Map<string, TenantAdminData>;
  verificationTokens: Map<string, TenantAdminVerificationTokenData>;
} {
  const records = new Map(seed.map((record) => [record.tenantAdminId, { ...record }]));
  const verificationTokens = new Map<string, TenantAdminVerificationTokenData>();

  return {
    records,
    verificationTokens,
    async create(input: CreateTenantAdminRecordInput) {
      const now = new Date("2026-04-08T01:00:00.000Z");
      const record: TenantAdminData = {
        tenantAdminId: input.tenantAdminId,
        tenantId: input.tenantId,
        email: normalizeEmail(input.email),
        normalizedEmail: normalizeEmail(input.email),
        firstName: input.firstName,
        lastName: input.lastName,
        emailVerificationStatus: "pending",
        emailVerifiedAt: null,
        lastVerificationEmailRequestedAt: null,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
      records.set(record.tenantAdminId, record);
      return { ...record };
    },
    async findVisibleById(tenantId, tenantAdminId) {
      const record = records.get(tenantAdminId) ?? null;
      return record && record.tenantId === tenantId && record.deletedAt === null ? { ...record } : null;
    },
    async findDeletedById(tenantId, tenantAdminId) {
      const record = records.get(tenantAdminId) ?? null;
      return record && record.tenantId === tenantId && record.deletedAt !== null ? { ...record } : null;
    },
    async findAnyById(tenantAdminId) {
      const record = records.get(tenantAdminId) ?? null;
      return record ? { ...record } : null;
    },
    async findActiveByNormalizedEmail(tenantId, normalizedEmail) {
      const record =
        [...records.values()].find(
          (item) =>
            item.tenantId === tenantId &&
            item.deletedAt === null &&
            item.normalizedEmail === normalizeEmail(normalizedEmail),
        ) ?? null;
      return record ? { ...record } : null;
    },
    async listVisible(input) {
      const visible = [...records.values()].filter(
        (item) => item.tenantId === input.tenantId && item.deletedAt === null,
      );
      const filtered = visible.filter((item) => {
        if (!matchesPrefix(item.email, input.filters.emailPrefix)) {
          return false;
        }
        if (!matchesPrefix(item.firstName, input.filters.firstNamePrefix)) {
          return false;
        }
        if (!matchesPrefix(item.lastName, input.filters.lastNamePrefix)) {
          return false;
        }
        if (
          input.filters.emailVerificationStatus &&
          item.emailVerificationStatus !== input.filters.emailVerificationStatus
        ) {
          return false;
        }
        if (!matchesRange(item.createdAt, input.filters.createdAtFrom, input.filters.createdAtTo)) {
          return false;
        }
        if (!matchesRange(item.updatedAt, input.filters.updatedAtFrom, input.filters.updatedAtTo)) {
          return false;
        }
        return true;
      });
      const sorted = [...filtered].sort((left, right) =>
        compareTenantAdmins(left, right, input.orderBy, input.orderDirection),
      );
      const start = (input.page - 1) * input.pageSize;
      return {
        items: sorted.slice(start, start + input.pageSize).map((item) => ({ ...item })),
        totalSearchableRecords: visible.length,
        totalMatchingRecords: filtered.length,
      };
    },
    async update(input: UpdateTenantAdminRecordInput) {
      const current = records.get(input.tenantAdminId)!;
      const next: TenantAdminData = {
        ...current,
        email: input.email !== undefined ? normalizeEmail(input.email) : current.email,
        normalizedEmail:
          input.email !== undefined ? normalizeEmail(input.email) : current.normalizedEmail,
        firstName: input.firstName !== undefined ? input.firstName : current.firstName,
        lastName: input.lastName !== undefined ? input.lastName : current.lastName,
        emailVerificationStatus: input.resetVerification ? "pending" : current.emailVerificationStatus,
        emailVerifiedAt: input.resetVerification ? null : current.emailVerifiedAt,
        lastVerificationEmailRequestedAt: input.resetVerification
          ? null
          : current.lastVerificationEmailRequestedAt,
        updatedAt: new Date("2026-04-08T02:00:00.000Z"),
      };
      records.set(next.tenantAdminId, next);
      return { ...next };
    },
    async softDelete(tenantId, tenantAdminId) {
      const current = records.get(tenantAdminId)!;
      const next: TenantAdminData = {
        ...current,
        tenantId,
        emailVerificationStatus: "pending",
        emailVerifiedAt: null,
        deletedAt: new Date("2026-04-08T03:00:00.000Z"),
        updatedAt: new Date("2026-04-08T03:00:00.000Z"),
      };
      records.set(tenantAdminId, next);
      return { ...next };
    },
    async reactivate(tenantId, tenantAdminId) {
      const current = records.get(tenantAdminId)!;
      const next: TenantAdminData = {
        ...current,
        tenantId,
        emailVerificationStatus: "pending",
        emailVerifiedAt: null,
        lastVerificationEmailRequestedAt: null,
        deletedAt: null,
        updatedAt: new Date("2026-04-08T04:00:00.000Z"),
      };
      records.set(tenantAdminId, next);
      return { ...next };
    },
    async createVerificationToken(input: CreateTenantAdminVerificationTokenRecordInput) {
      const record: TenantAdminVerificationTokenData = {
        tenantAdminVerificationTokenId: input.tenantAdminVerificationTokenId,
        tenantAdminId: input.tenantAdminId,
        tokenId: input.tokenId,
        purpose: "email_verification",
        secretHash: input.secretHash,
        expiresAt: input.expiresAt,
        usedAt: null,
        invalidatedAt: null,
        outboundEmailId: null,
        requestedByActorType: input.requestedByActorType,
        requestedByActorId: input.requestedByActorId,
        createdAt: new Date("2026-04-08T05:00:00.000Z"),
      };
      verificationTokens.set(record.tokenId, record);
      return { ...record };
    },
    async findVerificationTokenByTokenId(tokenId) {
      const record = verificationTokens.get(tokenId) ?? null;
      return record ? { ...record } : null;
    },
    async findLatestActiveVerificationTokenByTenantAdminId(tenantAdminId) {
      const record =
        [...verificationTokens.values()]
          .filter(
            (item) =>
              item.tenantAdminId === tenantAdminId &&
              item.invalidatedAt === null &&
              item.usedAt === null,
          )
          .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0] ?? null;
      return record ? { ...record } : null;
    },
    async invalidateActiveVerificationTokens(tenantAdminId) {
      for (const [tokenId, token] of verificationTokens.entries()) {
        if (token.tenantAdminId === tenantAdminId && token.invalidatedAt === null && token.usedAt === null) {
          verificationTokens.set(tokenId, {
            ...token,
            invalidatedAt: new Date("2026-04-08T06:00:00.000Z"),
          });
        }
      }
    },
    async attachOutboundEmailToVerificationToken(tokenId, outboundEmailId) {
      const token = verificationTokens.get(tokenId)!;
      verificationTokens.set(tokenId, { ...token, outboundEmailId });
    },
    async markVerificationEmailRequested(tenantAdminId, requestedAt) {
      const current = records.get(tenantAdminId)!;
      const next = {
        ...current,
        lastVerificationEmailRequestedAt: new Date(requestedAt),
        updatedAt: new Date("2026-04-08T07:00:00.000Z"),
      };
      records.set(tenantAdminId, next);
      return { ...next };
    },
    async markVerificationTokenUsed(tokenId) {
      const token = verificationTokens.get(tokenId)!;
      verificationTokens.set(tokenId, {
        ...token,
        usedAt: new Date("2026-04-08T08:00:00.000Z"),
      });
    },
    async markVerified(tenantAdminId) {
      const current = records.get(tenantAdminId)!;
      const next = {
        ...current,
        emailVerificationStatus: "verified" as const,
        emailVerifiedAt: new Date("2026-04-08T08:00:00.000Z"),
        updatedAt: new Date("2026-04-08T08:00:00.000Z"),
      };
      records.set(tenantAdminId, next);
      return { ...next };
    },
  };
}

export function createVisibleTenantsReader(
  tenantIds: string[] = ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"],
): VisibleTenantsReader {
  const visible = new Set(tenantIds);
  return {
    async findVisibleTenantById(tenantId) {
      if (!visible.has(tenantId)) {
        return null;
      }
      const tenant = createTenantRecord({ tenantId });
      return {
        tenantId: tenant.tenantId,
        bizId: tenant.bizId,
        name: tenant.name,
        category: tenant.category,
        status: tenant.status,
      };
    },
  };
}

export function mountTenantAdminsFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  options?: {
    repository?: TenantAdminsRepository;
    notificationEmailWriter?: NotificationEmailWriter;
    visibleTenantsReader?: VisibleTenantsReader;
  },
) {
  const repository = options?.repository ?? createInMemoryTenantAdminsRepository();
  const notificationRepository = createInMemoryNotificationDeliveryRepository();
  const provider = new FakeNotificationEmailProvider();
  const notificationEmailWriter =
    options?.notificationEmailWriter ??
    createNotificationDeliveryService(notificationRepository, provider);
  const visibleTenantsReader = options?.visibleTenantsReader ?? createVisibleTenantsReader();
  const service = createTenantAdminsService(
    repository,
    visibleTenantsReader,
    notificationEmailWriter,
    harness.platformSecurityRepository,
  );
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
      request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };

  app.use(
    "/v1/tenant-admin-verification",
    createTenantAdminVerificationRouter(service, harness.platformSecurityRepository),
  );
  app.use(
    "/v1/tenants/:tenantId/admins",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createTenantAdminsRouter(service, capabilityChecker, harness.platformSecurityRepository),
  );

  return {
    repository,
    notificationRepository,
    provider,
  };
}

export { loginViaPasswordAndSsh };
