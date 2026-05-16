# Story Breakdown: Organization Domain Foundation

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-05-15
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
- Related PRD test cases:
  `docs/prd/test_cases/2026-05-12-0025-organization-domain-foundation-test-cases.md`
- Related implementation blueprint:
  `docs/workspace/implementation-blueprints/2026-05-15-organization-domain-foundation-planning-blueprint.md`
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`;
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`;
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
  `refreshed-2026-05-15`
- Steering non-goals preserved:
  no import or bulk upload, no recurring holiday calendars, no seasonal or
  external opening-hour feeds, no deep integration setup, no integration export,
  no CSV export, no request-time export snapshots, no generated placeholder
  image files in export bundles, no multiple active legal profiles, no public
  non-logo Organization pages, and no admin-visible change-history screens.
- Steering stop conditions resolved or carried as blockers:
  Organization management, reference values, search, locations, opening-hour
  exceptions, business units, memberships, and data dictionary work are ready
  for detailed task planning. Logo implementation is blocked on technical
  signoff. Export implementation is blocked on secure generated export
  technical steering. App screens are blocked on shared screen governance.
  Integration records are deferred from v1.
- Architecture invention check:
  `consumes-steering-only`
- Governed DEV:frontend seam posture:
  `blocked`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  tenant boundary protection, root-versus-tenant authority, public image
  delivery, private export delivery, retained records, background work, search
  scale, audit evidence, durable data retention, and source-independent
  document alignment.
- Missing source-of-truth artifacts:
  refreshed capability matrix rows, refreshed PRD-derived test cases,
  permission mapping, logo technical signoff completion, secure export
  technical steering, shared screen behavior locks, feature documents, feature
  manifests, runbooks, and generated dependency graph updates.

## Entity Readiness Snapshot

### Entity Inventory

| Entity / Record | Role In Request | V1 Posture | Owning Feature / Seam | Data Dictionary Status | API / UX Surface Status | Search / Export Status | Open Questions / Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Organization | Primary customer/account-scoped organization record and hierarchy root. | active-v1 | organizationCore | current planning page exists | root and tenant API contracts planned; UI blocked on shared screen behavior | search and export included | permission mapping and task breakdown still required |
| Organization Legal Profile | Legal details for one organization. | active-v1 | organizationLegalDetails | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | permission mapping and task breakdown still required |
| Organization Location | Physical or operational location. | active-v1 | organizationLocations | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | permission mapping and task breakdown still required |
| Weekly Opening-Hour Slot | Normal weekday opening and closing slot for a location. | active-v1 | locationOpeningHours | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | task breakdown must preserve slot validation |
| Opening-Hour Exception | Date-specific override for normal opening hours. | active-v1 | organizationOpeningHoursExceptions | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | task breakdown must preserve precedence rules |
| Business Unit | Internal organization unit with hierarchy. | active-v1 | businessUnits | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | task breakdown must preserve depth and move/archive rules |
| Business Unit Membership | Link from a real person or business unit to a business unit. | active-v1 | businessUnitMemberships | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | public lookup seams and permission mapping still required |
| Organization Reference Value | Root-managed option value tenant admins can use. | active-v1 | organizationReferenceCatalogues | current planning page exists | API planned; UI blocked on shared screen behavior | search and export included | broader platform catalogue remains deferred |
| Organization Logo Relationship | Link between an Organization primary logo and an asset. | ready-for-task-breakdown | organizationBrandingReferences and assets | current planning page exists | API planned; UI blocked on shared screen behavior | search planned; export includes selected actual files | S-012 must carry completed public logo signoff and runbook proof obligations |
| Organization Export | Durable request/status record for generated private export bundles. | ready-for-task-breakdown | organizationExports, jobs, assets/file delivery | current planning page exists | API planned; UI blocked on shared screen behavior | exports generate JSON and selected files | S-015 must carry secure export steering, private export decision, and reusable export/email obligations |
| Organization Integration Record | Future high-level integration relationship. | deferred-with-owner | future organizationIntegrations | deferred planning page exists | no v1 API or UI | excluded from v1 search and export | future discovery required before revival |
| Public Organization Summary | Narrow future read summary for later consumers. | deferred-with-owner | future organizationCore public seam | not yet needed beyond steering note | no v1 API or UI | not included in v1 search/export | first real consumer must define fields |

### Per-Entity Readiness Questions

| Entity / Record | Question Area | Question Or Gap | Required Before Story Ready | Owner / Next Action |
| --- | --- | --- | --- | --- |
| Organization Logo Relationship | asset delivery | Has public URL shape, cache update signal, byte verification, processing, raw URL denial, cleanup, and runbook posture been approved? | yes for S-012 | carry completed public logo signoff into S-012 tasks |
| Organization Export | background work | Has PIN/password ZIP behavior, cancellation, retry, notification, safety limits, failure recording, and cleanup behavior been locked? | yes for S-015 | carry completed secure generated export steering into S-015 tasks |
| Business Unit Membership | relationship | Which public seams prove a target individual user or business unit is real and in scope? | yes for source tasks | capture in permission mapping and task breakdown |
| All active v1 entities | permission | Which root, tenant, public-read, and worker capabilities govern each action? | yes for source tasks | create Organization permission mapping |
| All active v1 entities | proof | Do PRD-derived test cases cover the current story list and entity states? | yes for source tasks | refresh PRD-derived test cases |
| Admin screen entities | screen behavior | Which shared screen references govern list, detail, relationship, status, async, and action behavior? | yes for app UI tasks | create shared admin screen behavior locks |

### Entity Deferral Register

