# Governed Entity Definition Creation And Maintenance

Planning status:

- `creation_maintenance_draft`
- Date: 2026-05-18
- Scope: definition creation and maintenance workstream
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Define how rough source input becomes a deterministic governed entity
definition, and how that definition is maintained over time without bypassing
the canonical structure.

This artifact follows the draft v1 governed entity-definition model and schema
formalization. It is a planning artifact, not a runtime schema, migration,
route contract, generated UI contract, or implementation blueprint.

## Source Artifacts

- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-model.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-attribute-reference.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-handoff.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-starter-default-catalog.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-page-materialization.md`
- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-access-and-promotion.md`
- `docs/workspace/design-system/templates/record-management-list-centric-template.md`

## Working Outcome

The entity creation flow should produce a section-complete canonical definition
with explicit values for every required top-level section:

- `entityIdentity`
- `sourceAuthority`
- `evidenceRegistry`
- `attributes`
- `presentationGroups`
- `operationalStatusSet`
- `relationships`
- `searchModel`
- `surfaceModel`
- `actionModel`
- `complianceModel`
- `generationModel`
- `migrationModel`

Missing meaning should be represented explicitly with approved defaults such as
`none`, `not_applicable`, empty arrays, or blocked/pending posture. The creation
flow should not omit sections because a human did not mention them.

## Creation Sources

Supported source contexts:

| Source context | Purpose | Primary input | Output posture |
| --- | --- | --- | --- |
| `new_entity` | Create a new entity definition from a human's intent. | Plain-language answers, optional examples, platform defaults. | Draft definition with human-confirmed business truth and clear inferred/defaulted fields. |
| `entity_update` | Change an existing draft or active definition. | Existing definition plus requested change. | Draft replacement or draft edit with compatibility notes. |
| `repo_migration` | Convert existing repo artifacts into an entity definition. | Data dictionaries, PRDs, API contracts, migrations, feature code, tests. | Draft definition with source evidence and conflict notes. |
| `persistent_revision` | Revise an entity definition after persistent registry truth exists. | Current persisted definition plus change request/evidence. | New draft version preserving historical truth. |

## Authoring Principles

- Ask humans for business meaning, normal workflow, ownership, and visible
  policy choices.
- Do not ask humans for system-owned defaults, technical field names, route
  mechanics, audit baselines, tenant-boundary protection, or security basics.
- Infer from source artifacts only when evidence is cited and conflicts are
  recorded.
- Use platform defaults where the repo constitution already defines default
  behavior.
- Prefer recommend-and-confirm for product choices where a sensible default
  exists.
- Use domain-specific starter defaults to reduce setup friction, while making
  clear that customers can edit the recommended statuses, sub-statuses, and
  views before activation.
- Allow customer-specified domains/workflows when no maintained starter default
  fits, and draft custom statuses/views from the customer's own language.
- Treat low-confidence, security-sensitive, privacy-sensitive,
  compatibility-sensitive, cross-boundary, or design-system-missing fields as
  review-gated.
- Preserve the difference between entity-definition lifecycle and managed-record
  lifecycle.

## Deterministic Pipeline

The creation and maintenance pipeline should use the same phases regardless of
whether the source is human conversation, LLM assistance, repo migration, or a
future form.

| Phase | Goal | Required output |
| --- | --- | --- |
| 1. Source intake | Capture the source request and context. | Source context, actor posture, source artifacts or conversation notes, initial evidence keys. |
| 2. Business identity | Establish what the entity means. | Entity key candidate, name, purpose, description, owning feature posture, source authority posture. |
| 3. Attribute inventory | Identify durable facts and field behavior. | Attribute list with categories, types, cardinality, mutability, validation, options, search, privacy/security, and evidence. |
| 4. Lifecycle and statuses | Define managed-record lifecycle and operational statuses. | System lifecycle posture plus entity-specific status/sub-status set. |
| 5. Relationships | Define owned, referenced, navigable, and related records. | Relationship entries with resolution, boundary, ownership, navigation, lifecycle impact, and evidence. |
| 6. Collection views | Define approved ways to see the collection. | `surfaceModel.collectionViews` with role eligibility, status/sub-status membership, defaults, and evidence. |
| 7. App placement and route | Decide where the entity is managed in the app. | App area, module/top-nav grouping, parent page, primary page key, canonical route candidate, and support-only posture. |
| 8. Surface readiness | Decide whether generated/default UX is allowed. | Surface model, routing topology, design-system contract references, display identity, placement readiness. |
| 9. Actions and capabilities | Map actions to concrete capability definitions. | Action model with operation keys, capability mappings, seams, authz posture, errors, and tests. |
| 10. Compliance and generation | Apply privacy, security, retention, export, and generation posture. | Compliance, generation, and migration sections. |
| 11. Validation and review | Check completeness and blocked areas. | Validation result, review exceptions, unresolved questions, activation/export readiness. |

