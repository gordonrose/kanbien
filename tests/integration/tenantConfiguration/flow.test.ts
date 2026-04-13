import { describe, expect, it } from "vitest";
import type { Express } from "express";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { createRequireRootSession } from "../../../src/lib/auth/middleware";
import { createTenantConfigurationService } from "../../../src/features/tenantConfiguration/domain/service";
import {
  createRootTenantConfigurationRouter,
  createTenantConfigurationTenantRouter,
} from "../../../src/features/tenantConfiguration/transport/router";
import type { TenantConfigurationRepository } from "../../../src/features/tenantConfiguration/persistence/repository";
import type { TenantAuthPolicyOverrideData } from "../../../src/features/tenantConfiguration/domain/types";
import { createVisibleTenantsReader } from "../../helpers/tenantAdminsHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";
import {
  createInMemoryTenantAuthRepository,
  createTenantAuthPrincipalRecord,
  createTenantSessionRecord,
} from "../../helpers/tenantAuthHarness";

function createInMemoryTenantConfigurationRepository(
  seed?: TenantAuthPolicyOverrideData[],
): TenantConfigurationRepository {
  const records = new Map((seed ?? []).map((record) => [record.tenantId, { ...record }]));

  return {
    async findTenantAuthPolicyByTenantId(tenantId) {
      return records.get(tenantId) ?? null;
    },
    async upsertTenantAuthPolicy(input) {
      const now = new Date("2026-04-09T12:00:00.000Z");
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

function mountTenantConfigurationFeature(
  app: Express,
  harness: ReturnType<typeof createRootAuthIntegrationHarness>,
  options?: {
    tenantSessionActiveTenantId?: string | null;
    repository?: TenantConfigurationRepository;
  },
) {
  const repository = options?.repository ?? createInMemoryTenantConfigurationRepository();
  const service = createTenantConfigurationService(
    repository,
    createVisibleTenantsReader([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]),
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

  const tenantAuthRepository = createInMemoryTenantAuthRepository({
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
}

describe("tenantConfiguration integration flow", () => {
  it("TC-TENANT-AUTH-POLICY-INT-001 reads and updates tenant auth policy as root", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantConfigurationFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const initial = await invokeJson<{ policySource: string; hasTenantOverride: boolean }>(
      harness.app,
      {
        method: "GET",
        path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/auth-policy",
        headers: { authorization: `Bearer ${session.sessionId}` },
      },
    );
    expect(initial.status).toBe(200);
    expect(initial.body.policySource).toBe("system_default");
    expect(initial.body.hasTenantOverride).toBe(false);

    const updated = await invokeJson<{
      policySource: string;
      hasTenantOverride: boolean;
      passwordPolicy: { minLength: number; minNumbers: number };
    }>(harness.app, {
      method: "PATCH",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/auth-policy",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        minLength: 14,
        minNumbers: 2,
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.policySource).toBe("tenant_override");
    expect(updated.body.hasTenantOverride).toBe(true);
    expect(updated.body.passwordPolicy.minLength).toBe(14);
    expect(updated.body.passwordPolicy.minNumbers).toBe(2);
  });

  it("TC-TENANT-AUTH-POLICY-INT-002 reads effective tenant auth policy for the current tenant-admin session", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantConfigurationFeature(harness.app, harness, {
      repository: createInMemoryTenantConfigurationRepository([
        {
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          minLength: 16,
          maxLength: 64,
          minUppercase: 2,
          maxUppercase: null,
          minLowercase: 1,
          maxLowercase: null,
          minNumbers: 2,
          maxNumbers: null,
          minSymbols: 1,
          maxSymbols: null,
          createdAt: new Date("2026-04-09T10:00:00.000Z"),
          updatedAt: new Date("2026-04-09T10:00:00.000Z"),
        },
      ]),
    });

    const response = await invokeJson<{
      policySource: string;
      passwordPolicy: { minLength: number; minUppercase: number };
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant/auth-policy",
      headers: { authorization: "Bearer ffffffff-ffff-4fff-8fff-ffffffffffff" },
    });

    expect(response.status).toBe(200);
    expect(response.body.policySource).toBe("tenant_override");
    expect(response.body.passwordPolicy.minLength).toBe(16);
    expect(response.body.passwordPolicy.minUppercase).toBe(2);
  });

  it("TC-TENANT-AUTH-POLICY-EDGE-001 rejects invalid policy bounds through the root update route", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantConfigurationFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<{ code: string; details?: { field?: string; reason?: string } }>(
      harness.app,
      {
        method: "PATCH",
        path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/auth-policy",
        headers: { authorization: `Bearer ${session.sessionId}` },
        body: { minLength: 10, maxLength: 5 },
      },
    );

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("TENANT_AUTH_POLICY_INVALID");
    expect(response.body.details).toEqual({
      field: "maxLength",
      reason: "below_minLength",
    });
  });
});
