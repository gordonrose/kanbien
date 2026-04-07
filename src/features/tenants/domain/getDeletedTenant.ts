import { TenantNotFoundError } from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { GetTenantInput, Tenant } from "./types";

export async function getDeletedTenant(
  repository: TenantsRepository,
  input: GetTenantInput,
): Promise<Tenant> {
  const record = await repository.findDeletedById(input.tenantId);
  if (!record) {
    throw new TenantNotFoundError(
      "We could not find a deleted tenant with that ID.",
      { field: "tenantId" },
    );
  }
  return toTenant(record);
}
