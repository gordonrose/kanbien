import type { TenantAdminListResult as TenantAdminListResultData, TenantAdminData } from "./types";
import type { TenantAdminSummary, TenantAdminListResult } from "../contract/types";

export function toTenantAdminSummary(data: TenantAdminData): TenantAdminSummary {
  return {
    tenantAdminId: data.tenantAdminId,
    tenantId: data.tenantId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
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
