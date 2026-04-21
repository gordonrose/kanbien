import type {
  WebAppHierarchyDiscoveryLink,
  WebAppHierarchyDiscoveryLinkListResponse,
  WebAppPageLocator,
  PlannerSelectableHierarchyNode,
  ResolvedWebAppHierarchyTree,
  ResolvedWebAppModuleTreeNode,
  ResolvedWebAppPageTreeNode,
  WebAppModule,
  WebAppPage,
  WebAppRootFamily,
} from "../contract/types";
import type {
  ListWebAppHierarchyDiscoveryLinksInput,
  WebAppDiscoveryLinkData,
  WebAppModuleData,
  WebAppPageData,
  WebAppPageLocatorData,
  WebAppRootFamilyData,
} from "./types";

function toIsoString(value: Date): string {
  return value.toISOString();
}

export function toWebAppRootFamily(rootFamily: WebAppRootFamilyData): WebAppRootFamily {
  return {
    rootFamilyId: rootFamily.rootFamilyId,
    displayLabel: rootFamily.displayLabel,
    routePrefix: rootFamily.routePrefix,
    sortOrder: rootFamily.sortOrder,
    createdAt: toIsoString(rootFamily.createdAt),
    updatedAt: toIsoString(rootFamily.updatedAt),
  };
}

export function toWebAppModule(module: WebAppModuleData): WebAppModule {
  return {
    webAppModuleId: module.webAppModuleId,
    rootFamilyId: module.rootFamilyId,
    moduleKey: module.moduleKey,
    displayLabel: module.displayLabel,
    landingPageWebAppPageId: module.landingPageWebAppPageId,
    status: module.status,
    sortOrder: module.sortOrder,
    createdAt: toIsoString(module.createdAt),
    updatedAt: toIsoString(module.updatedAt),
  };
}

export function toWebAppPage(page: WebAppPageData): WebAppPage {
  const activeLocator = page.activeLocator ? toWebAppPageLocator(page.activeLocator) : null;

  return {
    webAppPageId: page.webAppPageId,
    rootFamilyId: page.rootFamilyId,
    webAppModuleId: page.webAppModuleId,
    parentPageId: page.parentPageId,
    placementType: page.placementType,
    pageKey: page.pageKey,
    displayLabel: page.displayLabel,
    routeSegment: page.routeSegment,
    resolvedFullRoutePath: activeLocator?.canonicalLocator ?? page.resolvedFullRoutePath,
    status: page.status,
    sortOrder: page.sortOrder,
    createdByRootAdminUserId: page.createdByRootAdminUserId,
    bootstrapSource: page.bootstrapSource,
    topologyState: page.topologyState,
    templateKey: page.templateKey,
    materializedAt: page.materializedAt ? toIsoString(page.materializedAt) : null,
    createdAt: toIsoString(page.createdAt),
    updatedAt: toIsoString(page.updatedAt),
    activeLocator,
  };
}

export function toWebAppPageLocator(locator: WebAppPageLocatorData): WebAppPageLocator {
  return {
    webAppPageLocatorId: locator.webAppPageLocatorId,
    webAppPageId: locator.webAppPageId,
    rootFamilyId: locator.rootFamilyId,
    locatorType: locator.locatorType,
    canonicalLocator: locator.canonicalLocator,
    routePath: locator.routePath,
    routeHash: locator.routeHash,
    normalizedLocatorKey: locator.normalizedLocatorKey,
    isActive: locator.isActive,
    createdByRootAdminUserId: locator.createdByRootAdminUserId,
    createdAt: toIsoString(locator.createdAt),
    updatedAt: toIsoString(locator.updatedAt),
  };
}

export function toWebAppHierarchyDiscoveryLink(
  link: WebAppDiscoveryLinkData,
): WebAppHierarchyDiscoveryLink {
  return {
    webAppDiscoveryLinkId: link.webAppDiscoveryLinkId,
    discoveredWebAppStructureNodeId: link.discoveredWebAppStructureNodeId,
    discoveredWebAppSurfaceId: link.discoveredWebAppSurfaceId,
    rootFamilyId: link.rootFamilyId,
    curatedTargetType: link.curatedTargetType,
    curatedWebAppModuleId: link.curatedWebAppModuleId,
    curatedWebAppPageId: link.curatedWebAppPageId,
    linkStatus: link.linkStatus,
    driftStatus: link.driftStatus,
    driftSummary: link.driftSummary,
    lastComparedWebAppDiscoveryRunId: link.lastComparedWebAppDiscoveryRunId,
    lastMatchedWebAppDiscoveryRunId: link.lastMatchedWebAppDiscoveryRunId,
    createdAt: toIsoString(link.createdAt),
    updatedAt: toIsoString(link.updatedAt),
  };
}

