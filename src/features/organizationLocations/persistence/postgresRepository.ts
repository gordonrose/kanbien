import type { Pool } from "pg";
import type { OrganizationLocationData } from "../domain/types";
import type { OrganizationLocationsRepository } from "./repository";
import type {
  LocationAuditEventInput,
  LocationRepositoryListInput,
  LocationRepositoryListResult,
  OrganizationLocationRecord,
} from "./types";

function mapRecord(record: OrganizationLocationRecord): OrganizationLocationData {
  return {
    locationId: record.organization_location_id,
    tenantId: record.tenant_id,
    organizationId: record.organization_id,
    locationName: record.location_name,
    addressSummary: record.address_summary,
    latitude: record.latitude,
    longitude: record.longitude,
    isHeadOffice: record.is_head_office,
    isRegisteredOffice: record.is_registered_office,
    lifecycleStatus: record.lifecycle_status,
    archivedAt: record.archived_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at,
  };
}

function orderByColumn(orderBy: string): string {
  if (orderBy === "locationName") {
    return "location_name";
  }
  if (orderBy === "createdAt") {
    return "created_at";
  }
  return "updated_at";
}

export function createPostgresOrganizationLocationsRepository(dbPool: Pool): OrganizationLocationsRepository {
  return {
    async create(input) {
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          INSERT INTO organization_location (
            organization_location_id,
            tenant_id,
            organization_id,
            location_name,
            address_summary,
            latitude,
            longitude,
            is_head_office,
            is_registered_office,
            lifecycle_status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')
          RETURNING *
        `,
        [
          input.locationId,
          input.tenantId,
          input.organizationId,
          input.locationName,
          input.addressSummary,
          input.latitude,
          input.longitude,
          input.isHeadOffice,
          input.isRegisteredOffice,
        ],
      );
      return mapRecord(result.rows[0]);
    },
    async findVisibleById(tenantId, organizationId, locationId) {
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          SELECT *
          FROM organization_location
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [tenantId, organizationId, locationId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async findNonDeletedById(tenantId, organizationId, locationId) {
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          SELECT *
          FROM organization_location
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [tenantId, organizationId, locationId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async list(input: LocationRepositoryListInput): Promise<LocationRepositoryListResult> {
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
        `SELECT COUNT(*)::TEXT AS count FROM organization_location WHERE ${where}`,
        values,
      );
      const offset = (input.page - 1) * input.pageSize;
      const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          SELECT *
          FROM organization_location
          WHERE ${where}
          ORDER BY ${orderByColumn(input.orderBy)} ${orderDirection}, organization_location_id ASC
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
      const hasLocationName = Object.prototype.hasOwnProperty.call(input, "locationName");
      const hasAddressSummary = Object.prototype.hasOwnProperty.call(input, "addressSummary");
      const hasLatitude = Object.prototype.hasOwnProperty.call(input, "latitude");
      const hasLongitude = Object.prototype.hasOwnProperty.call(input, "longitude");
      const hasHeadOffice = Object.prototype.hasOwnProperty.call(input, "isHeadOffice");
      const hasRegisteredOffice = Object.prototype.hasOwnProperty.call(input, "isRegisteredOffice");
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          UPDATE organization_location
          SET
            location_name = CASE WHEN $4 THEN $5 ELSE location_name END,
            address_summary = CASE WHEN $6 THEN $7 ELSE address_summary END,
            latitude = CASE WHEN $8 THEN $9 ELSE latitude END,
            longitude = CASE WHEN $10 THEN $11 ELSE longitude END,
            is_head_office = CASE WHEN $12 THEN $13 ELSE is_head_office END,
            is_registered_office = CASE WHEN $14 THEN $15 ELSE is_registered_office END,
            updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [
          input.tenantId,
          input.organizationId,
          input.locationId,
          hasLocationName,
          input.locationName,
          hasAddressSummary,
          input.addressSummary,
          hasLatitude,
          input.latitude,
          hasLongitude,
          input.longitude,
          hasHeadOffice,
          input.isHeadOffice,
          hasRegisteredOffice,
          input.isRegisteredOffice,
        ],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async archive(tenantId, organizationId, locationId) {
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          UPDATE organization_location
          SET lifecycle_status = 'archived', archived_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND lifecycle_status = 'active'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, locationId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async restore(tenantId, organizationId, locationId) {
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          UPDATE organization_location
          SET lifecycle_status = 'active', archived_at = NULL, updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND lifecycle_status = 'archived'
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, locationId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async softDelete(tenantId, organizationId, locationId) {
      const result = await dbPool.query<OrganizationLocationRecord>(
        `
          UPDATE organization_location
          SET deleted_at = NOW(), updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, organizationId, locationId],
      );
      return result.rows[0] ? mapRecord(result.rows[0]) : null;
    },
    async recordAuditEvent(input: LocationAuditEventInput) {
      await dbPool.query(
        `
          INSERT INTO organization_location_audit_event (
            organization_location_audit_event_id,
            tenant_id,
            organization_id,
            organization_location_id,
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
          input.locationId,
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
