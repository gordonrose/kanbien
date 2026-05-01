import type { WebAppSurfaceDiscoveryIntegrationSeam } from "../../webAppSurfaceDiscovery";
import type {
  DiscoveredWebAppSurfaceData,
  DiscoveredWebAppStructureNodeData,
  WebAppDiscoveryRunData,
} from "../../webAppSurfaceDiscovery";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import { DiscoveryLinkConflictError, PageLocatorConflictError } from "../contract/errors";
import { createWebAppHierarchyId, normalizeKey, requireRootFamily } from "./helpers";
import { buildResolvedWebAppHierarchyTree } from "./presenters";
import type {
  ApplyStructureAwareWebAppHierarchySyncInput,
  PreviewStructureAwareWebAppHierarchySyncInput,
  ResolvedWebAppHierarchyTree,
  WebAppDiscoveryDriftStatus,
  WebAppHierarchyDiscoverySyncBlockedSurface,
  WebAppHierarchyDiscoverySyncPreviewItem,
  WebAppHierarchyDiscoverySyncPreviewResult,
  WebAppHierarchyDiscoverySyncResult,
  WebAppHierarchyStructureAwareApplyResult,
  WebAppPageData,
  WebAppPageLocatorType,
  WebAppRootFamilyData,
} from "./types";

type BlockedReason = WebAppHierarchyDiscoverySyncPreviewItem["blockedReason"];

interface PlannedItem extends WebAppHierarchyDiscoverySyncPreviewItem {
  discoveredSegments: string[];
}

interface PlannedState {
  items: PlannedItem[];
  currentSurfaceCount: number;
  staleSurfaceCount: number;
  supportOnlySkippedCount: number;
  reviewRequiredSkippedCount: number;
  nonPageSurfaceSkippedCount: number;
}

function buildPlannedPageItem(input: {
  node: DiscoveredWebAppStructureNodeData;
  linkedSurface: DiscoveredWebAppSurfaceData | null;
  leafNode: DiscoveredWebAppStructureNodeData;
  chainNodeSegments: string[];
  rootFamily: WebAppRootFamilyData;
  rootFamilyId: DiscoveredWebAppStructureNodeData["rootFamilyId"];
  existingModule: { webAppModuleId: string } | null;
  existingPage: WebAppPageData | null;
  parentPage: WebAppPageData | null;
  moduleKey: string;
  pageDepth: number;
  includeMetadataDrift: boolean;
  activeLocatorByKey: Map<string, { webAppPageId: string }>;
  hasAmbiguousExistingMatch?: boolean;
}): PlannedItem {
  const desiredDisplayLabel = input.node.displayLabel ?? titleCaseSegment(input.node.nodeKey);
  const proposedLocatorType: WebAppPageLocatorType =
    input.node === input.leafNode && input.linkedSurface?.locatorType === "hash-state" ? "hash-state" : "path";
  const canonicalLocator =
    proposedLocatorType === "hash-state" && input.linkedSurface
      ? input.linkedSurface.canonicalLocator
      : buildCanonicalPath(input.rootFamily, input.chainNodeSegments);
  const normalizedLocatorKey = normalizeKey(canonicalLocator);
  const locatorOwner = input.activeLocatorByKey.get(normalizedLocatorKey) ?? null;
  const existingCanonical = input.existingPage?.activeLocator?.canonicalLocator
    ?? input.existingPage?.resolvedFullRoutePath
    ?? null;
  const wouldRewriteLiveLocator =
    Boolean(input.existingPage)
    && input.existingPage!.status === "live"
    && Boolean(existingCanonical)
    && existingCanonical !== canonicalLocator;
  const blockedReason: BlockedReason =
    input.hasAmbiguousExistingMatch
      ? "ambiguous_existing_match"
      : locatorOwner && locatorOwner.webAppPageId !== input.existingPage?.webAppPageId
        ? "locator_conflict"
        : wouldRewriteLiveLocator
          ? "locator_conflict"
          : input.leafNode.staleAt
            ? "stale_discovered"
            : null;
  const driftStatus =
    blockedReason === "ambiguous_existing_match"
      ? "blocked-ambiguity"
      : blockedReason === "stale_discovered"
      ? "stale-discovered"
      : blockedReason === "locator_conflict"
        ? "blocked-locator"
        : computeDriftStatus({
            existingPage: input.existingPage,
            desiredModuleId: input.existingModule?.webAppModuleId ?? null,
            desiredParentPageId: input.parentPage?.webAppPageId ?? null,
            desiredDisplayLabel,
            desiredCanonicalLocator: canonicalLocator,
            includeMetadataDrift: input.includeMetadataDrift,
          });

  return {
    itemType: "page",
    discoveredWebAppStructureNodeId: input.node.discoveredWebAppStructureNodeId,
    discoveredWebAppSurfaceId: input.linkedSurface?.discoveredWebAppSurfaceId ?? null,
    rootFamilyId: input.rootFamilyId,
    pageDepth: input.pageDepth,
    discoveredStructureKey: input.node.structureKey,
    displayLabel: desiredDisplayLabel,
    plannedAction: blockedReason ? "blocked" : input.existingPage ? "match" : "create",
    blockedReason,
    curatedTargetType: "page",
    curatedWebAppModuleId: input.existingModule?.webAppModuleId ?? null,
    curatedWebAppPageId: input.existingPage?.webAppPageId ?? null,
    pageKey: buildPageKey(input.rootFamilyId, input.chainNodeSegments),
    moduleKey: input.moduleKey,
    placementType: input.parentPage ? "child-page" : "module-root",
    proposedLocatorType,
    canonicalLocator,
    driftStatus,
    discoveredSegments: input.chainNodeSegments,
  };
}

