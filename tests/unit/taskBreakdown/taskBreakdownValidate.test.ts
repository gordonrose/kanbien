import { describe, expect, it } from "vitest";

import { validateTaskBreakdownContent } from "../../../src/scripts/taskBreakdownValidate";

const sourceStoryPacket = `# Story Breakdown Packet: Tenant Branding

## Status

- Packet status:
  \`ready-for-task-breakdown\`

## Handoff Validation

- Architecture invention check:
  \`consumes-steering-only\`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |
| not-applicable | no | Backend-only steering has no browser security posture. | not-applicable: no DEV:frontend task | no |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |

## Epic Summary

- Epic job to be done:
  As the platform, keep tenant branding delivery scoped and provable.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | user-value | DEV:backend | Root admin updates branding | As a root admin, I need to update a tenant branding display name so tenant users see the approved value after reload. | root admin | Branding display name is persisted for the selected tenant. |  |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | CAP-BRANDING-001 | root | existing-approved | Root-admin tenant branding update. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-001 | S-001 / AC-S001-01 | tenants public read seam | feature-public-seam | existing | service contract test | integration test proves selected tenant lookup before branding update |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | root admin | allowed and denied root capability | active, expired session | active tenant, soft-deleted tenant | valid display name, empty string rejection | update existing branding | tenant seam unavailable, stale tenant | security, privacy, audit, resilience |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | root admin active and denied | CAP-BRANDING-001 | persistence-level | create TC for update and deny path | yes |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-001 | S-001 | API contract | create route contract | api-contract-maintainer | yes |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-001 | ready-for-task-breakdown | Capability and proof obligations are mapped. |
`;

const validTaskPacket = `# Task Breakdown Packet: Tenant Branding

## Status

- Packet status:
  \`ready-for-delivery-handoff\`
- Source Story Breakdown packet:
  docs/workspace/story-breakdown/tenant-branding.md
- Selected Story ID(s):
  S-001

## Source Story Handoff

- Story packet validation status:
  \`pass\`
- Selected story handoff status:
  \`ready-for-task-breakdown\`
- Story scope preserved:
  \`yes\`
- Acceptance criteria preserved:
  \`yes\`
- Product intent preserved:
  \`yes\`
- Technical Steering architecture preserved:
  \`yes\`
- Architecture invention check:
  \`consumes-story-and-steering-only\`
- Capability rows complete for implementation tasks:
  \`yes\`
- Story blockers carried forward:
  none

## Steering Classification Reconciliation

| Classification ID | Classification | Required Downstream Signal | Covered By Task ID | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- | --- |
| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | user-value | DEV:backend | Root admin updates branding | As a root admin, I need to update a tenant branding display name so tenant users see the approved value after reload. | Branding display name is persisted for the selected tenant. | One DEV:backend task can deliver the approved persistence and API contract slice. |

## Story Acceptance Criteria Snapshot

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |

## Story Capability And Artifact Snapshot

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Story Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | CAP-BRANDING-001 | root | existing-approved | API contract, data dictionary, permission mapping |

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | S-001 | DEV:backend | Add root-admin tenant branding persistence update using the approved tenants public seam. | src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts | DEV:frontend rendering, public asset delivery, tenant-scoped self-service branding | not-applicable: first task for story | tenants public read seam | queued-for-delivery |

## Task Size Guardrail

| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | single-behavior | 1 | One acceptance criterion covers the persistence update behavior. | Durable tenant branding display name update | tenantConfiguration DEV:backend seam | Persistence integration proves the selected tenant update. | no | Single proof story and one DEV:backend seam. |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S001-01 | human-decision | Stop if tenant branding ownership is not tenantConfiguration. | Ask requester and revisit Technical Steering. | no | Ownership mismatch would change the approved seam. |

## Exact Starting Context

| Task ID | Files / Routes / Canonicals To Inspect | Existing Seams To Consume | Governing Source Artifacts |
| --- | --- | --- | --- |
| T-S001-01 | src/features/tenantConfiguration/domain/service.ts; src/features/tenantConfiguration/transport/router.ts | tenants public read seam | Story Breakdown S-001; CAP-BRANDING-001; API contract |

## Frontend Architecture Decision Reconciliation

| Task ID | Source Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Source Steering Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Layer 2 classified this as backend-only. |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-S001-01 | not-applicable | not-applicable: DEV:backend task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: DEV:backend task has no DEV:frontend or GOV:design-system sub-standard proof |

## Frontend Performance Posture

| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |
| --- | --- | --- | --- |

## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | not-applicable | not-applicable: DEV:backend task has no governed UI seam | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task |

## Frontend Adoption Contract

| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Frontend Security Evidence

| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |
| --- | --- | --- | --- | --- | --- |

## Frontend Permission Rendering Evidence

| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |
| --- | --- | --- | --- | --- | --- |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |

## Vertical Slice Coupling

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Backend Implementation Approach

| Task ID | Feature Owner | Capability File Strategy | Expected Files / Layers | Layer Responsibilities | Public Seam / Manifest Impact | Formatting / Generated Artifact Expectations |
| --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | src/features/tenantConfiguration | new-capability-file | domain/updateBranding.ts; transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | domain owns branding rule, transport routes, persistence test proves repository behavior | no new public seam; manifest unchanged unless export changes | repo formatter and no generated graph change expected |

## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | not-applicable-with-rationale | not-applicable: DEV:backend task has no schema change | not-applicable: no live data transform | not-applicable: no per-row migration | not-applicable: no rejected rows possible | not-applicable: no migration file touched | not-applicable: no SQL execution change | not-applicable: DEV:backend persistence proof only | not-applicable: no harness impact |

## Tight Allowed Write Envelope

| Task ID | Envelope Class | Exact Files Or Narrow Patterns | Broad Write Rationale |
| --- | --- | --- | --- |
| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |

## Task-Specific Proof Plan

| Task ID | Proof Specificity | Task-Specific Test / Scenario / Evidence Name | Broad Proof Rationale |
| --- | --- | --- | --- |
| T-S001-01 | task-specific | tenantConfiguration persistence update selected tenant branding display name | not-applicable: task-specific proof is named |

## Test-Only Coverage Contract

| Task ID | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Forbidden Assumptions

| Task ID | Forbidden Assumption | Escalation Path |
| --- | --- | --- |
| T-S001-01 | Do not invent DEV:frontend rendering, public asset delivery, or tenant self-service behavior. | Stop and create separate Story/Task Breakdown coverage. |

## Task-Type Approval Guardrails

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |
| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |
| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |
| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |
| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |
| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |
| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |
| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |
| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |
| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |

## Code Placement And Extraction Review

| Task ID | Placement Decision | Current Owner | Proposed Owner | Extraction Needed | Required Supplemental Guardrail References | Compatibility Proof | Approval Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |

## Allowed Write Set Classification

| Task ID | Path Pattern | Write Class | Reason |
| --- | --- | --- | --- |
| T-S001-01 | src/features/tenantConfiguration/domain/updateBranding.ts | feature-local | Owning feature domain capability file. |
| T-S001-01 | src/features/tenantConfiguration/transport/rootAdminRoutes.ts | feature-local | Owning feature root-admin transport seam. |
| T-S001-01 | tests/integration/tenantConfiguration/persistence.test.ts | test | Persistence regression for approved story AC. |

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S001-01 | DEV:frontend rendering or public asset delivery | Explicit non-goals for the DEV:backend task. |

## Task Acceptance Criteria Coverage

| Task ID | AC IDs Covered | Coverage Notes |
| --- | --- | --- |
| T-S001-01 | AC-S001-01 | Covers the approved persistence and authorization acceptance criterion. |

## Task Capability Coverage

| Task ID | Capability Matrix Row(s) Covered | Capability Coverage Status | Notes |
| --- | --- | --- | --- |
| T-S001-01 | CAP-BRANDING-001 | approved | Capability row is approved in the source story packet. |

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S001-01 | not-applicable: first task | Story has no prior delivery task dependency. | no |

## Shared Seams

| Task ID | Shared Seam | Seam Type | Existing Or New | Required Contract / Ownership Proof |
| --- | --- | --- | --- | --- |
| T-S001-01 | tenants public read seam | feature-public-seam | existing | integration test proves selected tenant lookup before branding update |

## Artifact Obligations

| Task ID | Required Artifact | Required Action | Owner Skill Or Workflow | Blocks Delivery Handoff |
| --- | --- | --- | --- | --- |
| T-S001-01 | API contract, data dictionary, permission mapping | refresh source-independent contract artifacts for the approved branding update | api-contract-maintainer, data-dictionary-maintainer | yes |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S001-01 | persistence-level, contract-level | npx vitest run tests/integration/tenantConfiguration/persistence.test.ts; npm run typecheck | persistence fixture must use the same selected tenant shape as production repository reads |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |

## Branch Worktree Bootstrap Strategy

| Task ID | Branch Name | Worktree Strategy | Bootstrap Artifact | Base Ref | Base Commit Policy | Promotion Target |
| --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | codex/s001-tenant-branding-backend | current dedicated task branch | docs/workspace/chat-bootstraps/2026-04-29-s001-tenant-branding-backend.md | origin/main | record exact base commit before Delivery edits | main after promote guardrail |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S001-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated DEV:backend task. |
`;

const frontendSourceRow =
  "| root-admin marketing journey | root-admin | marketing | campaign-management | deep-link-only | root-operator | app-shell | journey | journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator | manual-shell-registry | curated-webAppHierarchyBuilder | transitional-accepted | feature-local-state-machine | local-legacy-shell | signed-off-seam-exists | shell-registry-update | module-journey-files | ready | Layer 2 places journey behavior in module files. |";

const frontendDecisionRow =
  "| T-S001-01 | root-admin marketing journey | root-admin | marketing | campaign-management | deep-link-only | root-operator | app-shell | journey | journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator | manual-shell-registry | curated-webAppHierarchyBuilder | transitional-accepted | feature-local-state-machine | local-legacy-shell | signed-off-seam-exists | shell-registry-update | module-journey-files | ready | Layer 2 places journey behavior in module files. |";

const backendFrontendSourceRow =
  "| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |";

const backendFrontendDecisionRow =
  "| T-S001-01 | tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Layer 2 classified this as backend-only. |";

function frontendStoryPacketWith(frontendRow: string): string {
  return sourceStoryPacket
    .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | root-admin marketing journey | feature-local | src/frontend/rootAdminShell/assets/modules/marketing | approved | DEV:frontend |")
    .replace(backendFrontendSourceRow, frontendRow)
    .replace("| not-applicable | no | Backend-only steering has no browser security posture. | not-applicable: no DEV:frontend task | no |", "| sensitive-rendering | yes | Layer 2 says the root-admin journey renders privileged campaign data. | permission-aware rendering evidence | yes |")
    .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Marketing journey page changes. | DEV:frontend |");
}

