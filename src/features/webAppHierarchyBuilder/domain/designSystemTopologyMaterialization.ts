import { createHash } from "node:crypto";
import {
  DesignSystemMaterializationBlockedError,
  DesignSystemMaterializationPreviewMismatchError,
  InvalidPlacementError,
  PageKeyAlreadyExistsError,
  PageLocatorConflictError,
  PageNotFoundError,
  RouteSegmentAlreadyExistsError,
  UnsupportedDesignSystemTemplateError,
} from "../contract/errors";
import type { DesignSystemMaterializationPreviewItem } from "../contract/types";
import { buildResolvedWebAppHierarchyTree, toWebAppPage } from "./presenters";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type {
  ApplyDesignSystemMaterializationInput,
  CreateDesignSystemPageProposalInput,
  CreateDesignSystemSubpageProposalInput,
  DesignSystemMaterializationApplyResult,
  DesignSystemMaterializationPreviewResult,
  DesignSystemProposalCreateResult,
  DesignSystemMaterializer,
  PreviewDesignSystemMaterializationInput,
  ResolvedWebAppHierarchyTree,
  WebAppModuleData,
  WebAppPageData,
  WebAppRootFamilyData,
} from "./types";
import {
  computeResolvedFullRoutePaths,
  createWebAppHierarchyId,
  normalizeKey,
  requireModule,
  requirePage,
  requireRootFamily,
  validateParentScope,
  validatePlacement,
} from "./helpers";

const DESIGN_SYSTEM_ROOT_FAMILY_ID = "design-system";
const DESIGN_SYSTEM_TEMPLATE_KEY = "static-html-page";

function buildPageKeyFromRoutePath(routePath: string): string {
  return routePath.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).join("-");
}

