# Story Breakdown: Tenant-Aware Login Pattern

## Status

- Packet status:
  `blocked`
- Packet date:
  2026-04-29
- Epic ID:
  `EPIC-TENANT-AWARE-LOGIN-PATTERN`
- Epic title:
  Tenant-aware login pattern
- Source Product Discovery packet:
  `docs/workspace/product-discovery/2026-04-29-tenant-aware-login-pattern.md`
- Source Technical Steering packet:
  `docs/workspace/technical-steering/2026-04-29-tenant-aware-login-pattern-steering.md`
- Related PRD:
  not created in this layer
- Related capability matrix:
  not created in this layer
- Related design-system, asset, ADR, or architecture artifacts:
  `docs/architecture/guides/story-breakdown-test-design-guide.md`; ADRs and
  auth/design-system guides named by Technical Steering for tenant auth,
  configuration, tokens, notification delivery, frontend topology, page-state
  replay, and governed app adoption
- Validation command:
  `npm run story-breakdown:validate -- docs/workspace/story-breakdown/2026-04-29-tenant-aware-login-pattern-story-breakdown.md`
- Validation status:
  `pass`

## Handoff Validation

- Product Discovery status:
  `ready-for-technical-steering`
- Technical Steering status:
  `ready-for-layer-3-after-auth-and-design-system-governance`
- Steering non-goals preserved:
  no source code, no route contract, no schema, no provider integration, no
  session mechanism, no SSO platform, no app UI, no copied root-login markup,
  no PRD, no capability matrix, no Task Breakdown in this packet
- Steering stop conditions resolved or carried as blockers:
  requester asked for the remaining Layer 3 pass; PRD decisions, capability
  matrix coverage, auth/session architecture, SSO provider posture, design-
  system behavior locks, API/data contracts, permission mappings, audit model,
  and implementation blueprint remain downstream blockers
- Architecture invention check:
  `consumes-steering-only`
- Governed frontend seam posture:
  `missing-seam`
- Asset/security/tenant/authz/persistence/migration/compliance risks:
  high-sensitivity auth flow; risks include enumeration, per-tenant normalized
  email uniqueness, exactly one selected tenant context, removed-user and
  disabled-tenant interruption, provider outage, password-reset bypass,
  session invalidation, replay-state leakage, audit privacy, and current
  membership refresh
