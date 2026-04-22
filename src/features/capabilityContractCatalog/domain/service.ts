import type { CapabilityContractCatalogRepository } from "../persistence/repository";
import type {
  CapabilityExactRecord,
  CapabilityPickerSummary,
  CapabilityRecordData,
  CapabilityRegistryStatus,
  ExportCatalogInput,
  ExportCatalogResult,
  ListCatalogInput,
  MaterializeCatalogInput,
  MaterializeCatalogResult,
  PaginatedResult,
  SourceCapabilityDefinition,
} from "./types";
import { INITIAL_CAPABILITY_SOURCE_REGISTRY } from "./sourceRegistry";
import { normalizeCapabilityRecord } from "./normalizeCapabilityRecord";
import { writeCapabilityCatalogArtifact } from "../generation/artifact";
import {
  CapabilityCatalogNotFoundError,
  ExportBlockedError,
  MaterializationBlockedError,
} from "../contract/errors";

interface SourceDefinitionStatus {
  definition: SourceCapabilityDefinition;
  record: CapabilityRecordData | null;
  blockedReason: string | null;
}

function normalizeSourceDefinition(definition: SourceCapabilityDefinition): SourceDefinitionStatus {
  if (definition.normalizationBlockedReason) {
    return {
      definition,
      record: null,
      blockedReason: definition.normalizationBlockedReason,
    };
  }

  return {
    definition,
    record: normalizeCapabilityRecord(definition).record,
    blockedReason: null,
  };
}

function buildStatuses(
  persistedRecords: CapabilityRecordData[],
  sourceDefinitions: SourceCapabilityDefinition[],
): Map<string, CapabilityRegistryStatus> {
  const normalizedSourceDefinitions = sourceDefinitions.map(normalizeSourceDefinition);
  const sourceMap = new Map(
    normalizedSourceDefinitions
      .filter((definition) => definition.record)
      .map((definition) => [definition.definition.capabilityId, definition.record!]),
  );
  const blockedSourceMap = new Map(
    normalizedSourceDefinitions
      .filter((definition) => definition.blockedReason)
      .map((definition) => [definition.definition.capabilityId, definition]),
  );
  const persistedMap = new Map(persistedRecords.map((record) => [record.capabilityId, record]));
  const capabilityIds = new Set([...sourceMap.keys(), ...blockedSourceMap.keys(), ...persistedMap.keys()]);
  const auditedAt = new Date().toISOString();
  const result = new Map<string, CapabilityRegistryStatus>();

  for (const capabilityId of capabilityIds) {
    const sourceRecord = sourceMap.get(capabilityId);
    const blockedSource = blockedSourceMap.get(capabilityId);
    const persistedRecord = persistedMap.get(capabilityId);
    const driftReasons: string[] = [];
    let freshnessStatus: CapabilityRegistryStatus["freshnessStatus"] = "fresh";
    let rematerializationRequired = false;

    if (blockedSource) {
      freshnessStatus = "blocked";
      rematerializationRequired = true;
      driftReasons.push(blockedSource.blockedReason!);
    } else if (!sourceRecord && persistedRecord) {
      freshnessStatus = "drifted";
      rematerializationRequired = true;
      driftReasons.push("Persisted capability record is no longer present in the current bounded source registry.");
    } else if (sourceRecord && !persistedRecord) {
      freshnessStatus = "stale";
      rematerializationRequired = true;
      driftReasons.push("Capability record exists in source truth but has not been materialized yet.");
    } else if (sourceRecord && persistedRecord && sourceRecord.normalizedHash !== persistedRecord.normalizedHash) {
      freshnessStatus = "drifted";
      rematerializationRequired = true;
      driftReasons.push("Persisted capability record does not match the current normalized source truth.");
    }

    const sourceReferenceTypes = new Set(
      (sourceRecord?.sourceReferences
        ?? blockedSource?.definition.sourceReferences.map((reference) => ({
          sourceType: reference.sourceType,
        })))
        ?.map((reference) => reference.sourceType) ?? [],
    );

    result.set(capabilityId, {
      capabilityId,
      freshnessStatus,
      lastMaterializedAt: persistedRecord?.lastMaterializedAt.toISOString() ?? null,
      lastAuditedAt: auditedAt,
      driftReasons,
      sourceCoverage: {
        featureContract: sourceReferenceTypes.has("feature-contract"),
        apiContractDoc: sourceReferenceTypes.has("api-contract-doc"),
        permissionMapping: sourceReferenceTypes.has("permission-mapping"),
        featureManifest: sourceReferenceTypes.has("feature-manifest"),
      },
      rematerializationRequired,
    });
  }

  return result;
}

