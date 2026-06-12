# Current Task Audit

## Preflight Contract

- Task summary: Recover the glyph-registry migration from the dirty original
  worktree into a clean branch after PR 17 and PR 18 merged to `main`.
- Mode: reconcile-only
- Governing instruction sources:
  - `AGENTS.md`
  - `.codex/skills/10-repo-governance/codex-trust-override/SKILL.md`
  - `.codex/skills/10-repo-governance/branch-and-commit-governor/SKILL.md`
  - `.codex/plugins/cache/openai-curated/github/*/skills/yeet/SKILL.md`
  - `.codex/skills/41-front-end/03-primitive/SKILL.md`
- Task risk class: governed frontend primitive registry migration
- Discovered evidence boundary: the default glyph registry should be owned by
  the Layer 3 primitive registry seam, while the old default-system registry
  path remains as a compatibility re-export. Direct primitive consumers and
  unit tests should import the Layer 3 seam, and active primitive docs should
  name the Layer 3 registry as the source of truth.
- Intended edit boundary: layer-owned default glyph registry, default-system
  compatibility re-export, direct primitive consumers, matching unit-test
  imports/expectations, primitive docs that name the glyph registry seam, and
  this task audit.
- Files allowed to edit:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `docs/design-system/03-primitive/primitive-readiness-index.md`
  - `docs/design-system/03-primitive/shared/accordion-section-control/AccordionSectionControl-Contract.md`
  - `docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md`
  - `docs/design-system/03-primitive/systems/default/icon-button-control/IconButtonControl-Proof.md`
  - `src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs`
  - `src/frontend/designSystem/systems/default/glyphs/registry.mjs`
  - `src/frontend/designSystem/layers/03-primitive/accordion-section-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/simple-dropdown-control/index.mjs`
  - `tests/unit/designSystem/entityPanelPattern.test.ts`
  - `tests/unit/designSystem/headerMenuSimpleSelectPattern.test.ts`
  - `tests/unit/designSystem/iconButtonControlPrimitive.test.ts`
  - `tests/unit/designSystem/indexNavPanelPattern.test.ts`
  - `tests/unit/designSystem/menuSimpleSelectControlPrimitive.test.ts`
- Files explicitly out of scope:
  - `/home/gordon/kanbien` edits
  - `package.json`
  - package-lock or dependency updates
  - frontend proof-evidence manifest work blocked on
    `tests/visual/designSystem/patterns/recordListFormPatternRoute.spec.ts`
  - same-theme panel-frame/body-region work
  - broad primitive/token CSS work
  - unrelated primitive controller or render-helper changes
  - branch/worktree deletion
- Required verification commands:
  - `rg -n "systems/default/glyphs/registry\\.mjs" src/frontend/designSystem/layers tests/unit/designSystem docs/design-system/03-primitive`
  - `node --check src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs`
  - `node --check src/frontend/designSystem/systems/default/glyphs/registry.mjs`
  - `node --check src/frontend/designSystem/layers/03-primitive/accordion-section-control/index.mjs`
  - `node --check src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs`
  - `node --check src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs`
  - `node --check src/frontend/designSystem/layers/03-primitive/simple-dropdown-control/index.mjs`
  - `npx vitest run tests/unit/designSystem/entityPanelPattern.test.ts tests/unit/designSystem/headerMenuSimpleSelectPattern.test.ts tests/unit/designSystem/iconButtonControlPrimitive.test.ts tests/unit/designSystem/indexNavPanelPattern.test.ts tests/unit/designSystem/menuSimpleSelectControlPrimitive.test.ts`
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`
- Allowed closure vocabulary: `candidate recovery branch pending PR review`;
  do not claim the wider dirty-worktree recovery is complete.

## Post-Work Closure Record

- Actual files edited:
  - `docs/workspace/trust-harness/current-task-audit.md`
  - `docs/design-system/03-primitive/primitive-readiness-index.md`
  - `docs/design-system/03-primitive/shared/accordion-section-control/AccordionSectionControl-Contract.md`
  - `docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md`
  - `docs/design-system/03-primitive/systems/default/icon-button-control/IconButtonControl-Proof.md`
  - `src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs`
  - `src/frontend/designSystem/systems/default/glyphs/registry.mjs`
  - `src/frontend/designSystem/layers/03-primitive/accordion-section-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs`
  - `src/frontend/designSystem/layers/03-primitive/simple-dropdown-control/index.mjs`
  - `tests/unit/designSystem/entityPanelPattern.test.ts`
  - `tests/unit/designSystem/headerMenuSimpleSelectPattern.test.ts`
  - `tests/unit/designSystem/iconButtonControlPrimitive.test.ts`
  - `tests/unit/designSystem/indexNavPanelPattern.test.ts`
  - `tests/unit/designSystem/menuSimpleSelectControlPrimitive.test.ts`
- Evidence collected:
  - The default glyph registry now lives at
    `src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs`.
  - `src/frontend/designSystem/systems/default/glyphs/registry.mjs` remains as
    a compatibility re-export.
  - Direct primitive consumers and affected unit tests import the Layer 3
    registry seam.
  - Active primitive docs that named the old registry source now name the Layer
    3 registry seam.
  - The scoped stale-path scan found no remaining old registry-path references
    in `src/frontend/designSystem/layers`, `tests/unit/designSystem`, or
    `docs/design-system/03-primitive`.
- Commands run and results:
  - `rg -n "systems/default/glyphs/registry\\.mjs" src/frontend/designSystem/layers tests/unit/designSystem docs/design-system/03-primitive`: no matches; exit code 1 expected for no matches.
  - `node --check src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs`: passed.
  - `node --check src/frontend/designSystem/systems/default/glyphs/registry.mjs`: passed.
  - `node --check src/frontend/designSystem/layers/03-primitive/accordion-section-control/index.mjs`: passed.
  - `node --check src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs`: passed.
  - `node --check src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs`: passed.
  - `node --check src/frontend/designSystem/layers/03-primitive/simple-dropdown-control/index.mjs`: passed.
  - `npm ci`: sandbox run failed on `esbuild` EPERM in `/tmp`; escalated rerun passed and did not change tracked dependency files.
  - `npx vitest run tests/unit/designSystem/entityPanelPattern.test.ts tests/unit/designSystem/headerMenuSimpleSelectPattern.test.ts tests/unit/designSystem/iconButtonControlPrimitive.test.ts tests/unit/designSystem/indexNavPanelPattern.test.ts tests/unit/designSystem/menuSimpleSelectControlPrimitive.test.ts`: passed, 5 files, 31 tests.
  - `node --import tsx src/scripts/checkCurrentTaskAudit.ts`: passed before closure update; rerun required after closure update.
- Missing or inferred evidence:
  - No Playwright run was required for this registry-path-only recovery slice;
    rendered behavior is inferred from unchanged glyph path data and passing
    focused unit coverage.
  - The wider dirty-worktree recovery remains incomplete.
- User confirmation still required: yes
- Final permitted closure state: `candidate recovery branch pending PR review`
