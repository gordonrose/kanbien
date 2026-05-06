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
| `DEV:backend` | strong | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for route/domain, projection, lifecycle, and test-only route-away cases; add class-by-class examples later for audit, transaction, background job, and observability classes. |
| `DEV:frontend` | strong | strong | medium | strong | strong | yes | medium | P3 | Add worked examples for each frontend change class and clarify which source inventories can be script-collected before browser proof. |
| `DEV:vertical-slice` | medium | strong | medium | strong | strong | yes | medium | P3 | Add valid and invalid examples showing inseparable backend-to-frontend proof versus convenience grouping. |
| `DEV:platform-seam` | strong | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for route mounting, generated-artifact materialization, auth request-context helpers, and scheduler policy blockers; add more examples later for bootstrap/runtime, tooling harnesses, shared helpers, and cross-feature infrastructure. |
| `DEV:migration-persistence` | strong | strong | strong | strong | strong | yes | low | P3 | Add worked examples for each migration/persistence class and script-shaped routing to data dictionary and test-only follow-up. |
| `DOC:api-contract` | strong | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for no-wire-change refresh, additive route contracts, compatibility-sensitive changes, and non-maintained OpenAPI/Postman rationale; add examples later for generated docs and OpenAPI/Postman sync. |
| `DOC:docs-artifact` | strong | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for README/status sync, runbook updates, implementation-status notes, stale-artifact sweeps, and Build Work Panel design-system route-away. Replace the placeholder feature-doc-refresh shape with a real `docs/features/` slice when the repo has one, and add further examples only when new residual docs classes show ambiguity. |
| `DOC:permission-mapping` | strong | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for runtime-enforced rows, documentation-only rows, future-authz-model blockers, and UI eligibility; revisit after Layer 2 authz model expansion for configuration/relationship examples. |
| `DOC:data-dictionary` | medium | strong | strong | strong | strong | yes | low | P3 | Resolve retention/export/delete/legal-hold gaps and later add scoped fail-on-debt once debt has approved cleanup or exception posture. |
| `DOC:standards-compliance` | medium | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for repo-only gate reviews, platform status snapshots, external control maps, waiver/blocker reviews, and standards-authority route-away. Add framework-specific examples later only when real GDPR, ISO, OWASP, NIST, or WCAG control-map slices expose new ambiguity. |
| `TEST:test-only` | strong | strong | medium | strong | strong | yes | low | P3 | Calibrate coverage-strength scoring against escaped-defect history and e2e journey tier expectations. |
| `TEST:test-suite-alignment` | strong | strong | medium | strong | strong | yes | low | P3 | Add examples that separate label/status reconciliation from newly required executable proof. |
| `DECISION:refactor-first` | strong | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for duplicate consolidation, over-broad decomposition, test-seam extraction, and architecture-route blockers; add more trigger/type pairings later. |
| `DECISION:architecture-foundation` | medium | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for authz boundary, frontend topology authority, lifecycle cleanup, and approved-source-exists cases; add more concern-area examples later. |
| `EVIDENCE:qa-evidence` | strong | strong | strong | strong | strong | partial | medium | P3 | Initial worked examples added for served asset verification, mock-honesty comparison, live payload/browser proof, and evidence sweeps; add more examples later for runtime process checks and coverage-strength interpretation. |
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

## Worked Example Program

Use real repo slices as the primary source for examples. Synthetic examples are
allowed only to cover a missing invalid/routing case that the recent repo
history does not show cleanly.

For each task type example slice:

1. Pick one recent promoted or audited repo slice with a clear source trail.
2. Extract the reusable task pattern instead of copying the full project
   history:
   - source inventory reviewed
   - exact allowed write targets
   - expected output artifact or behavior
   - required commands and expected output posture
   - route-away decisions to neighboring task types
   - human-review boundary
3. Compress the pattern into a compact worked example in the matching guardrail
   reference.
4. Add a synthetic invalid example only when a high-risk route-away case is not
   represented by the real slice.
5. Update this plan after the slice so the next move reflects completed example
   coverage and any remaining synthetic-only gap.

Suggested first real-slice sources:

| Example Source | Use For | Why It Helps |
| --- | --- | --- |
| Build Work Panel canonical/artifact refresh | `DOC:docs-artifact`, `GOV:design-system`, `EVIDENCE:qa-evidence`, `DEV:frontend` | Shows generated/canonical artifacts, adoption docs, verification docs, browser/visual proof, and app-adoption route-away pressure. |
| Layer 4 task-type hardening/status refresh | `DOC:docs-artifact`, `GOV:standards-update`, `GOV:architecture-update`, `DECISION:*` | Shows maintained reference updates, plan freshness, validator/template surfaces, and governance route-away boundaries. |
| Stale `DOC:docs-artifact` branch reconciliation | `DOC:docs-artifact`, `TEST:test-suite-alignment`, `EVIDENCE:qa-evidence` | Shows stale-artifact sweep, patch-accounted branch handling, and proof that stale changes should be retired rather than replayed. |
| Backend/API contract slices from recent route families | `DEV:backend`, `DOC:api-contract`, `DOC:permission-mapping`, `TEST:test-only` | Shows route/domain split, contract update boundaries, permission mapping route-away, and executable proof separation. |

### `DOC:docs-artifact` Example Queue

Start here before broadening to other task types.

| Example | Real Source Preference | Must Demonstrate | Synthetic Fill Allowed |
| --- | --- | --- | --- |
| Feature-doc refresh | No current repo `docs/features/` slice available | Placeholder shape added; replace with real source truth, exact docs target, source inventory, diff/check command, and human-review boundary when the first real slice exists | valid placeholder only; add invalid route-away if a feature-doc task tries to change API, standards, or architecture authority |
| README/status sync | Layer 4 status/reference refresh or a promoted repo-status update | Initial example added for README/index sync from maintained references | add only if a real status example includes a stale downstream artifact not covered by current route-away guidance |
| Runbook/operator note | Recent operational or verification-note update | Initial example added for bounded runbook updates from runtime/support truth | add only if a future operator-facing slice exposes a new command/log evidence pattern |
| Implementation-status note | Layer 4 hardening plan/status update | Initial example added for current-state plan/status wording with no overclaiming | add only for invalid "mark complete without proof" posture if it recurs |
| Stale-artifact sweep | Stale docs-artifact branch reconciliation | Initial example added for branch/worktree source inventory, retired-versus-replayed rationale, and no hidden patch proof | add only for a specialized-artifact ownership case not covered by Build Work Panel route-away |

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
