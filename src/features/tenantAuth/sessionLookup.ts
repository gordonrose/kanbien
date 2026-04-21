import type { Pool } from "pg";
import type { TenantAuthSessionLookupRepository } from "./persistence/repository";
import { createPostgresTenantAuthRepository } from "./persistence/postgresRepository";

export function createTenantAuthSessionLookupRepository(
  dbPool: Pool,
): TenantAuthSessionLookupRepository {
  return createPostgresTenantAuthRepository(dbPool);
}
