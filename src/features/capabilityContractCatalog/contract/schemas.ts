import { z } from "zod";

const trimmedNonEmptyString = z.string().trim().min(1);
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("asc");
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const capabilityIdParamsSchema = strictObject({
  capabilityId: trimmedNonEmptyString,
});

export const listCapabilityCatalogQuerySchema = strictObject({
  featureName: trimmedNonEmptyString.optional(),
  routeFamily: trimmedNonEmptyString.optional(),
  seamType: trimmedNonEmptyString.optional(),
  capabilityBoundary: z.enum(["root", "tenant", "shared"]).optional(),
  governingAuthzCapability: trimmedNonEmptyString.optional(),
  allowedRole: trimmedNonEmptyString.optional(),
  capabilityId: trimmedNonEmptyString.optional(),
  displayLabel: trimmedNonEmptyString.optional(),
  featureNamePrefix: trimmedNonEmptyString.optional(),
  supportsRequestBody: z.coerce.boolean().optional(),
  supportsResponseFields: z.coerce.boolean().optional(),
  supportsFilters: z.coerce.boolean().optional(),
  freshnessStatus: z.enum(["fresh", "stale", "drifted", "blocked"]).optional(),
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderDirection: orderDirectionSchema,
});

export const exportCapabilityCatalogBodySchema = strictObject({
  includeFeatures: z.array(trimmedNonEmptyString).optional(),
  formatVersion: trimmedNonEmptyString.default("v1"),
  allowStale: z.boolean().optional(),
});

export const materializeCapabilityCatalogBodySchema = strictObject({
  includeFeatures: z.array(trimmedNonEmptyString).optional(),
});

export const auditCapabilityCatalogQuerySchema = strictObject({
  includeFeatures: z.array(trimmedNonEmptyString).optional(),
});
