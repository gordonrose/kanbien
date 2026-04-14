import { randomUUID } from "node:crypto";
import type { Express } from "express";
import { createOneTimeTokenMaterial } from "../../src/lib/tokens";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createTenantAuthService } from "../../src/features/tenantAuth/domain/service";
import type { TenantAuthPolicyResolver } from "../../src/features/tenantConfiguration";
import { createTenantAdminsService } from "../../src/features/tenantAdmins/domain/service";
import type {
  TenantAccessGrantData,
  TenantAuthPrincipalData,
  TenantPasswordSetupTokenData,
  TenantSessionData,
} from "../../src/features/tenantAuth/domain/types";
import type { TenantAuthRepository } from "../../src/features/tenantAuth/persistence/repository";
import type {
  CreateTenantAccessGrantInput,
  CreateTenantAuthPrincipalInput,
  CreateTenantPasswordSetupTokenInput,
  CreateTenantSessionInput,
} from "../../src/features/tenantAuth/persistence/types";
import { createTenantAuthRouter } from "../../src/features/tenantAuth/transport/router";
import {
  createTenantAdminsAuthBootstrapReader,
} from "../../src/features/tenantAdmins";
import type {
  TenantAdminData,
  TenantAdminVerificationTokenData,
} from "../../src/features/tenantAdmins/domain/types";
import {
  createInMemoryTenantAdminsRepository,
  createNoopTenantAuthOnboardingProvisioner,
  createTenantAdminRecord,
  createVisibleTenantsReader,
} from "./tenantAdminsHarness";
import type { VisibleTenantsReader } from "../../src/features/tenants";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";
import { createTenantAdminVerificationRouter } from "../../src/features/tenantAdmins/transport/router";
import { createNotificationDeliveryService } from "../../src/features/notificationDelivery/domain/service";
import {
  createInMemoryNotificationDeliveryRepository,
  FakeNotificationEmailProvider,
} from "./notificationDeliveryHarness";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function createTenantAuthPrincipalRecord(
  overrides: Partial<TenantAuthPrincipalData> = {},
): TenantAuthPrincipalData {
  const now = new Date("2026-04-09T00:00:00.000Z");
  return {
    authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    loginEmail: "tenant-admin@example.com",
    normalizedLoginEmail: "tenant-admin@example.com",
    passwordState: "setup_required",
    createdAt: now,
    updatedAt: now,
    disabledAt: null,
    ...overrides,
  };
}

export function createTenantAccessGrantRecord(
  overrides: Partial<TenantAccessGrantData> = {},
): TenantAccessGrantData {
  const now = new Date("2026-04-09T00:05:00.000Z");
  return {
    tenantAccessGrantId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    subjectType: "tenant_admin",
    subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    createdAt: now,
    updatedAt: now,
    revokedAt: null,
    ...overrides,
  };
}

export function createTenantSessionRecord(
  overrides: Partial<TenantSessionData> = {},
): TenantSessionData {
  const now = new Date("2099-04-09T00:10:00.000Z");
  return {
    sessionId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
    authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    activeTenantId: null,
    selectionRequired: true,
    remediationRequired: false,
    remediationReason: null,
    authenticatedAt: now,
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
    revokedAt: null,
    createdAt: now,
    ...overrides,
  };
}

