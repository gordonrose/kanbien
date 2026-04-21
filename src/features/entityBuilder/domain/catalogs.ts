import type { EntityDefinitionExportedValidationRuleResponse } from "../contract/types";

export type AttributeKind = "persisted" | "computed";
export type AttributeType =
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
export type ValueCardinality = "single" | "multiple";
export type ValidationRuleKey =
  | "required"
  | "min_length"
  | "max_length"
  | "pattern"
  | "enum_membership"
  | "type_format";

export interface FormPatternCompatibility {
  patternKey: string;
  supportedAttributeKinds: AttributeKind[];
  supportedAttributeTypes: AttributeType[];
  supportedCardinality: ValueCardinality[];
}

export const ATTRIBUTE_KIND_CATALOG: AttributeKind[] = ["persisted", "computed"];

export const ATTRIBUTE_TYPE_CATALOG: AttributeType[] = [
  "string",
  "text",
  "boolean",
  "integer",
  "decimal",
  "uuid",
  "email",
  "url",
  "date",
  "datetime",
  "enum",
  "coordinates",
];

export const VALUE_CARDINALITY_CATALOG: ValueCardinality[] = ["single", "multiple"];

export const VALIDATION_RULE_CATALOG: ValidationRuleKey[] = [
  "required",
  "min_length",
  "max_length",
  "pattern",
  "enum_membership",
  "type_format",
];

export const FORM_PATTERN_CATALOG: FormPatternCompatibility[] = [
  {
    patternKey: "form-template.text-input",
    supportedAttributeKinds: ["persisted", "computed"],
    supportedAttributeTypes: ["string", "uuid", "email", "url"],
    supportedCardinality: ["single"],
  },
  {
    patternKey: "form-template.textarea",
    supportedAttributeKinds: ["persisted", "computed"],
    supportedAttributeTypes: ["text"],
    supportedCardinality: ["single"],
  },
  {
    patternKey: "simple-select.single",
    supportedAttributeKinds: ["persisted", "computed"],
    supportedAttributeTypes: ["enum"],
    supportedCardinality: ["single"],
  },
  {
    patternKey: "date-picker.single-date",
    supportedAttributeKinds: ["persisted", "computed"],
    supportedAttributeTypes: ["date"],
    supportedCardinality: ["single"],
  },
  {
    patternKey: "time-picker.single-time",
    supportedAttributeKinds: ["persisted", "computed"],
    supportedAttributeTypes: ["datetime"],
    supportedCardinality: ["single"],
  },
  {
    patternKey: "drawer-select.multi-select",
    supportedAttributeKinds: ["persisted", "computed"],
    supportedAttributeTypes: ["enum"],
    supportedCardinality: ["multiple"],
  },
];

export function getDefaultValidationRulesForType(
  attributeType: AttributeType,
): EntityDefinitionExportedValidationRuleResponse[] {
  switch (attributeType) {
    case "uuid":
    case "email":
    case "url":
    case "date":
    case "datetime":
    case "coordinates":
      return [
        {
          ruleKey: "type_format",
          argumentType: "string",
          stringValue: attributeType,
          integerValue: null,
          decimalValue: null,
          booleanValue: null,
          errorMessage: null,
        },
      ];
    default:
      return [];
  }
}

export function getSuggestedDefaultFormPatternKey(
  attributeType: AttributeType,
  valueCardinality: ValueCardinality,
): string | null {
  if (attributeType === "enum") {
    return valueCardinality === "multiple"
      ? "drawer-select.multi-select"
      : "simple-select.single";
  }

  if (attributeType === "text") {
    return "form-template.textarea";
  }

  if (["string", "uuid", "email", "url"].includes(attributeType)) {
    return "form-template.text-input";
  }

  if (attributeType === "date" && valueCardinality === "single") {
    return "date-picker.single-date";
  }

  if (attributeType === "datetime" && valueCardinality === "single") {
    return "time-picker.single-time";
  }

  return null;
}
