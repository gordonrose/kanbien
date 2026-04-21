import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import type { WebAppSurfaceDiscoveryIntegrationSeam } from "../../src/features/webAppSurfaceDiscovery";
import type {
  DiscoveredWebAppStructureNodeData,
  DiscoveredWebAppSurfaceData,
} from "../../src/features/webAppSurfaceDiscovery/domain/types";
import { createWebAppHierarchyBuilderService } from "../../src/features/webAppHierarchyBuilder/domain/service";
import type {
  DesignSystemMaterializationPlan,
  DesignSystemMaterializer,
  WebAppDiscoveryLinkData,
  WebAppModuleData,
  WebAppPageData,
  WebAppPageLocatorData,
  WebAppRootFamilyData,
} from "../../src/features/webAppHierarchyBuilder/domain/types";
import { computeResolvedFullRoutePaths } from "../../src/features/webAppHierarchyBuilder/domain/helpers";
import type { WebAppHierarchyRepository } from "../../src/features/webAppHierarchyBuilder/persistence/repository";
import type {
  BootstrapUpsertWebAppPageRecordInput,
  CreateWebAppModuleRecordInput,
  CreateWebAppPageRecordInput,
  MoveWebAppPageRecordInput,
  UpsertWebAppDiscoveryLinkRecordInput,
  UpsertWebAppPageLocatorRecordInput,
  UpdateWebAppModuleRecordInput,
  UpdateWebAppPageMetadataRecordInput,
} from "../../src/features/webAppHierarchyBuilder/persistence/types";
import { createWebAppHierarchyBuilderRouter } from "../../src/features/webAppHierarchyBuilder/transport/router";
import { invokeJson } from "../harness/http";
import type {
  RootAuthIntegrationHarness,
  SeededAuthIdentity,
} from "../harness/rootAuth/integrationHarness";

interface PasswordStageResponse {
  status: "SSH_CHALLENGE_REQUIRED";
  challengeId: string;
  challengeText: string;
}

interface SessionResponse {
  status: "AUTHENTICATED";
  sessionId: string;
  rootUserId: string;
}

export function createStubDesignSystemMaterializer(): DesignSystemMaterializer & {
  appliedPlans: DesignSystemMaterializationPlan[];
} {
  const appliedPlans: DesignSystemMaterializationPlan[] = [];
  return {
    appliedPlans,
    plan(routePath, pageKey) {
      const relativeSegments = routePath.replace(/^\/design-system\/?/, "").split("/").filter(Boolean);
      const folderPath = `src/frontend/designSystem/${relativeSegments.join("/") || ""}`.replace(/\/+$/g, "");
      return {
        folderPath,
        indexHtmlPath: `${folderPath}/index.html`,
        governanceStubPath: `docs/workspace/design-system/generated-pages/${pageKey}.md`,
      };
    },
    async apply(input) {
      const plan = {
        folderPath: `src/frontend/designSystem/${input.routePath
          .replace(/^\/design-system\/?/, "")
          .split("/")
          .filter(Boolean)
          .join("/")}`.replace(/\/+$/g, ""),
        indexHtmlPath: `src/frontend/designSystem/${input.routePath
          .replace(/^\/design-system\/?/, "")
          .split("/")
          .filter(Boolean)
          .join("/")}/index.html`,
        governanceStubPath: `docs/workspace/design-system/generated-pages/${input.pageKey}.md`,
      };
      appliedPlans.push(plan);
      return plan;
    },
  };
}

