# Product Discovery Packet: Data Dictionary Entity Registry

Draft safety label:

- Created as a draft discovery artifact.
- Full repo guardrails and artifact sweeps were intentionally skipped.
- This packet is not validated, governed, complete, implementation-ready, or
  artifact-complete.

## Status

- Discovery status:
  `discovery-only`
- Draft posture:
  `draft-fast-path`
- Original request:
  "Can we add a product discovery packet aimed at making data dictionary
  entities are durable record entity that can be updated, read, created,
  superceded, archived and deleted via UX or via API or LLM triggered script?"
- Plain-language request summary:
  Data dictionary entities should stop being only Markdown reference pages.
  They should become governed durable records that people and approved tooling
  can create, read, update, supersede, archive, and delete through a UI, API,
  or controlled script/LLM workflow.
- Packet date:
  2026-05-14
- Owner / requester:
  Product requester
- Related product template:
  generic feature template
- Product template posture:
  `generic-template-used`
- Taxonomy version:
  `2026-05-03.1`
- Prior packet or feedback reference:
  Organization Domain Foundation data dictionary work exposed the need for
  entity dictionary entries to behave like governed durable records.

## Discovery Interview Summary

- Initial understanding shared with requester:
  The requester wants data dictionary entries to become manageable product
  records with lifecycle, versioning, and multiple controlled operation
  surfaces.
- Interview cadence:
  `exception-approved`
- If interview cadence exception was approved, why:
  The requester explicitly asked to add a Product Discovery packet. This was
  handled through draft fast path and does not claim handoff readiness.
- Coverage areas tracked internally:
  universal matrix plus data lifecycle, integration/API, frontend/UX,
  access/authorization, compliance/reporting, and operations/support overlays.
- Assumptions confirmed by requester:
  none yet beyond the original request.
- Business questions explicitly signed off as deferred until later:
  none yet.
- Technical questions packaged for technical stakeholder:
  storage model, versioning strategy, script/LLM authority model, generated
  Markdown compatibility, migration from current docs.
- Questions still blocking packet confidence:
  who can approve supersession/deletion, what the UI must support first, and
  whether Markdown files remain generated outputs or source of truth.
- Scope cuts used to reach confidence:
  no implementation, schema, route, or UI design is approved by this draft.
- Confidence for chosen status:
  `65%; discovery-only draft`

## Discovery Complexity And Completion Gate

- Request complexity:
  `complex/foundational`
- Complexity rationale:
  This affects durable metadata, governance, docs-as-source behavior, API
  behavior, UI behavior, audit, script/LLM authority, versioning, and
  compatibility with existing Markdown data dictionary files.
- Draft-ready rationale:
  The product direction is clear enough to capture as a draft discovery packet,
  but not enough to hand off to Technical Steering.
- First-version path known:
  `no`
- Deferred future support explored:
  `no`
- Deferred future support summary:
  Lifecycle and operation surfaces are named, but approval policy, source of
  truth, and migration posture remain open.
- High-risk unknowns remain:
  source of truth, approval authority, generated-doc compatibility,
  deletion/purge policy, script/LLM authority, and first UI surface.
- Packet may proceed:
  `yes`, as draft discovery only.

## Universal Coverage Matrix

| Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- |
| Goal and success outcome | answered | Data dictionary entities become governed durable records with CRUD plus supersede/archive/delete lifecycle. | yes |
| Primary users and actors | deferred-open | Likely users include root/admin planners, technical maintainers, support/governance reviewers, API consumers, and LLM/script automation. Exact actors need confirmation. | yes |
| Normal first-version workflow | deferred-open | The request names UX, API, and LLM-triggered script surfaces, but not which surface is first. | yes |
| Authority and responsibility boundaries | deferred-open | Need to decide who can create, approve, supersede, archive, delete, and restore entity records. | yes |
| Data created, changed, viewed, retained, or deleted | answered | Durable data dictionary entity records and lifecycle/version history are in scope. | yes |
| Lifecycle states and transitions | answered | Create, read, update, supersede, archive, and delete are explicitly requested. Restore/purge remain open. | yes |
| Exceptions, reversals, and recovery | deferred-open | Need recovery rules for accidental delete/archive, failed script runs, conflicting updates, and supersession mistakes. | yes |
| Visibility, notifications, and user feedback | deferred-open | UI feedback, review status, and notification needs are not yet defined. | yes |
| Security, privacy, audit, compliance, and abuse baseline | assumed-baseline | Baseline audit, permissioning, tenant/platform boundary, script authorization, and evidence are required because this governs platform metadata. | no |
| Business policy decisions | deferred-open | Approval flow and delete/supersede policy need product decisions. | yes |
| Configuration or customization | deferred-with-known-direction | Entity schema may need configurable fields or templates, but first pass should likely be governed platform configuration, not tenant customization. | yes |
| Billing, plan, quota, or entitlement impact | not-applicable | This is internal/platform governance unless later exposed as customer-configurable metadata. | no |
| Operational and support needs | assumed-baseline | Need runbooks/evidence for script execution, failed changes, and rollback. | no |
| Reporting, history, and evidence needs | assumed-baseline | Durable history and audit trail are required for supersession/archive/delete decisions. | no |
| Compatibility with existing behavior | deferred-open | Need to decide how existing Markdown dictionary files relate to durable records. | yes |
| Future extensibility pressure | answered | UX/API/script/LLM operation surfaces, structured tables, reusable status, attribute categories, design-system presets, and relationship navigation imply durable extensibility and automation-ready contracts. | yes |
| Explicit out of scope | answered | Source implementation, migrations, route contracts, UI design, permission keys, and task breakdown are out of scope for this draft. | no |
| Open blockers | answered | Product policy, Technical Steering, PRD, capability matrix, data model, permission mapping, API contract, and design-system governance are still needed. | yes |

## Triggered Overlay Coverage

| Overlay | Coverage Area | Status | Reason / Evidence | Needs User Decision? |
| --- | --- | --- | --- | --- |
| data lifecycle and retention | lifecycle states and transitions | answered | Requested create/read/update/supersede/archive/delete lifecycle. | yes |
| data lifecycle and retention | soft-delete, hard-delete, archive, restore, purge expectations | deferred-open | Delete may mean soft delete, hard delete, or governed purge. Restore is not yet named. | yes |
| integration / API | API consumers and machine interfaces | answered | API and LLM-triggered script surfaces are explicitly requested. | yes |
| integration / API | compatibility and versioning expectations | deferred-open | Existing Markdown files and future durable records need compatibility strategy. | yes |
| frontend / UX | surface and management location | deferred-open | UX is requested but root/admin surface and first workflow are not chosen. | yes |
| frontend / UX | mistake recovery and confirmation needs | assumed-baseline | Supersede/archive/delete need confirmation and recovery posture. | yes |
| frontend / UX | reusable entity-management preset | deferred-open | Requester wants a design-system preset for displaying and managing an entity without respecifying the UX each time. | yes |
| access / authorization | actor classes and authority worlds | deferred-open | Need root/operator, maintainer, reviewer, script, and LLM authority boundaries. | yes |
| access / authorization | audit/history visibility and retention expectations | assumed-baseline | Governance metadata requires durable audit/history. | yes |
| compliance / reporting | source of truth and freshness expectations | deferred-open | Need to decide whether records generate Markdown, Markdown updates records, or both coexist during migration. | yes |
| data lifecycle and retention | deterministic retention schema | deferred-open | Requester specifically wants more deterministic schemas for retention. | yes |
| operations / support | operational recovery and evidence expectations | assumed-baseline | Failed scripts and conflicting updates require evidence and recovery. | no |

## Known Questions Gate

- Plain-language summary shown before drafting:
  The requester asked directly for a packet. Draft fast path was used.
- First one question asked before drafting:
  not asked; fast-path draft requested.
- Requester answered, corrected, or explicitly deferred first question:
  `no`
- Known important product questions left unasked:
  first operation surface, approval authority, delete meaning, source-of-truth
  relationship to Markdown, and LLM/script permission model.
