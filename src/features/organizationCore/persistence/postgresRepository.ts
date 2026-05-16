import type { Pool } from "pg";
import type { OrganizationData } from "../domain/types";
import type { OrganizationCoreRepository } from "./repository";
import type {
  CreateOrganizationRecordInput,
  OrganizationAuditEventInput,
  OrganizationRecord,
  OrganizationRepositoryListInput,
  OrganizationRepositoryListResult,
  UpdateOrganizationRecordInput,
} from "./types";

const ORDER_BY_MAP: Record<string, string> = {
  name: "name",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function toOrganizationData(record: OrganizationRecord): OrganizationData {
  return {
    organizationId: record.organization_id,
    tenantId: record.tenant_id,
    parentOrganizationId: record.parent_organization_id,
    name: record.name,
    normalizedName: record.normalized_name,
    organizationTypeReferenceValueId: record.organization_type_reference_value_id,
    lifecycleStatus: record.lifecycle_status,
    archivedAt: record.archived_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at,
  };
}

function buildFilters(
  filters: OrganizationRepositoryListInput["filters"],
  values: unknown[],
): string[] {
  const clauses: string[] = [];
  if (filters.namePrefix) {
    values.push(`${filters.namePrefix.trim().toLowerCase()}%`);
    clauses.push(`o.normalized_name LIKE $${values.length}`);
  }
  if (filters.parentOrganizationId !== undefined) {
    if (filters.parentOrganizationId === null) {
      clauses.push("o.parent_organization_id IS NULL");
    } else {
      values.push(filters.parentOrganizationId);
      clauses.push(`o.parent_organization_id = $${values.length}`);
    }
  }
  if (filters.lifecycleStatus) {
    values.push(filters.lifecycleStatus);
    clauses.push(`o.lifecycle_status = $${values.length}`);
  }
  if (filters.createdAtFrom) {
    values.push(filters.createdAtFrom);
    clauses.push(`o.created_at >= $${values.length}`);
  }
  if (filters.createdAtTo) {
    values.push(filters.createdAtTo);
    clauses.push(`o.created_at <= $${values.length}`);
  }
  if (filters.updatedAtFrom) {
    values.push(filters.updatedAtFrom);
    clauses.push(`o.updated_at >= $${values.length}`);
  }
  if (filters.updatedAtTo) {
    values.push(filters.updatedAtTo);
    clauses.push(`o.updated_at <= $${values.length}`);
  }
  return clauses;
}

export function createPostgresOrganizationCoreRepository(dbPool: Pool): OrganizationCoreRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<OrganizationData | null> {
    const result = await dbPool.query<OrganizationRecord>(sql, params);
    return result.rows[0] ? toOrganizationData(result.rows[0]) : null;
  }

  async function listActive(
    input: OrganizationRepositoryListInput,
  ): Promise<OrganizationRepositoryListResult> {
    const orderBy = ORDER_BY_MAP[input.orderBy] ?? "updated_at";
    const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
    const values: unknown[] = [input.tenantId];
    const searchableWhere =
      "WHERE o.tenant_id = $1 AND o.lifecycle_status = 'active' AND o.deleted_at IS NULL";
    const filterClauses = buildFilters(input.filters, values);
    const matchingWhere =
      filterClauses.length > 0
        ? `${searchableWhere} AND ${filterClauses.join(" AND ")}`
        : searchableWhere;

    const totals = await dbPool.query(
      `
        SELECT
          (SELECT COUNT(*) FROM organization o ${searchableWhere}) AS total_searchable_records,
          (SELECT COUNT(*) FROM organization o ${matchingWhere}) AS total_matching_records
      `,
      values,
    );

    values.push(input.pageSize);
    values.push((input.page - 1) * input.pageSize);
    const result = await dbPool.query<OrganizationRecord>(
      `
        SELECT o.*
        FROM organization o
        ${matchingWhere}
        ORDER BY ${orderBy} ${orderDirection}
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
      `,
      values,
    );

    return {
      items: result.rows.map(toOrganizationData),
      totalSearchableRecords: Number(totals.rows[0].total_searchable_records),
      totalMatchingRecords: Number(totals.rows[0].total_matching_records),
    };
  }

  return {
    async create(input: CreateOrganizationRecordInput) {
      const result = await dbPool.query<OrganizationRecord>(
        `
          INSERT INTO organization (
            organization_id,
            tenant_id,
            parent_organization_id,
            name,
            normalized_name,
            organization_type_reference_value_id,
            lifecycle_status,
            archived_at,
            created_at,
            updated_at,
            deleted_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, 'active', NULL, NOW(), NOW(), NULL)
          RETURNING *
        `,
        [
          input.organizationId,
          input.tenantId,
          input.parentOrganizationId,
          input.name.trim(),
          normalizeName(input.name),
          input.organizationTypeReferenceValueId,
        ],
      );
      return toOrganizationData(result.rows[0]);
    },
    findActiveById(tenantId, organizationId) {
      return queryOne(
        `
          SELECT *
          FROM organization
          WHERE tenant_id = $1
            AND organization_id = $2
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
        `,
        [tenantId, organizationId],
      );
    },
    findArchivedById(tenantId, organizationId) {
      return queryOne(
        `
          SELECT *
          FROM organization
          WHERE tenant_id = $1
            AND organization_id = $2
            AND lifecycle_status = 'archived'
            AND deleted_at IS NULL
        `,
        [tenantId, organizationId],
      );
    },
    findNonDeletedById(tenantId, organizationId) {
      return queryOne(
        `
          SELECT *
          FROM organization
          WHERE tenant_id = $1
            AND organization_id = $2
            AND deleted_at IS NULL
        `,
        [tenantId, organizationId],
      );
    },
    findActiveByName(tenantId, name) {
      return queryOne(
        `
          SELECT *
          FROM organization
          WHERE tenant_id = $1
            AND normalized_name = $2
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
        `,
        [tenantId, normalizeName(name)],
      );
    },
    listActive,
    async update(input: UpdateOrganizationRecordInput) {
      const assignments: string[] = [];
      const values: unknown[] = [];
      if (input.name !== undefined) {
        values.push(input.name.trim());
        assignments.push(`name = $${values.length}`);
        values.push(normalizeName(input.name));
        assignments.push(`normalized_name = $${values.length}`);
      }
      if (input.organizationTypeReferenceValueId !== undefined) {
        values.push(input.organizationTypeReferenceValueId);
        assignments.push(`organization_type_reference_value_id = $${values.length}`);
      }
      assignments.push("updated_at = NOW()");
      values.push(input.tenantId, input.organizationId);
      const result = await dbPool.query<OrganizationRecord>(
        `
          UPDATE organization
          SET ${assignments.join(", ")}
          WHERE tenant_id = $${values.length - 1}
            AND organization_id = $${values.length}
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        values,
      );
      return result.rows[0] ? toOrganizationData(result.rows[0]) : null;
    },
    async move(tenantId, organizationId, parentOrganizationId) {
      const result = await dbPool.query<OrganizationRecord>(
        `
          UPDATE organization
          SET parent_organization_id = $3, updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, parentOrganizationId],
      );
      return result.rows[0] ? toOrganizationData(result.rows[0]) : null;
    },
    async archive(tenantId, organizationIds) {
      if (organizationIds.length === 0) {
        return null;
      }
      const result = await dbPool.query<OrganizationRecord>(
        `
          UPDATE organization
          SET lifecycle_status = 'archived', archived_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = ANY($2::uuid[])
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationIds],
      );
      return result.rows.find((row) => row.organization_id === organizationIds[0])
        ? toOrganizationData(result.rows.find((row) => row.organization_id === organizationIds[0])!)
        : null;
    },
    async restore(tenantId, organizationId) {
      const result = await dbPool.query<OrganizationRecord>(
        `
          UPDATE organization
          SET lifecycle_status = 'active', archived_at = NULL, updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND lifecycle_status = 'archived'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId],
      );
      return result.rows[0] ? toOrganizationData(result.rows[0]) : null;
    },
    async softDelete(tenantId, organizationId) {
      const result = await dbPool.query<OrganizationRecord>(
        `
          UPDATE organization
          SET deleted_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId],
      );
      return result.rows[0] ? toOrganizationData(result.rows[0]) : null;
    },
    async listActiveChildren(tenantId, organizationId) {
      const result = await dbPool.query<OrganizationRecord>(
        `
          SELECT *
          FROM organization
          WHERE tenant_id = $1
            AND parent_organization_id = $2
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          ORDER BY name ASC
        `,
        [tenantId, organizationId],
      );
      return result.rows.map(toOrganizationData);
    },
    async listNonDeletedDescendants(tenantId, organizationId) {
      const result = await dbPool.query<OrganizationRecord>(
        `
          WITH RECURSIVE descendants AS (
            SELECT *
            FROM organization
            WHERE tenant_id = $1
              AND parent_organization_id = $2
              AND deleted_at IS NULL
            UNION ALL
            SELECT child.*
            FROM organization child
            JOIN descendants parent
              ON child.parent_organization_id = parent.organization_id
            WHERE child.tenant_id = $1
              AND child.deleted_at IS NULL
          )
          SELECT *
          FROM descendants
        `,
        [tenantId, organizationId],
      );
      return result.rows.map(toOrganizationData);
    },
    async recordAuditEvent(input: OrganizationAuditEventInput) {
      await dbPool.query(
        `
          INSERT INTO organization_audit_event (
            organization_audit_event_id,
            tenant_id,
            organization_id,
            actor_type,
            actor_id,
            event_type,
            event_outcome,
            event_details,
            occurred_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
        `,
        [
          input.eventId,
          input.tenantId,
          input.organizationId,
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
