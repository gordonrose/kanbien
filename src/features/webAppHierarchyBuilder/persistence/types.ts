import type {
  WebAppDiscoveryLinkData,
  WebAppModuleData,
  WebAppPageData,
  WebAppPageLocatorData,
  WebAppPagePlacementType,
  WebAppPageStatus,
  WebAppRootFamilyData,
  WebAppRootFamilyId,
  WebAppTopologyState,
} from "../domain/types";

export interface CreateWebAppModuleRecordInput {
  webAppModuleId: string;
  rootFamilyId: WebAppRootFamilyId;
  moduleKey: string;
  displayLabel: string;
  landingPageWebAppPageId?: string | null;
  status: WebAppPageStatus;
  sortOrder: number;
}

export interface UpdateWebAppModuleRecordInput {
  webAppModuleId: string;
  displayLabel?: string;
  landingPageWebAppPageId?: string | null;
  status?: WebAppPageStatus;
  sortOrder?: number;
}

export interface CreateWebAppPageRecordInput {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId: string | null;
  placementType: WebAppPagePlacementType;
  pageKey: string;
  displayLabel: string;
  routeSegment: string;
  status: WebAppPageStatus;
  sortOrder: number;
  createdByRootAdminUserId: string;
  bootstrapSource: string | null;
  topologyState: WebAppTopologyState;
  templateKey: string | null;
  materializedAt: Date | null;
}

export interface UpdateWebAppPageMetadataRecordInput {
  webAppPageId: string;
  displayLabel?: string;
  routeSegment?: string;
  status?: WebAppPageStatus;
  sortOrder?: number;
}

export interface MarkWebAppPageAppliedRecordInput {
  webAppPageId: string;
  materializedAt: Date;
}

export interface MoveWebAppPageRecordInput {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId: string | null;
  placementType: WebAppPagePlacementType;
  sortOrder?: number;
}

export interface BootstrapUpsertWebAppPageRecordInput extends CreateWebAppPageRecordInput {}

export interface UpsertWebAppPageLocatorRecordInput {
  webAppPageLocatorId: string;
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  locatorType: "path" | "hash-state";
  canonicalLocator: string;
  routePath: string;
  routeHash: string | null;
  normalizedLocatorKey: string;
  createdByRootAdminUserId: string | null;
}

export interface UpsertWebAppDiscoveryLinkRecordInput {
  webAppDiscoveryLinkId: string;
  discoveredWebAppStructureNodeId: string;
  discoveredWebAppSurfaceId: string | null;
  rootFamilyId: WebAppRootFamilyId;
  curatedTargetType: "module" | "page";
  curatedWebAppModuleId: string | null;
  curatedWebAppPageId: string | null;
  linkStatus: "matched" | "blocked" | "stale-discovered";
  driftStatus:
    | "none"
    | "locator-drift"
    | "placement-drift"
    | "metadata-drift"
    | "stale-discovered"
    | "blocked-locator"
    | "blocked-ambiguity";
  driftSummary: string | null;
  lastComparedWebAppDiscoveryRunId: string | null;
  lastMatchedWebAppDiscoveryRunId: string | null;
}

export interface WebAppRootFamilyRecord extends WebAppRootFamilyData {}
export interface WebAppModuleRecord extends WebAppModuleData {}
export interface WebAppPageRecord extends WebAppPageData {}
export interface WebAppPageLocatorRecord extends WebAppPageLocatorData {}
export interface WebAppDiscoveryLinkRecord extends WebAppDiscoveryLinkData {}