- Missing source-of-truth artifacts:
  PRD, capability matrix, API contracts, OpenAPI/Postman artifacts, data
  dictionary entries, permission mappings, design-system behavior lock,
  reference pack, verification checklist, implementation blueprint, feature
  manifest decisions, generated dependency graph refresh if new seams are
  introduced

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| C-001 | Tenant-aware login feature boundary and auth scope | architecture-foundation-required | PRD and auth architecture governance | deferred-with-owner | Architecture-foundation task for tenantAuth, tenantConfiguration, identity, provider, and session-authority decisions before delivery |
| C-002 | Root-managed tenant auth configuration | feature-local | Tenant auth or tenant configuration owning feature, exact owner deferred to PRD | deferred-with-owner | Backend, API-contract, migration/persistence, permission-mapping, and data-dictionary tasks after PRD and capability matrix approval |
| C-003 | Pre-auth email resolution, tenant selection, and method choice | feature-local | Tenant login route family and tenant-auth session seams | deferred-with-owner | Backend and API-contract tasks for generic no-match behavior and exactly one selected tenant context |
| C-004 | Email-password reset and SSO provider posture | feature-public-seam | One-time token, notification, and provider callback seams | deferred-with-owner | Architecture-foundation, API-contract, migration/persistence, and backend tasks after provider and token lifecycle decisions |
| C-005 | Active-session interruption and authority refresh | platform-seam | Auth/session authority seam | deferred-with-owner | Platform-seam and backend tasks only after the invalidation or refresh mechanism is selected |
| C-006 | Tenant login governed frontend pattern | design-system-seam | Design-system login render/controller/style seams | deferred-with-owner | Design-system and frontend tasks after behavior lock, reference pack, verification checklist, and adoption path exist |
| C-007 | Security, audit, privacy, and artifact conformance | feature-local | Tenant auth, audit, permission, API, data, and test planning artifacts | deferred-with-owner | Permission-mapping, data-dictionary, API-contract, QA/evidence, and docs-artifact tasks after source-of-truth artifacts exist |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-000 | Capability matrix normalization | blocked | No approved tenant-aware login capability matrix exists and ART-001 blocks delivery stories. | docs-artifact |
| S-001 | Auth scope and feature-boundary lock | blocked | PRD has not selected feature boundaries, durable identity model, provider posture, or session authority mechanics. | architecture-foundation |
| S-002 | Root-managed tenant auth configuration | blocked | Root configuration needs PRD, capability matrix, API, permission, data, and migration decisions before implementation. | backend |
| S-002 | Root auth configuration route contract | blocked | Root manage/read behavior, validation, and audit evidence require API contract planning. | API-contract |
| S-002 | Tenant auth configuration persistence | blocked | Durable method set, provider reference metadata, policy version, timestamps, and lifecycle state require persistence planning. | migration/persistence |
| S-003 | Pre-auth email and tenant resolution | blocked | Generic no-match behavior and safe tenant-choice disclosure need approved API and security posture. | backend |
| S-003 | Pre-auth route contract | blocked | Email normalization, validation, and disclosure threshold require API contract rows. | API-contract |
| S-004 | Tenant selection and method choice | blocked | Method execution must bind exactly one selected tenant context after PRD/session decisions. | backend |
| S-004 | Selected-tenant state contract | blocked | Request-body tenant inference and disabled-method transition behavior require API contract planning. | API-contract |
| S-005 | Email-password and password-reset policy | blocked | Reset availability and token lifecycle depend on selected tenant, enabled method policy, token, and notification seams. | backend |
| S-005 | Password reset persistence and token lifecycle | blocked | Tenant-bound, single-use, short-lived reset tokens require data and lifecycle planning. | migration/persistence |
| S-006 | SSO unavailable and fallback posture | blocked | Provider handoff, callback, outage, and fallback behavior are intentionally deferred. | backend |
| S-006 | SSO provider architecture | blocked | Provider-specific behavior affects security, session state, audit, and fallback contracts. | architecture-foundation |
| S-007 | Session interruption and authority refresh | blocked | Active-session interruption mechanism has not been selected. | platform-seam |
| S-007 | Current tenant authority enforcement | blocked | Removed users, membership changes, disabled tenants, and forced-login state need backend enforcement planning. | backend |
| S-008 | Audit, privacy, and replay-state controls | blocked | Audit event inventory and forbidden sensitive fields require source-independent security and API artifacts. | QA/evidence |
| S-008 | Permission and privacy mapping | blocked | Authz boundaries, audit access, and replay-state exclusions need permission and security documentation. | permission-mapping |
| S-009 | Governed tenant login pattern | blocked | Tenant login UI requires signed-off design-system seams and cannot copy root-login markup. | design-system |
| S-009 | Tenant login app adoption | blocked | Future app UI can proceed only after governed render/controller/style seams exist. | frontend |
| S-010 | Maintained artifact conformance | blocked | API, data, permission, design-system, feature-manifest, generated graph, and test-case artifacts do not yet exist. | docs-artifact |
| S-010 | PRD-derived test planning | blocked | Detailed TC planning is required before delivery stories can claim proof coverage. | test-only |

## Epic Summary

- Epic job to be done:
  Tenant users need to authenticate into exactly one tenant through that
  tenant's enabled methods while root governs tenant auth configuration and
  stale sessions are interrupted when authority changes.
- Epic outcome:
  Tenant-aware login is planned as a permissioned, tenant-bound,
  enumeration-resistant, auditable auth vertical slice with governed login UI
  seams before implementation.
- Epic actors:
  tenant user, root operator, auth/session system, tenant/membership evaluator,
  SSO provider, notification provider, audit/operations reviewer
- Epic non-goals:
  broad identity-provider platform, copied root-login implementation, tenant
  admin self-service configuration, app UI before signoff, public tenant
  discovery, secret-bearing replay links, source edits
- Epic dependency summary:
  Tenant-aware login depends on tenant auth policy/configuration, principals
  and memberships, tenants, root-managed configuration, one-time tokens,
  notification delivery, session authority checks, audit, and governed
  design-system login seams.
- Epic-level proof target:
  `mixed`

## Story Narratives

### S-000: Capability matrix normalization

**Situation**
This is needed to break down what tenant-aware login needs to be able to do into individual capabilities, so we can plan the implementation more accurately.

**Goal**
Reviewers can understand what should be true afterward: Approved capability rows cover every acceptance criterion and identity/security boundary.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry behavior list normalization into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-001: Auth scope and feature-boundary lock

