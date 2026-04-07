import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const normalizedBizIdSchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const isoDateTimeSchema = z.string().datetime({ offset: true });
const prefixSchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const categorySchema = z.enum(["customer", "demo", "test"]);
const statusSchema = z.enum(["draft", "live", "disabled", "inactive"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const createTenantBodySchema = strictObject({
  bizId: normalizedBizIdSchema,
  name: trimmedNonEmptyString,
  category: categorySchema,
  status: statusSchema.optional(),
});

export const tenantIdParamsSchema = strictObject({ tenantId: uuidSchema });

export const listTenantsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z
    .enum(["bizId", "name", "category", "status", "createdAt", "updatedAt"])
    .default("updatedAt"),
  orderDirection: orderDirectionSchema,
  bizIdPrefix: prefixSchema.optional(),
  namePrefix: prefixSchema.optional(),
  category: categorySchema.optional(),
  status: statusSchema.optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
});

export const listDeletedTenantsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z
    .enum(["bizId", "name", "category", "status", "createdAt", "updatedAt", "deletedAt"])
    .default("updatedAt"),
  orderDirection: orderDirectionSchema,
  bizIdPrefix: prefixSchema.optional(),
  namePrefix: prefixSchema.optional(),
  category: categorySchema.optional(),
  status: statusSchema.optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
  deletedAtFrom: isoDateTimeSchema.optional(),
  deletedAtTo: isoDateTimeSchema.optional(),
});

export const updateTenantBodySchema = strictObject({
  name: trimmedNonEmptyString.optional(),
  category: categorySchema.optional(),
  status: statusSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const removeTenantBodySchema = strictObject({
  confirm: z.literal(true),
  reason: trimmedNonEmptyString,
});
