import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import { env } from "../../../config/env";
import { createRateLimitMiddleware } from "../../../lib/security/rateLimit";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import { NotificationDeliveryError } from "../../notificationDelivery/contract/errors";
import {
  createTenantAdminBodySchema,
  listTenantAdminsQuerySchema,
  redeemVerificationBodySchema,
  resendVerificationBodySchema,
  tenantAdminParamsSchema,
  tenantScopedParamsSchema,
  updateTenantAdminBodySchema,
} from "../contract/schemas";
import { InvalidRequestError, TenantAdminError } from "../contract/errors";
import type { TenantAdminsService } from "../domain/service";

const passthroughMiddleware = (_request: Request, _response: Response, next: NextFunction) => {
  next();
};

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
          ? {
              field: String(issue.path[0] ?? "unknown"),
              reason: issue.message,
            }
          : undefined,
      );
    }
    throw error;
  }
}

async function writeOperatorAuditEvent(
  request: Request,
  platformSecurityRepository: PlatformSecurityRepository | undefined,
  eventType: string,
) {
  if (!platformSecurityRepository) {
    return;
  }
  const session = getRequiredRootSessionContext(request);
  await platformSecurityRepository.createSecurityAuditEvent({
    eventId: randomUUID(),
    authPrincipalId: session.authPrincipalId,
    rootUserId: session.rootUserId,
    eventType,
    eventOutcome: "success",
    ipAddress: request.ip,
    userAgent: request.header("user-agent") ?? undefined,
    occurredAt: new Date(),
  });
}

