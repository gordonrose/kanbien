# Story Breakdown Story: Runtime And Mock Honesty Evidence Plan

## Story Narrative

**Situation**
A simplified example can make Build chat look correct even when the real
workspace, protected actions, history, and PDF download path behave
differently. The system needs proof based on realistic shapes, not convenient
fixtures.

**Goal**
Reviewers can trust that the Build chat experience works in the real
root-admin workspace, not only in simplified examples.

**Decisions Needed**
We need to agree which live-like states must be covered, including desktop,
mobile, empty history, denied access, failed document creation, failed
download, and degraded service behavior.

**Work That Follows**
The work will establish proof coverage for the saved records, protected
actions, PDF behavior, browser states, and fixture honesty.

**Evidence Of Success**
A reviewer can compare test fixtures with the real shapes the system serves
and confirm the proof covers realistic success, denial, failure, and recovery
states.

## Source Artifact

- Journey inventory and QA evidence plan:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`

## Task Breakdown Alignment

Future S-008 tasks should reference the journey IDs in the inventory instead
of restating the evidence plan. The expected task slices are:

| Candidate Task Slice | Task Type | Primary Output |
| --- | --- | --- |
| `QA-CHAT-L1-001` | `TEST:test-suite-alignment` | Convert the inventory into executable test placement and fixture rules. |
| `QA-CHAT-L1-002` | `EVIDENCE:qa-evidence` | Capture API payload, persistence-row, and mock-honesty evidence for conversation and history flows. |
| `QA-CHAT-L1-003` | `EVIDENCE:qa-evidence` | Capture generated PDF success, denial, retry, and failure evidence. |
| `QA-CHAT-L1-004` | `EVIDENCE:qa-evidence` | Capture root-admin browser and design-system adoption evidence after first-consumer parity exists. |
| `QA-CHAT-L1-005` | `DOC:docs-artifact` | Attach final evidence summary to Product Request, Story Breakdown, PRD test cases, and implementation closure artifacts. |
