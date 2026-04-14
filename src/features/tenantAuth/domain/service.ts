import { randomUUID } from "node:crypto";
import {
  createOneTimeTokenMaterial,
  parseOneTimeToken,
  verifyOneTimeTokenAgainstRecord,
} from "../../../lib/tokens";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAdminAuthBootstrapSubject, TenantAdminsAuthBootstrapReader } from "../../tenantAdmins";
import type { VisibleTenantsReader } from "../../tenants";
import {
  HARD_PASSWORD_POLICY_FLOORS,
  SESSION_TTL_SECONDS_HARD_CEILING,
  SESSION_TTL_SECONDS_HARD_FLOOR,
  SYSTEM_DEFAULT_PASSWORD_POLICY,
  SYSTEM_DEFAULT_SESSION_POLICY,
} from "../../tenantConfiguration/domain/policy";
import type { TenantAuthPolicyResolver } from "../../tenantConfiguration";
import {
  TenantAuthInvalidNewPasswordError,
  TenantAuthInvalidCredentialsError,
  TenantAuthNoTenantAccessError,
  TenantAuthPasswordAlreadySetError,
  TenantAuthRemediationCurrentTenantRequiredError,
  TenantAuthRemediationNotRequiredError,
  TenantAuthPasswordSetupExpiredError,
  TenantAuthPasswordSetupInvalidError,
  TenantAuthTenantNotAccessibleError,
} from "../contract/errors";
import {
  toTenantAuthBootstrapResult,
  toTenantAuthRemediationResult,
  toTenantAuthSessionResult,
  toTenantPasswordSetupResult,
} from "./presenters";
import type {
  EffectiveTenantPasswordPolicy,
  ResolvedTenantAccessContext,
  TenantAuthOnboardingProvisioner,
  TenantAuthOnboardingRequiredResult,
  TenantAuthResolvedPolicyState,
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
    // Platform audit storage currently keys auth_principal_id to root-auth
    // principals, so tenant-auth events must not populate that FK.
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    occurredAt: new Date(),
  });
}

function createFallbackPolicyResolver(): TenantAuthPolicyResolver {
  return {
    async readEffectiveTenantAuthPolicy(tenantId) {
      return {
        tenantId,
        policySource: "system_default",
        hasTenantOverride: false,
        passwordPolicy: { ...SYSTEM_DEFAULT_PASSWORD_POLICY },
        sessionPolicy: { ...SYSTEM_DEFAULT_SESSION_POLICY },
        hardFloors: { ...HARD_PASSWORD_POLICY_FLOORS },
        hardLimits: {
          minSessionTtlSeconds: SESSION_TTL_SECONDS_HARD_FLOOR,
          maxSessionTtlSeconds: SESSION_TTL_SECONDS_HARD_CEILING,
        },
        updatedAt: null,
      };
    },
    async resolveAggregatePasswordPolicy(tenantIds) {
      return tenantIds.length === 0
        ? { ...SYSTEM_DEFAULT_PASSWORD_POLICY }
        : { ...SYSTEM_DEFAULT_PASSWORD_POLICY };
    },
    async resolveAggregateSessionTtlSeconds() {
      return SYSTEM_DEFAULT_SESSION_POLICY.sessionTtlSeconds;
    },
    assertPasswordMeetsPolicy(password, policy) {
      if (password.length < policy.minLength) {
        throw new TenantAuthInvalidNewPasswordError("too_short");
      }
      if (policy.maxLength !== null && password.length > policy.maxLength) {
        throw new TenantAuthInvalidNewPasswordError("too_long");
      }
      if (!/[a-z]/.test(password)) {
        throw new TenantAuthInvalidNewPasswordError("missing_lowercase");
      }
      if (!/[A-Z]/.test(password)) {
        throw new TenantAuthInvalidNewPasswordError("missing_uppercase");
      }
      if (!/[0-9]/.test(password)) {
        throw new TenantAuthInvalidNewPasswordError("missing_number");
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        throw new TenantAuthInvalidNewPasswordError("missing_symbol");
      }
    },
  };
}

