import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { invokeJson } from "../../harness/http";
import {
  createInMemoryTenantAuthRepository,
  createTenantAccessGrantRecord,
  createTenantAdminRecord,
  createTenantAuthPrincipalRecord,
  mountTenantAuthFeature,
  issueTenantAdminVerificationToken,
} from "../../helpers/tenantAuthHarness";
import {
  createInMemoryTenantAdminsRepository,
} from "../../helpers/tenantAdminsHarness";
import type { VisibleTenantSummary, VisibleTenantsReader } from "../../../src/features/tenants";

export const TENANT_ALPHA_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const TENANT_BETA_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
export const DEFAULT_PASSWORD = "@Password1!";

export interface ErrorResponse {
  code: string;
  message: string;
  details?: { field?: string; reason?: string };
}

export function createMutableVisibleTenantsReader(
  initialVisibleTenantIds: string[],
): {
  visibleTenantIds: Set<string>;
  reader: VisibleTenantsReader;
} {
  const visibleTenantIds = new Set(initialVisibleTenantIds);
  const tenantSummaries = new Map<string, VisibleTenantSummary>([
    [
      TENANT_ALPHA_ID,
      {
        tenantId: TENANT_ALPHA_ID,
        bizId: "alpha-tenant",
        name: "Alpha Tenant",
        category: "customer",
        status: "live",
      },
    ],
    [
      TENANT_BETA_ID,
      {
        tenantId: TENANT_BETA_ID,
        bizId: "beta-tenant",
        name: "Beta Tenant",
        category: "customer",
        status: "live",
      },
    ],
  ]);

  return {
    visibleTenantIds,
    reader: {
      async findVisibleTenantById(tenantId) {
        if (!visibleTenantIds.has(tenantId)) {
          return null;
        }
        return tenantSummaries.get(tenantId) ?? null;
      },
    },
  };
}

export function seedVerifiedTenantAdmin(
  tenantAdminsRepository: ReturnType<typeof createInMemoryTenantAdminsRepository>,
  input: {
    tenantAdminId: string;
    tenantId: string;
    email: string;
    emailVerificationStatus?: "pending" | "verified";
  },
) {
  tenantAdminsRepository.records.set(
    input.tenantAdminId,
    createTenantAdminRecord({
      tenantAdminId: input.tenantAdminId,
      tenantId: input.tenantId,
      email: input.email,
      normalizedEmail: input.email.trim().toLowerCase(),
      emailVerificationStatus: input.emailVerificationStatus ?? "verified",
    }),
  );
}

export async function bootstrapSetPasswordAndLogin(input: {
  email: string;
  secondaryTenant?: { tenantAdminId: string; tenantId: string };
  visibleTenantsReader?: VisibleTenantsReader;
}) {
  const harness = createRootAuthIntegrationHarness();
  const tenantAdminsRepository = createInMemoryTenantAdminsRepository();
  const mounted = mountTenantAuthFeature(harness.app, harness, {
    tenantAdminsRepository,
    visibleTenantsReader: input.visibleTenantsReader,
  });

  seedVerifiedTenantAdmin(mounted.tenantAdminsRepository, {
    tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    tenantId: TENANT_ALPHA_ID,
    email: input.email,
    emailVerificationStatus: "pending",
  });

  if (input.secondaryTenant) {
    seedVerifiedTenantAdmin(mounted.tenantAdminsRepository, {
      tenantAdminId: input.secondaryTenant.tenantAdminId,
      tenantId: input.secondaryTenant.tenantId,
      email: input.email,
    });
  }

  const verificationToken = await issueTenantAdminVerificationToken(
    mounted.tenantAdminsRepository,
    {
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    },
  );

  const bootstrap = await invokeJson<{
    status: string;
    tenantAuthOnboarding: {
      bootstrapToken: string;
      authPrincipalId: string;
    };
  }>(harness.app, {
    method: "POST",
    path: "/v1/tenant-admin-verification/redeem",
    body: { token: verificationToken },
  });

  const setup = await invokeJson<{ status: string }>(harness.app, {
    method: "POST",
    path: "/v1/tenant-auth/password/setup",
    body: {
      bootstrapToken: bootstrap.body.tenantAuthOnboarding.bootstrapToken,
      newPassword: DEFAULT_PASSWORD,
      repeatPassword: DEFAULT_PASSWORD,
    },
  });

  const login = await invokeJson<{
    status: string;
    sessionId: string;
    selectionRequired: boolean;
    activeTenantContext: { tenantId: string } | null;
    availableTenantContexts: Array<{ tenantId: string; tenantName: string }>;
  }>(harness.app, {
    method: "POST",
    path: "/v1/tenant-auth/login/password",
    body: {
      email: input.email,
      password: DEFAULT_PASSWORD,
    },
  });

  return {
    harness,
    mounted,
    bootstrap,
    setup,
    login,
  };
}

export function createSeededPrincipalHarness(input?: {
  email?: string;
  tenantIds?: string[];
  disabledAt?: Date | null;
  visibleTenantsReader?: VisibleTenantsReader;
}) {
  const email = input?.email ?? "seeded@example.com";
  const tenantIds = input?.tenantIds ?? [TENANT_ALPHA_ID];
  const tenantAdminsRepository = createInMemoryTenantAdminsRepository();

  for (const [index, tenantId] of tenantIds.entries()) {
    seedVerifiedTenantAdmin(tenantAdminsRepository, {
      tenantAdminId: index === 0
        ? "cccccccc-cccc-4ccc-8ccc-cccccccccccc"
        : "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      tenantId,
      email,
    });
  }

  const tenantAuthRepository = createInMemoryTenantAuthRepository({
    principals: [
      createTenantAuthPrincipalRecord({
        loginEmail: email,
        normalizedLoginEmail: email.trim().toLowerCase(),
        passwordState: "active",
        disabledAt: input?.disabledAt ?? null,
      }),
    ],
    accessGrants: tenantIds.map((tenantId, index) =>
      createTenantAccessGrantRecord({
        tenantAccessGrantId:
          index === 0
            ? "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"
            : "ffffffff-ffff-4fff-8fff-ffffffffffff",
        tenantId,
        subjectId:
          index === 0
            ? "cccccccc-cccc-4ccc-8ccc-cccccccccccc"
            : "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      }),
    ),
    passwordSetPrincipals: ["dddddddd-dddd-4ddd-8ddd-dddddddddddd"],
  });

  const harness = createRootAuthIntegrationHarness();
  const mounted = mountTenantAuthFeature(harness.app, harness, {
    tenantAuthRepository,
    tenantAdminsRepository,
    visibleTenantsReader: input?.visibleTenantsReader,
  });

  return {
    harness,
    mounted,
  };
}
