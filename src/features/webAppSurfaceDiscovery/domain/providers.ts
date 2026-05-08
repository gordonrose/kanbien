import {
  listDesignSystemDiscoveredRoutes,
  type DesignSystemDiscoveredRoute,
} from "../../../frontend/designSystem/discovery";
import {
  listRootAdminShellDiscoveredStates,
  listRootAdminShellSupportRoutes,
} from "../../../frontend/rootAdminShell/discovery";
import { listLoginDiscoveredSurfaces } from "../../../frontend/login/discovery";
import {
  normalizeCanonicalLocator,
  normalizeKey,
  normalizeRouteHash,
  normalizeStructureKey,
} from "./helpers";
import type {
  DiscoveredStructureNodeKind,
  DiscoveredWebAppStructureNodeCandidate,
  DiscoveredWebAppSurfaceCandidate,
  DiscoveredSurfaceDisposition,
  WebAppRootFamilyId,
} from "./types";

export interface WebAppSurfaceDiscoveryProviderOutput {
  surfaces: DiscoveredWebAppSurfaceCandidate[];
  structureNodes: DiscoveredWebAppStructureNodeCandidate[];
}

export interface WebAppSurfaceDiscoveryProvider {
  key: string;
  rootFamilyId: WebAppRootFamilyId;
  discover(): Promise<WebAppSurfaceDiscoveryProviderOutput>;
}

function toStructureNodeKindForLeaf(
  disposition: DiscoveredSurfaceDisposition,
  surfaceKind: DiscoveredWebAppSurfaceCandidate["surfaceKind"],
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

function createRootNode(
  rootFamilyId: WebAppRootFamilyId,
  providerKey: string,
): DiscoveredWebAppStructureNodeCandidate {
  return {
    rootFamilyId,
    structureKey: normalizeStructureKey(rootFamilyId),
    parentStructureKey: null,
    nodeKey: normalizeKey(rootFamilyId),
    nodeKind: "root",
    displayLabel: null,
    depth: 0,
    linkedSurfaceCanonicalLocator: null,
    providerKey,
    implementationSourcePath: null,
  };
}

function collectPathNodes(
  nodes: Map<string, DiscoveredWebAppStructureNodeCandidate>,
  surface: DiscoveredWebAppSurfaceCandidate,
  rootPrefix: string,
  shouldTreatLastSegmentAsGroup: boolean,
): void {
  if (!surface.routePath || surface.locatorType !== "path") {
    return;
  }

  const relativePath = surface.routePath
    .slice(rootPrefix.length)
    .replace(/^\/+/, "");
  const segments = relativePath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return;
  }

  let parentStructureKey = normalizeStructureKey(surface.rootFamilyId);

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const depth = index + 1;
    const structureKey = normalizeStructureKey(
      `${surface.rootFamilyId}/${segments.slice(0, index + 1).join("/")}`,
    );
    const existing = nodes.get(structureKey);
    const nextNodeKind =
      !isLast || shouldTreatLastSegmentAsGroup
        ? "group"
        : toStructureNodeKindForLeaf(surface.userFacingDisposition, surface.surfaceKind);

    const nextNode: DiscoveredWebAppStructureNodeCandidate = {
      rootFamilyId: surface.rootFamilyId,
      structureKey,
      parentStructureKey,
      nodeKey: normalizeKey(segment),
      nodeKind: existing?.nodeKind === "group" || nextNodeKind === "group" ? "group" : nextNodeKind,
      displayLabel:
        existing?.displayLabel
          ?? surface.displayLabel,
      depth,
      linkedSurfaceCanonicalLocator:
        existing?.linkedSurfaceCanonicalLocator
        ?? (isLast ? surface.canonicalLocator : null),
      providerKey: surface.providerKey,
      implementationSourcePath: existing?.implementationSourcePath ?? surface.implementationSourcePath,
    };

    nodes.set(structureKey, existing ? { ...existing, ...nextNode } : nextNode);
    parentStructureKey = structureKey;
  });
}

function collectHashNode(
  nodes: Map<string, DiscoveredWebAppStructureNodeCandidate>,
  surface: DiscoveredWebAppSurfaceCandidate,
): void {
  if (surface.locatorType !== "hash-state" || !surface.routeHash) {
    return;
  }

  const structureKey = normalizeStructureKey(`${surface.rootFamilyId}#${surface.routeHash}`);
  nodes.set(structureKey, {
    rootFamilyId: surface.rootFamilyId,
    structureKey,
    parentStructureKey: normalizeStructureKey(surface.rootFamilyId),
    nodeKey: normalizeKey(surface.routeHash),
    nodeKind: "shell-state-surface",
    displayLabel: surface.displayLabel,
    depth: 1,
    linkedSurfaceCanonicalLocator: surface.canonicalLocator,
    providerKey: surface.providerKey,
    implementationSourcePath: surface.implementationSourcePath,
  });
}

