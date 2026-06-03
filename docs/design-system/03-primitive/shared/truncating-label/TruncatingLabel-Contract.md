# Truncating Label Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `text-overflow-disclosure` |
| Primitive name | `truncating-label` |
| Harness layer | `03-primitive` |
| Primitive status | `accepted` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md` |
| Files affected now | `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md`; `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md`; `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs`; `src/frontend/designSystem/systems/default/primitives/truncating-label/index.html`; `tests/unit/designSystem/truncatingLabelPrimitive.test.ts`; `tests/visual/designSystem/primitives/truncatingLabelPrimitiveRoute.spec.ts` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Text that does not fit its container must truncate without breaking layout while preserving access to the full value. |
| Primitive job | Render one text label that clips visibly and reveals its full text through governed disclosure behavior. It may be focusable when used standalone, or non-focusable when hosted inside another interactive primitive that owns focus. |
| Expected consumers | `04-pattern-contract`, `05-component-seam`, and later app adoption after those layers consume the runtime primitive seam. |
| Non-goals | This primitive is not a button, menu, popover, field row, nav item, badge, validation message, product workflow, page layout, component API, or app adoption seam. |

## Layer Boundary

This PrimitiveDefinitionArtifact defines primitive decisions only.

It does not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `yes for default label-text-style, supporting-text-style, tooltip-surface, tooltip-text-style, focus-ring, and minimum-target-size` |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no consumable truncating text primitive existed before this artifact |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `label-text-style` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` | `default` | `docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` | Visible clipped label typography. | `consumable` |
| `supporting-text-style` | `docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md` | `default` | `docs/design-system/02-token/systems/default/supporting-text-style/SupportingTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec` | Visible clipped supporting-text typography. | `consumable` |
| `tooltip-surface` | `docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md` | `default` | `docs/design-system/02-token/systems/default/tooltip-surface/TooltipSurface-Implementation.md` | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec` | Full-text disclosure surface visuals. | `consumable` |
| `tooltip-text-style` | `docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md` | `default` | `docs/design-system/02-token/systems/default/tooltip-text-style/TooltipTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec` | Full-text disclosure typography. | `consumable` |
| `focus-ring` | `docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md` | `default` | `docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` | Visible keyboard focus. | `consumable` |
| `minimum-target-size` | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` | `default` | `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` | Reachable focus, pointer, and touch target. | `consumable` |

## Behavior Contract

`truncating-label` renders the full text value as the underlying text content
and as the accessible value.

When the host width is too small, the visible text clips with an ellipsis
without resizing the host, overlapping adjacent content, or changing the full
text value.

When the primitive owns focus, focus and pointer hover reveal the full text in
the disclosure surface. Click or tap toggles the disclosure surface. Escape
dismisses the disclosure.

When a containing interactive primitive owns focus, `truncating-label` may be
rendered non-focusable so it does not create nested focus targets. Pointer hover
still reveals full text when overflow is present.

The primitive does not emit product events or app actions.

## Accessibility Contract

The primitive follows the shared WCAG 2.2 AA default in
`.codex/skills/41-front-end/accessibility/WCAG-2.2-AA-DEFAULT.md`.

The primitive uses a text element, not a button role. In standalone mode the
element is focusable, keeps the full value as its accessible name, and
references the tooltip surface through `aria-describedby`.

Keyboard users can Tab to standalone labels, read the full value, and dismiss
the visible disclosure with Escape. When a parent interactive primitive owns
focus, the parent must preserve an accessible name or description for the
truncated text.

Pointer and touch users can reveal the full text without losing the underlying
label value.

The primitive must preserve visible focus, target reachability, RTL reading
order, and zoom readability. It must not rely on color alone to signal that
text was clipped.

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `fits` | The label remains fully readable; disclosure may remain available but is not required for meaning. |
| `truncated` | Visible text clips with ellipsis while full text remains the accessible value and disclosure text. |
| `focus-visible` | Focus reveals disclosure and uses the signed focus-ring token without layout shift. |
| `pointer-hover` | Hover reveals disclosure without emitting an app action. |
| `touch-toggle` | Tap toggles disclosure without changing the label value or emitting an app action. |

## Data Or Event Contract

The primitive displays one externally meaningful text value supplied by the
consumer.

It does not normalize, persist, fetch, mutate, or emit product data. It does
not emit app actions.

## Visual-Skin Boundary

Design-system implementations may vary the concrete visual values only through
the signed token seams named above.

Design-system implementations must not change the primitive into a button,
menu trigger, popover trigger, nav item, field row, badge, validation message,
or product-specific wrapper.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs` |
| Planned primitive export | `truncatingLabelPrimitive`, `renderTruncatingLabelPrimitive`, `attachTruncatingLabelPrimitiveController` |
| Allowed consumers | `04-pattern-contract`, `05-component-seam`, and later governed app adoption after those layers are active |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs` when runtime consumption is needed. |
| Consumers must not use | copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Allowed seam shape | `spec helper`, `render helper`, and `small controller` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs` |
| Planned export | `truncatingLabelPrimitive`, `renderTruncatingLabelPrimitive`, `attachTruncatingLabelPrimitiveController` |
| Seam must own | Token resolution, semantic attributes, full-text value preservation, disclosure state handling, focus behavior, and class/data contract. |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, unsigned visual values, menu/popover behavior, field-row behavior, or app actions |
| First implementation posture | Implemented as a small render/controller seam that combines signed token values with stable text disclosure behavior. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | `tests/unit/designSystem/truncatingLabelPrimitive.test.ts` shows full value preservation, supported themes, token resolution, rejected missing text, unsupported systems, render seam ownership, and no inline `style` attribute. |
| accessibility | `tests/visual/designSystem/primitives/truncatingLabelPrimitiveRoute.spec.ts` shows focusability, full accessible value, `aria-describedby`, Escape dismissal, visible focus behavior, and click/tap toggle behavior. |
| token consumption | Unit proof shows visual declarations are sourced from signed Layer 2 seams and carried by the primitive seam instead of local visual literals. |
| rendered verification | Desktop and mobile browser proof shows truncation, no overlap, disclosure reveal, RTL stability, operable navigation, and contained target sizing. |
| consumer boundary | Readiness index and tests point consumers to the runtime primitive seam instead of route-local markup. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/truncating-label` |
| Rendered view status | `available` |
| If unavailable | Do not consume this primitive in later layers. |

## Consumer Restrictions

Consumers must not hard-code values governed by Layer 2 tokens.

Consumers must not recreate primitive markup, controller behavior, ARIA rules,
or state handling locally.

Consumers must not use route-local `/design-system` markup as the primitive
source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not nest this focusable primitive inside another interactive
control unless a later pattern or component seam explicitly governs that
composition.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/truncating-label/TruncatingLabel-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/default/truncating-label/TruncatingLabel-Proof.md` |
| Stable lookup key | `shared/text-overflow-disclosure/truncating-label/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, runtime seam policy, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- |
| 1 | `03-primitive` | Keep the shared `truncating-label` primitive contract and default proof as the source of truth for governed truncating text labels. | Accepted for the narrow label use case. |
| 2 | `04-pattern-contract` | Compose this primitive into index navigation, field labels, and panel headers only after Layer 4 is active. | Pattern composition remains a later layer. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `scaffold-only` |
| Reason | The primitive is accepted, but composition into reusable patterns must wait until Layer 4 is activated. |
