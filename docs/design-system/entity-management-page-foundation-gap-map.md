# Entity Management Page Foundation Gap Map

## Purpose

This audit maps the current `/design-system/templates/entity_management_page`
route against the active Layer 1, Layer 2, and Layer 3 harness.

It does not promote the route to app-consumable status. It does not create a
new token, primitive, pattern, component seam, demo, canonical, or app adoption
contract.

## Current Route Truth

| Area | Current source |
| --- | --- |
| Route | `src/frontend/designSystem/templates/entity_management_page/index.html` |
| Template mount | `src/frontend/designSystem/assets/recordManagementListCentricTemplate.mjs` |
| Entity page render and behavior source | `src/frontend/designSystem/assets/entityManagementPage.mjs` |
| Canonical support source | `src/frontend/designSystem/assets/entityManagementPageCanonical.mjs` |
| Current route smoke coverage | `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts` |
| Current canonical coverage | `tests/visual/designSystem/canonicals/data-display/entityManagementPageCanonical.spec.ts` |

The route imports shared CSS directly from `styles.css`,
`list-page-shared.css`, `conversationPanel.css`, and
`chatWorkspacePattern.css`.

The route mounts the record-management template through
`data-record-management-list-centric-mount` while also setting
`data-record-management-entity-page-template`.

## Current Governed Seams

| Layer | Governed seam currently available | Relevance |
| --- | --- | --- |
| `01-behavior-rule` | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` | General color governance only; not an entity-management-page behavior rule. |
| `02-token` | `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` | Only signed token seam currently consumable by later layers. |
| `03-primitive` | `src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs#surfaceFoundationPrimitive` | Only consumable primitive; non-interactive surface spec helper only. |

No current Layer 1/2/3 artifact makes `entity_management_page` app-consumable.

## Historical Evidence, Not Current Harness Truth

Older workspace artifacts already describe the page in useful slices:

| Historical artifact | Useful signal |
| --- | --- |
| `docs/workspace/design-system/behavior-locks/entity-management-page-behavior-lock-index.md` | Names six review slices: outer page, navigation, detail panel, collection item, evidence/AI, and performance. |
| `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md` | Names 216 review-candidate child states and high-risk roll-up states. |
| `docs/workspace/design-system/verification/entity-management-page-verification-checklist.md` | Lists route-level rendered verification expectations. |
| `docs/workspace/design-system/verification/entity-management-page-wcag-2-2-aa-checklist.md` | Lists unresolved WCAG evidence, especially keyboard, focus, target size, contrast, reflow, and status messaging. |
| `docs/workspace/design-system/adoption/entity-management-page-shared-seam-adoption-contract.md` | Earlier adoption framing, not current Layer 5 or app-adoption approval. |

These artifacts are inputs for migration into the new harness. They are not
construction APIs and are not signed Layer 1/2/3 artifacts by themselves.

## Repeated UI Families Observed

| Observed family | Current evidence | New-harness status |
| --- | --- | --- |
| Page shell and context navigation | Route-local top nav, sub-nav, context nav, display drawer, and main mount in `index.html`. | Existing older seams may exist, but no current Layer 1/2/3 entity-page shell chain. |
| Display settings drawer | Theme, direction, magnification, drawer view, and edit-field controls in `index.html`. | Needs behavior-rule migration before token or primitive claims. |
| Region navigation | `data-record-management-region-trigger`, `data-record-management-region-panel`, and older navigation behavior locks. | Needs Layer 1 shared behavior before Layer 2/3 work. |
| Nested list and resizer | Frequent `data-record-management-nested-list`, `data-record-management-nested-trigger`, and `data-record-management-nested-panel` usage. | Needs behavior and accessibility contracts, especially keyboard and target-size rules. |
| Form fields | Repeated `form-field`, `form-field-label`, `form-field-help`, inputs, selects, drawer-selects, date controls, toggles, and generated validation rows. | Needs multiple interactive primitives; blocked by missing focus, text, border, sizing, state, and target-size tokens. |
| Icon buttons and action buttons | Close, edit, evidence, AI, add, remove, move, copy, destructive, bulk select, and display controls. | Needs icon-button/button primitive contracts; blocked by missing interactive tokens. |
| Status badges and state chips | `record-management-status-badge`, selected chips, active rows, hidden/disabled/error-like states. | Needs semantic/state token work before primitive or pattern readiness. |
| Evidence and AI drawers | `data-record-management-evidence-*` and `data-record-management-ai-*` controls and overlays. | Needs behavior-rule migration before primitives and patterns; accessibility focus/return is high risk. |
| Generated model panels | Workflow, catalog, placement, permissions, action model, migration, generation, compliance, and validation panels. | Pattern/component territory after lower layers exist; not Layer 3. |
| Lazy rendering and performance | Historical performance behavior lock and canonical states. | Later verification concern; should not drive token or primitive shape directly. |

## Missing Layer 1 Work

The earliest missing foundation is Layer 1.

The current route is too large to promote as one behavior rule. The old
behavior-lock index already gives the right split shape, and the new harness
should migrate or rewrite it into shared behavior-rule artifacts in this order:

| Proposed Layer 1 family | Reason |
| --- | --- |
| `entity-management-page-outer-page` | Owns shell framing, scroll ownership, route mount, and page-level display controls. |
| `entity-management-page-navigation` | Owns region navigation, nested list behavior, active state, carousel/resizer behavior, and mobile region selection. |
| `entity-management-page-detail-panel` | Owns generated form panels, section disclosure, derived fields, and edit posture at the behavior level. |
| `entity-management-page-collection-item` | Owns add/copy/delete/move/card-sync behavior for repeated items. |
| `entity-management-page-evidence-ai` | Owns evidence/AI modes, mutual exclusion, target affordances, focus return, and overlay/split behavior. |
| `entity-management-page-performance` | Owns lazy rendering, render-ready signal, DOM/control budget, and fixture/module boundary expectations. |

