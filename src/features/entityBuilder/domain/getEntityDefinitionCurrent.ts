import { EntityDefinitionNotFoundError } from "../contract/errors";
import type { EntityBuilderRepository } from "../persistence/repository";
import type { GetEntityDefinitionCurrentInput } from "./types";

export async function getEntityDefinitionCurrent(
  repository: EntityBuilderRepository,
  input: GetEntityDefinitionCurrentInput,
) {
  const version = await repository.findCurrentVersionByEntityKey(input.entityKey);
  if (!version) {
    throw new EntityDefinitionNotFoundError("entityKey");
  }
  return version;
}
