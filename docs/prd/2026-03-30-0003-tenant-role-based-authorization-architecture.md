# Tenant Role-Based Authorization Architecture Specification

## Purpose

Define the first enduring authorization architecture for the platform.

This specification covers how authenticated non-root actors gain and use
tenant-scoped authorization through roles, capabilities, scopes, and dynamic
relationship-aware checks.

It is designed to support:

- all future non-root user types
- multiple tenant memberships per principal
- different role assignments per tenant
- central authorization enforcement
- future entity-aware inheritance such as own, team, tenant, and all scopes
- later optimization without rewriting feature authorization call sites

`rootUser` remains outside this normal tenant authorization model as a
permanent platform operator layer.

---

## Scope

This phase includes:

- shared principal identity with multiple tenant memberships
- current-tenant authorization context per request
- platform-defined role templates
- tenant-scoped copied roles derived from role templates
- tenant-local role divergence managed only by root users
- global capability catalog
- role-to-capability mapping
- multiple role assignments per tenant membership
- central authorization evaluation seam
- yes/no action checks
- list/read scope evaluation
- dynamic entity inheritance behind the authorization seam
- immediate-effect authorization changes
- durable auditability for authorization administration
- protected bootstrap safety rules

This phase does **not** include:

- tenant self-service role creation
- tenant self-service role capability editing
- explicit deny semantics
- mandatory materialized authorization read models
- full frontend management UI
- final feature-by-feature capability catalog population

---

## Core Concepts

### Shared principal

A principal is the shared identity for one person across the platform.

One principal may belong to multiple tenants.

### Tenant membership

A tenant membership links one principal to one tenant.

Role assignments attach to the tenant membership, not directly to the shared
principal.

### Platform role template

A platform role template is a root-user-managed role definition that expresses
default capability grants.

Examples:

- `tenant_admin`
- `team_owner`
- `team_member`

### Tenant role

A tenant role is a tenant-scoped copy of a platform role template.

It begins from the platform default bundle, but later divergence is allowed only
through explicit root-user action for that tenant.

### Capability

A capability is a globally registered authorization identifier owned by a
feature or platform area.

Examples:

- `tenant.user.create`
- `tenant.user.read.tenant`
- `team.member.remove`
- `team.member.read.team`

### Scope

A scope expresses how broadly a capability may be used for reads or actions.

Initial conceptual scopes:

- `own`
- `team`
- `tenant`
- `all`

Not every capability needs every scope.

### Dynamic relationship inheritance

Authorization may be inherited through current entity relationships such as:

- team owner -> team members
- tenant admin -> tenant users
- project manager -> project tasks

The first model computes these relationships dynamically behind the central
authorization seam.

---

## Architectural Principles

### Authentication And Authorization Stay Separate

- authentication answers who the actor is
- authorization answers what the actor may do in the current tenant context
- `rootAuth` remains responsible for authenticated identity and session context
- tenant/business features must not own unrelated authentication concerns

### Root User Is Outside Tenant Authorization

- root users are permanent platform operators
- root-user powers do not flow from tenant roles
- tenant-role authorization does not constrain root-user break-glass platform
  administration unless an explicit later decision says otherwise

### Central Authorization Seam

Authorization logic must not be re-implemented ad hoc inside feature logic.

Feature code should call one central seam such as:

- `can(...)`
- `scope(...)`

The central seam may use feature-owned relation adapters and scope mappers, but
the decision point remains centralized.

### Positive Grants Only

- grants combine by union across all assigned roles in the current tenant
- the most permissive positive scope wins where scopes are comparable
- explicit deny rules are out of scope for this phase

### One Tenant Context Per Request

Authorization evaluation happens in one current tenant context at a time.

Cross-tenant evaluation is out of scope for normal request handling.

### Auditability And Safety Are First-Class

Role and capability administration is durable operational state, not mere
configuration noise.

Changes must be audit-visible and protected by safety constraints.

---

## Domain Model

Recommended durable concepts:

- `principal`
  Shared person identity across the platform.