- For each unasked business question, requester signoff for "deferred until later":
  not yet signed off; packet remains `discovery-only`.
- Technical questions not asked of business owner and packaged for technical stakeholder:
  storage/versioning model, generated artifact strategy, API contract posture,
  LLM/script execution sandbox, and migration from existing files.
- If any known question was not asked, why was it safe to defer or package:
  This is a draft discovery artifact only and is not ready for Technical
  Steering.
- Packet status allowed:
  `yes`, for `discovery-only` draft only.

## Change Routing

- Requested change type:
  core platform metadata management
- Secondary change types:
  entity management, admin/operator tooling, integration/API, governance,
  lifecycle/audit, LLM/script automation
- Likely delivery path:
  `core-platform-pr`
- Routing confidence:
  `80%`
- Routing rationale:
  The request changes reusable platform behavior and durable metadata, not a
  tenant-specific extension.
- Config-first check:
  not sufficient; the system needs durable record behavior and lifecycle.
- Tenant-specific extension check:
  not a tenant-specific request.
- Core platform check:
  yes; this affects source-of-truth metadata and platform governance.
- Backlog item shape:
  foundational product request requiring Technical Steering before PRD.
- Approval posture:
  draft discovery only.
- Evidence expectation:
  later PRD, capability matrix, data dictionary, API contract, permission
  mapping, audit proof, and runbook/test plan.
- Routing blockers:
  product policy and architecture/source-of-truth decisions.

## Product Intent

- Problem to solve:
  Data dictionary entity definitions are currently maintained as documents.
  The requester wants them to behave like governed product records that can be
  safely changed, versioned, automated, and operated through multiple surfaces.
- Business outcome:
  The platform can manage its data dictionary as durable accountable metadata
  rather than ad hoc documentation.
- Primary user outcome:
  A maintainer can create or update an entity definition and see its lifecycle,
  history, supersession, and deletion/archive posture clearly.
- Why now:
  Organization Domain Foundation data dictionary work is adding multiple
  planned entities one by one, exposing the need for better entity governance.
- Success signal:
  Data dictionary entities can be created, read, updated, superseded, archived,
  and deleted through approved surfaces with durable history and safe
  generated documentation.
- Non-goal summary:
  This draft does not approve source implementation, route paths, database
  tables, UI design, permission keys, LLM execution model, or migration from
  Markdown files.

## Requester Memo Notes

These notes are raw product and architecture signals from the requester. They
are not decisions yet, but they should be preserved for the next discovery pass
and Technical Steering.

| Memo | Why it matters | Likely downstream owner |
| --- | --- | --- |
| Analyze the current data dictionary headers and decide which parts should become structured tables rather than prose. | Machine-readable facts should not stay buried in paragraphs when they need validation, rendering, search, or generation. | Product Discovery, Technical Steering, data dictionary schema design |
| Define more deterministic schemas for data retention. | Retention, deletion, legal-hold, export, cleanup, and operational evidence need consistent fields instead of ad hoc wording per entity. | Data governance, compliance, runbook, data dictionary schema |
| Create a repo-wide approach to defining entity status. | Entity lifecycle/status should not be reinvented per page; active, draft, superseded, archived, deleted, deprecated, and similar states need shared meaning or explicit per-entity mapping. | Technical Steering, architecture, data dictionary schema |
| Add a design-system preset for displaying and managing an entity through the frontend without respecifying the UX every time. | The platform should have a reusable governed entity-management pattern for list/detail/create/edit/lifecycle/history behavior. | Design-system governance, frontend architecture |
| Categorize attributes as core, meta, secondary, and similar groups, and map those categories to the design-system approach. | Attribute classification can drive layout, prominence, editing behavior, validation, search/filter treatment, and generated docs. | Product Discovery, data dictionary schema, design-system governance |
| Tie entities to parents, siblings, and children so they can be accessed or controlled from the entity UX starting point. | Entity management needs relationship navigation and scoped control, not only flat entity pages. Parent/child/sibling relationships may affect permissions, lifecycle, generated docs, and UI composition. | Technical Steering, data model, frontend architecture, permission mapping |