**Situation**
This is needed to settle what tenant-aware login includes before splitting the sign-in journey into smaller pieces.

**Goal**
Reviewers can understand what should be true afterward: Downstream contracts can describe tenant-aware login without inventing auth architecture during delivery.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Auth scope and feature-boundary lock into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-002: Root-managed tenant auth configuration

**Situation**
This is its own story because operators need a clear way to decide which sign-in methods each tenant can use.

**Goal**
Reviewers can understand what should be true afterward: Tenant auth method policy is durable, permissioned, auditable, and separate from mutable provider state.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Root-managed tenant auth configuration into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-003: Pre-auth email and tenant resolution

**Situation**
This is its own story because the first sign-in question should guide people safely without revealing too much.

**Goal**
Reviewers can understand what should be true afterward: Email is normalized, no-match outcomes are generic, and multi-tenant choices appear only after approved resolution.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Pre-auth email and tenant resolution into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-004: Tenant selection and method choice

**Situation**
This is its own story because people who belong to more than one tenant need to choose the right place before signing in.

**Goal**
Reviewers can understand what should be true afterward: Auth method execution is bound to one selected tenant context and disabled methods redirect safely.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Tenant selection and method choice into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-005: Email-password and password-reset policy

**Situation**
This is its own story because password sign-in and reset are familiar user moments with their own safety expectations.

**Goal**
Reviewers can understand what should be true afterward: Password reset cannot bypass tenant method policy and tokens remain tenant-bound, short-lived, and secret-safe.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Email-password and password-reset policy into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-006: SSO unavailable and fallback posture

**Situation**
This is its own story because people need a predictable path when a company sign-in provider is unavailable.

**Goal**
Reviewers can understand what should be true afterward: SSO unavailability blocks or routes to an enabled fallback without becoming a broad provider platform.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry SSO unavailable and fallback posture into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-007: Session interruption and authority refresh

**Situation**
This is its own story because access should change promptly when a person's membership or tenant status changes.

**Goal**
Reviewers can understand what should be true afterward: Active access reflects current tenant, membership, user, and auth-policy state with audit evidence.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Session interruption and authority refresh into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-008: Audit, privacy, and replay-state controls

**Situation**
This is its own story because sign-in history must be reviewable without exposing secrets or granting accidental access.

**Goal**
Reviewers can understand what should be true afterward: Auth events are reviewable and privacy-safe, and debug/replay state cannot grant tenant access.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Audit, privacy, and replay-state controls into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-009: Governed tenant login pattern

**Situation**
This is its own story because the visible login journey should be signed off before customers depend on it.

**Goal**
Reviewers can understand what should be true afterward: Tenant login UI consumes governed render/interaction behavior/style seams instead of copying root login.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Governed tenant login pattern into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.

### S-010: Maintained artifact conformance

**Situation**
This is needed to keep the written rules, examples, and tests aligned with the login experience before the work is treated as ready.

**Goal**
Reviewers can understand what should be true afterward: Delivery begins from coherent contracts and traceable proof obligations.

**Decisions Needed**
The work needs agreement on the story boundary, the required checks, and any blocker named in the larger request before the next step starts.

**Work That Follows**
The work will carry Maintained planning record conformance into the next planning step with the expected result, checks, and stopping point made clear.

