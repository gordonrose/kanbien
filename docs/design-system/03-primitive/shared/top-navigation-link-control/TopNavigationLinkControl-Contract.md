# Top Navigation Link Control Primitive Contract

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
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Top-navigation destinations and menu links need one governed native-link focus target before the full top-navigation pattern composes chrome, overflow, and profile behavior. |
| Primitive job | Render a native anchor for top-navigation destination and menu-link items, including signed frame values, minimum target size, focus treatment, current-page semantics, and governed label truncation. |
| Non-goals | Brand mark anatomy, menu triggers, profile triggers, overflow measurement, mobile collapse, app routing policy, authorization, component APIs, and app adoption. |

## Layer Boundary

This PrimitiveArtifact may define native anchor semantics, required token
dependencies, label truncation dependency, current-state attributes, and the
primitive runtime seam.

It must not define pattern structure, top-navigation chrome layout, overflow
selection, menu open/close behavior, profile behavior, route creation, app
imports, or standard-page-shell adoption.

## Shared Primitive Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs#topNavigationLinkControlPrimitiveContract` |
| Render seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs#renderTopNavigationLinkControlPrimitive` |
| Controller seam | `src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs#attachTopNavigationLinkControlPrimitiveController` |
| Supported systems | `default` |
| Supported themes | `original`, `dark`, `desert` |
| Supported kinds | `destination`, `menu-link` |
| Required tokens | `top-navigation-frame`, `label-text-style`, `focus-ring`, `minimum-target-size` |
| Required primitive dependency | `truncating-label` |
| Required native element | `<a>` |
| Current semantics | Current destinations must emit `aria-current="page"` and use the signed current-destination frame variant. |

## Behavior Coverage

- Covers destination links from `TRP-002`, active/current destination state from
  `TRP-003`, and top-navigation menu link rows needed by `TRP-013`.
- Covers lock expectations that destination controls remain native,
  keyboard-reachable, visibly focused, and not color-only for current state.
- Defers brand mark anatomy from `TRP-001`, menu-trigger behavior from
  `TRP-004`, profile-trigger behavior from `TRP-005`, mobile overflow from
  `TRP-007`, and composition states from `TRP-009` through `TRP-015B`.

## Consumer Rules

- Consumers must use this primitive for governed top-navigation destination and
  menu links.
- Consumers must not recreate destination anchor markup, current semantics,
  target sizing, focus treatment, truncation, or token values locally.
- Consumers must pass a non-empty `href`; route policy and authorization are
  outside this primitive.
- Consumers must not nest another focusable control inside this primitive.
- Consumers must not use this primitive for menu triggers, profile triggers,
  brand mark anatomy, overflow measurement, mobile collapse, component seams, or
  app adoption.

## Lower-Layer Reuse Audit

- Reuses `top-navigation-frame` for destination and current-destination frame
  values.
- Reuses `label-text-style`, `focus-ring`, and `minimum-target-size`.
- Reuses `truncating-label` in non-focusable mode for visible long-label
  pressure.
- Does not reuse `text-action-button-control` or `icon-button-control` because
  destination and menu links must remain native anchors.
- Does not reuse `menu-simple-select-control`, dropdown tokens, or index-nav
  tokens because the behavior lock scopes this family to top navigation rather
  than select/listbox or index navigation behavior.

## Review Dimensions

- Rendered output must contain one native anchor per item.
- Current state must be programmatic via `aria-current="page"`.
- Focus must use the signed focus-ring token.
- Target size must preserve the signed interactive minimum.
- Long labels must use the signed truncating-label primitive without adding a
  second focus target.
- Proof must not imply that this primitive owns overflow menus, profile menus,
  mobile collapse, or standard-page-shell composition.
