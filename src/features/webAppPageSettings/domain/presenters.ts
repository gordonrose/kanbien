import type {
  SelectablePageOptionResponse,
  WebAppPageSettingsContextNavItemResponse,
  WebAppPageSettingsOptionsResponse,
  WebAppPageSettingsResponse,
} from "../contract/types";
import { APPROVED_ICON_CATALOG, APPROVED_PAGE_TEMPLATE_CATALOG, DEFAULT_PAGE_ICON_KEY } from "./catalogs";
import type {
  WebAppPageContextNavItemData,
  WebAppPageSettingsData,
} from "./types";
import type {
  WebAppHierarchySettingsSelectablePage,
} from "../../webAppHierarchyBuilder";

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function toSelectablePageOption(
  page: WebAppHierarchySettingsSelectablePage,
): SelectablePageOptionResponse {
  return {
    webAppPageId: page.webAppPageId,
    parentPageId: page.parentPageId,
    displayLabel: page.displayLabel,
    resolvedFullRoutePath: page.resolvedFullRoutePath,
    pageKey: page.pageKey,
  };
}

export function toWebAppPageSettingsResponse(input: {
  page: WebAppHierarchySettingsSelectablePage;
  settings: WebAppPageSettingsData | null;
  contextNavItems: WebAppPageContextNavItemData[];
  selectablePages: WebAppHierarchySettingsSelectablePage[];
}): WebAppPageSettingsResponse {
  const selectableById = new Map(
    input.selectablePages.map((page) => [page.webAppPageId, page]),
  );

  const contextNavItems: WebAppPageSettingsContextNavItemResponse[] =
    input.contextNavItems.length > 0
      ? input.contextNavItems
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((item) => {
            const target = selectableById.get(item.targetWebAppPageId) ?? input.page;
            return {
              targetWebAppPageId: item.targetWebAppPageId,
              displayLabel: target.displayLabel,
              resolvedFullRoutePath: target.resolvedFullRoutePath,
              sortOrder: item.sortOrder,
              source: "explicit",
            };
          })
      : [
          {
            targetWebAppPageId: input.page.webAppPageId,
            displayLabel: input.page.displayLabel,
            resolvedFullRoutePath: input.page.resolvedFullRoutePath,
            sortOrder: 0,
            source: "fallback-self",
          },
        ];

  return {
    webAppPageId: input.page.webAppPageId,
    parentPageId: input.settings?.parentPageId ?? input.page.parentPageId,
    rootFamilyId: input.page.rootFamilyId,
    displayLabel: input.page.displayLabel,
    hasStoredSettings: Boolean(input.settings),
    iconKey: input.settings?.iconKey ?? null,
    effectiveIconKey: input.settings?.iconKey ?? DEFAULT_PAGE_ICON_KEY,
    showInTopNav: input.settings?.showInTopNav ?? false,
    topNavOrder: input.settings?.topNavOrder ?? null,
    pageTemplateKey: input.settings?.pageTemplateKey ?? null,
    effectivePageTemplateKey: input.settings?.pageTemplateKey ?? input.page.templateKey ?? null,
    contextNavItems,
    createdAt: toIsoString(input.settings?.createdAt ?? null),
    updatedAt: toIsoString(input.settings?.updatedAt ?? null),
  };
}

export function toWebAppPageSettingsOptionsResponse(input: {
  page: WebAppHierarchySettingsSelectablePage;
  selectablePages: WebAppHierarchySettingsSelectablePage[];
}): WebAppPageSettingsOptionsResponse {
  return {
    webAppPageId: input.page.webAppPageId,
    parentPageId: input.page.parentPageId,
    defaultIconKey: DEFAULT_PAGE_ICON_KEY,
    currentTopologyTemplateKey: input.page.templateKey ?? null,
    icons: APPROVED_ICON_CATALOG,
    pageTemplates: APPROVED_PAGE_TEMPLATE_CATALOG,
    eligibleContextNavTargets: input.selectablePages.map(toSelectablePageOption),
  };
}
