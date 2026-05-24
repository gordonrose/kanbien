import type {
  EntityData,
  EntityListInput,
  EntityRepositoryListResult,
} from "../domain/types";
import type { CreateEntityRecordInput, UpdateEntityRecordInput } from "./types";

export interface EntityRepository {
  create(input: CreateEntityRecordInput): Promise<EntityData>;
  findVisibleById(entityId: string): Promise<EntityData | null>;
  findAnyById(entityId: string): Promise<EntityData | null>;
  findCurrentByName(name: string): Promise<EntityData | null>;
  list(input: EntityListInput): Promise<EntityRepositoryListResult>;
  update(input: UpdateEntityRecordInput): Promise<EntityData>;
  archive(entityId: string): Promise<EntityData>;
}
