import { WebAppPageNotFoundError } from "../contract/errors";
import { toWebAppPageSettingsResponse } from "./presenters";
import type { WebAppPageSettingsRepository } from "../persistence/repository";
import type { GetWebAppPageSettingsInput } from "./types";
import type { WebAppHierarchyIntegrationSeam } from "../../webAppHierarchyBuilder";

export async function getWebAppPageSettings(
  repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
  input: GetWebAppPageSettingsInput,
) {
  const [page, settings, contextNavItems, selectablePages] = await Promise.all([
    hierarchySeam.getPageById(input.webAppPageId),
    repository.findSettingsByPageId(input.webAppPageId),
    repository.listContextNavItemsByOwnerPageId(input.webAppPageId),
    hierarchySeam.listSelectablePagesForSettings({ ownerWebAppPageId: input.webAppPageId }),
  ]);

  if (!page) {
    throw new WebAppPageNotFoundError();
  }

  return toWebAppPageSettingsResponse({
    page,
    settings,
    contextNavItems,
    selectablePages,
  });
}
