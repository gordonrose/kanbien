# Layer 5 Script-First Roadmap

## Purpose

Layer 5 should become a script-assisted delivery system where repeatable
delivery governance is performed by deterministic scripts and the LLM is used
for judgment, trade-off explanation, and ambiguous blocker resolution.

This roadmap keeps the Layer 5 KPIs visible while the harness is built. Each
phase must record whether it improved or weakened the target posture.

## Target Operating Model

Layer 5 starts from one selected Layer 4 task.

Architecture sequencing note: ADR-0039 defers the persistent artifact registry
implementation until more visible product/frontend surface exists. Until then,
Layer 5 remains repo-backed but script-first and adapter-friendly, so future
artifact-registry reads can replace markdown parsing without discarding the
harness.

Scripts should answer:

- is this task allowed to start?
- what exact source context must be reviewed?
- what exact write set is allowed?
- what work is forbidden or routed away?
- what proof commands and evidence are required?
- what changed, and did it stay inside the task contract?
- what artifacts are now stale, satisfied, or still routed to another task?
- can the task be closed without drift, contamination, gaps, bloat, or rework?

The LLM should answer:

- whether a blocker requires human/product/architecture judgment
- whether a split or route-away decision is sensible
- whether the proof evidence is persuasive enough for the risk involved
- what residual risk remains after scripts pass

## KPI Scorecard

Every Layer 5 harness change should update or cite this scorecard.

| KPI | Target | Current Signal | Validation Question | Evidence To Record |
| --- | --- | --- | --- | --- |
| no rework | A task runner surfaces scope, source authority, write set, proof, dependencies, and blockers before delivery. | Generic runner parses selected task, dependencies, blockers, proof plan, guardrail evidence, route-away notes, and structured `DEV:platform-seam` contract fields. | Did the implementer avoid rediscovering the task contract manually? | Run record includes task contract snapshot, plugin field notes, and command results. |
| no drift | Artifact obligations and maintained outputs are detected before closeout. | First artifact-obligation detector maps selected changed-file families to maintained artifacts or explicit route-away task types. | Did the script identify docs/generated/artifact obligations changed by the slice? | Artifact-obligation report, validation commands, generated artifact checks. |
| no contamination | Scripts enforce task type, allowed write set, forbidden work, and route-away boundaries. | Task runner records write-set reports; closeout enforces exact-file and narrow-pattern write sets and fails closed on broad envelopes. | Did changed files stay inside the selected task's allowed envelope? | Write-set report comparing tracked, staged, and untracked files with the task contract. |
| no gaps | Required proof layers, blocked proof, runtime evidence, and mock-honesty notes are captured. | Generic runner records proof command results; closeout can rerun focused proofs and enforce write set after edits. | Did every required proof layer pass or have an explicit blocker? | Run record command results and future evidence-helper outputs. |
| no bloat | Task grain and split-pressure checks prevent multi-behavior delivery. | Layer 4 validator owns task grain before Layer 5; Layer 5 records one selected task. | Did the task remain one behavior, decision, proof target, or artifact closure target? | Task packet validation plus future post-edit diff/write-set summary. |
| script-first execution | Repeatable checks are executable, tested, and recorded. | Runner, command executor, run records, plugin registry, closeout gate, write-set enforcement, and one plugin module per `layer4TaskTypes` task type exist. | Did this phase reduce manual checklist work? | Unit tests, plugin results, run-record output, and harness command proof. |

## Phase Gates

Each phase must pass these common gates before it is considered durable harness
infrastructure:

- focused unit tests cover pass and blocked paths
- at least one real Layer 4 task packet passes through `npm run layer5:task`
- run record captures the new check or result
- unsafe or ambiguous cases fail closed
- docs explain what the script now owns and what remains LLM/human judgment

## Phase 1: Core Runner Foundation

Status: `in-progress`

Delivered:

- `npm run layer5:task`
- selected-task parser
- ready/blocked/refused classification
- allowlisted command runner
- run-record renderer
- plugin registry
- first `DEV:platform-seam` plugin shell
- module-level tests for parser, command runner, plugin selection, and records

Validation target:

- prove one ready task and one blocked task behave differently
- prove proof commands are skipped unless explicitly requested
- prove unsafe commands are blocked
- prove run records include plugin and command results

Current evidence:

- `npx vitest run tests/unit/layer5 tests/unit/productDiscovery tests/integration/productDiscovery`
- `npm run typecheck`
- `npm run layer5:task -- --task-breakdown <S-004 story folder> --task T-S004-01 --write-record --run-proofs`
- `npm run layer5:task -- --task-breakdown <S-007 story folder> --task T-S007-01 --write-record`

