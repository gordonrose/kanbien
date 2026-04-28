# Form Image Card Verification Checklist

## Scope

- Artifact name:
  `FormImageCard`
- Generated canonical launcher:
  `/design-system/canonical-renderings/form-image-card`
- Generated canonical render surface:
  `/design-system/canonical-renderings/form-image-card/:ref`
- Source component surface:
  `/design-system/components/form-image-card`
- First host surface:
  `/design-system/templates/form`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/form-image-card-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/form-image-card-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A form image card must provide a compact square image relationship card with
  picture-only, name-only, and full identity variants while keeping the edit
  action attached to the thumbnail.
- Trigger for this review:
  Promote the form-template image-card variation into a reusable
  design-system child seam named `FormImageCard`, with the parent-owned
  `.form-field` tile host kept visible on both the component surface and the
  form-template host.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/assets/formControls.mjs`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/formControls.css`
  `src/frontend/designSystem/assets/formImageCardCanonical.mjs`
  `src/frontend/designSystem/components/form-image-card.html`
  `src/frontend/designSystem/canonicals/form-image-card/index.html`
  `src/frontend/designSystem/router.ts`
  `src/frontend/designSystem/templates/form/index.html`
  `src/features/designSystemCanonicals/persistence/migrations/0046_seed_form_image_card_canonicals.sql`
  `tests/visual/designSystem/canonicals/forms/formImageCardCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  the seam intentionally owns only render structure and local edit affordance
  placement; feature-owned modals, upload flows, alt-text semantics,
  authorization, persistence, and asset lifecycle decisions remain outside the
  component contract

## Rendered Verification

- Required viewports checked:
  desktop component surface, mobile-width component surface, and form-template
  host through Playwright
- Required direction states checked:
  LTR and RTL component states
- Required theme states checked:
  normal and dark component states
- Required magnification states checked:
  default and 100 percent magnified component states
- Real interactive states checked:
  image-only, name-only, full identity, hover-revealed edit affordance, and
  keyboard-focus edit affordance
- Overflow or clipping checks:
  mobile host and dedicated render states assert the card remains within the
  viewport and the media slot remains square
- Harness/adoption checks:
  canonical launcher links target `/design-system/canonical-renderings/form-image-card/:ref`;
  dedicated generated render routes consume `renderFormImageCard()` through
  `formImageCardCanonical.mjs`; shared app-facing CSS is present in
  `/design-system/assets/formControls.css`
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/forms/formImageCardCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`

## Quality Gate Outcome

- Implementation status:
  shared render seam, dedicated component surface, canonical launcher,
  persistence-backed canonical references, and app-facing shared CSS entrypoint
  created
- Rendered status:
  variant, mobile, RTL, dark theme, magnified, hover, and keyboard focus paths
  covered by focused Playwright checks
- Human sign-off status:
  visually accepted on 2026-04-28 during the form-template review
- Promotion decision:
  shared seam candidate ready for downstream governed app adoption planning
