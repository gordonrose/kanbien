import type { Pool } from "pg";
import type { TenantAdminData, TenantAdminListInput, TenantAdminVerificationTokenData } from "../domain/types";
import type { TenantAdminsRepository } from "./repository";
import type {
  CreateTenantAdminRecordInput,
  CreateTenantAdminVerificationTokenRecordInput,
  TenantAdminRecord,
  TenantAdminVerificationTokenRecord,
  UpdateTenantAdminRecordInput,
} from "./types";

const ORDER_BY_MAP: Record<TenantAdminListInput["orderBy"], string> = {
  updatedAt: "updated_at",
  createdAt: "created_at",
  email: "normalized_email",
  firstName: "first_name",
  lastName: "last_name",
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function toTenantAdminData(record: TenantAdminRecord): TenantAdminData {
  return {
    tenantAdminId: record.tenant_admin_id,
    tenantId: record.tenant_id,
    email: record.email,
    normalizedEmail: record.normalized_email,
    firstName: record.first_name,
    lastName: record.last_name,
    emailVerificationStatus: record.email_verification_status,
    emailVerifiedAt: record.email_verified_at,
    lastVerificationEmailRequestedAt: record.last_verification_email_requested_at,
    createdByRootAdminUserId: record.created_by_root_admin_user_id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at,
  };
}

function toVerificationTokenData(
  record: TenantAdminVerificationTokenRecord,
): TenantAdminVerificationTokenData {
  return {
    tenantAdminVerificationTokenId: record.tenant_admin_verification_token_id,
    tenantAdminId: record.tenant_admin_id,
    tokenId: record.token_id,
    purpose: record.purpose,
    secretHash: record.secret_hash,
    expiresAt: record.expires_at,
    usedAt: record.used_at,
    invalidatedAt: record.invalidated_at,
    outboundEmailId: record.outbound_email_id,
    requestedByActorType: record.requested_by_actor_type,
    requestedByActorId: record.requested_by_actor_id,
    createdAt: record.created_at,
  };
}

function buildListFilters(
  input: TenantAdminListInput,
  values: unknown[],
  alias = "ta",
): string[] {
  const clauses: string[] = [`${alias}.tenant_id = $1`, `${alias}.deleted_at IS NULL`];
  if (input.filters.emailPrefix) {
    values.push(`${input.filters.emailPrefix.toLowerCase()}%`);
    clauses.push(`${alias}.normalized_email LIKE $${values.length}`);
  }
  if (input.filters.firstNamePrefix) {
    values.push(`${input.filters.firstNamePrefix.toLowerCase()}%`);
    clauses.push(`LOWER(COALESCE(${alias}.first_name, '')) LIKE $${values.length}`);
  }
  if (input.filters.lastNamePrefix) {
    values.push(`${input.filters.lastNamePrefix.toLowerCase()}%`);
    clauses.push(`LOWER(COALESCE(${alias}.last_name, '')) LIKE $${values.length}`);
  }
  if (input.filters.emailVerificationStatus) {
    values.push(input.filters.emailVerificationStatus);
    clauses.push(`${alias}.email_verification_status = $${values.length}`);
  }
  if (input.filters.createdAtFrom) {
    values.push(input.filters.createdAtFrom);
    clauses.push(`${alias}.created_at >= $${values.length}`);
  }
  if (input.filters.createdAtTo) {
    values.push(input.filters.createdAtTo);
    clauses.push(`${alias}.created_at <= $${values.length}`);
  }
  if (input.filters.updatedAtFrom) {
    values.push(input.filters.updatedAtFrom);
    clauses.push(`${alias}.updated_at >= $${values.length}`);
  }
  if (input.filters.updatedAtTo) {
    values.push(input.filters.updatedAtTo);
    clauses.push(`${alias}.updated_at <= $${values.length}`);
  }
  return clauses;
}

export function createPostgresTenantAdminsRepository(dbPool: Pool): TenantAdminsRepository {
  async function queryOne(sql: string, params: unknown[]): Promise<TenantAdminData | null> {
    const result = await dbPool.query<TenantAdminRecord>(sql, params);
    return result.rows[0] ? toTenantAdminData(result.rows[0]) : null;
  }

  return {
    async create(input: CreateTenantAdminRecordInput) {
      const result = await dbPool.query<TenantAdminRecord>(
        `
          INSERT INTO tenant_admin (
            tenant_admin_id,
            tenant_id,
            email,
            normalized_email,
            first_name,
            last_name,
            email_verification_status,
            email_verified_at,
            last_verification_email_requested_at,
            created_by_root_admin_user_id,
            created_at,
            updated_at,
            deleted_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, 'pending', NULL, NULL, $7, NOW(), NOW(), NULL)
          RETURNING *
        `,
        [
          input.tenantAdminId,
          input.tenantId,
          normalizeEmail(input.email),
          normalizeEmail(input.email),
          input.firstName,
          input.lastName,
          input.createdByRootAdminUserId,
        ],
      );
      return toTenantAdminData(result.rows[0]);
    },
    findVisibleById(tenantId, tenantAdminId) {
      return queryOne(
        `SELECT * FROM tenant_admin WHERE tenant_id = $1 AND tenant_admin_id = $2 AND deleted_at IS NULL`,
        [tenantId, tenantAdminId],
      );
    },
    findDeletedById(tenantId, tenantAdminId) {
      return queryOne(
        `SELECT * FROM tenant_admin WHERE tenant_id = $1 AND tenant_admin_id = $2 AND deleted_at IS NOT NULL`,
        [tenantId, tenantAdminId],
      );
    },
    findAnyById(tenantAdminId) {
      return queryOne(`SELECT * FROM tenant_admin WHERE tenant_admin_id = $1`, [tenantAdminId]);
    },
    findVerifiedActiveById(tenantAdminId) {
      return queryOne(
        `
          SELECT *
          FROM tenant_admin
          WHERE tenant_admin_id = $1
            AND deleted_at IS NULL
            AND email_verification_status = 'verified'
        `,
        [tenantAdminId],
      );
    },
    findActiveByNormalizedEmail(tenantId, normalizedEmail) {
      return queryOne(
        `SELECT * FROM tenant_admin WHERE tenant_id = $1 AND normalized_email = $2 AND deleted_at IS NULL`,
        [tenantId, normalizeEmail(normalizedEmail)],
      );
    },
    async findVerifiedActiveByNormalizedEmail(normalizedEmail) {
      const result = await dbPool.query<TenantAdminRecord>(
        `
          SELECT *
          FROM tenant_admin
          WHERE normalized_email = $1
            AND deleted_at IS NULL
            AND email_verification_status = 'verified'
          ORDER BY created_at ASC, tenant_admin_id ASC
        `,
        [normalizeEmail(normalizedEmail)],
      );
      return result.rows.map(toTenantAdminData);
    },
    async listVisible(input) {
      const values: unknown[] = [input.tenantId];
      const where = buildListFilters(input, values);
      const totals = await dbPool.query(
        `
          SELECT
            (SELECT COUNT(*)::int FROM tenant_admin ta WHERE ta.tenant_id = $1 AND ta.deleted_at IS NULL) AS total_searchable_records,
            (SELECT COUNT(*)::int FROM tenant_admin ta WHERE ${where.join(" AND ")}) AS total_matching_records
        `,
        values,
      );
      values.push(input.pageSize);
      values.push((input.page - 1) * input.pageSize);
      const result = await dbPool.query<TenantAdminRecord>(
        `
          SELECT *
          FROM tenant_admin ta
          WHERE ${where.join(" AND ")}
          ORDER BY ${ORDER_BY_MAP[input.orderBy]} ${input.orderDirection === "asc" ? "ASC" : "DESC"}, tenant_admin_id ${
            input.orderDirection === "asc" ? "ASC" : "DESC"
          }
          LIMIT $${values.length - 1}
          OFFSET $${values.length}
        `,
        values,
      );
      return {
        items: result.rows.map(toTenantAdminData),
        totalSearchableRecords: Number(totals.rows[0].total_searchable_records),
        totalMatchingRecords: Number(totals.rows[0].total_matching_records),
      };
    },
    async update(input: UpdateTenantAdminRecordInput) {
      const values: unknown[] = [];
      const assignments: string[] = [];

      if (input.email !== undefined) {
        values.push(normalizeEmail(input.email));
        assignments.push(`email = $${values.length}`);
        values.push(normalizeEmail(input.email));
        assignments.push(`normalized_email = $${values.length}`);
      }
      if (input.firstName !== undefined) {
        values.push(input.firstName);
        assignments.push(`first_name = $${values.length}`);
      }
      if (input.lastName !== undefined) {
        values.push(input.lastName);
        assignments.push(`last_name = $${values.length}`);
      }
      if (input.resetVerification) {
        assignments.push(`email_verification_status = 'pending'`);
        assignments.push(`email_verified_at = NULL`);
        assignments.push(`last_verification_email_requested_at = NULL`);
      }
      assignments.push(`updated_at = NOW()`);
      values.push(input.tenantId, input.tenantAdminId);
      const result = await dbPool.query<TenantAdminRecord>(
        `
          UPDATE tenant_admin
          SET ${assignments.join(", ")}
          WHERE tenant_id = $${values.length - 1}
            AND tenant_admin_id = $${values.length}
            AND deleted_at IS NULL
          RETURNING *
        `,
        values,
      );
      return toTenantAdminData(result.rows[0]);
    },
    async softDelete(tenantId, tenantAdminId) {
      const result = await dbPool.query<TenantAdminRecord>(
        `
          UPDATE tenant_admin
          SET
            email_verification_status = 'pending',
            email_verified_at = NULL,
            deleted_at = NOW(),
            updated_at = NOW()
          WHERE tenant_id = $1
            AND tenant_admin_id = $2
            AND deleted_at IS NULL
          RETURNING *
        `,
        [tenantId, tenantAdminId],
      );
      return toTenantAdminData(result.rows[0]);
    },
    async reactivate(tenantId, tenantAdminId) {
      const result = await dbPool.query<TenantAdminRecord>(
        `
          UPDATE tenant_admin
          SET
            email_verification_status = 'pending',
            email_verified_at = NULL,
            last_verification_email_requested_at = NULL,
            deleted_at = NULL,
            updated_at = NOW()
          WHERE tenant_id = $1
            AND tenant_admin_id = $2
            AND deleted_at IS NOT NULL
          RETURNING *
        `,
        [tenantId, tenantAdminId],
      );
      return toTenantAdminData(result.rows[0]);
    },
    async createVerificationToken(input: CreateTenantAdminVerificationTokenRecordInput) {
      const result = await dbPool.query<TenantAdminVerificationTokenRecord>(
        `
          INSERT INTO tenant_admin_verification_token (
            tenant_admin_verification_token_id,
            tenant_admin_id,
            token_id,
            purpose,
            secret_hash,
            expires_at,
            used_at,
            invalidated_at,
            outbound_email_id,
            requested_by_actor_type,
            requested_by_actor_id,
            created_at
          )
          VALUES ($1, $2, $3, 'email_verification', $4, $5, NULL, NULL, NULL, $6, $7, NOW())
          RETURNING *
        `,
        [
          input.tenantAdminVerificationTokenId,
          input.tenantAdminId,
          input.tokenId,
          input.secretHash,
          input.expiresAt,
          input.requestedByActorType,
          input.requestedByActorId,
        ],
      );
      return toVerificationTokenData(result.rows[0]);
    },
    async findVerificationTokenByTokenId(tokenId) {
      const result = await dbPool.query<TenantAdminVerificationTokenRecord>(
        `SELECT * FROM tenant_admin_verification_token WHERE token_id = $1`,
        [tokenId],
      );
      return result.rows[0] ? toVerificationTokenData(result.rows[0]) : null;
    },
    async findLatestActiveVerificationTokenByTenantAdminId(tenantAdminId) {
      const result = await dbPool.query<TenantAdminVerificationTokenRecord>(
        `
          SELECT *
          FROM tenant_admin_verification_token
          WHERE tenant_admin_id = $1
            AND invalidated_at IS NULL
            AND used_at IS NULL
          ORDER BY created_at DESC
          LIMIT 1
        `,
        [tenantAdminId],
      );
      return result.rows[0] ? toVerificationTokenData(result.rows[0]) : null;
    },
    async invalidateActiveVerificationTokens(tenantAdminId) {
      await dbPool.query(
        `
          UPDATE tenant_admin_verification_token
          SET invalidated_at = NOW()
          WHERE tenant_admin_id = $1
            AND invalidated_at IS NULL
            AND used_at IS NULL
        `,
        [tenantAdminId],
      );
    },
    async attachOutboundEmailToVerificationToken(tokenId, outboundEmailId) {
      await dbPool.query(
        `
          UPDATE tenant_admin_verification_token
          SET outbound_email_id = $2
          WHERE token_id = $1
        `,
        [tokenId, outboundEmailId],
      );
    },
    async markVerificationEmailRequested(tenantAdminId, requestedAt) {
      const result = await dbPool.query<TenantAdminRecord>(
        `
          UPDATE tenant_admin
          SET
            last_verification_email_requested_at = $2,
            updated_at = NOW()
          WHERE tenant_admin_id = $1
          RETURNING *
        `,
        [tenantAdminId, requestedAt],
      );
      return toTenantAdminData(result.rows[0]);
    },
    async markVerificationTokenUsed(tokenId) {
      await dbPool.query(
        `
          UPDATE tenant_admin_verification_token
          SET used_at = NOW()
          WHERE token_id = $1
            AND used_at IS NULL
        `,
        [tokenId],
      );
    },
    async markVerified(tenantAdminId) {
      const result = await dbPool.query<TenantAdminRecord>(
        `
          UPDATE tenant_admin
          SET
            email_verification_status = 'verified',
            email_verified_at = NOW(),
            updated_at = NOW()
          WHERE tenant_admin_id = $1
          RETURNING *
        `,
        [tenantAdminId],
      );
      return toTenantAdminData(result.rows[0]);
    },
  };
}
