import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const isoDateTimeSchema = z.string().datetime({ offset: true });
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const entityStatusSchema = z.enum(["draft", "active", "superseded", "archived"]);
const entityScopeSchema = z.enum(["root", "tenant", "shared-cross-tenant"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const createEntityBodySchema = strictObject({
  name: trimmedNonEmptyString,
  description: trimmedNonEmptyString,
  featureName: trimmedNonEmptyString,
  entityKey: trimmedNonEmptyString.optional(),
  tableName: trimmedNonEmptyString.optional(),
  idField: trimmedNonEmptyString.optional(),
  idColumn: trimmedNonEmptyString.optional(),
  scope: entityScopeSchema,
  routeBase: trimmedNonEmptyString.optional(),
  sharedCrossTenantApproved: z.boolean().optional(),
  status: entityStatusSchema.default("draft"),
});

export const getEntityParamsSchema = strictObject({
  entityId: uuidSchema,
});

export const getEntityQuerySchema = strictObject({
  includeArchived: z.coerce.boolean().default(false),
});

export const listEntitiesQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["name", "status", "createdAt", "updatedAt", "archivedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  namePrefix: z.string().trim().min(1).optional(),
  status: entityStatusSchema.optional(),
  includeArchived: z.coerce.boolean().default(false),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
});

export const updateEntityParamsSchema = getEntityParamsSchema;
export const deleteEntityParamsSchema = getEntityParamsSchema;

export const updateEntityBodySchema = strictObject({
  name: trimmedNonEmptyString.optional(),
  description: trimmedNonEmptyString.optional(),
  featureName: trimmedNonEmptyString.optional(),
  entityKey: trimmedNonEmptyString.optional(),
  tableName: trimmedNonEmptyString.optional(),
  idField: trimmedNonEmptyString.optional(),
  idColumn: trimmedNonEmptyString.optional(),
  scope: entityScopeSchema.optional(),
  routeBase: trimmedNonEmptyString.optional(),
  sharedCrossTenantApproved: z.boolean().optional(),
  status: entityStatusSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
}).refine((value) => Object.keys(value).some((key) => key !== "sharedCrossTenantApproved"), {
  message: "At least one persisted field must be supplied.",
});
