import {
  InvalidPlacementError,
  PageLocatorConflictError,
  RouteSegmentAlreadyExistsError,
} from "../contract/errors";
import { buildResolvedWebAppHierarchyTree } from "./presenters";
import type { DesignSystemCanonicalsPublicSeam } from "../../designSystemCanonicals";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type {
  DesignSystemCanonicalRenderingTreeSyncResult,
  WebAppModuleData,
  WebAppPageData,
  WebAppRootFamilyData,
} from "./types";
import {
  computeResolvedFullRoutePaths,
  createWebAppHierarchyId,
  normalizeKey,
  requireRootFamily,
} from "./helpers";

const DESIGN_SYSTEM_ROOT_FAMILY_ID = "design-system";
const CANONICAL_RENDERINGS_MODULE_KEY = "canonical-renderings";
const CANONICAL_RENDERINGS_BOOTSTRAP_SOURCE = "canonical-renderings-sync";

interface SyncInput {
  createdByRootAdminUserId: string;
}

function routeSegmentFromPath(routePath: string): string {
  const segments = routePath.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

function pageKeyFromPath(routePath: string): string {
  return normalizeKey(routePath.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).join("-"));
}

function assertRouteSlotAvailable(input: {
  existingRoutePage: WebAppPageData | null;
  existingPage: WebAppPageData | null;
}): void {
  if (!input.existingRoutePage || input.existingRoutePage.webAppPageId === input.existingPage?.webAppPageId) {
    return;
  }

  throw new RouteSegmentAlreadyExistsError();
}

async function ensureCanonicalRenderingsModule(
  repository: WebAppHierarchyRepository,
): Promise<{ module: WebAppModuleData; created: boolean }> {
  const existing = await repository.findModuleByKey(CANONICAL_RENDERINGS_MODULE_KEY);
  if (existing) {
    if (existing.rootFamilyId !== DESIGN_SYSTEM_ROOT_FAMILY_ID) {
      throw new InvalidPlacementError({
        field: "moduleKey",
        reason: "canonical_renderings_module_outside_design_system",
      });
    }
    return { module: existing, created: false };
  }

  return {
    module: await repository.createModule({
      webAppModuleId: createWebAppHierarchyId(),
      rootFamilyId: DESIGN_SYSTEM_ROOT_FAMILY_ID,
      moduleKey: CANONICAL_RENDERINGS_MODULE_KEY,
      displayLabel: "Canonical Renderings",
      landingPageWebAppPageId: null,
      status: "live",
      sortOrder: 1,
    }),
    created: true,
  };
}

async function upsertCanonicalPage(input: {
  repository: WebAppHierarchyRepository;
  module: WebAppModuleData;
  parentPageId: string | null;
  routePath: string;
  displayLabel: string;
  sortOrder: number;
  templateKey: "launcher" | "canonical-rendering";
  createdByRootAdminUserId: string;
  materializedAt: Date;
}): Promise<{ page: WebAppPageData; created: boolean }> {
  const pageKey = pageKeyFromPath(input.routePath);
  const routeSegment = routeSegmentFromPath(input.routePath);
  const existingPage = await input.repository.findPageByKey(pageKey);
  const placementType = input.parentPageId ? "child-page" : "module-root";
  const existingRoutePage = await input.repository.findPageByPlacementRoute(
    input.module.webAppModuleId,
    input.parentPageId,
    placementType,
    routeSegment,
  );
  assertRouteSlotAvailable({ existingRoutePage, existingPage });

  return {
    page: await input.repository.bootstrapUpsertPage({
      webAppPageId: existingPage?.webAppPageId ?? createWebAppHierarchyId(),
      rootFamilyId: DESIGN_SYSTEM_ROOT_FAMILY_ID,
      webAppModuleId: input.module.webAppModuleId,
      parentPageId: input.parentPageId,
      placementType,
      pageKey,
      displayLabel: input.displayLabel,
      routeSegment,
      status: "live",
      sortOrder: input.sortOrder,
      createdByRootAdminUserId: existingPage?.createdByRootAdminUserId ?? input.createdByRootAdminUserId,
      bootstrapSource: CANONICAL_RENDERINGS_BOOTSTRAP_SOURCE,
      topologyState: "applied",
      templateKey: input.templateKey,
      materializedAt: existingPage?.materializedAt ?? input.materializedAt,
    }),
    created: !existingPage,
  };
}

async function upsertCanonicalLocator(input: {
  repository: WebAppHierarchyRepository;
  page: WebAppPageData;
  routePath: string;
  createdByRootAdminUserId: string;
}): Promise<boolean> {
  const normalizedLocatorKey = normalizeKey(input.routePath);
  const existingLocator = await input.repository.findActivePageLocatorByNormalizedKey(normalizedLocatorKey);
  if (existingLocator && existingLocator.webAppPageId !== input.page.webAppPageId) {
    throw new PageLocatorConflictError({
      field: "routePath",
      reason: "duplicate_active_locator",
    });
  }

  const existingPageLocator = await input.repository.findActivePageLocatorByPageId(input.page.webAppPageId);
  const unchanged =
    existingPageLocator?.locatorType === "path" &&
    existingPageLocator?.routePath === input.routePath &&
    existingPageLocator?.canonicalLocator === input.routePath &&
    existingPageLocator?.isActive === true;

  if (unchanged) {
    return false;
  }

  await input.repository.upsertActivePageLocator({
    webAppPageLocatorId: createWebAppHierarchyId(),
    webAppPageId: input.page.webAppPageId,
    rootFamilyId: DESIGN_SYSTEM_ROOT_FAMILY_ID,
    locatorType: "path",
    canonicalLocator: input.routePath,
    routePath: input.routePath,
    routeHash: null,
    normalizedLocatorKey,
    createdByRootAdminUserId: input.createdByRootAdminUserId,
  });
  return true;
}

