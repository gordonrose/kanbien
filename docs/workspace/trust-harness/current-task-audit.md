# Current Task Audit

## Preflight Contract

- Task summary: Reconcile the sub-navigation breadcrumb tooltip regression
  where the full-label tooltip opens upward into the top-navigation band and is
  visually cut off.
- Mode: patch-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md`
  - `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md`
  - `docs/design-system/03-primitive/shared/breadcrumb-trail-control/BreadcrumbTrailControl-Contract.md`
  - `docs/design-system/04-pattern-contract/shared/sub-navigation/SubNavigation-Contract.md`
  - `docs/standards/change-artifact-requirements.md`
- Task risk class: governed frontend design-system runtime-visible tooltip
  placement fix for shell navigation.
- Discovered evidence boundary: breadcrumb full-label disclosure in
  sub-navigation must not auto-place above into top chrome. The reusable
  truncating-label primitive needs a placement contract that consumers can
  request, and the breadcrumb/sub-navigation seam must request below placement
  for breadcrumb labels. Browser-rendered geometry is required for final visual
  confirmation but remains blocked if Playwright Chromium is unavailable.
- Intended edit boundary: Layer 3 truncating-label placement option, breadcrumb
  label consumption of that option, related contracts/proofs/tests, the
  sub-navigation visual spec expectation, and this audit. Prior dirty
  sub-navigation/token/primitive files remain allowed because the audit harness
  validates the whole material worktree.
- Files allowed to edit:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `docs/design-system/02-token/token-readiness-index.md`
  - `docs/design-system/02-token/shared/sub-navigation-row-structure/SubNavigationRowStructure-Contract.md`
  - `docs/design-system/02-token/systems/default/sub-navigation-row-structure/SubNavigationRowStructure-Implementation.md`
  - `docs/design-system/03-primitive/primitive-readiness-index.md`
  - `docs/design-system/03-primitive/shared/breadcrumb-trail-control/BreadcrumbTrailControl-Contract.md`
  - `docs/design-system/03-primitive/shared/context-navigation-item-control/ContextNavigationItemControl-Contract.md`
  - `docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md`
  - `docs/design-system/03-primitive/shared/tools-navigation-item-control/ToolsNavigationItemControl-Contract.md`
  - `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md`
  - `docs/design-system/03-primitive/systems/default/breadcrumb-trail-control/BreadcrumbTrailControl-Proof.md`
  - `docs/design-system/03-primitive/systems/default/context-navigation-item-control/ContextNavigationItemControl-Proof.md`
  - `docs/design-system/03-primitive/systems/default/icon-button-control/IconButtonControl-Proof.md`
  - `docs/design-system/03-primitive/systems/default/tools-navigation-item-control/ToolsNavigationItemControl-Proof.md`
  - `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md`
  - `docs/design-system/04-pattern-contract/pattern-readiness-index.md`
  - `docs/design-system/04-pattern-contract/shared/standard-page-shell/StandardPageShell-Contract.md`
  - `docs/design-system/04-pattern-contract/shared/sub-navigation/SubNavigation-Contract.md`
  - `docs/design-system/04-pattern-contract/systems/default/standard-page-shell/StandardPageShell-Proof.md`
  - `docs/design-system/04-pattern-contract/systems/default/sub-navigation/SubNavigation-Proof.md`
  - `src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/contract.mjs`
  - `src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/systems/default.mjs`
  - `src/frontend/designSystem/layers/02-token/token-spec-resolver.mjs`
  - `src/frontend/designSystem/layers/03-primitive/breadcrumb-trail-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs`
  - `src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/tools-navigation-item-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs`
  - `src/frontend/designSystem/layers/04-pattern-contract/standard-page-shell/index.mjs`
  - `src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs`
  - `src/frontend/designSystem/registry/designSystems.mjs`
  - `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs`
  - `src/frontend/designSystem/systems/default/assets/styles.css`
  - `src/frontend/designSystem/systems/default/page.mjs`
  - `src/frontend/designSystem/systems/default/system.manifest.json`
  - `src/frontend/designSystem/systems/default/tokens/proofs/subNavigationRowStructure.tokens.mjs`
  - `src/frontend/designSystem/systems/default/tokens/sub-navigation-row-structure/index.html`
  - `src/frontend/designSystem/systems/default/tokens/sub-navigation-row-structure/page.mjs`
  - `tests/integration/frontend/designSystemSystemRegistryGuard.test.ts`
  - `tests/unit/designSystem/breadcrumbTrailControlPrimitive.test.ts`
  - `tests/unit/designSystem/contextNavigationItemControlPrimitive.test.ts`
  - `tests/unit/designSystem/iconButtonControlPrimitive.test.ts`
  - `tests/unit/designSystem/standardPageShellPattern.test.ts`
  - `tests/unit/designSystem/subNavigationPattern.test.ts`
  - `tests/unit/designSystem/subNavigationRowStructureToken.test.ts`
  - `tests/unit/designSystem/tokenSpecResolver.test.ts`
  - `tests/unit/designSystem/toolsNavigationItemControlPrimitive.test.ts`
  - `tests/unit/designSystem/truncatingLabelPrimitive.test.ts`
  - `tests/visual/designSystem/patterns/standardPageShellPatternRoute.spec.ts`
  - `tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts`
  - `tests/visual/designSystem/tokens/subNavigationRowStructureTokenRoute.spec.ts`
- Files explicitly out of scope:
  - app page CSS or app adoption files
  - component seams
  - use-case pages
  - backend feature code
  - migrations
  - destructive git cleanup
- Required verification commands:
  - `npx vitest run tests/unit/designSystem/truncatingLabelPrimitive.test.ts tests/unit/designSystem/breadcrumbTrailControlPrimitive.test.ts`
  - `npx vitest run tests/unit/designSystem/subNavigationPattern.test.ts`
  - `npm run check:design-system-registry`
  - `npm run check:static`
  - `npx playwright test tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts --config=playwright.config.ts --output=/tmp/kanbien-playwright-results`
  - `curl -I -s http://127.0.0.1:3000/design-system/default/patterns/sub-navigation`
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`
  - `git diff --stat`
  - `git status --short`
- Allowed closure vocabulary: `partially verified` unless browser-rendered
  tooltip geometry can be collected after final edits.

## Post-Work Closure Record

- Actual files edited:
  - `docs/design-system/03-primitive/shared/breadcrumb-trail-control/BreadcrumbTrailControl-Contract.md`
  - `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md`
  - `docs/design-system/03-primitive/systems/default/breadcrumb-trail-control/BreadcrumbTrailControl-Proof.md`
  - `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md`
  - `docs/design-system/04-pattern-contract/shared/sub-navigation/SubNavigation-Contract.md`
  - `docs/design-system/04-pattern-contract/systems/default/sub-navigation/SubNavigation-Proof.md`
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `src/frontend/designSystem/layers/03-primitive/breadcrumb-trail-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs`
  - `tests/unit/designSystem/breadcrumbTrailControlPrimitive.test.ts`
  - `tests/unit/designSystem/truncatingLabelPrimitive.test.ts`
  - `tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts`
  - Prior dirty design-system token/primitive/pattern files remain in the
    worktree from the broader shell-navigation pass and are included in the
    audit edit boundary because the harness validates the full material dirty
    set.
- Evidence collected:
  - Identified the tooltip cause: `truncating-label` auto placement chooses
    above-label placement whenever viewport space exists, which is wrong for
    breadcrumb labels directly under top navigation chrome.
  - Added `tooltipPlacement` to `truncating-label` with supported values
    `auto`, `below`, and `above`; existing consumers default to `auto`.
  - Updated the truncating-label controller so `below` prefers below-label
    placement and falls back only when the requested side cannot fit in the
    viewport.
  - Updated `breadcrumb-trail-control` so visible breadcrumb labels request
    `tooltipPlacement: "below"` through the governed primitive seam.
  - Added unit coverage proving explicit placement support, unsupported
    placement rejection, and breadcrumb render output carrying
    `data-truncating-label-tooltip-placement="below"`.
  - Added a sub-navigation browser-spec assertion that hovers the compressed
    `Design briefs` breadcrumb label and requires the tooltip top to be below
    the label bottom.
  - Confirmed `/design-system/default/patterns/sub-navigation` returned
    `200 OK` from the running dev server.
  - Probed the runtime renderer directly and confirmed compressed
    sub-navigation emits `data-truncating-label-tooltip-placement="below"` for
    breadcrumb labels.
  - Confirmed the served default-system CSS contains the sub-navigation
    tooltip z-index selectors, and the served sub-navigation `page.mjs` uses
    the governed `renderSubNavigationPattern` seam with the relevant
    breadcrumbs.
- Commands run and results:
  - `npx vitest run tests/unit/designSystem/truncatingLabelPrimitive.test.ts tests/unit/designSystem/breadcrumbTrailControlPrimitive.test.ts`:
    passed, 10 tests.
  - `npx vitest run tests/unit/designSystem/subNavigationPattern.test.ts`:
    passed, 3 tests.
  - `npm run check:design-system-registry`: passed, 5 tests.
  - `npm run check:static`: passed.
  - `npx playwright test tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts --config=playwright.config.ts --output=/tmp/kanbien-playwright-results`: blocked because Playwright Chromium is not installed at `/home/owner/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell`.
  - `curl -I -s http://127.0.0.1:3000/design-system/default/patterns/sub-navigation`:
    returned `200 OK`.
  - `node --input-type=module -e "...renderSubNavigationPattern({ mode: 'compressed' })..."`:
    confirmed `data-truncating-label-tooltip-placement="below"` appears in
    rendered breadcrumb labels.
  - `curl -s http://127.0.0.1:3000/design-system/systems/default/assets/styles.css -o /tmp/subnav-served.css` plus `rg`:
    confirmed served CSS contains sub-navigation tooltip layering selectors.
  - `curl -s http://127.0.0.1:3000/design-system/systems/default/patterns/sub-navigation/page.mjs -o /tmp/subnav-page.mjs` plus `rg`:
    confirmed the served proof module uses `renderSubNavigationPattern` and the
    `Design briefs` breadcrumb fixture.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed before
    closure update.
  - `git diff --stat`: collected.
  - `git status --short`: collected.
- Missing or inferred evidence:
  - Browser-rendered tooltip geometry verification is not collected because
    this environment cannot launch the Playwright Chromium binary.
  - Manual visual confirmation is still required that the breadcrumb tooltip no
    longer opens upward into the top-navigation band in the standard page shell
    proof.
- User confirmation still required: yes, before app adoption, destructive
  cleanup, commit, or push.
- Final permitted closure state: `partially verified`
