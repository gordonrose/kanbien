import { randomUUID } from "node:crypto";
import { TenantAuthPolicyCurrentTenantRequiredError, TenantAuthPolicyNotFoundError } from "../contract/errors";
import {
  toEffectiveTenantAuthPolicy,
  resolveAggregatePasswordPolicy,
  resolveAggregateSessionTtlSeconds,
  validateTenantAuthPolicyInput,
  countPasswordClasses,
} from "./policy";
import type { TenantConfigurationService, TenantAuthPolicyResolver } from "./types";
import type { TenantConfigurationRepository } from "../persistence/repository";
import type { VisibleTenantsReader } from "../../tenants";
import type { PlatformSecurityRepository } from "../../../lib/security/repository";

function assertPasswordCountsMeetPolicy(
  password: string,
  policy: ReturnType<typeof toEffectiveTenantAuthPolicy>["passwordPolicy"],
) {
  const counts = countPasswordClasses(password);

  if (counts.length < policy.minLength) return "too_short";
  if (policy.maxLength !== null && counts.length > policy.maxLength) return "too_long";
  if (counts.uppercase < policy.minUppercase) return "missing_uppercase";
  if (policy.maxUppercase !== null && counts.uppercase > policy.maxUppercase) return "too_many_uppercase";
  if (counts.lowercase < policy.minLowercase) return "missing_lowercase";
  if (policy.maxLowercase !== null && counts.lowercase > policy.maxLowercase) return "too_many_lowercase";
  if (counts.numbers < policy.minNumbers) return "missing_number";
  if (policy.maxNumbers !== null && counts.numbers > policy.maxNumbers) return "too_many_numbers";
  if (counts.symbols < policy.minSymbols) return "missing_symbol";
  if (policy.maxSymbols !== null && counts.symbols > policy.maxSymbols) return "too_many_symbols";
  return null;
}

export function createTenantConfigurationService(
  repository: TenantConfigurationRepository,
  visibleTenantsReader: VisibleTenantsReader,
  platformSecurityRepository?: PlatformSecurityRepository,
): TenantConfigurationService & { policyResolver: TenantAuthPolicyResolver } {
  const policyResolver: TenantAuthPolicyResolver = {
    async readEffectiveTenantAuthPolicy(tenantId) {
      const tenant = await visibleTenantsReader.findVisibleTenantById(tenantId);
      if (!tenant) {
        return null;
      }

      const override = await repository.findTenantAuthPolicyByTenantId(tenantId);
      return toEffectiveTenantAuthPolicy(tenantId, override);
    },
    async resolveAggregatePasswordPolicy(tenantIds) {
      const uniqueIds = [...new Set(tenantIds)];
      const policies = [];
      for (const tenantId of uniqueIds) {
        const policy = await this.readEffectiveTenantAuthPolicy(tenantId);
        if (policy) {
          policies.push(policy.passwordPolicy);
        }
      }
      return resolveAggregatePasswordPolicy(policies);
    },
    async resolveAggregateSessionTtlSeconds(tenantIds) {
      const uniqueIds = [...new Set(tenantIds)];
      const policies = [];
      for (const tenantId of uniqueIds) {
        const policy = await this.readEffectiveTenantAuthPolicy(tenantId);
        if (policy) {
          policies.push(policy.sessionPolicy);
        }
      }
      return resolveAggregateSessionTtlSeconds(policies);
    },
    assertPasswordMeetsPolicy(password, policy) {
      const reason = assertPasswordCountsMeetPolicy(password, policy);
      if (reason) {
        const error = new Error(reason);
        error.name = "TenantAuthPolicyPasswordViolation";
        throw error;
      }
    },
  };

  return {
    policyResolver,
    async readTenantAuthPolicyAsRoot(input) {
      const policy = await policyResolver.readEffectiveTenantAuthPolicy(input.tenantId);
      if (!policy) {
        throw new TenantAuthPolicyNotFoundError();
      }
      return policy;
    },
    async readCurrentTenantAuthPolicyAsTenantAdmin(input) {
      if (!input.tenantId) {
        throw new TenantAuthPolicyCurrentTenantRequiredError();
      }
      const policy = await policyResolver.readEffectiveTenantAuthPolicy(input.tenantId);
      if (!policy) {
        throw new TenantAuthPolicyNotFoundError();
      }
      return policy;
    },
    async updateTenantAuthPolicy(input) {
      const tenant = await visibleTenantsReader.findVisibleTenantById(input.tenantId);
      if (!tenant) {
        throw new TenantAuthPolicyNotFoundError();
      }

      validateTenantAuthPolicyInput(input);
      await repository.upsertTenantAuthPolicy({
        tenantId: input.tenantId,
        minLength: input.minLength ?? null,
        maxLength: input.maxLength ?? null,
        minUppercase: input.minUppercase ?? null,
        maxUppercase: input.maxUppercase ?? null,
        minLowercase: input.minLowercase ?? null,
        maxLowercase: input.maxLowercase ?? null,
        minNumbers: input.minNumbers ?? null,
        maxNumbers: input.maxNumbers ?? null,
        minSymbols: input.minSymbols ?? null,
        maxSymbols: input.maxSymbols ?? null,
        sessionTtlSeconds: input.sessionTtlSeconds ?? null,
      });

      if (platformSecurityRepository && input.authPrincipalId) {
        await platformSecurityRepository.createSecurityAuditEvent({
          eventId: randomUUID(),
          authPrincipalId: input.authPrincipalId,
          rootUserId: input.rootUserId,
          eventType: "tenant_auth_policy_updated",
          eventOutcome: "success",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          occurredAt: new Date(),
        });
      }

      return this.readTenantAuthPolicyAsRoot({ tenantId: input.tenantId });
    },
  };
}
