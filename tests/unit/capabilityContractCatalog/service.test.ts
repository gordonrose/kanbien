import { describe, expect, it } from "vitest";
import { createCapabilityContractCatalogService } from "../../../src/features/capabilityContractCatalog/domain/service";
import {
  ExportBlockedError,
  MaterializationBlockedError,
} from "../../../src/features/capabilityContractCatalog/contract/errors";
import type { CapabilityContractCatalogRepository } from "../../../src/features/capabilityContractCatalog/persistence/repository";
import { normalizeCapabilityRecord } from "../../../src/features/capabilityContractCatalog/domain/normalizeCapabilityRecord";
import { INITIAL_CAPABILITY_SOURCE_REGISTRY } from "../../../src/features/capabilityContractCatalog/domain/sourceRegistry";
import type {
  CapabilityRecordData,
  SourceCapabilityDefinition,
} from "../../../src/features/capabilityContractCatalog/domain/types";

function createRepository(records: CapabilityRecordData[]): CapabilityContractCatalogRepository {
  return {
    async materializeRecords(nextRecords) {
      records.splice(0, records.length, ...nextRecords);
      return {
        insertedCount: nextRecords.length,
        updatedCount: 0,
      };
    },
    async listAllRecords() {
      return records;
    },
    async findRecordByCapabilityId(capabilityId) {
      return records.find((record) => record.capabilityId === capabilityId) ?? null;
    },
  };
}

function createSourceDefinition(
  overrides: Partial<SourceCapabilityDefinition> = {},
): SourceCapabilityDefinition {
  return {
    ...INITIAL_CAPABILITY_SOURCE_REGISTRY[0],
    capabilityId: overrides.capabilityId ?? "testFeature.testCapability",
    featureName: overrides.featureName ?? "testFeature",
    displayLabel: overrides.displayLabel ?? "Test Capability",
    shortDescription: overrides.shortDescription ?? "Test capability short description.",
    routeFamily: overrides.routeFamily ?? "test-feature",
    selectionGroup: overrides.selectionGroup ?? "test-feature",
    governingAuthzCapabilities: overrides.governingAuthzCapabilities ?? ["test.capability.read"],
    allowedRoles: overrides.allowedRoles ?? ["RootUserAdmin"],
    sourceReferences:
      overrides.sourceReferences
      ?? [
        {
          sourceType: "feature-contract",
          sourcePath: "src/features/testFeature/contract/schemas.ts",
        },
        {
          sourceType: "permission-mapping",
          sourcePath: "docs/architecture/permission-mappings/test.md",
        },
      ],
    ...overrides,
  };
}

