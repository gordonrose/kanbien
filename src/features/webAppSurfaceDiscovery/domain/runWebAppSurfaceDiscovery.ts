import {
  DiscoveryProviderOutputInvalidError,
  DiscoveryScopeInvalidError,
  DiscoveryStructureGraphInvalidError,
  DiscoveryStructureNodeLinkInvalidError,
  DiscoveredWebAppSurfaceLocatorInvalidError,
} from "../contract/errors";
import type { WebAppSurfaceDiscoveryRepository } from "../persistence/repository";
import {
  buildDiscoveryKey,
  createWebAppSurfaceDiscoveryId,
  normalizeCanonicalLocator,
  normalizeKey,
  normalizeStructureKey,
} from "./helpers";
import type { WebAppSurfaceDiscoveryProvider } from "./providers";
import type {
  DiscoveredWebAppStructureNodeCandidate,
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppSurfaceCandidate,
  DiscoveredWebAppSurfaceData,
  RunWebAppSurfaceDiscoveryInput,
  WebAppDiscoveryRunData,
  WebAppRootFamilyId,
} from "./types";

const SUPPORTED_SCOPE = "current-approved-root-families";
const SUPPORTED_ROOT_FAMILIES: WebAppRootFamilyId[] = [
  "root-admin",
  "login",
  "design-system",
];
const PROVIDER_VERSION = "2";

function validateSurfaceCandidate(candidate: DiscoveredWebAppSurfaceCandidate): void {
  const normalizedCanonicalLocator = normalizeCanonicalLocator(candidate.canonicalLocator);
  if (!normalizedCanonicalLocator) {
    throw new DiscoveryProviderOutputInvalidError({
      field: "canonicalLocator",
      reason: "missing_canonical_locator",
    });
  }

  if (candidate.locatorType === "hash-state") {
    if (!candidate.routePath || !candidate.routeHash) {
      throw new DiscoveredWebAppSurfaceLocatorInvalidError({
        field: "routeHash",
        reason: "hash_state_requires_path_and_hash",
      });
    }
    return;
  }

  if (!candidate.routePath || candidate.routeHash) {
    throw new DiscoveredWebAppSurfaceLocatorInvalidError({
      field: "routePath",
      reason: "path_locator_shape_invalid",
    });
  }
}

function isLeafNodeKind(
  nodeKind: DiscoveredWebAppStructureNodeCandidate["nodeKind"],
): boolean {
  return nodeKind !== "root" && nodeKind !== "group";
}

function canLinkSurface(
  nodeKind: DiscoveredWebAppStructureNodeCandidate["nodeKind"],
): boolean {
  return nodeKind !== "root";
}

function validateStructureCandidates(
  candidates: DiscoveredWebAppStructureNodeCandidate[],
  surfacesByCanonicalLocator: Map<string, DiscoveredWebAppSurfaceCandidate>,
): void {
  const byStructureKey = new Map<string, DiscoveredWebAppStructureNodeCandidate>();

  for (const candidate of candidates) {
    const normalizedStructureKey = normalizeStructureKey(candidate.structureKey);
    if (!normalizedStructureKey) {
      throw new DiscoveryStructureGraphInvalidError({
        field: "structureKey",
        reason: "missing_structure_key",
      });
    }

    if (byStructureKey.has(normalizedStructureKey)) {
      throw new DiscoveryStructureGraphInvalidError({
        field: "structureKey",
        reason: "duplicate_structure_key",
      });
    }

    if (candidate.depth === 0) {
      if (candidate.parentStructureKey !== null || candidate.nodeKind !== "root") {
        throw new DiscoveryStructureGraphInvalidError({
          field: "parentStructureKey",
          reason: "root_node_requires_null_parent",
        });
      }
    } else if (!candidate.parentStructureKey) {
      throw new DiscoveryStructureGraphInvalidError({
        field: "parentStructureKey",
        reason: "non_root_node_requires_parent",
      });
    }

    if (candidate.parentStructureKey === normalizedStructureKey) {
      throw new DiscoveryStructureGraphInvalidError({
        field: "parentStructureKey",
        reason: "self_parent_not_allowed",
      });
    }

    if (isLeafNodeKind(candidate.nodeKind) && !candidate.linkedSurfaceCanonicalLocator) {
      throw new DiscoveryStructureNodeLinkInvalidError({
        field: "linkedSurfaceCanonicalLocator",
        reason: "leaf_node_requires_linked_surface",
      });
    }

    if (!canLinkSurface(candidate.nodeKind) && candidate.linkedSurfaceCanonicalLocator) {
      throw new DiscoveryStructureNodeLinkInvalidError({
        field: "linkedSurfaceCanonicalLocator",
        reason: "root_node_cannot_link_surface",
      });
    }

    if (
      candidate.linkedSurfaceCanonicalLocator &&
      !surfacesByCanonicalLocator.has(
        normalizeCanonicalLocator(candidate.linkedSurfaceCanonicalLocator),
      )
    ) {
      throw new DiscoveryStructureNodeLinkInvalidError({
        field: "linkedSurfaceCanonicalLocator",
        reason: "linked_surface_not_discovered",
      });
    }

    byStructureKey.set(normalizedStructureKey, {
      ...candidate,
      structureKey: normalizedStructureKey,
      parentStructureKey: candidate.parentStructureKey
        ? normalizeStructureKey(candidate.parentStructureKey)
        : null,
    });
  }

  for (const candidate of byStructureKey.values()) {
    if (!candidate.parentStructureKey) {
      continue;
    }

    const parent = byStructureKey.get(candidate.parentStructureKey);
    if (!parent) {
      throw new DiscoveryStructureGraphInvalidError({
        field: "parentStructureKey",
        reason: "missing_parent_structure_node",
      });
    }
    if (parent.depth !== candidate.depth - 1) {
      throw new DiscoveryStructureGraphInvalidError({
        field: "depth",
        reason: "parent_depth_mismatch",
      });
    }
  }
}

