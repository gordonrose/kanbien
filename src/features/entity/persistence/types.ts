import type { EntityStatus } from "../domain/types";

export interface EntityRecord {
  entity_id: string;
  name: string;
  normalized_name: string;
  description: string;
  status: EntityStatus;
  created_at: Date;
  updated_at: Date;
  archived_at: Date | null;
}

export interface CreateEntityRecordInput {
  entityId: string;
  name: string;
  description: string;
  status: EntityStatus;
}

export interface UpdateEntityRecordInput {
  entityId: string;
  name?: string;
  description?: string;
  status?: EntityStatus;
}
