import type {
  CreateTenantAccessGrantInput,
  CreateTenantAuthPrincipalInput,
  CreateTenantPasswordSetupTokenInput,
  CreateTenantSessionInput,
  TenantAccessGrantRecord,
  TenantAuthPrincipalRecord,
  TenantPasswordSetupTokenRecord,
  TenantSessionRecord,
} from "./types";

export interface TenantAuthSessionLookupRepository {
  findActiveSessionById(sessionId: string): Promise<TenantSessionRecord | null>;
}

export interface TenantAuthRepository extends TenantAuthSessionLookupRepository {
  createPrincipal(input: CreateTenantAuthPrincipalInput): Promise<TenantAuthPrincipalRecord>;
  findPrincipalById(authPrincipalId: string): Promise<TenantAuthPrincipalRecord | null>;
  findPrincipalByNormalizedEmail(email: string): Promise<TenantAuthPrincipalRecord | null>;
  createAccessGrant(input: CreateTenantAccessGrantInput): Promise<TenantAccessGrantRecord>;
  findActiveAccessGrant(
    authPrincipalId: string,
    tenantId: string,
    subjectType: "tenant_admin",
    subjectId: string,
  ): Promise<TenantAccessGrantRecord | null>;
  listActiveAccessGrants(authPrincipalId: string): Promise<TenantAccessGrantRecord[]>;
  createPasswordSetupToken(
    input: CreateTenantPasswordSetupTokenInput,
  ): Promise<TenantPasswordSetupTokenRecord>;
  findPasswordSetupTokenByTokenId(tokenId: string): Promise<TenantPasswordSetupTokenRecord | null>;
  invalidateActivePasswordSetupTokens(authPrincipalId: string): Promise<void>;
  markPasswordSetupTokenUsed(tokenId: string): Promise<void>;
  completePasswordSetup(input: {
    tokenId: string;
    authPrincipalId: string;
    newPassword: string;
    passwordSetAt: Date;
  }): Promise<"updated" | "token_not_active" | "principal_not_found" | "password_already_set">;
  setPassword(authPrincipalId: string, newPassword: string, passwordSetAt: Date): Promise<void>;
  verifyPassword(authPrincipalId: string, password: string): Promise<boolean>;
  createSession(input: CreateTenantSessionInput): Promise<TenantSessionRecord>;
  updateSessionContext(
    sessionId: string,
    authPrincipalId: string,
    activeTenantId: string | null,
    selectionRequired: boolean,
  ): Promise<TenantSessionRecord | null>;
  revokeSession(sessionId: string, authPrincipalId: string): Promise<boolean>;
}