| Entity / Behavior | Deferral Posture | Must Not Appear In | Revisit Trigger | Owner |
| --- | --- | --- | --- | --- |
| Organization Integration Record implementation | deferred-with-owner | v1 route, persistence, search, export, UI, or source task | new product discovery for integrations | future product owner |
| Integration export | out-of-scope | v1 export bundle sections or export job tasks | integration implementation is approved later | future product owner |
| CSV export | out-of-scope | v1 export route, job, file manifest, or tests | future export format request | product owner |
| Request-time export snapshot | out-of-scope | v1 export job behavior | future export consistency request | product owner |
| Recurring holiday calendars and seasonal/external opening-hour feeds | deferred-with-owner | v1 opening-hour stories, API, UI, or task work | future scheduling discovery | product owner |
| Public non-logo Organization pages | out-of-scope | v1 public route, UI, or search work | future public profile request | product owner |

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-ORG-001 | Organization domain family | architecture-foundation-required | Organization domain family across multiple feature bundles | approved | DECISION:architecture-foundation |
| TS-ORG-002 | Organization core records | feature-local | organizationCore feature bundle | approved | DEV:migration-persistence |
| TS-ORG-003 | Legal details | feature-local | organizationLegalDetails feature bundle | approved | DEV:migration-persistence |
| TS-ORG-004 | Locations, weekly opening hours, and exceptions | feature-local | organizationLocations, locationOpeningHours, and organizationOpeningHoursExceptions feature bundles | approved | DEV:migration-persistence |
| TS-ORG-005 | Business-unit hierarchy and memberships | feature-local | businessUnits and businessUnitMemberships feature bundles | approved | DEV:migration-persistence |
| TS-ORG-006 | High-level integration records | feature-local | future organizationIntegrations feature bundle | deferred-with-owner | FUTURE:product-discovery |
| TS-ORG-007 | Branding and logo relationships | feature-public-seam | organizationBrandingReferences consuming assets feature | approved-for-planning | DOC:asset-decision |
| TS-ORG-008 | System reference catalogues | feature-local | organizationReferenceCatalogues unless broader platform catalogue feature is approved | deferred-with-owner | DECISION:architecture-foundation |
| TS-ORG-009 | Public logo asset delivery | platform-seam | assets feature and public delivery policy | approved-for-planning | DOC:technical-signoff |
| TS-ORG-010 | Private export bundles | platform-seam | job processing, assets/file delivery, and export feature seam | approved-for-planning | DECISION:job-cleanup |
| TS-ORG-011 | Root and tenant admin authorization | feature-public-seam | platform authorization plus root/tenant auth feature seams | approved | DOC:permission-mapping |
| TS-ORG-012 | Separated-by-type domain search | architecture-foundation-required | Organization domain read-model/search strategy | approved | DECISION:architecture-foundation |
| TS-ORG-013 | Admin UI surfaces | design-system-seam | root-admin and future tenant-admin shared management areas | approved | GOV:design-system |
| TS-ORG-014 | Public read summaries for later consumers | feature-public-seam | narrow exported Organization domain summaries | deferred-with-owner | DOC:feature-manifest |
| TS-ORG-015 | Maintained artifact alignment | feature-local | planning and source-independent artifact sweep | approved | DOC:docs-artifact |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Root-admin organization management areas | root-admin | organization domain | organization management | primary-nav | root-operator | browser-workflow | app-adoption | durable-page | path | future /root-admin/organizations family | none | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | preview-apply-required | module-journey-files | not-applicable | Browser proof after shared screen signoff and route adoption. |
| Tenant-admin organization management areas | new-family | organization domain | tenant organization management | primary-nav | tenant-actor | browser-workflow | app-adoption | durable-page | path | future tenant-admin organization family | none | not-applicable | generated-materializer | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | preview-apply-required | module-journey-files | not-applicable | Tenant-admin shell and topology path need governed planning before app screens. |
| Grouped organization-domain search | root-admin | organization domain | search and browse | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization-domain grouped search state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Search results separated by type; no browser implementation is handed off by this packet. |
| Logo management | root-admin | organization domain | branding/logo management | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization logo management state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | feature-local-state-machine | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Public asset signoff required before app behavior. |
| Export request/status/download | root-admin | organization domain | organization export | context-nav | root-operator | browser-workflow | journey | ui-state | none | organization export workflow state | not applicable | manual-shell-registry | curated-webAppHierarchyBuilder | transition-required | server-backed-snapshot | DS-owned-shell-required | DS-task-required | shell-registry-update | module-journey-files | not-applicable | Private job-backed export; no authority in URL state. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Root and tenant admin browser calls require authenticated sessions. | Security checks for unauthenticated, unauthorized, cross-tenant, and wrong-authority denials. | yes |
| csrf-mutation | yes | Create, update, archive, move, upload, export, cancel, retry, and delete actions are browser-triggered changes. | Mutation calls preserve existing trusted-origin protection. | yes |
| url-replay-state | yes | Search values may be low-risk state; authority and selected customer/account must remain server-side. | Replay review confirms no customer/account or permission authority in URLs. | yes |
| sensitive-rendering | yes | Admin areas may display legal details, memberships, retained records, and private export status. | Visibility and redaction checks match actor authority. | yes |
| csp-assets | yes | Logo work must not inject unsafe uploaded content. | Image handling remains compatible with content security policy. | yes |
| privileged-helper | yes | Export, cleanup, asset processing, and cache update signals run under system control. | Background work records authority, retry, and failure evidence. | yes |
| asset-delivery | yes | Public logos and private export bundles are file delivery surfaces. | Asset and export decisions are carried into service, data, and proof work. | yes |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | capability rows need reconciliation | yes | Current capability matrix predates the refreshed blueprint and deferred integration posture. | DOC:docs-artifact |
| S-001 | proof plan needs refresh | yes | Test cases predate opening-hour exceptions, export PIN behavior, logo signoff, and membership target changes. | DOC:docs-artifact |
| S-002 | permission map missing | yes | Root and tenant actors share workflows but have different authority, catalogue rights, logo rights, and export rights. | DOC:docs-artifact |
| S-003 | domain-family tooling pressure | yes | Steering approved early domain/runtime metadata through explicit governance work. | DECISION:architecture-foundation |
| S-004 | durable organization records | yes | Core identity, tenant-level name uniqueness, parent hierarchy, depth, cycle, and lifecycle rules are required. | DEV:backend |
| S-005 | legal profile records | yes | One active legal profile, optional tax/VAT number, and registered address are required. | DEV:backend |
| S-006 | location records | yes | Many locations, optional coordinates, descriptive head-office flags, and lifecycle rules are required. | DEV:backend |
| S-007 | opening-hour slots and exceptions | yes | Weekday slots and exception overrides have distinct rules and precedence. | DEV:backend |
| S-008 | business-unit records | yes | Business-unit hierarchy, child projections, depth limit, and branch archive or move behavior are required. | DEV:backend |
| S-009 | membership records | yes | Memberships target real business units now with fixed participation roles; individual/person targets are explicitly deferred until an approved lookup seam exists. | DEV:backend |
| S-010 | reference catalogue governance | yes | System-owned values need root edit, tenant use, and archive/deprecate/replace behavior. | DEV:backend |
| S-011 | logo technical signoff | yes | Public delivery is approved for S-012 task breakdown with implementation proof obligations. | DOC:docs-artifact |
| S-012 | public logo relationship and delivery | yes | Logo relationships consume assets and public delivery after signoff. | DEV:vertical-slice |
| S-013 | separated search | yes | Broad search plus exact filters must return grouped, permission-filtered result types. | DEV:backend |
| S-014 | secure export technical steering | yes | PIN/password ZIP, cancellation, retry, notification, and safety limits need technical lock. | DECISION:architecture-foundation |
| S-015 | private export bundles | yes | Background private export requests produce requester-bound ZIP files with JSON and selected files. | DEV:backend |
| S-016 | governed admin screens | yes | Shared admin screen patterns must exist before real app pages. | GOV:design-system |
| S-017 | deferred integration boundary | yes | Integration records are out of v1 and must stay out of route, search, UI, and export work. | DOC:docs-artifact |
| S-018 | maintained evidence alignment | yes | Feature docs, manifests, generated graph, runbooks, and status notes must stay aligned. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Break the Organization foundation into concrete stories so task planning can
  proceed without guessing behavior, authority, data shape, or proof.
- Epic outcome:
  Task Breakdown can start from stories that say what the system must do, what
  remains blocked, and what evidence will prove the work.
- Epic actors:
  root admin, tenant admin, public logo reader, background worker, planning
  reviewer, security reviewer, support operator
- Epic non-goals:
  import, recurring holiday calendars, seasonal or external opening-hour feeds,
  deep integration setup, integration export, CSV export, public non-logo pages,
  multiple active legal profiles, and visible change-history screens
- Epic dependency summary:
  Depends on tenant context, root and tenant authorization, assets, background
  work, storage, shared screen governance, feature-public seams, and maintained
  planning artifacts.
- Epic-level proof target:
  `mixed`

## Story Narratives

### S-000: Reconcile the Organization behavior matrix

**Situation**
The existing behavior spreadsheet was useful early on, but it now misses or
misstates important decisions about exports, logo delivery, opening-hour
exceptions, memberships, and integration deferral.

**Goal**
The spreadsheet should become the checklist that says which Organization
behaviors are in the first version, which are deferred, and which story owns
each behavior.

**Decisions Needed**
No new business choice is expected. Any conflict found during reconciliation
should be named as a blocker rather than silently resolved.

**Work That Follows**
The refreshed spreadsheet will guide task planning and later checks that every
story traces to a behavior.

**Evidence Of Success**
A reviewer can match every active story to a clear behavior row and can see
that deferred items are not treated as build-ready.

### S-001: Refresh the Organization proof plan

**Situation**
The proof plan is stale because the feature changed. The system now has more
specific rules for public logos, private exports, opening hours, memberships,
and deferred integrations.

**Goal**
Reviewers should know exactly what must be proved before each Organization
slice can be trusted.

**Decisions Needed**
No new business choice is expected. Missing proof should become a blocker or
named follow-up, not an assumption.

**Work That Follows**
Task planning can carry the right checks into source work from the start.

