import { randomUUID } from "node:crypto";
import { EntityDefinitionDuplicateKeyError, EntityDefinitionValidationFailedError } from "../contract/errors";
import type { EntityBuilderRepository } from "../persistence/repository";
import type { CreateEntityDefinitionVersionInput } from "./types";
import { validateEntityDefinitionVersion } from "./helpers";

export async function createEntityDefinitionVersion(
  repository: EntityBuilderRepository,
  input: CreateEntityDefinitionVersionInput,
) {
  const existing = await repository.findLineageByEntityKey(input.entityKey);
  const persistedStatus: "draft" | "active" = input.status === "active" ? "draft" : input.status;

  if (!existing) {
    const created = await repository.createLineageWithVersion({
      entityDefinitionId: randomUUID(),
      entityDefinitionVersionId: randomUUID(),
      entityKey: input.entityKey,
      entityName: input.entityName,
      description: input.description,
      status: persistedStatus,
      supersedesVersionId: null,
      attributes: input.attributes,
    });

    if (input.status === "active") {
      const validation = validateEntityDefinitionVersion(created);
      if (!validation.activationEligibility) {
        throw new EntityDefinitionValidationFailedError();
      }
    }

    return repository.replaceVersionStatusAndCurrent(created.entityDefinitionVersionId, input.status);
  }

  if (!existing.entity_definition_id) {
    throw new EntityDefinitionDuplicateKeyError();
  }

  const created = await repository.createVersionForExistingLineage({
    entityDefinitionId: existing.entity_definition_id,
    entityDefinitionVersionId: randomUUID(),
    entityKey: existing.entity_key,
    entityName: input.entityName,
    description: input.description,
    status: persistedStatus,
    supersedesVersionId: existing.current_version_id,
    attributes: input.attributes,
  });

  if (input.status === "active") {
    const validation = validateEntityDefinitionVersion(created);
    if (!validation.activationEligibility) {
      throw new EntityDefinitionValidationFailedError();
    }
  }

  return repository.replaceVersionStatusAndCurrent(created.entityDefinitionVersionId, input.status);
}
