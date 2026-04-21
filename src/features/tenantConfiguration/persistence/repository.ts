import type { UpsertTenantAuthPolicyInput } from "./types";
import type { TenantAuthPolicyOverrideData } from "../domain/types";

export interface TenantConfigurationRepository {
  findTenantAuthPolicyByTenantId(tenantId: string): Promise<TenantAuthPolicyOverrideData | null>;
  upsertTenantAuthPolicy(input: UpsertTenantAuthPolicyInput): Promise<TenantAuthPolicyOverrideData>;
}
