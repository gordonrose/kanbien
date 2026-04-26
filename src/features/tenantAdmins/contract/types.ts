export type TenantAdminEmailVerificationStatus = "pending" | "verified";

export interface TenantAdminSummary {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureAssetId: string | null;
  profilePictureUrl: string | null;
  profilePictureAltText: string | null;
  profilePictureDecorative: boolean;
  emailVerificationStatus: TenantAdminEmailVerificationStatus;
  emailVerifiedAt: string | null;
  lastVerificationEmailRequestedAt: string | null;
  createdByRootAdminUserId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TenantAdminVerificationRedeemResult {
  status: "VERIFIED";
  tenantAdmin: TenantAdminSummary;
  tenantAuthOnboarding: {
    authPrincipalId: string;
    loginEmail: string;
    passwordSetupRequired: boolean;
    bootstrapToken: string | null;
    nextStep: "PASSWORD_SETUP_REQUIRED" | "LOGIN_REQUIRED";
  };
}

export interface TenantAdminOnboardingRestartResult {
  status: "ONBOARDING_RESTARTED";
  tenantAdmin: TenantAdminSummary;
  tenantAuthOnboarding: {
    authPrincipalId: string;
    loginEmail: string;
    passwordSetupRequired: boolean;
    bootstrapToken: string | null;
    nextStep: "PASSWORD_SETUP_REQUIRED" | "LOGIN_REQUIRED";
  };
}

export interface TenantAdminListResult {
  items: TenantAdminSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: number | "10000+";
  totalMatchingRecords: number | "10000+";
}
