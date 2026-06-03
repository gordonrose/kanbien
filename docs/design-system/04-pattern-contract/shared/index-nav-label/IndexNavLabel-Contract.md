# Index Nav Label Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `text-overflow-disclosure` |
| Pattern name | `index-nav-label` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/index-nav-label/IndexNavLabel-Proof.md` |
| Files affected now | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md`; `docs/design-system/04-pattern-contract/systems/default/index-nav-label/IndexNavLabel-Proof.md`; `docs/design-system/04-pattern-contract/pattern-readiness-index.md`; `src/frontend/designSystem/layers/04-pattern-contract/index-nav-label/index.mjs`; `src/frontend/designSystem/systems/default/patterns/index-nav-label/index.html`; `src/frontend/designSystem/systems/default/patterns/index-nav-label/page.mjs`; `tests/unit/designSystem/indexNavLabelPattern.test.ts`; `tests/visual/designSystem/patterns/indexNavLabelPatternRoute.spec.ts` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Constrained index navigation labels must not overlap their containers, and users must be able to access the full label when visible text truncates. |
| Pattern job | Compose the accepted `truncating-label` primitive for one label inside a primary or secondary index-navigation context. |
| Expected consumers | Later Layer 4 index-navigation patterns, Layer 5 component seams, use-case pages, canonical scenarios, templates, and app adoption after those layers are active. |
| Non-goals | This pattern is not a full nav item, list, panel, route, selected-state model, count badge, menu, page section, component API, demo fixture, or app adoption seam. |

## Layer Boundary

This PatternContractArtifact may define pattern composition only.

It must not define token values, primitive behavior, component APIs, demo
fixtures, canonical scenarios, app imports, app wrappers, product workflow, or
app-local CSS.

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Primitive readiness source checked | `docs/design-system/03-primitive/primitive-readiness-index.md` |
| Required primitives consumable by selected systems | `yes for default truncating-label` |
| Required direct tokens consumable by selected systems | `not-applicable; this pattern consumes tokens only through the primitive` |
| Pattern inventory checked | `src/frontend/designSystem/templates/entity_management_page/index.html`; `src/frontend/designSystem/tokens/filter-panel-structure/index.html`; `tests/visual/designSystem/canonicals/data-display/filterPanelStructure.spec.ts`; existing routes are legacy or token inventory, not governed Layer 4 pattern sources |

## Primitive Dependencies

| Primitive | Shared Contract | System | System Proof | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `truncating-label` | `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md` | `default` | `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md` | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive` | Governed truncation, full-text disclosure, focus behavior, token consumption, and RTL/zoom obligations for one constrained label. | `consumable` |

## Direct Token Dependencies

Only include direct token dependencies that the pattern consumes itself. Do not
repeat tokens that are consumed only through a primitive.

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `none` | `none` | `none` | `none` | `none` | This pattern relies on the accepted primitive to consume signed token seams. | `not-applicable` |

## Composition Contract

`index-nav-label` represents one text label placed inside a constrained
index-navigation slot.

The pattern must compose the accepted `truncating-label` primitive for the
visible label and full-text disclosure behavior. Consumers may provide the
full label text and the available inline size through their own layout, but
they must not recreate truncation, tooltip disclosure, focus handling, ARIA, or
token values locally.

The pattern may be used for primary or secondary index-navigation labels. It
does not own the surrounding navigation list, item activation, routing,
selection/current state, item count, nested indentation, drag behavior, or
panel layout. Those decisions require later governed patterns or component
seams.

Because the accepted primitive is focusable, this pattern must not be nested
inside another interactive element unless a later governed pattern or component
seam explicitly owns the combined focus model.

## Accessibility Contract

This pattern preserves the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The pattern owns one accessible label value and delegates the concrete label
semantics, keyboard focus, tooltip relationship, Escape dismissal, pointer
hover, and touch toggle behavior to the accepted `truncating-label` primitive.

The pattern does not create `nav`, `list`, `listitem`, `aria-current`,
`aria-selected`, `aria-expanded`, or route semantics. A later navigation-item
or navigation-list pattern must define those relationships before this label
can be treated as a full navigable item.

Keyboard order must remain simple: if the label is used on its own, the
primitive receives focus. If the label is later placed inside a larger
interactive nav item, that later layer must choose one focus target and must
not create invalid nested interactive controls.

RTL, 150% zoom, 75% zoom, and mobile review must prove that the label remains
inside its allocated slot, truncates instead of overlapping neighboring text,
and keeps full-text disclosure reachable.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `label-fits` | The primitive may render without visible clipping, and the full label value remains preserved. |
| `label-truncated` | The primitive clips visible text with ellipsis and exposes the full value through governed disclosure. |
| `host-is-interactive` | The consumer must stop or route to a later governed focus-composition decision before nesting this focusable pattern inside a link, button, or other interactive host. |

## Data Or Event Contract

The pattern displays one externally meaningful label string supplied by the
consumer.

It does not normalize, persist, fetch, mutate, route, select, expand, collapse,
or emit product events.

## Visual-Skin Boundary

Design-system implementations may vary only the visual result produced by the
accepted primitive and its signed token dependencies.

Design-system implementations must not change this pattern into a clickable
nav item, selected item, badge row, panel header, card, menu trigger, or
component API.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned pattern module | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-label/index.mjs` |
| Planned pattern export | `indexNavLabelPattern`, `renderIndexNavLabelPattern`, `attachIndexNavLabelPatternController` |
| Allowed consumers | Later Layer 4 pattern contracts and Layer 5+ artifacts after their own gates pass. |
| Consumers must use | This shared pattern contract and selected system proof now; the planned runtime pattern module when runtime consumption is implemented. |
| Consumers must not use | copied app markup, legacy route markup, screenshots, local CSS values, duplicated primitive behavior, or route-local proof markup |

