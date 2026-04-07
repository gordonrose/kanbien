export type TenantCategory = "customer" | "demo" | "test";
export type TenantStatus = "draft" | "live" | "disabled" | "inactive";
export type CountValue = number | "10000+";

export interface Tenant {
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

export interface TenantListItem {
  tenantId: string;
  bizId: string;
  name: string;
  category: TenantCategory;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TenantData {
  tenantId: string;
  bizId: string;
  name: string;
  category: TenantCategory;
  status: TenantStatus;
  preDeleteStatus: TenantStatus | null;
  createdByRootAdminUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateTenantInput {
  bizId: string;
  name: string;
  category: TenantCategory;
  status?: TenantStatus;
  createdByRootAdminUserId: string;
}

export interface GetTenantInput {
  tenantId: string;
}

export interface TenantListFilters {
  bizIdPrefix?: string;
  namePrefix?: string;
  category?: TenantCategory;
  status?: TenantStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  deletedAtFrom?: string;
  deletedAtTo?: string;
}

export interface TenantListInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: TenantListFilters;
}

export interface TenantListResult {
  items: TenantListItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalSearchableRecords: CountValue;
  totalMatchingRecords: CountValue;
}

export interface UpdateTenantInput {
  tenantId: string;
  name?: string;
  category?: TenantCategory;
  status?: TenantStatus;
}

export interface SoftDeleteTenantInput {
  tenantId: string;
}

export interface ReactivateTenantInput {
  tenantId: string;
}

export interface RemoveTenantInput {
  tenantId: string;
  confirm: true;
  reason: string;
}
