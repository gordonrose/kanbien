import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  assetIdParamsSchema,
  cleanupExpiredUploadsBodySchema,
  completeUploadBodySchema,
  createUploadIntentBodySchema,
} from "../contract/schemas";
import { AssetError, InvalidAssetRequestError } from "../contract/errors";
import type { AssetsService } from "../domain/service";
import type { AssetActorContext } from "../domain/types";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new InvalidAssetRequestError(undefined, {
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new InvalidAssetRequestError(
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

function rootActorFromRequest(request: Request): AssetActorContext {
  const session = getRequiredRootSessionContext(request);
  return {
    actorType: "root",
    actorId: session.rootUserId,
    authPrincipalId: session.authPrincipalId,
  };
}

async function recordAssetAuditEvent(
  platformSecurityRepository: PlatformSecurityRepository | undefined,
  request: Request,
  eventType: string,
  eventOutcome: "success" | "failure",
): Promise<void> {
  if (!platformSecurityRepository || !request.rootSession) {
    return;
  }
  await platformSecurityRepository.createSecurityAuditEvent({
    eventId: randomUUID(),
    authPrincipalId: request.rootSession.authPrincipalId,
    rootUserId: request.rootSession.rootUserId,
    eventType,
    eventOutcome,
    ipAddress: request.ip,
    userAgent: request.header("user-agent") ?? undefined,
    occurredAt: new Date(),
  });
}

function handleAssetError(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (error instanceof AssetError) {
    response.status(error.status).json({
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  next(error);
}

export function createAssetsRouter(
  service: AssetsService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(capabilityChecker, "asset.create", authzOptions);
  const requireRead = createRequireRootCapability(capabilityChecker, "asset.read", authzOptions);
  const requireContentRead = createRequireRootCapability(
    capabilityChecker,
    "asset.content.read",
    authzOptions,
  );
  const requireDelete = createRequireRootCapability(capabilityChecker, "asset.delete", authzOptions);
  const requireCleanup = createRequireRootCapability(
    capabilityChecker,
    "asset.cleanup",
    authzOptions,
  );

  router.post("/upload-intents", requireCreate, async (request, response, next) => {
    try {
      const body = parseOrThrow(createUploadIntentBodySchema, request.body);
      const result = await service.createUploadIntent({
          actor: rootActorFromRequest(request),
          scope: {
            scopeType: body.scopeType,
            tenantId: body.tenantId ?? null,
          },
          kind: body.kind,
          contentType: body.contentType,
          byteSize: body.byteSize,
          visibility: body.visibility,
          originalFilename: body.originalFilename,
          expectedChecksumSha256: body.expectedChecksumSha256,
          piiPosture: body.piiPosture,
        });
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        "asset_upload_intent_created",
        "success",
      );
      response.status(201).json(result);
    } catch (error) {
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        "asset_upload_intent_create_failed",
        "failure",
      );
      handleAssetError(error, request, response, next);
    }
  });

  router.post("/:assetId/complete", requireCreate, async (request, response, next) => {
    try {
      const params = parseOrThrow(assetIdParamsSchema, request.params);
      const body = parseOrThrow(completeUploadBodySchema, request.body);
      const result = await service.completeUpload({
          actor: rootActorFromRequest(request),
          assetId: params.assetId,
          uploadIntentId: body.uploadIntentId,
          checksumSha256: body.checksumSha256,
        });
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        "asset_upload_completed",
        "success",
      );
      response.status(200).json(result);
    } catch (error) {
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        error instanceof AssetError && error.code === "ASSET_STORAGE_VERIFICATION_FAILED"
          ? "asset_upload_completion_mismatch"
          : "asset_upload_completion_failed",
        "failure",
      );
      handleAssetError(error, request, response, next);
    }
  });

  router.get("/:assetId", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(assetIdParamsSchema, request.params);
      response.status(200).json(
        await service.readAssetMetadata({
          actor: rootActorFromRequest(request),
          assetId: params.assetId,
        }),
      );
    } catch (error) {
      handleAssetError(error, request, response, next);
    }
  });

  router.get("/:assetId/content", requireContentRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(assetIdParamsSchema, request.params);
      const content = await service.readAssetContent({
        actor: rootActorFromRequest(request),
        assetId: params.assetId,
      });
      for (const [name, value] of Object.entries(content.headers)) {
        response.setHeader(name, value);
      }
      content.stream.pipe(response);
    } catch (error) {
      handleAssetError(error, request, response, next);
    }
  });

  router.post("/:assetId/delete", requireDelete, async (request, response, next) => {
    try {
      const params = parseOrThrow(assetIdParamsSchema, request.params);
      const result = await service.deleteAsset({
          actor: rootActorFromRequest(request),
          assetId: params.assetId,
        });
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        "asset_deleted",
        "success",
      );
      response.status(200).json(result);
    } catch (error) {
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        "asset_delete_failed",
        "failure",
      );
      handleAssetError(error, request, response, next);
    }
  });

  router.post("/internal/cleanup-expired-uploads", requireCleanup, async (request, response, next) => {
    try {
      const body = parseOrThrow(cleanupExpiredUploadsBodySchema, request.body);
      const result = await service.cleanupExpiredUploads(body);
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        result.failedDeletes > 0 ? "asset_cleanup_failed_delete" : "asset_cleanup_ran",
        result.failedDeletes > 0 ? "failure" : "success",
      );
      response.status(200).json(result);
    } catch (error) {
      await recordAssetAuditEvent(
        platformSecurityRepository,
        request,
        "asset_cleanup_failed",
        "failure",
      );
      handleAssetError(error, request, response, next);
    }
  });

  return router;
}
