import { z } from "zod";

const uuidSchema = z.string().uuid();
const pageSchema = z.coerce.number().int().min(1).default(1);
const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(25);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const webAppDiscoveryRunIdParamsSchema = strictObject({
  webAppDiscoveryRunId: uuidSchema,
});

export const discoveredWebAppSurfaceIdParamsSchema = strictObject({
  discoveredWebAppSurfaceId: uuidSchema,
});

export const discoveredWebAppStructureNodeIdParamsSchema = strictObject({
  discoveredWebAppStructureNodeId: uuidSchema,
});

export const runWebAppSurfaceDiscoveryBodySchema = strictObject({
  scopeKey: z.literal("current-approved-root-families").default("current-approved-root-families"),
  triggerKind: z.literal("manual").default("manual"),
});

export const listDiscoveredWebAppSurfacesQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  rootFamilyId: z.enum(["root-admin", "login", "design-system"]).optional(),
  surfaceKind: z
    .enum(["page-route", "shell-state", "support-route", "review-required"])
    .optional(),
  userFacingDisposition: z
    .enum(["user-facing", "support-only", "review-required"])
    .optional(),
  providerKey: z.string().trim().min(1).optional(),
  staleStatus: z.enum(["current", "stale", "all"]).default("all"),
});

export const listWebAppDiscoveryRunsQuerySchema = strictObject({
  page: pageSchema,
  pageSize: pageSizeSchema,
  status: z.enum(["running", "succeeded", "failed", "partial"]).optional(),
  triggerKind: z
    .enum(["manual", "scheduled", "bootstrap", "startup-sync", "topic-event"])
    .optional(),
});

export const listDiscoveredWebAppStructureTreeQuerySchema = strictObject({
  rootFamilyId: z.enum(["root-admin", "login", "design-system"]).optional(),
  staleStatus: z.enum(["current", "stale", "all"]).default("all"),
});
