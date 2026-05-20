# Entity Management Attributes Region

## Date

2026-05-19

## Status

recorded

## Conversation Scope

The conversation covered the first design-system-only skeleton for
`/design-system/templates/entity_management_page`, including the entity page
shell, record-management-list-centric reuse, and the early entity-definition
regions that later support the `Attributes` review lane.

The working surface was a governed entity-management page template for an
`Organization` example. The page was built as a full-page entity template inside
the standard shell, not as a production persistent entity-builder workflow.

## Related Branch And Commits

- Primary branch: `task/entity-management-attributes-region`
- Primary commit: `35c89e25ead22c5fe3fe620e44a8449e7b0bf5f9`
- Primary subject: `Extend entity management design-system template`
- Primary committed at: `2026-05-19T19:29:24+01:00`

Commit `35c89e2` is the source-code timing evidence that the richer
attributes-region source data, attribute-definition panels, validation controls,
search posture, privacy/security posture, catalogs, and rendered
attribute-definition controls were materialized in the design-system page.

Precursor context:

- Branch: `docs/governed-entity-definition-v1`
- Commit: `4bf8fd91c22936fd532d377b8edd2284b49c6c1b`
- Subject: `Add entity management design-system page`
- Committed at: `2026-05-19T10:23:29+01:00`

Commit `4bf8fd9` created the initial entity-management design-system page and
planning context that the later Attributes region work extended.

## Decisions Made About The Attributes Region

- Use `/design-system/templates/entity_management_page` as the governed
  design-system proving ground for entity-management page structure.
- Represent the entity example as `Organization` while keeping the page
  explicitly draft and placeholder-backed.
- Include an `Attributes` primary region in the entity page structure so
  attribute-definition decisions can be reviewed as their own lane.
- Model attributes as reusable, field-complete definition slots rather than as
  ad hoc display-only labels.
- Include organization example attributes such as identity, name, type,
  lifecycle status, relationships, asset references, industry, and tier as
  design-system seed data.
- Capture rendered controls for attribute key, labels, descriptions, type,
  cardinality, mutability, requiredness, option/source posture, validation,
  search posture, privacy/security posture, and evidence/generation posture as
  reviewable decision slots.
- Treat evidence mode, edit mode, drawer behavior, mobile behavior, and
  design-drawer stress testing as page-template direction, not as final
  persistent entity-builder semantics.

## Approval Posture

Gordon reviewed and approved the design direction for the entity-management
page template through iterative design-system feedback and later asked to
promote and push the work.

That approval should be read as direction approval for the design-system page
template and its reviewable placeholder structure. It should not be read as
approval of exact persistent entity-builder field values, final attribute
schema, runtime catalogs, validation contracts, migrations, authorization
semantics, or production source-of-truth posture.

Registry rows supported by this record should therefore keep
`approvedByActorKey` as `not_approved` until Gordon explicitly approves the
exact persistent entity-builder truth.

## Relationship To The May 17 Attribute Reference

`docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
defines draft v1 expectations for governed entity-definition attributes and
explicitly states that it is an explanatory reference, not a final
implementation contract.

This chat record, primary commit `35c89e2`, and precursor commit `4bf8fd9`
connect that May 17 reference to the rendered entity-management attributes
region. Together they support treating attribute-definition rows as
`reference_backed_placeholder`: the rows have design-system source evidence,
conversation timing, and reference-model support, but they still need human
approval before becoming persistent entity-builder
truth.

## Registry Rows Supported

This record supports registry rows tagged with:

- `entity_management_attributes_region_commit_35c89e2`
- `attributes_region_codex_chat_record_2026_05_19`
- `governed_entity_definition_attribute_reference_2026_05_17`

Primary supported review lane:

- `attribute_definition`

The record supports changing `attribute_definition` rows from generated
placeholder evidence to `chat_and_commit_timed` decision timing when paired
with the commit evidence source.

## Unresolved Follow-Ups

- Decide which attribute fields become canonical persistent entity-builder
  fields.
- Reconcile organization example attribute values against live source truth,
  data dictionary truth, migrations, API contracts, and future persistent
  entity-definition records.
- Bind option sources, relationship references, asset posture, validation,
  search, privacy, security, and generation controls to runtime catalogs or
  persistent entity-builder records.
- Define migration and compatibility handling before any attribute-definition
  row is promoted out of placeholder posture.
- Complete human review before setting Gordon as approval actor for any exact
  persistent attribute truth.

## Artifact Impact

- Adds a durable conversation record for the initial Attributes region
  direction used by the entity-management evidence registry.
- Supports adding commit and chat decision-timing evidence sources to the
  organization demo evidence registry.
- Supports `chat_and_commit_timed` timing posture for
  `reviewLane: attribute_definition` rows.
- Supports `reference_backed_placeholder` evidence posture and promotion
  readiness for attribute-definition rows when paired with the May 17 attribute
  reference.
- Does not approve final persistent entity-builder truth.