function titleCaseSegment(segment: string): string {
  return segment
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSyntheticModuleKey(rootFamilyId: string): string {
  return normalizeKey(`${rootFamilyId}-discovered-routes`);
}

function buildSyntheticModuleLabel(rootFamily: WebAppRootFamilyData): string {
  return `${rootFamily.displayLabel} Discovered Pages`;
}

function buildPageKey(rootFamilyId: string, segments: string[]): string {
  return normalizeKey(`${rootFamilyId}-${segments.join("-")}`);
}

function buildCanonicalPath(rootFamily: WebAppRootFamilyData, segments: string[]): string {
  return `${rootFamily.routePrefix}/${segments.join("/")}`.replace(/\/+/g, "/");
}

function isPlausibleExistingPageMatch(input: {
  page: WebAppPageData;
  rootFamilyId: DiscoveredWebAppStructureNodeData["rootFamilyId"];
  pageKey: string;
  desiredDisplayLabel: string;
  desiredCanonicalLocator: string;
  desiredRouteSegment: string;
}): boolean {
  if (input.page.rootFamilyId !== input.rootFamilyId || input.page.pageKey === input.pageKey) {
    return false;
  }
  const existingCanonical = input.page.activeLocator?.canonicalLocator
    ?? input.page.resolvedFullRoutePath
    ?? null;
  return (
    existingCanonical === input.desiredCanonicalLocator
    || normalizeKey(input.page.displayLabel) === normalizeKey(input.desiredDisplayLabel)
    || input.page.normalizedRouteSegment === normalizeKey(input.desiredRouteSegment)
  );
}

function hasAmbiguousExistingPageMatch(input: {
  pages: WebAppPageData[];
  existingPage: WebAppPageData | null;
  rootFamilyId: DiscoveredWebAppStructureNodeData["rootFamilyId"];
  pageKey: string;
  desiredDisplayLabel: string;
  desiredCanonicalLocator: string;
  desiredRouteSegment: string;
}): boolean {
  if (input.existingPage) {
    return false;
  }
  return input.pages.filter((page) => isPlausibleExistingPageMatch({ ...input, page })).length > 1;
}

function comparePreviewItems(left: PlannedItem, right: PlannedItem): number {
  if (left.itemType !== right.itemType) {
    return left.itemType.localeCompare(right.itemType);
  }
  if (left.pageDepth !== right.pageDepth) {
    return left.pageDepth - right.pageDepth;
  }
  return left.discoveredStructureKey.localeCompare(right.discoveredStructureKey);
}

function buildAncestorPath(
  node: DiscoveredWebAppStructureNodeData,
  byId: Map<string, DiscoveredWebAppStructureNodeData>,
): DiscoveredWebAppStructureNodeData[] {
  const nodes: DiscoveredWebAppStructureNodeData[] = [];
  let current: DiscoveredWebAppStructureNodeData | null = node;
  while (current) {
    nodes.push(current);
    current = current.parentDiscoveredWebAppStructureNodeId
      ? byId.get(current.parentDiscoveredWebAppStructureNodeId) ?? null
      : null;
  }
  return nodes.reverse();
}

function isLeafNode(node: DiscoveredWebAppStructureNodeData): boolean {
  return node.nodeKind === "page-surface" || node.nodeKind === "shell-state-surface";
}

function computeDriftStatus(
  item: {
    existingPage: WebAppPageData | null;
    desiredModuleId: string | null;
    desiredParentPageId: string | null;
    desiredDisplayLabel: string;
    desiredCanonicalLocator: string | null;
    includeMetadataDrift: boolean;
  },
): WebAppDiscoveryDriftStatus {
  if (!item.existingPage) {
    return "none";
  }
  if (item.desiredCanonicalLocator) {
    const existingCanonical = item.existingPage.activeLocator?.canonicalLocator
      ?? item.existingPage.resolvedFullRoutePath;
    if (existingCanonical && existingCanonical !== item.desiredCanonicalLocator) {
      return "locator-drift";
    }
  }
  if (
    item.existingPage.webAppModuleId !== item.desiredModuleId ||
    item.existingPage.parentPageId !== item.desiredParentPageId
  ) {
    return "placement-drift";
  }
  if (
    item.includeMetadataDrift &&
    item.existingPage.displayLabel !== item.desiredDisplayLabel
  ) {
    return "metadata-drift";
  }
  return "none";
}

function dedupeItems(items: PlannedItem[]): PlannedItem[] {
  const deduped = new Map<string, PlannedItem>();
  for (const item of items) {
    const dedupeKey = `${item.itemType}:${item.discoveredWebAppStructureNodeId}`;
    const existing = deduped.get(dedupeKey);
    if (!existing || existing.plannedAction === "blocked") {
      deduped.set(dedupeKey, item);
    }
  }
  return [...deduped.values()].sort(comparePreviewItems);
}

async function buildPlannedState(
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam,
  input: PreviewStructureAwareWebAppHierarchySyncInput,
): Promise<PlannedState> {
  const staleStatus = input.includeStaleDiscovered ? "all" : "current";
  const [rootFamilies, modules, pages, locators, structureNodes, surfaces] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
    repository.listPageLocators(),
    discoverySeam.listDiscoveredWebAppStructureTree({ staleStatus }),
    discoverySeam.listDiscoveredWebAppSurfaces({ staleStatus }),
  ]);

  const pageWithLocators = pages.map((page) => ({
    ...page,
    activeLocator: locators.find((item) => item.webAppPageId === page.webAppPageId && item.isActive) ?? null,
  }));
  const pageByKey = new Map(pageWithLocators.map((page) => [page.pageKey, page]));
  const moduleByScopedKey = new Map(
    modules.map((module) => [`${module.rootFamilyId}:${module.moduleKey}`, module]),
  );
  const nodeById = new Map(structureNodes.map((node) => [node.discoveredWebAppStructureNodeId, node]));
  const surfaceById = new Map(surfaces.map((surface) => [surface.discoveredWebAppSurfaceId, surface]));
  const activeLocatorByKey = new Map(
    locators.filter((item) => item.isActive).map((item) => [item.normalizedLocatorKey, item]),
  );

  const selectedNodeIds = new Set(input.selectedDiscoveredWebAppStructureNodeIds ?? []);
  const scopedLeafNodes = structureNodes.filter((node) => {
    if (!isLeafNode(node)) {
      return false;
    }
    if (input.rootFamilyIds?.length && !input.rootFamilyIds.includes(node.rootFamilyId)) {
      return false;
    }
    if (selectedNodeIds.size === 0) {
      return true;
    }
    let current: DiscoveredWebAppStructureNodeData | null = node;
    while (current) {
      if (selectedNodeIds.has(current.discoveredWebAppStructureNodeId)) {
        return true;
      }
      current = current.parentDiscoveredWebAppStructureNodeId
        ? nodeById.get(current.parentDiscoveredWebAppStructureNodeId) ?? null
        : null;
    }
    return false;
  });

  const plannedItems: PlannedItem[] = [];
  let supportOnlySkippedCount = 0;
  let reviewRequiredSkippedCount = 0;
  let nonPageSurfaceSkippedCount = 0;

  for (const leafNode of scopedLeafNodes) {
    const lineage = buildAncestorPath(leafNode, nodeById);
    const rootFamily = requireRootFamily(rootFamilies, leafNode.rootFamilyId);
    const linkedSurface = leafNode.linkedDiscoveredWebAppSurfaceId
      ? surfaceById.get(leafNode.linkedDiscoveredWebAppSurfaceId) ?? null
      : null;

    if (!linkedSurface) {
      plannedItems.push({
        itemType: "page",
        discoveredWebAppStructureNodeId: leafNode.discoveredWebAppStructureNodeId,
        discoveredWebAppSurfaceId: null,
        rootFamilyId: leafNode.rootFamilyId,
        pageDepth: Math.max(0, lineage.length - 2),
        discoveredStructureKey: leafNode.structureKey,
        displayLabel: leafNode.displayLabel ?? titleCaseSegment(leafNode.nodeKey),
        plannedAction: "blocked",
        blockedReason: "missing_surface_link",
        curatedTargetType: "page",
        curatedWebAppModuleId: null,
        curatedWebAppPageId: null,
        pageKey: buildPageKey(leafNode.rootFamilyId, lineage.slice(1).map((node) => node.nodeKey)),
        moduleKey: null,
        placementType: null,
        proposedLocatorType: null,
        canonicalLocator: null,
        driftStatus: "blocked-ambiguity",
        discoveredSegments: lineage.slice(1).map((node) => node.nodeKey),
      });
      continue;
    }

    if (linkedSurface.userFacingDisposition === "support-only" || leafNode.nodeKind === "support-surface") {
      supportOnlySkippedCount += 1;
      if (input.includeBlocked !== false) {
        plannedItems.push({
          itemType: "page",
          discoveredWebAppStructureNodeId: leafNode.discoveredWebAppStructureNodeId,
          discoveredWebAppSurfaceId: linkedSurface.discoveredWebAppSurfaceId,
          rootFamilyId: leafNode.rootFamilyId,
          pageDepth: Math.max(0, lineage.length - 2),
          discoveredStructureKey: leafNode.structureKey,
          displayLabel: linkedSurface.displayLabel ?? titleCaseSegment(leafNode.nodeKey),
          plannedAction: "blocked",
          blockedReason: "support_only_surface",
          curatedTargetType: "page",
          curatedWebAppModuleId: null,
          curatedWebAppPageId: null,
          pageKey: buildPageKey(leafNode.rootFamilyId, lineage.slice(1).map((node) => node.nodeKey)),
          moduleKey: null,
          placementType: null,
          proposedLocatorType: null,
          canonicalLocator: linkedSurface.canonicalLocator,
          driftStatus: "blocked-ambiguity",
          discoveredSegments: lineage.slice(1).map((node) => node.nodeKey),
        });
      }
      continue;
    }

    if (linkedSurface.userFacingDisposition === "review-required" || leafNode.nodeKind === "review-required-surface") {
      reviewRequiredSkippedCount += 1;
      if (input.includeBlocked !== false) {
        plannedItems.push({
          itemType: "page",
          discoveredWebAppStructureNodeId: leafNode.discoveredWebAppStructureNodeId,
          discoveredWebAppSurfaceId: linkedSurface.discoveredWebAppSurfaceId,
          rootFamilyId: leafNode.rootFamilyId,
          pageDepth: Math.max(0, lineage.length - 2),
          discoveredStructureKey: leafNode.structureKey,
          displayLabel: linkedSurface.displayLabel ?? titleCaseSegment(leafNode.nodeKey),
          plannedAction: "blocked",
          blockedReason: "review_required_surface",
          curatedTargetType: "page",
          curatedWebAppModuleId: null,
          curatedWebAppPageId: null,
          pageKey: buildPageKey(leafNode.rootFamilyId, lineage.slice(1).map((node) => node.nodeKey)),
          moduleKey: null,
          placementType: null,
          proposedLocatorType: null,
          canonicalLocator: linkedSurface.canonicalLocator,
          driftStatus: "blocked-ambiguity",
          discoveredSegments: lineage.slice(1).map((node) => node.nodeKey),
        });
      }
      continue;
    }

    if (linkedSurface.surfaceKind === "support-route" || linkedSurface.surfaceKind === "review-required") {
      nonPageSurfaceSkippedCount += 1;
      continue;
    }

    const groups = lineage.slice(1, -1).filter((node) => node.nodeKind === "group");
    const moduleNode = groups[0] ?? null;
    const moduleKey = moduleNode ? moduleNode.nodeKey : buildSyntheticModuleKey(leafNode.rootFamilyId);
    const moduleDisplayLabel = moduleNode?.displayLabel
      ?? (moduleNode ? titleCaseSegment(moduleNode.nodeKey) : buildSyntheticModuleLabel(rootFamily));
    const existingModule = moduleByScopedKey.get(`${leafNode.rootFamilyId}:${moduleKey}`) ?? null;

    if (moduleNode) {
      plannedItems.push({
        itemType: "module",
        discoveredWebAppStructureNodeId: moduleNode.discoveredWebAppStructureNodeId,
        discoveredWebAppSurfaceId: null,
        rootFamilyId: leafNode.rootFamilyId,
        pageDepth: 0,
        discoveredStructureKey: moduleNode.structureKey,
        displayLabel: moduleDisplayLabel,
        plannedAction: existingModule ? "match" : "create",
        blockedReason: null,
        curatedTargetType: "module",
        curatedWebAppModuleId: existingModule?.webAppModuleId ?? null,
        curatedWebAppPageId: null,
        pageKey: null,
        moduleKey,
        placementType: null,
        proposedLocatorType: null,
        canonicalLocator: null,
        driftStatus: "none",
        discoveredSegments: [moduleNode.nodeKey],
      });
    }

    const moduleNodeRouteSurface = moduleNode
      ? (
          (moduleNode.linkedDiscoveredWebAppSurfaceId
            ? surfaceById.get(moduleNode.linkedDiscoveredWebAppSurfaceId) ?? null
            : null)
          ?? surfaces.find(
            (surface) =>
              surface.rootFamilyId === leafNode.rootFamilyId
              && surface.userFacingDisposition === "user-facing"
              && surface.surfaceKind === "page-route"
              && surface.canonicalLocator === buildCanonicalPath(rootFamily, [moduleNode.nodeKey]),
          ) ?? null
        )
      : null;
    if (
      moduleNode
      && moduleNodeRouteSurface
    ) {
      const existingPage = pageByKey.get(buildPageKey(leafNode.rootFamilyId, [moduleNode.nodeKey])) ?? null;
      const pageKey = buildPageKey(leafNode.rootFamilyId, [moduleNode.nodeKey]);
      const desiredCanonicalLocator = buildCanonicalPath(rootFamily, [moduleNode.nodeKey]);
      const desiredDisplayLabel = moduleNode.displayLabel ?? titleCaseSegment(moduleNode.nodeKey);
      plannedItems.push(
        buildPlannedPageItem({
          node: moduleNode,
          linkedSurface: moduleNodeRouteSurface,
          leafNode,
          chainNodeSegments: [moduleNode.nodeKey],
          rootFamily,
          rootFamilyId: leafNode.rootFamilyId,
          existingModule,
          existingPage,
          parentPage: null,
          moduleKey,
          pageDepth: 1,
          includeMetadataDrift: input.includeMetadataDrift !== false,
          activeLocatorByKey,
          hasAmbiguousExistingMatch: hasAmbiguousExistingPageMatch({
            pages: pageWithLocators,
            existingPage,
            rootFamilyId: leafNode.rootFamilyId,
            pageKey,
            desiredDisplayLabel,
            desiredCanonicalLocator,
            desiredRouteSegment: moduleNode.nodeKey,
          }),
        }),
      );
    }

    const chainNodes = moduleNode ? [...groups.slice(1), leafNode] : [leafNode];
    for (let index = 0; index < chainNodes.length; index += 1) {
      const chainNode = chainNodes[index]!;
      const chainNodeSegments = lineage
        .slice(1, lineage.indexOf(chainNode) + 1)
        .map((node) => node.nodeKey);
      const pageSegments = moduleNode ? chainNodeSegments.slice(1) : chainNodeSegments;
      const pageKey = buildPageKey(leafNode.rootFamilyId, chainNodeSegments);
      const existingPage = pageByKey.get(pageKey) ?? null;
      const desiredDisplayLabel = chainNode.displayLabel ?? titleCaseSegment(chainNode.nodeKey);
      const desiredCanonicalLocator =
        chainNode === leafNode && linkedSurface?.locatorType === "hash-state"
          ? linkedSurface.canonicalLocator
          : buildCanonicalPath(rootFamily, chainNodeSegments);
      const parentSegments = pageSegments.slice(0, -1);
      const parentPageKey = parentSegments.length > 0
        ? buildPageKey(
            leafNode.rootFamilyId,
            moduleNode ? [moduleNode.nodeKey, ...parentSegments] : parentSegments,
          )
        : null;
      const parentPage = parentPageKey ? pageByKey.get(parentPageKey) ?? null : null;
      plannedItems.push(
        buildPlannedPageItem({
          node: chainNode,
          linkedSurface: chainNode === leafNode ? linkedSurface : null,
          leafNode,
          chainNodeSegments,
          rootFamily,
          rootFamilyId: leafNode.rootFamilyId,
          existingModule,
          existingPage,
          parentPage,
          moduleKey,
          pageDepth: index + 1,
          includeMetadataDrift: input.includeMetadataDrift !== false,
          activeLocatorByKey,
          hasAmbiguousExistingMatch: hasAmbiguousExistingPageMatch({
            pages: pageWithLocators,
            existingPage,
            rootFamilyId: leafNode.rootFamilyId,
            pageKey,
            desiredDisplayLabel,
            desiredCanonicalLocator,
            desiredRouteSegment: chainNode.nodeKey,
          }),
        }),
      );
    }
  }

  return {
    items: dedupeItems(plannedItems),
    currentSurfaceCount: surfaces.filter((surface) => !surface.staleAt).length,
    staleSurfaceCount: surfaces.filter((surface) => Boolean(surface.staleAt)).length,
    supportOnlySkippedCount,
    reviewRequiredSkippedCount,
    nonPageSurfaceSkippedCount,
  };
}

