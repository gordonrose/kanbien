import type { PublicDesignSystemTopNavResponse } from "./types";
import type { WebAppPageSettingsRepository } from "../persistence/repository";
import type { WebAppHierarchyIntegrationSeam } from "../../webAppHierarchyBuilder";

const defaultDesignSystemTopNavItems = [
  { href: "/design-system", label: "Overview", order: 0 },
  { href: "/design-system/canonical-renderings", label: "Canonical Renderings", order: 1 },
  { href: "/design-system/canonicals", label: "Canonicals", order: 2 },
] as const;

const defaultItemByHref: Map<string, (typeof defaultDesignSystemTopNavItems)[number]> = new Map(
  defaultDesignSystemTopNavItems.map((item) => [item.href, item]),
);

export async function getPublicDesignSystemTopNav(
  repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
): Promise<PublicDesignSystemTopNavResponse> {
  const pages = (await hierarchySeam.listPagesByRootFamily({ rootFamilyId: "design-system" }))
    .filter((page) => page.parentPageId === null && typeof page.resolvedFullRoutePath === "string");
  const settings = await repository.listSettingsByPageIds(pages.map((page) => page.webAppPageId));
  const settingsByPageId = new Map(settings.map((setting) => [setting.webAppPageId, setting]));

  const items = pages
    .flatMap((page, fallbackOrder) => {
      const href = page.resolvedFullRoutePath;
      if (!href) {
        return [];
      }

      const setting = settingsByPageId.get(page.webAppPageId);
      const defaultItem = defaultItemByHref.get(href);
      const includeByDefault = href === "/design-system" && !setting;

      if (!setting?.showInTopNav && !includeByDefault) {
        return [];
      }

      return [{
        href,
        label: setting ? page.displayLabel : defaultItem?.label ?? page.displayLabel,
        order: setting?.topNavOrder ?? defaultItem?.order ?? Number.POSITIVE_INFINITY,
        fallbackOrder,
      }];
    })
    .sort((left, right) => {
      if (left.href === "/design-system" && right.href !== "/design-system") {
        return -1;
      }
      if (right.href === "/design-system" && left.href !== "/design-system") {
        return 1;
      }
      if (left.order !== right.order) {
        return left.order - right.order;
      }
      if (left.fallbackOrder !== right.fallbackOrder) {
        return left.fallbackOrder - right.fallbackOrder;
      }
      return left.label.localeCompare(right.label);
    })
    .map(({ href, label }) => ({ href, label }));

  return {
    items: items.length > 0
      ? items
      : defaultDesignSystemTopNavItems.map(({ href, label }) => ({ href, label })),
  };
}