**Evidence Of Success**
A reviewer can read this story by itself, see what should be true afterward, and connect the result to the checks listed below.
## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | needs-capability-matrix | harness-value | DOC:docs-artifact | Capability matrix normalization | This is needed to break down what tenant-aware login needs to be able to do into individual capabilities, so we can plan the implementation more accurately. | As the delivery harness, I need tenant-aware login stories translated into capability rows so security-sensitive work starts from explicit obligations. | harness | Approved capability rows cover every acceptance criterion and identity/security boundary. | Blocks all delivery stories |
| S-001 | needs-prd-refinement | system-value | DECISION:architecture-foundation | Auth scope and feature-boundary lock | This is needed to settle what tenant-aware login includes before splitting the sign-in journey into smaller pieces. | As architecture governance, I need root-managed tenant auth configuration, tenantAuth boundaries, identities, memberships, provider references, and session authority seams decided. | architecture governance | Downstream contracts can describe tenant-aware login without inventing auth architecture during delivery. | Blocks S-002 through S-010 |
| S-002 | needs-capability-matrix | user-value | DEV:backend | Root-managed tenant auth configuration | This is its own story because operators need a clear way to decide which sign-in methods each tenant can use. | As a root operator, I need to configure enabled auth methods for exactly one tenant. | root operator | Tenant auth method policy is durable, permissioned, auditable, and separate from mutable provider state. | Depends on S-000 and S-001 |
| S-003 | needs-capability-matrix | user-value | DEV:backend | Pre-auth email and tenant resolution | This is its own story because the first sign-in question should guide people safely without revealing too much. | As a tenant user, I need email entry and tenant resolution to reveal only safe next steps. | tenant user | Email is normalized, no-match outcomes are generic, and multi-tenant choices appear only after approved resolution. | Depends on S-000 and S-001 |
| S-004 | needs-capability-matrix | user-value | DEV:backend | Tenant selection and method choice | This is its own story because people who belong to more than one tenant need to choose the right place before signing in. | As a tenant user, I need to select exactly one tenant and choose among that tenant's enabled methods. | tenant user | Auth method execution is bound to one selected tenant context and disabled methods redirect safely. | Depends on S-003 |
| S-005 | needs-capability-matrix | user-value | DEV:backend | Email-password and password-reset policy | This is its own story because password sign-in and reset are familiar user moments with their own safety expectations. | As a tenant user, I need email-password login and reset only when enabled for the selected tenant. | tenant user | Password reset cannot bypass tenant method policy and tokens remain tenant-bound, short-lived, and secret-safe. | Depends on S-002 through S-004 |
| S-006 | needs-capability-matrix | system-value | DEV:backend | SSO unavailable and fallback posture | This is its own story because people need a predictable path when a company sign-in provider is unavailable. | As the auth system, I need SSO outage or misconfiguration outcomes to fall back only when another enabled method exists. | auth/session system and SSO provider | SSO unavailability blocks or routes to an enabled fallback without becoming a broad provider platform. | Depends on S-002 through S-004 |
| S-007 | needs-capability-matrix | system-value | DEV:backend | Session interruption and authority refresh | This is its own story because access should change promptly when a person's membership or tenant status changes. | As the auth/session system, I need removed users, membership changes, disabled tenants, deleted tenants, and forced-login policy changes to affect active sessions. | auth/session system | Active access reflects current tenant, membership, user, and auth-policy state with audit evidence. | Depends on S-001 through S-004 |
| S-008 | needs-capability-matrix | system-value | DEV:backend | Audit, privacy, and replay-state controls | This is its own story because sign-in history must be reviewable without exposing secrets or granting accidental access. | As security and operations governance, I need mandatory audit events without credentials, tokens, provider secrets, or authority-bearing replay payloads. | security, audit, operations | Auth events are reviewable and privacy-safe, and debug/replay state cannot grant tenant access. | Depends on S-001 through S-007 |
| S-009 | needs-capability-matrix | user-value | DEV:frontend | Governed tenant login pattern | This is its own story because the visible login journey should be signed off before customers depend on it. | As a tenant user, I need signed-off login, tenant selection, method choice, recovery, unavailable-provider, disabled-method, and forced-login states. | tenant user | Tenant login UI consumes governed render/controller/style seams instead of copying root login. | Depends on S-001 through S-008 |
| S-010 | needs-capability-matrix | harness-value | DOC:standards-compliance | Maintained artifact conformance | This is needed to keep the written rules, examples, and tests aligned with the login experience before the work is treated as ready. | As repo governance, I need API, data, permission, design-system, feature-manifest, and test-case artifacts to reflect the approved story set before Task Breakdown. | repo governance | Delivery begins from coherent contracts and traceable proof obligations. | Depends on S-000 through S-009 |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |
| B-001 | S-002 through S-010 | capability-matrix | No approved tenant-aware login capability matrix exists. | Capability matrix covering every AC row or explicit non-capability rationale. | Task Breakdown for delivery stories waits until matrix coverage exists. |
| B-002 | S-002 through S-008 | architecture-foundation | PRD has not selected exact feature boundaries, identity model, provider posture, or session authority mechanics. | PRD decisions and source-of-truth alignment with named ADRs and guides. | Backend delivery waits until auth architecture is recorded. |
| B-003 | S-005 and S-006 | architecture-foundation | Password reset and SSO provider behavior can alter token, notification, provider, and callback architecture. | PRD/API/data decisions for reset and SSO lifecycle. | Method delivery waits until provider and token posture are recorded. |
| B-004 | S-007 | architecture-foundation | Active-session interruption mechanism is not selected. | Approved invalidation or authority-refresh mechanism with audit and retry posture. | Session delivery waits until enforcement model is recorded. |
| B-005 | S-009 | design-system-foundation | Tenant login design-system render/controller/style seams are not confirmed. | Behavior lock, reference pack, verification checklist, and adoption path. | App UI delivery waits until consumable seams exist or explicit exception is approved. |
| B-006 | S-010 | artifact-drift | Downstream source-independent artifacts do not yet exist for the feature. | API/data/permission/design/test artifacts created through owner workflows. | Task Breakdown waits on artifacts marked blocking by change-control requirements. |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |
| Q-001 | B-002 | Does tenant-aware login extend tenantAuth, tenantConfiguration, or a narrower auth-method configuration seam? | yes | requester accepted architectural recommendation: split ownership so `tenantConfiguration` owns root-managed tenant auth policy/configuration and `tenantAuth` owns login flow, tenant selection, method execution, password reset, SSO handoff, session authority, and active-session checks |
| Q-002 | B-002 | What durable identity, membership, per-tenant email uniqueness, provider reference, and session policy/version records own the auth facts? | yes | architectural recommendation recorded: durable tenant auth policy/configuration, normalized tenant-scoped identity and membership facts, provider references, policy version, and session authority facts must be persisted; they must not depend only on provider or UI state |
| Q-003 | B-004 | Which mechanism interrupts active sessions after user, membership, tenant, or auth-policy state changes? | yes | requester accepted architectural recommendation: start with request-time authority checks plus tenant auth policy/session version checks; defer scheduler, pub/sub, or worker invalidation until runtime requirements demand it |
| Q-004 | B-003 | Which SSO provider posture and callback constraints are approved for the first slice, and which provider-specific behaviors remain out of scope? | yes | requester accepted architectural recommendation: plan the SSO seam but defer broad SSO provider implementation; first delivery can focus on email/password and method choice while SSO remains a bounded future method with explicit callback constraints |
| Q-005 | B-005 | Does an existing governed login pattern expose sufficient tenant selection, method choice, recovery, disabled-method, unavailable-provider, and forced-login seams? | yes | requester accepted UX recommendation: base tenant and method selection on the existing SSH-key-selection pattern, using a selectable list/radio-card style for tenant choice followed by method choice and next-step disclosure |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-001 | S-001 through S-008 | Q-001; Q-002; ART-002; ART-003 | prd-required | not-applicable: architectural ownership and durable fact recommendations are recorded | not-applicable: split ownership between `tenantConfiguration` policy/configuration and `tenantAuth` execution/session behavior | Create tenant-aware login PRD and data dictionary entries using the recorded split ownership and durable auth fact model. | yes | ready-to-create-artifact |
| U-002 | S-007 | Q-003 | prd-required | not-applicable: active-session interruption recommendation is recorded | not-applicable: request-time authority checks plus tenant auth policy/session version checks are the first-slice default | Capture request-time authority and policy/session version checks in PRD, API contracts, data dictionary, and tests; defer scheduler or worker invalidation. | yes | ready-to-create-artifact |
| U-003 | S-005; S-006 | Q-004 | prd-required | not-applicable: SSO first-slice posture is recorded | not-applicable: defer broad SSO provider implementation while preserving a bounded future SSO method seam | Record first-slice email/password and method-choice scope plus future SSO callback constraints in PRD and capability matrix. | yes | ready-to-create-artifact |
| U-004 | S-009 | Q-005; ART-006; ART-007; ART-008; ART-009 | design-system-governance | not-applicable: tenant/method selection UX recommendation is recorded | not-applicable: adapt the SSH-key-selection pattern for tenant choice and method choice | Create tenant login behavior lock, reference pack, verification checklist, and adoption contract using selectable tenant and method-choice states. | yes | ready-to-create-artifact |
| U-005 | S-000 | ART-001 | capability-matrix-required | not-applicable: capability matrix can be derived from recorded auth and design-system recommendations | not-applicable: no product choice required once recommendations are recorded | Create tenant-aware login capability matrix rows for every AC or explicit non-capability rationale. | yes | ready-to-create-artifact |
| U-006 | S-002 through S-008 | ART-004; ART-005 | artifact-creation | not-applicable: API and permission artifacts depend on PRD and capability rows | not-applicable: use recorded split ownership, session authority, and SSO posture as source decisions | Create API contracts and permission mappings after PRD and capability rows exist. | yes | deferred-with-owner |
| U-007 | S-010 | ART-010; ART-011; ART-012 | artifact-creation | not-applicable: final planning artifacts depend on PRD, matrix, API, data, permission, and design-system artifacts | not-applicable: no standalone safe default before upstream artifacts exist | Create PRD-derived test cases, implementation blueprint, feature manifests, and generated graph after upstream artifacts are coherent. | yes | deferred-with-owner |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-001 | S-000 | capability matrix | create tenant-aware login capability matrix | capability-matrix workflow | yes |
| ART-002 | S-001 | PRD | create tenant-aware login PRD with auth, tenant, lifecycle, and provider decisions | PRD workflow | yes |
| ART-003 | S-001 | data dictionary | create or refresh tenant auth configuration, identity, membership, session, provider, token, and audit entries | data-dictionary-maintainer | yes |
| ART-004 | S-002 through S-007 | API contract | create route contracts for configuration, login, selection, method execution, reset, SSO, session continuation, and logout | api-contract-maintainer | yes |
| ART-005 | S-002 through S-008 | permission mapping | map root configuration, tenant login/session, reset, SSO, audit, and cross-tenant deny capabilities | permission-mapping workflow | yes |
| ART-006 | S-009 | design-system behavior lock | create tenant login pattern behavior lock | frontend-design-system-loop-maintainer | yes |
| ART-007 | S-009 | design-system reference pack | create tenant login pattern reference pack | frontend-design-system-loop-maintainer | yes |
| ART-008 | S-009 | verification checklist | create tenant login pattern verification checklist | frontend-test-case-maintainer | yes |
| ART-009 | S-009 | adoption contract | create first-consumer adoption contract before app UI | frontend-design-system-loop-maintainer | yes |
| ART-010 | S-010 | PRD-derived test cases | create test-case packet with story and AC traceability | prd-test-case-planner | yes |
| ART-011 | S-010 | implementation blueprint | create after PRD, capability, API, data, authz, and design-system artifacts are coherent | implementation-blueprint-maintainer | yes |
| ART-012 | S-010 | feature manifests and generated graph | refresh after public seams or cross-feature dependencies are approved | feature manifest workflow | yes |