function buildPreviewHash(input: {
  classification: DesignSystemMaterializationPreviewResult["classification"];
  items: DesignSystemMaterializationPreviewItem[];
  pages: WebAppPageData[];
}): string {
  const payload = {
    classification: input.classification,
    pages: input.pages.map((page) => ({
      webAppPageId: page.webAppPageId,
      updatedAt: page.updatedAt.toISOString(),
      topologyState: page.topologyState,
      resolvedFullRoutePath: page.resolvedFullRoutePath,
    })),
    items: input.items,
  };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function buildAppliedDesignSystemTree(
  rootFamilies: WebAppRootFamilyData[],
  modules: WebAppModuleData[],
  pages: WebAppPageData[],
): ResolvedWebAppHierarchyTree {
  return buildResolvedWebAppHierarchyTree(
    rootFamilies.filter((item) => item.rootFamilyId === DESIGN_SYSTEM_ROOT_FAMILY_ID),
    modules.filter((item) => item.rootFamilyId === DESIGN_SYSTEM_ROOT_FAMILY_ID),
    pages.filter(
      (item) =>
        item.rootFamilyId === DESIGN_SYSTEM_ROOT_FAMILY_ID && item.topologyState === "applied",
    ),
    false,
    false,
  );
}

async function refreshResolvedPaths(repository: WebAppHierarchyRepository): Promise<void> {
  const [rootFamilies, pages] = await Promise.all([repository.listRootFamilies(), repository.listPages()]);
  await repository.updateResolvedFullRoutePaths(computeResolvedFullRoutePaths(rootFamilies, pages));
}

async function buildPreview(
  repository: WebAppHierarchyRepository,
  materializer: DesignSystemMaterializer,
  input: PreviewDesignSystemMaterializationInput,
): Promise<{
  classification: DesignSystemMaterializationPreviewResult["classification"];
  items: DesignSystemMaterializationPreviewItem[];
  previewHash: string;
  proposalPages: WebAppPageData[];
}> {
  const pages = await repository.listPages();
  const proposalPages = input.proposalPageIds.map((proposalPageId) => {
    const page = pages.find((item) => item.webAppPageId === proposalPageId);
    if (!page) {
      throw new PageNotFoundError();
    }
    return page;
  });

  const classification = proposalPages.some((page) => page.topologyState !== "proposed")
    ? "invalid"
    : proposalPages.some(
          (page) =>
            page.rootFamilyId !== DESIGN_SYSTEM_ROOT_FAMILY_ID ||
            page.templateKey !== DESIGN_SYSTEM_TEMPLATE_KEY,
        )
      ? "invalid"
      : proposalPages.some((page) => {
            if (!page.parentPageId) {
              return false;
            }
            const parentPage = pages.find((item) => item.webAppPageId === page.parentPageId);
            return !parentPage || parentPage.topologyState !== "applied";
          })
        ? "blocked"
        : "additive";

  const items =
    classification === "additive"
      ? proposalPages.map((page) => {
          const routePath = page.resolvedFullRoutePath;
          if (!routePath) {
            throw new DesignSystemMaterializationBlockedError({
              field: "proposalPageIds",
              reason: "missing_resolved_route_path",
            });
          }
          return {
            webAppPageId: page.webAppPageId,
            pageKey: page.pageKey,
            displayLabel: page.displayLabel,
            routePath,
            templateKey: DESIGN_SYSTEM_TEMPLATE_KEY,
            plannedOutputs: materializer.plan(routePath, page.pageKey),
          } satisfies DesignSystemMaterializationPreviewItem;
        })
      : [];

  return {
    classification,
    items,
    previewHash: buildPreviewHash({
      classification,
      items,
      pages: proposalPages,
    }),
    proposalPages,
  };
}

export async function createDesignSystemPageProposal(
  repository: WebAppHierarchyRepository,
  input: CreateDesignSystemPageProposalInput,
): Promise<DesignSystemProposalCreateResult> {
  if (input.templateKey !== DESIGN_SYSTEM_TEMPLATE_KEY) {
    throw new UnsupportedDesignSystemTemplateError();
  }
  const [rootFamilies, modules, pages] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
  ]);
  requireRootFamily(rootFamilies, DESIGN_SYSTEM_ROOT_FAMILY_ID);
  const module = requireModule(modules, input.webAppModuleId);
  if (module.rootFamilyId !== DESIGN_SYSTEM_ROOT_FAMILY_ID) {
    throw new InvalidPlacementError({ field: "webAppModuleId", reason: "module_outside_design_system" });
  }

  validatePlacement("module-root", undefined);
  const routeSegment = normalizeKey(input.routeSegment);
  const routePath = `/design-system/${routeSegment}`;
  const pageKey = buildPageKeyFromRoutePath(routePath);
  if (await repository.findPageByKey(pageKey)) {
    throw new PageKeyAlreadyExistsError();
  }
  if (await repository.findPageByPlacementRoute(module.webAppModuleId, null, "module-root", routeSegment)) {
    throw new RouteSegmentAlreadyExistsError();
  }

  const created = await repository.createPage({
    webAppPageId: createWebAppHierarchyId(),
    rootFamilyId: DESIGN_SYSTEM_ROOT_FAMILY_ID,
    webAppModuleId: module.webAppModuleId,
    parentPageId: null,
    placementType: "module-root",
    pageKey,
    displayLabel: input.displayLabel.trim(),
    routeSegment,
    status: "draft",
    sortOrder: input.sortOrder ?? 0,
    createdByRootAdminUserId: input.createdByRootAdminUserId,
    bootstrapSource: null,
    topologyState: "proposed",
    templateKey: input.templateKey,
    materializedAt: null,
  });
  await repository.updateResolvedFullRoutePaths(
    computeResolvedFullRoutePaths(rootFamilies, [...pages, { ...created, normalizedRouteSegment: created.routeSegment }]),
  );

  return {
    proposalPage: toWebAppPage((await repository.findPageById(created.webAppPageId))!),
    proposalStatus: "proposed",
  };
}

export async function createDesignSystemSubpageProposal(
  repository: WebAppHierarchyRepository,
  input: CreateDesignSystemSubpageProposalInput,
): Promise<DesignSystemProposalCreateResult> {
  if (input.templateKey !== DESIGN_SYSTEM_TEMPLATE_KEY) {
    throw new UnsupportedDesignSystemTemplateError();
  }
  const [rootFamilies, modules, pages] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
  ]);
  const parentPage = requirePage(pages, input.parentPageId);
  const module = requireModule(modules, parentPage.webAppModuleId);
  if (
    parentPage.rootFamilyId !== DESIGN_SYSTEM_ROOT_FAMILY_ID ||
    parentPage.topologyState !== "applied" ||
    module.rootFamilyId !== DESIGN_SYSTEM_ROOT_FAMILY_ID
  ) {
    throw new InvalidPlacementError({ field: "parentPageId", reason: "parent_must_be_applied_design_system_page" });
  }
  validateParentScope(parentPage, DESIGN_SYSTEM_ROOT_FAMILY_ID, parentPage.webAppModuleId);
  const routeSegment = normalizeKey(input.routeSegment);
  if (
    await repository.findPageByPlacementRoute(
      parentPage.webAppModuleId,
      parentPage.webAppPageId,
      "child-page",
      routeSegment,
    )
  ) {
    throw new RouteSegmentAlreadyExistsError();
  }
  const routePath = `${parentPage.resolvedFullRoutePath}/${routeSegment}`.replace(/\/+/g, "/");
  const pageKey = buildPageKeyFromRoutePath(routePath);
  if (await repository.findPageByKey(pageKey)) {
    throw new PageKeyAlreadyExistsError();
  }

  const created = await repository.createPage({
    webAppPageId: createWebAppHierarchyId(),
    rootFamilyId: DESIGN_SYSTEM_ROOT_FAMILY_ID,
    webAppModuleId: parentPage.webAppModuleId,
    parentPageId: parentPage.webAppPageId,
    placementType: "child-page",
    pageKey,
    displayLabel: input.displayLabel.trim(),
    routeSegment,
    status: "draft",
    sortOrder: input.sortOrder ?? 0,
    createdByRootAdminUserId: input.createdByRootAdminUserId,
    bootstrapSource: null,
    topologyState: "proposed",
    templateKey: input.templateKey,
    materializedAt: null,
  });
  await repository.updateResolvedFullRoutePaths(
    computeResolvedFullRoutePaths(rootFamilies, [...pages, { ...created, normalizedRouteSegment: created.routeSegment }]),
  );

  return {
    proposalPage: toWebAppPage((await repository.findPageById(created.webAppPageId))!),
    proposalStatus: "proposed",
  };
}

