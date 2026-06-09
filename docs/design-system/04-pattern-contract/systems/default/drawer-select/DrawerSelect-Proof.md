# Drawer Select Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Pattern | `drawer-select` |
| Design system | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/drawer-select/DrawerSelect-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/drawer-select/index.mjs#drawerSelectPattern` |
| Rendered proof | `/design-system/default/patterns/drawer-select` |

## System Proof

The default proof composes the review-ready `count-card-control`,
`icon-button-control`, `panel-header-control`, `text-action-button-control`,
`panel-stack`, and `searchable-selection-panel` seams.

The proof consumes the signed `drawer-overlay-placement` token directly for
open page-shell overlay placement. `panel-stack` still owns internal panel
order inside that overlay.

The proof route lets reviewers change mode, open state, placement side,
viewport posture, query, theme, and action-bar presence. It also lets reviewers
select options, apply pending changes, cancel pending changes, and close the
drawer without committing.

When open, the proof must show the drawer as a page-shell overlay with a fixed
panel header at the top of the drawer surface, a natural-height searchable
selection body, and an action footer pinned to the bottom of the drawer
surface. If the option content is short, empty space belongs between the body
and the footer; the search input, option groups, and feedback states must not
stretch vertically to fill the drawer.

## Evidence Expectations

Rendered review must show:

- the trigger summary updates only after Apply
- Cancel and Close preserve the committed selection
- single select replaces pending selection
- multi select toggles pending selection
- search/no-match behavior remains owned by `searchable-selection-panel`
- internal drawer stacking remains owned by `panel-stack`
- open page-shell overlay placement remains owned by
  `drawer-overlay-placement`
- action buttons remain governed primitives
- dark and desert themes apply to trigger, drawer body, actions, search, and
  option rows through upstream seams
- keyboard selection exposes the governed option-selection instruction
- drawer overlay covers the page-shell content region without horizontal overflow
- drawer header stays at the top of the drawer surface
- drawer action footer stays at the bottom of the drawer surface
- short drawer content keeps natural height and leaves remaining vertical space
  before the footer
