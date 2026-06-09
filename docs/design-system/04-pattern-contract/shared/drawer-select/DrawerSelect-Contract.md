# Drawer Select Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Pattern | `drawer-select` |
| Harness layer | `04-pattern-contract` |
| Status | `review-ready` |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md` |
| Shared contract path | `docs/design-system/04-pattern-contract/shared/drawer-select/DrawerSelect-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/drawer-select/DrawerSelect-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/drawer-select/index.mjs#drawerSelectPattern` |
| Rendered proof | `/design-system/default/patterns/drawer-select` |

## Responsibility

`drawer-select` composes a governed trigger, panel stack, searchable selection
panel, close action, and optional apply/cancel actions into one reusable
selection-drawer pattern.

It owns open/closed state, committed-versus-pending selection state, apply
behavior, cancel/close-without-apply behavior, and focus-return intent.

It does not own option filtering, option-card behavior, side-panel internal
stacking, count-card visuals, button visuals, persistence, backend search,
routing, component APIs, demo pages, canonical scenarios, or app adoption.

## Required Upstream Gates

| Dependency | Layer | Status Needed | Role |
| --- | --- | --- | --- |
| `drawer-select` behavior rule | `01-behavior-rule` | `review-ready` | Defines stable family behavior. |
| `count-card-control` | `03-primitive` | `review-ready` | Closed trigger summary. |
| `icon-button-control` | `03-primitive` | `review-ready` | Drawer close action. |
| `text-action-button-control` | `03-primitive` | `review-ready` | Apply and cancel actions. |
| `drawer-overlay-placement` | `02-token` | `review-ready` | Open page-shell overlay placement above the surrounding page/proof content underlay. |
| `panel-stack` | `04-pattern-contract` | `review-ready` | Side placement and internal mobile panel overlay. |
| `searchable-selection-panel` | `04-pattern-contract` | `review-ready` | Search, selected/available groups, option selection, feedback states, and scroll ownership. |

## Behavior Contract

The pattern exposes these states:

- `closed`: only the trigger is visible, and it summarizes committed values.
- `open`: the drawer is visible and edits pending values.
- `pending unchanged`: pending values match committed values.
- `pending changed`: pending values differ from committed values.
- `single`: choosing an enabled option replaces the pending selection.
- `multi`: choosing an enabled option toggles the pending selection.
- `disabled`: the trigger cannot open the drawer.

Apply commits the pending selection and closes the drawer.

Cancel, Close, and Escape discard pending changes and close the drawer.

Opening the drawer must move focus into the drawer surface, preferring the
search field when it is present. Focus must not remain on the closed trigger
behind the page-shell overlay.

After option selection inside an open drawer, focus remains on the acted option
unless the drawer closes. Closing the drawer must not strand focus inside a
removed drawer surface; consumers should return focus to the trigger or another
governed continuation target.

When open, the drawer consumes `drawer-overlay-placement` and covers the
surrounding page/proof content underlay inside the page shell.
`panel-stack` still owns panel order inside that overlay.

The open drawer layout has three vertical regions:

- the panel header anchors to the top of the drawer surface
- the searchable selection body keeps its natural rendered height and delegates
  internal overflow to `searchable-selection-panel` and `scroll-region-control`
- the action footer anchors to the bottom of the drawer surface when actions
  are shown

Short body content must leave whitespace between the body and footer rather
than stretching search fields, option groups, or feedback states to fill the
drawer height.

## Accessibility Contract

- The trigger is a native button through `count-card-control`.
- The drawer is hosted by `panel-stack`; covered mobile panels must not trap
  focus.
- The open drawer uses signed page-shell overlay placement and must keep
  close, Escape, keyboard selection, and action controls reachable.
- Opening the drawer moves keyboard focus to the drawer's first meaningful
  control, preferring search when search is present.
- The close action is a governed icon-only button with an accessible name.
- Apply and Cancel are governed native text buttons.
- Search and options remain owned by `searchable-selection-panel`.
- The committed summary, pending selection, loading, no-match, empty, error,
  disabled, and changed states must not rely on color alone.
- Any truncated trigger, option, feedback, or action text must use the
  upstream governed overflow-disclosure behavior.

## Consumer Restrictions

Consumers must not recreate drawer-select trigger markup, panel-stack posture,
searchable list behavior, action-button behavior, focus behavior, or
committed-versus-pending state locally.

Consumers must not copy proof-route markup into apps.

Consumers must not treat this pattern as a component seam or app adoption seam.

## Completion Gate

The pattern is review-ready only when the default proof demonstrates:

- closed and open states
- single and multi modes
- apply and cancel/close discard behavior
- right and left side placement
- desktop and mobile panel-stack posture
- page-shell overlay coverage while open
- header anchored to the top of the drawer surface
- action footer anchored to the bottom of the drawer surface
- natural-height middle content that does not stretch controls to fill short
  drawers
- theme variants
- query/no-match behavior
- keyboard option selection
- no horizontal overflow at constrained width