export async function previewDesignSystemMaterialization(
  repository: WebAppHierarchyRepository,
  materializer: DesignSystemMaterializer,
  input: PreviewDesignSystemMaterializationInput,
): Promise<DesignSystemMaterializationPreviewResult> {
  const preview = await buildPreview(repository, materializer, input);
  return {
    classification: preview.classification,
    previewHash: preview.previewHash,
    proposalCount: preview.proposalPages.length,
    items: preview.items,
  };
}

export async function applyDesignSystemMaterialization(
  repository: WebAppHierarchyRepository,
  materializer: DesignSystemMaterializer,
  input: ApplyDesignSystemMaterializationInput,
): Promise<DesignSystemMaterializationApplyResult> {
  const preview = await buildPreview(repository, materializer, {
    proposalPageIds: input.proposalPageIds,
  });
  if (preview.previewHash !== input.previewHash) {
    throw new DesignSystemMaterializationPreviewMismatchError();
  }
  if (preview.classification !== "additive") {
    throw new DesignSystemMaterializationBlockedError({
      field: "proposalPageIds",
      reason: preview.classification,
    });
  }

  const appliedAt = new Date();
  for (const page of preview.proposalPages) {
    const routePath = page.resolvedFullRoutePath;
    if (!routePath) {
      throw new DesignSystemMaterializationBlockedError({
        field: "proposalPageIds",
        reason: "missing_resolved_route_path",
      });
    }
    const existingLocator = await repository.findActivePageLocatorByNormalizedKey(normalizeKey(routePath));
    if (existingLocator && existingLocator.webAppPageId !== page.webAppPageId) {
      throw new PageLocatorConflictError({
        field: "routePath",
        reason: "duplicate_active_locator",
      });
    }
    await materializer.apply({
      pageKey: page.pageKey,
      displayLabel: page.displayLabel,
      routePath,
      templateKey: DESIGN_SYSTEM_TEMPLATE_KEY,
      proposalCreatedAt: page.createdAt,
      appliedAt,
    });
    await repository.markPageApplied({
      webAppPageId: page.webAppPageId,
      materializedAt: appliedAt,
    });
    await repository.upsertActivePageLocator({
      webAppPageLocatorId: createWebAppHierarchyId(),
      webAppPageId: page.webAppPageId,
      rootFamilyId: DESIGN_SYSTEM_ROOT_FAMILY_ID,
      locatorType: "path",
      canonicalLocator: routePath,
      routePath,
      routeHash: null,
      normalizedLocatorKey: normalizeKey(routePath),
      createdByRootAdminUserId: input.createdByRootAdminUserId,
    });
  }

  await refreshResolvedPaths(repository);
  const [rootFamilies, modules, pages, locators] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
    repository.listPageLocators(),
  ]);
  const activeLocatorByPageId = new Map(
    locators.filter((item) => item.isActive).map((item) => [item.webAppPageId, item]),
  );
  const tree = buildAppliedDesignSystemTree(
    rootFamilies,
    modules,
    pages.map((page) => ({
      ...page,
      activeLocator: activeLocatorByPageId.get(page.webAppPageId) ?? page.activeLocator ?? null,
    })),
  );

  return {
    classification: "additive",
    previewHash: preview.previewHash,
    appliedPageCount: preview.proposalPages.length,
    items: preview.items,
    tree,
  };
}

export async function readAppliedDesignSystemTopologyTree(
  repository: WebAppHierarchyRepository,
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
  return buildAppliedDesignSystemTree(
    rootFamilies,
    modules,
    pages.map((page) => ({
      ...page,
      activeLocator: activeLocatorByPageId.get(page.webAppPageId) ?? page.activeLocator ?? null,
    })),
  );
}
