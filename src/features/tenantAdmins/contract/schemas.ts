import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const emailSchema = z.email().transform((value) => value.trim().toLowerCase());
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const prefixSchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const isoDateTimeSchema = z.string().datetime({ offset: true });
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const tenantScopedParamsSchema = strictObject({
  tenantId: uuidSchema,
});

export const tenantAdminParamsSchema = strictObject({
  tenantId: uuidSchema,
  tenantAdminId: uuidSchema,
});

export const createTenantAdminBodySchema = strictObject({
  email: emailSchema,
  firstName: trimmedNonEmptyString.optional(),
  lastName: trimmedNonEmptyString.optional(),
});

export const listTenantAdminsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["updatedAt", "createdAt", "email", "firstName", "lastName"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema.optional(),
  firstNamePrefix: prefixSchema.optional(),
  lastNamePrefix: prefixSchema.optional(),
  emailVerificationStatus: z.enum(["pending", "verified"]).optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
});

export const updateTenantAdminBodySchema = strictObject({
  email: emailSchema.optional(),
  firstName: trimmedNonEmptyString.optional(),
  lastName: trimmedNonEmptyString.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const resendVerificationBodySchema = strictObject({
  resendReason: trimmedNonEmptyString.optional(),
});

export const redeemVerificationBodySchema = strictObject({
  token: trimmedNonEmptyString,
});
