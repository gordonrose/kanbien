import { TenantNotFoundError } from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { RemoveTenantInput, Tenant } from "./types";

export async function removeTenant(
  repository: TenantsRepository,
  input: RemoveTenantInput,
): Promise<Tenant> {
  const current = await repository.findAnyById(input.tenantId);
  if (!current) {
    throw new TenantNotFoundError();
  }
  return toTenant(await repository.remove(input.tenantId));
}
