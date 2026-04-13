import type { Pool, QueryResultRow } from "pg";
import type { TenantConfigurationRepository } from "./repository";
import type { TenantAuthPolicyRecord, UpsertTenantAuthPolicyInput } from "./types";
import type { TenantAuthPolicyOverrideData } from "../domain/types";

function toOverrideData(record: TenantAuthPolicyRecord): TenantAuthPolicyOverrideData {
  return {
    tenantId: record.tenant_id,
    minLength: record.min_length,
    maxLength: record.max_length,
    minUppercase: record.min_uppercase,
    maxUppercase: record.max_uppercase,
    minLowercase: record.min_lowercase,
    maxLowercase: record.max_lowercase,
    minNumbers: record.min_numbers,
    maxNumbers: record.max_numbers,
    minSymbols: record.min_symbols,
    maxSymbols: record.max_symbols,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function createPostgresTenantConfigurationRepository(dbPool: Pool): TenantConfigurationRepository {
  async function queryOne<T extends QueryResultRow>(sql: string, params: unknown[]): Promise<T | null> {
    const result = await dbPool.query<T>(sql, params);
    return result.rows[0] ?? null;
  }

  return {
    async findTenantAuthPolicyByTenantId(tenantId) {
      const record = await queryOne<TenantAuthPolicyRecord>(
        `SELECT * FROM tenant_auth_policy WHERE tenant_id = $1`,
        [tenantId],
      );
      return record ? toOverrideData(record) : null;
    },
    async upsertTenantAuthPolicy(input: UpsertTenantAuthPolicyInput) {
      const result = await dbPool.query<TenantAuthPolicyRecord>(
        `
          INSERT INTO tenant_auth_policy (
            tenant_id,
            min_length,
            max_length,
            min_uppercase,
            max_uppercase,
            min_lowercase,
            max_lowercase,
            min_numbers,
            max_numbers,
            min_symbols,
            max_symbols,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
          ON CONFLICT (tenant_id)
          DO UPDATE SET
            min_length = EXCLUDED.min_length,
            max_length = EXCLUDED.max_length,
            min_uppercase = EXCLUDED.min_uppercase,
            max_uppercase = EXCLUDED.max_uppercase,
            min_lowercase = EXCLUDED.min_lowercase,
            max_lowercase = EXCLUDED.max_lowercase,
            min_numbers = EXCLUDED.min_numbers,
            max_numbers = EXCLUDED.max_numbers,
            min_symbols = EXCLUDED.min_symbols,
            max_symbols = EXCLUDED.max_symbols,
            updated_at = NOW()
          RETURNING *
        `,
        [
          input.tenantId,
          input.minLength,
          input.maxLength,
          input.minUppercase,
          input.maxUppercase,
          input.minLowercase,
          input.maxLowercase,
          input.minNumbers,
          input.maxNumbers,
          input.minSymbols,
          input.maxSymbols,
        ],
      );
      return toOverrideData(result.rows[0]);
    },
  };
}
