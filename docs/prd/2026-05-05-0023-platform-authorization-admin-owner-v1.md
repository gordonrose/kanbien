# Platform Authorization `adminOwner` V1 Foundation

## Summary

Define the first durable tenant-scoped authorization model for Kanbien's
platform authorization layer.

V1 establishes one globally consistent tenant admin role, `adminOwner`, while
preserving the existing separation between root-user platform capabilities and
tenant-scoped capabilities.

This PRD is an architecture/product requirements artifact only. It does not
implement runtime authorization changes, migrations, routes, UI, or task-level
delivery.

## Source Artifacts

- Product Discovery:
  `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-05-platform-authorization-admin-owner-story-breakdown.md`
- Capability Matrix:
  `docs/workspace/capability-matrices/2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft.csv`
- Capability Matrix Notes:
  `docs/workspace/capability-matrices/2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft-notes.md`
- ADRs:
  `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`;
  `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
- API denial contract:
  `docs/api-contracts/platform-authorization-denials.md`

## Scope

V1 defines requirements for:

- one tenant role named `adminOwner`
- globally consistent `adminOwner` behavior across all tenants
- root-owned tenant setup, branding, tenant-admin management, commercial
  entitlement, support, and emergency capability boundaries
- tenant-scoped `adminOwner` authority for day-to-day tenant account
  management inside root-approved availability
- tenant-scoped `adminOwner` export of tenant-owned data/logs through approved
  reporting and export layers
- explicit tenant context before tenant-scoped authorization
- deny-by-default cross-tenant behavior
- tenant lifecycle/deletion posture gates compatible with ADR-0037
- feature/configuration/entitlement gates before role grants are considered
- typed ABAC/ReBAC/object-rule extension points without broad V1 runtime
  implementation
- safe public denial behavior and durable internal proof expectations
- authz-specific audit/event expectations
- grant source posture and UI eligibility rules

## Non-Goals

V1 does not include:

- runtime authorization implementation
- tenant-created custom roles
- tenant-specific `adminOwner` divergence
- tenant self-service tenant-admin management
- root-user impersonation of tenant admins or tenant users
- broad ABAC/ReBAC runtime
- broad observability, alerting, or monitoring architecture
- tenant-admin UI implementation
- root-admin portal implementation changes
- migration from current tenant status/deleted fields without a compatibility
  plan
- route-family rewrites that break existing root or tenant auth contracts

## Core Concepts

### Authority worlds

The platform has separate authority worlds:

- root authority for platform-operator capabilities
- tenant authority for tenant-scoped capabilities
- system/job authority for approved background execution

Root roles and tenant roles must not be collapsed into one implicit authority
model.

Root role names should use a `root` prefix. Tenant admin level roles should use
an `admin` prefix. V1 tenant authority uses `adminOwner`.

### `adminOwner`

`adminOwner` is the only V1 tenant-admin role.

Rules:

- every tenant may have multiple `adminOwner` actors with equal authority
- `adminOwner` behavior must not diverge by tenant in V1
- an invited/pending tenant admin has no authority until invitation acceptance
  and setup are complete
- removal, suspension, or revocation removes authority immediately
- historical action records for a tenant admin must be preserved
- transfer semantics are not needed because V1 has multiple equal owners

### Root-owned controls

Root users retain control over:

- tenant setup and root-governed tenant branding posture
- tenant admin management
- billing tiers, pricing, limits, and commercial entitlement definitions
- support access
- emergency actions
- recovery from inactive or deletion-related states
- root-only visibility into legal hold, fraud, security review, internal
  support access, hard-delete schedule, and internal proof trail

Tenant admins may view applicable root-owned facts when exposed through
approved customer-facing/reporting layers, but they may not change those facts
unless a separate root-approved tenant capability exists.

### Tenant-owned controls

Subject to root-approved availability, lifecycle posture, and feature gates,
`adminOwner` may manage:

- day-to-day tenant account settings
- tenant-selectable flags/options that have been approved by root
- payment details
- billing contacts
- usage choices
- tenant-owned data and log exports exposed through approved reporting/export
  layers

Tenant admins should not receive raw internal system logs or internal operator
proof trails unless a later approved reporting layer explicitly exposes a safe
subset.

## Authorization Evaluation Rules

V1 follows the layered model approved by ADR-0036:

1. authenticate the actor/session
2. establish the authority world
3. require exactly one current tenant context for tenant-scoped requests
4. enforce tenant lifecycle/deletion gates
5. enforce root-approved feature/configuration/entitlement availability
6. enforce RBAC through `adminOwner`
7. evaluate typed ABAC/ReBAC/object-rule extension points only when a feature
   supplies approved facts
8. map denial to safe public API behavior
9. record required audit/proof evidence

Cross-tenant access denies by default unless an explicitly approved root or
operator capability allows it.

## Tenant Lifecycle And Deletion Posture

V1 authorization must align with ADR-0037.

Tenant operational lifecycle:

- `draft`
- `live`
- `disabled`
- `inactive`

Tenant deletion posture:

- `active`
- `softDeleted`
- `hardDeletePending`
- `hardDeleted`

Authz consumers must not silently overload one enum to answer both "may this
tenant operate?" and "does this tenant still exist for normal product
purposes?"

`inactive` tenants require explicit reason codes and recovery policy. Root owns
recovery.

## API Denial Behavior

Future tenant-admin routes must consume:

`docs/api-contracts/platform-authorization-denials.md`

Existing root and tenant-auth route families preserve current denial codes by
default unless a route-family API contract records a compatibility migration.

Tenant selection incomplete should be represented as a recoverable state, not
as a broad implicit grant. Tenant switching must be an explicit action.

Denial responses must be helpful where safe without exposing sensitive
existence, cross-tenant, support, emergency, or internal security information.

## Audit And Proof Expectations

Audit/proof is required for sensitive authorization behavior. At minimum, the
model must support durable evidence for:

- sensitive allows
- denials
- support access
- emergency action
- cross-tenant denial
- lifecycle/deletion denial
- grant-source denial
- object/attribute/relationship denial when those extension points are used
- system/job authority

Required proof fields include, where applicable:

- actor
- authority world
- tenant context
- capability
- decision
- denial category or reason
- policy source
- grant source posture
- request or job identifier
- visibility class
- severity
- occurred time

The concrete audit sink remains a downstream storage decision. Runtime
implementation must not proceed until the implementation blueprint selects a
storage posture.

## Grant Source And UI Eligibility

Every grant/capability row must record source posture:

- documentation-only
- seed-backed
- corrective-migration-backed
- runtime-enforced
- blocked

Only capabilities that are fully runtime-enforced may be exposed as usable in
UI. Documentation-only, architecture-target, seeded-but-not-enforced, or
blocked grants are not UI-eligible.

## Capability Set

The first-draft capability matrix covers:

- `admin-owner.role.global-consistency`
- `root-owned.tenant-controls`
- `platform-authz.denial-contract.adoption`
- `platform-authz.compatibility.root-tenant-auth`
- `admin-owner.grant.storage`
- `admin-owner.authority.lifecycle`
- `evaluator.tenant-context.cross-tenant-deny`
- `evaluator.decision-proof`
- `evaluator.abac-rebac.typed-extension`
- `tenant-lifecycle.authz-facts.compatibility`
- `tenant-lifecycle.authz-denials`
- `admin.tenant-account.manage`
- `admin.tenant-data.export`
- `platform-authz.audit-proof.storage`
- `platform-authz.audit-taxonomy.events`
- `platform-authz.ui-eligibility.runtime-enforced`
- `platform-authz.artifact-sweep`

## Open Decisions Before Runtime Planning

The implementation blueprint must resolve:

- whether tenant `adminOwner` grants extend an existing tenant-auth grant model,
  use a new tenant authz grant table, or use another approved authz store
- whether authz proof uses existing `auth_audit_events`, feature-local proof
  storage, or a new platform authz audit sink
- the exact compatibility strategy for moving from current tenant status and
  deletion fields toward ADR-0037 lifecycle/deletion posture
- which tenant account route families are first implementation scope
- which export/reporting route families are first implementation scope

## Verification Expectations

Required later verification families:

- unit tests for evaluator ordering and typed extension behavior
- integration tests for tenant context, feature/config gates, role grants,
  denial mapping, lifecycle/deletion gates, and route-family adoption
- persistence-backed tests for grants, lifecycle compatibility, and audit/proof
  storage once selected
- security tests for root/tenant boundary separation, cross-tenant deny,
  root-owned deny, pending admin deny, revoked admin deny, and sensitive
  fallback behavior
- audit tests for required event families and proof fields
- compatibility tests for existing root and tenant-auth denial behavior

## Follow-Up

Next downstream artifacts:

- implementation blueprint after storage and first route-family choices are
  selected
- PRD-derived test cases
- API contract updates for first route families
- data dictionary updates for selected grant, lifecycle, and audit storage
- permission mapping refresh after detailed runtime capability rows are ready
- capability catalog materialization planning before UI eligibility is exposed
