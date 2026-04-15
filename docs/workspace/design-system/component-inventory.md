# Design System Component Inventory

## Purpose

Track the current `/design-system` surfaces that have been explored and, where
applicable, signed off.

This inventory is the promotion ledger for moving from design-system proof to
governed app adoption.

## Status Legend

- `exploratory`: implemented on `/design-system`, still iterating
- `signed-off`: accepted on `/design-system` by the user
- `system-ready`: documented and verified enough to begin app adoption
- `adopted`: in real app use through an intentional seam
- `needs-review`: drift, regression, or missing-state risk blocks promotion

## Assumption For Initial Population

This initial pass assumes the current `/design-system` components that the user
has already approved should be treated as `signed-off` for the demonstrated
surface unless a later review moves them back to `needs-review`.

## Inventory

| Family | Artifact | Current status | Signed-off scope | Next gate to clear | First adoption target |
| --- | --- | --- | --- | --- | --- |
| `top-nav` | Brand lockup and desktop top navigation shell | `signed-off` | `/design-system` desktop shell plus fully captured canonical `top-nav` state set | Extract the first governed shell seam using approved base-token reuse and local geometry | Root admin shell header |
| `top-nav` | Primary navigation overflow behavior | `signed-off` | `/design-system` responsive header plus fully captured canonical `top-nav` state set | Extract the first governed shell seam using approved base-token reuse and local geometry | Root admin shell header |
| `menu` | Desktop profile menu | `signed-off` | `/design-system` top-nav profile affordance | Family-level rendered verification and utility-slot extraction | Root admin shell account menu |
| `dialog` | Language selector modal | `signed-off` | `/design-system` profile preference interaction | Pattern note plus dialog accessibility checklist | Root admin shell account preferences |
| `selection-list` | Language option list | `signed-off` | `/design-system` language selection flow | Pattern note plus selected-state and long-label verification | Shared preference selectors |
| `top-nav` | Mobile primary navigation and mobile profile submenu | `signed-off` | `/design-system` narrow-width header plus fully captured canonical `top-nav` state set | Extract the first governed shell seam using approved base-token reuse and local geometry | Root admin shell mobile header |
| `breadcrumb` | Breadcrumb row with collapse and compact modes | `signed-off` | `/design-system` sub-nav breadcrumb | Pattern note plus viewport-specific rendered checks | Root admin shell page chrome |
| `search-shell` | Header search input shell | `signed-off` | `/design-system` sub-nav search | Pattern note plus empty/focus/overflow verification | Shared application header search |
| `context-nav` | Vertical context rail and bottom-nav responsive conversion | `signed-off` | `/design-system` section navigation | Pattern note plus responsive and tooltip/label verification | Root admin shell section navigation |
| `menu` | Context-nav mobile More menu | `signed-off` | `/design-system` bottom-nav overflow affordance | Pattern note plus layering and mobile interaction verification | Root admin shell mobile overflow menu |
| `drawer` | Filter category drawer | `signed-off` | `/design-system` filter panel | Pattern note plus drawer accessibility and responsive verification | Shared collection filter panel |
| `selection-list` | Filter options secondary panel and searchable option list | `signed-off` | `/design-system` filter options flow | Pattern note plus search/no-results/selection-state verification | Shared collection filtering |
| `drawer` | Accessibility drawer shell | `signed-off` | `/design-system` accessibility panel | Pattern note plus focus-return and responsive verification | User display preferences panel |
| `accessibility-controls` | Theme, magnification, accent, and direction controls | `signed-off` | `/design-system` display settings controls | Pattern note plus state and compatibility verification | User preferences surfaces |

## Recommended Promotion Order

1. `top-nav` family
2. `breadcrumb` and `search-shell`
3. `context-nav` family
4. `drawer` family
5. `dialog` and `selection-list` family
6. `accessibility-controls`

This order favors app-shell primitives first so the real application can start
consuming stable chrome before deeper preference panels and configurators.

## Required Artifact Chain For Each Row

Before promoting any row from `signed-off` to `system-ready`, create or refresh:

1. a principle note if the rule is enduring and not already captured
2. a pattern artifact
3. a verification checklist
4. a component artifact when the implementation seam is stable enough
5. an adoption note when real app usage begins

## First Suggested Pattern Set

- `navigation-shell-pattern.md` authored
- `drawer-pattern.md`
- `dialog-selection-pattern.md`
- `accessibility-controls-pattern.md`

## Review Cadence

- update this inventory whenever a sign-off changes status
- move artifacts back to `needs-review` when rendered drift appears
- do not mark an artifact `adopted` without naming the consuming application surface