function assertPasswordMeetsPolicy(
  policyResolver: TenantAuthPolicyResolver,
  password: string,
  policy: EffectiveTenantPasswordPolicy,
) {
  try {
    policyResolver.assertPasswordMeetsPolicy(password, policy);
  } catch (error) {
    if (error instanceof TenantAuthInvalidNewPasswordError) {
      throw error;
    }
    if (error instanceof Error && error.name === "TenantAuthPolicyPasswordViolation") {
      throw new TenantAuthInvalidNewPasswordError(error.message);
    }
    throw error;
  }
}

export function createTenantAuthService(
  repository: TenantAuthRepository,
  tenantAdminsAuthBootstrapReader: TenantAdminsAuthBootstrapReader,
  visibleTenantsReader: VisibleTenantsReader,
  policyResolver: TenantAuthPolicyResolver = createFallbackPolicyResolver(),
  platformSecurityRepository?: PlatformSecurityRepository,
): TenantAuthService & { onboardingProvisioner: TenantAuthOnboardingProvisioner } {
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

  async function resolvePolicyState(
    contexts: ResolvedTenantAccessContext[],
    activeTenantId: string | null,
  ): Promise<TenantAuthResolvedPolicyState> {
    const aggregatePasswordPolicy = await policyResolver.resolveAggregatePasswordPolicy(
      contexts.map((context) => context.tenantId),
    );
    const aggregateSessionTtlSeconds = await policyResolver.resolveAggregateSessionTtlSeconds(
      contexts.map((context) => context.tenantId),
    );
    const activeTenantPolicy = activeTenantId
      ? (await policyResolver.readEffectiveTenantAuthPolicy(activeTenantId))?.passwordPolicy ?? null
      : null;

    return {
      activeTenantPolicy,
      aggregatePasswordPolicy,
      aggregateSessionTtlSeconds,
    };
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

    let nextSession =
      autoActiveTenantId !== session.active_tenant_id ||
      selectionRequired !== session.selection_required
        ? await repository.updateSessionContext(
            sessionId,
            authPrincipalId,
            autoActiveTenantId,
            selectionRequired,
          )
        : session;

    nextSession ??= session;
    const policyState = await resolvePolicyState(contexts, nextSession.active_tenant_id);

    return {
      session: nextSession,
      principal,
      contexts,
      policyState,
    };
  }

  async function provisionTenantAuthForVerifiedSubject(input: {
    source: TenantAdminAuthBootstrapSubject;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const normalizedEmail = normalizeEmail(input.source.email);
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
        sourceTenantAdminId: input.source.tenantAdminId,
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
  }

  const onboardingProvisioner: TenantAuthOnboardingProvisioner = {
    provisionTenantAuthForVerifiedSubject,
  };

  return {
    onboardingProvisioner,
    async setInitialPassword(input) {
      try {
        if (input.newPassword !== input.repeatPassword) {
          throw new TenantAuthPasswordSetupInvalidError();
        }

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

        const accessibleContexts = await resolveAccessibleContexts(record.auth_principal_id);
        const policyState = await resolvePolicyState(accessibleContexts, null);
        assertPasswordMeetsPolicy(
          policyResolver,
          input.newPassword,
          policyState.aggregatePasswordPolicy,
        );

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
      const policyState = await resolvePolicyState(contexts, activeTenantId);
      let remediationRequired = false;
      let remediationReason: "password_policy_upgrade_required" | null = null;

      try {
        assertPasswordMeetsPolicy(
          policyResolver,
          input.password,
          policyState.aggregatePasswordPolicy,
        );
      } catch (error) {
        if (error instanceof TenantAuthInvalidNewPasswordError) {
          remediationRequired = true;
          remediationReason = "password_policy_upgrade_required";
        } else {
          throw error;
        }
      }

      const session = await repository.createSession({
        sessionId: randomUUID(),
        authPrincipalId: principal.auth_principal_id,
        activeTenantId,
        selectionRequired: contexts.length > 1,
        remediationRequired,
        remediationReason,
        authenticatedAt: new Date(),
        expiresAt: new Date(Date.now() + policyState.aggregateSessionTtlSeconds * 1000),
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
          remediationRequired: session.remediation_required,
          remediationReason: session.remediation_reason,
          authenticatedAt: session.authenticated_at,
          expiresAt: session.expires_at,
          revokedAt: session.revoked_at,
          createdAt: session.created_at,
        },
        availableContexts: contexts,
        passwordPolicyRequirements:
          remediationRequired && activeTenantId ? policyState.activeTenantPolicy : null,
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
          remediationRequired: state.session.remediation_required,
          remediationReason: state.session.remediation_reason,
          authenticatedAt: state.session.authenticated_at,
          expiresAt: state.session.expires_at,
          revokedAt: state.session.revoked_at,
          createdAt: state.session.created_at,
        },
        availableContexts: state.contexts,
        passwordPolicyRequirements:
          state.session.remediation_required && state.session.active_tenant_id
            ? state.policyState.activeTenantPolicy
            : null,
      });
    },
    async readCurrentTenantRemediationState(input) {
      const state = await ensureSessionState(input.sessionId, input.authPrincipalId);
      if (!state.session.active_tenant_id) {
        throw new TenantAuthRemediationCurrentTenantRequiredError();
      }

      return toTenantAuthRemediationResult({
        session: {
          sessionId: state.session.session_id,
          authPrincipalId: state.session.auth_principal_id,
          activeTenantId: state.session.active_tenant_id,
          selectionRequired: state.session.selection_required,
          remediationRequired: state.session.remediation_required,
          remediationReason: state.session.remediation_reason,
          authenticatedAt: state.session.authenticated_at,
          expiresAt: state.session.expires_at,
          revokedAt: state.session.revoked_at,
          createdAt: state.session.created_at,
        },
        availableContexts: state.contexts,
        passwordPolicyRequirements:
          state.session.remediation_required ? state.policyState.activeTenantPolicy : null,
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
          remediationRequired: session.remediation_required,
          remediationReason: session.remediation_reason,
          authenticatedAt: session.authenticated_at,
          expiresAt: session.expires_at,
          revokedAt: session.revoked_at,
          createdAt: session.created_at,
        },
        availableContexts: state.contexts,
        passwordPolicyRequirements:
          session.remediation_required && session.active_tenant_id
            ? (await resolvePolicyState(state.contexts, session.active_tenant_id)).activeTenantPolicy
            : null,
      });
    },
    async completePasswordRemediation(input) {
      if (input.newPassword !== input.repeatPassword) {
        throw new TenantAuthPasswordSetupInvalidError();
      }

      const state = await ensureSessionState(input.sessionId, input.authPrincipalId);
      if (!state.session.active_tenant_id) {
        throw new TenantAuthRemediationCurrentTenantRequiredError();
      }
      if (!state.session.remediation_required) {
        throw new TenantAuthRemediationNotRequiredError();
      }

      assertPasswordMeetsPolicy(
        policyResolver,
        input.newPassword,
        state.policyState.aggregatePasswordPolicy,
      );

      await repository.setPassword(input.authPrincipalId, input.newPassword, new Date());
      const session = await repository.updateSessionRemediation(
        input.sessionId,
        input.authPrincipalId,
        false,
        null,
      );

      if (!session) {
        throw new TenantAuthInvalidCredentialsError();
      }

      await writeAuditEvent(platformSecurityRepository, {
        eventType: "tenant_auth_password_remediation_completed",
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
          passwordState: "active",
          createdAt: state.principal.created_at,
          updatedAt: new Date(),
          disabledAt: state.principal.disabled_at,
        },
        session: {
          sessionId: session.session_id,
          authPrincipalId: session.auth_principal_id,
          activeTenantId: session.active_tenant_id,
          selectionRequired: session.selection_required,
          remediationRequired: session.remediation_required,
          remediationReason: session.remediation_reason,
          authenticatedAt: session.authenticated_at,
          expiresAt: session.expires_at,
          revokedAt: session.revoked_at,
          createdAt: session.created_at,
        },
        availableContexts: state.contexts,
        passwordPolicyRequirements: null,
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