## Taxonomy Classification

- Product feature type:
  entity management; admin / operator tooling; support / troubleshooting
- UX pattern(s):
  searchable catalog; detail view; create/edit form; timeline / activity log;
  approval/review posture likely
- Data ownership shape:
  platform-owned durable metadata
- Surface / management location:
  likely root/operator or internal governance area; exact surface open
- Actor and permission shape:
  permission-sensitive platform governance with script/LLM actor posture
- Relationship shape:
  entity definition to fields, constraints, lifecycle rules, evidence rows,
  generated docs, supersession relationships, and parent/sibling/child entity
  relationships
- Reporting / read model shape:
  searchable registry and generated Markdown/reference output
- Lifecycle shape:
  repo-wide entity status approach needed; create, update, supersede, archive,
  delete; restore/purge open
- Integration / externality shape:
  API and LLM-triggered script interfaces; generated-doc/materialization seam
- Evidence / compliance sensitivity:
  high
- New taxonomy value needed:
  possibly "governed metadata registry"
- New taxonomy axis needed:
  possibly "LLM/script operation surface"

## Feature Family / Product Template Fit

- Existing feature family:
  possible future `dataDictionaryRegistry` or extension of `entityBuilder`;
  Technical Steering must decide.
- Reusable product template used:
  generic feature template
- Template overrides:
  lifecycle/audit/script governance emphasized.
- New family or template needed:
  likely new family or explicit extension of an existing metadata-builder
  family.
- Reuse rationale:
  The request resembles entity management but with source-of-truth and
  generated-artifact governance.
- Existing families/templates considered:
  `entityBuilder`, capability contract catalog, data dictionary maintainer.
- Why rejected:
  Not rejected yet; owner and relationship need Technical Steering.

## New Family Candidate

- New family candidate needed:
  yes, unless Technical Steering assigns ownership to an existing metadata
  feature.
- Proposed family name:
  Data Dictionary Entity Registry
- Business problem it exists to solve:
  Manage data dictionary entities as durable governed records with lifecycle,
  history, automation, and generated documentation.
- Why existing taxonomy values/templates do not fit:
  Plain entity management does not fully capture generated-doc source-of-truth,
  LLM/script mutation authority, and supersession governance.
- Reusable user/job pattern:
  governance maintainer curates entity metadata; system materializes docs and
  evidence; scripts/LLM submit controlled changes.
- Expected journeys:
  create entity, edit entity, supersede entity, archive entity, delete entity,
  read/search entity, run script-generated proposal, review change history.
- Expected capability groups:
  entity lifecycle, field/constraint lifecycle, evidence rows, generated docs,
  API reads/writes, script/LLM proposals, audit/history.
- Expected actors / permissions:
  root/operator maintainer, technical reviewer, read-only viewer,
  script/automation actor, LLM-assisted proposal actor.
- Expected data ownership shape:
  platform-owned durable metadata.
- Expected relationship shape:
  entity has versions, fields, constraints, lifecycle rules, retention rules,
  evidence rows, generated document links, supersession links, and
  parent/sibling/child relationships.
- Expected reporting / read model shape:
  searchable registry plus generated Markdown/reference output.
- Expected lifecycle shape:
  draft, active/current, superseded, archived, deleted; restore/purge open.
- Product-template candidate needed:
  possibly.
- Approval needed before requirements lock:
  yes.

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient:
  unknown.
- Existing UX pattern likely needs extension:
  likely searchable catalog plus detail editor and history/review timeline.
- New UX pattern may be needed:
  possible for script/LLM proposals and supersession comparison.
- Design-system extension may be needed:
  yes, if no governed entity-management preset exists for list/detail/edit,
  attribute grouping, relationship navigation, metadata diff/review, and
  lifecycle transition confirmation.
- Affected surfaces:
  internal/root/admin governance UI.
- User workflow reason:
  Maintainers need confidence before changing durable metadata that affects
  planning, compliance, rebuild, and generated docs.
