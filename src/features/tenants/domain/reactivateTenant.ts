import {
  TenantBizIdAlreadyExistsError,
  TenantNotDeletedError,
  TenantNotFoundError,
} from "../contract/errors";
import type { TenantsRepository } from "../persistence/repository";
import { toTenant } from "./presenters";
import type { ReactivateTenantInput, Tenant } from "./types";

export async function reactivateTenant(
  repository: TenantsRepository,
  input: ReactivateTenantInput,
): Promise<Tenant> {
  const current = await repository.findAnyById(input.tenantId);
  if (!current) {
    throw new TenantNotFoundError(
      "We could not find a deleted tenant with that ID.",
      { field: "tenantId" },
    );
  }
  if (!current.deletedAt) {
    throw new TenantNotDeletedError();
  }
  const collision = await repository.findNonDeletedByBizId(current.bizId);
  if (collision && collision.tenantId !== input.tenantId) {
    throw new TenantBizIdAlreadyExistsError({
      field: "bizId",
      reason: "duplicate_active_biz_id_on_reactivation",
    });
  }
  return toTenant(await repository.reactivate(input.tenantId));
}
