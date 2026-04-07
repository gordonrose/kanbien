import { randomUUID } from "node:crypto";
import { TenantBizIdAlreadyExistsError } from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { CreateTenantInput, Tenant } from "./types";

export async function createTenant(
  repository: TenantsRepository,
  input: CreateTenantInput,
): Promise<Tenant> {
  const existing = await repository.findNonDeletedByBizId(input.bizId);
  if (existing) {
    throw new TenantBizIdAlreadyExistsError();
  }

  return toTenant(
    await repository.create({
      tenantId: randomUUID(),
      bizId: input.bizId,
      name: input.name,
      category: input.category,
      status: input.status ?? "draft",
      createdByRootAdminUserId: input.createdByRootAdminUserId,
    }),
  );
}
