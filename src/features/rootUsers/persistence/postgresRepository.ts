import type { Pool } from "pg";
import type { RootUsersRepository } from "./repository";
import type {
  CreateRootUserRecordInput,
  GetRootUserByEmailInput,
  GetRootUserByIdInput,
  ListPagination,
  PaginatedRootUserRecords,
  ReActivateRootUserRecordInput,
  RemoveRootUserRecordInput,
  RootUserListOrder,
  RootUserListWhere,
  RootUserRecord,
  SoftDeleteRootUserRecordInput,
  UpdateRootUserRecordInput,
} from "./types";

const TABLE_NAME = "root_users";

const ORDER_BY_COLUMN_MAP: Record<RootUserListOrder["orderBy"], string> = {
  email: "email",
  firstName: "first_name",
  lastName: "last_name",
  status: "status",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

const buildListWhere = (where: RootUserListWhere) => {
  const clauses: string[] = [];
  const values: unknown[] = [];

  const push = (sql: string, value: unknown) => {
    values.push(value);
    clauses.push(sql.replace("?", `$${values.length}`));
  };

  if (where.deletedOnly) {
    clauses.push(`deleted_at IS NOT NULL`);
  } else if (!where.includeDeleted) {
    clauses.push(`deleted_at IS NULL`);
  }

  if (where.excludeAnonymized) {
    clauses.push(`anonymized = FALSE`);
  }

  if (where.activeOnly) {
    clauses.push(`status = 'active'`);
    clauses.push(`deleted_at IS NULL`);
  }

  if (where.emailPrefix) push(`normalized_email LIKE ?`, `${where.emailPrefix}%`);
  if (where.firstNamePrefix)
    push(`normalized_first_name LIKE ?`, `${where.firstNamePrefix}%`);
  if (where.lastNamePrefix) push(`normalized_last_name LIKE ?`, `${where.lastNamePrefix}%`);
  if (where.createdAtFrom) push(`created_at >= ?::timestamptz`, where.createdAtFrom);
  if (where.createdAtTo) push(`created_at <= ?::timestamptz`, where.createdAtTo);
  if (where.updatedAtFrom) push(`updated_at >= ?::timestamptz`, where.updatedAtFrom);
  if (where.updatedAtTo) push(`updated_at <= ?::timestamptz`, where.updatedAtTo);
  if (where.deletedAtFrom) push(`deleted_at >= ?::timestamptz`, where.deletedAtFrom);
  if (where.deletedAtTo) push(`deleted_at <= ?::timestamptz`, where.deletedAtTo);
  if (where.status) push(`status = ?`, where.status);

  return {
    sql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
};

export const createPostgresRootUsersRepository = (
  dbPool: Pick<Pool, "query">,
): RootUsersRepository => ({
  async create(input: CreateRootUserRecordInput): Promise<RootUserRecord> {
    const result = await dbPool.query<RootUserRecord>(
      `
        INSERT INTO ${TABLE_NAME} (
          root_user_id,
          email,
          normalized_email,
          first_name,
          normalized_first_name,
          last_name,
          normalized_last_name,
          anonymized,
          status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,FALSE,$8)
        RETURNING *
      `,
      [
        input.rootUserId,
        input.email,
        input.normalizedEmail,
        input.firstName,
        input.normalizedFirstName,
        input.lastName,
        input.normalizedLastName,
        input.status,
      ],
    );

    return result.rows[0];
  },

  async findVisibleById(input: GetRootUserByIdInput): Promise<RootUserRecord | null> {
    const result = await dbPool.query<RootUserRecord>(
      `
        SELECT *
        FROM ${TABLE_NAME}
        WHERE root_user_id = $1
          AND deleted_at IS NULL
          AND anonymized = FALSE
        LIMIT 1
      `,
      [input.rootUserId],
    );

    return result.rows[0] ?? null;
  },

  async findVisibleByEmail(input: GetRootUserByEmailInput): Promise<RootUserRecord | null> {
    const result = await dbPool.query<RootUserRecord>(
      `
        SELECT *
        FROM ${TABLE_NAME}
        WHERE normalized_email = $1
          AND deleted_at IS NULL
          AND anonymized = FALSE
        LIMIT 1
      `,
      [input.normalizedEmail],
    );

    return result.rows[0] ?? null;
  },

  async findAnyById(input: GetRootUserByIdInput): Promise<RootUserRecord | null> {
    const result = await dbPool.query<RootUserRecord>(
      `SELECT * FROM ${TABLE_NAME} WHERE root_user_id = $1 LIMIT 1`,
      [input.rootUserId],
    );

    return result.rows[0] ?? null;
  },

  async list(
    where: RootUserListWhere,
    order: RootUserListOrder,
    pagination: ListPagination,
  ): Promise<PaginatedRootUserRecords> {
    const built = buildListWhere(where);
    const orderByColumn = ORDER_BY_COLUMN_MAP[order.orderBy];
    const direction = order.orderDirection === "asc" ? "ASC" : "DESC";

    const countResult = await dbPool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM ${TABLE_NAME} ${built.sql}`,
      built.values,
    );

    const dataValues = [...built.values, pagination.limit, pagination.offset];

    const result = await dbPool.query<RootUserRecord>(
      `
        SELECT *
        FROM ${TABLE_NAME}
        ${built.sql}
        ORDER BY ${orderByColumn} ${direction}, root_user_id ASC
        LIMIT $${dataValues.length - 1}
        OFFSET $${dataValues.length}
      `,
      dataValues,
    );

    return {
      items: result.rows,
      totalItems: Number(countResult.rows[0]?.count ?? 0),
    };
  },

  async updateVisible(input: UpdateRootUserRecordInput): Promise<RootUserRecord | null> {
    const assignments: string[] = [];
    const values: unknown[] = [];

    const set = (column: string, value: unknown) => {
      values.push(value);
      assignments.push(`${column} = $${values.length}`);
    };

    if (input.email !== undefined) {
      set("email", input.email);
      set("normalized_email", input.normalizedEmail);
    }

    if (input.firstName !== undefined) {
      set("first_name", input.firstName);
      set("normalized_first_name", input.normalizedFirstName);
    }

    if (input.lastName !== undefined) {
      set("last_name", input.lastName);
      set("normalized_last_name", input.normalizedLastName);
    }

    if (input.status !== undefined) {
      set("status", input.status);
    }

    set("updated_at", new Date());

    values.push(input.rootUserId);

    const result = await dbPool.query<RootUserRecord>(
      `
        UPDATE ${TABLE_NAME}
        SET ${assignments.join(", ")}
        WHERE root_user_id = $${values.length}
          AND deleted_at IS NULL
          AND anonymized = FALSE
        RETURNING *
      `,
      values,
    );

    return result.rows[0] ?? null;
  },

  async softDelete(input: SoftDeleteRootUserRecordInput): Promise<RootUserRecord | null> {
    const result = await dbPool.query<RootUserRecord>(
      `
        UPDATE ${TABLE_NAME}
        SET status = 'inactive',
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE root_user_id = $1
          AND deleted_at IS NULL
          AND anonymized = FALSE
        RETURNING *
      `,
      [input.rootUserId],
    );

    return result.rows[0] ?? null;
  },

  async remove(input: RemoveRootUserRecordInput): Promise<RootUserRecord | null> {
    const result = await dbPool.query<RootUserRecord>(
      `
        UPDATE ${TABLE_NAME}
        SET email = $2,
            normalized_email = $3,
            first_name = $4,
            normalized_first_name = $5,
            last_name = $6,
            normalized_last_name = $7,
            anonymized = TRUE,
            status = 'inactive',
            deleted_at = COALESCE(deleted_at, NOW()),
            updated_at = NOW()
        WHERE root_user_id = $1
        RETURNING *
      `,
      [
        input.rootUserId,
        input.anonymizedEmail,
        input.normalizedAnonymizedEmail,
        input.anonymizedFirstName,
        input.normalizedAnonymizedFirstName,
        input.anonymizedLastName,
        input.normalizedAnonymizedLastName,
      ],
    );

    return result.rows[0] ?? null;
  },

  async reactivate(
    input: ReActivateRootUserRecordInput,
  ): Promise<RootUserRecord | null> {
    const result = await dbPool.query<RootUserRecord>(
      `
        UPDATE ${TABLE_NAME}
        SET status = 'active',
            deleted_at = NULL,
            updated_at = NOW()
        WHERE root_user_id = $1
          AND deleted_at IS NOT NULL
          AND anonymized = FALSE
        RETURNING *
      `,
      [input.rootUserId],
    );

    return result.rows[0] ?? null;
  },

  async existsActiveByNormalizedEmail(
    normalizedEmail: string,
    excludeRootUserId?: string,
  ): Promise<boolean> {
    const values: unknown[] = [normalizedEmail];
    let sql = `
      SELECT 1
      FROM ${TABLE_NAME}
      WHERE normalized_email = $1
        AND deleted_at IS NULL
    `;

    if (excludeRootUserId) {
      values.push(excludeRootUserId);
      sql += ` AND root_user_id <> $2`;
    }

    sql += ` LIMIT 1`;

    const result = await dbPool.query(sql, values);
    return (result.rowCount ?? 0) > 0;
  },
});