describe("capability contract catalog service", () => {
  it("TC-CAP-CATALOG-UNIT-001 and TC-CAP-CATALOG-UNIT-004 normalize stable feature-qualified capability records without inventing missing long-form descriptions", () => {
    const source: SourceCapabilityDefinition = {
      ...INITIAL_CAPABILITY_SOURCE_REGISTRY[0],
      capabilityId: "notificationDelivery.sendEmail",
      fullDescription: undefined,
      userFacingOutcome: undefined,
    };

    const normalized = normalizeCapabilityRecord(source).record;

    expect(normalized.capabilityId).toBe("notificationDelivery.sendEmail");
    expect(normalized.featureName).toBe("notificationDelivery");
    expect(normalized.shortDescription).toBe(source.shortDescription);
    expect(normalized.fullDescription).toBeNull();
    expect(normalized.userFacingOutcome).toBeNull();
  });

  it("TC-CAP-CATALOG-UNIT-005 and TC-CAP-CATALOG-UNIT-007 lists deterministic picker summaries with bounded source records after materialization", async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH = "/tmp/capability-contract-catalog-v1.generated.json";
    const repository = createRepository([]);
    const service = createCapabilityContractCatalogService(repository);

    await service.materializeCapabilityCatalog({});
    const result = await service.listCapabilityCatalogEntries({
      page: 1,
      pageSize: 25,
      orderDirection: "asc",
    });

    expect(result.totalMatchingRecords).toBe(4);
    expect(result.items[0]).toMatchObject({
      capabilityId: "notificationDelivery.getOutboundEmail",
      featureName: "notificationDelivery",
      freshnessStatus: "fresh",
    });
    delete process.env.CAPABILITY_CATALOG_ARTIFACT_PATH;
  });

  it("TC-CAP-CATALOG-UNIT-002 and TC-CAP-CATALOG-UNIT-003 returns exact records with field validation and capability-constraint metadata", async () => {
    const records = INITIAL_CAPABILITY_SOURCE_REGISTRY.map((definition) =>
      normalizeCapabilityRecord(definition).record,
    );
    const repository = createRepository(records);
    const service = createCapabilityContractCatalogService(repository);

    const result = await service.getCapabilityCatalogEntry("notificationDelivery.resendEmail");

    expect(result.request.params[0]).toMatchObject({
      path: "params.emailId",
      format: "uuid",
    });
    expect(result.request.constraints).toEqual([
      expect.objectContaining({
        constraintKind: "at-least-one",
      }),
    ]);
    expect(result.response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "response.latestAttempt.resendReason",
        }),
      ]),
    );
  });

  it("TC-CAP-CATALOG-UNIT-006 blocks export when persisted records drift from current source truth and stale export is not allowed", async () => {
    const records = INITIAL_CAPABILITY_SOURCE_REGISTRY.map((definition) =>
      normalizeCapabilityRecord(definition).record,
    );
    records[0] = {
      ...records[0],
      normalizedHash: "drifted-hash",
    };
    const repository = createRepository(records);
    const service = createCapabilityContractCatalogService(repository);

    await expect(
      service.exportCapabilityCatalogSnapshot({
        formatVersion: "v1",
      }),
    ).rejects.toBeInstanceOf(ExportBlockedError);
  });

  it("TC-CAP-CATALOG-EDGE-001 blocks materialization and reports blocked drift posture when source truth is contradictory", async () => {
    const sourceDefinition = createSourceDefinition({
      capabilityId: "testFeature.blockedCapability",
      normalizationBlockedReason:
        "Contradictory schema and permission mapping truth prevents honest normalization.",
    });
    const blockedRecord = normalizeCapabilityRecord(
      createSourceDefinition({
        capabilityId: "testFeature.blockedCapability",
      }),
    ).record;
    const repository = createRepository([blockedRecord]);
    const service = createCapabilityContractCatalogService(repository, {
      sourceDefinitions: [sourceDefinition],
    });

    await expect(service.materializeCapabilityCatalog({})).rejects.toBeInstanceOf(
      MaterializationBlockedError,
    );

    await expect(service.auditCapabilityCatalogDrift({})).resolves.toEqual([
      expect.objectContaining({
        capabilityId: "testFeature.blockedCapability",
        freshnessStatus: "blocked",
        rematerializationRequired: true,
        driftReasons: [
          "Contradictory schema and permission mapping truth prevents honest normalization.",
        ],
      }),
    ]);
  });

  it("TC-CAP-CATALOG-EDGE-002 keeps partial source coverage and missing human-friendly detail explicit", async () => {
    const sourceDefinition = createSourceDefinition({
      capabilityId: "testFeature.partialCoverage",
      fullDescription: undefined,
      sourceReferences: [
        {
          sourceType: "feature-contract",
          sourcePath: "src/features/testFeature/contract/schemas.ts",
        },
      ],
    });
    const repository = createRepository([normalizeCapabilityRecord(sourceDefinition).record]);
    const service = createCapabilityContractCatalogService(repository, {
      sourceDefinitions: [sourceDefinition],
    });

    const exact = await service.getCapabilityCatalogEntry("testFeature.partialCoverage");
    const drift = await service.auditCapabilityCatalogDrift({});

    expect(exact.fullDescription).toBeNull();
    expect(drift).toEqual([
      expect.objectContaining({
        capabilityId: "testFeature.partialCoverage",
        sourceCoverage: {
          featureContract: true,
          apiContractDoc: false,
          permissionMapping: false,
          featureManifest: false,
        },
      }),
    ]);
  });

  it("TC-CAP-CATALOG-EDGE-003 keeps unsupported validation shapes null instead of fabricating frontend rules", async () => {
    const sourceDefinition = createSourceDefinition({
      capabilityId: "testFeature.unsupportedValidation",
      requestBody: [
        {
          path: "body.opaqueRuleField",
          fieldType: "string",
          required: false,
          description: "Validation not normalized: source schema uses an unsupported custom refinement.",
        },
      ],
      constraints: [],
    });
    const repository = createRepository([normalizeCapabilityRecord(sourceDefinition).record]);
    const service = createCapabilityContractCatalogService(repository, {
      sourceDefinitions: [sourceDefinition],
    });

    const exact = await service.getCapabilityCatalogEntry("testFeature.unsupportedValidation");

    expect(exact.request.body).toEqual([
      expect.objectContaining({
        path: "body.opaqueRuleField",
        validation: null,
        description:
          "Validation not normalized: source schema uses an unsupported custom refinement.",
      }),
    ]);
    expect(exact.request.constraints).toEqual([]);
  });
});
