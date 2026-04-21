# Entity Definition Attribute Validation Rule

## Summary

- Description: Typed validation-rule row owned by one entity-definition
  attribute.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_attribute_validation_rule`,
  `EntityDefinitionValidationRuleRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record:
  `entity_definition_attribute_validation_rule`
- Related durable records:
  `entity_definition_attribute`
- Primary key: `entity_definition_attribute_validation_rule_id`

## Fields

- `rule_key`
  Type / Shape:
  `'required' | 'min_length' | 'max_length' | 'pattern' | 'enum_membership' | 'type_format'`
  Description: Approved validation-rule key.
- `rule_argument_type`
  Type / Shape: `'none' | 'string' | 'integer' | 'decimal' | 'boolean'`
  Description: Declared argument type for the rule.
- `rule_argument_string`, `rule_argument_integer`, `rule_argument_decimal`, `rule_argument_boolean`
  Type / Shape: typed nullable columns
  Description: Explicit typed argument storage.
- `error_message`
  Type / Shape: `TEXT | NULL`
  Description: Optional override message.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Stable ordering among validation rules for one attribute.

## Indexes And Constraints

- `uq_entity_definition_attribute_rule_order`
  Type: `unique`
  Definition / Rule: Unique on
  `(entity_definition_attribute_id, rule_key, display_order)`.

## Notes

- The feature intentionally uses explicit typed columns rather than a generic
  JSON metadata blob for validation-rule arguments.