function toPickerSummary(record: CapabilityRecordData, status: CapabilityRegistryStatus): CapabilityPickerSummary {
  return {
    capabilityId: record.capabilityId,
    displayLabel: record.displayLabel,
    shortDescription: record.shortDescription,
    featureName: record.featureName,
    routeFamily: record.routeFamily,
    seamType: record.seamType,
    capabilityBoundary: record.capabilityBoundary,
    selectionGroup: record.selectionGroup,
    route:
      record.httpMethod && record.routePath
        ? {
            method: record.httpMethod,
            path: record.routePath,
          }
        : null,
    governingAuthzCapabilities: record.governingAuthzCapabilities,
    allowedRoles: record.allowedRoles,
    supportsRequestBody: record.supportsRequestBody,
    supportsResponseFields: record.supportsResponseFields,
    supportsFilters: record.supportsFilters,
    freshnessStatus: status.freshnessStatus,
    lifecycleStatus: record.lifecycleStatus,
  };
}

function toExactRecord(
  record: CapabilityRecordData,
  status: CapabilityRegistryStatus,
  runtimeContextRequirements: string[] = [],
): CapabilityExactRecord {
  return {
    capabilityId: record.capabilityId,
    displayLabel: record.displayLabel,
    shortDescription: record.shortDescription,
    fullDescription: record.fullDescription,
    userFacingOutcome: record.userFacingOutcome,
    featureName: record.featureName,
    routeFamily: record.routeFamily,
    seamType: record.seamType,
    capabilityBoundary: record.capabilityBoundary,
    route:
      record.httpMethod && record.routePath
        ? {
            method: record.httpMethod,
            path: record.routePath,
          }
        : null,
    access: {
      governingAuthzCapabilities: record.governingAuthzCapabilities,
      allowedRoles: record.allowedRoles,
      deniedByDefault: true,
      runtimeContextRequirements,
    },
    request: {
      params: record.fields.filter((field) => field.contractSide === "request-param"),
      query: record.fields.filter((field) => field.contractSide === "request-query"),
      body: record.fields.filter((field) => field.contractSide === "request-body"),
      constraints: record.constraints,
    },
    response: {
      body: record.fields.filter((field) => field.contractSide === "response-body"),
    },
    sourceReferences: record.sourceReferences,
    freshness: {
      status: status.freshnessStatus,
      lastMaterializedAt: record.lastMaterializedAt.toISOString(),
      lastAuditedAt: status.lastAuditedAt,
    },
  };
}

export interface CapabilityContractCatalogService {
  listCapabilityCatalogEntries(input: ListCatalogInput): Promise<PaginatedResult<CapabilityPickerSummary>>;
  getCapabilityCatalogEntry(capabilityId: string): Promise<CapabilityExactRecord>;
  exportCapabilityCatalogSnapshot(input: ExportCatalogInput): Promise<ExportCatalogResult>;
  materializeCapabilityCatalog(input: MaterializeCatalogInput): Promise<MaterializeCatalogResult>;
  auditCapabilityCatalogDrift(input: { includeFeatures?: string[] }): Promise<CapabilityRegistryStatus[]>;
}