function frontendTaskPacketWith(decisionRow: string): string {
  return validTaskPacket
    .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:frontend | T-S001-01 | covered | Frontend task preserves Layer 2 module placement. |")
    .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:frontend | DEV:frontend rendered surface | T-S001-01 | Covered by DEV:frontend delivery task. |")
    .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:frontend |")
    .replace(
      "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
      "src/frontend/rootAdminShell/assets/modules/marketing/campaignManagement/page.mjs",
    )
    .replace(backendFrontendDecisionRow, decisionRow)
    .replace(
      "| T-S001-01 | not-applicable | not-applicable: DEV:backend task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: DEV:backend task has no DEV:frontend or GOV:design-system sub-standard proof |",
      "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | canonical screenshot/evidence artifact root-admin-marketing-campaign-default.png |",
    )
    .replace(
      "## Frontend Performance Posture\n\n| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |\n| --- | --- | --- | --- |",
      "## Frontend Performance Posture\n\n| Task ID | Performance Posture | Evidence / Proof Plan | Rationale |\n| --- | --- | --- | --- |\n| T-S001-01 | static-low-risk | canonical render proof is sufficient for static card composition; no performance-specific proof needed | Static rendering only, no list, asset-heavy, route initialization, animation, or repeated interaction work. |",
    )
    .replace(
      "| T-S001-01 | not-applicable | not-applicable: DEV:backend task has no governed UI seam | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task |",
      "| T-S001-01 | consumes-existing-seam | /design-system/components/tenant-branding-card export TenantBrandingCard | TenantBrandingCard render structure | no behavior controller for static card | card role/name semantics owned by DS | canonical screenshot tenant-branding-card-default.png | DEV:frontend imports TenantBrandingCard renderer |",
    )
    .replace(
      "## Frontend Adoption Contract\n\n| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |\n| --- | --- | --- | --- | --- | --- | --- | --- |",
      "## Frontend Adoption Contract\n\n| Task ID | Consumed DS Render Seam | Consumed DS Behavior / Controller Seam | Consumed DS Accessibility Semantics | Consumed DS Style / CSS Seam | Allowed App-Local Composition / Data Binding | Forbidden Local Reconstruction | Adoption Proof Route / Scenario |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| T-S001-01 | TenantBrandingCard render export from /design-system/components/tenant-branding-card | not-applicable: static card has no behavior/controller seam | TenantBrandingCard card role/name semantics | GOV:design-system tenant-branding-card CSS seam | app passes approved campaign projection data and composes route shell only | must not copy markup, controller, ARIA, or CSS from the GOV:design-system seam | /root-admin/marketing campaign-management default route scenario |",
    )
    .replace(
      "## Frontend Security Evidence\n\n| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |\n| --- | --- | --- | --- | --- | --- |",
      "## Frontend Security Evidence\n\n| Task ID | Security Area | Source Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Layer 4 Evidence Plan / Blocking Reason |\n| --- | --- | --- | --- | --- | --- |\n| T-S001-01 | sensitive-rendering | yes | Layer 2 says the root-admin journey renders privileged campaign data. | permission-aware rendering evidence | Browser scenario proves allowed, denied, expired, and unauthorized sensitive rendering states. |",
    )
    .replace(
      "## Frontend Permission Rendering Evidence\n\n| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |\n| --- | --- | --- | --- | --- | --- |",
      "## Frontend Permission Rendering Evidence\n\n| Task ID | Sensitive Rendering Scope | Allowed State Proof | Denied / Unauthorized State Proof | Expired / Unauthenticated State Proof | Cross-Tenant Denial Proof |\n| --- | --- | --- | --- | --- | --- |\n| T-S001-01 | privileged root-admin campaign data | allowed root operator sees campaign page | denied operator sees unauthorized state | expired session sees unauthenticated state | not-applicable: root operator task has no tenant-scoped rendering |",
    )
    .replace(
      "## Frontend Runtime Data And Mock Honesty\n\n| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |\n| --- | --- | --- | --- | --- | --- |",
      "## Frontend Runtime Data And Mock Honesty\n\n| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |\n| --- | --- | --- | --- | --- | --- |\n| T-S001-01 | docs/api-contracts/root-admin-campaigns.md projection response | browser fixture copied from contract example | served /v1/root-admin/campaigns payload captured in browser scenario | not-applicable: live payload evidence required | mock-honesty: fixture mirrors contract payload and does not invent fallback behavior |",
    )
    .replace(
      "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      "| T-S001-01 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed for architecture placement and GOV:design-system seam consumption. |",
    )
    .replace(
      "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
      "| T-S001-01 | frontend-architecture-classification | pass | Layer 2 DEV:frontend classification is copied by source scope element. |\n| T-S001-01 | frontend-source-placement | pass | Work stays in approved module/journey files. |\n| T-S001-01 | frontend-state-owner | pass | State owner is feature-local-state-machine and no URL replay state is introduced. |\n| T-S001-01 | frontend-route-topology | pass | Route/topology posture follows Layer 2 locator and authority decisions. |\n| T-S001-01 | frontend-design-system-seam | pass | Signed-off visual seam is named. |\n| T-S001-01 | frontend-adoption-contract | pass | Adoption contract names consumed render, behavior, accessibility, and CSS seams. |\n| T-S001-01 | frontend-no-app-css | pass | No app CSS is allowed. |\n| T-S001-01 | frontend-no-copied-behavior | pass | No copied controller behavior is allowed. |\n| T-S001-01 | frontend-accessibility-state | pass | Accessibility state remains unchanged. |\n| T-S001-01 | frontend-rendered-proof | pass | Visual rendering proof is required. |\n| T-S001-01 | frontend-security-evidence | pass | Browser security posture evidence is copied from Layer 2. |\n| T-S001-01 | frontend-permission-rendering | pass | Allowed, denied, expired, and unauthenticated states are required. |\n| T-S001-01 | frontend-runtime-data-mock-honesty | pass | Contract, runtime payload, and mock-honesty proof are required. |\n| T-S001-01 | frontend-runtime-evidence | pass | Served asset evidence is required. |\n| T-S001-01 | frontend-artifacts | pass | Frontend architecture artifact obligations are carried. |",
    );
}

const verticalSliceCouplingRow =
  "| T-S001-01 | journey behavior campaign publish workflow | DEV:backend API service seam src/features/campaigns/contract/updateCampaign.ts | DEV:frontend route render seam src/frontend/rootAdminShell/assets/modules/marketing/campaignManagement/page.mjs | API contract docs/api-contracts/root-admin-campaigns.md projection payload | browser journey scenario campaign publish workflow shows saved DEV:backend state in route | inseparable because the same journey proof must confirm DEV:backend mutation and DEV:frontend render consume the same response payload | split rejection rationale: DEV:backend and DEV:frontend proof are inseparable for this one journey behavior; separate tasks would not prove the cross-boundary payload together |";

function verticalSliceStoryPacketWith(frontendRow: string): string {
  return frontendStoryPacketWith(frontendRow)
    .replace(
      "| CLS-001 | root-admin marketing journey | feature-local | src/frontend/rootAdminShell/assets/modules/marketing | approved | DEV:frontend |",
      "| CLS-001 | root-admin marketing journey | feature-local | src/frontend/rootAdminShell/assets/modules/marketing | approved | DEV:vertical-slice |",
    )
    .replace(
      "| S-001 | DEV:frontend rendered surface | yes | Marketing journey page changes. | DEV:frontend |",
      "| S-001 | DEV:frontend rendered surface | yes | Marketing journey page changes. | DEV:vertical-slice |",
    );
}

function verticalSliceTaskPacketWith(couplingRow: string): string {
  return frontendTaskPacketWith(frontendDecisionRow)
    .replace("| CLS-001 | feature-local | DEV:frontend | T-S001-01 | covered |", "| CLS-001 | feature-local | DEV:vertical-slice | T-S001-01 | covered |")
    .replace("| S-001 | DEV:frontend | DEV:frontend rendered surface | T-S001-01 |", "| S-001 | DEV:vertical-slice | DEV:frontend rendered surface | T-S001-01 |")
    .replace("| T-S001-01 | S-001 | DEV:frontend |", "| T-S001-01 | S-001 | DEV:vertical-slice |")
    .replace(
      "| T-S001-01 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed for architecture placement and GOV:design-system seam consumption. |",
      "| T-S001-01 | DEV:vertical-slice | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/vertical-slice-task-guardrail.md | approved | Vertical slice guardrail reviewed for inseparable DEV:backend/DEV:frontend journey proof. |",
    )
    .replace(
      "| T-S001-01 | frontend-architecture-classification | pass | Layer 2 DEV:frontend classification is copied by source scope element. |\n| T-S001-01 | frontend-source-placement | pass | Work stays in approved module/journey files. |\n| T-S001-01 | frontend-state-owner | pass | State owner is feature-local-state-machine and no URL replay state is introduced. |\n| T-S001-01 | frontend-route-topology | pass | Route/topology posture follows Layer 2 locator and authority decisions. |\n| T-S001-01 | frontend-design-system-seam | pass | Signed-off visual seam is named. |\n| T-S001-01 | frontend-adoption-contract | pass | Adoption contract names consumed render, behavior, accessibility, and CSS seams. |\n| T-S001-01 | frontend-no-app-css | pass | No app CSS is allowed. |\n| T-S001-01 | frontend-no-copied-behavior | pass | No copied controller behavior is allowed. |\n| T-S001-01 | frontend-accessibility-state | pass | Accessibility state remains unchanged. |\n| T-S001-01 | frontend-rendered-proof | pass | Visual rendering proof is required. |\n| T-S001-01 | frontend-security-evidence | pass | Browser security posture evidence is copied from Layer 2. |\n| T-S001-01 | frontend-permission-rendering | pass | Allowed, denied, expired, and unauthenticated states are required. |\n| T-S001-01 | frontend-runtime-data-mock-honesty | pass | Contract, runtime payload, and mock-honesty proof are required. |\n| T-S001-01 | frontend-runtime-evidence | pass | Served asset evidence is required. |\n| T-S001-01 | frontend-artifacts | pass | Frontend architecture artifact obligations are carried. |",
      "| T-S001-01 | vertical-inseparable-journey | pass | One journey proof requires DEV:backend and DEV:frontend evidence together. |\n| T-S001-01 | vertical-backend-seam | pass | Backend API seam is named. |\n| T-S001-01 | vertical-frontend-seam | pass | Frontend route/render seam is named. |\n| T-S001-01 | vertical-api-data-shape | pass | API/data contract is named. |\n| T-S001-01 | vertical-browser-workflow | pass | Browser journey proof is named. |\n| T-S001-01 | vertical-security-evidence | pass | Browser security posture evidence is carried. |\n| T-S001-01 | vertical-permission-rendering | pass | Permission rendering evidence is carried when sensitive. |\n| T-S001-01 | vertical-runtime-data-mock-honesty | pass | Runtime data/mock honesty is carried. |\n| T-S001-01 | vertical-mock-honesty | pass | Fixtures match live API/persistence shape. |\n| T-S001-01 | vertical-artifacts | pass | Artifact ledger is carried. |\n| T-S001-01 | vertical-proof-commands | pass | API and browser proof commands are named. |",
    )
    .replace(
      "## Vertical Slice Coupling\n\n| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n\n",
      `## Vertical Slice Coupling\n\n| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${couplingRow ? `${couplingRow}\n` : ""}\n`,
    );
}

const testOnlyCoverageRow =
  "| T-S001-01 | docs/prd/test_cases/root-admin-test-cases.md | AC-ROOT-ADMIN-E2E-001 | e2e journey test | root-admin allowed and denied operator journey | seeded root-auth/root-admin runtime data | mock-honesty: runtime harness data mirrors production root session and root-user API contracts | no-production-change | npx vitest run tests/e2e/rootAdmin/operator-journeys.test.ts |";

const testOnlyMatrixRow =
  "| T-S001-01 | /root-admin and /v1/root-users root-admin object | root actor allowed; expired session denied; unauthenticated actor denied | RootUserAdmin capability allowed; missing capability denied | active object visible; deleted object denied through normal path | root boundary only; tenant actor denied; cross-tenant not-applicable: root-owned surface | denied unauthenticated, expired, and missing capability states | not-applicable: no tenant-scoped object in this root-owned task | none: required allowed and denied states covered |";

const testSuiteAlignmentRow =
  "| T-S001-01 | npm run test:traceability reports ROOT-USERS E2E mismatch | missing-documented-test-case | docs/prd/test_cases/2026-03-29-0002-root-users-backend-test-cases.md; docs/workspace/qa/root-admin-test-backlog.md | tests/e2e/rootAdmin/operator-journeys.test.ts | docs-and-test-labels-only | no new proof required; split any newly required proof into TEST:test-only | npm run test:traceability | before/after traceability evidence for ROOT-USERS E2E is recorded |";

function testOnlyStoryPacket(): string {
  return sourceStoryPacket
    .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | root-admin e2e proof | test | tests/e2e/rootAdmin | approved | TEST:test-only |")
    .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | root-admin e2e proof gap | yes | Root-admin journey proof must cover allowed and denied states. | TEST:test-only |");
}

