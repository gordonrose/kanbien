# Organization Domain Foundation Specification

## Summary

Define the first-version Organization domain foundation for Kanbien.

V1 gives root admins and tenant admins a governed way to manage the business
structure for a customer/account: organizations, legal details, locations,
weekly hours, opening-hour exceptions, business units, memberships, reference
values, public logos, search, and private exports.

This PRD is a requirements artifact only. It does not approve runtime
implementation, migrations, route paths, database tables, permission keys,
screen designs, or task-level delivery.

## Source Artifacts

- Product Discovery:
  `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md`
- Capability Matrix:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- Capability Matrix Notes:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft-notes.md`
- Public logo decision:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`
- Private export decision:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`

## Scope

V1 defines requirements for:

- root-admin and tenant-admin Organization management
- customer/account-scoped organization records
- parent and child organization hierarchy
- organization legal profiles
- organization locations
- optional weekly opening hours
- business-unit hierarchy
- business-unit memberships to real individual users and business units
- system-owned Organization reference values
- public organization logo handling
- separated-by-type Organization search
- private Organization export bundles
- design-system prerequisite work before app screens
- required downstream API, data, permission, test, feature, generated, and
  runbook artifacts

## Non-Goals

V1 does not include:

- source implementation
- migrations
- approved route paths
- approved database table or field names
- approved permission keys
- app screen implementation
- import or bulk upload
- recurring holiday calendars, seasonal schedules, and external holiday feeds
- high-level organization integration records
- deep integration setup, credentials, endpoints, webhook secrets, payload
  examples, or provider configuration
- multiple active legal profiles per organization
- public non-logo Organization pages
- admin-visible change-history screens
- generic public file hosting or generic asset-library behavior
- CSV/spreadsheet export files for v1
- generated placeholder image files in export bundles
- audit/history/change-security event export in normal Organization exports
- request-time export snapshots
- expiry warning notifications

## Actors

| Actor | V1 Role |
| --- | --- |
| Root admin | Can manage Organization records across authorized customer/accounts and can manage system-owned Organization reference values. |
| Tenant admin | Can manage Organization records inside exactly one current customer/account. |
| Public logo reader | Can read only current accepted public logo image bytes or placeholder behavior exposed through approved app-controlled URLs. |
| Background export worker | Builds private export zip files from authorized export requests. |
| Cleanup worker | Expires and deletes generated export copies and eligible replaced logo bytes according to approved cleanup rules. |
| Asset processor | Verifies, scans, strips metadata, and marks uploaded organization logos ready or rejected. |

## Core Concepts

### Organization

An organization is an official customer/account business entity record. It is
tenant-owned and may be arranged into a parent/child hierarchy.

Rules:

- admins create organizations manually; there is no automatically created
  default organization
- a customer/account may have many organizations
- organization names are unique within one customer/account for active
  organizations, while different customer/accounts may use the same
  organization name
- child organizations are allowed
- hierarchy max depth is 10 for v1
- loops are forbidden
- parent and child organizations must belong to the same customer/account
- normal reads exclude archived or deleted rows unless an explicit capability
  includes retained records
- tenant lifecycle remains owned by the tenant feature; Organization inherits
  tenant disabled/deleted baseline behavior and must not mutate tenant
  lifecycle

### Legal Profile

A legal profile stores official legal details for an organization.

Rules:

- v1 allows one active legal profile per organization
- tax or VAT number is optional
- registered address fields belong to the legal profile when they describe the
  official registered address rather than an operational location
- previous or archived legal profiles remain retained according to the data
  dictionary and export rules
- multiple active legal profiles are deferred

### Location

A location is a place of operation for an organization.

Rules:

- an organization may have many locations
- locations may include optional geocoordinates for map/display/search behavior
- head-office flags are descriptive booleans
- head-office flags are not uniqueness constraints
- location lifecycle follows the Organization-domain archive/restore posture

### Weekly Opening Hours

Weekly opening hours describe recurring weekly availability for a location.

Rules:

- opening hours are optional
- v1 weekly hours are weekday-specific slots
- a location may have multiple slots for the same weekday
- each slot has a weekday, slot order, local opening time, and local closing
  time
- no active slots for a weekday means the location is closed on that weekday
  under the normal recurring schedule
- overlapping active slots for the same location and weekday are denied
- overnight slots are deferred unless explicitly approved later
- the PRD-derived test plan must cover valid weekdays, multiple slots,
  ordering, non-overlap, local time ranges, optional absence, and invalid values

### Opening Hours Exceptions

Opening-hours exceptions describe date-specific changes that supersede the
normal weekly schedule for a location.

Rules:

- exceptions are optional
- exceptions always win over recurring weekly slots for the affected date or
  date/time range
- v1 exception types are `closed_day`, `closed_time_slot`,
  `special_opening_slot`, and `replacement_day_schedule`
- deterministic precedence is `closed_day`, then `replacement_day_schedule`,
  then `closed_time_slot`, then `special_opening_slot`
- exception times are local date and local time values tied to the location
- recurring holiday calendars, seasonal schedules, and external holiday feeds
  are deferred
- the PRD-derived test plan must cover exception precedence, date validation,
  non-overlap where applicable, and effective-hours behavior

### Business Unit

A business unit is an internal structure inside an organization.

Rules:

- business units may have parent and child relationships
- child unit IDs are exposed as a derived child-list projection from the
  parent relationship rather than stored as an independent source of truth
- business-unit hierarchy max depth is 10 for v1
- loops are forbidden
- parent and child business units must belong to the same customer/account and
  owning organization
- parent archive must support archive-whole-branch or move-children behavior

### Business Unit Membership

A business-unit membership links a real individual user or another real
business unit to a business unit.

Rules:

- memberships must reference real existing individual-user records or real
  existing business-unit records
- placeholder people, teams, or units are not allowed
- v1 membership roles are Organization-domain participation roles, not the
  platform authorization-role system
- v1 membership roles are fixed system values: owner, manager, member, and
  viewer
- membership behavior must use public individual-user and business-unit seams
  or approved equivalents; it must not import private persistence directly from
  other features
- membership records may be PII-adjacent and require privacy, audit, and
  permission coverage

### Integration Record

Integration records are deferred from v1 implementation.

Rules:

- no v1 route, UI, export, or search behavior is approved for integration
  records
- if integration records are revived later, they must stay high level and must
  exclude credentials, endpoints, webhook secrets, payload examples, provider
  configuration, and other secret/configuration material

### Reference Values

Reference values are system-owned option-list values for Organization-domain
fields. They are the controlled choices tenant admins select from, such as
organization type, legal form, industry category, location type, integration
type, or relationship type.

Rules:

- root admins can create, rename, archive, deprecate, and replace approved
  reference values
- tenant admins can use approved values but cannot mutate the system catalogue
- label changes apply immediately everywhere by reference
- used values must not disappear silently
- used values must be archived, deprecated, or explicitly replaced
- a broader platform catalogue owner remains a future architecture option; v1
  defaults to Organization-owned reference values unless a broader owner is
  approved before task breakdown

## Organization Hierarchy Requirements

Organization parent operations must support:

- create root-level organization
- create child organization
- read parent/child relationships
- update allowed mutable organization facts
- move organization to a valid parent
- archive organization
- restore or reactivate organization where approved by lifecycle rules
- archive whole branch when archiving a parent
- move children to a different valid parent when archiving a parent

The system must deny:

- depth greater than 10
- cycles
- parent/child relationships across customer/account boundaries
- parent/child relationships that violate lifecycle rules
- tenant-admin operations outside the current customer/account

## Business Unit Hierarchy Requirements

Business-unit parent operations must support:

- create root-level business unit
- create child business unit
- read parent/child relationships
- update allowed mutable business-unit facts
- move business unit to a valid parent
- archive business unit
- restore or reactivate business unit where approved by lifecycle rules
- archive whole branch when archiving a parent unit
- move children to a different valid parent when archiving a parent unit

The system must deny:

- depth greater than 10
- cycles
- parent/child relationships across customer/account or organization
  boundaries
- placeholder membership records
- memberships to missing or invalid users or roles

## Authorization Requirements

Root and tenant authority must remain distinct.

Root-admin requirements:

- root-admin Organization actions use root authority
- root actions that operate on tenant-owned Organization records must select an
  explicit target customer/account through the future API contract
- root-admin access must not depend on a tenant-admin current session
- root admins can manage system-owned reference values

Tenant-admin requirements:

- tenant-admin Organization actions use exactly one current customer/account
  from the tenant session/selection model
- tenant admins can manage tenant-owned Organization records only inside their
  current customer/account
- tenant admins cannot mutate system-owned reference values
- request bodies must not supply tenant authority

Cross-account behavior:

- cross-account access denies by default
- object rules must verify owning customer/account for every Organization
  record and relationship
- public logo reads expose only approved public logo bytes or placeholder
  behavior, not private Organization records

Permission mapping must be completed before implementation. This PRD does not
approve exact permission key names.

## Public Logo Requirements

Organization logos are a narrow approved public asset use case.

Logo types:

- `primary`

Future logo types such as `icon`, `light-background`, or `dark-background`
require a separate expansion decision.

Allowed v1 MIME types:

- `image/png`
- `image/jpeg`
- `image/webp`

Rules:

- SVG is out of scope for v1 public organization logos
- maximum upload size is 5 MB per raster logo
- stored organization-logo bytes are capped at 1 GB per tenant for v1
- pending uploads are capped at 10 per actor and 50 per tenant
- daily upload bytes are capped at 250 MB per tenant per day
- public transfer alert threshold is 10 GB per tenant per day
- upload intents must be short-lived, single-use, actor-bound, scope-bound, and
  storage-key-bound
- uploaded logos must pass malware scanning before public readiness
- raster metadata/EXIF must be stripped before public readiness
- client-supplied MIME type is not proof of safety
- raw bucket/provider URLs must not be exposed
- public URLs must be app-controlled
- public logo replacement must keep the old logo public until the replacement
  is accepted as safe and usable
- replacement must trigger cache/CDN purge or invalidation with short
  revalidation fallback
- purge/invalidation failures must be recorded and retried
- eligible prior logo bytes may be deleted 24 hours after the replacement is
  live
- removing a logo falls back to a deterministic app-generated initials
  placeholder based on the organization name
- placeholders are not uploaded assets
- exports include actual uploaded logo image files, not generated placeholder
  image files

Accessibility:

- logo alt text is required
- default alt text is `<organizationName> logo`
- the default alt text is editable
- if an organization name changes and alt text still matches the generated
  default, the default should update; custom alt text should be preserved

## Search Requirements

Admins need one way to search across the Organization domain.

V1 search supports:

- broad text search
- explicit exact filters
- separated result groups by record type
- pagination
- deterministic sorting
- permission-filtered results

V1 search does not support:

- arbitrary advanced query language
- browser-only filtering as the authoritative search model
- unindexed text scans for scalable fields

The PRD allows the following result areas:

- organizations
- legal profiles
- locations
- weekly opening hours
- business units
- memberships
- branding/logo references
- reference values

The API contract and data dictionary must define exact searchable fields,
operators, indexes, and response shape.

## Private Export Requirements

Organization exports are private background-generated zip files.

Export request rules:

- root admins can request authorized Organization exports through root
  Organization authority
- tenant admins can request exports only for their current customer/account
- admins can select export sections and may use a select-all convenience
- export scope supports selected Organization only or selected Organization
  plus child branch when the actor is authorized for every included
  Organization
- export copies are personal to the requesting admin; other admins cannot
  download them solely because they have Organization permission
- export generation is background-job only, including small exports
- requesting admins can cancel pending or running exports
- failed exports remain visible with a safe reason and retry option
- retry can reuse previous selected sections/options, and the admin may change
  them before retrying
- reusable export/email behavior follows
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`

