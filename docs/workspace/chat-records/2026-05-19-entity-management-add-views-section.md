# Entity Management Add Views Section

## Date

2026-05-19

## Status

recorded

## Conversation Scope

The conversation covered the design-system-only addition of the entity
management `Views` primary region for
`/design-system/templates/entity_management_page`, then expanded into the
adjacent workflow concepts needed for a usable view definition skeleton.

The working surface was the entity-management page template that reuses the
record-management list-centric/detail drawer pattern as a full-page entity
template.

## Related Commit

- Commit: `1eb0f4615311d89ddc15495806df8724697af10a`
- Subject: `Build entity workflow and view template skeletons`
- Branch recorded by registry: `task/entity-management-views-region`

Commit `1eb0f46` is the source-code evidence that the discussed concepts were
materialized in the design-system page. This chat record supplies the missing
conversation evidence for why the `Views` and `Workflows` skeletons took that
shape.

## Decisions Made

- Replace the second primary entity-management region with `Views`.
- Treat a view as the answer to who can access an entity, where they find it,
  and how it behaves.
- Use a secondary list of view definitions, with an add affordance for adding
  more views.
- A view has editable name and description fields, and those values drive the
  secondary card label and subtitle.
- View location includes app, module, parent page, route name, route preview,
  and later page-template selection.
- View access includes role selection, boundary relationships, object and
  object-capacity selectors, with tenant as a hard current-context boundary.
- View workflow selection is a single workflow selector, with per-status
  visibility controls for which statuses appear in the view.
- View actions are split into primary and secondary action selections, ordered
  by selection priority.
- View display evolved toward page-template-specific display settings:
  `record_management_list_centric` supports list display plus drawer display;
  `record_management_page` supports drawer display.
- Workflows were added as a primary region before Views so views can reference
  workflow definitions.
- Workflow definitions use a secondary list, add/copy/delete actions, name and
  description, and a workflow builder with base status, ordered statuses, links,
  sub-workflow mapping, and parent-status mapping.
- Relationships, attributes, catalogs, placements/display, permissions, action
  models, generation, compliance, and migration were identified as follow-on
  entity-management regions, but not all were part of the original Add Views
  slice.

## Approval Posture

Gordon reviewed and approved the design direction iteratively for the
design-system skeleton by accepting the workflow/view concepts and asking to
promote and push the work after the view/workflow slice.

This should not be read as final approval of the persistent entity-definition
schema, runtime behavior, authorization model, migration contract, or production
capability set. The approval posture is direction-approved for the
design-system entity-management template and reference-backed placeholder rows,
with persistent model promotion still requiring review.

## Registry Rows Supported

This record supports the registry rows tagged with:

- `entity_management_views_region_commit_1eb0f46`
- `add_views_codex_chat_record_2026_05_19`

Affected review lanes:

- `workflow`
- `view_display`

The record supports changing those rows from
`commit_timed_chat_transcript_pending` to `chat_and_commit_timed`.

When combined with
`docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`,
the chat record supports treating the affected rows as
`reference_backed_placeholder`: they have design-system source evidence,
conversation rationale, and May 17 reference guidance for field-complete entity
definition structure, but they are not yet persistent entity-builder truth.

## Unresolved Follow-Ups

- Decide which view/workflow fields become canonical persistent
  entity-definition fields.
- Bind drawer selects to real runtime catalogs for apps, modules, pages, roles,
  relationships, workflows, placements, capabilities, and attributes.
- Define durable migration from repo/design-system placeholders into persistent
  entity-definition records.
- Complete source-authority, versioning/lifecycle, evidence, and action-model
  semantics before using the model as production truth.
- Reconcile generated registry rows against human-approved source evidence
  before promotion out of placeholder posture.

## Artifact Impact

- Updates the entity-management evidence registry by replacing the pending Add
  Views chat evidence key with this chat-record path.
- Supports `chat_and_commit_timed` timing posture for the affected
  workflow/view-display rows.
- Supports `reference_backed_placeholder` promotion readiness for the affected
  rows when paired with the May 17 attribute reference.