function testOnlyTaskPacketWith(input: {
  coverageRow?: string;
  matrixRow?: string;
  scope?: string;
} = {}): string {
  const coverageRow = input.coverageRow ?? testOnlyCoverageRow;
  const matrixRow = input.matrixRow ?? testOnlyMatrixRow;
  const scope = input.scope ?? "Add root-admin e2e proof for allowed and denied operator journeys.";

  return validTaskPacket
    .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | test | TEST:test-only | T-S001-01 | covered | Test-only task preserves proof-only classification. |")
    .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | TEST:test-only | root-admin e2e proof gap | T-S001-01 | Covered by TEST:test-only delivery task. |")
    .replace("| T-S001-01 | S-001 | DEV:backend | Add root-admin tenant branding persistence update using the approved tenants public seam. |", `| T-S001-01 | S-001 | TEST:test-only | ${scope} |`)
    .replace(
      "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
      "tests/e2e/rootAdmin/operator-journeys.test.ts",
    )
    .replace(
      "| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |",
      "| T-S001-01 | exact-files | tests/e2e/rootAdmin/operator-journeys.test.ts | not-applicable: exact test file only |",
    )
    .replace(
      "| T-S001-01 | task-specific | tenantConfiguration persistence update selected tenant branding display name | not-applicable: task-specific proof is named |",
      "| T-S001-01 | task-specific | root-admin allowed and denied operator e2e journey | not-applicable: task-specific proof is named |",
    )
    .replace(
      "## Test-Only Coverage Contract\n\n| Task ID | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n\n",
      `## Test-Only Coverage Contract\n\n| Task ID | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${coverageRow ? `${coverageRow}\n` : ""}\n`,
    )
    .replace(
      "## Capability Permission / State Matrix\n\n| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n\n",
      `## Capability Permission / State Matrix\n\n| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Not Applicable Rationale | Missing Coverage / Follow-Up Task |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${matrixRow ? `${matrixRow}\n` : ""}\n`,
    )
    .replace(
      "## Debt Health Summary Commands\n\n| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |\n| --- | --- | --- | --- | --- | --- |\n\n",
      "## Debt Health Summary Commands\n\n| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |\n| --- | --- | --- | --- | --- | --- |\n| T-S001-01 | npm run test:coverage-strength | debt-found | root-admin e2e coverage breadth reviewed; no new TEST:test-only debt introduced by this task | accepted-deferred | QA roadmap owns broader suite-strength follow-up |\n\n",
    )
    .replace(
      "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      "| T-S001-01 | TEST:test-only | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/test-only-task-guardrail.md | approved | Test-only guardrail reviewed for traceability, proof layer, permission/state matrix, and no behavior changes. |",
    )
    .replace(
      "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
      "| T-S001-01 | test-traceability | pass | AC-ROOT-ADMIN-E2E-001 is named. |\n| T-S001-01 | test-proof-layer | pass | e2e journey test layer is named. |\n| T-S001-01 | test-permission-state-matrix | pass | Root-admin actor, permission, object, and boundary states are covered. |\n| T-S001-01 | test-mock-honesty | pass | Runtime harness data mirrors production contracts. |\n| T-S001-01 | test-no-behavior-change | pass | No production behavior change allowed. |\n| T-S001-01 | test-command | pass | Focused vitest command is named. |",
    );
}

function testSuiteAlignmentStoryPacket(): string {
  return sourceStoryPacket
    .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | root-users traceability alignment | test | docs/prd/test_cases; tests/e2e/rootAdmin | approved | TEST:test-suite-alignment |")
    .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | root-users traceability alignment | yes | Existing e2e proof and PRD test-case documentation must align. | TEST:test-suite-alignment |");
}

function testSuiteAlignmentTaskPacketWith(input: {
  alignmentRow?: string;
  scope?: string;
  allowedWriteSet?: string;
} = {}): string {
  const alignmentRow = input.alignmentRow ?? testSuiteAlignmentRow;
  const scope = input.scope ?? "Align root-users e2e PRD test-case traceability with existing executable proof.";
  const allowedWriteSet =
    input.allowedWriteSet ??
    "docs/prd/test_cases/2026-03-29-0002-root-users-backend-test-cases.md, docs/workspace/qa/root-admin-test-backlog.md, tests/e2e/rootAdmin/operator-journeys.test.ts";

  return validTaskPacket
    .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | test | TEST:test-suite-alignment | T-S001-01 | covered | Alignment task preserves test/documentation traceability classification. |")
    .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | TEST:test-suite-alignment | root-users traceability alignment | T-S001-01 | Covered by test suite alignment task. |")
    .replace("| T-S001-01 | S-001 | DEV:backend | Add root-admin tenant branding persistence update using the approved tenants public seam. |", `| T-S001-01 | S-001 | TEST:test-suite-alignment | ${scope} |`)
    .replace(
      "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
      allowedWriteSet,
    )
    .replace(
      "| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |",
      "| T-S001-01 | exact-files | docs/prd/test_cases/2026-03-29-0002-root-users-backend-test-cases.md; docs/workspace/qa/root-admin-test-backlog.md; tests/e2e/rootAdmin/operator-journeys.test.ts | not-applicable: exact files only |",
    )
    .replace(
      "| T-S001-01 | task-specific | tenantConfiguration persistence update selected tenant branding display name | not-applicable: task-specific proof is named |",
      "| T-S001-01 | task-specific | ROOT-USERS E2E traceability alignment before/after evidence | not-applicable: task-specific proof is named |",
    )
    .replace(
      "## Test Suite Alignment Contract\n\n| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n\n",
      `## Test Suite Alignment Contract\n\n| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${alignmentRow ? `${alignmentRow}\n` : ""}\n`,
    )
    .replace(
      "## Debt Health Summary Commands\n\n| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |\n| --- | --- | --- | --- | --- | --- |\n\n",
      "## Debt Health Summary Commands\n\n| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |\n| --- | --- | --- | --- | --- | --- |\n| T-S001-01 | npm run test:coverage-strength | debt-found | traceability labels aligned; broader coverage-strength debt unchanged | accepted-deferred | QA roadmap owns broader suite-strength follow-up |\n\n",
    )
    .replace(
      "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      "| T-S001-01 | TEST:test-suite-alignment | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/test-suite-alignment-task-guardrail.md | approved | Test suite alignment guardrail reviewed for source map, mismatch class, edit envelope, split decision, and traceability command. |",
    )
    .replace(
      "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
      "| T-S001-01 | test-alignment-source-map | pass | Docs and executable test targets are named. |\n| T-S001-01 | test-alignment-mismatch-class | pass | Mismatch class is missing-documented-test-case. |\n| T-S001-01 | test-alignment-edit-envelope | pass | Edits are limited to docs and test labels. |\n| T-S001-01 | test-alignment-no-production-change | pass | No production behavior change is allowed. |\n| T-S001-01 | test-alignment-split-new-proof | pass | Newly required proof splits to TEST:test-only. |\n| T-S001-01 | test-alignment-traceability-command | pass | npm run test:traceability is required. |",
    );
}

function evidenceStoryPacket(): string {
  return sourceStoryPacket
    .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding QA evidence | feature-local | docs/workspace/qa | approved | EVIDENCE:qa-evidence |")
    .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | runtime QA evidence hardening | yes | Tenant branding runtime evidence and mock-honesty status must be captured. | EVIDENCE:qa-evidence |");
}

function evidenceTaskPacketWith(input: {
  allowedWriteSet?: string;
  debtSummaryRow?: string;
} = {}): string {
  const allowedWriteSet = input.allowedWriteSet ?? "docs/workspace/qa/tenant-branding-runtime-evidence.md";
  const debtSummaryRow =
    input.debtSummaryRow ??
    "| T-S001-01 | npm run test:coverage-strength | debt-found | runtime evidence inventory updated; broader coverage-strength debt unchanged | accepted-deferred | QA roadmap owns broader suite-strength follow-up |";

  return validTaskPacket
    .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | EVIDENCE:qa-evidence | T-S001-01 | covered | QA evidence task preserves Layer 2 proof signal without changing implementation. |")
    .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | EVIDENCE:qa-evidence | runtime QA evidence hardening | T-S001-01 | Covered by QA evidence task. |")
    .replace("| T-S001-01 | S-001 | DEV:backend | Add root-admin tenant branding persistence update using the approved tenants public seam. |", "| T-S001-01 | S-001 | EVIDENCE:qa-evidence | Capture runtime QA evidence and mock-honesty status for tenant branding update. |")
    .replace(
      "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
      allowedWriteSet,
    )
    .replace(
      "| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |",
      `| T-S001-01 | exact-files | ${allowedWriteSet} | not-applicable: exact evidence artifact only |`,
    )
    .replace(
      "| T-S001-01 | task-specific | tenantConfiguration persistence update selected tenant branding display name | not-applicable: task-specific proof is named |",
      "| T-S001-01 | task-specific | tenant branding runtime evidence artifact plus mock-honesty comparison | not-applicable: task-specific evidence target is named |",
    )
    .replace(
      "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      "| T-S001-01 | EVIDENCE:qa-evidence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/qa-evidence-task-guardrail.md | approved | QA evidence guardrail reviewed for runtime proof, command plan, mock honesty, evidence status, and coverage-strength summary. |",
    )
    .replace(
      "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
      "| T-S001-01 | qa-proof-target | pass | Tenant branding runtime evidence artifact and payload shape are named. |\n| T-S001-01 | qa-command-plan | pass | Focused runtime proof command is named. |\n| T-S001-01 | qa-runtime-evidence | pass | Live API/projection evidence source is named. |\n| T-S001-01 | qa-mock-honesty | pass | Mock fixture is compared against live payload shape. |\n| T-S001-01 | qa-evidence-status | pass | Evidence status is recorded as passing, partial, or blocked. |\n| T-S001-01 | qa-coverage-strength-summary | pass | npm run test:coverage-strength summary is required for QA evidence inventory impact. |",
    )
    .replace(
      "| T-S001-01 | src/features/tenantConfiguration/domain/updateBranding.ts | feature-local | Owning feature domain capability file. |\n| T-S001-01 | src/features/tenantConfiguration/transport/rootAdminRoutes.ts | feature-local | Owning feature root-admin transport seam. |\n| T-S001-01 | tests/integration/tenantConfiguration/persistence.test.ts | test | Persistence regression for approved story AC. |",
      `| T-S001-01 | ${allowedWriteSet} | docs-artifact | Runtime QA evidence artifact for the approved story AC. |`,
    )
    .replace(
      "| T-S001-01 | persistence-level, contract-level | npx vitest run tests/integration/tenantConfiguration/persistence.test.ts; npm run typecheck | persistence fixture must use the same selected tenant shape as production repository reads |",
      "| T-S001-01 | runtime-level, mock-honesty | npm run test:coverage-strength; npx playwright test tests/visual/tenant-branding-runtime.spec.ts | runtime payload evidence must match production API/projection shape; mocks may not invent fallback behavior |",
    )
    .replace(
      "## Debt Health Summary Commands\n\n| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |\n| --- | --- | --- | --- | --- | --- |\n\n",
      `## Debt Health Summary Commands\n\n| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |\n| --- | --- | --- | --- | --- | --- |\n${debtSummaryRow ? `${debtSummaryRow}\n` : ""}\n`,
    );
}