function surfaceCandidateChanged(
  existing: DiscoveredWebAppSurfaceData,
  candidate: DiscoveredWebAppSurfaceCandidate,
): boolean {
  return (
    existing.rootFamilyId !== candidate.rootFamilyId ||
    existing.surfaceKind !== candidate.surfaceKind ||
    existing.locatorType !== candidate.locatorType ||
    existing.routePath !== candidate.routePath ||
    existing.routeHash !== candidate.routeHash ||
    existing.canonicalLocator !== candidate.canonicalLocator ||
    existing.displayLabel !== candidate.displayLabel ||
    existing.userFacingDisposition !== candidate.userFacingDisposition ||
    existing.providerKey !== candidate.providerKey ||
    existing.implementationSourcePath !== candidate.implementationSourcePath ||
    existing.staleAt !== null
  );
}

function structureCandidateChanged(
  existing: DiscoveredWebAppStructureNodeData,
  candidate: DiscoveredWebAppStructureNodeCandidate,
  parentDiscoveredWebAppStructureNodeId: string | null,
  linkedDiscoveredWebAppSurfaceId: string | null,
): boolean {
  return (
    existing.rootFamilyId !== candidate.rootFamilyId ||
    existing.structureKey !== candidate.structureKey ||
    existing.parentStructureKey !== candidate.parentStructureKey ||
    existing.parentDiscoveredWebAppStructureNodeId !== parentDiscoveredWebAppStructureNodeId ||
    existing.nodeKey !== candidate.nodeKey ||
    existing.nodeKind !== candidate.nodeKind ||
    existing.displayLabel !== candidate.displayLabel ||
    existing.depth !== candidate.depth ||
    existing.linkedDiscoveredWebAppSurfaceId !== linkedDiscoveredWebAppSurfaceId ||
    existing.providerKey !== candidate.providerKey ||
    existing.implementationSourcePath !== candidate.implementationSourcePath ||
    existing.staleAt !== null
  );
}

