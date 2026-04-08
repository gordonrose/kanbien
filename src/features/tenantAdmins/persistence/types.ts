import type { TenantAdminEmailVerificationStatus } from "../contract/types";

export interface TenantAdminRecord {
  tenant_admin_id: string;
  tenant_id: string;
  email: string;
  normalized_email: string;
  first_name: string | null;
  last_name: string | null;
  email_verification_status: TenantAdminEmailVerificationStatus;
  email_verified_at: Date | null;
  last_verification_email_requested_at: Date | null;
  created_by_root_admin_user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface TenantAdminVerificationTokenRecord {
  tenant_admin_verification_token_id: string;
  tenant_admin_id: string;
  token_id: string;
  purpose: "email_verification";
  secret_hash: string;
  expires_at: Date;
  used_at: Date | null;
  invalidated_at: Date | null;
  outbound_email_id: string | null;
  requested_by_actor_type: string;
  requested_by_actor_id: string;
  created_at: Date;
}

export interface CreateTenantAdminRecordInput {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdByRootAdminUserId: string;
}

export interface UpdateTenantAdminRecordInput {
  tenantId: string;
  tenantAdminId: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  resetVerification: boolean;
}

export interface CreateTenantAdminVerificationTokenRecordInput {
  tenantAdminVerificationTokenId: string;
  tenantAdminId: string;
  tokenId: string;
  secretHash: string;
  expiresAt: Date;
  requestedByActorType: string;
  requestedByActorId: string;
}
