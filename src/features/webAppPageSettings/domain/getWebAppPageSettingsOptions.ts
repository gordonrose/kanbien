import { WebAppPageNotFoundError } from "../contract/errors";
import { toWebAppPageSettingsOptionsResponse } from "./presenters";
import type { WebAppPageSettingsRepository } from "../persistence/repository";
import type { GetWebAppPageSettingsOptionsInput } from "./types";
import type { WebAppHierarchyIntegrationSeam } from "../../webAppHierarchyBuilder";

export async function getWebAppPageSettingsOptions(
  _repository: WebAppPageSettingsRepository,
  hierarchySeam: WebAppHierarchyIntegrationSeam,
  input: GetWebAppPageSettingsOptionsInput,
) {
  const [page, selectablePages] = await Promise.all([
    hierarchySeam.getPageById(input.webAppPageId),
    hierarchySeam.listSelectablePagesForSettings({ ownerWebAppPageId: input.webAppPageId }),
  ]);

  if (!page) {
    throw new WebAppPageNotFoundError();
  }

  return toWebAppPageSettingsOptionsResponse({
    page,
    selectablePages,
  });
}
