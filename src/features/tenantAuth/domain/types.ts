import type {
  TenantAccessContextSummary,
  TenantAuthBootstrapResult,
  TenantAuthOnboardingRequiredResult,
  TenantAuthPrincipalSummary,
  TenantAuthRemediationResult,
  TenantAuthSessionResult,
  TenantLogoutResult,
  TenantPasswordSetupResult,
} from "../contract/types";
import type { EffectiveTenantPasswordPolicy, TenantAuthPolicyResolver } from "../../tenantConfiguration";

export interface TenantAuthPrincipalData {
  authPrincipalId: string;
  loginEmail: string;
  normalizedLoginEmail: string;
  passwordState: "setup_required" | "active";
  createdAt: Date;
  updatedAt: Date;
  disabledAt: Date | null;
}

export interface TenantPasswordCredentialData {
  tenantPasswordCredentialId: string;
  authPrincipalId: string;
  passwordSetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccessGrantData {
  tenantAccessGrantId: string;
  authPrincipalId: string;
  tenantId: string;
  subjectType: "tenant_admin";
  subjectId: string;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | null;
}

export interface TenantPasswordSetupTokenData {
  tenantPasswordSetupTokenId: string;
  authPrincipalId: string;
  sourceTenantAdminId: string;
  tokenId: string;
  purpose: "password_setup";
  secretHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  invalidatedAt: Date | null;
  createdAt: Date;
}

export interface TenantSessionData {
  sessionId: string;
  authPrincipalId: string;
  activeTenantId: string | null;
  selectionRequired: boolean;
  remediationRequired: boolean;
  remediationReason: "password_policy_upgrade_required" | null;
  authenticatedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface ResolvedTenantAccessContext {
  tenantId: string;
  tenantName: string;
  subjectType: "tenant_admin";
  subjectId: string;
  subjectDisplayName: string | null;
  subjectEmail: string;
}

export interface TenantAuthSessionShape {
  session: TenantSessionData;
  principal: TenantAuthPrincipalData;
  activeTenantContext: TenantAccessContextSummary | null;
  availableTenantContexts: TenantAccessContextSummary[];
}

export interface TenantAuthResolvedPolicyState {
  activeTenantPolicy: EffectiveTenantPasswordPolicy | null;
  aggregatePasswordPolicy: EffectiveTenantPasswordPolicy;
  aggregateSessionTtlSeconds: number;
}

export interface TenantAuthOnboardingProvisioner {
  provisionTenantAuthForVerifiedSubject(input: {
    source: {
      tenantAdminId: string;
      tenantId: string;
      email: string;
      normalizedEmail: string;
      firstName: string | null;
      lastName: string | null;
    };
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantAuthBootstrapResult>;
}

export interface TenantAuthService {
  setInitialPassword(input: {
    bootstrapToken: string;
    newPassword: string;
    repeatPassword: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantPasswordSetupResult>;
  loginTenantPrincipalWithPassword(input: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantAuthSessionResult | TenantAuthOnboardingRequiredResult>;
  readCurrentTenantSession(input: {
    sessionId: string;
    authPrincipalId: string;
  }): Promise<TenantAuthSessionResult>;
  readCurrentTenantRemediationState(input: {
    sessionId: string;
    authPrincipalId: string;
  }): Promise<TenantAuthRemediationResult>;
  listAvailableTenantContexts(input: {
    sessionId: string;
    authPrincipalId: string;
  }): Promise<{ items: TenantAccessContextSummary[] }>;
  selectActiveTenantContext(input: {
    sessionId: string;
    authPrincipalId: string;
    tenantId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantAuthSessionResult>;
  completePasswordRemediation(input: {
    sessionId: string;
    authPrincipalId: string;
    newPassword: string;
    repeatPassword: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantAuthSessionResult>;
  logoutTenantSession(input: {
    sessionId: string;
    authPrincipalId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantLogoutResult>;
}

export type {
  EffectiveTenantPasswordPolicy,
  TenantAuthPolicyResolver,
  TenantAccessContextSummary,
  TenantAuthBootstrapResult,
  TenantAuthOnboardingRequiredResult,
  TenantAuthPrincipalSummary,
  TenantAuthRemediationResult,
  TenantAuthSessionResult,
  TenantLogoutResult,
  TenantPasswordSetupResult,
};
