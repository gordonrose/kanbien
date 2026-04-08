export type TenantAdminEmailVerificationStatus = "pending" | "verified";

export interface TenantAdminSummary {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerificationStatus: TenantAdminEmailVerificationStatus;
  emailVerifiedAt: string | null;
  lastVerificationEmailRequestedAt: string | null;
  createdByRootAdminUserId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TenantAdminListResult {
  items: TenantAdminSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: number | "10000+";
  totalMatchingRecords: number | "10000+";
}
