import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { GetResolvedWebAppHierarchyTreeInput, ResolvedWebAppHierarchyTree } from "./types";
import { buildResolvedWebAppHierarchyTree } from "./presenters";

export async function getResolvedWebAppHierarchyTree(
  repository: WebAppHierarchyRepository,
  input: GetResolvedWebAppHierarchyTreeInput,
): Promise<ResolvedWebAppHierarchyTree> {
  const [rootFamilies, modules, pages, locators] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
    repository.listPageLocators(),
  ]);

  const locatorByPageId = new Map(locators.filter((item) => item.isActive).map((item) => [item.webAppPageId, item]));
  return buildResolvedWebAppHierarchyTree(
    rootFamilies,
    modules,
    pages.map((page) => ({
      ...page,
      activeLocator: locatorByPageId.get(page.webAppPageId) ?? page.activeLocator ?? null,
    })),
    input.includeInactive ?? false,
    input.includeOrphaned ?? false,
  );
}
