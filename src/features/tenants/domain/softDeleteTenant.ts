import {
  TenantAlreadyDeletedError,
  TenantNotFoundError,
} from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { SoftDeleteTenantInput, Tenant } from "./types";

export async function softDeleteTenant(
  repository: TenantsRepository,
  input: SoftDeleteTenantInput,
): Promise<Tenant> {
  const current = await repository.findAnyById(input.tenantId);
  if (!current) {
    throw new TenantNotFoundError(
      "We could not find an active tenant with that ID.",
      { field: "tenantId" },
    );
  }
  if (current.deletedAt) {
    throw new TenantAlreadyDeletedError();
  }
  return toTenant(await repository.softDelete(input.tenantId));
}
