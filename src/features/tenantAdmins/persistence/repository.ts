import type { TenantAdminData, TenantAdminListInput, TenantAdminVerificationTokenData } from "../domain/types";
import type {
  CreateTenantAdminRecordInput,
  CreateTenantAdminVerificationTokenRecordInput,
  UpdateTenantAdminRecordInput,
} from "./types";

export interface TenantAdminsRepository {
  create(input: CreateTenantAdminRecordInput): Promise<TenantAdminData>;
  findVisibleById(tenantId: string, tenantAdminId: string): Promise<TenantAdminData | null>;
  findDeletedById(tenantId: string, tenantAdminId: string): Promise<TenantAdminData | null>;
  findAnyById(tenantAdminId: string): Promise<TenantAdminData | null>;
  findActiveByNormalizedEmail(tenantId: string, normalizedEmail: string): Promise<TenantAdminData | null>;
  listVisible(input: TenantAdminListInput): Promise<{
    items: TenantAdminData[];
    totalSearchableRecords: number;
    totalMatchingRecords: number;
  }>;
  update(input: UpdateTenantAdminRecordInput): Promise<TenantAdminData>;
  softDelete(tenantId: string, tenantAdminId: string): Promise<TenantAdminData>;
  reactivate(tenantId: string, tenantAdminId: string): Promise<TenantAdminData>;
  createVerificationToken(
    input: CreateTenantAdminVerificationTokenRecordInput,
  ): Promise<TenantAdminVerificationTokenData>;
  findVerificationTokenByTokenId(tokenId: string): Promise<TenantAdminVerificationTokenData | null>;
  findLatestActiveVerificationTokenByTenantAdminId(
    tenantAdminId: string,
  ): Promise<TenantAdminVerificationTokenData | null>;
  invalidateActiveVerificationTokens(tenantAdminId: string): Promise<void>;
  attachOutboundEmailToVerificationToken(tokenId: string, outboundEmailId: string): Promise<void>;
  markVerificationEmailRequested(tenantAdminId: string, requestedAt: Date): Promise<TenantAdminData>;
  markVerificationTokenUsed(tokenId: string): Promise<void>;
  markVerified(tenantAdminId: string): Promise<TenantAdminData>;
}
