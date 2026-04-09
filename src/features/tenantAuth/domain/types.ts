import type {
  TenantAccessContextSummary,
  TenantAuthBootstrapResult,
  TenantAuthOnboardingRequiredResult,
  TenantAuthPrincipalSummary,
  TenantAuthSessionResult,
  TenantLogoutResult,
  TenantPasswordSetupResult,
} from "../contract/types";

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

export interface TenantAuthService {
  bootstrapPrincipalFromVerification(input: {
    verificationToken: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantAuthBootstrapResult>;
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
  logoutTenantSession(input: {
    sessionId: string;
    authPrincipalId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<TenantLogoutResult>;
}

export type {
  TenantAccessContextSummary,
  TenantAuthBootstrapResult,
  TenantAuthOnboardingRequiredResult,
  TenantAuthPrincipalSummary,
  TenantAuthSessionResult,
  TenantLogoutResult,
  TenantPasswordSetupResult,
};