export async function previewStructureAwareWebAppHierarchySync(
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam,
  input: PreviewStructureAwareWebAppHierarchySyncInput,
): Promise<WebAppHierarchyDiscoverySyncPreviewResult> {
  const plannedState = await buildPlannedState(repository, discoverySeam, input);
  const items = input.includeBlocked === false
    ? plannedState.items.filter((item) => item.plannedAction !== "blocked")
    : plannedState.items;

  return {
    previewSummary: {
      matchedModuleCount: items.filter((item) => item.itemType === "module" && item.plannedAction === "match").length,
      createdModuleCount: items.filter((item) => item.itemType === "module" && item.plannedAction === "create").length,
      matchedPageCount: items.filter((item) => item.itemType === "page" && item.plannedAction === "match").length,
      createdPageCount: items.filter((item) => item.itemType === "page" && item.plannedAction === "create").length,
      blockedItemCount: items.filter((item) => item.plannedAction === "blocked").length,
      staleDiscoveredItemCount: items.filter((item) => item.driftStatus === "stale-discovered").length,
    },
    items,
  };
}

async function readTree(
  repository: WebAppHierarchyRepository,
  includeInactive: boolean,
  includeOrphaned: boolean,
): Promise<ResolvedWebAppHierarchyTree> {
  const [rootFamilies, modules, pages, locators] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
    repository.listPageLocators(),
  ]);
  const activeLocatorByPageId = new Map(
    locators.filter((item) => item.isActive).map((item) => [item.webAppPageId, item]),
  );

  return buildResolvedWebAppHierarchyTree(
    rootFamilies,
    modules,
    pages.map((page) => ({
      ...page,
      activeLocator: activeLocatorByPageId.get(page.webAppPageId) ?? page.activeLocator ?? null,
    })),
    includeInactive,
    includeOrphaned,
  );
}

