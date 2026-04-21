import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import type {
  DiscoveredStructureNodeKind,
  DiscoveredWebAppStructureNodeCandidate,
  DiscoveredWebAppStructureNodeData,
  DiscoveredSurfaceDisposition,
  DiscoveredSurfaceKind,
  DiscoveredSurfaceLocatorType,
  DiscoveredWebAppSurfaceData,
  ListDiscoveredWebAppStructureTreeInput,
  ListDiscoveredWebAppSurfacesInput,
  ListDiscoveryRunsInput,
  PaginatedResult,
  WebAppDiscoveryRunData,
  WebAppRootFamilyId,
} from "../../src/features/webAppSurfaceDiscovery/domain/types";
import type { WebAppSurfaceDiscoveryProvider } from "../../src/features/webAppSurfaceDiscovery/domain/providers";
import { createWebAppSurfaceDiscoveryService } from "../../src/features/webAppSurfaceDiscovery/domain/service";
import {
  createWebAppSurfaceDiscoveryId,
  normalizeCanonicalLocator,
  normalizeKey,
  normalizeRouteHash,
  normalizeStructureKey,
} from "../../src/features/webAppSurfaceDiscovery/domain/helpers";
import type { WebAppSurfaceDiscoveryRepository } from "../../src/features/webAppSurfaceDiscovery/persistence/repository";
import type {
  CompleteWebAppDiscoveryRunRecordInput,
  CreateDiscoveredWebAppSurfaceObservationRecordInput,
  CreateDiscoveredWebAppSurfaceRecordInput,
  CreateDiscoveredWebAppStructureNodeRecordInput,
  CreateDiscoveredWebAppStructureObservationRecordInput,
  CreateWebAppDiscoveryRunRecordInput,
  RefreshDiscoveredWebAppSurfaceRecordInput,
  RefreshDiscoveredWebAppStructureNodeRecordInput,
} from "../../src/features/webAppSurfaceDiscovery/persistence/types";
import { createWebAppSurfaceDiscoveryRouter } from "../../src/features/webAppSurfaceDiscovery/transport/router";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function cloneRun(run: WebAppDiscoveryRunData): WebAppDiscoveryRunData {
  return {
    ...run,
    startedAt: new Date(run.startedAt),
    completedAt: run.completedAt ? new Date(run.completedAt) : null,
    createdAt: new Date(run.createdAt),
    updatedAt: new Date(run.updatedAt),
  };
}

function cloneSurface(surface: DiscoveredWebAppSurfaceData): DiscoveredWebAppSurfaceData {
  return {
    ...surface,
    firstDiscoveredAt: new Date(surface.firstDiscoveredAt),
    lastDiscoveredAt: new Date(surface.lastDiscoveredAt),
    staleAt: surface.staleAt ? new Date(surface.staleAt) : null,
    createdAt: new Date(surface.createdAt),
    updatedAt: new Date(surface.updatedAt),
  };
}

function cloneStructureNode(
  node: DiscoveredWebAppStructureNodeData,
): DiscoveredWebAppStructureNodeData {
  return {
    ...node,
    firstDiscoveredAt: new Date(node.firstDiscoveredAt),
    lastDiscoveredAt: new Date(node.lastDiscoveredAt),
    staleAt: node.staleAt ? new Date(node.staleAt) : null,
    createdAt: new Date(node.createdAt),
    updatedAt: new Date(node.updatedAt),
  };
}

