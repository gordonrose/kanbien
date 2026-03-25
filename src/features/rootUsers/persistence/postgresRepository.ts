import type { Pool } from "pg";
import type { RootUsersRepository } from "./repository";
import type {
  RootUserRecord,
  RootUserAuthStateRecord,
  RootUserRepositoryListInput,
  RootUserRepositoryListResult,
  UpdateRootUserRecordInput,
  CreateRootUserRecordInput,
} from "./types";
import type { RootUserAuthState, RootUserData } from "../domain/types";

const ORDER_BY_MAP: Record<string, string> = {
  email: "email",
  firstName: "first_name",
  lastName: "last_name",
  status: "status",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeOptionalName(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return value.trim().toLowerCase();
}

function buildCommonFilters(filters: RootUserRepositoryListInput["filters"], values: unknown[], alias = "ru"): string[] {
  const clauses: string[] = [];
  if (filters.emailPrefix) { values.push(`${filters.emailPrefix.toLowerCase()}%`); clauses.push(`COALESCE(${alias}.normalized_email, LOWER(${alias}.email)) LIKE $${values.length}`); }
  if (filters.firstNamePrefix) { values.push(`${filters.firstNamePrefix.toLowerCase()}%`); clauses.push(`COALESCE(${alias}.normalized_first_name, LOWER(COALESCE(${alias}.first_name, ''))) LIKE $${values.length}`); }
  if (filters.lastNamePrefix) { values.push(`${filters.lastNamePrefix.toLowerCase()}%`); clauses.push(`COALESCE(${alias}.normalized_last_name, LOWER(COALESCE(${alias}.last_name, ''))) LIKE $${values.length}`); }
  if (filters.createdAtFrom) { values.push(filters.createdAtFrom); clauses.push(`${alias}.created_at >= $${values.length}`); }
  if (filters.createdAtTo) { values.push(filters.createdAtTo); clauses.push(`${alias}.created_at <= $${values.length}`); }
  if (filters.updatedAtFrom) { values.push(filters.updatedAtFrom); clauses.push(`${alias}.updated_at >= $${values.length}`); }
  if (filters.updatedAtTo) { values.push(filters.updatedAtTo); clauses.push(`${alias}.updated_at <= $${values.length}`); }
  if (filters.deletedAtFrom) { values.push(filters.deletedAtFrom); clauses.push(`${alias}.deleted_at >= $${values.length}`); }
  if (filters.deletedAtTo) { values.push(filters.deletedAtTo); clauses.push(`${alias}.deleted_at <= $${values.length}`); }
  if (filters.status) { values.push(filters.status); clauses.push(`${alias}.status = $${values.length}`); }
  if (filters.excludeAnonymized === true) clauses.push(`${alias}.anonymized = false`);
  return clauses;
}

export function createPostgresRootUsersRepository(dbPool: Pool): RootUsersRepository {
  function toRootUserData(record: RootUserRecord): RootUserData {
    return {
      rootUserId: record.root_user_id,
      email: record.email,
      firstName: record.first_name ?? undefined,
      lastName: record.last_name ?? undefined,
      anonymized: record.anonymized,
      status: record.status,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      deletedAt: record.deleted_at,
    };
  }

  function toRootUserAuthState(record: RootUserAuthStateRecord): RootUserAuthState {
    return {
      rootUserId: record.root_user_id,
      email: record.email,
      status: record.status,
      anonymized: record.anonymized,
      deletedAt: record.deleted_at,
    };
  }

  async function queryOne(sql: string, params: unknown[]): Promise<RootUserData | null> {
    const result = await dbPool.query<RootUserRecord>(sql, params);
    return result.rows[0] ? toRootUserData(result.rows[0]) : null;
  }

  async function queryAuthState(
    sql: string,
    params: unknown[],
  ): Promise<RootUserAuthState | null> {
    const result = await dbPool.query<RootUserAuthStateRecord>(sql, params);
    return result.rows[0] ? toRootUserAuthState(result.rows[0]) : null;
  }

  async function runList(baseScope: string, input: RootUserRepositoryListInput): Promise<RootUserRepositoryListResult> {
    const orderBy = ORDER_BY_MAP[input.orderBy];
    const orderDirection = input.orderDirection === "asc" ? "ASC" : "DESC";
    const values: unknown[] = [];
    const scopeClauses = [baseScope];
    if (input.filters.excludeAnonymized === true && !baseScope.includes("anonymized = false")) scopeClauses.push("ru.anonymized = false");
    const searchableWhere = `WHERE ${scopeClauses.join(" AND ")}`;
    const filterClauses = buildCommonFilters(input.filters, values);
    const matchingWhere = filterClauses.length > 0 ? `${searchableWhere} AND ${filterClauses.join(" AND ")}` : searchableWhere;
    const totalsSql = `
      SELECT
        (SELECT COUNT(*) FROM root_users ru ${searchableWhere}) AS total_searchable_records,
        (SELECT COUNT(*) FROM root_users ru ${matchingWhere}) AS total_matching_records
    `;
    const totals = await dbPool.query(totalsSql, values);
    values.push(input.pageSize);
    values.push((input.page - 1) * input.pageSize);
    const dataSql = `
      SELECT ru.*
      FROM root_users ru
      ${matchingWhere}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;
    const data = await dbPool.query<RootUserRecord>(dataSql, values);
    return {
      items: data.rows.map(toRootUserData),
      totalSearchableRecords: Number(totals.rows[0].total_searchable_records),
      totalMatchingRecords: Number(totals.rows[0].total_matching_records),
    };
  }

  return {
    async create(input: CreateRootUserRecordInput) {
      const result = await dbPool.query<RootUserRecord>(`
        INSERT INTO root_users (
          root_user_id,
          email,
          normalized_email,
          first_name,
          normalized_first_name,
          last_name,
          normalized_last_name,
          anonymized,
          status,
          created_at,
          updated_at,
          deleted_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, false, 'active', NOW(), NOW(), NULL)
        RETURNING *
      `, [
        input.rootUserId,
        input.email,
        normalizeEmail(input.email),
        input.firstName ?? null,
        normalizeOptionalName(input.firstName),
        input.lastName ?? null,
        normalizeOptionalName(input.lastName),
      ]);
      return toRootUserData(result.rows[0]);
    },
    findAuthStateById(rootUserId) {
      return queryAuthState(
        `SELECT root_user_id, email, status, anonymized, deleted_at
         FROM root_users
         WHERE root_user_id = $1`,
        [rootUserId],
      );
    },
    findVisibleById(rootUserId) { return queryOne(`SELECT * FROM root_users WHERE root_user_id = $1 AND deleted_at IS NULL AND anonymized = false`, [rootUserId]); },
    findVisibleByEmail(email) { return queryOne(`SELECT * FROM root_users WHERE normalized_email = $1 AND deleted_at IS NULL AND anonymized = false`, [normalizeEmail(email)]); },
    findAnyById(rootUserId) { return queryOne(`SELECT * FROM root_users WHERE root_user_id = $1`, [rootUserId]); },
    findNonDeletedByEmail(email) { return queryOne(`SELECT * FROM root_users WHERE normalized_email = $1 AND deleted_at IS NULL`, [normalizeEmail(email)]); },
    listAll(input) { return runList(`ru.anonymized = false`, input); },
    listActive(input) { return runList(`ru.deleted_at IS NULL AND ru.anonymized = false AND ru.status = 'active'`, input); },
    listDeleted(input) { return runList(`ru.deleted_at IS NOT NULL`, input); },
    async update(input: UpdateRootUserRecordInput) {
      const assignments: string[] = [];
      const values: unknown[] = [];
      if (input.email !== undefined) {
        values.push(input.email);
        assignments.push(`email = $${values.length}`);
        values.push(normalizeEmail(input.email));
        assignments.push(`normalized_email = $${values.length}`);
      }
      if (input.firstName !== undefined) {
        values.push(input.firstName);
        assignments.push(`first_name = $${values.length}`);
        values.push(normalizeOptionalName(input.firstName));
        assignments.push(`normalized_first_name = $${values.length}`);
      }
      if (input.lastName !== undefined) {
        values.push(input.lastName);
        assignments.push(`last_name = $${values.length}`);
        values.push(normalizeOptionalName(input.lastName));
        assignments.push(`normalized_last_name = $${values.length}`);
      }
      if (input.status !== undefined) { values.push(input.status); assignments.push(`status = $${values.length}`); }
      assignments.push(`updated_at = NOW()`);
      values.push(input.rootUserId);
      const result = await dbPool.query<RootUserRecord>(`UPDATE root_users SET ${assignments.join(", ")} WHERE root_user_id = $${values.length} AND deleted_at IS NULL AND anonymized = false RETURNING *`, values);
      return toRootUserData(result.rows[0]);
    },
    async softDelete(rootUserId) {
      const result = await dbPool.query<RootUserRecord>(`UPDATE root_users SET status = 'inactive', deleted_at = NOW(), updated_at = NOW() WHERE root_user_id = $1 AND deleted_at IS NULL AND anonymized = false RETURNING *`, [rootUserId]);
      return toRootUserData(result.rows[0]);
    },
    async remove(rootUserId, anonymizedEmail, anonymizedFirstName, anonymizedLastName) {
      const result = await dbPool.query<RootUserRecord>(`
        UPDATE root_users
        SET
          email = $2,
          normalized_email = $3,
          first_name = $4,
          normalized_first_name = $5,
          last_name = $6,
          normalized_last_name = $7,
          anonymized = true,
          status = 'inactive',
          deleted_at = NOW(),
          updated_at = NOW()
        WHERE root_user_id = $1
        RETURNING *
      `, [
        rootUserId,
        anonymizedEmail,
        normalizeEmail(anonymizedEmail),
        anonymizedFirstName,
        normalizeOptionalName(anonymizedFirstName),
        anonymizedLastName,
        normalizeOptionalName(anonymizedLastName),
      ]);
      return toRootUserData(result.rows[0]);
    },
    async reactivate(rootUserId) {
      const result = await dbPool.query<RootUserRecord>(`UPDATE root_users SET status = 'active', deleted_at = NULL, updated_at = NOW() WHERE root_user_id = $1 AND deleted_at IS NOT NULL AND anonymized = false RETURNING *`, [rootUserId]);
      return toRootUserData(result.rows[0]);
    },
  };
}
