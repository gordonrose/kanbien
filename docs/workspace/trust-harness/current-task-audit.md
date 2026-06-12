# Current Task Audit

## Preflight Contract

- Task summary: Register existing context-navigation item-affordance and
  icon-size token specs in the Layer 2 resolver and convert the governed
  context-navigation item primitive to resolver lookup without changing rendered
  appearance or behavior.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/41-front-end/00-orchestrator/SKILL.md`
  - `.codex/skills/41-front-end/02-token/SKILL.md`
  - `.codex/skills/41-front-end/03-primitive/SKILL.md`
  - `docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md`
  - `docs/design-system/03-primitive/shared/context-navigation-item-control/ContextNavigationItemControl-Contract.md`
- Task risk class: governed design-system token-routing refactor with no
  intended visual or behavior change.
- Discovered evidence boundary: this step may only register the existing
  `context-navigation-item-affordance` and `icon-size` default token specs in
  the resolver, add focused resolver assertions, and convert
  `context-navigation-item-control` from direct default token imports to
  resolver lookup. Runtime seam disclosure strings, token values, glyph
  registry behavior, markup, style variables, controller behavior, state
  semantics, emitted events, and rendered output are out of scope.
- Intended edit boundary: register existing item-affordance and icon-size
  tokens in the resolver, replace direct default token imports in the primitive
  with resolver calls, extend resolver tests, and keep this task audit aligned.
- Files allowed to edit:
  - `src/frontend/designSystem/layers/02-token/token-spec-resolver.mjs`
  - `src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs`
  - `tests/unit/designSystem/tokenSpecResolver.test.ts`
  - `docs/workspace/trust-harness/current-task-audit.md`
- Files explicitly out of scope:
  - app adoption files
  - app-local CSS
  - token values
  - runtime seam disclosure text
  - glyph registry behavior
  - primitive markup, ARIA semantics, style variables, controller behavior, states, or events
  - package files
  - migrations
  - backend feature code
  - destructive git cleanup
- Required verification commands:
  - `npx vitest run tests/unit/designSystem/tokenSpecResolver.test.ts tests/unit/designSystem/contextNavigationItemControlPrimitive.test.ts`
  - `docker run --rm --network host -v /home/owner/projects/kanbien:/work -w /work -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 mcr.microsoft.com/playwright:v1.59.1-noble npx playwright test tests/visual/designSystem/primitives/contextNavigationItemControlPrimitiveRoute.spec.ts --output /tmp/kanbien-playwright-results-contextnav-item-resolver-step-docker`
  - `npm run check:static`
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`
  - `git diff --stat`
  - `git status --short`
- Allowed closure vocabulary: `context-navigation item primitive resolver
  remediation candidate pending review`; do not claim completion if required
  validation fails or is not run.

## Post-Work Closure Record

- Actual files edited:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `src/frontend/designSystem/layers/02-token/token-spec-resolver.mjs`
  - `src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs`
  - `tests/unit/designSystem/tokenSpecResolver.test.ts`
- Evidence collected:
  - The resolver now registers the existing default
    `context-navigation-item-affordance` and `icon-size` token specs.
  - `context-navigation-item-control` now resolves `context-navigation-frame`,
    `context-navigation-item-affordance`, `focus-ring`, `icon-size`,
    `label-text-style`, and `minimum-target-size` through the Layer 2
    token-spec resolver instead of directly importing default system token
    modules.
  - The primitive still uses the existing registered default token specs and
    does not create or alter token values.
  - Runtime seam disclosure strings, glyph registry behavior, markup, ARIA
    semantics, style variables, controller behavior, state semantics, and event
    name were not edited.
  - Rendered primitive proof passed through Docker Playwright after the source
    edit.
- Commands run and results:
  - `npx vitest run tests/unit/designSystem/tokenSpecResolver.test.ts tests/unit/designSystem/contextNavigationItemControlPrimitive.test.ts`: passed, 8 tests.
  - `docker run --rm --network host -v /home/owner/projects/kanbien:/work -w /work -e PLAYWRIGHT_BASE_URL=http://host.docker.internal:3000 mcr.microsoft.com/playwright:v1.59.1-noble npx playwright test tests/visual/designSystem/primitives/contextNavigationItemControlPrimitiveRoute.spec.ts --output /tmp/kanbien-playwright-results-contextnav-item-resolver-step-docker`: passed, 1 test.
  - `rg -n "^import .*systems/default\\.mjs|systems/default\\.mjs" src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs`: showed no direct default token imports and only existing runtime seam disclosure strings.
  - `npm run check:static`: passed.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed.
- Missing or inferred evidence:
  - None for this step.
- User confirmation still required: yes, before destructive cleanup or any push.
- Final permitted closure state: `context-navigation item primitive resolver remediation candidate pending review`