describe("task breakdown validation", () => {
  it("passes an isolated task mapped to an approved story and acceptance criterion", () => {
    expect(validateTaskBreakdownContent(validTaskPacket, sourceStoryPacket)).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks missing required headings", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("## Proof And Command Plan", "## Proof Plan"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing heading: ## Proof And Command Plan");
  });

  it("blocks queued tasks without task-type guardrail routing", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has no task-type approval guardrail row");
  });

  it("blocks task-type guardrails that route to the wrong reference", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("backend-task-guardrail.md", "frontend-task-guardrail.md"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 must reference backend-task-guardrail.md");
  });

  it("blocks task-type guardrail not-applicable because every task must route to its type guardrail", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | not-applicable: DEV:backend is simple | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 has invalid task-type guardrail approval status: not-applicable: DEV:backend is simple",
    );
  });

  it("blocks queued tasks missing a required granular guardrail check", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing guardrail check backend-authz-tenant-lifecycle");
  });

  it("blocks queued tasks without deep-delivery task size guardrails", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "## Task Size Guardrail\n\n| Task ID | Task Grain | AC Count | AC Count Rationale | Primary Behavior / Decision / Proof Target | Primary Seam | Main Proof Story | Additional Behaviors Present | Why Not Further Split |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| T-S001-01 | single-behavior | 1 | One acceptance criterion covers the persistence update behavior. | Durable tenant branding display name update | tenantConfiguration DEV:backend seam | Persistence integration proves the selected tenant update. | no | Single proof story and one DEV:backend seam. |\n\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing heading: ## Task Size Guardrail");
    expect(result.errors).toContain("T-S001-01 queued task has no task size guardrail row");
  });

  it("blocks queued tasks that cover more than two acceptance criteria", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket
        .replace(
          "| T-S001-01 | single-behavior | 1 | One acceptance criterion covers the persistence update behavior. | Durable tenant branding display name update | tenantConfiguration DEV:backend seam | Persistence integration proves the selected tenant update. | no | Single proof story and one DEV:backend seam. |",
          "| T-S001-01 | single-behavior | 3 | Three acceptance criteria are easier together. | Durable tenant branding display name update | tenantConfiguration DEV:backend seam | Persistence integration proves the selected tenant update. | no | Same file is easier. |",
        )
        .replace("| T-S001-01 | AC-S001-01 | Covers the approved persistence and authorization acceptance criterion. |", "| T-S001-01 | AC-S001-01, AC-S001-02, AC-S001-03 | Covers too much. |"),
      sourceStoryPacket.replace(
        "| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |",
        "| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |\n| AC-S001-02 | S-001 | Root admin update records audit evidence. | contract-level | audit | audit docs |\n| AC-S001-03 | S-001 | Root admin update refreshes projection evidence. | contract-level | integration | API contract |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 covers more than two acceptance criteria and must be split");
  });

  it("blocks queued tasks with coarse family/state/interaction scope without split rationale", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "Build the full component family with all states, interactions and evidence.",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain('T-S001-01 scope contains coarse phrase "all states" without split rationale');
    expect(result.errors).toContain('T-S001-01 scope contains coarse phrase "full component family" without split rationale');
  });

  it("blocks queued tasks without stop condition rows", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "## Decision Escalation / Stop Conditions\n\n| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |\n| --- | --- | --- | --- | --- | --- |\n| T-S001-01 | human-decision | Stop if tenant branding ownership is not tenantConfiguration. | Ask requester and revisit Technical Steering. | no | Ownership mismatch would change the approved seam. |\n\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing heading: ## Decision Escalation / Stop Conditions");
    expect(result.errors).toContain("T-S001-01 queued task has no decision escalation / stop condition row");
  });

  it("blocks broad proof as the only proof for normal implementation tasks", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | task-specific | tenantConfiguration persistence update selected tenant branding display name | not-applicable: task-specific proof is named |",
        "| T-S001-01 | broad-with-rationale | npm test | Broad suite seems fine. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 broad proof requires an intentionally broad task type");
  });

  it("blocks DOC task types that try to own source implementation paths", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DOC:api-contract |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 DOC task type must not own source implementation write paths");
  });

  it("blocks DEV task types that try to own broad artifact sweeps", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
        "docs/**",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 DEV task type must not own broad source-independent artifact sweeps");
  });

  it("blocks EVIDENCE task types that try to patch production behavior", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | EVIDENCE:qa-evidence |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 EVIDENCE task type must not patch production behavior");
  });

  it("passes an isolated EVIDENCE task with runtime evidence and coverage-strength summary", () => {
    expect(validateTaskBreakdownContent(evidenceTaskPacketWith(), evidenceStoryPacket())).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks EVIDENCE task types without coverage-strength summary evidence", () => {
    const result = validateTaskBreakdownContent(
      evidenceTaskPacketWith({ debtSummaryRow: "" }),
      evidenceStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 EVIDENCE:qa-evidence task has no debt health summary command row");
  });

  it("blocks EVIDENCE task types that try to own executable test changes", () => {
    const result = validateTaskBreakdownContent(
      evidenceTaskPacketWith({ allowedWriteSet: "tests/visual/tenant-branding-runtime.spec.ts" }),
      evidenceStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 EVIDENCE:qa-evidence must not own executable test changes; use TEST:test-only or TEST:test-suite-alignment");
  });

  it("blocks EVIDENCE task types that try to change durable authority", () => {
    const result = validateTaskBreakdownContent(
      evidenceTaskPacketWith({ allowedWriteSet: "docs/standards/qa-release-gate.md" }),
      evidenceStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 EVIDENCE:qa-evidence must not change durable standards or architecture authority; use GOV:standards-update or GOV:architecture-update");
  });

  it("blocks non-design-system GOV task types that try to own runtime implementation paths", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | GOV:architecture-update |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 GOV task type must not own product/runtime implementation write paths");
  });

  it("blocks standards compliance tasks that try to change standards authority", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket
        .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DOC:standards-compliance |")
        .replace(
          "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
          "docs/standards/QA-RELEASE-GATE.md",
        ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 DOC:standards-compliance must not change standards authority; use GOV:standards-update");
  });

  it("blocks broad DEV:frontend write envelopes without approved broad-scope rationale", () => {
    const frontendStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding DEV:frontend rendering | feature-local | src/frontend/designSystem | approved | DEV:frontend |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Logo card rendering changes. | DEV:frontend |");

    const frontendPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:frontend | T-S001-01 | covered | Frontend task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:frontend | DEV:frontend rendered surface | T-S001-01 | Covered by DEV:frontend delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:frontend |")
      .replace(
        "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
        "src/frontend/**",
      )
      .replace(
        "| T-S001-01 | not-applicable | not-applicable: DEV:backend task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: DEV:backend task has no DEV:frontend or GOV:design-system sub-standard proof |",
        "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single visual rendering proof story. | canonical screenshot/evidence artifact tenant-branding-card-default.png |",
      )
      .replace(
        "| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |",
        "| T-S001-01 | broad-pattern-justified | src/frontend/** | Broad DEV:frontend implementation seems convenient. |",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed for visual rendering. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | frontend-design-system-seam | pass | Signed-off visual seam is named. |\n| T-S001-01 | frontend-no-app-css | pass | No app CSS is allowed. |\n| T-S001-01 | frontend-no-copied-behavior | pass | No copied controller behavior is allowed. |\n| T-S001-01 | frontend-accessibility-state | pass | Accessibility state remains unchanged. |\n| T-S001-01 | frontend-rendered-proof | pass | Visual rendering proof is required. |\n| T-S001-01 | frontend-runtime-evidence | pass | Served asset evidence is required. |\n| T-S001-01 | frontend-artifacts | pass | Design-system artifact obligations are carried. |",
      );

    const result = validateTaskBreakdownContent(frontendPacket, frontendStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has broad DEV:frontend/GOV:design-system write envelope without approved broad-scope rationale");
  });

  it("blocks queued DEV:frontend tasks without DEV:frontend architecture decision reconciliation", () => {
    const frontendStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding DEV:frontend rendering | feature-local | src/frontend/designSystem | approved | DEV:frontend |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Logo card rendering changes. | DEV:frontend |");

    const frontendPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:frontend | T-S001-01 | covered | Frontend task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:frontend | DEV:frontend rendered surface | T-S001-01 | Covered by DEV:frontend delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:frontend |")
      .replace(
        "| T-S001-01 | tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Layer 2 classified this as backend-only. |\n",
        "",
      );

    const result = validateTaskBreakdownContent(frontendPacket, frontendStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 queued DEV:frontend/GOV:design-system task has no DEV:frontend architecture decision row");
  });

  it("blocks DEV:frontend architecture decisions that drift from the Layer 2/3 snapshot", () => {
    const frontendStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | root-admin marketing journey | feature-local | src/frontend/rootAdminShell/assets/modules/marketing | approved | DEV:frontend |")
      .replace("| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |", "| root-admin marketing journey | root-admin | marketing | campaign-management | deep-link-only | root-operator | app-shell | journey | journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator | manual-shell-registry | curated-webAppHierarchyBuilder | transitional-accepted | feature-local-state-machine | local-legacy-shell | signed-off-seam-exists | shell-registry-update | module-journey-files | ready | Layer 2 places journey behavior in module files. |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Marketing journey page changes. | DEV:frontend |");

    const frontendPacket = validTaskPacket
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:frontend |")
      .replace(
        "| T-S001-01 | tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Layer 2 classified this as backend-only. |",
        "| T-S001-01 | root-admin marketing journey | root-admin | sales | campaign-management | deep-link-only | root-operator | app-shell | journey | journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator | manual-shell-registry | curated-webAppHierarchyBuilder | transitional-accepted | feature-local-state-machine | local-legacy-shell | signed-off-seam-exists | shell-registry-update | module-journey-files | ready | Layer 2 places journey behavior in module files. |",
      );

    const result = validateTaskBreakdownContent(frontendPacket, frontendStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 DEV:frontend architecture Product Module does not match Layer 2/3 snapshot for root-admin marketing journey",
    );
  });

  it("blocks durable DEV:frontend topology without a concrete locator", () => {
    const sourceRow = frontendSourceRow
      .replace("journey | journey-state | none", "page | durable-page | none")
      .replace("not-applicable: journey is shell-state only", "not-applicable: missing locator should block");
    const decisionRow = frontendDecisionRow
      .replace("journey | journey-state | none", "page | durable-page | none")
      .replace("not-applicable: journey is shell-state only", "not-applicable: missing locator should block");

    const result = validateTaskBreakdownContent(frontendTaskPacketWith(decisionRow), frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 durable DEV:frontend topology requires a non-none locator type");
  });

  it("blocks DEV:frontend locator migrations without compatibility locators", () => {
    const sourceRow = frontendSourceRow
      .replace("journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator", "durable-page | migration | /root-admin/marketing | not-applicable: no compatibility locator");
    const decisionRow = frontendDecisionRow
      .replace("journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator", "durable-page | migration | /root-admin/marketing | not-applicable: no compatibility locator");

    const result = validateTaskBreakdownContent(frontendTaskPacketWith(decisionRow), frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 DEV:frontend locator migration must name compatibility locators");
  });

  it("blocks queued DEV:frontend tasks without a performance posture row", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | static-low-risk | canonical render proof is sufficient for static card composition; no performance-specific proof needed | Static rendering only, no list, asset-heavy, route initialization, animation, or repeated interaction work. |\n",
      "",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 queued DEV:frontend/GOV:design-system task has no performance posture row");
  });

  it("blocks unknown DEV:frontend performance posture", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | static-low-risk | canonical render proof is sufficient for static card composition; no performance-specific proof needed | Static rendering only, no list, asset-heavy, route initialization, animation, or repeated interaction work. |",
      "| T-S001-01 | unknown-blocked | performance posture is not known yet | proof gap remains unresolved |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 DEV:frontend performance posture unknown-blocked cannot be queued for delivery");
  });

  it("blocks data-list performance posture without bounded data proof", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | static-low-risk | canonical render proof is sufficient for static card composition; no performance-specific proof needed | Static rendering only, no list, asset-heavy, route initialization, animation, or repeated interaction work. |",
      "| T-S001-01 | data-list-or-table | visual proof of the table | list page renders in browser |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 data-list-or-table performance posture requires bounded data-size and DOM/list rendering proof",
    );
  });

  it("blocks visual-rendering sub-standard without screenshot or evidence artifact", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | canonical screenshot/evidence artifact root-admin-marketing-campaign-default.png |",
      "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | browser looks correct |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 visual-rendering sub-standard requires a canonical screenshot or evidence artifact name",
    );
  });

  it("blocks interaction-behavior sub-standard without state transition scenario", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | canonical screenshot/evidence artifact root-admin-marketing-campaign-default.png |",
      "| T-S001-01 | interaction-behavior | not-applicable: interaction only | Single interaction proof story. | click proof only |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 interaction-behavior sub-standard requires an exact state transition or interaction scenario name",
    );
  });

  it("blocks accessibility-semantics sub-standard without role/name/state/focus proof", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | canonical screenshot/evidence artifact root-admin-marketing-campaign-default.png |",
      "| T-S001-01 | accessibility-semantics | not-applicable: accessibility only | Single accessibility proof story. | role and name are checked |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 accessibility-semantics sub-standard requires role/name/state/focus proof",
    );
  });

  it("blocks evidence-sweep sub-standard without artifact names and sweep scope", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | canonical screenshot/evidence artifact root-admin-marketing-campaign-default.png |",
      "| T-S001-01 | evidence-sweep | not-applicable: sweep only | Single evidence sweep proof story. | screenshots checked |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 evidence-sweep sub-standard requires exact evidence artifact names and sweep scope",
    );
  });

  it("blocks DEV:frontend tasks when Layer 2 security posture is present without matching evidence", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | sensitive-rendering | yes | Layer 2 says the root-admin journey renders privileged campaign data. | permission-aware rendering evidence | Browser scenario proves allowed, denied, expired, and unauthorized sensitive rendering states. |\n",
      "",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 queued DEV:frontend/GOV:design-system task has no DEV:frontend security evidence row");
  });

  it("blocks DEV:frontend security evidence that rewrites Layer 2 security posture text", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | sensitive-rendering | yes | Layer 2 says the root-admin journey renders privileged campaign data. | permission-aware rendering evidence | Browser scenario proves allowed, denied, expired, and unauthorized sensitive rendering states. |",
      "| T-S001-01 | sensitive-rendering | yes | Layer 4 rewrites the security decision. | looser proof is fine | Browser scenario proves allowed, denied, expired, and unauthorized sensitive rendering states. |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 DEV:frontend security evidence for sensitive-rendering does not match Layer 2/3 decision evidence",
    );
    expect(result.errors).toContain(
      "T-S001-01 DEV:frontend security evidence for sensitive-rendering does not match Layer 2/3 required Layer 4 signal",
    );
  });

  it("blocks sensitive DEV:frontend rendering without permission-state proof", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | privileged root-admin campaign data | allowed root operator sees campaign page | denied operator sees unauthorized state | expired session sees unauthenticated state | not-applicable: root operator task has no tenant-scoped rendering |\n",
      "",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 renders sensitive DEV:frontend data but has no permission rendering evidence row");
  });

  it("blocks rendered DEV:frontend proof that uses mocks without a contract or runtime tie", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | docs/api-contracts/root-admin-campaigns.md projection response | browser fixture copied from contract example | served /v1/root-admin/campaigns payload captured in browser scenario | not-applicable: live payload evidence required | mock-honesty: fixture mirrors contract payload and does not invent fallback behavior |",
      "| T-S001-01 | not-applicable: contract missing | mock fixture copied from convenience data | not-applicable: no runtime payload captured | payload unavailable because task only uses mocks | mock-honesty: fixture does not invent fallback behavior |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 rendered proof using mocks requires a governing API/projection contract or live runtime payload evidence",
    );
  });

  it("blocks DEV:frontend task consuming DS seam but missing adoption contract", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | TenantBrandingCard render export from /design-system/components/tenant-branding-card | not-applicable: static card has no behavior/controller seam | TenantBrandingCard card role/name semantics | GOV:design-system tenant-branding-card CSS seam | app passes approved campaign projection data and composes route shell only | must not copy markup, controller, ARIA, or CSS from the GOV:design-system seam | /root-admin/marketing campaign-management default route scenario |\n",
      "",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 DEV:frontend task consuming an existing GOV:design-system seam must have a DEV:frontend adoption contract row",
    );
  });

  it("blocks adoption contract missing render behavior accessibility or style seam", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "| T-S001-01 | TenantBrandingCard render export from /design-system/components/tenant-branding-card | not-applicable: static card has no behavior/controller seam | TenantBrandingCard card role/name semantics | GOV:design-system tenant-branding-card CSS seam | app passes approved campaign projection data and composes route shell only | must not copy markup, controller, ARIA, or CSS from the GOV:design-system seam | /root-admin/marketing campaign-management default route scenario |",
      "| T-S001-01 |  | not-applicable |  |  | app passes approved campaign projection data and composes route shell only | must not copy markup, controller, ARIA, or CSS from the GOV:design-system seam | /root-admin/marketing campaign-management default route scenario |",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing Consumed DS Render Seam");
    expect(result.errors).toContain("T-S001-01 Consumed DS Behavior / Controller Seam uses not-applicable without concrete rationale");
    expect(result.errors).toContain("T-S001-01 missing Consumed DS Accessibility Semantics");
    expect(result.errors).toContain("T-S001-01 missing Consumed DS Style / CSS Seam");
  });

  it("blocks adoption contract allowing copied markup controller ARIA or CSS", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "must not copy markup, controller, ARIA, or CSS from the GOV:design-system seam",
      "app may copy markup and controller as needed",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 forbidden local reconstruction must explicitly prohibit copied markup, controller, ARIA, and CSS",
    );
  });

  it("blocks generated DEV:frontend output without preview/apply materialization", () => {
    const sourceRow = frontendSourceRow
      .replace("manual-shell-registry | curated-webAppHierarchyBuilder", "generated-materializer | generated-materializer")
      .replace("shell-registry-update | module-journey-files", "shell-registry-update | generated-output");
    const decisionRow = frontendDecisionRow
      .replace("manual-shell-registry | curated-webAppHierarchyBuilder", "generated-materializer | generated-materializer")
      .replace("shell-registry-update | module-journey-files", "shell-registry-update | generated-output");

    const result = validateTaskBreakdownContent(frontendTaskPacketWith(decisionRow), frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 generated DEV:frontend output requires preview-apply materialization");
  });

  it("blocks generated-output task missing materialization seam", () => {
    const sourceRow = frontendSourceRow
      .replace("manual-shell-registry | curated-webAppHierarchyBuilder", "generated-materializer | generated-materializer")
      .replace("shell-registry-update | module-journey-files", "preview-apply-required | generated-output");
    const decisionRow = frontendDecisionRow
      .replace("manual-shell-registry | curated-webAppHierarchyBuilder", "generated-materializer | generated-materializer")
      .replace("shell-registry-update | module-journey-files", "preview-apply-required | generated-output");
    const packet = frontendTaskPacketWith(decisionRow);

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 generated DEV:frontend output must name the preview/apply or materialization seam");
  });

  it("blocks generated-output task attempting hand edits without approved sweep rationale", () => {
    const sourceRow = frontendSourceRow
      .replace("manual-shell-registry | curated-webAppHierarchyBuilder", "generated-materializer | generated-materializer")
      .replace("shell-registry-update | module-journey-files", "preview-apply-required | generated-output");
    const decisionRow = frontendDecisionRow
      .replace("manual-shell-registry | curated-webAppHierarchyBuilder", "generated-materializer | generated-materializer")
      .replace("shell-registry-update | module-journey-files", "preview-apply-required | generated-output");
    const packet = frontendTaskPacketWith(decisionRow).replace(
      "src/frontend/rootAdminShell/assets/modules/marketing/campaignManagement/page.mjs",
      "src/frontend/generated/rootAdminRoutes.generated.mjs hand-edit generated-output via preview/apply materialization seam",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 generated DEV:frontend output cannot be hand-edited without an approved generated/canonical sweep rationale",
    );
  });

  it("blocks shell-route-registry task trying to own page behavior", () => {
    const sourceRow = frontendSourceRow.replace("module-journey-files", "shell-route-registry");
    const decisionRow = frontendDecisionRow.replace("module-journey-files", "shell-route-registry");
    const packet = frontendTaskPacketWith(decisionRow).replace(
      "Add root-admin tenant branding persistence update using the approved tenants public seam.",
      "Mount root-admin marketing route and own page behavior for the campaign journey.",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 shell-route-registry placement may only own registry or route mounting, not page or journey behavior",
    );
  });

  it("blocks module-journey-files task whose write set does not match product module journey group", () => {
    const packet = frontendTaskPacketWith(frontendDecisionRow).replace(
      "src/frontend/rootAdminShell/assets/modules/marketing/campaignManagement/page.mjs",
      "src/frontend/rootAdminShell/assets/modules/sales/opportunity/page.mjs",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 module-journey-files placement must include the approved product module/journey group in the allowed write paths or give concrete path-unknown rationale",
    );
  });

  it("blocks never-serialize DEV:frontend state from being placed in URL or replay payloads", () => {
    const sourceRow = frontendSourceRow.replace("feature-local-state-machine | local-legacy-shell", "never-serialize | local-legacy-shell");
    const decisionRow = frontendDecisionRow.replace("feature-local-state-machine | local-legacy-shell", "never-serialize | local-legacy-shell");
    const packet = frontendTaskPacketWith(decisionRow).replace(
      "Add root-admin tenant branding persistence update using the approved tenants public seam.",
      "Add root-admin tenant branding page state in URL query params for replay.",
    );

    const result = validateTaskBreakdownContent(packet, frontendStoryPacketWith(sourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 never-serialize DEV:frontend state must not be placed in URL or replay payloads");
  });

  it("blocks module and journey DEV:frontend tasks from adding behavior to the root shell entry file", () => {
    const frontendStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | root-admin marketing journey | feature-local | src/frontend/rootAdminShell/assets/modules/marketing | approved | DEV:frontend |")
      .replace("| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |", "| root-admin marketing journey | root-admin | marketing | campaign-management | deep-link-only | root-operator | app-shell | journey | journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator | manual-shell-registry | curated-webAppHierarchyBuilder | transitional-accepted | feature-local-state-machine | local-legacy-shell | signed-off-seam-exists | shell-registry-update | module-journey-files | ready | Layer 2 places journey behavior in module files. |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Marketing journey page changes. | DEV:frontend |");

    const frontendPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:frontend | T-S001-01 | covered | Frontend task preserves Layer 2 module placement. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:frontend | DEV:frontend rendered surface | T-S001-01 | Covered by DEV:frontend delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:frontend |")
      .replace(
        "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
        "src/frontend/rootAdminShell/assets/app.mjs, src/frontend/rootAdminShell/assets/modules/marketing/campaignManagement/page.mjs",
      )
      .replace(
        "| T-S001-01 | tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Layer 2 classified this as backend-only. |",
        "| T-S001-01 | root-admin marketing journey | root-admin | marketing | campaign-management | deep-link-only | root-operator | app-shell | journey | journey-state | none | not-applicable: journey is shell-state only | not-applicable: no compatibility locator | manual-shell-registry | curated-webAppHierarchyBuilder | transitional-accepted | feature-local-state-machine | local-legacy-shell | signed-off-seam-exists | shell-registry-update | module-journey-files | ready | Layer 2 places journey behavior in module files, not the shell entry. |",
      )
      .replace(
        "| T-S001-01 | not-applicable | not-applicable: DEV:backend task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: DEV:backend task has no DEV:frontend or GOV:design-system sub-standard proof |",
        "| T-S001-01 | interaction-behavior | visual-rendering | inseparable because this tests one journey interaction seam | interaction scenario campaign-filter-toggle state transition |",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed for module/journey placement. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | frontend-design-system-seam | pass | Signed-off visual seam is named. |\n| T-S001-01 | frontend-no-app-css | pass | No app CSS is allowed. |\n| T-S001-01 | frontend-no-copied-behavior | pass | No copied controller behavior is allowed. |\n| T-S001-01 | frontend-accessibility-state | pass | Accessibility state remains unchanged. |\n| T-S001-01 | frontend-rendered-proof | pass | Visual rendering proof is required. |\n| T-S001-01 | frontend-runtime-evidence | pass | Served asset evidence is required. |\n| T-S001-01 | frontend-artifacts | pass | Frontend architecture artifact obligations are carried. |",
      );

    const result = validateTaskBreakdownContent(frontendPacket, frontendStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 module/journey DEV:frontend work must not add behavior to rootAdminShell/assets/app.mjs");
  });

  it("blocks queued GOV:design-system tasks that do not produce, refine, or prove a consumable seam", () => {
    const designSystemStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding card pattern | design-system-seam | src/frontend/design-system | approved | GOV:design-system |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | GOV:design-system governed surface | yes | Tenant branding card pattern needs a governed seam. | GOV:design-system |");

    const designSystemPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | platform-seam | GOV:design-system | T-S001-01 | covered | Design-system task preserves Layer 2 platform seam classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | GOV:design-system | GOV:design-system governed surface | T-S001-01 | Covered by GOV:design-system delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | GOV:design-system |")
      .replace(
        "| T-S001-01 | not-applicable | not-applicable: DEV:backend task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: DEV:backend task has no DEV:frontend or GOV:design-system sub-standard proof |",
        "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single visual rendering proof story. | canonical screenshot/evidence artifact tenant-branding-card-default.png |",
      )
      .replace(
        "| T-S001-01 | not-applicable | not-applicable: DEV:backend task has no governed UI seam | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task |",
        "| T-S001-01 | consumes-existing-seam | /design-system/components/tenant-branding-card | shared TenantBrandingCard render structure | no behavior controller for static card | card role/name semantics owned by DS | canonical screenshot tenant-branding-card-default.png | DEV:frontend imports TenantBrandingCard renderer |",
      )
      .replace(
        "| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |",
        "| T-S001-01 | exact-files | src/frontend/design-system/components/tenantBrandingCard.ts; tests/visual/designSystem/tenantBrandingCard.spec.ts | not-applicable: exact files only |",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | GOV:design-system | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/design-system-task-guardrail.md | approved | Design-system guardrail reviewed for consumable seam and visual proof obligations. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | design-system-family | pass | Tenant branding card family is named. |\n| T-S001-01 | design-system-behavior-lock | pass | Behavior lock is required. |\n| T-S001-01 | design-system-consumable-seam | pass | Consumable renderer seam is required. |\n| T-S001-01 | design-system-render-behavior | pass | Render behavior is owned by GOV:design-system. |\n| T-S001-01 | design-system-visual-proof | pass | Canonical screenshot proof is required. |\n| T-S001-01 | design-system-adoption-path | pass | Frontend adoption contract is named. |",
      );

    const result = validateTaskBreakdownContent(designSystemPacket, designSystemStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 GOV:design-system task must produce, refine, or prove a consumable seam");
  });

  it("blocks queued DEV:frontend tasks when the required GOV:design-system seam is missing", () => {
    const frontendStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding DEV:frontend rendering | feature-local | src/frontend/rootAdmin | approved | DEV:frontend |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Root admin page consumes tenant branding card. | DEV:frontend |");

    const frontendPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:frontend | T-S001-01 | covered | Frontend task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:frontend | DEV:frontend rendered surface | T-S001-01 | Covered by DEV:frontend delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:frontend |")
      .replace(
        "| T-S001-01 | not-applicable | not-applicable: DEV:backend task | not-applicable: no DEV:frontend or GOV:design-system work | not-applicable: DEV:backend task has no DEV:frontend or GOV:design-system sub-standard proof |",
        "| T-S001-01 | visual-rendering | not-applicable: visual rendering only | Single app adoption proof story. | canonical screenshot/evidence artifact tenant-branding-card-default.png |",
      )
      .replace(
        "| T-S001-01 | not-applicable | not-applicable: DEV:backend task has no governed UI seam | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable: DEV:backend task |",
        "| T-S001-01 | blocks-on-missing-seam | /design-system/components/tenant-branding-card | renderer seam missing | controller seam missing | accessibility seam missing | canonical evidence missing | DEV:frontend must wait for signed-off TenantBrandingCard seam |",
      )
      .replace(
        "| T-S001-01 | exact-files | src/features/tenantConfiguration/domain/updateBranding.ts; src/features/tenantConfiguration/transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | not-applicable: exact files only |",
        "| T-S001-01 | exact-files | src/frontend/rootAdmin/tenantBrandingPage.ts | not-applicable: exact files only |",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:frontend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/frontend-task-guardrail.md | approved | Frontend guardrail reviewed for signed-off GOV:design-system seam consumption. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | frontend-design-system-seam | pass | Signed-off visual seam is required. |\n| T-S001-01 | frontend-no-app-css | pass | No app CSS is allowed. |\n| T-S001-01 | frontend-no-copied-behavior | pass | No copied controller behavior is allowed. |\n| T-S001-01 | frontend-accessibility-state | pass | Accessibility state remains owned by DS. |\n| T-S001-01 | frontend-rendered-proof | pass | Rendered proof is required. |\n| T-S001-01 | frontend-runtime-evidence | pass | Served runtime evidence is required. |\n| T-S001-01 | frontend-artifacts | pass | Adoption artifact obligations are carried. |",
      );

    const result = validateTaskBreakdownContent(frontendPacket, frontendStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 DEV:frontend task must consume an existing GOV:design-system seam or record an approved exception");
  });

  it("blocks queued DEV:vertical-slice tasks without a coupling row", () => {
    const result = validateTaskBreakdownContent(
      verticalSliceTaskPacketWith(""),
      verticalSliceStoryPacketWith(frontendSourceRow),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 queued DEV:vertical-slice task has no vertical slice coupling row");
  });

  it("blocks DEV:vertical-slice coupling without inseparable DEV:backend/DEV:frontend proof rationale", () => {
    const packet = verticalSliceTaskPacketWith(
      verticalSliceCouplingRow.replace(
        "inseparable because the same journey proof must confirm DEV:backend mutation and DEV:frontend render consume the same response payload",
        "DEV:backend and DEV:frontend can be checked later",
      ).replace(
        "split rejection rationale: DEV:backend and DEV:frontend proof are inseparable for this one journey behavior; separate tasks would not prove the cross-boundary payload together",
        "split rejection rationale: separate implementation tasks can happen later",
      ),
    );

    const result = validateTaskBreakdownContent(packet, verticalSliceStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 vertical slice must explain why DEV:backend and DEV:frontend proof are inseparable");
  });

  it("blocks DEV:vertical-slice tasks used as a shortcut around separable task types", () => {
    const packet = verticalSliceTaskPacketWith(verticalSliceCouplingRow)
      .replace(
        "Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "Use this vertical slice as a shortcut to do everything for the full feature.",
      );

    const result = validateTaskBreakdownContent(packet, verticalSliceStoryPacketWith(frontendSourceRow));

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 vertical slice cannot be used as a shortcut around separable task types");
  });

  it("blocks queued TEST:test-only tasks without a coverage contract row", () => {
    const result = validateTaskBreakdownContent(
      testOnlyTaskPacketWith({ coverageRow: "" }),
      testOnlyStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 queued TEST:test-only task has no TEST:test-only coverage contract row");
  });

  it("blocks privileged TEST:test-only tasks without a permission/state matrix", () => {
    const result = validateTaskBreakdownContent(
      testOnlyTaskPacketWith({ matrixRow: "" }),
      testOnlyStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 privileged/security-sensitive TEST:test-only task has no capability permission/state matrix row");
  });

  it("blocks TEST:test-only tasks that require production behavior changes", () => {
    const result = validateTaskBreakdownContent(
      testOnlyTaskPacketWith({
        coverageRow: testOnlyCoverageRow.replace("no-production-change", "blocked-production-change-required"),
      }),
      testOnlyStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 TEST:test-only task cannot queue when production behavior changes are required");
  });

  it("blocks privileged TEST:test-only matrices that are happy-path only", () => {
    const result = validateTaskBreakdownContent(
      testOnlyTaskPacketWith({
        matrixRow: testOnlyMatrixRow
          .replace("root actor allowed; expired session denied; unauthenticated actor denied", "root actor allowed")
          .replace("RootUserAdmin capability allowed; missing capability denied", "RootUserAdmin capability allowed")
          .replace("denied unauthenticated, expired, and missing capability states", "none"),
      }),
      testOnlyStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 permission/state matrix must cover both allowed and denied states");
    expect(result.errors).toContain("T-S001-01 permission/state matrix cannot be happy-path only");
  });

  it("blocks TEST:test-only tasks whose focused command is only a broad suite", () => {
    const result = validateTaskBreakdownContent(
      testOnlyTaskPacketWith({
        coverageRow: testOnlyCoverageRow.replace(
          "npx vitest run tests/e2e/rootAdmin/operator-journeys.test.ts",
          "npm test",
        ),
      }),
      testOnlyStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 TEST:test-only task must name a focused test command, not only a broad suite");
  });

  it("passes a bounded TEST:test-suite-alignment task with traceability proof", () => {
    expect(validateTaskBreakdownContent(testSuiteAlignmentTaskPacketWith(), testSuiteAlignmentStoryPacket())).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks queued TEST:test-suite-alignment tasks without an alignment contract row", () => {
    const result = validateTaskBreakdownContent(
      testSuiteAlignmentTaskPacketWith({ alignmentRow: "" }),
      testSuiteAlignmentStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 queued TEST:test-suite-alignment task has no test suite alignment contract row");
  });

  it("blocks TEST:test-suite-alignment tasks that include production write paths", () => {
    const result = validateTaskBreakdownContent(
      testSuiteAlignmentTaskPacketWith({
        allowedWriteSet: "src/features/rootUsers/domain/service.ts, docs/prd/test_cases/2026-03-29-0002-root-users-backend-test-cases.md",
      }),
      testSuiteAlignmentStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 TEST:test-suite-alignment task must not include production code paths in its write envelope");
  });

  it("blocks TEST:test-suite-alignment tasks that hide new proof instead of splitting to TEST:test-only", () => {
    const result = validateTaskBreakdownContent(
      testSuiteAlignmentTaskPacketWith({
        alignmentRow: testSuiteAlignmentRow.replace(
          "no new proof required; split any newly required proof into TEST:test-only",
          "implement missing e2e proof here",
        ),
      }),
      testSuiteAlignmentStoryPacket(),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 TEST:test-suite-alignment task must split newly required proof into TEST:test-only or state no new proof is required");
  });

  it("blocks queued DEV:backend tasks without DEV:backend implementation approach", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "## Backend Implementation Approach\n\n| Task ID | Feature Owner | Capability File Strategy | Expected Files / Layers | Layer Responsibilities | Public Seam / Manifest Impact | Formatting / Generated Artifact Expectations |\n| --- | --- | --- | --- | --- | --- | --- |\n| T-S001-01 | src/features/tenantConfiguration | new-capability-file | domain/updateBranding.ts; transport/rootAdminRoutes.ts; tests/integration/tenantConfiguration/persistence.test.ts | domain owns branding rule, transport routes, persistence test proves repository behavior | no new public seam; manifest unchanged unless export changes | repo formatter and no generated graph change expected |\n\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing heading: ## Backend Implementation Approach");
    expect(result.errors).toContain("T-S001-01 queued DEV:backend task has no DEV:backend implementation approach row");
  });

  it("blocks queued DEV:backend tasks with an invalid capability file strategy", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("new-capability-file", "whatever-is-easy"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has invalid DEV:backend capability file strategy: whatever-is-easy");
  });

  it("blocks queued DEV:migration-persistence tasks without migration approach", () => {
    const migrationStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding persistence migration | feature-local | src/features/tenantConfiguration/persistence | approved | DEV:migration-persistence |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | persistence or migration change | yes | Tenant branding schema changes. | DEV:migration-persistence |");

    const migrationPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:migration-persistence | T-S001-01 | covered | Migration task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:migration-persistence | persistence or migration change | T-S001-01 | Covered by migration delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:migration-persistence |")
      .replace(
        "## Migration / Persistence Approach\n\n| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| T-S001-01 | not-applicable-with-rationale | not-applicable: DEV:backend task has no schema change | not-applicable: no live data transform | not-applicable: no per-row migration | not-applicable: no rejected rows possible | not-applicable: no migration file touched | not-applicable: no SQL execution change | not-applicable: DEV:backend persistence proof only | not-applicable: no harness impact |\n\n",
        "",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:migration-persistence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/migration-persistence-task-guardrail.md | approved | Migration guardrail reviewed for schema, live schema, and harness obligations. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | migration-source-authority | pass | Approved PRD, capability row, data dictionary, or blueprint authorizes the storage change. |\n| T-S001-01 | migration-live-schema | pass | Live schema inspection is required. |\n| T-S001-01 | migration-storage-decision-boundary | pass | Storage model is approved or split before migration implementation. |\n| T-S001-01 | migration-source-data-shape | pass | Source rows must match the approved starting shape before mutation. |\n| T-S001-01 | migration-per-row-eligibility | pass | Each transformed row must pass eligibility validation before mutation. |\n| T-S001-01 | migration-rejected-row-behavior | pass | Non-compliant rows must fail closed or follow an approved repair path. |\n| T-S001-01 | migration-compatibility-repair | pass | Existing-environment compatibility and repair posture are named. |\n| T-S001-01 | migration-applied-file-safety | pass | Applied migration identities remain stable. |\n| T-S001-01 | migration-index-normalization-uniqueness | pass | Index, normalization, and uniqueness proof is required. |\n| T-S001-01 | migration-security-tenant-proof | pass | Tenant, authz, lifecycle, audit, or compliance-sensitive storage proof is named or not applicable with rationale. |\n| T-S001-01 | migration-read-write-proof | pass | Representative read/write proof is required. |\n| T-S001-01 | migration-postgres-harness | pass | Harness impact is classified. |",
      );

    const result = validateTaskBreakdownContent(migrationPacket, migrationStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing heading: ## Migration / Persistence Approach");
    expect(result.errors).toContain("T-S001-01 queued DEV:migration-persistence task has no migration / persistence approach row");
  });

  it("blocks queued DEV:migration-persistence tasks with invalid change type", () => {
    const migrationStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding persistence migration | feature-local | src/features/tenantConfiguration/persistence | approved | DEV:migration-persistence |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | persistence or migration change | yes | Tenant branding schema changes. | DEV:migration-persistence |");

    const migrationPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:migration-persistence | T-S001-01 | covered | Migration task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:migration-persistence | persistence or migration change | T-S001-01 | Covered by migration delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:migration-persistence |")
      .replace("not-applicable-with-rationale | not-applicable: DEV:backend task has no schema change", "schema-magic | live schema checked")
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:migration-persistence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/migration-persistence-task-guardrail.md | approved | Migration guardrail reviewed for schema, live schema, and harness obligations. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | migration-source-authority | pass | Approved PRD, capability row, data dictionary, or blueprint authorizes the storage change. |\n| T-S001-01 | migration-live-schema | pass | Live schema inspection is required. |\n| T-S001-01 | migration-storage-decision-boundary | pass | Storage model is approved or split before migration implementation. |\n| T-S001-01 | migration-source-data-shape | pass | Source rows must match the approved starting shape before mutation. |\n| T-S001-01 | migration-per-row-eligibility | pass | Each transformed row must pass eligibility validation before mutation. |\n| T-S001-01 | migration-rejected-row-behavior | pass | Non-compliant rows must fail closed or follow an approved repair path. |\n| T-S001-01 | migration-compatibility-repair | pass | Existing-environment compatibility and repair posture are named. |\n| T-S001-01 | migration-applied-file-safety | pass | Applied migration identities remain stable. |\n| T-S001-01 | migration-index-normalization-uniqueness | pass | Index, normalization, and uniqueness proof is required. |\n| T-S001-01 | migration-security-tenant-proof | pass | Tenant, authz, lifecycle, audit, or compliance-sensitive storage proof is named or not applicable with rationale. |\n| T-S001-01 | migration-read-write-proof | pass | Representative read/write proof is required. |\n| T-S001-01 | migration-postgres-harness | pass | Harness impact is classified. |",
      );

    const result = validateTaskBreakdownContent(migrationPacket, migrationStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has invalid DEV:migration-persistence change type: schema-magic");
  });

  it("blocks queued DEV:migration-persistence tasks without source data shape validation", () => {
    const migrationStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding persistence migration | feature-local | src/features/tenantConfiguration/persistence | approved | DEV:migration-persistence |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | persistence or migration change | yes | Tenant branding schema changes. | DEV:migration-persistence |");

    const migrationPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:migration-persistence | T-S001-01 | covered | Migration task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:migration-persistence | persistence or migration change | T-S001-01 | Covered by migration delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:migration-persistence |")
      .replace("not-applicable-with-rationale | not-applicable: DEV:backend task has no schema change | not-applicable: no live data transform | not-applicable: no per-row migration | not-applicable: no rejected rows possible", "new-migration | SELECT column_name FROM information_schema.columns WHERE table_name = 'tenant_branding' |  | Check tenant_id and legacy_logo_url before transforming each row | Fail atomically and report rejected row IDs")
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:migration-persistence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/migration-persistence-task-guardrail.md | approved | Migration guardrail reviewed for schema, live schema, and harness obligations. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | migration-source-authority | pass | Approved PRD, capability row, data dictionary, or blueprint authorizes the storage change. |\n| T-S001-01 | migration-live-schema | pass | Live schema inspection is required. |\n| T-S001-01 | migration-storage-decision-boundary | pass | Storage model is approved or split before migration implementation. |\n| T-S001-01 | migration-source-data-shape | pass | Source rows must match the approved starting shape before mutation. |\n| T-S001-01 | migration-per-row-eligibility | pass | Each transformed row must pass eligibility validation before mutation. |\n| T-S001-01 | migration-rejected-row-behavior | pass | Non-compliant rows must fail closed or follow an approved repair path. |\n| T-S001-01 | migration-compatibility-repair | pass | Existing-environment compatibility and repair posture are named. |\n| T-S001-01 | migration-applied-file-safety | pass | Applied migration identities remain stable. |\n| T-S001-01 | migration-index-normalization-uniqueness | pass | Index, normalization, and uniqueness proof is required. |\n| T-S001-01 | migration-security-tenant-proof | pass | Tenant, authz, lifecycle, audit, or compliance-sensitive storage proof is named or not applicable with rationale. |\n| T-S001-01 | migration-read-write-proof | pass | Representative read/write proof is required. |\n| T-S001-01 | migration-postgres-harness | pass | Harness impact is classified. |",
      );

    const result = validateTaskBreakdownContent(migrationPacket, migrationStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing Source Data Shape Validation");
  });

  it("blocks queued DEV:migration-persistence tasks without per-row eligibility validation", () => {
    const migrationStoryPacket = sourceStoryPacket
      .replace("| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |", "| CLS-001 | tenant branding persistence migration | feature-local | src/features/tenantConfiguration/persistence | approved | DEV:migration-persistence |")
      .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | persistence or migration change | yes | Tenant branding schema changes. | DEV:migration-persistence |");

    const migrationPacket = validTaskPacket
      .replace("| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |", "| CLS-001 | feature-local | DEV:migration-persistence | T-S001-01 | covered | Migration task preserves Layer 2 feature-local classification. |")
      .replace("| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |", "| S-001 | DEV:migration-persistence | persistence or migration change | T-S001-01 | Covered by migration delivery task. |")
      .replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-001 | DEV:migration-persistence |")
      .replace("not-applicable-with-rationale | not-applicable: DEV:backend task has no schema change | not-applicable: no live data transform | not-applicable: no per-row migration | not-applicable: no rejected rows possible", "new-migration | SELECT column_name FROM information_schema.columns WHERE table_name = 'tenant_branding' | Assert every source row has tenant_id and legacy_logo_url before mutation |  | Fail atomically and report rejected row IDs")
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:migration-persistence | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/migration-persistence-task-guardrail.md | approved | Migration guardrail reviewed for schema, live schema, and harness obligations. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | migration-source-authority | pass | Approved PRD, capability row, data dictionary, or blueprint authorizes the storage change. |\n| T-S001-01 | migration-live-schema | pass | Live schema inspection is required. |\n| T-S001-01 | migration-storage-decision-boundary | pass | Storage model is approved or split before migration implementation. |\n| T-S001-01 | migration-source-data-shape | pass | Source rows must match the approved starting shape before mutation. |\n| T-S001-01 | migration-per-row-eligibility | pass | Each transformed row must pass eligibility validation before mutation. |\n| T-S001-01 | migration-rejected-row-behavior | pass | Non-compliant rows must fail closed or follow an approved repair path. |\n| T-S001-01 | migration-compatibility-repair | pass | Existing-environment compatibility and repair posture are named. |\n| T-S001-01 | migration-applied-file-safety | pass | Applied migration identities remain stable. |\n| T-S001-01 | migration-index-normalization-uniqueness | pass | Index, normalization, and uniqueness proof is required. |\n| T-S001-01 | migration-security-tenant-proof | pass | Tenant, authz, lifecycle, audit, or compliance-sensitive storage proof is named or not applicable with rationale. |\n| T-S001-01 | migration-read-write-proof | pass | Representative read/write proof is required. |\n| T-S001-01 | migration-postgres-harness | pass | Harness impact is classified. |",
      );

    const result = validateTaskBreakdownContent(migrationPacket, migrationStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing Per-Row Eligibility Validation");
  });

  it("blocks missing expected task-type reconciliation from story signals", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "S-001 API route or contract change missing expected task-type reconciliation for DEV:backend",
    );
  });

  it("blocks task queues that contradict steering classification", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |",
        "| CLS-001 | platform-seam | DEV:backend | T-S001-01 | covered | Incorrectly changes steering classification. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("CLS-001 changes steering classification");
  });

  it("blocks unknown granular guardrail checks", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | backend-random-extra | pass | This check is not part of the approved DEV:backend guardrail. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing guardrail check backend-proof-commands");
    expect(result.errors).toContain("T-S001-01 has unknown guardrail check backend-random-extra");
  });

  it("blocks queued tasks without approved code placement", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |",
        "| T-S001-01 | blocked | src/features/tenantConfiguration | src/lib/tenantConfiguration | yes | shared-code-placement-task-guardrail.md | pending | blocked |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 code placement is blocked");
    expect(result.errors).toContain("T-S001-01 is queued-for-delivery without approved code placement");
  });

  it("allows DEV:platform-seam tasks with the platform guardrail and platform placement", () => {
    const platformSourceStoryPacket = sourceStoryPacket
      .replace(
        "| CLS-001 | tenant branding DEV:backend update | feature-local | src/features/tenantConfiguration | approved | DEV:backend |",
        "| CLS-001 | tenant branding DEV:backend update | platform-seam | src/routes/v1 | approved | DEV:platform-seam |",
      )
      .replace(
        "| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |",
        "| S-001 | shared platform/runtime seam | yes | Root admin update route needs shared route registration helper. | DEV:platform-seam |",
      );

    const platformPacket = validTaskPacket
      .replace(
        "| CLS-001 | feature-local | DEV:backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |",
        "| CLS-001 | platform-seam | DEV:platform-seam | T-S001-01 | covered | Platform task preserves Layer 2 platform-seam classification. |",
      )
      .replace(
        "| S-001 | DEV:backend | API route or contract change | T-S001-01 | Covered by DEV:backend delivery task. |",
        "| S-001 | DEV:platform-seam | shared platform/runtime seam | T-S001-01 | Covered by DEV:platform-seam delivery task. |",
      )
      .replace(/\| T-S001-01 \| S-001 \| DEV:backend \|/, "| T-S001-01 | S-001 | DEV:platform-seam |")
      .replace(
        "Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "Adjust shared route registration helper used by the approved tenant branding DEV:backend route.",
      )
      .replace(
        "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
        "src/routes/v1/index.ts, src/scripts/checkFeatureDependencies.ts, tests/unit/routes/v1RouteRegistration.test.ts",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | DEV:platform-seam | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/platform-seam-task-guardrail.md | approved | Platform seam guardrail reviewed for shared route registration consumers and compatibility proof. |",
      )
      .replace(
        "| T-S001-01 | backend-source-authority | pass | Source story, capability row, and approved route/authz artifacts govern the backend behavior. |\n| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-layer-responsibilities | pass | Layer responsibilities are explicit across contract, domain, persistence, transport, integration, and manifest impact. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant-lifecycle | pass | CAP-BRANDING-001 is root-scoped, tenant actors are denied, and lifecycle posture is not applicable for this root-admin route. |\n| T-S001-01 | backend-api-contract-boundary | pass | Route contract behavior is approved or split to DOC:api-contract when changed. |\n| T-S001-01 | backend-persistence-migration-boundary | pass | No schema, migration, index, live-data transform, or repository query-semantics task is required. |\n| T-S001-01 | backend-artifact-obligations | pass | API contract, permission mapping, data dictionary, feature docs, and generated-artifact obligations are carried or split when required. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | platform-source-authority | pass | Story classification and existing v1 router architecture approve the shared route registration seam. |\n| T-S001-01 | platform-seam-owner | pass | Shared route registration is owned by src/routes/v1. |\n| T-S001-01 | platform-not-feature-local | pass | Route registration helper is shared platform wiring, not feature-local logic. |\n| T-S001-01 | platform-consumer-inventory | pass | Current feature routes remain registered through the v1 router and unsupported consumers are not in scope. |\n| T-S001-01 | platform-compatibility-contract | pass | Existing route registration behavior and feature route mounting remain backwards compatible. |\n| T-S001-01 | platform-rollout-backout | pass | Helper-only route registration adjustment has no staged rollout and can be reverted as one seam change. |\n| T-S001-01 | platform-artifact-materialization | pass | Feature dependency artifacts are checked by existing commands. |\n| T-S001-01 | platform-architecture-boundary | pass | No ADR change needed for helper-only route registration adjustment. |\n| T-S001-01 | platform-proof-commands | pass | Route registration regression and dependency artifact checks prove the shared seam. |",
      )
      .replace(
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |",
        "| T-S001-01 | platform-seam | src/routes/v1 | src/routes/v1 | no | not-applicable: no shared code placement | Existing consumer compatibility protected by route registration regression. | approved |",
      );

    expect(validateTaskBreakdownContent(platformPacket, platformSourceStoryPacket)).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks shared-lib extraction without a separate extraction task", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |",
        "| T-S001-01 | shared-lib | src/features/tenantConfiguration | src/lib/branding | yes | shared-code-placement-task-guardrail.md | Existing consumer compatibility protected by regression coverage. | approved |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 needs separate DECISION:refactor-first or DEV:platform-seam extraction task");
  });

  it("blocks shared-code placement without the supplemental guardrail reference", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |",
        "| T-S001-01 | shared-lib | src/features/tenantConfiguration | src/lib/branding | no | not-applicable: omitted | Existing consumer compatibility protected by regression coverage. | approved |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 must reference shared-code-placement-task-guardrail.md");
  });

  it("blocks extraction values outside yes or no", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |",
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | yes: later | shared-code-placement-task-guardrail.md | Existing consumer compatibility protected by regression coverage. | approved |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has invalid Extraction Needed: yes: later");
  });

  it("blocks queued tasks with blocked write set classification", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | src/features/tenantConfiguration/domain/updateBranding.ts | feature-local | Owning feature domain capability file. |",
        "| T-S001-01 | src/lib/branding.ts | blocked | Not approved for this DEV:backend task. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 write set classification is blocked for src/lib/branding.ts");
  });

  it("blocks extraction when the dependent task does not depend on the extraction task", () => {
    const packetWithExtractionTask = validTaskPacket
      .replace(
        "| T-S001-01 | S-001 | DEV:backend | Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "| T-S001-00 | S-001 | DECISION:refactor-first | Extract reusable branding normalization without behavior changes. | src/features/tenantConfiguration/domain/brandingNormalization.ts, tests/unit/tenantConfiguration/brandingNormalization.test.ts | API route changes, DEV:frontend rendering | not-applicable: prerequisite extraction task | not-applicable: feature-local refactor | queued-for-delivery |\n| T-S001-01 | S-001 | DEV:backend | Add root-admin tenant branding persistence update using the approved tenants public seam.",
      )
      .replace(
        "| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-00 | DECISION:refactor-first | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/refactor-first-task-guardrail.md | approved | Refactor-first guardrail reviewed for behavior-preserving extraction. |\n| T-S001-01 | DEV:backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local DEV:backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      )
      .replace(
        "| T-S001-01 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by tenantConfiguration persistence regression. | approved |",
        "| T-S001-00 | feature-local | src/features/tenantConfiguration | src/features/tenantConfiguration | no | not-applicable: no shared code placement | Existing consumer compatibility protected by branding normalization regression. | approved |\n| T-S001-01 | shared-lib | src/features/tenantConfiguration | src/lib/branding | yes | shared-code-placement-task-guardrail.md | Existing consumer compatibility protected by regression coverage. | approved |",
      )
      .replace(
        "| T-S001-01 | AC-S001-01 | Covers the approved persistence and authorization acceptance criterion. |",
        "| T-S001-00 | AC-S001-01 | Preserves existing normalization behavior before extraction. |\n| T-S001-01 | AC-S001-01 | Covers the approved persistence and authorization acceptance criterion. |",
      )
      .replace(
        "| T-S001-01 | CAP-BRANDING-001 | approved | Capability row is approved in the source story packet. |",
        "| T-S001-00 | CAP-BRANDING-001 | approved | Capability row is approved in the source story packet. |\n| T-S001-01 | CAP-BRANDING-001 | approved | Capability row is approved in the source story packet. |",
      )
      .replace(
        "| T-S001-01 | not-applicable: first task | Story has no prior delivery task dependency. | no |",
        "| T-S001-00 | not-applicable: prerequisite task | Story has no prior delivery task dependency. | no |\n| T-S001-01 | not-applicable: intentionally missing extraction dependency | Backend task omits extraction dependency. | no |",
      )
      .replace(
        "| T-S001-01 | tenants public read seam | feature-public-seam | existing | integration test proves selected tenant lookup before branding update |",
        "| T-S001-00 | not-applicable: feature-local refactor | not-applicable | existing | not-applicable: no shared seam |\n| T-S001-01 | tenants public read seam | feature-public-seam | existing | integration test proves selected tenant lookup before branding update |",
      )
      .replace(
        "| T-S001-01 | API contract, data dictionary, permission mapping | refresh source-independent contract artifacts for the approved branding update | api-contract-maintainer, data-dictionary-maintainer | yes |",
        "| T-S001-00 | not-applicable: behavior-preserving refactor | record no source-independent contract change | task-breakdown-maintainer | no |\n| T-S001-01 | API contract, data dictionary, permission mapping | refresh source-independent contract artifacts for the approved branding update | api-contract-maintainer, data-dictionary-maintainer | yes |",
      )
      .replace(
        "| T-S001-01 | persistence-level, contract-level | npx vitest run tests/integration/tenantConfiguration/persistence.test.ts; npm run typecheck | persistence fixture must use the same selected tenant shape as production repository reads |",
        "| T-S001-00 | source-level | npx vitest run tests/unit/tenantConfiguration/brandingNormalization.test.ts; npm run typecheck | fixture preserves existing normalization behavior |\n| T-S001-01 | persistence-level, contract-level | npx vitest run tests/integration/tenantConfiguration/persistence.test.ts; npm run typecheck | persistence fixture must use the same selected tenant shape as production repository reads |",
      )
      .replace(
        "| T-S001-01 | codex/s001-tenant-branding-backend | current dedicated task branch | docs/workspace/chat-bootstraps/2026-04-29-s001-tenant-branding-backend.md | origin/main | record exact base commit before Delivery edits | main after promote guardrail |",
        "| T-S001-00 | codex/s001-tenant-branding-refactor | current dedicated task branch | docs/workspace/chat-bootstraps/2026-04-29-s001-tenant-branding-refactor.md | origin/main | record exact base commit before Delivery edits | main after promote guardrail |\n| T-S001-01 | codex/s001-tenant-branding-backend | current dedicated task branch | docs/workspace/chat-bootstraps/2026-04-29-s001-tenant-branding-backend.md | origin/main | record exact base commit before Delivery edits | main after promote guardrail |",
      )
      .replace(
        "| T-S001-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated DEV:backend task. |",
        "| T-S001-00 | queued-for-delivery | none | Ready for Layer 5 as an isolated refactor task. |\n| T-S001-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated DEV:backend task. |",
      );

    const result = validateTaskBreakdownContent(packetWithExtractionTask, sourceStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 extraction dependency must block queueing on a DECISION:refactor-first or DEV:platform-seam task",
    );
  });

  it("blocks tasks mapped to stories that are not approved for task breakdown", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | S-001 | DEV:backend |", "| T-S001-01 | S-999 | DEV:backend |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 references unapproved story S-999");
  });

  it("blocks unknown acceptance criteria", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | AC-S001-01 |", "| T-S001-01 | AC-S001-99 |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 references unknown acceptance criterion AC-S001-99");
  });

  it("blocks task-layer changes to story acceptance criteria", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "Root admin update persists the tenant branding display name for exactly one selected tenant.",
        "Root admin update may persist branding for any tenant selected later.",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("AC-S001-01 changes story Acceptance Criterion");
  });

  it("blocks tasks without an allowed write set", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing Allowed Write Set");
  });

  it("blocks tasks without branch, worktree, and bootstrap strategy", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | codex/s001-tenant-branding-backend | current dedicated task branch | docs/workspace/chat-bootstraps/2026-04-29-s001-tenant-branding-backend.md | origin/main | record exact base commit before Delivery edits | main after promote guardrail |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has no branch/worktree/bootstrap strategy row");
  });

  it("blocks vague shortcut wording", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "Implement feature and add tests as needed.",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("vague phrase found: implement feature");
    expect(result.errors).toContain("vague phrase found: add tests");
    expect(result.errors).toContain("vague phrase found: as needed");
  });

  it("blocks missing proof layers", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | persistence-level, contract-level |", "| T-S001-01 |  |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing Required Proof Layers");
  });

  it("blocks missing artifact obligations", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | API contract, data dictionary, permission mapping | refresh source-independent contract artifacts for the approved branding update | api-contract-maintainer, data-dictionary-maintainer | yes |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 has no artifact obligations row");
  });

  it("blocks shared seams that are named in the task but not declared", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | tenants public read seam | feature-public-seam | existing | integration test proves selected tenant lookup before branding update |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 touches shared seams but has no Shared Seams row");
  });

  it("blocks implementation tasks when required capability rows are missing", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | CAP-BRANDING-001 | approved |", "| T-S001-01 |  | blocked-missing-row |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 capability coverage is blocked-missing-row");
  });

  it("blocks architecture invention outside steering and story breakdown", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("`consumes-story-and-steering-only`", "`proposes-new-architecture`"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("Architecture invention check is proposes-new-architecture");
  });

  it("blocks hidden DECISION:refactor-first blockers inside feature work", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| --- | --- | --- | --- | --- | --- |\n\n## Layer 5 Delivery Handoff",
        "| --- | --- | --- | --- | --- | --- |\n| B-001 | T-S001-01 | DECISION:refactor-first |  | Repository seam must be split before DEV:backend work. | pending |\n\n## Layer 5 Delivery Handoff",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("B-001 missing Required Separate Task ID");
    expect(result.errors).toContain("T-S001-01 is queued-for-delivery while blocker rows remain unresolved");
  });

  it("blocks queued delivery when blockers remain", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | queued-for-delivery | none |", "| T-S001-01 | queued-for-delivery | B-001 |"),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 is queued-for-delivery with blockers remaining");
  });
});