Export package rules:

- package format is `.zip`
- ZIP is password/PIN protected
- generated PIN can be viewed again by the requesting admin while the export is
  available
- PIN may be included in the ready email notification subject to security
  controls and no ordinary logging
- selected structured sections are included as JSON files plus actual selected
  file assets
- an export manifest is required
- actual uploaded logo image files retained at export time are included
- generated initials placeholders are not included as image files
- export metadata may state that a placeholder is used publicly when no
  uploaded logo exists
- export data reflects generation-time source records for v1
- actor chooses `current_only` or `include_retained`; deleted records are
  excluded from exports
- normal Organization exports exclude audit/history/change-security events
- integration records are excluded from v1 Organization exports
- reference values are included inline in business records and also in a
  `reference-values.json` file
- branch exports use one ZIP with a folder per included Organization and a
  manifest that records the branch tree

Export size and lifecycle:

- no product-facing maximum Organization count or maximum ZIP size is approved
  for v1; technical safety limits may be required by Technical Steering
- ready export available for 24 hours or until deleted
- job soft timeout is 10 minutes
- job hard timeout is 30 minutes
- transient job/storage retry count is 2
- cleanup retry window is 7 days

Delivery and privacy:

- download is private
- admin must be currently logged in to download
- download requires the requester-bound export record; link plus PIN alone is
  not authority