export function createStubWebAppSurfaceDiscoveryIntegrationSeam(
  overrides: Partial<WebAppSurfaceDiscoveryIntegrationSeam> = {},
): WebAppSurfaceDiscoveryIntegrationSeam {
  const baseListSurfaces = overrides.listDiscoveredWebAppSurfaces
    ?? (async () => [] as DiscoveredWebAppSurfaceData[]);

  async function derivedStructureTree(input?: {
    rootFamilyId?: "root-admin" | "login" | "design-system";
    staleStatus?: "current" | "stale" | "all";
  }): Promise<DiscoveredWebAppStructureNodeData[]> {
    if (overrides.listDiscoveredWebAppStructureTree) {
      return overrides.listDiscoveredWebAppStructureTree(input);
    }
    const surfaces = await baseListSurfaces({ staleStatus: input?.staleStatus ?? "all" });
    const nodes: DiscoveredWebAppStructureNodeData[] = [];
    const nodeByKey = new Map<string, DiscoveredWebAppStructureNodeData>();
    const now = new Date("2026-04-19T12:00:00.000Z");
    const filteredSurfaces = surfaces.filter((surface) => !input?.rootFamilyId || surface.rootFamilyId === input.rootFamilyId);
    const pathRoutes = filteredSurfaces
      .filter((surface) => surface.locatorType === "path" && surface.routePath)
      .map((surface) => surface.routePath!);

    for (const surface of filteredSurfaces) {
      const rootKey = surface.rootFamilyId;
      if (!nodeByKey.has(rootKey)) {
        const rootNode: DiscoveredWebAppStructureNodeData = {
          discoveredWebAppStructureNodeId: `root-${surface.rootFamilyId}`,
          rootFamilyId: surface.rootFamilyId,
          structureKey: rootKey,
          parentStructureKey: null,
          parentDiscoveredWebAppStructureNodeId: null,
          nodeKey: surface.rootFamilyId,
          nodeKind: "root",
          displayLabel: null,
          depth: 0,
          linkedDiscoveredWebAppSurfaceId: null,
          providerKey: surface.providerKey,
          implementationSourcePath: null,
          firstDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
          lastDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
          firstDiscoveredAt: now,
          lastDiscoveredAt: now,
          staleAt: null,
          createdAt: now,
          updatedAt: now,
        };
        nodeByKey.set(rootKey, rootNode);
        nodes.push(rootNode);
      }

      if (surface.locatorType === "hash-state" && surface.routeHash) {
        const key = `${surface.rootFamilyId}#${surface.routeHash}`;
        nodes.push({
          discoveredWebAppStructureNodeId: `node-${key}`,
          rootFamilyId: surface.rootFamilyId,
          structureKey: key,
          parentStructureKey: rootKey,
          parentDiscoveredWebAppStructureNodeId: `root-${surface.rootFamilyId}`,
          nodeKey: surface.routeHash,
          nodeKind: "shell-state-surface",
          displayLabel: surface.displayLabel,
          depth: 1,
          linkedDiscoveredWebAppSurfaceId: surface.discoveredWebAppSurfaceId,
          providerKey: surface.providerKey,
          implementationSourcePath: surface.implementationSourcePath,
          firstDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
          lastDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
          firstDiscoveredAt: now,
          lastDiscoveredAt: now,
          staleAt: surface.staleAt,
          createdAt: now,
          updatedAt: now,
        });
        continue;
      }

      if (!surface.routePath) {
        continue;
      }
      const relativeSegments = surface.routePath
        .replace(new RegExp(`^/${surface.rootFamilyId}/?`), "")
        .split("/")
        .filter(Boolean);
      let parentKey: string = rootKey;
      let parentId = `root-${surface.rootFamilyId}`;
      for (let index = 0; index < relativeSegments.length; index += 1) {
        const segment = relativeSegments[index]!;
        const structureKey = `${surface.rootFamilyId}/${relativeSegments.slice(0, index + 1).join("/")}`;
        const shouldTreatLastSegmentAsGroup =
          index === relativeSegments.length - 1
            && pathRoutes.some((routePath) => routePath !== surface.routePath && routePath.startsWith(`${surface.routePath}/`));
        if (!nodeByKey.has(structureKey)) {
          const node: DiscoveredWebAppStructureNodeData = {
            discoveredWebAppStructureNodeId: `node-${structureKey}`,
            rootFamilyId: surface.rootFamilyId,
            structureKey,
            parentStructureKey: parentKey,
            parentDiscoveredWebAppStructureNodeId: parentId,
            nodeKey: segment,
            nodeKind: index === relativeSegments.length - 1 && !shouldTreatLastSegmentAsGroup ? "page-surface" : "group",
            displayLabel: surface.displayLabel,
            depth: index + 1,
            linkedDiscoveredWebAppSurfaceId:
              index === relativeSegments.length - 1 && !shouldTreatLastSegmentAsGroup
                ? surface.discoveredWebAppSurfaceId
                : null,
            providerKey: surface.providerKey,
            implementationSourcePath: surface.implementationSourcePath,
            firstDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
            lastDiscoveredRunId: "99999999-9999-4999-8999-999999999999",
            firstDiscoveredAt: now,
            lastDiscoveredAt: now,
            staleAt: surface.staleAt,
            createdAt: now,
            updatedAt: now,
          };
          nodeByKey.set(structureKey, node);
          nodes.push(node);
        }
        parentKey = structureKey;
        parentId = `node-${structureKey}`;
      }
    }

    return nodes;
  }

  return {
    async runCurrentApprovedRootFamilyDiscovery() {
      const now = new Date("2026-04-19T12:00:00.000Z");
      return {
        webAppDiscoveryRunId: "99999999-9999-4999-8999-999999999999",
        scopeKey: "current-approved-root-families",
        status: "succeeded",
        triggerKind: "manual",
        providerVersion: "1",
        createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        startedAt: now,
        completedAt: now,
        failureSummary: null,
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
        createdAt: now,
        updatedAt: now,
      };
    },
    listDiscoveredWebAppSurfaces: baseListSurfaces,
    listDiscoveredWebAppStructureTree: derivedStructureTree,
    async getDiscoveredWebAppStructureNode() {
      return null;
    },
    ...overrides,
  };
}

