import {
  EntityDefinitionValidationFailedError,
  EntityDefinitionVersionNotDraftError,
} from "../contract/errors";
import type { EntityBuilderRepository } from "../persistence/repository";
import { validateEntityDefinitionVersion } from "./helpers";
import type { UpdateEntityDefinitionVersionInput } from "./types";

export async function updateDraftEntityDefinitionVersion(
  repository: EntityBuilderRepository,
  input: UpdateEntityDefinitionVersionInput,
) {
  const existing = await repository.findVersionById(input.entityDefinitionVersionId);
  if (!existing) {
    throw new EntityDefinitionVersionNotDraftError();
  }
  if (existing.status !== "draft") {
    throw new EntityDefinitionVersionNotDraftError();
  }

  const updated = await repository.updateDraftVersion(input);
  const nextStatus = input.status ?? updated.status;
  if (nextStatus === "active") {
    const validation = validateEntityDefinitionVersion(updated);
    if (!validation.activationEligibility) {
      throw new EntityDefinitionValidationFailedError();
    }
  }
  return repository.replaceVersionStatusAndCurrent(
    updated.entityDefinitionVersionId,
    nextStatus === "active" ? "active" : "draft",
  );
}
