import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { validateProductRequestContent, validateProductRequestPath } from "../../../src/scripts/productRequestValidate";

const validStoryBreakdown = `# Story Breakdown Packet: Example

## Status

- Packet status:
  \`ready-for-task-breakdown\`

## Handoff Validation

- Architecture invention check:
  \`consumes-steering-only\`

## Steering Architecture Classification Snapshot

| Classification ID | Scope Element | Classification | Owner / Seam | Decision Status | Required Downstream Signal |
| --- | --- | --- | --- | --- | --- |
| CLS-001 | example docs | feature-local | docs | approved | DOC:docs-artifact |

## Frontend Architecture Classification Snapshot

| Scope Element | Route Family | Product Module | Journey Group | Route Visibility | Actor Scope | Runtime Shape | Surface Class | Topology Class | Locator Type | Canonical Locator | Compatibility Locators | Topology Authority | Target Topology Authority | Authority Transition Posture | State Owner | Shell Governance | Design-System Prerequisite | Materialization Model | Source Placement | Implementation Readiness | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Browser Security Posture Snapshot

| Security Area | Present | Layer 2 Decision / Evidence | Required Layer 4 Signal | Stop If Missing |
| --- | --- | --- | --- | --- |

## Task-Type Signal Matrix

| Story ID | Signal | Present | Evidence | Implied Task Type |
| --- | --- | --- | --- | --- |
| S-001 | Docs artifact | yes | Story produces a planning artifact. | DOC:docs-artifact |

## Epic Summary

- Epic job to be done:
  Keep example planning traceable.
- Epic outcome:
  Reviewers can validate the hierarchy.
- Epic actors:
  planner
- Epic non-goals:
  implementation
- Epic dependency summary:
  none
- Epic-level proof target:
  \`contract-level\`

## Story Narratives

### S-001: Example story

**Situation**
This request needs a simple story that can prove the hierarchy.

**Goal**
Reviewers can see the parent request points to a valid story.

**Decisions Needed**
The work needs agreement that the example remains planning-only.

**Work That Follows**
The work will keep the story available for downstream task planning.

**Evidence Of Success**
A reviewer can validate the story from the parent request.

## Story Queue

| Story ID | Status | Value Type | Delivery Shape | Title | Context | Job To Be Done | Actor / System Perspective | Outcome | Blocks / Depends On |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | ready-for-task-breakdown | harness-value | DOC:docs-artifact | Example story | This is needed to keep request hierarchy validation concrete. | As a planner, I need one valid story. | planner | Story is valid. | none |

## Acceptance Criteria

| AC ID | Story ID | Acceptance Criterion | Primary Proof Layer | Required Test Families | Required Artifact Obligations |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | S-001 | Example story validates. | contract-level | unit | none |

## Capability Mapping

| Story ID | AC ID | Capability Matrix Row(s) | Boundary | Capability Posture | Notes |
| --- | --- | --- | --- | --- | --- |
| S-001 | AC-S001-01 | not-applicable: planning only | planning | not-capability-backed | no behavior capability |

## Dependency And Seam Map

| Dependency ID | Needed By Story / AC | Provider Feature Or Seam | Dependency Type | Existing Or New | Required Contract Proof | Integration Test Obligation |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | S-001 / AC-S001-01 | product request validator | pre-existing-capability | existing | unit test | no integration |

## Story Test Input Matrix

| Story ID | Actors | Actor Permissions | Actor States | Object States | Value Types / Validation Rules | Lifecycle Transitions | System Errors | NFRs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S-001 | planner | repo writer | active | request folder | valid story path | draft to valid | missing file | traceability |

## Acceptance Criteria To Test Obligation Matrix

| AC ID | Actors / States Covered | Capability Row(s) | Proof Layer | Required TC IDs Or TC Obligation | Integration Needed |
| --- | --- | --- | --- | --- | --- |
| AC-S001-01 | planner | not-applicable: planning only | contract-level | unit test | no |

## Refactor-First And Architecture-Foundation Queue

| Blocker ID | Blocks Story | Blocker Type | Reason | Required Output | Stop Condition |
| --- | --- | --- | --- | --- | --- |

## Follow-Up Decision Questions

| Question ID | Trigger / Blocker | Question | Required Before Layer 3 Completion | Resolution / Owner |
| --- | --- | --- | --- | --- |

## Layer 3 Unblock Queue

| Unblock ID | Blocks Story / AC | Blocker Source | Unblock Type | Human Decision Needed | Options / Safe Defaults | Recommended Next Action | Can Auto-Create Artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Artifact Ledger

| Artifact ID | Story ID | Artifact Type | Required Action | Owner Skill Or Workflow | Blocks Task Breakdown |
| --- | --- | --- | --- | --- | --- |

## Layer 4 Handoff

| Story ID | Handoff Status | Reason |
| --- | --- | --- |
| S-001 | ready-for-task-breakdown | Story validates. |
`;

