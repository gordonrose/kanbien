# Story Breakdown: Organization Domain Foundation

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-05-12
- Epic ID:
  `EPIC-ORG-DOMAIN-FOUNDATION`
- Epic title:
  Organization domain foundation
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- Related PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`;
  `docs/architecture/adr/0035-adopt-object-storage-backed-asset-foundation.md`;
  `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`;
  `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `ready-for-story-breakdown`
- Steering non-goals preserved:
  no import or bulk upload, no special opening-hour calendars, no deep integration settings or secrets, no multiple active legal profiles, no public non-logo organization pages, no admin-visible change-history view in v1
- Steering stop conditions resolved or carried as blockers:
  public logo and private export decisions are approved for planning; app screens remain blocked on design-system work; source work remains blocked on requirements, behavior, proof, data, permission, and service answer documents.
- Architecture invention check:
  `consumes-steering-only`
- Governed DEV:frontend seam posture:
  `blocked`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  tenant boundary protection, root-versus-tenant authority, public image delivery, private export delivery, retained records, background work, search scale, audit evidence, and source-independent document alignment
- Missing source-of-truth artifacts:
  PRD, reconciled behavior map, detailed proof cases, service answer documents, data dictionary, permission mapping, job notes, runbook notes, design-system behavior locks, feature documents, feature manifests, generated dependency graph updates

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-ORG-001 | Organization domain family | architecture-foundation-required | Organization domain family across multiple feature bundles | approved | DECISION:architecture-foundation |
| TS-ORG-002 | Organization core records | feature-local | organizationCore feature bundle | approved | DEV:migration-persistence |
| TS-ORG-003 | Legal details | feature-local | organizationLegalDetails feature bundle | approved | DEV:migration-persistence |
| TS-ORG-004 | Locations and weekly opening hours | feature-local | organizationLocations and locationOpeningHours feature bundles | approved | DEV:migration-persistence |
| TS-ORG-005 | Business-unit hierarchy and memberships | feature-local | businessUnits and businessUnitMemberships feature bundles | approved | DEV:migration-persistence |
| TS-ORG-006 | High-level integration records | feature-local | organizationIntegrations feature bundle | approved | DEV:migration-persistence |
| TS-ORG-007 | Branding and logo relationships | feature-public-seam | organizationBrandingReferences consuming assets feature | approved | DOC:asset-decision |
| TS-ORG-008 | System reference catalogues | feature-local | organizationReferenceCatalogues unless broader platform catalogue feature is approved | deferred-with-owner | DECISION:architecture-foundation |
| TS-ORG-009 | Public logo asset delivery | platform-seam | assets feature and public delivery policy | approved | DOC:asset-decision |
| TS-ORG-010 | Private export bundles | platform-seam | job processing, assets/file delivery, and export feature seam | approved | DECISION:job-cleanup |
| TS-ORG-011 | Root and tenant admin authorization | feature-public-seam | platform authorization plus root/tenant auth feature seams | approved | DOC:permission-mapping |
| TS-ORG-012 | Separated-by-type domain search | architecture-foundation-required | Organization domain read-model/search strategy | approved | DECISION:architecture-foundation |
| TS-ORG-013 | Admin UI surfaces | design-system-seam | root-admin and future tenant-admin design-system-owned management areas | approved | GOV:design-system |
| TS-ORG-014 | Public read summaries for later consumers | feature-public-seam | narrow exported Organization domain summaries | deferred-with-owner | DOC:feature-manifest |
| TS-ORG-015 | Maintained artifact alignment | feature-local | planning and source-independent artifact sweep | approved | DOC:docs-artifact |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin organization management areas | root-admin | organization domain | organization management | primary-nav | root-operator | browser-workflow | app-adoption | durable-page | path | future /root-admin/organizations family | none | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | preview-apply-required | module-journey-files | not-applicable | Browser proof after design-system signoff and route adoption; no app implementation is handed off by this packet. |
| Tenant-admin organization management areas | new-family | organization domain | tenant organization management | primary-nav | tenant-actor | browser-workflow | app-adoption | durable-page | path | future tenant-admin organization family | none | not-applicable | generated-materializer | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | preview-apply-required | module-journey-files | not-applicable | Tenant-admin shell and topology path need governed planning before app screens; no app implementation is handed off by this packet. |
| Grouped organization-domain search | root-admin | organization domain | search and browse | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization-domain grouped search state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Search results separated by type; no browser implementation is handed off by this packet. |
| Logo management | root-admin | organization domain | branding/logo management | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization logo management state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Public asset decision must be carried into later proof; no browser implementation is handed off by this packet. |
| Export request/status/download | root-admin | organization domain | organization export | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization export workflow state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | server-backed-snapshot | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Private job-backed export; no browser implementation is handed off by this packet. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root and tenant admin browser calls require authenticated sessions. | Security checks for unauthenticated, unauthorized, cross-space, and wrong-authority denials. | yes |
| csrf-mutation | yes | Create, update, archive, move, upload, export, and delete actions are browser-triggered changes. | Service answer work must preserve existing trusted-origin protection. | yes |
| url-replay-state | yes | Search values may be low-risk state; authority and selected customer/account must remain server-side. | Replay review confirms no customer/account or permission authority in URLs. | yes |
| sensitive-rendering | yes | Admin areas may display legal details, memberships, retained records, and private export status. | Visibility and redaction checks must match actor authority. | yes |
| csp-assets | yes | Logo work must not inject unsafe uploaded content. | Image handling must remain compatible with content security policy. | yes |
| privileged-helper | yes | Export, cleanup, asset processing, and cache invalidation run under system control. | Background work must record authority, retry, and failure evidence. | yes |
| asset-delivery | yes | Public logos and private export bundles are file delivery surfaces. | Asset and export decisions must be carried into service, data, and proof work. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | behavior map needs reconciliation | yes | Existing first draft predates final public logo, export, and tenant-admin decisions. | DOC:docs-artifact |
| S-001 | requirements lock missing | yes | Product Discovery and steering exist, but PRD does not. | DOC:docs-artifact |
| S-002 | proof plan missing | yes | Detailed proof cases do not yet exist. | DOC:docs-artifact |
| S-003 | domain-family tooling pressure | yes | Steering approved early domain and runtime manifest readiness through explicit governance work. | DECISION:architecture-foundation |
| S-004 | durable organization records | yes | Core identity, parent hierarchy, depth, cycle, and lifecycle rules are required. | DEV:backend |
| S-005 | legal profile records | yes | One active legal profile per organization is required. | DEV:backend |
| S-006 | location and weekly-hour records | yes | Many locations and optional weekly hours are required. | DEV:backend |
| S-007 | unit and membership records | yes | Unit tree, real user/role membership, and max depth are required. | DEV:backend |
| S-008 | high-level integration records | yes | Official integration presence records are in scope while secrets are out. | DEV:backend |
| S-009 | reference catalogue governance | yes | System-owned catalogues need root edit and tenant use rules. | DEV:backend |
| S-010 | public logo branding | yes | Public image upload, replacement, delivery, placeholder, and export inclusion are required. | DEV:vertical-slice |
| S-011 | separated search | yes | Broad text search plus exact filters must be grouped by type. | DEV:backend |
| S-012 | private export bundles | yes | Background private zip export with retained data and actual logo files is required. | DEV:backend |
| S-013 | governed admin experience | yes | Admin screens are blocked until governed design patterns exist. | GOV:design-system |
| S-014 | future public summaries | yes | Later consumers need narrow summaries after core records exist. | DEV:backend |
| S-015 | maintained evidence alignment | yes | Feature documents, manifests, generated graph, runbooks, and status notes must stay aligned. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Break the Organization domain foundation into reviewable stories so later work can build the customer/account structure, branding, search, export, and admin experience from clear boundaries.
- Epic outcome:
  The next planning step can start with ready control stories, while build stories remain blocked until their source truths and proof obligations exist.
