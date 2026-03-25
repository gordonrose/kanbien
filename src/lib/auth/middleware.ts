import type { NextFunction, Request, Response } from "express";
import type { RootAuthSessionLookupRepository } from "../../features/rootAuth/persistence/repository";
import { AuthMiddlewareError, InvalidSessionError, UnauthorizedError } from "./errors";

function parseBearerToken(request: Request): string | null {
  const header = request.header("authorization");

  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token.trim();
}

export function createRequireRootSession(
  authRepository: RootAuthSessionLookupRepository,
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const sessionId = parseBearerToken(request);

      if (!sessionId) {
        throw new UnauthorizedError();
      }

      const session = await authRepository.findActiveSessionById(sessionId);

      if (!session) {
        throw new InvalidSessionError();
      }

      request.rootSession = {
        sessionId: session.session_id,
        authPrincipalId: session.auth_principal_id,
        rootUserId: session.root_user_id,
        authenticatedAt: session.authenticated_at.toISOString(),
        expiresAt: session.expires_at.toISOString(),
      };

      next();
    } catch (error) {
      if (error instanceof AuthMiddlewareError) {
        response.status(error.status).json({
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        });
        return;
      }

      next(error);
    }
  };
}
