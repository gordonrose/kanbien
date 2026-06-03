# Brochure Pipeline Step Selector Proof

## Metadata

| Field | Value |
| --- | --- |
| System key | `brochure` |
| Primitive | `brochure-pipeline-step-selector` |
| Primitive status | `review-ready` |
| Shared contract | `docs/design-system/03-primitive/shared/brochure-pipeline-step-selector/BrochurePipelineStepSelector-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/brochure-pipeline-step-selector/index.mjs` |
| Proof route | `/design-system/brochure/primitives/brochure-pipeline-step-selector` |

## Proof Scope

This proof renders the governed brochure skin for the shared step selector
primitive. It proves the selector can consume signed brochure frame, focus,
label, and target tokens while preserving the shared tablist/custom-listbox
dropdown behavior.

The proof does not render the full pipeline content panel. That composition is
reserved for the Layer 4 brochure pipeline showcase pattern.

## Token Evidence

| Token | Runtime seam |
| --- | --- |
| `pipeline-showcase-frame` | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs#pipelineShowcaseFrameTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/brochure.mjs#focusRingTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/brochure.mjs#minimumTargetSizeTokenSpec` |

## Rendered Evidence

The proof route renders:

- a default six-step selector
- a selector with a later active step
- dependency and boundary notes

The route attaches the primitive controller so manual review can verify tab
clicks, dropdown option changes, Arrow keys, Home, End, Enter, Space, and
Escape behavior.

## Accessibility Evidence

- Desktop tablist has an accessible name.
- Each tab has `role="tab"`, `aria-selected`, `aria-controls`, and roving
  `tabindex`.
- Mobile selector is a styled button-triggered listbox with a programmatic
  trigger name, `aria-haspopup="listbox"`, `aria-expanded`, and selected option
  state.
- Active state uses the signed active frame token, including thicker border
  treatment, and is not left to color alone.

## Remaining Downstream Work

Layer 4 must compose this primitive with the active panel and verify panel
synchronization, responsive transition, and public-site consumption.
