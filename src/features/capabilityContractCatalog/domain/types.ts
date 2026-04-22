export type CapabilityBoundary = "root" | "tenant" | "shared";
export type CapabilityFreshnessStatus = "fresh" | "stale" | "drifted" | "blocked";
export type CapabilityLifecycleStatus = "active" | "deprecated" | "planned";
export type CapabilityContractSide =
  | "request-param"
  | "request-query"
  | "request-body"
  | "response-body";

export interface CapabilityFieldValidation {
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  format?: string;
  enumValues?: string[];
  normalizedAs?: string;
}

export interface CapabilityFieldData {
  fieldId: string;
  capabilityId: string;
  contractSide: CapabilityContractSide;
  path: string;
  displayLabel: string | null;
  description: string | null;
  fieldType: string;
  required: boolean;
  nullable: boolean;
  repeated: boolean;
  format: string | null;
  enumValues: string[];
  systemManaged: boolean;
  normalizationSteps: string[];
  bindingHints: string[];
  validation: CapabilityFieldValidation | null;
  displayOrder: number;
}

export interface CapabilityConstraintData {
  constraintId: string;
  capabilityId: string;
  constraintKind: string;
  fields: string[];
  message: string;
  displayOrder: number;
}

export interface CapabilitySourceReferenceData {
  sourceReferenceId: string;
  capabilityId: string;
  sourceType: string;
  sourcePath: string;
  sourceCoverage: string | null;
}

export interface CapabilityRecordData {
  recordId: string;
  capabilityId: string;
  featureName: string;
  displayLabel: string;
  shortDescription: string;
  fullDescription: string | null;
  userFacingOutcome: string | null;
  routeFamily: string;
  seamType: string;
  capabilityBoundary: CapabilityBoundary;
  selectionGroup: string;
  httpMethod: string | null;
  routePath: string | null;
  governingAuthzCapabilities: string[];
  allowedRoles: string[];
  supportsRequestBody: boolean;
  supportsResponseFields: boolean;
  supportsFilters: boolean;
  lifecycleStatus: CapabilityLifecycleStatus;
  normalizedHash: string;
  lastMaterializedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  fields: CapabilityFieldData[];
  constraints: CapabilityConstraintData[];
  sourceReferences: CapabilitySourceReferenceData[];
}

export interface CapabilityPickerSummary {
  capabilityId: string;
  displayLabel: string;
  shortDescription: string;
  featureName: string;
  routeFamily: string;
  seamType: string;
  capabilityBoundary: CapabilityBoundary;
  selectionGroup: string;
  route: {
    method: string;
    path: string;
  } | null;
  governingAuthzCapabilities: string[];
  allowedRoles: string[];
  supportsRequestBody: boolean;
  supportsResponseFields: boolean;
  supportsFilters: boolean;
  freshnessStatus: CapabilityFreshnessStatus;
  lifecycleStatus: CapabilityLifecycleStatus;
}

export interface CapabilityExactRecord {
  capabilityId: string;
  displayLabel: string;
  shortDescription: string;
  fullDescription: string | null;
  userFacingOutcome: string | null;
  featureName: string;
  routeFamily: string;
  seamType: string;
  capabilityBoundary: CapabilityBoundary;
  route: {
    method: string;
    path: string;
  } | null;
  access: {
    governingAuthzCapabilities: string[];
    allowedRoles: string[];
    deniedByDefault: boolean;
    runtimeContextRequirements: string[];
  };
  request: {
    params: CapabilityFieldData[];
    query: CapabilityFieldData[];
    body: CapabilityFieldData[];
    constraints: CapabilityConstraintData[];
  };
  response: {
    body: CapabilityFieldData[];
  };
  sourceReferences: CapabilitySourceReferenceData[];
  freshness: {
    status: CapabilityFreshnessStatus;
    lastMaterializedAt: string;
    lastAuditedAt: string | null;
  };
}

export interface CapabilityRegistryStatus {
  capabilityId: string;
  freshnessStatus: CapabilityFreshnessStatus;
  lastMaterializedAt: string | null;
  lastAuditedAt: string | null;
  driftReasons: string[];
  sourceCoverage: {
    featureContract: boolean;
    apiContractDoc: boolean;
    permissionMapping: boolean;
    featureManifest: boolean;
  };
  rematerializationRequired: boolean;
}

export interface MaterializeCatalogInput {
  includeFeatures?: string[];
}

export interface MaterializeCatalogResult {
  insertedCount: number;
  updatedCount: number;
  generatedArtifactPath: string;
  generatedCapabilityCount: number;
  materializedAt: string;
}

export interface ExportCatalogInput {
  includeFeatures?: string[];
  formatVersion: string;
  allowStale?: boolean;
}

export interface ExportCatalogResult {
  formatVersion: string;
  exportedAt: string;
  items: CapabilityExactRecord[];
}

export interface ListCatalogInput {
  featureName?: string;
  routeFamily?: string;
  seamType?: string;
  capabilityBoundary?: CapabilityBoundary;
  governingAuthzCapability?: string;
  allowedRole?: string;
  capabilityId?: string;
  displayLabel?: string;
  featureNamePrefix?: string;
  supportsRequestBody?: boolean;
  supportsResponseFields?: boolean;
  supportsFilters?: boolean;
  freshnessStatus?: CapabilityFreshnessStatus;
  page: number;
  pageSize: number;
  orderDirection: "asc" | "desc";
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalMatchingRecords: number;
}

export interface SourceCapabilityFieldDefinition {
  path: string;
  displayLabel?: string;
  description?: string;
  fieldType: string;
  required: boolean;
  nullable?: boolean;
  repeated?: boolean;
  format?: string;
  enumValues?: string[];
  systemManaged?: boolean;
  normalizationSteps?: string[];
  bindingHints?: string[];
  validation?: CapabilityFieldValidation;
}

export interface SourceCapabilityConstraintDefinition {
  constraintKind: string;
  fields: string[];
  message: string;
}

export interface SourceCapabilityDefinition {
  capabilityId: string;
  featureName: string;
  displayLabel: string;
  shortDescription: string;
  fullDescription?: string;
  userFacingOutcome?: string;
  routeFamily: string;
  seamType: string;
  capabilityBoundary: CapabilityBoundary;
  selectionGroup: string;
  httpMethod?: string;
  routePath?: string;
  governingAuthzCapabilities: string[];
  allowedRoles: string[];
  runtimeContextRequirements?: string[];
  supportsRequestBody: boolean;
  supportsResponseFields: boolean;
  supportsFilters: boolean;
  lifecycleStatus: CapabilityLifecycleStatus;
  requestParams?: SourceCapabilityFieldDefinition[];
  requestQuery?: SourceCapabilityFieldDefinition[];
  requestBody?: SourceCapabilityFieldDefinition[];
  responseBody?: SourceCapabilityFieldDefinition[];
  constraints?: SourceCapabilityConstraintDefinition[];
  normalizationBlockedReason?: string;
  sourceReferences: Array<{
    sourceType: string;
    sourcePath: string;
    sourceCoverage?: string;
  }>;
}
