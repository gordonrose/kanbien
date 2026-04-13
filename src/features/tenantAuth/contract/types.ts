import type { EffectiveTenantPasswordPolicy } from "../../tenantConfiguration";

export interface TenantAuthPrincipalSummary {
  authPrincipalId: string;
  loginEmail: string;
}

export interface TenantAccessContextSummary {
  tenantId: string;
  tenantName: string;
  subjectType: "tenant_admin";
  subjectId: string;
  subjectDisplayName: string | null;
  subjectEmail: string;
  isActive: boolean;
}

export interface TenantAuthBootstrapResult {
  status: "PRINCIPAL_BOOTSTRAPPED";
  authPrincipalId: string;
  loginEmail: string;
  passwordSetupRequired: boolean;
  bootstrapToken: string | null;
}

export interface TenantPasswordSetupResult {
  status: "PASSWORD_SET";
  authPrincipalId: string;
  loginEmail: string;
  nextStep: "LOGIN_REQUIRED";
}

export interface TenantAuthOnboardingRequiredResult {
  status: "ONBOARDING_REQUIRED";
  loginEmail: string;
}

export interface TenantAuthSessionResult {
  status:
    | "AUTHENTICATED"
    | "AUTHENTICATED_SINGLE_TENANT"
    | "AUTHENTICATED_SELECTION_REQUIRED";
  sessionId: string;
  authPrincipalId: string;
  loginEmail: string;
  activeTenantContext: TenantAccessContextSummary | null;
  availableTenantContexts: TenantAccessContextSummary[];
  selectionRequired: boolean;
  remediationRequired: boolean;
  remediationReason: "password_policy_upgrade_required" | null;
  passwordPolicyRequirements: EffectiveTenantPasswordPolicy | null;
  authenticatedAt: string;
  expiresAt: string;
}

export interface TenantAuthRemediationResult {
  status: "REMEDIATION_REQUIRED" | "REMEDIATION_NOT_REQUIRED";
  remediationRequired: boolean;
  remediationReason: "password_policy_upgrade_required" | null;
  activeTenantContext: TenantAccessContextSummary | null;
  passwordPolicyRequirements: EffectiveTenantPasswordPolicy | null;
}

export interface TenantLogoutResult {
  status: "LOGGED_OUT";
  sessionRevoked: true;
}
