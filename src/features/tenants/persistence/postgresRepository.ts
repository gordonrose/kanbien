import type { Pool } from "pg";
import type { TenantData } from "../domain/types";
import type { TenantsRepository } from "./repository";
import type {
  CreateTenantRecordInput,
  TenantRecord,
  TenantRepositoryListInput,
  TenantRepositoryListResult,
  UpdateTenantRecordInput,
} from "./types";

const ORDER_BY_MAP: Record<string, string> = {
  bizId: "biz_id",
  name: "name",
  category: "category",
  status: "status",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

function normalizeBizId(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function buildCommonFilters(
  filters: TenantRepositoryListInput["filters"],
  values: unknown[],
  alias = "t",
): string[] {
  const clauses: string[] = [];
  if (filters.bizIdPrefix) {
    values.push(`${filters.bizIdPrefix.toLowerCase()}%`);
    clauses.push(`${alias}.normalized_biz_id LIKE $${values.length}`);
  }
  if (filters.namePrefix) {
    values.push(`${filters.namePrefix.toLowerCase()}%`);
    clauses.push(`${alias}.normalized_name LIKE $${values.length}`);
  }
  if (filters.category) {
    values.push(filters.category);
    clauses.push(`${alias}.category = $${values.length}`);
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
  if (filters.deletedAtFrom) {
    values.push(filters.deletedAtFrom);
    clauses.push(`${alias}.deleted_at >= $${values.length}`);
  }
  if (filters.deletedAtTo) {
    values.push(filters.deletedAtTo);
    clauses.push(`${alias}.deleted_at <= $${values.length}`);
  }
  return clauses;
}

export function createPostgresTenantsRepository(dbPool: Pool): TenantsRepository {
  function toTenantData(record: TenantRecord): TenantData {
    return {
      tenantId: record.tenant_id,
      bizId: record.biz_id,
      name: record.name,
      category: record.category,
      status: record.status,
      preDeleteStatus: record.pre_delete_status,
      createdByRootAdminUserId: record.created_by_root_admin_user_id,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      deletedAt: record.deleted_at,
    };
  }

  async function queryOne(sql: string, params: unknown[]): Promise<TenantData | null> {
    const result = await dbPool.query<TenantRecord>(sql, params);
    return result.rows[0] ? toTenantData(result.rows[0]) : null;
  }

  async function runList(
    baseScope: string,
    input: TenantRepositoryListInput,
  ): Promise<TenantRepositoryListResult> {
    const orderBy = ORDER_BY_MAP[input.orderBy];
    const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
    const values: unknown[] = [];
    const searchableWhere = `WHERE ${baseScope}`;
    const filterClauses = buildCommonFilters(input.filters, values);
    const matchingWhere =
      filterClauses.length > 0
        ? `${searchableWhere} AND ${filterClauses.join(" AND ")}`
        : searchableWhere;

    const totalsSql = `
      SELECT
        (SELECT COUNT(*) FROM tenant t ${searchableWhere}) AS total_searchable_records,
        (SELECT COUNT(*) FROM tenant t ${matchingWhere}) AS total_matching_records
    `;
    const totals = await dbPool.query(totalsSql, values);

    values.push(input.pageSize);
    values.push((input.page - 1) * input.pageSize);
    const dataSql = `
      SELECT t.*
      FROM tenant t
      ${matchingWhere}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;
    const data = await dbPool.query<TenantRecord>(dataSql, values);

    return {
      items: data.rows.map(toTenantData),
      totalSearchableRecords: Number(totals.rows[0].total_searchable_records),
      totalMatchingRecords: Number(totals.rows[0].total_matching_records),
    };
  }

  return {
    async create(input: CreateTenantRecordInput) {
      const result = await dbPool.query<TenantRecord>(
        `
          INSERT INTO tenant (
            tenant_id,
            biz_id,
            normalized_biz_id,
            name,
            normalized_name,
            category,
            status,
            pre_delete_status,
            created_by_root_admin_user_id,
            created_at,
            updated_at,
            deleted_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, NOW(), NOW(), NULL)
          RETURNING *
        `,
        [
          input.tenantId,
          input.bizId,
          normalizeBizId(input.bizId),
          input.name,
          normalizeName(input.name),
          input.category,
          input.status,
          input.createdByRootAdminUserId,
        ],
      );
      return toTenantData(result.rows[0]);
    },
    findVisibleById(tenantId) {
      return queryOne(`SELECT * FROM tenant WHERE tenant_id = $1 AND deleted_at IS NULL`, [
        tenantId,
      ]);
    },
    findDeletedById(tenantId) {
      return queryOne(`SELECT * FROM tenant WHERE tenant_id = $1 AND deleted_at IS NOT NULL`, [
        tenantId,
      ]);
    },
    findAnyById(tenantId) {
      return queryOne(`SELECT * FROM tenant WHERE tenant_id = $1`, [tenantId]);
    },
    findNonDeletedByBizId(bizId) {
      return queryOne(
        `SELECT * FROM tenant WHERE normalized_biz_id = $1 AND deleted_at IS NULL`,
        [normalizeBizId(bizId)],
      );
    },
    listVisible(input) {
      return runList(`t.deleted_at IS NULL`, input);
    },
    listDeleted(input) {
      return runList(`t.deleted_at IS NOT NULL`, input);
    },
    async update(input: UpdateTenantRecordInput) {
      const assignments: string[] = [];
      const values: unknown[] = [];
      if (input.name !== undefined) {
        values.push(input.name);
        assignments.push(`name = $${values.length}`);
        values.push(normalizeName(input.name));
        assignments.push(`normalized_name = $${values.length}`);
      }
      if (input.category !== undefined) {
        values.push(input.category);
        assignments.push(`category = $${values.length}`);
      }
      if (input.status !== undefined) {
        values.push(input.status);
        assignments.push(`status = $${values.length}`);
      }
      assignments.push(`updated_at = NOW()`);
      values.push(input.tenantId);
      const result = await dbPool.query<TenantRecord>(
        `UPDATE tenant SET ${assignments.join(", ")} WHERE tenant_id = $${values.length} AND deleted_at IS NULL RETURNING *`,
        values,
      );
      return toTenantData(result.rows[0]);
    },
    async softDelete(tenantId) {
      const result = await dbPool.query<TenantRecord>(
        `
          UPDATE tenant
          SET
            pre_delete_status = status,
            status = 'inactive',
            deleted_at = NOW(),
            updated_at = NOW()
          WHERE tenant_id = $1
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId],
      );
      return toTenantData(result.rows[0]);
    },
    async reactivate(tenantId) {
      const result = await dbPool.query<TenantRecord>(
        `
          UPDATE tenant
          SET
            status = COALESCE(pre_delete_status, status),
            pre_delete_status = NULL,
            deleted_at = NULL,
            updated_at = NOW()
          WHERE tenant_id = $1
            AND deleted_at IS NOT NULL
          RETURNING *
        `,
        [tenantId],
      );
      return toTenantData(result.rows[0]);
    },
    async remove(tenantId) {
      const result = await dbPool.query<TenantRecord>(
        `DELETE FROM tenant WHERE tenant_id = $1 RETURNING *`,
        [tenantId],
      );
      return toTenantData(result.rows[0]);
    },
  };
}