Layer 2 token work for this page should not be called review-ready until the
relevant Layer 1 behavior rule names the token need.

## Missing Layer 2 Token Seams

Only `background-color` is currently consumable. The page visibly needs more
token seams before interactive primitives can be honest:

| Token need | Why it matters for this page |
| --- | --- |
| `focus-ring` | Keyboard review, visible focus, focus return, drawers, menus, region navigation, date pickers, icon buttons, and generated controls all depend on it. |
| `minimum-target-size` | Icon buttons, chips, carousel cards, date cells, nested-list controls, move/remove buttons, and display drawer controls need a governed hit-area rule. |
| `text-color` | Normal, dark, desert, disabled, helper, inverse, warning/error/success, and low-emphasis text need signed pairings. |
| `border-color` and `outline` | Field boundaries, selected states, focus-adjacent surfaces, drawers, nested panels, and non-text contrast need signed rules. |
| `spacing`, `padding`, `gap`, and `sizing` | Dense form fields, repeated cards, drawer panels, nested lists, and responsive scroll regions need stable dimensions before pattern work. |
| `semantic-color` plus state tokens | Error, warning, success, selected, active, disabled, loading, readonly, evidence, AI, and destructive states must not be invented locally. |
| `font-size`, `line-height`, and `font-weight` | Generated labels, helper text, badges, dense panels, and zoom/text-spacing proof need stable typography tokens. |
| `z-index-layering` | Drawers, date menus, evidence/AI overlays, context nav, sticky/fixed shell chrome, and tooltip/menu layering need governed ordering. |

Recommended first Layer 2 token slice after the matching Layer 1 behavior rule:
`focus-ring`.

`focus-ring` should come first because it gates keyboard-visible truth across
nearly every interactive family on the page. `minimum-target-size` should
follow closely because the page is dense and icon-heavy.

## Candidate Layer 3 Primitives

These are candidates only. They remain blocked until the required signed Layer
2 token seams exist.

| Candidate primitive | Likely blockers |
| --- | --- |
| `button` | focus ring, text color, target size, padding, border, disabled, hover, active, loading, semantic state tokens. |
| `icon-button` | focus ring, icon size, target size, text/icon color, border/outline, disabled, selected/pressed state tokens. |
| `field-row` | text color, spacing, sizing, border, helper/error text, focus, disabled/readonly state tokens. |
| `select-trigger` / `drawer-select-trigger` | focus ring, target size, text color, border, z-index, expanded/selected/disabled state tokens. |
| `checkbox` / `switch` | focus ring, target size, state colors, disabled/read-only semantics, label text tokens. |
| `tab/region trigger` | focus ring, selected state, target size, text color, border/indicator tokens. |
| `status badge` | semantic color, text color, border/background pairings, color-independent meaning rules. |
| `surface foundation` | Already exists only as a non-interactive background spec helper for `default`. |

## Route-Local Or Legacy Construction Risks

| Risk | Why it matters |
| --- | --- |
| Route imports shared CSS directly. | CSS sharing alone is not governed adoption under the new harness. |
| `entityManagementPage.mjs` is very large and mixes render helpers, controller behavior, fixture-derived options, generated form logic, and evidence/AI drawers. | Later layers cannot treat this as one primitive or one component seam. |
| `recordManagementListCentricTemplate.mjs` mounts the entity page through a record-management/chat-workspace adapter. | The active route works, but the durable entity-page construction API is not yet isolated. |
| Historical workspace behavior locks and reference packs are not current Layer 1/2/3 artifacts. | They help migration, but they cannot be used as construction APIs. |
| Canonical and route coverage exists before the new lower layers are signed. | Rendered evidence is useful, but it does not replace Layer 1/2/3 readiness. |

## Suggested Next Sequence

1. Create a Layer 1 shared behavior rule for `entity-management-page-outer-page`
   using the historical outer-page behavior lock as input.
2. From that Layer 1 rule, create the first Layer 2 token artifact for
   `focus-ring` if the behavior rule confirms visible focus as the first
   reusable token dependency.
3. Add a `default` system proof for that `focus-ring` token and expose it
   through `src/frontend/designSystem/layers/02-token/`.
4. Only then evaluate the first interactive Layer 3 primitive, likely
   `icon-button` or `button`, depending on which behavior rule slice is being
   unblocked.
5. Keep `entity_management_page` as a route-local review surface until Layer 4
   and later harnesses are active.

## Audit Evidence

| Evidence | Result |
| --- | --- |
| Git preflight | `npm run git:preflight` reported `SAFE` on branch `layer3-primitive-harness`. |
| Source size check | `entityManagementPage.mjs` has 7768 lines, `recordManagementListCentricTemplate.mjs` has 1379 lines, and the canonical helper has 1129 lines. |
| Data-attribute inventory | Frequent families include nested panels/triggers/lists, drawer selects, workflow builders, region panels, evidence/AI toggles, date pickers, and generated validation/action controls. |
| Class inventory | Frequent families include form fields, entity-management panels, record-management lists, evidence cards, workflow actions, status badges, floating tabs, and chat workspace drawers. |
| Current visual route check | `npx playwright test tests/visual/designSystem/templates/recordManagementListCentric.spec.ts --config=playwright.config.ts` passed 8 of 9 tests. The failing existing test was `record management entity page skeleton reuses the detail drawer as the page body`; its geometry predicate returned `null` after opening the `owning-feature` nested panel. This supports the conclusion that the route is still a review surface with unresolved shell/detail-panel evidence, not a promoted governed seam. |
