import { z } from "zod";

const uuidSchema = z.string().uuid();
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const exportSectionSchema = z.enum([
  "organizations",
  "legalProfiles",
  "locations",
  "openingHours",
  "businessUnits",
  "memberships",
  "referenceValues",
  "branding",
  "logos",
]);

export const tenantExportParamsSchema = strictObject({
  tenantId: uuidSchema,
  exportId: uuidSchema,
});

export const tenantIdParamsSchema = strictObject({
  tenantId: uuidSchema,
});

export const exportParamsSchema = strictObject({
  exportId: uuidSchema,
});

export const createExportBodySchema = strictObject({
  sourceOrganizationId: uuidSchema,
  selectedSections: z.array(exportSectionSchema).min(1),
  visibilityScope: z.enum(["current_only", "include_retained"]).default("current_only"),
  organizationScope: z
    .enum(["selected_organization_only", "include_child_branch"])
    .default("selected_organization_only"),
});

export const retryExportBodySchema = strictObject({
  selectedSections: z.array(exportSectionSchema).min(1).optional(),
  visibilityScope: z.enum(["current_only", "include_retained"]).optional(),
  organizationScope: z.enum(["selected_organization_only", "include_child_branch"]).optional(),
});

export const listExportsQuerySchema = strictObject({
  status: z
    .enum([
      "queued",
      "running",
      "cancel_requested",
      "cancelled",
      "ready",
      "failed",
      "retrying",
      "expired",
      "delete_requested",
      "deleted",
      "cleanup_failed",
    ])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