- `tenant_membership`
  Principal membership in one tenant.
- `platform_role_template`
  Root-user-managed default role definition.
- `tenant_role`
  Tenant-scoped copy of a role template.
- `capability_definition`
  Global capability catalog entry.
- `tenant_role_capability_grant`
  Capability grant attached to a tenant role.
- `tenant_membership_role_assignment`
  Assignment of a tenant role to one tenant membership.
- `authorization_audit_event`
  Durable event for authorization administration.

Optional later concepts:

- `relation_resolver`
  Feature-owned adapter for dynamic relationship expansion.
- `materialized_authz_scope`
  Future optimization read model if runtime evaluation becomes too expensive.

---

## Capability Namespace Model

Capabilities are globally registered strings.

Rules:

- capability names are globally unique
- capability ownership belongs to a feature or platform area
- capability definitions should be stable once used in persisted mappings
- capabilities should map cleanly to backend-protected actions
- scopes may be expressed as part of the capability name when that keeps the
  model clearer

Examples:

- `tenant.user.create`
- `tenant.user.read.own`
- `tenant.user.read.tenant`
- `tenant.user.update.tenant`
- `team.member.read.team`
- `team.member.remove`

Recommended guidance:

- use dot-separated, action-oriented names
- keep names backend-capability-centric rather than UI-centric
- let multiple backend entry points reuse one capability when the underlying
  authorization rule is the same

---

## Enforcement Model

### Central Interface

The authorization seam should support at least two calls:

- `can(actorContext, capability, targetContext?) -> allow | deny + reason`
- `scope(actorContext, capability, resourceType, filterContext?) -> scope descriptor`

### Actor Context

The actor context should include:

- authenticated principal identity
- current tenant context
- current tenant membership
- root-user flag or operator context when relevant

### Target Context

For entity-aware checks, the target context may include:

- resource type
- resource identifier
- related entity identifiers already known at the call site

### Scope Descriptor

The scope descriptor should be rich enough to support:

- `none`
- `own`
- `team`
- `tenant`
- `all`

It may later carry feature-specific relation hints, but the initial external
contract should stay small and stable.

### Where Checks Happen

- route and service layers may both invoke authorization
- backend remains authoritative
- frontend visibility may follow the same rules later, but it must not be the
  enforcement point

---

## Dynamic Inheritance Model

The initial inheritance model should be dynamic.

That means the authorization seam may consult current relationship facts at
request time through feature-owned adapters.

Examples:

- resolving whether the actor owns the target entity
- resolving whether the target entity belongs to a team the actor owns
- resolving whether the target entity belongs to the actor's current tenant

### Why Start Dynamic

- simpler source of truth
- more flexible during early platform evolution
- fewer synchronization and invalidation risks

### Known Cost

Runtime relationship checks may increase request complexity and read cost.

The seam must therefore be designed so later optimization can replace or
supplement dynamic evaluation with materialized read models without changing the
feature-level call pattern.

---

## Persistence Model

The first persistence model should support:

- stable role templates
- tenant-local role copies
- per-role capability grants
- per-membership role assignments
- durable authorization audit events
- protected bootstrap flags

Important persistence rules:

- platform role templates and capability definitions are durable catalog data
- tenant roles are durable tenant-owned copies, not ephemeral projections
- tenant role divergence must be auditable
- assignment changes must take effect immediately after write success
- safety rules must be enforced transactionally where practical
- capability and role identifiers should be stable and human-reviewable

### Initial Persistence Schema Outline

Recommended first durable tables or equivalent records:

- `principals`
  Shared actor identity across tenants.
- `tenant_memberships`
  One principal membership per tenant.
- `platform_role_templates`
  Root-user-managed default role templates.
- `tenant_roles`
  Tenant-scoped copied roles.
- `capability_definitions`
  Global capability catalog.
- `tenant_role_capability_grants`
  Capability grants attached to one tenant role.
- `tenant_membership_role_assignments`
  Role assignments attached to one tenant membership.
- `authorization_audit_events`
  Durable audit log for authorization administration.

