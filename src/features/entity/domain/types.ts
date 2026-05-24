export type EntityStatus = "draft" | "active" | "superseded" | "archived";
export type CountValue = number | "10000+";

export interface Entity {
  entityId: string;
  name: string;
  description: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface EntityData {
  entityId: string;
  name: string;
  normalizedName: string;
  description: string;
  status: EntityStatus;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export interface CreateEntityInput {
  name: string;
  description: string;
  status?: EntityStatus;
}

export interface GetEntityInput {
  entityId: string;
  includeArchived?: boolean;
}

export interface EntityListFilters {
  namePrefix?: string;
  status?: EntityStatus;
  includeArchived?: boolean;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
}

export interface EntityListInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: EntityListFilters;
}

export interface EntityListResult {
  items: Entity[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface EntityRepositoryListResult {
  items: EntityData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}

export interface UpdateEntityInput {
  entityId: string;
  name?: string;
  description?: string;
  status?: EntityStatus;
}

export interface DeleteEntityInput {
  entityId: string;
}
