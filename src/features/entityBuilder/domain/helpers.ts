import { randomUUID } from "node:crypto";
import type { EntityDefinitionValidationResultData } from "./types";
import {
  FORM_PATTERN_CATALOG,
  getDefaultValidationRulesForType,
  getSuggestedDefaultFormPatternKey,
} from "./catalogs";
import { EntityAttributeInvalidShapeError } from "../contract/errors";
import type { EntityDefinitionVersionData } from "./types";

export function createEntityBuilderId(): string {
  return randomUUID();
}

export function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

export function compareByDisplayOrder<T extends { displayOrder: number }>(left: T, right: T): number {
  return left.displayOrder - right.displayOrder;
}

export function isFormPatternCompatible(input: {
  patternKey: string;
  attributeKind: string;
  attributeType: string;
  valueCardinality: string;
}): boolean {
  const pattern = FORM_PATTERN_CATALOG.find((entry) => entry.patternKey === input.patternKey);
  if (!pattern) {
    return false;
  }

  return (
    pattern.supportedAttributeKinds.includes(input.attributeKind as never) &&
    pattern.supportedAttributeTypes.includes(input.attributeType as never) &&
    pattern.supportedCardinality.includes(input.valueCardinality as never)
  );
}

export function resolveEffectiveValidationRules(
  version: EntityDefinitionVersionData,
): Map<string, ReturnType<typeof getDefaultValidationRulesForType>> {
  const effectiveRules = new Map<string, ReturnType<typeof getDefaultValidationRulesForType>>();

  for (const attribute of version.attributes) {
    const defaults = getDefaultValidationRulesForType(attribute.attributeType);
    const explicit = attribute.validationRules.map((rule) => ({
      ruleKey: rule.ruleKey,
      argumentType: rule.ruleArgumentType,
      stringValue: rule.ruleArgumentString,
      integerValue: rule.ruleArgumentInteger,
      decimalValue: rule.ruleArgumentDecimal,
      booleanValue: rule.ruleArgumentBoolean,
      errorMessage: rule.errorMessage,
    }));
    const combined = [...defaults];
    for (const rule of explicit) {
      const existingIndex = combined.findIndex((entry) => entry.ruleKey === rule.ruleKey);
      if (existingIndex >= 0) {
        combined.splice(existingIndex, 1, rule);
      } else {
        combined.push(rule);
      }
    }
    effectiveRules.set(attribute.attributeKey, combined);
  }

  return effectiveRules;
}

export function validateEntityDefinitionVersion(
  version: EntityDefinitionVersionData,
): EntityDefinitionValidationResultData {
  const blockingIssues: EntityDefinitionValidationResultData["blockingIssues"] = [];
  const warnings: EntityDefinitionValidationResultData["warnings"] = [];

  if (version.attributes.length === 0) {
    blockingIssues.push({
      field: "attributes",
      reason: "empty_version",
      message: "At least one attribute is required before a version can activate or export.",
    });
  }

  const attributeKeys = new Set<string>();
  for (const attribute of version.attributes) {
    if (attributeKeys.has(attribute.attributeKey)) {
      blockingIssues.push({
        field: "attributeKey",
        reason: "duplicate_attribute_key",
        message: `Attribute key ${attribute.attributeKey} is duplicated in this version.`,
      });
    }
    attributeKeys.add(attribute.attributeKey);

    if (attribute.formFacing && !attribute.defaultFormPatternKey) {
      blockingIssues.push({
        field: "defaultFormPatternKey",
        reason: "missing_default_form_pattern",
        message: `Form-facing attribute ${attribute.attributeKey} requires a default form pattern.`,
      });
    }

    if (
      attribute.formFacing &&
      attribute.defaultFormPatternKey &&
      !isFormPatternCompatible({
        patternKey: attribute.defaultFormPatternKey,
        attributeKind: attribute.attributeKind,
        attributeType: attribute.attributeType,
        valueCardinality: attribute.valueCardinality,
      })
    ) {
      blockingIssues.push({
        field: "defaultFormPatternKey",
        reason: "incompatible_form_pattern",
        message: `Form pattern ${attribute.defaultFormPatternKey} is not compatible with attribute ${attribute.attributeKey}.`,
      });
    }

    if (attribute.attributeKind === "computed") {
      if (!attribute.derivationNote) {
        blockingIssues.push({
          field: "derivationNote",
          reason: "missing_derivation_note",
          message: `Computed attribute ${attribute.attributeKey} requires a derivation note.`,
        });
      }
      if (attribute.sourceAttributeKeys.length === 0) {
        blockingIssues.push({
          field: "sourceAttributeKeys",
          reason: "missing_source_attribute_keys",
          message: `Computed attribute ${attribute.attributeKey} requires at least one source attribute key.`,
        });
      }
      for (const sourceAttributeKey of attribute.sourceAttributeKeys) {
        if (!attributeKeys.has(sourceAttributeKey) && !version.attributes.some((item) => item.attributeKey === sourceAttributeKey)) {
          blockingIssues.push({
            field: "sourceAttributeKeys",
            reason: "source_attribute_not_found",
            message: `Computed attribute ${attribute.attributeKey} references unknown source attribute ${sourceAttributeKey}.`,
          });
        }
      }
    }

    if (attribute.attributeType === "enum") {
      if (attribute.optionsMode === "none") {
        blockingIssues.push({
          field: "optionsMode",
          reason: "missing_enum_options",
          message: `Enum attribute ${attribute.attributeKey} requires inline options or a catalog reference.`,
        });
      }
      const expectedPattern = getSuggestedDefaultFormPatternKey(
        attribute.attributeType,
        attribute.valueCardinality,
      );
      if (
        attribute.formFacing &&
        attribute.defaultFormPatternKey &&
        expectedPattern &&
        attribute.defaultFormPatternKey !== expectedPattern
      ) {
        warnings.push({
          field: "defaultFormPatternKey",
          reason: "non_default_pattern",
          message: `Attribute ${attribute.attributeKey} overrides the suggested default pattern ${expectedPattern}.`,
        });
      }
    }
  }

  return {
    passFailState: blockingIssues.length === 0 ? "pass" : "fail",
    activationEligibility: blockingIssues.length === 0,
    exportEligibility: blockingIssues.length === 0,
    blockingIssues,
    warnings,
  };
}

export function assertDraftVersion(version: EntityDefinitionVersionData): void {
  if (version.status !== "draft") {
    throw new EntityAttributeInvalidShapeError({
      field: "status",
      reason: "version_not_draft",
    });
  }
}
