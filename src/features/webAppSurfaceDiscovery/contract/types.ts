export interface WebAppDiscoveryRunResponse {
  webAppDiscoveryRunId: string;
  scopeKey: string;
  status: "running" | "succeeded" | "failed" | "partial";
  triggerKind: "manual" | "scheduled" | "bootstrap" | "startup-sync" | "topic-event";
  providerVersion: string;
  createdByRootAdminUserId: string | null;
  startedAt: string;
  completedAt: string | null;
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
  createdAt: string;
  updatedAt: string;
}

export interface WebAppDiscoveryRunListResponse {
  items: WebAppDiscoveryRunResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalMatchingRecords: number;
}

export interface DiscoveredWebAppSurfaceResponse {
  discoveredWebAppSurfaceId: string;
  rootFamilyId: "root-admin" | "login" | "design-system";
  discoveryKey: string;
  surfaceKind: "page-route" | "shell-state" | "support-route" | "review-required";
  locatorType: "path" | "path-with-query-template" | "hash-state";
  routePath: string | null;
  routeHash: string | null;
  canonicalLocator: string;
  displayLabel: string | null;
  userFacingDisposition: "user-facing" | "support-only" | "review-required";
  providerKey: string;
  implementationSourcePath: string | null;
  firstDiscoveredRunId: string;
  lastDiscoveredRunId: string;
  firstDiscoveredAt: string;
  lastDiscoveredAt: string;
  staleAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveredWebAppSurfaceListResponse {
  items: DiscoveredWebAppSurfaceResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalMatchingRecords: number;
}

export interface DiscoveredWebAppStructureNodeResponse {
  discoveredWebAppStructureNodeId: string;
  rootFamilyId: "root-admin" | "login" | "design-system";
  structureKey: string;
  parentStructureKey: string | null;
  parentDiscoveredWebAppStructureNodeId: string | null;
  nodeKey: string;
  nodeKind:
    | "root"
    | "group"
    | "page-surface"
    | "shell-state-surface"
    | "support-surface"
    | "review-required-surface";
  displayLabel: string | null;
  depth: number;
  linkedDiscoveredWebAppSurfaceId: string | null;
  providerKey: string;
  implementationSourcePath: string | null;
  firstDiscoveredRunId: string;
  lastDiscoveredRunId: string;
  firstDiscoveredAt: string;
  lastDiscoveredAt: string;
  staleAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveredWebAppStructureTreeNodeResponse
  extends DiscoveredWebAppStructureNodeResponse {
  children: DiscoveredWebAppStructureTreeNodeResponse[];
}

export interface DiscoveredWebAppStructureTreeResponse {
  items: DiscoveredWebAppStructureTreeNodeResponse[];
  totalMatchingRecords: number;
}