export async function applyStructureAwareWebAppHierarchySync(
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam,
  input: ApplyStructureAwareWebAppHierarchySyncInput,
  discoveryRun?: WebAppDiscoveryRunData | null,
): Promise<WebAppHierarchyStructureAwareApplyResult> {
  const plannedState = await buildPlannedState(repository, discoverySeam, input);
  const moduleIdByKey = new Map<string, string>();
  const pageIdByKey = new Map<string, string>();
  let createdModuleCount = 0;
  let createdPageCount = 0;
  let refreshedLocatorCount = 0;
  let refreshedLinkCount = 0;

  for (const item of plannedState.items.sort(comparePreviewItems)) {
    if (item.plannedAction === "blocked") {
      continue;
    }

    if (item.itemType === "module") {
      const scopedKey = `${item.rootFamilyId}:${item.moduleKey}`;
      let moduleId = item.curatedWebAppModuleId;
      if (!moduleId) {
        const created = await repository.createModule({
          webAppModuleId: createWebAppHierarchyId(),
          rootFamilyId: item.rootFamilyId,
          moduleKey: item.moduleKey!,
          displayLabel: item.displayLabel,
          status: "review",
          sortOrder: 999,
        });
        moduleId = created.webAppModuleId;
        createdModuleCount += 1;
      }
      moduleIdByKey.set(scopedKey, moduleId);
      await repository.upsertDiscoveryLink({
        webAppDiscoveryLinkId: createWebAppHierarchyId(),
        discoveredWebAppStructureNodeId: item.discoveredWebAppStructureNodeId,
        discoveredWebAppSurfaceId: null,
        rootFamilyId: item.rootFamilyId,
        curatedTargetType: "module",
        curatedWebAppModuleId: moduleId,
        curatedWebAppPageId: null,
        linkStatus: "matched",
        driftStatus: "none",
        driftSummary: null,
        lastComparedWebAppDiscoveryRunId: discoveryRun?.webAppDiscoveryRunId ?? null,
        lastMatchedWebAppDiscoveryRunId: discoveryRun?.webAppDiscoveryRunId ?? null,
      });
      refreshedLinkCount += 1;
      continue;
    }

    const scopedModuleKey = `${item.rootFamilyId}:${item.moduleKey}`;
    let moduleId = item.curatedWebAppModuleId ?? moduleIdByKey.get(scopedModuleKey) ?? null;
    if (!moduleId) {
      const rootFamilies = await repository.listRootFamilies();
      const rootFamily = requireRootFamily(rootFamilies, item.rootFamilyId);
      const createdModule = await repository.createModule({
        webAppModuleId: createWebAppHierarchyId(),
        rootFamilyId: item.rootFamilyId,
        moduleKey: item.moduleKey!,
        displayLabel:
          item.moduleKey === buildSyntheticModuleKey(item.rootFamilyId)
            ? buildSyntheticModuleLabel(rootFamily)
            : titleCaseSegment(item.moduleKey!),
        status: "review",
        sortOrder: 999,
      });
      moduleId = createdModule.webAppModuleId;
      moduleIdByKey.set(scopedModuleKey, moduleId);
      createdModuleCount += 1;
    }
    const parentPageKey = item.pageDepth > 1
      ? buildPageKey(item.rootFamilyId, item.discoveredSegments.slice(0, -1))
      : null;
    const parentPageId = parentPageKey ? pageIdByKey.get(parentPageKey) ?? null : null;
    let pageId = item.curatedWebAppPageId;
    if (!pageId) {
      const created = await repository.createPage({
        webAppPageId: createWebAppHierarchyId(),
        rootFamilyId: item.rootFamilyId,
        webAppModuleId: moduleId,
        parentPageId,
        placementType: item.placementType ?? "module-root",
        pageKey: item.pageKey!,
        displayLabel: item.displayLabel,
        routeSegment: item.discoveredSegments[item.discoveredSegments.length - 1] ?? item.pageKey!,
        status: "review",
        sortOrder: 999,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        bootstrapSource: "structure-aware-discovery-sync",
        topologyState: "applied",
        templateKey: null,
        materializedAt: null,
      });
      pageId = created.webAppPageId;
      createdPageCount += 1;
    }
    pageIdByKey.set(item.pageKey!, pageId);

    if (item.canonicalLocator && item.proposedLocatorType) {
      const existingLocator = await repository.findActivePageLocatorByNormalizedKey(
        normalizeKey(item.canonicalLocator),
      );
      if (existingLocator && existingLocator.webAppPageId !== pageId) {
        throw new PageLocatorConflictError({
          field: "canonicalLocator",
          reason: "duplicate_active_locator",
        });
      }
      await repository.upsertActivePageLocator({
        webAppPageLocatorId: createWebAppHierarchyId(),
        webAppPageId: pageId,
        rootFamilyId: item.rootFamilyId,
        locatorType: item.proposedLocatorType,
        canonicalLocator: item.canonicalLocator,
        routePath: item.proposedLocatorType === "hash-state"
          ? item.canonicalLocator.split("#")[0]!
          : item.canonicalLocator,
        routeHash: item.proposedLocatorType === "hash-state"
          ? item.canonicalLocator.split("#")[1] ?? null
          : null,
        normalizedLocatorKey: normalizeKey(item.canonicalLocator),
        createdByRootAdminUserId: input.createdByRootAdminUserId,
      });
      refreshedLocatorCount += 1;
    }

    await repository.upsertDiscoveryLink({
      webAppDiscoveryLinkId: createWebAppHierarchyId(),
      discoveredWebAppStructureNodeId: item.discoveredWebAppStructureNodeId,
      discoveredWebAppSurfaceId: item.discoveredWebAppSurfaceId,
      rootFamilyId: item.rootFamilyId,
      curatedTargetType: "page",
      curatedWebAppModuleId: moduleId,
      curatedWebAppPageId: pageId,
      linkStatus: item.driftStatus === "stale-discovered" ? "stale-discovered" : "matched",
      driftStatus: item.driftStatus,
      driftSummary: item.driftStatus === "none" ? null : item.driftStatus,
      lastComparedWebAppDiscoveryRunId: discoveryRun?.webAppDiscoveryRunId ?? null,
      lastMatchedWebAppDiscoveryRunId:
        item.driftStatus === "stale-discovered" ? null : discoveryRun?.webAppDiscoveryRunId ?? null,
    });
    refreshedLinkCount += 1;
  }

  const tree = await readTree(repository, input.includeInactive ?? false, input.includeOrphaned ?? false);

  return {
    previewSummary: {
      matchedModuleCount: plannedState.items.filter((item) => item.itemType === "module" && item.plannedAction === "match").length,
      createdModuleCount: plannedState.items.filter((item) => item.itemType === "module" && item.plannedAction === "create").length,
      matchedPageCount: plannedState.items.filter((item) => item.itemType === "page" && item.plannedAction === "match").length,
      createdPageCount: plannedState.items.filter((item) => item.itemType === "page" && item.plannedAction === "create").length,
      blockedItemCount: plannedState.items.filter((item) => item.plannedAction === "blocked").length,
      staleDiscoveredItemCount: plannedState.items.filter((item) => item.driftStatus === "stale-discovered").length,
    },
    applySummary: {
      createdModuleCount,
      createdPageCount,
      refreshedLocatorCount,
      refreshedLinkCount,
      blockedItemCount: plannedState.items.filter((item) => item.plannedAction === "blocked").length,
    },
    items: plannedState.items,
    tree,
  };
}

