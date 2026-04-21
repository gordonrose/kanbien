import {
  ModuleKeyAlreadyExistsError,
} from "../contract/errors";
import { toWebAppModule } from "./presenters";
import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { CreateWebAppModuleInput, WebAppModule } from "./types";
import { createWebAppHierarchyId, normalizeKey, requireRootFamily } from "./helpers";

export async function createWebAppModule(
  repository: WebAppHierarchyRepository,
  input: CreateWebAppModuleInput,
): Promise<WebAppModule> {
  const [rootFamilies, existingModule] = await Promise.all([
    repository.listRootFamilies(),
    repository.findModuleByKey(normalizeKey(input.moduleKey)),
  ]);
  requireRootFamily(rootFamilies, input.rootFamilyId);
  if (existingModule) {
    throw new ModuleKeyAlreadyExistsError();
  }

  const created = await repository.createModule({
    webAppModuleId: createWebAppHierarchyId(),
    rootFamilyId: input.rootFamilyId,
    moduleKey: normalizeKey(input.moduleKey),
    displayLabel: input.displayLabel.trim(),
    status: input.status ?? "draft",
    sortOrder: input.sortOrder ?? 0,
  });

  return toWebAppModule(created);
}
