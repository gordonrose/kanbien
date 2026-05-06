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
| `DEV:backend` | strong | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover route/domain, projection, lifecycle, audit events, transaction consistency, background job handlers, observability events, and test-only route-away. Add examples later only when additional backend classes create ambiguity. |
| `DEV:frontend` | strong | strong | medium | strong | strong | partial | low | P3 | Initial worked examples added for app adoption, route/module interaction, API projection consumption, runtime defect fixes, and evidence-sweep route-away. Add class-specific examples later only when real frontend slices expose new ambiguity. |
| `DEV:vertical-slice` | medium | strong | medium | strong | strong | partial | low | P3 | Initial worked examples added for valid persisted-projection journeys, invalid convenience grouping, permission-aware runtime coupling, and design-system adoption route-away. Revisit only when a real vertical slice exposes new split-pressure ambiguity. |
| `DEV:platform-seam` | strong | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover route mounting, generated-artifact materialization, auth request-context helpers, scheduler policy blockers, bootstrap/runtime, tooling harnesses, shared helpers, and cross-feature infrastructure. Add examples later only for new seam classes. |
| `DEV:migration-persistence` | strong | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for new migrations, normalization/uniqueness, repository query semantics, and Postgres harness updates. Add corrective/backfill examples later when real live-data repair slices exist. |
| `DOC:api-contract` | strong | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover no-wire-change refresh, additive route contracts, compatibility-sensitive changes, non-maintained OpenAPI/Postman rationale, maintained OpenAPI/Postman sync, and generated docs sync. Add examples later only when generated API materialization changes. |
| `DOC:docs-artifact` | strong | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for README/status sync, runbook updates, implementation-status notes, stale-artifact sweeps, and Build Work Panel design-system route-away. Replace the placeholder feature-doc-refresh shape with a real `docs/features/` slice when the repo has one, and add further examples only when new residual docs classes show ambiguity. |
| `DOC:permission-mapping` | strong | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover runtime-enforced rows, documentation-only rows, grant-source rows, object/lifecycle boundaries, future-authz-model blockers, and UI eligibility. Revisit after Layer 2 authz model expansion for approved configuration/relationship examples. |
| `DOC:data-dictionary` | medium | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for dictionary alignment, retention/export/delete/legal-hold gaps, compliance-health debt posture, and live-schema mismatch blockers. Remaining hardening is policy work for scoped fail-on-debt once debt has approved cleanup or exception posture. |
| `DOC:standards-compliance` | medium | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for repo-only gate reviews, platform status snapshots, external control maps, waiver/blocker reviews, and standards-authority route-away. Add framework-specific examples later only when real GDPR, ISO, OWASP, NIST, or WCAG control-map slices expose new ambiguity. |
| `TEST:test-only` | strong | strong | medium | strong | strong | partial | low | P3 | Initial worked examples added for PRD test cases, permission/security matrices, regression locks, and fixture honesty. Remaining hardening is empirical coverage-strength calibration against escaped-defect history and e2e journey tiers. |
| `TEST:test-suite-alignment` | strong | strong | medium | strong | strong | partial | low | P3 | Initial worked examples added for traceability labels, lifecycle/status mismatch, moved test files, and route-away when proof does not exist. Add examples later only for new mismatch classes. |
| `DECISION:refactor-first` | strong | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover duplicate consolidation, over-broad decomposition, test seams, wrong-owner moves, extraction before reuse, performance-preserving refactors, and architecture-route blockers. Add examples later only when new trigger/type pairings recur. |
| `DECISION:architecture-foundation` | medium | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover authz boundary, frontend topology authority, lifecycle cleanup, approved-source-exists, persistence model, dependency selection, and testing-strategy architecture gaps. Add concern-area examples later only when real slices expose new ambiguity. |
| `EVIDENCE:qa-evidence` | strong | strong | strong | strong | strong | partial | low | P3 | Worked examples now cover served asset verification, mock-honesty comparison, live payload/browser proof, evidence sweeps, runtime process checks, and coverage-strength interpretation. Add examples later for new evidence instruments only. |
| `GOV:standards-update` | strong | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for enforced-now, template-required, script-reported-debt, advisory-approved-debt, artifact-invalidation sweeps, and compliance route-away. Add examples later only when new standards-authority classes or rollout/debt postures create ambiguity. |
| `GOV:architecture-update` | strong | strong | strong | strong | strong | partial | low | P3 | Initial worked examples added for ADR creation/amendment, system overview updates, frontend topology authority, architecture-owned template updates, architecture-map updates, and unresolved-decision route-away. Add examples later only when new architecture authority surfaces or compatibility postures create ambiguity. |
| `GOV:design-system` | strong | strong | medium | strong | strong | partial | low | P3 | Initial worked examples added for render seams, behavior/controller seams, accessibility semantics, canonical/evidence updates, and app-adoption contamination blockers. Add examples later only for new seam classes. |

## Remaining Priority Sequence

The initial example-hardening pass is complete. Use this remaining order unless
a real delivery blocker changes the risk profile:

1. `DOC:data-dictionary`: resolve scoped retention/export/delete/legal-hold
   review rows surfaced by `npm run data:compliance-health`.
2. `TEST:test-only`, `TEST:test-suite-alignment`, and `EVIDENCE:qa-evidence`:
   empirically calibrate `npm run test:coverage-strength` interpretation
   against escaped-defect history and e2e journey tiers before making it fail
   on debt.
3. `DOC:permission-mapping`: revisit after Layer 2 approves any
   configuration-based, relationship-based, ABAC, or ReBAC authorization model.
4. `shared-code-placement-task-guardrail.md`: add supplemental worked examples
   for owning-feature public seams, `src/lib`, stay-put, and
   `DEV:platform-seam` placement.
5. Manifest/validator policy: decide whether
   `task-type-contract-manifest.md` remains a human routing reference or becomes
   validator-required in task packets.

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
