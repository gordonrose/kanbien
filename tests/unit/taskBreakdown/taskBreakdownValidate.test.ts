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
| CLS-001 | tenant branding backend update | feature-local | src/features/tenantConfiguration | approved | backend |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-001 | API route or contract change | yes | Root admin update route contract changes. | backend |

## Epic Summary

- Epic job to be done:
  As the platform, keep tenant branding delivery scoped and provable.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | user-value | backend | Root admin updates branding | As a root admin, I need to update a tenant branding display name so tenant users see the approved value after reload. | root admin | Branding display name is persisted for the selected tenant. |  |

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
| CLS-001 | feature-local | backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |

## Expected Task-Type Reconciliation

| Story ID | Expected Task Type | Source Signal | Covered By Task ID | Missing / Deferred Reason |
| --- | --- | --- | --- | --- |
| S-001 | backend | API route or contract change | T-S001-01 | Covered by backend delivery task. |

## Selected Story Scope

| Story ID | Story Status | Value Type | Delivery Shape | Title | Job To Be Done | Outcome | Task Breakdown Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | user-value | backend | Root admin updates branding | As a root admin, I need to update a tenant branding display name so tenant users see the approved value after reload. | Branding display name is persisted for the selected tenant. | One backend task can deliver the approved persistence and API contract slice. |

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
| T-S001-01 | S-001 | backend | Add root-admin tenant branding persistence update using the approved tenants public seam. | src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts | frontend rendering, public asset delivery, tenant-scoped self-service branding | not-applicable: first task for story | tenants public read seam | queued-for-delivery |

## Task-Type Approval Guardrails

| Task ID | Task Type | Required Guardrail Reference | Approval Status | Evidence / Rationale |
| --- | --- | --- | --- | --- |
| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |

## Task Guardrail Evidence