function buildDesignSystemTree(
  rootFamilies: WebAppRootFamilyData[],
  modules: WebAppModuleData[],
  pages: WebAppPageData[],
): DesignSystemCanonicalRenderingTreeSyncResult["tree"] {
  return buildResolvedWebAppHierarchyTree(
    rootFamilies.filter((rootFamily) => rootFamily.rootFamilyId === DESIGN_SYSTEM_ROOT_FAMILY_ID),
    modules.filter((module) => module.rootFamilyId === DESIGN_SYSTEM_ROOT_FAMILY_ID),
    pages.filter((page) => page.rootFamilyId === DESIGN_SYSTEM_ROOT_FAMILY_ID && page.topologyState === "applied"),
    false,
    false,
  );
}

export async function syncDesignSystemCanonicalRenderingsIntoHierarchy(
  repository: WebAppHierarchyRepository,
  canonicalSeam: DesignSystemCanonicalsPublicSeam,
  input: SyncInput,
): Promise<DesignSystemCanonicalRenderingTreeSyncResult> {
  const canonicalNodes = await canonicalSeam.listLiveHierarchyNodes();
  const rootFamilies = await repository.listRootFamilies();
  requireRootFamily(rootFamilies, DESIGN_SYSTEM_ROOT_FAMILY_ID);

  const materializedAt = new Date();
  const moduleResult = await ensureCanonicalRenderingsModule(repository);
  let createdPageCount = 0;
  let refreshedPageCount = 0;
  let refreshedLocatorCount = 0;

  const rootPageResult = await upsertCanonicalPage({
    repository,
    module: moduleResult.module,
    parentPageId: null,
    routePath: "/design-system/canonical-renderings",
    displayLabel: "Canonical Renderings",
    sortOrder: 0,
    templateKey: "launcher",
    createdByRootAdminUserId: input.createdByRootAdminUserId,
    materializedAt,
  });
  createdPageCount += rootPageResult.created ? 1 : 0;
  refreshedPageCount += rootPageResult.created ? 0 : 1;
  refreshedLocatorCount += (await upsertCanonicalLocator({
    repository,
    page: rootPageResult.page,
    routePath: "/design-system/canonical-renderings",
    createdByRootAdminUserId: input.createdByRootAdminUserId,
  })) ? 1 : 0;

  for (const [familyIndex, family] of canonicalNodes.entries()) {
    const familyPageResult = await upsertCanonicalPage({
      repository,
      module: moduleResult.module,
      parentPageId: rootPageResult.page.webAppPageId,
      routePath: family.launcherRoutePath,
      displayLabel: family.familyDisplayLabel,
      sortOrder: (familyIndex + 1) * 100,
      templateKey: family.launcherTemplateKey,
      createdByRootAdminUserId: input.createdByRootAdminUserId,
      materializedAt,
    });
    createdPageCount += familyPageResult.created ? 1 : 0;
    refreshedPageCount += familyPageResult.created ? 0 : 1;
    refreshedLocatorCount += (await upsertCanonicalLocator({
      repository,
      page: familyPageResult.page,
      routePath: family.launcherRoutePath,
      createdByRootAdminUserId: input.createdByRootAdminUserId,
    })) ? 1 : 0;

    for (const [referenceIndex, reference] of family.references.entries()) {
      const referencePageResult = await upsertCanonicalPage({
        repository,
        module: moduleResult.module,
        parentPageId: familyPageResult.page.webAppPageId,
        routePath: reference.renderRoutePath,
        displayLabel: `${reference.referenceId} ${reference.displayLabel}`,
        sortOrder: (referenceIndex + 1) * 10,
        templateKey: family.renderTemplateKey,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        materializedAt,
      });
      createdPageCount += referencePageResult.created ? 1 : 0;
      refreshedPageCount += referencePageResult.created ? 0 : 1;
      refreshedLocatorCount += (await upsertCanonicalLocator({
        repository,
        page: referencePageResult.page,
        routePath: reference.renderRoutePath,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
      })) ? 1 : 0;
    }
  }

  const refreshedPages = await repository.listPages();
  await repository.updateResolvedFullRoutePaths(computeResolvedFullRoutePaths(rootFamilies, refreshedPages));
  const [modules, pages, locators] = await Promise.all([
    repository.listModules(),
    repository.listPages(),
    repository.listPageLocators(),
  ]);
  const activeLocatorByPageId = new Map(
    locators.filter((locator) => locator.isActive).map((locator) => [locator.webAppPageId, locator]),
  );

  return {
    syncSummary: {
      liveFamilyCount: canonicalNodes.length,
      liveReferenceCount: canonicalNodes.reduce((sum, family) => sum + family.references.length, 0),
      createdModuleCount: moduleResult.created ? 1 : 0,
      createdPageCount,
      refreshedPageCount,
      refreshedLocatorCount,
    },
    tree: buildDesignSystemTree(
      rootFamilies,
      modules,
      pages.map((page) => ({
        ...page,
        activeLocator: activeLocatorByPageId.get(page.webAppPageId) ?? page.activeLocator ?? null,
      })),
    ),
  };
}
