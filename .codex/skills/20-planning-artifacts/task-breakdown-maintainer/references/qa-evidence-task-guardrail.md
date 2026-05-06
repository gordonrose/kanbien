# QA Evidence Task Guardrail

Use for task type: `EVIDENCE:qa-evidence`

## Must Preserve

- proof layer matches the user-visible, runtime, contract, persistence, or
  standards risk
- runtime/browser evidence is required for visible runtime defects
- mock honesty against live data/API/projection shape
- no completion language outruns evidence
- QA evidence records status and proof posture; durable standards or
  architecture authority changes split to GOV task types

## Approval Evidence

- proof target and commands
- approved QA evidence class: `live-payload-sample`,
  `served-asset-verification`, `mock-honesty-comparison`,
  `runtime-process-check`, `browser-proof`, `coverage-strength-summary`, or
  `evidence-sweep`
- exact evidence source inventory naming files, URLs/routes, commands, ports,
  processes, screenshots, traces, persistence snapshots, or payload targets
- evidence instruments selected for the scoped risk, such as focused test
  commands, coverage-strength summaries, runtime/process checks, served asset
  checks, live API or projection payload samples, live persistence snapshots,
  browser screenshots/traces, accessibility evidence, or audit outputs
- live data/API/browser evidence plan when relevant
- mock-honesty comparison
- expected evidence artifact or output
- blocked, partial, or passing evidence status
- human-review boundary for evidence sufficiency and accepted unavailable proof
- `npm run test:coverage-strength` summary row, with `not-run: <reason>` only
  when the summary is genuinely unavailable or not applicable to the scoped
  evidence proof

## Deep Delivery Standard

- evidence capture, mock-honesty review, visual sweep, and runtime proof should
  normally be separate from implementation for complex work
- name exact evidence artifacts, scenarios, payload shapes, or audit outputs
- prefer class-specific script instruments: live payload samples name the route,
  response/projection, and capture command; served-asset verification names the
  active process, port, asset, and served check; mock-honesty comparison names
  fixture/mock sources and the live or contract shape compared
- treat deterministic scripts as evidence instruments, not as the evidence task
  itself; the task must still state why each instrument is relevant, how to
  interpret the result, and what remains unproven
- `npm run test:coverage-strength` measures test-suite strength beyond
  traceability; it does not replace slice-specific runtime, payload, browser,
  persistence, or mock-honesty proof when those risks are present
- for user-visible runtime proof, name the active process or served surface to
  inspect, whether a restart is required, and the live API, projection,
  persistence, served-asset, or browser evidence needed before completion
- for mock-heavy proof, compare fixtures and mocks with the approved contract or
  live data/API/projection shape; invented fallback behavior, missing fields, or
  convenience-only states must be recorded as evidence gaps
- broad proof commands are acceptable only when the task is explicitly an
  evidence sweep and the task-specific evidence targets are still named
- do not change product behavior inside a EVIDENCE:qa-evidence task unless a separate
  implementation task authorizes it
- do not add, remove, rename, or materially reframe executable test coverage;
  split that work to TEST:test-only or TEST:test-suite-alignment
- do not change QA standards, templates, validators, or architecture authority;
  split authority changes to GOV:standards-update or GOV:architecture-update
- if the evidence task finds a gap, route the gap to the owning task type:
  missing product/runtime behavior to `DEV:*`, missing executable proof to
  `TEST:test-only`, stale or misaligned traceability to
  `TEST:test-suite-alignment`, stale source-independent artifacts to the
  matching `DOC:*` task, and changed standards or architecture authority to the
  matching `GOV:*` task

## Worked Examples

| Scenario | Evidence Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| User-visible page fix must prove the served bundle contains the patched module. | `served-asset-verification` | Name active process, port, asset URL, source module, served-content check command, restart posture, expected evidence output, and what remains manually reviewed. | Do not patch frontend source or tests; route source fixes to `DEV:frontend` and executable proof to `TEST:test-only`. |
| API projection fixture may have invented fallback fields. | `mock-honesty-comparison` | Inventory fixture/mock source, API contract or live payload route, comparison command/output, mismatch posture, and evidence artifact. | Do not rewrite fixtures in this task unless routed to test-suite alignment or test-only work. |
| Runtime bug involves persisted rows and browser rendering. | `live-payload-sample` plus `browser-proof` | Capture live DB/API/projection shape, browser scenario/screenshot, active runtime process, and focused commands with pass/partial/blocked posture. | Do not call the defect fixed unless the evidence state is passing; route missing behavior to owning DEV task. |
| Broad proof sweep after a feature loop. | `evidence-sweep` | Name exact evidence targets, commands, coverage-strength summary, artifact outputs, and accepted residual gaps. | Do not change standards, architecture, or add missing tests inside the evidence sweep. |
| Backend/runtime code changed and the visible surface may still be served by an old process. | `runtime-process-check` | Name process lookup command, port, start time, restart requirement, expected runtime identity, and evidence artifact; status is blocked if the active process predates required runtime changes. | Do not restart, patch, or claim the fix is visible unless the owning implementation/runtime task authorizes that action. |
| A task needs a coverage-strength summary to understand residual proof debt after focused tests pass. | `coverage-strength-summary` | Run `npm run test:coverage-strength`, record score/output path, interpret it as debt signal rather than behavior proof, and name any accepted residual gaps or follow-up owner. | Do not replace task-specific payload/browser/security proof with coverage-strength output. |

## Required Check IDs

- `qa-proof-target`
- `qa-command-plan`
- `qa-evidence-class`
- `qa-evidence-source-inventory`
- `qa-evidence-instruments`
- `qa-runtime-evidence`
- `qa-mock-honesty`
- `qa-expected-output`
- `qa-evidence-status`
- `qa-coverage-strength-summary`
- `qa-human-review-boundary`
