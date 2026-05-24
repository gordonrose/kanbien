import { EntityAlreadyArchivedError, EntityNotFoundError } from "../contract/errors";
import type { EntityRepository } from "../persistence/repository";
import type { DeleteEntityInput } from "./types";

export async function deleteEntity(repository: EntityRepository, input: DeleteEntityInput) {
  const current = await repository.findAnyById(input.entityId);
  if (!current) {
    throw new EntityNotFoundError("We could not find a current entity with that ID.", {
      field: "entityId",
    });
  }
  if (current.archivedAt) {
    throw new EntityAlreadyArchivedError();
  }
  return repository.archive(input.entityId);
}
