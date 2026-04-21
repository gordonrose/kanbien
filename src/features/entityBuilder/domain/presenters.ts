import type {
  EntityAttributeTypeCatalogEntryResponse,
  EntityDefinitionAttributeOptionResponse,
  EntityDefinitionAttributeResponse,
  EntityDefinitionCurrentResponse,
  EntityDefinitionExportResponse,
  EntityDefinitionExportedAttributeResponse,
  EntityDefinitionListItemResponse,
  EntityDefinitionListResponse,
  EntityDefinitionValidationResponse,
  EntityDefinitionValidationRuleResponse,
  EntityDefinitionVersionResponse,
  FormPatternCatalogEntryResponse,
} from "../contract/types";
import {
  FORM_PATTERN_CATALOG,
  ATTRIBUTE_KIND_CATALOG,
  ATTRIBUTE_TYPE_CATALOG,
  VALUE_CARDINALITY_CATALOG,
  getSuggestedDefaultFormPatternKey,
} from "./catalogs";
import type {
  EntityDefinitionListItemData,
  EntityDefinitionListResultData,
  EntityDefinitionValidationResultData,
  EntityDefinitionVersionData,
} from "./types";
import { resolveEffectiveValidationRules } from "./helpers";

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function toValidationRule(rule: EntityDefinitionVersionData["attributes"][number]["validationRules"][number]): EntityDefinitionValidationRuleResponse {
  return {
    ruleKey: rule.ruleKey,
    ruleArgumentType: rule.ruleArgumentType,
    ruleArgumentString: rule.ruleArgumentString,
    ruleArgumentInteger: rule.ruleArgumentInteger,
    ruleArgumentDecimal: rule.ruleArgumentDecimal,
    ruleArgumentBoolean: rule.ruleArgumentBoolean,
    errorMessage: rule.errorMessage,
    displayOrder: rule.displayOrder,
  };
}

function toOption(
  option: EntityDefinitionVersionData["attributes"][number]["options"][number],
): EntityDefinitionAttributeOptionResponse {
  return {
    optionKey: option.optionKey,
    label: option.label,
    description: option.description,
    displayOrder: option.displayOrder,
  };
}

function toAttribute(attribute: EntityDefinitionVersionData["attributes"][number]): EntityDefinitionAttributeResponse {
  return {
    entityDefinitionAttributeId: attribute.entityDefinitionAttributeId,
    attributeKey: attribute.attributeKey,
    attributeKind: attribute.attributeKind,
    attributeType: attribute.attributeType,
    valueCardinality: attribute.valueCardinality,
    label: attribute.label,
    description: attribute.description,
    helpText: attribute.helpText,
    placeholderText: attribute.placeholderText,
    formFacing: attribute.formFacing,
    defaultFormPatternKey: attribute.defaultFormPatternKey,
    optionsMode: attribute.optionsMode,
    optionsCatalogKey: attribute.optionsCatalogKey,
    derivationNote: attribute.derivationNote,
    sourceAttributeKeys: attribute.sourceAttributeKeys,
    displayOrder: attribute.displayOrder,
    createdAt: attribute.createdAt.toISOString(),
    updatedAt: attribute.updatedAt.toISOString(),
    validationRules: [...attribute.validationRules].sort((a, b) => a.displayOrder - b.displayOrder).map(toValidationRule),
    options: [...attribute.options].sort((a, b) => a.displayOrder - b.displayOrder).map(toOption),
  };
}

function toVersionBase(version: EntityDefinitionVersionData): EntityDefinitionVersionResponse {
  return {
    entityDefinitionId: version.entityDefinitionId,
    entityKey: version.entityKey,
    entityName: version.entityName,
    description: version.description,
    entityDefinitionVersionId: version.entityDefinitionVersionId,
    versionNumber: version.versionNumber,
    status: version.status,
    supersedesVersionId: version.supersedesVersionId,
    createdAt: version.createdAt.toISOString(),
    updatedAt: version.updatedAt.toISOString(),
    activatedAt: toIsoString(version.activatedAt),
    supersededAt: toIsoString(version.supersededAt),
    archivedAt: toIsoString(version.archivedAt),
    attributes: [...version.attributes].sort((a, b) => a.displayOrder - b.displayOrder).map(toAttribute),
  };
}

