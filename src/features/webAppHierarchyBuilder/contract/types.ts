export type WebAppPageStatus = "draft" | "review" | "live" | "inactive";
export type WebAppPagePlacementType = "module-root" | "child-page" | "orphaned";
export type WebAppRootFamilyId = "root-admin" | "login" | "design-system";
export type WebAppPageLocatorType = "path" | "hash-state";
export type WebAppTopologyState = "proposed" | "applied";
export type DesignSystemPageTemplateKey = "static-html-page" | "launcher" | "canonical-rendering";
export type WebAppDiscoveryLinkStatus = "matched" | "blocked" | "stale-discovered";
export type WebAppDiscoveryDriftStatus =
  | "none"
  | "locator-drift"
  | "placement-drift"
  | "metadata-drift"
  | "stale-discovered"
  | "blocked-locator"
  | "blocked-ambiguity";

export interface WebAppRootFamily {
  rootFamilyId: WebAppRootFamilyId;
  displayLabel: string;
  routePrefix: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebAppModule {
  webAppModuleId: string;
  rootFamilyId: WebAppRootFamilyId;
  moduleKey: string;
  displayLabel: string;
  landingPageWebAppPageId: string | null;
  status: WebAppPageStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebAppPage {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId: string | null;
  placementType: WebAppPagePlacementType;
  pageKey: string;
  displayLabel: string;
  routeSegment: string;
  resolvedFullRoutePath: string | null;
  status: WebAppPageStatus;
  sortOrder: number;
  createdByRootAdminUserId: string;
  bootstrapSource: string | null;
  topologyState: WebAppTopologyState;
  templateKey: string | null;
  materializedAt: string | null;
  createdAt: string;
  updatedAt: string;
  activeLocator: WebAppPageLocator | null;
}

export interface WebAppPageLocator {
  webAppPageLocatorId: string;
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  locatorType: WebAppPageLocatorType;
  canonicalLocator: string;
  routePath: string;
  routeHash: string | null;
  normalizedLocatorKey: string;
  isActive: boolean;
  createdByRootAdminUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedWebAppPageTreeNode extends WebAppPage {
  children: ResolvedWebAppPageTreeNode[];
}

export interface ResolvedWebAppModuleTreeNode extends WebAppModule {
  pages: ResolvedWebAppPageTreeNode[];
  orphanedPages?: ResolvedWebAppPageTreeNode[];
}

export interface ResolvedWebAppHierarchyTree {
  rootFamilies: Array<
    WebAppRootFamily & {
      modules: ResolvedWebAppModuleTreeNode[];
    }
  >;
}

export interface PlannerSelectableHierarchyNode {
  nodeType: "module" | "page";
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  webAppPageId: string | null;
  parentPageId: string | null;
  moduleKey: string;
  pageKey: string | null;
  displayLabel: string;
  resolvedFullRoutePath: string | null;
  status: WebAppPageStatus;
  placementType: WebAppPagePlacementType | null;
}

export interface WebAppHierarchyDiscoveryLink {
  webAppDiscoveryLinkId: string;
  discoveredWebAppStructureNodeId: string;
  discoveredWebAppSurfaceId: string | null;
  rootFamilyId: WebAppRootFamilyId;
  curatedTargetType: "module" | "page";
  curatedWebAppModuleId: string | null;
  curatedWebAppPageId: string | null;
  linkStatus: WebAppDiscoveryLinkStatus;
  driftStatus: WebAppDiscoveryDriftStatus;
  driftSummary: string | null;
  lastComparedWebAppDiscoveryRunId: string | null;
  lastMatchedWebAppDiscoveryRunId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebAppHierarchyDiscoverySyncPreviewItem {
  itemType: "module" | "page";
  discoveredWebAppStructureNodeId: string;
  discoveredWebAppSurfaceId: string | null;
  rootFamilyId: WebAppRootFamilyId;
  pageDepth: number;
  discoveredStructureKey: string;
  displayLabel: string;
  plannedAction: "create" | "match" | "blocked";
  blockedReason:
    | "missing_surface_link"
    | "support_only_surface"
    | "review_required_surface"
    | "stale_discovered"
    | "locator_conflict"
    | "ambiguous_existing_match"
    | null;
  curatedTargetType: "module" | "page";
  curatedWebAppModuleId: string | null;
  curatedWebAppPageId: string | null;
  pageKey: string | null;
  moduleKey: string | null;
  placementType: WebAppPagePlacementType | null;
  proposedLocatorType: WebAppPageLocatorType | null;
  canonicalLocator: string | null;
  driftStatus: WebAppDiscoveryDriftStatus;
}

export interface WebAppHierarchyDiscoverySyncPreviewResult {
  previewSummary: {
    matchedModuleCount: number;
    createdModuleCount: number;
    matchedPageCount: number;
    createdPageCount: number;
    blockedItemCount: number;
    staleDiscoveredItemCount: number;
  };
  items: WebAppHierarchyDiscoverySyncPreviewItem[];
}

export interface WebAppHierarchyDiscoveryLinkListResponse {
  items: WebAppHierarchyDiscoveryLink[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalMatchingRecords: number;
}

export interface WebAppHierarchyDiscoverySyncBlockedSurface {
  discoveredWebAppSurfaceId: string;
  canonicalLocator: string;
  reason:
    | "stale_surface"
    | "support_only_surface"
    | "review_required_surface"
    | "non_page_surface"
    | "unsupported_locator_type"
    | "unsupported_root_path"
    | "unsupported_root_index_path"
    | "unsupported_multi_segment_path"
    | "generated_page_key_conflict"
    | "live_route_change_blocked";
}

export interface WebAppHierarchyDiscoverySyncResult {
  discoveryRun: {
    webAppDiscoveryRunId: string;
    status: "running" | "succeeded" | "failed" | "partial";
    createdCount: number;
    refreshedCount: number;
    unchangedCount: number;
    staleCount: number;
    supportOnlyCount: number;
    reviewRequiredCount: number;
    startedAt: string;
    completedAt: string | null;
  };
  syncSummary: {
    currentDiscoveredSurfaceCount: number;
    totalStaleDiscoveredSurfaceCount: number;
    importCandidateCount: number;
    createdModuleCount: number;
    createdPageCount: number;
    updatedPageCount: number;
    unchangedMappedSurfaceCount: number;
    blockedSurfaceCount: number;
    supportOnlySkippedCount: number;
    reviewRequiredSkippedCount: number;
    nonPageSurfaceSkippedCount: number;
  };
  blockedSurfaces: WebAppHierarchyDiscoverySyncBlockedSurface[];
  tree: ResolvedWebAppHierarchyTree;
}

export interface WebAppHierarchyStructureAwareApplyResult {
  previewSummary: WebAppHierarchyDiscoverySyncPreviewResult["previewSummary"];
  applySummary: {
    createdModuleCount: number;
    createdPageCount: number;
    refreshedLocatorCount: number;
    refreshedLinkCount: number;
    blockedItemCount: number;
  };
  items: WebAppHierarchyDiscoverySyncPreviewItem[];
  tree: ResolvedWebAppHierarchyTree;
}

export interface DesignSystemProposalCreateResult {
  proposalPage: WebAppPage;
  proposalStatus: "proposed";
}

export interface DesignSystemMaterializationPreviewItem {
  webAppPageId: string;
  pageKey: string;
  displayLabel: string;
  routePath: string;
  templateKey: DesignSystemPageTemplateKey;
  plannedOutputs: {
    folderPath: string;
    indexHtmlPath: string;
    governanceStubPath: string;
  };
}

export interface DesignSystemMaterializationPreviewResult {
  classification: "additive" | "compatibility-sensitive" | "blocked" | "invalid";
  previewHash: string;
  proposalCount: number;
  items: DesignSystemMaterializationPreviewItem[];
}

export interface DesignSystemMaterializationApplyResult {
  classification: "additive";
  previewHash: string;
  appliedPageCount: number;
  items: DesignSystemMaterializationPreviewItem[];
  tree: ResolvedWebAppHierarchyTree;
}

export interface DesignSystemCanonicalRenderingTreeSyncResult {
  syncSummary: {
    liveFamilyCount: number;
    liveReferenceCount: number;
    createdModuleCount: number;
    createdPageCount: number;
    refreshedPageCount: number;
    refreshedLocatorCount: number;
  };
  tree: ResolvedWebAppHierarchyTree;
}
