# ADR-0036: Adopt Layered Platform Authorization Evaluation

- Status: Proposed
- Date: 2026-05-04
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR-0016 established tenant-scoped role-based authorization with central policy
evaluation. Since then, the platform has added tenant authentication,
tenant-scoped configuration, root role capability enforcement, a capability
contract catalog foundation, and stronger tenant-boundary guardrails.

The next authorization planning pass identified that RBAC alone is not a
complete long-term product model for Kanbien. The platform needs to support:

- tenant boundary and lifecycle restrictions
- root-owned commercial and feature availability decisions
- tenant-owned activation of available options
- a simple v1 tenant admin role
- future attribute-based authorization, such as department, team, location,
  shift, job title, clearance, skillset, plan, and feature flags
- future relationship-based authorization, such as owner, editor, viewer,
  member, manager, team, and department relationships
- object/entity-level access rules
- root support viewing and root emergency powers
- safe denial messages and durable proof
- explicit grant source posture so planned permissions do not appear usable
  before runtime enforcement exists

This ADR refines ADR-0016. It does not replace the existing root authorization
model and does not implement runtime authorization changes.

## Decision

Adopt a layered platform authorization evaluation model.

For tenant-scoped requests, the approved architecture envelope is:

1. **Authentication and session context**
   Establish whether the request has a root or tenant actor identity.
   Authentication does not grant tenant authorization by itself.
2. **Tenant boundary and lifecycle**
   Tenant-scoped requests must evaluate in exactly one validated current tenant
   context. Tenant lifecycle may deny, restrict, or degrade access before
   feature policy is considered.
3. **Feature, configuration, and entitlement gate**
   Root-defined plan, entitlement, approval, and feature availability decide
   whether a feature or action may exist for the tenant. Tenant admins may only
   activate options root has already made available.
4. **RBAC**
   Role grants decide the actor's broad capability. v1 uses a globally
   consistent tenant role named `adminOwner`.
5. **ABAC extension**
   Future attribute rules may refine decisions. Each future attribute must
   declare its source of truth before use.
6. **ReBAC and object-rule extension**
   Future relationship and object rules may refine decisions through
   feature-owned relationship resolvers behind the central evaluator.
7. **Audit, proof, and safe denial**
   Decisions should produce durable proof where appropriate and stable internal
   reason codes that map to safe user-facing messages.

Root and tenant authority worlds remain distinct.

Rules:

- root/operator roles use a `root...` prefix
- tenant/account admin roles use an `admin...` prefix
- tenant roles never imply root powers
- root platform capabilities remain distinct from tenant-scoped capabilities
- cross-tenant access denies by default unless an explicitly approved
  root/operator capability allows it
- root support viewing is root-scoped read-only access, requires an explicit
  reason or reference, and is internal-audit-visible only in v1
- root support viewing is not tenant impersonation
- root support mutations must happen through explicit root-admin capabilities
- `rootAdmin` emergency powers are allowed, require reason/reference and
  high-severity internal audit, and do not require a formal v1 review queue
- background jobs use explicit system/job authority and preserve initiating
  actor, tenant context, reason or policy source, and relevant authz proof when
  applicable

The v1 tenant role model is intentionally simple:

- the first tenant role is `adminOwner`
- `adminOwner` is globally consistent across tenants
- tenant-specific role divergence is not allowed in v1
- tenant-created custom roles are out of scope
- tenant self-service tenant-admin management is out of scope in v1
- root-defined role template versioning and upgrade policy is deferred

The tenant lifecycle gate follows ADR-0037's separation between operational
lifecycle and deletion posture.

Operational lifecycle values:

- `draft`
  Tenant exists under strict rate and usage limits.
- `live`
  Tenant is active and billed; limits are tied to plan or entitlement.
- `disabled`
  Tenant read and export access are allowed; normal writes and new use are
  restricted.
- `inactive`
  Normal login is blocked; recovery path depends on inactive reason.

Deletion posture values:

- `active`
- `softDeleted`
- `hardDeletePending`
- `hardDeleted`

Technical representation must not overload operational lifecycle with deletion,
retention, legal-hold, investigation, export-window, or purge behavior.

Grant source posture must be explicit:

- `documentation-only`
  Planned or documented only; not selectable or usable.
- `seed-backed`
  Seeded into durable catalog or grants; not enough by itself for UI use.
- `corrective-migration-backed`
  Added or repaired through corrective migration; eligible only with runtime
  enforcement proof.
- `runtime-enforced`
  Code enforces the capability in the active request path; UI eligibility also
  requires durable source truth.
- `blocked`
  Must not be granted, selected, or used.

Only fully implemented, runtime-backed capabilities may be usable through UI or
admin workflows.

The central evaluator seam responsibilities, conceptual inputs/outputs,
resolver rules, and compatibility posture are defined in the Platform
Authorization Model Technical Steering packet.

The same Technical Steering packet defines an authz-specific audit/event
taxonomy for support, emergency, access decisions, denials, grants, lifecycle
effects, and job authority. That taxonomy does not replace a future broader
observability, alerting, logging, tracing, dashboard, or incident-response
architecture.

The API authn/authz contract must distinguish these product-level categories
before implementation:

- unauthenticated
- tenant selection not complete
- tenant context invalid or unavailable
- tenant lifecycle restricted
- feature, configuration, or entitlement unavailable
- tenant activation or configuration missing
- role or capability missing
- object or relationship rule denied
- attribute rule denied
- sensitive or generic fallback denial

Internal denial reason codes may be more precise than user-facing messages.
User-facing messages should be helpful when safe, and generic when detail would
leak hidden records, cross-tenant existence, security internals, or platform
detection methods.

## Consequences

### Positive

- future authorization-sensitive features share one evaluation envelope instead
  of inventing local policy stacks
- v1 can stay simple with `adminOwner` while preserving future ABAC and ReBAC
  paths
- root/operator capabilities remain compatible with current root authorization
  behavior
- tenant admins can operate day-to-day account features without gaining root
  powers
- docs-only and planned capabilities cannot accidentally become selectable UI
  grants
- support and emergency actions have explicit proof expectations
- background jobs get an auditable authority model instead of ambiguous
  "system did it" records

### Negative

- the central evaluator, reason-code model, audit model, and API denial
  contract must be implemented and tested before runtime authorization behavior
  can be considered complete
- tenant lifecycle semantics now exceed the current simple tenant status model
  and require reconciliation before lifecycle-sensitive changes
- future ABAC/ReBAC support requires each feature to define attribute sources or
  relationship resolvers rather than relying on broad generic shortcuts
- root support and emergency audit requirements add operational and persistence
  complexity

### Neutral / Follow-up

- ADR-0016 remains valid as the tenant-scoped RBAC foundation; this ADR refines
  the broader evaluation order and adjacent gates
- the shared API denial contract is defined in
  `docs/api-contracts/platform-authorization-denials.md`
- the central evaluator seam is defined in
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- the authz audit/event taxonomy is defined in
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- a follow-up tenant lifecycle decision must reconcile `draft`, `live`,
  `disabled`, `inactive`, soft delete, hard delete, inactive reasons,
  retention, and legal hold with current tenant storage
- a future platform observability/alerting architecture must define logs,
  metrics, traces, dashboards, alert thresholds, routing, and incident response
- role-template versioning and upgrade policy remains deferred
- the final ABAC attribute catalog remains deferred until concrete features need
  those attributes
- future UI surfaces for tenant admin settings, support viewing, emergency
  actions, reports, and exports must go through the appropriate frontend and
  design-system governance before implementation