| Task ID | Guardrail Check ID | Status | Evidence |
| --- | --- | --- | --- |
| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |
| T-S001-01 | backend-feature-structure | pass | Work stays in domain, transport, and persistence tests for the owning feature. |
| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |
| T-S001-01 | backend-authz-tenant | pass | CAP-BRANDING-001 is root-scoped and tenant actors are denied. |
| T-S001-01 | backend-persistence-migration | pass | No migration needed; existing tenantConfiguration persistence path is updated. |
| T-S001-01 | backend-artifacts | pass | API contract, data dictionary, and permission mapping obligations are carried. |
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
| T-S001-01 | frontend rendering or public asset delivery | Explicit non-goals for the backend task. |

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
| T-S001-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated backend task. |
`;

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
        "| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |\n",
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
        "| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | not-applicable: backend is simple | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 has invalid task-type guardrail approval status: not-applicable: backend is simple",
    );
  });

  it("blocks queued tasks missing a required granular guardrail check", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| T-S001-01 | backend-authz-tenant | pass | CAP-BRANDING-001 is root-scoped and tenant actors are denied. |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 missing guardrail check backend-authz-tenant");
  });

  it("blocks missing expected task-type reconciliation from story signals", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| S-001 | backend | API route or contract change | T-S001-01 | Covered by backend delivery task. |\n",
        "",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "S-001 API route or contract change missing expected task-type reconciliation for backend",
    );
  });

  it("blocks task queues that contradict steering classification", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| CLS-001 | feature-local | backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |",
        "| CLS-001 | platform-seam | backend | T-S001-01 | covered | Incorrectly changes steering classification. |",
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
        "| T-S001-01 | backend-random-extra | pass | This check is not part of the approved backend guardrail. |",
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

  it("allows platform-seam tasks with the platform guardrail and platform placement", () => {
    const platformSourceStoryPacket = sourceStoryPacket
      .replace(
        "| CLS-001 | tenant branding backend update | feature-local | src/features/tenantConfiguration | approved | backend |",
        "| CLS-001 | tenant branding backend update | platform-seam | src/routes/v1 | approved | platform-seam |",
      )
      .replace(
        "| S-001 | API route or contract change | yes | Root admin update route contract changes. | backend |",
        "| S-001 | shared platform/runtime seam | yes | Root admin update route needs shared route registration helper. | platform-seam |",
      );

    const platformPacket = validTaskPacket
      .replace(
        "| CLS-001 | feature-local | backend | T-S001-01 | covered | Backend task preserves Layer 2 feature-local classification. |",
        "| CLS-001 | platform-seam | platform-seam | T-S001-01 | covered | Platform task preserves Layer 2 platform-seam classification. |",
      )
      .replace(
        "| S-001 | backend | API route or contract change | T-S001-01 | Covered by backend delivery task. |",
        "| S-001 | platform-seam | shared platform/runtime seam | T-S001-01 | Covered by platform-seam delivery task. |",
      )
      .replace(/\| T-S001-01 \| S-001 \| backend \|/, "| T-S001-01 | S-001 | platform-seam |")
      .replace(
        "Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "Adjust shared route registration helper used by the approved tenant branding backend route.",
      )
      .replace(
        "src/features/tenantConfiguration/domain/updateBranding.ts, src/features/tenantConfiguration/transport/rootAdminRoutes.ts, tests/integration/tenantConfiguration/persistence.test.ts",
        "src/routes/v1/index.ts, src/scripts/checkFeatureDependencies.ts, tests/unit/routes/v1RouteRegistration.test.ts",
      )
      .replace(
        "| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-01 | platform-seam | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/platform-seam-task-guardrail.md | approved | Platform seam guardrail reviewed for shared route registration consumers and compatibility proof. |",
      )
      .replace(
        "| T-S001-01 | backend-owning-feature | pass | Owning feature is src/features/tenantConfiguration. |\n| T-S001-01 | backend-feature-structure | pass | Work stays in domain, transport, and persistence tests for the owning feature. |\n| T-S001-01 | backend-cross-feature-seams | pass | Uses tenants public read seam instead of private persistence imports. |\n| T-S001-01 | backend-authz-tenant | pass | CAP-BRANDING-001 is root-scoped and tenant actors are denied. |\n| T-S001-01 | backend-persistence-migration | pass | No migration needed; existing tenantConfiguration persistence path is updated. |\n| T-S001-01 | backend-artifacts | pass | API contract, data dictionary, and permission mapping obligations are carried. |\n| T-S001-01 | backend-proof-commands | pass | Persistence integration test and typecheck are required. |",
        "| T-S001-01 | platform-seam-owner | pass | Shared route registration is owned by src/routes/v1. |\n| T-S001-01 | platform-not-feature-local | pass | Route registration helper is shared platform wiring, not feature-local logic. |\n| T-S001-01 | platform-consumers | pass | Current feature routes remain registered through the v1 router. |\n| T-S001-01 | platform-compatibility-proof | pass | Route registration regression protects existing consumers. |\n| T-S001-01 | platform-artifact-impact | pass | Feature dependency artifacts are checked by existing commands. |\n| T-S001-01 | platform-architecture-impact | pass | No ADR change needed for helper-only route registration adjustment. |",
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
    expect(result.errors).toContain("T-S001-01 needs separate refactor-first or platform-seam extraction task");
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
        "| T-S001-01 | src/lib/branding.ts | blocked | Not approved for this backend task. |",
      ),
      sourceStoryPacket,
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("T-S001-01 write set classification is blocked for src/lib/branding.ts");
  });

  it("blocks extraction when the dependent task does not depend on the extraction task", () => {
    const packetWithExtractionTask = validTaskPacket
      .replace(
        "| T-S001-01 | S-001 | backend | Add root-admin tenant branding persistence update using the approved tenants public seam.",
        "| T-S001-00 | S-001 | refactor-first | Extract reusable branding normalization without behavior changes. | src/features/tenantConfiguration/domain/brandingNormalization.ts, tests/unit/tenantConfiguration/brandingNormalization.test.ts | API route changes, frontend rendering | not-applicable: prerequisite extraction task | not-applicable: feature-local refactor | queued-for-delivery |\n| T-S001-01 | S-001 | backend | Add root-admin tenant branding persistence update using the approved tenants public seam.",
      )
      .replace(
        "| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
        "| T-S001-00 | refactor-first | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/refactor-first-task-guardrail.md | approved | Refactor-first guardrail reviewed for behavior-preserving extraction. |\n| T-S001-01 | backend | .codex/skills/20-planning-artifacts/task-breakdown-maintainer/references/backend-task-guardrail.md | approved | Feature-local backend guardrail reviewed for tenantConfiguration route, persistence, authz, and artifact obligations. |",
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
        "| T-S001-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated backend task. |",
        "| T-S001-00 | queued-for-delivery | none | Ready for Layer 5 as an isolated refactor task. |\n| T-S001-01 | queued-for-delivery | none | Ready for Layer 5 as an isolated backend task. |",
      );

    const result = validateTaskBreakdownContent(packetWithExtractionTask, sourceStoryPacket);

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "T-S001-01 extraction dependency must block queueing on a refactor-first or platform-seam task",
    );
  });

  it("blocks tasks mapped to stories that are not approved for task breakdown", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace("| T-S001-01 | S-001 | backend |", "| T-S001-01 | S-999 | backend |"),
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

  it("blocks hidden refactor-first blockers inside feature work", () => {
    const result = validateTaskBreakdownContent(
      validTaskPacket.replace(
        "| --- | --- | --- | --- | --- | --- |\n\n## Layer 5 Delivery Handoff",
        "| --- | --- | --- | --- | --- | --- |\n| B-001 | T-S001-01 | refactor-first |  | Repository seam must be split before backend work. | pending |\n\n## Layer 5 Delivery Handoff",
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
