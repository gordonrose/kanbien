import { EntityDefinitionVersionNotFoundError } from "../contract/errors";
import type { EntityBuilderRepository } from "../persistence/repository";
import type { GetEntityDefinitionVersionInput } from "./types";

export async function getEntityDefinitionVersion(
  repository: EntityBuilderRepository,
  input: GetEntityDefinitionVersionInput,
) {
  const version = await repository.findVersionById(input.entityDefinitionVersionId);
  if (!version) {
    throw new EntityDefinitionVersionNotFoundError();
  }
  return version;
}
