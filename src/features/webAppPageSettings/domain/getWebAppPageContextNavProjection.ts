import { DEFAULT_PAGE_ICON_KEY } from "./catalogs";
import type { WebAppPageSettingsRepository } from "../persistence/repository";
import type { GetWebAppPageContextNavProjectionInput } from "./types";
import type { WebAppHierarchyIntegrationSeam } from "../../webAppHierarchyBuilder";

const ROOT_ADMIN_SHELL_PAGE_KEYS = new Set([
  "overview",
  "users",
  "roles",
  "tenants",
  "tenant-admins",
  "web-app-hierarchy",
]);

function normalizeRootAdminShellPageKey(pageKey: string | null | undefined): string | null {
  if (typeof pageKey !== "string" || pageKey.trim().length === 0) {
    return null;
  }

  const trimmed = pageKey.trim();
  if (ROOT_ADMIN_SHELL_PAGE_KEYS.has(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("root-admin-")) {
    const stripped = trimmed.slice("root-admin-".length);
    if (ROOT_ADMIN_SHELL_PAGE_KEYS.has(stripped)) {
      return stripped;
    }
  }

  return null;
}

function deriveShellPageKey(
  page: {
    rootFamilyId: string;
    pageKey: string;
    resolvedFullRoutePath: string | null;
  },
  fallback = "overview",
): string {
  const normalizedRootAdminPageKey =
    page.rootFamilyId === "root-admin" ? normalizeRootAdminShellPageKey(page.pageKey) : null;

  const resolvedFullRoutePath = page.resolvedFullRoutePath;
  if (typeof resolvedFullRoutePath !== "string" || resolvedFullRoutePath.length === 0) {
    return normalizedRootAdminPageKey ?? fallback;
  }

  const [pathname, hash = ""] = resolvedFullRoutePath.split("#", 2);
  if (hash.trim().length > 0) {
    return hash.trim();
  }

  const normalizedPath = pathname.replace(/\/+$/, "");
  if (normalizedPath === "/root-admin") {
    return normalizedRootAdminPageKey ?? "overview";
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  if (page.rootFamilyId === "root-admin" && segments[0] === "root-admin") {
    return normalizeRootAdminShellPageKey(segments[1]) ?? normalizedRootAdminPageKey ?? fallback;
  }

  return segments.length > 0 ? segments[segments.length - 1] : fallback;
}

export async function getWebAppPageContextNavProjection(
  repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
  input: GetWebAppPageContextNavProjectionInput,
) {
  const pages = await hierarchySeam.listPagesByRootFamily({
    rootFamilyId: input.rootFamilyId,
  });
  const owner = pages.find((page) => deriveShellPageKey(page) === input.pageKey);

  if (!owner) {
    return {
      rootFamilyId: input.rootFamilyId,
      shellPageKey: input.pageKey,
      items: [],
    };
  }

  const contextNavItems = await repository.listContextNavItemsByOwnerPageId(owner.webAppPageId);
  if (contextNavItems.length === 0) {
    return {
      rootFamilyId: input.rootFamilyId,
      shellPageKey: input.pageKey,
      items: [],
    };
  }

  const pageById = new Map(pages.map((page) => [page.webAppPageId, page]));
  const items = await Promise.all(
    contextNavItems
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map(async (item) => {
        const targetPage = pageById.get(item.targetWebAppPageId);
        if (!targetPage) {
          return null;
        }

        const targetSettings = await repository.findSettingsByPageId(targetPage.webAppPageId);
        return {
          webAppPageId: targetPage.webAppPageId,
          shellPageKey: deriveShellPageKey(targetPage),
          displayLabel: targetPage.displayLabel,
          resolvedFullRoutePath: targetPage.resolvedFullRoutePath,
          iconKey: targetSettings?.iconKey ?? null,
          effectiveIconKey: targetSettings?.iconKey ?? DEFAULT_PAGE_ICON_KEY,
          sortOrder: item.sortOrder,
        };
      }),
  );

  return {
    rootFamilyId: input.rootFamilyId,
    shellPageKey: input.pageKey,
    items: items.filter((item) => item !== null),
  };
}
