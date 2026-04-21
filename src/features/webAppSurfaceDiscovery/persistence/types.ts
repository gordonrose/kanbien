import type {
  DiscoveredSurfaceDisposition,
  DiscoveredSurfaceKind,
  DiscoveredSurfaceLocatorType,
  DiscoveredStructureNodeKind,
  WebAppDiscoveryRunStatus,
  WebAppDiscoveryTriggerKind,
  WebAppRootFamilyId,
} from "../domain/types";

export interface WebAppDiscoveryRunRecord {
  web_app_discovery_run_id: string;
  scope_key: string;
  status: WebAppDiscoveryRunStatus;
  trigger_kind: WebAppDiscoveryTriggerKind;
  provider_version: string;
  created_by_root_admin_user_id: string | null;
  started_at: Date;
  completed_at: Date | null;
  failure_summary: string | null;
  created_count: number;
  refreshed_count: number;
  unchanged_count: number;
  stale_count: number;
  support_only_count: number;
  review_required_count: number;
  structure_created_count: number;
  structure_refreshed_count: number;
  structure_unchanged_count: number;
  structure_stale_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface DiscoveredWebAppSurfaceRecord {
  discovered_web_app_surface_id: string;
  root_family_id: WebAppRootFamilyId;
  discovery_key: string;
  surface_kind: DiscoveredSurfaceKind;
  locator_type: DiscoveredSurfaceLocatorType;
  route_path: string | null;
  route_hash: string | null;
  canonical_locator: string;
  display_label: string | null;
  user_facing_disposition: DiscoveredSurfaceDisposition;
  provider_key: string;
  implementation_source_path: string | null;
  first_discovered_run_id: string;
  last_discovered_run_id: string;
  first_discovered_at: Date;
  last_discovered_at: Date;
  stale_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DiscoveredWebAppStructureNodeRecord {
  discovered_web_app_structure_node_id: string;
  root_family_id: WebAppRootFamilyId;
  structure_key: string;
  parent_structure_key: string | null;
  parent_discovered_web_app_structure_node_id: string | null;
  node_key: string;
  node_kind: DiscoveredStructureNodeKind;
  display_label: string | null;
  depth: number;
  linked_discovered_web_app_surface_id: string | null;
  provider_key: string;
  implementation_source_path: string | null;
  first_discovered_run_id: string;
  last_discovered_run_id: string;
  first_discovered_at: Date;
  last_discovered_at: Date;
  stale_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWebAppDiscoveryRunRecordInput {
  webAppDiscoveryRunId: string;
  scopeKey: string;
  status: WebAppDiscoveryRunStatus;
  triggerKind: WebAppDiscoveryTriggerKind;
  providerVersion: string;
  createdByRootAdminUserId: string | null;
  startedAt: Date;
}

export interface CompleteWebAppDiscoveryRunRecordInput {
  webAppDiscoveryRunId: string;
  status: Exclude<WebAppDiscoveryRunStatus, "running">;
  completedAt: Date;
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
}

export interface CreateDiscoveredWebAppSurfaceRecordInput {
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
}

export interface RefreshDiscoveredWebAppSurfaceRecordInput {
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
  lastDiscoveredRunId: string;
  lastDiscoveredAt: Date;
  staleAt: Date | null;
}

export interface CreateDiscoveredWebAppSurfaceObservationRecordInput {
  discoveredWebAppSurfaceObservationId: string;
  webAppDiscoveryRunId: string;
  discoveredWebAppSurfaceId: string;
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
  observedAt: Date;
}

export interface CreateDiscoveredWebAppStructureNodeRecordInput {
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
}

export interface RefreshDiscoveredWebAppStructureNodeRecordInput {
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
  lastDiscoveredRunId: string;
  lastDiscoveredAt: Date;
  staleAt: Date | null;
}

export interface CreateDiscoveredWebAppStructureObservationRecordInput {
  discoveredWebAppStructureObservationId: string;
  webAppDiscoveryRunId: string;
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
  observedAt: Date;
}