## Runtime Pattern Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `data/spec helper`, `render helper`, and primitive controller attachment helper |
| Planned module | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-label/index.mjs` |
| Planned export | `indexNavLabelPattern`, `renderIndexNavLabelPattern`, `attachIndexNavLabelPatternController` |
| Seam must own | Primitive orchestration for one index-navigation label, label text validation, and the rule that interactive hosts require a governed focus-composition decision. |
| Seam must not own | component props, navigation routing, selection state, counts, app wrappers, product workflow, backend calls, unsigned visual values, or primitive reimplementation |
| First implementation posture | Implemented as a small helper that renders the accepted `truncating-label` primitive for a non-interactive constrained label slot. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | `tests/unit/designSystem/indexNavLabelPattern.test.ts` verifies the pattern composes `truncating-label` rather than recreating truncation or disclosure behavior. |
| accessibility | `tests/visual/designSystem/patterns/indexNavLabelPatternRoute.spec.ts` verifies the pattern does not create invalid nested interactive controls and preserves full label access by keyboard, pointer, and touch when rendered. |
| primitive consumption | Unit and rendered proof point to `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs` rather than route-local markup. |
| token consumption | No direct token consumption is allowed; any visual values must arrive through the accepted primitive's signed token dependencies. |
| rendered verification | `/design-system/default/patterns/index-nav-label` is covered by `tests/visual/designSystem/patterns/indexNavLabelPatternRoute.spec.ts` for desktop, mobile, RTL, focus, touch toggle, and no-overlap checks. |
| consumer boundary | Readiness index and downstream artifacts must identify this as a Layer 4 contract, not a component seam or app adoption seam. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/index-nav-label` |
| Rendered view status | `available` |
| If unavailable | Do not consume rendered evidence for this pattern until the route is available and verified. |

## Rendered Proof Controls

Only include controls that vary signed upstream dependencies, responsive
constraints, accessibility-sensitive states, or consumer-boundary risks.

| Control | Source Of Truth | Why It Matters | Status |
| --- | --- | --- | --- |
| `theme` | `truncating-label` default proof themes and signed tooltip/focus token variants | Proves the pattern does not depend on original-theme-only tooltip or focus behavior. | `available` |
| `background token` | `background-color` signed `default` token variants | Proves the label remains readable and contained when reviewed against approved page and surface backgrounds. | `available` |
| `slot width` | Pattern proof responsive constraint | Proves truncation behavior survives realistic primary, secondary, and tight index-label widths. | `available` |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling,
or token values locally.

Consumers must not use legacy top-level `/design-system/patterns` route markup
as the pattern source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not treat the pattern as a component seam or app adoption seam.

Consumers must not nest this focusable pattern inside another interactive
control until a later governed artifact explicitly owns that focus model.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared pattern contract at | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md` |
| Store system proof at | `docs/design-system/04-pattern-contract/systems/default/index-nav-label/IndexNavLabel-Proof.md` |
| Stable lookup key | `shared/text-overflow-disclosure/index-nav-label/04-pattern-contract` |
| How later layers consume it | Later layers read the shared pattern contract and selected system proof by path or stable lookup key before making component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve composition, primitive dependency, accessibility, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a pattern revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `04-pattern-contract/EVAL.md` |
| Required accessibility eval | `04-pattern-contract/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `04-pattern-contract` | Review this `index-nav-label` contract and default system proof. | No known contract blocker remains for the narrow non-interactive label composition. |
| 2 | `04-pattern-contract` | Keep the runtime pattern seam and proof route as the source of rendered evidence for this narrow label pattern. | No known blocker remains for the proof route. |
| 3 | `04-pattern-contract` | Define a separate index-nav-item or index-nav-list pattern before clickable item behavior, selected/current state, counts, or nested navigation are approved. | Those decisions are broader than one constrained label. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | The next safe step is a runtime proof for this same pattern or a separate Layer 4 navigation-item contract; Layer 5 component seams remain scaffold-only. |