const requestContent = `# Product Request: Example

## Status

- Product Request ID:
  \`PRQ-EXAMPLE\`
- Date:
  2026-05-07
- Current status:
  \`story-breakdown\`
- Requester-facing status:
  Ready for planning
- Source channel:
  \`chat\`
- Owning context:
  platform
- Priority:
  not-set

## Human Summary

- Target users:
  planners
- Change type:
  hierarchy validation
- Routing layer:
  \`core-platform-pr\`
- What we are trying to accomplish:
  Prove Product Request validation.

## Artifact Links

- Product Discovery packet:
  pending
- Technical Steering packet:
  pending
- Story Breakdown:
  pending
- Task Breakdown:
  pending
- PRD:
  pending
- Capability Matrix:
  pending
- PRD-derived test cases:
  pending
- Layer 1 Runtime Contract:
  pending
- Permission Mapping:
  pending
- API Contract:
  pending
- Work runs / Loop Runs:
  none yet
- Pull requests, config changes, or extension changes:
  none yet

## What The Chat Widget Should Show

- Title:
  Example
- Status:
  Ready
- Short update:
  Request validates.
- Waiting next:
  none
- User action needed:
  none

## Source-Of-Truth Boundary

Product Request is a brief human-readable summary, status tracker, and artifact
index. It must not replace the linked artifacts.
`;

describe("product request validation", () => {
  it("passes a flat product request cover sheet with pending downstream artifacts", () => {
    expect(validateProductRequestContent(requestContent)).toEqual([]);
  });

  it("blocks missing human summary fields", () => {
    const errors = validateProductRequestContent(requestContent.replace("  Prove Product Request validation.", ""));

    expect(errors).toContain("What we are trying to accomplish is required");
  });

  it("validates a folder request with a nested story-breakdown epic", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "product-request-folder-"));
    const epicDir = path.join(dir, "epics", "EPIC-001-example");
    mkdirSync(path.join(epicDir, "stories", "S-001-example-story"), { recursive: true });
    writeFileSync(path.join(dir, "request.md"), requestContent.replace("pending", path.join(epicDir, "epic.md")));
    writeFileSync(path.join(epicDir, "epic.md"), validStoryBreakdown);
    writeFileSync(
      path.join(epicDir, "stories", "S-001-example-story", "story.md"),
      `# Story S-001

## Story Narrative

**Situation**
This story needs a local explanation inside its own folder.

**Goal**
Reviewers can read the story without opening the parent epic.

**Decisions Needed**
The work needs agreement that this remains planning-only.

**Work That Follows**
The work will continue into task planning only after validation.

**Evidence Of Success**
The story folder validates from the parent request.
`,
    );

    try {
      expect(validateProductRequestPath(dir)).toEqual({
        status: "PASS",
        errors: [],
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("blocks folder requests without epics", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "product-request-no-epics-"));
    writeFileSync(path.join(dir, "request.md"), requestContent);

    try {
      const result = validateProductRequestPath(dir);

      expect(result.status).toBe("BLOCKED");
      expect(result.errors).toContain(`folder Product Request missing epics directory: ${path.join(dir, "epics")}`);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
