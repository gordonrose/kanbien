# Story Breakdown: Platform Authorization `adminOwner` V1

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-05-05
- Epic ID:
  `EPIC-PLATFORM-AUTHZ-ADMIN-OWNER-V1`
- Epic title:
  Platform authorization `adminOwner` v1 foundation
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- Related PRD:
  `docs/prd/2026-05-05-0023-platform-authorization-admin-owner-v1.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft.csv`
- Related GOV:design-system, asset, ADR, or architecture artifacts:
  `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`;
  `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`;
  `docs/api-contracts/platform-authorization-denials.md`;
  `docs/architecture/guides/auth-and-authorization-guide.md`;
  `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`;
  `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-05-05-platform-authorization-admin-owner-story-breakdown.md`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `partial-plus`
- Steering non-goals preserved:
  no runtime authorization changes, no tenant-created custom roles, no
  tenant-specific `adminOwner` divergence, no tenant self-service tenant-admin
  management, no root impersonation, no broad ABAC/ReBAC runtime, no broad
  observability/alerting platform, no frontend implementation in this packet
- Steering stop conditions resolved or carried as blockers:
  Layer 2 has approved layered evaluation, tenant lifecycle/deletion posture,
  API denial contract, evaluator seam, audit/event taxonomy, and expanded
  permission mapping source posture. PRD, capability matrix, and a
  pre-Task-Breakdown implementation blueprint now exist. Runtime work remains
  blocked on API route-family adoption, data dictionary, audit storage, and
  task breakdown.
- Architecture invention check:
  `consumes-steering-only`
- Governed DEV:frontend seam posture:
  `not-applicable`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  permission-sensitive tenant work; root/tenant boundary protection;
  cross-tenant deny; lifecycle/deletion deny; audit/proof storage; migration
  compatibility for tenant status/deleted_at; route-family denial behavior;
  UI eligibility only after runtime enforcement
- Missing source-of-truth artifacts:
  API contract updates for first route families, data dictionary for tenant
  authz grants/proof/audit if new storage is introduced, capability catalog
  materialization update for expanded source posture

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| TS-AUTHZ-001 | Platform authorization evaluation pipeline | architecture-foundation-required | shared authz architecture / future evaluator seam | approved | DECISION:architecture-foundation |
| TS-AUTHZ-002 | Tenant boundary and lifecycle gate | platform-seam | tenant session/context plus tenant lifecycle resolution | approved | DEV:platform-seam |
| TS-AUTHZ-003 | Root authorization compatibility boundary | platform-seam | existing rootRoles/rootAuth/root capability enforcement | approved | DOC:permission-mapping |
| TS-AUTHZ-004 | Feature/configuration/entitlement gate | architecture-foundation-required | tenant configuration / plan entitlement / feature flag architecture | approved | DECISION:architecture-foundation |
| TS-AUTHZ-005 | v1 tenant role model | architecture-foundation-required | future tenant authz role catalog | approved | DOC:permission-mapping |
| TS-AUTHZ-008 | Grant source posture and UI eligibility | architecture-foundation-required | capability catalog / permission mapping / runtime enforcement proof | approved | DOC:permission-mapping |
| TS-AUTHZ-009 | API denial and proof contract | feature-public-seam | API/authz contract docs | approved | DOC:api-contract |
| TS-AUTHZ-010 | Audit and evidence model | architecture-foundation-required | security audit / authz audit / job audit seams | approved | DOC:data-dictionary |
| TS-AUTHZ-011 | Tenant lifecycle representation | architecture-foundation-required | tenants feature and data lifecycle architecture | approved | DECISION:architecture-foundation |
| TS-AUTHZ-012 | System/job actor authority | platform-seam | job processing / async execution / audit propagation | approved | DEV:platform-seam |
| TS-AUTHZ-015 | Shared evaluator and reason-code mapping pressure | shared-lib-candidate | central authz evaluator first; shared lib only after stable consumers | approved | DECISION:refactor-first |
| TS-AUTHZ-016 | Authorization QA evidence model | feature-public-seam | PRD-derived authz test expectations | approved | EVIDENCE:qa-evidence |
| TS-AUTHZ-017 | Authz persistence and migration impact | architecture-foundation-required | future authz/audit/lifecycle persistence | approved | DEV:migration-persistence |
| TS-AUTHZ-018 | Source-independent docs sweep | architecture-foundation-required | ADRs, guides, contracts, mappings, lifecycle docs | approved | DOC:docs-artifact |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Platform authz architecture envelope | not-applicable | platform authorization | policy foundation | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not applicable | not applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | ready | Story breakdown does not implement rendered UI. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| session-cookie | yes | Future tenant/root browser surfaces may depend on authenticated sessions; root and tenant session separation is preserved. | Browser route work must classify root versus tenant session transport. | yes |
| csrf-mutation | yes | Future browser-callable tenant/admin mutations need CSRF/trusted-origin posture. | API/UI tasks must include CSRF or same-origin protection decision. | yes |
| url-replay-state | yes | Tenant context must not be silently inferred or granted from URLs; replay links cannot act as authority. | Future UI/API tasks must preserve explicit tenant switching. | yes |
| sensitive-rendering | yes | Future denial, audit, support, and export views may render sensitive access data. | Future UI must define redaction and actor-specific visibility. | yes |
| csp-assets | no | No served assets or browser UI in this story packet. | not applicable | no |
| privileged-helper | no | No local helper or privileged browser helper changes. | not applicable | no |
| asset-delivery | no | No user-managed asset upload/read change in this story packet. | not applicable | no |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | Capability matrix normalization | yes | No v1 `adminOwner` capability matrix exists. | DOC:docs-artifact |
| S-001 | PRD refinement | yes | Product Discovery and Technical Steering exist, but PRD does not. | DOC:docs-artifact |
| S-002 | API contract adoption | yes | Shared denial contract exists; route families must adopt it. | DOC:api-contract |
| S-003 | Persistence/migration | yes | Tenant role/grant/proof storage and lifecycle compatibility are not specified. | DEV:migration-persistence |
| S-004 | Platform seam | yes | Central evaluator seam is approved but not implemented. | DEV:platform-seam |
| S-005 | Permission mapping | yes | Expanded mapping exists; detailed capability rows are missing. | DOC:permission-mapping |
| S-006 | Tenant lifecycle/data dictionary | yes | ADR-0037 exists; exact storage/data dictionary are missing. | DOC:data-dictionary |
| S-007 | Audit/proof | yes | Audit taxonomy exists; concrete storage and events are missing. | DOC:data-dictionary |
| S-008 | QA evidence | yes | Allow/deny/cross-tenant/lifecycle/security/audit tests are required. | EVIDENCE:qa-evidence |
| S-009 | Docs artifact sweep | yes | Source-independent docs changed and downstream artifacts must stay aligned. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Define the smallest story queue that can deliver a simple v1 tenant
  `adminOwner` authorization foundation while preserving root/tenant separation
  and future ABAC/ReBAC extension paths.
