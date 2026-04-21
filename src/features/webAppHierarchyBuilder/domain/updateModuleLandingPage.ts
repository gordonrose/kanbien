import {
  InvalidModuleLandingPageError,
  ModuleNotFoundError,
  PageNotFoundError,
} from "../contract/errors";
import { toWebAppModule } from "./presenters";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { UpdateWebAppModuleInput } from "./types";

export async function updateModuleLandingPage(
  repository: WebAppHierarchyRepository,
  input: UpdateWebAppModuleInput,
) {
  const module = await repository.findModuleById(input.webAppModuleId);
  if (!module) {
    throw new ModuleNotFoundError();
  }

  const landingPageWebAppPageId = input.landingPageWebAppPageId ?? null;
  if (!landingPageWebAppPageId) {
    return toWebAppModule(
      await repository.updateModule({
        webAppModuleId: input.webAppModuleId,
        landingPageWebAppPageId: null,
      }),
    );
  }

  const page = await repository.findPageById(landingPageWebAppPageId);
  if (!page) {
    throw new PageNotFoundError();
  }

  if (
    page.webAppModuleId !== module.webAppModuleId
    || page.parentPageId !== null
    || page.placementType !== "module-root"
  ) {
    throw new InvalidModuleLandingPageError({
      field: "landingPageWebAppPageId",
      reason: "page_not_direct_child",
    });
  }

  return toWebAppModule(
    await repository.updateModule({
      webAppModuleId: input.webAppModuleId,
      landingPageWebAppPageId,
    }),
  );
}
