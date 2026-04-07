import type { TenantsRepository } from "../persistence/repository";
import { toTenantListResult } from "./presenters";
import type { TenantListInput, TenantListResult } from "./types";

export async function listTenants(
  repository: TenantsRepository,
  input: TenantListInput,
): Promise<TenantListResult> {
  const result = await repository.listVisible(input);
  return toTenantListResult(
    result.items,
    input.page,
    input.pageSize,
    result.totalSearchableRecords,
    result.totalMatchingRecords,
  );
}
