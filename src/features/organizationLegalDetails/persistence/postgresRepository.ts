import type { Pool } from "pg";
import type { OrganizationLegalProfileData } from "../domain/types";
import type { OrganizationLegalDetailsRepository } from "./repository";
import type {
  LegalProfileAuditEventInput,
  LegalProfileRepositoryListInput,
  LegalProfileRepositoryListResult,
  OrganizationLegalProfileRecord,
} from "./types";

function mapRecord(record: OrganizationLegalProfileRecord): OrganizationLegalProfileData {
  return {
    legalProfileId: record.organization_legal_profile_id,
    tenantId: record.tenant_id,
    organizationId: record.organization_id,
    legalName: record.legal_name,
    registrationIdentifier: record.registration_identifier,
    taxVatNumber: record.tax_vat_number,
    registeredAddress: record.registered_address,
    lifecycleStatus: record.lifecycle_status,
    archivedAt: record.archived_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at,
  };
}

function orderByColumn(orderBy: string): string {
  if (orderBy === "legalName") {
    return "legal_name";
  }
  if (orderBy === "createdAt") {
    return "created_at";
  }
  return "updated_at";
}

export function createPostgresOrganizationLegalDetailsRepository(dbPool: Pool): OrganizationLegalDetailsRepository {
  return {
    async create(input) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          INSERT INTO organization_legal_profile (
            organization_legal_profile_id,
            tenant_id,
            organization_id,
            legal_name,
            registration_identifier,
            tax_vat_number,
            registered_address,
            lifecycle_status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
          RETURNING *
        `,
        [
          input.legalProfileId,
          input.tenantId,
          input.organizationId,
          input.legalName,
          input.registrationIdentifier,
          input.taxVatNumber,
          input.registeredAddress,
        ],
      );
      return mapRecord(result.rows[0]);
    },
    async findActiveByOrganization(tenantId, organizationId) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          SELECT *
          FROM organization_legal_profile
          WHERE tenant_id = $1
            AND organization_id = $2
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [tenantId, organizationId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async findVisibleById(tenantId, organizationId, legalProfileId) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          SELECT *
          FROM organization_legal_profile
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_legal_profile_id = $3
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [tenantId, organizationId, legalProfileId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async findNonDeletedById(tenantId, organizationId, legalProfileId) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          SELECT *
          FROM organization_legal_profile
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_legal_profile_id = $3
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [tenantId, organizationId, legalProfileId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async list(input: LegalProfileRepositoryListInput): Promise<LegalProfileRepositoryListResult> {
      const conditions = ["tenant_id = $1", "organization_id = $2", "deleted_at IS NULL"];
      const values: unknown[] = [input.tenantId, input.organizationId];
      if (!input.includeArchived) {
        conditions.push("lifecycle_status = 'active'");
      }
      if (input.lifecycleStatus) {
        values.push(input.lifecycleStatus);
        conditions.push(`lifecycle_status = $${values.length}`);
      }
      const where = conditions.join(" AND ");
      const countResult = await dbPool.query<{ count: string }>(
        `SELECT COUNT(*)::TEXT AS count FROM organization_legal_profile WHERE ${where}`,
        values,
      );
      const offset = (input.page - 1) * input.pageSize;
      const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          SELECT *
          FROM organization_legal_profile
          WHERE ${where}
          ORDER BY ${orderByColumn(input.orderBy)} ${orderDirection}, organization_legal_profile_id ASC
          LIMIT $${values.length + 1}
          OFFSET $${values.length + 2}
        `,
        [...values, input.pageSize, offset],
      );
      const count = Number(countResult.rows[0]?.count ?? 0);
      return {
        items: result.rows.map(mapRecord),
        totalSearchableRecords: count,
        totalMatchingRecords: count,
      };
    },
    async update(input) {
      const hasLegalName = Object.prototype.hasOwnProperty.call(input, "legalName");
      const hasRegistrationIdentifier = Object.prototype.hasOwnProperty.call(input, "registrationIdentifier");
      const hasTaxVatNumber = Object.prototype.hasOwnProperty.call(input, "taxVatNumber");
      const hasRegisteredAddress = Object.prototype.hasOwnProperty.call(input, "registeredAddress");
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          UPDATE organization_legal_profile
          SET
            legal_name = CASE WHEN $4 THEN $5 ELSE legal_name END,
            registration_identifier = CASE WHEN $6 THEN $7 ELSE registration_identifier END,
            tax_vat_number = CASE WHEN $8 THEN $9 ELSE tax_vat_number END,
            registered_address = CASE WHEN $10 THEN $11 ELSE registered_address END,
            updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_legal_profile_id = $3
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [
          input.tenantId,
          input.organizationId,
          input.legalProfileId,
          hasLegalName,
          input.legalName,
          hasRegistrationIdentifier,
          input.registrationIdentifier,
          hasTaxVatNumber,
          input.taxVatNumber,
          hasRegisteredAddress,
          input.registeredAddress,
        ],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async archive(tenantId, organizationId, legalProfileId) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          UPDATE organization_legal_profile
          SET lifecycle_status = 'archived', archived_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_legal_profile_id = $3
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, legalProfileId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async restore(tenantId, organizationId, legalProfileId) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          UPDATE organization_legal_profile
          SET lifecycle_status = 'active', archived_at = NULL, updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_legal_profile_id = $3
            AND lifecycle_status = 'archived'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, legalProfileId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async softDelete(tenantId, organizationId, legalProfileId) {
      const result = await dbPool.query<OrganizationLegalProfileRecord>(
        `
          UPDATE organization_legal_profile
          SET deleted_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_legal_profile_id = $3
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, legalProfileId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async recordAuditEvent(input: LegalProfileAuditEventInput) {
      await dbPool.query(
        `
          INSERT INTO organization_legal_profile_audit_event (
            organization_legal_profile_audit_event_id,
            tenant_id,
            organization_id,
            organization_legal_profile_id,
            actor_type,
            actor_id,
            event_type,
            event_outcome,
            event_details,
            occurred_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
        `,
        [
          input.eventId,
          input.tenantId,
          input.organizationId,
          input.legalProfileId,
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
