import type { Pool, QueryResultRow } from "pg";
import type { OrganizationBusinessUnitMembershipData } from "../domain/types";
import type {
  MembershipRepositoryListInput,
  MembershipRepositoryListResult,
  OrganizationBusinessUnitMembershipsRepository,
} from "./types";

const ORDER_BY: Record<string, string> = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  membershipRole: "membership_role",
};

function toData(row: QueryResultRow): OrganizationBusinessUnitMembershipData {
  return {
    membershipId: row.organization_business_unit_membership_id,
    tenantId: row.tenant_id,
    organizationId: row.organization_id,
    businessUnitId: row.business_unit_id,
    memberType: row.member_type,
    individualUserId: row.individual_user_id,
    memberBusinessUnitId: row.member_business_unit_id,
    membershipRole: row.membership_role,
    lifecycleStatus: row.lifecycle_status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function createPostgresOrganizationBusinessUnitMembershipsRepository(
  pool: Pool,
): OrganizationBusinessUnitMembershipsRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<OrganizationBusinessUnitMembershipData | null> {
    const result = await pool.query(sql, params);
    return result.rows[0] ? toData(result.rows[0]) : null;
  }
  return {
    async create(input) {
      const result = await pool.query(
        `INSERT INTO organization_business_unit_membership (
          organization_business_unit_membership_id, tenant_id, organization_id, business_unit_id,
          member_type, individual_user_id, member_business_unit_id, membership_role
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          input.membershipId,
          input.tenantId,
          input.organizationId,
          input.businessUnitId,
          input.memberType,
          input.individualUserId,
          input.memberBusinessUnitId,
          input.membershipRole,
        ],
      );
      return toData(result.rows[0]);
    },
    findActiveById(tenantId, organizationId, businessUnitId, membershipId) {
      return queryOne(
        `SELECT * FROM organization_business_unit_membership
          WHERE tenant_id = $1 AND organization_id = $2 AND business_unit_id = $3
            AND organization_business_unit_membership_id = $4
            AND lifecycle_status = 'active' AND deleted_at IS NULL`,
        [tenantId, organizationId, businessUnitId, membershipId],
      );
    },
    async list(input: MembershipRepositoryListInput): Promise<MembershipRepositoryListResult> {
      const where = [
        "tenant_id = $1",
        "organization_id = $2",
        "business_unit_id = $3",
        "deleted_at IS NULL",
        input.includeArchived ? "TRUE" : "lifecycle_status = 'active'",
      ];
      const values: unknown[] = [input.tenantId, input.organizationId, input.businessUnitId];
      if (input.lifecycleStatus) {
        values.push(input.lifecycleStatus);
        where.push(`lifecycle_status = $${values.length}`);
      }
      const whereSql = `WHERE ${where.join(" AND ")}`;
      const count = await pool.query(`SELECT COUNT(*)::int AS count FROM organization_business_unit_membership ${whereSql}`, values);
      values.push(input.pageSize, (input.page - 1) * input.pageSize);
      const result = await pool.query(
        `SELECT * FROM organization_business_unit_membership
          ${whereSql}
          ORDER BY ${ORDER_BY[input.orderBy] ?? "updated_at"} ${input.orderDirection === "asc" ? "ASC" : "DESC"}
          LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values,
      );
      const total = Number(count.rows[0]?.count ?? 0);
      return { items: result.rows.map(toData), totalMatchingRecords: total, totalSearchableRecords: total };
    },
    async listForOrganization(input): Promise<MembershipRepositoryListResult> {
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
      const whereSql = `WHERE ${where.join(" AND ")}`;
      const count = await pool.query(`SELECT COUNT(*)::int AS count FROM organization_business_unit_membership ${whereSql}`, values);
      values.push(input.pageSize, (input.page - 1) * input.pageSize);
      const result = await pool.query(
        `SELECT * FROM organization_business_unit_membership
          ${whereSql}
          ORDER BY ${ORDER_BY[input.orderBy] ?? "updated_at"} ${input.orderDirection === "asc" ? "ASC" : "DESC"}
          LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values,
      );
      const total = Number(count.rows[0]?.count ?? 0);
      return { items: result.rows.map(toData), totalMatchingRecords: total, totalSearchableRecords: total };
    },
    update(input) {
      return queryOne(
        `UPDATE organization_business_unit_membership
            SET member_type = $5,
                individual_user_id = $6,
                member_business_unit_id = $7,
                membership_role = $8,
                updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND business_unit_id = $3
            AND organization_business_unit_membership_id = $4
            AND lifecycle_status = 'active' AND deleted_at IS NULL
        RETURNING *`,
        [
          input.tenantId,
          input.organizationId,
          input.businessUnitId,
          input.membershipId,
          input.memberType,
          input.individualUserId,
          input.memberBusinessUnitId,
          input.membershipRole,
        ],
      );
    },
    archive(tenantId, organizationId, businessUnitId, membershipId) {
      return queryOne(
        `UPDATE organization_business_unit_membership
            SET lifecycle_status = 'archived', archived_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND business_unit_id = $3
            AND organization_business_unit_membership_id = $4 AND lifecycle_status = 'active' AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitId, membershipId],
      );
    },
    restore(tenantId, organizationId, businessUnitId, membershipId) {
      return queryOne(
        `UPDATE organization_business_unit_membership
            SET lifecycle_status = 'active', archived_at = NULL, updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND business_unit_id = $3
            AND organization_business_unit_membership_id = $4 AND lifecycle_status = 'archived' AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitId, membershipId],
      );
    },
    softDelete(tenantId, organizationId, businessUnitId, membershipId) {
      return queryOne(
        `UPDATE organization_business_unit_membership
            SET deleted_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1 AND organization_id = $2 AND business_unit_id = $3
            AND organization_business_unit_membership_id = $4 AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, businessUnitId, membershipId],
      );
    },
    async recordAuditEvent(input) {
      await pool.query(
        `INSERT INTO organization_business_unit_membership_audit_event (
          organization_business_unit_membership_audit_event_id, tenant_id, organization_id, business_unit_id,
          organization_business_unit_membership_id, actor_type, actor_id, event_type, event_outcome, event_details, occurred_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11)`,
        [
          input.eventId,
          input.tenantId,
          input.organizationId,
          input.businessUnitId,
          input.membershipId,
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
