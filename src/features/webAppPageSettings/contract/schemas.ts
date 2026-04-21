import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const rootFamilyIdSchema = z.enum(["root-admin", "login", "design-system"]);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const webAppPageIdParamsSchema = strictObject({
  webAppPageId: uuidSchema,
});

export const webAppPageContextNavProjectionParamsSchema = strictObject({
  rootFamilyId: rootFamilyIdSchema,
  pageKey: trimmedNonEmptyString,
});

export const getWebAppPageSettingsOptionsQuerySchema = strictObject({
  webAppPageId: uuidSchema,
});

export const updateWebAppPageSettingsBodySchema = strictObject({
  iconKey: z.union([trimmedNonEmptyString, z.null()]).optional(),
  showInTopNav: z.coerce.boolean().optional(),
  topNavOrder: z.union([z.coerce.number().int().min(0), z.null()]).optional(),
  pageTemplateKey: z.union([trimmedNonEmptyString, z.null()]).optional(),
  contextNavTargetPageIds: z.array(uuidSchema).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});
