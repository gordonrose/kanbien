# Governed Entity Management Three-Level Reconciliation

Status:

- `alignment_note`
- Date: 2026-05-20
- Scope: entity page, record list page, and record page relationship
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Capture the clarified three-level model for governed entity management before
more design-system, schema, capability, or implementation work proceeds.

This note reconciles the earlier governed entity-definition discovery work with
the current design-system prototype at:

- `/design-system/templates/entity_management_page`
- `/design-system/templates/record_management_list_centric`

It is not a schema lock, route contract, API contract, generated page approval,
permission mapping, or implementation blueprint.

## Executive Alignment

There are three distinct levels:

| Level | Meaning | Current design-system relation |
| --- | --- | --- |
| Entity Page | The authoring and governance page for defining the entity itself. | Existing `entity_management_page` work is the baseline UX/UI pattern for managing entity structure. |
| Record List Page | The page that lists viewable records for an entity to an approved user. | `record_management_list_centric` is the current list-centric record page template candidate. |
| Record Page | The individual selected-record display/detail surface. | Reuses the same UX/UI pattern as Entity Page, but its displayed content is driven by the entity's view and display configuration. |

Plain-language rule:

> The Entity Page defines and manages the entity. The Record List Page lists
> records for that entity according to approved entity-view instructions. The
> Record Page reuses the Entity Page UX/UI pattern for one selected record, but
> the visible fields, groups, evidence, LLM guidance, and actions are driven by
> the entity's view and display configuration.

## Corrected Template Relationship

The current screenshot and discussion clarify that `entity_management_page` is
not simply the outer list page.

The intended relationship is:

```text
Entity Page
  - manages the entity definition itself
  - defines entity views, display sections, attributes, evidence, guidance,
    capabilities, compliance, and lifecycle posture

Record List Page
  - lists records for one entity
  - uses approved entity-view instructions for visible records, filters,
    statuses, list fields, and available list actions
  - may use the record_management_list_centric template for list-heavy
    management

Record Page
  - displays one selected record
  - may be nested inside the Record List Page selected-record area
  - reuses Entity Page UX/UI patterns
  - renders only the fields, groups, evidence, guidance, and actions approved by
    the selected entity view and display configuration
```

## Ownership Boundaries

### Entity Page Owns

- entity identity and purpose
- source authority and evidence posture
- attribute definitions
- presentation groups
- operational statuses and status sets
- entity views
- display sections and placement rules
- LLM guidance per field or section
- action and capability definitions
- compliance, generation, and migration posture

### Record List Page Owns

- record discovery and selection
- list/search/filter/status affordances
- list page layout and responsive behavior
- visible record rows/cards
- list-level actions such as create, import, export, bulk action, refresh, or
  view switching when approved

Record List Page must not invent record-detail fields, relationship boundaries,
permissions, or actions that are absent from the entity definition.

### Record Page Owns

- selected-record display
- selected-record group navigation
- selected-record field layout
- selected-record evidence display
- selected-record LLM guidance affordances
- selected-record action placement
- selected-record read/edit affordances after runtime authorization and record
  state are evaluated

Record Page must not render every attribute by default. It should render the
fields and relationship displays approved by the active entity view and display
sections.

## Reconciliation With Existing Discovery Work

The earlier governed entity-definition discovery work remains directionally
valid.

Still-valid core decisions:

- entity definitions should be section-complete
- stable stored/runtime keys and catalog values should use snake_case
- entity views should not be ad hoc page tabs
- search, filters, statuses, relationships, display, actions, and generation
  posture should be governed
- runtime authorization remains separate from view eligibility and page
  visibility
- generated/default pages must not invent fields, statuses, routes,
  relationship boundaries, permission grants, or generated CSS variants

Clarified or superseded posture:

- Older language that treats entity-management templates as entirely future or
  unknown should be superseded by the current three-level model.
- `record_management_list_centric` should be treated as the current candidate
  Record List Page template, not as the whole entity-management model.
