# Header Menu Simple Select Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `menu-simple-select` |
| Pattern name | `header-menu-simple-select` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/header-menu-simple-select/HeaderMenuSimpleSelect-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/header-menu-simple-select/HeaderMenuSimpleSelect-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/header-menu-simple-select/index.mjs#headerMenuSimpleSelectPattern` |
| Rendered proof | `/design-system/default/patterns/header-menu-simple-select` |

## Purpose

`header-menu-simple-select` composes the governed
`menu-simple-select-control` primitive with representative layer, filter, and
search option fixtures for use in governed header and toolbar surfaces.

It does not own entity page header adoption, component props, backend data,
route changes, persistence, demo pages, canonical scenarios, or app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Token dependency | `menu-simple-select-frame` and primitive token dependencies are `review-ready` for `default` |
| Primitive dependency | `menu-simple-select-control` is `review-ready` for `default` |

## Composition Contract

The pattern renders exactly one `menu-simple-select-control` primitive. It owns
representative header option fixture shapes for layer, filter, and search
selectors. It can render either the text-backed trigger variant or an
icon-trigger variant with a semantic filter or sort glyph.

The pattern must not recreate trigger, listbox, option, keyboard, selected
state, disabled state, or dismissal behavior. Those remain primitive-owned.

## Accessibility Contract

The pattern preserves the primitive's accessible trigger, listbox, selected
option, disabled option, and keyboard behavior. It must not wrap the primitive
in markup that changes its name, focus order, or popup relationship.

## Data Or Event Contract

The pattern accepts a selected value, optional trigger variant, optional
trigger icon, and an optional option list matching the primitive option model.
Product routing and persistence remain outside the pattern.

## Visual-Skin Boundary

All trigger, panel, option, current, disabled, focus, and text values come
through the primitive and its signed token dependencies. The pattern may place
the primitive in a proof-only header container but must not define local CSS
values for the select itself.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned pattern module | `src/frontend/designSystem/layers/04-pattern-contract/header-menu-simple-select/index.mjs` |
| Planned pattern export | `headerMenuSimpleSelectPattern` |
| Allowed consumers | Later component seam, demo, canonical, and app-adoption layers after those gates are active. |
| Consumers must use | `src/frontend/designSystem/layers/04-pattern-contract/header-menu-simple-select/index.mjs` |
| Consumers must not use | copied app markup, legacy route markup, screenshots, local CSS values, duplicated primitive behavior, or route-local proof markup |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit test covers primitive composition, representative layer/filter/sort options, and icon-trigger composition. |
| accessibility | Unit test verifies rendered primitive attributes are present through the pattern. |
| primitive consumption | Unit test covers `menu-simple-select-control` dependency. |
| token consumption | Token consumption remains indirect through the primitive. |
| rendered verification | Proof route created; browser execution available through local Playwright dependencies. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/header-menu-simple-select` |
| Rendered view status | `available` |
| If unavailable | not-applicable |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling,
or token values locally.

Consumers must not treat the pattern as a component seam or app adoption seam.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared pattern contract at | `docs/design-system/04-pattern-contract/shared/header-menu-simple-select/HeaderMenuSimpleSelect-Contract.md` |
| Store system proof at | `docs/design-system/04-pattern-contract/systems/default/header-menu-simple-select/HeaderMenuSimpleSelect-Proof.md` |
| Stable lookup key | `shared/menu-simple-select/header-menu-simple-select/04-pattern-contract` |
| How later layers consume it | Later layers read the shared pattern contract and selected system proof by path or stable lookup key before making component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve composition, primitive dependencies, accessibility, data shape, visual-skin boundary, required evidence, and consumer restrictions unless a pattern revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `04-pattern-contract/EVAL.md` |
| Required accessibility eval | `04-pattern-contract/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `04-pattern-contract` | Treat this pattern as review-ready if focused tests pass. | none |
| 2 | `05-component-seam` | Create an app-consumable header selector component seam. | none |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `05-component-seam` |
| Next layer status | `allowed` |
| Reason | The Layer 5 harness is active and can now govern a header selector component seam. |
