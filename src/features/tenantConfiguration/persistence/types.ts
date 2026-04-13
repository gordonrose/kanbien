export interface TenantAuthPolicyRecord {
  tenant_id: string;
  min_length: number | null;
  max_length: number | null;
  min_uppercase: number | null;
  max_uppercase: number | null;
  min_lowercase: number | null;
  max_lowercase: number | null;
  min_numbers: number | null;
  max_numbers: number | null;
  min_symbols: number | null;
  max_symbols: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface UpsertTenantAuthPolicyInput {
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
}
