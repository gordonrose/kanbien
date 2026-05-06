# Docs Artifact Task Guardrail

Use for task type: `DOC:docs-artifact`

## Must Preserve

- source-of-truth alignment with architecture, standards, PRD, contracts, and
  current implementation
- no source-independent docs describing stale platform behavior
- no artifact status promotion without validation or explicit blocker notes

## Approval Evidence

- source files or artifacts reviewed
- docs artifact class and scriptable source inventory
- docs artifact family and source-of-truth owner
- docs updated or intentionally not applicable
- exact docs target inventory
- diff/check command or explicit human-review rationale
- validation or review command
- downstream stale-artifact sweep result

## Allowed Artifact Families

Use `DOC:docs-artifact` only for residual source-independent docs sync after
specialized documentation, governance, test, and evidence task types have been
routed away. Allowed artifact families are:

- `feature-doc`
- `readme`
- `runbook`
- `workspace-status`
- `implementation-blueprint-status`
- `generated-artifact-summary`
- `maintained-artifact-sweep`
- `ordinary-doc-sync`

## Allowed Docs Artifact Classes

Use the class as the task's script-facing contract:

- `feature-doc-refresh`: refresh a bounded `docs/features/` artifact from
  approved feature source truth.
- `readme-index-sync`: update README or index/navigation artifacts from a
  bounded source inventory.
- `runbook-update`: update operational runbook content from approved runtime,
  lifecycle, support, or operational truth.
- `implementation-status-note`: update current-state/status wording after an
  approved implementation or planning artifact changed truth.
- `workspace-summary-artifact`: maintain a bounded workspace summary from named
  source artifacts.
- `stale-artifact-sweep`: inspect a bounded artifact set and record residual
  ordinary docs updates plus route-away outcomes for specialized artifacts.
- `template-or-example-sync`: update examples or templates to match approved
  task/harness truth without changing standards authority.

## Deep Delivery Standard

- one artifact family or source-truth alignment target per queued task
- separate decision/audit tasks from implementation or docs refresh tasks when
  the audit may change scope
- name the exact source files inspected, docs updated, and validation or review
  output
- fill the Docs Artifact Contract with class, scriptable source inventory,
  exact docs targets, route-away notes, diff/check command, and human review
  boundary
- record every specialized documentation or governance concern that was routed
  away before queueing the docs-artifact task

## Route-Away Boundaries

`DOC:docs-artifact` may identify stale specialized artifacts as part of a
maintained-artifact sweep, but the actual specialized update belongs to the
matching task type:

- API contract, OpenAPI, Postman, route shape, status codes, authn/authz,
  validation, pagination, sorting, or compatibility: `DOC:api-contract`
- entity/table/projection field semantics, lifecycle, retention, indexes,
  durable facts, data classification, export/delete, or data compliance trace:
  `DOC:data-dictionary`
- capability keys, roles, grants, deny rules, tenant context, object rules,
  grant source, UI eligibility, safe denial, audit/proof expectation, or authz
  mapping: `DOC:permission-mapping`
- standards status, external control maps, compliance evidence, waiver/blocker
  posture, or standards gate review: `DOC:standards-compliance`
- standards language, gates, templates, validators, check IDs, or rollout
  rules: `GOV:standards-update`
- architecture authority, ADRs, architecture maps, system overview,
  principles, change-control architecture guidance, or topology authority:
  `GOV:architecture-update`
- design-system behavior locks, canonicals, governed seams, visual signoff, or
  adoption contracts: `GOV:design-system`
- runtime/browser/live-data evidence, screenshots, traces, mock-honesty
  evidence, or QA summary artifacts: `EVIDENCE:qa-evidence`
- PRD test-case IDs, executable test labels, QA backlog/status alignment, or
  test-suite traceability drift: `TEST:test-suite-alignment`
- new executable proof: `TEST:test-only`

## Worked Examples

Use real repo slices as the preferred source for examples. If no current repo
slice exists for a class, keep the example as a shape to replace when a real
slice appears.

| Scenario | Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| A promoted implementation changes ordinary feature behavior and an existing `docs/features/<feature>.md` page needs wording aligned to approved source truth. No current repo `docs/features/` slice is available, so this is a replacement target for the first real feature-doc slice. | `feature-doc-refresh` | Source inventory names exact implementation files, tests, and approved planning artifact; write target is one `docs/features/<feature>.md`; diff command is `git diff -- docs/features/<feature>.md` plus validator command; human review confirms wording matches source truth only. | API route contracts, permission rows, data dictionary fields, standards posture, and executable proof split to their specialized task types. |
| A maintained README or index page is stale after a promoted reference or artifact-layout change, such as `docs/workspace/task-breakdown/README.md` needing to reflect the current Layer 4 reference set. | `readme-index-sync` | Source inventory names the maintained reference directory, template, and manifest; write target is one README/index; status posture is `updated`; stale sweep records whether neighboring API, data, permission, standards, architecture, test, or evidence artifacts were unchanged or routed away. | Do not change task-type standards, validators, check IDs, or architecture authority; route those to `GOV:standards-update` or `GOV:architecture-update`. |
| An operator-facing note such as `docs/operations/root-admin-browser-auth-runbook.md` or `docs/workspace/runbooks/2026-04-25-job-processing-local-runbook.md` needs a bounded correction from approved runtime/support truth. | `runbook-update` | Source inventory names the support command, runtime script, log output, or approved support artifact; write target is one runbook; diff/check command names the runbook path and any support command used as evidence; human review owns operational wording and escalation judgment. | Runtime code changes, scheduler semantics, cleanup policy, and new proof belong to `DEV:platform-seam`, `GOV:architecture-update`, `DOC:data-dictionary`, or `TEST:test-only`. |
| A current-state note must reflect a promoted planning/reference change, such as `task-type-hardening-plan.md` recording that the worked-example program now exists. | `implementation-status-note` | Source inventory names the promoted commits or maintained references that changed status; write target is the status/plan artifact only; diff/check command is `git diff -- <status-artifact>` plus `git diff --check`; human review confirms the status is not overstated. | Do not mark implementation, proof, standards, or architecture work complete unless the owning task produced the required evidence. |
| A stale docs-artifact branch or worktree is audited after main has moved on, and its only useful change is already present while remaining diffs would regress current references. | `stale-artifact-sweep` | Source inventory names branch/worktree status, compare output, relevant changed files, and branch-stack audit; write target is a bounded sweep note or plan/status update if needed; stale sweep records retired-versus-replayed rationale and no hidden patch proof. | Specialized stale outputs discovered by the sweep route to their owners; do not replay old API, permission, standards, architecture, design-system, test, or evidence artifacts through residual docs sync. |
| Build Work Panel docs, canonicals, verification checklists, and adoption contracts are stale after a design-system seam change. | blocked route-away | `DOC:docs-artifact` may record that the sweep found stale ordinary references, but the actual update is not residual docs sync because the changed truth is a governed design-system seam. | Route design-system behavior locks, canonicals, reference packs, adoption contracts, visual signoff, and verification evidence to `GOV:design-system` and `EVIDENCE:qa-evidence`; app adoption remains `DEV:frontend`. |

## Required Check IDs

- `docs-source-truth-reviewed`
- `docs-artifact-class`
- `docs-scriptable-source-inventory`
- `docs-stale-artifact-sweep`
- `docs-status-posture`
- `docs-validation-command`
- `docs-specialized-routing`