- Product constraints:
  No app UI should proceed without design-system governance if this becomes a
  governed app surface.
- Existing design-system references checked:
  not checked in draft fast path.
- Must stop before app UI implementation:
  yes.
- Technical Steering / design-system questions:
  owner feature, topology, generated-doc materialization, reusable entity UX
  preset, attribute categories, relationship navigation, and review/diff UI.

## Users, Actors, And Context

- Primary actor:
  platform maintainer or governance reviewer.
- Secondary actors:
  read-only developers, planning reviewers, compliance reviewers.
- Configuration / governance actors:
  root/operator governance owner.
- Support / root / operator actors:
  support/operator may inspect history and recover from bad changes.
- System or external-provider actors:
  controlled script runner and LLM-assisted proposal workflow.
- Affected modules / surfaces:
  data dictionary, generated docs, internal governance UI, API, scripts.
- Root / tenant / public posture:
  platform/root-owned; not tenant-public by default.
- Permission-sensitive decisions still open:
  who may create/update/supersede/archive/delete and what LLM/script can do
  without human approval.
- Current context:
  Organization Domain Foundation data dictionary planning.
- Trigger event:
  requester asked to productize data dictionary entities as durable records.

## User Journey Flow

### Primary Journey

1. User starts from:
   a data dictionary registry or entity list.
2. User wants to:
   create or change an entity definition safely.
3. System helps by:
   showing current entity truth, lifecycle state, fields, constraints, evidence
   rows, generated-doc impact, and change history.
4. User completes when:
   the entity change is saved, superseded, archived, or deleted according to
   approved policy and any generated docs are updated or queued.

### Alternate / Edge Journeys

- Script or LLM proposes an entity change for review.
- Maintainer supersedes an entity with a replacement.
- Maintainer archives an entity that is no longer current.
- Maintainer deletes an entity under approved delete policy.
- Reader searches for current and historical entity definitions.

### Denied, Empty, Failed, Or Degraded States

- Actor lacks lifecycle permission.
- Script/LLM request is not approved for direct mutation.
- Generated docs fail to materialize.
- Concurrent update conflict occurs.
- Entity cannot be deleted because it is referenced by current artifacts.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | Platform maintainer | Creates and changes entity metadata. | yes | Main requested workflow. |
| Admin / configuration | Governance owner | Sets rules for lifecycle, approval, and automation. | yes | Required for safe mutation. |
| Support / root / governance | Reviewer/support operator | Audits history and recovers bad changes. | yes | Metadata is compliance-sensitive. |
| System / external provider | Script/LLM workflow | Proposes or applies controlled changes. | yes | Explicitly requested. |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | end user journey | platform maintainer | create and update data dictionary entity records | keep platform metadata current without hand-edit drift | adding or changing domain entities | current entity truth is saved with history |
| JTBD-002 | support / root / governance | governance reviewer | see lifecycle and supersession history | understand why metadata changed and recover from mistakes | reviewing a risky metadata change | history and decision trail are clear |
| JTBD-003 | system / external provider | approved script or LLM proposal actor | submit controlled entity changes | accelerate dictionary maintenance without bypassing governance | bulk or assisted metadata update | proposed changes are reviewable and auditable |

### Epic-Level Job Summary

- User type:
  platform metadata maintainer.
- Needs to:
  manage data dictionary entities as durable lifecycle records.
- So they can:
  keep data truth, generated docs, and compliance evidence aligned.
- Current context:
  data dictionary is maintained as Markdown files and planning artifacts.
- Trigger event:
  Organization data dictionary work is expanding entity coverage.
- Desired outcome:
  governed durable registry with UI/API/script operation surfaces.
