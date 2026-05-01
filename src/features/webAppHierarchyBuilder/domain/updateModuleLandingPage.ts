import {
  InvalidModuleLandingPageError,
  ModuleNotFoundError,
  PageNotFoundError,
} from "../contract/errors";
import { toWebAppModule } from "./presenters";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { UpdateWebAppModuleInput } from "./types";
import {
  recordWebAppHierarchyAuditEvent,
  WEB_APP_HIERARCHY_AUDIT_EVENTS,
} from "./audit";

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
    const updated = await repository.updateModule({
      webAppModuleId: input.webAppModuleId,
      landingPageWebAppPageId: null,
    });
    await recordWebAppHierarchyAuditEvent(repository, {
      actorRootUserId: input.actorRootUserId,
      rootFamilyId: updated.rootFamilyId,
      webAppModuleId: updated.webAppModuleId,
      webAppPageId: module.landingPageWebAppPageId,
      eventType: WEB_APP_HIERARCHY_AUDIT_EVENTS.moduleLandingPageUpdated,
      beforeState: module,
      afterState: updated,
    });
    return toWebAppModule(updated);
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

  const updated = await repository.updateModule({
    webAppModuleId: input.webAppModuleId,
    landingPageWebAppPageId,
  });
  await recordWebAppHierarchyAuditEvent(repository, {
    actorRootUserId: input.actorRootUserId,
    rootFamilyId: updated.rootFamilyId,
    webAppModuleId: updated.webAppModuleId,
    webAppPageId: landingPageWebAppPageId,
    eventType: WEB_APP_HIERARCHY_AUDIT_EVENTS.moduleLandingPageUpdated,
    beforeState: module,
    afterState: updated,
  });
  return toWebAppModule(updated);
}