- Epic actors:
  root admin, tenant admin, public logo reader, background worker, planning reviewer, security reviewer, support operator
- Epic non-goals:
  import, deep integration setup, special opening-hour calendars, multiple active legal profiles, public non-logo pages, visible change-history screens
- Epic dependency summary:
  Depends on tenant context, root and tenant authorization, assets, background work, storage, design-system governance, public-seam governance, and maintained planning artifacts.
- Epic-level proof target:
  `mixed`

## Story Narratives

### S-000: Update the Organization behavior spreadsheet

**Situation**
We already have a first-draft Organization spreadsheet, but the conversation changed and clarified important parts of the feature: tenant admins are in scope, public logos are in scope, private exports are in scope, and several future ideas are out of scope.

**Goal**
The spreadsheet should become the shared checklist for the first version. Anyone reading it should be able to see what Organization needs to do, what is deferred, and which story will carry each part forward.

**Decisions Needed**
No new decision is expected. If the spreadsheet exposes a contradiction, that contradiction should be called out instead of guessed around.

**Work That Follows**
After this, the requirements document can use the spreadsheet as its checklist instead of re-reading the whole conversation.

**Evidence Of Success**
A reviewer can open the spreadsheet and see every agreed first-version Organization behavior listed once, with clear story ownership, source evidence, and no stale promises from the earlier draft.

### S-001: Write the Organization requirements document

**Situation**
The Organization foundation now has many confirmed rules: who can manage records, which records exist, how logos and exports work, and which ideas are deferred. Those rules need one readable home.

**Goal**
Someone should be able to open the requirements document and understand the first version without reading the whole conversation.

**Decisions Needed**
No new business choice is expected; any hidden conflict found while writing must be surfaced instead of guessed.

**Work That Follows**
After this, build planning can use the requirements document as the source for what should be created.

**Evidence Of Success**
A reviewer can confirm that the document lists the agreed scope, names what is out of scope, and does not quietly add or drop behavior.

### S-002: Write the Organization test plan

**Situation**
This foundation touches sensitive records, public images, private downloads, and background work. If the checks are vague, important risks can slip through.

**Goal**
Reviewers can see exactly which situations need to be checked: allowed actions, denied actions, record changes, privacy, audit history, recovery from failures, and screens.

**Decisions Needed**
No new business choice is expected; any proof gap must be named as a blocker.

**Work That Follows**
After this, later build tasks can include the right checks from the start.

**Evidence Of Success**
Every active story has a named check, and no sensitive behavior is left with a vague "we should test this later."

### S-003: Teach the repo that Organization is a family of features

**Situation**
Organization will not be one giant feature. It will include core organizations, locations, units, branding, exports, and more. The repo needs a clean way to show that these pieces belong together.

**Goal**
The repo should be able to show which features are part of the Organization family and what each part is responsible for.

**Decisions Needed**
The governance work must choose the approved place and format for that family information.

**Work That Follows**
After this, the Organization features can be added without inventing a different tracking style in each folder.

**Evidence Of Success**
Reviewers can see Organization represented as a feature family, and the repo checks accept that representation.

### S-004: Core organizations and hierarchy

**Situation**
Admins need official organization records that can represent parent and child relationships without losing track of ownership or history.

**Goal**
An admin can create, edit, archive, restore, move, and review organizations without accidentally crossing into another customer/account.

**Decisions Needed**
The requirements document must settle exact fields, names, and acceptable values before build tasks are written.

**Work That Follows**
After this is planned in detail, build work can create the organization records and the rules for moving or archiving them.

**Evidence Of Success**
Reviewers can confirm the depth limit, loop prevention, branch archive option, child move option, and denial when a move crosses the wrong customer/account.

### S-005: Legal profiles

**Situation**
Organizations need official legal details, but the first version allows only one active profile so later records remain understandable.

**Goal**
Admins can maintain one active legal profile per organization while retained prior records remain available where required.

**Decisions Needed**
The requirements document must settle exact legal fields and how old legal profiles are kept.

**Work That Follows**
After this is planned in detail, build work can create the legal profile records and the checks that prevent duplicate active profiles.

**Evidence Of Success**
Reviewers can confirm the one-active rule, retained history, and tenant-bound access behavior.

### S-006: Locations and weekly hours

**Situation**
Organizations can have many places of operation, and the head-office flag is descriptive rather than a uniqueness rule.

**Goal**
Admins can manage locations and optional weekly hours without accidentally promising holiday, seasonal, or temporary hours.

**Decisions Needed**
The detailed requirements must settle location fields, weekly slot values, and invalid time examples.

**Work That Follows**
After this is planned in detail, build work can create the location and weekly-hours records and reject invalid times.

