import type { Pool } from "pg";
import { createPostgresTenantsRepository } from "./persistence/postgresRepository";

export interface VisibleTenantSummary {
  tenantId: string;
  bizId: string;
  name: string;
  category: "customer" | "demo" | "test";
  status: "draft" | "live" | "disabled" | "inactive";
}

export interface VisibleTenantsReader {
  findVisibleTenantById(tenantId: string): Promise<VisibleTenantSummary | null>;
}

export function createVisibleTenantsReader(dbPool: Pool): VisibleTenantsReader {
  const repository = createPostgresTenantsRepository(dbPool);

  return {
    async findVisibleTenantById(tenantId) {
      const tenant = await repository.findVisibleById(tenantId);
      if (!tenant) {
        return null;
      }

      return {
        tenantId: tenant.tenantId,
        bizId: tenant.bizId,
        name: tenant.name,
        category: tenant.category,
        status: tenant.status,
      };
    },
  };
}
