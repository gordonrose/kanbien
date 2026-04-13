export interface RootSessionContext {
  sessionId: string;
  authPrincipalId: string;
  rootUserId: string;
  authenticatedAt: string;
  expiresAt: string;
}

export interface TenantSessionContext {
  sessionId: string;
  authPrincipalId: string;
  activeTenantId: string | null;
  selectionRequired: boolean;
  remediationRequired: boolean;
  remediationReason: "password_policy_upgrade_required" | null;
  authenticatedAt: string;
  expiresAt: string;
}

export function getRequiredRootSessionContext(
  request: Express.Request,
): RootSessionContext {
  if (!request.rootSession) {
    throw new Error("Missing root session context");
  }

  return request.rootSession;
}

export function getRequiredTenantSessionContext(
  request: Express.Request,
): TenantSessionContext {
  if (!request.tenantSession) {
    throw new Error("Missing tenant session context");
  }

  return request.tenantSession;
}
