import { RouteSegmentAlreadyExistsError } from "../contract/errors";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { UpdateWebAppPageInput, WebAppPage } from "./types";
import {
  computeResolvedFullRoutePaths,
  ensureLiveRouteChangeAllowed,
  normalizeKey,
  requirePage,
} from "./helpers";
import { toWebAppPage } from "./presenters";

export async function updateWebAppPage(
  repository: WebAppHierarchyRepository,
  input: UpdateWebAppPageInput,
): Promise<WebAppPage> {
  const [rootFamilies, pages] = await Promise.all([
    repository.listRootFamilies(),
    repository.listPages(),
  ]);
  const current = requirePage(pages, input.webAppPageId);
  const nextRouteSegment =
    input.routeSegment !== undefined ? normalizeKey(input.routeSegment) : current.routeSegment;

  if (input.routeSegment !== undefined && nextRouteSegment !== current.routeSegment) {
    ensureLiveRouteChangeAllowed(pages, current.webAppPageId);
    const conflict = await repository.findPageByPlacementRoute(
      current.webAppModuleId,
      current.parentPageId,
      current.placementType,
      nextRouteSegment,
    );
    if (conflict && conflict.webAppPageId !== current.webAppPageId) {
      throw new RouteSegmentAlreadyExistsError();
    }
  }

  await repository.updatePageMetadata({
    webAppPageId: current.webAppPageId,
    displayLabel: input.displayLabel?.trim(),
    routeSegment: input.routeSegment !== undefined ? nextRouteSegment : undefined,
    status: input.status,
    sortOrder: input.sortOrder,
  });

  const refreshedPages = await repository.listPages();
  await repository.updateResolvedFullRoutePaths(
    computeResolvedFullRoutePaths(rootFamilies, refreshedPages),
  );

  return toWebAppPage(requirePage(await repository.listPages(), current.webAppPageId));
}
