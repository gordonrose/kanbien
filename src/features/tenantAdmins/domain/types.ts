import type { OneTimeTokenPurpose } from "../../../lib/tokens";
import type { TenantAdminSummary, TenantAdminEmailVerificationStatus } from "../contract/types";

export type CountValue = number | "10000+";

export interface TenantAdminData {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  normalizedEmail: string;
  firstName: string | null;
  lastName: string | null;
  emailVerificationStatus: TenantAdminEmailVerificationStatus;
  emailVerifiedAt: Date | null;
  lastVerificationEmailRequestedAt: Date | null;
  createdByRootAdminUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface TenantAdminVerificationTokenData {
  tenantAdminVerificationTokenId: string;
  tenantAdminId: string;
  tokenId: string;
  purpose: OneTimeTokenPurpose;
  secretHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  invalidatedAt: Date | null;
  outboundEmailId: string | null;
  requestedByActorType: string;
  requestedByActorId: string;
  createdAt: Date;
}

export interface TenantAdminListInput {
  tenantId: string;
  page: number;
  pageSize: number;
  orderBy: "updatedAt" | "createdAt" | "email" | "firstName" | "lastName";
  orderDirection: "asc" | "desc";
  filters: {
    emailPrefix?: string;
    firstNamePrefix?: string;
    lastNamePrefix?: string;
    emailVerificationStatus?: TenantAdminEmailVerificationStatus;
    createdAtFrom?: string;
    createdAtTo?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
  };
}

export interface TenantAdminListResult {
  items: TenantAdminSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}
