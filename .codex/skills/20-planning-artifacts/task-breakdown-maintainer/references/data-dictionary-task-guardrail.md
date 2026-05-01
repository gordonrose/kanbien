# Data Dictionary Task Guardrail

Use for task type: `DOC:data-dictionary`

## Must Preserve

- durable entity facts, normalized fields, lifecycle fields, soft-delete
  posture, uniqueness, indexes, and retention behavior
- source-independent persistence truth stays aligned with migrations and code

## Approval Evidence

- entity or table affected
- source files and migrations reviewed
- field/index/lifecycle changes
- validation or docs-alignment proof

## Deep Delivery Standard

- one entity, durable fact group, lifecycle rule, or index/searchability
  decision per queued task
- split data dictionary refresh from migration or repository implementation
  when the source-truth review and code change have distinct proof
- name the exact entity docs, migrations, repositories, and validation proof

## Required Check IDs

- `data-entity-table`
- `data-source-reviewed`
- `data-field-index-lifecycle`
- `data-durable-facts`
- `data-validation-proof`
