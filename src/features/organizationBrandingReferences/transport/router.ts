import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { createRequireTenantSession } from "../../../lib/auth/middleware";
import { getRequiredRootSessionContext, getRequiredTenantSessionContext } from "../../../lib/auth/requestContext";
import { createRequireRootCapability, type RootCapabilityChecker } from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import type { TenantAuthSessionLookupRepository } from "../../tenantAuth";
import { InvalidOrganizationLogoRequestError, OrganizationLogoError } from "../contract/errors";
import {
  completeLogoUploadBodySchema,
  createLogoUploadIntentBodySchema,
  organizationParamsSchema,
  publicLogoParamsSchema,
  replaceLogoBodySchema,
  tenantOrganizationParamsSchema,
  uploadLogoBytesQuerySchema,
} from "../contract/schemas";
import type { OrganizationBrandingReferencesService } from "../domain/service";
import type { OrganizationLogoActorInput } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidOrganizationLogoRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new InvalidOrganizationLogoRequestError(
        undefined,
        issue ? { field: String(issue.path[0] ?? "unknown"), reason: issue.message } : undefined,
      );
    }
    throw error;
  }
}

async function readRequestBytes(request: Request, maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.byteLength;
    if (totalBytes > maxBytes) {
      throw new InvalidOrganizationLogoRequestError("The uploaded logo exceeds the approved size.", {
        field: "content",
        reason: "logo_too_large",
      });
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

function handleErrors(error: unknown, _request: Request, response: Response, next: NextFunction): void {
  if (error instanceof OrganizationLogoError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

export function createRootOrganizationBrandingReferencesRouter(
  service: OrganizationBrandingReferencesService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router({ mergeParams: true });
  const requireManage = createRequireRootCapability(capabilityChecker, "organization.root.logo.manage", {
    platformSecurityRepository,
  });

  function actor(request: Request): OrganizationLogoActorInput {
    const session = getRequiredRootSessionContext(request);
    return {
      actorType: "root-user",
      actorId: session.rootUserId,
      authPrincipalId: session.authPrincipalId,
    };
  }

  router.post("/:organizationId/logo/upload-intents", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const body = parseOrThrow(createLogoUploadIntentBodySchema, request.body);
      response.status(201).json(await service.createLogoUploadIntent({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.post("/:organizationId/logo/assets/:assetId/upload-bytes", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema.extend({ assetId: organizationParamsSchema.shape.organizationId }), request.params);
      const query = parseOrThrow(uploadLogoBytesQuerySchema, request.query);
      const contentType = request.header("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
      const content = await readRequestBytes(request, 5 * 1024 * 1024);
      response.status(200).json(
        await service.uploadLogoBytes({
          tenantId: params.tenantId,
          organizationId: params.organizationId,
          assetId: params.assetId,
          uploadIntentId: query.uploadIntentId,
          content,
          contentType,
          ...actor(request),
        }),
      );
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.post("/:organizationId/logo/assets/:assetId/complete", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema.extend({ assetId: organizationParamsSchema.shape.organizationId }), request.params);
      const body = parseOrThrow(completeLogoUploadBodySchema, request.body);
      response.status(200).json(
        await service.completeLogoUpload({
          tenantId: params.tenantId,
          organizationId: params.organizationId,
          assetId: params.assetId,
          ...body,
          ...actor(request),
        }),
      );
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/:organizationId/logo", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      response.status(200).json(await service.getPrimaryLogo(params));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.put("/:organizationId/logo", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      const body = parseOrThrow(replaceLogoBodySchema, request.body);
      response.status(200).json(await service.replacePrimaryLogo({ ...params, ...body, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.delete("/:organizationId/logo", requireManage, async (request, response, next) => {
    try {
      const params = parseOrThrow(tenantOrganizationParamsSchema, request.params);
      response.status(200).json(await service.deletePrimaryLogo({ ...params, ...actor(request) }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  return router;
}

export function createTenantOrganizationBrandingReferencesRouter(
  sessionLookupRepository: TenantAuthSessionLookupRepository,
  service: OrganizationBrandingReferencesService,
): Router {
  const router = Router();
  router.use(createRequireTenantSession(sessionLookupRepository));

  function context(request: Request): { tenantId: string } & OrganizationLogoActorInput {
    const session = getRequiredTenantSessionContext(request);
    if (!session.activeTenantId) {
      throw new InvalidOrganizationLogoRequestError("A current tenant selection is required.", {
        reason: "current_tenant_required",
      });
    }
    return {
      tenantId: session.activeTenantId,
      actorType: "tenant-admin",
      actorId: session.authPrincipalId,
      authPrincipalId: session.authPrincipalId,
    };
  }

  router.post("/:organizationId/logo/upload-intents", async (request, response, next) => {
    try {
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const body = parseOrThrow(createLogoUploadIntentBodySchema, request.body);
      response.status(201).json(await service.createLogoUploadIntent({ ...context(request), ...params, ...body }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.post("/:organizationId/logo/assets/:assetId/upload-bytes", async (request, response, next) => {
    try {
      const params = parseOrThrow(organizationParamsSchema.extend({ assetId: organizationParamsSchema.shape.organizationId }), request.params);
      const query = parseOrThrow(uploadLogoBytesQuerySchema, request.query);
      const contentType = request.header("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
      const content = await readRequestBytes(request, 5 * 1024 * 1024);
      response.status(200).json(
        await service.uploadLogoBytes({
          ...context(request),
          organizationId: params.organizationId,
          assetId: params.assetId,
          uploadIntentId: query.uploadIntentId,
          content,
          contentType,
        }),
      );
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.post("/:organizationId/logo/assets/:assetId/complete", async (request, response, next) => {
    try {
      const params = parseOrThrow(organizationParamsSchema.extend({ assetId: organizationParamsSchema.shape.organizationId }), request.params);
      const body = parseOrThrow(completeLogoUploadBodySchema, request.body);
      response.status(200).json(
        await service.completeLogoUpload({
          ...context(request),
          organizationId: params.organizationId,
          assetId: params.assetId,
          ...body,
        }),
      );
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.get("/:organizationId/logo", async (request, response, next) => {
    try {
      const params = parseOrThrow(organizationParamsSchema, request.params);
      response.status(200).json(await service.getPrimaryLogo({ tenantId: context(request).tenantId, ...params }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.put("/:organizationId/logo", async (request, response, next) => {
    try {
      const params = parseOrThrow(organizationParamsSchema, request.params);
      const body = parseOrThrow(replaceLogoBodySchema, request.body);
      response.status(200).json(await service.replacePrimaryLogo({ ...context(request), ...params, ...body }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  router.delete("/:organizationId/logo", async (request, response, next) => {
    try {
      const params = parseOrThrow(organizationParamsSchema, request.params);
      response.status(200).json(await service.deletePrimaryLogo({ ...context(request), ...params }));
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });

  return router;
}

export function createPublicOrganizationBrandingReferencesRouter(
  service: OrganizationBrandingReferencesService,
): Router {
  const router = Router();
  router.get("/organizations/:organizationId/logos/:logoType", async (request, response, next) => {
    try {
      const params = parseOrThrow(publicLogoParamsSchema, request.params);
      const delivery = await service.readPublicPrimaryLogo(params.organizationId);
      for (const [name, value] of Object.entries(delivery.headers)) {
        response.setHeader(name, value);
      }
      delivery.stream?.pipe(response);
    } catch (error) {
      handleErrors(error, request, response, next);
    }
  });
  return router;
}

