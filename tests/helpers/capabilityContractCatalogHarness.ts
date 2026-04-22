import type { Express } from "express";
import { createRequireRootSession } from "../../src/lib/auth/middleware";
import { createRateLimitMiddleware } from "../../src/lib/security/rateLimit";
import { env } from "../../src/config/env";
import { createCapabilityContractCatalogService } from "../../src/features/capabilityContractCatalog/domain/service";
import type { CapabilityRecordData } from "../../src/features/capabilityContractCatalog/domain/types";
import type { CapabilityContractCatalogRepository } from "../../src/features/capabilityContractCatalog/persistence/repository";
import { createCapabilityContractCatalogRouter } from "../../src/features/capabilityContractCatalog/transport/router";
import type { RootCapabilityChecker } from "../../src/lib/authz/middleware";
import type { RootAuthIntegrationHarness } from "../harness/rootAuth/integrationHarness";

function cloneRecord(record: CapabilityRecordData): CapabilityRecordData {
  return {
    ...record,
    governingAuthzCapabilities: [...record.governingAuthzCapabilities],
    allowedRoles: [...record.allowedRoles],
    fields: record.fields.map((field) => ({
      ...field,
      enumValues: [...field.enumValues],
      normalizationSteps: [...field.normalizationSteps],
      bindingHints: [...field.bindingHints],
      validation: field.validation ? { ...field.validation } : null,
    })),
    constraints: record.constraints.map((constraint) => ({
      ...constraint,
      fields: [...constraint.fields],
    })),
    sourceReferences: record.sourceReferences.map((reference) => ({ ...reference })),
    lastMaterializedAt: new Date(record.lastMaterializedAt),
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

export function createInMemoryCapabilityContractCatalogRepository(
  seed: CapabilityRecordData[] = [],
): CapabilityContractCatalogRepository & { records: CapabilityRecordData[] } {
  const records = seed.map(cloneRecord);

  return {
    records,
    async materializeRecords(nextRecords) {
      let insertedCount = 0;
      let updatedCount = 0;

      for (const nextRecord of nextRecords.map(cloneRecord)) {
        const existingIndex = records.findIndex(
          (record) => record.capabilityId === nextRecord.capabilityId,
        );
        if (existingIndex >= 0) {
          records.splice(existingIndex, 1, nextRecord);
          updatedCount += 1;
        } else {
          records.push(nextRecord);
          insertedCount += 1;
        }
      }

      return { insertedCount, updatedCount };
    },
    async listAllRecords() {
      return records.map(cloneRecord);
    },
    async findRecordByCapabilityId(capabilityId) {
      const record = records.find((item) => item.capabilityId === capabilityId);
      return record ? cloneRecord(record) : null;
    },
  };
}

export function mountCapabilityContractCatalogFeature(
  app: Express,
  harness: RootAuthIntegrationHarness,
  repository: CapabilityContractCatalogRepository = createInMemoryCapabilityContractCatalogRepository(),
  options?: {
    capabilityChecker?: RootCapabilityChecker;
  },
) {
  const requireRootSession = createRequireRootSession(harness.authRepository, {
    allowBrowserCookie: true,
  });
  const authenticatedGeneralRateLimit = createRateLimitMiddleware({
    enabled: env.platformSecurity.enabled,
    repository: harness.platformSecurityRepository,
    policy: {
      endpointClass: "authenticated-general",
      windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
      maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
      responseCode: "RATE_LIMITED",
      responseMessage: "Too many requests. Please wait and try again.",
    },
    subjectScope: "auth_user",
    getSubjectKey: (request) =>
      request.rootSession
        ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}`
        : null,
  });

  app.use(
    "/v1/capability-contract-catalog",
    requireRootSession,
    authenticatedGeneralRateLimit,
    createCapabilityContractCatalogRouter(
      createCapabilityContractCatalogService(repository),
      options?.capabilityChecker ?? {
        hasCapability: async ({ rootUserId, capabilityKey }) =>
          harness.getRootUserCapabilities(rootUserId).includes(capabilityKey),
      },
      harness.platformSecurityRepository,
    ),
  );

  return repository;
}
