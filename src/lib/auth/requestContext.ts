export interface RootSessionContext {
  sessionId: string;
  authPrincipalId: string;
  rootUserId: string;
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
