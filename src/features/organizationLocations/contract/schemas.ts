import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const optionalTrimmedString = z.string().trim().min(1).nullable().optional();
const optionalLatitudeSchema = z.coerce.number().min(-90).max(90).nullable().optional();
const optionalLongitudeSchema = z.coerce.number().min(-180).max(180).nullable().optional();
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const orderDirectionSchema = z.enum(["asc", "desc"]).default("desc");
const lifecycleStatusSchema = z.enum(["active", "archived"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const tenantOrganizationLocationParamsSchema = strictObject({
  tenantId: uuidSchema,
  organizationId: uuidSchema,
  locationId: uuidSchema,
});

export const tenantOrganizationParamsSchema = strictObject({
  tenantId: uuidSchema,
  organizationId: uuidSchema,
});

export const organizationLocationParamsSchema = strictObject({
  organizationId: uuidSchema,
  locationId: uuidSchema,
});

export const organizationParamsSchema = strictObject({
  organizationId: uuidSchema,
});

export const createLocationBodySchema = strictObject({
  locationName: trimmedNonEmptyString,
  addressSummary: optionalTrimmedString,
  latitude: optionalLatitudeSchema,
  longitude: optionalLongitudeSchema,
  isHeadOffice: z.boolean().default(false),
  isRegisteredOffice: z.boolean().default(false),
}).refine((value) => !("latitude" in value) || "longitude" in value, {
  message: "Longitude must be supplied with latitude.",
  path: ["longitude"],
}).refine((value) => !("longitude" in value) || "latitude" in value, {
  message: "Latitude must be supplied with longitude.",
  path: ["latitude"],
});

export const updateLocationBodySchema = strictObject({
  locationName: trimmedNonEmptyString.optional(),
  addressSummary: optionalTrimmedString,
  latitude: optionalLatitudeSchema,
  longitude: optionalLongitudeSchema,
  isHeadOffice: z.boolean().optional(),
  isRegisteredOffice: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
}).refine((value) => !("latitude" in value) || "longitude" in value, {
  message: "Longitude must be supplied with latitude.",
  path: ["longitude"],
}).refine((value) => !("longitude" in value) || "latitude" in value, {
  message: "Latitude must be supplied with longitude.",
  path: ["latitude"],
});

export const listLocationsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  orderBy: z.enum(["locationName", "createdAt", "updatedAt"]).default("updatedAt"),
  orderDirection: orderDirectionSchema,
  lifecycleStatus: lifecycleStatusSchema.optional(),
  includeArchived: z.coerce.boolean().default(false),
});
