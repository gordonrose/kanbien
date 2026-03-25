import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import type { PlatformSecurityRepository } from "./repository";
import type { EndpointClass, RateLimitPolicy, SubjectScope } from "./types";

export interface RateLimitMiddlewareOptions {
  enabled: boolean;
  repository: PlatformSecurityRepository;
  policy: RateLimitPolicy;
  subjectScope: SubjectScope;
  getSubjectKey: (request: Request) => string | null;
  signal?: string;
  createAuditEvent?: (request: Request) => {
    eventType: string;
    eventOutcome: "success" | "failure";
    authPrincipalId?: string;
    rootUserId?: string;
    ipAddress?: string;
    userAgent?: string;
  } | null;
}

function defaultSignal(endpointClass: EndpointClass): string {
  return endpointClass;
}

export function createRateLimitMiddleware(options: RateLimitMiddlewareOptions) {
  return async (request: Request, response: Response, next: NextFunction) => {
    if (!options.enabled) {
      next();
      return;
    }

    try {
      const subjectKey = options.getSubjectKey(request);

      if (!subjectKey) {
        next();
        return;
      }

      const now = new Date();
      const attempts = await options.repository.incrementCounter({
        namespace: "rate_limit",
        subjectScope: options.subjectScope,
        subjectKey,
        signal: options.signal ?? defaultSignal(options.policy.endpointClass),
        windowSeconds: options.policy.windowSeconds,
        now,
      });

      if (attempts <= options.policy.maxAttempts) {
        next();
        return;
      }

      const audit = options.createAuditEvent?.(request);

      if (audit) {
        await options.repository.createSecurityAuditEvent({
          eventId: `evt_${randomUUID().replace(/-/g, "")}`,
          authPrincipalId: audit.authPrincipalId,
          rootUserId: audit.rootUserId,
          eventType: audit.eventType,
          eventOutcome: audit.eventOutcome,
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
          occurredAt: now,
        });
      }

      response.status(429).json({
        code: options.policy.responseCode,
        message: options.policy.responseMessage,
      });
    } catch (error) {
      next(error);
    }
  };
}
