import type { NextFunction, Request, Response } from "express";
import type { RootAuthSessionLookupRepository } from "../../features/rootAuth/persistence/repository";
import { env } from "../../config/env";
import { parseCookieHeader } from "./cookies";
import { AuthMiddlewareError, InvalidSessionError, UnauthorizedError } from "./errors";
import {
  getRootAdminSessionClearCookieOptions,
  getRootAdminSessionCookieOptions,
} from "./rootAdminCookie";

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

function parseCookieSessionId(request: Request, cookieName: string): string | null {
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

export function createRequireRootSession(
  authRepository: RootAuthSessionLookupRepository,
  options?: { allowBrowserCookie?: boolean; cookieName?: string },
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const cookieName = options?.cookieName ?? env.rootAdmin.sessionCookieName;
    const allowBrowserCookie = options?.allowBrowserCookie === true;
    let usedBrowserCookie = false;

    try {
      const bearerSessionId = parseBearerToken(request);
      const cookieSessionId =
        !bearerSessionId && allowBrowserCookie
          ? parseCookieSessionId(request, cookieName)
          : null;
      const sessionId = bearerSessionId ?? cookieSessionId;
      usedBrowserCookie = !bearerSessionId && Boolean(cookieSessionId);

      if (!sessionId) {
        throw new UnauthorizedError();
      }

      const session = await authRepository.findActiveSessionById(sessionId);

      if (!session) {
        throw new InvalidSessionError();
      }

      const activeSession = usedBrowserCookie
        ? (() => {
            const now = new Date();
            const slidingExpiry = calculateSlidingExpiry(session.authenticated_at, now);
            if (slidingExpiry.getTime() <= session.expires_at.getTime()) {
              return Promise.resolve(session);
            }
            return authRepository.touchSession(sessionId, slidingExpiry).then((updated) => updated ?? session);
          })()
        : Promise.resolve(session);

      const resolvedSession = await activeSession;

      request.rootSession = {
        sessionId: resolvedSession.session_id,
        authPrincipalId: resolvedSession.auth_principal_id,
        rootUserId: resolvedSession.root_user_id,
        authenticatedAt: resolvedSession.authenticated_at.toISOString(),
        expiresAt: resolvedSession.expires_at.toISOString(),
      };

      if (usedBrowserCookie) {
        response.cookie(cookieName, sessionId, getRootAdminSessionCookieOptions());
      }

      next();
    } catch (error) {
      if (error instanceof AuthMiddlewareError) {
        if (usedBrowserCookie || (allowBrowserCookie && parseCookieSessionId(request, cookieName))) {
          response.clearCookie(cookieName, getRootAdminSessionClearCookieOptions());
        }
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
