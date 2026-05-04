# Product Discovery Taxonomy

This taxonomy provides reusable classification language for Layer 1 Product
Discovery.

Taxonomy values flag product questions, likely downstream gates, and reusable
template paths. They do not prescribe implementation architecture, persistence
shape, route contracts, file layout, or test design.

Taxonomy version: `2026-05-03.1`

## Discovery Coverage Overlays

Purpose: add topic-specific coverage areas to the universal discovery matrix.
Apply every overlay that materially matches the request. Overlays do not decide
implementation architecture; they make sure the interview asks enough product
questions before handoff.

Starter overlays:

- access / authorization
- billing / commercial model
- tenant boundary
- frontend / UX
- user-managed assets
- data lifecycle and retention
- integration / API
- compliance / reporting
- operations / support
- configuration / feature flags
- notification / communication
- workflow / approval

Overlay rules:

- The assistant may mark an overlay area `not-applicable`, but must give a
  reason.
- For complex or foundational requests, deferred future support must still be
  explored enough to classify the direction as known, open, or intentionally
  out of scope.
- A packet is not ready for Technical Steering while a triggered overlay has
  unclassified coverage areas.

### Access / Authorization Overlay

Use when a request affects account access, roles, permissions, tenant context,
operator access, support access, public access, or sensitive action gating.

Required coverage areas:

- actor classes and authority worlds
- root/operator versus tenant/account responsibilities
- current tenant context and cross-tenant deny posture
- role naming and role family direction
- grant source posture and lifecycle
- feature/configuration/flag gate posture
- allow and deny proof expectations
- object/entity-level rule direction
- attribute-based rule direction
- relationship-based rule direction
- support/operator access posture
- emergency or break-glass access posture
- onboarding, offboarding, and role-change lifecycle
- audit/history visibility and retention expectations
- user-facing denial behavior
- compatibility with current authn/authz behavior

### Billing / Commercial Model Overlay

Use when a request affects plans, pricing, payment details, usage, quotas,
entitlements, invoices, customer billing contacts, or commercial packages.

Required coverage areas:

- plan, price, and tier ownership
- tenant-managed billing details
- entitlement and quota boundaries
- usage measurement and customer-visible usage
- payment-data sensitivity and provider posture
- billing history, invoice visibility, and audit needs
- downgrade, cancellation, suspension, and failed-payment posture
- compatibility with existing customer access

### Tenant Boundary Overlay

Use when a request affects tenant-scoped data, tenant selection, tenant
management, cross-tenant support, shared-cross-tenant behavior, or data
isolation.

Required coverage areas:

- owning tenant context
- actor's current tenant context
- cross-tenant deny rule
- root/operator exception posture
- tenant admin visibility and management boundaries
- tenant lifecycle impact
- tenant-scoped audit and reporting visibility

### Frontend / UX Overlay

Use when a request creates or changes a user-facing screen, journey, dashboard,
settings surface, admin tool, public page, or browser workflow.

Required coverage areas:

- primary user value
- surface and management location
- list size, search, comparison, and review needs
- mistake recovery and confirmation needs
- empty, denied, loading, failed, and degraded states
- customer-facing wording and confidence needs
- governed design-system or frontend topology signal

### User-Managed Assets Overlay

Use when a request uploads, displays, links, downloads, replaces, deletes, or
publishes user-managed files or media.

Required coverage areas:

- asset owner and consuming relationship
- allowed asset kinds and visibility
- upload, replace, read, download, delete, and publish authority
- rendering or delivery posture
- privacy, scanning, checksum, and verification assumptions
- quota, cleanup, retention, export, and legal-hold expectations
- accessibility metadata expectations

### Data Lifecycle And Retention Overlay

Use when durable records can expire, be abandoned, be revoked, fail midway,
need cleanup, be soft-deleted, be hard-deleted, be archived, or be retained for
history/compliance.

Required coverage areas:

- lifecycle states and transitions
- ownership of cleanup decisions
- expiry, abandonment, retry, and failure posture
- soft-delete, hard-delete, archive, restore, and purge expectations
- retained history and user-visible history
- operational recovery and evidence expectations

### Integration / API Overlay

Use when a request affects public or private API behavior, external providers,
webhooks, import/export, generated contracts, or machine-readable interfaces.

