export interface TenantAuthPrincipalRecord {
  auth_principal_id: string;
  login_email: string;
  normalized_login_email: string;
  password_state: "setup_required" | "active";
  created_at: Date;
  updated_at: Date;
  disabled_at: Date | null;
}

export interface TenantPasswordCredentialRecord {
  tenant_password_credential_id: string;
  auth_principal_id: string;
  password_set_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TenantAccessGrantRecord {
  tenant_access_grant_id: string;
  auth_principal_id: string;
  tenant_id: string;
  subject_type: "tenant_admin";
  subject_id: string;
  created_at: Date;
  updated_at: Date;
  revoked_at: Date | null;
}

export interface TenantPasswordSetupTokenRecord {
  tenant_password_setup_token_id: string;
  auth_principal_id: string;
  source_tenant_admin_id: string;
  token_id: string;
  purpose: "password_setup";
  secret_hash: string;
  expires_at: Date;
  used_at: Date | null;
  invalidated_at: Date | null;
  created_at: Date;
}

export interface TenantSessionRecord {
  session_id: string;
  auth_principal_id: string;
  active_tenant_id: string | null;
  selection_required: boolean;
  authenticated_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
}

export interface CreateTenantAuthPrincipalInput {
  authPrincipalId: string;
  loginEmail: string;
  normalizedLoginEmail: string;
}

export interface CreateTenantAccessGrantInput {
  tenantAccessGrantId: string;
  authPrincipalId: string;
  tenantId: string;
  subjectType: "tenant_admin";
  subjectId: string;
}

export interface CreateTenantPasswordSetupTokenInput {
  tenantPasswordSetupTokenId: string;
  authPrincipalId: string;
  sourceTenantAdminId: string;
  tokenId: string;
  secretHash: string;
  expiresAt: Date;
}

export interface CreateTenantSessionInput {
  sessionId: string;
  authPrincipalId: string;
  activeTenantId: string | null;
  selectionRequired: boolean;
  authenticatedAt: Date;
  expiresAt: Date;
}
