import type { Pool, QueryResultRow } from "pg";
import type { OrganizationReferenceValueData, OrganizationReferenceValueLifecycleStatus } from "../domain/types";
import type {
  ListReferenceValueRecordInput,
  ListReferenceValueRecordResult,
  OrganizationReferenceCataloguesRepository,
} from "./types";

const ORDER_BY: Record<string, string> = {
  label: "label",
  referenceType: "reference_type",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

function toData(row: QueryResultRow): OrganizationReferenceValueData {
  return {
    referenceValueId: row.organization_reference_value_id,
    referenceType: row.reference_type,
    referenceValueKey: row.reference_value_key,
    label: row.label,
    replacementReferenceValueId: row.replacement_reference_value_id,
    lifecycleStatus: row.lifecycle_status as OrganizationReferenceValueLifecycleStatus,
    archivedAt: row.archived_at,
    deprecatedAt: row.deprecated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createPostgresOrganizationReferenceCataloguesRepository(
  pool: Pool,
): OrganizationReferenceCataloguesRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<OrganizationReferenceValueData | null> {
    const result = await pool.query(sql, params);
    return result.rows[0] ? toData(result.rows[0]) : null;
  }

  return {
    async create(input) {
      const result = await pool.query(
        `INSERT INTO organization_reference_value (
          organization_reference_value_id, reference_type, reference_value_key, label
        ) VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [input.referenceValueId, input.referenceType, input.referenceValueKey, input.label],
      );
      return toData(result.rows[0]);
    },
    async list(input: ListReferenceValueRecordInput): Promise<ListReferenceValueRecordResult> {
      const where = [input.includeRetained ? "TRUE" : "lifecycle_status = 'active'"];
      const values: unknown[] = [];
      if (input.referenceType) {
        values.push(input.referenceType);
        where.push(`reference_type = $${values.length}`);
      }
      if (input.lifecycleStatus) {
        values.push(input.lifecycleStatus);
        where.push(`lifecycle_status = $${values.length}`);
      }
      const whereSql = `WHERE ${where.join(" AND ")}`;
      const count = await pool.query(`SELECT COUNT(*)::int AS count FROM organization_reference_value ${whereSql}`, values);
      values.push(input.pageSize, (input.page - 1) * input.pageSize);
      const result = await pool.query(
        `SELECT * FROM organization_reference_value
          ${whereSql}
          ORDER BY ${ORDER_BY[input.orderBy] ?? "label"} ${input.orderDirection === "desc" ? "DESC" : "ASC"}
          LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values,
      );
      const total = Number(count.rows[0]?.count ?? 0);
      return { items: result.rows.map(toData), totalMatchingRecords: total, totalSearchableRecords: total };
    },
    findById(referenceValueId) {
      return queryOne(
        `SELECT * FROM organization_reference_value WHERE organization_reference_value_id = $1`,
        [referenceValueId],
      );
    },
    updateLabel(referenceValueId, label) {
      return queryOne(
        `UPDATE organization_reference_value
            SET label = $2, updated_at = NOW()
          WHERE organization_reference_value_id = $1
        RETURNING *`,
        [referenceValueId, label],
      );
    },
    archive(referenceValueId) {
      return queryOne(
        `UPDATE organization_reference_value
            SET lifecycle_status = 'archived',
                archived_at = NOW(),
                deprecated_at = NULL,
                replacement_reference_value_id = NULL,
                updated_at = NOW()
          WHERE organization_reference_value_id = $1
        RETURNING *`,
        [referenceValueId],
      );
    },
    deprecate(referenceValueId) {
      return queryOne(
        `UPDATE organization_reference_value
            SET lifecycle_status = 'deprecated',
                deprecated_at = NOW(),
                archived_at = NULL,
                replacement_reference_value_id = NULL,
                updated_at = NOW()
          WHERE organization_reference_value_id = $1
        RETURNING *`,
        [referenceValueId],
      );
    },
    replace(referenceValueId, replacementReferenceValueId) {
      return queryOne(
        `UPDATE organization_reference_value
            SET lifecycle_status = 'replaced',
                replacement_reference_value_id = $2,
                archived_at = NULL,
                deprecated_at = NULL,
                updated_at = NOW()
          WHERE organization_reference_value_id = $1
        RETURNING *`,
        [referenceValueId, replacementReferenceValueId],
      );
    },
    async recordAuditEvent(input) {
      await pool.query(
        `INSERT INTO organization_reference_value_audit_event (
          organization_reference_value_audit_event_id, organization_reference_value_id,
          actor_type, actor_id, event_type, event_outcome, event_details, occurred_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)`,
        [
          input.eventId,
          input.referenceValueId,
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
