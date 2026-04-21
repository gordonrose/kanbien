import type {
  AttributeKind,
  AttributeType,
  ValueCardinality,
  ValidationRuleKey,
} from "./catalogs";

export type EntityDefinitionStatus = "draft" | "active" | "superseded" | "archived";

export interface EntityDefinitionValidationRuleData {
  entityDefinitionAttributeValidationRuleId: string;
  ruleKey: ValidationRuleKey;
  ruleArgumentType: "none" | "string" | "integer" | "decimal" | "boolean";
  ruleArgumentString: string | null;
  ruleArgumentInteger: number | null;
  ruleArgumentDecimal: number | null;
  ruleArgumentBoolean: boolean | null;
  errorMessage: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityDefinitionAttributeOptionData {
  entityDefinitionAttributeOptionId: string;
  optionKey: string;
  label: string;
  description: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityDefinitionAttributeData {
  entityDefinitionAttributeId: string;
  attributeKey: string;
  attributeKind: AttributeKind;
  attributeType: AttributeType;
  valueCardinality: ValueCardinality;
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
  createdAt: Date;
  updatedAt: Date;
  validationRules: EntityDefinitionValidationRuleData[];
  options: EntityDefinitionAttributeOptionData[];
}

export interface EntityDefinitionVersionData {
  entityDefinitionId: string;
  entityKey: string;
  entityName: string;
  description: string;
  currentVersionId: string | null;
  lineageStatus: EntityDefinitionStatus;
  entityDefinitionVersionId: string;
  versionNumber: number;
  status: EntityDefinitionStatus;
  supersedesVersionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  activatedAt: Date | null;
  supersededAt: Date | null;
  archivedAt: Date | null;
  attributes: EntityDefinitionAttributeData[];
}

export interface EntityDefinitionListInput {
  page: number;
  pageSize: number;
  orderBy: "entityKey" | "entityName" | "updatedAt";
  orderDirection: "asc" | "desc";
  filters: {
    entityKeyPrefix?: string;
    entityNamePrefix?: string;
    status?: EntityDefinitionStatus;
  };
}

export interface EntityDefinitionListItemData {
  entityDefinitionId: string;
  entityKey: string;
  entityName: string;
  status: EntityDefinitionStatus;
  currentVersionId: string | null;
  currentVersionNumber: number | null;
  updatedAt: Date;
  exportable: boolean;
}

export interface EntityDefinitionListResultData {
  items: EntityDefinitionListItemData[];
  totalMatchingRecords: number;
}

export interface EntityDefinitionAttributeInput {
  attributeKey: string;
  attributeKind: AttributeKind;
  attributeType: AttributeType;
  valueCardinality: ValueCardinality;
  label: string;
  description: string;
  helpText?: string;
  placeholderText?: string;
  formFacing: boolean;
  defaultFormPatternKey?: string;
  optionsMode: "none" | "inline" | "catalog_reference";
  optionsCatalogKey?: string;
  derivationNote?: string;
  sourceAttributeKeys: string[];
  displayOrder: number;
  validationRules: Array<{
    ruleKey: ValidationRuleKey;
    ruleArgumentType: "none" | "string" | "integer" | "decimal" | "boolean";
    ruleArgumentString?: string;
    ruleArgumentInteger?: number;
    ruleArgumentDecimal?: number;
    ruleArgumentBoolean?: boolean;
    errorMessage?: string;
    displayOrder: number;
  }>;
  options: Array<{
    optionKey: string;
    label: string;
    description?: string;
    displayOrder: number;
  }>;
}

export interface CreateEntityDefinitionVersionInput {
  entityKey: string;
  entityName: string;
  description: string;
  status: "draft" | "active";
  attributes: EntityDefinitionAttributeInput[];
}

export interface UpdateEntityDefinitionVersionInput {
  entityDefinitionVersionId: string;
  entityName?: string;
  description?: string;
  status?: "draft" | "active";
  attributes?: EntityDefinitionAttributeInput[];
}

export interface GetEntityDefinitionCurrentInput {
  entityKey: string;
}

export interface GetEntityDefinitionVersionInput {
  entityDefinitionVersionId: string;
}

export interface ExportEntityDefinitionsInput {
  entityDefinitionVersionIds?: string[];
  entityKeys?: string[];
}

export interface ValidationIssue {
  field: string;
  reason: string;
  message: string;
}

export interface EntityDefinitionValidationResultData {
  passFailState: "pass" | "fail";
  activationEligibility: boolean;
  exportEligibility: boolean;
  blockingIssues: ValidationIssue[];
  warnings: ValidationIssue[];
}
