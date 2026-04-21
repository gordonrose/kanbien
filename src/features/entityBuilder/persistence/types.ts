import type { EntityDefinitionStatus } from "../domain/types";
import type { AttributeKind, AttributeType, ValueCardinality, ValidationRuleKey } from "../domain/catalogs";
import type { EntityDefinitionAttributeInput } from "../domain/types";

export interface EntityDefinitionLineageRecord {
  entity_definition_id: string;
  entity_key: string;
  entity_name: string;
  description: string;
  current_version_id: string | null;
  status: EntityDefinitionStatus;
  created_at: Date;
  updated_at: Date;
  archived_at: Date | null;
}

export interface EntityDefinitionVersionRecord {
  entity_definition_version_id: string;
  entity_definition_id: string;
  version_number: number;
  status: EntityDefinitionStatus;
  supersedes_version_id: string | null;
  created_at: Date;
  updated_at: Date;
  activated_at: Date | null;
  superseded_at: Date | null;
  archived_at: Date | null;
}

export interface EntityDefinitionAttributeRecord {
  entity_definition_attribute_id: string;
  entity_definition_version_id: string;
  attribute_key: string;
  attribute_kind: AttributeKind;
  attribute_type: AttributeType;
  value_cardinality: ValueCardinality;
  label: string;
  description: string;
  help_text: string | null;
  placeholder_text: string | null;
  form_facing: boolean;
  default_form_pattern_key: string | null;
  options_mode: "none" | "inline" | "catalog_reference";
  options_catalog_key: string | null;
  derivation_note: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface EntityDefinitionValidationRuleRecord {
  entity_definition_attribute_validation_rule_id: string;
  entity_definition_attribute_id: string;
  rule_key: ValidationRuleKey;
  rule_argument_type: "none" | "string" | "integer" | "decimal" | "boolean";
  rule_argument_string: string | null;
  rule_argument_integer: number | null;
  rule_argument_decimal: number | null;
  rule_argument_boolean: boolean | null;
  error_message: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface EntityDefinitionOptionRecord {
  entity_definition_attribute_option_id: string;
  entity_definition_attribute_id: string;
  option_key: string;
  label: string;
  description: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface EntityDefinitionSourceLinkRecord {
  entity_definition_attribute_source_link_id: string;
  entity_definition_attribute_id: string;
  source_attribute_key: string;
  display_order: number;
}

export interface CreateEntityDefinitionVersionRecordInput {
  entityDefinitionId: string;
  entityDefinitionVersionId: string;
  entityKey: string;
  entityName: string;
  description: string;
  status: "draft" | "active";
  supersedesVersionId: string | null;
  attributes: EntityDefinitionAttributeInput[];
}
