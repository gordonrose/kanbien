import type { TenantCategory, TenantStatus } from "../domain/types";

export interface TenantRecord {
  tenant_id: string;
  biz_id: string;
  name: string;
  category: TenantCategory;
  status: TenantStatus;
  pre_delete_status: TenantStatus | null;
  created_by_root_admin_user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateTenantRecordInput {
  tenantId: string;
  bizId: string;
  name: string;
  category: TenantCategory;
  status: TenantStatus;
  createdByRootAdminUserId: string;
}

export interface UpdateTenantRecordInput {
  tenantId: string;
  name?: string;
  category?: TenantCategory;
  status?: TenantStatus;
}

export interface TenantRepositoryListFilters {
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

export interface TenantRepositoryListInput {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters: TenantRepositoryListFilters;
}

export interface TenantRepositoryListResult {
  items: import("../domain/types").TenantData[];
  totalSearchableRecords: number;
  totalMatchingRecords: number;
}
