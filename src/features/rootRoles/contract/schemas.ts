import { z } from "zod";

const uuidSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID.",
);
const trimmedNonEmptyString = z.string().trim().min(1);
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const rootRoleIdParamsSchema = strictObject({ rootRoleId: uuidSchema });
export const rootUserIdParamsSchema = strictObject({ rootUserId: uuidSchema });
export const rootRoleAssignmentParamsSchema = strictObject({
  rootUserId: uuidSchema,
  rootRoleAssignmentId: uuidSchema,
});

export const createRootRoleBodySchema = strictObject({
  roleKey: trimmedNonEmptyString,
  displayName: trimmedNonEmptyString,
  description: trimmedNonEmptyString,
});

export const updateRootRoleBodySchema = strictObject({
  displayName: trimmedNonEmptyString.optional(),
  description: trimmedNonEmptyString.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const listRootRolesQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  includeInactive: z.coerce.boolean().default(false),
});

export const listCapabilityAssignmentsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
});

export const assignRootRoleBodySchema = strictObject({
  rootRoleId: uuidSchema,
  reason: trimmedNonEmptyString.optional(),
});

export const unassignRootRoleBodySchema = strictObject({
  reason: trimmedNonEmptyString.optional(),
});

export const replaceRootRoleAssignmentBodySchema = strictObject({
  sourceRootRoleAssignmentId: uuidSchema.optional(),
  sourceRootRoleId: uuidSchema.optional(),
  targetRootRoleId: uuidSchema,
  reason: trimmedNonEmptyString.optional(),
}).refine(
  (value) => Boolean(value.sourceRootRoleAssignmentId || value.sourceRootRoleId),
  {
    message: "A source assignment or source role must be supplied.",
    path: ["sourceRootRoleAssignmentId"],
  },
);

export const updateCapabilityGrantsBodySchema = strictObject({
  capabilityKeys: z.array(trimmedNonEmptyString).default([]),
  reason: trimmedNonEmptyString.optional(),
});

export const listRootUserAssignmentsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
});
