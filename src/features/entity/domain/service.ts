import { randomUUID } from "node:crypto";
import {
  EntityAlreadyArchivedError,
  EntityNameAlreadyExistsError,
  EntityNotFoundError,
} from "../contract/errors";
import type { EntityRepository } from "../persistence/repository";
import { toEntity, toEntityListResult } from "./presenters";
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
  async function assertNameAvailable(name: string, currentEntityId?: string) {
    const collision = await repository.findCurrentByName(name);
    if (collision && collision.entityId !== currentEntityId) {
      throw new EntityNameAlreadyExistsError();
    }
  }

  return {
    async createEntity(input) {
      await assertNameAvailable(input.name);
      return toEntity(await repository.create({
        entityId: randomUUID(),
        name: input.name,
        description: input.description,
        status: input.status ?? "draft",
      }));
    },
    async getEntity(input) {
      const record = input.includeArchived
        ? await repository.findAnyById(input.entityId)
        : await repository.findVisibleById(input.entityId);
      if (!record) {
        throw new EntityNotFoundError();
      }
      return toEntity(record);
    },
    async listEntities(input) {
      const result = await repository.list(input);
      return toEntityListResult(
        result.items,
        input.page,
        input.pageSize,
        result.totalSearchableRecords,
        result.totalMatchingRecords,
      );
    },
    async updateEntity(input) {
      const current = await repository.findVisibleById(input.entityId);
      if (!current) {
        throw new EntityNotFoundError("We could not find a current entity with that ID.", {
          field: "entityId",
        });
      }
      if (input.name !== undefined && input.name !== current.name) {
        await assertNameAvailable(input.name, input.entityId);
      }
      return toEntity(await repository.update(input));
    },
    async deleteEntity(input) {
      const current = await repository.findAnyById(input.entityId);
      if (!current) {
        throw new EntityNotFoundError("We could not find a current entity with that ID.", {
          field: "entityId",
        });
      }
      if (current.archivedAt) {
        throw new EntityAlreadyArchivedError();
      }
      return toEntity(await repository.archive(input.entityId));
    },
  };
}
