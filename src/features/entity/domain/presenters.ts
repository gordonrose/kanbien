import type { CountValue, Entity, EntityData, EntityListResult } from "./types";

function toCountValue(value: number): CountValue {
  return value > 10000 ? "10000+" : value;
}

export function toEntity(record: EntityData): Entity {
  return {
    entityId: record.entityId,
    name: record.name,
    description: record.description,
    entityKey: record.entityKey,
    featureName: record.featureName,
    tableName: record.tableName,
    idField: record.idField,
    idColumn: record.idColumn,
    scope: record.scope,
    routeBase: record.routeBase,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    archivedAt: record.archivedAt ? record.archivedAt.toISOString() : null,
  };
}

export function toEntityListResult(
  records: EntityData[],
  page: number,
  pageSize: number,
  totalSearchableRecords: number,
  totalMatchingRecords: number,
): EntityListResult {
  return {
    items: records.map(toEntity),
    page,
    pageSize,
    totalPages: Math.ceil(Math.min(totalMatchingRecords, 10000) / pageSize),
    totalSearchableRecords: toCountValue(totalSearchableRecords),
    totalMatchingRecords: toCountValue(totalMatchingRecords),
  };
}
