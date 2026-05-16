import type { Pool, QueryResultRow } from "pg";
import type { OrganizationBusinessUnitData } from "../domain/types";
import type {
  BusinessUnitRepositoryListInput,
  BusinessUnitRepositoryListResult,
  OrganizationBusinessUnitsRepository,
} from "./types";

const ORDER_BY: Record<string, string> = {
  name: "name",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function toData(row: QueryResultRow): OrganizationBusinessUnitData {
  return {
    businessUnitId: row.organization_business_unit_id,
    tenantId: row.tenant_id,
    organizationId: row.organization_id,
    parentBusinessUnitId: row.parent_business_unit_id,
    name: row.name,
    normalizedName: row.normalized_name,
    lifecycleStatus: row.lifecycle_status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function createPostgresOrganizationBusinessUnitsRepository(pool: Pool): OrganizationBusinessUnitsRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<OrganizationBusinessUnitData | null> {
    const result = await pool.query(sql, params);
    return result.rows[0] ? toData(result.rows[0]) : null;
  }

  return {
    async create(input) {
      const result = await pool.query(
        `INSERT INTO organization_business_unit (
          organization_business_unit_id, tenant_id, organization_id, parent_business_unit_id, name, normalized_name
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          input.businessUnitId,
          input.tenantId,
          input.organizationId,
          input.parentBusinessUnitId,
          input.name.trim(),
          normalizeName(input.name),
        ],
      );
      return toData(result.rows[0]);
    },
    findActiveById(tenantId, organizationId, businessUnitId) {
      return queryOne(
        `SELECT * FROM organization_business_unit
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = $3
            AND lifecycle_status = 'active' AND deleted_at IS NULL`,
        [tenantId, organizationId, businessUnitId],
      );
    },
    findNonDeletedById(tenantId, organizationId, businessUnitId) {
      return queryOne(
        `SELECT * FROM organization_business_unit
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = $3
            AND deleted_at IS NULL`,
        [tenantId, organizationId, businessUnitId],
      );
    },
    async list(input: BusinessUnitRepositoryListInput): Promise<BusinessUnitRepositoryListResult> {
      const where = [
        "tenant_id = $1",
        "organization_id = $2",
        "deleted_at IS NULL",
        input.includeArchived ? "TRUE" : "lifecycle_status = 'active'",
      ];
      const values: unknown[] = [input.tenantId, input.organizationId];
      if (input.lifecycleStatus) {
        values.push(input.lifecycleStatus);
        where.push(`lifecycle_status = $${values.length}`);
      }
      if (input.parentBusinessUnitId !== undefined) {
        if (input.parentBusinessUnitId === null) {
          where.push("parent_business_unit_id IS NULL");
        } else {
          values.push(input.parentBusinessUnitId);
          where.push(`parent_business_unit_id = $${values.length}`);
        }
      }
      const whereSql = `WHERE ${where.join(" AND ")}`;
      const count = await pool.query(
        `SELECT COUNT(*)::int AS count FROM organization_business_unit ${whereSql}`,
        values,
      );
      values.push(input.pageSize, (input.page - 1) * input.pageSize);
      const orderBy = ORDER_BY[input.orderBy] ?? "updated_at";
      const result = await pool.query(
        `SELECT * FROM organization_business_unit
          ${whereSql}
          ORDER BY ${orderBy} ${input.orderDirection === "asc" ? "ASC" : "DESC"}
          LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values,
      );
      const total = Number(count.rows[0]?.count ?? 0);
      return { items: result.rows.map(toData), totalMatchingRecords: total, totalSearchableRecords: total };
    },
    async update(input) {
      if (input.name === undefined) {
        return this.findActiveById(input.tenantId, input.organizationId, input.businessUnitId);
      }
      return queryOne(
        `UPDATE organization_business_unit
            SET name = $4, normalized_name = $5, updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = $3
            AND lifecycle_status = 'active' AND deleted_at IS NULL
        RETURNING *`,
        [input.tenantId, input.organizationId, input.businessUnitId, input.name.trim(), normalizeName(input.name)],
      );
    },
    move(tenantId, organizationId, businessUnitId, parentBusinessUnitId) {
      return queryOne(
        `UPDATE organization_business_unit
            SET parent_business_unit_id = $4, updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = $3
            AND lifecycle_status = 'active' AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitId, parentBusinessUnitId],
      );
    },
    async archive(tenantId, organizationId, businessUnitIds) {
      const result = await pool.query(
        `UPDATE organization_business_unit
            SET lifecycle_status = 'archived', archived_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = ANY($3::uuid[])
            AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitIds],
      );
      return result.rows[0] ? toData(result.rows[0]) : null;
    },
    restore(tenantId, organizationId, businessUnitId) {
      return queryOne(
        `UPDATE organization_business_unit
            SET lifecycle_status = 'active', archived_at = NULL, updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = $3
            AND lifecycle_status = 'archived' AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitId],
      );
    },
    softDelete(tenantId, organizationId, businessUnitId) {
      return queryOne(
        `UPDATE organization_business_unit
            SET deleted_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND organization_business_unit_id = $3
            AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitId],
      );
    },
    async listActiveChildren(tenantId, organizationId, businessUnitId) {
      const result = await pool.query(
        `SELECT * FROM organization_business_unit
          WHERE tenant_id = $1 AND organization_id = $2 AND parent_business_unit_id = $3
            AND lifecycle_status = 'active' AND deleted_at IS NULL
          ORDER BY name ASC`,
        [tenantId, organizationId, businessUnitId],
      );
      return result.rows.map(toData);
    },
    async listNonDeletedDescendants(tenantId, organizationId, businessUnitId) {
      const result = await pool.query(
        `WITH RECURSIVE descendants AS (
          SELECT * FROM organization_business_unit
          WHERE tenant_id = $1 AND organization_id = $2 AND parent_business_unit_id = $3 AND deleted_at IS NULL
          UNION ALL
          SELECT child.* FROM organization_business_unit child
          JOIN descendants parent ON child.parent_business_unit_id = parent.organization_business_unit_id
          WHERE child.tenant_id = $1 AND child.organization_id = $2 AND child.deleted_at IS NULL
        )
        SELECT * FROM descendants`,
        [tenantId, organizationId, businessUnitId],
      );
      return result.rows.map(toData);
    },
    async listActiveAncestors(tenantId, organizationId, businessUnitId) {
      const result = await pool.query(
        `WITH RECURSIVE ancestors AS (
          SELECT parent.* FROM organization_business_unit child
          JOIN organization_business_unit parent ON child.parent_business_unit_id = parent.organization_business_unit_id
          WHERE child.tenant_id = $1 AND child.organization_id = $2
            AND child.organization_business_unit_id = $3
            AND parent.lifecycle_status = 'active' AND parent.deleted_at IS NULL
          UNION ALL
          SELECT parent.* FROM organization_business_unit parent
          JOIN ancestors child ON child.parent_business_unit_id = parent.organization_business_unit_id
          WHERE parent.tenant_id = $1 AND parent.organization_id = $2
            AND parent.lifecycle_status = 'active' AND parent.deleted_at IS NULL
        )
        SELECT * FROM ancestors`,
        [tenantId, organizationId, businessUnitId],
      );
      return result.rows.map(toData);
    },
    async recordAuditEvent(input) {
      await pool.query(
        `INSERT INTO organization_business_unit_audit_event (
          organization_business_unit_audit_event_id, tenant_id, organization_id, organization_business_unit_id,
          actor_type, actor_id, event_type, event_outcome, event_details, occurred_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)`,
        [
          input.eventId,
          input.tenantId,
          input.organizationId,
          input.businessUnitId,
          input.actorType,
          input.actorId,
          input.eventType,
          input.eventOutcome,
          JSON.stringify(input.eventDetails ?? {}),
          input.occurredAt,
        ],
      );
    },
  };
}
