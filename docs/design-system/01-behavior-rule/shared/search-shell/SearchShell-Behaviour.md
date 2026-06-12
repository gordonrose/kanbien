# Search Shell Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `search-shell` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Behavior lock | `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md` |
| Reference pack | `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/search-shell/SearchShell-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person searching within the current page, workspace, or documentation scope from secondary shell chrome. |
| Normal job | The user can understand the search scope, enter a query, submit search intent, and keep using surrounding wayfinding while search remains stable. |
| Success outcome | Search remains centered and bounded in desktop/tablet sub-navigation, fills available width at the approved mobile fallback, and does not destabilize breadcrumb or row geometry. |
| Non-goals | This rule does not govern breadcrumb behavior, search result rendering, backend search, token values, primitive markup, component APIs, app adoption, route query state, or persistence. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Search remains a centered, width-bounded secondary affordance in normal desktop and tablet rows. | `01-behavior-rule` | `SS-000`; `SSR-001`, `SSR-003` | No 41 search-shell behavior artifact existed before this file. | Recorded as the core search-shell role. |
| The native input fills the bounded shell. | `01-behavior-rule` | `SS-001`; `SSR-001` | Existing `search-field-control` owns the native input primitive. | Recorded as shell behavior; input primitive remains reused. |
| Empty state communicates search scope. | `01-behavior-rule` | `SS-002`; `SSR-001`, `SSR-008` through `SSR-011` | Later component seams must supply real scope copy. | Recorded as visible scope guidance behavior. |
| Focus is visible without row geometry shift. | `01-behavior-rule` | `SS-003`; `SSR-002` | Later primitives must consume focus tokens. | Recorded as focus behavior. |
| Placeholder and any execution hint yield under width pressure. | `01-behavior-rule` | `SS-004`, `SS-004A`; `SSR-007` | Later primitives must own hint visibility and input coexistence. | Recorded as narrow-width priority behavior. |
| Mobile fallback is owned by the shared row and makes search full width. | `01-behavior-rule` | `SS-005`, `SS-005A`; `SSR-004` | Parent sub-navigation pattern owns the breakpoint. | Recorded as mobile full-width behavior. |
| RTL, themes, accent inheritance, tooltip needs, keyboard reachability, focus, contrast, and semantic search expectations are required review dimensions. | `01-behavior-rule` | `SS-006` through `SS-010`; `SSR-005`, `SSR-006`, `SSR-012` | Later layers must prove rendered outcomes. | Recorded as mandatory review dimensions. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| desktop empty | Search is centered, bounded, and shows visible scope guidance. |
| desktop active | Search focus is visible and any Enter hint appears without shifting geometry. |
| compressed row | Search remains bounded and readable while breadcrumb yields. |
| mobile full-width | Search occupies the available sub-navigation width and custom hints do not compete with input content. |
| RTL | Search mirrors naturally while preserving centered bounded behavior. |
| localized placeholder pressure | Long Latin, RTL, CJK, and symbol-heavy scope guidance yields without breaking the row. |
| themed | Approved themes alter surfaces and focus/readability without changing behavior. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| focus search | Focus remains visible and row geometry does not shift. |
| enter text | Text entry remains native and readable inside the shell. |
| submit search | Search intent is emitted to the owning consumer without this family owning result rendering or persistence. |
| clear search | Native search input behavior remains available where the browser provides it. |
| switch responsive mode | Search moves to full-width mobile only through the parent row fallback. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | The search input and submit path must be keyboard usable. |
| Focus | Search focus must remain visible without layout shift. |
| Names and semantics | The search purpose and scope must be understandable through label, placeholder, or equivalent visible guidance. |
| Status communication | Loading, result, empty, or error states must be communicated when later result behavior enters scope. |
| Color-independent meaning | Focus, active, and future error/status meaning must not rely on color alone. |

## Consumer Restrictions

Consumers must not recreate the native input semantics, shell hint behavior,
bounded secondary role, mobile full-width fallback, or app-local CSS to
approximate this family.

Consumers must not treat the 40 behavior lock, reference pack, screenshots, or
route-local markup as construction APIs.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed after token inventory confirms existing token coverage` |
| Reason | The search-shell behavior is promoted and can compose the existing governed `search-field-control` primitive instead of inventing native input behavior. |
