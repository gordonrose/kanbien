import { env } from "../../../config/env";
import { TenantAuthPolicyValidationError } from "../contract/errors";
import type {
  EffectiveTenantAuthPolicy,
  EffectiveTenantPasswordPolicy,
  EffectiveTenantSessionPolicy,
} from "../contract/types";
import type { TenantAuthPolicyOverrideData } from "./types";

export const HARD_PASSWORD_POLICY_FLOORS = {
  minLength: 6,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
} as const;

export const PASSWORD_POLICY_HARD_MAX = 128;
export const SESSION_TTL_SECONDS_HARD_FLOOR = 60 * 5;
export const SESSION_TTL_SECONDS_HARD_CEILING = 60 * 60 * 24 * 30;

export const SYSTEM_DEFAULT_PASSWORD_POLICY: EffectiveTenantPasswordPolicy = {
  minLength: env.tenantAuth.passwordMinLength,
  maxLength: null,
  minUppercase: 1,
  maxUppercase: null,
  minLowercase: 1,
  maxLowercase: null,
  minNumbers: 1,
  maxNumbers: null,
  minSymbols: 1,
  maxSymbols: null,
};

export const SYSTEM_DEFAULT_SESSION_POLICY: EffectiveTenantSessionPolicy = {
  sessionTtlSeconds: env.tenantAuth.sessionTtlSeconds,
};

type PolicyFields = Omit<EffectiveTenantPasswordPolicy, never>;
type TenantAuthPolicyInput = {
  [K in keyof EffectiveTenantPasswordPolicy]?: EffectiveTenantPasswordPolicy[K] | null;
} & {
  sessionTtlSeconds?: number | null;
};

function assertNonNegativeOrNull(name: keyof PolicyFields, value: number | null | undefined) {
  if (value !== undefined && value !== null && value < 0) {
    throw new TenantAuthPolicyValidationError({ field: String(name), reason: "must_be_non_negative" });
  }
}

function assertMinFloor(name: keyof PolicyFields, value: number | null | undefined, floor: number) {
  if (value !== undefined && value !== null && value < floor) {
    throw new TenantAuthPolicyValidationError({ field: String(name), reason: "below_platform_floor" });
  }
}

function assertMaxCap(name: keyof PolicyFields, value: number | null | undefined) {
  if (value !== undefined && value !== null && value > PASSWORD_POLICY_HARD_MAX) {
    throw new TenantAuthPolicyValidationError({ field: String(name), reason: "above_platform_ceiling" });
  }
}

function assertMinMaxPair(
  minField: keyof PolicyFields,
  minValue: number | null | undefined,
  maxField: keyof PolicyFields,
  maxValue: number | null | undefined,
) {
  if (minValue !== undefined && minValue !== null && maxValue !== undefined && maxValue !== null && maxValue < minValue) {
    throw new TenantAuthPolicyValidationError({ field: String(maxField), reason: `below_${String(minField)}` });
  }
}

export function validateTenantAuthPolicyInput(input: TenantAuthPolicyInput): void {
  assertNonNegativeOrNull("minLength", input.minLength);
  assertNonNegativeOrNull("maxLength", input.maxLength);
  assertNonNegativeOrNull("minUppercase", input.minUppercase);
  assertNonNegativeOrNull("maxUppercase", input.maxUppercase);
  assertNonNegativeOrNull("minLowercase", input.minLowercase);
  assertNonNegativeOrNull("maxLowercase", input.maxLowercase);
  assertNonNegativeOrNull("minNumbers", input.minNumbers);
  assertNonNegativeOrNull("maxNumbers", input.maxNumbers);
  assertNonNegativeOrNull("minSymbols", input.minSymbols);
  assertNonNegativeOrNull("maxSymbols", input.maxSymbols);

  assertMinFloor("minLength", input.minLength, HARD_PASSWORD_POLICY_FLOORS.minLength);
  assertMinFloor("minUppercase", input.minUppercase, HARD_PASSWORD_POLICY_FLOORS.minUppercase);
  assertMinFloor("minLowercase", input.minLowercase, HARD_PASSWORD_POLICY_FLOORS.minLowercase);
  assertMinFloor("minNumbers", input.minNumbers, HARD_PASSWORD_POLICY_FLOORS.minNumbers);
  assertMinFloor("minSymbols", input.minSymbols, HARD_PASSWORD_POLICY_FLOORS.minSymbols);

  assertMaxCap("minLength", input.minLength);
  assertMaxCap("maxLength", input.maxLength);
  assertMaxCap("minUppercase", input.minUppercase);
  assertMaxCap("maxUppercase", input.maxUppercase);
  assertMaxCap("minLowercase", input.minLowercase);
  assertMaxCap("maxLowercase", input.maxLowercase);
  assertMaxCap("minNumbers", input.minNumbers);
  assertMaxCap("maxNumbers", input.maxNumbers);
  assertMaxCap("minSymbols", input.minSymbols);
  assertMaxCap("maxSymbols", input.maxSymbols);

  assertMinMaxPair("minLength", input.minLength, "maxLength", input.maxLength);
  assertMinMaxPair("minUppercase", input.minUppercase, "maxUppercase", input.maxUppercase);
  assertMinMaxPair("minLowercase", input.minLowercase, "maxLowercase", input.maxLowercase);
  assertMinMaxPair("minNumbers", input.minNumbers, "maxNumbers", input.maxNumbers);
  assertMinMaxPair("minSymbols", input.minSymbols, "maxSymbols", input.maxSymbols);

  if (input.sessionTtlSeconds !== undefined && input.sessionTtlSeconds !== null) {
    if (input.sessionTtlSeconds < SESSION_TTL_SECONDS_HARD_FLOOR) {
      throw new TenantAuthPolicyValidationError({
        field: "sessionTtlSeconds",
        reason: "below_platform_floor",
      });
    }
    if (input.sessionTtlSeconds > SESSION_TTL_SECONDS_HARD_CEILING) {
      throw new TenantAuthPolicyValidationError({
        field: "sessionTtlSeconds",
        reason: "above_platform_ceiling",
      });
    }
  }

  const effective = {
    ...SYSTEM_DEFAULT_PASSWORD_POLICY,
    ...Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ),
  } as EffectiveTenantPasswordPolicy;

  if (
    effective.maxLength !== null &&
    effective.minUppercase +
      effective.minLowercase +
      effective.minNumbers +
      effective.minSymbols >
      effective.maxLength
  ) {
    throw new TenantAuthPolicyValidationError({
      field: "maxLength",
      reason: "aggregate_mins_exceed_max_length",
    });
  }
}

