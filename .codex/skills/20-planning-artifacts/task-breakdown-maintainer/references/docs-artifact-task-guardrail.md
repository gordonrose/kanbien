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

## Required Check IDs

- `docs-source-truth-reviewed`
- `docs-artifact-class`
- `docs-scriptable-source-inventory`
- `docs-stale-artifact-sweep`
- `docs-status-posture`
- `docs-validation-command`
- `docs-specialized-routing`