**Evidence Of Success**
Each active story has a concrete proof obligation for allowed actions, denied
actions, lifecycle behavior, privacy, audit, failure recovery, and records.

### S-002: Map Organization authority

**Situation**
Root admins and tenant admins can do similar work, but their authority is not
the same. Some actions are tenant-bound, some are root-only, and some involve
public or private files.

**Goal**
Create the Organization authority map that later protected endpoints, jobs,
export, logo, search, record-management, and screen work must use.

**Decisions Needed**
The mapping must settle who can act, which customer/account context applies,
which records must be checked before access, which actions are denied, and
which logo, export, or integration work must remain blocked or deferred.

**Work That Follows**
Record management, export, logo, search, membership, reference-value, and
screen tasks can now reference the same permission source.

**Evidence Of Success**
A reviewer can open the permission mapping and see who may create, read,
update, archive, restore, move, search, upload, export, download, cancel, retry,
view PINs, delete export copies, manage reference values, and run logo/export
worker actions.

### S-003: Record Organization as a feature family

**Situation**
Organization is made of related pieces, not one giant feature. The repo needs a
durable way to show those pieces belong together.

**Goal**
Reviewers should be able to see the Organization family and the responsibility
of each member without relying on memory.

**Decisions Needed**
The governance work must choose the approved format for family metadata and
avoid unsupported manifest fields.

**Work That Follows**
Organization source work can add feature manifests without inventing a new
tracking style.

**Evidence Of Success**
Repo checks accept the chosen representation, and the generated dependency
view can still be trusted.

### S-004: Manage core organizations and hierarchy

**Situation**
Every other Organization record attaches to an official organization. Those
records need stable identity, tenant-level name uniqueness, parent-child
structure, and safe lifecycle behavior.

**Goal**
Admins can manage organizations inside one customer/account without crossing
boundaries or creating broken trees.

**Decisions Needed**
No new product choice is expected, but task planning must carry exact fields,
request rules, permission rules, indexes, and errors from the approved docs.

**Work That Follows**
Source work can create the core records and the rules for moving, archiving,
restoring, and reading organizations.

**Evidence Of Success**
Reviewers can prove normalized name uniqueness, depth 10, loop prevention,
branch archive, child reassignment, lifecycle visibility, and cross-tenant
denial.

### S-005: Manage legal profiles

**Situation**
Organizations need legal details, but the first version allows only one active
legal profile at a time.

**Goal**
Admins can maintain legal information while old or archived profiles stay
understandable.

**Decisions Needed**
No new product choice is expected. Task planning must carry optional tax/VAT
number, optional registered address, one-active behavior, and retention rules.

**Work That Follows**
Source work can create legal profile records, validation, lifecycle behavior,
and read/export projections.

**Evidence Of Success**
Reviewers can prove only one active profile exists per organization and that
profiles cannot attach across the wrong customer/account.

### S-006: Manage locations

**Situation**
An organization can have many locations. Head-office flags describe a location
but do not make it the only head office.

**Goal**
Admins can record locations with optional coordinates and lifecycle behavior
without creating hidden uniqueness rules.

**Decisions Needed**
No new product choice is expected. Task planning must carry address fields,
coordinate validation, descriptive flags, search fields, and export projection.

**Work That Follows**
Source work can create location records and the checks that keep them attached
to the correct organization.

**Evidence Of Success**
Reviewers can prove many locations are allowed, many head-office flags are
allowed, coordinates are validated, and cross-boundary location writes are
denied.

### S-007: Manage opening-hour slots and exceptions

**Situation**
Normal opening hours repeat weekly, but exceptional closures or special hours
must be able to override the normal slots.

**Goal**
Admins can manage weekday slots and date-specific exceptions while the system
calculates which rule wins.

**Decisions Needed**
No new product choice is expected. Task planning must carry slot order,
weekday, local open and close times, no-overlap behavior, no overnight v1, and
exception precedence.

**Work That Follows**
Source work can create slot and exception records, validation, search fields,
and export projection.

**Evidence Of Success**
Reviewers can prove closed days override everything, replacement day schedules
override normal slots, closed time slots suppress normal openings, and special
opening slots apply only when not overridden.

### S-008: Manage business units

**Situation**
Organizations need internal structures that can nest, move, and archive without
breaking child records.

**Goal**
Admins can manage business-unit hierarchy inside the right customer/account.

**Decisions Needed**
No new product choice is expected. Task planning must carry depth 10, loop
prevention, derived child-unit reads, archive-whole-branch, and move-children
behavior.

**Work That Follows**
Source work can create business-unit records and safe hierarchy operations.

**Evidence Of Success**
Reviewers can prove unit depth, loop denial, child projections from parent
links, branch archive, child reassignment, and cross-boundary denial.

### S-009: Manage business-unit memberships

**Situation**
Memberships should point to real existing participants. The first version
supports individuals and other business units with fixed participation labels.

**Goal**
Admins can maintain memberships without placeholder people, placeholder units,
or confusing participation labels with system permissions.

**Decisions Needed**
No new product choice is expected. Task planning must carry target type,
target identity, fixed labels of owner, manager, member, and viewer, and the
rule that these labels are not authorization grants.

**Work That Follows**
Source work can create membership records and validation against approved
public lookup seams.

**Evidence Of Success**
Reviewers can prove only real individual users or business units can be linked,
roles use the fixed labels, and cross-account or placeholder links are denied.

### S-010: Manage reference values

**Situation**
Organization records need shared values such as organization type, legal form,
industry category, location type, and relationship type.

**Goal**
Root admins can manage shared values, and tenant admins can use approved
values without making used values disappear.

**Decisions Needed**
No new product choice is expected. Task planning must carry root-only mutation,
tenant use, immediate label updates, archive, deprecate, replace, and used
value retention.

**Work That Follows**
Source work can create catalogue records and the rules for safe value changes.

**Evidence Of Success**
Reviewers can prove tenant admins cannot mutate catalogues, used values remain
understandable, and replacements are explicit.

### S-011: Complete public logo technical signoff

**Situation**
Public logos are product-approved, but file upload and public delivery carry
security, cache, accessibility, and cleanup risks.

**Goal**
Implementation should wait until the technical checklist has clear answers for
safe delivery.

**Decisions Needed**
The signoff must settle public URL shape, delivery mode, cache update signal,
MIME and byte verification, image processing, raw URL denial, cleanup, legal
hold posture, and runbook coverage.

**Work That Follows**
Logo implementation can proceed only after this checklist is complete.

**Evidence Of Success**
Reviewers can see the signoff record completed and can trace each security and
delivery rule into later tasks.

### S-012: Manage public logo relationships

**Situation**
Organizations need real logo images that can appear publicly after they are
accepted as safe and usable.

**Goal**
Admins can upload, replace, remove, and export the primary logo while public
places show approved image URLs or deterministic initials placeholders.

**Decisions Needed**
No new product choice is expected, but this story remains blocked until public
logo technical signoff is complete.

**Work That Follows**
Source work can create logo relationships, asset integration, replacement
behavior, public delivery behavior, alt text defaults, and export inclusion.

**Evidence Of Success**
Reviewers can prove old images remain active until replacement is ready, raw
storage links are never exposed, removed logos fall back to initials, and
Organization authority still controls the relationship.

### S-013: Search Organization records by type

**Situation**
Admins need to find records across the Organization domain, but mixed results
can become confusing or unsafe if they ignore boundaries.

**Goal**
Admins can search broadly and see results grouped by record type, with exact
filters and predictable paging.

**Decisions Needed**
No new product choice is expected. Task planning must carry searchable fields,
operators, indexes, sorting, pagination, and permission filtering.

**Work That Follows**
Source work can create the search endpoint and read model.

**Evidence Of Success**
Reviewers can prove grouped results, stable paging, exact filters, index
coverage, and no cross-tenant leakage.

### S-014: Lock secure generated export behavior