export function toEntityDefinitionCurrent(
  version: EntityDefinitionVersionData,
): EntityDefinitionCurrentResponse {
  return {
    ...toVersionBase(version),
    currentVersionId: version.currentVersionId,
    lineageStatus: version.lineageStatus,
  };
}

export function toEntityDefinitionVersion(
  version: EntityDefinitionVersionData,
): EntityDefinitionVersionResponse {
  return toVersionBase(version);
}

export function toEntityDefinitionListItem(
  item: EntityDefinitionListItemData,
): EntityDefinitionListItemResponse {
  return {
    entityDefinitionId: item.entityDefinitionId,
    entityKey: item.entityKey,
    entityName: item.entityName,
    status: item.status,
    currentVersionId: item.currentVersionId,
    currentVersionNumber: item.currentVersionNumber,
    updatedAt: item.updatedAt.toISOString(),
    exportable: item.exportable,
  };
}

export function toEntityDefinitionListResponse(
  result: EntityDefinitionListResultData,
  page: number,
  pageSize: number,
): EntityDefinitionListResponse {
  return {
    items: result.items.map(toEntityDefinitionListItem),
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / pageSize)),
    totalMatchingRecords: result.totalMatchingRecords,
  };
}

export function toEntityAttributeTypeCatalog(): EntityAttributeTypeCatalogEntryResponse[] {
  const entries: EntityAttributeTypeCatalogEntryResponse[] = [];

  for (const attributeKind of ATTRIBUTE_KIND_CATALOG) {
    for (const attributeType of ATTRIBUTE_TYPE_CATALOG) {
      for (const valueCardinality of VALUE_CARDINALITY_CATALOG) {
        entries.push({
          attributeKind,
          attributeType,
          valueCardinality,
          defaultValidationRuleKeys:
            ["uuid", "email", "url", "date", "datetime", "coordinates"].includes(attributeType)
              ? ["type_format"]
              : attributeType === "enum"
                ? ["enum_membership"]
                : [],
          suggestedDefaultFormPatternKey: getSuggestedDefaultFormPatternKey(
            attributeType,
            valueCardinality,
          ),
        });
      }
    }
  }

  return entries;
}

export function toFormPatternCatalog(): FormPatternCatalogEntryResponse[] {
  return FORM_PATTERN_CATALOG.map((entry) => ({
    patternKey: entry.patternKey,
    status: "approved",
    supportedAttributeKinds: entry.supportedAttributeKinds,
    supportedAttributeTypes: entry.supportedAttributeTypes,
    supportedCardinality: entry.supportedCardinality,
  }));
}

export function toValidationResponse(
  result: EntityDefinitionValidationResultData,
): EntityDefinitionValidationResponse {
  return result;
}

export function toEntityDefinitionExport(
  versions: EntityDefinitionVersionData[],
): EntityDefinitionExportResponse {
  return {
    exportFormatVersion: 1,
    items: versions.map((version) => {
      const effectiveRules = resolveEffectiveValidationRules(version);
      const attributes: EntityDefinitionExportedAttributeResponse[] = [...version.attributes]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((attribute) => ({
          attributeKey: attribute.attributeKey,
          attributeKind: attribute.attributeKind,
          attributeType: attribute.attributeType,
          valueCardinality: attribute.valueCardinality,
          label: attribute.label,
          description: attribute.description,
          helpText: attribute.helpText,
          placeholderText: attribute.placeholderText,
          formFacing: attribute.formFacing,
          defaultFormPatternKey: attribute.defaultFormPatternKey,
          optionsMode: attribute.optionsMode,
          optionsCatalogKey: attribute.optionsCatalogKey,
          options: [...attribute.options].sort((a, b) => a.displayOrder - b.displayOrder).map(toOption),
          derivationNote: attribute.derivationNote,
          sourceAttributeKeys: attribute.sourceAttributeKeys,
          validationRules: [...attribute.validationRules].sort((a, b) => a.displayOrder - b.displayOrder).map(toValidationRule),
          effectiveValidationRules: effectiveRules.get(attribute.attributeKey) ?? [],
        }));

      return {
        entityKey: version.entityKey,
        entityName: version.entityName,
        description: version.description,
        entityDefinitionVersionId: version.entityDefinitionVersionId,
        versionNumber: version.versionNumber,
        status: version.status,
        exportedAt: new Date().toISOString(),
        attributes,
      };
    }),
  };
}
