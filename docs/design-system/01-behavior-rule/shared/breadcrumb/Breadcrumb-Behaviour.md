# Breadcrumb Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared across design systems` |
| UI family | `breadcrumb` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Behavior lock | `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md` |
| Reference pack | `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/breadcrumb/Breadcrumb-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person using page hierarchy to understand where they are and recover parent context. |
| Normal job | The user can identify the current page, follow real parent links, and recover hidden path steps when width pressure reduces the visible trail. |
| Success outcome | The breadcrumb remains honest to the real hierarchy, keeps the current page visible or recoverable, and reduces without wrapping, overlap, invented hierarchy, or inaccessible hidden context. |
| Non-goals | This rule does not govern sub-navigation row layout, search behavior, token values, primitive markup, component APIs, route generation, app adoption, or persistence. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Source Decomposition

| Observed Source Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Behavior Rule Outcome |
| --- | --- | --- | --- | --- |
| Current page remains present even when earlier path steps are reduced. | `01-behavior-rule` | `BC-000`; `BCR-001`, `BCR-005` | No 41 breadcrumb behavior artifact existed before this file. | Recorded as the core orientation rule. |
| Optional path depth must be real; placeholders and filler hierarchy are forbidden. | `01-behavior-rule` | `BC-000A` through `BC-000C`; `BCR-002` | Later component seams must receive real hierarchy data. | Recorded as hierarchy honesty behavior. |
| Breadcrumb reduces progressively without wrapping. | `01-behavior-rule` | `BC-001` through `BC-004`; `BCR-003`, `BCR-004`, `BCR-005` | Later primitive/pattern layers must own mechanics and proof. | Recorded as the approved reduction order. |
| Hidden path steps remain recoverable through lightweight reveal surfaces. | `01-behavior-rule` | `BC-005` through `BC-007`; `BCR-005`, `BCR-010` | Later primitives must own trigger/menu semantics, dismissal, and focus return. | Recorded as reveal and dismissal behavior. |
| Long labels do not wrap and may need governed tooltip disclosure. | `01-behavior-rule` | `BC-008`, `BC-008A`, `BC-008C`; `BCR-007`, `BCR-011`, `BCR-012` | Later primitives must consume `truncating-label` or another accepted disclosure seam. | Recorded as long-label behavior; styling deferred. |
| Breadcrumb is absent at the approved mobile sub-navigation fallback. | `01-behavior-rule` | `BC-008B`; `BCR-008` | Parent sub-navigation pattern owns when the mobile fallback applies. | Recorded as mobile absence behavior. |
| RTL, theme, accent inheritance, keyboard reachability, focus, contrast, and readable controls are required review dimensions. | `01-behavior-rule` | `BC-009` through `BC-012`; `BCR-006`, `BCR-009`, `BCR-010` | Later layers must prove rendered outcomes. | Recorded as mandatory review dimensions. |

## Behavior States

| State | Observable Behavior |
| --- | --- |
| full trail | Real path steps and the current page are visible in order. |
| shallow home | A shallow page shows only its real home/current item and no invented intermediate trail. |
| reduced page-minus-one | The nearest previous page step may be hidden before the collapsed middle segment disappears. |
| reduced middle | The collapsed middle segment may be hidden after the page-minus-one step has yielded. |
| compact signpost | The full trail fully disappears and a compact trigger exposes recoverable path context. |
| mobile absent | Breadcrumb is not rendered in the approved mobile sub-navigation fallback. |
| RTL | Ordering, separators, compact affordances, and reveal anchoring feel native in RTL. |
| long-label pressure | Labels truncate or reduce through approved behavior rather than wrapping or forcing overflow. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| follow breadcrumb link | Native link navigation remains available for visible real parent steps. |
| identify current page | The current page is visible or recoverable and uses current-page semantics in later layers. |
| reveal hidden path | Hidden steps become reachable through an anchored lightweight surface. |
| dismiss hidden path | Outside click and `Escape` close the reveal surface and restore focus to the trigger in later layers. |
| switch responsive mode | The breadcrumb follows the approved reduction order before mobile absence. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in
`../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Breadcrumb links and reveal triggers must be keyboard reachable when present. |
| Focus | Reveal dismissal must preserve predictable focus return. |
| Names and semantics | Real parent links, current page, hidden path reveal, and mobile absence must be understandable in later layers. |
| Color-independent meaning | Current page, focus, open state, and hidden path availability must not rely on color alone. |
| Long text | Truncated labels must preserve full meaning through a governed disclosure seam. |

## Consumer Restrictions

Consumers must not invent breadcrumb hierarchy, placeholder path steps, local
collapse order, local tooltip behavior, local controller behavior, or app-local
CSS to approximate this family.

Consumers must not treat the 40 behavior lock, reference pack, screenshots, or
route-local markup as construction APIs.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed after token inventory confirms existing token coverage` |
| Reason | The breadcrumb-specific behavior is promoted; later work must consume existing governed token and disclosure seams or stop at Layer 2 if a reusable value is missing. |
