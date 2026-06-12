# Current Task Audit

## Preflight Contract

- Task summary: Begin the design-system token resolver remediation loop so
  shared shell-navigation primitives can move toward system-specific token
  values without changing rendered appearance or behavior.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/41-front-end/00-orchestrator/SKILL.md`
  - `.codex/skills/41-front-end/02-token/SKILL.md`
  - `.codex/skills/40-frontend/frontend-implementation-auditor/SKILL.md`
  - `docs/design-system/01-behavior-rule/shared/search-shell/SearchShell-Behaviour.md`
  - `docs/design-system/03-primitive/shared/search-shell-control/SearchShellControl-Contract.md`
- Task risk class: governed design-system token-routing refactor with no
  intended visual or behavior change.
- Discovered evidence boundary: the first remediation step may introduce only a
  token-spec resolver and convert one low-risk primitive to consume it. Evidence
  must come from targeted unit tests, rendered design-system proof coverage,
  source-boundary inspection, and static harness checks.
- Intended edit boundary: add a Layer 2 token-spec resolver, convert
  `search-shell-control` from direct default token import to resolver lookup,
  add focused resolver tests, and keep this task audit aligned.
- Files allowed to edit:
  - `src/frontend/designSystem/layers/02-token/token-spec-resolver.mjs`
  - `src/frontend/designSystem/layers/03-primitive/search-shell-control/index.mjs`
  - `tests/unit/designSystem/tokenSpecResolver.test.ts`
  - `docs/workspace/trust-harness/current-task-audit.md`
- Files explicitly out of scope:
  - app adoption files
  - app-local CSS
  - package files
  - migrations
  - backend feature code
  - destructive git cleanup
- Required verification commands:
  - `npx vitest run tests/unit/designSystem/tokenSpecResolver.test.ts tests/unit/designSystem/searchShellControlPrimitive.test.ts`
  - `docker run --rm --network host -v /home/owner/projects/kanbien:/work -w /work -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 mcr.microsoft.com/playwright:v1.59.1-noble npx playwright test tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts --output /tmp/kanbien-playwright-results-token-resolver-step1-docker`
  - `npm run check:static`
  - `git diff --stat`
  - `git status --short`
- Allowed closure vocabulary: `token resolver remediation candidate pending
  review`; do not claim completion if required validation fails or is not run.

## Post-Work Closure Record

- Actual files edited:
  - `src/frontend/designSystem/layers/02-token/token-spec-resolver.mjs`
  - `src/frontend/designSystem/layers/03-primitive/search-shell-control/index.mjs`
  - `tests/unit/designSystem/tokenSpecResolver.test.ts`
  - `docs/workspace/trust-harness/current-task-audit.md`
- Evidence collected:
  - `search-shell-control` now resolves `standard-page-shell-frame` through the
    Layer 2 token-spec resolver instead of directly importing the default
    system token module.
  - The resolver currently registers only the existing `default`
    `standard-page-shell-frame` token spec and does not create or alter token
    values.
  - Rendered sub-navigation proof passed through Docker Playwright after the
    source edit.
- Commands run and results:
  - `npx vitest run tests/unit/designSystem/tokenSpecResolver.test.ts tests/unit/designSystem/searchShellControlPrimitive.test.ts`: passed, 5 tests.
  - `npx playwright test tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts --output /tmp/kanbien-playwright-results-token-resolver-step1`: failed because the local Playwright browser binary is not installed.
  - `docker run --rm --network host -v /home/owner/projects/kanbien:/work -w /work -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 mcr.microsoft.com/playwright:v1.59.1-noble npx playwright test tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts --output /tmp/kanbien-playwright-results-token-resolver-step1-docker`: passed, 3 tests.
  - `npm run check:static`: failed before this audit update because the changed files were outside the stale current task audit boundary; passed after this audit update.
  - `git diff --stat`: rerun after this audit update; showed only the resolver, search-shell primitive, resolver test, and current task audit changes.
  - `git status --short`: rerun after this audit update; showed only the resolver, search-shell primitive, resolver test, and current task audit changes.
- Missing or inferred evidence:
  - None for this step.
- User confirmation still required: yes, before destructive cleanup or any push.
- Final permitted closure state: `token resolver remediation candidate pending review`
