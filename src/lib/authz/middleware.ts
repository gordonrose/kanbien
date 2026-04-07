import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { getRequiredRootSessionContext } from "../auth/requestContext";
import type { PlatformSecurityRepository } from "../security/repository";
import { ForbiddenError, RootAuthorizationError } from "./errors";

export interface RootCapabilityChecker {
  hasCapability(input: {
    rootUserId: string;
    capabilityKey: string;
  }): Promise<boolean>;
}

interface RequireRootCapabilityOptions {
  platformSecurityRepository?: PlatformSecurityRepository;
}

export function createRequireRootCapability(
  checker: RootCapabilityChecker,
  capabilityKey: string,
  options: RequireRootCapabilityOptions = {},
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const allowed = await checker.hasCapability({
        rootUserId: session.rootUserId,
        capabilityKey,
      });

      if (!allowed) {
        if (options.platformSecurityRepository) {
          await options.platformSecurityRepository.createSecurityAuditEvent({
            eventId: randomUUID(),
            authPrincipalId: session.authPrincipalId,
            rootUserId: session.rootUserId,
            eventType: "root_capability_denied",
            eventOutcome: "failure",
            ipAddress: request.ip,
            userAgent: request.header("user-agent") ?? undefined,
            occurredAt: new Date(),
          });
        }
        throw new ForbiddenError();
      }

      next();
    } catch (error) {
      if (error instanceof RootAuthorizationError) {
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

export function createRequireAnyRootCapability(
  checker: RootCapabilityChecker,
  capabilityKeys: string[],
  options: RequireRootCapabilityOptions = {},
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const session = getRequiredRootSessionContext(request);
      let allowed = false;

      for (const capabilityKey of capabilityKeys) {
        if (
          await checker.hasCapability({
            rootUserId: session.rootUserId,
            capabilityKey,
          })
        ) {
          allowed = true;
          break;
        }
      }

      if (!allowed) {
        if (options.platformSecurityRepository) {
          await options.platformSecurityRepository.createSecurityAuditEvent({
            eventId: randomUUID(),
            authPrincipalId: session.authPrincipalId,
            rootUserId: session.rootUserId,
            eventType: "root_capability_denied",
            eventOutcome: "failure",
            ipAddress: request.ip,
            userAgent: request.header("user-agent") ?? undefined,
            occurredAt: new Date(),
          });
        }
        throw new ForbiddenError();
      }

      next();
    } catch (error) {
      if (error instanceof RootAuthorizationError) {
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