export function toEffectiveTenantAuthPolicy(
  tenantId: string,
  override: TenantAuthPolicyOverrideData | null,
): EffectiveTenantAuthPolicy {
  const passwordPolicy: EffectiveTenantPasswordPolicy = {
    minLength: override?.minLength ?? SYSTEM_DEFAULT_PASSWORD_POLICY.minLength,
    maxLength: override?.maxLength ?? SYSTEM_DEFAULT_PASSWORD_POLICY.maxLength,
    minUppercase: override?.minUppercase ?? SYSTEM_DEFAULT_PASSWORD_POLICY.minUppercase,
    maxUppercase: override?.maxUppercase ?? SYSTEM_DEFAULT_PASSWORD_POLICY.maxUppercase,
    minLowercase: override?.minLowercase ?? SYSTEM_DEFAULT_PASSWORD_POLICY.minLowercase,
    maxLowercase: override?.maxLowercase ?? SYSTEM_DEFAULT_PASSWORD_POLICY.maxLowercase,
    minNumbers: override?.minNumbers ?? SYSTEM_DEFAULT_PASSWORD_POLICY.minNumbers,
    maxNumbers: override?.maxNumbers ?? SYSTEM_DEFAULT_PASSWORD_POLICY.maxNumbers,
    minSymbols: override?.minSymbols ?? SYSTEM_DEFAULT_PASSWORD_POLICY.minSymbols,
    maxSymbols: override?.maxSymbols ?? SYSTEM_DEFAULT_PASSWORD_POLICY.maxSymbols,
  };
  const sessionPolicy: EffectiveTenantSessionPolicy = {
    sessionTtlSeconds:
      override?.sessionTtlSeconds ?? SYSTEM_DEFAULT_SESSION_POLICY.sessionTtlSeconds,
  };

  return {
    tenantId,
    policySource: override ? "tenant_override" : "system_default",
    hasTenantOverride: Boolean(override),
    passwordPolicy,
    sessionPolicy,
    hardFloors: { ...HARD_PASSWORD_POLICY_FLOORS },
    hardLimits: {
      minSessionTtlSeconds: SESSION_TTL_SECONDS_HARD_FLOOR,
      maxSessionTtlSeconds: SESSION_TTL_SECONDS_HARD_CEILING,
    },
    updatedAt: override ? override.updatedAt.toISOString() : null,
  };
}

export function resolveAggregatePasswordPolicy(
  policies: EffectiveTenantPasswordPolicy[],
): EffectiveTenantPasswordPolicy {
  if (policies.length === 0) {
    return { ...SYSTEM_DEFAULT_PASSWORD_POLICY };
  }

  const maxOf = (values: number[]) => values.reduce((current, value) => Math.max(current, value), 0);
  const minNullable = (values: Array<number | null>) => {
    const present = values.filter((value): value is number => value !== null);
    return present.length === 0 ? null : present.reduce((current, value) => Math.min(current, value));
  };

  return {
    minLength: maxOf(policies.map((policy) => policy.minLength)),
    maxLength: minNullable(policies.map((policy) => policy.maxLength)),
    minUppercase: maxOf(policies.map((policy) => policy.minUppercase)),
    maxUppercase: minNullable(policies.map((policy) => policy.maxUppercase)),
    minLowercase: maxOf(policies.map((policy) => policy.minLowercase)),
    maxLowercase: minNullable(policies.map((policy) => policy.maxLowercase)),
    minNumbers: maxOf(policies.map((policy) => policy.minNumbers)),
    maxNumbers: minNullable(policies.map((policy) => policy.maxNumbers)),
    minSymbols: maxOf(policies.map((policy) => policy.minSymbols)),
    maxSymbols: minNullable(policies.map((policy) => policy.maxSymbols)),
  };
}

export function resolveAggregateSessionTtlSeconds(
  policies: EffectiveTenantSessionPolicy[],
): number {
  if (policies.length === 0) {
    return SYSTEM_DEFAULT_SESSION_POLICY.sessionTtlSeconds;
  }

  return policies.reduce(
    (current, policy) => Math.min(current, policy.sessionTtlSeconds),
    Number.POSITIVE_INFINITY,
  );
}

export function countPasswordClasses(password: string) {
  let uppercase = 0;
  let lowercase = 0;
  let numbers = 0;
  let symbols = 0;

  for (const character of password) {
    if (/[A-Z]/.test(character)) {
      uppercase += 1;
    } else if (/[a-z]/.test(character)) {
      lowercase += 1;
    } else if (/[0-9]/.test(character)) {
      numbers += 1;
    } else {
      symbols += 1;
    }
  }

  return { uppercase, lowercase, numbers, symbols, length: password.length };
}
