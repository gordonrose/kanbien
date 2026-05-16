import { z } from "zod";

const uuidSchema = z.string().uuid();
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const tenantIdParamsSchema = strictObject({
  tenantId: uuidSchema,
});

export const organizationSearchResultTypeSchema = z.enum([
  "organizations",
  "legalProfiles",
  "locations",
  "weeklyOpeningHours",
  "openingHourExceptions",
  "businessUnits",
  "memberships",
  "referenceValues",
  "brandingLogoReferences",
]);

export const organizationSearchQuerySchema = strictObject({
  q: z.string().trim().min(1).optional(),
  resultType: organizationSearchResultTypeSchema.optional(),
  organizationId: uuidSchema.optional(),
  lifecycleStatus: z.enum(["active", "archived"]).default("active"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  orderBy: z.enum(["name", "updatedAt", "createdAt", "resultType"]).default("updatedAt"),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
});

