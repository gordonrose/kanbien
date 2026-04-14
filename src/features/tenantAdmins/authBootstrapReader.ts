import type { Pool } from "pg";
import type { TenantAdminData } from "./domain/types";
import { createPostgresTenantAdminsRepository } from "./persistence/postgresRepository";
import type { TenantAdminsRepository } from "./persistence/repository";

export interface TenantAdminAuthBootstrapSubject {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  normalizedEmail: string;
  firstName: string | null;
  lastName: string | null;
}

export interface TenantAdminsAuthBootstrapReader {
  listVerifiedActiveByNormalizedEmail(normalizedEmail: string): Promise<TenantAdminAuthBootstrapSubject[]>;
  findVerifiedActiveById(tenantAdminId: string): Promise<TenantAdminAuthBootstrapSubject | null>;
}

function toBootstrapSubject(data: TenantAdminData): TenantAdminAuthBootstrapSubject {
  return {
    tenantAdminId: data.tenantAdminId,
    tenantId: data.tenantId,
    email: data.email,
    normalizedEmail: data.normalizedEmail,
    firstName: data.firstName,
    lastName: data.lastName,
  };
}

export function createTenantAdminsAuthBootstrapReader(
  dbPoolOrRepository: Pool | TenantAdminsRepository,
): TenantAdminsAuthBootstrapReader {
  const repository =
    "query" in dbPoolOrRepository
      ? createPostgresTenantAdminsRepository(dbPoolOrRepository)
      : dbPoolOrRepository;

  return {
    async listVerifiedActiveByNormalizedEmail(normalizedEmail) {
      const records = await repository.findVerifiedActiveByNormalizedEmail(normalizedEmail);
      return records.map(toBootstrapSubject);
    },
    async findVerifiedActiveById(tenantAdminId) {
      const record = await repository.findVerifiedActiveById(tenantAdminId);
      return record ? toBootstrapSubject(record) : null;
    },
  };
}
