import type { EntityRepository } from "../persistence/repository";
import { createEntity } from "./createEntity";
import { deleteEntity } from "./deleteEntity";
import { getEntity } from "./getEntity";
import { listEntities } from "./listEntities";
import { toEntity, toEntityListResult } from "./presenters";
import { updateEntity } from "./updateEntity";
import type {
  CreateEntityInput,
  DeleteEntityInput,
  Entity,
  EntityListInput,
  EntityListResult,
  GetEntityInput,
  UpdateEntityInput,
} from "./types";

export interface EntityService {
  createEntity(input: CreateEntityInput): Promise<Entity>;
  getEntity(input: GetEntityInput): Promise<Entity>;
  listEntities(input: EntityListInput): Promise<EntityListResult>;
  updateEntity(input: UpdateEntityInput): Promise<Entity>;
  deleteEntity(input: DeleteEntityInput): Promise<Entity>;
}

export function createEntityService(repository: EntityRepository): EntityService {
  return {
    async createEntity(input) {
      return toEntity(await createEntity(repository, input));
    },
    async getEntity(input) {
      return toEntity(await getEntity(repository, input));
    },
    async listEntities(input) {
      const result = await listEntities(repository, input);
      return toEntityListResult(
        result.items,
        input.page,
        input.pageSize,
        result.totalSearchableRecords,
        result.totalMatchingRecords,
      );
    },
    async updateEntity(input) {
      return toEntity(await updateEntity(repository, input));
    },
    async deleteEntity(input) {
      return toEntity(await deleteEntity(repository, input));
    },
  };
}
