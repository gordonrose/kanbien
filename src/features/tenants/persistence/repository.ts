import type { TenantData } from "../domain/types";
import type {
  CreateTenantRecordInput,
  TenantRepositoryListInput,
  TenantRepositoryListResult,
  UpdateTenantRecordInput,
} from "./types";

export interface TenantsRepository {
  create(input: CreateTenantRecordInput): Promise<TenantData>;
  findVisibleById(tenantId: string): Promise<TenantData | null>;
  findDeletedById(tenantId: string): Promise<TenantData | null>;
  findAnyById(tenantId: string): Promise<TenantData | null>;
  findNonDeletedByBizId(bizId: string): Promise<TenantData | null>;
  listVisible(input: TenantRepositoryListInput): Promise<TenantRepositoryListResult>;
  listDeleted(input: TenantRepositoryListInput): Promise<TenantRepositoryListResult>;
  update(input: UpdateTenantRecordInput): Promise<TenantData>;
  softDelete(tenantId: string): Promise<TenantData>;
  reactivate(tenantId: string): Promise<TenantData>;
  remove(tenantId: string): Promise<TenantData>;
}