## Human Question Policy

The LLM-assisted flow should ask one plain-language question at a time.

Ask directly when the value is foundational business truth:

- what the entity represents
- who uses it
- what the normal first version should do
- where in the app people should manage it, such as which app area, module,
  parent page, or existing workflow it belongs under
- which roles in the organization need access to it
- what each role needs it for
- what statuses those role needs imply, using plain examples such as active,
  waiting for review, suspended, archived, needs attention, or ready to send
- which statuses and sub-statuses are needed to support those role-specific
  jobs
- which relationship boundaries are business-visible
- whether unusual visibility, retention, export, or cleanup behavior is desired

Recommend and confirm when a default is likely correct:

- default management pattern
- default active-management view
- initial presentation groups
- likely searchable/filterable fields
- default list title/subtitle/identifier fields
- status-bar visibility when operational statuses exist

Do not ask directly when the value is system-owned or governed by baseline
platform rules:

- system-managed identifiers and timestamps
- baseline authz, audit, privacy, accessibility, and tenant-boundary protection
- default pagination rules
- route implementation mechanics
- migration execution details
- generated file paths
- permission grant implementation

## Collection View Authoring

Collection views are required whenever an entity is intended to generate or
drive a collection management surface.

A collection-view conversation should start from organizational roles and their
jobs, not from page tabs or technical view names. The authoring flow should ask
who needs access to the entity and what they need it for. From those answers it
can derive candidate statuses, sub-statuses, and views, then recommend a
default collection-view model for confirmation.

A collection view defines:

- stable `viewKey`
- label and description localization keys with fallback copy
- roles or role groups the view is intended for
- included operational statuses
- included sub-statuses when applicable
- default-for-role or default-for-context posture
- whether the view may render in `view_selector`
- whether the active view constrains `status_bar`
- display order
- evidence keys

Defaulting rules:

- If an entity has a generated/default management page, create at least one
  default collection view.
- Domain-specific status and view defaults are starter recommendations. They
  should help the customer begin quickly, but the customer may edit them before
  the definition is activated.
- If the entity has normal active records, recommend an `active_management` or
  equivalent default view for the primary operator role.
- If multiple roles need the entity for materially different jobs, recommend
  role-suitable collection views rather than one generic view that hides the
  distinction.
- If the entity has no operational statuses, the default view may include an
  empty status list and the status bar is omitted.
- If the entity has operational statuses, the default view should include the
  statuses that belong in normal day-to-day management.
- Archived, deleted, pending cleanup, cleanup failed, and support-only states do
  not belong in the normal default view unless explicitly modeled as an
  operationally visible view.
- A view selector appears only when two or more views are eligible for the
  current actor/context.
- Status-bar membership, counts, and status filters are constrained by the
  active view.

Validation rules:

- view keys must be stable snake_case keys
- role eligibility must reference approved role/capability vocabulary
- included statuses must exist in `operationalStatusSet`
- included sub-statuses must exist and map to valid parent statuses
- one default view per role/context is allowed unless an explicit conflict rule
  exists
- overlapping status/sub-status membership across views must be explicit
- generated pages must not invent views from fields, statuses, filters, or page
  tabs
- collection views describe intended visibility but do not replace runtime
  authorization

Recommended authoring sequence:

1. Ask which roles in the organization need access to this entity.
2. Ask what each role needs to accomplish with the entity in normal work.
3. Ask whether those jobs need different statuses, using examples in the
   requester's world rather than generic status language.
4. Derive candidate statuses and sub-statuses from the role-specific jobs.
5. Recommend collection views that group the relevant statuses and sub-statuses for
   each role or shared workflow.
6. Confirm whether the recommendation is the normal rule, an exception, out of
   scope, or deferred.

Example status prompts should be context-specific:

| Entity/work domain | Example statuses to use in conversation |
| --- | --- |
| Project task | draft, ready to start, in progress, blocked, waiting for review, completed, archived |
| Sales prospect or opportunity funnel | new lead, qualified, contacted, demo booked, proposal sent, negotiating, won, lost, dormant |
| Customer service ticket | new, triaged, waiting for customer, waiting for internal team, escalated, resolved, reopened, closed |
| Bug or defect | reported, reproduced, prioritized, in progress, ready for QA, verified, released, won't fix |
| Invoice or billing document | draft, issued, sent, partially paid, paid, overdue, disputed, voided, refunded |
| Subscription or account | trial, active, past due, suspended, cancelled, expired, pending renewal |
| Order or fulfillment | received, confirmed, picking, packed, shipped, delivered, delayed, returned, cancelled |
| Appointment or booking | requested, confirmed, rescheduled, checked in, completed, no-show, cancelled |
| Content or marketing asset | idea, drafting, in review, approved, scheduled, published, archived, withdrawn |
| Hiring candidate | applied, screened, interview scheduled, interviewing, offer pending, hired, rejected, withdrawn |
| Procurement request | requested, approved, ordered, received, partially received, rejected, cancelled, closed |
| Compliance or approval request | submitted, under review, changes requested, approved, rejected, expired, revoked |
| Incident or outage | detected, investigating, identified, monitoring, resolved, postmortem pending, closed |
| Asset or equipment | available, assigned, in maintenance, lost, retired, disposed |

