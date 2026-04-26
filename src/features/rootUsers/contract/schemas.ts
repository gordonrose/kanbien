import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const normalizedEmailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const nullableTrimmedNonEmptyString = z.string().trim().min(1).nullable();
const isoDateTimeSchema = z.string().datetime({ offset: true });
const prefixSchema = z.string().trim().min(3);
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const statusSchema = z.enum(["active", "inactive"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const createRootUserBodySchema = strictObject({
  email: normalizedEmailSchema,
  firstName: trimmedNonEmptyString.optional(),
  lastName: trimmedNonEmptyString.optional(),
  profilePictureAssetId: uuidSchema.nullable().optional(),
  profilePictureAltText: nullableTrimmedNonEmptyString.optional(),
  profilePictureDecorative: z.boolean().optional(),
});

export const getRootUserParamsSchema = strictObject({ rootUserId: uuidSchema });
export const getRootUserByEmailQuerySchema = strictObject({ email: normalizedEmailSchema });

export const listRootUsersQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["email", "firstName", "lastName", "status", "createdAt", "updatedAt", "deletedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema.optional(),
  firstNamePrefix: prefixSchema.optional(),
  lastNamePrefix: prefixSchema.optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
  deletedAtFrom: isoDateTimeSchema.optional(),
  deletedAtTo: isoDateTimeSchema.optional(),
  status: statusSchema.optional(),
});

export const listActiveRootUsersQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["email", "firstName", "lastName", "createdAt", "updatedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema.optional(),
  firstNamePrefix: prefixSchema.optional(),
  lastNamePrefix: prefixSchema.optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
});

export const updateRootUserParamsSchema = getRootUserParamsSchema;
export const deleteRootUserParamsSchema = getRootUserParamsSchema;
export const removeRootUserParamsSchema = getRootUserParamsSchema;
export const reActivateRootUserParamsSchema = getRootUserParamsSchema;

export const updateRootUserBodySchema = strictObject({
  email: normalizedEmailSchema.optional(),
  firstName: trimmedNonEmptyString.optional(),
  lastName: trimmedNonEmptyString.optional(),
  profilePictureAssetId: uuidSchema.nullable().optional(),
  profilePictureAltText: nullableTrimmedNonEmptyString.optional(),
  profilePictureDecorative: z.boolean().optional(),
  status: statusSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const listDeletedRootUsersQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["email", "firstName", "lastName", "status", "createdAt", "updatedAt", "deletedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema.optional(),
  firstNamePrefix: prefixSchema.optional(),
  lastNamePrefix: prefixSchema.optional(),
  createdAtFrom: isoDateTimeSchema.optional(),
  createdAtTo: isoDateTimeSchema.optional(),
  updatedAtFrom: isoDateTimeSchema.optional(),
  updatedAtTo: isoDateTimeSchema.optional(),
  deletedAtFrom: isoDateTimeSchema.optional(),
  deletedAtTo: isoDateTimeSchema.optional(),
  excludeAnonymized: z.coerce.boolean().default(false),
});
