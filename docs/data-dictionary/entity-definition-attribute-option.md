# Entity Definition Attribute Option

## Summary

- Description: Inline bounded option row for one entity-definition attribute.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_attribute_option`, `EntityDefinitionOptionRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `entity_definition_attribute_option`
- Related durable records:
  `entity_definition_attribute`
- Primary key: `entity_definition_attribute_option_id`

## Fields

- `option_key`
  Type / Shape: `TEXT`
  Description: Stable machine key for the inline option.
- `label`
  Type / Shape: `TEXT`
  Description: Human-readable label for the option.
- `description`
  Type / Shape: `TEXT | NULL`
  Description: Optional option guidance text.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Deterministic ordering among options for one attribute.

## Indexes And Constraints

- `uq_entity_definition_attribute_option_key`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_attribute_id, option_key)`.
- `uq_entity_definition_attribute_option_order`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_attribute_id, display_order)`.

## Notes

- Inline options are one bounded option posture in v1.
- Reusable options-catalog management is a future feature loop.
