import type {
  DesignSystemCanonicalRenderingTreeSyncResult,
  DesignSystemMaterializationApplyResult,
  DesignSystemMaterializationPreviewResult,
  DesignSystemPageTemplateKey,
  DesignSystemProposalCreateResult,
  WebAppDiscoveryDriftStatus,
  WebAppHierarchyDiscoveryLink,
  WebAppHierarchyDiscoveryLinkListResponse,
  WebAppHierarchyDiscoverySyncPreviewItem,
  WebAppHierarchyDiscoverySyncPreviewResult,
  PlannerSelectableHierarchyNode,
  WebAppPageLocator,
  WebAppPageLocatorType,
  WebAppHierarchyDiscoverySyncBlockedSurface,
  WebAppHierarchyDiscoverySyncResult,
  WebAppHierarchyStructureAwareApplyResult,
  WebAppTopologyState,
  ResolvedWebAppHierarchyTree,
  WebAppModule,
  WebAppPage,
  WebAppPagePlacementType,
  WebAppPageStatus,
  WebAppRootFamily,
  WebAppRootFamilyId,
} from "../contract/types";

export type { WebAppPagePlacementType, WebAppPageStatus, WebAppRootFamilyId };
export type { WebAppPageLocatorType, WebAppDiscoveryDriftStatus };
export type { WebAppTopologyState, DesignSystemPageTemplateKey };

