import { RouteSegmentAlreadyExistsError } from "../contract/errors";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { MoveWebAppPageInput, WebAppPage } from "./types";
import {
  computeResolvedFullRoutePaths,
  ensureLiveRouteChangeAllowed,
  ensureNoCycle,
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

export async function moveWebAppPage(
  repository: WebAppHierarchyRepository,
  input: MoveWebAppPageInput,
): Promise<WebAppPage> {
  validatePlacement(input.placementType, input.targetParentPageId);
  const [rootFamilies, modules, pages] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
  ]);

  requireRootFamily(rootFamilies, input.rootFamilyId);
  requireModule(modules, input.webAppModuleId);
  const current = requirePage(pages, input.webAppPageId);
  ensureLiveRouteChangeAllowed(pages, current.webAppPageId);
  ensureNoCycle(pages, current.webAppPageId, input.targetParentPageId);

  if (input.targetParentPageId) {
    const parent = requirePage(pages, input.targetParentPageId);
    validateParentScope(parent, input.rootFamilyId, input.webAppModuleId);
  }

  if (input.placementType !== "orphaned") {
    const conflict = await repository.findPageByPlacementRoute(
      input.webAppModuleId,
      input.targetParentPageId ?? null,
      input.placementType,
      current.routeSegment,
    );
    if (conflict && conflict.webAppPageId !== current.webAppPageId) {
      throw new RouteSegmentAlreadyExistsError();
    }
  }

  await repository.movePage({
    webAppPageId: current.webAppPageId,
    rootFamilyId: input.rootFamilyId,
    webAppModuleId: input.webAppModuleId,
    parentPageId: input.targetParentPageId ?? null,
    placementType: input.placementType,
    sortOrder: input.sortOrder,
  });

  const refreshedPages = await repository.listPages();
  await repository.updateResolvedFullRoutePaths(
    computeResolvedFullRoutePaths(rootFamilies, refreshedPages),
  );

  const moved = requirePage(await repository.listPages(), current.webAppPageId);
  await recordWebAppHierarchyAuditEvent(repository, {
    actorRootUserId: input.actorRootUserId,
    rootFamilyId: moved.rootFamilyId,
    webAppModuleId: moved.webAppModuleId,
    webAppPageId: moved.webAppPageId,
    eventType: WEB_APP_HIERARCHY_AUDIT_EVENTS.pageMoved,
    beforeState: current,
    afterState: moved,
  });

  return toWebAppPage(moved);
}