The LLM should choose examples that fit the entity's business domain and should
say they are examples, not force them as the final status set.

## App Placement And Route Authoring

Entity creation must identify where the entity will be managed in the app when
the entity is expected to generate or drive a management page.

The customer-facing conversation should ask where people expect to manage the
entity in normal work. It should avoid route jargon unless the requester uses
it first.

Ask for:

- the app area or workspace where this belongs
- the module or section people would open first
- whether it lives as its own main page or under a parent page
- whether it belongs under an existing workflow or navigation item
- whether it is normal user-facing management or support/ops-only

Then derive `surfaceModel.routingTopology`:

| Field | Derived from |
| --- | --- |
| `appKey` | App area or workspace. |
| `moduleKey` | Module, top-nav grouping, or major section. |
| `primaryPageKey` | The durable page/context destination for the entity. |
| `canonicalRoute` | Generated from approved topology and route rules. |
| `parentPageKeys` | Parent or containing pages, when nested. |
| `supportOnly` | Whether this is support/ops-only rather than normal product navigation. |

Authoring rules:

- The customer may describe the desired location in plain language.
- The system may recommend the nearest approved app/module/page location.
- App placement should use persistent web app hierarchy truth when available.
- Entity creation may propose or create a new page, but that page must be
  anchored in the context of existing app/module/parent route hierarchy unless
  a new app or module is explicitly declared.
- Creating a new app or module is a separate explicit topology decision, not an
  incidental side effect of entity creation.
- The canonical route should be derived from approved frontend topology rather
  than typed manually by the customer.
- Entity creation must not invent durable routes outside topology governance.
- If the intended location does not exist yet, save the desired placement as a
  draft and mark topology approval/materialization as blocked or required.
- Moving an entity page later is compatibility-sensitive when URLs, saved
  states, documentation, permissions, support workflows, or generated artifacts
  already reference the old location.

Placement outcomes:

| Outcome | Meaning | Activation posture |
| --- | --- | --- |
| Existing app/module/page context | The entity page fits under known persistent hierarchy nodes. | May proceed when other page-readiness rules pass. |
| New page under existing context | A new entity page is needed under an existing app/module/parent route. | May proceed through approved hierarchy materialization. |
| New module under existing app | A new module/top-nav grouping is needed. | Requires explicit topology decision before materialization. |
| New app/workspace | A new app or shell area is needed. | Requires explicit product/topology approval before materialization. |
| Unknown or deferred placement | The desired location is unclear. | Draft save allowed; generated page activation blocked. |

Example prompts:

> Where would someone naturally go in the app to manage these records?

> Should this be its own page, or should it live under another page people
> already use?

> Is this a normal working page for customers/admins, or is it only for support
> or operations?

## Default Page Readiness

An entity definition is ready to drive a default record-management page only
when these minimum conditions are met:

| Requirement | Source section |
| --- | --- |
| Approved management pattern is selected. | `surfaceModel.managementPattern` |
| Routing topology references approved app/module/page/route keys. | `surfaceModel.routingTopology` |
| At least one collection view exists. | `surfaceModel.collectionViews` |
| Display identity is declared. | `surfaceModel` and attribute placements |
| Record-list title field has an approved placement. | attributes placements |
| Drawer groups and placements are declared. | `presentationGroups`, attributes, relationships |
| Status bar behavior is clear when statuses exist. | `operationalStatusSet`, `surfaceModel.collectionViews` |
| Collection actions are mapped. | `actionModel` |
| Template contract keys are approved. | `surfaceModel.designSystemContractKeys` |
| Blocked design-system gaps are recorded. | evidence/review exceptions |

If any condition is missing, the definition may still be saved as a draft, but
default page generation should be blocked or marked preview-only.

## Maintenance Lifecycle

Entity definitions should move through explicit lifecycle stages:

| Stage | Meaning | Allowed next steps |
| --- | --- | --- |
| `draft` | Editable definition version. | validate, request review, update, discard/archive if allowed. |
| `review_requested` | Human or technical review needed before activation. | approve, request changes, return to draft. |
| `validated` | Schema/catalog validation passed, but not active truth. | activate, export preview, request final review. |
| `active` | Current definition version for its lineage. | propose replacement, export, supersede. |
| `superseded` | Historical version replaced by newer active version. | read/export historical, archive when allowed. |
| `archived` | Retained but removed from normal active authoring. | read/export historical, restore only if explicitly approved. |

