import {
  getDiscoveredWebAppStructureNode,
  listDiscoveredWebAppStructureTree,
} from "./listDiscoveredWebAppStructure";
import { getDiscoveredWebAppSurface, listDiscoveredWebAppSurfaces } from "./listDiscoveredWebAppSurfaces";
import { getWebAppDiscoveryRun, listWebAppDiscoveryRuns } from "./listWebAppDiscoveryRuns";
import {
  toDiscoveredWebAppStructureNodeResponse,
  toDiscoveredWebAppStructureTreeResponse,
  toDiscoveredWebAppSurfaceListResponse,
  toDiscoveredWebAppSurfaceResponse,
  toWebAppDiscoveryRunListResponse,
  toWebAppDiscoveryRunResponse,
} from "./presenters";
import type { WebAppSurfaceDiscoveryRepository } from "../persistence/repository";
import type {
  ListDiscoveredWebAppStructureTreeInput,
  ListDiscoveredWebAppSurfacesInput,
  ListDiscoveryRunsInput,
  RunWebAppSurfaceDiscoveryInput,
} from "./types";
import { runWebAppSurfaceDiscovery } from "./runWebAppSurfaceDiscovery";
import type { WebAppSurfaceDiscoveryProvider } from "./providers";

export interface WebAppSurfaceDiscoveryService {
  runWebAppSurfaceDiscovery(input: RunWebAppSurfaceDiscoveryInput): Promise<ReturnType<typeof toWebAppDiscoveryRunResponse>>;
  listDiscoveredWebAppSurfaces(
    input: ListDiscoveredWebAppSurfacesInput,
  ): Promise<ReturnType<typeof toDiscoveredWebAppSurfaceListResponse>>;
  getDiscoveredWebAppSurface(
    discoveredWebAppSurfaceId: string,
  ): Promise<ReturnType<typeof toDiscoveredWebAppSurfaceResponse>>;
  listDiscoveredWebAppStructureTree(
    input: ListDiscoveredWebAppStructureTreeInput,
  ): Promise<ReturnType<typeof toDiscoveredWebAppStructureTreeResponse>>;
  getDiscoveredWebAppStructureNode(
    discoveredWebAppStructureNodeId: string,
  ): Promise<ReturnType<typeof toDiscoveredWebAppStructureNodeResponse>>;
  listWebAppDiscoveryRuns(
    input: ListDiscoveryRunsInput,
  ): Promise<ReturnType<typeof toWebAppDiscoveryRunListResponse>>;
  getWebAppDiscoveryRun(webAppDiscoveryRunId: string): Promise<ReturnType<typeof toWebAppDiscoveryRunResponse>>;
}

export function createWebAppSurfaceDiscoveryService(
  repository: WebAppSurfaceDiscoveryRepository,
  providers: WebAppSurfaceDiscoveryProvider[],
): WebAppSurfaceDiscoveryService {
  return {
    async runWebAppSurfaceDiscovery(input) {
      return toWebAppDiscoveryRunResponse(
        await runWebAppSurfaceDiscovery(repository, providers, input),
      );
    },
    async listDiscoveredWebAppSurfaces(input) {
      const result = await listDiscoveredWebAppSurfaces(repository, input);
      return toDiscoveredWebAppSurfaceListResponse(result, input.page, input.pageSize);
    },
    async getDiscoveredWebAppSurface(discoveredWebAppSurfaceId) {
      return toDiscoveredWebAppSurfaceResponse(
        await getDiscoveredWebAppSurface(repository, discoveredWebAppSurfaceId),
      );
    },
    async listDiscoveredWebAppStructureTree(input) {
      return toDiscoveredWebAppStructureTreeResponse(
        await listDiscoveredWebAppStructureTree(repository, input),
      );
    },
    async getDiscoveredWebAppStructureNode(discoveredWebAppStructureNodeId) {
      return toDiscoveredWebAppStructureNodeResponse(
        await getDiscoveredWebAppStructureNode(repository, discoveredWebAppStructureNodeId),
      );
    },
    async listWebAppDiscoveryRuns(input) {
      const result = await listWebAppDiscoveryRuns(repository, input);
      return toWebAppDiscoveryRunListResponse(result, input.page, input.pageSize);
    },
    async getWebAppDiscoveryRun(webAppDiscoveryRunId) {
      return toWebAppDiscoveryRunResponse(
        await getWebAppDiscoveryRun(repository, webAppDiscoveryRunId),
      );
    },
  };
}
