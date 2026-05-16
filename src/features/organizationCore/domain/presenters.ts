import type {
  CountValue,
  Organization,
  OrganizationData,
  OrganizationListResult,
} from "./types";
import type { OrganizationRepositoryListResult } from "../persistence/types";

function toIso(value: Date): string {
  return value.toISOString();
}

function toNullableIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function capCount(value: number): CountValue {
  return value > 10000 ? "10000+" : value;
}

export function toOrganization(data: OrganizationData): Organization {
  return {
    organizationId: data.organizationId,
    tenantId: data.tenantId,
    parentOrganizationId: data.parentOrganizationId,
    name: data.name,
    organizationTypeReferenceValueId: data.organizationTypeReferenceValueId,
    lifecycleStatus: data.lifecycleStatus,
    archivedAt: toNullableIso(data.archivedAt),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    deletedAt: toNullableIso(data.deletedAt),
  };
}

export function toOrganizationListResult(
  input: { page: number; pageSize: number },
  result: OrganizationRepositoryListResult,
): OrganizationListResult {
  const totalMatchingRecords = capCount(result.totalMatchingRecords);
  const totalPages =
    typeof totalMatchingRecords === "number"
      ? Math.max(1, Math.ceil(totalMatchingRecords / input.pageSize))
      : Math.ceil(10000 / input.pageSize);

  return {
    items: result.items.map(toOrganization),
    page: input.page,
    pageSize: input.pageSize,
    totalPages,
    totalSearchableRecords: capCount(result.totalSearchableRecords),
    totalMatchingRecords,
  };
}