function compareModules(left: WebAppModuleData, right: WebAppModuleData): number {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }
  return left.moduleKey.localeCompare(right.moduleKey);
}

function comparePages(left: WebAppPageData, right: WebAppPageData): number {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }
  return left.pageKey.localeCompare(right.pageKey);
}

function buildPageTree(
  pages: WebAppPageData[],
  parentPageId: string | null,
  includeInactive: boolean,
): ResolvedWebAppPageTreeNode[] {
  return pages
    .filter(
      (page) =>
        page.parentPageId === parentPageId &&
        page.placementType !== "orphaned" &&
        (includeInactive || page.status !== "inactive"),
    )
    .sort(comparePages)
    .map((page) => ({
      ...toWebAppPage(page),
      children: buildPageTree(pages, page.webAppPageId, includeInactive),
    }));
}

export function buildResolvedWebAppHierarchyTree(
  rootFamilies: WebAppRootFamilyData[],
  modules: WebAppModuleData[],
  pages: WebAppPageData[],
  includeInactive: boolean,
  includeOrphaned: boolean,
): ResolvedWebAppHierarchyTree {
  return {
    rootFamilies: [...rootFamilies]
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((rootFamily) => ({
        ...toWebAppRootFamily(rootFamily),
        modules: modules
          .filter(
            (module) =>
              module.rootFamilyId === rootFamily.rootFamilyId &&
              (includeInactive || module.status !== "inactive"),
          )
          .sort(compareModules)
          .map((module): ResolvedWebAppModuleTreeNode => {
            const modulePages = pages.filter((page) => page.webAppModuleId === module.webAppModuleId);
            return {
              ...toWebAppModule(module),
              pages: buildPageTree(
                modulePages.filter((page) => page.placementType === "module-root" || page.parentPageId !== null),
                null,
                includeInactive,
              ),
              ...(includeOrphaned
                ? {
                    orphanedPages: modulePages
                      .filter(
                        (page) =>
                          page.placementType === "orphaned" &&
                          (includeInactive || page.status !== "inactive"),
                      )
                      .sort(comparePages)
                      .map((page) => ({ ...toWebAppPage(page), children: [] })),
                  }
                : {}),
            };
          }),
      })),
  };
}

export function buildWebAppHierarchyDiscoveryLinkListResponse(
  links: WebAppDiscoveryLinkData[],
  input: ListWebAppHierarchyDiscoveryLinksInput,
): WebAppHierarchyDiscoveryLinkListResponse {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 25;
  const start = (page - 1) * pageSize;
  const items = links.slice(start, start + pageSize).map(toWebAppHierarchyDiscoveryLink);

  return {
    items,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(links.length / pageSize)),
    totalMatchingRecords: links.length,
  };
}

export function buildPlannerSelectableHierarchyNodes(
  modules: WebAppModuleData[],
  pages: WebAppPageData[],
  includeInactive: boolean,
): PlannerSelectableHierarchyNode[] {
  const moduleMap = new Map(modules.map((module) => [module.webAppModuleId, module]));
  const items: PlannerSelectableHierarchyNode[] = [];

  for (const module of [...modules].sort(compareModules)) {
    if (!includeInactive && module.status === "inactive") {
      continue;
    }
    items.push({
      nodeType: "module",
      rootFamilyId: module.rootFamilyId,
      webAppModuleId: module.webAppModuleId,
      webAppPageId: null,
      parentPageId: null,
      moduleKey: module.moduleKey,
      pageKey: null,
      displayLabel: module.displayLabel,
      resolvedFullRoutePath: null,
      status: module.status,
      placementType: null,
    });
  }

  for (const page of [...pages].sort(comparePages)) {
    if (!includeInactive && page.status === "inactive") {
      continue;
    }
    if (page.placementType === "orphaned") {
      continue;
    }
    const module = moduleMap.get(page.webAppModuleId);
    if (!module) {
      continue;
    }
    items.push({
      nodeType: "page",
      rootFamilyId: page.rootFamilyId,
      webAppModuleId: page.webAppModuleId,
      webAppPageId: page.webAppPageId,
      parentPageId: page.parentPageId,
      moduleKey: module.moduleKey,
      pageKey: page.pageKey,
      displayLabel: page.displayLabel,
      resolvedFullRoutePath: page.resolvedFullRoutePath,
      status: page.status,
      placementType: page.placementType,
    });
  }

  return items;
}
