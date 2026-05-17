# Branch Stack Reconciliation: repo health cleanup

- Date: 2026-05-17
- Original base: `origin/main` at `9655e523f794`
- Reconciled base: `origin/main` at `25ad0f7d6c33`
- Original branch: `codex/repo-hygiene-design-system-audit-reset`
- Follow-up branch: `codex/repo-health-followup-cleanup`
- Original HEAD: `9655e523f794`
- Reconciled HEAD: `25ad0f7d6c33`
- Disposition: active cleanup ledger
- Owner: repo-health-auditor / branch-and-commit-governor

## Starting Gate Results

- `npm run git:preflight`: `DIRTY_BLOCK`
- `npm run git:branch-stack-audit`: blocked by five unaccounted refs
- `npm run codex:tasks`: three active task records reported
- `npm run check:feature-dependencies`: passed during repo-health assessment
- `npm run test:traceability`: passed during repo-health assessment with `0`
  orphan executable IDs

## Current Gate Results After Cleanup Pass

- 2026-05-17 follow-up:
  - local `main` was fast-forwarded to `origin/main` at `25ad0f7d6c33`
  - the stale mixed worktree was preserved in stash
    `repo-health-followup-pre-realign-2026-05-17`
  - remaining cleanup/doc/harness changes were re-extracted onto
    `codex/repo-health-followup-cleanup`
  - the chat workspace design-system shell slice has already landed on
    `origin/main` and should no longer be treated as pending WIP in this ledger
- `npm run git:branch-stack-audit`: passed with `0` unaccounted refs after
  adding supersession records for recurring scheduler, Layer 3 governance, and
  backup refs.
- `npm run git:worktree-audit`: passed with `0` dirty stale-base worktrees.
- `npm run git:preflight`: still `DIRTY_BLOCK` because the active
  `codex/repo-hygiene-design-system-audit-reset` branch intentionally still
  contains local WIP.
- `npm run check:feature-dependencies`: passed with 27 features, 44
  cross-feature edges, and 0 validation violations.
- `npm run test:traceability`: passed with 563 active documented cases
  traceable and 0 orphan executable IDs.
- `git diff --check`: passed.
- Focused design-system extraction suite:
  `npx vitest run tests/unit/designSystem/chatWorkspaceBootstrap.test.ts tests/unit/designSystem/chatWorkspaceController.test.ts tests/unit/designSystem/chatWorkspaceConversationIndex.test.ts tests/unit/designSystem/chatWorkspaceEntityHost.test.ts tests/unit/designSystem/chatWorkspaceEntitySelector.test.ts tests/unit/designSystem/chatWorkspaceJointHeader.test.ts tests/unit/designSystem/chatWorkspaceListInteractions.test.ts tests/unit/designSystem/chatWorkspacePreviewEffects.test.ts tests/unit/designSystem/chatWorkspaceRowDrawer.test.ts tests/unit/designSystem/chatWorkspaceSecondaryHeader.test.ts tests/unit/designSystem/chatWorkspaceShellContract.test.ts tests/unit/designSystem/chatWorkspaceShellExtraction.test.ts tests/unit/designSystem/floatingTabRowReorder.test.ts tests/unit/designSystem/floatingTabStatusDrop.test.ts tests/audit/designSystem/chatWorkspacePatternExtractionAudit.test.ts`
  passed with 15 files / 39 tests.

## Active Dirty Worktree

### `codex/repo-hygiene-design-system-audit-reset`

- Worktree: `/home/gordon/kanbien`
- State: dirty, base-aligned with `origin/main`
- Unique commits: none
- Current recommendation:
  inspect and split the local changes before any retirement.

Original branch state carried a mixed design-system and root-admin shell WIP:

- chat workspace design-system extraction and controller seams
- chat workspace unit, audit, and visual coverage
- floating-tab reorder/status-drop test and asset work
- one shared Postgres test-harness edit
- this reconciliation note and the missing chat workspace extraction audit
  artifact added during cleanup startup

Disposition rule:

- The chat workspace design-system shell slice has since been promoted to
  `origin/main` at `25ad0f7d6c33`.
