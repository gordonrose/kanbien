import { randomUUID } from "node:crypto";
import { env } from "../../../config/env";
import {
  createOneTimeTokenMaterial,
  parseOneTimeToken,
  verifyOneTimeTokenAgainstRecord,
} from "../../../lib/tokens";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAdminAuthBootstrapSubject, TenantAdminsAuthBootstrapReader } from "../../tenantAdmins";
import type { VisibleTenantsReader } from "../../tenants";
import {
  TenantAdminVerificationTokenExpiredError,
  TenantAdminVerificationTokenInvalidError,
} from "../../tenantAdmins/contract/errors";
import { assertPasswordPolicy } from "../../rootAuth/domain/password";
import {
  TenantAuthBootstrapExpiredError,
  TenantAuthBootstrapInvalidError,
  TenantAuthInvalidCredentialsError,
  TenantAuthNoTenantAccessError,
  TenantAuthPasswordAlreadySetError,
  TenantAuthPasswordSetupExpiredError,
  TenantAuthPasswordSetupInvalidError,
  TenantAuthTenantNotAccessibleError,
} from "../contract/errors";
import {
  toTenantAuthBootstrapResult,
  toTenantAuthSessionResult,
  toTenantPasswordSetupResult,
} from "./presenters";
import type {
  ResolvedTenantAccessContext,
  TenantAuthOnboardingRequiredResult,
  TenantAuthService,
} from "./types";
import type { TenantAuthRepository } from "../persistence/repository";

const PASSWORD_SETUP_TTL_SECONDS = 60 * 30;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function buildSubjectDisplayName(subject: TenantAdminAuthBootstrapSubject): string | null {
  const displayName = [subject.firstName, subject.lastName].filter(Boolean).join(" ").trim();
  return displayName.length > 0 ? displayName : null;
}

async function writeAuditEvent(
  platformSecurityRepository: PlatformSecurityRepository | undefined,
  input: {
    eventType: string;
    eventOutcome: "success" | "failure";
    authPrincipalId?: string;
    ipAddress?: string;
    userAgent?: string;
  },
) {
  if (!platformSecurityRepository) {
    return;
  }

  await platformSecurityRepository.createSecurityAuditEvent({
    eventId: randomUUID(),
    eventType: input.eventType,
    eventOutcome: input.eventOutcome,
    authPrincipalId: input.authPrincipalId,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    occurredAt: new Date(),
  });
}

