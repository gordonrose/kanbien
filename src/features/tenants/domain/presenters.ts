import type {
  CountValue,
  Tenant,
  TenantData,
  TenantListItem,
  TenantListResult,
} from "./types";

function toCountValue(value: number): CountValue {
  return value > 10000 ? "10000+" : value;
}

export function toTenant(record: TenantData): Tenant {
  return {
    tenantId: record.tenantId,
    bizId: record.bizId,
    name: record.name,
    category: record.category,
    status: record.status,
    createdByRootAdminUserId: record.createdByRootAdminUserId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt ? record.deletedAt.toISOString() : null,
  };
}

export function toTenantListItem(record: TenantData): TenantListItem {
  return {
    tenantId: record.tenantId,
    bizId: record.bizId,
    name: record.name,
    category: record.category,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    deletedAt: record.deletedAt ? record.deletedAt.toISOString() : null,
  };
}

export function toTenantListResult(
  records: TenantData[],
  page: number,
  pageSize: number,
  totalSearchableRecords: number,
  totalMatchingRecords: number,
): TenantListResult {
  return {
    items: records.map(toTenantListItem),
    page,
    pageSize,
    totalPages: Math.ceil(Math.min(totalMatchingRecords, 10000) / pageSize),
    totalSearchableRecords: toCountValue(totalSearchableRecords),
    totalMatchingRecords: toCountValue(totalMatchingRecords),
  };
}
