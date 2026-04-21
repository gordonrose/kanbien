export type WebAppRootFamilyId = "root-admin" | "login" | "design-system";
export type DiscoveredSurfaceKind =
  | "page-route"
  | "shell-state"
  | "support-route"
  | "review-required";
export type DiscoveredSurfaceLocatorType =
  | "path"
  | "path-with-query-template"
  | "hash-state";
export type DiscoveredSurfaceDisposition =
  | "user-facing"
  | "support-only"
  | "review-required";
export type DiscoveredStructureNodeKind =
  | "root"
  | "group"
  | "page-surface"
  | "shell-state-surface"
  | "support-surface"
  | "review-required-surface";
export type WebAppDiscoveryRunStatus = "running" | "succeeded" | "failed" | "partial";
export type WebAppDiscoveryTriggerKind =
  | "manual"
  | "scheduled"
  | "bootstrap"
  | "startup-sync"
  | "topic-event";

export interface DiscoveredWebAppSurfaceCandidate {
  rootFamilyId: WebAppRootFamilyId;
  surfaceKind: DiscoveredSurfaceKind;
  locatorType: DiscoveredSurfaceLocatorType;
  routePath: string | null;
  routeHash: string | null;
  canonicalLocator: string;
  displayLabel: string | null;
  userFacingDisposition: DiscoveredSurfaceDisposition;
  providerKey: string;
  implementationSourcePath: string | null;
}

export interface DiscoveredWebAppStructureNodeCandidate {
  rootFamilyId: WebAppRootFamilyId;
  structureKey: string;
  parentStructureKey: string | null;
  nodeKey: string;
  nodeKind: DiscoveredStructureNodeKind;
  displayLabel: string | null;
  depth: number;
  linkedSurfaceCanonicalLocator: string | null;
  providerKey: string;
  implementationSourcePath: string | null;
}

export interface WebAppDiscoveryRunData {
  webAppDiscoveryRunId: string;
  scopeKey: string;
  status: WebAppDiscoveryRunStatus;
  triggerKind: WebAppDiscoveryTriggerKind;
  providerVersion: string;
  createdByRootAdminUserId: string | null;
  startedAt: Date;
  completedAt: Date | null;
  failureSummary: string | null;
  createdCount: number;
  refreshedCount: number;
  unchangedCount: number;
  staleCount: number;
  supportOnlyCount: number;
  reviewRequiredCount: number;
  structureCreatedCount: number;
  structureRefreshedCount: number;
  structureUnchangedCount: number;
  structureStaleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscoveredWebAppSurfaceData {
  discoveredWebAppSurfaceId: string;
  rootFamilyId: WebAppRootFamilyId;
  discoveryKey: string;
  surfaceKind: DiscoveredSurfaceKind;
  locatorType: DiscoveredSurfaceLocatorType;
  routePath: string | null;
  routeHash: string | null;
  canonicalLocator: string;
  displayLabel: string | null;
  userFacingDisposition: DiscoveredSurfaceDisposition;
  providerKey: string;
  implementationSourcePath: string | null;
  firstDiscoveredRunId: string;
  lastDiscoveredRunId: string;
  firstDiscoveredAt: Date;
  lastDiscoveredAt: Date;
  staleAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscoveredWebAppStructureNodeData {
  discoveredWebAppStructureNodeId: string;
  rootFamilyId: WebAppRootFamilyId;
  structureKey: string;
  parentStructureKey: string | null;
  parentDiscoveredWebAppStructureNodeId: string | null;
  nodeKey: string;
  nodeKind: DiscoveredStructureNodeKind;
  displayLabel: string | null;
  depth: number;
  linkedDiscoveredWebAppSurfaceId: string | null;
  providerKey: string;
  implementationSourcePath: string | null;
  firstDiscoveredRunId: string;
  lastDiscoveredRunId: string;
  firstDiscoveredAt: Date;
  lastDiscoveredAt: Date;
  staleAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscoveredWebAppStructureTreeNodeData
  extends DiscoveredWebAppStructureNodeData {
  children: DiscoveredWebAppStructureTreeNodeData[];
}

export interface RunWebAppSurfaceDiscoveryInput {
  scopeKey: "current-approved-root-families";
  triggerKind: "manual";
  createdByRootAdminUserId: string;
}

export interface ListDiscoveredWebAppSurfacesInput {
  page: number;
  pageSize: number;
  filters: {
    rootFamilyId?: WebAppRootFamilyId;
    surfaceKind?: DiscoveredSurfaceKind;
    userFacingDisposition?: DiscoveredSurfaceDisposition;
    providerKey?: string;
    staleStatus?: "current" | "stale" | "all";
  };
}

export interface ListDiscoveryRunsInput {
  page: number;
  pageSize: number;
  filters: {
    status?: WebAppDiscoveryRunStatus;
    triggerKind?: WebAppDiscoveryTriggerKind;
  };
}

export interface ListDiscoveredWebAppStructureTreeInput {
  filters: {
    rootFamilyId?: WebAppRootFamilyId;
    staleStatus?: "current" | "stale" | "all";
  };
}

export interface PaginatedResult<T> {
  items: T[];
  totalMatchingRecords: number;
}
