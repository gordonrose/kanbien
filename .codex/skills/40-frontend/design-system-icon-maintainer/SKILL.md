---
name: design-system-icon-maintainer
description: Use when the user wants to add, refine, replace, or govern a custom in-repo design-system icon, especially for the shared icon-grid catalog, form-template icon picker, settings surfaces, or other governed frontend seams that need a new icon without adopting an external icon package.
---

# Design-System Icon Maintainer

Use this skill when the task is to create or update a repo-local icon for the
governed design-system icon catalog.

This skill is for the current Kanbien posture where icons are maintained in the
repo rather than sourced from a third-party package.

## Authority Order

1. `AGENTS.md`
2. `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
3. `docs/workspace/design-system/behavior-locks/icon-grid-behavior-lock.md`
4. `docs/workspace/design-system/reference-packs/icon-grid-reference-pack.md`
5. `docs/workspace/design-system/reference-packs/icon-grid-saas-baseline.md`
6. current source in `src/frontend/designSystem/`
7. executable visual coverage in `tests/visual/designSystem/`

## What This Skill Owns

- adding a new icon to the shared in-repo catalog
- refining an existing icon path for clarity or consistency
- choosing a calmer SaaS metaphor from the governed baseline
- updating the icon-grid picker so the new icon is searchable
- keeping related docs and tests aligned

## Source Of Truth

- shared catalog:
  `src/frontend/designSystem/assets/app.mjs`
  `designSystemIconDefinitions`
- current governed icon-picker host:
  `src/frontend/designSystem/templates/form/index.html`
- icon-picker styles:
  `src/frontend/designSystem/assets/styles.css`
- browser verification:
  `tests/visual/designSystem/formTemplate.spec.ts`

## Default Workflow

1. Confirm the icon’s semantic job.
Prefer one durable SaaS topic from
`docs/workspace/design-system/reference-packs/icon-grid-saas-baseline.md`
before inventing a narrower metaphor.

2. Reuse before creating.
Search the current `designSystemIconDefinitions` list first.
If a nearby icon already covers the concept, refine aliases or naming before
drawing a brand-new shape.

3. Keep the visual language consistent.
Match the current in-repo style:
- 24x24 viewport
- calm, legible silhouette
- avoid fussy interior detail
- prefer a small number of strokes/shapes
- preserve recognizability at small sizes

4. Update the shared catalog, not only one host surface.
Add or refine the icon in `designSystemIconDefinitions` so search, trigger
rendering, and future consumers all use the same source.

5. Add search aliases intentionally.
Include:
- the plain-English label
- 2-4 common SaaS synonyms
- product-language terms only when they aid discovery

6. Keep the icon-grid honest.
If the icon materially changes the governed catalog truth, update:
- `icon-grid-reference-pack.md`
- `icon-grid-saas-baseline.md` when the baseline changed
- `icon-grid-behavior-lock.md` only if the behavior contract changed

7. Verify in the browser.
At minimum, run:
`npx playwright test tests/visual/designSystem/formTemplate.spec.ts`

## Guardrails

- Do not pull in a third-party icon package silently.
- Do not copy icons from a library with unclear or incompatible licensing.
- Do not add highly brand-specific or novelty icons unless the user clearly
  wants that exception.
- Do not create multiple near-duplicate icons when aliases solve the problem.
- Do not update only the trigger or only the picker; keep the shared catalog as
  the source of truth.

## Trigger Phrases

Trigger this skill for prompts like:

- "add a new design-system icon"
- "create an icon for this SaaS concept"
- "update the icon-grid catalog"
- "we need an icon for billing / support / analytics"
- "make a new repo-local icon"
- "refine this custom icon"
