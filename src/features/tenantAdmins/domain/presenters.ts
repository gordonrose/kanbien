import type { TenantAdminListResult as TenantAdminListResultData, TenantAdminData } from "./types";
import type {
  TenantAdminSummary,
  TenantAdminListResult,
  TenantAdminOnboardingRestartResult,
  TenantAdminVerificationRedeemResult,
} from "../contract/types";

function assetContentUrl(assetId: string | null): string | null {
  return assetId ? `/v1/assets/${assetId}/content` : null;
}

export function toTenantAdminSummary(data: TenantAdminData): TenantAdminSummary {
  return {
    tenantAdminId: data.tenantAdminId,
    tenantId: data.tenantId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    profilePictureAssetId: data.profilePictureAssetId,
    profilePictureUrl: assetContentUrl(data.profilePictureAssetId),
    profilePictureAltText: data.profilePictureAltText,
    profilePictureDecorative: data.profilePictureDecorative,
    emailVerificationStatus: data.emailVerificationStatus,
    emailVerifiedAt: data.emailVerifiedAt?.toISOString() ?? null,
    lastVerificationEmailRequestedAt: data.lastVerificationEmailRequestedAt?.toISOString() ?? null,
    createdByRootAdminUserId: data.createdByRootAdminUserId,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    deletedAt: data.deletedAt?.toISOString() ?? null,
  };
}

export function toTenantAdminListResult(data: TenantAdminListResultData): TenantAdminListResult {
  return {
    items: data.items,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
    totalSearchableRecords: data.totalSearchableRecords,
    totalMatchingRecords: data.totalMatchingRecords,
  };
}

export function toTenantAdminVerificationRedeemResult(input: {
  tenantAdmin: TenantAdminData;
  onboarding: {
    authPrincipalId: string;
    loginEmail: string;
    passwordSetupRequired: boolean;
    bootstrapToken: string | null;
  };
}): TenantAdminVerificationRedeemResult {
  return {
    status: "VERIFIED",
    tenantAdmin: toTenantAdminSummary(input.tenantAdmin),
    tenantAuthOnboarding: {
      authPrincipalId: input.onboarding.authPrincipalId,
      loginEmail: input.onboarding.loginEmail,
      passwordSetupRequired: input.onboarding.passwordSetupRequired,
      bootstrapToken: input.onboarding.bootstrapToken,
      nextStep: input.onboarding.passwordSetupRequired
        ? "PASSWORD_SETUP_REQUIRED"
        : "LOGIN_REQUIRED",
    },
  };
}

export function toTenantAdminOnboardingRestartResult(input: {
  tenantAdmin: TenantAdminData;
  onboarding: {
    authPrincipalId: string;
    loginEmail: string;
    passwordSetupRequired: boolean;
    bootstrapToken: string | null;
  };
}): TenantAdminOnboardingRestartResult {
  return {
    status: "ONBOARDING_RESTARTED",
    tenantAdmin: toTenantAdminSummary(input.tenantAdmin),
    tenantAuthOnboarding: {
      authPrincipalId: input.onboarding.authPrincipalId,
      loginEmail: input.onboarding.loginEmail,
      passwordSetupRequired: input.onboarding.passwordSetupRequired,
      bootstrapToken: input.onboarding.bootstrapToken,
      nextStep: input.onboarding.passwordSetupRequired
        ? "PASSWORD_SETUP_REQUIRED"
        : "LOGIN_REQUIRED",
    },
  };
}