- Success looks like:
  every entity change has a clear current record, lifecycle state, history, and
  generated-document posture.

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | maintainer | create | Add a new data dictionary entity record. | Organization entity additions. | Requires create form/API and lifecycle defaults. |
| UC-002 | JTBD-001 | maintainer | update | Correct or expand fields, constraints, or compliance trace. | Name uniqueness rule changed. | Requires version/history and conflict handling. |
| UC-003 | JTBD-002 | reviewer | supersede | Replace an entity definition with a newer current version. | Evolved data model. | Requires supersession links and current/historical visibility. |
| UC-004 | JTBD-002 | maintainer | archive/delete | Remove entity from current inventory safely. | Deprecated entity. | Requires archive/delete policy and references check. |
| UC-005 | JTBD-003 | script/LLM actor | propose/apply | Submit controlled changes through automation. | Bulk entity maintenance. | Requires authority, audit, and review posture. |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| Data dictionary entity | draft, active/current, superseded, archived, deleted | Restore and purge open. |
| Entity version | proposed, accepted, superseded, rejected | Version model needs Technical Steering. |
| Entity attribute | core, secondary, metadata, system/lifecycle, relationship, evidence | Exact category names and design-system mapping need discovery. |
| Entity relationship | parent, child, sibling, replacement/supersession | Relationship navigation and control rules need discovery. |
| Script/LLM change request | proposed, approved, applied, failed, rejected | Direct apply versus proposal-only is open. |
| Generated Markdown artifact | current, stale, generation-failed | Source-of-truth relationship is open. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | maintainer | authorized | entity | draft | create | active or pending review entity record | needs-product-answer |
| JY-STATE-002 | maintainer | authorized | entity | active | update | new current version or edited current record | needs-product-answer |
| JY-STATE-003 | reviewer | authorized | entity | active | supersede | replacement becomes current and old version stays readable | needs-product-answer |
| JY-STATE-004 | maintainer | authorized | entity | active | archive | entity hidden from current inventory but retained | needs-product-answer |
| JY-STATE-005 | maintainer | authorized | entity | archived | delete | delete or purge according to policy | needs-product-answer |
| JY-STATE-006 | script/LLM actor | scoped | change request | proposed | apply/propose | auditable proposed or applied change | needs-product-answer |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | maintainer | none | draft/active | entity | create | entity exists with initial lifecycle state | needs-product-answer |
| ST-002 | maintainer | active | active/new version | entity | update | changes are visible with history | needs-product-answer |
| ST-003 | reviewer | active | superseded | entity/version | supersede | replacement points back to prior record | needs-product-answer |
| ST-004 | maintainer | active | archived | entity | archive | hidden from current list, retained in history | needs-product-answer |
| ST-005 | maintainer | archived | deleted | entity | delete | removed or soft-deleted according to policy | needs-product-answer |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Markdown files are still the source of truth | defer-to-technical-steering | yes | Need generated-doc/source-of-truth decision. |
| Durable records become source of truth and generate Markdown | defer-to-technical-steering | yes | Likely long-term direction, but needs architecture decision. |
| LLM can apply changes directly | needs-product-answer | yes | High-risk unless tightly scoped and approved. |
| LLM can only propose changes | needs-product-answer | yes | Safer default; needs requester confirmation. |
| Delete means archive/soft delete | needs-product-answer | yes | Safer default for governed metadata. |
| Delete means hard purge | needs-product-answer | yes | Requires stricter approval and compatibility policy. |
| Generated doc update fails | in-scope | no | Must record failure and retry/reconcile. |
| Entity is referenced by current artifacts | in-scope | no | Delete/archive must block or require supersession. |
| Current Markdown headers contain prose-only facts that should be structured | in-scope | yes | Needs analysis before schema is locked. |
| Entity attributes need category-driven display | in-scope | yes | Needs attribute taxonomy and design-system mapping. |
| Related entities should be reachable from entity starting point | in-scope | yes | Needs relationship model and UX/navigation rules. |

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Create entity record | JTBD-001 / UC-001 | ST-001 | New entity is captured durably. | maintainer | UI/API/script | Needs approval posture. |
| Read/search entity records | JTBD-001 | JY-STATE-001 through JY-STATE-006 | Users can inspect current and historical records. | maintainer/reviewer | UI/API | Include archived/superseded filters. |
| Update entity record | JTBD-001 / UC-002 | ST-002 | Entity metadata stays current. | maintainer | UI/API/script | Versioning model open. |
| Supersede entity record | JTBD-002 / UC-003 | ST-003 | Old and new entity definitions remain traceable. | reviewer | UI/API | Needs replacement link. |
| Archive entity record | JTBD-002 / UC-004 | ST-004 | Current inventory stays clean while history remains. | maintainer | UI/API | Safer than hard delete. |
| Delete entity record | JTBD-002 / UC-004 | ST-005 | Invalid or unwanted entity can be removed under policy. | maintainer/governance | UI/API | Meaning of delete open. |
| Script/LLM proposal workflow | JTBD-003 / UC-005 | JY-STATE-006 | Automation can help without bypassing governance. | script/LLM actor | script/API | Proposal-only is likely safest default. |
| Generated documentation sync | JTBD-001 / UC-002 | generated doc state | Markdown/docs stay aligned with durable records. | system | job/script | Source-of-truth direction open. |
| Structured entity schema extraction | JTBD-001 / UC-002 | requester memo | Current headers/prose become deterministic schema where appropriate. | maintainer/system | schema/API/docs | Requires analysis of current dictionary headings. |
| Attribute category mapping | JTBD-001 / UC-002 | requester memo | Attributes render and behave consistently by category. | maintainer/designer | UI/API/schema | Category names and design-system mapping open. |
| Relationship navigation and control | JTBD-001 / UC-004 | requester memo | Parent, child, sibling, and supersession relationships are visible and controllable from entity UX. | maintainer/reviewer | UI/API | Permission and lifecycle impact open. |