- no public export links
- no raw bucket/provider URLs
- ready and failed email notifications are required
- in-app async/status component with an attention badge is required for ready,
  failed, and action-needed states
- checksum/actual-byte verification is required before ready
- no second malware scan is required for generated ZIP files when they are
  server-generated from verified source records and already-scanned logo files
- legal hold and incident hold affect persistent source data and audit
  evidence, not generated export copies
- generated export copies still expire/delete on schedule

## Admin Screen Requirements

V1 requires separate management areas rather than one giant Organization
screen.

Expected areas:

- organizations
- legal details
- locations
- weekly hours
- opening-hour exceptions
- business units
- memberships
- reference values
- branding/logos
- search
- exports

Root-admin and tenant-admin experiences should be the same general experience,
with root admins seeing broader functionality and entities.

No app screen implementation may start until design-system work defines
approved shared patterns for:

- lists
- detail editing
- grouped search results
- branch archive or move-child choices
- logo management
- export request/status/download

App-page CSS, copied governed markup, and duplicated controller behavior are
not allowed unless an explicit exception is approved.

## Data And Lifecycle Requirements

All durable Organization records must follow repo defaults:

- clients cannot supply system-managed fields
- empty strings are rejected rather than silently converted to null
- timestamps are ISO-8601 at the API boundary and UTC in storage
- normal reads exclude soft-deleted rows by default
- deleted rows require explicit capabilities
- successful updates refresh `updatedAt`
- soft delete sets `deletedAt` and refreshes `updatedAt`
- uniqueness must be enforced on normalized values where normalization is part
  of the domain contract

