import { TenantNotFoundError } from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { GetTenantInput, Tenant } from "./types";

export async function getTenant(
  repository: TenantsRepository,
  input: GetTenantInput,
): Promise<Tenant> {
  const record = await repository.findVisibleById(input.tenantId);
  if (!record) {
    throw new TenantNotFoundError();
  }
  return toTenant(record);
}
