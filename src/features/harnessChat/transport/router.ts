import { Router, type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";
import { getRequiredRootSessionContext } from "../../../lib/auth/requestContext";
import {
  createRequireRootCapability,
  type RootCapabilityChecker,
} from "../../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";
import {
  appendMessageBodySchema,
  conversationParamsSchema,
  createConversationBodySchema,
  generatePacketBodySchema,
  listConversationsQuerySchema,
  packetRevisionParamsSchema,
  readConversationQuerySchema,
} from "../contract/schemas";
import { HarnessChatError, HarnessChatInvalidRequestError } from "../contract/errors";
import type { createHarnessChatService } from "../domain/service";

type HarnessChatService = ReturnType<typeof createHarnessChatService>;

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      if (issue?.code === "unrecognized_keys" && issue.keys[0]) {
        throw new HarnessChatInvalidRequestError({
          field: issue.keys[0],
          reason: "unexpected_field",
        });
      }
      throw new HarnessChatInvalidRequestError(
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

export function createHarnessChatRouter(
  service: HarnessChatService,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository?: PlatformSecurityRepository,
): Router {
  const router = Router();
  const authzOptions = { platformSecurityRepository };
  const requireCreate = createRequireRootCapability(
    capabilityChecker,
    "harness-chat.root.conversation.create",
    authzOptions,
  );
  const requireRead = createRequireRootCapability(
    capabilityChecker,
    "harness-chat.root.conversation.read",
    authzOptions,
  );
  const requireAppend = createRequireRootCapability(
    capabilityChecker,
    "harness-chat.root.message.append",
    authzOptions,
  );
  const requireGenerate = createRequireRootCapability(
    capabilityChecker,
    "harness-chat.root.packet.generate",
    authzOptions,
  );
  const requireDownload = createRequireRootCapability(
    capabilityChecker,
    "harness-chat.root.packet.downloadPdf",
    authzOptions,
  );

  router.post("/conversations", requireCreate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const body = parseOrThrow(createConversationBodySchema, request.body);
      response.status(201).json(await service.createConversation({
        rootUserId: session.rootUserId,
        initialMessage: body.initialMessage,
        surfaceContext: body.surfaceContext,
        clientContext: body.clientContext,
      }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/conversations", requireRead, async (request, response, next) => {
    try {
      response.status(200).json(
        await service.listConversations(parseOrThrow(listConversationsQuerySchema, request.query)),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/conversations/:conversationId", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(conversationParamsSchema, request.params);
      const query = parseOrThrow(readConversationQuerySchema, request.query);
      response.status(200).json(await service.readConversation({
        conversationId: params.conversationId,
        includeMessages: query.includeMessages,
      }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/conversations/:conversationId/messages", requireAppend, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const params = parseOrThrow(conversationParamsSchema, request.params);
      const body = parseOrThrow(appendMessageBodySchema, request.body);
      response.status(201).json(await service.appendMessage({
        conversationId: params.conversationId,
        rootUserId: session.rootUserId,
        message: body.message,
      }));
    } catch (error) {
      next(error);
    }
  });

  router.post("/conversations/:conversationId/packet-generations", requireGenerate, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const params = parseOrThrow(conversationParamsSchema, request.params);
      parseOrThrow(generatePacketBodySchema, request.body);
      response.status(201).json(await service.generatePacket({
        conversationId: params.conversationId,
        rootUserId: session.rootUserId,
      }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/conversations/:conversationId/packet-revisions", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(conversationParamsSchema, request.params);
      response.status(200).json(await service.listPacketRevisions(params.conversationId));
    } catch (error) {
      next(error);
    }
  });

  router.get("/packet-revisions/:packetRevisionId", requireRead, async (request, response, next) => {
    try {
      const params = parseOrThrow(packetRevisionParamsSchema, request.params);
      response.status(200).json(await service.readPacketRevision(params.packetRevisionId));
    } catch (error) {
      next(error);
    }
  });

  router.get("/packet-revisions/:packetRevisionId/pdf", requireDownload, async (request, response, next) => {
    try {
      const session = getRequiredRootSessionContext(request);
      const params = parseOrThrow(packetRevisionParamsSchema, request.params);
      const pdf = await service.renderPacketPdf(params.packetRevisionId, session.rootUserId);
      response.status(200).type("application/pdf").send(pdf);
    } catch (error) {
      next(error);
    }
  });

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof HarnessChatError) {
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