export function createCapabilityContractCatalogService(
  repository: CapabilityContractCatalogRepository,
  options?: {
    sourceDefinitions?: SourceCapabilityDefinition[];
  },
): CapabilityContractCatalogService {
  async function getScopedSourceDefinitions(includeFeatures?: string[]) {
    const sourceRegistry = options?.sourceDefinitions ?? INITIAL_CAPABILITY_SOURCE_REGISTRY;
    return sourceRegistry.filter((definition) =>
      includeFeatures?.length ? includeFeatures.includes(definition.featureName) : true,
    );
  }

  return {
    async listCapabilityCatalogEntries(input) {
      const [records, sourceDefinitions] = await Promise.all([
        repository.listAllRecords(),
        getScopedSourceDefinitions(),
      ]);
      const statuses = buildStatuses(records, sourceDefinitions);

      const filtered = records
        .filter((record) => (input.featureName ? record.featureName === input.featureName : true))
        .filter((record) => (input.routeFamily ? record.routeFamily === input.routeFamily : true))
        .filter((record) => (input.seamType ? record.seamType === input.seamType : true))
        .filter((record) =>
          input.capabilityBoundary ? record.capabilityBoundary === input.capabilityBoundary : true,
        )
        .filter((record) =>
          input.governingAuthzCapability
            ? record.governingAuthzCapabilities.includes(input.governingAuthzCapability)
            : true,
        )
        .filter((record) => (input.allowedRole ? record.allowedRoles.includes(input.allowedRole) : true))
        .filter((record) => (input.capabilityId ? record.capabilityId === input.capabilityId : true))
        .filter((record) =>
          input.displayLabel
            ? record.displayLabel.toLowerCase().includes(input.displayLabel.toLowerCase())
            : true,
        )
        .filter((record) =>
          input.featureNamePrefix
            ? record.featureName.toLowerCase().startsWith(input.featureNamePrefix.toLowerCase())
            : true,
        )
        .filter((record) =>
          input.supportsRequestBody !== undefined ? record.supportsRequestBody === input.supportsRequestBody : true,
        )
        .filter((record) =>
          input.supportsResponseFields !== undefined
            ? record.supportsResponseFields === input.supportsResponseFields
            : true,
        )
        .filter((record) =>
          input.supportsFilters !== undefined ? record.supportsFilters === input.supportsFilters : true,
        )
        .filter((record) =>
          input.freshnessStatus ? statuses.get(record.capabilityId)?.freshnessStatus === input.freshnessStatus : true,
        )
        .sort((left, right) => left.capabilityId.localeCompare(right.capabilityId));

      if (input.orderDirection === "desc") {
        filtered.reverse();
      }

      const totalMatchingRecords = filtered.length;
      const totalPages = totalMatchingRecords === 0 ? 0 : Math.ceil(totalMatchingRecords / input.pageSize);
      const start = (input.page - 1) * input.pageSize;
      const items = filtered.slice(start, start + input.pageSize).map((record) => {
        const status = statuses.get(record.capabilityId)!;
        return toPickerSummary(record, status);
      });

      return {
        items,
        page: input.page,
        pageSize: input.pageSize,
        totalPages,
        totalMatchingRecords,
      };
    },

    async getCapabilityCatalogEntry(capabilityId) {
      const [record, sourceDefinitions] = await Promise.all([
        repository.findRecordByCapabilityId(capabilityId),
        getScopedSourceDefinitions(),
      ]);
      if (!record) {
        throw new CapabilityCatalogNotFoundError();
      }
      const status = buildStatuses([record], sourceDefinitions).get(capabilityId)!;
      const sourceDefinition = sourceDefinitions.find((definition) => definition.capabilityId === capabilityId);
      return toExactRecord(record, status, sourceDefinition?.runtimeContextRequirements ?? []);
    },

    async exportCapabilityCatalogSnapshot(input) {
      const [records, sourceDefinitions] = await Promise.all([
        repository.listAllRecords(),
        getScopedSourceDefinitions(input.includeFeatures),
      ]);
      const scopedRecords = records.filter((record) =>
        input.includeFeatures?.length ? input.includeFeatures.includes(record.featureName) : true,
      );
      const statuses = buildStatuses(scopedRecords, sourceDefinitions);

      if (!input.allowStale) {
        const blocked = scopedRecords.some((record) => {
          const status = statuses.get(record.capabilityId);
          return status && status.freshnessStatus !== "fresh";
        });
        if (blocked) {
          throw new ExportBlockedError();
        }
      }

      return {
        formatVersion: input.formatVersion,
        exportedAt: new Date().toISOString(),
        items: [...scopedRecords]
          .sort((left, right) => left.capabilityId.localeCompare(right.capabilityId))
          .map((record) =>
            toExactRecord(
              record,
              statuses.get(record.capabilityId)!,
              sourceDefinitions.find((definition) => definition.capabilityId === record.capabilityId)
                ?.runtimeContextRequirements ?? [],
            ),
          ),
      };
    },

    async materializeCapabilityCatalog(input) {
      const sourceDefinitions = await getScopedSourceDefinitions(input.includeFeatures);
      const blockedDefinitions = sourceDefinitions.filter((definition) => definition.normalizationBlockedReason);
      if (blockedDefinitions.length > 0) {
        throw new MaterializationBlockedError(
          blockedDefinitions.map((definition) => definition.normalizationBlockedReason).join(" "),
        );
      }
      const normalized = sourceDefinitions.map(normalizeCapabilityRecord);
      const records = normalized.map((item) => item.record);
      const [materializeResult, artifactPath] = await Promise.all([
        repository.materializeRecords(records),
        writeCapabilityCatalogArtifact(records),
      ]);
      return {
        insertedCount: materializeResult.insertedCount,
        updatedCount: materializeResult.updatedCount,
        generatedArtifactPath: artifactPath,
        generatedCapabilityCount: records.length,
        materializedAt: new Date().toISOString(),
      };
    },

    async auditCapabilityCatalogDrift(input) {
      const [records, sourceDefinitions] = await Promise.all([
        repository.listAllRecords(),
        getScopedSourceDefinitions(input.includeFeatures),
      ]);
      const scopedRecords = records.filter((record) =>
        input.includeFeatures?.length ? input.includeFeatures.includes(record.featureName) : true,
      );
      return Array.from(buildStatuses(scopedRecords, sourceDefinitions).values()).sort((left, right) =>
        left.capabilityId.localeCompare(right.capabilityId),
      );
    },
  };
}
