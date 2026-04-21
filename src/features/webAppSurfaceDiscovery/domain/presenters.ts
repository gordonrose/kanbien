import type {
  DiscoveredWebAppStructureNodeResponse,
  DiscoveredWebAppStructureTreeNodeResponse,
  DiscoveredWebAppStructureTreeResponse,
  DiscoveredWebAppSurfaceListResponse,
  DiscoveredWebAppSurfaceResponse,
  WebAppDiscoveryRunListResponse,
  WebAppDiscoveryRunResponse,
} from "../contract/types";
import type {
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppStructureTreeNodeData,
  DiscoveredWebAppSurfaceData,
  PaginatedResult,
  WebAppDiscoveryRunData,
} from "./types";

export function toWebAppDiscoveryRunResponse(
  run: WebAppDiscoveryRunData,
): WebAppDiscoveryRunResponse {
  return {
    webAppDiscoveryRunId: run.webAppDiscoveryRunId,
    scopeKey: run.scopeKey,
    status: run.status,
    triggerKind: run.triggerKind,
    providerVersion: run.providerVersion,
    createdByRootAdminUserId: run.createdByRootAdminUserId,
    startedAt: run.startedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
    failureSummary: run.failureSummary,
    createdCount: run.createdCount,
    refreshedCount: run.refreshedCount,
    unchangedCount: run.unchangedCount,
    staleCount: run.staleCount,
    supportOnlyCount: run.supportOnlyCount,
    reviewRequiredCount: run.reviewRequiredCount,
    structureCreatedCount: run.structureCreatedCount,
    structureRefreshedCount: run.structureRefreshedCount,
    structureUnchangedCount: run.structureUnchangedCount,
    structureStaleCount: run.structureStaleCount,
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
  };
}

export function toDiscoveredWebAppSurfaceResponse(
  surface: DiscoveredWebAppSurfaceData,
): DiscoveredWebAppSurfaceResponse {
  return {
    discoveredWebAppSurfaceId: surface.discoveredWebAppSurfaceId,
    rootFamilyId: surface.rootFamilyId,
    discoveryKey: surface.discoveryKey,
    surfaceKind: surface.surfaceKind,
    locatorType: surface.locatorType,
    routePath: surface.routePath,
    routeHash: surface.routeHash,
    canonicalLocator: surface.canonicalLocator,
    displayLabel: surface.displayLabel,
    userFacingDisposition: surface.userFacingDisposition,
    providerKey: surface.providerKey,
    implementationSourcePath: surface.implementationSourcePath,
    firstDiscoveredRunId: surface.firstDiscoveredRunId,
    lastDiscoveredRunId: surface.lastDiscoveredRunId,
    firstDiscoveredAt: surface.firstDiscoveredAt.toISOString(),
    lastDiscoveredAt: surface.lastDiscoveredAt.toISOString(),
    staleAt: surface.staleAt?.toISOString() ?? null,
    createdAt: surface.createdAt.toISOString(),
    updatedAt: surface.updatedAt.toISOString(),
  };
}

export function toDiscoveredWebAppStructureNodeResponse(
  node: DiscoveredWebAppStructureNodeData,
): DiscoveredWebAppStructureNodeResponse {
  return {
    discoveredWebAppStructureNodeId: node.discoveredWebAppStructureNodeId,
    rootFamilyId: node.rootFamilyId,
    structureKey: node.structureKey,
    parentStructureKey: node.parentStructureKey,
    parentDiscoveredWebAppStructureNodeId: node.parentDiscoveredWebAppStructureNodeId,
    nodeKey: node.nodeKey,
    nodeKind: node.nodeKind,
    displayLabel: node.displayLabel,
    depth: node.depth,
    linkedDiscoveredWebAppSurfaceId: node.linkedDiscoveredWebAppSurfaceId,
    providerKey: node.providerKey,
    implementationSourcePath: node.implementationSourcePath,
    firstDiscoveredRunId: node.firstDiscoveredRunId,
    lastDiscoveredRunId: node.lastDiscoveredRunId,
    firstDiscoveredAt: node.firstDiscoveredAt.toISOString(),
    lastDiscoveredAt: node.lastDiscoveredAt.toISOString(),
    staleAt: node.staleAt?.toISOString() ?? null,
    createdAt: node.createdAt.toISOString(),
    updatedAt: node.updatedAt.toISOString(),
  };
}

export function toDiscoveredWebAppStructureTreeNodeResponse(
  node: DiscoveredWebAppStructureTreeNodeData,
): DiscoveredWebAppStructureTreeNodeResponse {
  return {
    ...toDiscoveredWebAppStructureNodeResponse(node),
    children: node.children.map(toDiscoveredWebAppStructureTreeNodeResponse),
  };
}

export function toDiscoveredWebAppStructureTreeResponse(
  items: DiscoveredWebAppStructureTreeNodeData[],
): DiscoveredWebAppStructureTreeResponse {
  const countNodes = (nodes: DiscoveredWebAppStructureTreeNodeData[]): number =>
    nodes.reduce((total, node) => total + 1 + countNodes(node.children), 0);

  return {
    items: items.map(toDiscoveredWebAppStructureTreeNodeResponse),
    totalMatchingRecords: countNodes(items),
  };
}

export function toWebAppDiscoveryRunListResponse(
  result: PaginatedResult<WebAppDiscoveryRunData>,
  page: number,
  pageSize: number,
): WebAppDiscoveryRunListResponse {
  return {
    items: result.items.map(toWebAppDiscoveryRunResponse),
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / pageSize)),
    totalMatchingRecords: result.totalMatchingRecords,
  };
}

export function toDiscoveredWebAppSurfaceListResponse(
  result: PaginatedResult<DiscoveredWebAppSurfaceData>,
  page: number,
  pageSize: number,
): DiscoveredWebAppSurfaceListResponse {
  return {
    items: result.items.map(toDiscoveredWebAppSurfaceResponse),
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / pageSize)),
    totalMatchingRecords: result.totalMatchingRecords,
  };
}
