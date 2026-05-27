# QA And Issue-Reconciliation Freshness Index

Date: 2026-05-27

Repo bucket classification: `shared-governance-kernel`.

Purpose: record a sampled freshness pass across QA operating records and
issue-reconciliation notes before any physical folder movement.

This is a cleanup index, not a replacement for the source records. It only
classifies the sampled records below.

## Freshness Lanes

- `promoted-lesson`: the record names a prevention lesson that appears to have
  been promoted into tests, helpers, skills, standards, templates, or runtime
  guardrails.
- `unresolved-caveat`: the record still names required evidence, approval, or
  production-readiness work.
- `needs-recheck`: the record names a candidate fix, watch item, or old proof
  that should be checked against current source/tests before closure.
- `historical-evidence`: the record is useful provenance but does not appear to
  carry current operating obligations.

## Sampled Records

| Record | Freshness lane | Evidence inspected | Cleanup implication |
| --- | --- | --- | --- |
| `docs/workspace/issue-reconciliations/2026-04-18-frontend-human-review-guard-hook-gap.md` | `promoted-lesson` plus `needs-recheck` | Names `tests/visual/designSystem/support/helpers/humanReviewGuards.ts`, design-system visual spec updates, and skill updates. Resolution status still says candidate fix awaiting user confirmation. | Keep active as learning evidence; recheck current user-confirmation/closure posture before marking closed. |
| `docs/workspace/qa/2026-04-25-asset-foundation-v1-qa-waiver-or-quarantine.md` | `unresolved-caveat` | Names provider contract tests and Postgres-backed persistence proof as required before production provider rollout or customer-facing asset upload UI. Approval is `no`. | Keep visible until an assets/provider readiness pass proves, supersedes, or reopens the caveat. |
| `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md` | `promoted-lesson` plus `needs-recheck` | Names direct test hardening in `tests/audit/designSystem/contextNavResponsive.test.ts` and follow-up watch items. | Keep as design-system prevention evidence; recheck against current navigation tests before closure or archive. |
| `docs/workspace/issue-reconciliations/2026-05-23-count-card-route-alias-fallback.md` | `promoted-lesson` | Distinguishes source/test changes from the active user-facing process and records the runtime-process freshness lesson. | Keep available as runtime verification guardrail input. |
| `docs/workspace/qa/2026-04-09-illustrative-defect-feedback-review.md` | `historical-evidence` | Marked as illustrative and describes example follow-up testing behavior. | Retain as training/example material unless replaced by a maintained template example. |
| `docs/workspace/issue-reconciliations/2026-04-27-root-admin-profile-picture-upload-failed-message.md` | `promoted-lesson` plus `needs-recheck` | Names app-level degraded-state visual regressions for stale upload routes, oversized profile pictures, preview rendering, and decorative save behavior. Resolution status still says candidate fix awaiting user confirmation. | Keep active until current profile-picture upload behavior and user confirmation posture are rechecked. |
| `docs/workspace/issue-reconciliations/2026-04-21-root-admin-breadcrumb-pressure-drift.md` | `promoted-lesson` | Names shared page-shell breadcrumb controller adoption and a desktop-width browser regression for breadcrumb/search collision. | Keep as governed app-adoption prevention evidence; future archive depends on confirming the shared page-shell seam remains current. |
| `docs/workspace/issue-reconciliations/2026-04-24-generated-canonical-render-route-fallback.md` | `promoted-lesson` | Names generated canonical render route registry, loud `404` behavior for unregistered routes, integration coverage, and launcher-chain proof. | Keep as frontend-harness routing guardrail evidence. |
| `docs/workspace/issue-reconciliations/2026-04-14-tenant-auth-bootstrap-audit-fk-mismatch.md` | `promoted-lesson` | Names the tenant-auth audit FK root cause, service fix, audit expectation refresh, and Postgres-backed regression. | Keep as backend shared-seam/persistence guardrail evidence. |
| `docs/workspace/qa/root-admin-security-matrix.md` | `promoted-lesson` | Names `tests/security/rootAdmin/permissionMatrix.test.ts` as executable proof and defines the update rule for new protected root-admin routes. | Treat as active QA/security operating artifact, not archive/history. |

## Group-Level Findings

Issue-reconciliation inventory inspected on 2026-05-27:

- 146 non-README issue-reconciliation records.
- Largest filename families by rough prefix:
  - `root-admin`: 31
  - `design-system`: 13
  - `list-detail`: 11
  - `context-nav`: 8
  - `sub-nav`: 6
  - `drawer-select`: 5
  - `canonical-renderings`: 5
- 15 records explicitly contain `candidate fix awaiting user confirmation`.

QA inventory inspected on 2026-05-27:

- 17 non-README QA records.
- These include feature QA checklists, exploratory notes, waiver/quarantine
  records, root-admin security matrix/backlog records, and illustrative
  examples.

Cleanup meaning:

- `root-admin` and design-system issue records are too large and too active to
  bulk archive. They should be grouped by governed surface and checked against
  current shared seams, visual tests, and app-adoption rules.
- Candidate-fix records should not be closed or archived until user-confirmation
  posture is reviewed or explicitly superseded.
- QA waiver/quarantine records should be checked before production-readiness
  work, especially asset/provider and persistence-backed caveats.
- Security matrices and proof backlogs should stay active when they name
  executable suites and update rules.

## Candidate Confirmation Queue

These issue-reconciliation records explicitly still contain
`candidate fix awaiting user confirmation` and should not be archived as closed
without a current recheck or explicit supersession:

- `docs/workspace/issue-reconciliations/2026-04-17-canonical-host-surface-isolation-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-context-nav-canonical-attachment-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-17-context-nav-magnification-offset-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-17-design-system-shell-parity-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-18-date-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-approved-form-baseline-parity-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-frame-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-canonical-render-surface-repeat-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-dark-contrast-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-frontend-human-review-guard-hook-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-simple-select-canonical-breadcrumb-chain-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-18-time-picker-canonical-render-surface-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-canonical-surface-scope-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-22-time-picker-mobile-canonical-frame-overlay-gap.md`
- `docs/workspace/issue-reconciliations/2026-04-27-root-admin-profile-picture-upload-failed-message.md`

## Folder Finding

Do not bulk-archive `docs/workspace/qa/` or
`docs/workspace/issue-reconciliations/` yet.

The sampled records show a mixed folder:

- some records already promoted lessons into executable tests or skills
- some still carry explicit unresolved production-readiness caveats
- some remain useful examples or historical evidence
- many older visual issue notes likely need closure-status recheck before being
  moved or declared current

## Next Safe Cleanup

The next safe cleanup step is to work the candidate confirmation queue by
family, starting with the repeated design-system canonical/control records from
2026-04-17 and 2026-04-18. For each group, check whether current tests, skills,
or design-system artifacts already supersede the candidate status before any
folder move or archive decision.