- Epic outcome:
  Later Task Breakdown can implement tenant-scoped admin authorization from
  explicit PRD, capability rows, API contracts, storage decisions, audit proof,
  and test obligations rather than broad product prose.
- Epic actors:
  `adminOwner`, `rootAdmin`, `rootSupport`, `systemJob`, API/backend owner,
  security/audit owner, tenant lifecycle owner, delivery harness
- Epic non-goals:
  tenant-created custom roles, tenant-specific role divergence, tenant
  self-service tenant-admin management, root impersonation, broad ABAC/ReBAC
  runtime, UI/admin surfaces, observability/alerting platform, runtime code
- Epic dependency summary:
  Depends on tenant auth/session foundation, current root capability
  enforcement, tenants lifecycle storage compatibility, tenant configuration
  and future entitlement seams, capability catalog/mapping artifacts, job
  processing foundation for future system authority.
- Epic-level proof target:
  `mixed`

## Story Narratives

### S-000: Capability matrix normalization

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-001: V1 `adminOwner` PRD

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-002: Route-family API denial adoption plan

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-003: Tenant role and grant storage foundation

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-004: Central evaluator v1 implementation slice

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-005: Tenant lifecycle compatibility for authz

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-006: `adminOwner` tenant account management capabilities

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-007: `adminOwner` tenant data and log export capabilities

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-008: Authorization audit/proof persistence

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

### S-009: Maintained artifact and catalog alignment

**Situation**
This part of the request needs its own plain agreement before later work is split further.

**Goal**
Reviewers can understand the expected outcome without reading internal build details.

**Decisions Needed**
The work needs agreement on the expected behavior, visible result, and stopping point for this story.

**Work That Follows**
The work will record enough detail for the next planning step to proceed without guessing.

