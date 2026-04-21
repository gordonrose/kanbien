import type {
  TenantAccessContextSummary,
  TenantAuthBootstrapResult,
  TenantAuthRemediationResult,
  TenantAuthSessionResult,
  TenantPasswordSetupResult,
} from "../contract/types";
import type { EffectiveTenantPasswordPolicy } from "../../tenantConfiguration";
import type {
  ResolvedTenantAccessContext,
  TenantAuthPrincipalData,
  TenantSessionData,
} from "./types";

export function toTenantAuthPrincipalSummary(
  principal: TenantAuthPrincipalData,
) {
  return {
    authPrincipalId: principal.authPrincipalId,
    loginEmail: principal.loginEmail,
  };
}

export function toTenantAccessContextSummary(
  context: ResolvedTenantAccessContext,
  activeTenantId: string | null,
): TenantAccessContextSummary {
  return {
    tenantId: context.tenantId,
    tenantName: context.tenantName,
    subjectType: context.subjectType,
    subjectId: context.subjectId,
    subjectDisplayName: context.subjectDisplayName,
    subjectEmail: context.subjectEmail,
    isActive: activeTenantId === context.tenantId,
  };
}

export function toTenantAuthBootstrapResult(input: {
  principal: TenantAuthPrincipalData;
  passwordSetupRequired: boolean;
  bootstrapToken: string | null;
}): TenantAuthBootstrapResult {
  return {
    status: "PRINCIPAL_BOOTSTRAPPED",
    authPrincipalId: input.principal.authPrincipalId,
    loginEmail: input.principal.loginEmail,
    passwordSetupRequired: input.passwordSetupRequired,
    bootstrapToken: input.bootstrapToken,
  };
}

export function toTenantPasswordSetupResult(
  principal: TenantAuthPrincipalData,
): TenantPasswordSetupResult {
  return {
    status: "PASSWORD_SET",
    authPrincipalId: principal.authPrincipalId,
    loginEmail: principal.loginEmail,
    nextStep: "LOGIN_REQUIRED",
  };
}

export function toTenantAuthSessionResult(input: {
  principal: TenantAuthPrincipalData;
  session: TenantSessionData;
  availableContexts: ResolvedTenantAccessContext[];
  passwordPolicyRequirements?: EffectiveTenantPasswordPolicy | null;
}): TenantAuthSessionResult {
  const availableTenantContexts = input.availableContexts.map((context) =>
    toTenantAccessContextSummary(context, input.session.activeTenantId),
  );
  const activeTenantContext =
    availableTenantContexts.find((context) => context.isActive) ?? null;

  return {
    status:
      input.session.selectionRequired
        ? "AUTHENTICATED_SELECTION_REQUIRED"
        : input.session.activeTenantId
          ? "AUTHENTICATED_SINGLE_TENANT"
          : "AUTHENTICATED",
    sessionId: input.session.sessionId,
    authPrincipalId: input.principal.authPrincipalId,
    loginEmail: input.principal.loginEmail,
    activeTenantContext,
    availableTenantContexts,
    selectionRequired: input.session.selectionRequired,
    remediationRequired: input.session.remediationRequired,
    remediationReason: input.session.remediationReason,
    passwordPolicyRequirements: input.passwordPolicyRequirements ?? null,
    authenticatedAt: input.session.authenticatedAt.toISOString(),
    expiresAt: input.session.expiresAt.toISOString(),
  };
}

export function toTenantAuthRemediationResult(input: {
  session: TenantSessionData;
  availableContexts: ResolvedTenantAccessContext[];
  passwordPolicyRequirements: EffectiveTenantPasswordPolicy | null;
}): TenantAuthRemediationResult {
  const availableTenantContexts = input.availableContexts.map((context) =>
    toTenantAccessContextSummary(context, input.session.activeTenantId),
  );
  const activeTenantContext =
    availableTenantContexts.find((context) => context.isActive) ?? null;

  return {
    status: input.session.remediationRequired ? "REMEDIATION_REQUIRED" : "REMEDIATION_NOT_REQUIRED",
    remediationRequired: input.session.remediationRequired,
    remediationReason: input.session.remediationReason,
    activeTenantContext,
    passwordPolicyRequirements: input.passwordPolicyRequirements,
  };
}