export async function syncWebAppHierarchyFromDiscoveryStructureAware(
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam,
  input: ApplyStructureAwareWebAppHierarchySyncInput,
): Promise<WebAppHierarchyDiscoverySyncResult> {
  const discoveryRun = await discoverySeam.runCurrentApprovedRootFamilyDiscovery({
    createdByRootAdminUserId: input.createdByRootAdminUserId,
  });
  const plannedState = await buildPlannedState(repository, discoverySeam, input);
  const applied = await applyStructureAwareWebAppHierarchySync(repository, discoverySeam, input, discoveryRun);

  const blockedSurfaces: WebAppHierarchyDiscoverySyncBlockedSurface[] = applied.items
    .filter((item) => item.itemType === "page" && item.plannedAction === "blocked" && item.discoveredWebAppSurfaceId)
    .map((item) => ({
      discoveredWebAppSurfaceId: item.discoveredWebAppSurfaceId!,
      canonicalLocator: item.canonicalLocator ?? item.discoveredStructureKey,
      reason:
        item.blockedReason === "stale_discovered"
          ? "stale_surface"
          : item.blockedReason === "support_only_surface"
            ? "support_only_surface"
            : item.blockedReason === "review_required_surface"
              ? "review_required_surface"
              : item.blockedReason === "locator_conflict"
                ? "live_route_change_blocked"
                : "unsupported_locator_type",
    }));

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
      currentDiscoveredSurfaceCount: plannedState.currentSurfaceCount,
      totalStaleDiscoveredSurfaceCount: plannedState.staleSurfaceCount,
      importCandidateCount: applied.items.filter((item) => item.itemType === "page").length,
      createdModuleCount: applied.applySummary.createdModuleCount,
      createdPageCount: applied.applySummary.createdPageCount,
      updatedPageCount: 0,
      unchangedMappedSurfaceCount: applied.previewSummary.matchedPageCount,
      blockedSurfaceCount: blockedSurfaces.length,
      supportOnlySkippedCount: plannedState.supportOnlySkippedCount,
      reviewRequiredSkippedCount: plannedState.reviewRequiredSkippedCount,
      nonPageSurfaceSkippedCount: plannedState.nonPageSurfaceSkippedCount,
    },
    blockedSurfaces,
    tree: applied.tree,
  };
}
