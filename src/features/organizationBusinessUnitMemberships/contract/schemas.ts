import { z } from "zod";

const uuid = z.string().uuid();

export const tenantMembershipUnitParamsSchema = z.object({
  tenantId: uuid,
  organizationId: uuid,
  businessUnitId: uuid,
}).strict();

export const membershipUnitParamsSchema = z.object({
  organizationId: uuid,
  businessUnitId: uuid,
}).strict();

export const tenantMembershipParamsSchema = tenantMembershipUnitParamsSchema.extend({
  membershipId: uuid,
}).strict();

export const membershipParamsSchema = membershipUnitParamsSchema.extend({
  membershipId: uuid,
}).strict();

export const listMembershipsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  orderBy: z.enum(["createdAt", "updatedAt", "membershipRole"]).default("updatedAt"),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
  includeArchived: z.coerce.boolean().default(false),
  lifecycleStatus: z.enum(["active", "archived"]).optional(),
}).strict();

export const createMembershipBodySchema = z.object({
  memberType: z.enum(["individual", "business_unit"]),
  individualUserId: uuid.nullable().optional(),
  memberBusinessUnitId: uuid.nullable().optional(),
  membershipRole: z.enum(["owner", "manager", "member", "viewer"]),
}).strict();

export const updateMembershipBodySchema = createMembershipBodySchema.partial().strict();
