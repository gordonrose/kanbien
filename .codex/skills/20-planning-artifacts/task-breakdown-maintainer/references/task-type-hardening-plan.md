# Task Type Hardening Plan

This plan records the audit-derived hardening sequence for Layer 4 task-type
references. Use it before choosing the next task-type refinement slice.

The goal is not to make every task type equally large. The goal is to make each
task type precise enough that Layer 5 can execute from structured instructions,
preferably with script-assisted source inventory, generation, validation, and
debt reporting, while leaving product, design, architecture, standards, and
proof decisions in their owning layers.

## Harness KPIs

Rate each task type against these first-pass delivery goals:

- no rework: Layer 5 should receive enough source authority, exact write scope,
  commands, and split routing to avoid rediscovery
- no drift: source-independent docs, tests, generated artifacts, standards, and
  architecture should not silently diverge from approved truth
- no contamination: task types must not own work that belongs to another task
  type or upstream layer
- no gaps: required behavior, proof, artifacts, lifecycle, authz, compliance,
  and runtime evidence must be surfaced before queueing
- no bloat: each task should remain one behavior, decision, proof target, seam,
  or artifact alignment target unless inseparability is explicitly proven
- script-first execution: common task classes should expose machine-readable
  source inventory, exact targets, expected outputs, commands, and human-review
  boundaries so Layer 5 improvises as little as possible

## Audit Criteria

| Criterion | Meaning |
| --- | --- |
| Class Contract | The task type has an explicit class/kind/subtype model when its work varies materially by execution shape. |
| Validator Backing | Required fields, classes, split rules, and check IDs are enforced by the task breakdown validator. |
| Scriptable Inventory | The task packet can name concrete source files, globs, generated artifacts, live/runtime inputs, or command output for automated inspection. |
| Command / Output Contract | The task packet requires focused commands and expected outputs rather than broad suite or vague review notes. |
| Route-Away Strength | The reference and validator stop contamination into neighboring task types. |
| Examples Needed | The task type still needs worked examples to reduce human interpretation. |
| Improvisation Risk | Likelihood that Layer 5 still has to invent structure, commands, or scope. |

Ratings:

- `strong`: adequate for normal use; remaining work is examples or calibration
- `medium`: usable, but repeat task classes still need more deterministic shape
- `weak`: likely to produce drift, bloat, or manual interpretation without a
  focused hardening pass

## Current Hardening Matrix

