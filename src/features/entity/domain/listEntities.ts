import type { EntityRepository } from "../persistence/repository";
import type { EntityListInput } from "./types";

export function listEntities(repository: EntityRepository, input: EntityListInput) {
  return repository.list(input);
}