export function createInMemoryTenantAuthRepository(
  seed?: {
    principals?: TenantAuthPrincipalData[];
    accessGrants?: TenantAccessGrantData[];
    sessions?: TenantSessionData[];
    passwordSetPrincipals?: string[];
    passwordSetupTokens?: TenantPasswordSetupTokenData[];
  },
): TenantAuthRepository & {
  principals: Map<string, TenantAuthPrincipalData>;
  accessGrants: Map<string, TenantAccessGrantData>;
  sessions: Map<string, TenantSessionData>;
  passwordHashes: Map<string, string>;
  passwordSetupTokens: Map<string, TenantPasswordSetupTokenData>;
} {
  const principals = new Map(
    (seed?.principals ?? []).map((record) => [record.authPrincipalId, { ...record }]),
  );
  const accessGrants = new Map(
    (seed?.accessGrants ?? []).map((record) => [record.tenantAccessGrantId, { ...record }]),
  );
  const sessions = new Map(
    (seed?.sessions ?? []).map((record) => [record.sessionId, { ...record }]),
  );
  const passwordHashes = new Map<string, string>();
  for (const principalId of seed?.passwordSetPrincipals ?? []) {
    passwordHashes.set(principalId, "@Password1!");
  }
  const passwordSetupTokens = new Map(
    (seed?.passwordSetupTokens ?? []).map((record) => [record.tokenId, { ...record }]),
  );

  return {
    principals,
    accessGrants,
    sessions,
    passwordHashes,
    passwordSetupTokens,
    async createPrincipal(input: CreateTenantAuthPrincipalInput) {
      const now = new Date("2026-04-09T01:00:00.000Z");
      const record: TenantAuthPrincipalData = {
        authPrincipalId: input.authPrincipalId,
        loginEmail: input.loginEmail,
        normalizedLoginEmail: input.normalizedLoginEmail,
        passwordState: "setup_required",
        createdAt: now,
        updatedAt: now,
        disabledAt: null,
      };
      principals.set(record.authPrincipalId, record);
      return {
        auth_principal_id: record.authPrincipalId,
        login_email: record.loginEmail,
        normalized_login_email: record.normalizedLoginEmail,
        password_state: record.passwordState,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        disabled_at: record.disabledAt,
      };
    },
    async findPrincipalById(authPrincipalId) {
      const principal = principals.get(authPrincipalId) ?? null;
      return principal
        ? {
            auth_principal_id: principal.authPrincipalId,
            login_email: principal.loginEmail,
            normalized_login_email: principal.normalizedLoginEmail,
            password_state: principal.passwordState,
            created_at: principal.createdAt,
            updated_at: principal.updatedAt,
            disabled_at: principal.disabledAt,
          }
        : null;
    },
    async findPrincipalByNormalizedEmail(email) {
      const principal =
        [...principals.values()].find((item) => item.normalizedLoginEmail === normalizeEmail(email)) ??
        null;
      return principal
        ? {
            auth_principal_id: principal.authPrincipalId,
            login_email: principal.loginEmail,
            normalized_login_email: principal.normalizedLoginEmail,
            password_state: principal.passwordState,
            created_at: principal.createdAt,
            updated_at: principal.updatedAt,
            disabled_at: principal.disabledAt,
          }
        : null;
    },
    async createAccessGrant(input: CreateTenantAccessGrantInput) {
      const now = new Date("2026-04-09T01:05:00.000Z");
      const record: TenantAccessGrantData = {
        tenantAccessGrantId: input.tenantAccessGrantId,
        authPrincipalId: input.authPrincipalId,
        tenantId: input.tenantId,
        subjectType: input.subjectType,
        subjectId: input.subjectId,
        createdAt: now,
        updatedAt: now,
        revokedAt: null,
      };
      accessGrants.set(record.tenantAccessGrantId, record);
      return {
        tenant_access_grant_id: record.tenantAccessGrantId,
        auth_principal_id: record.authPrincipalId,
        tenant_id: record.tenantId,
        subject_type: record.subjectType,
        subject_id: record.subjectId,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        revoked_at: record.revokedAt,
      };
    },
    async findActiveAccessGrant(authPrincipalId, tenantId, subjectType, subjectId) {
      const record =
        [...accessGrants.values()].find(
          (item) =>
            item.authPrincipalId === authPrincipalId &&
            item.tenantId === tenantId &&
            item.subjectType === subjectType &&
            item.subjectId === subjectId &&
            item.revokedAt === null,
        ) ?? null;
      return record
        ? {
            tenant_access_grant_id: record.tenantAccessGrantId,
            auth_principal_id: record.authPrincipalId,
            tenant_id: record.tenantId,
            subject_type: record.subjectType,
            subject_id: record.subjectId,
            created_at: record.createdAt,
            updated_at: record.updatedAt,
            revoked_at: record.revokedAt,
          }
        : null;
    },
    async listActiveAccessGrants(authPrincipalId) {
      return [...accessGrants.values()]
        .filter((item) => item.authPrincipalId === authPrincipalId && item.revokedAt === null)
        .map((record) => ({
          tenant_access_grant_id: record.tenantAccessGrantId,
          auth_principal_id: record.authPrincipalId,
          tenant_id: record.tenantId,
          subject_type: record.subjectType,
          subject_id: record.subjectId,
          created_at: record.createdAt,
          updated_at: record.updatedAt,
          revoked_at: record.revokedAt,
        }));
    },
    async createPasswordSetupToken(input: CreateTenantPasswordSetupTokenInput) {
      const record: TenantPasswordSetupTokenData = {
        tenantPasswordSetupTokenId: input.tenantPasswordSetupTokenId,
        authPrincipalId: input.authPrincipalId,
        sourceTenantAdminId: input.sourceTenantAdminId,
        tokenId: input.tokenId,
        purpose: "password_setup",
        secretHash: input.secretHash,
        expiresAt: input.expiresAt,
        usedAt: null,
        invalidatedAt: null,
        createdAt: new Date("2026-04-09T01:10:00.000Z"),
      };
      passwordSetupTokens.set(record.tokenId, record);
      return {
        tenant_password_setup_token_id: record.tenantPasswordSetupTokenId,
        auth_principal_id: record.authPrincipalId,
        source_tenant_admin_id: record.sourceTenantAdminId,
        token_id: record.tokenId,
        purpose: record.purpose,
        secret_hash: record.secretHash,
        expires_at: record.expiresAt,
        used_at: record.usedAt,
        invalidated_at: record.invalidatedAt,
        created_at: record.createdAt,
      };
    },
    async findPasswordSetupTokenByTokenId(tokenId) {
      const record = passwordSetupTokens.get(tokenId) ?? null;
      return record
        ? {
            tenant_password_setup_token_id: record.tenantPasswordSetupTokenId,
            auth_principal_id: record.authPrincipalId,
            source_tenant_admin_id: record.sourceTenantAdminId,
            token_id: record.tokenId,
            purpose: record.purpose,
            secret_hash: record.secretHash,
            expires_at: record.expiresAt,
            used_at: record.usedAt,
            invalidated_at: record.invalidatedAt,
            created_at: record.createdAt,
          }
        : null;
    },
    async invalidateActivePasswordSetupTokens(authPrincipalId) {
      for (const [tokenId, token] of passwordSetupTokens.entries()) {
        if (token.authPrincipalId === authPrincipalId && token.invalidatedAt === null && token.usedAt === null) {
          passwordSetupTokens.set(tokenId, {
            ...token,
            invalidatedAt: new Date("2026-04-09T01:15:00.000Z"),
          });
        }
      }
    },
    async markPasswordSetupTokenUsed(tokenId) {
      const token = passwordSetupTokens.get(tokenId)!;
      passwordSetupTokens.set(tokenId, {
        ...token,
        usedAt: new Date("2026-04-09T01:20:00.000Z"),
      });
    },
    async completePasswordSetup(input) {
      const principal = principals.get(input.authPrincipalId) ?? null;
      if (!principal) {
        return "principal_not_found";
      }
      if (principal.passwordState === "active") {
        return "password_already_set";
      }
      const token = passwordSetupTokens.get(input.tokenId) ?? null;
      if (
        !token ||
        token.authPrincipalId !== input.authPrincipalId ||
        token.usedAt !== null ||
        token.invalidatedAt !== null
      ) {
        return "token_not_active";
      }

      passwordSetupTokens.set(input.tokenId, {
        ...token,
        usedAt: new Date("2026-04-09T01:20:00.000Z"),
      });
      passwordHashes.set(input.authPrincipalId, input.newPassword);
      principals.set(input.authPrincipalId, {
        ...principal,
        passwordState: "active",
        updatedAt: new Date(input.passwordSetAt),
      });
      return "updated";
    },
    async setPassword(authPrincipalId, newPassword, passwordSetAt) {
      passwordHashes.set(authPrincipalId, newPassword);
      const principal = principals.get(authPrincipalId)!;
      principals.set(authPrincipalId, {
        ...principal,
        passwordState: "active",
        updatedAt: new Date(passwordSetAt),
      });
    },
    async verifyPassword(authPrincipalId, password) {
      return passwordHashes.get(authPrincipalId) === password;
    },
    async createSession(input: CreateTenantSessionInput) {
      const record: TenantSessionData = {
        sessionId: input.sessionId,
        authPrincipalId: input.authPrincipalId,
        activeTenantId: input.activeTenantId,
        selectionRequired: input.selectionRequired,
        remediationRequired: input.remediationRequired,
        remediationReason: input.remediationReason,
        authenticatedAt: input.authenticatedAt,
        expiresAt: input.expiresAt,
        revokedAt: null,
        createdAt: input.authenticatedAt,
      };
      sessions.set(record.sessionId, record);
      return {
        session_id: record.sessionId,
        auth_principal_id: record.authPrincipalId,
        active_tenant_id: record.activeTenantId,
        selection_required: record.selectionRequired,
        remediation_required: record.remediationRequired,
        remediation_reason: record.remediationReason,
        authenticated_at: record.authenticatedAt,
        expires_at: record.expiresAt,
        revoked_at: record.revokedAt,
        created_at: record.createdAt,
      };
    },
    async findActiveSessionById(sessionId) {
      const record = sessions.get(sessionId) ?? null;
      return record && record.revokedAt === null && record.expiresAt.getTime() > Date.now()
        ? {
            session_id: record.sessionId,
            auth_principal_id: record.authPrincipalId,
            active_tenant_id: record.activeTenantId,
            selection_required: record.selectionRequired,
            remediation_required: record.remediationRequired,
            remediation_reason: record.remediationReason,
            authenticated_at: record.authenticatedAt,
            expires_at: record.expiresAt,
            revoked_at: record.revokedAt,
            created_at: record.createdAt,
          }
        : null;
    },
    async updateSessionContext(sessionId, authPrincipalId, activeTenantId, selectionRequired) {
      const current = sessions.get(sessionId) ?? null;
      if (!current || current.authPrincipalId !== authPrincipalId || current.revokedAt !== null) {
        return null;
      }
      const next = {
        ...current,
        activeTenantId,
        selectionRequired,
      };
      sessions.set(sessionId, next);
      return {
        session_id: next.sessionId,
        auth_principal_id: next.authPrincipalId,
        active_tenant_id: next.activeTenantId,
        selection_required: next.selectionRequired,
        remediation_required: next.remediationRequired,
        remediation_reason: next.remediationReason,
        authenticated_at: next.authenticatedAt,
        expires_at: next.expiresAt,
        revoked_at: next.revokedAt,
        created_at: next.createdAt,
      };
    },
    async updateSessionRemediation(sessionId, authPrincipalId, remediationRequired, remediationReason) {
      const current = sessions.get(sessionId) ?? null;
      if (!current || current.authPrincipalId !== authPrincipalId || current.revokedAt !== null) {
        return null;
      }
      const next = {
        ...current,
        remediationRequired,
        remediationReason,
      };
      sessions.set(sessionId, next);
      return {
        session_id: next.sessionId,
        auth_principal_id: next.authPrincipalId,
        active_tenant_id: next.activeTenantId,
        selection_required: next.selectionRequired,
        remediation_required: next.remediationRequired,
        remediation_reason: next.remediationReason,
        authenticated_at: next.authenticatedAt,
        expires_at: next.expiresAt,
        revoked_at: next.revokedAt,
        created_at: next.createdAt,
      };
    },
    async revokeSession(sessionId, authPrincipalId) {
      const current = sessions.get(sessionId) ?? null;
      if (!current || current.authPrincipalId !== authPrincipalId) {
        return false;
      }
      sessions.set(sessionId, {
        ...current,
        revokedAt: current.revokedAt ?? new Date("2026-04-09T01:25:00.000Z"),
      });
      return true;
    },
  };
}