Data dictionary work must define:

- durable record ownership
- required and optional fields
- lifecycle states
- retention behavior
- searchable fields
- supported operators
- indexes and uniqueness
- export inclusion posture
- privacy/PII posture

This PRD does not approve table or field names.

## Audit, Privacy, And Compliance Requirements

Audit evidence is required for:

- create, update, archive, restore, move, and replace actions
- public logo upload, processing, replacement, removal, and cleanup failures
- private export request, job status, download, delete, expiry, and cleanup
  failures
- denied access where sensitive or security-relevant
- catalogue mutation and replacement

Privacy posture:

- Organization records are confidential tenant organization metadata unless a
  capability explicitly marks public logo bytes as public
- memberships may be PII-adjacent
- private exports may contain all retained Organization-domain data and must
  remain private
- public logo delivery must not expose private Organization records or raw
  storage authority

Compliance posture:

- private export metadata and audit evidence are durable according to the
  future data dictionary/runbook posture
- generated export copies are temporary and expire/delete on schedule
- legal and incident holds do not extend generated export copy retention unless
  a later approved export policy changes this

## Downstream Artifact Requirements

Before source implementation, the following artifacts are required:

- PRD-derived test cases
- API contract docs for root-admin and tenant-admin route families
- data dictionary pages for all durable Organization records and generated
  export records
- permission mapping for root admin, tenant admin, public logo read, background
  export, cleanup, catalogue mutation, and object rules
- runbook notes for public logo processing, cache invalidation, export jobs,
  expiry, deletion, cleanup retry, and failure recording
- feature docs for implemented Organization features
- feature manifests for implemented Organization features
- generated feature dependency graph updates after feature manifests exist
- design-system behavior locks and rendered references before app UI
- implementation blueprint refresh after PRD and test cases exist

## Capability-To-Story Map

| Story | PRD Coverage |
| --- | --- |
| S-000 | Capability matrix has been refreshed and is a source for this PRD. |
| S-001 | This PRD is the requirements document for Organization v1. |
| S-002 | PRD-derived test cases remain required next. |
| S-003 | Domain-family metadata/tooling work remains required before Organization feature manifests rely on domain metadata. |
| S-004 | Core organization records and hierarchy. |
| S-005 | Legal profiles and one-active legal profile rule. |
| S-006 | Locations and weekly hours. |
| S-007 | Business units and memberships. |
| S-008 | High-level integration records are deferred from v1. |
| S-009 | Reference values. |
| S-010 | Public logo branding. |
| S-011 | Separated-by-type search. |
| S-012 | Private export bundles. |
| S-013 | Design-system prerequisite for admin screens. |
| S-014 | Public Organization summaries are deferred until a real consumer exists. |
| S-015 | Maintained planning, feature, generated, and support notes must stay aligned as slices land. |

## Open Blockers Before Implementation

| Blocker | Required Resolution |
| --- | --- |
| Exact API contract | Resolved for task-breakdown planning by `docs/api-contracts/organization-root-admin.md` and `docs/api-contracts/organization-tenant-admin.md`; implementation still requires task-level route, OpenAPI, and maintained artifact work. |
| Exact data model | Create data dictionary pages before migrations. |
| Exact permission keys | Create permission mapping before protected runtime work. |
| PRD-derived tests | Create detailed test cases before task breakdown/implementation. |
| Domain-family metadata | Complete repo-governance/tooling story before Organization manifests rely on domain metadata. |
| Design-system patterns | Complete design-system work before app screen implementation. |
| Reference catalogue owner | Keep Organization-owned catalogue default unless broader platform catalogue ownership is approved before task breakdown. |

## Acceptance Summary

Organization v1 requirements are accepted when:

- this PRD preserves the approved source decisions
- explicit deferrals remain out of implementation scope
- every active capability from the refreshed matrix is covered by a PRD section
- no exact route, table, field, permission key, or UI control is invented
  without its downstream artifact
- PRD-derived test cases can be written from this document
