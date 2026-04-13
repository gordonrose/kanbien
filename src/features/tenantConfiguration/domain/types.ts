import type { EffectiveTenantAuthPolicy, EffectiveTenantPasswordPolicy } from "../contract/types";

export interface TenantAuthPolicyOverrideData {
  tenantId: string;
  minLength: number | null;
  maxLength: number | null;
  minUppercase: number | null;
  maxUppercase: number | null;
  minLowercase: number | null;
  maxLowercase: number | null;
  minNumbers: number | null;
  maxNumbers: number | null;
  minSymbols: number | null;
  maxSymbols: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAuthPolicyResolver {
  readEffectiveTenantAuthPolicy(tenantId: string): Promise<EffectiveTenantAuthPolicy | null>;
  resolveAggregatePasswordPolicy(tenantIds: string[]): Promise<EffectiveTenantPasswordPolicy>;
  assertPasswordMeetsPolicy(password: string, policy: EffectiveTenantPasswordPolicy): void;
}

export interface TenantConfigurationService {
  readTenantAuthPolicyAsRoot(input: { tenantId: string }): Promise<EffectiveTenantAuthPolicy>;
  readCurrentTenantAuthPolicyAsTenantAdmin(input: {
    tenantId: string | null;
  }): Promise<EffectiveTenantAuthPolicy>;
  updateTenantAuthPolicy(input: {
    tenantId: string;
    authPrincipalId?: string;
    rootUserId?: string;
    ipAddress?: string;
    userAgent?: string;
    minLength?: number | null;
    maxLength?: number | null;
    minUppercase?: number | null;
    maxUppercase?: number | null;
    minLowercase?: number | null;
    maxLowercase?: number | null;
    minNumbers?: number | null;
    maxNumbers?: number | null;
    minSymbols?: number | null;
    maxSymbols?: number | null;
  }): Promise<EffectiveTenantAuthPolicy>;
}