Required coverage areas:

- consumer and provider actors
- success, rejected, retry, partial, and degraded behavior
- compatibility and versioning expectations
- customer-visible error behavior
- external provider authority and fallback posture
- evidence, audit, and reconciliation expectations

### Compliance / Reporting Overlay

Use when a request affects evidence, audit history, exports, business reports,
compliance posture, privacy review, or accountable decision records.

Required coverage areas:

- report consumers and decisions supported
- source of truth and freshness expectations
- permission filtering and sensitive-field visibility
- exportability and retention expectations
- audit/evidence completeness and immutability expectations
- customer-visible versus operator-only evidence

## Product Feature Type

Purpose: classify the business shape of the change.

Starter values:

- entity management
- workflow builder
- workflow execution
- reporting / analytics
- settings / configuration
- authentication / access
- onboarding / activation
- approval / review queue
- import / export
- notification / communication
- asset-backed feature
- admin / operator tooling
- support / troubleshooting

Examples:

- A tenant-admin catalog for managed records is `entity management`.
- A drag/drop page hierarchy editor is `workflow builder` or builder-like
  configuration depending on the user outcome.
- A cross-tenant operations dashboard is `reporting / analytics`.
- A tenant-aware login flow is `authentication / access`.

Does not decide:

- backend feature folder
- route naming
- persistence tables

Common downstream flags:

- entity management often flags data dictionary, API contract, permissions, and
  lifecycle questions.
- workflow builder often flags journey inventory, design-system pattern, state
  persistence, preview/apply, and audit questions.
- reporting often flags source-of-truth, aggregation freshness, exportability,
  and permission filtering.

## UX Pattern

Purpose: classify the user interaction pattern, independent of backend
ownership.

Starter values:

- searchable catalog
- detail view
- create/edit form
- wizard
- builder / canvas
- dashboard / report
- timeline / activity log
- approval queue
- settings panel
- login / authentication flow
- troubleshooting / replay view
- public content view

Does not decide:

- whether app UI may be implemented before design-system signoff
- exact component or CSS design

Common downstream flags:

- governed app surfaces may require design-system signoff before real app UI.
- builder/canvas patterns may require new UX pattern or design-system extension
  steering.

## Data Ownership Shape

Purpose: identify where durable truth lives and whether the feature owns it.

Starter values:

- owns durable entity
- reads another feature's durable entity
- composes multiple feature entities
- derived / projection-only
- external / provider-sourced
- user-uploaded asset-backed
- reporting aggregate

Does not decide:

- table structure
- repository interface
- projection implementation

Common downstream flags:

- reading another feature's durable entity flags cross-feature seam review.
- user-uploaded asset-backed flags asset decision records.
- reporting aggregate flags freshness, authority, and audit questions.

## Surface / Management Location

Purpose: distinguish where a thing appears from where it is managed.

Starter values:

- surfaced and managed in same module
- surfaced in one module, managed in another
- surfaced in many modules, managed centrally
- managed per tenant, surfaced to root
- managed by root, surfaced to tenant
- public read surface with private management
- support-only/internal surface

Does not decide:

- app route structure
- module boundaries
- authorization implementation

Common downstream flags:

- cross-surface management flags permission, current-tenant context, and
  source-of-truth questions.
- public read with private management flags privacy, publication, caching, and
  abuse-control questions.

## Actor And Permission Shape

Purpose: identify who acts and which product-level authority boundaries exist.

Starter values:

- root operator
- tenant admin
- tenant member
- unauthenticated public actor
- system / job actor
- delegated actor
- cross-tenant support / operator action

Does not decide:

- authz capability keys
- role grants
- middleware placement

Common downstream flags:

- tenant actors flag current tenant context and cross-tenant deny questions.
- root operators flag root/tenant boundary questions.
- system actors flag job/audit/revalidation questions.

## Relationship Shape

Purpose: classify the durable or product-visible relationships the user must
reason about.

Starter values:

- one-to-one owned child
- one-to-many owned children
- many-to-many association
- hierarchy / tree
- ordered list
- state machine
- versioned lineage
- derived relationship
- external reference
- polymorphic attachment / link

Does not decide:

- relational schema
- indexes
- junction tables

