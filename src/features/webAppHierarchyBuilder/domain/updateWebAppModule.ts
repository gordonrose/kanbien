import type { WebAppHierarchyRepository } from "../persistence/repository";
import type { UpdateWebAppModuleInput, WebAppModule } from "./types";
import { requireModule } from "./helpers";
import { toWebAppModule } from "./presenters";

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
  return toWebAppModule(updated);
}
