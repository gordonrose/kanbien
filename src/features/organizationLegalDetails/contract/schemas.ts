import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const optionalTrimmedString = z.string().trim().min(1).nullable().optional();
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const lifecycleStatusSchema = z.enum(["active", "archived"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const tenantOrganizationLegalProfileParamsSchema = strictObject({
  tenantId: uuidSchema,
  organizationId: uuidSchema,
  legalProfileId: uuidSchema,
});

export const tenantOrganizationParamsSchema = strictObject({
  tenantId: uuidSchema,
  organizationId: uuidSchema,
});

export const organizationLegalProfileParamsSchema = strictObject({
  organizationId: uuidSchema,
  legalProfileId: uuidSchema,
});

export const organizationParamsSchema = strictObject({
  organizationId: uuidSchema,
});

export const createLegalProfileBodySchema = strictObject({
  legalName: trimmedNonEmptyString,
  registrationIdentifier: optionalTrimmedString,
  taxVatNumber: optionalTrimmedString,
  registeredAddress: optionalTrimmedString,
});

export const updateLegalProfileBodySchema = strictObject({
  legalName: trimmedNonEmptyString.optional(),
  registrationIdentifier: optionalTrimmedString,
  taxVatNumber: optionalTrimmedString,
  registeredAddress: optionalTrimmedString,
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const listLegalProfilesQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["legalName", "createdAt", "updatedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  lifecycleStatus: lifecycleStatusSchema.optional(),
  includeArchived: z.coerce.boolean().default(false),
});