**Evidence Of Success**
A reviewer can connect the story outcome to clear checks and know what remains outside this story.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Capability matrix normalization | This is needed to break down what the admin owner role needs to be able to do into individual capabilities, so we can plan the implementation more accurately. | As the delivery harness, I need v1 `adminOwner` stories translated into explicit capability rows so delivery cannot proceed from vague authorization scope. | harness | Capability rows cover every story acceptance criterion or record non-capability rationale. | Blocks S-003 through S-009 |
| S-001 | ready-for-task-breakdown | system-value | DOC:docs-artifact | V1 `adminOwner` PRD | This is needed to define the business meaning of the tenant admin role before splitting it into detailed work. | As product and architecture owners, we need the approved v1 tenant-admin role scope captured in PRD form before implementation planning. | product / architecture | A PRD defines v1 `adminOwner`, root-owned exclusions, lifecycle behavior, and non-goals. | Blocks S-003 through S-009 |
| S-002 | ready-for-task-breakdown | system-value | DOC:docs-artifact | Route-family API denial adoption plan | This is needed to make sure future tenant admin screens give consistent no-access answers. | As API owners, we need future tenant-admin route families to adopt the shared denial contract or record compatibility exceptions. | API owner | API contracts name status/code/reason behavior for tenant selection, lifecycle, feature, role, cross-tenant, and sensitive denials. | Depends on S-001 |
| S-003 | blocked | system-value | DEV:backend | Tenant role and grant storage foundation | This is its own story because the role should mean the same thing for every tenant and remain reviewable over time. | As the authz system, I need durable tenant role/grant truth for globally consistent `adminOwner` without tenant-specific divergence. | authz platform | `adminOwner` grants can be resolved durably and audited without mixing with root roles. | Depends on S-000, S-001 |
| S-004 | blocked | system-value | DEV:backend | Central evaluator v1 implementation slice | This is its own story because every protected tenant action should be judged by the same clear rule set. | As protected tenant routes, we need the evaluator to enforce v1 layers consistently. | backend platform | Evaluator supports tenant context, lifecycle/deletion, feature/config/entitlement, `adminOwner`, denial mapping, and proof. | Depends on S-000, S-001, S-002, S-003 |
| S-005 | blocked | system-value | DEV:backend | Tenant lifecycle compatibility for authz | This is its own story because suspended, deleted, or changing tenants need predictable access behavior before role powers expand. | As tenant-scoped authz, I need lifecycle/deletion facts available without breaking current tenant status/deleted_at behavior. | tenant lifecycle owner | Authz can deny or restrict by ADR-0037 lifecycle/deletion posture with a compatibility plan. | Depends on S-000, S-001 |
| S-006 | blocked | user-value | DEV:backend | `adminOwner` tenant account management capabilities | This is its own story because day-to-day tenant settings are the first recognizable responsibility for this role. | As an `adminOwner`, I need to manage day-to-day tenant settings only within root-approved availability. | `adminOwner` | Tenant account actions are allowed, denied, audited, and feature-gated consistently. | Depends on S-000 through S-005 |
| S-007 | blocked | user-value | DEV:backend | `adminOwner` tenant data and log export capabilities | This is its own story because exporting tenant information is more sensitive than changing settings and needs separate business review. | As an `adminOwner`, I need to export tenant-owned data/logs through approved surfaces while lifecycle and reporting-layer rules are respected. | `adminOwner` | Export actions are tenant-scoped, lifecycle-aware, audit-visible, and denied cross-tenant by default. | Depends on S-000 through S-005 |
| S-008 | blocked | system-value | DEV:backend | Authorization audit/proof persistence | This is its own story because sensitive access decisions need durable evidence that reviewers can trust later. | As security and compliance reviewers, we need durable proof for sensitive allows, denials, lifecycle restrictions, and job authority. | security/audit owner | Authz events carry actor, tenant, capability, decision, reason, policy source, visibility, and severity. | Depends on S-000, S-001, S-004 |
| S-009 | blocked | harness-value | DOC:docs-artifact | Maintained artifact and catalog alignment | This is needed to keep the written rules, examples, and tests aligned with how the role actually works. | As repo governance, I need permission mappings, capability catalog materialization, API contracts, data dictionaries, and tests to stay aligned after runtime slices land. | governance harness | No implementation slice is treated complete while downstream artifacts remain stale. | Depends on S-000 through S-008 |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | The capability matrix names every v1 `adminOwner`, root-owned, support/emergency, lifecycle, denial, audit, and blocked/deferred capability family from this packet. | contract-level | traceability review | capability matrix |
| AC-S000-02 | S-000 | Every acceptance criterion in this story packet maps to an approved capability row or records why the criterion is governance-only. | contract-level | traceability review | capability matrix |
| AC-S001-01 | S-001 | The PRD states v1 has one globally consistent tenant role named `adminOwner` and forbids tenant-specific divergence. | contract-level | product-scope review | PRD |
| AC-S001-02 | S-001 | The PRD preserves root-owned tenant branding/setup, tenant-admin management, commercial entitlement, support, and emergency controls as outside tenant authority. | contract-level | product-scope review; security review | PRD |
| AC-S001-03 | S-001 | The PRD records v1 non-goals: custom tenant roles, tenant self-service tenant-admin management, root impersonation, broad ABAC/ReBAC runtime, and tenant admin UI before implementation. | contract-level | non-goal review | PRD |
| AC-S002-01 | S-002 | Tenant-admin route-family contracts consume `platform-authorization-denials.md` for unauthenticated, tenant selection, tenant context, lifecycle, feature, role, cross-tenant, object, attribute, and sensitive fallback denial categories. | contract-level | API contract review | API contracts |
| AC-S002-02 | S-002 | Existing root and tenant-auth route-family codes remain backwards compatible unless a route-family contract records an explicit migration. | contract-level | compatibility review | API contracts |
| AC-S003-01 | S-003 | Tenant role/grant storage distinguishes tenant `adminOwner` grants from root roles and records tenant context, grant source posture, and lifecycle-safe revocation behavior. | persistence-level | persistence; security | data dictionary; migration plan |
| AC-S003-02 | S-003 | Pending invited tenant admins have no authority until accepted and setup is complete; removal or suspension revokes authority immediately while preserving historical action records. | persistence-level | integration; audit; lifecycle | PRD; data dictionary |
| AC-S004-01 | S-004 | The evaluator v1 slice enforces exactly one tenant context before tenant-scoped authorization and denies cross-tenant access by default. | runtime-api | security; integration | implementation blueprint; API contracts |
| AC-S004-02 | S-004 | The evaluator v1 slice produces allow/deny decisions with denial category, public code/status mapping, internal reason, proof, and audit recommendation. | runtime-api | unit; integration; audit | implementation blueprint; API contracts |
| AC-S004-03 | S-004 | ABAC/ReBAC/object inputs are typed extension points only and are skipped explicitly unless a feature supplies approved facts. | source-level | unit; architecture review | implementation blueprint |
| AC-S005-01 | S-005 | Tenant lifecycle/deletion facts follow ADR-0037 and do not silently overload current tenant `status` or `deleted_at`. | persistence-level | migration; compatibility | data dictionary; migration plan |
| AC-S005-02 | S-005 | Tenant-admin login/use is denied or restricted for `inactive`, `softDeleted`, `hardDeletePending`, and `hardDeleted` states according to approved lifecycle/deletion posture. | runtime-api | lifecycle; security | API contracts; PRD-derived tests |
| AC-S006-01 | S-006 | `adminOwner` can manage only tenant-owned day-to-day settings, approved flags/options, payment details, billing contacts, and usage choices within root-approved availability. | runtime-api | integration; security; audit | PRD; capability matrix; API contracts |
| AC-S006-02 | S-006 | `adminOwner` cannot manage tenant admins, root-owned branding/setup, pricing, tiers, limits, entitlements, support, emergency powers, or blocked/deferred capability families. | runtime-api | security; cross-boundary deny | PRD; permission mapping; tests |
| AC-S007-01 | S-007 | `adminOwner` data/log export is tenant-scoped, lifecycle-aware, audit-visible, and limited to approved reporting/export layers rather than raw system logs. | runtime-api | integration; security; audit | PRD; API contracts; data dictionary |
| AC-S007-02 | S-007 | Export behavior preserves the baseline that tenants can export their data while respecting root-mediated recovery/export rules for deletion posture. | contract-level | lifecycle; compatibility | PRD; API contracts |
| AC-S008-01 | S-008 | Authz audit/proof storage captures actor, authority world, tenant context, capability, decision, reason, policy source, grant source posture, request/job id, visibility class, severity, and occurredAt where required. | persistence-level | audit; security | data dictionary; migration plan |
| AC-S008-02 | S-008 | Support, emergency, cross-tenant denial, lifecycle denial, grant-source denial, sensitive object denial, and system job authority events follow the audit taxonomy. | persistence-level | audit; integration | data dictionary; PRD-derived tests |
| AC-S009-01 | S-009 | Permission mappings, capability catalog source registry/materialization, API contracts, data dictionaries, feature manifests, and generated dependency graph are updated only when runtime implementation changes their source truth. | source-level | standards review | artifact sweep |
| AC-S009-02 | S-009 | No UI or admin workflow exposes a capability as usable until the mapping/catalog posture is `runtime-enforced` and route tests prove enforcement. | mixed | security; frontend-gate when UI exists | permission mapping; capability catalog; tests |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | platform-authz.admin-owner-v1.capability-matrix | planning | create-or-refresh-required | Default control story. |
| S-000 | AC-S000-02 | platform-authz.admin-owner-v1.traceability | planning | create-or-refresh-required | Must map every AC. |
| S-001 | AC-S001-01 | admin-owner.role.global-consistency | tenant authz | create-or-refresh-required | v1 role invariant. |
| S-001 | AC-S001-02 | root-owned.tenant-controls | root authz | create-or-refresh-required | Root-owned exclusion set. |
| S-001 | AC-S001-03 | admin-owner.v1.non-goals | governance | create-or-refresh-required | Blocked/deferred families. |
| S-002 | AC-S002-01 | platform-authz.denial-contract.adoption | API | create-or-refresh-required | Route-family adoption. |
| S-002 | AC-S002-02 | platform-authz.compatibility.root-tenant-auth | API | create-or-refresh-required | Existing code preservation. |
| S-003 | AC-S003-01 | admin-owner.grant.storage | persistence | create-or-refresh-required | Tenant role/grant truth. |
| S-003 | AC-S003-02 | admin-owner.authority.lifecycle | tenant authz | create-or-refresh-required | Pending/removal rules. |
| S-004 | AC-S004-01 | evaluator.tenant-context.cross-tenant-deny | platform seam | create-or-refresh-required | Central evaluator. |
| S-004 | AC-S004-02 | evaluator.decision-proof | platform seam | create-or-refresh-required | Denial/proof output. |
| S-004 | AC-S004-03 | evaluator.abac-rebac.typed-extension | platform seam | create-or-refresh-required | Extension only. |
| S-005 | AC-S005-01 | tenant-lifecycle.authz-facts.compatibility | tenant lifecycle | create-or-refresh-required | ADR-0037 storage plan. |
| S-005 | AC-S005-02 | tenant-lifecycle.authz-denials | tenant lifecycle | create-or-refresh-required | Runtime denies. |
| S-006 | AC-S006-01 | admin.tenant-account.manage | tenant authz | create-or-refresh-required | Architecture-target mapping exists, detailed rows needed. |
| S-006 | AC-S006-02 | admin-owner.root-owned-deny | tenant authz | create-or-refresh-required | Root/tenant boundary deny. |
| S-007 | AC-S007-01 | admin.tenant-data.export | tenant authz | create-or-refresh-required | Architecture-target mapping exists, detailed rows needed. |
| S-007 | AC-S007-02 | admin.tenant-data.export.lifecycle | tenant lifecycle | create-or-refresh-required | Deletion/recovery export posture. |
| S-008 | AC-S008-01 | platform-authz.audit-proof.storage | audit | create-or-refresh-required | Concrete storage. |
| S-008 | AC-S008-02 | platform-authz.audit-taxonomy.events | audit | create-or-refresh-required | Event family coverage. |
| S-009 | AC-S009-01 | platform-authz.artifact-sweep | governance | create-or-refresh-required | Maintained artifacts. |
| S-009 | AC-S009-02 | platform-authz.ui-eligibility.runtime-enforced | security/frontend governance | create-or-refresh-required | UI blocked until runtime-enforced. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-003/S-004/S-006/S-007 | `tenantAuth` session and tenant selection | pre-existing-capability | existing | Tenant session/current tenant context contract. | Tenant selection and invalid context integration tests. |
| D-010 | S-000 | story breakdown AC and capability mapping sections | new-capability | new | Capability matrix can be generated from stable story, AC, and capability row IDs in this packet. | Traceability review confirms every AC is represented. |
| D-011 | S-001 | Product Discovery and Technical Steering packets | pre-existing-capability | existing | PRD consumes approved v1 role, root-owned exclusion, lifecycle, denial, audit, and non-goal decisions. | PRD review confirms no silent product policy invention. |
| D-012 | S-002 | `platform-authorization-denials.md` | pre-existing-capability | existing | Route-family API contract work adopts the shared denial status/code/category contract or records an explicit exception. | API contract review now; route integration tests when runtime routes change. |
| D-002 | S-004/S-005 | `tenants` lifecycle/deletion facts | feature-public-seam | changed | ADR-0037-compatible data/API contract. | Lifecycle/deletion deny integration tests. |
| D-003 | S-004/S-006/S-007 | central authorization evaluator | feature-public-seam | new | Input/output and denial/proof contract. | Evaluator allow/deny unit and route integration tests. |
| D-004 | S-006/S-007 | feature/config/entitlement resolver | feature-public-seam | new | Root-approved availability and tenant activation facts. | Feature unavailable and allowed-option tests. |
| D-005 | S-003/S-006/S-007 | tenant role/grant storage | persistence-table-or-index | new | Data dictionary and migration proof. | Persistence and revocation tests. |
| D-006 | S-008 | authz audit/proof sink | persistence-table-or-index | new or existing | Storage posture and event taxonomy contract. | Audit persistence tests. |
| D-007 | S-004/S-008 | platform authorization denial contract | pre-existing-capability | existing | Shared API denial contract adoption. | Route-family denial tests. |
| D-008 | S-009 | capability contract catalog materialization | feature-public-seam | changed | Expanded source posture materialization contract. | Drift/materialization tests when implemented. |
| D-009 | S-008 | job processing authority attribution | job-queue-or-worker | existing or changed | Job context/proof contract. | Job authority audit tests. |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| Central evaluator v1 seam | Tenant-admin route families | One ordered allow/deny path with proof and safe denial mapping. | Feature-local hidden policy stacks. | Unit, integration, security, audit. |
| Tenant role/grant resolver | Evaluator and tenant-admin APIs | Resolves globally consistent `adminOwner` authority in exactly one tenant context. | Root roles or tenant-specific role divergence. | Persistence and tenant authz integration. |
| Tenant lifecycle authz facts | Evaluator and tenant-admin APIs | Supplies ADR-0037 lifecycle/deletion posture for authz decisions. | Overloaded status-only behavior without compatibility plan. | Lifecycle/security tests. |
| Authz audit/proof sink | Security/audit review and future support tooling | Durable proof for sensitive allows/denies and job authority. | Ordinary logs or caller-visible denial messages. | Audit persistence tests. |
| Expanded permission mapping source posture | Capability catalog and future UI | UI eligibility only after runtime enforcement proof. | Docs-only or seeded grants. | Catalog drift/materialization and security tests. |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness reviewer | artifact author | mapping missing; mapping present | ACs unmapped; rows stale | stable story and AC IDs | draft to matrix-covered | missing row; duplicate row | traceability; standards compliance |
| S-001 | product owner; architect | artifact author | PRD absent; PRD drafted | role scope unresolved; exclusions unresolved | role name; non-goal list | draft to approved PRD | stale steering source | security; compatibility |
| S-002 | API owner | contract author | existing route contract; future route contract | denial categories; compatibility exceptions | status code; public code; internal reason | no adoption to adoption | stale API contract | security; privacy; compatibility |
| S-003 | tenant authz platform | migration author | invited; setup complete; removed; suspended | grants absent; grant active; grant revoked | tenant ID; role key; grant posture | invited to active; active to revoked | migration conflict; stale grant read | audit; persistence; compatibility |
| S-004 | protected route; evaluator | authenticated tenant actor | selected tenant; selection required; wrong world | lifecycle states; feature unavailable; role missing | capability key; operation; proof fields | allow to deny by state change | resolver failure; stale policy | security; audit; resilience |
| S-005 | tenant lifecycle owner | data contract author | tenant draft/live/disabled/inactive | active/softDeleted/hardDeletePending/hardDeleted | reason codes; recovery policy | status/posture transition | missing lifecycle facts | security; compatibility; audit |
| S-006 | `adminOwner`; root actor | tenant admin; root admin | active admin; pending admin; removed admin | setting enabled/disabled; root-owned control | flags; payment details; billing contact; usage settings | allowed option toggled; root-owned denied | feature resolver unavailable | security; privacy; audit |
| S-007 | `adminOwner` | tenant admin | active tenant; disabled tenant; inactive tenant; deletion posture | data export; log export; approved report | export size; report layer; lifecycle state | export requested; export denied | export job failure; reporting unavailable | privacy; audit; cost awareness |
| S-008 | security/audit owner; system job | audit writer | request-bound; job-bound; support/emergency | allow; deny; support; emergency; lifecycle; job event | reasonReference; severity; visibilityClass | event appended | audit sink failure | compliance; operational evidence |
| S-009 | governance reviewer | artifact author | implementation slice complete; artifacts stale | mappings; catalog; API; data dictionary; tests | source paths; generated graph | current to stale to refreshed | generated artifact drift | standards compliance; recoverability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | harness; missing matrix | platform-authz.admin-owner-v1.capability-matrix | contract-level | TC obligation: matrix row coverage | no |
| AC-S000-02 | harness; unmapped ACs | platform-authz.admin-owner-v1.traceability | contract-level | TC obligation: AC-to-row traceability | no |
| AC-S001-01 | product/architecture; role invariant | admin-owner.role.global-consistency | contract-level | TC obligation: PRD role invariant review | no |
| AC-S001-02 | root/adminOwner boundary | root-owned.tenant-controls | contract-level | TC obligation: root-owned exclusion review | no |
| AC-S001-03 | blocked/deferred families | admin-owner.v1.non-goals | contract-level | TC obligation: non-goal review | no |
| AC-S002-01 | API owner; denial categories | platform-authz.denial-contract.adoption | contract-level | TC obligation: API denial contract adoption review | no |
| AC-S002-02 | root/tenant auth compatibility | platform-authz.compatibility.root-tenant-auth | contract-level | TC obligation: compatibility review | yes when route changes |
| AC-S003-01 | tenant admin grant states | admin-owner.grant.storage | persistence-level | TC obligation: grant persistence/security tests | yes |
| AC-S003-02 | pending/active/removed admins | admin-owner.authority.lifecycle | persistence-level | TC obligation: authority lifecycle and audit tests | yes |
| AC-S004-01 | tenant context and cross-tenant | evaluator.tenant-context.cross-tenant-deny | runtime-api | TC obligation: tenant context and cross-tenant deny tests | yes |
| AC-S004-02 | allow/deny proof | evaluator.decision-proof | runtime-api | TC obligation: evaluator decision mapping tests | yes |
| AC-S004-03 | ABAC/ReBAC skipped | evaluator.abac-rebac.typed-extension | source-level | TC obligation: extension skipped proof | yes |
| AC-S005-01 | lifecycle storage compatibility | tenant-lifecycle.authz-facts.compatibility | persistence-level | TC obligation: migration/data compatibility tests | yes |
| AC-S005-02 | lifecycle/deletion denial states | tenant-lifecycle.authz-denials | runtime-api | TC obligation: lifecycle deny tests | yes |
| AC-S006-01 | adminOwner allowed account actions | admin.tenant-account.manage | runtime-api | TC obligation: allow and feature-gate tests | yes |
| AC-S006-02 | root-owned deny | admin-owner.root-owned-deny | runtime-api | TC obligation: root-owned deny tests | yes |
| AC-S007-01 | tenant export/reporting | admin.tenant-data.export | runtime-api | TC obligation: export/reporting authz tests | yes |
| AC-S007-02 | export lifecycle posture | admin.tenant-data.export.lifecycle | contract-level | TC obligation: export lifecycle contract tests | yes |
| AC-S008-01 | audit/proof fields | platform-authz.audit-proof.storage | persistence-level | TC obligation: audit persistence field coverage | yes |
| AC-S008-02 | event families | platform-authz.audit-taxonomy.events | persistence-level | TC obligation: event-family audit tests | yes |
| AC-S009-01 | maintained artifacts | platform-authz.artifact-sweep | source-level | TC obligation: artifact sweep review | no |
| AC-S009-02 | UI eligibility | platform-authz.ui-eligibility.runtime-enforced | mixed | TC obligation: catalog posture and frontend gate tests when UI exists | yes when UI/catalog changes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| B-001 | S-003 through S-009 | capability-matrix | No approved v1 `adminOwner` capability matrix exists. | Capability matrix covering every AC row or explicit non-capability rationale. | Runtime stories wait until matrix exists. |
| B-002 | S-003 through S-009 | DECISION:architecture-foundation | PRD does not yet translate product intent into implementable v1 requirements. | v1 `adminOwner` PRD. | Runtime stories wait until PRD exists. |
| B-003 | S-003/S-005/S-008 | artifact-drift | Data dictionaries and migration/storage choices are missing. | Data dictionary and migration/persistence blueprint. | Persistence work waits until storage posture exists. |
| B-004 | S-004/S-006/S-007 | permission-model | Detailed capability rows and route adoption are missing. | Capability matrix, permission mapping refresh, API contract updates. | Route work waits until rows/contracts exist. |
| B-005 | S-008 | artifact-drift | Audit taxonomy exists but concrete storage/retention/reviewability are not chosen. | Audit storage/data dictionary decision. | Audit runtime waits until storage is specified. |
| B-006 | S-009 | artifact-drift | Capability catalog materialization does not yet ingest expanded source posture. | Catalog implementation planning or explicit deferral. | UI/catalog exposure waits until materialization posture is handled. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-001 | B-003 | What exact storage posture should first v1 use for tenant `adminOwner` grants: extend tenant-auth grants, add a tenant authz grant table, or use another approved authz store? | no | Authz/data owner; required before implementation blueprint. |
| Q-002 | B-005 | Should first v1 authz audit proof use existing `auth_audit_events`, a feature-local proof table, or a new platform authz audit sink? | no | Security/audit owner; required before implementation blueprint. |
| Q-003 | S-006/S-007 | Which concrete tenant account and export route families are first implementation scope? | no | Product/PRD owner; PRD should answer before task breakdown for runtime routes. |
| Q-004 | S-005 | What exact compatibility strategy migrates from current tenant `status`/`deletedAt` to ADR-0037 lifecycle/deletion posture? | no | Tenant lifecycle owner; required before migration task breakdown. |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-001 | S-000 | B-001 / ART-001 | capability-matrix-required | no | Use story packet ACs as source. | Create v1 `adminOwner` capability matrix. | yes | ready-to-create-artifact |
| U-002 | S-001 | B-002 / ART-002 | prd-required | no | Use Product Discovery, Technical Steering, and this story packet as source. | Create v1 `adminOwner` PRD. | yes | ready-to-create-artifact |
| U-003 | S-002 | B-004 | api-contract-required | no | Adopt shared denial contract by default. | Refresh first tenant-admin route-family API contract once PRD names routes. | yes | ready-to-create-artifact |
| U-004 | S-003/S-005/S-008 | Q-001/Q-002/Q-004 / ART-004 | human-decision | Which grant storage, audit sink, and lifecycle compatibility strategy are approved? | Options: extend existing tenant-auth grants; add a tenant authz grant/proof store; defer runtime implementation until implementation blueprint chooses storage. | Answer storage/audit/lifecycle compatibility questions in PRD or implementation blueprint. | no | needs-human-answer |
| U-005 | S-009 | B-006 / ART-008 | artifact-creation | no | Defer catalog materialization until first runtime implementation, but keep UI ineligible. | Create catalog materialization story when runtime-enforced capabilities are introduced. | yes | ready-to-create-artifact |
| U-006 | S-004 through S-008 | ART-007 | artifact-creation | no | Use PRD, capability matrix, implementation blueprint, and PRD-derived test cases as source. | Create detailed permission mapping refresh after first runtime scope is selected. | yes | ready-to-create-artifact |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-001 | S-000 | capability matrix | create v1 `adminOwner` capability matrix | capability-matrix workflow | yes |
| ART-002 | S-001 | PRD | create v1 `adminOwner` PRD | PRD workflow | yes |
| ART-003 | S-002 | API contract | create or update first tenant-admin route-family API contracts | api-contract-maintainer | yes for route work |
| ART-004 | S-003/S-005/S-008 | data dictionary | create tenant authz grant/proof/lifecycle dictionary pages when storage is selected | data-dictionary-maintainer | yes for persistence work |
| ART-005 | S-004/S-006/S-007 | implementation blueprint | created `docs/workspace/implementation-blueprints/2026-05-05-platform-authorization-admin-owner-v1.md`; refresh only if storage, audit, lifecycle, or first route-family posture changes | implementation-blueprint-maintainer | no |
| ART-006 | S-004 through S-008 | PRD-derived test cases | created `docs/prd/test_cases/2026-05-05-platform-authorization-admin-owner-v1-test-cases.md`; refresh when first route family is selected | prd-test-case-planner | no |
| ART-007 | S-009 | permission mappings | refresh detailed rows after capability matrix and before runtime completion | permission-mapping workflow | yes |
| ART-008 | S-009 | capability catalog | plan materialization support for expanded source posture before UI eligibility | capability catalog workflow | yes before UI/catalog exposure |
| ART-009 | S-009 | feature manifests/generated graph | update only if runtime seams/dependencies change | feature dependency workflow | yes for runtime seam changes |

