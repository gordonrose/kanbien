# Top Navigation Trigger Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `top-navigation` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md` |
| Behavior lock path | `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md` |
| Reference pack path | `docs/workspace/design-system/reference-packs/top-nav-reference-pack.md` |
| Token contract path | `docs/design-system/02-token/shared/top-navigation-frame/TopNavigationFrame-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Overflow, profile, and mobile top-navigation surfaces need one governed native trigger before the full pattern composes menus and responsive shell behavior. |
| Primitive job | Render a native button trigger with signed trigger/open-trigger frame values, `aria-expanded`, `aria-controls`, minimum target size, focus treatment, and governed label truncation. |
| Non-goals | Destination links, menu panel placement, outside-click dismissal, Escape focus return, overflow measurement, mobile surface layout, component APIs, and app adoption. |

## Shared Primitive Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs#topNavigationTriggerControlPrimitiveContract` |
| Render seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs#renderTopNavigationTriggerControlPrimitive` |
| Controller seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs#attachTopNavigationTriggerControlPrimitiveController` |
| Supported systems | `default` |
| Supported themes | `original`, `dark`, `desert` |
| Supported kinds | `overflow`, `profile`, `mobile` |
| Required tokens | `top-navigation-frame`, `label-text-style`, `focus-ring`, `minimum-target-size` |
| Required primitive dependency | `truncating-label` |
| Required native element | `<button type="button">` |
| Expanded semantics | Triggers must emit `aria-expanded` and `aria-controls`; opened triggers must use the signed open-trigger frame variant. |

## Behavior Coverage

- Covers overflow/profile/mobile trigger primitives called out by `TRP-004`,
  `TRP-005`, `TRP-006`, and `TRP-007`.
- Covers `TN-006`, `TN-007`, `TN-012`, and the trigger portions of `TN-008`
  through `TN-010` by exposing native button activation and expanded state.
- Covers long trigger label pressure from `TN-013` and `TRP-013` through the
  non-focusable `truncating-label` primitive.
- Defers outside-click dismissal, Escape focus return, surface placement,
  overflow measurement, and mobile composition to the Layer 4 pattern.

## Consumer Rules

- Consumers must use this primitive for governed top-navigation overflow,
  profile, and mobile menu triggers.
- Consumers must not recreate native button markup, expanded semantics, target
  sizing, focus treatment, truncation, or token values locally.
- Consumers must provide a non-empty `controls` value that points to the later
  pattern-owned surface.
- Consumers must not use this primitive for destination links, menu panel
  placement, overflow measurement, mobile surface layout, component seams, or
  app adoption.

## Lower-Layer Reuse Audit

- Reuses `top-navigation-frame` trigger and open-trigger variants.
- Reuses `label-text-style`, `focus-ring`, and `minimum-target-size`.
- Reuses `truncating-label` in non-focusable mode for long trigger labels.
- Does not reuse `text-action-button-control` because this primitive needs
  top-navigation-specific expanded semantics and trigger/open-trigger frame
  roles.
- Does not reuse `icon-button-control` because overflow/profile triggers in the
  reference pack include named text labels, and icon-only triggers are not
  enough for the signed top-navigation behavior.

## Review Dimensions

- Rendered output must contain one native button per trigger.
- Closed and open states must expose `aria-expanded`.
- Open state must not rely on visual styling alone.
- Focus must use the signed focus-ring token.
- Target size must preserve the signed interactive minimum.
- Long labels must use the signed truncating-label primitive without adding a
  second focus target.
