import type {
  CreateTenantInput,
  GetTenantInput,
  ReactivateTenantInput,
  RemoveTenantInput,
  SoftDeleteTenantInput,
  Tenant,
  TenantListInput,
  TenantListResult,
  UpdateTenantInput,
} from "./types";
import type { TenantsRepository } from "../persistence/repository";
import { createTenant } from "./createTenant";
import { getDeletedTenant } from "./getDeletedTenant";
import { getTenant } from "./getTenant";
import { listDeletedTenants } from "./listDeletedTenants";
import { listTenants } from "./listTenants";
import { reactivateTenant } from "./reactivateTenant";
import { removeTenant } from "./removeTenant";
import { softDeleteTenant } from "./softDeleteTenant";
import { updateTenant } from "./updateTenant";

export interface TenantsService {
  createTenant(input: CreateTenantInput): Promise<Tenant>;
  getTenant(input: GetTenantInput): Promise<Tenant>;
  getDeletedTenant(input: GetTenantInput): Promise<Tenant>;
  listTenants(input: TenantListInput): Promise<TenantListResult>;
  listDeletedTenants(input: TenantListInput): Promise<TenantListResult>;
  updateTenant(input: UpdateTenantInput): Promise<Tenant>;
  softDeleteTenant(input: SoftDeleteTenantInput): Promise<Tenant>;
  reactivateTenant(input: ReactivateTenantInput): Promise<Tenant>;
  removeTenant(input: RemoveTenantInput): Promise<Tenant>;
}

export function createTenantsService(repository: TenantsRepository): TenantsService {
  return {
    createTenant: (input) => createTenant(repository, input),
    getTenant: (input) => getTenant(repository, input),
    getDeletedTenant: (input) => getDeletedTenant(repository, input),
    listTenants: (input) => listTenants(repository, input),
    listDeletedTenants: (input) => listDeletedTenants(repository, input),
    updateTenant: (input) => updateTenant(repository, input),
    softDeleteTenant: (input) => softDeleteTenant(repository, input),
    reactivateTenant: (input) => reactivateTenant(repository, input),
    removeTenant: (input) => removeTenant(repository, input),
  };
}
