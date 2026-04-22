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
  auditCapabilityCatalogQuerySchema,
  capabilityIdParamsSchema,
  exportCapabilityCatalogBodySchema,
  listCapabilityCatalogQuerySchema,
  materializeCapabilityCatalogBodySchema,
} from "../contract/schemas";
import { CapabilityContractCatalogError, InvalidRequestError } from "../contract/errors";
import type { CapabilityContractCatalogService } from "../domain/service";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && "keys" in issue && issue.keys[0]) {
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

export function createCapabilityContractCatalogRouter(
  service: CapabilityContractCatalogService,
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

  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "capability-contract-catalog.read",
    authzOptions,
  );
  const requireExport = createRequireRootCapability(
    capabilityChecker,
    "capability-contract-catalog.export",
    authzOptions,
  );
  const requireMaterialize = createRequireRootCapability(
    capabilityChecker,
    "capability-contract-catalog.materialize",
    authzOptions,
  );
  const requireAuditDrift = createRequireRootCapability(
    capabilityChecker,
    "capability-contract-catalog.audit-drift",
    authzOptions,
  );

  router.get("/capabilities", requireRead, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.listCapabilityCatalogEntries(
        parseOrThrow(listCapabilityCatalogQuerySchema, request.query),
      );
      await writeOperatorAuditEvent(request, "capability_contract_catalog_listed", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/capabilities/:capabilityId", requireRead, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const { capabilityId } = parseOrThrow(capabilityIdParamsSchema, request.params);
      const result = await service.getCapabilityCatalogEntry(capabilityId);
      await writeOperatorAuditEvent(request, "capability_contract_catalog_read", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/export", requireExport, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.exportCapabilityCatalogSnapshot(
        parseOrThrow(exportCapabilityCatalogBodySchema, request.body),
      );
      await writeOperatorAuditEvent(request, "capability_contract_catalog_exported", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/materialize", requireMaterialize, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.materializeCapabilityCatalog(
        parseOrThrow(materializeCapabilityCatalogBodySchema, request.body),
      );
      await writeOperatorAuditEvent(request, "capability_contract_catalog_materialized", session);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/drift", requireAuditDrift, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const result = await service.auditCapabilityCatalogDrift(
        parseOrThrow(auditCapabilityCatalogQuerySchema, request.query),
      );
      await writeOperatorAuditEvent(request, "capability_contract_catalog_drift_audited", session);
      response.status(200).json({ items: result });
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof CapabilityContractCatalogError) {
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
