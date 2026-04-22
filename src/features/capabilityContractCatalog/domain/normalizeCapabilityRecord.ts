import { createHash, randomUUID } from "node:crypto";
import type {
  CapabilityConstraintData,
  CapabilityFieldData,
  CapabilityRecordData,
  CapabilitySourceReferenceData,
  SourceCapabilityDefinition,
} from "./types";

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
      left.localeCompare(right),
    );
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
  }

  return JSON.stringify(value);
}

function createFieldRows(
  capabilityId: string,
  contractSide: CapabilityFieldData["contractSide"],
  definitions: SourceCapabilityDefinition["requestParams"] | SourceCapabilityDefinition["responseBody"] | undefined,
): CapabilityFieldData[] {
  return (definitions ?? []).map((field, index) => ({
    fieldId: randomUUID(),
    capabilityId,
    contractSide,
    path: field.path,
    displayLabel: field.displayLabel ?? null,
    description: field.description ?? null,
    fieldType: field.fieldType,
    required: field.required,
    nullable: field.nullable ?? false,
    repeated: field.repeated ?? false,
    format: field.format ?? null,
    enumValues: field.enumValues ?? [],
    systemManaged: field.systemManaged ?? false,
    normalizationSteps: field.normalizationSteps ?? [],
    bindingHints: field.bindingHints ?? [],
    validation: field.validation ?? null,
    displayOrder: index,
  }));
}

export interface NormalizedCatalogRecord {
  record: CapabilityRecordData;
  currentRegistryAuditAt: Date;
}

export function normalizeCapabilityRecord(source: SourceCapabilityDefinition): NormalizedCatalogRecord {
  const now = new Date();
  const fields: CapabilityFieldData[] = [
    ...createFieldRows(source.capabilityId, "request-param", source.requestParams),
    ...createFieldRows(source.capabilityId, "request-query", source.requestQuery),
    ...createFieldRows(source.capabilityId, "request-body", source.requestBody),
    ...createFieldRows(source.capabilityId, "response-body", source.responseBody),
  ];
  const constraints: CapabilityConstraintData[] = (source.constraints ?? []).map((constraint, index) => ({
    constraintId: randomUUID(),
    capabilityId: source.capabilityId,
    constraintKind: constraint.constraintKind,
    fields: constraint.fields,
    message: constraint.message,
    displayOrder: index,
  }));
  const sourceReferences: CapabilitySourceReferenceData[] = source.sourceReferences.map((reference) => ({
    sourceReferenceId: randomUUID(),
    capabilityId: source.capabilityId,
    sourceType: reference.sourceType,
    sourcePath: reference.sourcePath,
    sourceCoverage: reference.sourceCoverage ?? null,
  }));

  const hashPayload = {
    capabilityId: source.capabilityId,
    featureName: source.featureName,
    displayLabel: source.displayLabel,
    shortDescription: source.shortDescription,
    fullDescription: source.fullDescription ?? null,
    userFacingOutcome: source.userFacingOutcome ?? null,
    routeFamily: source.routeFamily,
    seamType: source.seamType,
    capabilityBoundary: source.capabilityBoundary,
    selectionGroup: source.selectionGroup,
    httpMethod: source.httpMethod ?? null,
    routePath: source.routePath ?? null,
    governingAuthzCapabilities: source.governingAuthzCapabilities,
    allowedRoles: source.allowedRoles,
    supportsRequestBody: source.supportsRequestBody,
    supportsResponseFields: source.supportsResponseFields,
    supportsFilters: source.supportsFilters,
    lifecycleStatus: source.lifecycleStatus,
    fields: fields.map((field) => ({
      contractSide: field.contractSide,
      path: field.path,
      fieldType: field.fieldType,
      required: field.required,
      nullable: field.nullable,
      repeated: field.repeated,
      format: field.format,
      enumValues: field.enumValues,
      systemManaged: field.systemManaged,
      normalizationSteps: field.normalizationSteps,
      bindingHints: field.bindingHints,
      validation: field.validation,
      displayLabel: field.displayLabel,
      description: field.description,
      displayOrder: field.displayOrder,
    })),
    constraints: constraints.map((constraint) => ({
      constraintKind: constraint.constraintKind,
      fields: constraint.fields,
      message: constraint.message,
      displayOrder: constraint.displayOrder,
    })),
    sourceReferences: sourceReferences.map((reference) => ({
      sourceType: reference.sourceType,
      sourcePath: reference.sourcePath,
      sourceCoverage: reference.sourceCoverage,
    })),
  };

  const normalizedHash = createHash("sha256").update(stableStringify(hashPayload)).digest("hex");

  return {
    currentRegistryAuditAt: now,
    record: {
      recordId: randomUUID(),
      capabilityId: source.capabilityId,
      featureName: source.featureName,
      displayLabel: source.displayLabel,
      shortDescription: source.shortDescription,
      fullDescription: source.fullDescription ?? null,
      userFacingOutcome: source.userFacingOutcome ?? null,
      routeFamily: source.routeFamily,
      seamType: source.seamType,
      capabilityBoundary: source.capabilityBoundary,
      selectionGroup: source.selectionGroup,
      httpMethod: source.httpMethod ?? null,
      routePath: source.routePath ?? null,
      governingAuthzCapabilities: source.governingAuthzCapabilities,
      allowedRoles: source.allowedRoles,
      supportsRequestBody: source.supportsRequestBody,
      supportsResponseFields: source.supportsResponseFields,
      supportsFilters: source.supportsFilters,
      lifecycleStatus: source.lifecycleStatus,
      normalizedHash,
      lastMaterializedAt: now,
      createdAt: now,
      updatedAt: now,
      fields,
      constraints,
      sourceReferences,
    },
  };
}
