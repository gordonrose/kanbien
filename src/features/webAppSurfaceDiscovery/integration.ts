import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createDefaultWebAppSurfaceDiscoveryProviders } from "./domain/providers";
import { runWebAppSurfaceDiscovery } from "./domain/runWebAppSurfaceDiscovery";
import { createWebAppSurfaceDiscoveryService } from "./domain/service";
import type {
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppSurfaceData,
  WebAppDiscoveryRunData,
} from "./domain/types";
import { createPostgresWebAppSurfaceDiscoveryRepository } from "./persistence/postgresRepository";
import { createWebAppSurfaceDiscoveryRouter } from "./transport/router";

export interface WebAppSurfaceDiscoveryIntegrationSeam {
  runCurrentApprovedRootFamilyDiscovery(input: {
    createdByRootAdminUserId: string;
  }): Promise<WebAppDiscoveryRunData>;
  listDiscoveredWebAppSurfaces(input?: {
    staleStatus?: "current" | "stale" | "all";
  }): Promise<DiscoveredWebAppSurfaceData[]>;
  listDiscoveredWebAppStructureTree(input?: {
    rootFamilyId?: "root-admin" | "login" | "design-system";
    staleStatus?: "current" | "stale" | "all";
  }): Promise<DiscoveredWebAppStructureNodeData[]>;
  getDiscoveredWebAppStructureNode(
    discoveredWebAppStructureNodeId: string,
  ): Promise<DiscoveredWebAppStructureNodeData | null>;
}

export function createWebAppSurfaceDiscoveryIntegrationSeam(
  dbPool: Pool,
): WebAppSurfaceDiscoveryIntegrationSeam {
  const repository = createPostgresWebAppSurfaceDiscoveryRepository(dbPool);
  const providers = createDefaultWebAppSurfaceDiscoveryProviders();

  return {
    async runCurrentApprovedRootFamilyDiscovery(input) {
      return runWebAppSurfaceDiscovery(repository, providers, {
        scopeKey: "current-approved-root-families",
        triggerKind: "manual",
        createdByRootAdminUserId: input.createdByRootAdminUserId,
      });
    },
    async listDiscoveredWebAppSurfaces(input = {}) {
      const items: DiscoveredWebAppSurfaceData[] = [];
      let page = 1;

      while (true) {
        const result = await repository.listDiscoveredSurfaces({
          page,
          pageSize: 100,
          filters: {
            staleStatus: input.staleStatus ?? "all",
          },
        });
        items.push(...result.items);

        if (items.length >= result.totalMatchingRecords) {
          return items;
        }

        page += 1;
      }
    },
    async listDiscoveredWebAppStructureTree(input = {}) {
      return repository.listDiscoveredStructureNodes({
        filters: {
          rootFamilyId: input.rootFamilyId,
          staleStatus: input.staleStatus ?? "all",
        },
      });
    },
    async getDiscoveredWebAppStructureNode(discoveredWebAppStructureNodeId) {
      return repository.findDiscoveredStructureNodeById(discoveredWebAppStructureNodeId);
    },
  };
}

export function createWebAppSurfaceDiscoveryFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresWebAppSurfaceDiscoveryRepository(dbPool);
  const service = createWebAppSurfaceDiscoveryService(
    repository,
    createDefaultWebAppSurfaceDiscoveryProviders(),
  );

  return createWebAppSurfaceDiscoveryRouter(
    service,
    capabilityChecker,
    platformSecurityRepository,
  );
}
