export interface ValidationIssueResponse {
  field: string;
  reason: string;
  message: string;
}

export interface EntityDefinitionValidationRuleResponse {
  ruleKey: string;
  ruleArgumentType: "none" | "string" | "integer" | "decimal" | "boolean";
  ruleArgumentString: string | null;
  ruleArgumentInteger: number | null;
  ruleArgumentDecimal: number | null;
  ruleArgumentBoolean: boolean | null;
  errorMessage: string | null;
  displayOrder: number;
}

export interface EntityDefinitionAttributeOptionResponse {
  optionKey: string;
  label: string;
  description: string | null;
  displayOrder: number;
}

export interface EntityDefinitionAttributeResponse {
  entityDefinitionAttributeId: string;
  attributeKey: string;
  attributeKind: "persisted" | "computed";
  attributeType:
    | "string"
    | "text"
    | "boolean"
    | "integer"
    | "decimal"
    | "uuid"
    | "email"
    | "url"
    | "date"
    | "datetime"
    | "enum"
    | "coordinates";
  valueCardinality: "single" | "multiple";
  label: string;
  description: string;
  helpText: string | null;
  placeholderText: string | null;
  formFacing: boolean;
  defaultFormPatternKey: string | null;
  optionsMode: "none" | "inline" | "catalog_reference";
  optionsCatalogKey: string | null;
  derivationNote: string | null;
  sourceAttributeKeys: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  validationRules: EntityDefinitionValidationRuleResponse[];
  options: EntityDefinitionAttributeOptionResponse[];
}

export interface EntityDefinitionVersionResponse {
  entityDefinitionId: string;
  entityKey: string;
  entityName: string;
  description: string;
  entityDefinitionVersionId: string;
  versionNumber: number;
  status: "draft" | "active" | "superseded" | "archived";
  supersedesVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  activatedAt: string | null;
  supersededAt: string | null;
  archivedAt: string | null;
  attributes: EntityDefinitionAttributeResponse[];
}

export interface EntityDefinitionCurrentResponse extends EntityDefinitionVersionResponse {
  currentVersionId: string | null;
  lineageStatus: "draft" | "active" | "superseded" | "archived";
}

export interface EntityDefinitionListItemResponse {
  entityDefinitionId: string;
  entityKey: string;
  entityName: string;
  status: "draft" | "active" | "superseded" | "archived";
  currentVersionId: string | null;
  currentVersionNumber: number | null;
  updatedAt: string;
  exportable: boolean;
}

export interface EntityDefinitionListResponse {
  items: EntityDefinitionListItemResponse[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalMatchingRecords: number;
}

export interface EntityAttributeTypeCatalogEntryResponse {
  attributeKind: "persisted" | "computed";
  attributeType:
    | "string"
    | "text"
    | "boolean"
    | "integer"
    | "decimal"
    | "uuid"
    | "email"
    | "url"
    | "date"
    | "datetime"
    | "enum"
    | "coordinates";
  valueCardinality: "single" | "multiple";
  defaultValidationRuleKeys: string[];
  suggestedDefaultFormPatternKey: string | null;
}

export interface FormPatternCatalogEntryResponse {
  patternKey: string;
  status: "approved";
  supportedAttributeKinds: Array<"persisted" | "computed">;
  supportedAttributeTypes: string[];
  supportedCardinality: Array<"single" | "multiple">;
}

export interface EntityDefinitionValidationResponse {
  passFailState: "pass" | "fail";
  activationEligibility: boolean;
  exportEligibility: boolean;
  blockingIssues: ValidationIssueResponse[];
  warnings: ValidationIssueResponse[];
}

export interface EntityDefinitionExportedValidationRuleResponse {
  ruleKey: string;
  argumentType: "none" | "string" | "integer" | "decimal" | "boolean";
  stringValue: string | null;
  integerValue: number | null;
  decimalValue: number | null;
  booleanValue: boolean | null;
  errorMessage: string | null;
}

export interface EntityDefinitionExportedAttributeResponse {
  attributeKey: string;
  attributeKind: "persisted" | "computed";
  attributeType: string;
  valueCardinality: "single" | "multiple";
  label: string;
  description: string;
  helpText: string | null;
  placeholderText: string | null;
  formFacing: boolean;
  defaultFormPatternKey: string | null;
  optionsMode: "none" | "inline" | "catalog_reference";
  optionsCatalogKey: string | null;
  options: EntityDefinitionAttributeOptionResponse[];
  derivationNote: string | null;
  sourceAttributeKeys: string[];
  validationRules: EntityDefinitionValidationRuleResponse[];
  effectiveValidationRules: EntityDefinitionExportedValidationRuleResponse[];
}

export interface EntityDefinitionExportedVersionResponse {
  entityKey: string;
  entityName: string;
  description: string;
  entityDefinitionVersionId: string;
  versionNumber: number;
  status: "draft" | "active" | "superseded" | "archived";
  exportedAt: string;
  attributes: EntityDefinitionExportedAttributeResponse[];
}

export interface EntityDefinitionExportResponse {
  exportFormatVersion: 1;
  items: EntityDefinitionExportedVersionResponse[];
}
