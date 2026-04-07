import type { TenantsRepository } from "../persistence/repository";
import { toTenantListResult } from "./presenters";
import type { TenantListInput, TenantListResult } from "./types";

export async function listDeletedTenants(
  repository: TenantsRepository,
  input: TenantListInput,
): Promise<TenantListResult> {
  const result = await repository.listDeleted(input);
  return toTenantListResult(
    result.items,
    input.page,
    input.pageSize,
    result.totalSearchableRecords,
    result.totalMatchingRecords,
  );
}