Common downstream flags:

- many-to-many flags ownership, filtering, and scale questions.
- hierarchy/tree flags ordering, move/delete semantics, and orphan handling.
- versioned lineage flags current/history rules and compatibility questions.

## Reporting / Read Model Shape

Purpose: classify how users need to inspect or summarize information.

Starter values:

- exact record lookup
- searchable catalog
- operational dashboard
- audit / history report
- aggregate metrics
- exportable report
- cross-feature rollup
- compliance / evidence report

Does not decide:

- query implementation
- storage denormalization
- export format

Common downstream flags:

- aggregate metrics flag freshness and reconciliation questions.
- exportable reports flag privacy, permission filtering, retention, and audit.
- compliance reports flag evidence and immutability questions.

## Lifecycle Shape

Purpose: identify user-visible and durable state transitions.

Starter values:

- simple active / deleted
- active / inactive
- enabled / disabled / suspended
- draft / published
- invitation / onboarding
- membership added / removed / role changed
- approval / rejection
- scheduled / expired
- retry / dead-letter
- archived / superseded
- versioned current / history
- canceled / abandoned
- configuration changed

Does not decide:

- enum names
- migration strategy
- cleanup job implementation

Common downstream flags:

- expired/abandoned states flag cleanup ownership.
- retry/dead-letter flags async/job-processing review.
- draft/published flags visibility, audit, and rollback questions.

## Integration / Externality Shape

Purpose: classify whether external systems, generated assets, providers, or
interchangeable tools are part of the product problem.

Starter values:

- internal-only
- external provider call
- webhook / inbound event
- import source
- export destination
- generated artifact
- user-managed file
- third-party identity or permission dependency

Does not decide:

- provider choice
- queue adapter
- storage provider

Common downstream flags:

- external provider calls flag retry, idempotency, privacy, and provider
  abstraction questions.
- user-managed files flag asset decision records.

## Evidence / Compliance Sensitivity

Purpose: identify whether product intent carries trust, audit, privacy, or
standards implications before technical planning begins.

Starter values:

- normal product workflow
- security-sensitive
- permission-sensitive
- privacy-sensitive
- audit-critical
- billing / entitlement-sensitive
- operationally critical
- compliance evidence
- user-visible runtime-sensitive

Does not decide:

- exact verification layers
- standards status
- audit event schema

Common downstream flags:

- permission-sensitive flags permission mapping and allow/deny tests.
- runtime-sensitive flags live/runtime evidence expectations if fixing visible
  behavior.

## Taxonomy Governance

### Change Types

- add value
- clarify value
- deprecate value
- merge values
- split value
- rename value
- add axis
- deprecate axis

### Required For Any Taxonomy Change

- reason for change
- examples that motivated it
- affected packets or product templates
- compatibility note
- replacement value if deprecated
- date and owner

### Rules

- Do not add a taxonomy value because one request used a phrase once.
- Prefer mapping a one-off phrase to an existing value plus packet-specific
  notes.
- Add a value only when it changes discovery questions, downstream gates, or
  reusable template behavior.
- Deprecate rather than delete values that existing packets or templates
  reference.
- New axes require explicit approval because axes increase the cognitive load
  and required fields for future Product Discovery packets.
- When no current value fits, first record `new-taxonomy-value-needed` in the
  Product Discovery packet. Do not immediately mutate the taxonomy.

## Taxonomy Change Log

| Date | Change type | Axis | Old value | New value | Reason | Affected templates |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-04-29 | initial version | all | N/A | starter taxonomy | Establish Layer 1 Product Discovery classification language. | generic-feature |
| 2026-04-29 | add value | Product feature type | N/A | authentication / access | Tenant-aware login testing showed auth requests need first-class discovery classification. | generic-feature |
| 2026-04-29 | add value | UX pattern | N/A | login / authentication flow | Tenant-aware login testing showed login is a recurring UX flow with specialized context and unhappy paths. | generic-feature |
| 2026-04-29 | add value | Lifecycle shape | N/A | active / inactive; enabled / disabled / suspended; membership added / removed / role changed; configuration changed | State-based journey testing showed Product Discovery needs reusable lifecycle and configuration-change language before capability derivation. | generic-feature |