Recommended first uniqueness and lookup rules:

- `principals`
  - unique stable principal ID
- `tenant_memberships`
  - unique `(tenant_id, principal_id)`
  - index by `principal_id`
- `platform_role_templates`
  - unique stable `template_key`
  - index by `is_protected`
- `tenant_roles`
  - unique `(tenant_id, role_key)`
  - index by `(tenant_id, template_key)`
  - index by `is_protected`
- `capability_definitions`
  - unique `capability_key`
  - index by owning feature or namespace
- `tenant_role_capability_grants`
  - unique `(tenant_role_id, capability_key)`
  - index by `capability_key`
- `tenant_membership_role_assignments`
  - unique `(tenant_membership_id, tenant_role_id)`
  - index by `tenant_role_id`
- `authorization_audit_events`
  - index by `tenant_id`
  - index by `actor_principal_id`
  - index by `created_at`

Recommended safety-supporting fields:

- protected bootstrap flags on role templates and tenant roles
- protected grant flags when some copied grants must not be removed casually
- audit metadata fields for actor, reason/comment, before state, and after
  state

Ownership note:

- the shared principal record may later be owned by a broader identity feature,
  but authorization must still treat principal identity as a durable referenced
  concept rather than a transient request-only value

---

## Audit Model

Authorization administration must produce durable audit visibility from day one.

Minimum audit coverage:

- role template creation
- role template update
- tenant role creation from template
- tenant role capability grant added
- tenant role capability grant removed
- tenant membership role assignment added
- tenant membership role assignment removed
- protected-role or protected-capability mutation attempts
- safety-rule violations such as attempted removal of last admin-equivalent
  assignment

Each event should capture:

- actor
- tenant
- target record
- action
- before state when applicable
- after state when applicable
- timestamp
- reason or comment when supplied

---

## Safety Constraints

The model must support these platform protections:

### Protected Bootstrap Roles

Some roles are bootstrap roles and cannot be deleted casually.

### Protected Capability Grants

Some capabilities on protected roles cannot be removed without an explicit
platform-approved override path.

### Last Admin Constraint

A tenant must retain at least one admin-equivalent assignment at all times.

This rule must be enforced in the authorization-management backend, not merely
through UI warnings.

---

## Management Surface

Authorization administration is root-user-only.

Phase direction:

- backend/admin API first
- UI later
- no tenant-side self-management of role architecture

Initial management capability families likely include:

- create role template
- copy role template into tenant
- edit tenant role grants
- assign tenant role to membership
- revoke tenant role from membership
- view effective authorization for a membership

---

## Recommended Repo Shape

This architecture likely justifies a dedicated feature bundle such as:

`src/features/authorization/`

Suggested responsibilities:

- authorization catalogs and assignments persistence
- authorization domain service
- central authorization evaluation seam
- root-user-only authorization-management routes
- exported seam for business feature checks

Feature-owned business domains should not import authorization persistence
internals directly.

They should depend on the exported authorization seam and, when needed, supply
feature-owned relation or scope adapters through explicit public interfaces.

---

## Acceptance Criteria

This architecture is defined well enough for implementation when all of the
following are true:

1. the repo has one explicit authorization seam separate from authentication
2. tenant-scoped multi-role assignment is part of the durable model
3. role templates and tenant-role copies are both defined clearly
4. capability namespace ownership is explicit and global
5. both yes/no checks and list/read scoping are part of the design
6. dynamic inheritance is explicitly chosen as the first model
7. later optimization to materialized evaluation is possible without changing
   feature call sites
8. audit requirements for authorization administration are explicit
9. protected-role and last-admin safety rules are explicit
10. root-user management ownership is explicit

---

## Risks And Open Questions

- how quickly dynamic relationship evaluation becomes a runtime bottleneck
- how capability namespace governance should be reviewed as the catalog grows
- whether some scopes should stay as capability suffixes versus becoming a
  structured dimension later
- how much feature-specific relation logic should live in shared authz adapters
  versus feature-owned narrow seams
- when to introduce a materialized or cached authorization read model
