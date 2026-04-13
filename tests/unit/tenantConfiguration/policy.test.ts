import { describe, expect, it } from "vitest";
import {
  resolveAggregatePasswordPolicy,
  toEffectiveTenantAuthPolicy,
  validateTenantAuthPolicyInput,
} from "../../../src/features/tenantConfiguration/domain/policy";

describe("tenantConfiguration policy", () => {
  it("TC-TENANT-AUTH-POLICY-UNIT-001 returns system defaults and truthful provenance when no tenant override exists", () => {
    const result = toEffectiveTenantAuthPolicy(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      null,
    );

    expect(result.policySource).toBe("system_default");
    expect(result.hasTenantOverride).toBe(false);
    expect(result.passwordPolicy.minLength).toBeGreaterThanOrEqual(6);
    expect(result.hardFloors.minSymbols).toBe(1);
    expect(result.updatedAt).toBeNull();
  });

  it("TC-TENANT-AUTH-POLICY-UNIT-002 rejects impossible max-length combinations", () => {
    expect(() => {
      validateTenantAuthPolicyInput({
        minLength: 8,
        maxLength: 3,
      });
    }).toThrowError(/platform policy rules/i);

    try {
      validateTenantAuthPolicyInput({
        minLength: 8,
        maxLength: 3,
      });
      throw new Error("Expected max-length validation to fail");
    } catch (error) {
      expect(error).toMatchObject({
        code: "TENANT_AUTH_POLICY_INVALID",
        details: { field: "maxLength", reason: "below_minLength" },
      });
    }

    try {
      validateTenantAuthPolicyInput({
        maxLength: 3,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      });
      throw new Error("Expected aggregate minimum validation to fail");
    } catch (error) {
      expect(error).toMatchObject({
        code: "TENANT_AUTH_POLICY_INVALID",
        details: { field: "maxLength", reason: "aggregate_mins_exceed_max_length" },
      });
    }
  });

  it("TC-TENANT-AUTH-POLICY-UNIT-003 resolves the strictest compatible shared-principal aggregate password policy", () => {
    const aggregate = resolveAggregatePasswordPolicy([
      {
        minLength: 12,
        maxLength: 128,
        minUppercase: 1,
        maxUppercase: null,
        minLowercase: 1,
        maxLowercase: null,
        minNumbers: 1,
        maxNumbers: null,
        minSymbols: 1,
        maxSymbols: null,
      },
      {
        minLength: 10,
        maxLength: 64,
        minUppercase: 2,
        maxUppercase: null,
        minLowercase: 1,
        maxLowercase: null,
        minNumbers: 3,
        maxNumbers: null,
        minSymbols: 1,
        maxSymbols: null,
      },
    ]);

    expect(aggregate).toEqual({
      minLength: 12,
      maxLength: 64,
      minUppercase: 2,
      maxUppercase: null,
      minLowercase: 1,
      maxLowercase: null,
      minNumbers: 3,
      maxNumbers: null,
      minSymbols: 1,
      maxSymbols: null,
    });
  });
});
