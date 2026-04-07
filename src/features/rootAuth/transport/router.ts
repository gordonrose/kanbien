import { Router, type NextFunction, type Request, type Response } from "express";
import { env } from "../../../config/env";
import { ZodError } from "zod";
import { createRequireRootSession } from "../../../lib/auth/middleware";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import {
  createRequireRootBrowserSession,
  requireTrustedBrowserOrigin,
} from "../../../lib/auth/browserSession";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  getRootAdminSessionClearCookieOptions,
  getRootAdminSessionCookieOptions,
} from "../../../lib/auth/rootAdminCookie";
import { createRateLimitMiddleware } from "../../../lib/security/rateLimit";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  addRootUserSshPublicKeyBodySchema,
  changeRootUserPasswordBodySchema,
  completeRootUserSshChallengeBodySchema,
  createRootUserAuthPrincipalBodySchema,
  loginRootUserWithPasswordBodySchema,
  revokeRootUserSessionParamsSchema,
  revokeRootUserSshPublicKeyParamsSchema,
} from "../contract/schemas";
import { InvalidRequestError, RootAuthError } from "../contract/errors";
import type { RootAuthRepository } from "../persistence/repository";
import { createRootAuthService } from "../domain/service";
import type { RootUsersAuthStateReader, RootUsersBrowserSummaryReader } from "../../rootUsers";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      throw new InvalidRequestError(
        undefined,
        issue
          ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message }
          : undefined,
      );
    }

    throw error;
  }
}

function getRequestMetadata(request: Request): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: request.ip,
    userAgent: request.header("user-agent") ?? undefined,
  };
}