**Situation**
Private exports are product-approved, but PIN-protected ZIP files, background
jobs, cancellation, retries, notifications, and safety limits need technical
rules before source work starts.

**Goal**
The system should have one reusable export pattern that Organization and
future export features can follow.

**Decisions Needed**
The technical steering must settle PIN/password ZIP mechanics, safety limits,
queue behavior, failure states, cancellation, retry, notification failure,
download authority, and cleanup/runbook posture.

**Work That Follows**
Organization export implementation can proceed after the reusable pattern is
locked.

**Evidence Of Success**
Reviewers can see a technical decision that is specific enough to implement
without inventing security or job behavior inside the task.

### S-015: Manage private export bundles

**Situation**
Admins need a downloadable copy of Organization data and selected actual files
without creating a public link.

**Goal**
Admins can request selected sections, choose current-only or include-retained
data where authorized, and later download a private PIN/password protected ZIP.

**Decisions Needed**
No new product choice is expected, but this story remains blocked until secure
generated export technical steering is complete.

**Work That Follows**
Source work can create export requests, background processing, status,
download, PIN view/email behavior, expiry, deletion, cancellation, retry, and
cleanup.

**Evidence Of Success**
Reviewers can prove requester-only download, selected sections, JSON data,
selected actual files, 24-hour expiry, manual delete, cancellation, retry,
safe failures, and cleanup failure recording.

### S-016: Define shared admin screen behavior

**Situation**
Admins need management areas for organizations, legal profiles, locations,
opening hours, units, memberships, reference values, logos, search, and
exports. Those screens should not invent one-off behavior.

**Goal**
Shared screen references should define how the admin experience behaves before
real app pages consume it.

**Decisions Needed**
The screen work must settle lists, detail editing, grouped search, branch
archive or move-child choices, logo management, export status, async attention
badges, and accessibility behavior.

**Work That Follows**
Root-admin and tenant-admin pages can adopt the approved shared behavior.

**Evidence Of Success**
Reviewers can inspect approved shared screen references before app pages are
built.

### S-017: Keep integration records deferred

**Situation**
Integration records were discussed earlier, but the current first version does
not build them.

**Goal**
The future idea should remain visible without becoming accidental first-version
request, search, export, screen, or record-storage work.

**Decisions Needed**
No new decision is expected. Future integration work must re-enter discovery
before implementation planning.

**Work That Follows**
Task planning can exclude integration work while keeping the no-secrets
boundary recorded for later.

**Evidence Of Success**
Reviewers can confirm integration records are marked deferred and do not appear
as active v1 implementation scope.

### S-018: Keep Organization artifacts aligned as slices land

**Situation**
Organization will be delivered in several pieces. If records and support notes
drift, later work will start from stale instructions.

**Goal**
Reviewers can trust that source-independent documents, feature notes, generated
records, runbooks, and status notes match what has actually landed.

**Decisions Needed**
No new business choice is expected. Each slice must name which maintained
records changed.

**Work That Follows**
Every source slice carries its maintained-record review before it is called
complete.

