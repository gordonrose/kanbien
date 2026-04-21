import type {
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppSurfaceData,
  ListDiscoveredWebAppStructureTreeInput,
  ListDiscoveredWebAppSurfacesInput,
  ListDiscoveryRunsInput,
  PaginatedResult,
  WebAppDiscoveryRunData,
  WebAppRootFamilyId,
} from "../domain/types";
import type {
  CompleteWebAppDiscoveryRunRecordInput,
  CreateDiscoveredWebAppSurfaceObservationRecordInput,
  CreateDiscoveredWebAppSurfaceRecordInput,
  CreateDiscoveredWebAppStructureNodeRecordInput,
  CreateDiscoveredWebAppStructureObservationRecordInput,
  CreateWebAppDiscoveryRunRecordInput,
  RefreshDiscoveredWebAppSurfaceRecordInput,
  RefreshDiscoveredWebAppStructureNodeRecordInput,
} from "./types";

export interface WebAppSurfaceDiscoveryRepository {
  createDiscoveryRun(input: CreateWebAppDiscoveryRunRecordInput): Promise<WebAppDiscoveryRunData>;
  completeDiscoveryRun(input: CompleteWebAppDiscoveryRunRecordInput): Promise<WebAppDiscoveryRunData>;
  findDiscoveryRunById(webAppDiscoveryRunId: string): Promise<WebAppDiscoveryRunData | null>;
  listDiscoveryRuns(input: ListDiscoveryRunsInput): Promise<PaginatedResult<WebAppDiscoveryRunData>>;
  findSurfaceByCanonicalLocator(canonicalLocator: string): Promise<DiscoveredWebAppSurfaceData | null>;
  createDiscoveredSurface(
    input: CreateDiscoveredWebAppSurfaceRecordInput,
  ): Promise<DiscoveredWebAppSurfaceData>;
  refreshDiscoveredSurface(
    input: RefreshDiscoveredWebAppSurfaceRecordInput,
  ): Promise<DiscoveredWebAppSurfaceData>;
  createSurfaceObservation(
    input: CreateDiscoveredWebAppSurfaceObservationRecordInput,
  ): Promise<void>;
  markSurfaceStale(discoveredWebAppSurfaceId: string, staleAt: Date): Promise<DiscoveredWebAppSurfaceData>;
  listScopeSurfaces(rootFamilyIds: WebAppRootFamilyId[]): Promise<DiscoveredWebAppSurfaceData[]>;
  findStructureNodeByStructureKey(structureKey: string): Promise<DiscoveredWebAppStructureNodeData | null>;
  createDiscoveredStructureNode(
    input: CreateDiscoveredWebAppStructureNodeRecordInput,
  ): Promise<DiscoveredWebAppStructureNodeData>;
  refreshDiscoveredStructureNode(
    input: RefreshDiscoveredWebAppStructureNodeRecordInput,
  ): Promise<DiscoveredWebAppStructureNodeData>;
  createStructureObservation(
    input: CreateDiscoveredWebAppStructureObservationRecordInput,
  ): Promise<void>;
  markStructureNodeStale(
    discoveredWebAppStructureNodeId: string,
    staleAt: Date,
  ): Promise<DiscoveredWebAppStructureNodeData>;
  listScopeStructureNodes(rootFamilyIds: WebAppRootFamilyId[]): Promise<DiscoveredWebAppStructureNodeData[]>;
  findDiscoveredStructureNodeById(
    discoveredWebAppStructureNodeId: string,
  ): Promise<DiscoveredWebAppStructureNodeData | null>;
  listDiscoveredStructureNodes(
    input: ListDiscoveredWebAppStructureTreeInput,
  ): Promise<DiscoveredWebAppStructureNodeData[]>;
  findDiscoveredSurfaceById(discoveredWebAppSurfaceId: string): Promise<DiscoveredWebAppSurfaceData | null>;
  listDiscoveredSurfaces(
    input: ListDiscoveredWebAppSurfacesInput,
  ): Promise<PaginatedResult<DiscoveredWebAppSurfaceData>>;
}
