import { EntityDefinitionVersionNotFoundError } from "../contract/errors";
import type { EntityBuilderRepository } from "../persistence/repository";
import { validateEntityDefinitionVersion as validateStoredVersion } from "./helpers";

export async function validateEntityDefinitionVersion(
  repository: EntityBuilderRepository,
  entityDefinitionVersionId: string,
) {
  const version = await repository.findVersionById(entityDefinitionVersionId);
  if (!version) {
    throw new EntityDefinitionVersionNotFoundError();
  }
  return validateStoredVersion(version);
}