function cloneRootFamily(rootFamily: WebAppRootFamilyData): WebAppRootFamilyData {
  return {
    ...rootFamily,
    createdAt: new Date(rootFamily.createdAt),
    updatedAt: new Date(rootFamily.updatedAt),
  };
}

function cloneModule(module: WebAppModuleData): WebAppModuleData {
  return {
    ...module,
    createdAt: new Date(module.createdAt),
    updatedAt: new Date(module.updatedAt),
  };
}

function clonePage(page: WebAppPageData): WebAppPageData {
  return {
    ...page,
    createdAt: new Date(page.createdAt),
    updatedAt: new Date(page.updatedAt),
  };
}

function cloneLocator(locator: WebAppPageLocatorData): WebAppPageLocatorData {
  return {
    ...locator,
    createdAt: new Date(locator.createdAt),
    updatedAt: new Date(locator.updatedAt),
  };
}

function cloneDiscoveryLink(link: WebAppDiscoveryLinkData): WebAppDiscoveryLinkData {
  return {
    ...link,
    createdAt: new Date(link.createdAt),
    updatedAt: new Date(link.updatedAt),
  };
}

export function createRootFamilyRecord(
  overrides: Partial<WebAppRootFamilyData> = {},
): WebAppRootFamilyData {
  const now = new Date("2026-04-19T00:00:00.000Z");
  return {
    rootFamilyId: "root-admin",
    displayLabel: "Root Admin",
    routePrefix: "/root-admin",
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createModuleRecord(
  overrides: Partial<WebAppModuleData> = {},
): WebAppModuleData {
  const now = new Date("2026-04-19T00:00:00.000Z");
  return {
    webAppModuleId: "11111111-1111-4111-8111-111111111111",
    rootFamilyId: "root-admin",
    moduleKey: "catalog",
    displayLabel: "Catalog",
    landingPageWebAppPageId: null,
    status: "draft",
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createPageRecord(
  overrides: Partial<WebAppPageData> = {},
): WebAppPageData {
  const now = new Date("2026-04-19T00:00:00.000Z");
  return {
    webAppPageId: "22222222-2222-4222-8222-222222222222",
    rootFamilyId: "root-admin",
    webAppModuleId: "11111111-1111-4111-8111-111111111111",
    parentPageId: null,
    placementType: "module-root",
    pageKey: "catalog-home",
    displayLabel: "Catalog Home",
    routeSegment: "catalog",
    normalizedRouteSegment: "catalog",
    resolvedFullRoutePath: "/root-admin/catalog",
    status: "draft",
    sortOrder: 0,
    createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    bootstrapSource: null,
    topologyState: "applied",
    templateKey: null,
    materializedAt: null,
    createdAt: now,
    updatedAt: now,
    activeLocator: null,
    ...overrides,
  };
}

export function createPageLocatorRecord(
  overrides: Partial<WebAppPageLocatorData> = {},
): WebAppPageLocatorData {
  const now = new Date("2026-04-19T00:00:00.000Z");
  return {
    webAppPageLocatorId: "66666666-6666-4666-8666-666666666666",
    webAppPageId: "22222222-2222-4222-8222-222222222222",
    rootFamilyId: "root-admin",
    locatorType: "path",
    canonicalLocator: "/root-admin/catalog",
    routePath: "/root-admin/catalog",
    routeHash: null,
    normalizedLocatorKey: "/root-admin/catalog",
    isActive: true,
    createdByRootAdminUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createDiscoveryLinkRecord(
  overrides: Partial<WebAppDiscoveryLinkData> = {},
): WebAppDiscoveryLinkData {
  const now = new Date("2026-04-19T00:00:00.000Z");
  return {
    webAppDiscoveryLinkId: "77777777-7777-4777-8777-777777777777",
    discoveredWebAppStructureNodeId: "33333333-3333-4333-8333-333333333333",
    discoveredWebAppSurfaceId: "22222222-2222-4222-8222-222222222222",
    rootFamilyId: "design-system",
    curatedTargetType: "page",
    curatedWebAppModuleId: null,
    curatedWebAppPageId: "22222222-2222-4222-8222-222222222222",
    linkStatus: "matched",
    driftStatus: "none",
    driftSummary: null,
    lastComparedWebAppDiscoveryRunId: "99999999-9999-4999-8999-999999999999",
    lastMatchedWebAppDiscoveryRunId: "99999999-9999-4999-8999-999999999999",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createInMemoryWebAppHierarchyRepository(seed?: {
  rootFamilies?: WebAppRootFamilyData[];
  modules?: WebAppModuleData[];
  pages?: WebAppPageData[];
  pageLocators?: WebAppPageLocatorData[];
  discoveryLinks?: WebAppDiscoveryLinkData[];
}): WebAppHierarchyRepository & {
  rootFamilies: Map<string, WebAppRootFamilyData>;
  modules: Map<string, WebAppModuleData>;
  pages: Map<string, WebAppPageData>;
  pageLocators: Map<string, WebAppPageLocatorData>;
  discoveryLinks: Map<string, WebAppDiscoveryLinkData>;
} {
  const rootFamilies = new Map(
    (seed?.rootFamilies ?? [
      createRootFamilyRecord(),
      createRootFamilyRecord({
        rootFamilyId: "login",
        displayLabel: "Login",
        routePrefix: "/login",
        sortOrder: 1,
      }),
      createRootFamilyRecord({
        rootFamilyId: "design-system",
        displayLabel: "Design System",
        routePrefix: "/design-system",
        sortOrder: 2,
      }),
    ]).map((item) => [item.rootFamilyId, cloneRootFamily(item)]),
  );
  const modules = new Map(
    (seed?.modules ?? []).map((item) => [item.webAppModuleId, cloneModule(item)]),
  );
  const pages = new Map((seed?.pages ?? []).map((item) => [item.webAppPageId, clonePage(item)]));
  const pageLocators = new Map(
    (seed?.pageLocators ?? []).map((item) => [item.webAppPageLocatorId, cloneLocator(item)]),
  );
  const discoveryLinks = new Map(
    (seed?.discoveryLinks ?? []).map((item) => [item.webAppDiscoveryLinkId, cloneDiscoveryLink(item)]),
  );

  return {
    rootFamilies,
    modules,
    pages,
    pageLocators,
    discoveryLinks,
    async listRootFamilies() {
      return [...rootFamilies.values()].map(cloneRootFamily);
    },
    async listModules() {
      return [...modules.values()].map(cloneModule);
    },
    async listPages() {
      const activeLocatorByPageId = new Map(
        [...pageLocators.values()].filter((item) => item.isActive).map((item) => [item.webAppPageId, item]),
      );
      return [...pages.values()].map((page) =>
        clonePage({
          ...page,
          activeLocator: activeLocatorByPageId.get(page.webAppPageId)
            ? cloneLocator(activeLocatorByPageId.get(page.webAppPageId)!)
            : null,
        }),
      );
    },
    async findModuleById(webAppModuleId) {
      const record = modules.get(webAppModuleId) ?? null;
      return record ? cloneModule(record) : null;
    },
    async findModuleByKey(moduleKey) {
      const record =
        [...modules.values()].find((item) => item.moduleKey === moduleKey.trim().toLowerCase()) ?? null;
      return record ? cloneModule(record) : null;
    },
    async createModule(input: CreateWebAppModuleRecordInput) {
      const record = createModuleRecord({
        webAppModuleId: input.webAppModuleId,
        rootFamilyId: input.rootFamilyId,
        moduleKey: input.moduleKey,
        displayLabel: input.displayLabel,
        landingPageWebAppPageId: input.landingPageWebAppPageId ?? null,
        status: input.status,
        sortOrder: input.sortOrder,
      });
      modules.set(record.webAppModuleId, record);
      return cloneModule(record);
    },
    async updateModule(input: UpdateWebAppModuleRecordInput) {
      const current = modules.get(input.webAppModuleId)!;
      const next = createModuleRecord({
        ...current,
        displayLabel: input.displayLabel ?? current.displayLabel,
        landingPageWebAppPageId:
          input.landingPageWebAppPageId !== undefined
            ? input.landingPageWebAppPageId
            : current.landingPageWebAppPageId,
        status: input.status ?? current.status,
        sortOrder: input.sortOrder ?? current.sortOrder,
        createdAt: current.createdAt,
        updatedAt: new Date("2026-04-19T01:00:00.000Z"),
      });
      modules.set(next.webAppModuleId, next);
      return cloneModule(next);
    },
    async findPageById(webAppPageId) {
      const record = pages.get(webAppPageId) ?? null;
      if (!record) {
        return null;
      }
      const activeLocator =
        [...pageLocators.values()].find((item) => item.webAppPageId === webAppPageId && item.isActive) ?? null;
      return clonePage({
        ...record,
        activeLocator: activeLocator ? cloneLocator(activeLocator) : null,
      });
    },
    async findPageByKey(pageKey) {
      const record =
        [...pages.values()].find((item) => item.pageKey === pageKey.trim().toLowerCase()) ?? null;
      if (!record) {
        return null;
      }
      const activeLocator =
        [...pageLocators.values()].find((item) => item.webAppPageId === record.webAppPageId && item.isActive) ?? null;
      return clonePage({
        ...record,
        activeLocator: activeLocator ? cloneLocator(activeLocator) : null,
      });
    },
    async findPageByPlacementRoute(webAppModuleId, parentPageId, placementType, routeSegment) {
      if (placementType === "orphaned") {
        return null;
      }
      const record =
        [...pages.values()].find(
          (item) =>
            item.webAppModuleId === webAppModuleId &&
            item.parentPageId === parentPageId &&
            item.placementType === placementType &&
            item.normalizedRouteSegment === routeSegment.trim().toLowerCase(),
        ) ?? null;
      return record ? clonePage(record) : null;
    },
    async createPage(input: CreateWebAppPageRecordInput) {
      const record = createPageRecord({
        webAppPageId: input.webAppPageId,
        rootFamilyId: input.rootFamilyId,
        webAppModuleId: input.webAppModuleId,
        parentPageId: input.parentPageId,
        placementType: input.placementType,
        pageKey: input.pageKey,
        displayLabel: input.displayLabel,
        routeSegment: input.routeSegment,
        normalizedRouteSegment: input.routeSegment,
        resolvedFullRoutePath: null,
        status: input.status,
        sortOrder: input.sortOrder,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
        bootstrapSource: input.bootstrapSource,
        topologyState: input.topologyState,
        templateKey: input.templateKey,
        materializedAt: input.materializedAt,
      });
      pages.set(record.webAppPageId, record);
      return clonePage(record);
    },
    async bootstrapUpsertPage(input: BootstrapUpsertWebAppPageRecordInput) {
      const existing = [...pages.values()].find((item) => item.pageKey === input.pageKey);
      if (!existing) {
        return this.createPage(input);
      }
      const next = createPageRecord({
        ...existing,
        rootFamilyId: input.rootFamilyId,
        webAppModuleId: input.webAppModuleId,
        parentPageId: input.parentPageId,
        placementType: input.placementType,
        displayLabel: input.displayLabel,
        routeSegment: input.routeSegment,
        normalizedRouteSegment: input.routeSegment,
        status: input.status,
        sortOrder: input.sortOrder,
        bootstrapSource: input.bootstrapSource,
        topologyState: input.topologyState,
        templateKey: input.templateKey,
        materializedAt: input.materializedAt,
        updatedAt: new Date("2026-04-19T01:00:00.000Z"),
      });
      pages.set(next.webAppPageId, next);
      return clonePage(next);
    },
    async updatePageMetadata(input: UpdateWebAppPageMetadataRecordInput) {
      const current = pages.get(input.webAppPageId)!;
      const next = createPageRecord({
        ...current,
        displayLabel: input.displayLabel ?? current.displayLabel,
        routeSegment: input.routeSegment ?? current.routeSegment,
        normalizedRouteSegment: (input.routeSegment ?? current.routeSegment).trim().toLowerCase(),
        status: input.status ?? current.status,
        sortOrder: input.sortOrder ?? current.sortOrder,
        updatedAt: new Date("2026-04-19T01:30:00.000Z"),
      });
      pages.set(next.webAppPageId, next);
      return clonePage(next);
    },
    async markPageApplied(input) {
      const current = pages.get(input.webAppPageId)!;
      const next = createPageRecord({
        ...current,
        topologyState: "applied",
        materializedAt: input.materializedAt,
        updatedAt: new Date("2026-04-19T01:45:00.000Z"),
      });
      pages.set(next.webAppPageId, next);
      return clonePage(next);
    },
    async movePage(input: MoveWebAppPageRecordInput) {
      const current = pages.get(input.webAppPageId)!;
      const next = createPageRecord({
        ...current,
        rootFamilyId: input.rootFamilyId,
        webAppModuleId: input.webAppModuleId,
        parentPageId: input.parentPageId,
        placementType: input.placementType,
        sortOrder: input.sortOrder ?? current.sortOrder,
        updatedAt: new Date("2026-04-19T02:00:00.000Z"),
      });
      pages.set(next.webAppPageId, next);
      return clonePage(next);
    },
    async listPageLocators() {
      return [...pageLocators.values()].map(cloneLocator);
    },
    async findActivePageLocatorByPageId(webAppPageId) {
      const locator =
        [...pageLocators.values()].find((item) => item.webAppPageId === webAppPageId && item.isActive) ?? null;
      return locator ? cloneLocator(locator) : null;
    },
    async findActivePageLocatorByNormalizedKey(normalizedLocatorKey) {
      const locator =
        [...pageLocators.values()].find(
          (item) => item.normalizedLocatorKey === normalizedLocatorKey && item.isActive,
        ) ?? null;
      return locator ? cloneLocator(locator) : null;
    },
    async upsertActivePageLocator(input: UpsertWebAppPageLocatorRecordInput) {
      for (const [id, locator] of pageLocators) {
        if (locator.webAppPageId === input.webAppPageId && locator.isActive) {
          pageLocators.set(id, cloneLocator({ ...locator, isActive: false }));
        }
      }
      const existing =
        [...pageLocators.values()].find((item) => item.normalizedLocatorKey === input.normalizedLocatorKey) ?? null;
      const next = createPageLocatorRecord({
        ...(existing ?? {}),
        webAppPageLocatorId: existing?.webAppPageLocatorId ?? input.webAppPageLocatorId,
        webAppPageId: input.webAppPageId,
        rootFamilyId: input.rootFamilyId,
        locatorType: input.locatorType,
        canonicalLocator: input.canonicalLocator,
        routePath: input.routePath,
        routeHash: input.routeHash,
        normalizedLocatorKey: input.normalizedLocatorKey,
        isActive: true,
        createdByRootAdminUserId: input.createdByRootAdminUserId,
      });
      pageLocators.set(next.webAppPageLocatorId, next);
      return cloneLocator(next);
    },
    async listDiscoveryLinks(input = {}) {
      return [...discoveryLinks.values()]
        .filter((item) => !input.rootFamilyId || item.rootFamilyId === input.rootFamilyId)
        .filter((item) => !input.linkStatus || item.linkStatus === input.linkStatus)
        .filter((item) => !input.driftStatus || item.driftStatus === input.driftStatus)
        .filter((item) => !input.curatedTargetType || item.curatedTargetType === input.curatedTargetType)
        .map(cloneDiscoveryLink);
    },
    async findDiscoveryLinkByDiscoveredStructureNodeId(discoveredWebAppStructureNodeId) {
      const link =
        [...discoveryLinks.values()].find(
          (item) => item.discoveredWebAppStructureNodeId === discoveredWebAppStructureNodeId,
        ) ?? null;
      return link ? cloneDiscoveryLink(link) : null;
    },
    async upsertDiscoveryLink(input: UpsertWebAppDiscoveryLinkRecordInput) {
      const existing =
        [...discoveryLinks.values()].find(
          (item) => item.discoveredWebAppStructureNodeId === input.discoveredWebAppStructureNodeId,
        ) ?? null;
      const next = createDiscoveryLinkRecord({
        ...(existing ?? {}),
        webAppDiscoveryLinkId: existing?.webAppDiscoveryLinkId ?? input.webAppDiscoveryLinkId,
        discoveredWebAppStructureNodeId: input.discoveredWebAppStructureNodeId,
        discoveredWebAppSurfaceId: input.discoveredWebAppSurfaceId,
        rootFamilyId: input.rootFamilyId,
        curatedTargetType: input.curatedTargetType,
        curatedWebAppModuleId: input.curatedWebAppModuleId,
        curatedWebAppPageId: input.curatedWebAppPageId,
        linkStatus: input.linkStatus,
        driftStatus: input.driftStatus,
        driftSummary: input.driftSummary,
        lastComparedWebAppDiscoveryRunId: input.lastComparedWebAppDiscoveryRunId,
        lastMatchedWebAppDiscoveryRunId: input.lastMatchedWebAppDiscoveryRunId,
      });
      discoveryLinks.set(next.webAppDiscoveryLinkId, next);
      return cloneDiscoveryLink(next);
    },
    async updateResolvedFullRoutePaths(updates) {
      for (const update of updates) {
        const current = pages.get(update.webAppPageId);
        if (!current) {
          continue;
        }
        pages.set(
          current.webAppPageId,
          createPageRecord({
            ...current,
            resolvedFullRoutePath: update.resolvedFullRoutePath,
            updatedAt: new Date("2026-04-19T02:30:00.000Z"),
          }),
        );
      }
    },
  };
}

export async function loginViaPasswordAndSsh(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
): Promise<SessionResponse> {
  const passwordResponse = await invokeJson<PasswordStageResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/password",
    body: {
      email: identity.loginEmail,
      password: identity.password,
    },
  });
  if (passwordResponse.status !== 200) {
    throw new Error(`Expected password-stage login success, received ${passwordResponse.status}`);
  }

  const sshResponse = await invokeJson<SessionResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/ssh",
    body: {
      challengeId: passwordResponse.body.challengeId,
      publicKeyFingerprint: identity.sshKey.fingerprint,
      signature: identity.sshKey.signChallengeText(passwordResponse.body.challengeText),
    },
  });
  if (sshResponse.status !== 200) {
    throw new Error(`Expected ssh-stage login success, received ${sshResponse.status}`);
  }
  return sshResponse.body;
}

export function mountWebAppHierarchyBuilderFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: WebAppHierarchyRepository,
  discoverySeam: WebAppSurfaceDiscoveryIntegrationSeam = createStubWebAppSurfaceDiscoveryIntegrationSeam(),
  designSystemMaterializer: DesignSystemMaterializer = createStubDesignSystemMaterializer(),
) {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession
        ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}`
        : null,
  });
  const capabilityChecker = {
    async hasCapability(input: { rootUserId: string; capabilityKey: string }) {
      return harness.getRootUserCapabilities(input.rootUserId).includes(input.capabilityKey);
    },
  };

  app.use(
    "/v1/web-app-hierarchy",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createWebAppHierarchyBuilderRouter(
      createWebAppHierarchyBuilderService(repository, discoverySeam, designSystemMaterializer),
      capabilityChecker,
      harness.platformSecurityRepository,
    ),
  );
}

export function refreshInMemoryResolvedPaths(
  repository: ReturnType<typeof createInMemoryWebAppHierarchyRepository>,
) {
  const updates = computeResolvedFullRoutePaths(
    [...repository.rootFamilies.values()],
    [...repository.pages.values()],
  );
  for (const update of updates) {
    const current = repository.pages.get(update.webAppPageId);
    if (!current) {
      continue;
    }
    repository.pages.set(
      current.webAppPageId,
      createPageRecord({
        ...current,
        resolvedFullRoutePath: update.resolvedFullRoutePath,
      }),
    );
  }
}