| Task Type | Class Contract | Validator Backing | Scriptable Inventory | Command / Output Contract | Route-Away Strength | Examples Needed | Improvisation Risk | Priority | Next Hardening Move |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DEV:backend` | strong | strong | medium | strong | strong | yes | medium | P2 | Add generator-ready contracts for common backend classes: transport-route, domain-behavior, repository-consumer, authz-enforcement, lifecycle-behavior, audit-event, manifest-public-seam. |
| `DEV:frontend` | strong | strong | medium | strong | strong | yes | medium | P3 | Add worked examples for each frontend change class and clarify which source inventories can be script-collected before browser proof. |
| `DEV:vertical-slice` | medium | strong | medium | strong | strong | yes | medium | P3 | Add valid and invalid examples showing inseparable backend-to-frontend proof versus convenience grouping. |
| `DEV:platform-seam` | strong | strong | strong | strong | strong | yes | medium | P3 | Add worked examples for route mounting, generated-artifact materialization, auth middleware helpers, schedulers, and cases that must split to `GOV:architecture-update` now that seam source inventory, expected output, and human-review boundary are validator-backed. |
| `DEV:migration-persistence` | strong | strong | strong | strong | strong | yes | low | P3 | Add worked examples for each migration/persistence class and script-shaped routing to data dictionary and test-only follow-up. |
| `DOC:api-contract` | strong | strong | strong | strong | strong | yes | medium | P3 | Add more worked examples for no-wire-change docs alignment, additive route docs, compatibility-sensitive changes, and route families where OpenAPI/Postman are not maintained now that API contract class and maintained-artifact inventory are validator-backed. |
| `DOC:docs-artifact` | strong | strong | strong | strong | strong | yes | medium | P3 | Add worked examples for feature-doc refresh, README sync, runbook update, implementation-status note, and stale-artifact sweep now that classes, scriptable source inventory, exact docs targets, diff/check command, and human-review boundary are validator-backed. |
| `DOC:permission-mapping` | strong | strong | strong | strong | strong | yes | medium | P3 | Revisit after Layer 2 authz model expansion for more worked examples; permission mapping class, evidence inventory, and future-authz-model routing are validator-backed. |
| `DOC:data-dictionary` | medium | strong | strong | strong | strong | yes | low | P3 | Resolve retention/export/delete/legal-hold gaps and later add scoped fail-on-debt once debt has approved cleanup or exception posture. |
| `DOC:standards-compliance` | medium | strong | strong | strong | strong | yes | medium | P3 | Add more worked examples for GDPR, ISO, OWASP, and repo-only gate reviews after control/evidence inventory, coverage summary command, and human-review boundary are validator-backed. |
| `TEST:test-only` | strong | strong | medium | strong | strong | yes | low | P3 | Calibrate coverage-strength scoring against escaped-defect history and e2e journey tier expectations. |
| `TEST:test-suite-alignment` | strong | strong | medium | strong | strong | yes | low | P3 | Add examples that separate label/status reconciliation from newly required executable proof. |
| `DECISION:refactor-first` | strong | strong | strong | strong | strong | yes | medium | P3 | Add more worked examples for each trigger/type pairing now that target inventory, detection hints, compatibility proof, and human-review boundary are validator-backed. |
| `DECISION:architecture-foundation` | medium | strong | strong | strong | strong | yes | medium | P3 | Add worked examples across architecture concern areas now that decision source inventory, analysis checklist, and human-review boundary are validator-backed. |
| `EVIDENCE:qa-evidence` | strong | strong | strong | strong | strong | yes | medium | P3 | Add worked examples for live payload sampling, served asset verification, mock-honesty comparison, browser proof, and coverage-strength evidence sweeps now that QA evidence class, source inventory, expected output, and human-review boundary are validator-backed. |
| `GOV:standards-update` | strong | strong | strong | strong | strong | yes | medium | P3 | Add more worked examples for enforced-now, advisory-with-approved-debt-route, script-reported-debt, and existing-artifact invalidation sweeps now that update class, enforcement posture, and artifact invalidation sweep are validator-backed. |
| `GOV:architecture-update` | strong | strong | strong | strong | strong | yes | medium | P3 | Add more worked examples for ADR creation/amendment, system overview updates, frontend topology authority, and architecture-owned template changes now that update class, authority inventory, consistency sweep, and human-review boundary are validator-backed. |
| `GOV:design-system` | strong | strong | medium | strong | strong | yes | medium | P3 | Add worked examples for seam-producing tasks, app-adoption contamination, and evidence-only split to `EVIDENCE:qa-evidence`. |

## Priority Sequence

Use this order unless a real delivery blocker changes the risk profile:

1. `DOC:docs-artifact`: weakest script-first contract and easiest place for
   vague "update docs" drift to return.
2. `DOC:standards-compliance`, `GOV:standards-update`, and
   `GOV:architecture-update`: governance lanes need stronger examples and
   deterministic source/control inventories before higher delivery pace.
3. `DOC:api-contract`, `DOC:permission-mapping`, `DECISION:refactor-first`,
   `DECISION:architecture-foundation`, `EVIDENCE:qa-evidence`,
   `DEV:platform-seam`, and `DEV:backend`: medium-risk lanes where the main
   remaining value is class-specific examples, script-shaped inventory, and
   generator/readiness contracts.
4. `DEV:frontend`, `DEV:vertical-slice`, `DEV:migration-persistence`,
   `DOC:data-dictionary`, `TEST:test-only`, `TEST:test-suite-alignment`, and
   `GOV:design-system`: comparatively mature; revisit mainly for worked
   examples, calibration, or debt-policy changes.

## Operating Rules

- Do not start a task-type hardening slice from memory. Inspect this plan, the
  manifest, the guardrail reference, the packet template, the validator, and
  unit tests first.
- Prefer hardening one task type per slice.
- For each slice, state which KPI is being improved and which validator or
  template surface will enforce it.
- Do not add new prose-only obligations unless the task type is explicitly
  human-decision-owned. Convert recurring obligations into fields, check IDs,
  command expectations, or route-away rules.
- If a task type remains intentionally human-reviewed, record the human-review
  boundary so scripts can still handle source inventory, target inventory, and
  diff generation.
- Keep this plan aligned after each hardening slice; stale prioritization is
  itself harness drift.
