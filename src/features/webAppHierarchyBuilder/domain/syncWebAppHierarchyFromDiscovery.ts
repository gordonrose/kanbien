import type { WebAppSurfaceDiscoveryIntegrationSeam } from "../../webAppSurfaceDiscovery";
import { DiscoverySyncConflictError } from "../contract/errors";
import {
  computeResolvedFullRoutePaths,
  createWebAppHierarchyId,
  ensureLiveRouteChangeAllowed,
  normalizeKey,
  requireRootFamily,
} from "./helpers";
import { buildResolvedWebAppHierarchyTree } from "./presenters";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type {
  SyncWebAppHierarchyFromDiscoveryInput,
  WebAppHierarchyDiscoverySyncBlockedSurface,
  WebAppHierarchyDiscoverySyncResult,
  WebAppRootFamilyData,
} from "./types";

const AUTO_DISCOVERY_MODULE_SUFFIX = "discovered-routes";
const AUTO_DISCOVERY_BOOTSTRAP_SOURCE = "surface-discovery-sync";

function titleCaseSegment(segment: string): string {
  return segment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildAutoDiscoveryModuleKey(rootFamilyId: string): string {
  return normalizeKey(`${rootFamilyId}-${AUTO_DISCOVERY_MODULE_SUFFIX}`);
}

function buildAutoDiscoveryModuleLabel(rootFamily: WebAppRootFamilyData): string {
  return `${rootFamily.displayLabel} Discovered Routes`;
}

function buildDiscoveredPageKey(rootFamilyId: string, routeSegment: string): string {
  return normalizeKey(`${rootFamilyId}-${routeSegment}`);
}

function collectBlockedSurface(
  blockedSurfaces: WebAppHierarchyDiscoverySyncBlockedSurface[],
  discoveredWebAppSurfaceId: string,
  canonicalLocator: string,
  reason: WebAppHierarchyDiscoverySyncBlockedSurface["reason"],
): void {
  blockedSurfaces.push({
    discoveredWebAppSurfaceId,
    canonicalLocator,
    reason,
  });
}

function toRelativeSegments(
  routePath: string,
  rootFamily: WebAppRootFamilyData,
): string[] | null {
  if (!routePath.startsWith(rootFamily.routePrefix)) {
    return null;
  }

  const relativePath = routePath.slice(rootFamily.routePrefix.length).replace(/^\/+/, "");
  if (!relativePath) {
    return [];
  }

  return relativePath
    .split("/")
    .map((segment) => normalizeKey(segment))
    .filter(Boolean);
}

async function ensureAutoDiscoveryModule(
  repository: WebAppHierarchyRepository,
  rootFamily: WebAppRootFamilyData,
): Promise<{ webAppModuleId: string; created: boolean }> {
  const moduleKey = buildAutoDiscoveryModuleKey(rootFamily.rootFamilyId);
  const existing = await repository.findModuleByKey(moduleKey);

  if (existing) {
    return { webAppModuleId: existing.webAppModuleId, created: false };
  }

  const created = await repository.createModule({
    webAppModuleId: createWebAppHierarchyId(),
    rootFamilyId: rootFamily.rootFamilyId,
    moduleKey,
    displayLabel: buildAutoDiscoveryModuleLabel(rootFamily),
    status: "review",
    sortOrder: 999,
  });

  return { webAppModuleId: created.webAppModuleId, created: true };
}

export async function syncWebAppHierarchyFromDiscovery(
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam,
  input: SyncWebAppHierarchyFromDiscoveryInput,
): Promise<WebAppHierarchyDiscoverySyncResult> {
  let discoveryRun;
  try {
    discoveryRun = await discoverySeam.runCurrentApprovedRootFamilyDiscovery({
      createdByRootAdminUserId: input.createdByRootAdminUserId,
    });
  } catch {
    throw new DiscoverySyncConflictError({
      field: "discovery",
      reason: "discovery_run_failed",
    });
  }

  const [rootFamilies, currentSurfaces, staleSurfaces, existingPages] = await Promise.all([
    repository.listRootFamilies(),
    discoverySeam.listDiscoveredWebAppSurfaces({ staleStatus: "current" }),
    discoverySeam.listDiscoveredWebAppSurfaces({ staleStatus: "stale" }),
    repository.listPages(),
  ]);

  const blockedSurfaces: WebAppHierarchyDiscoverySyncBlockedSurface[] = [];
  const moduleCache = new Map<string, { webAppModuleId: string; created: boolean }>();

  let importCandidateCount = 0;
  let createdModuleCount = 0;
  let createdPageCount = 0;
  let updatedPageCount = 0;
  let unchangedMappedSurfaceCount = 0;
  let supportOnlySkippedCount = 0;
  let reviewRequiredSkippedCount = 0;
  let nonPageSurfaceSkippedCount = 0;

  for (const surface of currentSurfaces) {
    if (surface.staleAt) {
      collectBlockedSurface(
        blockedSurfaces,
        surface.discoveredWebAppSurfaceId,
        surface.canonicalLocator,
        "stale_surface",
      );
      continue;
    }

    if (surface.userFacingDisposition === "support-only") {
      supportOnlySkippedCount += 1;
      continue;
    }

    if (surface.userFacingDisposition === "review-required") {
      reviewRequiredSkippedCount += 1;
      continue;
    }

    if (surface.surfaceKind !== "page-route") {
      nonPageSurfaceSkippedCount += 1;
      continue;
    }

    if (surface.locatorType !== "path" || !surface.routePath) {
      collectBlockedSurface(
        blockedSurfaces,
        surface.discoveredWebAppSurfaceId,
        surface.canonicalLocator,
        "unsupported_locator_type",
      );
      continue;
    }

    const rootFamily = requireRootFamily(rootFamilies, surface.rootFamilyId);
    const relativeSegments = toRelativeSegments(surface.routePath, rootFamily);
    if (!relativeSegments) {
      collectBlockedSurface(
        blockedSurfaces,
        surface.discoveredWebAppSurfaceId,
        surface.canonicalLocator,
        "unsupported_root_path",
      );
      continue;
    }
    if (relativeSegments.length === 0) {
      collectBlockedSurface(
        blockedSurfaces,
        surface.discoveredWebAppSurfaceId,
        surface.canonicalLocator,
        "unsupported_root_index_path",
      );
      continue;
    }
    if (relativeSegments.length > 1) {
      collectBlockedSurface(
        blockedSurfaces,
        surface.discoveredWebAppSurfaceId,
        surface.canonicalLocator,
        "unsupported_multi_segment_path",
      );
      continue;
    }

    importCandidateCount += 1;
    const routeSegment = relativeSegments[0]!;
    const moduleKey = buildAutoDiscoveryModuleKey(rootFamily.rootFamilyId);
    let module = moduleCache.get(moduleKey);
    if (!module) {
      module = await ensureAutoDiscoveryModule(repository, rootFamily);
      moduleCache.set(moduleKey, module);
      if (module.created) {
        createdModuleCount += 1;
      }
    }

    const pageKey = buildDiscoveredPageKey(rootFamily.rootFamilyId, routeSegment);
    const existingPage = await repository.findPageByKey(pageKey);
    if (existingPage && existingPage.rootFamilyId !== rootFamily.rootFamilyId) {
      collectBlockedSurface(
        blockedSurfaces,
        surface.discoveredWebAppSurfaceId,
        surface.canonicalLocator,
        "generated_page_key_conflict",
      );
      continue;
    }

    if (!existingPage) {
      await repository.createPage({
        webAppPageId: createWebAppHierarchyId(),
        rootFamilyId: rootFamily.rootFamilyId,
        webAppModuleId: module.webAppModuleId,
        parentPageId: null,
        placementType: "module-root",
        pageKey,
        displayLabel: surface.displayLabel?.trim() || titleCaseSegment(routeSegment),
        routeSegment,
        status: "review",
        sortOrder: 999,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        bootstrapSource: AUTO_DISCOVERY_BOOTSTRAP_SOURCE,
        topologyState: "applied",
        templateKey: null,
        materializedAt: null,
      });
      createdPageCount += 1;
      continue;
    }

    const routeAffectingChange =
      existingPage.rootFamilyId !== rootFamily.rootFamilyId ||
      existingPage.webAppModuleId !== module.webAppModuleId ||
      existingPage.parentPageId !== null ||
      existingPage.placementType !== "module-root" ||
      existingPage.routeSegment !== routeSegment;

    if (routeAffectingChange) {
      try {
        ensureLiveRouteChangeAllowed(existingPages, existingPage.webAppPageId);
      } catch {
        collectBlockedSurface(
          blockedSurfaces,
          surface.discoveredWebAppSurfaceId,
          surface.canonicalLocator,
          "live_route_change_blocked",
        );
        continue;
      }
    }

    const displayLabel = surface.displayLabel?.trim() || titleCaseSegment(routeSegment);
    const metadataChanged =
      existingPage.displayLabel !== displayLabel ||
      existingPage.status !== "review" ||
      existingPage.routeSegment !== routeSegment;

    const placementChanged =
      existingPage.rootFamilyId !== rootFamily.rootFamilyId ||
      existingPage.webAppModuleId !== module.webAppModuleId ||
      existingPage.parentPageId !== null ||
      existingPage.placementType !== "module-root";

    if (placementChanged) {
      await repository.bootstrapUpsertPage({
        webAppPageId: existingPage.webAppPageId,
        rootFamilyId: rootFamily.rootFamilyId,
        webAppModuleId: module.webAppModuleId,
        parentPageId: null,
        placementType: "module-root",
        pageKey,
        displayLabel,
        routeSegment,
        status: "review",
        sortOrder: existingPage.sortOrder,
        createdByRootAdminUserId: existingPage.createdByRootAdminUserId,
        bootstrapSource: AUTO_DISCOVERY_BOOTSTRAP_SOURCE,
        topologyState: "applied",
        templateKey: null,
        materializedAt: null,
      });
      updatedPageCount += 1;
      continue;
    }

    if (metadataChanged || existingPage.bootstrapSource !== AUTO_DISCOVERY_BOOTSTRAP_SOURCE) {
      await repository.bootstrapUpsertPage({
        webAppPageId: existingPage.webAppPageId,
        rootFamilyId: rootFamily.rootFamilyId,
        webAppModuleId: existingPage.webAppModuleId,
        parentPageId: existingPage.parentPageId,
        placementType: existingPage.placementType,
        pageKey,
        displayLabel,
        routeSegment,
        status: "review",
        sortOrder: existingPage.sortOrder,
        createdByRootAdminUserId: existingPage.createdByRootAdminUserId,
        bootstrapSource: AUTO_DISCOVERY_BOOTSTRAP_SOURCE,
        topologyState: "applied",
        templateKey: null,
        materializedAt: null,
      });
      updatedPageCount += 1;
      continue;
    }

    unchangedMappedSurfaceCount += 1;
  }

  const [refreshedRootFamilies, refreshedModules, refreshedPages] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
  ]);
  await repository.updateResolvedFullRoutePaths(
    computeResolvedFullRoutePaths(refreshedRootFamilies, refreshedPages),
  );
  const finalPages = await repository.listPages();

  return {
    discoveryRun: {
      webAppDiscoveryRunId: discoveryRun.webAppDiscoveryRunId,
      status: discoveryRun.status,
      createdCount: discoveryRun.createdCount,
      refreshedCount: discoveryRun.refreshedCount,
      unchangedCount: discoveryRun.unchangedCount,
      staleCount: discoveryRun.staleCount,
      supportOnlyCount: discoveryRun.supportOnlyCount,
      reviewRequiredCount: discoveryRun.reviewRequiredCount,
      startedAt: discoveryRun.startedAt.toISOString(),
      completedAt: discoveryRun.completedAt?.toISOString() ?? null,
    },
    syncSummary: {
      currentDiscoveredSurfaceCount: currentSurfaces.length,
      totalStaleDiscoveredSurfaceCount: staleSurfaces.length,
      importCandidateCount,
      createdModuleCount,
      createdPageCount,
      updatedPageCount,
      unchangedMappedSurfaceCount,
      blockedSurfaceCount: blockedSurfaces.length,
      supportOnlySkippedCount,
      reviewRequiredSkippedCount,
      nonPageSurfaceSkippedCount,
    },
    blockedSurfaces,
    tree: buildResolvedWebAppHierarchyTree(
      refreshedRootFamilies,
      refreshedModules,
      finalPages,
      input.includeInactive ?? false,
      input.includeOrphaned ?? false,
    ),
  };
}
