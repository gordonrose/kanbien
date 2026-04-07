export type TenantCategory = "customer" | "demo" | "test";
export type TenantStatus = "draft" | "live" | "disabled" | "inactive";
export type CountValue = number | "10000+";

export interface TenantResponse {
  tenantId: string;
  bizId: string;
  name: string;
  category: TenantCategory;
  status: TenantStatus;
  createdByRootAdminUserId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TenantListItemResponse {
  tenantId: string;
  bizId: string;
  name: string;
  category: TenantCategory;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedTenantsResponse {
  items: TenantListItemResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}
