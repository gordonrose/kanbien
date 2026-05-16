import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const isoDateTimeSchema = z.string().datetime({ offset: true });
const prefixSchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const lifecycleStatusSchema = z.enum(["active", "archived"]);
const nullableUuidSchema = uuidSchema.nullable();
const optionalNullableUuidSchema = uuidSchema.nullable().optional();
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const tenantIdParamsSchema = strictObject({ tenantId: uuidSchema });
export const organizationIdParamsSchema = strictObject({ organizationId: uuidSchema });
export const tenantOrganizationIdParamsSchema = strictObject({
  tenantId: uuidSchema,
  organizationId: uuidSchema,
});

export const createOrganizationBodySchema = strictObject({
  parentOrganizationId: optionalNullableUuidSchema,
  name: trimmedNonEmptyString,
  organizationTypeReferenceValueId: optionalNullableUuidSchema,
});

export const listOrganizationsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["name", "createdAt", "updatedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  namePrefix: prefixSchema.optional(),
  parentOrganizationId: nullableUuidSchema.optional(),
  lifecycleStatus: lifecycleStatusSchema.optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
});

export const updateOrganizationBodySchema = strictObject({
  name: trimmedNonEmptyString.optional(),
  organizationTypeReferenceValueId: optionalNullableUuidSchema,
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const moveOrganizationBodySchema = strictObject({
  parentOrganizationId: nullableUuidSchema,
});

export const archiveOrganizationBodySchema = z.discriminatedUnion("childHandling", [
  strictObject({
    childHandling: z.literal("archiveBranch"),
  }),
  strictObject({
    childHandling: z.literal("moveChildren"),
    replacementParentOrganizationId: uuidSchema,
  }),
]);
