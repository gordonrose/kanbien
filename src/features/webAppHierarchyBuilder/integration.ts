import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import {
  createWebAppSurfaceDiscoveryIntegrationSeam,
} from "../webAppSurfaceDiscovery";
import { createDesignSystemCanonicalsIntegrationSeam } from "../designSystemCanonicals";
import { createFilesystemDesignSystemMaterializer } from "./domain/designSystemMaterializer";
import { createWebAppHierarchyBuilderService } from "./domain/service";
import type { WebAppPageStatus, WebAppRootFamilyId, WebAppTopologyState } from "./domain/types";
import { createPostgresWebAppHierarchyRepository } from "./persistence/postgresRepository";
import { createPublicWebAppHierarchyBuilderRouter } from "./transport/publicRouter";
import { createWebAppHierarchyBuilderRouter } from "./transport/router";

export interface WebAppHierarchySettingsSelectablePage {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId: string | null;
  pageKey: string;
  displayLabel: string;
  resolvedFullRoutePath: string | null;
  status: WebAppPageStatus;
  topologyState: WebAppTopologyState;
  templateKey: string | null;
}

export interface WebAppHierarchyIntegrationSeam {
  getPageById(webAppPageId: string): Promise<WebAppHierarchySettingsSelectablePage | null>;
  listPagesByRootFamily(input: {
    rootFamilyId: WebAppRootFamilyId;
  }): Promise<WebAppHierarchySettingsSelectablePage[]>;
  listSelectablePagesForSettings(input: {
    ownerWebAppPageId: string;
  }): Promise<WebAppHierarchySettingsSelectablePage[]>;
}

function toSelectablePage(page: {
  webAppPageId: string;
  rootFamilyId: WebAppRootFamilyId;
  webAppModuleId: string;
  parentPageId: string | null;
  pageKey: string;
  displayLabel: string;
  resolvedFullRoutePath: string | null;
  status: WebAppPageStatus;
  topologyState: WebAppTopologyState;
  templateKey: string | null;
}): WebAppHierarchySettingsSelectablePage {
  return {
    webAppPageId: page.webAppPageId,
    rootFamilyId: page.rootFamilyId,
    webAppModuleId: page.webAppModuleId,
    parentPageId: page.parentPageId,
    pageKey: page.pageKey,
    displayLabel: page.displayLabel,
    resolvedFullRoutePath: page.resolvedFullRoutePath,
    status: page.status,
    topologyState: page.topologyState,
    templateKey: page.templateKey,
  };
}

export function createWebAppHierarchyIntegrationSeam(dbPool: Pool): WebAppHierarchyIntegrationSeam {
  const repository = createPostgresWebAppHierarchyRepository(dbPool);

  return {
    async getPageById(webAppPageId) {
      const page = await repository.findPageById(webAppPageId);
      return page ? toSelectablePage(page) : null;
    },
    async listPagesByRootFamily(input) {
      const pages = await repository.listPages();
      return pages
        .filter((page) => page.rootFamilyId === input.rootFamilyId)
        .filter((page) => page.placementType !== "orphaned")
        .filter((page) => page.status !== "inactive")
        .map(toSelectablePage);
    },
    async listSelectablePagesForSettings(input) {
      const owner = await repository.findPageById(input.ownerWebAppPageId);
      if (!owner) {
        return [];
      }

      return this.listPagesByRootFamily({ rootFamilyId: owner.rootFamilyId });
    },
  };
}

export function createWebAppHierarchyBuilderFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const repository = createPostgresWebAppHierarchyRepository(dbPool);
  const service = createWebAppHierarchyBuilderService(
    repository,
    createWebAppSurfaceDiscoveryIntegrationSeam(dbPool),
    createFilesystemDesignSystemMaterializer(process.cwd()),
    createDesignSystemCanonicalsIntegrationSeam(dbPool),
  );

  return createWebAppHierarchyBuilderRouter(
    service,
    capabilityChecker,
    platformSecurityRepository,
  );
}

export function createPublicWebAppHierarchyBuilderFeature(
  dbPool: Pool,
) {
  const repository = createPostgresWebAppHierarchyRepository(dbPool);
  const service = createWebAppHierarchyBuilderService(
    repository,
    createWebAppSurfaceDiscoveryIntegrationSeam(dbPool),
    createFilesystemDesignSystemMaterializer(process.cwd()),
    createDesignSystemCanonicalsIntegrationSeam(dbPool),
  );

  return createPublicWebAppHierarchyBuilderRouter(service);
}
