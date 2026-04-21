import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { ListOrphanedWebAppPagesInput, WebAppPage } from "./types";
import { toWebAppPage } from "./presenters";

export async function listOrphanedWebAppPages(
  repository: WebAppHierarchyRepository,
  input: ListOrphanedWebAppPagesInput,
): Promise<WebAppPage[]> {
  const pages = await repository.listPages();
  return pages
    .filter(
      (page) =>
        page.placementType === "orphaned" &&
        (input.includeInactive || page.status !== "inactive") &&
        (!input.rootFamilyId || page.rootFamilyId === input.rootFamilyId),
    )
    .sort((left, right) => left.sortOrder - right.sortOrder || left.pageKey.localeCompare(right.pageKey))
    .map(toWebAppPage);
}
