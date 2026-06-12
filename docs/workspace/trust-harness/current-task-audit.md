# Current Task Audit

## Preflight Contract

- Task summary: Recover the same-theme body-region-frame token and
  body-region primitive resolution from the dirty original worktree into a
  clean branch after PR 17, PR 18, and PR 19 merged to `main`.
- Mode: reconcile-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/10-repo-governance/branch-and-commit-governor/SKILL.md`
  - `.codex/skills/41-front-end/02-token/SKILL.md`
  - `.codex/skills/41-front-end/03-primitive/SKILL.md`
- Task risk class: governed frontend token and primitive recovery
- Discovered evidence boundary: `body-region-frame` must derive its surface,
  foreground, border, radius, width rails, and desktop max block size from the
  same-theme `panel-frame` variant for original, dark, and desert themes.
  `body-region-control` must resolve the body-region-frame variant matching
  its requested theme.
- Intended edit boundary: body-region-frame token docs and default proof data,
  body-region-control token dependency resolution, focused unit tests, the
  body-region-frame token visual spec selector repair required by the
  same-theme variants, and this task audit.
- Files allowed to edit:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `docs/design-system/02-token/shared/body-region-frame/BodyRegionFrame-Contract.md`
  - `docs/design-system/02-token/systems/default/body-region-frame/BodyRegionFrame-Implementation.md`
  - `src/frontend/designSystem/systems/default/tokens/proofs/bodyRegionFrame.tokens.mjs`
  - `src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs`
  - `tests/unit/designSystem/bodyRegionFrameToken.test.ts`
  - `tests/unit/designSystem/bodyRegionControlPrimitive.test.ts`
  - `tests/visual/designSystem/tokens/bodyRegionFrameTokenRoute.spec.ts`
- Files explicitly out of scope:
  - `/home/gordon/kanbien` edits
  - `package.json`
  - package-lock or dependency updates
  - mixed `src/frontend/designSystem/systems/default/assets/styles.css`
  - frontend proof-evidence manifest work blocked on
    `tests/visual/designSystem/patterns/recordListFormPatternRoute.spec.ts`
  - glyph-registry migration already merged through PR 19
  - broad primitive/token CSS work
  - unrelated panel-stack or panel-surface visual-test additions unless a
    focused verification gate proves they are required
- Required verification commands:
  - `node --check src/frontend/designSystem/systems/default/tokens/proofs/bodyRegionFrame.tokens.mjs`
  - `node --check src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs`
  - `npx vitest run tests/unit/designSystem/bodyRegionFrameToken.test.ts tests/unit/designSystem/bodyRegionControlPrimitive.test.ts`
  - `npx playwright test tests/visual/designSystem/tokens/bodyRegionFrameTokenRoute.spec.ts`
  - `npx playwright test tests/visual/designSystem/primitives/bodyRegionControlPrimitiveRoute.spec.ts`
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`
- Allowed closure vocabulary: `candidate recovery branch pending PR review`;
  do not claim the wider dirty-worktree recovery is complete.

## Post-Work Closure Record

- Actual files edited:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `docs/design-system/02-token/shared/body-region-frame/BodyRegionFrame-Contract.md`
  - `docs/design-system/02-token/systems/default/body-region-frame/BodyRegionFrame-Implementation.md`
  - `src/frontend/designSystem/systems/default/tokens/proofs/bodyRegionFrame.tokens.mjs`
  - `src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs`
  - `tests/unit/designSystem/bodyRegionFrameToken.test.ts`
  - `tests/unit/designSystem/bodyRegionControlPrimitive.test.ts`
  - `tests/visual/designSystem/tokens/bodyRegionFrameTokenRoute.spec.ts`
- Evidence collected:
  - `body-region-frame` now has original, dark, and desert variants.
  - Each body-region-frame variant derives surface, foreground, border,
    radius, width rails, and desktop max block size from the same-theme
    `panel-frame` variant.
  - `body-region-control` resolves the body-region-frame variant matching its
    requested theme.
  - Unit coverage checks the three token variants and dark theme primitive
    style/token dependency resolution.
  - Browser coverage checks the body-region-frame token route after the new
    variants and the body-region-control primitive route.
  - The visual token spec selector was narrowed because the intended same-theme
    variants made substring text queries ambiguous.
- Commands run and results:
  - `node --check src/frontend/designSystem/systems/default/tokens/proofs/bodyRegionFrame.tokens.mjs`: passed.
  - `node --check src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs`: passed.
  - `npm ci`: sandbox run failed on `esbuild` EPERM in `/tmp`; escalated rerun passed and did not change tracked dependency files.
  - `npx vitest run tests/unit/designSystem/bodyRegionFrameToken.test.ts tests/unit/designSystem/bodyRegionControlPrimitive.test.ts`: passed, 2 files, 6 tests.
  - `NODE_ENV=test PORT=4318 DATABASE_HOST=127.0.0.1 DATABASE_PORT=5432 DATABASE_NAME=service_platform_test DATABASE_USER=service_platform DATABASE_PASSWORD=change_me_local_test_only DATABASE_SSL=false npx playwright test tests/visual/designSystem/tokens/bodyRegionFrameTokenRoute.spec.ts`: sandbox run failed on localhost bind EPERM; escalated rerun exposed expected strict-mode ambiguity after adding the dark/desert token variants; after narrowing selectors, passed, 1 test. The preview server emitted pre-existing database authentication warnings from the rate-limit path.
  - `NODE_ENV=test PORT=4318 DATABASE_HOST=127.0.0.1 DATABASE_PORT=5432 DATABASE_NAME=service_platform_test DATABASE_USER=service_platform DATABASE_PASSWORD=change_me_local_test_only DATABASE_SSL=false npx playwright test tests/visual/designSystem/primitives/bodyRegionControlPrimitiveRoute.spec.ts`: passed, 2 tests. The preview server emitted pre-existing database authentication warnings from the rate-limit path.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed before closure update; rerun required after closure update.
- Missing or inferred evidence:
  - No full design-system harness gate was run for this narrow recovery slice.
  - Wider dirty-worktree recovery remains incomplete.
- User confirmation still required: yes
- Final permitted closure state: `candidate recovery branch pending PR review`