Exit criteria:

- core runner remains stable while the first full task-type plugin is expanded
- no direct implementation work bypasses the selected-task run record

## Phase 2: Full `DEV:platform-seam` Plugin

Status: `completed-first-pass`

Script ownership:

- parse the `Platform Seam Contract` row for the selected task
- verify seam kind, compatibility mode, owner/location, source inventory,
  exact write envelope, consumer inventory, representative proof, runtime
  impact, rollout/backout, split routing, and human review boundary
- compare platform-seam contract fields with common task fields where possible
- block when the seam is compatibility-sensitive without an approved strategy
- block when source inventory or representative proof is not scriptable

KPI targets:

- no rework: implementer receives the platform seam contract as structured
  script output
- no contamination: plugin flags API, persistence, frontend, evidence, or docs
  work that belongs to another task type
- no gaps: representative consumer proof and split routing must be present
- script-first execution: platform seam readiness is machine checked before
  delivery

Validation questions:

- Did the plugin reject a missing seam owner?
- Did it reject blocked compatibility mode?
- Did it reject missing representative proof?
- Did it pass `T-S004-01` without special casing that task?

Required tests:

- passing platform-seam packet
- missing owner/location
- blocked compatibility mode
- missing representative proof
- forbidden contamination not routed away

Exit criteria:

- `T-S004-01` passes the full plugin
- plugin result appears in the run record with field-level notes

Current evidence:

- `npx vitest run tests/unit/layer5/layer5Harness.test.ts`
- `npm run typecheck`
- `npm run layer5:task -- --task-breakdown docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-004-product-discovery-harness-adapter --task T-S004-01 --write-record --run-proofs`

## Phase 3: Write-Set Enforcement

Status: `completed-first-pass`

Script ownership:

- compare selected task allowed write set with `git diff --name-only`
- classify changed files as allowed, forbidden, or needs human review
- support exact-file and narrow-pattern envelopes first
- fail closed for broad patterns until the broad rationale parser is added
- include untracked files in the report

KPI targets:

- no contamination: changed files cannot silently exceed task scope
- no bloat: broad or cross-task edits are visible immediately
- no drift: generated and maintained artifacts are separated from source edits

Validation questions:

- Did the script catch a file outside the allowed envelope?
- Did it recognize exact allowed files and narrow patterns?
- Did it include untracked files?
- Did it fail closed for ambiguous broad write sets?

Exit criteria:

- every closeout run includes a write-set report
- task delivery cannot be called complete when write-set enforcement fails

Current evidence:

- `tests/unit/layer5/layer5Harness.test.ts` covers exact-file, narrow-pattern,
  forbidden-file, untracked-style, and ambiguous broad-envelope cases.
- `npm run layer5:task` records write-set results.
- `npm run layer5:closeout` enforces write-set results.

## Phase 4: Closeout Gate

Status: `started`

Script ownership:

- add `layer5:closeout`
- require a pre-edit run record
- rerun selected-task validation
- rerun plugin checks
- rerun proof commands
- run write-set enforcement
- record artifact-obligation disposition
- write final closeout evidence

KPI targets:

- no gaps: proof and evidence are rerun after edits
- no drift: artifact obligations must be complete or explicitly routed
- script-first execution: closeout becomes a command, not a manual checklist

Validation questions:

- Does closeout fail if no pre-edit run record exists?
- Does closeout fail if proof commands fail?
- Does closeout fail if changed files exceed the allowed write set?
- Does closeout clearly classify incomplete loops?

Exit criteria:

- delivery tasks have both pre-edit and closeout records
- final response can cite closeout evidence instead of manual reconstruction

Current evidence:

- `npm run layer5:closeout` exists and requires a pre-edit record.
- closeout reruns validation, plugin checks, focused proofs when requested, and
  write-set enforcement.
- closeout classifies its stopping state as `pass`,
  `blocked-pre-edit-record`, `blocked-task-status`, `blocked-plugin`,
  `blocked-write-set`, `blocked-artifact-obligation`, `blocked-validation`, or
  `blocked-proof`.
- `--changed-files-fixture` supports deterministic harness proof without using
  the current dirty worktree; normal closeout still enforces real git changes.
