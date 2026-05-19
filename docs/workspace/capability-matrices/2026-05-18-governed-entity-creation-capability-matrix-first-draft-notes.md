# Governed Entity Creation Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-05-18-governed-entity-creation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-05-18-governed-entity-creation-capability-matrix-first-draft.csv)
- Slice review:
  [2026-05-18-governed-entity-creation-capability-matrix-slice-review.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-05-18-governed-entity-creation-capability-matrix-slice-review.md)

## Planning Status

- Status: first draft
- Date: 2026-05-18
- Scope: governed entity-definition creation, maintenance, generated/default
  management page setup, staged visibility, and signoff
- Implementation status: not started
- Runtime/code changes: none

This is a planning matrix. It is not a PRD, implementation blueprint, API
contract, migration, runtime permission mapping, or design-system signoff.

## Upstream Truth For This Matrix

Primary sources:

- [2026-05-17-governed-entity-definition-schema-formalization.md](/home/gordon/kanbien/docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md)
- [2026-05-18-governed-entity-definition-creation-and-maintenance.md](/home/gordon/kanbien/docs/workspace/product-discovery/2026-05-18-governed-entity-definition-creation-and-maintenance.md)
- [2026-05-18-governed-entity-definition-starter-default-catalog.md](/home/gordon/kanbien/docs/workspace/product-discovery/2026-05-18-governed-entity-definition-starter-default-catalog.md)
- [2026-05-18-governed-entity-definition-page-materialization.md](/home/gordon/kanbien/docs/workspace/product-discovery/2026-05-18-governed-entity-definition-page-materialization.md)
- [2026-05-18-governed-entity-definition-access-and-promotion.md](/home/gordon/kanbien/docs/workspace/product-discovery/2026-05-18-governed-entity-definition-access-and-promotion.md)

Compatibility anchor:

- [2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-entity-builder-foundation-capability-matrix-first-draft.csv)

## Matrix Posture

This matrix starts from the exhaustive entity-related capability baseline in the
schema formalization artifact:

- managed-record capabilities
- relationship capabilities
- collection-view capabilities
- definition lifecycle capabilities
- definition-structure edit capabilities
- generation capabilities

It then layers in complementary governance capabilities:

- page materialization preview/apply
- staged page visibility
- visibility promotion and demotion
- role-need capture
- signoff request and signoff record

These newer capabilities complement the baseline. They do not replace or narrow
the managed-record, relationship, definition lifecycle, definition-structure,
or generation capability set.

## Builder-Versus-Generated Capability Boundary

This matrix is for the governed entity-creation system. Its implementation
capabilities should be about reusable builder, registry, validation, guidance,
preview, and materialization logic.

The entity-creation system does not directly implement every runtime
managed-record capability listed here. Instead, it uses the baseline capability
definitions as reusable templates for building, validating, previewing, or
drafting feature-specific seams for different owning features.

In target posture, creating an entity may build or materialize the backend
functionality and UX needed for that entity's runtime feature. The entity
builder defines and produces the runtime feature seam; it does not become the
long-term runtime owner of every generated entity's records and business
behavior.

For example:

- `managed_record_list` is a generated/target feature capability template.
  Entity creation should know how to define, validate, draft, preview, and
  generate the list seam for a specific entity, but the owning feature still
  implements or owns the runtime list behavior.
- `relationship_link` is a generated/target relationship capability template.
  Entity creation should define and validate the relationship contract and
  produce implementation guidance or drafts, but it should not become the
  runtime relationship authority for every feature.
- `definition_attribute_edit`, `collection_view_update`,
  `definition_surface_edit`, and related definition-structure capabilities are
  platform/registry capabilities because they edit the entity shape itself.

The next PRD/capability-matrix refinement should separate rows into two clear
groups:

- **Entity builder/platform capabilities:** capabilities the entity-definition
  system itself must implement, such as guided draft creation, attribute edits,
  view edits, surface placement, validation, export v2, page materialization
  preview, staged visibility, signoff, and generation of feature-seam drafts.
- **Generated feature capability templates:** reusable capability definitions
  that entity creation can apply to a specific entity/feature, such as list,
  read, create, update, archive, relationship link, import, export, and report
  generation. These are not automatically runtime behavior until adopted by the
  owning feature or an approved platform seam. Entity creation may build or
  materialize that feature seam, but the resulting feature owns runtime
  execution once adopted.

The first-draft CSV now includes a `Capability role` column using these two
categories:

| Capability role | Meaning |
| --- | --- |
| `entity_builder_platform_capability` | Logic owned by the entity-definition/builder, registry, generation, materialization, validation, signoff, or governance layer. These capabilities define, edit, validate, preview, export, or materialize entity shape and generated seams. |
| `generated_feature_capability_template` | A reusable target capability template that can be applied to a specific entity and owning feature. Entity creation may draft, validate, preview, or generate the seam, but runtime behavior belongs to the owning feature or approved platform seam once adopted. |

This role categorization complements the earlier schema taxonomy already present
in the matrix:

- `Family` maps to the capability family catalog.
- `Implementation seam` maps to the implementation seam catalog.
- `Authorization posture` and `Capability boundary` should later be refined
  using the authority world, mapping posture, and enforcement posture catalogs.

## Important Assumptions

- Current `entityBuilder` v1 remains the compatibility anchor.
- Full canonical governed entity definitions need an explicit v2 export/read
  shape rather than silent changes to export v1.
- Runtime source generation, database migrations, authorization grants, and
  permission changes remain blocked until explicit future approval.
- Collection views describe intended usage and default view behavior; they do
  not grant runtime access.
- Staged page visibility controls exposure; it does not grant data or action
  access.
- Entity page placement should reference persistent web app hierarchy truth
  where available.
- A generated entity page may create a new page under existing app/module/parent
  context, but a new app or module requires an explicit topology decision.
- Generated/default pages must consume approved design-system/template seams and
  must not invent local app-page CSS, routes, statuses, fields, views, actions,
  or authorization behavior.

## First-Draft Boundaries

Included:

- capability taxonomy and implementation expectations
- validation, compatibility, artifact, and test expectations at planning level
- complementary governance gates for page rollout and signoff
- both builder/platform capabilities and generated feature capability templates

Not yet included:

- concrete API routes
- request/response schemas
- database schema
- OpenAPI updates
- permission key mapping
- exact role vocabulary for collection views
- selected-user/selected-role staging storage owner
- executable tests
- generated page implementation

## Recommended Next Step

Use this matrix to draft the PRD for governed entity-definition creation and
generated management page setup. The PRD should choose the first deliverable
slice and decide which capabilities are in scope for implementation v1, which
remain planning-only, and which are explicitly deferred.

Before PRD drafting, split or annotate the first-draft matrix so it is clear
which rows describe entity-builder/platform logic and which rows describe
generated feature capability templates for owning features.