function buildStructureNodesFromSurfaces(
  rootFamilyId: WebAppRootFamilyId,
  providerKey: string,
  surfaces: DiscoveredWebAppSurfaceCandidate[],
  rootPrefix: string,
): DiscoveredWebAppStructureNodeCandidate[] {
  const nodes = new Map<string, DiscoveredWebAppStructureNodeCandidate>();
  nodes.set(normalizeStructureKey(rootFamilyId), createRootNode(rootFamilyId, providerKey));

  const pathRoutes = surfaces
    .filter((surface) => surface.locatorType === "path" && surface.routePath)
    .map((surface) => surface.routePath!);

  for (const surface of surfaces) {
    if (surface.locatorType === "hash-state") {
      collectHashNode(nodes, surface);
      continue;
    }

    if (surface.locatorType !== "path" || !surface.routePath) {
      continue;
    }

    const shouldTreatLastSegmentAsGroup = pathRoutes.some(
      (routePath) => routePath !== surface.routePath && routePath.startsWith(`${surface.routePath}/`),
    );
    collectPathNodes(nodes, surface, rootPrefix, shouldTreatLastSegmentAsGroup);
  }

  return [...nodes.values()].sort((left, right) => {
    const depthDiff = left.depth - right.depth;
    if (depthDiff !== 0) {
      return depthDiff;
    }
    return left.structureKey.localeCompare(right.structureKey);
  });
}

function mapDesignSystemRoute(route: DesignSystemDiscoveredRoute): DiscoveredWebAppSurfaceCandidate {
  return {
    rootFamilyId: "design-system",
    surfaceKind: "page-route",
    locatorType: "path",
    routePath: normalizeCanonicalLocator(route.routePath),
    routeHash: null,
    canonicalLocator: normalizeCanonicalLocator(route.routePath),
    displayLabel: route.displayLabel,
    userFacingDisposition: "user-facing",
    providerKey: "design-system-file-routes",
    implementationSourcePath: route.implementationSourcePath,
  };
}

export const designSystemDiscoveryProvider: WebAppSurfaceDiscoveryProvider = {
  key: "design-system-file-routes",
  rootFamilyId: "design-system",
  async discover() {
    const surfaces = (await listDesignSystemDiscoveredRoutes()).map(mapDesignSystemRoute);
    return {
      surfaces,
      structureNodes: buildStructureNodesFromSurfaces(
        "design-system",
        "design-system-file-routes",
        surfaces,
        "/design-system",
      ),
    };
  },
};

export const rootAdminShellDiscoveryProvider: WebAppSurfaceDiscoveryProvider = {
  key: "root-admin-shell",
  rootFamilyId: "root-admin",
  async discover() {
    const surfaces = [
      ...listRootAdminShellDiscoveredStates().map((state) => ({
        rootFamilyId: "root-admin" as const,
        surfaceKind: "page-route" as const,
        locatorType: "path" as const,
        routePath:
          state.pageKey === "overview"
            ? "/root-admin"
            : normalizeCanonicalLocator(state.routePath ?? `/root-admin/${state.pageKey}`),
        routeHash: null,
        canonicalLocator:
          state.pageKey === "overview"
            ? "/root-admin"
            : normalizeCanonicalLocator(state.routePath ?? `/root-admin/${state.pageKey}`),
        displayLabel: state.displayLabel,
        userFacingDisposition: "user-facing" as const,
        providerKey: "root-admin-shell",
        implementationSourcePath: state.implementationSourcePath,
      })),
      ...listRootAdminShellSupportRoutes().map((route) => ({
        rootFamilyId: "root-admin" as const,
        surfaceKind: "support-route" as const,
        locatorType: "path" as const,
        routePath: normalizeCanonicalLocator(route.routePath),
        routeHash: null,
        canonicalLocator: normalizeCanonicalLocator(route.routePath),
        displayLabel: route.displayLabel,
        userFacingDisposition: "support-only" as const,
        providerKey: "root-admin-shell",
        implementationSourcePath: route.implementationSourcePath,
      })),
    ];

    return {
      surfaces,
      structureNodes: buildStructureNodesFromSurfaces(
        "root-admin",
        "root-admin-shell",
        surfaces,
        "/root-admin",
      ),
    };
  },
};

export const loginDiscoveryProvider: WebAppSurfaceDiscoveryProvider = {
  key: "login-empty-provider",
  rootFamilyId: "login",
  async discover() {
    const surfaces = listLoginDiscoveredSurfaces().map((surface) => ({
      rootFamilyId: "login" as const,
      surfaceKind: "page-route" as const,
      locatorType: "path" as const,
      routePath: normalizeCanonicalLocator(surface.routePath),
      routeHash: null,
      canonicalLocator: normalizeCanonicalLocator(surface.routePath),
      displayLabel: surface.displayLabel,
      userFacingDisposition: "user-facing" as const,
      providerKey: "login-empty-provider",
      implementationSourcePath: surface.implementationSourcePath,
    }));

    return {
      surfaces,
      structureNodes: buildStructureNodesFromSurfaces(
        "login",
        "login-empty-provider",
        surfaces,
        "/login",
      ),
    };
  },
};

export function createDefaultWebAppSurfaceDiscoveryProviders(): WebAppSurfaceDiscoveryProvider[] {
  return [
    rootAdminShellDiscoveryProvider,
    loginDiscoveryProvider,
    designSystemDiscoveryProvider,
  ];
}
