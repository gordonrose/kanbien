import type { Pool } from "pg";
import type { EntityData, EntityListInput, EntityRepositoryListResult } from "../domain/types";
import type { EntityRepository } from "./repository";
import type { CreateEntityRecordInput, EntityRecord, UpdateEntityRecordInput } from "./types";

const ORDER_BY_MAP: Record<string, string> = {
  name: "name",
  status: "status",
  createdAt: "created_at",
  updatedAt: "updated_at",
  archivedAt: "archived_at",
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function toEntityData(record: EntityRecord): EntityData {
  return {
    entityId: record.entity_id,
    name: record.name,
    normalizedName: record.normalized_name,
    description: record.description,
    entityKey: record.entity_key,
    featureName: record.feature_name,
    tableName: record.table_name,
    idField: record.id_field,
    idColumn: record.id_column,
    scope: record.scope,
    routeBase: record.route_base,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    archivedAt: record.archived_at,
  };
}

function buildFilters(filters: EntityListInput["filters"], values: unknown[], alias = "e"): string[] {
  const clauses: string[] = [];
  if (!filters.includeArchived) {
    clauses.push(`${alias}.archived_at IS NULL`);
  }
  if (filters.namePrefix) {
    values.push(`${filters.namePrefix.toLowerCase()}%`);
    clauses.push(`${alias}.normalized_name LIKE $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    clauses.push(`${alias}.status = $${values.length}`);
  }
  if (filters.createdAtFrom) {
    values.push(filters.createdAtFrom);
    clauses.push(`${alias}.created_at >= $${values.length}`);
  }
  if (filters.createdAtTo) {
    values.push(filters.createdAtTo);
    clauses.push(`${alias}.created_at <= $${values.length}`);
  }
  if (filters.updatedAtFrom) {
    values.push(filters.updatedAtFrom);
    clauses.push(`${alias}.updated_at >= $${values.length}`);
  }
  if (filters.updatedAtTo) {
    values.push(filters.updatedAtTo);
    clauses.push(`${alias}.updated_at <= $${values.length}`);
  }
  return clauses;
}

export function createPostgresEntityRepository(dbPool: Pool): EntityRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<EntityData | null> {
    const result = await dbPool.query<EntityRecord>(sql, params);
    return result.rows[0] ? toEntityData(result.rows[0]) : null;
  }

  return {
    async create(input: CreateEntityRecordInput) {
      const result = await dbPool.query<EntityRecord>(
        `
          INSERT INTO entities (
            entity_id,
            name,
            normalized_name,
            description,
            entity_key,
            feature_name,
            table_name,
            id_field,
            id_column,
            scope,
            route_base,
            status,
            created_at,
            updated_at,
            archived_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
            NOW(),
            NOW(),
            CASE WHEN $12 = 'archived' THEN NOW() ELSE NULL END
          )
          RETURNING *
        `,
        [
          input.entityId,
          input.name,
          normalizeName(input.name),
          input.description,
          input.entityKey,
          input.featureName,
          input.tableName,
          input.idField,
          input.idColumn,
          input.scope,
          input.routeBase,
          input.status,
        ],
      );
      return toEntityData(result.rows[0]);
    },
    findVisibleById(entityId) {
      return queryOne("SELECT * FROM entities WHERE entity_id = $1 AND archived_at IS NULL", [entityId]);
    },
    findAnyById(entityId) {
      return queryOne("SELECT * FROM entities WHERE entity_id = $1", [entityId]);
    },
    findCurrentByName(name) {
      return queryOne(
        "SELECT * FROM entities WHERE normalized_name = $1 AND archived_at IS NULL",
        [normalizeName(name)],
      );
    },
    async list(input): Promise<EntityRepositoryListResult> {
      const orderBy = ORDER_BY_MAP[input.orderBy];
      const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
      const values: unknown[] = [];
      const searchableWhere = input.filters.includeArchived ? "" : "WHERE e.archived_at IS NULL";
      const filterClauses = buildFilters(input.filters, values);
      const matchingWhere = filterClauses.length > 0 ? `WHERE ${filterClauses.join(" AND ")}` : "";
      const totals = await dbPool.query(
        `
          SELECT
            (SELECT COUNT(*) FROM entities e ${searchableWhere}) AS total_searchable_records,
            (SELECT COUNT(*) FROM entities e ${matchingWhere}) AS total_matching_records
        `,
        values,
      );
      values.push(input.pageSize);
      values.push((input.page - 1) * input.pageSize);
      const result = await dbPool.query<EntityRecord>(
        `
          SELECT e.*
          FROM entities e
          ${matchingWhere}
          ORDER BY ${orderBy} ${orderDirection}
          LIMIT $${values.length - 1}
          OFFSET $${values.length}
        `,
        values,
      );
      return {
        items: result.rows.map(toEntityData),
        totalSearchableRecords: Number(totals.rows[0].total_searchable_records),
        totalMatchingRecords: Number(totals.rows[0].total_matching_records),
      };
    },
    async update(input: UpdateEntityRecordInput) {
      const assignments: string[] = [];
      const values: unknown[] = [];
      if (input.name !== undefined) {
        values.push(input.name);
        assignments.push(`name = $${values.length}`);
        values.push(normalizeName(input.name));
        assignments.push(`normalized_name = $${values.length}`);
      }
      if (input.description !== undefined) {
        values.push(input.description);
        assignments.push(`description = $${values.length}`);
      }
      if (input.entityKey !== undefined) {
        values.push(input.entityKey);
        assignments.push(`entity_key = $${values.length}`);
      }
      if (input.featureName !== undefined) {
        values.push(input.featureName);
        assignments.push(`feature_name = $${values.length}`);
      }
      if (input.tableName !== undefined) {
        values.push(input.tableName);
        assignments.push(`table_name = $${values.length}`);
      }
      if (input.idField !== undefined) {
        values.push(input.idField);
        assignments.push(`id_field = $${values.length}`);
      }
      if (input.idColumn !== undefined) {
        values.push(input.idColumn);
        assignments.push(`id_column = $${values.length}`);
      }
      if (input.scope !== undefined) {
        values.push(input.scope);
        assignments.push(`scope = $${values.length}`);
      }
      if (input.routeBase !== undefined) {
        values.push(input.routeBase);
        assignments.push(`route_base = $${values.length}`);
      }
      if (input.status !== undefined) {
        values.push(input.status);
        assignments.push(`status = $${values.length}`);
        assignments.push(
          `archived_at = CASE WHEN $${values.length} = 'archived' THEN COALESCE(archived_at, NOW()) ELSE NULL END`,
        );
      }
      assignments.push("updated_at = NOW()");
      values.push(input.entityId);
      const result = await dbPool.query<EntityRecord>(
        `
          UPDATE entities
          SET ${assignments.join(", ")}
          WHERE entity_id = $${values.length}
            AND archived_at IS NULL
          RETURNING *
        `,
        values,
      );
      return toEntityData(result.rows[0]);
    },
    async archive(entityId) {
      const result = await dbPool.query<EntityRecord>(
        `
          UPDATE entities
          SET status = 'archived',
              archived_at = NOW(),
              updated_at = NOW()
          WHERE entity_id = $1
            AND archived_at IS NULL
          RETURNING *
        `,
        [entityId],
      );
      return toEntityData(result.rows[0]);
    },
  };
}