**Evidence Of Success**
Reviewers can confirm completed Organization work does not leave older docs or
generated records describing the pre-change platform.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Reconcile the Organization behavior matrix | This is needed because the spreadsheet should match the current Organization decisions before task planning uses it. | As the planning reviewer, I need the behavior matrix refreshed so every active story traces to one clear behavior row. | planning reviewer | The matrix lists active and deferred Organization behavior with story ownership and source evidence. | Technical Steering; PRD; blueprint |
| S-001 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Refresh the Organization proof plan | This is needed because the proof plan should match the current logo, export, opening-hour, membership, and integration decisions. | As the quality reviewer, I need current proof obligations so later tasks carry the right checks. | quality reviewer | The test-case document covers every active story and blocker with concrete proof obligations. | S-000; PRD |
| S-002 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Map Organization authority | This is needed because root admins, tenant admins, public readers, and export workers need different rules. | As the security reviewer, I need an authority map before routes, jobs, or screens are planned. | security reviewer | Permission mapping names capabilities, tenant context, object rules, and denial behavior. | Technical Steering; API contracts |
| S-003 | ready-for-task-breakdown | harness-value | DECISION:architecture-foundation | Record Organization as a feature family | This is needed because Organization will be several related parts and the repo needs a stable way to track them together. | As the repo governance owner, I need approved family metadata before source manifests depend on it. | repo governance owner | The repo records Organization family membership without unsupported manifest fields. | Technical Steering |
| S-004 | ready-for-task-breakdown | system-value | DEV:backend | Manage core organizations and hierarchy | This is needed because every Organization record needs a safe parent organization inside one customer/account. | As the system, I need official organization records with safe hierarchy, lifecycle, and tenant boundaries. | system | Organizations can be created, read, updated, archived, restored, moved, and searched within the right boundary. | S-000; S-001; S-002; S-003 |
| S-005 | ready-for-task-breakdown | system-value | DEV:backend | Manage legal profiles | This is needed because legal details have one-active behavior and must stay understandable over time. | As the system, I need one active legal profile per organization with retained prior records. | system | Legal profiles support required fields, optional tax/VAT number, optional registered address, lifecycle, and export projection. | S-004 |
| S-006 | ready-for-task-breakdown | user-value | DEV:backend | Manage locations | This is needed because admins need many locations without hidden head-office uniqueness. | As an admin, I need to manage organization locations with optional coordinates and descriptive flags. | admin | Locations can be saved, searched, archived, and exported under the correct organization. | S-004 |
| S-007 | ready-for-task-breakdown | user-value | DEV:backend | Manage opening-hour slots and exceptions | This is needed because normal weekly hours and exceptional closures need deterministic rules. | As an admin, I need to manage weekly slots and exceptions that supersede normal hours. | admin | Weekly slots and exceptions validate correctly and produce predictable effective opening rules. | S-006 |
| S-008 | ready-for-task-breakdown | user-value | DEV:backend | Manage business units | This is needed because organizations need internal hierarchy with safe moves and archiving. | As an admin, I need to manage business-unit trees inside one customer/account. | admin | Business units support depth 10, cycle denial, child projections, branch archive, and child reassignment. | S-004 |
| S-009 | ready-for-task-breakdown | user-value | DEV:backend | Manage business-unit memberships | This is needed because memberships should link only to real participants with clear participation labels. | As an admin, I need to assign real business units to business units with fixed labels, with individual/person memberships deferred until an approved person lookup seam exists. | admin | Business-unit memberships reject placeholders, cross-boundary targets, self-links, and labels outside owner, manager, member, and viewer; individual/person targets return an explicit deferred response. | S-008; future individual/person public seam |
| S-010 | ready-for-task-breakdown | system-value | DEV:backend | Manage reference values | This is needed because shared Organization values must remain stable after records use them. | As the system, I need root-managed shared values that tenant admins can use safely. | system | Reference values support create, label update, archive, deprecate, replace, tenant use, and used-value retention. | S-002 |
| S-011 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Complete public logo technical signoff | This is needed because public image delivery needs cache, security, accessibility, and cleanup rules before implementation. | As the security reviewer, I need the logo signoff completed before source work starts. | security reviewer | The logo signoff answers every required public delivery and asset-safety question. | Public logo decision |
| S-012 | ready-for-task-breakdown | user-value | DEV:vertical-slice | Manage public logo relationships | This is needed because public logos touch uploaded files, public delivery, replacement, and export inclusion. | As an admin, I need to manage the primary organization logo that public places can display safely. | admin and public reader | Logo relationships use approved assets, app-controlled URLs, replacement safety, removal placeholders, and export inclusion. | S-011; assets feature |
| S-013 | ready-for-task-breakdown | user-value | DEV:backend | Search Organization records by type | This is needed because admins need broad search without mixing results or leaking records. | As an admin, I need grouped Organization search with filters and stable paging. | admin | Search returns permission-filtered grouped results with explicit operators and indexes. | S-004 through S-010; include S-012 logo fields after logo relationship tasks land |
| S-014 | ready-for-task-breakdown | harness-value | DECISION:architecture-foundation | Lock secure generated export behavior | This is needed because private ZIP exports need reusable security and job rules before implementation. | As the security reviewer, I need the export pattern locked before Organization exports are built. | security reviewer | Technical steering defines PIN/password ZIP, cancellation, retry, notification, safety limits, and cleanup posture. | Export product packet |
| S-015 | ready-for-task-breakdown | user-value | DEV:backend | Manage private export bundles | This is needed because export files contain selected Organization data and actual files and must stay private. | As an admin, I need to request, monitor, download, cancel, retry, and delete private Organization exports. | admin and background worker | Exports produce requester-bound PIN/password ZIP files with JSON, selected files, expiry, and cleanup evidence. | S-014; job processing; assets |
| S-016 | blocked | harness-value | GOV:design-system | Define shared admin screen behavior | This is needed because Organization screens should use approved shared behavior before real pages are built. | As the screen standards owner, I need approved shared screen references for Organization management. | screen standards owner | Shared references cover lists, details, search, branch choices, logo management, export status, and attention badges. | Design-system governance |
| S-017 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Keep integration records deferred | This is needed because integration records should remain visible as future scope without entering v1 by accident. | As the planning reviewer, I need integration records marked deferred across planning sources. | planning reviewer | Integration records do not appear in active v1 route, search, UI, export, or persistence work. | PRD; API contracts; data dictionary |
| S-018 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Keep Organization artifacts aligned as slices land | This is needed because Organization work will land in pieces and older records can drift quickly. | As the planning reviewer, I need each slice to refresh the records it changes before it is treated as complete. | planning reviewer | Feature docs, manifests, generated graph, runbooks, status notes, and planning records stay aligned. | All stories |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The refreshed matrix maps every active v1 Organization behavior to a source decision and story ID, and marks deferred behavior without build-ready posture. | contract-level | docs-alignment, standards | capability matrix |
| AC-S001-01 | S-001 | The proof plan covers every active story and names actor, authority, state, object, lifecycle, privacy, audit, asset, export, search, job, and browser obligations. | contract-level | docs-alignment, security, audit | PRD-derived test cases |
| AC-S002-01 | S-002 | Permission mapping defines root-admin, tenant-admin, public-read, and system-worker authority for Organization create, read, update, archive, move, logo, search, export, cancel, retry, download, and catalogue actions. | contract-level | docs-alignment, security | permission mapping |
| AC-S003-01 | S-003 | Organization family metadata is documented through an approved repo-governance path before Organization manifests rely on domain or runtime family fields. | contract-level | docs-alignment, generated-artifact | feature-family decision |
| AC-S004-01 | S-004 | Organization records support create, read, update, archive, restore, parent move, branch archive, child reassignment, normalized tenant-level name uniqueness, depth 10, cycle denial, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |
| AC-S005-01 | S-005 | Legal profile records enforce one active profile per organization and support optional tax/VAT number, optional registered address, lifecycle visibility, retained profile reads where approved, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |
| AC-S006-01 | S-006 | Location records allow many locations per organization, allow multiple descriptive head-office flags, validate optional coordinates, support lifecycle visibility, and remain scoped to the owning tenant. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |
| AC-S007-01 | S-007 | Opening-hour slots and exceptions enforce weekday slot order, same-day open/close validation, no overlapping active slots, no overnight v1 slots, and exception precedence of closed day, replacement day, closed slot, then special opening. | persistence-level | unit, integration, security, persistence | PRD, API contract, data dictionary |
| AC-S008-01 | S-008 | Business units support hierarchy depth 10, cycle denial, derived child-unit reads from parent links, branch archive, child reassignment, lifecycle visibility, and same-tenant enforcement. | persistence-level | unit, integration, security, audit, persistence | PRD, API contract, data dictionary, permission mapping |
| AC-S009-01 | S-009 | Membership records accept only real business-unit targets for the current slice, fixed participation labels of owner, manager, member, and viewer, same-tenant ownership, self-link denial, and explicit individual/person target deferral. | persistence-level | unit, integration, security, audit, privacy | PRD, API contract, data dictionary, permission mapping |
| AC-S010-01 | S-010 | Reference values are root-managed, tenant-usable, immediately reflected by label changes, and archived, deprecated, or explicitly replaced when already used. | mixed | unit, integration, security, audit, compatibility | PRD, API contract, data dictionary, permission mapping |
| AC-S011-01 | S-011 | Public logo technical signoff answers URL shape, delivery mode, cache update signal, accepted file types, actual-byte verification, processing, raw URL denial, cleanup, legal-hold posture, public-read abuse controls, and runbook obligations. | contract-level | docs-alignment, security, privacy, asset | public logo technical signoff |
| AC-S012-01 | S-012 | Logo relationships support the v1 primary logo type, accepted-safe public delivery, app-controlled URLs, replacement after new image readiness, removal to deterministic initials, alt text defaulting, and selected actual-file export inclusion. | mixed | unit, integration, security, audit, asset, accessibility, runtime-api | PRD, API contract, asset decision, data dictionary, permission mapping, runbook |
| AC-S013-01 | S-013 | Search supports broad text search, explicit exact filters, stable paging, deterministic sorting, grouped result types, index-backed fields, and permission-filtered results without arbitrary advanced query behavior. | runtime-api | unit, integration, security, performance, compatibility | PRD, API contract, data dictionary, permission mapping |
| AC-S014-01 | S-014 | Secure generated export steering defines PIN/password ZIP mechanics, requester-only download, cancellation, retry, ready/failed notifications, safety limits, cleanup, expiry, failure recording, and runbook posture. | contract-level | docs-alignment, security, audit, resilience, job | technical steering, reusable export pattern |
| AC-S015-01 | S-015 | Export bundles support selected sections, current-only or include-retained choice, JSON data, selected actual files, requester-bound download, PIN view/email behavior, cancel, retry, ready/failed notification, 24-hour expiry, manual delete, and cleanup failure recording. | mixed | unit, integration, security, audit, privacy, resilience, job | PRD, API contract, data dictionary, permission mapping, runbook |
| AC-S016-01 | S-016 | Shared screen references define Organization lists, detail editing, grouped search, branch archive or move-child decisions, logo management, export status, async attention badges, and accessibility before app page adoption. | rendered-browser | visual, accessibility, interaction, standards | design-system behavior locks and references |
| AC-S017-01 | S-017 | Integration records are marked deferred in PRD, API contracts, data dictionary, story breakdown, and task planning, with no active v1 route, search, UI, export, or persistence task. | contract-level | docs-alignment, standards | PRD, API contracts, data dictionary |
| AC-S018-01 | S-018 | Each Organization slice refreshes affected source-independent docs, feature docs, manifests, generated dependency graph, runbooks, test evidence, and status notes before completion language is used. | mixed | docs-alignment, standards, generated-artifact | feature docs, manifests, generated graph, runbooks |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | CAP-ORG-000 | planning | create-or-refresh-required | Behavior matrix reconciliation. |
| S-001 | AC-S001-01 | CAP-ORG-001 | planning | create-or-refresh-required | Proof plan refresh. |
| S-002 | AC-S002-01 | CAP-ORG-002 | root, tenant, public, worker | create-or-refresh-required | Permission mapping. |
| S-003 | AC-S003-01 | CAP-ORG-003 | repo-governance | create-or-refresh-required | Domain family metadata support. |
| S-004 | AC-S004-01 | CAP-ORG-CORE-001 | tenant/root | create-or-refresh-required | Core organization records. |
| S-005 | AC-S005-01 | CAP-ORG-LEGAL-001 | tenant/root | create-or-refresh-required | Legal profiles. |
| S-006 | AC-S006-01 | CAP-ORG-LOC-001 | tenant/root | create-or-refresh-required | Locations. |
| S-007 | AC-S007-01 | CAP-ORG-HOURS-001 | tenant/root | create-or-refresh-required | Weekly slots and exceptions. |
| S-008 | AC-S008-01 | CAP-ORG-UNIT-001 | tenant/root | create-or-refresh-required | Business units. |
| S-009 | AC-S009-01 | CAP-ORG-MEMBER-001 | tenant/root | create-or-refresh-required | Memberships. |
| S-010 | AC-S010-01 | CAP-ORG-CAT-001 | root/tenant-use | create-or-refresh-required | Reference values. |
| S-011 | AC-S011-01 | CAP-ORG-BRAND-SIGNOFF-001 | asset/security | create-or-refresh-required | Logo technical signoff. |
| S-012 | AC-S012-01 | CAP-ORG-BRAND-001 | tenant/root/public | create-or-refresh-required | Logo relationships and delivery. |
| S-013 | AC-S013-01 | CAP-ORG-SEARCH-001 | tenant/root | create-or-refresh-required | Grouped search. |
| S-014 | AC-S014-01 | CAP-ORG-EXPORT-SIGNOFF-001 | job/security | create-or-refresh-required | Secure export technical steering. |
| S-015 | AC-S015-01 | CAP-ORG-EXPORT-001 | tenant/root/system-job | create-or-refresh-required | Private export bundles. |
| S-016 | AC-S016-01 | CAP-ORG-UI-001 | governed-ui | create-or-refresh-required | Shared screen prerequisite. |
| S-017 | AC-S017-01 | CAP-ORG-INT-DEFER-001 | planning | create-or-refresh-required | Deferred integration boundary. |
| S-018 | AC-S018-01 | CAP-ORG-ARTIFACT-001 | planning | create-or-refresh-required | Maintained artifact alignment. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-S000 | S-000 / AC-S000-01 | Product Discovery, Technical Steering, PRD, API contracts, data dictionary, asset/export decisions, blueprint | planning-source | existing | Matrix rows trace to current source decisions. | docs alignment proof only |
| DEP-S001 | S-001 / AC-S001-01 | story acceptance criteria and proof guide | planning-source | existing | Test-case document maps each AC to concrete proof. | proof planning only |
| DEP-S002 | S-002 / AC-S002-01 | platform authorization and tenant session model | feature-public-seam | existing | Permission map names actor, current tenant, object rule, and denial. | later integration tests prove allow and deny behavior |
| DEP-S003 | S-003 / AC-S003-01 | feature manifest and dependency graph governance | repo-governance | new | Approved metadata shape exists before manifests use it. | generated graph validation tests |
| DEP-S004 | S-004 / AC-S004-01 | tenant context and authorization evaluator | feature-public-seam | existing | Core record contract proves same-tenant ownership and lifecycle. | integration tests prove hierarchy and tenant denial |
| DEP-S005 | S-005 / AC-S005-01 | organization core identity seam | feature-public-seam | new | Legal profiles resolve owning organization through public identity. | integration tests prove one-active and cross-boundary denial |
| DEP-S006 | S-006 / AC-S006-01 | organization core identity seam | feature-public-seam | new | Locations resolve owning organization through public identity. | integration tests prove coordinate validation and tenant denial |
| DEP-S007 | S-007 / AC-S007-01 | location identity seam | feature-public-seam | new | Hours and exceptions resolve owning location and organization. | integration tests prove slot validation and exception precedence |
| DEP-S008 | S-008 / AC-S008-01 | organization core identity seam | feature-public-seam | new | Units resolve owning organization through public identity. | integration tests prove hierarchy behavior |
| DEP-S009 | S-009 / AC-S009-01 | individual-user lookup and business-unit lookup seams | feature-public-seam | existing-or-new | Memberships validate real targets without private imports. | integration tests prove placeholder and cross-boundary denial |
| DEP-S010 | S-010 / AC-S010-01 | reference catalogue ownership decision | architecture-foundation | new | Catalogue owner and value lifecycle rules are settled. | integration tests prove root mutation and tenant use |
| DEP-S011 | S-011 / AC-S011-01 | asset foundation and public delivery policy | platform-seam | existing | Signoff answers every public delivery decision for v1 primary logo scope. | S-012 must carry signed-off controls into implementation tasks |
| DEP-S012 | S-012 / AC-S012-01 | assets feature and Organization object authority | platform-seam | existing | Logo relationship contract keeps Organization authority separate from asset storage authority. | integration tests prove replacement and raw URL denial |
| DEP-S013 | S-013 / AC-S013-01 | Organization records and indexes | read-model | new | Search fields, filters, and indexes are documented before implementation. | integration tests prove grouped filtered results |
| DEP-S014 | S-014 / AC-S014-01 | job processing and private file delivery | platform-seam | existing-or-new | Technical steering locks job, PIN, safety, and cleanup rules. | no source integration until steering is complete |
| DEP-S015 | S-015 / AC-S015-01 | export job seam, assets, and Organization source seams | platform-seam | existing-or-new | Export contract carries requester, sections, files, expiry, and cleanup. | integration tests prove private download and cleanup failure recording |
| DEP-S016 | S-016 / AC-S016-01 | shared screen governance | design-system-seam | new | Screen references exist before app pages consume them. | browser tests prove shared references |
| DEP-S017 | S-017 / AC-S017-01 | PRD, API contracts, and data dictionary | planning-source | existing | Deferred integration wording is consistent. | docs alignment proof only |
| DEP-S018 | S-018 / AC-S018-01 | feature manifests and generated graph | repo-governance | existing | Generated records match public seams after slices land. | generated graph tests after manifest changes |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| organization core public identity seam | legal, locations, units, memberships, logos, search, export | owning organization identity and lifecycle can be checked without private record imports | private persistence records | first consumer integration test |
| location and opening-hour seams | search, export, admin screens | location, weekly slot, and exception data can be read through approved feature-owned contracts | browser-only calculation | slot and exception integration tests |
| business-unit and membership seams | search, export, admin screens | units and memberships can be read without cross-feature private imports | participation labels as permission grants | hierarchy and membership integration tests |
| organization branding reference seam | assets, public read, and export work | logo relationships are owned by Organization while asset safety remains owned by assets | raw bucket URL authority | logo replacement and export integration tests |
| organization export request seam | admin experience and support operations | export lifecycle is requestable, inspectable, downloadable, expirable, cancellable, retryable, and auditable | public links or URL-carried authority | export job and cleanup integration tests |
| grouped organization search response | admin screens and future support tools | results are grouped by type and permission-filtered | browser-only filtering | search integration and browser adoption tests |
| organization domain manifest metadata | dependency graph and future extraction review | domain membership and runtime boundary intent are supported by tooling | unsupported manifest fields | generated graph validation tests |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | planning reviewer | planning artifact access | active packet | old matrix, refreshed matrix, deferred rows | complete rows, stale rows, contradictory rows | draft to refreshed | missing source artifact | traceability, standards |
| S-001 | quality reviewer | planning artifact access | active packet | current stories, stale proof cases | allowed action, denied action, lifecycle, privacy, asset, export proof | stale to refreshed | missing AC coverage | security, audit, privacy, resilience |
| S-002 | security reviewer | planning artifact access | active packet | root authority, tenant authority, public read, worker authority | capability key, tenant context, object rule, denial category | unmapped to mapped | conflicting authority source | security, audit, compliance |
| S-003 | repo governance owner | governance authority | active branch | current manifest schema, family decision | family metadata, rejected unsupported fields | undocumented to documented | unsupported manifest field required | compatibility, standards |
| S-004 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong tenant | active, archived, deleted, parented, childed organizations | normalized name, parent id, depth, relationship values | create, update, archive, restore, move, branch archive | duplicate name, cycle, depth, stale parent, cross-tenant parent | security, audit, performance, compatibility |
| S-005 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong tenant | no profile, active profile, archived profile | legal fields, tax/VAT, registered address, empty string rejection | create active, replace active, archive | duplicate active, missing org, cross-tenant org | privacy, audit, compatibility |
| S-006 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong tenant | many locations, archived locations | address fields, head-office flag, latitude, longitude | create, update, archive, restore | invalid coordinate, missing org, cross-tenant org | audit, performance |
| S-007 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong tenant | no hours, weekly slots, exception records | weekday, slot order, open time, close time, exception type | create slot, update slot, archive slot, create exception | overlap, overnight v1, invalid precedence, missing location | audit, correctness |
| S-008 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong tenant | unit tree, archived unit, child units | parent id, depth boundary, status | create, update, archive, restore, move, child reassignment | cycle, depth, stale parent, cross-tenant parent | security, audit, compatibility |
| S-009 | root admin, tenant admin | allowed and denied root/tenant authority | active, wrong tenant | individual user target, business-unit target, archived membership | target type, target id, owner, manager, member, viewer | create, update label, archive, restore | placeholder target, invalid label, cross-tenant target | security, audit, privacy |
| S-010 | root admin, tenant admin | root mutate, tenant use, denied tenant mutate | active, wrong authority | active, archived, deprecated, replaced, in-use values | label, type, replacement id, empty string rejection | create, edit, archive, deprecate, replace | in-use delete attempt, replacement missing | compatibility, audit, security |
| S-011 | security reviewer | signoff authority | active packet | answered checklist | URL shape, MIME, bytes, cache signal, cleanup, runbook | signed | missing required answer | security, privacy, operability |
| S-012 | root admin, tenant admin, public reader, asset processor | admin manage, public read, denied raw access | active, expired upload intent | pending, accepted, rejected, replaced, removed logos | MIME allowlist, size, alt text, logo type, initials fallback | upload, accept, replace, remove, cleanup | scan failure, stale cache, raw URL access | security, accessibility, resilience |
| S-013 | root admin, tenant admin | allowed and denied root/tenant search | active, wrong tenant | active and archived records across types | search text, exact filters, page, page size, sort | search request to grouped response | unsupported filter, index unavailable | security, performance, compatibility |
| S-014 | security reviewer, job owner | steering authority | active packet | unanswered export decisions, answered decisions | PIN, ZIP, safety limits, cancellation, retry, notification | undecided to locked | missing safety rule | security, resilience, operability |
| S-015 | root admin, tenant admin, background worker | request/download/delete own scope, denied other scope | active, expired session | queued, running, canceled, ready, failed, expired, deleted exports | section list, retained choice, ZIP manifest, PIN, checksum | request, run, cancel, retry, ready, download, expire, delete | worker timeout, storage failure, cleanup failure | privacy, audit, resilience, operability |
| S-016 | screen standards owner, admin reviewer | screen governance authority | active packet | draft reference, approved reference | lists, detail edit, branch choice, status badge, keyboard states | draft to approved reference | inaccessible state, missing reference | accessibility, visual stability |
| S-017 | planning reviewer | planning artifact access | active packet | active integration wording, deferred integration wording | route scope, search scope, export scope, data page status | active scope to deferred scope | stale active integration row | traceability, standards |
| S-018 | planning reviewer, support operator | artifact review authority | before slice, after slice | feature docs, manifests, generated graph, runbooks, status notes | stale docs, current docs, generated records | slice draft to artifact-complete | stale downstream doc | standards, operability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | planning reviewer with old and refreshed matrix | CAP-ORG-000 | contract-level | Create docs proof that every story maps to current behavior and deferred rows are not build-ready. | no |
| AC-S001-01 | quality reviewer with current stories and stale tests | CAP-ORG-001 | contract-level | Refresh PRD-derived test cases for every active story and blocker. | no |
| AC-S002-01 | security reviewer with root, tenant, public, and worker authority | CAP-ORG-002 | contract-level | Create permission mapping obligations for allow, deny, tenant context, object rules, and worker revalidation. | no |
| AC-S003-01 | repo governance owner with current manifest schema | CAP-ORG-003 | contract-level | Prove family metadata uses approved governance and generated graph checks. | yes |
| AC-S004-01 | root and tenant admins over active, archived, deleted, parented, and childed organizations | CAP-ORG-CORE-001 | persistence-level | Plan unit, persistence, API, authz, audit, and compatibility tests for hierarchy and lifecycle. | yes |
| AC-S005-01 | root and tenant admins over no-profile, active-profile, and archived-profile states | CAP-ORG-LEGAL-001 | persistence-level | Plan tests for one-active legal profile, optional fields, retained reads, and tenant denial. | yes |
| AC-S006-01 | root and tenant admins over many locations and archived locations | CAP-ORG-LOC-001 | persistence-level | Plan tests for coordinate validation, head-office flags, lifecycle, search, export, and tenant denial. | yes |
| AC-S007-01 | root and tenant admins over no-hours, slots, and exception records | CAP-ORG-HOURS-001 | persistence-level | Plan tests for slot validation, no overlap, exception precedence, search, export, and tenant denial. | yes |
| AC-S008-01 | root and tenant admins over unit tree and archived unit states | CAP-ORG-UNIT-001 | persistence-level | Plan tests for depth, cycle denial, child projection, branch archive, child reassignment, and tenant denial. | yes |
| AC-S009-01 | root and tenant admins over business-unit membership targets and deferred individual/person targets | CAP-ORG-MEMBER-001 | persistence-level | Plan tests for real business-unit target validation, fixed labels, explicit individual/person deferral, privacy, audit, lifecycle, and tenant denial. | yes |
| AC-S010-01 | root admin mutation and tenant admin use states | CAP-ORG-CAT-001 | mixed | Plan tests for create, label update, archive, deprecate, replace, used-value retention, and tenant mutation denial. | yes |
| AC-S011-01 | security reviewer over unanswered and answered signoff states | CAP-ORG-BRAND-SIGNOFF-001 | contract-level | Prove public logo technical signoff checklist is complete before implementation tasks. | no |
| AC-S012-01 | admins, public readers, and asset processor over logo lifecycle states | CAP-ORG-BRAND-001 | mixed | Plan tests for upload intent, accepted delivery, replacement, removal placeholder, raw URL denial, cache signal, export, and accessibility. | yes |
| AC-S013-01 | root and tenant admins over allowed and denied search states | CAP-ORG-SEARCH-001 | runtime-api | Plan tests for grouped result types, exact filters, paging, sorting, indexes, performance, and tenant denial. | yes |
| AC-S014-01 | security reviewer and job owner over undecided and locked export pattern states | CAP-ORG-EXPORT-SIGNOFF-001 | contract-level | Prove secure export technical steering answers PIN, ZIP, job, notification, safety, cleanup, and runbook decisions. | no |
| AC-S015-01 | admins and background worker over queued, running, canceled, ready, failed, expired, and deleted exports | CAP-ORG-EXPORT-001 | mixed | Plan tests for selected sections, retained choice, actual files, requester-only download, PIN behavior, cancel, retry, expiry, delete, notifications, and cleanup failures. | yes |
| AC-S016-01 | screen standards owner and admin reviewer over draft and approved references | CAP-ORG-UI-001 | rendered-browser | Plan visual, keyboard, accessibility, mobile, async status, branch choice, logo, search, and export status proof. | yes |
| AC-S017-01 | planning reviewer over active and deferred integration wording | CAP-ORG-INT-DEFER-001 | contract-level | Prove integration records are excluded from active v1 task scope while future no-secrets boundary remains documented. | no |
| AC-S018-01 | planning reviewer and support operator over before-slice and after-slice states | CAP-ORG-ARTIFACT-001 | mixed | Plan artifact sweep proof for docs, feature manifests, generated graph, runbooks, test evidence, and status notes. | yes |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-ORG-001 | Public logo implementation blocker | Have all public logo technical signoff checklist rows been answered and approved? | yes | Asset/security owner |
| Q-ORG-002 | Export implementation blocker | Has secure generated export technical steering locked PIN/password ZIP, cancellation, retry, notification, safety limits, and cleanup behavior? | yes | Job/assets/security owner |
| Q-ORG-003 | Governed app screen blocker | Have shared screen behavior references been approved before root-admin or tenant-admin pages are built? | yes | Screen standards owner |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-ORG-S000 | S-000 / AC-S000-01 | ART-ORG-000 capability matrix drift | capability-matrix-required | no | matrix refreshed from current PRD, steering, blueprint, and entity-readiness snapshot | Matrix refresh completed in `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`. | yes | resolved |
| U-ORG-S001 | S-001 / AC-S001-01 | ART-ORG-001 stale test cases | artifact-creation | no | test cases refreshed from current story packet, capability matrix, PRD, API contracts, and entity-readiness snapshot | PRD-derived test-case refresh completed in `docs/prd/test_cases/2026-05-12-0025-organization-domain-foundation-test-cases.md`. | yes | resolved |
| U-ORG-S002 | S-002 / AC-S002-01 | ART-ORG-002 missing permission mapping | permission-mapping-required | no | permission mapping created from current PRD, story packet, API contracts, data dictionary, logo, and export decisions | Permission mapping completed in `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md`. | yes | resolved |
| U-ORG-S003 | S-003 / AC-S003-01 | ART-ORG-003 domain family metadata decision | artifact-creation | no | registry-first domain family governance created without unsupported manifest fields | ADR-0042 and `docs/architecture/domain-feature-family-registry.md` created. | yes | resolved |
| U-ORG-S004 | S-004 through S-010 / AC-S004-01 through AC-S010-01 | ART-ORG-004 API and data docs must remain current | api-contract-required | no | API contracts, data dictionaries, and permission mapping reviewed and corrected before task split | Alignment review completed in `docs/workspace/reviews/2026-05-15-organization-api-data-alignment-review.md`. | yes | resolved |
| U-ORG-S011 | S-012 / AC-S012-01 | Q-ORG-001 ART-ORG-005 logo technical signoff incomplete | source-of-truth-inspection | Has the public logo technical signoff been approved? | approve signoff before source work; no safe default | Signoff approved in `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md`; S-012 must carry proof obligations into task breakdown. | yes | resolved |
| U-ORG-S014 | S-015 / AC-S015-01 | Q-ORG-002 ART-ORG-006 secure export technical steering missing | technical-steering-revisit | no | lock reusable export pattern before source work | Signoff approved in `docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md`; S-015 must carry proof obligations into task breakdown. | yes | resolved |
| U-ORG-S016 | S-016 / AC-S016-01 | Q-ORG-003 ART-ORG-007 shared screen references missing | design-system-governance | no | design-system first before app pages | Create shared admin screen behavior lock and rendered references. | yes | deferred-with-owner |
| U-ORG-S018 | S-018 / AC-S018-01 | ART-ORG-008 maintained artifacts sweep | artifact-creation | no | refresh maintained artifacts as each slice lands | Carry artifact sweep into every task breakdown slice. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-ORG-000 | S-000 | capability matrix | refreshed current rows and deferred posture | capability-matrix maintainer | no |
| ART-ORG-001 | S-001 | PRD-derived test cases | refreshed to current story packet | prd-test-case-planner | no |
| ART-ORG-002 | S-002 | permission mapping | created Organization root/tenant/public/worker mapping | permission mapping workflow | no |
| ART-ORG-003 | S-003 | architecture/governance | created registry-first domain family metadata support | repo governance workflow | no |
| ART-ORG-004 | S-004 through S-010 | API and data docs | reviewed and corrected PRD, API contracts, and data dictionary alignment | API and data dictionary maintainers | no |
| ART-ORG-S004 | S-004 | Layer 4 task breakdown | create core Organization task queue and carry API, data dictionary, permission, test, migration, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S005 | S-005 | Layer 4 task breakdown | create legal profile task queue and carry API, data dictionary, permission, test, migration, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S006 | S-006 | Layer 4 task breakdown | create location task queue and carry API, data dictionary, permission, test, migration, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S007 | S-007 | Layer 4 task breakdown | create opening-hour slot and exception task queue and carry API, data dictionary, permission, test, migration, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S008 | S-008 | Layer 4 task breakdown | create business-unit task queue and carry API, data dictionary, permission, test, migration, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S009 | S-009 | Layer 4 task breakdown | create business-unit membership task queue and carry API, data dictionary, permission, test, migration, target deferral, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S010 | S-010 | Layer 4 task breakdown | create reference-value catalogue task queue and carry API, data dictionary, permission, test, migration, lifecycle, replacement, and artifact obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-005 | S-011 | asset decision | completed logo technical signoff and runbook | asset/security workflow | no |
| ART-ORG-S012 | S-012 | Layer 4 task breakdown | create public-logo relationship and delivery task queue and carry asset, cache, security, accessibility, export, runbook, and cleanup obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-S013 | S-013 | Layer 4 task breakdown | create grouped Organization search task queue and carry search, filter, index, permission, performance, and compatibility obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-006 | S-014 | technical steering | completed secure generated export addendum | technical steering workflow | no |
| ART-ORG-S015 | S-015 | Layer 4 task breakdown | create private export bundle task queue and carry job, PIN, notification, file, cleanup, security, and requester-bound proof obligations into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-007 | S-016 | design-system | create shared screen behavior locks and references | frontend design-system loop | yes |
| ART-ORG-S017 | S-017 | Layer 4 task breakdown | create deferred integration boundary task queue and carry no-active-v1-scope proof into delivery tasks | task-breakdown-maintainer | no |
| ART-ORG-008 | S-018 | maintained artifacts | refresh docs, manifests, generated graph, runbooks, and status notes as slices land | artifact sweep workflow | yes |
| ART-ORG-S018 | S-018 | Layer 4 task breakdown | create maintained artifact alignment task queue and carry slice closeout obligations into delivery tasks | task-breakdown-maintainer | no |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | ready-for-task-breakdown | Behavior matrix refresh has concrete source inputs and acceptance criteria. |
| S-001 | ready-for-task-breakdown | Test-case refresh has concrete story and proof inputs. |
| S-002 | ready-for-task-breakdown | Permission mapping scope is known from PRD, API, and steering. |
| S-003 | ready-for-task-breakdown | Domain family metadata is recorded through ADR-0042 and the architecture registry before source manifests rely on it. |
| S-004 | ready-for-task-breakdown | Core organization behavior is specified enough for task isolation. |
| S-005 | ready-for-task-breakdown | Legal profile behavior is specified enough for task isolation. |
| S-006 | ready-for-task-breakdown | Location behavior is specified enough for task isolation. |
| S-007 | ready-for-task-breakdown | Opening-hour slot and exception behavior is specified enough for task isolation. |
| S-008 | ready-for-task-breakdown | Business-unit behavior is specified enough for task isolation. |
| S-009 | ready-for-task-breakdown | Membership behavior is specified enough for task isolation with public seam checks. |
| S-010 | ready-for-task-breakdown | Reference value behavior is specified enough for task isolation. |
| S-011 | ready-for-task-breakdown | Signoff completion can be planned as a documentation/security task. |
| S-012 | ready-for-task-breakdown | Source work may be task-planned for v1 primary logo only, carrying public-logo signoff, runbook, and asset/security proof obligations. |
| S-013 | ready-for-task-breakdown | Search behavior is specified enough for task isolation. |
| S-014 | ready-for-task-breakdown | Secure export steering can be planned as an architecture task. |
| S-015 | ready-for-task-breakdown | Source work may be task-planned with secure export steering, private export decision, reusable export/email pattern, and job/file/security proof obligations. |
| S-016 | blocked | App UI work waits for shared screen governance. |
| S-017 | ready-for-task-breakdown | Deferred integration cleanup is a docs alignment task. |
| S-018 | ready-for-task-breakdown | Artifact sweep requirements are known and recur across source slices. |
