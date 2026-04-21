import { z } from "zod";

const uuidSchema = z.string().uuid();
const trimmedNonEmptyString = z.string().trim().min(1);
const normalizedKeySchema = z.string().trim().min(1).transform((value) => value.toLowerCase());
const pageStatusSchema = z.enum(["draft", "review", "live", "inactive"]);
const placementTypeSchema = z.enum(["module-root", "child-page", "orphaned"]);
const rootFamilyIdSchema = z.enum(["root-admin", "login", "design-system"]);
const locatorDriftStatusSchema = z.enum([
  "none",
  "locator-drift",
  "placement-drift",
  "metadata-drift",
  "stale-discovered",
  "blocked-locator",
  "blocked-ambiguity",
]);
const linkStatusSchema = z.enum(["matched", "blocked", "stale-discovered"]);
const curatedTargetTypeSchema = z.enum(["module", "page"]);
const sortOrderSchema = z.coerce.number().int().min(0).default(0);
const strictObject = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

const bootstrapObservedPageSchema: z.ZodType<{
  pageKey: string;
  displayLabel: string;
  routeSegment: string;
  status?: "draft" | "review" | "live" | "inactive";
  sortOrder?: number;
  children?: Array<unknown>;
}> = z.lazy(() =>
  strictObject({
    pageKey: normalizedKeySchema,
    displayLabel: trimmedNonEmptyString,
    routeSegment: normalizedKeySchema,
    status: pageStatusSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
    children: z.array(bootstrapObservedPageSchema).optional(),
  }),
);

export const createWebAppModuleBodySchema = strictObject({
  rootFamilyId: rootFamilyIdSchema,
  moduleKey: normalizedKeySchema,
  displayLabel: trimmedNonEmptyString,
  status: pageStatusSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
});

export const webAppModuleIdParamsSchema = strictObject({
  webAppModuleId: uuidSchema,
});

export const updateWebAppModuleBodySchema = strictObject({
  displayLabel: trimmedNonEmptyString.optional(),
  status: pageStatusSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const updateWebAppModuleLandingPageBodySchema = strictObject({
  landingPageWebAppPageId: z.union([uuidSchema, z.null()]),
});

export const createWebAppPageBodySchema = strictObject({
  rootFamilyId: rootFamilyIdSchema,
  webAppModuleId: uuidSchema,
  parentPageId: uuidSchema.optional(),
  placementType: placementTypeSchema.optional(),
  pageKey: normalizedKeySchema,
  displayLabel: trimmedNonEmptyString,
  routeSegment: normalizedKeySchema,
  status: pageStatusSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
});

export const webAppPageIdParamsSchema = strictObject({
  webAppPageId: uuidSchema,
});

export const updateWebAppPageBodySchema = strictObject({
  displayLabel: trimmedNonEmptyString.optional(),
  routeSegment: normalizedKeySchema.optional(),
  status: pageStatusSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be supplied.",
});

export const moveWebAppPageBodySchema = strictObject({
  rootFamilyId: rootFamilyIdSchema,
  webAppModuleId: uuidSchema,
  targetParentPageId: uuidSchema.optional(),
  placementType: placementTypeSchema,
  sortOrder: sortOrderSchema.optional(),
});

export const listPlannerSelectableHierarchyNodesQuerySchema = strictObject({
  includeInactive: z.coerce.boolean().default(false),
});

export const listOrphanedWebAppPagesQuerySchema = strictObject({
  includeInactive: z.coerce.boolean().default(false),
  rootFamilyId: rootFamilyIdSchema.optional(),
});

export const getResolvedWebAppHierarchyTreeQuerySchema = strictObject({
  includeInactive: z.coerce.boolean().default(false),
  includeOrphaned: z.coerce.boolean().default(false),
});

export const bootstrapWebAppHierarchyBodySchema = strictObject({
  observedRootFamilies: z.array(
    strictObject({
      rootFamilyId: rootFamilyIdSchema,
      modules: z.array(
        strictObject({
          moduleKey: normalizedKeySchema,
          displayLabel: trimmedNonEmptyString,
          status: pageStatusSchema.optional(),
          sortOrder: sortOrderSchema.optional(),
          pages: z.array(bootstrapObservedPageSchema),
        }),
      ),
    }),
  ),
});

export const syncWebAppHierarchyFromDiscoveryBodySchema = strictObject({
  includeInactive: z.coerce.boolean().default(false),
  includeOrphaned: z.coerce.boolean().default(false),
});

export const previewStructureAwareWebAppHierarchySyncBodySchema = strictObject({
  rootFamilyIds: z.array(rootFamilyIdSchema).min(1).optional(),
  selectedDiscoveredWebAppStructureNodeIds: z.array(uuidSchema).min(1).optional(),
  includeBlocked: z.coerce.boolean().default(true),
  includeStaleDiscovered: z.coerce.boolean().default(false),
  includeMetadataDrift: z.coerce.boolean().default(true),
});

export const applyStructureAwareWebAppHierarchySyncBodySchema =
  previewStructureAwareWebAppHierarchySyncBodySchema.extend({
    includeInactive: z.coerce.boolean().default(false),
    includeOrphaned: z.coerce.boolean().default(false),
  });

const designSystemTemplateKeySchema = z.literal("static-html-page");

export const createDesignSystemPageBodySchema = strictObject({
  webAppModuleId: uuidSchema,
  displayLabel: trimmedNonEmptyString,
  routeSegment: normalizedKeySchema,
  templateKey: designSystemTemplateKeySchema,
  sortOrder: sortOrderSchema.optional(),
});

export const createDesignSystemSubpageBodySchema = strictObject({
  parentPageId: uuidSchema,
  displayLabel: trimmedNonEmptyString,
  routeSegment: normalizedKeySchema,
  templateKey: designSystemTemplateKeySchema,
  sortOrder: sortOrderSchema.optional(),
});

export const previewDesignSystemMaterializationBodySchema = strictObject({
  proposalPageIds: z.array(uuidSchema).min(1),
});

export const applyDesignSystemMaterializationBodySchema = strictObject({
  proposalPageIds: z.array(uuidSchema).min(1),
  previewHash: trimmedNonEmptyString,
});

export const listWebAppHierarchyDiscoveryLinksQuerySchema = strictObject({
  rootFamilyId: rootFamilyIdSchema.optional(),
  linkStatus: linkStatusSchema.optional(),
  driftStatus: locatorDriftStatusSchema.optional(),
  curatedTargetType: curatedTargetTypeSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
