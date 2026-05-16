import { z } from "zod";

const uuid = z.string().uuid();
const nonEmptyTrimmed = z.string().trim().min(1);

export const referenceValueParamsSchema = z.object({
  referenceValueId: uuid,
}).strict();

export const listReferenceValuesQuerySchema = z.object({
  referenceType: nonEmptyTrimmed.optional(),
  lifecycleStatus: z.enum(["active", "archived", "deprecated", "replaced"]).optional(),
  includeRetained: z.coerce.boolean().default(false),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  orderBy: z.enum(["label", "referenceType", "createdAt", "updatedAt"]).default("label"),
  orderDirection: z.enum(["asc", "desc"]).default("asc"),
}).strict();

export const createReferenceValueBodySchema = z.object({
  referenceType: nonEmptyTrimmed,
  referenceValueKey: nonEmptyTrimmed,
  label: nonEmptyTrimmed,
}).strict();

export const updateReferenceValueBodySchema = z.object({
  label: nonEmptyTrimmed,
}).strict();

export const replaceReferenceValueBodySchema = z.object({
  replacementReferenceValueId: uuid,
}).strict();