The current implemented `entityBuilder` uses `draft`, `active`, `superseded`,
and `archived`. The expanded lifecycle terms above are planning posture for the
creation workflow and should be reconciled before runtime implementation.

## Validation Gates

Draft save validation:

- source context is known
- required top-level sections exist
- stable keys use approved casing
- system-managed fields are not client supplied
- obvious unknown catalog values are rejected
- unresolved fields are explicit, not missing

Review-request validation:

- business identity is coherent
- attributes have type/cardinality/mutability/default validation posture
- operational statuses and collection views are internally consistent
- relationships include boundary and lifecycle posture
- surface model either blocks generation clearly or references approved
  contracts
- privacy/security/compliance assumptions are present
- review exceptions are listed

Activation validation:

- all required sections are complete
- catalog values are approved
- collection views validate against status/sub-status sets
- one active/default posture is unambiguous for generated surfaces
- compatibility risks are resolved or explicitly approved
- API, route, persistence, permission, data dictionary, and generated artifact
  impacts are classified
- design-system contract dependencies are signed off or generation remains
  blocked

Export validation:

- export format is explicit
- export v1 compatibility is preserved where current consumers depend on it
- canonical export/read shape uses the new governed format
- generated docs or UI previews state their source definition version
- incomplete or blocked sections are visible in the export result

## Evidence Model

Every created or maintained definition should distinguish:

| Evidence/source posture | Meaning |
| --- | --- |
| `human_confirmed` | A person confirmed the value as business truth. |
| `human_recommended_confirmed` | The system/LLM recommended a value and the person accepted it. |
| `inferred_from_context` | The value was inferred from nearby conversation or planning context. |
| `derived_from_source_truth` | The value came from repo artifacts or persistent source truth. |
| `platform_default` | The value follows a governed repo default. |
| `system_generated` | The value was generated by tooling and should not be manually edited. |
| `technical_review_required` | The value is drafted but blocked until technical review. |
| `business_review_required` | The value is drafted but blocked until business/product review. |

Evidence entries should identify the source, confidence, owner/reviewer where
applicable, and whether the evidence is enough for draft save, review request,
activation, or export.

## Freeform Edit Prevention

The creation and maintenance system should prevent one-off edits from bypassing
the governed structure.

Required guardrails:

- all updates target known schema paths
- every update records source context and evidence posture
- action-specific validation runs before mutation
- collection-view changes use collection-view capability definitions
- relationship changes use relationship capability definitions
- surface changes validate against design-system/topology contracts
- compatibility-sensitive changes produce migration notes
- generated/default page eligibility is recalculated after relevant edits
- active definitions are replaced by new versions rather than mutated in place

## Open Questions

| Question | Current posture |
| --- | --- |
| Should `review_requested` and `validated` become runtime definition statuses, or remain workflow-only states around the current `draft` status? | Open for implementation planning. |
| Which approved role vocabulary should `collectionViews.roleEligibility` reference first: concrete authz roles, capability groups, or definition-local role aliases? | Open; should align with authorization model before implementation. |
| Should collection views be definition-only in v1, or can operators create runtime-managed/saved views later? | Definition-only for v1 planning; runtime-managed views are deferred. |
| What exact default view key should be generated for the common case? | Recommend `active_management`; confirm during schema/catalog lock. |
| Which design-system template contract will first consume collection views? | Likely `record_management_list_centric`, pending template signoff. |

## Next Planning Step

Use this artifact to draft the implementation-facing PRD or capability matrix
for entity-definition creation. That next layer should decide concrete route
contracts, persistence shape, schema/types, validation behavior, permission
mapping, test cases, and artifact requirements.

The PRD or capability matrix should start from the exhaustive entity capability
baseline in the schema formalization artifact. The newer collection-view,
definition/change lifecycle, page materialization, staged visibility, and
signoff work should be added as complementary capability groups and governance
gates, not used as a replacement for the broader baseline.

The implementation-facing capability matrix must distinguish reusable
entity-builder/platform capabilities from generated feature capability
templates. Entity creation owns the logic that defines, validates, previews,
exports, and generates or drafts feature seams for a specific entity. The
owning feature or approved platform seam owns the runtime behavior for that
specific entity once adopted. Shape-editing capabilities such as attribute
updates, collection-view updates, surface placement, validation, export, and
page materialization are entity-builder/platform capabilities; managed-record
list/read/create/update/archive/export capabilities are reusable generated
feature templates unless explicitly adopted by an owning feature.

In the target model, creating an entity can build the backend functionality and
UX for that entity's runtime feature. That build/materialization step produces
or updates the owning feature seam; it does not make the entity builder the
runtime manager for every generated entity's records.
