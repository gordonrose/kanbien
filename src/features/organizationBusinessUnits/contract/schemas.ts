import { z } from "zod";

const uuid = z.string().uuid();

export const tenantOrganizationParamsSchema = z.object({
  tenantId: uuid,
  organizationId: uuid,
}).strict();

export const organizationParamsSchema = z.object({
  organizationId: uuid,
}).strict();

export const tenantBusinessUnitParamsSchema = tenantOrganizationParamsSchema.extend({
  businessUnitId: uuid,
}).strict();

export const businessUnitParamsSchema = organizationParamsSchema.extend({
  businessUnitId: uuid,
}).strict();

export const listBusinessUnitsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  orderBy: z.enum(["name", "createdAt", "updatedAt"]).default("updatedAt"),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
  includeArchived: z.coerce.boolean().default(false),
  lifecycleStatus: z.enum(["active", "archived"]).optional(),
  parentBusinessUnitId: uuid.nullable().optional(),
}).strict();

export const createBusinessUnitBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  parentBusinessUnitId: uuid.nullable().optional(),
}).strict();

export const updateBusinessUnitBodySchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
}).strict();

export const moveBusinessUnitBodySchema = z.object({
  parentBusinessUnitId: uuid.nullable(),
}).strict();

export const archiveBusinessUnitBodySchema = z.object({
  childHandling: z.enum(["archiveBranch", "moveChildren"]),
  replacementParentBusinessUnitId: uuid.nullable().optional(),
}).strict();
