import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { env } from "../../../config/env";
import {
  getRequiredTenantSessionContext,
} from "../../../lib/auth/requestContext";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { createRateLimitMiddleware } from "../../../lib/security/rateLimit";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../persistence/repository";
import {
  bootstrapPrincipalBodySchema,
  loginTenantPrincipalBodySchema,
  selectTenantContextBodySchema,
  setupPasswordBodySchema,
} from "../contract/schemas";
import { InvalidRequestError, TenantAuthError } from "../contract/errors";
import type { TenantAuthService } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
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

function getRequestMetadata(request: Request) {
  return {
    ipAddress: request.ip,
    userAgent: request.header("user-agent") ?? undefined,
  };
}

export function createTenantAuthRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: TenantAuthService,
  platformSecurityRepository: PlatformSecurityRepository,
): Router {
  const router = Router();
  const requireTenantSession = createRequireTenantSession(sessionLookupRepository);
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
      request.tenantSession
        ? `${request.ip ?? "unknown"}|${request.tenantSession.authPrincipalId}`
        : null,
    signal: "authenticated-sensitive",
  });

  router.post("/principals/bootstrap", publicAuthRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(bootstrapPrincipalBodySchema, request.body);
      response.status(200).json(
        await service.bootstrapPrincipalFromVerification({
          ...body,
          ...getRequestMetadata(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/password/setup", publicAuthRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(setupPasswordBodySchema, request.body);
      response.status(200).json(
        await service.setInitialPassword({
          ...body,
          ...getRequestMetadata(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/login/password", publicAuthRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(loginTenantPrincipalBodySchema, request.body);
      response.status(200).json(
        await service.loginTenantPrincipalWithPassword({
          ...body,
          ...getRequestMetadata(request),
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/session",
    requireTenantSession,
    authenticatedSensitiveRateLimit,
    async (request, response, next) => {
      try {
        const session = getRequiredTenantSessionContext(request);
        response.status(200).json(
          await service.readCurrentTenantSession({
            sessionId: session.sessionId,
            authPrincipalId: session.authPrincipalId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    "/tenant-contexts",
    requireTenantSession,
    authenticatedSensitiveRateLimit,
    async (request, response, next) => {
      try {
        const session = getRequiredTenantSessionContext(request);
        response.status(200).json(
          await service.listAvailableTenantContexts({
            sessionId: session.sessionId,
            authPrincipalId: session.authPrincipalId,
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/tenant-selection",
    requireTenantSession,
    authenticatedSensitiveRateLimit,
    async (request, response, next) => {
      try {
        const session = getRequiredTenantSessionContext(request);
        const body = parseOrThrow(selectTenantContextBodySchema, request.body);
        response.status(200).json(
          await service.selectActiveTenantContext({
            sessionId: session.sessionId,
            authPrincipalId: session.authPrincipalId,
            tenantId: body.tenantId,
            ...getRequestMetadata(request),
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/logout",
    requireTenantSession,
    authenticatedSensitiveRateLimit,
    async (request, response, next) => {
      try {
        const session = getRequiredTenantSessionContext(request);
        response.status(200).json(
          await service.logoutTenantSession({
            sessionId: session.sessionId,
            authPrincipalId: session.authPrincipalId,
            ...getRequestMetadata(request),
          }),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof TenantAuthError) {
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