## Story Readiness Summary

- Ready stories:
  none
- Blocked stories:
  S-000 through S-010 remain blocked on capability matrix, PRD/auth
  architecture decisions, design-system seam governance, and maintained
  artifact creation.
- Stories needing capability matrix:
  S-000 through S-010
- Stories needing PRD refinement:
  S-001 through S-008
- Stories needing Technical Steering revisit:
  none if the work stays within root-managed tenant auth configuration,
  tenant-aware login, bounded reset, bounded SSO fallback, and governed UI.
- Stories needing Product Discovery revisit:
  none.
- Broad cleanup or shortcut risk:
  `listed-below`
- Architecture invention risk:
  `none`

Shortcut risks:

- Copying root-login markup or controller behavior into tenant login UI before
  governed design-system seams exist.
- Letting password reset bypass selected-tenant method policy.
- Treating tenant selection, SSO callback, reset tokens, replay links, or
  provider state as authority without server-side validation.
- Deferring active-session interruption mechanics into source implementation.
- Beginning Task Breakdown before PRD, capability matrix, API, data,
  permission, design-system, and test-case artifacts exist.

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-000 | blocked | Capability matrix does not yet exist. |
| S-001 | blocked | PRD and auth architecture decisions are not recorded. |
| S-002 | blocked | Root configuration delivery waits on feature-boundary, data, API, and permission decisions. |
| S-003 | blocked | Pre-auth resolution delivery waits on PRD, API, privacy, and capability rows. |
| S-004 | blocked | Tenant selection and method choice wait on selected-tenant authority contract. |
| S-005 | blocked | Email-password and reset work waits on token, notification, and method-policy decisions. |
| S-006 | blocked | SSO fallback work waits on provider posture and callback constraints. |
| S-007 | blocked | Session interruption waits on approved enforcement and retry/audit posture. |
| S-008 | blocked | Audit and privacy controls wait on event inventory and forbidden-field rules. |
| S-009 | blocked | Tenant login UI waits on signed-off design-system seams. |
| S-010 | blocked | Artifact conformance waits on upstream artifacts and generated graph decisions. |
