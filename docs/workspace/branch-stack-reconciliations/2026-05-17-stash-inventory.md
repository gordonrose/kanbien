# Stash Inventory: repo health cleanup

- Date: 2026-05-17
- Original base: `origin/main` at `9655e523f794`
- Reconciled base: `origin/main` at `25ad0f7d6c33`
- Original branch: `codex/repo-hygiene-design-system-audit-reset`
- Follow-up branch: `codex/repo-health-followup-cleanup`
- Disposition: inventory-only

## Rule

No stash is approved for deletion by this inventory alone. Dropping a stash is
destructive and still requires human approval.

## Current Stashes

| Stash | Label | Observed Scope | Recommended Disposition |
| --- | --- | --- | --- |
| `stash@{0}` | `repo-health-followup-pre-realign-2026-05-17` | Rescue snapshot of the stale mixed branch before extracting remaining cleanup onto `codex/repo-health-followup-cleanup`. | Keep until the follow-up cleanup branch is verified and promoted or intentionally parked. |
| `stash@{1}` | `repo-hygiene-save-dirty-worktree-before-main-realign-2026-05-16` | Organization docs, data dictionary, generated dependency graph, PRD/test cases, architecture docs. | Keep until current repo-health cleanup and Organization artifact state are fully promoted. |
| `stash@{2}` | `codex safety stash before promotion cleanup 2026-05-10` | Harness chat, root-admin Build panel, design-system artifacts, task registry, PRD/test cases. | Review after current design-system/root-admin chat workspace WIP is resolved; likely partly superseded. |
| `stash@{3}` | `layer5-harness-progress-before-branch-switch` | Layer 5 task-run docs, roadmap, package script. | Review against current Layer 5 harness files; likely superseded but not safe to drop without confirmation. |
| `stash@{4}` | `autostash` | Chat-interface docs and story-breakdown deletion/realignment. | High-risk to apply blindly; review only if old chat-interface story artifacts are needed. |
| `stash@{5}` | `park unrelated story-breakdown split work` | Story-breakdown templates, validator, generated catalog. | Review with planning-artifact owner before drop. |
| `stash@{6}` | `pre-promote unstaged local changes` | Story-breakdown validator/templates plus Build panel CSS/app guard changes. | Mixed; review only after current design-system WIP is clean. |
| `stash@{7}` | `pre-promote remaining unrelated local changes` | Story-breakdown validator/templates and root-admin parity spec. | Mixed; review before drop. |
| `stash@{8}` | `pre-promote root-admin guard local change` | Story-breakdown validator/templates and root-admin guard script. | Mixed; review before drop. |
| `stash@{9}` | `pre-promote unrelated local changes` | Build Work Panel artifacts, design-system code, root-admin app, guard scripts, visual tests. | Likely superseded by later Build panel work, but high-risk; review before drop. |
| `stash@{10}` | `preserve-build-work-panel-tools-menu-css-position-residual` | One-line Build Work Panel CSS residual. | Candidate drop after confirming current Build panel menu position is accepted. |
| `stash@{11}` | `preserve-build-work-panel-tools-menu-demo-residual` | Small Build Work Panel demo script residual. | Candidate drop after confirming current Build panel demo behavior is accepted. |
| `stash@{12}` | `preserve-build-work-panel-tools-menu-polish-residual` | Build Work Panel render/CSS polish residual. | Candidate drop after confirming current Build panel polish is accepted. |
| `stash@{13}` | `preserve-build-work-panel-tools-menu-escape-clickaway` | Build Work Panel clickaway behavior residual. | Candidate drop after confirming current menu escape/clickaway behavior is accepted. |
| `stash@{14}` | `preserve-build-work-panel-tools-menu-polish` | Build Work Panel render/CSS/demo polish. | Candidate drop after confirming current Build panel polish is accepted. |
| `stash@{15}` | `dirty-doc-planning-artifacts-before-repo-cleanup` | Product Discovery, Technical Steering, story-breakdown and standards docs for loop observability/KPI. | Review with planning-artifact owner; not design-system cleanup scope. |
| `stash@{16}` | `preserve technical steering layer worktree before repo cleanup` | Change-loop/build-from-spec standards and templates. | Review with governance owner; not design-system cleanup scope. |
| `stash@{17}` | `preserve layer4 tenant branding task breakdown worktree before repo cleanup` | Build-from-spec, story-breakdown template, tenant-branding story breakdown, validator/tests. | Review with Layer 4 owner. |
| `stash@{18}` | `preserve layer-3 story readiness worktree before repo cleanup` | Reporting dashboard and tenant-aware login story breakdown docs. | Review with planning owner. |
| `stash@{19}` | `preserve product discovery trial packet before promotion` | No stat output from `git stash show --stat`; may be empty or only untracked/conflict metadata. | Inspect with `git stash show --include-untracked` before deciding. |
| `stash@{20}` | `cleanup form-image-card dirty state before rebasing onto origin/main` | Form template/design-system rendering and visual tests. | Review with design-system owner; may be superseded by current form-template state. |
| `stash@{21}` | `preserve login-template-page WIP before root-admin profile-picture work` | Web app page settings docs, design-system app/templates, tenant tests. | Review with frontend topology/page-settings owner. |
| `stash@{22}` | `postponed tenant branding logo WIP` | Tenant logo/API/OpenAPI/Postman/source/test changes. | Review with tenant-branding/assets owner; not safe to drop casually. |

## Suggested Cleanup Path

1. Keep `stash@{0}` until the follow-up cleanup branch is promoted or parked.
2. Keep `stash@{1}` until the older Organization artifact state is fully accounted.
3. Review `stash@{2}` through `stash@{4}` after the harness chat and root-admin
   Build panel state is settled.
4. Review `stash@{10}` through `stash@{14}` as a small Build Work Panel residual
   batch; these are the best candidates for deletion if current rendered
   behavior is accepted.
5. Route planning and tenant-branding stashes to their owning future cleanup
   passes instead of mixing them into the design-system cleanup.

## Human Decisions Still Needed

- Whether to drop any Build Work Panel residual stashes after current behavior
  is accepted.
- Whether older planning stashes should be recovered into active artifacts or
  abandoned.
- Whether tenant branding/logo stashes remain product-relevant.
