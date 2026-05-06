import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { validateStoryBreakdownContent, validateStoryBreakdownPath } from "../../../src/scripts/storyBreakdownValidate";

const validPacket = `# Story Breakdown Packet: Tenant Branding

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
| S-000 | source-independent docs impact | yes | Capability matrix normalization story. | DOC:docs-artifact |
| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |

## Epic Summary

- Epic job to be done:
  As the platform, keep tenant branding delivery scoped and provable.
- Epic outcome:
  Tenant branding stories can enter Task Breakdown without vague work.
- Epic actors:
  root admin, tenant user, harness
- Epic non-goals:
  public logo delivery
- Epic dependency summary:
  tenant feature and assets feature
- Epic-level proof target:
  \`mixed\`

## Story Narratives

### S-000: Capability matrix normalization

**Situation**
The system needs a clear list of what tenant branding must be able to do before follow-on work is split further. Without that list, planning can drift from broad intent into unclear work.

**Goal**
Reviewers can see that every story has explicit behavior or a clear reason why it is only planning work.

**Decisions Needed**
We need to confirm which story outcomes must become explicit behavior and which ones are only planning or review controls.

**Work That Follows**
The work will establish the approved behavior list and connect it to the story outcomes before delivery planning begins.

**Evidence Of Success**
A reviewer can trace each story outcome to an approved behavior row or to a plain explanation that no behavior row is needed.

### S-001: Root admin updates branding

**Situation**
People using a tenant workspace need to see the approved tenant name, but today that visible name can be unclear or mixed with other tenant facts.

**Goal**
A root admin can save the display name for one selected tenant, and tenant users can trust that the approved name appears after reload.

**Decisions Needed**
We need to confirm the visible name is separate from the tenant's legal or internal name and that only the selected tenant is changed.

**Work That Follows**
The work will establish the save path, the read path, validation for unacceptable values, and review records for sensitive changes.

**Evidence Of Success**
A reviewer can confirm the selected tenant shows the approved name, other tenants are unchanged, invalid values are rejected, and sensitive changes leave a reviewable record.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Capability matrix normalization | This is needed to break down what tenant branding needs to be able to do into individual capabilities, so we can plan the implementation more accurately. | As the delivery harness, I need approved stories translated into capability rows so implementation starts from explicit obligations. | harness | Approved capability rows exist for every acceptance criterion. | Technical Steering packet |
| S-001 | ready-for-task-breakdown | user-value | DEV:backend | Root admin updates branding | This is its own story because changing the name people see is a clear business action that can be reviewed separately from logo work. | As a root admin, I need to update a tenant branding display name so tenant users see the approved value after reload. | root admin | Branding display name is persisted for the selected tenant. | S-000 |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S000-01 | S-000 | Every story acceptance criterion maps to an approved capability row or explicit non-capability rationale. | contract-level | docs-alignment, standards | capability matrix |
| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-000 | AC-S000-01 | CAP-BRANDING-000 | root | existing-approved | Harness control row. |
| S-001 | AC-S001-01 | CAP-BRANDING-001 | root | existing-approved | Root-admin tenant branding update. |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-000 | S-000 / AC-S000-01 | capability matrix template | pre-existing-capability | existing | template field review | docs alignment confirms capability rows cover all story ACs |
| DEP-001 | S-001 / AC-S001-01 | tenants public read seam | feature-public-seam | existing | service contract test | integration test proves selected tenant lookup before branding update |

## Downstream Capability Impact

| New Or Changed Capability / Seam | Future Consumer | Contract Promise | Must Not Depend On | Integration Coverage |
| --- | --- | --- | --- | --- |
| tenant branding update | tenant dashboard branding projection | display name is durable branding fact | canonical tenant name mutation | integration test in first consumer story |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-000 | harness | not-applicable: planning control | active planning packet | story queue draft and ready | valid and missing capability rows | draft to ready | missing source artifact | standards, traceability |
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

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U-001 | S-001 / AC-S001-01 | ART-001 | api-contract-required | not-applicable: artifact already created for ready handoff | not-applicable: resolved artifact row | Confirm API contract artifact remains aligned before Delivery. | no | resolved |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |
| ART-001 | S-001 | API contract | create route contract | api-contract-maintainer | yes |

## Story Readiness Summary

- Ready stories:
  S-000, S-001
- Blocked stories:
  none

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-001 | ready-for-task-breakdown | Capability and proof obligations are mapped. |
`;