## Business Questions Before Requirements Lock

| Question | Why it matters in plain language | Required before steering? | Current answer / owner | Deferred until later signed off by requester? |
| --- | --- | --- | --- | --- |
| Which surface is first: UI, API, or script/LLM proposal? | It changes the first user journey and proof needs. | yes | unanswered / requester | no |
| Who can create, update, supersede, archive, and delete records? | These actions can change platform source truth. | yes | unanswered / requester | no |
| What does delete mean? | Delete could be hide, soft delete, or hard purge. | yes | unanswered / requester | no |
| Are LLM-triggered changes proposal-only or allowed to apply directly? | Direct apply is riskier and needs stronger authority. | yes | unanswered / requester | no |
| Do durable records become source of truth over Markdown? | This decides migration and generated artifact design. | yes | unanswered / Technical Steering with requester | no |
| Who sees history and superseded records? | Affects day-to-day governance and evidence visibility. | yes | unanswered / requester | no |
| Which current data dictionary headers should become tables or structured schema? | This decides what can be validated, generated, searched, and rendered consistently. | yes | unanswered / requester and Technical Steering | no |
| What are the repo-wide entity status values and meanings? | Status drives lifecycle behavior, filtering, permissions, and UI treatment. | yes | unanswered / requester and Technical Steering | no |
| What attribute categories are needed, and how do they map to UI treatment? | Core versus meta versus secondary attributes should not be displayed or edited the same way. | yes | unanswered / requester and design-system owner | no |
| What relationship types should every entity support? | Parent, sibling, child, and supersession relationships affect navigation and control from the entity UX. | yes | unanswered / requester and Technical Steering | no |

## Technical Questions For Technical Stakeholders

| Question | Plain-language context | Suggested technical owner | Blocks Technical Steering handoff? |
| --- | --- | --- | --- |
| Should this extend `entityBuilder`, capability catalog, or become a new feature family? | The product is platform metadata management but ownership is not obvious. | Technical Steering | yes |
| What is the durable versioning model? | Supersession can be modeled as immutable versions, mutable records with history, or both. | Technical Steering | yes |
| How should Markdown generation work? | Existing docs must remain useful and not drift from records. | Architecture / docs tooling owner | yes |
| What execution authority can LLM/script workflows have? | Automation must not bypass review, audit, or permission checks. | Security / platform tooling | yes |
| What API contract and permission mapping shape is needed? | CRUD plus lifecycle actions must be protected and auditable. | API/authz owner | yes |
| Which dictionary sections should be normalized into child tables? | Current prose headings may need first-class child records for fields, retention, status, relationships, and evidence. | Data architecture owner | yes |
| How should attribute categories drive the design-system preset? | The UI should not respecify layout and behavior for each entity. | Design-system owner | yes |

