import type { NextFunction, Request, Response } from "express";
import type { RootAuthSessionLookupRepository } from "../../features/rootAuth/persistence/repository";
import { env } from "../../config/env";
import { parseCookieHeader } from "./cookies";
import { AuthMiddlewareError, InvalidSessionError, UnauthorizedError } from "./errors";
import {
  getRootAdminSessionClearCookieOptions,
  getRootAdminSessionCookieOptions,
} from "./rootAdminCookie";

function getCookieSessionId(request: Request, cookieName: string): string | null {
  const cookies = parseCookieHeader(request.header("cookie"));
  const sessionId = cookies[cookieName];

  return typeof sessionId === "string" && sessionId.trim().length > 0 ? sessionId.trim() : null;
}

function calculateSlidingExpiry(authenticatedAt: Date, now: Date): Date {
  const absoluteExpiry = new Date(
    authenticatedAt.getTime() + env.rootAdmin.sessionAbsoluteTtlSeconds * 1000,
  );
  const idleExpiry = new Date(now.getTime() + env.rootAdmin.sessionIdleTtlSeconds * 1000);

  return idleExpiry.getTime() < absoluteExpiry.getTime() ? idleExpiry : absoluteExpiry;
}

export function createRequireRootBrowserSession(
  authRepository: RootAuthSessionLookupRepository,
  options?: { cookieName?: string },
) {
  const cookieName = options?.cookieName ?? env.rootAdmin.sessionCookieName;

  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const sessionId = getCookieSessionId(request, cookieName);

      if (!sessionId) {
        throw new UnauthorizedError();
      }

      const session = await authRepository.findActiveSessionById(sessionId);

      if (!session) {
        throw new InvalidSessionError();
      }

      const now = new Date();
      const slidingExpiry = calculateSlidingExpiry(session.authenticated_at, now);
      const activeSession =
        slidingExpiry.getTime() > session.expires_at.getTime()
          ? (await authRepository.touchSession(sessionId, slidingExpiry)) ?? session
          : session;

      request.rootSession = {
        sessionId: activeSession.session_id,
        authPrincipalId: activeSession.auth_principal_id,
        rootUserId: activeSession.root_user_id,
        authenticatedAt: activeSession.authenticated_at.toISOString(),
        expiresAt: activeSession.expires_at.toISOString(),
      };

      response.cookie(cookieName, sessionId, getRootAdminSessionCookieOptions());

      next();
    } catch (error) {
      if (error instanceof AuthMiddlewareError) {
        response.clearCookie(cookieName, getRootAdminSessionClearCookieOptions());
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

export function requireTrustedBrowserOrigin(request: Request, response: Response, next: NextFunction) {
  const origin = request.header("origin");

  if (!origin) {
    response.status(403).json({
      code: "BROWSER_ORIGIN_REQUIRED",
      message: "A trusted browser origin is required for this action.",
    });
    return;
  }

  const expectedOrigin = env.rootAdmin.publicOrigin ?? `${request.protocol}://${request.get("host")}`;

  if (origin !== expectedOrigin) {
    response.status(403).json({
      code: "UNTRUSTED_BROWSER_ORIGIN",
      message: "The browser origin was not accepted for this action.",
    });
    return;
  }

  next();
}
