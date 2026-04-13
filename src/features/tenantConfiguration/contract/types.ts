export interface EffectiveTenantPasswordPolicy {
  minLength: number;
  maxLength: number | null;
  minUppercase: number;
  maxUppercase: number | null;
  minLowercase: number;
  maxLowercase: number | null;
  minNumbers: number;
  maxNumbers: number | null;
  minSymbols: number;
  maxSymbols: number | null;
}

export interface EffectiveTenantAuthPolicy {
  tenantId: string;
  policySource: "system_default" | "tenant_override";
  hasTenantOverride: boolean;
  passwordPolicy: EffectiveTenantPasswordPolicy;
  hardFloors: {
    minLength: number;
    minUppercase: number;
    minLowercase: number;
    minNumbers: number;
    minSymbols: number;
  };
  updatedAt: string | null;
}
