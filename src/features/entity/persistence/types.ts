import type { EntityScope, EntityStatus } from "../domain/types";

export interface EntityRecord {
  entity_id: string;
  name: string;
  normalized_name: string;
  description: string;
  entity_key: string;
  feature_name: string;
  table_name: string;
  id_field: string;
  id_column: string;
  scope: EntityScope;
  route_base: string;
  status: EntityStatus;
  created_at: Date;
  updated_at: Date;
  archived_at: Date | null;
}

export interface CreateEntityRecordInput {
  entityId: string;
  name: string;
  description: string;
  entityKey: string;
  featureName: string;
  tableName: string;
  idField: string;
  idColumn: string;
  scope: EntityScope;
  routeBase: string;
  status: EntityStatus;
}

export interface UpdateEntityRecordInput {
  entityId: string;
  name?: string;
  description?: string;
  entityKey?: string;
  featureName?: string;
  tableName?: string;
  idField?: string;
  idColumn?: string;
  scope?: EntityScope;
  routeBase?: string;
  status?: EntityStatus;
}
