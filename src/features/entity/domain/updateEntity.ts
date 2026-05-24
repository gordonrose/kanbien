import { EntityNotFoundError } from "../contract/errors";
import type { EntityRepository } from "../persistence/repository";
import { assertEntityNameAvailable, assertSharedCrossTenantApproved } from "./helpers";
import type { UpdateEntityInput } from "./types";

export async function updateEntity(repository: EntityRepository, input: UpdateEntityInput) {
  const current = await repository.findVisibleById(input.entityId);
  if (!current) {
    throw new EntityNotFoundError("We could not find a current entity with that ID.", {
      field: "entityId",
    });
  }

  if (input.name !== undefined && input.name !== current.name) {
    await assertEntityNameAvailable(repository, input.name, input.entityId);
  }

  assertSharedCrossTenantApproved(input.scope, input.sharedCrossTenantApproved);
  return repository.update(input);
}
