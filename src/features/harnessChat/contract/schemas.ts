import { z } from "zod";

const jsonObjectSchema = z.record(z.string(), z.unknown());
const uuidSchema = z.string().uuid();
const queryBooleanSchema = z.preprocess((value) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === "true" || value === true) {
    return true;
  }
  if (value === "false" || value === false) {
    return false;
  }
  return value;
}, z.boolean().default(true));

export const createConversationBodySchema = z.object({
  sourceChannel: z.literal("app"),
  initialMessage: z.string().trim().min(1).optional(),
  surfaceContext: jsonObjectSchema.optional(),
  clientContext: jsonObjectSchema.optional(),
}).strict();

export const listConversationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  state: z.enum(["draft", "active", "packet-ready", "abandoned", "closed"]).optional(),
}).strict();

export const conversationParamsSchema = z.object({
  conversationId: uuidSchema,
}).strict();

export const packetRevisionParamsSchema = z.object({
  packetRevisionId: uuidSchema,
}).strict();

export const readConversationQuerySchema = z.object({
  includeMessages: queryBooleanSchema,
}).strict();

export const appendMessageBodySchema = z.object({
  message: z.string().trim().min(1),
  surfaceContext: jsonObjectSchema.optional(),
  clientContext: jsonObjectSchema.optional(),
}).strict();

export const generatePacketBodySchema = z.object({
  reason: z.enum(["user-requested", "readiness-gate"]).optional(),
}).strict();