export function createRootAuthRouter(
  authRepository: RootAuthRepository,
  rootUsersAuthStateReader: RootUsersAuthStateReader,
  rootUsersBrowserSummaryReader: RootUsersBrowserSummaryReader,
  platformSecurityRepository: PlatformSecurityRepository,
  capabilityChecker: RootCapabilityChecker,
): Router {
  const router = Router();
  const service = createRootAuthService(
    authRepository,
    rootUsersAuthStateReader,
    platformSecurityRepository,
  );
  const requireRootSession = createRequireRootSession(authRepository);
  const requireRootBrowserSession = createRequireRootBrowserSession(authRepository);
  const requireBrowserSessionRead = createRequireRootCapability(
    capabilityChecker,
    "root-admin-shell.session.read.own",
    { platformSecurityRepository },
  );
  const requireBrowserSessionLogout = createRequireRootCapability(
    capabilityChecker,
    "root-admin-shell.session.logout.own",
    { platformSecurityRepository },
  );
  const requireCreatePrincipal = createRequireRootCapability(
    capabilityChecker,
    "root-auth.principal.create",
    { platformSecurityRepository },
  );
  const requirePasswordChange = createRequireRootCapability(
    capabilityChecker,
    "root-auth.password.change.own",
    { platformSecurityRepository },
  );
  const requireSshKeyCreate = createRequireRootCapability(
    capabilityChecker,
    "root-auth.ssh-key.create.own",
    { platformSecurityRepository },
  );
  const requireSshKeyRead = createRequireRootCapability(
    capabilityChecker,
    "root-auth.ssh-key.read.own",
    { platformSecurityRepository },
  );
  const requireSshKeyRevoke = createRequireRootCapability(
    capabilityChecker,
    "root-auth.ssh-key.revoke.own",
    { platformSecurityRepository },
  );
  const requireSessionRead = createRequireRootCapability(
    capabilityChecker,
    "root-auth.session.read.own",
    { platformSecurityRepository },
  );
  const requireSessionRevoke = createRequireRootCapability(
    capabilityChecker,
    "root-auth.session.revoke.own",
    { platformSecurityRepository },
  );
  const requireSessionLogout = createRequireRootCapability(
    capabilityChecker,
    "root-auth.session.logout.own",
    { platformSecurityRepository },
  );
  const publicAuthRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: platformSecurityRepository,
    policy: {
      endpointClass: "public-auth",
      windowSeconds: env.platformSecurity.rateLimitPolicies.publicAuth.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.publicAuth.maxAttempts,
      responseCode: "AUTH_THROTTLED",
      responseMessage: "Too many authentication attempts. Please wait and try again.",
    },
    subjectScope: "ip",
    getSubjectKey: (request) => request.ip ?? null,
    signal: "public-auth",
    createAuditEvent: (request) => ({
      eventType: "auth_rate_limited",
      eventOutcome: "failure",
      ipAddress: request.ip,
      userAgent: request.header("user-agent") ?? undefined,
    }),
  });
  const authenticatedSensitiveRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-sensitive",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedSensitive.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedSensitive.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
    signal: "authenticated-sensitive",
  });

  router.post("/login/password", publicAuthRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(loginRootUserWithPasswordBodySchema, request.body);
      const result = await service.loginRootUserWithPassword({
        ...body,
        ...getRequestMetadata(request),
      });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/login/ssh", publicAuthRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(completeRootUserSshChallengeBodySchema, request.body);
      const result = await service.completeRootUserSshChallenge({
        ...body,
        ...getRequestMetadata(request),
      });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/browser/login/ssh", publicAuthRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(completeRootUserSshChallengeBodySchema, request.body);
      const result = await service.completeRootUserSshChallenge({
        ...body,
        ...getRequestMetadata(request),
      });
      const rootUserSummary = await rootUsersBrowserSummaryReader.findBrowserSummaryById(
        result.rootUserId,
      );

      response.cookie(
        env.rootAdmin.sessionCookieName,
        result.sessionId,
        getRootAdminSessionCookieOptions(),
      );
      response.status(200).json({
        rootUserId: result.rootUserId,
        authPrincipalId: result.authPrincipalId,
        displayName:
          rootUserSummary?.firstName || rootUserSummary?.lastName
            ? [rootUserSummary?.firstName, rootUserSummary?.lastName].filter(Boolean).join(" ")
            : rootUserSummary?.email ?? "Root User",
        email: rootUserSummary?.email ?? "",
        expiresAt: result.expiresAt,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/browser/session",
    requireRootBrowserSession,
    authenticatedSensitiveRateLimit,
    requireBrowserSessionRead,
    async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const rootUserSummary = await rootUsersBrowserSummaryReader.findBrowserSummaryById(
        session.rootUserId,
      );

      response.status(200).json({
        rootUserId: session.rootUserId,
        authPrincipalId: session.authPrincipalId,
        displayName:
          rootUserSummary?.firstName || rootUserSummary?.lastName
            ? [rootUserSummary?.firstName, rootUserSummary?.lastName].filter(Boolean).join(" ")
            : rootUserSummary?.email ?? "Root User",
        email: rootUserSummary?.email ?? "",
        expiresAt: session.expiresAt,
      });
    } catch (error) {
      next(error);
    }
    },
  );

  router.post(
    "/browser/logout",
    requireRootBrowserSession,
    authenticatedSensitiveRateLimit,
    requireBrowserSessionLogout,
    requireTrustedBrowserOrigin,
    async (request, response, next) => {
      try {
        const session = getRequiredRootSessionContext(request);
        const result = await service.logoutRootUserSession({
          authPrincipalId: session.authPrincipalId,
          rootUserId: session.rootUserId,
          sessionId: session.sessionId,
          ...getRequestMetadata(request),
        });
        response.clearCookie(
          env.rootAdmin.sessionCookieName,
          getRootAdminSessionClearCookieOptions(),
        );
        response.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.use(requireRootSession);
  router.use(authenticatedSensitiveRateLimit);

  router.post("/principals", requireCreatePrincipal, async (request, response, next) => {
    try {
      const body = parseOrThrow(createRootUserAuthPrincipalBodySchema, request.body);
      const result = await service.createRootUserAuthPrincipal({
        ...body,
        ...getRequestMetadata(request),
      });
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/password/change", requirePasswordChange, async (request, response, next) => {
    try {
      const body = parseOrThrow(changeRootUserPasswordBodySchema, request.body);
      const session = getRequiredRootSessionContext(request);
      const result = await service.changeRootUserPassword({
        authPrincipalId: session.authPrincipalId,
        rootUserId: session.rootUserId,
        currentSessionId: session.sessionId,
        ...body,
        ...getRequestMetadata(request),
      });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/ssh-keys", requireSshKeyCreate, async (request, response, next) => {
    try {
      const body = parseOrThrow(addRootUserSshPublicKeyBodySchema, request.body);
      const session = getRequiredRootSessionContext(request);
      const result = await service.addRootUserSshPublicKey({
        authPrincipalId: session.authPrincipalId,
        rootUserId: session.rootUserId,
        ...body,
        ...getRequestMetadata(request),
      });
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/ssh-keys", requireSshKeyRead, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.listRootUserSshPublicKeys(session.authPrincipalId);
      response.status(200).json({ items: result });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/ssh-keys/:keyId", requireSshKeyRevoke, async (request, response, next) => {
    try {
      const params = parseOrThrow(revokeRootUserSshPublicKeyParamsSchema, request.params);
      const session = getRequiredRootSessionContext(request);
      const result = await service.revokeRootUserSshPublicKey({
        authPrincipalId: session.authPrincipalId,
        rootUserId: session.rootUserId,
        keyId: params.keyId,
        ...getRequestMetadata(request),
      });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/sessions", requireSessionRead, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.listRootUserSessions(session.authPrincipalId);
      response.status(200).json({ items: result });
    } catch (error) {
      next(error);
    }
  });

  router.post("/sessions/:sessionId/revoke", requireSessionRevoke, async (request, response, next) => {
    try {
      const params = parseOrThrow(revokeRootUserSessionParamsSchema, request.params);
      const session = getRequiredRootSessionContext(request);
      const result = await service.revokeRootUserSession({
        authPrincipalId: session.authPrincipalId,
        rootUserId: session.rootUserId,
        sessionId: params.sessionId,
        ...getRequestMetadata(request),
      });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", requireSessionLogout, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.logoutRootUserSession({
        authPrincipalId: session.authPrincipalId,
        rootUserId: session.rootUserId,
        sessionId: session.sessionId,
        ...getRequestMetadata(request),
      });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof RootAuthError) {
      response.status(error.status).json({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
      return;
    }

    next(error);
  });

  return router;
}
