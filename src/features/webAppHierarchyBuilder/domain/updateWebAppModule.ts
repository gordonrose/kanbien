import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { UpdateWebAppModuleInput, WebAppModule } from "./types";
import { requireModule } from "./helpers";
import { toWebAppModule } from "./presenters";
import {
  recordWebAppHierarchyAuditEvent,
  WEB_APP_HIERARCHY_AUDIT_EVENTS,
} from "./audit";

export async function updateWebAppModule(
  repository: WebAppHierarchyRepository,
  input: UpdateWebAppModuleInput,
): Promise<WebAppModule> {
  const modules = await repository.listModules();
  const current = requireModule(modules, input.webAppModuleId);
  const updated = await repository.updateModule({
    webAppModuleId: current.webAppModuleId,
    displayLabel: input.displayLabel?.trim(),
    status: input.status,
    sortOrder: input.sortOrder,
  });
  await recordWebAppHierarchyAuditEvent(repository, {
    actorRootUserId: input.actorRootUserId,
    rootFamilyId: updated.rootFamilyId,
    webAppModuleId: updated.webAppModuleId,
    eventType: WEB_APP_HIERARCHY_AUDIT_EVENTS.moduleUpdated,
    beforeState: current,
    afterState: updated,
  });
  return toWebAppModule(updated);
}