export function createTenantAuthService(
  repository: TenantAuthRepository,
  tenantAdminsAuthBootstrapReader: TenantAdminsAuthBootstrapReader,
  visibleTenantsReader: VisibleTenantsReader,
  platformSecurityRepository?: PlatformSecurityRepository,
): TenantAuthService {
  async function resolveAccessibleContexts(
    authPrincipalId: string,
  ): Promise<ResolvedTenantAccessContext[]> {
    const grants = await repository.listActiveAccessGrants(authPrincipalId);
    const contexts: ResolvedTenantAccessContext[] = [];

    for (const grant of grants) {
      if (grant.subject_type !== "tenant_admin") {
        continue;
      }

      const subject = await tenantAdminsAuthBootstrapReader.findVerifiedActiveById(grant.subject_id);
      if (!subject) {
        continue;
      }

      const tenant = await visibleTenantsReader.findVisibleTenantById(grant.tenant_id);
      if (!tenant) {
        continue;
      }

      contexts.push({
        tenantId: tenant.tenantId,
        tenantName: tenant.name,
        subjectType: "tenant_admin",
        subjectId: subject.tenantAdminId,
        subjectDisplayName: buildSubjectDisplayName(subject),
        subjectEmail: subject.email,
      });
    }

    return contexts.sort((left, right) =>
      left.tenantName.localeCompare(right.tenantName) || left.tenantId.localeCompare(right.tenantId),
    );
  }

  async function ensureSessionState(
    sessionId: string,
    authPrincipalId: string,
  ) {
    const session = await repository.findActiveSessionById(sessionId);
    const principal = await repository.findPrincipalById(authPrincipalId);

    if (!session || !principal) {
      throw new TenantAuthInvalidCredentialsError();
    }

    if (principal.disabled_at) {
      await repository.revokeSession(sessionId, authPrincipalId);
      throw new TenantAuthInvalidCredentialsError();
    }

    const contexts = await resolveAccessibleContexts(authPrincipalId);

    if (contexts.length === 0) {
      await repository.revokeSession(sessionId, authPrincipalId);
      throw new TenantAuthNoTenantAccessError();
    }

    const requestedActive = session.active_tenant_id;
    const resolvedActive =
      requestedActive && contexts.some((context) => context.tenantId === requestedActive)
        ? requestedActive
        : null;
    const autoActiveTenantId = contexts.length === 1 ? contexts[0].tenantId : resolvedActive;
    const selectionRequired = contexts.length > 1 && autoActiveTenantId === null;

    const nextSession =
      autoActiveTenantId !== session.active_tenant_id ||
      selectionRequired !== session.selection_required
        ? await repository.updateSessionContext(
            sessionId,
            authPrincipalId,
            autoActiveTenantId,
            selectionRequired,
          )
        : session;

    return {
      session: nextSession ?? session,
      principal,
      contexts,
    };
  }

  return {
    async bootstrapPrincipalFromVerification(input) {
      try {
        const source = await tenantAdminsAuthBootstrapReader.consumeVerificationProof(
          input.verificationToken,
        );
        const normalizedEmail = normalizeEmail(source.email);
        let principal = await repository.findPrincipalByNormalizedEmail(normalizedEmail);

        if (!principal) {
          principal = await repository.createPrincipal({
            authPrincipalId: randomUUID(),
            loginEmail: normalizedEmail,
            normalizedLoginEmail: normalizedEmail,
          });
        }

        const verifiedSubjects =
          await tenantAdminsAuthBootstrapReader.listVerifiedActiveByNormalizedEmail(normalizedEmail);

        for (const subject of verifiedSubjects) {
          const existingGrant = await repository.findActiveAccessGrant(
            principal.auth_principal_id,
            subject.tenantId,
            "tenant_admin",
            subject.tenantAdminId,
          );
          if (!existingGrant) {
            await repository.createAccessGrant({
              tenantAccessGrantId: randomUUID(),
              authPrincipalId: principal.auth_principal_id,
              tenantId: subject.tenantId,
              subjectType: "tenant_admin",
              subjectId: subject.tenantAdminId,
            });
          }
        }

        let bootstrapToken: string | null = null;
        const passwordSetupRequired = principal.password_state !== "active";

        if (passwordSetupRequired) {
          await repository.invalidateActivePasswordSetupTokens(principal.auth_principal_id);
          const tokenMaterial = createOneTimeTokenMaterial({
            purpose: "password_setup",
            ttlSeconds: PASSWORD_SETUP_TTL_SECONDS,
          });
          await repository.createPasswordSetupToken({
            tenantPasswordSetupTokenId: randomUUID(),
            authPrincipalId: principal.auth_principal_id,
            sourceTenantAdminId: source.tenantAdminId,
            tokenId: tokenMaterial.tokenId,
            secretHash: tokenMaterial.secretHash,
            expiresAt: tokenMaterial.expiresAt,
          });
          bootstrapToken = tokenMaterial.rawToken;
        }

        await writeAuditEvent(platformSecurityRepository, {
          eventType: "tenant_auth_principal_bootstrapped",
          eventOutcome: "success",
          authPrincipalId: principal.auth_principal_id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });

        return toTenantAuthBootstrapResult({
          principal: {
            authPrincipalId: principal.auth_principal_id,
            loginEmail: principal.login_email,
            normalizedLoginEmail: principal.normalized_login_email,
            passwordState: principal.password_state,
            createdAt: principal.created_at,
            updatedAt: principal.updated_at,
            disabledAt: principal.disabled_at,
          },
          passwordSetupRequired,
          bootstrapToken,
        });
      } catch (error) {
        await writeAuditEvent(platformSecurityRepository, {
          eventType: "tenant_auth_principal_bootstrapped",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        if (error instanceof TenantAdminVerificationTokenExpiredError) {
          throw new TenantAuthBootstrapExpiredError();
        }
        if (error instanceof TenantAdminVerificationTokenInvalidError) {
          throw new TenantAuthBootstrapInvalidError();
        }
        throw error;
      }
    },
    async setInitialPassword(input) {
      try {
        if (input.newPassword !== input.repeatPassword) {
          throw new TenantAuthPasswordSetupInvalidError();
        }

        assertPasswordPolicy(input.newPassword, env.tenantAuth.passwordMinLength);

        const parsed = parseOneTimeToken(input.bootstrapToken);
        if (!parsed.ok) {
          throw new TenantAuthPasswordSetupInvalidError();
        }

        const record = await repository.findPasswordSetupTokenByTokenId(parsed.value.tokenId);
        if (!record || record.invalidated_at) {
          throw new TenantAuthPasswordSetupInvalidError();
        }

        const verificationResult = verifyOneTimeTokenAgainstRecord({
          rawToken: input.bootstrapToken,
          record: {
            tokenId: record.token_id,
            purpose: record.purpose,
            secretHash: record.secret_hash,
            expiresAt: record.expires_at,
            usedAt: record.used_at,
          },
          expectedPurpose: "password_setup",
        });

        if (!verificationResult.ok) {
          if (verificationResult.code === "TOKEN_EXPIRED") {
            throw new TenantAuthPasswordSetupExpiredError();
          }
          throw new TenantAuthPasswordSetupInvalidError();
        }

        const completion = await repository.completePasswordSetup({
          tokenId: record.token_id,
          authPrincipalId: record.auth_principal_id,
          newPassword: input.newPassword,
          passwordSetAt: new Date(),
        });

        if (completion === "principal_not_found" || completion === "token_not_active") {
          throw new TenantAuthPasswordSetupInvalidError();
        }
        if (completion === "password_already_set") {
          throw new TenantAuthPasswordAlreadySetError();
        }

        const refreshed = await repository.findPrincipalById(record.auth_principal_id);
        if (!refreshed) {
          throw new TenantAuthPasswordSetupInvalidError();
        }

        await writeAuditEvent(platformSecurityRepository, {
          eventType: "tenant_auth_password_set",
          eventOutcome: "success",
          authPrincipalId: record.auth_principal_id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });

        return toTenantPasswordSetupResult({
          authPrincipalId: refreshed.auth_principal_id,
          loginEmail: refreshed.login_email,
          normalizedLoginEmail: refreshed.normalized_login_email,
          passwordState: refreshed.password_state,
          createdAt: refreshed.created_at,
          updatedAt: refreshed.updated_at,
          disabledAt: refreshed.disabled_at,
        });
      } catch (error) {
        await writeAuditEvent(platformSecurityRepository, {
          eventType: "tenant_auth_password_set",
          eventOutcome: "failure",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw error;
      }
    },
    async loginTenantPrincipalWithPassword(input) {
      const normalizedEmail = normalizeEmail(input.email);
      const principal = await repository.findPrincipalByNormalizedEmail(normalizedEmail);

      if (!principal) {
        const verifiedSubjects =
          await tenantAdminsAuthBootstrapReader.listVerifiedActiveByNormalizedEmail(normalizedEmail);
        if (verifiedSubjects.length > 0) {
          return {
            status: "ONBOARDING_REQUIRED",
            loginEmail: normalizedEmail,
          } satisfies TenantAuthOnboardingRequiredResult;
        }
        throw new TenantAuthInvalidCredentialsError();
      }

      if (principal.disabled_at) {
        throw new TenantAuthInvalidCredentialsError();
      }

      if (principal.password_state !== "active") {
        return {
          status: "ONBOARDING_REQUIRED",
          loginEmail: principal.login_email,
        } satisfies TenantAuthOnboardingRequiredResult;
      }

      const accepted = await repository.verifyPassword(principal.auth_principal_id, input.password);
      if (!accepted) {
        throw new TenantAuthInvalidCredentialsError();
      }

      const contexts = await resolveAccessibleContexts(principal.auth_principal_id);
      if (contexts.length === 0) {
        throw new TenantAuthNoTenantAccessError();
      }

      const activeTenantId = contexts.length === 1 ? contexts[0].tenantId : null;
      const session = await repository.createSession({
        sessionId: randomUUID(),
        authPrincipalId: principal.auth_principal_id,
        activeTenantId,
        selectionRequired: contexts.length > 1,
        authenticatedAt: new Date(),
        expiresAt: new Date(Date.now() + env.tenantAuth.sessionTtlSeconds * 1000),
      });

      await writeAuditEvent(platformSecurityRepository, {
        eventType: "tenant_auth_login",
        eventOutcome: "success",
        authPrincipalId: principal.auth_principal_id,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      return toTenantAuthSessionResult({
        principal: {
          authPrincipalId: principal.auth_principal_id,
          loginEmail: principal.login_email,
          normalizedLoginEmail: principal.normalized_login_email,
          passwordState: principal.password_state,
          createdAt: principal.created_at,
          updatedAt: principal.updated_at,
          disabledAt: principal.disabled_at,
        },
        session: {
          sessionId: session.session_id,
          authPrincipalId: session.auth_principal_id,
          activeTenantId: session.active_tenant_id,
          selectionRequired: session.selection_required,
          authenticatedAt: session.authenticated_at,
          expiresAt: session.expires_at,
          revokedAt: session.revoked_at,
          createdAt: session.created_at,
        },
        availableContexts: contexts,
      });
    },
    async readCurrentTenantSession(input) {
      const state = await ensureSessionState(input.sessionId, input.authPrincipalId);
      return toTenantAuthSessionResult({
        principal: {
          authPrincipalId: state.principal.auth_principal_id,
          loginEmail: state.principal.login_email,
          normalizedLoginEmail: state.principal.normalized_login_email,
          passwordState: state.principal.password_state,
          createdAt: state.principal.created_at,
          updatedAt: state.principal.updated_at,
          disabledAt: state.principal.disabled_at,
        },
        session: {
          sessionId: state.session.session_id,
          authPrincipalId: state.session.auth_principal_id,
          activeTenantId: state.session.active_tenant_id,
          selectionRequired: state.session.selection_required,
          authenticatedAt: state.session.authenticated_at,
          expiresAt: state.session.expires_at,
          revokedAt: state.session.revoked_at,
          createdAt: state.session.created_at,
        },
        availableContexts: state.contexts,
      });
    },
    async listAvailableTenantContexts(input) {
      const state = await ensureSessionState(input.sessionId, input.authPrincipalId);
      return {
        items: state.contexts.map((context) => ({
          tenantId: context.tenantId,
          tenantName: context.tenantName,
          subjectType: context.subjectType,
          subjectId: context.subjectId,
          subjectDisplayName: context.subjectDisplayName,
          subjectEmail: context.subjectEmail,
          isActive: state.session.active_tenant_id === context.tenantId,
        })),
      };
    },
    async selectActiveTenantContext(input) {
      const state = await ensureSessionState(input.sessionId, input.authPrincipalId);
      const nextContext = state.contexts.find((context) => context.tenantId === input.tenantId);
      if (!nextContext) {
        await writeAuditEvent(platformSecurityRepository, {
          eventType: "tenant_auth_tenant_selected",
          eventOutcome: "failure",
          authPrincipalId: input.authPrincipalId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        throw new TenantAuthTenantNotAccessibleError();
      }

      const session = await repository.updateSessionContext(
        input.sessionId,
        input.authPrincipalId,
        input.tenantId,
        false,
      );

      if (!session) {
        throw new TenantAuthInvalidCredentialsError();
      }

      await writeAuditEvent(platformSecurityRepository, {
        eventType: "tenant_auth_tenant_selected",
        eventOutcome: "success",
        authPrincipalId: input.authPrincipalId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      return toTenantAuthSessionResult({
        principal: {
          authPrincipalId: state.principal.auth_principal_id,
          loginEmail: state.principal.login_email,
          normalizedLoginEmail: state.principal.normalized_login_email,
          passwordState: state.principal.password_state,
          createdAt: state.principal.created_at,
          updatedAt: state.principal.updated_at,
          disabledAt: state.principal.disabled_at,
        },
        session: {
          sessionId: session.session_id,
          authPrincipalId: session.auth_principal_id,
          activeTenantId: session.active_tenant_id,
          selectionRequired: session.selection_required,
          authenticatedAt: session.authenticated_at,
          expiresAt: session.expires_at,
          revokedAt: session.revoked_at,
          createdAt: session.created_at,
        },
        availableContexts: state.contexts,
      });
    },
    async logoutTenantSession(input) {
      const revoked = await repository.revokeSession(input.sessionId, input.authPrincipalId);
      if (!revoked) {
        throw new TenantAuthInvalidCredentialsError();
      }
      await writeAuditEvent(platformSecurityRepository, {
        eventType: "tenant_auth_logout",
        eventOutcome: "success",
        authPrincipalId: input.authPrincipalId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
      return {
        status: "LOGGED_OUT",
        sessionRevoked: true,
      };
    },
  };
}
