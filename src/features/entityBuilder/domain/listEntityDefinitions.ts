import type { EntityBuilderRepository } from "../persistence/repository";
import type { EntityDefinitionListInput } from "./types";

export function listEntityDefinitions(
  repository: EntityBuilderRepository,
  input: EntityDefinitionListInput,
) {
  return repository.listLineages(input);
}
