import { randomUUID } from "node:crypto";
import {
  HierarchyCycleError,
  InvalidPlacementError,
  LiveRouteChangeBlockedError,
  ModuleNotFoundError,
  PageNotFoundError,
  RootFamilyNotFoundError,
} from "../contract/errors";
import type {
  WebAppModuleData,
  WebAppPageData,
  WebAppPagePlacementType,
  WebAppRootFamilyData,
  WebAppRootFamilyId,
} from "./types";

export function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

export function createWebAppHierarchyId(): string {
  return randomUUID();
}

export function requireRootFamily(
  rootFamilies: WebAppRootFamilyData[],
  rootFamilyId: WebAppRootFamilyId,
): WebAppRootFamilyData {
  const rootFamily = rootFamilies.find((item) => item.rootFamilyId === rootFamilyId);
  if (!rootFamily) {
    throw new RootFamilyNotFoundError();
  }
  return rootFamily;
}

export function requireModule(
  modules: WebAppModuleData[],
  webAppModuleId: string,
): WebAppModuleData {
  const module = modules.find((item) => item.webAppModuleId === webAppModuleId);
  if (!module) {
    throw new ModuleNotFoundError();
  }
  return module;
}

export function requirePage(
  pages: WebAppPageData[],
  webAppPageId: string,
): WebAppPageData {
  const page = pages.find((item) => item.webAppPageId === webAppPageId);
  if (!page) {
    throw new PageNotFoundError();
  }
  return page;
}

export function validatePlacement(
  placementType: WebAppPagePlacementType,
  parentPageId: string | undefined,
): void {
  if (placementType === "child-page" && !parentPageId) {
    throw new InvalidPlacementError({
      field: "targetParentPageId",
      reason: "child_page_requires_parent",
    });
  }
  if ((placementType === "module-root" || placementType === "orphaned") && parentPageId) {
    throw new InvalidPlacementError({
      field: "targetParentPageId",
      reason: "parent_not_allowed",
    });
  }
}

export function validateParentScope(
  parentPage: WebAppPageData,
  rootFamilyId: WebAppRootFamilyId,
  webAppModuleId: string,
): void {
  if (parentPage.rootFamilyId !== rootFamilyId || parentPage.webAppModuleId !== webAppModuleId) {
    throw new InvalidPlacementError({
      field: "targetParentPageId",
      reason: "parent_outside_target_scope",
    });
  }
}

export function ensureNoCycle(
  pages: WebAppPageData[],
  pageId: string,
  targetParentPageId: string | undefined,
): void {
  if (!targetParentPageId) {
    return;
  }
  if (pageId === targetParentPageId) {
    throw new HierarchyCycleError();
  }
  const byParent = new Map<string, WebAppPageData[]>();
  for (const page of pages) {
    if (!page.parentPageId) {
      continue;
    }
    const siblings = byParent.get(page.parentPageId) ?? [];
    siblings.push(page);
    byParent.set(page.parentPageId, siblings);
  }

  const stack = [...(byParent.get(pageId) ?? [])];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.webAppPageId === targetParentPageId) {
      throw new HierarchyCycleError();
    }
    stack.push(...(byParent.get(current.webAppPageId) ?? []));
  }
}

export function branchContainsLivePage(pages: WebAppPageData[], pageId: string): boolean {
  const byParent = new Map<string | null, WebAppPageData[]>();
  for (const page of pages) {
    const items = byParent.get(page.parentPageId) ?? [];
    items.push(page);
    byParent.set(page.parentPageId, items);
  }
  const target = requirePage(pages, pageId);
  const stack = [target];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.status === "live") {
      return true;
    }
    stack.push(...(byParent.get(current.webAppPageId) ?? []));
  }
  return false;
}

export function ensureLiveRouteChangeAllowed(pages: WebAppPageData[], pageId: string): void {
  if (branchContainsLivePage(pages, pageId)) {
    throw new LiveRouteChangeBlockedError();
  }
}

export function computeResolvedFullRoutePaths(
  rootFamilies: WebAppRootFamilyData[],
  pages: WebAppPageData[],
): Array<{ webAppPageId: string; resolvedFullRoutePath: string | null }> {
  const rootFamilyMap = new Map(rootFamilies.map((rootFamily) => [rootFamily.rootFamilyId, rootFamily]));
  const pageMap = new Map(pages.map((page) => [page.webAppPageId, page]));
  const cache = new Map<string, string | null>();

  const resolvePath = (page: WebAppPageData): string | null => {
    const cached = cache.get(page.webAppPageId);
    if (cached !== undefined) {
      return cached;
    }
    if (page.placementType === "orphaned") {
      cache.set(page.webAppPageId, null);
      return null;
    }
    const rootFamily = rootFamilyMap.get(page.rootFamilyId);
    if (!rootFamily) {
      cache.set(page.webAppPageId, null);
      return null;
    }
    const parent = page.parentPageId ? pageMap.get(page.parentPageId) ?? null : null;
    const prefix = parent ? resolvePath(parent) : rootFamily.routePrefix;
    const result = prefix ? `${prefix}/${page.routeSegment}`.replace(/\/+/g, "/") : null;
    cache.set(page.webAppPageId, result);
    return result;
  };

  return pages.map((page) => ({
    webAppPageId: page.webAppPageId,
    resolvedFullRoutePath: resolvePath(page),
  }));
}
