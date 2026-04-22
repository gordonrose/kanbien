import { promises as fs } from "node:fs";
import path from "node:path";
import type { CapabilityRecordData } from "../domain/types";

export function getGeneratedArtifactPath(): string {
  return process.env.CAPABILITY_CATALOG_ARTIFACT_PATH
    ? path.resolve(process.env.CAPABILITY_CATALOG_ARTIFACT_PATH)
    : path.resolve(
        process.cwd(),
        "docs/workspace/exports/capability-contract-catalog-v1.generated.json",
      );
}

function toSerializable(record: CapabilityRecordData) {
  return {
    capabilityId: record.capabilityId,
    featureName: record.featureName,
    displayLabel: record.displayLabel,
    shortDescription: record.shortDescription,
    fullDescription: record.fullDescription,
    userFacingOutcome: record.userFacingOutcome,
    routeFamily: record.routeFamily,
    seamType: record.seamType,
    capabilityBoundary: record.capabilityBoundary,
    selectionGroup: record.selectionGroup,
    httpMethod: record.httpMethod,
    routePath: record.routePath,
    governingAuthzCapabilities: record.governingAuthzCapabilities,
    allowedRoles: record.allowedRoles,
    supportsRequestBody: record.supportsRequestBody,
    supportsResponseFields: record.supportsResponseFields,
    supportsFilters: record.supportsFilters,
    lifecycleStatus: record.lifecycleStatus,
    normalizedHash: record.normalizedHash,
    lastMaterializedAt: record.lastMaterializedAt.toISOString(),
    fields: record.fields.map((field) => ({
      contractSide: field.contractSide,
      path: field.path,
      displayLabel: field.displayLabel,
      description: field.description,
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
      displayOrder: field.displayOrder,
    })),
    constraints: record.constraints.map((constraint) => ({
      constraintKind: constraint.constraintKind,
      fields: constraint.fields,
      message: constraint.message,
      displayOrder: constraint.displayOrder,
    })),
    sourceReferences: record.sourceReferences.map((reference) => ({
      sourceType: reference.sourceType,
      sourcePath: reference.sourcePath,
      sourceCoverage: reference.sourceCoverage,
    })),
  };
}

export async function writeCapabilityCatalogArtifact(records: CapabilityRecordData[]): Promise<string> {
  const artifactPath = getGeneratedArtifactPath();
  await fs.mkdir(path.dirname(artifactPath), { recursive: true });
  await fs.writeFile(
    artifactPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        items: records.map(toSerializable),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  return artifactPath;
}