export function createDiscoveryRunRecord(
  overrides: Partial<WebAppDiscoveryRunData> = {},
): WebAppDiscoveryRunData {
  const now = new Date("2026-04-19T12:00:00.000Z");
  return {
    webAppDiscoveryRunId: "11111111-1111-4111-8111-111111111111",
    scopeKey: "current-approved-root-families",
    status: "succeeded",
    triggerKind: "manual",
    providerVersion: "1",
    createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    startedAt: now,
    completedAt: now,
    failureSummary: null,
    createdCount: 1,
    refreshedCount: 0,
    unchangedCount: 0,
    staleCount: 0,
    supportOnlyCount: 0,
    reviewRequiredCount: 0,
    structureCreatedCount: 0,
    structureRefreshedCount: 0,
    structureUnchangedCount: 0,
    structureStaleCount: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createDiscoveredSurfaceRecord(
  overrides: Partial<DiscoveredWebAppSurfaceData> = {},
): DiscoveredWebAppSurfaceData {
  const now = new Date("2026-04-19T12:00:00.000Z");
  return {
    discoveredWebAppSurfaceId: "22222222-2222-4222-8222-222222222222",
    rootFamilyId: "design-system",
    discoveryKey: "design-system:path:/design-system/components/top-nav",
    surfaceKind: "page-route",
    locatorType: "path",
    routePath: "/design-system/components/top-nav",
    routeHash: null,
    canonicalLocator: "/design-system/components/top-nav",
    displayLabel: "Top Nav",
    userFacingDisposition: "user-facing",
    providerKey: "design-system-file-routes",
    implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
    firstDiscoveredRunId: "11111111-1111-4111-8111-111111111111",
    lastDiscoveredRunId: "11111111-1111-4111-8111-111111111111",
    firstDiscoveredAt: now,
    lastDiscoveredAt: now,
    staleAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createDiscoveredStructureNodeRecord(
  overrides: Partial<DiscoveredWebAppStructureNodeData> = {},
): DiscoveredWebAppStructureNodeData {
  const now = new Date("2026-04-19T12:00:00.000Z");
  return {
    discoveredWebAppStructureNodeId: "33333333-3333-4333-8333-333333333333",
    rootFamilyId: "design-system",
    structureKey: "design-system/components/top-nav",
    parentStructureKey: "design-system/components",
    parentDiscoveredWebAppStructureNodeId: "44444444-4444-4444-8444-444444444444",
    nodeKey: "top-nav",
    nodeKind: "page-surface",
    displayLabel: "Top Nav",
    depth: 2,
    linkedDiscoveredWebAppSurfaceId: "22222222-2222-4222-8222-222222222222",
    providerKey: "design-system-file-routes",
    implementationSourcePath: "src/frontend/designSystem/components/top-nav.html",
    firstDiscoveredRunId: "11111111-1111-4111-8111-111111111111",
    lastDiscoveredRunId: "11111111-1111-4111-8111-111111111111",
    firstDiscoveredAt: now,
    lastDiscoveredAt: now,
    staleAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function toLeafNodeKind(
  surfaceKind: DiscoveredSurfaceKind,
  disposition: DiscoveredSurfaceDisposition,
): DiscoveredStructureNodeKind {
  if (surfaceKind === "shell-state") {
    return "shell-state-surface";
  }
  if (disposition === "support-only") {
    return "support-surface";
  }
  if (disposition === "review-required") {
    return "review-required-surface";
  }
  return "page-surface";
}

function buildStructureNodesFromStaticSurfaces(
  key: string,
  rootFamilyId: WebAppRootFamilyId,
  surfaces: import("../../src/features/webAppSurfaceDiscovery/domain/types").DiscoveredWebAppSurfaceCandidate[],
): DiscoveredWebAppStructureNodeCandidate[] {
  const nodes = new Map<string, DiscoveredWebAppStructureNodeCandidate>();
  const rootKey = normalizeStructureKey(rootFamilyId);
  const pathRoutes = surfaces
    .filter((surface) => surface.locatorType === "path" && surface.routePath)
    .map((surface) => surface.routePath!);

  nodes.set(rootKey, {
    rootFamilyId,
    structureKey: rootKey,
    parentStructureKey: null,
    nodeKey: normalizeKey(rootFamilyId),
    nodeKind: "root",
    displayLabel: null,
    depth: 0,
    linkedSurfaceCanonicalLocator: null,
    providerKey: key,
    implementationSourcePath: null,
  });

  for (const surface of surfaces) {
    if (surface.locatorType === "hash-state" && surface.routeHash) {
      const structureKey = normalizeStructureKey(`${rootFamilyId}#${normalizeRouteHash(surface.routeHash)}`);
      nodes.set(structureKey, {
        rootFamilyId,
        structureKey,
        parentStructureKey: rootKey,
        nodeKey: normalizeKey(surface.routeHash),
        nodeKind: "shell-state-surface",
        displayLabel: surface.displayLabel,
        depth: 1,
        linkedSurfaceCanonicalLocator: normalizeCanonicalLocator(surface.canonicalLocator),
        providerKey: key,
        implementationSourcePath: surface.implementationSourcePath,
      });
      continue;
    }

    if (surface.locatorType !== "path" || !surface.routePath) {
      continue;
    }

    const basePrefix = `/${rootFamilyId}`;
    const relativeSegments = surface.routePath
      .slice(basePrefix.length)
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean);
    if (relativeSegments.length === 0) {
      continue;
    }

    let parentStructureKey = rootKey;
    relativeSegments.forEach((segment, index) => {
      const structureKey = normalizeStructureKey(
        `${rootFamilyId}/${relativeSegments.slice(0, index + 1).join("/")}`,
      );
      const isLast = index === relativeSegments.length - 1;
      const shouldTreatLastSegmentAsGroup =
        isLast && pathRoutes.some((routePath) => routePath !== surface.routePath && routePath.startsWith(`${surface.routePath}/`));
      const existing = nodes.get(structureKey);
      const nextNodeKind = isLast && !shouldTreatLastSegmentAsGroup
        ? toLeafNodeKind(surface.surfaceKind, surface.userFacingDisposition)
        : "group";
      nodes.set(structureKey, {
        rootFamilyId,
        structureKey,
        parentStructureKey,
        nodeKey: normalizeKey(segment),
        nodeKind: existing?.nodeKind === "group" || nextNodeKind === "group"
          ? "group"
          : nextNodeKind,
        displayLabel: existing?.displayLabel ?? surface.displayLabel,
        depth: index + 1,
        linkedSurfaceCanonicalLocator: existing?.linkedSurfaceCanonicalLocator
          ?? (isLast ? normalizeCanonicalLocator(surface.canonicalLocator) : null),
        providerKey: key,
        implementationSourcePath: existing?.implementationSourcePath ?? surface.implementationSourcePath,
      });
      parentStructureKey = structureKey;
    });
  }

  return [...nodes.values()].sort((left, right) => left.depth - right.depth);
}

export function createStaticDiscoveryProvider(
  key: string,
  rootFamilyId: WebAppRootFamilyId,
  surfaces: WebAppSurfaceDiscoveryProvider extends never
    ? never
    : import("../../src/features/webAppSurfaceDiscovery/domain/types").DiscoveredWebAppSurfaceCandidate[],
  structureNodes?: DiscoveredWebAppStructureNodeCandidate[],
): WebAppSurfaceDiscoveryProvider {
  const derivedStructureNodes =
    structureNodes ??
    buildStructureNodesFromStaticSurfaces(key, rootFamilyId, surfaces);

  return {
    key,
    rootFamilyId,
    async discover() {
      return {
        surfaces: surfaces.map((surface) => ({ ...surface })),
        structureNodes: derivedStructureNodes.map((node) => ({ ...node })),
      };
    },
  };
}

export function createInMemoryWebAppSurfaceDiscoveryRepository(seed?: {
  runs?: WebAppDiscoveryRunData[];
  surfaces?: DiscoveredWebAppSurfaceData[];
  structureNodes?: DiscoveredWebAppStructureNodeData[];
}): WebAppSurfaceDiscoveryRepository & {
  runs: Map<string, WebAppDiscoveryRunData>;
  surfaces: Map<string, DiscoveredWebAppSurfaceData>;
  structureNodes: Map<string, DiscoveredWebAppStructureNodeData>;
  observations: CreateDiscoveredWebAppSurfaceObservationRecordInput[];
  structureObservations: CreateDiscoveredWebAppStructureObservationRecordInput[];
} {
  const runs = new Map(
    (seed?.runs ?? []).map((run) => [run.webAppDiscoveryRunId, cloneRun(run)]),
  );
  const surfaces = new Map(
    (seed?.surfaces ?? []).map((surface) => [surface.discoveredWebAppSurfaceId, cloneSurface(surface)]),
  );
  const structureNodes = new Map(
    (seed?.structureNodes ?? []).map((node) => [
      node.discoveredWebAppStructureNodeId,
      cloneStructureNode(node),
    ]),
  );
  const observations: CreateDiscoveredWebAppSurfaceObservationRecordInput[] = [];
  const structureObservations: CreateDiscoveredWebAppStructureObservationRecordInput[] = [];

  function sortSurfaces(items: DiscoveredWebAppSurfaceData[]) {
    return [...items].sort((left, right) => {
      const time = right.lastDiscoveredAt.getTime() - left.lastDiscoveredAt.getTime();
      return time !== 0 ? time : left.canonicalLocator.localeCompare(right.canonicalLocator);
    });
  }

  function sortStructureNodes(items: DiscoveredWebAppStructureNodeData[]) {
    return [...items].sort((left, right) => {
      const depth = left.depth - right.depth;
      if (depth !== 0) {
        return depth;
      }
      return left.structureKey.localeCompare(right.structureKey);
    });
  }

  return {
    runs,
    surfaces,
    structureNodes,
    observations,
    structureObservations,
    async createDiscoveryRun(input: CreateWebAppDiscoveryRunRecordInput) {
      const run = createDiscoveryRunRecord({
        webAppDiscoveryRunId: input.webAppDiscoveryRunId,
        scopeKey: input.scopeKey,
        status: input.status,
        triggerKind: input.triggerKind,
        providerVersion: input.providerVersion,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        startedAt: input.startedAt,
        completedAt: null,
        failureSummary: null,
        createdCount: 0,
        refreshedCount: 0,
        unchangedCount: 0,
        staleCount: 0,
        supportOnlyCount: 0,
        reviewRequiredCount: 0,
      });
      runs.set(run.webAppDiscoveryRunId, run);
      return cloneRun(run);
    },
    async completeDiscoveryRun(input: CompleteWebAppDiscoveryRunRecordInput) {
      const current = runs.get(input.webAppDiscoveryRunId)!;
      const next = createDiscoveryRunRecord({
        ...current,
        status: input.status,
        completedAt: input.completedAt,
        failureSummary: input.failureSummary,
        createdCount: input.createdCount,
        refreshedCount: input.refreshedCount,
        unchangedCount: input.unchangedCount,
        staleCount: input.staleCount,
        supportOnlyCount: input.supportOnlyCount,
        reviewRequiredCount: input.reviewRequiredCount,
        structureCreatedCount: input.structureCreatedCount,
        structureRefreshedCount: input.structureRefreshedCount,
        structureUnchangedCount: input.structureUnchangedCount,
        structureStaleCount: input.structureStaleCount,
        updatedAt: input.completedAt,
      });
      runs.set(next.webAppDiscoveryRunId, next);
      return cloneRun(next);
    },
    async findDiscoveryRunById(webAppDiscoveryRunId) {
      const run = runs.get(webAppDiscoveryRunId) ?? null;
      return run ? cloneRun(run) : null;
    },
    async listDiscoveryRuns(input: ListDiscoveryRunsInput): Promise<PaginatedResult<WebAppDiscoveryRunData>> {
      const matching = [...runs.values()].filter((run) => {
        if (input.filters.status && run.status !== input.filters.status) {
          return false;
        }
        if (input.filters.triggerKind && run.triggerKind !== input.filters.triggerKind) {
          return false;
        }
        return true;
      }).sort((left, right) => right.startedAt.getTime() - left.startedAt.getTime());
      const start = (input.page - 1) * input.pageSize;
      return {
        items: matching.slice(start, start + input.pageSize).map(cloneRun),
        totalMatchingRecords: matching.length,
      };
    },
    async findSurfaceByCanonicalLocator(canonicalLocator) {
      const surface =
        [...surfaces.values()].find((item) => item.canonicalLocator === canonicalLocator) ?? null;
      return surface ? cloneSurface(surface) : null;
    },
    async createDiscoveredSurface(input: CreateDiscoveredWebAppSurfaceRecordInput) {
      const surface = createDiscoveredSurfaceRecord({
        discoveredWebAppSurfaceId: input.discoveredWebAppSurfaceId,
        rootFamilyId: input.rootFamilyId,
        discoveryKey: input.discoveryKey,
        surfaceKind: input.surfaceKind,
        locatorType: input.locatorType,
        routePath: input.routePath,
        routeHash: input.routeHash,
        canonicalLocator: input.canonicalLocator,
        displayLabel: input.displayLabel,
        userFacingDisposition: input.userFacingDisposition,
        providerKey: input.providerKey,
        implementationSourcePath: input.implementationSourcePath,
        firstDiscoveredRunId: input.firstDiscoveredRunId,
        lastDiscoveredRunId: input.lastDiscoveredRunId,
        firstDiscoveredAt: input.firstDiscoveredAt,
        lastDiscoveredAt: input.lastDiscoveredAt,
      });
      surfaces.set(surface.discoveredWebAppSurfaceId, surface);
      return cloneSurface(surface);
    },
    async refreshDiscoveredSurface(input: RefreshDiscoveredWebAppSurfaceRecordInput) {
      const current = surfaces.get(input.discoveredWebAppSurfaceId)!;
      const next = createDiscoveredSurfaceRecord({
        ...current,
        rootFamilyId: input.rootFamilyId,
        discoveryKey: input.discoveryKey,
        surfaceKind: input.surfaceKind,
        locatorType: input.locatorType,
        routePath: input.routePath,
        routeHash: input.routeHash,
        canonicalLocator: input.canonicalLocator,
        displayLabel: input.displayLabel,
        userFacingDisposition: input.userFacingDisposition,
        providerKey: input.providerKey,
        implementationSourcePath: input.implementationSourcePath,
        firstDiscoveredRunId: current.firstDiscoveredRunId,
        lastDiscoveredRunId: input.lastDiscoveredRunId,
        firstDiscoveredAt: current.firstDiscoveredAt,
        lastDiscoveredAt: input.lastDiscoveredAt,
        staleAt: input.staleAt,
        updatedAt: input.lastDiscoveredAt,
      });
      surfaces.set(next.discoveredWebAppSurfaceId, next);
      return cloneSurface(next);
    },
    async createSurfaceObservation(input: CreateDiscoveredWebAppSurfaceObservationRecordInput) {
      observations.push({ ...input, observedAt: new Date(input.observedAt) });
    },
    async markSurfaceStale(discoveredWebAppSurfaceId: string, staleAt: Date) {
      const current = surfaces.get(discoveredWebAppSurfaceId)!;
      const next = createDiscoveredSurfaceRecord({
        ...current,
        staleAt,
        updatedAt: staleAt,
      });
      surfaces.set(next.discoveredWebAppSurfaceId, next);
      return cloneSurface(next);
    },
    async listScopeSurfaces(rootFamilyIds: WebAppRootFamilyId[]) {
      return [...surfaces.values()]
        .filter((surface) => rootFamilyIds.includes(surface.rootFamilyId))
        .map(cloneSurface);
    },
    async findStructureNodeByStructureKey(structureKey: string) {
      const node =
        [...structureNodes.values()].find((item) => item.structureKey === structureKey) ?? null;
      return node ? cloneStructureNode(node) : null;
    },
    async createDiscoveredStructureNode(input: CreateDiscoveredWebAppStructureNodeRecordInput) {
      const node = createDiscoveredStructureNodeRecord({
        discoveredWebAppStructureNodeId: input.discoveredWebAppStructureNodeId,
        rootFamilyId: input.rootFamilyId,
        structureKey: input.structureKey,
        parentStructureKey: input.parentStructureKey,
        parentDiscoveredWebAppStructureNodeId: input.parentDiscoveredWebAppStructureNodeId,
        nodeKey: input.nodeKey,
        nodeKind: input.nodeKind,
        displayLabel: input.displayLabel,
        depth: input.depth,
        linkedDiscoveredWebAppSurfaceId: input.linkedDiscoveredWebAppSurfaceId,
        providerKey: input.providerKey,
        implementationSourcePath: input.implementationSourcePath,
        firstDiscoveredRunId: input.firstDiscoveredRunId,
        lastDiscoveredRunId: input.lastDiscoveredRunId,
        firstDiscoveredAt: input.firstDiscoveredAt,
        lastDiscoveredAt: input.lastDiscoveredAt,
      });
      structureNodes.set(node.discoveredWebAppStructureNodeId, node);
      return cloneStructureNode(node);
    },
    async refreshDiscoveredStructureNode(input: RefreshDiscoveredWebAppStructureNodeRecordInput) {
      const current = structureNodes.get(input.discoveredWebAppStructureNodeId)!;
      const next = createDiscoveredStructureNodeRecord({
        ...current,
        rootFamilyId: input.rootFamilyId,
        structureKey: input.structureKey,
        parentStructureKey: input.parentStructureKey,
        parentDiscoveredWebAppStructureNodeId: input.parentDiscoveredWebAppStructureNodeId,
        nodeKey: input.nodeKey,
        nodeKind: input.nodeKind,
        displayLabel: input.displayLabel,
        depth: input.depth,
        linkedDiscoveredWebAppSurfaceId: input.linkedDiscoveredWebAppSurfaceId,
        providerKey: input.providerKey,
        implementationSourcePath: input.implementationSourcePath,
        lastDiscoveredRunId: input.lastDiscoveredRunId,
        lastDiscoveredAt: input.lastDiscoveredAt,
        staleAt: input.staleAt,
        updatedAt: input.lastDiscoveredAt,
      });
      structureNodes.set(next.discoveredWebAppStructureNodeId, next);
      return cloneStructureNode(next);
    },
    async createStructureObservation(input: CreateDiscoveredWebAppStructureObservationRecordInput) {
      structureObservations.push({
        ...input,
        observedAt: new Date(input.observedAt),
      });
    },
    async markStructureNodeStale(discoveredWebAppStructureNodeId: string, staleAt: Date) {
      const current = structureNodes.get(discoveredWebAppStructureNodeId)!;
      const next = createDiscoveredStructureNodeRecord({
        ...current,
        staleAt,
        updatedAt: staleAt,
      });
      structureNodes.set(next.discoveredWebAppStructureNodeId, next);
      return cloneStructureNode(next);
    },
    async listScopeStructureNodes(rootFamilyIds: WebAppRootFamilyId[]) {
      return [...structureNodes.values()]
        .filter((node) => rootFamilyIds.includes(node.rootFamilyId))
        .map(cloneStructureNode);
    },
    async findDiscoveredStructureNodeById(discoveredWebAppStructureNodeId: string) {
      const node = structureNodes.get(discoveredWebAppStructureNodeId) ?? null;
      return node ? cloneStructureNode(node) : null;
    },
    async listDiscoveredStructureNodes(input: ListDiscoveredWebAppStructureTreeInput) {
      return sortStructureNodes(
        [...structureNodes.values()].filter((node) => {
          if (input.filters.rootFamilyId && node.rootFamilyId !== input.filters.rootFamilyId) {
            return false;
          }
          if (input.filters.staleStatus === "current" && node.staleAt) {
            return false;
          }
          if (input.filters.staleStatus === "stale" && !node.staleAt) {
            return false;
          }
          return true;
        }),
      ).map(cloneStructureNode);
    },
    async findDiscoveredSurfaceById(discoveredWebAppSurfaceId: string) {
      const surface = surfaces.get(discoveredWebAppSurfaceId) ?? null;
      return surface ? cloneSurface(surface) : null;
    },
    async listDiscoveredSurfaces(
      input: ListDiscoveredWebAppSurfacesInput,
    ): Promise<PaginatedResult<DiscoveredWebAppSurfaceData>> {
      const matching = sortSurfaces(
        [...surfaces.values()].filter((surface) => {
          if (input.filters.rootFamilyId && surface.rootFamilyId !== input.filters.rootFamilyId) {
            return false;
          }
          if (input.filters.surfaceKind && surface.surfaceKind !== input.filters.surfaceKind) {
            return false;
          }
          if (
            input.filters.userFacingDisposition &&
            surface.userFacingDisposition !== input.filters.userFacingDisposition
          ) {
            return false;
          }
          if (input.filters.providerKey && surface.providerKey !== input.filters.providerKey) {
            return false;
          }
          if (input.filters.staleStatus === "current" && surface.staleAt) {
            return false;
          }
          if (input.filters.staleStatus === "stale" && !surface.staleAt) {
            return false;
          }
          return true;
        }),
      );
      const start = (input.page - 1) * input.pageSize;
      return {
        items: matching.slice(start, start + input.pageSize).map(cloneSurface),
        totalMatchingRecords: matching.length,
      };
    },
  };
}

export function mountWebAppSurfaceDiscoveryFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: WebAppSurfaceDiscoveryRepository,
  providers: WebAppSurfaceDiscoveryProvider[],
): void {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const service = createWebAppSurfaceDiscoveryService(repository, providers);
  const capabilityChecker = {
    hasCapability: async ({
      rootUserId,
      capabilityKey,
    }: {
      rootUserId: string;
      capabilityKey: string;
    }) => harness.getRootUserCapabilities(rootUserId).includes(capabilityKey),
  };

  app.use(
    "/v1/web-app-surface-discovery",
    requireRootSession,
    createWebAppSurfaceDiscoveryRouter(
      service,
      capabilityChecker,
      harness.platformSecurityRepository,
    ),
  );
}
