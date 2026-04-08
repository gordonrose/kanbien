import { Router, type NextFunction, type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  getOutboundEmailParamsSchema,
  listOutboundEmailsQuerySchema,
  resendEmailBodySchema,
  resendEmailParamsSchema,
  sendTestEmailBodySchema,
} from "../contract/schemas";
import {
  InvalidRequestError,
  NotificationDeliveryError,
} from "../contract/errors";
import type { NotificationDeliveryService } from "../domain/service";

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

export function createNotificationDeliveryRouter(
  service: NotificationDeliveryService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };

  async function writeOperatorAuditEvent(
    request: Request,
    eventType: string,
    session = getRequiredRootSessionContext(request),
  ) {
    if (!platformSecurityRepository) {
      return;
    }

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
  const requireSend = createRequireRootCapability(
    capabilityChecker,
    "notification.email.send",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "notification.email.read",
    authzOptions,
  );
  const requireResend = createRequireRootCapability(
    capabilityChecker,
    "notification.email.resend",
    authzOptions,
  );

  router.post("/emails/test", requireSend, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const body = parseOrThrow(sendTestEmailBodySchema, request.body);
      const result = await service.sendEmail({
        ...body,
        createdByActorType: "root_user",
        createdByActorId: session.rootUserId,
      });
      await writeOperatorAuditEvent(request, "notification_email_sent", session);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/emails", requireRead, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const query = parseOrThrow(listOutboundEmailsQuerySchema, request.query);
      const result = await service.listOutboundEmails({
        page: query.page,
        pageSize: query.pageSize,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
        filters: {
          tenantId: query.tenantId,
          notificationType: query.notificationType,
          recipientEmail: query.recipientEmail,
          relatedEntityType: query.relatedEntityType,
          relatedEntityId: query.relatedEntityId,
          subject: query.subject,
          status: query.status,
          provider: query.provider,
          createdByActorType: query.createdByActorType,
          createdByActorId: query.createdByActorId,
          requestedAtFrom: query.requestedAtFrom,
          requestedAtTo: query.requestedAtTo,
          sentAtFrom: query.sentAtFrom,
          sentAtTo: query.sentAtTo,
        },
      });
      await writeOperatorAuditEvent(request, "notification_email_listed", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/emails/:emailId", requireRead, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.getOutboundEmail(
        parseOrThrow(getOutboundEmailParamsSchema, request.params),
      );
      await writeOperatorAuditEvent(request, "notification_email_read", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/emails/:emailId/resend", requireResend, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const params = parseOrThrow(resendEmailParamsSchema, request.params);
      const body = parseOrThrow(resendEmailBodySchema, request.body);
      const result = await service.resendEmail({
        ...params,
        ...body,
        resentByActorType: "root_user",
        resentByActorId: session.rootUserId,
      });
      await writeOperatorAuditEvent(request, "notification_email_resent", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof NotificationDeliveryError) {
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