- Treat root-admin app adoption as blocked unless it consumes signed-off
  design-system-owned render/controller seams without app-local reconstruction
  drift.
- Do not retire the original stale branch/stash until this follow-up cleanup
  branch is verified and any remaining cleanup changes are promoted or parked.

### Active WIP Triage

Promoted design-system keepers now present on `origin/main` at `25ad0f7d6c33`:

- `src/frontend/designSystem/assets/chatWorkspace*.mjs`
- `src/frontend/designSystem/components/chat-workspace-shell.html`
- `src/frontend/designSystem/assets/chatWorkspacePattern.css`
- `src/frontend/designSystem/assets/chatWorkspacePattern.mjs`
- `src/frontend/designSystem/assets/canonicalRenderings.mjs`
- `src/frontend/designSystem/router.ts`
- `tests/unit/designSystem/chatWorkspace*.test.ts`
- `tests/audit/designSystem/chatWorkspacePatternExtractionAudit.test.ts`
- `tests/visual/designSystem/canonicals/shell/chatWorkspaceShellCanonical.spec.ts`
- `tests/visual/designSystem/patterns/chatWorkspacePattern.spec.ts`
- `docs/workspace/design-system/adoption/chat-workspace-pattern-extraction-audit.md`

Promoted design-system refactor slice now present on `origin/main` at
`25ad0f7d6c33`:

- `src/frontend/designSystem/assets/floatingTabHeader.mjs`
- `src/frontend/designSystem/assets/floatingTabRowReorder.mjs`
- `src/frontend/designSystem/assets/floatingTabStatusDrop.mjs`
- `tests/unit/designSystem/floatingTabRowReorder.test.ts`
- `tests/unit/designSystem/floatingTabStatusDrop.test.ts`
- affected floating-tab artifact/audit tests

Removed after human decision:

- root-admin users chat workspace mock adoption
- `docs/workspace/design-system/adoption/root-admin-users-chat-workspace-shell-mock-adoption-contract.md`

Reason:
the user rejected the app-page mock adoption on 2026-05-17 because it had
caused repeated issues. The root-admin users page should restart from an
accepted design-system pattern rather than promote this mixed app WIP.

Unrelated or needs separate justification:

- `tests/harness/postgres/testDatabase.ts`

Reason:
the Postgres reset table addition is not part of the chat workspace design
system slice. It may be valid test hygiene, but should be promoted separately
or parked.

Focused startup verification:

- `npx vitest run tests/audit/designSystem/chatWorkspacePatternExtractionAudit.test.ts tests/unit/designSystem/chatWorkspaceShellContract.test.ts tests/unit/designSystem/chatWorkspaceController.test.ts`
  - initial result: failed because
    `docs/workspace/design-system/adoption/chat-workspace-pattern-extraction-audit.md`
    was missing
  - after adding the missing audit artifact: passed, 3 files / 14 tests

## Branches Requiring Promotion Or Parking

### `codex/recurring-scheduler-traceability`

- Worktree: `/tmp/kanbien-recurring-scheduler-traceability`
- State: clean, behind current main, carries unique patch content
- Unique patch commits:
  - `d49338a Add recurring scheduler foundation`
  - `8c25d05 Preserve recurring schedule runtime cursor`
- Current recommendation:
  review for replay onto current `main` after the active dirty design-system
  branch is stabilized.

Disposition rule:

- Promote if the recurring scheduler foundation and runtime cursor behavior are
  still the intended platform direction.
- Park with an explicit rationale if platform cadence or scheduler ownership is
  still awaiting approval.
- Retire only after the unique commits are promoted or recorded as intentionally
  abandoned/superseded.

### `codex/layer3-unified-artifact-governance`

- Worktree: none
- State: unattached local branch, behind current main, carries one unique patch
- Unique patch commit:
  - `47b12f8 Adopt harness chat in root admin Build panel`
- Current recommendation:
  compare against current harness chat and root-admin Build panel source before
  replay.

Disposition rule:

- Promote only if this patch still contains behavior or artifact updates not
  present in current `main`.
- Record as superseded if current harness chat/root-admin Build work already
  replaced it.

