import { z } from "zod";

const uuidSchema = z.string().uuid();
const emailSchema = z.string().email().transform((value: string) => value.trim().toLowerCase());
const optionalNameSchema = z
  .string()
  .trim()
  .min(1, "Must not be empty")
  .max(255)
  .nullable()
  .optional();

const statusSchema = z.enum(["active", "inactive"]);
const isoTimestampSchema = z.string().datetime({ offset: true });

const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");

const prefixSchema = z
  .string()
  .trim()
  .min(3, "Prefix filters must be at least 3 characters")
  .optional();

export const createRootUserBodySchema = z.object({
  email: emailSchema,
  firstName: optionalNameSchema,
  lastName: optionalNameSchema,
  status: statusSchema.default("active"),
});

export const getRootUserParamsSchema = z.object({
  rootUserId: uuidSchema,
});

export const getRootUserByEmailQuerySchema = z.object({
  email: emailSchema,
});

export const listRootUsersQuerySchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z
    .enum([
      "email",
      "firstName",
      "lastName",
      "status",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ])
    .default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema,
  firstNamePrefix: prefixSchema,
  lastNamePrefix: prefixSchema,
  createdAtFrom: isoTimestampSchema.optional(),
  createdAtTo: isoTimestampSchema.optional(),
  updatedAtFrom: isoTimestampSchema.optional(),
  updatedAtTo: isoTimestampSchema.optional(),
  deletedAtFrom: isoTimestampSchema.optional(),
  deletedAtTo: isoTimestampSchema.optional(),
  status: statusSchema.optional(),
});

export const listActiveRootUsersQuerySchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z
    .enum(["email", "firstName", "lastName", "createdAt", "updatedAt"])
    .default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema,
  firstNamePrefix: prefixSchema,
  lastNamePrefix: prefixSchema,
  createdAtFrom: isoTimestampSchema.optional(),
  createdAtTo: isoTimestampSchema.optional(),
  updatedAtFrom: isoTimestampSchema.optional(),
  updatedAtTo: isoTimestampSchema.optional(),
});

export const listDeletedRootUsersQuerySchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z
    .enum([
      "email",
      "firstName",
      "lastName",
      "status",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ])
    .default("updatedAt"),
  orderDirection: orderDirectionSchema,
  emailPrefix: prefixSchema,
  firstNamePrefix: prefixSchema,
  lastNamePrefix: prefixSchema,
  createdAtFrom: isoTimestampSchema.optional(),
  createdAtTo: isoTimestampSchema.optional(),
  updatedAtFrom: isoTimestampSchema.optional(),
  updatedAtTo: isoTimestampSchema.optional(),
  deletedAtFrom: isoTimestampSchema.optional(),
  deletedAtTo: isoTimestampSchema.optional(),
  excludeAnonymized: z
    .preprocess((value: unknown) => {
      if (value === undefined) return false;
      if (value === "true" || value === true) return true;
      if (value === "false" || value === false) return false;
      return value;
    }, z.boolean())
    .default(false),
});

export const updateRootUserBodySchema = z
  .object({
    email: emailSchema.optional(),
    firstName: optionalNameSchema,
    lastName: optionalNameSchema,
    status: statusSchema.optional(),
  })
  .refine((value: Record<string, unknown>) => Object.keys(value).length > 0, {
    message: "At least one updatable field must be provided.",
  });

export type CreateRootUserBody = z.infer<typeof createRootUserBodySchema>;
export type GetRootUserParams = z.infer<typeof getRootUserParamsSchema>;
export type GetRootUserByEmailQuery = z.infer<typeof getRootUserByEmailQuerySchema>;
export type ListRootUsersQuery = z.infer<typeof listRootUsersQuerySchema>;
export type ListActiveRootUsersQuery = z.infer<typeof listActiveRootUsersQuerySchema>;
export type ListDeletedRootUsersQuery = z.infer<typeof listDeletedRootUsersQuerySchema>;
export type UpdateRootUserBody = z.infer<typeof updateRootUserBodySchema>;
