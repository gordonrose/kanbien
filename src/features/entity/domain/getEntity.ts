import { EntityNotFoundError } from "../contract/errors";
import type { EntityRepository } from "../persistence/repository";
import type { GetEntityInput } from "./types";

export async function getEntity(repository: EntityRepository, input: GetEntityInput) {
  const record = input.includeArchived
    ? await repository.findAnyById(input.entityId)
    : await repository.findVisibleById(input.entityId);
  if (!record) {
    throw new EntityNotFoundError();
  }
  return record;
}