## Backup Refs Requiring Explicit Accounting

### `backup/layer3-unified-artifact-governance-before-branch-fix`

- Unique patch commits:
  - `1d685ff Add Layer 5 harness governance fixes`
  - `c8786a2 Promote floating tab seam and artifact harness`
- Current recommendation:
  inspect before deletion; likely superseded by later design-system/governance
  work, but not yet recorded as such.

### `backup/main-before-replay-promotion`

- Unique patch commit:
  - `47b12f8 Adopt harness chat in root admin Build panel`
- Current recommendation:
  account together with `codex/layer3-unified-artifact-governance`.

## Remote Refs Already Patch-Accounted

These remote refs were reported as patch-accounted in current history and do
not need replay work unless humans want remote branch pruning:

- `origin/codex/layer3-unified-artifact-governance`
- `origin/codex/organization-backend-domain-foundation`
- `origin/codex/postmerge-org-test-isolation`
- `origin/codex/root-admin-session-expiry-login`

## Stash Stack Triage

The repo currently has 23 stash entries after adding the realignment rescue
stash. They have been inventoried in
`docs/workspace/branch-stack-reconciliations/2026-05-17-stash-inventory.md`.
They should still be treated as hidden WIP until a human approves any deletion.

Initial disposition groups:

- Keep until active follow-up branch is resolved:
  - `stash@{0}` `repo-health-followup-pre-realign-2026-05-17`
  - `stash@{1}` `repo-hygiene-save-dirty-worktree-before-main-realign-2026-05-16`
- Review with Layer 3 / harness chat branch accounting:
  - `stash@{2}` `codex safety stash before promotion cleanup 2026-05-10`
  - `stash@{3}` `layer5-harness-progress-before-branch-switch`
  - `stash@{5}` `park unrelated story-breakdown split work`
- Likely stale root-admin/build-panel residuals, review before dropping:
  - `stash@{6}` through `stash@{14}`
- Older planning/workflow stashes, review before dropping:
  - `stash@{15}` through `stash@{22}`

No stash should be dropped until a human has reviewed or approved the matching
disposition.

## Cleanup Order

1. Stabilize `codex/repo-hygiene-design-system-audit-reset` by splitting local
   changes into keep, blocked, and discard/park buckets.
   - Completed: promoted chat shell work landed on `origin/main`; remaining
     cleanup was re-extracted onto `codex/repo-health-followup-cleanup`.
2. Re-run `npm run git:preflight` and `npm run codex:tasks`.
3. Review `codex/recurring-scheduler-traceability` for replay or parking.
   - Completed: recorded as superseded by current.
4. Review `codex/layer3-unified-artifact-governance` and backup refs for
   supersession.
   - Completed: recorded as superseded by current.
5. Inventory and prune stashes only after branch accounting is complete.
   - Inventory completed; pruning remains human-approval gated.
6. Refresh stale maintained docs found by the repo-health assessment:
   `docs/architecture/system-overview.md`,
   `docs/standards/platform-status/EU-AI-ACT-STATUS.md`, and
   `docs/data-dictionary/index.md`.
   - Completed, with `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
     also refreshed for BullMQ/Redis and scheduler runtime truth.

## Human-Decision Boundary

The remaining cleanup requires human approval because it would discard, park,
or approve risky work:

- decide whether the `tests/harness/postgres/testDatabase.ts` change should be
  promoted as separate test-harness hygiene or parked/discarded
- approve branch/worktree retirement for refs now recorded as superseded
- approve any stash drops after reviewing the stash inventory

## Exit Criteria

- `npm run git:preflight` passes from the active worktree.
- `npm run git:branch-stack-audit` reports no unaccounted refs, or every
  remaining ref has a reconciliation note.
- `npm run codex:tasks` has no hidden active work except intentionally parked
  tasks.
- Stash stack contains only intentionally retained rescue points.
- Maintained status docs no longer contradict current source truth for
  `harnessChat`, model-backed Product Discovery, or feature counts.
- The original stale branch/stash is retained only as a temporary rescue point
  until this follow-up cleanup branch is verified.
