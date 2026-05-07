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
This is needed to break down what the admin owner role needs to be able to do into individual capabilities, so we can plan the implementation more accurately.

**Goal**
Reviewers can understand what should be true afterward: Capability rows cover every story acceptance criterion or record non-capability rationale.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry behavior list normalization into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-001: V1 `adminOwner` PRD

**Situation**
This is needed to define the business meaning of the tenant admin role before splitting it into detailed work.

**Goal**
Reviewers can understand what should be true afterward: A PRD defines v1 the tenant admin owner role, root-owned exclusions, lifecycle behavior, and non-goals.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry V1 the tenant admin owner role PRD into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-002: Route-family API denial adoption plan

**Situation**
This is needed to make sure future tenant admin screens give consistent no-access answers.

**Goal**
Reviewers can understand what should be true afterward: service answer contracts name status/code/reason behavior for tenant selection, lifecycle, feature, role, cross-tenant, and sensitive denials.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry service entry point-family service answer denial adoption plan into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-003: Tenant role and grant storage foundation

**Situation**
This is its own story because the role should mean the same thing for every tenant and remain reviewable over time.

**Goal**
Reviewers can understand what should be true afterward: the tenant admin owner role grants can be resolved durably and audited without mixing with root roles.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant role and grant storage foundation into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-004: Central evaluator v1 implementation slice

**Situation**
This is its own story because every protected tenant action should be judged by the same clear rule set.

**Goal**
Reviewers can understand what should be true afterward: Evaluator supports tenant context, lifecycle/deletion, feature/config/entitlement, the tenant admin owner role, denial mapping, and proof.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Central evaluator v1 implementation slice into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-005: Tenant lifecycle compatibility for authz

**Situation**
This is its own story because suspended, deleted, or changing tenants need predictable access behavior before role powers expand.

**Goal**
Reviewers can understand what should be true afterward: access checking can deny or restrict by ADR-0037 lifecycle/deletion posture with a compatibility plan.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant lifecycle compatibility for access checking into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-006: `adminOwner` tenant account management capabilities

**Situation**
This is its own story because day-to-day tenant settings are the first recognizable responsibility for this role.

**Goal**
Reviewers can understand what should be true afterward: Tenant account actions are allowed, denied, audited, and feature-gated consistently.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry the tenant admin owner role tenant account management capabilities into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-007: `adminOwner` tenant data and log export capabilities

**Situation**
This is its own story because exporting tenant information is more sensitive than changing settings and needs separate business review.

**Goal**
Reviewers can understand what should be true afterward: Export actions are tenant-scoped, lifecycle-aware, audit-visible, and denied cross-tenant by default.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry the tenant admin owner role tenant data and log export capabilities into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-008: Authorization audit/proof persistence

**Situation**
This is its own story because sensitive access decisions need durable evidence that reviewers can trust later.

**Goal**
Reviewers can understand what should be true afterward: access checking events carry actor, tenant, capability, decision, reason, policy source, visibility, and severity.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Authorization audit/proof saved data into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-009: Maintained artifact and catalog alignment

**Situation**
This is needed to keep the written rules, examples, and tests aligned with how the role actually works.

**Goal**
Reviewers can understand what should be true afterward: No implementation slice is treated complete while downstream planning records remain stale.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Maintained planning record and catalog alignment into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.
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