export function createTenantAdminsRouter(
  service: TenantAdminsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(capabilityChecker, "tenant-admin.create", authzOptions);
  const requireRead = createRequireRootCapability(capabilityChecker, "tenant-admin.read", authzOptions);
  const requireList = createRequireRootCapability(capabilityChecker, "tenant-admin.list", authzOptions);
  const requireUpdate = createRequireRootCapability(capabilityChecker, "tenant-admin.update", authzOptions);
  const requireVerificationSend = createRequireRootCapability(
    capabilityChecker,
    "tenant-admin.verification.send",
    authzOptions,
  );
  const requireVerificationResend = createRequireRootCapability(
    capabilityChecker,
    "tenant-admin.verification.resend",
    authzOptions,
  );
  const requireOnboardingRestart = createRequireRootCapability(
    capabilityChecker,
    "tenant-admin.onboarding.restart",
    authzOptions,
  );
  const requireDelete = createRequireRootCapability(capabilityChecker, "tenant-admin.delete", authzOptions);
  const requireReactivate = createRequireRootCapability(capabilityChecker, "tenant-admin.reactivate", authzOptions);
  const authenticatedSensitiveRateLimit = platformSecurityRepository
    ? createRateLimitMiddleware({
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
      })
    : passthroughMiddleware;

  router.post("/", requireCreate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const params = parseOrThrow(tenantScopedParamsSchema, request.params);
      const body = parseOrThrow(createTenantAdminBodySchema, request.body);
      const result = await service.createTenantAdmin({
        ...params,
        ...body,
        createdByRootAdminUserId: session.rootUserId,
        requestedByActorId: session.rootUserId,
      });
      await writeOperatorAuditEvent(request, platformSecurityRepository, "tenant_admin_created");
      await writeOperatorAuditEvent(
        request,
        platformSecurityRepository,
        "tenant_admin_verification_sent",
      );
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireList, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantScopedParamsSchema, request.params);
      const query = parseOrThrow(listTenantAdminsQuerySchema, request.query);
      response.status(200).json(
        await service.listTenantAdmins({
          ...params,
          page: query.page,
          pageSize: query.pageSize,
          orderBy: query.orderBy,
          orderDirection: query.orderDirection,
          filters: {
            emailPrefix: query.emailPrefix,
            firstNamePrefix: query.firstNamePrefix,
            lastNamePrefix: query.lastNamePrefix,
            emailVerificationStatus: query.emailVerificationStatus,
            createdAtFrom: query.createdAtFrom,
            createdAtTo: query.createdAtTo,
            updatedAtFrom: query.updatedAtFrom,
            updatedAtTo: query.updatedAtTo,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/:tenantAdminId", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(await service.getTenantAdmin(parseOrThrow(tenantAdminParamsSchema, request.params)));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:tenantAdminId", requireUpdate, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantAdminParamsSchema, request.params);
      const body = parseOrThrow(updateTenantAdminBodySchema, request.body);
      const result = await service.updateTenantAdminProfile({
        ...params,
        ...body,
        requestedByActorId: getRequiredRootSessionContext(request).rootUserId,
      });
      await writeOperatorAuditEvent(request, platformSecurityRepository, "tenant_admin_updated");
      if (result.emailVerificationStatus === "pending") {
        await writeOperatorAuditEvent(
          request,
          platformSecurityRepository,
          "tenant_admin_verification_sent",
        );
      }
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/:tenantAdminId/verification/send",
    authenticatedSensitiveRateLimit,
    requireVerificationSend,
    async (request, response, next) => {
      try {
        const session = getRequiredRootSessionContext(request);
        const result = await service.sendTenantAdminVerificationEmail({
          ...parseOrThrow(tenantAdminParamsSchema, request.params),
          requestedByActorId: session.rootUserId,
        });
        await writeOperatorAuditEvent(
          request,
          platformSecurityRepository,
          "tenant_admin_verification_sent",
        );
        response.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/:tenantAdminId/verification/resend",
    authenticatedSensitiveRateLimit,
    requireVerificationResend,
    async (request, response, next) => {
      try {
        const session = getRequiredRootSessionContext(request);
        const params = parseOrThrow(tenantAdminParamsSchema, request.params);
        const body = parseOrThrow(resendVerificationBodySchema, request.body);
        const result = await service.resendTenantAdminVerificationEmail({
          ...params,
          requestedByActorId: session.rootUserId,
          resendReason: body.resendReason,
        });
        await writeOperatorAuditEvent(
          request,
          platformSecurityRepository,
          "tenant_admin_verification_resent",
        );
        response.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    "/:tenantAdminId/onboarding/restart",
    authenticatedSensitiveRateLimit,
    requireOnboardingRestart,
    async (request, response, next) => {
      try {
        const session = getRequiredRootSessionContext(request);
        const result = await service.restartTenantAdminOnboarding({
          ...parseOrThrow(tenantAdminParamsSchema, request.params),
          requestedByActorId: session.rootUserId,
          ipAddress: request.ip,
          userAgent: request.header("user-agent") ?? undefined,
        });
        await writeOperatorAuditEvent(
          request,
          platformSecurityRepository,
          "tenant_admin_onboarding_restarted",
        );
        response.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post("/:tenantAdminId/delete", requireDelete, async (request, response, next) => {
    try {
      const result = await service.softDeleteTenantAdmin(
        parseOrThrow(tenantAdminParamsSchema, request.params),
      );
      await writeOperatorAuditEvent(request, platformSecurityRepository, "tenant_admin_deleted");
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/:tenantAdminId/reactivate", requireReactivate, async (request, response, next) => {
    try {
      const result = await service.reactivateTenantAdmin(
        parseOrThrow(tenantAdminParamsSchema, request.params),
      );
      await writeOperatorAuditEvent(
        request,
        platformSecurityRepository,
        "tenant_admin_reactivated",
      );
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof TenantAdminError || error instanceof NotificationDeliveryError) {
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

export function createTenantAdminVerificationRouter(
  service: TenantAdminsService,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const publicWriteRateLimit = platformSecurityRepository
    ? createRateLimitMiddleware({
        enabled: env.platformSecurity.enabled,
        repository: platformSecurityRepository,
        policy: {
          endpointClass: "public-write",
          windowSeconds: env.platformSecurity.rateLimitPolicies.publicWrite.windowSeconds,
          maxAttempts: env.platformSecurity.rateLimitPolicies.publicWrite.maxAttempts,
          responseCode: "RATE_LIMITED",
          responseMessage: "Too many requests. Please wait and try again.",
        },
        subjectScope: "ip",
        getSubjectKey: (request) => request.ip ?? null,
        signal: "public-write",
      })
    : passthroughMiddleware;

  router.post("/redeem", publicWriteRateLimit, async (request, response, next) => {
    try {
      const body = parseOrThrow(redeemVerificationBodySchema, request.body);
      const result = await service.redeemTenantAdminVerificationToken({
        ...body,
        ipAddress: request.ip,
        userAgent: request.header("user-agent") ?? undefined,
      });
      await service.writeAuditEvent({
        eventType: "tenant_admin_verification_redeemed",
        eventOutcome: "success",
        ipAddress: request.ip,
        userAgent: request.header("user-agent") ?? undefined,
      });
      response.status(200).json(result);
    } catch (error) {
      if (error instanceof TenantAdminError) {
        await service.writeAuditEvent({
          eventType: "tenant_admin_verification_redeemed",
          eventOutcome: "failure",
          ipAddress: request.ip,
          userAgent: request.header("user-agent") ?? undefined,
        });
      }
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof TenantAdminError) {
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
