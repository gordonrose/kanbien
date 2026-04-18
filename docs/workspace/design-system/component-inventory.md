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

| Family | Public parent | Artifact | Current status | Signed-off scope | Next gate to clear | First adoption target |
| --- | --- | --- | --- | --- | --- | --- |
| `top-nav` | `components` | Brand lockup and desktop top navigation shell | `adopted` | `/design-system` desktop shell plus the `/root-admin` POC authenticated shell | App-vs-reference parity review and follow-up extraction of a shared seam if the second consumer confirms the API | Root admin shell header |
| `top-nav` | `components` | Primary navigation overflow behavior | `adopted` | `/design-system` responsive header plus the `/root-admin` POC authenticated shell | App-vs-reference parity review at root-admin widths and long-label states | Root admin shell header |
| `menu` | `components` | Desktop profile menu | `adopted` | `/design-system` top-nav profile affordance plus `/root-admin` account menu | Broaden parity checks and document persistence expectations before a second consumer | Root admin shell account menu |
| `dialog` | `components` | Language selector modal | `adopted` | `/design-system` profile preference interaction plus `/root-admin` language selector POC | Add persistence and richer accessibility requirements before wider reuse | Root admin shell account preferences |
| `selection-list` | `components` | Language option list | `adopted` | `/design-system` language selection flow plus `/root-admin` language selector POC | Confirm persistence contract and second-consumer semantics before shared preference rollout | Shared preference selectors |
| `top-nav` | `components` | Mobile primary navigation and mobile profile submenu | `adopted` | `/design-system` narrow-width header plus the `/root-admin` POC authenticated shell | App-vs-reference parity review for mobile and overflow thresholds | Root admin shell mobile header |
| `sub-nav` | `patterns` | Breadcrumb and search shared secondary row composition | `adopted` | `/design-system` page search and breadcrumb row plus `rootAdminShell` page chrome | Draft component artifact now exists; next higher-confidence gate is second-consumer validation before shared code extraction | Root admin shell page chrome |
| `breadcrumb` | `patterns` | Breadcrumb row with collapse and compact modes | `adopted` | `/design-system` sub-nav breadcrumb plus `rootAdminShell` page chrome | Add real-content long-label parity states and confirm tooltip/truncation behavior inside the real consumer | Root admin shell page chrome |
| `search-shell` | `patterns` | Header search input shell | `adopted` | `/design-system` sub-nav search plus `rootAdminShell` page chrome | Validate a second governed consumer in the shared application header and broaden app-vs-reference parity checks | Root admin shell page chrome |
| `context-nav` | `patterns` | Vertical context rail and bottom-nav responsive conversion | `system-ready` | Signed-off `CNR-001` through `CNR-010` canonical set on `/design-system` | First-consumer parity review in `rootAdminShell` against the signed-off `CNR-*` states | Root admin shell section navigation |
| `page-template` | `templates` | Reusable page-shape catalog for list, content, table, builder, and form surfaces | `signed-off` | Signed-off `List Page` parent-template chain on `/design-system/templates/list-page`, plus the newly codified `Form Template` parent baseline on `/design-system/templates/form` | Turn the `Form Template` reference states into canonicals and prove a second governed page-template consumer before promotion beyond signed-off parent page shapes | Shared app page families |
| `choice-group` | `components` | Grouped radio/checkbox fieldset seam extracted from the `Form Template` parent in exploratory form | `exploratory` | Parent-hosted grouped-choice variants on `/design-system/templates/form` plus the user-approved exploratory child chain at `/design-system/canonicals/choice-group` and `/design-system/components/choice-group` | Decide whether the remaining focus/disabled-combined states stay parent-owned or move onto the child surface before any promotion beyond exploratory | Future configuration and acknowledgement forms |
| `time-picker` | `components` | Quick hour/minute picker extracted from the `Form Template` parent | `signed-off` | Signed-off `TPR-*` launcher and dedicated render states on `/design-system/canonicals/time-picker` and `/design-system/components/time-picker`, plus parent-hosted proof on `/design-system/templates/form` | Add explicit close-button proof and prove a second governed consumer before promotion to `system-ready` | Future scheduling and range-with-time child seams |
| `list-record-card` | `components` | Selectable summary card extracted from the `List Page` parent template | `signed-off` | Signed-off `LRC-*` canonical set on `/design-system/canonicals/list-record-card` and the repeated card anatomy proven through `/design-system/templates/list-page` | Complete the focus-visible verification follow-up and prove a second governed consumer before promotion to `system-ready` | Future list-style page families |
| `list-detail-panel` | `components` | Open detail surface extracted from the `List Page` parent template | `signed-off` | Signed-off `LDP-*` canonical set on `/design-system/canonicals/list-detail-panel` and the open detail anatomy proven through `/design-system/templates/list-page` | Prove a second governed consumer before promotion to `system-ready` | Future list-style page families |
| `list-detail-split-layout` | `components` | Master-detail lane relationship extracted from the `List Page` parent template | `signed-off` | Signed-off `LDSL-*` canonical set on `/design-system/canonicals/list-detail-split-layout` and the split shell proven through `/design-system/templates/list-page` | Prove a second governed consumer before promotion to `system-ready` | Future list-style page families |
| `menu` | `patterns` | Context-nav mobile More menu | `signed-off` | `/design-system` bottom-nav overflow affordance | Context-nav exploration/canonical extraction plus browser-reviewed layering and mobile interaction verification | Root admin shell mobile overflow menu |
| `drawer` | `patterns` | Filter category drawer | `signed-off` | `/design-system` filter panel | Fold filter-specific evidence into the dedicated drawer pattern and verification chain before first real consumer adoption | Shared collection filter panel |
| `selection-list` | `patterns` | Filter options secondary panel and searchable option list | `signed-off` | `/design-system` filter options flow | Pattern note plus search/no-results/selection-state verification | Shared collection filtering |
| `drawer` | `patterns` | Context-nav drawer shell | `signed-off` | `/design-system` signed-off `CDR-*` chassis states and inherited first-consumer drawer path | Prove a second real drawer consumer before shared primitive extraction | Shell-attached utility drawers |
| `display-settings` | `patterns` | Display settings payload controls | `exploratory` | `/design-system` display settings review payload inside the signed-off context-nav drawer | Complete the payload-specific behavior lock, reference pack, canonicals, verification chain, and app subset sign-off | User preferences surfaces |

## Recommended Promotion Order

1. `top-nav` family
2. `sub-nav`, `breadcrumb`, and `search-shell`
3. `context-nav` family
4. `drawer` family
5. `dialog` and `selection-list` family
6. `display-settings`

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
- `sub-nav-row-pattern.md`
- `breadcrumb-pattern.md`
- `search-shell-pattern.md`
- `drawer-pattern.md`
- `display-settings-pattern.md`
- `dialog-selection-pattern.md`

## Review Cadence

- update this inventory whenever a sign-off changes status
- move artifacts back to `needs-review` when rendered drift appears
- do not mark an artifact `adopted` without naming the consuming application surface
