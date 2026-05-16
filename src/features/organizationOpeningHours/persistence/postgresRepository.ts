import type { Pool, QueryResultRow } from "pg";
import type { OpeningHoursExceptionData, ReplacementOpeningSlot, WeeklyOpeningHoursSlotData } from "../domain/types";
import type { OrganizationOpeningHoursRepository } from "./repository";
import type {
  CreateExceptionRecordInput,
  CreateWeeklySlotRecordInput,
  ExceptionListResult,
  OpeningHoursAuditEventInput,
  RepositoryListInput,
  UpdateExceptionRecordInput,
  UpdateWeeklySlotRecordInput,
  WeeklySlotListResult,
} from "./types";

function weeklySlotFromRow(row: QueryResultRow): WeeklyOpeningHoursSlotData {
  return {
    weeklyOpeningHoursId: row.organization_weekly_opening_hours_id,
    tenantId: row.tenant_id,
    organizationId: row.organization_id,
    locationId: row.organization_location_id,
    weekday: Number(row.weekday),
    slotOrder: Number(row.slot_order),
    opensAtLocalTime: String(row.opens_at_local_time).slice(0, 5),
    closesAtLocalTime: String(row.closes_at_local_time).slice(0, 5),
    lifecycleStatus: row.lifecycle_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function localDateFromRow(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

function exceptionFromRow(row: QueryResultRow): OpeningHoursExceptionData {
  return {
    openingHoursExceptionId: row.organization_opening_hours_exception_id,
    tenantId: row.tenant_id,
    organizationId: row.organization_id,
    locationId: row.organization_location_id,
    exceptionType: row.exception_type,
    startsOnLocalDate: localDateFromRow(row.starts_on_local_date),
    endsOnLocalDate: localDateFromRow(row.ends_on_local_date),
    startsAtLocalTime: row.starts_at_local_time ? String(row.starts_at_local_time).slice(0, 5) : null,
    endsAtLocalTime: row.ends_at_local_time ? String(row.ends_at_local_time).slice(0, 5) : null,
    replacementSlots: row.replacement_slots ?? [],
    reason: row.reason,
    lifecycleStatus: row.lifecycle_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function sortColumn(orderBy: string, kind: "weekly" | "exception"): string {
  if (kind === "weekly" && orderBy === "weekday") {
    return "weekday, slot_order";
  }
  if (kind === "exception" && orderBy === "startsOnLocalDate") {
    return "starts_on_local_date";
  }
  return "updated_at";
}

async function countRows(
  pool: Pool,
  table: string,
  tenantId: string,
  organizationId: string,
  locationId: string,
): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
       FROM ${table}
      WHERE tenant_id = $1
        AND organization_id = $2
        AND organization_location_id = $3
        AND deleted_at IS NULL`,
    [tenantId, organizationId, locationId],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export function createPostgresOrganizationOpeningHoursRepository(pool: Pool): OrganizationOpeningHoursRepository {
  return {
    async createWeeklySlot(input) {
      const result = await pool.query(
        `INSERT INTO organization_location_weekly_opening_hours (
          organization_weekly_opening_hours_id,
          tenant_id,
          organization_id,
          organization_location_id,
          weekday,
          slot_order,
          opens_at_local_time,
          closes_at_local_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::time, $8::time)
        RETURNING *`,
        [
          input.weeklyOpeningHoursId,
          input.tenantId,
          input.organizationId,
          input.locationId,
          input.weekday,
          input.slotOrder,
          input.opensAtLocalTime,
          input.closesAtLocalTime,
        ],
      );
      return weeklySlotFromRow(result.rows[0]);
    },
    async findWeeklySlotById(tenantId, organizationId, locationId, weeklyOpeningHoursId) {
      const result = await pool.query(
        `SELECT *
           FROM organization_location_weekly_opening_hours
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND organization_weekly_opening_hours_id = $4
            AND deleted_at IS NULL`,
        [tenantId, organizationId, locationId, weeklyOpeningHoursId],
      );
      return result.rows[0] ? weeklySlotFromRow(result.rows[0]) : null;
    },
    async listWeeklySlots(input) {
      const offset = (input.page - 1) * input.pageSize;
      const column = sortColumn(input.orderBy, "weekly");
      const count = await countRows(
        pool,
        "organization_location_weekly_opening_hours",
        input.tenantId,
        input.organizationId,
        input.locationId,
      );
      const result = await pool.query(
        `SELECT *
           FROM organization_location_weekly_opening_hours
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND deleted_at IS NULL
          ORDER BY ${column} ${input.orderDirection === "asc" ? "ASC" : "DESC"}
          LIMIT $4 OFFSET $5`,
        [input.tenantId, input.organizationId, input.locationId, input.pageSize, offset],
      );
      return {
        items: result.rows.map(weeklySlotFromRow),
        totalSearchableRecords: count,
        totalMatchingRecords: count,
      } satisfies WeeklySlotListResult;
    },
    async listWeeklySlotsForWeekday(tenantId, organizationId, locationId, weekday) {
      const result = await pool.query(
        `SELECT *
           FROM organization_location_weekly_opening_hours
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND weekday = $4
            AND deleted_at IS NULL
          ORDER BY slot_order ASC`,
        [tenantId, organizationId, locationId, weekday],
      );
      return result.rows.map(weeklySlotFromRow);
    },
    async updateWeeklySlot(input) {
      const result = await pool.query(
        `UPDATE organization_location_weekly_opening_hours
            SET weekday = $5,
                slot_order = $6,
                opens_at_local_time = $7::time,
                closes_at_local_time = $8::time,
                updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND organization_weekly_opening_hours_id = $4
            AND deleted_at IS NULL
        RETURNING *`,
        [
          input.tenantId,
          input.organizationId,
          input.locationId,
          input.weeklyOpeningHoursId,
          input.weekday,
          input.slotOrder,
          input.opensAtLocalTime,
          input.closesAtLocalTime,
        ],
      );
      return result.rows[0] ? weeklySlotFromRow(result.rows[0]) : null;
    },
    async deleteWeeklySlot(tenantId, organizationId, locationId, weeklyOpeningHoursId) {
      const result = await pool.query(
        `UPDATE organization_location_weekly_opening_hours
            SET lifecycle_status = 'deleted',
                deleted_at = NOW(),
                updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND organization_weekly_opening_hours_id = $4
            AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, locationId, weeklyOpeningHoursId],
      );
      return result.rows[0] ? weeklySlotFromRow(result.rows[0]) : null;
    },
    async createException(input) {
      const result = await pool.query(
        `INSERT INTO organization_opening_hours_exception (
          organization_opening_hours_exception_id,
          tenant_id,
          organization_id,
          organization_location_id,
          exception_type,
          starts_on_local_date,
          ends_on_local_date,
          starts_at_local_time,
          ends_at_local_time,
          replacement_slots,
          reason
        ) VALUES ($1, $2, $3, $4, $5, $6::date, $7::date, $8::time, $9::time, $10::jsonb, $11)
        RETURNING *`,
        [
          input.openingHoursExceptionId,
          input.tenantId,
          input.organizationId,
          input.locationId,
          input.exceptionType,
          input.startsOnLocalDate,
          input.endsOnLocalDate,
          input.startsAtLocalTime,
          input.endsAtLocalTime,
          JSON.stringify(input.replacementSlots),
          input.reason,
        ],
      );
      return exceptionFromRow(result.rows[0]);
    },
    async findExceptionById(tenantId, organizationId, locationId, openingHoursExceptionId) {
      const result = await pool.query(
        `SELECT *
           FROM organization_opening_hours_exception
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND organization_opening_hours_exception_id = $4
            AND deleted_at IS NULL`,
        [tenantId, organizationId, locationId, openingHoursExceptionId],
      );
      return result.rows[0] ? exceptionFromRow(result.rows[0]) : null;
    },
    async listExceptions(input) {
      const offset = (input.page - 1) * input.pageSize;
      const column = sortColumn(input.orderBy, "exception");
      const count = await countRows(
        pool,
        "organization_opening_hours_exception",
        input.tenantId,
        input.organizationId,
        input.locationId,
      );
      const result = await pool.query(
        `SELECT *
           FROM organization_opening_hours_exception
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND deleted_at IS NULL
          ORDER BY ${column} ${input.orderDirection === "asc" ? "ASC" : "DESC"}
          LIMIT $4 OFFSET $5`,
        [input.tenantId, input.organizationId, input.locationId, input.pageSize, offset],
      );
      return {
        items: result.rows.map(exceptionFromRow),
        totalSearchableRecords: count,
        totalMatchingRecords: count,
      } satisfies ExceptionListResult;
    },
    async listExceptionsForDate(tenantId, organizationId, locationId, localDate) {
      const result = await pool.query(
        `SELECT *
           FROM organization_opening_hours_exception
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND starts_on_local_date <= $4::date
            AND COALESCE(ends_on_local_date, starts_on_local_date) >= $4::date
            AND deleted_at IS NULL
          ORDER BY starts_on_local_date ASC, updated_at DESC`,
        [tenantId, organizationId, locationId, localDate],
      );
      return result.rows.map(exceptionFromRow);
    },
    async updateException(input) {
      const result = await pool.query(
        `UPDATE organization_opening_hours_exception
            SET exception_type = $5,
                starts_on_local_date = $6::date,
                ends_on_local_date = $7::date,
                starts_at_local_time = $8::time,
                ends_at_local_time = $9::time,
                replacement_slots = $10::jsonb,
                reason = $11,
                updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND organization_opening_hours_exception_id = $4
            AND deleted_at IS NULL
        RETURNING *`,
        [
          input.tenantId,
          input.organizationId,
          input.locationId,
          input.openingHoursExceptionId,
          input.exceptionType,
          input.startsOnLocalDate,
          input.endsOnLocalDate,
          input.startsAtLocalTime,
          input.endsAtLocalTime,
          JSON.stringify(input.replacementSlots),
          input.reason,
        ],
      );
      return result.rows[0] ? exceptionFromRow(result.rows[0]) : null;
    },
    async deleteException(tenantId, organizationId, locationId, openingHoursExceptionId) {
      const result = await pool.query(
        `UPDATE organization_opening_hours_exception
            SET lifecycle_status = 'deleted',
                deleted_at = NOW(),
                updated_at = NOW()
          WHERE tenant_id = $1
            AND organization_id = $2
            AND organization_location_id = $3
            AND organization_opening_hours_exception_id = $4
            AND deleted_at IS NULL
        RETURNING *`,
        [tenantId, organizationId, locationId, openingHoursExceptionId],
      );
      return result.rows[0] ? exceptionFromRow(result.rows[0]) : null;
    },
    async recordAuditEvent(input: OpeningHoursAuditEventInput) {
      await pool.query(
        `INSERT INTO organization_opening_hours_audit_event (
          organization_opening_hours_audit_event_id,
          tenant_id,
          organization_id,
          organization_location_id,
          organization_weekly_opening_hours_id,
          organization_opening_hours_exception_id,
          actor_type,
          actor_id,
          event_type,
          event_outcome,
          event_details,
          occurred_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12)`,
        [
          input.eventId,
          input.tenantId,
          input.organizationId,
          input.locationId,
          input.weeklyOpeningHoursId ?? null,
          input.openingHoursExceptionId ?? null,
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
