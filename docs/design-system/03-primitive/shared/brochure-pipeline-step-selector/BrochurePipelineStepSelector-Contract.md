# Brochure Pipeline Step Selector Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `brochure` |
| Token dependency systems | `brochure` |
| UI family | `brochure-pipeline-showcase` |
| Primitive name | `brochure-pipeline-step-selector` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/brochure-pipeline-showcase/BrochurePipelineShowcase-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/brochure-pipeline-step-selector/BrochurePipelineStepSelector-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/brochure/brochure-pipeline-step-selector/BrochurePipelineStepSelector-Proof.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The brochure pipeline requires a governed selector that does not drift between desktop tabs and mobile dropdown. |
| Primitive job | Render and control the ordered step selector: desktop tablist, mobile custom listbox dropdown, active-step sync, and keyboard movement. |
| Expected consumers | The later brochure pipeline showcase pattern, then public-site adoption after pattern signoff. |
| Non-goals | Step detail panel layout, panel content, visual proof composition, route state, analytics, app adoption, or product workflow. |

## Layer Boundary

This PrimitiveDefinitionArtifact defines primitive decisions only.

It must not define new token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| Desktop ordered selector uses tablist semantics. | `03-primitive` | none | Local public-site markup/controller | Render tablist, tabs, roving focus, and `aria-selected`. |
| Mobile selector replaces the tab list. | `03-primitive` | none | Prior mobile duplicate-control drift and browser-native select styling limits | Render one styled button-triggered listbox replacement selector and hide tablist in mobile proof styling. |
| Selector active state must synchronize. | `03-primitive` | none | Local public-site controller | Controller updates tabs, dropdown trigger label, hidden value, listbox option state, active dataset, and emits change event. |
| External panels must follow selector changes. | `04-pattern-contract` | none | Pattern not created yet | Primitive emits change event; pattern owns panel visibility. |
| Selector frame, focus, label, and target values. | `02-token` | signed brochure tokens | none | Consume signed runtime seams only. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for brochure pipeline-showcase-frame, focus-ring, label-text-style, and minimum-target-size` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no governed pipeline step selector primitive existed before this artifact |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `pipeline-showcase-frame` | `docs/design-system/02-token/shared/pipeline-showcase-frame/PipelineShowcaseFrame-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/pipeline-showcase-frame/PipelineShowcaseFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs#pipelineShowcaseFrameTokenSpec` | Inactive tab, active tab, and mobile dropdown frame values. | `consumable` |
| `focus-ring` | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/focus-ring/FocusRing-Implementation.md` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/brochure.mjs#focusRingTokenSpec` | Keyboard-visible focus outline. | `consumable` |
| `label-text-style` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/label-text-style/LabelTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec` | Step selector label text. | `consumable` |
| `minimum-target-size` | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` | `brochure` | `docs/design-system/02-token/systems/brochure/minimum-target-size/MinimumTargetSize-Implementation.md` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/brochure.mjs#minimumTargetSizeTokenSpec` | Selector target-size floor. | `consumable` |

## Behavior Contract

The primitive renders one ordered step selector. Desktop mode exposes a tablist.
Mobile mode exposes a styled button-triggered listbox dropdown. The primitive keeps both selectors'
active state synchronized and exposes the active step through a bubbling
`brochure-pipeline-step-selector:change` event.

The primitive does not show or hide step panels. A pattern must listen for the
change event and synchronize panels.

## Accessibility Contract

The tablist has an accessible name. Each tab has `role="tab"`,
`aria-selected`, and `aria-controls` for its external panel. The active tab has
`tabindex="0"` and inactive tabs have `tabindex="-1"`. The mobile dropdown
trigger has `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, and a
programmatic name that includes the current step. The mobile listbox exposes
`role="listbox"` and one `role="option"` per step with `aria-selected`.

Keyboard support:

- Tab reaches the active tab or dropdown trigger.
- Arrow Right and Arrow Down move to the next step and wrap.
- Arrow Left and Arrow Up move to the previous step and wrap.
- Home activates the first step.
- End activates the last step.
- In mobile dropdown mode, Enter, Space, or Arrow Down opens the listbox.
- In mobile dropdown mode, Arrow Up and Arrow Down move option focus, Enter or
  Space selects the focused option, and Escape closes the listbox.

## Allowed States

| State | Required Behavior |
| --- | --- |
| default | First step is active unless `activeStepId` is provided. |
| active | Exactly one tab is active, `aria-selected="true"`, and the select value matches. |
| inactive | Inactive tabs are not selected and are removed from normal tab order. |
| mobile selector | Custom dropdown trigger/listbox is visible and desktop tablist is hidden by proof styling. |
| desktop selector | Tablist is visible and custom dropdown trigger/listbox is hidden by proof styling. |

## Data Or Event Contract

Input data is a non-empty ordered `steps` array. Each step has an `id`, `label`,
`number`, and `panelId`.

The primitive emits `brochure-pipeline-step-selector:change` with:

```json
{ "activeStepId": "<step-id>" }
```

## Visual-Skin Boundary

The primitive may vary selector frame, focus, label, and target sizing only
through signed token seams. It must not hard-code selector colors, borders,
padding, focus outlines, label typography, or target-size values in consumer
code.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Primitive module | `src/frontend/designSystem/layers/03-primitive/brochure-pipeline-step-selector/index.mjs` |
| Primitive export | `brochurePipelineStepSelectorPrimitive` |
| Render export | `renderBrochurePipelineStepSelectorPrimitive` |
| Controller export | `attachBrochurePipelineStepSelectorPrimitive` |
| Allowed consumers | Later brochure pipeline showcase pattern and later adoption seams after review. |
| Consumers must not use | Copied public-site markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit tests prove active/default state, tab/custom-dropdown rendering, and event/controller hooks. |
| accessibility | Proof route and tests show tablist/listbox semantics, selected state, and keyboard-owned data hooks. |
| token consumption | Unit tests prove selector frame/focus/label/target values come from signed tokens. |
| rendered verification | `/design-system/brochure/primitives/brochure-pipeline-step-selector` must serve a proof route. |
| consumer boundary | Pipeline showcase pattern must consume this primitive later instead of recreating selector behavior. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/brochure/primitives/brochure-pipeline-step-selector` |
| Rendered view status | `available` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | The selector primitive is ready for the pipeline showcase pattern to compose selector plus active panel. |