export interface WebAppRootFamilyData {
  rootFamilyId: WebAppRootFamilyId;
  displayLabel: string;
  routePrefix: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebAppModuleData {
  webAppModuleId: string;
  rootFamilyId: WebAppRootFamilyId;
  moduleKey: string;
  displayLabel: string;
  landingPageWebAppPageId: string | null;
  status: WebAppPageStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebAppPageData {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId: string | null;
  placementType: WebAppPagePlacementType;
  pageKey: string;
  displayLabel: string;
  routeSegment: string;
  normalizedRouteSegment: string;
  resolvedFullRoutePath: string | null;
  status: WebAppPageStatus;
  sortOrder: number;
  createdByRootAdminUserId: string;
  bootstrapSource: string | null;
  topologyState: WebAppTopologyState;
  templateKey: string | null;
  materializedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  activeLocator: WebAppPageLocatorData | null;
}

export interface WebAppPageLocatorData {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface WebAppDiscoveryLinkData {
  webAppDiscoveryLinkId: string;
  discoveredWebAppStructureNodeId: string;
  discoveredWebAppSurfaceId: string | null;
  rootFamilyId: WebAppRootFamilyId;
  curatedTargetType: "module" | "page";
  curatedWebAppModuleId: string | null;
  curatedWebAppPageId: string | null;
  linkStatus: "matched" | "blocked" | "stale-discovered";
  driftStatus: WebAppDiscoveryDriftStatus;
  driftSummary: string | null;
  lastComparedWebAppDiscoveryRunId: string | null;
  lastMatchedWebAppDiscoveryRunId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebAppModuleInput {
  rootFamilyId: WebAppRootFamilyId;
  moduleKey: string;
  displayLabel: string;
  status?: WebAppPageStatus;
  sortOrder?: number;
}

export interface UpdateWebAppModuleInput {
  webAppModuleId: string;
  displayLabel?: string;
  landingPageWebAppPageId?: string | null;
  status?: WebAppPageStatus;
  sortOrder?: number;
}

export interface CreateWebAppPageInput {
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId?: string;
  placementType?: WebAppPagePlacementType;
  pageKey: string;
  displayLabel: string;
  routeSegment: string;
  status?: WebAppPageStatus;
  sortOrder?: number;
  createdByRootAdminUserId: string;
  topologyState?: WebAppTopologyState;
  templateKey?: string | null;
  materializedAt?: Date | null;
}

export interface UpdateWebAppPageInput {
  webAppPageId: string;
  displayLabel?: string;
  routeSegment?: string;
  status?: WebAppPageStatus;
  sortOrder?: number;
}

export interface MoveWebAppPageInput {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  targetParentPageId?: string;
  placementType: WebAppPagePlacementType;
  sortOrder?: number;
}

export interface GetResolvedWebAppHierarchyTreeInput {
  includeInactive?: boolean;
  includeOrphaned?: boolean;
}

export interface ListPlannerSelectableHierarchyNodesInput {
  includeInactive?: boolean;
}

export interface ListOrphanedWebAppPagesInput {
  includeInactive?: boolean;
  rootFamilyId?: WebAppRootFamilyId;
}

export interface CreateDesignSystemPageProposalInput {
  webAppModuleId: string;
  displayLabel: string;
  routeSegment: string;
  templateKey: DesignSystemPageTemplateKey;
  sortOrder?: number;
  createdByRootAdminUserId: string;
}

export interface CreateDesignSystemSubpageProposalInput {
  parentPageId: string;
  displayLabel: string;
  routeSegment: string;
  templateKey: DesignSystemPageTemplateKey;
  sortOrder?: number;
  createdByRootAdminUserId: string;
}

export interface PreviewDesignSystemMaterializationInput {
  proposalPageIds: string[];
}

export interface ApplyDesignSystemMaterializationInput {
  proposalPageIds: string[];
  previewHash: string;
  createdByRootAdminUserId: string;
}

export interface DesignSystemMaterializationPlan {
  folderPath: string;
  indexHtmlPath: string;
  governanceStubPath: string;
}

export interface DesignSystemMaterializer {
  plan(routePath: string, pageKey: string): DesignSystemMaterializationPlan;
  apply(input: {
    pageKey: string;
    displayLabel: string;
    routePath: string;
    templateKey: DesignSystemPageTemplateKey;
    proposalCreatedAt: Date;
    appliedAt: Date;
  }): Promise<DesignSystemMaterializationPlan>;
}

export interface BootstrapObservedPageInput {
  pageKey: string;
  displayLabel: string;
  routeSegment: string;
  status?: WebAppPageStatus;
  sortOrder?: number;
  children?: BootstrapObservedPageInput[];
}

export interface BootstrapObservedModuleInput {
  moduleKey: string;
  displayLabel: string;
  status?: WebAppPageStatus;
  sortOrder?: number;
  pages: BootstrapObservedPageInput[];
}

export interface BootstrapWebAppHierarchyInput {
  observedRootFamilies: Array<{
    rootFamilyId: WebAppRootFamilyId;
    modules: BootstrapObservedModuleInput[];
  }>;
  createdByRootAdminUserId: string;
}

export interface SyncWebAppHierarchyFromDiscoveryInput {
  createdByRootAdminUserId: string;
  includeInactive?: boolean;
  includeOrphaned?: boolean;
}

export interface PreviewStructureAwareWebAppHierarchySyncInput {
  rootFamilyIds?: WebAppRootFamilyId[];
  selectedDiscoveredWebAppStructureNodeIds?: string[];
  includeBlocked?: boolean;
  includeStaleDiscovered?: boolean;
  includeMetadataDrift?: boolean;
}

export interface ApplyStructureAwareWebAppHierarchySyncInput
  extends PreviewStructureAwareWebAppHierarchySyncInput {
  createdByRootAdminUserId: string;
  includeInactive?: boolean;
  includeOrphaned?: boolean;
}

export interface ListWebAppHierarchyDiscoveryLinksInput {
  rootFamilyId?: WebAppRootFamilyId;
  linkStatus?: "matched" | "blocked" | "stale-discovered";
  driftStatus?: WebAppDiscoveryDriftStatus;
  curatedTargetType?: "module" | "page";
  page?: number;
  pageSize?: number;
}

export type {
  DesignSystemCanonicalRenderingTreeSyncResult,
  DesignSystemMaterializationApplyResult,
  DesignSystemMaterializationPreviewResult,
  DesignSystemProposalCreateResult,
  PlannerSelectableHierarchyNode,
  WebAppHierarchyDiscoveryLink,
  WebAppHierarchyDiscoveryLinkListResponse,
  WebAppHierarchyDiscoverySyncPreviewItem,
  WebAppHierarchyDiscoverySyncPreviewResult,
  WebAppHierarchyStructureAwareApplyResult,
  WebAppPageLocator,
  ResolvedWebAppHierarchyTree,
  WebAppHierarchyDiscoverySyncBlockedSurface,
  WebAppHierarchyDiscoverySyncResult,
  WebAppModule,
  WebAppPage,
  WebAppRootFamily,
};
