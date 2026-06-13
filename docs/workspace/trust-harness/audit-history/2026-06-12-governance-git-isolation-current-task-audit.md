# Current Task Audit

## Preflight Contract

- Task summary: Update git/workflow governance so future Codex sessions default
  to clean branch/worktree isolation, bounded dirty-worktree recovery, and safe
  cleanup.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/10-repo-governance/branch-and-commit-governor/SKILL.md`
  - `.codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md`
  - `docs/architecture/adr/0051-log-harness-governance-decisions-as-adrs.md`
- Task risk class: material repo-governance instruction update
- Discovered evidence boundary: the requested change alters Codex git
  isolation and recovery procedure, so evidence must come from the updated
  governance instructions, the isolated worktree state, the single active task
  audit, and the existing repo-governance validation harness.
- Intended edit boundary: add dirty recovery procedure to the branch governor,
  add git isolation routing to the change-loop orchestrator, add concise
  durable material-work isolation guidance to `AGENTS.md`, and keep the task
  audit plus bootstrap record aligned with this governance update.
- Files allowed to edit:
  - `.codex/skills/10-repo-governance/branch-and-commit-governor/SKILL.md`
  - `.codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md`
  - `AGENTS.md`
  - `docs/workspace/chat-bootstraps/2026-06-12-governance-git-isolation.md`
  - `docs/workspace/trust-harness/current-task-audit.md`
- Files explicitly out of scope:
  - implementation source code
  - tests
  - `package.json`
  - package-lock files
  - `/home/gordon/kanbien`
  - staging, committing, pushing, merging, rebasing, deleting, or cleaning
- Required verification commands:
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`
  - `npm run check:repo-governance-harness`
  - `git diff --stat`
  - `git status --short`
- Allowed closure vocabulary: `governance update candidate pending review`;
  do not claim completion if required validation fails or is not run.

## Post-Work Closure Record

- Actual files edited:
  - `.codex/skills/10-repo-governance/branch-and-commit-governor/SKILL.md`
  - `.codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md`
  - `AGENTS.md`
  - `docs/workspace/chat-bootstraps/2026-06-12-governance-git-isolation.md`
  - `docs/workspace/trust-harness/current-task-audit.md`
- Evidence collected:
  - The governance changes are isolated in
    `/tmp/kanbien-worktrees/governance-git-isolation` on branch
    `codex/governance-git-isolation`.
  - `branch-and-commit-governor` contains `Dirty Worktree Recovery Mode`.
  - `change-loop-orchestrator` contains `Git Isolation Start Gate`.
  - `AGENTS.md` contains `Material Work Isolation`.
  - This audit has one active preflight contract and one active closure record
    for the governance git-isolation update.
- Commands run and results:
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed before
    this cleanup; failed after cleanup until validator-required closure fields
    were restored.
  - `npm run check:repo-governance-harness`: passed before this cleanup, 8
    tests; failed after cleanup until validator-required closure fields were
    restored.
  - `git diff --stat`: ran before this cleanup and must be rerun after it.
  - `git status --short`: showed only the allowed governance update paths
    before this cleanup and must be rerun after it.
- Missing or inferred evidence:
  - Final validation must be rerun after restoring the validator-required
    closure fields.
- User confirmation still required: yes, before staging, committing, pushing,
  merging, rebasing, deleting, or cleaning.
- Final permitted closure state: `governance update candidate pending review`