## Story Readiness Summary

- Ready stories:
  S-000, S-001, S-002
- Blocked stories:
  S-003 through S-009 are blocked from Task Breakdown for runtime work until
  storage/API/audit choices are accepted for the target runtime slice and
  route-specific artifact obligations are created or explicitly deferred.
- Stories needing capability matrix:
  S-003 through S-009
- Stories needing PRD refinement:
  S-003 through S-009
- Stories needing Technical Steering revisit:
  none if scope remains v1 `adminOwner` with typed ABAC/ReBAC extension points
  only.
- Broad cleanup or shortcut risk:
  `listed-below`
- Architecture invention risk:
  `none`

Shortcut risks:

- Treating `architecture-target` or `documentation-only` rows as runtime grants.
- Exposing admin UI before capabilities are `runtime-enforced`.
- Implementing tenant settings/export routes before PRD names first route
  families.
- Storing authz proof only in logs.
- Merging root roles and tenant roles into one authority model.
- Implementing ABAC/ReBAC broadly before a feature-specific source-of-truth
  decision.

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | ready-for-task-breakdown | Capability matrix control story has concrete inputs and no remaining product decision. |
| S-001 | ready-for-task-breakdown | PRD story can be drafted from Product Discovery, Technical Steering, and this story packet. |
| S-002 | ready-for-task-breakdown | API adoption story can use the shared denial contract; concrete route-family updates wait for PRD scope. |
| S-003 | blocked | Tenant role/grant storage choice is unresolved. |
| S-004 | blocked | Evaluator implementation waits on PRD, capability matrix, storage, and test plan. |
| S-005 | blocked | Lifecycle compatibility strategy is unresolved. |
| S-006 | blocked | Concrete tenant account route families are not yet named by PRD/capability matrix. |
| S-007 | blocked | Concrete export/reporting route families are not yet named by PRD/capability matrix. |
| S-008 | blocked | Audit storage and retention/reviewability choices are unresolved. |
| S-009 | blocked | Artifact sweep depends on runtime implementation scope. |
