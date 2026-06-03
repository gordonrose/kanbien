# Brochure Pipeline Showcase Behavior Rule

## Metadata

- Design system: shared behavior, brochure proof first
- UI family: brochure-pipeline-showcase
- Harness layer: 01-behavior-rule
- Rule status: review-ready
- Existing design-system route: none
- Proposed design-system route: `/design-system/brochure/patterns/brochure-pipeline-showcase`
- Behavior artifact: `docs/design-system/01-behavior-rule/shared/brochure-pipeline-showcase/BrochurePipelineShowcase-Behaviour.md`

## Purpose

The brochure pipeline showcase lets a public reader move through a finite,
ordered sequence of pipeline steps and read the active step's detail panel.

The family is successful when exactly one step is active, exactly one panel is
visible, the visible selector reflects the active step, and mobile users see a
single styled dropdown instead of both the dropdown and the full tab list.

This rule does not define route navigation, app workflow state, analytics,
data loading, component APIs, or deep links for individual steps.

## Layer Boundary

This artifact only defines required behavior and source decomposition. It does
not approve token values, primitive markup, pattern composition, component
APIs, public-site adoption, or app adoption.

The current public-site implementation is source material only. It must not be
treated as the governed design-system seam until the downstream token,
primitive, pattern, and adoption work exists.

## Source Decomposition

| Source material | Layer owner | Current state | Rule |
| --- | --- | --- | --- |
| Finite ordered pipeline steps with one active step and panel | 01 behavior | Local public-site behavior exists | Govern here as the family behavior. |
| Desktop tablist selector with active step state | 03 primitive or 04 pattern | Local public-site markup/controller exists | Downstream layer must own the governed selector seam. |
| Mobile dropdown selector replacing the tab list | 01 behavior, then 03/04 implementation | Local public-site CSS previously drifted into duplicate controls | Mobile must show one styled selector; the full tab list must not also be visible. |
| Selector and panel synchronization | 01 behavior, then 03/04 implementation | Local public-site controller exists | Every selector change must update the active panel and all hidden selector state. |
| Step detail panel with copy, optional visual proof, and optional examples | 04 pattern | Local public-site composition exists | Pattern layer must own the composition before app or public-site adoption is complete. |
| Active, inactive, focus, panel, dropdown, and responsive layout styling | 02 token | Some brochure tokens exist; pipeline-specific coverage is incomplete | Token layer must decide which values are reusable and which remain pattern-local. |

## Required States

- Default: the first step is active, its panel is visible, and all selectors
  represent that active step.
- Active step: exactly one step is selected and exactly one panel is visible.
- Inactive step: inactive controls are not selected and inactive panels are
  hidden from the rendered flow.
- Desktop selector mode: the tablist is the visible selector and the mobile
  dropdown is hidden.
- Mobile selector mode: the styled dropdown is the only visible selector and
  the tablist is hidden.
- Responsive transition: changing between desktop and mobile selector modes
  preserves the current active step.

## Required Interactions

- Clicking a desktop tab activates that step and reveals its linked panel.
- Keyboard focus can reach the desktop tablist.
- Arrow Right and Arrow Down move to the next step and wrap at the end.
- Arrow Left and Arrow Up move to the previous step and wrap at the beginning.
- Home activates the first step.
- End activates the last step.
- Changing the mobile dropdown activates the selected step and reveals its
  linked panel.
- Any interaction through one selector must synchronize the other selector's
  hidden state.

## Accessibility Promise

- The desktop selector has a programmatic tablist name.
- Each desktop tab has selected state and controls exactly one panel.
- Each panel is labelled by its controlling tab.
- The mobile dropdown has a programmatic name.
- Focus treatment is visible on tabs and dropdowns without causing layout
  shift.
- Active state is not conveyed by color alone; it must be available
  programmatically and visibly differentiated.
- The family has no error, loading, validation, or status semantics.

## Mandatory Review Dimensions

Downstream render proof must include:

- mobile: dropdown visible, tablist hidden, one active panel visible
- desktop: tablist visible, dropdown hidden, one active panel visible
- responsive transition: active step preserved across viewport changes
- keyboard: tablist arrow, Home, and End behavior
- 150% zoom: selector and panel remain readable without duplicate controls
- 75% zoom: active and inactive selectors remain distinguishable
- RTL: ordered labels and panel content remain coherent
- dark and desert themes: no accidental dependency on error colors or
  unsupported semantic states

## Consumer Restrictions

Consumers must not copy local public-site tab, dropdown, panel, or controller
implementation as a substitute for governed adoption.

Consumers must not expose both the mobile dropdown and the full tab list in the
same responsive mode.

Consumers must not add route history, deep links, analytics, or app workflow
state as implicit behavior of this family without a new behavior-rule update.

## Ungoverned Dependencies

- Pipeline selector primitive or pattern seam is missing.
- Pipeline panel composition pattern is missing.
- Pipeline active, focus, dropdown, and panel surface tokens are not fully
  governed.
- Responsive diagram and panel layout values may need an additional token only
  if the next pattern proves the behavior is reusable beyond this page.

These gaps block treating the public pipeline section as a completed governed
design-system adoption.

## Next Layer

Next expected layer: 02-token.

The token pass should audit the existing brochure token set against the
pipeline selector, active state, focus state, dropdown, panel surface, and
responsive panel layout needs before any primitive or pattern route is created.