describe("story breakdown validation", () => {
  it("passes a packet with concrete stories, acceptance criteria, proof, dependencies, and capability mapping", () => {
    expect(validateStoryBreakdownContent(validPacket)).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks a ready story with a missing job to be done", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "As a root admin, I need to update a tenant branding display name so tenant users see the approved value after reload.",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("S-001 missing Job To Be Done");
  });

  it("blocks a story queue without human-readable context", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "This is its own story because changing the name people see is a clear business action that can be reviewed separately from logo work.",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("S-001 missing Context");
  });

  it("blocks technical implementation terms in story context", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "This is its own story because changing the name people see is a clear business action that can be reviewed separately from logo work.",
        "This is its own story because the backend API route can be implemented separately.",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "S-001 Context should be plain language; avoid technical terms: api, backend, route",
    );
  });

  it("allows direct planning language for control stories", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "This is its own story because changing the name people see is a clear business action that can be reviewed separately from logo work.",
        "This is needed to break down what the dashboard needs to be able to do into individual capabilities, so we can plan the implementation more accurately.",
      ),
    );

    expect(result.errors).not.toContain("S-001 missing Context");
  });

  it("blocks missing acceptance criteria", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |\n",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("S-001 has no acceptance criteria");
  });

  it("blocks acceptance criteria without proof layers", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. | persistence-level | unit, integration, security, audit | API contract, data dictionary, permission mapping |",
        "| AC-S001-01 | S-001 | Root admin update persists the tenant branding display name for exactly one selected tenant. |  | unit, integration, security, audit | API contract, data dictionary, permission mapping |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("AC-S001-01 has invalid or missing proof layer: (blank)");
  });

  it("blocks acceptance criteria without capability mapping", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| S-001 | AC-S001-01 | CAP-BRANDING-001 | root | existing-approved | Root-admin tenant branding update. |\n",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("AC-S001-01 has no capability mapping row");
  });

  it("blocks vague shortcut wording", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "Branding display name is persisted for the selected tenant.",
        "Implement feature and update docs as needed.",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("vague phrase found: implement feature");
    expect(result.errors).toContain("vague phrase found: update docs");
    expect(result.errors).toContain("vague phrase found: as needed");
  });

  it("blocks frontend-affecting stories without DEV:frontend architecture snapshot rows", () => {
    const result = validateStoryBreakdownContent(
      validPacket
        .replace(
          "| tenant branding DEV:backend update | not-applicable | not-applicable: DEV:backend task | not-applicable: DEV:backend task | not-applicable | not-applicable | not-applicable | not-applicable | not-topology | none | not-applicable: no DEV:frontend locator | not-applicable: no compatibility locator | not-applicable | not-applicable | not-applicable | not-applicable | not-applicable | not-governed | none | not-applicable | not-applicable | Backend-only steering has no rendered DEV:frontend surface. |\n",
          "",
        )
        .replace(
          "| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |",
          "| S-001 | DEV:frontend rendered surface | yes | Root admin branding page changes. | DEV:frontend |",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("frontend-affecting stories require Frontend Architecture Classification Snapshot rows");
  });

  it("blocks frontend-affecting stories without browser security posture snapshots", () => {
    const result = validateStoryBreakdownContent(
      validPacket
        .replace("| S-001 | API route or contract change | yes | Root admin update route contract changes. | DEV:backend |", "| S-001 | DEV:frontend rendered surface | yes | Root admin page changes. | DEV:frontend |")
        .replace(
          "## Browser Security Posture Snapshot\n\n| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |\n| --- | --- | --- | --- | --- |\n| not-applicable | no | Backend-only steering has no browser security posture. | not-applicable: no DEV:frontend task | no |\n\n",
          "",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("missing heading: ## Browser Security Posture Snapshot");
    expect(result.errors).toContain("frontend-affecting stories require Browser Security Posture Snapshot rows");
  });

  it("blocks ready stories without dependency coverage", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| DEP-001 | S-001 / AC-S001-01 | tenants public read seam | feature-public-seam | existing | service contract test | integration test proves selected tenant lookup before branding update |\n",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("S-001 is ready but has no dependency or seam mapping");
  });

  it("blocks architecture invention", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace("`consumes-steering-only`", "`proposes-new-architecture`"),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("Architecture invention check is proposes-new-architecture");
  });

  it("blocks decision-sensitive story statuses without follow-up questions", () => {
    const result = validateStoryBreakdownContent(
      validPacket
        .replace("| S-001 | ready-for-task-breakdown | user-value | DEV:backend |", "| S-001 | needs-prd-refinement | user-value | DEV:backend |")
        .replace(
          "## Follow-Up Decision Questions\n\n| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |\n| --- | --- | --- | --- | --- |\n\n",
          "## Follow-Up Decision Questions\n\n| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |\n| --- | --- | --- | --- | --- |\n\n",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "Follow-Up Decision Questions must include at least one row when blockers or PRD-refinement story statuses are present",
    );
  });

  it("blocks ready packets with unresolved required follow-up questions", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| --- | --- | --- | --- | --- |\n\n## Layer 3 Unblock Queue",
        "| --- | --- | --- | --- | --- |\n| Q-001 | B-001 | Which feature owns branding? | yes | ask requester |\n\n## Layer 3 Unblock Queue",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("Q-001 must be resolved before Layer 3 can be ready-for-task-breakdown");
  });

  it("allows draft packets to carry unresolved required follow-up questions", () => {
    const result = validateStoryBreakdownContent(
      validPacket
        .replace("`ready-for-task-breakdown`", "`draft`")
        .replace("| S-001 | ready-for-task-breakdown | user-value | DEV:backend |", "| S-001 | needs-prd-refinement | user-value | DEV:backend |")
        .replace(
          "| --- | --- | --- | --- | --- |\n\n## Layer 3 Unblock Queue",
          "| --- | --- | --- | --- | --- |\n| Q-001 | S-001 | Which feature owns branding? | yes | ask requester |\n\n## Layer 3 Unblock Queue",
        )
        .replace(
          "| U-001 | S-001 / AC-S001-01 | ART-001 | api-contract-required | not-applicable: artifact already created for ready handoff | not-applicable: resolved artifact row | Confirm API contract artifact remains aligned before Delivery. | no | resolved |",
          "| U-001 | S-001 / AC-S001-01 | ART-001 | api-contract-required | not-applicable: artifact already created for ready handoff | not-applicable: resolved artifact row | Confirm API contract artifact remains aligned before Delivery. | no | resolved |\n| U-002 | S-001 | Q-001 | human-decision | Which feature owns branding? | tenantBranding feature; tenantConfiguration extension | Ask requester before PRD or capability matrix creation. | no | needs-human-answer |",
        ),
    );

    expect(result).toEqual({
      status: "PASS",
      errors: [],
    });
  });

  it("blocks packets with no ready stories and no unblock rows", () => {
    const result = validateStoryBreakdownContent(
      validPacket
        .replace("`ready-for-task-breakdown`", "`blocked`")
        .replace(/ready-for-task-breakdown/g, "needs-capability-matrix")
        .replace(
          "| U-001 | S-001 / AC-S001-01 | ART-001 | api-contract-required | not-applicable: artifact already created for ready handoff | not-applicable: resolved artifact row | Confirm API contract artifact remains aligned before Delivery. | no | resolved |\n",
          "",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "Layer 3 Unblock Queue must include at least one row when no stories are ready for Task Breakdown",
    );
  });

  it("blocks unresolved required follow-up questions that are not mapped to the unblock queue", () => {
    const result = validateStoryBreakdownContent(
      validPacket
        .replace("`ready-for-task-breakdown`", "`blocked`")
        .replace("| S-001 | ready-for-task-breakdown | user-value | DEV:backend |", "| S-001 | needs-prd-refinement | user-value | DEV:backend |")
        .replace(
          "| --- | --- | --- | --- | --- |\n\n## Layer 3 Unblock Queue",
          "| --- | --- | --- | --- | --- |\n| Q-001 | S-001 | Which feature owns branding? | yes | ask requester |\n\n## Layer 3 Unblock Queue",
        ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("Q-001 unresolved required decision is missing a Layer 3 Unblock Queue row");
  });

  it("blocks artifact ledger rows that block Task Breakdown without unblock queue mapping", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| U-001 | S-001 / AC-S001-01 | ART-001 | api-contract-required | not-applicable: artifact already created for ready handoff | not-applicable: resolved artifact row | Confirm API contract artifact remains aligned before Delivery. | no | resolved |\n",
        "",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("ART-001 blocking artifact is missing a Layer 3 Unblock Queue row");
  });

  it("blocks human decision unblock rows without concrete options", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "| U-001 | S-001 / AC-S001-01 | ART-001 | api-contract-required | not-applicable: artifact already created for ready handoff | not-applicable: resolved artifact row | Confirm API contract artifact remains aligned before Delivery. | no | resolved |",
        "| U-001 | S-001 | ART-001 | human-decision | Which feature owns branding? | choose later | Ask requester before PRD or capability matrix creation. | no | needs-human-answer |",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("U-001 needs-human-answer must list options or explain no safe default");
  });

  it("blocks active stories without executive-readable narrative blocks", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        /## Story Narratives[\s\S]*?\n## Story Queue/,
        "## Story Narratives\n\n## Story Queue",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("S-000 missing Story Narrative block");
    expect(result.errors).toContain("S-001 missing Story Narrative block");
  });

  it("blocks narrative sections with placeholder filler", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "A root admin can save the display name for one selected tenant, and tenant users can trust that the approved name appears after reload.",
        "TBD",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain("S-001 Story Narrative Goal contains placeholder filler");
  });

  it("blocks backticked internal terms in story narratives", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "The work will establish the save path, the read path, validation for unacceptable values, and review records for sensitive changes.",
        "The work will establish the `tenantBranding` path for sensitive changes.",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "S-001 Story Narrative Work That Follows contains unexplained internal term markup: `tenantBranding`",
    );
  });

  it("blocks defaulting narrative language to team instead of system or work", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "The work will establish the save path, the read path, validation for unacceptable values, and review records for sensitive changes.",
        "The team will establish the save path and review records for sensitive changes.",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "S-001 Story Narrative Work That Follows should prefer system/person/work language over team language",
    );
  });

  it("blocks technical jargon in story narratives", () => {
    const result = validateStoryBreakdownContent(
      validPacket.replace(
        "The work will establish the save path, the read path, validation for unacceptable values, and review records for sensitive changes.",
        "The work will establish the API route and backend persistence for sensitive changes.",
      ),
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.errors).toContain(
      "S-001 Story Narrative Work That Follows should avoid unexplained technical terms: api, backend, persistence, route",
    );
  });

  it("validates folder packets with story files", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "story-breakdown-folder-"));
    mkdirSync(path.join(dir, "stories"));
    writeFileSync(path.join(dir, "epic.md"), validPacket);
    writeFileSync(path.join(dir, "stories", "S-000-capability-matrix-normalization.md"), "# Story S-000\n");
    writeFileSync(path.join(dir, "stories", "S-001-root-admin-updates-branding.md"), "# Story S-001\n");

    try {
      expect(validateStoryBreakdownPath(dir)).toEqual({
        status: "PASS",
        errors: [],
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("validates folder packets with story directories", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "story-breakdown-story-dirs-"));
    mkdirSync(path.join(dir, "stories", "S-000-capability-matrix-normalization"), { recursive: true });
    mkdirSync(path.join(dir, "stories", "S-001-root-admin-updates-branding"), { recursive: true });
    writeFileSync(path.join(dir, "epic.md"), validPacket);
    writeFileSync(path.join(dir, "stories", "S-000-capability-matrix-normalization", "story.md"), "# Story S-000\n");
    writeFileSync(path.join(dir, "stories", "S-001-root-admin-updates-branding", "story.md"), "# Story S-001\n");

    try {
      expect(validateStoryBreakdownPath(dir)).toEqual({
        status: "PASS",
        errors: [],
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("blocks story directories without story.md", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "story-breakdown-missing-story-md-"));
    mkdirSync(path.join(dir, "stories", "S-000-capability-matrix-normalization"), { recursive: true });
    mkdirSync(path.join(dir, "stories", "S-001-root-admin-updates-branding"), { recursive: true });
    writeFileSync(path.join(dir, "epic.md"), validPacket);
    writeFileSync(path.join(dir, "stories", "S-000-capability-matrix-normalization", "story.md"), "# Story S-000\n");

    try {
      const result = validateStoryBreakdownPath(dir);

      expect(result.status).toBe("BLOCKED");
      expect(result.errors).toContain(
        `folder story breakdown missing story.md: ${path.join(dir, "stories", "S-001-root-admin-updates-branding", "story.md")}`,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
