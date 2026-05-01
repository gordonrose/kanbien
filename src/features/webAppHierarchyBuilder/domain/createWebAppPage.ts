import {
  PageKeyAlreadyExistsError,
  RouteSegmentAlreadyExistsError,
} from "../contract/errors";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { CreateWebAppPageInput, WebAppPage, WebAppPagePlacementType } from "./types";
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
import { toWebAppPage } from "./presenters";
import {
  recordWebAppHierarchyAuditEvent,
  WEB_APP_HIERARCHY_AUDIT_EVENTS,
} from "./audit";

function resolvePlacementType(input: CreateWebAppPageInput): WebAppPagePlacementType {
  if (input.placementType) {
    return input.placementType;
  }
  return input.parentPageId ? "child-page" : "module-root";
}

export async function createWebAppPage(
  repository: WebAppHierarchyRepository,
  input: CreateWebAppPageInput,
): Promise<WebAppPage> {
  const placementType = resolvePlacementType(input);
  validatePlacement(placementType, input.parentPageId);
  const normalizedPageKey = normalizeKey(input.pageKey);
  const normalizedRouteSegment = normalizeKey(input.routeSegment);

  const [rootFamilies, modules, pages, existingPageByKey, routeConflict] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
    repository.findPageByKey(normalizedPageKey),
    repository.findPageByPlacementRoute(
      input.webAppModuleId,
      input.parentPageId ?? null,
      placementType,
      normalizedRouteSegment,
    ),
  ]);
  requireRootFamily(rootFamilies, input.rootFamilyId);
  const module = requireModule(modules, input.webAppModuleId);
  if (module.rootFamilyId !== input.rootFamilyId) {
    throw new RouteSegmentAlreadyExistsError();
  }
  if (existingPageByKey) {
    throw new PageKeyAlreadyExistsError();
  }
  if (placementType !== "orphaned" && routeConflict) {
    throw new RouteSegmentAlreadyExistsError();
  }
  if (input.parentPageId) {
    const parent = requirePage(pages, input.parentPageId);
    validateParentScope(parent, input.rootFamilyId, input.webAppModuleId);
  }

  const created = await repository.createPage({
    webAppPageId: createWebAppHierarchyId(),
    rootFamilyId: input.rootFamilyId,
    webAppModuleId: input.webAppModuleId,
    parentPageId: input.parentPageId ?? null,
    placementType,
    pageKey: normalizedPageKey,
    displayLabel: input.displayLabel.trim(),
    routeSegment: normalizedRouteSegment,
    status: input.status ?? "draft",
    sortOrder: input.sortOrder ?? 0,
    createdByRootAdminUserId: input.createdByRootAdminUserId,
    bootstrapSource: null,
    topologyState: input.topologyState ?? "applied",
    templateKey: input.templateKey ?? null,
    materializedAt: input.materializedAt ?? null,
  });

  const refreshedPages = [...pages, { ...created, normalizedRouteSegment: created.routeSegment }];
  await repository.updateResolvedFullRoutePaths(computeResolvedFullRoutePaths(rootFamilies, refreshedPages));

  const refreshed = (await repository.findPageById(created.webAppPageId))!;
  await recordWebAppHierarchyAuditEvent(repository, {
    actorRootUserId: input.createdByRootAdminUserId,
    rootFamilyId: refreshed.rootFamilyId,
    webAppModuleId: refreshed.webAppModuleId,
    webAppPageId: refreshed.webAppPageId,
    eventType: WEB_APP_HIERARCHY_AUDIT_EVENTS.pageCreated,
    afterState: refreshed,
  });

  return toWebAppPage(refreshed);
}