## Explicitly Out Of Scope

- Runtime implementation
- Database migrations
- Exact route paths
- Exact UI design
- Exact permission keys
- Direct LLM mutation approval
- Replacing all current Markdown data dictionary files without migration plan
- Marking this ready for Technical Steering

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed | Owner / signoff |
| --- | --- | --- | --- | --- | --- |
| First surface | UI/API/script order is undecided. | high | Wrong first slice could create costly rework. | yes | requester |
| Header-to-table conversion | Current data dictionary headings need analysis before schema lock. | high | Important facts may remain prose-only and hard to validate. | yes | Technical Steering |
| Repo-wide status | A shared entity status model is needed but not yet defined. | high | Each entity could invent incompatible lifecycle language. | yes | requester / Technical Steering |
| Attribute categories | Core/meta/secondary-style categories are needed but not yet named. | medium | UI and generated docs may be inconsistent. | yes | requester / design-system owner |
| Relationship navigation | Parent/sibling/child relationships should be accessible from entity UX. | medium | Entity pages may remain flat and hard to operate. | yes | requester / Technical Steering |
| Delete posture | Archive/soft-delete should be safer default than hard purge. | medium | Hard delete could lose governance history. | yes | requester |
| LLM authority | LLM should propose changes before direct apply is considered. | medium | Direct mutation could corrupt source truth. | yes | requester/security |
| Source of truth | Durable records likely become source and Markdown becomes generated output. | medium | Wrong direction could duplicate authority. | yes | Technical Steering |
| Existing docs migration | Existing Markdown dictionary pages need compatibility migration. | high | Current docs could drift or be overwritten incorrectly. | yes | Technical Steering |

## Discovery Feedback Loop

- Feedback status:
  `not-started`
- First iteration reference:
  this packet
- Feedback sources:
  - user interview: original request on 2026-05-14
  - support issue: none
  - analytics / usage signal: none
  - runtime defect: none
  - sales / stakeholder input: none
  - internal operator note: Organization data dictionary workflow exposed need
- Feedback review date:
  2026-05-14
- Decision owner:
  requester / future Technical Steering owner

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user request | Data dictionary entities should be durable manageable records with UX/API/LLM-script surfaces. | JTBD, journey, capability, assumptions | accept as draft signal | interview and Technical Steering needed |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial draft fast-path packet from user request. | Captures product direction and blockers. | Technical Steering, PRD, capability matrix, API contract, data dictionary, permission mapping, design-system governance |
| R2 | Requester added memo notes about structure, retention, status, design-system presets, attribute categories, and entity relationships. | Adds schema, UX, lifecycle, and relationship-navigation discovery signals. | Technical Steering, design-system governance, PRD, data model, API contract |

## Technical Steering Handoff

- Product decisions locked:
  none; draft signal only.
- Business decisions intentionally deferred until later with requester signoff:
  none yet.
- Technical questions packaged for technical stakeholder:
  owner feature, source of truth, versioning, generated docs, LLM/script
  authority, API/authz shape.
- Packet confidence for handoff:
  `65%`
- Scope cuts made to reach confidence:
  no implementation, no exact schema, no route paths, no UI design.
- Risk flags for Technical Steering:
  - permission-sensitive: yes
  - tenant-boundary: no by default, unless exposed to tenant-specific metadata
  - state-based journey matrix: yes
  - governed frontend: yes
  - new UX pattern: possible
  - design-system extension: possible
  - asset/user file: no
  - reporting/read model: yes
  - migration/persistence: yes
  - async/job: possible for generated docs/scripts
  - external provider: no
  - privacy/compliance: yes
- Recommended next artifact:
  continue discovery interview, then Technical Steering when policy questions
  are answered.
- Stop condition triggered:
  yes; source-of-truth, approval, delete, and LLM/script authority decisions
  remain open.
