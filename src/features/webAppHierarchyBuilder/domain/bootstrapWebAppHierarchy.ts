import {
  ModuleKeyAlreadyExistsError,
  PageKeyAlreadyExistsError,
} from "../contract/errors";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type {
  BootstrapObservedModuleInput,
  BootstrapObservedPageInput,
  BootstrapWebAppHierarchyInput,
  ResolvedWebAppHierarchyTree,
  WebAppRootFamilyId,
} from "./types";
import {
  computeResolvedFullRoutePaths,
  createWebAppHierarchyId,
  normalizeKey,
  requireRootFamily,
} from "./helpers";
import { buildResolvedWebAppHierarchyTree } from "./presenters";
import {
  recordWebAppHierarchyAuditEvent,
  WEB_APP_HIERARCHY_AUDIT_EVENTS,
} from "./audit";

async function ensureBootstrapModule(
  repository: WebAppHierarchyRepository,
  rootFamilyId: WebAppRootFamilyId,
  module: BootstrapObservedModuleInput,
) {
  const existing = await repository.findModuleByKey(normalizeKey(module.moduleKey));
  if (existing && existing.rootFamilyId !== rootFamilyId) {
    throw new ModuleKeyAlreadyExistsError();
  }
  if (existing) {
    return repository.updateModule({
      webAppModuleId: existing.webAppModuleId,
      displayLabel: module.displayLabel.trim(),
      status: module.status ?? existing.status,
      sortOrder: module.sortOrder ?? existing.sortOrder,
    });
  }
  return repository.createModule({
    webAppModuleId: createWebAppHierarchyId(),
    rootFamilyId,
    moduleKey: normalizeKey(module.moduleKey),
    displayLabel: module.displayLabel.trim(),
    status: module.status ?? "review",
    sortOrder: module.sortOrder ?? 0,
  });
}

async function upsertObservedPageTree(
  repository: WebAppHierarchyRepository,
  createdByRootAdminUserId: string,
  rootFamilyId: WebAppRootFamilyId,
  webAppModuleId: string,
  pages: BootstrapObservedPageInput[],
  parentPageId: string | null,
  placementType: "module-root" | "child-page",
): Promise<void> {
  for (const page of pages) {
    const normalizedPageKey = normalizeKey(page.pageKey);
    const existing = await repository.findPageByKey(normalizedPageKey);
    if (existing && existing.webAppModuleId !== webAppModuleId) {
      throw new PageKeyAlreadyExistsError();
    }
    const persisted = existing
      ? await repository.bootstrapUpsertPage({
          webAppPageId: existing.webAppPageId,
          rootFamilyId,
          webAppModuleId,
          parentPageId,
          placementType,
          pageKey: normalizedPageKey,
          displayLabel: page.displayLabel.trim(),
          routeSegment: normalizeKey(page.routeSegment),
          status: page.status ?? "review",
          sortOrder: page.sortOrder ?? 0,
          createdByRootAdminUserId,
          bootstrapSource: "current-navigable-pages",
          topologyState: "applied",
          templateKey: null,
          materializedAt: null,
        })
      : await repository.createPage({
          webAppPageId: createWebAppHierarchyId(),
          rootFamilyId,
          webAppModuleId,
          parentPageId,
          placementType,
          pageKey: normalizedPageKey,
          displayLabel: page.displayLabel.trim(),
          routeSegment: normalizeKey(page.routeSegment),
          status: page.status ?? "review",
          sortOrder: page.sortOrder ?? 0,
          createdByRootAdminUserId,
          bootstrapSource: "current-navigable-pages",
          topologyState: "applied",
          templateKey: null,
          materializedAt: null,
        });

    await upsertObservedPageTree(
      repository,
      createdByRootAdminUserId,
      rootFamilyId,
      webAppModuleId,
      page.children ?? [],
      persisted.webAppPageId,
      "child-page",
    );
  }
}

export async function bootstrapWebAppHierarchy(
  repository: WebAppHierarchyRepository,
  input: BootstrapWebAppHierarchyInput,
): Promise<ResolvedWebAppHierarchyTree> {
  const [rootFamilies, modulesBefore, pagesBefore] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
  ]);
  for (const observedRootFamily of input.observedRootFamilies) {
    requireRootFamily(rootFamilies, observedRootFamily.rootFamilyId);
    for (const observedModule of observedRootFamily.modules) {
      const module = await ensureBootstrapModule(
        repository,
        observedRootFamily.rootFamilyId,
        observedModule,
      );
      await upsertObservedPageTree(
        repository,
        input.createdByRootAdminUserId,
        observedRootFamily.rootFamilyId,
        module.webAppModuleId,
        observedModule.pages,
        null,
        "module-root",
      );
    }
  }

  const [refreshedRootFamilies, refreshedModules, refreshedPages] = await Promise.all([
    repository.listRootFamilies(),
    repository.listModules(),
    repository.listPages(),
  ]);
  await repository.updateResolvedFullRoutePaths(
    computeResolvedFullRoutePaths(refreshedRootFamilies, refreshedPages),
  );
  const finalPages = await repository.listPages();
  const touchedRootFamilyIds = input.observedRootFamilies.map((item) => item.rootFamilyId);
  await recordWebAppHierarchyAuditEvent(repository, {
    actorRootUserId: input.createdByRootAdminUserId,
    rootFamilyId: touchedRootFamilyIds.length === 1 ? touchedRootFamilyIds[0] : null,
    eventType: WEB_APP_HIERARCHY_AUDIT_EVENTS.bootstrapApplied,
    beforeState: {
      moduleCount: modulesBefore.length,
      pageCount: pagesBefore.length,
      rootFamilyIds: touchedRootFamilyIds,
    },
    afterState: {
      moduleCount: refreshedModules.length,
      pageCount: finalPages.length,
      rootFamilyIds: touchedRootFamilyIds,
    },
  });
  return buildResolvedWebAppHierarchyTree(
    refreshedRootFamilies,
    refreshedModules,
    finalPages,
    true,
    true,
  );
}
