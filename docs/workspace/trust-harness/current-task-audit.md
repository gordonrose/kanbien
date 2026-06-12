# Current Task Audit

## Preflight Contract

- Task summary: Add a source guard that keeps shared shell-navigation
  primitives and patterns from directly importing default token system modules
  after resolver conversion.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/41-front-end/00-orchestrator/SKILL.md`
  - `docs/architecture/adr/0053-require-structural-token-preview-guards-for-shell-navigation.md`
  - `tests/integration/frontend/designSystemNavigationSourceMaterialGuard.test.ts`
- Task risk class: governed frontend harness/source guard change with no
  intended visual or behavior change.
- Discovered evidence boundary: this step may only add a test assertion that
  scans the scoped shell-navigation shared primitive and pattern seams for
  direct `systems/default.mjs` token imports. It must not change runtime code,
  routes, CSS, token values, proof output, or behavior.
- Intended edit boundary: add the guard assertion to the existing design-system
  navigation source material guard and keep this task audit aligned.
- Files allowed to edit:
  - `tests/integration/frontend/designSystemNavigationSourceMaterialGuard.test.ts`
  - `docs/workspace/trust-harness/current-task-audit.md`
- Files explicitly out of scope:
  - runtime source files
  - app adoption files
  - app-local CSS
  - token values
  - proof routes
  - package files
  - migrations
  - backend feature code
  - destructive git cleanup
- Required verification commands:
  - `npx vitest run tests/integration/frontend/designSystemNavigationSourceMaterialGuard.test.ts`
  - `npm run check:static`
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`
  - `git diff --stat`
  - `git status --short`
- Allowed closure vocabulary: `shell-navigation resolver import guard
  candidate pending review`; do not claim completion if required validation
  fails or is not run.

## Post-Work Closure Record

- Actual files edited:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `tests/integration/frontend/designSystemNavigationSourceMaterialGuard.test.ts`
- Evidence collected:
  - Existing design-system navigation source material guard now scans the
    shared shell-navigation primitive and pattern seams and fails if any of
    those files directly import `systems/default.mjs` token modules.
  - No runtime source, route, CSS, token value, proof output, or behavior file
    was edited in this step.
- Commands run and results:
  - `npx vitest run tests/integration/frontend/designSystemNavigationSourceMaterialGuard.test.ts`: passed, 3 tests.
  - `npm run check:static`: passed.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed.
- Missing or inferred evidence:
  - None for this step.
- User confirmation still required: yes, before destructive cleanup or any push.
- Final permitted closure state: `shell-navigation resolver import guard candidate pending review`