**Evidence Of Success**
Reviewers can confirm multiple head-office flags are allowed, weekly hours are optional, and invalid time ranges are rejected.

### S-007: Units and memberships

**Situation**
Organizations need internal units and membership links, but membership must point to real people and roles already known by the system.

**Goal**
Admins can manage unit hierarchy and memberships while preventing placeholder people, placeholder roles, loops, and depth overflow.

**Decisions Needed**
The requirements document must settle membership fields, where roles come from, and how unit moves work.

**Work That Follows**
After this is planned in detail, build work can create unit records, membership links, and the checks that prevent fake or cross-account links.

**Evidence Of Success**
Reviewers can confirm the depth limit, cycle prevention, real user and role links, and cross-boundary denial.

### S-008: Integration records

**Situation**
Admins need to record which integrations are official without storing credentials, endpoints, or deeper setup in the first version.

**Goal**
Admins can maintain high-level integration records while sensitive setup remains outside the first version.

**Decisions Needed**
The detailed requirements must settle record fields and the wording that keeps secrets and provider setup out of scope.

**Work That Follows**
After this is planned in detail, build work can create the integration records and reject sensitive setup fields.

**Evidence Of Success**
Reviewers can confirm official records exist without accepting credentials, endpoints, or provider configuration.

### S-009: Reference catalogues

**Situation**
Admins need shared values such as organization types or relationship types, and those values must stay stable when records already use them.

**Goal**
Root admins can manage the shared values, and tenant admins can use the approved values inside their own customer/account.

**Decisions Needed**
The detailed requirements must settle whether these shared values belong only to Organization for now or to a broader shared-value area.

**Work That Follows**
After this is planned in detail, build work can create the shared values and the rules for renaming, archiving, deprecating, and replacing them.

**Evidence Of Success**
Reviewers can confirm used values are archived, deprecated, or replaced explicitly, and label changes apply immediately.

### S-010: Public logo branding

**Situation**
Organizations need real logo images that can appear publicly after they are accepted as safe and usable.

**Goal**
Admins can upload, replace, remove, and export multiple logo types while public places show approved image URLs or initials placeholders.

**Decisions Needed**
No new business choice is expected; the approved image, replacement, and cache decisions must be carried into later planning.

**Work That Follows**
After this is planned in detail, build work can create upload, safety checking, replacement, removal, public display, placeholder, and export behavior.

**Evidence Of Success**
Reviewers can confirm old images stay until replacement is ready, raw storage links are not exposed, and removed logos fall back to deterministic initials.

### S-011: Separated search

**Situation**
Admins need to find records across the whole organization structure, but the results must stay understandable and only show records the admin is allowed to see.

**Goal**
Admins can search broadly, apply exact filters, and see results grouped by record type.

**Decisions Needed**
The requirements document must settle which fields can be searched, which filters are supported, how results are ordered, and how many results can be returned.

**Work That Follows**
After this is planned in detail, build work can create the search behavior, supported filters, ordering, and result groups.

**Evidence Of Success**
Reviewers can confirm grouped results, stable paging, exact filters, and no cross-boundary leakage.

### S-012: Private export bundles

**Situation**
Admins need a downloadable copy of Organization information, including retained records and real logo image files, without creating a public link.

**Goal**
Admins can request selected sections and later download a private zip that expires after 24 hours or deletion.

**Decisions Needed**
No new business choice is expected; the approved private export decision must be carried into later planning.

**Work That Follows**
After this is planned in detail, build work can create the export request, background processing, status, download, expiry, deletion, retry, and cleanup behavior.

**Evidence Of Success**
Reviewers can confirm selected sections, all retained data, actual logo files, private access, quotas, retries, and cleanup failure recording.

### S-013: Design shared admin screen patterns first

**Situation**
Admins need separate management areas for organizations, locations, units, logos, search, and exports. Before those screens are built, the shared screen patterns need to be settled.

**Goal**
The design-system work should define how these screens behave: lists, details, grouped search results, branch archive choices, logo management, and export status.

**Decisions Needed**
The design work must decide which existing shared patterns can be reused and which new patterns need approval.

**Work That Follows**
After this, the real admin screens can use the approved patterns instead of inventing their own.

**Evidence Of Success**
Reviewers can open the design-system references and see the approved patterns that the real screens must use.

### S-014: Defer public Organization summaries until a real consumer needs them

**Situation**
Later product areas may need a small public Organization summary, but the first version is not building public non-logo pages.

**Goal**
We should remember the future need without designing a public summary too early.

**Decisions Needed**
The exact future use case and fields should be decided after core organization records exist.

**Work That Follows**
This story stays deferred until a real feature needs the summary.

**Evidence Of Success**
Reviewers can see that the future idea is recorded, but no first-version work is blocked by it.

### S-015: Keep planning, support, and feature notes in sync

**Situation**
Organization will be delivered in several pieces. If the notes are not refreshed as each piece lands, future work will start from stale information.

**Goal**
Reviewers can trust that the requirements, feature notes, generated records, support notes, and status notes match what was actually built.

**Decisions Needed**
No new business choice is expected; each slice just needs to refresh the records it changed.

**Work That Follows**
After each Organization slice, the related notes and generated records are checked before the slice is treated as finished.