- `npm run layer5:closeout -- --task-breakdown docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-004-product-discovery-harness-adapter --task T-S004-01 --pre-edit-record docs/workspace/layer5-task-runs/2026-05-07/S-004-T-S004-01-run.md --run-proofs` fails closed because current harness/docs edits are outside the selected product task write set.
- `npm run layer5:closeout -- --task-breakdown docs/workspace/layer5-task-runs/fixtures/closeout-pass-task-breakdown.md --task T-L5FIX-01 --pre-edit-record docs/workspace/layer5-task-runs/fixtures/closeout-pass-pre-edit-record.md --changed-files-fixture docs/workspace/layer5-task-runs/fixtures/closeout-pass-changed-files.txt --run-proofs` produces `Closeout result: pass`.
- artifact-obligation disposition is included in closeout results.

## Phase 5: Artifact Obligation Engine

Status: `started`

Script ownership:

- parse `Artifact Obligations`
- inspect changed files and task type
- identify required maintained artifacts
- classify each as satisfied, missing, routed to another task, or blocked
- detect feature manifest and generated dependency graph obligations
- detect API, permission, data dictionary, QA evidence, and docs sweep needs

KPI targets:

- no drift: maintained artifacts cannot silently go stale
- no rework: artifact obligations are surfaced before closeout
- no contamination: docs closure work stays in the owning task when split

Validation questions:

- Did a route/API change trigger API contract obligations?
- Did a manifest change trigger dependency graph checks?
- Did a migration trigger data dictionary obligations?
- Did routed downstream work remain explicit?

Exit criteria:

- `layer5:closeout` includes artifact-obligation results
- incomplete artifact loops are classified, not hidden

Current evidence:

- `src/scripts/layer5/artifactObligations.ts` detects obligations for feature
  manifests, API/transport contracts, persistence or migrations,
  frontend/browser evidence, and Layer 5 harness edits.
- Feature manifest obligations require both generated dependency graph files
  and feature-dependency generator/check command evidence.
- API/route obligations are split into API contract docs, OpenAPI, maintained
  Postman collections, and permission-mapping artifacts.
- Persistence/data-dictionary obligations require a recognizable migration,
  persistence, Postgres, read/write, or focused test evidence command signal.
- Frontend/QA obligations require a recognizable Playwright, screenshot,
  runtime payload, mock-honesty, visual, or test-result evidence signal.
- `layer5:task` and `layer5:closeout` include artifact-obligation results in
  run records.
- `tests/unit/layer5/layer5Harness.test.ts` covers blocked, satisfied, routed,
  generated-graph command-evidence, API/OpenAPI/Postman/permission, and Layer 5
  harness artifact-obligation cases, plus persistence and QA evidence-shape
  blockers.
- Real `T-S004-01` harness proof reports artifact obligations as satisfied or
  explicitly routed while preserving the write-set contamination report.

## Phase 6: High-Risk Task-Type Plugins

Status: `completed-first-pass`

Covered task types:

1. `DEV:backend`
2. `DEV:frontend`
3. `DEV:vertical-slice`
4. `DOC:docs-artifact`
5. `TEST:test-only`
6. `TEST:test-suite-alignment`
7. `DECISION:refactor-first`
8. `DECISION:architecture-foundation`
9. `DOC:standards-compliance`
10. `GOV:standards-update`
11. `GOV:architecture-update`
12. `DEV:platform-seam`
13. `DEV:migration-persistence`
14. `GOV:design-system`
15. `DOC:api-contract`
16. `DOC:permission-mapping`
17. `DOC:data-dictionary`
18. `EVIDENCE:qa-evidence`

Initial priority order:

1. `DEV:migration-persistence`
2. `DOC:api-contract`
3. `DOC:permission-mapping`
4. `DOC:data-dictionary`
5. `DEV:backend`
6. `TEST:test-suite-alignment`
7. `EVIDENCE:qa-evidence`
8. `DEV:frontend`
9. `GOV:design-system`

Build rule:

- each plugin must parse its owning contract section
- each plugin must have pass and blocked unit tests
- each plugin must add field-level notes to the run record
- each plugin must fail closed when required source truth is missing

KPI target:

- each new plugin should reduce at least one manual LLM checklist item from a
  previous delivery run

Validation question:

- What exact manual judgment did this plugin remove, and what judgment remains
  intentionally human/LLM-owned?

Current evidence:

- One plugin module exists for each `layer4TaskTypes` entry.
- `npx vitest run tests/unit/layer5/layer5Harness.test.ts` covers pass,
  missing-contract fail-closed, and task-specific invalid-semantics cases for
  all 18 task types.
- `npm run typecheck`
- `npm run layer5:task -- --task-breakdown docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-004-product-discovery-harness-adapter --task T-S004-01 --write-record --run-proofs`

