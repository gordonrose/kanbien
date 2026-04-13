import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createTenantConfigurationService } from "../../src/features/tenantConfiguration/domain/service";
import {
  createRootTenantConfigurationRouter,
  createTenantConfigurationTenantRouter,
} from "../../src/features/tenantConfiguration/transport/router";
import type { TenantConfigurationRepository } from "../../src/features/tenantConfiguration/persistence/repository";
import type { TenantAuthPolicyOverrideData } from "../../src/features/tenantConfiguration/domain/types";
import { createVisibleTenantsReader } from "./tenantAdminsHarness";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";
import type { VisibleTenantsReader } from "../../src/features/tenants";
import type { TenantAuthPolicyResolver } from "../../src/features/tenantConfiguration";
import {
  createInMemoryTenantAuthRepository,
  createTenantAuthPrincipalRecord,
  createTenantSessionRecord,
} from "./tenantAuthHarness";

export function createInMemoryTenantConfigurationRepository(
  seed?: TenantAuthPolicyOverrideData[],
): TenantConfigurationRepository & {
  records: Map<string, TenantAuthPolicyOverrideData>;
} {
  const records = new Map((seed ?? []).map((record) => [record.tenantId, { ...record }]));

  return {
    records,
    async findTenantAuthPolicyByTenantId(tenantId) {
      return records.get(tenantId) ?? null;
    },
    async upsertTenantAuthPolicy(input) {
      const now = new Date("2026-04-10T12:00:00.000Z");
      const current = records.get(input.tenantId);
      const next: TenantAuthPolicyOverrideData = {
        tenantId: input.tenantId,
        minLength: input.minLength,
        maxLength: input.maxLength,
        minUppercase: input.minUppercase,
        maxUppercase: input.maxUppercase,
        minLowercase: input.minLowercase,
        maxLowercase: input.maxLowercase,
        minNumbers: input.minNumbers,
        maxNumbers: input.maxNumbers,
        minSymbols: input.minSymbols,
        maxSymbols: input.maxSymbols,
        createdAt: current?.createdAt ?? now,
        updatedAt: now,
      };
      records.set(input.tenantId, next);
      return next;
    },
  };
}

export function mountTenantConfigurationFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  options?: {
    tenantSessionActiveTenantId?: string | null;
    repository?: ReturnType<typeof createInMemoryTenantConfigurationRepository>;
    visibleTenantsReader?: VisibleTenantsReader;
    tenantAuthRepository?: ReturnType<typeof createInMemoryTenantAuthRepository>;
  },
): {
  repository: ReturnType<typeof createInMemoryTenantConfigurationRepository>;
  policyResolver: TenantAuthPolicyResolver;
  tenantAuthRepository: ReturnType<typeof createInMemoryTenantAuthRepository>;
} {
  const repository =
    options?.repository ?? createInMemoryTenantConfigurationRepository();
  const visibleTenantsReader =
    options?.visibleTenantsReader ??
    createVisibleTenantsReader([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]);
  const service = createTenantConfigurationService(
    repository,
    visibleTenantsReader,
    harness.platformSecurityRepository,
  );

  app.use(
    "/v1/tenants/:tenantId/auth-policy",
    createRequireRootSession(harness.authRepository),
    createRootTenantConfigurationRouter(
      service,
      {
        hasCapability: async ({ rootUserId, capabilityKey }) =>
          harness.getRootUserCapabilities(rootUserId).includes(capabilityKey),
      },
      harness.platformSecurityRepository,
    ),
  );

  const tenantAuthRepository =
    options?.tenantAuthRepository ??
    createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "active",
        }),
      ],
      sessions: [
        createTenantSessionRecord({
          sessionId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          activeTenantId:
            options?.tenantSessionActiveTenantId === undefined
              ? "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
              : options.tenantSessionActiveTenantId,
          selectionRequired: options?.tenantSessionActiveTenantId === null,
        }),
      ],
      passwordSetPrincipals: ["dddddddd-dddd-4ddd-8ddd-dddddddddddd"],
    });

  app.use(
    "/v1/tenant/auth-policy",
    createTenantConfigurationTenantRouter(tenantAuthRepository, service),
  );

  return {
    repository,
    policyResolver: service.policyResolver,
    tenantAuthRepository,
  };
}