**Evidence Of Success**
Reviewers can confirm that completed Organization work does not leave stale planning or support notes behind.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Update the Organization behavior spreadsheet | This is needed because we made many Organization decisions in conversation, and they need to be captured in the spreadsheet used to plan the work. | As the planner, I need the Organization spreadsheet updated with the final decisions so the requirements document and later build work use the same checklist. | planner | The spreadsheet lists first-version Organization behaviors clearly, including scope, deferrals, source evidence, and story ownership. | Product Discovery; Technical Steering; asset/export decisions; first-draft spreadsheet |
| S-001 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Write the Organization requirements document | This is needed because the Organization feature is too broad to build safely from chat notes alone. | As the planner, I need one requirements document that says what the first version includes, excludes, and must protect. | planner | The first-version Organization requirements are captured in docs/prd/2026-05-12-0025-organization-domain-foundation.md. | S-000 |
| S-002 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Write the Organization test plan | This is needed because Organization will touch private records, public logos, exports, and permissions, so we need to know how each promise will be checked. | As the quality reviewer, I need a test plan that names the checks required for each story. | quality reviewer | The test plan says how we will check permissions, privacy, record changes, logo handling, export packages, search, and screen behavior. | S-001 |
| S-003 | ready-for-task-breakdown | harness-value | DECISION:architecture-foundation | Teach the repo that Organization is a family of features | This is needed because Organization will be several related features, and the repo should track that relationship before the work spreads out. | As the repo governance owner, I need an approved way to mark Organization features as part of the same family. | repo governance owner | Organization feature records can show their family and responsibility without using unsupported fields. | Technical Steering |
| S-004 | needs-prd-refinement | system-value | DEV:backend | Core organizations and hierarchy | This is its own story because every other Organization record needs a real organization to attach to. | As the system, I need organization records that can be safely arranged into parent and child organizations inside one customer/account. | system | Organizations can be created, edited, archived, restored, moved, and kept inside the right customer/account. | S-000; S-001; S-002; S-003 |
| S-005 | needs-prd-refinement | system-value | DEV:backend | Legal profiles | This is its own story because legal details have a special rule: only one legal profile can be active for an organization. | As the system, I need each organization to have at most one active legal profile. | system | Admins can maintain legal details without creating two active legal profiles for the same organization. | S-000; S-001; S-002; S-004 |
| S-006 | needs-prd-refinement | user-value | DEV:backend | Locations and weekly hours | This is its own story because an organization can have many locations, and weekly opening hours have their own simple rules. | As an admin, I need to manage organization locations and optional weekly opening hours. | admin | Admins can save locations, mark descriptive head-office flags, and add optional weekly hours. | S-000; S-001; S-002; S-004 |
| S-007 | needs-prd-refinement | user-value | DEV:backend | Units and memberships | This is its own story because internal units and membership links are useful only if they point to real users and roles. | As an admin, I need to manage unit hierarchy and membership links using real existing records. | admin | Admins can create unit trees and memberships without placeholder users, placeholder roles, loops, or cross-account links. | S-000; S-001; S-002; S-004 |
| S-008 | needs-prd-refinement | user-value | DEV:backend | Integration records | This is its own story because admins should be able to record that an integration exists without storing setup secrets. | As an admin, I need to record official organization integrations without storing sensitive setup. | admin | Admins can track official integrations, while credentials, endpoints, and provider setup stay out of the first version. | S-000; S-001; S-002; S-004 |
| S-009 | needs-prd-refinement | system-value | DEV:backend | Reference catalogues | This is needed because Organization records will reuse shared values, and those values cannot disappear after records start using them. | As the system, I need shared Organization values that root admins manage and tenant admins can choose from. | system | Shared values can be created, renamed, archived, deprecated, or replaced without breaking records that already use them. | S-000; S-001; S-002 |
| S-010 | needs-prd-refinement | user-value | DEV:vertical-slice | Public logo branding | This is its own story because logo images are uploaded by admins, shown publicly, included in exports, and need safety checks. | As an admin, I need to manage organization logos so public places show safe approved images or initials placeholders. | admin and public reader | Multiple logo types can be uploaded, replaced, removed, shown publicly, and included in exports. | S-000; S-001; S-002; public logo decision |
| S-011 | needs-prd-refinement | user-value | DEV:backend | Separated search | This is needed because admins may need to search organizations, locations, units, integrations, and other related records from one place. | As an admin, I need to search across Organization records and see results grouped by what kind of record they are. | admin | Search returns grouped results, respects permissions, and supports predictable paging and filters. | S-000; S-001; S-002; S-004 through S-010 |
| S-012 | needs-prd-refinement | user-value | DEV:backend | Private export bundles | This is its own story because exports include retained data and real logo files, so they must be prepared carefully and kept private. | As an admin, I need to request selected Organization sections and download them later as a private zip file. | admin and background worker | The system creates private export zip files, makes them available for 24 hours or until deleted, and records failures. | S-000; S-001; S-002; private export decision |
| S-013 | ready-for-task-breakdown | harness-value | GOV:design-system | Design shared admin screen patterns first | This is needed because Organization screens should use approved shared patterns instead of one-off screen designs. | As the design-system owner, I need approved patterns for the Organization admin screens before the real screens are built. | design-system owner | The main Organization screen patterns are approved before root and tenant admin screens use them. | S-001; S-002 |
| S-014 | blocked | system-value | DEV:backend | Defer public Organization summaries until a real consumer needs them | This is deferred because we do not yet know which future feature needs a reduced public Organization summary. | As the system, I need public Organization summaries to wait until a real future use case names the fields it needs. | system | The future summary idea is recorded, but it does not block first-version admin management. | S-004; future consumer decision |
| S-015 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Keep planning, support, and feature notes in sync | This is needed because Organization work will land in pieces, and the notes about the feature should not drift from what was actually built. | As the planning reviewer, I need the related notes and generated records refreshed as each Organization piece lands. | planning reviewer | Requirements, feature notes, generated records, and support notes stay aligned with the implemented Organization work. | All stories |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The refreshed spreadsheet maps every active first-version behavior to a source decision and story ID, and marks deferred behavior without treating it as build-ready. | contract-level | docs-alignment, standards | capability matrix |
| AC-S001-01 | S-001 | The requirements source preserves confirmed v1 scope, actors, lifecycle, non-goals, and blocker carry-forward from discovery and steering. | contract-level | docs-alignment, standards | PRD |
| AC-S002-01 | S-002 | Detailed proof cases are created for actor authority, lifecycle, privacy, audit, asset, export, search, background work, and browser obligations. | contract-level | docs-alignment, security, audit | PRD-derived test cases |
| AC-S003-01 | S-003 | Repo governance supports domain-family and runtime-boundary metadata before Organization feature records depend on those fields. | source-level | unit, docs-alignment, generated-artifact | ADR or governance notes, manifest checks, generated graph |
| AC-S004-01 | S-004 | Organization records support create, read, update, archive, reactivate, parent move, branch archive, child reassignment, depth 10, cycle denial, and same-customer/account enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, data dictionary, permission mapping, service answer docs |
| AC-S005-01 | S-005 | Legal profile records enforce one active profile per organization while retaining prior or archived profiles according to the requirements source. | persistence-level | unit, integration, security, audit, persistence | PRD, data dictionary, permission mapping |
| AC-S006-01 | S-006 | Locations and optional weekly opening hours allow many locations, descriptive head-office flags, valid weekly slots, and archive behavior without special calendar rules. | persistence-level | unit, integration, security, persistence | PRD, data dictionary, service answer docs |
| AC-S007-01 | S-007 | Unit hierarchy and memberships enforce depth 10, cycle denial, real user and role references, same-customer/account boundaries, and archive or move-child behavior. | persistence-level | unit, integration, security, audit, persistence | PRD, data dictionary, permission mapping |
| AC-S008-01 | S-008 | Integration records store only approved high-level official integration facts and reject credentials, endpoints, secrets, and provider setup values. | persistence-level | unit, integration, security, privacy | PRD, data dictionary, permission mapping |
| AC-S009-01 | S-009 | Reference catalogue values are root-managed, tenant-usable, immediately reflected by label changes, and archived, deprecated, or explicitly replaced when already used. | mixed | unit, integration, security, audit, compatibility | PRD, data dictionary, permission mapping |
| AC-S010-01 | S-010 | Public logo branding supports approved raster uploads, multiple logo types, accepted-safe public delivery, stable app-controlled URLs, replacement safety, removal placeholder, alt text defaulting, and export inclusion. | mixed | unit, integration, security, audit, asset, accessibility, runtime-api | PRD, asset decision, data dictionary, permission mapping, runbook |
| AC-S011-01 | S-011 | Search supports broad text search, explicit exact filters, stable paging, grouped result types, and permission-filtered results without arbitrary advanced query behavior. | runtime-api | unit, integration, security, performance, compatibility | PRD, data dictionary, service answer docs |
| AC-S012-01 | S-012 | Private exports create selectable-section zip bundles with CSV and JSON, actual retained logo files, private download, 24-hour expiry or deletion, quotas, retries, and cleanup failure recording. | mixed | unit, integration, security, audit, privacy, resilience, job | PRD, export decision, data dictionary, permission mapping, runbook |
| AC-S013-01 | S-013 | Design-system work defines approved shared patterns for lists, detail editing, grouped search, branch archive or move-child, logo management, and export status before app screen adoption. | rendered-browser | visual, accessibility, interaction, standards | design-system behavior locks and references |
| AC-S014-01 | S-014 | Public summary work remains deferred until core records and a first consumer are known, with no private owning-record dependency promised early. | contract-level | docs-alignment, compatibility | feature manifest notes after consumer decision |
| AC-S015-01 | S-015 | Maintained records are refreshed as slices land, including feature records, generated graph, source-independent documents, runbooks, and status notes. | mixed | docs-alignment, standards, generated-artifact | feature docs, manifests, generated graph, runbooks |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | CAP-ORG-000 | planning | create-or-refresh-required | Control row for behavior map reconciliation. |
| S-001 | AC-S001-01 | CAP-ORG-001 | planning | create-or-refresh-required | Control row for requirements lock. |
| S-002 | AC-S002-01 | CAP-ORG-002 | planning | create-or-refresh-required | Control row for proof planning. |
| S-003 | AC-S003-01 | CAP-ORG-003 | repo-governance | create-or-refresh-required | Domain family metadata support. |
| S-004 | AC-S004-01 | CAP-ORG-CORE-001 | tenant/root | create-or-refresh-required | Core organization management behavior. |
| S-005 | AC-S005-01 | CAP-ORG-LEGAL-001 | tenant/root | create-or-refresh-required | Legal profile behavior. |
| S-006 | AC-S006-01 | CAP-ORG-LOC-001 | tenant/root | create-or-refresh-required | Location and weekly hours behavior. |
| S-007 | AC-S007-01 | CAP-ORG-UNIT-001 | tenant/root | create-or-refresh-required | Unit and membership behavior. |
| S-008 | AC-S008-01 | CAP-ORG-INT-001 | tenant/root | create-or-refresh-required | High-level integration record behavior. |
| S-009 | AC-S009-01 | CAP-ORG-CAT-001 | root/tenant-use | create-or-refresh-required | Reference catalogue behavior. |
| S-010 | AC-S010-01 | CAP-ORG-BRAND-001 | tenant/root/public | create-or-refresh-required | Logo branding and public read behavior. |
| S-011 | AC-S011-01 | CAP-ORG-SEARCH-001 | tenant/root | create-or-refresh-required | Grouped search behavior. |
| S-012 | AC-S012-01 | CAP-ORG-EXPORT-001 | tenant/root/system-job | create-or-refresh-required | Private export behavior. |
| S-013 | AC-S013-01 | CAP-ORG-UI-001 | governed-ui | create-or-refresh-required | Design-system prerequisite behavior. |
| S-014 | AC-S014-01 | CAP-ORG-SUMMARY-001 | future-public-seam | create-or-refresh-required | Deferred public summary behavior. |
| S-015 | AC-S015-01 | CAP-ORG-ARTIFACT-001 | planning | create-or-refresh-required | Maintained record alignment behavior. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S000 | S-000 / AC-S000-01 | Product Discovery, Technical Steering, public-logo decision, private-export decision, first-draft spreadsheet, and spreadsheet template | planning-source | existing | Reconciled CSV contains every story behavior row with source evidence. | no runtime integration; docs alignment proof only |
| DEP-S001 | S-001 / AC-S001-01 | Product Discovery and Technical Steering packets | planning-source | existing | PRD preserves confirmed decisions and non-goals. | no runtime integration; docs alignment proof only |
| DEP-S002 | S-002 / AC-S002-01 | story acceptance criteria and proof guide | planning-source | existing | Test case document covers each AC and sensitive obligation. | no runtime integration; proof planning only |
| DEP-S003 | S-003 / AC-S003-01 | feature manifest and dependency graph governance | repo-governance | new | Manifest schema/checks support approved metadata. | generated graph test proves supported fields are handled |
| DEP-S004 | S-004 / AC-S004-01 | tenant context and authorization evaluator | feature-public-seam | existing | Root and tenant allow/deny behavior is documented. | integration test proves same-customer/account enforcement |
| DEP-S005 | S-005 / AC-S005-01 | organization core record identity | feature-public-seam | new | Legal profiles resolve owning organization through public identity seam. | integration test proves profile cannot attach across boundaries |
| DEP-S006 | S-006 / AC-S006-01 | organization core record identity | feature-public-seam | new | Locations resolve owning organization through public identity seam. | integration test proves location cannot attach across boundaries |
| DEP-S007 | S-007 / AC-S007-01 | user and role public identity seams | feature-public-seam | existing-or-new | Memberships can validate real users and roles without private imports. | integration test proves placeholder and cross-boundary denial |
| DEP-S008 | S-008 / AC-S008-01 | organization core record identity | feature-public-seam | new | Integration records resolve owning organization through public identity seam. | integration test proves sensitive setup fields are rejected |
| DEP-S009 | S-009 / AC-S009-01 | reference catalogue ownership decision | architecture-foundation | new | Catalogue owner is settled before implementation tasks. | integration test proves root mutation and tenant use behavior |
| DEP-S010 | S-010 / AC-S010-01 | assets feature and public delivery policy | platform-seam | existing | Asset decision is carried into upload, read, replace, delete, and public URL behavior. | integration test proves accepted-safe replacement and raw URL denial |
| DEP-S011 | S-011 / AC-S011-01 | organization records and indexes | read-model | new | Search fields and filters are documented before route behavior. | integration test proves grouped filtered results across record types |
| DEP-S012 | S-012 / AC-S012-01 | background worker and private file delivery | platform-seam | existing-or-new | Export decision is carried into job, status, download, expiry, and cleanup behavior. | integration test proves private download and cleanup failure recording |
| DEP-S013 | S-013 / AC-S013-01 | design-system governed page patterns | design-system-seam | new | Behavior locks and rendered references exist before app adoption. | browser tests prove shared patterns before app screens consume them |
| DEP-S014 | S-014 / AC-S014-01 | first future consumer decision | future-feature-seam | new | Consumer and summary fields are decided before public summary work. | future integration test required after consumer exists |
| DEP-S015 | S-015 / AC-S015-01 | feature manifests and generated graph | repo-governance | existing | Generated records match feature public seams after each slice. | generated graph tests run after manifest changes |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| organization core public identity seam | legal, locations, units, integrations, branding, search, export | owning organization identity and lifecycle can be checked without private record imports | private persistence records | first consumer integration test |
| organization branding reference seam | assets and export work | logo relationships are owned by Organization while asset safety remains owned by assets | raw bucket URL authority | logo replacement and export integration tests |
| organization export request seam | admin experience and support operations | export lifecycle is requestable, inspectable, downloadable, expirable, and auditable | public links or URL-carried authority | export job and cleanup integration tests |
| grouped organization search response | admin screens and future support tools | results are grouped by type and permission-filtered | browser-only filtering | search integration and browser adoption tests |
| organization domain manifest metadata | dependency graph and future extraction review | domain membership and runtime boundary intent are supported by tooling | unsupported manifest fields | generated graph validation tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | planning reviewer | not-applicable: planning control | active packet | draft behavior list, final behavior list | complete rows, missing rows, contradictory rows | draft to reconciled | missing source packet | traceability, standards |
| S-001 | planning reviewer | not-applicable: planning control | active packet | discovery and steering ready | confirmed scope, non-goals, blockers | draft to approved requirements | conflicting source decision | traceability, standards |
| S-002 | quality reviewer | not-applicable: planning control | active packet | story queue ready and blocked | allow, deny, lifecycle, privacy, asset, export proof obligations | draft to proof plan | missing story AC | security, audit, privacy, resilience |
| S-003 | repo governance owner | allowed repo governance change | active branch | current manifest schema, updated schema | supported metadata fields, rejected unsupported fields | unsupported to supported | generated graph failure | compatibility, standards |
| S-004 | root admin, tenant admin | allowed and denied root/tenant authority | active, expired, wrong customer/account | active, archived, deleted, parented, childed organizations | names, reference values, parent ids, depth boundaries | create, update, archive, reactivate, move, branch archive | cycle, stale parent, missing parent, cross-boundary parent | security, audit, performance, compatibility |
| S-005 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong customer/account | no profile, active profile, archived profile | legal name, registration values, empty string rejection | create active, replace active, archive | duplicate active, missing org, cross-boundary org | privacy, audit, compatibility |
| S-006 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong customer/account | many locations, archived locations, no hours, weekly hours | address fields, flags, weekday, open/close times | create, update, archive, replace hours | invalid time range, missing org, cross-boundary org | accessibility, audit, performance |
| S-007 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong customer/account | unit tree, archived unit, real users, real roles | parent ids, user ids, role ids, depth boundaries | create, update, archive, move, membership add/remove | cycle, placeholder user, placeholder role, stale role | security, audit, compatibility |
| S-008 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong customer/account | active integration records, archived records | provider name, purpose, rejected secret-like fields | create, update, archive | sensitive field submitted, missing org | privacy, security, audit |
| S-009 | root admin, tenant admin | root mutate, tenant use, denied tenant mutate | active, disabled session | active, archived, deprecated, replaced, in-use values | labels, keys, replacement ids, empty string rejection | create, edit label, archive, deprecate, replace | replacement missing, in-use delete attempt | compatibility, audit, security |
| S-010 | root admin, tenant admin, public reader, asset processor | admin manage, public read, denied raw access | active, expired upload intent | pending, accepted, rejected, replaced, removed logos | MIME allowlist, size 5 MB, alt text, logo type | upload, accept, replace, remove, cleanup | scan failure, purge failure, stale public cache | security, privacy, accessibility, resilience |
| S-011 | root admin, tenant admin | allowed and denied root/tenant search | active, wrong customer/account | active and archived records across types | search text, exact filters, page, page size, sort | search request to grouped results | index unavailable, unsupported filter | security, performance, compatibility |
| S-012 | root admin, tenant admin, background worker | request/download/delete own scope, denied other scope | active, expired session | queued, running, ready, failed, expired, deleted exports | section list, zip size, retry count, checksum | request, run, ready, download, expire, delete, cleanup retry | worker timeout, storage failure, cleanup failure | privacy, audit, resilience, operability |
| S-013 | design-system owner, app adopter | approved design governance | active design packet | draft pattern, signed-off pattern | list density, search grouping, confirmation, upload, status states | draft to behavior lock to adoption | visual mismatch, accessibility failure | accessibility, browser proof, standards |
| S-014 | system, future consumer | not-applicable until consumer exists | deferred | no consumer, known consumer | summary field list, private-field exclusion | deferred to active later | consumer not identified | compatibility, privacy |
| S-015 | planning reviewer | not-applicable: planning control | active branch | changed feature records, changed docs, changed generated graph | aligned, stale, missing generated output | draft to aligned after slice | missing generated record, stale document | traceability, standards, operability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | planner with source packets and draft spreadsheet | CAP-ORG-000 | contract-level | Create proof case that every active behavior row has source evidence and story ownership, and every deferred behavior is marked deferred. | no |
| AC-S001-01 | planning reviewer with ready discovery and steering packets | CAP-ORG-001 | contract-level | Create proof case that PRD preserves scope, non-goals, blockers, and decisions. | no |
| AC-S002-01 | quality reviewer with all active and blocked stories | CAP-ORG-002 | contract-level | Create proof cases for actor, permission, lifecycle, asset, export, search, and browser obligations. | no |
| AC-S003-01 | repo governance owner with current and updated manifest checks | CAP-ORG-003 | source-level | Create proof case for supported metadata validation and generated graph handling. | yes |
| AC-S004-01 | root and tenant admins across active, archived, childed, and wrong-boundary organizations | CAP-ORG-CORE-001 | persistence-level | Create proof cases for hierarchy depth, cycle denial, branch archive, child move, and boundary denial. | yes |
| AC-S005-01 | root and tenant admins across no-profile, active-profile, and archived-profile states | CAP-ORG-LEGAL-001 | persistence-level | Create proof cases for one-active legal profile, replacement, retention, and boundary denial. | yes |
| AC-S006-01 | root and tenant admins across many locations and optional weekly hours | CAP-ORG-LOC-001 | persistence-level | Create proof cases for descriptive head-office flags, weekly slot validation, optional hours, and archive behavior. | yes |
| AC-S007-01 | root and tenant admins across unit tree, real user, real role, and wrong-boundary states | CAP-ORG-UNIT-001 | persistence-level | Create proof cases for unit depth, cycle denial, real-record membership, and archive or move-child behavior. | yes |
| AC-S008-01 | root and tenant admins across active and archived integration records | CAP-ORG-INT-001 | persistence-level | Create proof cases for approved high-level fields and rejected secret, endpoint, credential, and provider setup values. | yes |
| AC-S009-01 | root admin mutate and tenant admin use across active, archived, deprecated, and in-use values | CAP-ORG-CAT-001 | mixed | Create proof cases for root-only mutation, tenant use, immediate label read, archive, deprecate, and explicit replace. | yes |
| AC-S010-01 | admin, public reader, and asset processor across pending, accepted, replaced, removed, and failed states | CAP-ORG-BRAND-001 | mixed | Create proof cases for upload safety, accepted public delivery, replacement, raw URL denial, placeholder, alt text, and export inclusion. | yes |
| AC-S011-01 | root and tenant admins across active, archived, filtered, paged, and wrong-boundary results | CAP-ORG-SEARCH-001 | runtime-api | Create proof cases for broad text search, exact filters, grouped results, paging, unsupported filters, and boundary denial. | yes |
| AC-S012-01 | admin and background worker across queued, running, ready, failed, expired, and deleted exports | CAP-ORG-EXPORT-001 | mixed | Create proof cases for selected sections, CSV and JSON, logo files, private download, expiry, deletion, retries, quota, and cleanup failure. | yes |
| AC-S013-01 | design-system owner and app adopter across draft, signed-off, and mismatch states | CAP-ORG-UI-001 | rendered-browser | Create browser proof cases for list, detail, grouped search, branch archive, logo management, and export status patterns. | yes |
| AC-S014-01 | future consumer absent and future consumer known states | CAP-ORG-SUMMARY-001 | contract-level | Create future proof case when first consumer and summary fields are approved. | yes |
| AC-S015-01 | planning reviewer across changed and stale maintained records | CAP-ORG-ARTIFACT-001 | mixed | Create proof case for feature records, generated graph, source-independent documents, runbooks, and status notes after each slice. | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| RF-ORG-001 | S-003; S-004 through S-015 | architecture-foundation | Domain family metadata should be supported before Organization feature records depend on it. | Repo-governance decision and supported checks for domain-family metadata. | Stop Organization implementation if unsupported feature record fields would be required. |
| RF-ORG-002 | S-013 | design-system-governance | App screens require governed shared patterns before adoption. | Signed-off design-system behavior locks, references, verification, and adoption posture. | Stop app screen work if shared render or behavior seams do not exist. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| FQ-ORG-001 | Blocked build stories | Do any steering decisions need to change before artifact creation starts? | no | No change requested; planning owners proceed from current steering unless a later conflict is found. |
| FQ-ORG-002 | S-009 catalogue owner | Should a broader platform catalogue owner replace the Organization-owned catalogue owner for v1? | no | Deferred with owner; safe v1 default is Organization-owned catalogues unless a broader owner is approved before that story reaches task breakdown. |
| FQ-ORG-003 | S-014 public summaries | Which first consumer needs Organization summaries? | no | Deferred until core organization records exist and a real consumer is ready. |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-ORG-001 | S-000 / AC-S000-01 | ART-ORG-001 | capability-matrix-required | not-applicable: no human decision remains | safe default: reconcile from discovery, steering, and asset/export decisions | Run capability matrix maintenance next. | yes | ready-to-create-artifact |
| U-ORG-002 | S-001 / AC-S001-01 | ART-ORG-002 | prd-required | not-applicable: no human decision remains | safe default: create PRD from approved discovery and steering | Run PRD maintenance after behavior map refresh. | yes | ready-to-create-artifact |
| U-ORG-003 | S-002 / AC-S002-01 | ART-ORG-003 | artifact-creation | not-applicable: no human decision remains | safe default: derive proof cases from PRD and story ACs | Run PRD test-case planning after PRD creation. | yes | ready-to-create-artifact |
| U-ORG-004 | S-003 / AC-S003-01 | ART-ORG-004 | technical-steering-revisit | not-applicable: no human decision remains | safe default: create explicit repo-governance story before Organization implementation | Run repo governance decision work before feature records are created. | yes | ready-to-create-artifact |
| U-ORG-005 | S-004 through S-012 / build ACs | ART-ORG-005 | api-contract-required | not-applicable: no human decision remains | safe default: write root and tenant service answer documents after PRD | Run service answer documentation before route work. | yes | ready-to-create-artifact |
| U-ORG-006 | S-004 through S-012 / build ACs | ART-ORG-006 | data-dictionary-required | not-applicable: no human decision remains | safe default: create data dictionary pages for each durable record family | Run data dictionary maintenance before saved-record work. | yes | ready-to-create-artifact |
| U-ORG-007 | S-004 through S-012 / build ACs | ART-ORG-007 | permission-mapping-required | not-applicable: no human decision remains | safe default: map root allow, tenant allow, tenant cross-deny, catalogue root mutation, asset, export, and job authority | Run permission mapping maintenance before protected work. | yes | ready-to-create-artifact |
| U-ORG-008 | S-010 / AC-S010-01 | ART-ORG-008 | artifact-creation | not-applicable: asset decision approved for planning | safe default: carry approved public-logo decision into PRD, data, permissions, runbook, and proof | Include public-logo decision in downstream artifacts before implementation. | yes | resolved |
| U-ORG-009 | S-012 / AC-S012-01 | ART-ORG-009 | artifact-creation | not-applicable: export decision approved for planning | safe default: carry approved private-export decision into PRD, data, permissions, runbook, and proof | Include export decision in downstream artifacts before implementation. | yes | resolved |
| U-ORG-010 | S-013 / AC-S013-01 | ART-ORG-010 | design-system-governance | not-applicable: no human decision remains | safe default: create design-system behavior locks before app adoption | Run design-system governance before app screen work. | yes | ready-to-create-artifact |
| U-ORG-011 | S-014 / AC-S014-01 | FQ-ORG-003 | human-decision | Which first consumer needs Organization summaries? | wait for first consumer; no safe default for summary fields | Keep deferred until core records and consumer need exist. | no | deferred-with-owner |
| U-ORG-012 | S-015 / AC-S015-01 | ART-ORG-011 | artifact-creation | not-applicable: no human decision remains | safe default: run maintained-artifact sweeps after each slice | Add alignment checks to later task breakdowns. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-ORG-001 | S-000 | Capability matrix | Reconcile first draft to final discovery, steering, public logo, export, and tenant-admin decisions. | capability-matrix-maintainer or manual planning workflow | yes |
| ART-ORG-002 | S-001 | PRD | Create Organization domain foundation PRD. | product/prd planning workflow | yes |
| ART-ORG-003 | S-002 | Test-case document | Create PRD-derived proof cases for all active stories. | prd-test-case-planner | yes |
| ART-ORG-004 | S-003 | Repo governance decision | Add supported domain-family and runtime-boundary metadata path before Organization feature records rely on it. | repo governance workflow | yes |
| ART-ORG-005 | S-004 through S-012 | Service answer documents | Create root and tenant service answer documents for management, search, logo, export, catalogue, and denial behavior. | api-contract-maintainer | yes |
| ART-ORG-006 | S-004 through S-012 | Data dictionary | Create data dictionary pages for organization records, relationships, assets, exports, indexes, lifecycle, and retention. | data-dictionary-maintainer | yes |
| ART-ORG-007 | S-004 through S-012 | Permission mapping | Create root, tenant, public-read, background-worker, catalogue, asset, export, and object-rule mappings. | permission mapping workflow | yes |
| ART-ORG-008 | S-010 | Asset decision carry-forward | Carry approved public-logo asset decision into downstream source-truth documents. | asset/security workflow | no |
| ART-ORG-009 | S-012 | Export decision carry-forward | Carry approved private-export decision into downstream source-truth documents. | job/export planning workflow | no |
| ART-ORG-010 | S-013 | Design-system governance | Create shared pattern behavior locks, references, proof, and adoption posture before app screens. | frontend-design-system-loop-maintainer | yes |
| ART-ORG-011 | S-015 | Maintained artifact sweep | Keep feature records, generated graph, feature docs, runbooks, and status notes aligned as slices land. | docs-alignment-auditor and feature manifest workflow | yes |