export async function issueTenantAdminVerificationToken(
  repository: ReturnType<typeof createInMemoryTenantAdminsRepository>,
  input: {
    tenantAdminId: string;
    requestedByActorId?: string;
  },
) {
  const tokenMaterial = createOneTimeTokenMaterial({
    purpose: "email_verification",
    ttlSeconds: 60 * 60,
  });

  await repository.createVerificationToken({
    tenantAdminVerificationTokenId: randomUUID(),
    tenantAdminId: input.tenantAdminId,
    tokenId: tokenMaterial.tokenId,
    secretHash: tokenMaterial.secretHash,
    expiresAt: tokenMaterial.expiresAt,
    requestedByActorType: "root_user",
    requestedByActorId: input.requestedByActorId ?? "11111111-1111-1111-1111-111111111111",
  });

  return tokenMaterial.rawToken;
}

export function mountTenantAuthFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  options?: {
    tenantAuthRepository?: ReturnType<typeof createInMemoryTenantAuthRepository>;
    tenantAdminsRepository?: ReturnType<typeof createInMemoryTenantAdminsRepository>;
    visibleTenantsReader?: VisibleTenantsReader;
    policyResolver?: TenantAuthPolicyResolver;
  },
) {
  const tenantAuthRepository =
    options?.tenantAuthRepository ?? createInMemoryTenantAuthRepository();
  const tenantAdminsRepository =
    options?.tenantAdminsRepository ?? createInMemoryTenantAdminsRepository();
  const tenantAdminsAuthBootstrapReader =
    createTenantAdminsAuthBootstrapReader(tenantAdminsRepository);
  const visibleTenantsReader =
    options?.visibleTenantsReader ??
    createVisibleTenantsReader([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]);
  const policyResolver = options?.policyResolver;
  const service = createTenantAuthService(
    tenantAuthRepository,
    tenantAdminsAuthBootstrapReader,
    visibleTenantsReader,
    policyResolver,
    harness.platformSecurityRepository,
  );
  const tenantAdminsService = createTenantAdminsService(
    tenantAdminsRepository,
    visibleTenantsReader,
    createNotificationDeliveryService(
      createInMemoryNotificationDeliveryRepository(),
      new FakeNotificationEmailProvider(),
    ),
    harness.platformSecurityRepository,
    service.onboardingProvisioner ?? createNoopTenantAuthOnboardingProvisioner(),
  );

  app.use(
    "/v1/tenant-auth",
    createTenantAuthRouter(
      tenantAuthRepository,
      service,
      harness.platformSecurityRepository,
    ),
  );
  app.use(
    "/v1/tenant-admin-verification",
    createTenantAdminVerificationRouter(
      tenantAdminsService,
      harness.platformSecurityRepository,
    ),
  );

  return {
    tenantAuthRepository,
    tenantAdminsRepository,
    tenantAdminsService,
  };
}

export {
  createTenantAdminRecord,
};
