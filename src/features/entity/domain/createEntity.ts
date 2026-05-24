import { randomUUID } from "node:crypto";
import type { EntityRepository } from "../persistence/repository";
import { assertEntityNameAvailable, resolveCreateIdentity } from "./helpers";
import type { CreateEntityInput } from "./types";

export async function createEntity(repository: EntityRepository, input: CreateEntityInput) {
  const identity = resolveCreateIdentity(input);
  await assertEntityNameAvailable(repository, input.name);
  return repository.create({
    entityId: randomUUID(),
    name: input.name,
    description: input.description,
    ...identity,
    status: input.status ?? "draft",
  });
}