## Story Readiness Summary

- Ready stories:
  S-000, S-001, S-002, S-003, S-013, S-015
- Blocked stories:
  S-014
- Stories needing capability matrix:
  S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011, S-012
- Stories needing PRD refinement:
  S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011, S-012
- Stories needing Technical Steering revisit:
  S-009 only if broader platform catalogue ownership is chosen before task breakdown; S-014 when first consumer is known
- Broad cleanup or shortcut risk:
  none
- Architecture invention risk:
  none

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | ready-for-task-breakdown | Behavior-map reconciliation can proceed from approved discovery and steering. |
| S-001 | ready-for-task-breakdown | Requirements creation can proceed after behavior-map reconciliation. |
| S-002 | ready-for-task-breakdown | Proof planning can proceed after requirements creation. |
| S-003 | ready-for-task-breakdown | Repo-governance work is explicitly approved by steering and requester preference. |
| S-004 | blocked-on-artifacts | Needs behavior map, requirements, proof cases, service answers, data dictionary, and permission mapping. |
| S-005 | blocked-on-artifacts | Needs behavior map, requirements, proof cases, data dictionary, and permission mapping. |
| S-006 | blocked-on-artifacts | Needs behavior map, requirements, proof cases, service answers, and data dictionary. |
| S-007 | blocked-on-artifacts | Needs behavior map, requirements, proof cases, public user/role seams, data dictionary, and permission mapping. |
| S-008 | blocked-on-artifacts | Needs behavior map, requirements, proof cases, data dictionary, and permission mapping. |
| S-009 | blocked-on-artifacts | Needs catalogue owner confirmation during PRD/API/data work unless Organization-owned default remains. |
| S-010 | blocked-on-artifacts | Needs downstream carry-forward of public logo asset decision into requirements, data, permissions, runbook, and proof. |
| S-011 | blocked-on-artifacts | Needs exact search fields, filters, indexes, service answers, and proof cases. |
| S-012 | blocked-on-artifacts | Needs downstream carry-forward of private export decision into requirements, data, permissions, runbook, and proof. |
| S-013 | ready-for-task-breakdown | Design-system governance can proceed before app screen work. |
| S-014 | deferred-with-owner | First consumer and summary fields are intentionally deferred until core records exist. |
| S-015 | ready-for-task-breakdown | Maintained-record alignment can be included in each later slice. |
