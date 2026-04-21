# Entity Definition Attribute Source Link

## Summary

- Description: Ordered dependency row linking a computed attribute to one
  source attribute key in the same version.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_attribute_source_link`, `EntityDefinitionSourceLinkRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `entity_definition_attribute_source_link`
- Related durable records:
  `entity_definition_attribute`
- Primary key: `entity_definition_attribute_source_link_id`

## Fields

- `source_attribute_key`
  Type / Shape: `TEXT`
  Description: Stable attribute key that the computed attribute depends on.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Ordered dependency position.

## Indexes And Constraints

- `uq_entity_definition_attribute_source_link_key`
  Type: `unique`
  Definition / Rule: Unique on
  `(entity_definition_attribute_id, source_attribute_key)`.
- `uq_entity_definition_attribute_source_link_order`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_attribute_id, display_order)`.

## Notes

- v1 limits source dependencies to attributes inside the same entity-definition
  version.
- This row stores dependency truth, not a full expression language.