- `entity_management_page` should be treated as the Entity Page UX/UI baseline
  and as the reusable pattern for Record Page detail surfaces.
- Record Page display instructions should live under entity view and display
  sections, not in one-off list-page code.

## Current Prototype Map

| Prototype area | Level | Notes |
| --- | --- | --- |
| Top search, filters, layer selector, status tabs, record cards | Record List Page | This is record discovery and selection behavior. |
| Selected record panel inside the list page | Record Page | This should use Entity Page UX/UI patterns but render record-specific content from the active entity view. |
| Entity structure regions such as attributes, catalogs, display, permissions, action models, generation, compliance, and migration | Entity Page | These belong to entity-definition authoring and governance. |
| Action-model placeholder lists | Entity Page planning input | These need to become real capability/action definitions before implementation planning. |
| Attribute display groups such as details, structure, members, legal details, locations, and branding | Record Page display configuration | These are examples of record-detail grouping and should be driven by entity view/display instructions. |

## Gaps To Resolve Before Implementation

### Attribute Evidence

Before the Record Page model is implementation-ready, each attribute needs
locked evidence posture:

- source evidence for the attribute definition
- evidence proving why it appears in a view or display section
- evidence for read/edit behavior
- evidence for search/filter/sort posture when applicable
- evidence for privacy, security, compliance, and lifecycle classification

### Attribute LLM Guidance

Each attribute also needs LLM guidance that says:

- whether to ask a human, infer from source truth, recommend and confirm, use a
  platform default, or never ask
- how to phrase a business-facing question when a human answer is needed
- what good field copy looks like
- when technical or human review is required
- which values are system-owned and must not be requested from the user

### Real Capabilities

Capability rows must move from placeholder/demo content toward implementation
baseline definitions:

- stable action key
- owning layer and owner key
- action family
- input and output posture
- route/API posture where applicable
- permission and runtime authorization posture
- lifecycle/status effects
- validation and action error model
- audit and evidence requirements
- compatibility risk and review requirement
- test expectations

### Template Architecture

The current template pages need a design-system architecture audit before app
adoption. The audit should check:

- whether templates share render/controller seams consistently
- whether the Entity Page UX/UI can be reused by Record Page without copying
  markup or page-local controller logic
- whether Record List Page and Record Page responsibilities are cleanly
  separated
- whether CSS and layout rules live in design-system-owned seams rather than
  app-page local CSS
- whether component reuse is honest enough for a governed app consumer

## Recommended Next Work Packets

1. **Record this reconciliation in the older discovery chain.**
   Add a short forward pointer from the prior governed entity-definition docs
   instead of rewriting them wholesale.

2. **Walk the demo entity attribute by attribute.**
   For each attribute, lock evidence, LLM guidance, display posture,
   read/edit posture, validation, and capability needs.
   Progress tracker:
   `docs/workspace/product-discovery/2026-05-20-governed-entity-management-evidence-guidance-execution-plan.md`

3. **Promote capability placeholders into a formal action catalog draft.**
   Keep it non-runtime until implementation planning approves real APIs,
   permissions, and tests.

4. **Run a design-system template architecture audit.**
   Decide whether current template code is ready to become a governed reusable
   seam or needs refactoring first.

## Open Decisions

| Decision | Current posture |
| --- | --- |
| Exact file/artifact home for the reusable Record Page contract | Open; likely design-system template contract plus entity-definition schema sections. |
| Whether `entity_management_page` becomes a formal template key for both Entity Page and Record Page reuse | Open; needs naming review before schema lock. |
| Whether Record Page display sections are represented directly in `surfaceModel`, nested under entity views, or split into a dedicated display model | Open; should be decided during attribute/display walkthrough. |
| Minimum evidence required before an attribute can appear on a Record Page | Open; should be locked before implementation planning. |
| Minimum capability detail required before an action can leave placeholder status | Open; should be locked before implementation planning. |
