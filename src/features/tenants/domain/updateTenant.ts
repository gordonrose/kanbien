import { TenantNotFoundError } from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { Tenant, UpdateTenantInput } from "./types";

export async function updateTenant(
  repository: TenantsRepository,
  input: UpdateTenantInput,
): Promise<Tenant> {
  const current = await repository.findVisibleById(input.tenantId);
  if (!current) {
    throw new TenantNotFoundError(
      "We could not find an active tenant with that ID.",
      { field: "tenantId" },
    );
  }
  return toTenant(await repository.update(input));
}
