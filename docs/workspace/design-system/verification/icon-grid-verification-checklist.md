# Icon Grid Verification Checklist

## Scope

- Artifact name:
  `icon-grid`
- Surface:
  `/design-system/components/icon-grid`
- Status under review:
  promoted child seam with dedicated canonical launcher and child render route
- Related canonical launcher:
  `/design-system/canonical-renderings/icon-grid`
  legacy index card forwards from `/design-system/canonicals/icon-grid`
- Related parent host family:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/icon-grid-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/icon-grid-reference-pack.md`

## Visual Contract

- One-sentence rule:
  `Icon Grid` must remain a field-level child seam that opens a compact
  searchable modal, filters the approved shared icon library, and returns one
  governed icon choice back to the resting trigger on both its direct child
  route and the parent host.
- Trigger for this review:
  promote the governed icon-choice seam out of form-only hosting and into a
  direct child-family review loop without inventing a separate icon source or
  broader asset-picker scope
- What changed since the last review:
  the seam now has a dedicated canonical launcher and direct child render
  route while preserving the same shared runtime, search behavior, dense tile
  tooltips, inherited `.form-field` tile host, and parent-hosted adoption path
  in the form template

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/icon-grid.html`
  `src/frontend/designSystem/canonicals/icon-grid/index.html`
  `src/features/designSystemCanonicals/persistence/migrations/0039_seed_design_system_canonicals_form_settings.sql`
  `src/frontend/designSystem/assets/iconGridCanonical.mjs`
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
- Implementation updated:
  yes
  the runtime now owns a shared icon definition list plus icon-grid modal
  behavior, the generated canonical launcher now sources `IGR-*` refs from
  persisted canonical governance, the generated render path serves the direct
  child render route, and the parent form continues to host the adoption shell
- Known source-level risks:
  the direct child route still reuses the shared form runtime, so future host
  changes should keep the child route and parent route in sync

## Rendered Verification

- Required viewports checked:
  direct child desktop and compact mobile routes browser-checked
- Required direction states checked:
  direct child RTL open review browser-checked
- Required theme states checked:
  direct child dark mobile stress review browser-checked
- Real interactive states checked:
  open modal, autofocus search, search filtering, selection synchronization,
  owned `Escape` dismissal, tooltip naming on dense icon tiles, and preserved
  parent-host overlay arbitration on the form template route
- Layering or anchoring checks:
  modal visually overlays the form as a compact centered panel rather than a
  drawer; generated canonicals now use
  `expectCanonicalOverlayContainedInRenderSurface(...)` to prove the overlay
  remains inside the canonical render host/frame on both desktop filtered and
  dark compact mobile states
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/forms/iconGridCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/shell/generatedCanonicalRenderingsIndex.spec.ts`
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  directly browser-checked
  trigger opens the modal, search receives focus, `Escape` closes the modal,
  and focus returns to the trigger
- Focus order and containment:
  source inspected and runtime-covered through modal tab containment
- Semantic structure:
  source inspected
  the child seam uses dialog semantics, labeled search, and button-based icon
  options
- Screen-reader naming and labeling:
  source inspected
  the parent field label and modal title are both present, and each tile keeps
  an explicit `aria-label` even though visible labels are hidden

## State Coverage

- Default:
  browser-checked
- Focus:
  browser-checked through trigger and search entry
- Selected / active:
  browser-checked through icon change from `Spark` to `Administrator`
- Disabled:
  inherited disabled hosting exists; dedicated child-specific disabled review
  still not added
- Empty:
  search-empty copy exists; dedicated child route browser assertion still not
  added
- Error:
  parent field-shell error state exists; no child-specific error mode is
  defined

## Quality Gate Outcome

- Implementation status:
  aligned with the promoted child-seam artifact chain
- Rendered status:
  dedicated child canonicals and hosted parent interactions browser-checked
- Human sign-off status:
  pending
- Promotion decision:
  promoted into the design system proper as a child family with a dedicated
  canonical launcher and direct render surface