## Phase 7: Runtime Evidence Helpers

Status: `planned`

Script ownership:

- active process and port checks
- server start-time recording
- served asset inspection
- live API payload capture
- live schema or persistence sample capture when relevant
- mock-fixture comparison hooks
- browser evidence artifact links

KPI targets:

- no gaps: runtime-visible fixes require live evidence
- no drift: mocks cannot silently diverge from live payload shape
- script-first execution: runtime evidence is captured by helper commands

Validation questions:

- Did the helper prove the active process was restarted after backend changes?
- Did it compare mock fixture shape to live API or persistence shape?
- Did it record served frontend asset posture?

Exit criteria:

- runtime-visible tasks cannot close from source inspection alone

## Continuous Target Review

After each Layer 5 harness or delivery slice, record:

| Review Question | Answer |
| --- | --- |
| Which KPI improved? |  |
| Which manual LLM check became scripted? |  |
| Which check is still manual, and why? |  |
| Did any script fail closed on an unsafe or ambiguous case? |  |
| Did any task edit exceed its allowed write set? |  |
| Did artifact obligations become clearer or remain ambiguous? |  |
| Did run-record evidence become stronger? |  |
| What is the next highest-value script/plugin? |  |

## Continuous Target Review: 2026-05-07 Harness Pass

| Review Question | Answer |
| --- | --- |
| Which KPI improved? | No rework improved through structured platform-seam contract parsing; no contamination improved through write-set reports and closeout enforcement; no gaps improved through closeout reruns. |
| Which manual LLM check became scripted? | Platform seam owner/source/proof/compatibility/routing checks and exact/narrow write-set comparison became deterministic. |
| Which check is still manual, and why? | Semantic sufficiency of source authority, compatibility strategy quality, and task split judgment remain human/LLM-owned because they require domain judgment. |
| Did any script fail closed on an unsafe or ambiguous case? | Yes. The platform plugin blocks missing owner, unresolved compatibility-sensitive mode, missing representative proof, and unrouted contamination; write-set enforcement blocks broad envelopes and files outside scope. |
| Did any task edit exceed its allowed write set? | The current harness edit is not being closed as product task `T-S004-01`; `T-S004-01` proof was rerun as harness evidence, and its pre-edit write-set report saw no product-task source edits before record write. |
| Did artifact obligations become clearer or remain ambiguous? | Artifact obligations remain manual/pending; Phase 5 is still the next engine after closeout hardening. |
| Did run-record evidence become stronger? | Yes. Run records now include task-type plugin field notes and write-set results. |
| What is the next highest-value script/plugin? | Artifact obligation detection for changed files and task type, starting with generated artifacts, API contracts, feature manifests, and QA evidence routing. |

Default next-script rule:

When the LLM performs the same delivery check twice, promote that check into a
Layer 5 script or plugin unless the check is genuinely judgment-based.

## Continuous Target Review: 2026-05-08 Task-Type Coverage Pass

| Review Question | Answer |
| --- | --- |
| Which KPI improved? | Script-first execution improved because each known Layer 4 task type now has a dedicated Layer 5 plugin file; no gaps improved because each plugin has a pass, missing-contract, and invalid-semantics test; no drift improved through first-pass artifact-obligation detection. |
| Which manual LLM check became scripted? | Required contract-row presence, source/proof field checks, compatibility/split routing checks, one task-specific red-flag check per task type, and changed-file to artifact-obligation mapping became deterministic. |
| Which check is still manual, and why? | Whether the named authority source is persuasive and whether a compatibility or route-away plan is the right business/architecture call remains human/LLM-owned. |
| Did any script fail closed on an unsafe or ambiguous case? | Yes. The unit matrix now proves fail-closed behavior for missing contract rows and invalid task-specific semantics across all 18 task types. |
| Did any task edit exceed its allowed write set? | The real `T-S004-01` harness proof intentionally reports the broader harness/docs edit as outside that product task write set, preserving the no-contamination signal. |
| Did artifact obligations become clearer or remain ambiguous? | Clearer. The detector covers high-signal file families and classifies obligations as satisfied, routed, or blocked; generated graph command evidence and API/OpenAPI/Postman/permission obligations are now explicit. |
| Did run-record evidence become stronger? | Yes. Run records now include the expanded plugin matrix, write-set results, artifact-obligation results, and fresh `T-S004-01` proof evidence. |
| What is the next highest-value script/plugin? | Add a CI-facing closeout fixture test command or npm script so the pass-path proof can run as a named gate. |
