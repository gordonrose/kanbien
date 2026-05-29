# Entity Panel Execution Plan

This plan keeps the entity panel work inside the governed harness. It is
not a replacement for Layer 2, 3, or 4 artifacts.

## Goal

Build the entity panel foundation by promoting reusable design-system
seams before creating entity-specific seams.

The target panel must eventually support a header, embedded secondary index,
body/content region, desktop body scrolling, mobile takeover priority, and
hosted form or builder controls. Hosted controls are not approved by this plan.
They need their own layer passes before the entity body can render them as
governed content.

## Current Layer 1 Source

| Field | Value |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Status | `review-ready` |
| Next allowed layer | `02-token` |
| Blocked downstream claim | No primitive, pattern, template, canonical, or app adoption may claim entity-panel readiness until the Layer 2/3/4 gaps below are resolved. |

## Promotion-First Work Order

| Order | Layer | Work Item | Reuse Bias | Stop Condition |
| --- | --- | --- | --- | --- |
| 1 | `02-token` | Decide whether `index-nav-panel-frame` should be promoted into a generic panel-frame token or remain index-only. | Prefer generic panel-frame if the value governs panel shells beyond index navigation. | Stop if the behavior rule does not justify the token need or if the value cannot name signed upstream dependencies. |
| 2 | `02-token` | Split reusable panel header geometry into `panel-header-frame`. | Keep header height, separator, sticky inset, and title/action gap separate from the outer panel shell token. | Stop if the token starts defining action button appearance or body layout. |
| 3 | `03-primitive` | Promote a generic panel-header primitive only after a generic panel-header token seam exists. | Reuse `icon-button-control` and `truncating-label`; do not clone their behavior. | Stop if the primitive would consume `index-nav-panel-frame` or `panel-frame` as if either owned header geometry. |
| 4 | `04-pattern-contract` | Define an entity-panel pattern shell with header, optional embedded secondary index, body slot, and scroll ownership. | Reuse `index-nav-panel` for the secondary index; reuse `scroll-region-control` for governed scrolling. | Stop if body sizing, mobile takeover, or scroll ownership needs an unsigned token. |
| 5 | `04-pattern-contract` | Add a rendered proof for desktop, mobile, RTL, zoom, empty secondary index, and long body content. | Use proof controls only when browser assertions prove the rendered behavior changes. | Stop if controls are inert or fixture-only. |
| 6 | later | Govern hosted form and builder families one at a time. | Start with generic names such as text field, textarea, radio group, toggle, drawer select, accordion, and card select unless an entity-specific behavior is proven. | Stop if a hosted control is copied from an app-like route or screenshot without its own behavior rule. |

## Reuse Decisions Already Available

| Reusable seam | Current status | Entity panel posture |
| --- | --- | --- |
| `icon-button-control` | Layer 3 review-ready | Reuse for close and add controls when a pattern chooses those actions. |
| `truncating-label` | Layer 3 accepted | Reuse for header titles and other governed clipped labels. |
| `scroll-region-control` | Layer 3 review-ready | Reuse for desktop internal body or list scrolling when the pattern owns scroll geometry. |
| `resize-handle-control` | Layer 3 review-ready | Reuse only when a pattern exposes governed resizing and passes signed min/max size values. |
| `index-nav-panel` | Layer 4 review-ready | Reuse for embedded secondary index instead of creating a second navigation panel family. |
| `panel-corner-radius` | Layer 2 review-ready | Reuse for panel shell radius; do not define panel corners locally. |
| `scrollbar-skin` | Layer 2 review-ready | Reuse through `scroll-region-control`; do not style scrollbars locally. |

## Open Gaps

| Gap | Layer That Must Own It | Why It Blocks |
| --- | --- | --- |
| Generic panel frame token | `02-token` | Entity-panel should not consume an index-nav-only frame token for general panel shell behavior. |
| Generic panel header token | `02-token` | Header height, separator, sticky inset, and action gap must be signed before a generic header primitive exists. |
| Generic panel header primitive | `03-primitive` | The current header primitive is named and scoped to index navigation. |
| Close icon support | `03-primitive` | Mobile close behavior needs an `x` icon, but `icon-button-control` currently signs only the `plus` icon. |
| Entity body panel pattern | `04-pattern-contract` | Composition of header, secondary index, body slot, scroll behavior, and mobile priority belongs to the pattern layer. |
| Mobile takeover pattern behavior | `04-pattern-contract` or later | Layer 1 names priority and close behavior, but rendered structure and state handling are not governed yet. |
| Hosted form/builder families | `01-behavior-rule` through later layers per family | The entity body shell cannot make ungoverned controls become governed by containment. |

## Audit Rule

Before each file edit, check whether the edit is creating a reusable generic
seam or an entity-specific seam.

Create an entity-specific seam only when the behavior is unique to entity body
panels. Otherwise promote or reuse a generic seam first.
