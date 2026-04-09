import type {
  TenantAccessContextSummary,
  TenantAuthBootstrapResult,
  TenantAuthSessionResult,
  TenantPasswordSetupResult,
} from "../contract/types";
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
    authenticatedAt: input.session.authenticatedAt.toISOString(),
    expiresAt: input.session.expiresAt.toISOString(),
  };
}
