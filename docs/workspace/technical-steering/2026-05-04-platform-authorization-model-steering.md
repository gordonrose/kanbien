# Technical Steering Packet: Platform Authorization Model

## Status

- Packet status: `draft`
- Packet date: 2026-05-04
- Steering ID: `TS-2026-05-04-platform-authorization-model`
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`
- Related ADRs reviewed:
  - `docs/architecture/adr/0009-separate-authentication-from-business-features.md`
  - `docs/architecture/adr/0010-use-shared-platform-security-middleware.md`
  - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
  - `docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
  - `docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md`
  - `docs/architecture/adr/0033-add-a-capability-contract-catalog-foundation-with-hybrid-materialization-and-drift-audit.md`
  - `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`
  - `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
- Validation status: `pass`

## Product Handoff

- Product Discovery status: `ready-for-technical-steering`
- Product intent preserved: yes. The architecture must let Kanbien ship a
  simple v1 tenant `adminOwner` model while preserving root/tenant boundaries,
  root-owned commercial controls, tenant-owned day-to-day operation, and future
  ABAC/ReBAC extension paths.
- Product questions resolved or carried as blockers:
  - v1 tenant role is globally consistent `adminOwner`.
  - root/operator roles use a `root...` prefix; tenant/account admin roles use
    an `admin...` prefix.
  - root users own tenant branding, tenant admin management, pricing, tiers,
    limits, entitlements, support, and emergency powers.
  - `adminOwner` owns day-to-day tenant operation, allowed feature toggles,
    payment details, billing contacts, usage choices, and approved exports/logs.
  - root support access is read-only, reason/reference-backed, and internal-only
    for v1.
  - root emergency powers are allowed with reason/reference and audit; formal
    review workflow is deferred.
  - final ABAC catalog, role-template versioning, SSO/MFA assurance policy,
    formal emergency review workflow, and detailed retention duration values are
    deferred.
  - tenant lifecycle and deletion posture are separated by ADR-0037.
  - API authn/authz denial behavior is defined in
    `docs/api-contracts/platform-authorization-denials.md`.
  - central authorization evaluator responsibilities, inputs, outputs, and
    adoption posture are defined in this packet.
  - audit/event taxonomy is defined in this packet as an authz-specific
    taxonomy, not as a complete observability/alerting platform.
- New family or template decision: `approved-existing-family`

## Architecture Classification

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Rationale | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- | --- |
| TS-AUTHZ-001 | Platform authorization evaluation pipeline | architecture-foundation-required | shared authz architecture / future evaluator seam | approved | This creates an enduring policy order used by future tenant-scoped capabilities. | DECISION:architecture-foundation |
| TS-AUTHZ-002 | Tenant boundary and lifecycle gate | platform-seam | tenant session/context plus tenant lifecycle resolution | approved | Every tenant-scoped request must evaluate in exactly one current tenant context and respect tenant lifecycle state. | DEV:platform-seam |
| TS-AUTHZ-003 | Root authorization compatibility boundary | platform-seam | existing rootRoles/rootAuth/root capability enforcement | approved | Current root platform capabilities must stay distinct from tenant authz and remain backwards compatible. | DOC:permission-mapping |
| TS-AUTHZ-004 | Feature/configuration/entitlement gate | architecture-foundation-required | tenant configuration / plan entitlement / feature flag architecture | approved | Root controls availability; tenant admins activate only root-approved options. | DECISION:architecture-foundation |
| TS-AUTHZ-005 | v1 tenant role model | architecture-foundation-required | future tenant authz role catalog | approved | v1 needs one globally consistent tenant role, `adminOwner`, without tenant-specific role divergence. | DOC:permission-mapping |
| TS-AUTHZ-006 | Future ABAC extension layer | architecture-foundation-required | future authz policy evaluator attribute inputs | deferred-with-owner | Attribute rules are directionally required, but final attribute catalog and source-of-truth rules belong to future feature-specific work. | DECISION:deferred-architecture |
| TS-AUTHZ-007 | Future ReBAC/object rule extension layer | architecture-foundation-required | feature-owned relationship resolvers behind central evaluator | deferred-with-owner | Future relationships include owner/editor/viewer, member/manager, and team/department; v1 does not require relationship graph implementation. | DECISION:deferred-architecture |
| TS-AUTHZ-008 | Grant source posture and UI eligibility | architecture-foundation-required | capability catalog / permission mapping / runtime enforcement proof | approved | UI must expose only fully implemented runtime-backed capabilities. Docs-only and planned grants cannot be selectable. | DOC:permission-mapping |
| TS-AUTHZ-009 | API denial and proof contract | feature-public-seam | API/authz contract docs | approved | Product requires helpful safe denial behavior; exact status codes, reason codes, and response shapes are a required downstream contract output. | DOC:api-contract |
| TS-AUTHZ-010 | Audit and evidence model | architecture-foundation-required | security audit / authz audit / job audit seams | approved | Support, emergency, access changes, jobs, and deny decisions need durable proof semantics before implementation. | DOC:data-dictionary |
| TS-AUTHZ-011 | Tenant lifecycle representation | architecture-foundation-required | tenants feature and data lifecycle architecture | approved | ADR-0037 separates operational lifecycle from deletion posture and defines access, recovery, retention, and hard-delete gates. | DECISION:architecture-foundation |
| TS-AUTHZ-012 | System/job actor authority | platform-seam | job processing / async execution / audit propagation | approved | Jobs need explicit system authority while preserving initiating actor, tenant context, and policy source. | DEV:platform-seam |
| TS-AUTHZ-013 | Support and emergency root access | architecture-foundation-required | root-admin/support capability family | approved | Root support is read-only with reason/reference; emergency root powers require explicit root capabilities and audit. | DOC:permission-mapping |
| TS-AUTHZ-014 | Future UI and reporting surfaces | design-system-seam | future tenant admin and root-admin surfaces | deferred-with-owner | UI/reporting is implied later but not part of this architecture packet's implementation scope. | GOV:design-system |
| TS-AUTHZ-015 | Shared evaluator and reason-code mapping pressure | shared-lib-candidate | central authz evaluator first; shared lib only after stable consumers | approved | Policy evaluation and denial mapping are reusable, but the evaluator must remain an explicit platform seam with feature-owned fact resolvers. | DECISION:refactor-first |
| TS-AUTHZ-016 | Authorization QA evidence model | feature-public-seam | PRD-derived authz test expectations | approved | Future implementation must prove allow, deny, cross-tenant, lifecycle, support, emergency, and grant-source behavior. | EVIDENCE:qa-evidence |
| TS-AUTHZ-017 | Authz persistence and migration impact | architecture-foundation-required | future authz/audit/lifecycle persistence | approved | Roles, grants, audit records, lifecycle reasons, retention holds, support references, and job attribution will require persistence decisions. | DEV:migration-persistence |
| TS-AUTHZ-018 | Source-independent docs sweep | architecture-foundation-required | ADRs, guides, contracts, mappings, lifecycle docs | approved | Approved authz posture changes source-independent repo truth even before runtime implementation. | DOC:docs-artifact |

## Architecture Risk Flags

| Risk Area | Present | Evidence | Required Layer 3 Signal | Required Layer 4 Task Type |
| --- | --- | --- | --- | --- |
| API route or contract change | yes | Tenant authz will need distinct responses for unauthenticated, tenant-selection-not-complete, lifecycle deny, feature unavailable, role deny, object deny, and sensitive fallback. | API contract story required before route changes. | `DOC:api-contract` |
| persistence or migration change | yes | Future implementation needs tenant role/grant storage, audit/event storage, support reason/reference, lifecycle reasons, retention/hold policy, and possibly capability source metadata. | Persistence and data dictionary stories required. | `DEV:migration-persistence` |
| authz or permission change | yes | This is the core change; it introduces tenant `adminOwner`, root support/emergency posture, grant source rules, and future ABAC/ReBAC layers. | Permission mapping and authz proof stories required. | `DOC:permission-mapping` |
| DEV:frontend rendered surface | no | No UI implementation in this packet. Future tenant admin/root support/reporting surfaces are deferred. | Future frontend steering/design-system gate if UI is proposed. | `DEV:frontend` if later approved |
| governed GOV:design-system seam | no | No governed UI is implemented now. | Future DS loop required before app UI. | `GOV:design-system` |
| shared platform/runtime seam | yes | Authz evaluator, tenant context, lifecycle gate, root compatibility, and job authority are shared platform seams. | Platform seam story required. | `DEV:platform-seam` |
| reusable logic or extraction pressure | yes | Policy evaluation, reason-code mapping, attribute resolution, relationship resolution, and grant-source evaluation are reusable across features. | Keep central evaluator explicit; feature resolvers stay narrow. | `DECISION:refactor-first` |
| data dictionary impact | yes | Roles, grants, audit events, lifecycle reasons, support access, retention policy, and job attribution need durable definitions. | Data dictionary story required. | `DOC:data-dictionary` |
| QA/runtime evidence need | yes | Future implementation must prove allow/deny paths, cross-tenant deny, tenant lifecycle denies, grant-source blocking, support/emergency audit, and job attribution. | PRD-derived test cases required. | `EVIDENCE:qa-evidence` |
| source-independent docs impact | yes | Authz guide, ADRs, permission mappings, API contracts, tenant lifecycle docs, capability catalog posture, and future PRD artifacts need alignment. | Maintained-artifact sweep required. | `DOC:docs-artifact` |

## Frontend Architecture Classification

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Platform authz architecture envelope | not-applicable | platform authorization | policy foundation | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not applicable | not applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | ready | This packet does not implement rendered UI. |

## Browser Security Posture

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Future tenant/root browser surfaces may depend on authenticated sessions; this packet preserves root and tenant session separation. | Browser route work must classify root versus tenant session transport. | yes |
| csp-assets | no | No served assets or browser UI in this packet. | Future UI must use existing browser security posture. | no |
| privileged-helper | no | No local helper or privileged browser helper changes. | not applicable | no |
| csrf-mutation | yes | Future browser-callable tenant/admin mutations need CSRF/trusted-origin posture. | API/UI tasks must include CSRF or same-origin protection decision. | yes |
| url-replay-state | yes | Tenant context must not be silently inferred or granted from URLs; replay links cannot act as authority. | Future UI/API tasks must preserve explicit tenant switching. | yes |
| sensitive-rendering | yes | Future denial, audit, support, and export views may render sensitive access data. | Future UI must define redaction and actor-specific visibility. | yes |
| asset-delivery | no | No user-managed asset upload/read change in this packet. | not applicable | no |

## Artifact Obligations

| Artifact | Required Action | Owner Layer | Blocks Handoff | Notes |
| --- | --- | --- | --- | --- |
| Product Discovery packet | prove-current | Layer 1 | yes | Source packet is `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`. |
| Technical Steering packet | create | Layer 2 | yes | This file. |
| ADR | create | Layer 2/3 | yes | ADR-0016 already exists, but this layered model and lifecycle/grant-source posture likely need a new ADR or explicit ADR-0016 refinement. |
| Auth and authorization guide | update | Layer 3/4 | yes | Durable guide must reflect approved layered model after steering approval. |
| Tenant lifecycle docs/data dictionary/API contract | update | Layer 3/4 | yes | Product lifecycle meanings exceed current status wording. |
| Permission mappings | update | Layer 3/4 | yes | Required when new root support/emergency or tenant authz capabilities are specified. |
| API contract docs | create | Layer 3/4 | yes | Required before route/auth behavior changes. |
| Capability matrix | create | Layer 3 | yes | Required before implementation planning. |
| PRD-derived test cases | create | Layer 3 | yes | Must cover allow/deny and lifecycle/access permutations. |
| Implementation blueprint | create | Layer 3 | yes | Required before implementation tasks. |
| Data dictionary | update | Layer 4 | yes | Required for new durable authz/audit/lifecycle/job records. |
| Feature manifests and dependency graph | update | Layer 4 | yes | Required only once feature/public seams change. |
| Design-system artifacts | defer-approved | Future UI layer | no | Required before tenant/admin UI implementation. |

## Deterministic Signal Checks

| Trigger ID | Trigger Question | Trigger Status | Evidence | Required Classification | Required Layer 4 Task Type | Exception / Decision |
| --- | --- | --- | --- | --- | --- | --- |
| TSIG-PLATFORM-SEAM | Does the change touch shared router, middleware, session/auth platform, job/scheduler, scripts, harness, generated-artifact tooling, or other shared runtime machinery? | yes | Authz evaluator, tenant context, root compatibility, job authority, and lifecycle gates are platform seams. | platform-seam | DEV:platform-seam | Approved as architecture foundation; runtime implementation deferred. |
| TSIG-API-CONTRACT | Does the change add or alter route contract, request/response shape, status codes, validation, pagination, sorting, or API auth behavior? | yes | Distinct denial categories and tenant selection behavior are required. | feature-public-seam | DOC:api-contract | Shared denial contract is now defined in `docs/api-contracts/platform-authorization-denials.md`; route-family adoption remains future work. |
| TSIG-PERSISTENCE | Does the change alter schema, indexes, query semantics, normalization, uniqueness, lifecycle fields, soft delete, migrations, or persistence harness behavior? | yes | Roles/grants/audit/support reason/lifecycle/retention/job attribution likely need persistence. | architecture-foundation-required | DEV:migration-persistence | No schema changes in this packet. |
| TSIG-PERMISSION | Does the change add or alter authz capability keys, grants, deny rules, tenant context, object-level permissions, or protected route access? | yes | Introduces tenant role model, root support/emergency posture, and grant-source rules. | architecture-foundation-required | DOC:permission-mapping | Implementation must not proceed without permission mapping. |
| TSIG-GOVERNED-FRONTEND | Does the change add or alter governed app UI, shell chrome, navigation, drawers, dialogs, reusable controls, page chrome, app-page CSS, or design-system-owned behavior? | no | UI deferred. | design-system-seam | GOV:design-system | Future UI must re-enter DS loop. |
| TSIG-FRONTEND-SURFACE | Does the change add or alter a rendered DEV:frontend surface, browser workflow, DEV:frontend route, or served asset behavior? | no | No frontend implementation in this packet. | design-system-seam | DEV:frontend | Future surfaces blocked on DS/frontend steering. |
| TSIG-SHARED-CODE | Does the change reuse, move, extract, or generalize logic across features or into src/lib? | yes | Central evaluator and reason-code mapping are shared-code candidates. | shared-lib-candidate | DECISION:refactor-first | Use the explicit evaluator seam below; do not scatter feature-local policy logic. |
| TSIG-DATA-DICTIONARY | Does the change alter durable entity facts, fields, lifecycle, retention, searchable storage, indexes, or source-independent persistence truth? | yes | Tenant lifecycle and future authz/audit records need data dictionaries. | architecture-foundation-required | DOC:data-dictionary | Required once implementation artifacts are created. |
| TSIG-QA-RUNTIME | Does the change require runtime/browser/live-data/mock-honesty evidence or change QA release-gate posture? | yes | Authz must prove allow and deny behavior across root/tenant/lifecycle/config/RBAC/future object boundaries. | feature-public-seam | EVIDENCE:qa-evidence | Test cases required before delivery. |
| TSIG-DOCS-ARTIFACT | Does the change alter source-independent docs, maintained artifacts, standards snapshots, reconstruction docs, bootstrap docs, or template/skill contracts? | yes | Authz guide, ADR, permission mappings, API contracts, tenant lifecycle docs. | architecture-foundation-required | DOC:docs-artifact | Maintained-artifact sweep required after implementation planning/changes. |

## Steering Decisions

| Decision ID | Decision | Rationale | Compatibility / Migration Strategy | Downstream Owner |
| --- | --- | --- | --- | --- |
| DEC-AUTHZ-001 | Adopt a layered authorization evaluation model: tenant boundary/lifecycle, feature/config/entitlement gate, RBAC, ABAC, ReBAC/object rules, audit/proof. | This matches the product need for simple v1 plus future policy depth without scattering logic. | Additive architecture posture. Current root authz remains distinct. | ADR / Authz Guide |
| DEC-AUTHZ-002 | Preserve root and tenant authority worlds as separate. | Root users are platform operators; tenant roles never imply root powers. | Existing root capability enforcement remains current. Tenant authz is added beside it, not by replacing it. | Technical Steering / ADR |
| DEC-AUTHZ-003 | v1 tenant role is globally consistent `adminOwner`. | Keeps first implementation simple and avoids role-template versioning complexity. | No tenant-specific role divergence until role-template upgrade policy exists. | PRD / Capability Matrix |
| DEC-AUTHZ-004 | Root owns tenant branding, tenant admin management, pricing, tiers, limits, and entitlements. | These are platform/commercial/setup powers. | Existing root-admin/root capability patterns should be extended explicitly. | Permission Mapping |
| DEC-AUTHZ-005 | `adminOwner` owns day-to-day tenant account operation within root-approved availability. | Tenant admins should manage their account without root involvement for routine work. | Tenant activation cannot exceed root-defined availability. | PRD / API Contract |
| DEC-AUTHZ-006 | Support access is root-scoped read-only access with reason/reference and internal audit. | Helps customers while avoiding tenant impersonation and unauthorized tenant mutation. | Root support activity is internal-only for v1; customer-visible access history deferred. | Security Audit / Permission Mapping |
| DEC-AUTHZ-007 | `rootAdmin` emergency powers are allowed with reason/reference and high-severity audit; formal review workflow is deferred. | Root admins need emergency powers, but v1 should not build a full review queue. | Emergency actions must be reviewable from audit history later. | Security Audit / Root Admin Capabilities |
| DEC-AUTHZ-008 | UI eligibility requires runtime-backed implemented capabilities. | Prevents docs-only or planned grants from appearing as usable product options. | Capability catalog/permission mapping must carry source posture before UI exposure. | Capability Catalog / Permission Mapping |
| DEC-AUTHZ-009 | Tenant lifecycle and deletion posture must govern access and processing. | ADR-0037 separates operational lifecycle from deletion posture so access, recovery, jobs, billing, and purge behavior are not overloaded into one enum. | Current tenant status/deleted_at representation must be reconciled before lifecycle-sensitive implementation. | Tenants / Data Lifecycle Architecture |
| DEC-AUTHZ-010 | Background jobs use explicit system authority and preserve initiator, tenant context, reason/policy source, and authz proof where applicable. | "System did it" without attribution is not enough for audit or support. | Align future work with job processing foundation and audit model. | Job Processing / Audit Architecture |
| DEC-AUTHZ-011 | ABAC and ReBAC are approved extension layers, not v1 implementation requirements. | Future needs are known, but final catalog/relationship graph should follow concrete feature needs. | Feature-specific future work must define attribute sources and relationship resolvers before use. | Future Feature Steering |
| DEC-AUTHZ-012 | Use the shared platform authorization denial API contract for future protected route families. | Product requires helpful-but-safe user experience, and route families need deterministic HTTP/status/reason mapping before implementation. | Existing route-family codes remain backwards-compatible until explicitly migrated. New authz-sensitive route work must consume `docs/api-contracts/platform-authorization-denials.md`. | API Contract Maintainer |
| DEC-AUTHZ-013 | Adopt an explicit central authorization evaluator seam with feature-owned fact resolvers. | The platform needs one ordered decision path without forcing every feature fact into a broad generic policy engine. | Additive seam. Existing root capability middleware remains compatible and should migrate only through adapter-backed stories with public behavior tests. | Authz Architecture |
| DEC-AUTHZ-014 | Adopt an authz-specific audit/event taxonomy now, while deferring a full platform observability and alerting architecture. | Current audit is useful but ad hoc across auth, platform security, and feature-local audit sinks. Authz work needs durable evidence before the broader monitoring platform exists. | Taxonomy is additive. Existing audit sinks remain valid until storage migration is approved. Future implementation may route events to a more formal platform audit/event layer. | Audit / Observability Architecture |
| DEC-AUTHZ-015 | Expand existing permission mapping artifacts instead of creating a parallel permission-catalog home. | The repo already has architecture permission mappings and a capability contract catalog foundation. The authz model needs richer schema and target families, not a duplicate source of truth. | Existing current rows and CSV exports remain baseline truth. New architecture-target rows are documentation-only until Layer 3/4 implementation and catalog materialization. | Permission Mapping / Capability Catalog |

## Layered Evaluation Envelope

The approved architecture envelope is:

1. **Authentication/session context**
   Establish root or tenant actor identity. Authentication does not grant
   tenant authorization by itself.
2. **Tenant boundary and lifecycle**
   Tenant-scoped requests evaluate in exactly one validated current tenant
   context. Tenant lifecycle can deny or restrict access before feature policy.
3. **Feature/configuration/entitlement gate**
   Root-defined plan, entitlement, approval, and feature availability determine
   whether the feature/action can exist for the tenant. Tenant admins may only
   activate available options.
4. **RBAC**
   v1 uses globally consistent `adminOwner`. Future roles remain root-defined
   templates unless a later versioning/upgrade policy changes that.
5. **ABAC extension**
   Future attributes may include company, department, team, location, shift,
   job title, clearance, skillset, plan, and flags. Each future attribute must
   declare source of truth before use.
6. **ReBAC/object rule extension**
   Future relationship families include owner/editor/viewer, member/manager,
   and team/department. Relationship resolution should happen behind the
   central evaluator through feature-owned resolvers.
7. **Audit/proof and safe denial**
   Decisions should produce durable proof where appropriate and stable internal
   reason codes that can map to safe user-facing messages.

## Central Evaluator Seam

The central evaluator is the shared decision seam for future authorization
work. It owns evaluation order, root/tenant authority separation, denial
normalization, and decision proof. It must not become a broad feature data
access layer.

### Responsibility Boundary

| Concern | Evaluator owns | Feature / platform resolver owns |
| --- | --- | --- |
| Evaluation order | Apply the ADR-0036 layer order deterministically. | N/A |
| Authentication state | Consume an already-established actor/session shape. | Root and tenant session middleware establish actor identity. |
| Root versus tenant world | Require the requested authority world and deny wrong-world use. | Route family declares whether it is root, tenant, shared-cross-tenant, or system/job. |
| Tenant context | Require exactly one validated current tenant context for tenant-scoped requests. | Tenant session/context resolver supplies current tenant context and available grants. |
| Lifecycle/deletion gate | Evaluate operational lifecycle and deletion posture against requested action. | Tenants feature supplies lifecycle/deletion facts through an approved seam. |
| Feature/config/entitlement gate | Normalize allow/deny outcome and proof. | Owning feature or entitlement seam supplies availability/configuration facts. |
| RBAC/capability gate | Normalize role/capability decision and grant-source posture. | Root roles, tenant role catalog, and capability catalog supply grants and source posture. |
| ABAC extension | Accept typed attribute facts and produce deny/proof when a feature opts in. | Feature-specific attribute resolver supplies approved source-of-truth facts. |
| ReBAC/object extension | Accept typed relationship/object facts and produce deny/proof when a feature opts in. | Feature-specific relationship/object resolver supplies approved facts. |
| Denial mapping | Map deny decisions to the shared API denial contract category/code posture. | Route-family API contract records any compatibility exception. |
| Audit/proof | Emit structured decision proof and audit recommendation. | Audit/event layer persists required events. |

### Conceptual Input Shape

This is a Layer 2 shape, not implementation code:

```ts
AuthorizationRequest = {
  requestId,
  occurredAt,
  actor: {
    actorType: "rootUser" | "tenantPrincipal" | "systemJob",
    actorId,
    authPrincipalId?,
    sessionId?,
  },
  authorityWorld: "root" | "tenant" | "system",
  action: {
    capabilityKey,
    operation,
    grantSourcePosture?,
  },
  tenantContext?: {
    tenantId,
    selectionState: "selected" | "selectionRequired" | "unavailable",
    operationalLifecycle?,
    deletionPosture?,
  },
  resource?: {
    resourceType,
    resourceId?,
    tenantId?,
    existenceKnownToActor?,
  },
  featureFacts?: {
    featureKey,
    availability,
    configurationState?,
    entitlementSource?,
  },
  roleFacts?: {
    roleKeys,
    capabilityGrantState,
  },
  attributeFacts?: AttributeFactSet,
  relationshipFacts?: RelationshipFactSet,
  supportOrEmergencyContext?: {
    mode: "support" | "emergency",
    reasonReference?,
    severity?,
  },
  jobContext?: {
    jobId,
    initiatingActor?,
    policySource?,
  },
};
```

Required v1 inputs are actor, authority world, action/capability, and the
route-declared scope. Tenant-scoped requests also require tenant context and
tenant lifecycle/deletion facts.

`attributeFacts` and `relationshipFacts` are typed extension points only. V1
must not build a broad generic attribute registry, relationship graph, policy
language, or tenant-managed ABAC/ReBAC UI from this seam alone.

### Conceptual Output Shape

```ts
AuthorizationDecision = {
  outcome: "allow" | "deny",
  deny?: {
    category,
    publicCode,
    httpStatus,
    internalReason,
    safeMessagePosture,
    existenceDisclosure,
  },
  proof: {
    evaluatedLayers,
    authorityWorld,
    actorType,
    tenantId?,
    capabilityKey,
    grantSourcePosture?,
    featureKey?,
    resourceType?,
    resourceId?,
    policySources,
  },
  audit: {
    required,
    eventFamily?,
    severity?,
    reasonReferenceRequired?,
  },
};
```

Allow decisions must still produce enough proof for security tests and audit
when the route family requires it. Deny decisions must map to
`docs/api-contracts/platform-authorization-denials.md`.

### V1 Supported Runtime Layers

The first implementation planning pass may support only:

- root session/capability compatibility through an adapter around existing
  root capability checks
- tenant session and explicit tenant context validation
- tenant operational lifecycle and deletion posture gate
- feature/configuration/entitlement gate for approved v1 tenant admin actions
- globally consistent `adminOwner` tenant role
- grant source posture checks needed to prevent UI use of docs-only or blocked
  capabilities
- denial contract mapping
- audit/proof output sufficient for route-family tests

Future ABAC/ReBAC/object rules are allowed only as typed inputs and skipped
proof markers until a specific feature defines approved fact sources.

### Existing Feature Adoption

Existing root-scoped route families should not be rewritten immediately.

Adoption posture:

- preserve current `UNAUTHORIZED`, `INVALID_SESSION`, and `FORBIDDEN` behavior
  unless a route-family compatibility plan says otherwise
- wrap existing `createRequireRootCapability(...)` behavior through an
  evaluator adapter only after tests prove identical public behavior
- do not merge root capabilities and tenant roles into one grant model
- do not route current tenant-auth login/setup public flows through the
  evaluator unless a future authn/authz contract says they are protected
  authorization decisions
- require new tenant-scoped protected route families to use the evaluator from
  their first implementation slice

Frontend impact remains response-driven. UI may hide unavailable actions or
show safer recovery states using stable denial codes, but backend evaluator
decisions remain authoritative.

### Resolver Rules

Feature-owned resolvers must be narrow, read-only for authorization, and
capability-specific. They may supply facts; they must not independently return
final allow/deny decisions that bypass the evaluator.

Resolver facts must include enough source identity for proof:

- owning feature or platform seam
- fact freshness or read time when relevant
- policy source or catalog source when relevant
- tenant context used for the read
- whether object existence is safe to disclose

Cross-feature reads must go through exported public seams and update feature
manifests only when runtime implementation introduces those dependencies.

### Open Decisions Deferred

- exact TypeScript interface names and module placement
- persistence schema for durable authorization proof
- root support/emergency capability keys
- tenant role/grant storage and permission mapping rows
- cache strategy for grants, entitlements, attributes, relationships, and object
  facts
- exact migration path for current root middleware

## Audit/Event Taxonomy

This taxonomy defines authorization-relevant audit and event expectations. It
does not create a complete logging, monitoring, alerting, tracing, dashboard, or
incident-response architecture.

Current posture:

- auth-focused durable audit exists through `auth_audit_events`
- `PlatformSecurityRepository.createSecurityAuditEvent(...)` currently writes
  security-visible events into `auth_audit_events`
- several features also maintain feature-local audit events for successful
  business mutations
- the architecture map classifies persistent auditing as `partial`
- the architecture map classifies the broader observability platform as
  `missing`

The authorization model should therefore use the existing audit sinks where
appropriate, but must not pretend those sinks are the final platform audit,
alerting, or monitoring architecture.

### Taxonomy Principles

- Audit records are durable evidence, not ordinary logs.
- Audit events must be append-only unless a later correction model is explicitly
  approved.
- Security-sensitive proof may be more detailed internally than anything
  returned to API callers or rendered to users.
- Audit payloads must not store raw passwords, bearer tokens, SSH signatures,
  secrets, raw payment credentials, or hidden policy internals.
- Customer-visible history and root/operator-only audit truth are separate
  visibility decisions.
- The evaluator may recommend audit, but the owning route/action or audit layer
  owns durable persistence.
- Alerting is not the same as audit. This taxonomy may mark alert candidates,
  but actual alert routing, paging, dashboarding, and monitoring thresholds
  remain deferred to observability architecture.

### Event Families

| Event Family | Purpose | Current/Future Sink Posture | Required For V1 Authz? |
| --- | --- | --- | --- |
| `AuthorizationDecisionEvent` | Durable proof for allow/deny decisions when the route/action declares audit sensitivity. | Future platform audit/authz sink; may initially use existing security audit sink for denials. | yes for sensitive denials and privileged allows |
| `AuthorizationDenialEvent` | Failed authz decisions such as missing capability, cross-tenant deny, lifecycle deny, feature unavailable, object deny, or sensitive fallback. | Existing root denials currently use `root_capability_denied`; future taxonomy should normalize. | yes |
| `RootSupportAccessEvent` | Root staff support viewing with reason/reference, tenant context, and read-only posture. | Future platform audit/authz sink. | yes before support runtime work |
| `RootEmergencyActionEvent` | Emergency root actions, including reason/reference, severity, capability, and affected tenant/resource. | Future high-severity audit sink and future alert candidate. | yes before emergency runtime work |
| `GrantChangeEvent` | Role, capability, entitlement, source-posture, or grant assignment changes. | Existing root role audit and future tenant authz audit sinks. | yes before grant-management runtime work |
| `GrantSourcePostureEvent` | Docs-only, seed-backed, corrective-migration-backed, runtime-enforced, or blocked posture changes. | Capability catalog / permission mapping audit future sink. | yes before grant UI/catalog runtime work |
| `TenantLifecycleAuthzEvent` | Authorization-relevant lifecycle/deletion posture effects, including inactive/deletion deny decisions. | Future tenants lifecycle/audit sink linked to ADR-0037 events. | yes before lifecycle-sensitive tenant authz work |
| `TenantContextEvent` | Tenant selection, tenant context unavailable, revoked grant context, or explicit tenant switch. | Existing tenant auth security audit has some selection events; future normalized sink needed. | yes for tenant authz |
| `ObjectAccessDecisionEvent` | Object/entity-level allow/deny for resources where object access is audit-sensitive. | Feature-owned audit plus future evaluator proof. | future |
| `AttributePolicyDecisionEvent` | ABAC decisions where attribute source, freshness, or override matters. | Future feature-owned attribute resolver proof. | future |
| `RelationshipPolicyDecisionEvent` | ReBAC decisions where relationship resolver source or object existence posture matters. | Future feature-owned relationship resolver proof. | future |
| `SystemJobAuthorityEvent` | Job execution using system authority while preserving initiating actor, tenant context, policy source, and authorization proof. | Job processing audit/event sink future extension. | yes before job-based authz work |
| `AuditPolicyExceptionEvent` | Explicit approved exception where a route does not persist an otherwise expected audit record. | Future platform audit governance sink. | future |

### Required Common Fields

Every authorization-relevant durable audit event should define:

| Field | Requirement |
| --- | --- |
| `eventId` | Stable unique event identifier. |
| `eventFamily` | One of the taxonomy families above. |
| `eventType` | Specific event type within the family. |
| `eventOutcome` | `success`, `failure`, or `notApplicable` only when a non-decision lifecycle event needs it. Existing sinks may stay `success/failure` until migrated. |
| `occurredAt` | Server-side event time in UTC. |
| `actorType` | `rootUser`, `tenantPrincipal`, `systemJob`, or `anonymous` where identity is unresolved. |
| `actorId` | Actor identifier when known. |
| `authPrincipalId` | Auth principal when known and applicable. |
| `sessionId` | Session identifier or redacted/session reference when safe and approved. Raw bearer tokens must not be stored. |
| `authorityWorld` | `root`, `tenant`, or `system`. |
| `tenantId` | Required for tenant-scoped decisions when known. |
| `capabilityKey` | Required when a capability governs the action. |
| `operation` | Human- and test-readable operation/action key. |
| `resourceType` | Required for object/entity-level decisions. |
| `resourceId` | Required when safe and applicable; may be omitted/redacted for sensitive fallback denials. |
| `decision` | `allow`, `deny`, `requested`, `started`, `completed`, `failed`, or route-specific bounded value. |
| `reasonCode` | Stable internal reason code. |
| `reasonReference` | Required for support and emergency actions; optional elsewhere. |
| `policySource` | Source of the policy, lifecycle, entitlement, resolver, or catalog decision. |
| `grantSourcePosture` | Required when grant posture affects the decision. |
| `requestId` | Request correlation identifier when available. |
| `jobId` | Required for job authority events. |
| `initiatingActor` | Required when a job acts later on behalf of a prior actor or policy. |
| `ipAddress` | Request IP when request-bound and available. |
| `userAgent` | Request user agent when request-bound and available. |
| `visibilityClass` | `rootOnly`, `tenantAdminVisible`, `customerSafeSummary`, or `internalSecurityOnly`. |
| `severity` | `info`, `notice`, `warning`, `high`, or `critical`. |

### Severity Guidance

| Severity | Use For | Alert Candidate |
| --- | --- | --- |
| `info` | Normal allowed reads, routine tenant selection, normal feature availability decisions where audit is required. | no |
| `notice` | Successful privileged changes, grant changes, lifecycle-relevant allows, support access start/end. | maybe |
| `warning` | Missing capability, feature unavailable, tenant context unavailable, lifecycle restricted, grant-source blocked. | maybe |
| `high` | Cross-tenant denial, support access denial/reference failure, emergency action attempt, object deny on sensitive resource. | yes |
| `critical` | Successful emergency action, repeated cross-tenant attempts, active investigation/legal/fraud bypass attempt, purge/delete policy violation attempt. | yes |

Alert candidates are labels only until a platform observability/alerting
architecture defines routing, thresholds, suppression, escalation, ownership,
and on-call behavior.

### Audit Requirement Matrix

| Scenario | Durable Audit Required | Visibility Class | Notes |
| --- | --- | --- | --- |
| Missing authentication on ordinary protected route | route-specific | `internalSecurityOnly` | May be telemetry-only unless route is sensitive. |
| Invalid/expired session | route-specific | `internalSecurityOnly` | Current auth audit may cover some session failures. |
| Root capability denied | yes | `internalSecurityOnly` | Existing behavior uses `root_capability_denied`. |
| Tenant `adminOwner` capability denied | yes | `internalSecurityOnly` or `tenantAdminVisible` when safe | Must not reveal hidden policy internals. |
| Cross-tenant denied | yes | `internalSecurityOnly` | Default response should avoid existence disclosure. |
| Tenant lifecycle/deletion deny | yes for protected mutations; route-specific for reads | root-only/internal unless customer-safe message approved | Must separate customer availability from legal/security/deletion truth. |
| Feature/config/entitlement unavailable | route-specific | `tenantAdminVisible` when safe | Proof should record entitlement/config source internally. |
| Grant source blocked or not runtime-enforced | yes for admin/UI workflows | `internalSecurityOnly` | Prevents planned permissions from becoming usable. |
| Support view allowed | yes | `internalSecurityOnly` in v1 | Requires reason/reference; customer-visible support history deferred. |
| Support view denied or missing reference | yes | `internalSecurityOnly` | High-sensitivity operator event. |
| Emergency action allowed | yes | `internalSecurityOnly` | High or critical severity; formal review workflow deferred. |
| Emergency action denied or missing reference | yes | `internalSecurityOnly` | High-severity event. |
| Grant/role/capability assignment change | yes | root-only/internal; tenant-visible only when later approved | Includes before/after or bounded change summary. |
| Job executes with system authority | yes | root-only/internal unless tenant-visible job history approved | Must preserve initiating actor and policy source. |
| Object/relationship/attribute deny | feature-specific, yes for sensitive resources | depends on feature | Resolver proof must not leak sensitive facts to caller. |

### Customer-Visible Versus Root-Only

Root/operator-only audit truth includes:

- support staff identity and internal support reference
- emergency powers, severity, and reviewability details
- legal hold, fraud risk, security review, investigation, and deletion blockers
- cross-tenant denial proof
- internal policy source and grant-source posture
- hidden object existence, attribute facts, relationship facts, and resolver
  internals

Tenant/customer-safe history may later include:

- service availability changes
- tenant-admin-visible configuration changes
- tenant-admin-visible export and billing-related activity
- safe support ticket references if a later product decision approves them

V1 decision: root support activity remains internally audit-visible only.

### Storage And Migration Posture

This taxonomy does not require an immediate storage migration.

Implementation planning must choose one of these postures for each slice:

- `existing-auth-audit-sink`
  Use `auth_audit_events`/platform security audit for compatibility, usually
  for root capability denial and security-visible authz failures.
- `feature-local-audit-sink`
  Use an owning feature's durable audit table for feature business mutations
  and feature-owned object decisions.
- `new-platform-authz-audit-sink`
  Create a dedicated platform authorization audit/proof store when the slice
  needs fields not supported by current sinks.
- `deferred-with-explicit-exception`
  Temporarily defer durable audit only when Layer 2/3 explicitly approves the
  exception and records compensating evidence.

Do not silently overload `auth_audit_events` with fields it cannot represent.
If an event needs tenant context, resource IDs, policy source, grant posture,
job attribution, visibility class, or severity beyond the current sink's
fields, implementation must either add an approved storage model or persist a
bounded feature-local proof record.

### Monitoring And Alerting Boundary

The taxonomy may identify `alertCandidate = yes`, but it does not define:

- log aggregation
- metrics names
- traces/spans
- dashboards
- alert thresholds
- notification routing
- paging/on-call ownership
- incident response workflow

Those belong to a future observability/alerting architecture. Until then,
critical authz events must at least be durably auditable and queryable by root
operators through approved internal tooling or support processes.

## Tenant Lifecycle Steering

| Lifecycle / Deletion Posture | Product Meaning | Access Decision | Technical Steering Decision |
| --- | --- | --- | --- |
| `draft` lifecycle | Tenant exists but is under strict rate and usage limits. | Tenant admin access may be allowed under draft limits. | Operational lifecycle value from ADR-0037. |
| `live` lifecycle | Tenant is active and billed; limits tied to plan. | Normal tenant operation allowed within entitlement/config/RBAC. | Operational lifecycle value from ADR-0037. |
| `disabled` lifecycle | Read access is fine; normal writes/use restricted. | Tenant admins can read/export data and logs; writes/new use restricted. | Operational lifecycle value from ADR-0037; maintenance jobs may continue. |
| `inactive` lifecycle | Normal login is blocked. | Recovery path exists based on explicit inactive reason. | Operational lifecycle value from ADR-0037; requires reason fields. |
| `active` deletion posture | Tenant exists for normal product purposes. | Access governed by lifecycle/config/authz. | Deletion posture from ADR-0037. |
| `softDeleted` deletion posture | Tenant cannot log in and normal tenant data is hidden. | Root-only recovery/reactivation if policy allows; tenant export is root-mediated. | Deletion posture from ADR-0037. |
| `hardDeletePending` deletion posture | Tenant is approved or queued for purge after gates. | No normal access; root metadata only; purge workflow jobs only. | Deletion posture from ADR-0037. |
| `hardDeleted` deletion posture | Tenant-specific data removed from system. | Tombstone/retained evidence only; no normal recovery. | Deletion posture from ADR-0037. |

## Grant Source Posture

| Grant Source Posture | Meaning | UI Eligibility | Required Proof |
| --- | --- | --- | --- |
| `documentation-only` | Planned or documented only. | Not selectable or usable. | Source doc reference only. |
| `seed-backed` | Seeded into durable catalog/grants. | Not enough by itself. | Seed/migration evidence plus runtime enforcement proof. |
| `corrective-migration-backed` | Added or repaired through corrective migration. | Eligible only after migration and runtime enforcement proof. | Corrective migration evidence plus audit/verification. |
| `runtime-enforced` | Code enforces the capability in the active request path. | Eligible when durable source and enforcement both exist. | Tests for allow/deny and mapped backend routes. |
| `blocked` | Must not be granted or used. | Not selectable or usable. | Block reason and owner. |

## API Authn/Authz Contract Direction

The approved shared denial contract is:

- `docs/api-contracts/platform-authorization-denials.md`

Future route-family contracts must either consume that contract directly or
record an explicit compatibility exception.

Approved product-level denial categories:

- unauthenticated
- tenant selection not complete
- tenant context invalid or unavailable
- tenant lifecycle restricted
- feature/config/entitlement unavailable
- tenant activation/config missing
- role/capability missing
- object/relationship rule denied
- attribute rule denied
- sensitive/generic fallback denial

Internal reason codes should be more precise than user-facing messages. User
messages should help recovery when safe and avoid disclosing hidden records,
cross-tenant existence, security internals, or platform detection methods.

The shared contract preserves the current `{ code, message, details? }` JSON
error shape. Existing root and tenant route families should not be silently
migrated; new or materially changed authz-sensitive route families must define
their adoption of the shared contract in their route-family API docs.

## Blockers

| Blocker ID | Blocks | Blocker Type | Required Output | Owner |
| --- | --- | --- | --- | --- |
| BLK-AUTHZ-001 | Story Breakdown / PRD promotion | architecture decision | ADR-0036 and auth guide refinement created; maintainer acceptance status remains separate from runtime implementation readiness. | Architecture owner |
| BLK-AUTHZ-002 | Route/API implementation | API contract adoption | Shared denial contract exists; each implementing route family must adopt it or record a compatibility exception before runtime work. | API owner |
| BLK-AUTHZ-003 | Lifecycle-sensitive implementation | architecture/data contract | ADR-0037 created; implementation still must reconcile current tenant status/deleted_at storage with lifecycle/deletion posture and events. | Tenants owner |
| BLK-AUTHZ-004 | Runtime authorization implementation | implementation blueprint | Central evaluator seam is defined; runtime work still needs exact TypeScript module placement, interfaces, adapters, persistence/audit decisions, and test plan. | Authz architecture owner |
| BLK-AUTHZ-005 | Support/emergency implementation | audit/data contract | Audit taxonomy exists; implementation still needs concrete storage, retention, visibility surfaces, and reviewability workflow decisions. | Security/audit owner |
| BLK-AUTHZ-006 | Grant UI/catalog implementation | catalog/permission contract | Define grant source posture in capability catalog/permission mapping artifacts. | Capability catalog owner |
| BLK-AUTHZ-007 | Job-based authz work | platform seam | Define job authority and initiator attribution contract. | Job processing owner |
| BLK-AUTHZ-008 | Hard delete / inactive lifecycle work | data lifecycle policy | ADR-0037 defines gates and reason-code shape; implementation still needs exact retention values, legal-hold storage, inactive reason fields, and recovery/export windows. | Data lifecycle owner |

## Layer 3 Handoff

| Story Scope Element | Handoff Status | Required Classification IDs | Notes |
| --- | --- | --- | --- |
| ADR/authz guide refinement | ready-for-story-breakdown | TS-AUTHZ-001, TS-AUTHZ-003, TS-AUTHZ-004 | ADR-0036 and auth guide refinement now exist; downstream planning can consume the architecture envelope after maintainer review. |
| Tenant lifecycle architecture | ready-for-story-breakdown | TS-AUTHZ-002, TS-AUTHZ-011 | ADR-0037 now defines separated lifecycle/deletion posture; implementation planning still needs compatibility and storage details. |
| Central evaluator design | ready-for-story-breakdown | TS-AUTHZ-001, TS-AUTHZ-002, TS-AUTHZ-004, TS-AUTHZ-006, TS-AUTHZ-007, TS-AUTHZ-015 | Seam responsibilities, conceptual inputs/outputs, resolver rules, and adoption posture are defined; implementation details remain downstream. |
| v1 `adminOwner` PRD/capability matrix | ready-for-story-breakdown | TS-AUTHZ-005, TS-AUTHZ-008, TS-AUTHZ-009 | API denial and lifecycle architecture now exist; story breakdown must still include permission mapping, audit, and route-family adoption work. |
| Root support/emergency posture | ready-for-story-breakdown | TS-AUTHZ-003, TS-AUTHZ-010, TS-AUTHZ-013 | Audit taxonomy exists; story breakdown must still include permission mapping, storage, retention, and reviewability decisions. |
| Grant source/capability catalog posture | ready-for-story-breakdown | TS-AUTHZ-008 | Existing permission mapping artifacts now define expanded source-posture schema and architecture-target families; catalog materialization update remains downstream. |
| Job authority/audit propagation | ready-for-story-breakdown | TS-AUTHZ-012 | Audit taxonomy covers job authority events; implementation planning still needs job payload/proof storage details. |
| Future ABAC/ReBAC work | blocked | TS-AUTHZ-006, TS-AUTHZ-007 | Approved extension layers; future implementation requires feature-specific discovery and steering. |
| Future UI/reporting surfaces | blocked | TS-AUTHZ-014 | Requires separate frontend/design-system steering. |

## Technical Steering Handoff Summary

- Recommended next artifact: v1 `adminOwner` story breakdown.
- Secondary next artifacts:
  - define concrete audit storage/data dictionary for the first authz slice
  - plan capability catalog materialization support for expanded source posture
- Runtime implementation readiness: `blocked-on-architecture`
- Story Breakdown readiness: `partial-plus`
- Do not begin runtime authorization implementation from this packet alone.
