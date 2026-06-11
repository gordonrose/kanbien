# Archived Current Task Audit Records

Archived because `current-task-audit.md` is being tightened to a single-active
task artifact. These records previously coexisted in the current audit file and
are retained here as history, not as active task contracts.

## Archived Record: Record List Form Primary Index Proof

### Preflight Contract

- Task summary: Add the missing primary-index show/hide review control to the
  default `record-list-form` pattern proof so it can prove primary-index
  coordination through the hosted `entity-panel` proof.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/41-front-end/04-pattern-contract/SKILL.md`
  - `docs/design-system/04-pattern-contract/shared/entity-panel/EntityPanel-Contract.md`
  - `docs/design-system/04-pattern-contract/shared/record-list-form/RecordListForm-Contract.md`
  - `docs/design-system/04-pattern-contract/systems/default/record-list-form/RecordListForm-Proof.md`
- Task risk class: user-visible governed frontend pattern-proof gap
- Discovered evidence boundary: The record-list-form contract/proof exposed
  hosted secondary entity-panel controls but omitted primary-index presence.
  The relevant rendered surface is
  `/design-system/default/patterns/record-list-form`, with browser coverage in
  `tests/visual/designSystem/patterns/recordListFormPatternRoute.spec.ts`.
- Intended edit boundary: Record-list-form Layer 4 seam, default proof route,
  default design-system CSS needed to place the wrapper, focused visual test,
  and the record-list-form contract/proof docs.
- Files allowed to edit:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `src/frontend/designSystem/layers/04-pattern-contract/record-list-form/index.mjs`
  - `src/frontend/designSystem/systems/default/patterns/record-list-form/page.mjs`
  - `src/frontend/designSystem/systems/default/assets/styles.css`
  - `tests/visual/designSystem/patterns/recordListFormPatternRoute.spec.ts`
  - `docs/design-system/04-pattern-contract/shared/record-list-form/RecordListForm-Contract.md`
  - `docs/design-system/04-pattern-contract/systems/default/record-list-form/RecordListForm-Proof.md`
- Files explicitly out of scope:
  - `src/features/**`
  - `src/frontend/**/app*/**`
  - `src/frontend/designSystem/layers/04-pattern-contract/entity-panel/**`
  - persistence migrations
  - API contracts
  - generated feature dependency artifacts
- Required verification commands:
  - `npx playwright test tests/visual/designSystem/patterns/recordListFormPatternRoute.spec.ts`
  - `npm run check:design-system-harness`
- Allowed closure vocabulary: `candidate fix pending user confirmation` after
  focused browser evidence and harness evidence pass; do not claim the visible
  issue is fixed until the user confirms the rendered page.

### Post-Work Closure Record

- Actual files edited:
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `docs/architecture/adr/README.md`
  - `docs/architecture/adr/0052-require-current-task-audits-for-material-codex-work.md`
  - `docs/workspace/trust-harness/README.md`
  - `docs/workspace/trust-harness/codex-trust-override.md`
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `src/scripts/checkCurrentTaskAudit.ts`
  - `tests/audit/repoGovernance/harnessAdrRouting.test.ts`
  - `tests/fixtures/repoGovernance/currentTaskAudit/completion-without-evidence.md`
  - `tests/fixtures/repoGovernance/currentTaskAudit/outside-boundary.md`
  - `tests/fixtures/repoGovernance/currentTaskAudit/valid.md`
- Evidence collected:
  - Current task audit exists and records the latest pre-edit contract plus
    post-work closure record.
  - Repo-governance harness includes negative fixtures for missing audit,
    outside-boundary edits, and completion language without evidence.
  - `npm run check:repo-governance-harness` passes.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts` passes.
  - `npm run typecheck` passes.
- Commands run and results: pending
- Missing or inferred evidence: pending
- User confirmation still required: yes
- Final permitted closure state: pending

## Archived Record: Initial Current Task Audit Harness

### Preflight Contract

- Task summary: Add a required preflight task audit mechanism to the Codex trust
  harness so governed/material work records its evidence boundary before edits
  and records closure evidence after work.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `docs/workspace/trust-harness/codex-trust-override.md`
  - `docs/workspace/trust-harness/README.md`
  - `docs/standards/change-artifact-requirements.md`
  - `docs/standards/git-workflow-guardrails.md`
  - `docs/architecture/change-control.md`
  - `docs/architecture/adr/0051-log-harness-governance-decisions-as-adrs.md`
- Task risk class: material harness-governance change
- Discovered evidence boundary: Existing repo-governance harness runs through
  `npm run check:repo-governance-harness`, which currently executes
  `tests/audit/repoGovernance/harnessAdrRouting.test.ts`; git start-state
  safety is handled by `npm run git:preflight`; the trust harness operative
  docs live under `docs/workspace/trust-harness/`.
- Intended edit boundary: Current-task audit document, trust-harness operative
  docs, repo-governance executable audit/tests and fixtures, the reusable audit
  validation script, and an ADR record because this changes durable harness
  evidence requirements and loud-failure behavior.
- Files allowed to edit:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `docs/workspace/trust-harness/README.md`
  - `docs/workspace/trust-harness/codex-trust-override.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `tests/audit/repoGovernance/**`
  - `tests/fixtures/repoGovernance/**`
  - `src/scripts/checkCurrentTaskAudit.ts`
  - `docs/architecture/adr/README.md`
  - `docs/architecture/adr/0052-require-current-task-audits-for-material-codex-work.md`
- Files explicitly out of scope:
  - `src/features/**`
  - `src/frontend/**`
  - `tests/visual/**`
  - `tests/unit/designSystem/**`
  - `docs/design-system/**`
  - persistence migrations
  - generated feature dependency artifacts
- Pre-existing changed paths acknowledged:
  - `.codex/skills/00-orchestration/**`
  - `.codex/skills/20-planning-artifacts/**`
  - `.codex/skills/41-front-end/**`
  - `AGENTS.md`
  - `docs/architecture/frontend-overview.md`
  - `docs/architecture/adr/0051-log-harness-governance-decisions-as-adrs.md`
  - `docs/design-system/**`
  - `docs/workspace/issue-reconciliations/**`
  - `docs/workspace/trust-harness/frontend-visual-trust-contract.md`
  - `package.json`
  - `src/frontend/**`
  - `tests/audit/designSystem/**`
  - `tests/fixtures/designSystem/**`
  - `tests/unit/designSystem/**`
  - `tests/visual/designSystem/**`
- Required verification commands:
  - `npm run check:repo-governance-harness`
  - `npm run typecheck`
  - `npm run git:preflight`
- Allowed closure vocabulary: `partially verified` unless the focused
  repo-governance harness, typecheck, and git preflight all pass after the final
  code change; use `blocked on verification` if required commands cannot run.

### Post-Work Closure Record

- Actual files edited: pending
- Evidence collected: pending
- Commands run and results:
  - `npm run git:preflight`: failed before edits with `DIRTY_BLOCK`; user
    confirmed the dirty state is owned by the current task.
  - `npm run check:repo-governance-harness`: passed after adding negative
    fixtures and live audit validation.
  - `npm run typecheck`: passed.
  - `npm run git:preflight`: failed after edits with `DIRTY_BLOCK` because the
    broader worktree still contains dirty pre-existing task state.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: failed before
    appending this task's latest audit record; parser and audit record were
    reconciled afterward.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed after
    appending this task's latest audit record.
  - `npm run check:repo-governance-harness`: passed after the final audit
    parser reconciliation.
  - `npm run typecheck`: passed after the final parser/audit edits.
  - `npm run git:preflight`: failed after final edits with `DIRTY_BLOCK`
    because the broader worktree still contains dirty task state.
- Missing or inferred evidence: `git:preflight` remains blocked by dirty
  worktree state; the user confirmed the dirty state is owned by the current
  task, but the preflight gate itself did not pass.
- User confirmation still required: yes, because `git:preflight` cannot pass in
  the current dirty worktree.
- Final permitted closure state: partially verified