export async function runWebAppSurfaceDiscovery(
  repository: WebAppSurfaceDiscoveryRepository,
  providers: WebAppSurfaceDiscoveryProvider[],
  input: RunWebAppSurfaceDiscoveryInput,
): Promise<WebAppDiscoveryRunData> {
  if (input.scopeKey !== SUPPORTED_SCOPE) {
    throw new DiscoveryScopeInvalidError();
  }

  const startedAt = new Date();
  const run = await repository.createDiscoveryRun({
    webAppDiscoveryRunId: createWebAppSurfaceDiscoveryId(),
    scopeKey: input.scopeKey,
    status: "running",
    triggerKind: input.triggerKind,
    providerVersion: PROVIDER_VERSION,
    createdByRootAdminUserId: input.createdByRootAdminUserId,
    startedAt,
  });

  try {
    const surfaceCandidates: DiscoveredWebAppSurfaceCandidate[] = [];
    const structureCandidates: DiscoveredWebAppStructureNodeCandidate[] = [];

    for (const provider of providers) {
      if (!SUPPORTED_ROOT_FAMILIES.includes(provider.rootFamilyId)) {
        continue;
      }

      const discovered = await provider.discover();

      for (const candidate of discovered.surfaces) {
        validateSurfaceCandidate(candidate);
        surfaceCandidates.push({
          ...candidate,
          canonicalLocator: normalizeCanonicalLocator(candidate.canonicalLocator),
        });
      }

      for (const candidate of discovered.structureNodes) {
        structureCandidates.push({
          ...candidate,
          structureKey: normalizeStructureKey(candidate.structureKey),
          parentStructureKey: candidate.parentStructureKey
            ? normalizeStructureKey(candidate.parentStructureKey)
            : null,
          nodeKey: normalizeKey(candidate.nodeKey),
          linkedSurfaceCanonicalLocator: candidate.linkedSurfaceCanonicalLocator
            ? normalizeCanonicalLocator(candidate.linkedSurfaceCanonicalLocator)
            : null,
        });
      }
    }

    const duplicateLocators = new Set<string>();
    const seenLocators = new Set<string>();
    for (const candidate of surfaceCandidates) {
      if (seenLocators.has(candidate.canonicalLocator)) {
        duplicateLocators.add(candidate.canonicalLocator);
      }
      seenLocators.add(candidate.canonicalLocator);
    }
    if (duplicateLocators.size > 0) {
      throw new DiscoveryProviderOutputInvalidError({
        field: "canonicalLocator",
        reason: "duplicate_canonical_locator",
      });
    }

    validateStructureCandidates(
      structureCandidates,
      new Map(surfaceCandidates.map((candidate) => [candidate.canonicalLocator, candidate])),
    );

    const [existingSurfaces, existingStructureNodes] = await Promise.all([
      repository.listScopeSurfaces(SUPPORTED_ROOT_FAMILIES),
      repository.listScopeStructureNodes(SUPPORTED_ROOT_FAMILIES),
    ]);
    const existingByCanonicalLocator = new Map(
      existingSurfaces.map((surface) => [surface.canonicalLocator, surface]),
    );
    const existingStructuresByKey = new Map(
      existingStructureNodes.map((node) => [node.structureKey, node]),
    );
    const seenCanonicalLocators = new Set<string>();
    const seenStructureKeys = new Set<string>();
    const persistedSurfaceByCanonicalLocator = new Map<string, DiscoveredWebAppSurfaceData>();
    const persistedStructureByKey = new Map<string, DiscoveredWebAppStructureNodeData>();

    let createdCount = 0;
    let refreshedCount = 0;
    let unchangedCount = 0;

    for (const candidate of surfaceCandidates) {
      const discoveryKey = buildDiscoveryKey({
        rootFamilyId: candidate.rootFamilyId,
        locatorType: candidate.locatorType,
        canonicalLocator: candidate.canonicalLocator,
      });
      const existing = existingByCanonicalLocator.get(candidate.canonicalLocator);
      const discoveredAt = new Date();
      const persisted =
        existing === undefined
          ? await repository.createDiscoveredSurface({
              discoveredWebAppSurfaceId: createWebAppSurfaceDiscoveryId(),
              rootFamilyId: candidate.rootFamilyId,
              discoveryKey,
              surfaceKind: candidate.surfaceKind,
              locatorType: candidate.locatorType,
              routePath: candidate.routePath,
              routeHash: candidate.routeHash,
              canonicalLocator: candidate.canonicalLocator,
              displayLabel: candidate.displayLabel,
              userFacingDisposition: candidate.userFacingDisposition,
              providerKey: candidate.providerKey,
              implementationSourcePath: candidate.implementationSourcePath,
              firstDiscoveredRunId: run.webAppDiscoveryRunId,
              lastDiscoveredRunId: run.webAppDiscoveryRunId,
              firstDiscoveredAt: discoveredAt,
              lastDiscoveredAt: discoveredAt,
            })
          : await repository.refreshDiscoveredSurface({
              discoveredWebAppSurfaceId: existing.discoveredWebAppSurfaceId,
              rootFamilyId: candidate.rootFamilyId,
              discoveryKey,
              surfaceKind: candidate.surfaceKind,
              locatorType: candidate.locatorType,
              routePath: candidate.routePath,
              routeHash: candidate.routeHash,
              canonicalLocator: candidate.canonicalLocator,
              displayLabel: candidate.displayLabel,
              userFacingDisposition: candidate.userFacingDisposition,
              providerKey: candidate.providerKey,
              implementationSourcePath: candidate.implementationSourcePath,
              lastDiscoveredRunId: run.webAppDiscoveryRunId,
              lastDiscoveredAt: discoveredAt,
              staleAt: null,
            });

      if (!existing) {
        createdCount += 1;
      } else if (surfaceCandidateChanged(existing, candidate)) {
        refreshedCount += 1;
      } else {
        unchangedCount += 1;
      }

      await repository.createSurfaceObservation({
        discoveredWebAppSurfaceObservationId: createWebAppSurfaceDiscoveryId(),
        webAppDiscoveryRunId: run.webAppDiscoveryRunId,
        discoveredWebAppSurfaceId: persisted.discoveredWebAppSurfaceId,
        rootFamilyId: persisted.rootFamilyId,
        surfaceKind: persisted.surfaceKind,
        locatorType: persisted.locatorType,
        routePath: persisted.routePath,
        routeHash: persisted.routeHash,
        canonicalLocator: persisted.canonicalLocator,
        displayLabel: persisted.displayLabel,
        userFacingDisposition: persisted.userFacingDisposition,
        providerKey: persisted.providerKey,
        implementationSourcePath: persisted.implementationSourcePath,
        observedAt: discoveredAt,
      });

      seenCanonicalLocators.add(candidate.canonicalLocator);
      persistedSurfaceByCanonicalLocator.set(candidate.canonicalLocator, persisted);
    }

    let structureCreatedCount = 0;
    let structureRefreshedCount = 0;
    let structureUnchangedCount = 0;

    const sortedStructureCandidates = [...structureCandidates].sort((left, right) => {
      const depthDiff = left.depth - right.depth;
      if (depthDiff !== 0) {
        return depthDiff;
      }
      return left.structureKey.localeCompare(right.structureKey);
    });

    for (const candidate of sortedStructureCandidates) {
      const existing = existingStructuresByKey.get(candidate.structureKey);
      const parentDiscoveredWebAppStructureNodeId = candidate.parentStructureKey
        ? persistedStructureByKey.get(candidate.parentStructureKey)?.discoveredWebAppStructureNodeId ??
          existingStructuresByKey.get(candidate.parentStructureKey)?.discoveredWebAppStructureNodeId ??
          null
        : null;
      if (candidate.parentStructureKey && !parentDiscoveredWebAppStructureNodeId) {
        throw new DiscoveryStructureGraphInvalidError({
          field: "parentStructureKey",
          reason: "parent_node_not_persisted",
        });
      }

      const linkedDiscoveredWebAppSurfaceId = candidate.linkedSurfaceCanonicalLocator
        ? persistedSurfaceByCanonicalLocator.get(candidate.linkedSurfaceCanonicalLocator)
            ?.discoveredWebAppSurfaceId ??
          existingByCanonicalLocator.get(candidate.linkedSurfaceCanonicalLocator)
            ?.discoveredWebAppSurfaceId ??
          null
        : null;

      if (isLeafNodeKind(candidate.nodeKind) && !linkedDiscoveredWebAppSurfaceId) {
        throw new DiscoveryStructureNodeLinkInvalidError({
          field: "linkedSurfaceCanonicalLocator",
          reason: "linked_surface_not_persisted",
        });
      }

      const discoveredAt = new Date();
      const persisted =
        existing === undefined
          ? await repository.createDiscoveredStructureNode({
              discoveredWebAppStructureNodeId: createWebAppSurfaceDiscoveryId(),
              rootFamilyId: candidate.rootFamilyId,
              structureKey: candidate.structureKey,
              parentStructureKey: candidate.parentStructureKey,
              parentDiscoveredWebAppStructureNodeId,
              nodeKey: candidate.nodeKey,
              nodeKind: candidate.nodeKind,
              displayLabel: candidate.displayLabel,
              depth: candidate.depth,
              linkedDiscoveredWebAppSurfaceId,
              providerKey: candidate.providerKey,
              implementationSourcePath: candidate.implementationSourcePath,
              firstDiscoveredRunId: run.webAppDiscoveryRunId,
              lastDiscoveredRunId: run.webAppDiscoveryRunId,
              firstDiscoveredAt: discoveredAt,
              lastDiscoveredAt: discoveredAt,
            })
          : await repository.refreshDiscoveredStructureNode({
              discoveredWebAppStructureNodeId: existing.discoveredWebAppStructureNodeId,
              rootFamilyId: candidate.rootFamilyId,
              structureKey: candidate.structureKey,
              parentStructureKey: candidate.parentStructureKey,
              parentDiscoveredWebAppStructureNodeId,
              nodeKey: candidate.nodeKey,
              nodeKind: candidate.nodeKind,
              displayLabel: candidate.displayLabel,
              depth: candidate.depth,
              linkedDiscoveredWebAppSurfaceId,
              providerKey: candidate.providerKey,
              implementationSourcePath: candidate.implementationSourcePath,
              lastDiscoveredRunId: run.webAppDiscoveryRunId,
              lastDiscoveredAt: discoveredAt,
              staleAt: null,
            });

      if (!existing) {
        structureCreatedCount += 1;
      } else if (
        structureCandidateChanged(
          existing,
          candidate,
          parentDiscoveredWebAppStructureNodeId,
          linkedDiscoveredWebAppSurfaceId,
        )
      ) {
        structureRefreshedCount += 1;
      } else {
        structureUnchangedCount += 1;
      }

      await repository.createStructureObservation({
        discoveredWebAppStructureObservationId: createWebAppSurfaceDiscoveryId(),
        webAppDiscoveryRunId: run.webAppDiscoveryRunId,
        discoveredWebAppStructureNodeId: persisted.discoveredWebAppStructureNodeId,
        rootFamilyId: persisted.rootFamilyId,
        structureKey: persisted.structureKey,
        parentStructureKey: persisted.parentStructureKey,
        parentDiscoveredWebAppStructureNodeId: persisted.parentDiscoveredWebAppStructureNodeId,
        nodeKey: persisted.nodeKey,
        nodeKind: persisted.nodeKind,
        displayLabel: persisted.displayLabel,
        depth: persisted.depth,
        linkedDiscoveredWebAppSurfaceId: persisted.linkedDiscoveredWebAppSurfaceId,
        providerKey: persisted.providerKey,
        implementationSourcePath: persisted.implementationSourcePath,
        observedAt: discoveredAt,
      });

      seenStructureKeys.add(candidate.structureKey);
      persistedStructureByKey.set(candidate.structureKey, persisted);
    }

    let staleCount = 0;
    for (const surface of existingSurfaces) {
      if (seenCanonicalLocators.has(surface.canonicalLocator) || surface.staleAt) {
        continue;
      }
      await repository.markSurfaceStale(surface.discoveredWebAppSurfaceId, new Date());
      staleCount += 1;
    }

    let structureStaleCount = 0;
    for (const node of existingStructureNodes) {
      if (seenStructureKeys.has(node.structureKey) || node.staleAt) {
        continue;
      }
      await repository.markStructureNodeStale(node.discoveredWebAppStructureNodeId, new Date());
      structureStaleCount += 1;
    }

    return repository.completeDiscoveryRun({
      webAppDiscoveryRunId: run.webAppDiscoveryRunId,
      status: "succeeded",
      completedAt: new Date(),
      failureSummary: null,
      createdCount,
      refreshedCount,
      unchangedCount,
      staleCount,
      supportOnlyCount: surfaceCandidates.filter(
        (candidate) => candidate.userFacingDisposition === "support-only",
      ).length,
      reviewRequiredCount: surfaceCandidates.filter(
        (candidate) => candidate.userFacingDisposition === "review-required",
      ).length,
      structureCreatedCount,
      structureRefreshedCount,
      structureUnchangedCount,
      structureStaleCount,
    });
  } catch (error) {
    await repository.completeDiscoveryRun({
      webAppDiscoveryRunId: run.webAppDiscoveryRunId,
      status: "failed",
      completedAt: new Date(),
      failureSummary: error instanceof Error ? error.message : "Unknown discovery failure.",
      createdCount: 0,
      refreshedCount: 0,
      unchangedCount: 0,
      staleCount: 0,
      supportOnlyCount: 0,
      reviewRequiredCount: 0,
      structureCreatedCount: 0,
      structureRefreshedCount: 0,
      structureUnchangedCount: 0,
      structureStaleCount: 0,
    });
    throw error;
  }
}
