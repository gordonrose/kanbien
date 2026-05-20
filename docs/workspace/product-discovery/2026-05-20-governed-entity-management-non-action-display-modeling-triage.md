# Governed Entity Management Non-Action Display And Modeling Triage

Date: 2026-05-20

Scope: triage the non-action display/modeling lanes in the organization demo
evidence registry after deferring action-model evidence upgrades to capability
planning.

This triage covers only:

- `source_authority`
- `relationship`
- `view_display`
- placements rows currently carried inside the `view_display` lane

It intentionally does not promote or reclassify `action_model` rows.

## Evidence Sources

- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
- `docs/workspace/chat-records/2026-05-19-entity-management-add-views-section.md`
- `docs/workspace/design-system/templates/record-management-list-centric-template.md`
- `docs/workspace/design-system/templates/record-management-list-centric-organization-demo-fixture.json`
- `docs/data-dictionary/organization.md`
- `docs/data-dictionary/organization-business-unit.md`
- `docs/data-dictionary/organization-logo-relationship.md`

## Triage Decisions

| Lane or group | Row count | Triage result | Rationale | Human review before promotion |
| --- | ---: | --- | --- | --- |
| `source_authority` | 30 | `reference_backed_placeholder` | The May 17 governed entity-definition model defines entity identity, source authority, owning feature posture, current/target source posture, and evidence posture as explicit entity-definition concepts. The current rendered design-system rows are therefore backed as design-system placeholders, not final persistent truth. | Required. No explicit persistent-truth approval is recorded. |
| `view_display.views.*` | 84 | Keep `reference_backed_placeholder` | The Add Views chat record and commit-backed design-system source support the Views region, access/location/workflow/display direction, and design-system skeleton posture. | Required. Gordon reviewed direction during the design-system loop; this is not final entity-builder approval. |
| `view_display.placements.*` | 25 | `reference_backed_placeholder` | The May 17 model defines placements, presentation groups, scoped display order, interaction/visibility posture, and optional placement. The record-management list-centric template and fixture define drawer/list placement regions that the entity-management Display/placements rows preview. | Required. Exact generated placement contract and persistent schema remain future work. |
| `relationship.relationships.*` | 69 | `reference_backed_placeholder` | The May 17 model defines field-complete relationship metadata, relationship resolution, navigation posture, boundaries, ownership, and lifecycle impact. The record-management fixture includes organization relationships including tenant and business units, and the organization logo relationship data dictionary supports the primary-logo relationship direction. | Required. Relationship entries still need field-by-field human review before becoming persistent entity-builder truth. |

## Rows Remaining System Generated In This Scope

None after this triage pass.

This does not mean the lanes are approved. It only means the rows have enough
source, chat, design-system, or data-dictionary support to move from
`system_generated_placeholder` to `reference_backed_placeholder`.

## Approval Boundary

All affected rows must keep `approvedByActorKey` as `not_approved`.

No explicit final approval exists for these rows as persistent entity-builder
truth. Gordon's feedback in the design-system loop should be treated as review
of direction and interaction shape only.

## Follow-Ups

- Reconcile relationship key casing and category values before persistent schema
  promotion.
- Confirm whether tenant relationship rows represent a top-level relationship,
  a structural boundary, or both.
- Confirm exact placement/display schema after the Display region finishes.
- Keep action-model evidence upgrades deferred until capability-level planning.
