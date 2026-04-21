import {
  DuplicateContextNavTargetError,
  InvalidContextNavTargetError,
  InvalidIconKeyError,
  InvalidPageTemplateKeyError,
  WebAppPageNotFoundError,
} from "../contract/errors";
import { APPROVED_ICON_CATALOG, APPROVED_PAGE_TEMPLATE_CATALOG } from "./catalogs";
import { toWebAppPageSettingsResponse } from "./presenters";
import type { WebAppPageSettingsRepository } from "../persistence/repository";
import type { UpdateWebAppPageSettingsInput } from "./types";
import type { WebAppHierarchyIntegrationSeam } from "../../webAppHierarchyBuilder";
import { createWebAppPageSettingsId } from "./helpers";

export async function updateWebAppPageSettings(
  repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
  input: UpdateWebAppPageSettingsInput,
) {
  const [page, existingSettings, selectablePages] = await Promise.all([
    hierarchySeam.getPageById(input.webAppPageId),
    repository.findSettingsByPageId(input.webAppPageId),
    hierarchySeam.listSelectablePagesForSettings({ ownerWebAppPageId: input.webAppPageId }),
  ]);

  if (!page) {
    throw new WebAppPageNotFoundError();
  }

  if (
    input.iconKey !== undefined
    && input.iconKey !== null
    && !APPROVED_ICON_CATALOG.some((item) => item.iconKey === input.iconKey)
  ) {
    throw new InvalidIconKeyError();
  }

  if (
    input.pageTemplateKey !== undefined
    && input.pageTemplateKey !== null
    && !APPROVED_PAGE_TEMPLATE_CATALOG.some((item) => item.pageTemplateKey === input.pageTemplateKey)
  ) {
    throw new InvalidPageTemplateKeyError();
  }

  const selectableById = new Map(selectablePages.map((candidate) => [candidate.webAppPageId, candidate]));

  if (input.contextNavTargetPageIds) {
    const uniqueIds = new Set(input.contextNavTargetPageIds);
    if (uniqueIds.size !== input.contextNavTargetPageIds.length) {
      throw new DuplicateContextNavTargetError();
    }

    for (const targetPageId of input.contextNavTargetPageIds) {
      const target = selectableById.get(targetPageId);
      if (!target || target.rootFamilyId !== page.rootFamilyId) {
        throw new InvalidContextNavTargetError({
          field: "contextNavTargetPageIds",
          reason: "invalid_target_page",
        });
      }
    }
  }

  const savedSettings = await repository.upsertSettings({
    webAppPageSettingsId: existingSettings?.webAppPageSettingsId ?? createWebAppPageSettingsId(),
    webAppPageId: input.webAppPageId,
    parentPageId: page.parentPageId,
    iconKey: input.iconKey !== undefined ? input.iconKey : existingSettings?.iconKey ?? null,
    showInTopNav:
      input.showInTopNav !== undefined
        ? input.showInTopNav
        : existingSettings?.showInTopNav ?? false,
    topNavOrder:
      input.showInTopNav === false
        ? null
        : input.topNavOrder !== undefined
          ? input.topNavOrder
          : existingSettings?.topNavOrder ?? null,
    pageTemplateKey:
      input.pageTemplateKey !== undefined
        ? input.pageTemplateKey
        : existingSettings?.pageTemplateKey ?? null,
  });

  if (input.contextNavTargetPageIds !== undefined) {
    await repository.replaceContextNavItems(
      input.webAppPageId,
      input.contextNavTargetPageIds.map((targetWebAppPageId, index) => ({
        webAppPageContextNavItemId: createWebAppPageSettingsId(),
        ownerWebAppPageId: input.webAppPageId,
        targetWebAppPageId,
        sortOrder: index,
      })),
    );
  }

  return toWebAppPageSettingsResponse({
    page,
    settings: savedSettings,
    contextNavItems: await repository.listContextNavItemsByOwnerPageId(input.webAppPageId),
    selectablePages,
  });
}
