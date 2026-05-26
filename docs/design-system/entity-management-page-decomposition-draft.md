# Entity Management Page Decomposition Draft

## Purpose

This draft translates the human page anatomy for
`/design-system/templates/entity_management_page` into the active frontend
harness vocabulary.

It is a planning and classification artifact only. It does not promote any
behavior rule, token, primitive, pattern, component seam, demo, canonical, or
app adoption.

The entity management page is an input case for building the harness, not an
alternate path around the harness. It should help identify the next behavior
rules, tokens, primitives, and patterns that need governance, but it must not
supersede the Layer 1 through Layer 10 order.

If the entity page needs a downstream surface such as index navigation, panel
regions, field rows, truncation, or embedded body placement, the page should
route that need back to the earliest missing governed layer instead of defining
the surface locally.

## Source Inputs

Primary human input:

- `1`: top navigation from `/design-system/canonicals/top-nav`
- `2`: sub-navigation and search shell from
  `/design-system/canonicals/sub-nav#search-shell-family`, composed with
  breadcrumb/search-shell evidence from `/design-system/patterns/breadcrumb`
- `3`: context navigation from `/design-system/patterns/context-nav`, with
  display settings from `/design-system/patterns/display-settings`
- `4`: entity page title header following
  `/design-system/tokens/page-header`
- `5`: primary index navigation following
  `/design-system/tokens/filter-panel-structure`
- `6`: panel title header
- `7`: secondary index navigation, same structure as the primary index
  navigation, nested under the panel title header
- `8`: panel body, currently expected to use accordion, workflow builder,
  priority select cards, and select cards that are not yet formally defined
- Entity page body also needs an embeddable version that can be nested into
  other pages or components. Structural evidence routes include
  `/design-system/tokens/nested-entity-record` and
  `/design-system/tokens/list-page-record-structure`.

Cross-cutting human input:

- Text that exceeds the space allocated by its containing component must be
  truncated and expose the full text through governed tooltip behavior.
- `/design-system/tokens#token-radio-buttons` contains a first-pass
  classification of low-level controls, but the names and layer distinctions
  need professional review.

## Translation Rule

Existing `/design-system/tokens/...`, `/design-system/patterns/...`, and
`/design-system/canonicals/...` routes are useful evidence and review surfaces.

They are not automatically active Layer 1/2/3 artifacts under the new harness.
When the draft says "follows" an existing route, it means the route should be
inspected as evidence before creating the governed artifact at the correct
layer.

## Page Shell

Items `1`, `2`, and `3` together form the page shell.

| Item | Human name | Draft harness classification | Notes |
| --- | --- | --- | --- |
| `1` | Top navigation | Shell/navigation pattern evidence | Likely not owned by `entity-management-page`; should be consumed as shell chrome after the owning shell family is governed. |
| `2` | Sub-navigation with breadcrumb and search shell | Shell/navigation pattern evidence | Combines breadcrumb, current route identity, and search. Needs clarification on whether search is page search, template search, or global design-system search. |
| `3` | Context navigation with display settings | Shell/navigation pattern evidence plus settings drawer pattern evidence | Context nav provides persistent navigation and display settings entry. Display settings must not be treated as entity-page body behavior. |

Draft boundary:

- Page shell provides framing, navigation, route identity, search access, and
  display-review controls.
- Entity page body starts after shell chrome has established the active page
  context.
- App adoption must eventually consume shell-owned seams instead of copying
  shell markup from this route.

## Entity Page Body

Items `4` through `8` form the entity page body.

| Item | Human name | Draft harness classification | Notes |
| --- | --- | --- | --- |
| `4` | Entity page title header | Page/body header pattern candidate | Should express entity type, selected entity label, status, and page-level action affordances. Existing `page-header` token route is evidence, not yet a governed pattern under the new chain. |
| `5` | Primary index navigation | Pattern candidate: `index-navigation` | Provides first-level navigation across entity-definition regions such as Identity, Workflows, Views, Relationships, Attributes, Catalogs, Display, Permissions, Generation, Compliance, Migration, and Action Models. |
| `6` | Panel title header | Primitive or small pattern candidate | Needs behavior clarification: if it only names the selected panel, it may be a heading/text primitive candidate; if it owns actions, status, help, or collapse behavior, it becomes a small pattern. |
| `7` | Secondary index navigation | Pattern candidate: nested variant of `index-navigation` | Should share structure with `5` rather than becoming a separate component. Its main distinction is nesting under the panel title header and scoping to the selected primary region. |
| `8` | Panel body | Pattern composition zone | Contains undefined child components such as accordion, workflow builder, priority select cards, and select cards. This should not be promoted as one primitive or one component seam. |

Draft boundary:

- Primary and secondary index navigation should probably be one governed
  pattern with placement or nesting variants.
- Panel body should compose smaller governed children rather than absorb them.
- The page body should not define app persistence, backend mutation semantics,
  or entity-specific authorization.

## Embeddable Entity Body Variant

The entity page body must have at least two placement modes:

| Placement mode | Meaning | Current evidence |
| --- | --- | --- |
| Full-page body | The body is the primary content of `entity_management_page`, below shell chrome. | Current route screenshot and `src/frontend/designSystem/templates/entity_management_page/index.html`. |
| Embedded body | The same entity body structure can be nested inside another page, component, drawer, record view, or related-record surface. | `/design-system/tokens/nested-entity-record`; `/design-system/tokens/list-page-record-structure`. |

Draft behavior requirement:

The embedded body variant must preserve the same entity-body behavior and
accessibility semantics while accepting a smaller host container. It may change
available space, desktop scroll ownership, and surrounding chrome. Mobile
full-page placement may scroll with the page. Placement changes must not change
the meaning of region navigation, panel headers, nested index navigation, form
fields, evidence/AI affordances, or generated model panels.

Layer classification:

| Concern | Likely owning layer | Reason |
| --- | --- | --- |
| Full-page versus embedded placement behavior | `01-behavior-rule` | Placement changes available space, surrounding chrome, and desktop/mobile scroll expectations. |
| Structural sizes, spacing, and surfaces for embedded mode | `02-token` | Embedded mode needs signed spacing, sizing, surface, border, and text rules instead of local CSS. |
| Reusable low-level controls inside both modes | `03-primitive` | Buttons, icon buttons, field rows, selectors, tabs, badges, and tooltip triggers must keep stable behavior. |
| Shared body composition across placement modes | Later pattern/component seam | The importable body seam belongs after lower layers define behavior, tokens, and primitives. |

This means the future app-consumable body should not be designed only for the
full page route. It must also be able to live inside a nested entity record or
list-page record structure without copying route-local markup.

## Cross-Cutting Text Overflow Rule

Governed behavior rule:

- `docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md`

When text exceeds the space allocated by its containing component, the visible
text must truncate without breaking layout, and the full text must remain
available through governed tooltip behavior.

Layer classification:

| Concern | Likely owning layer | Reason |
| --- | --- | --- |
| When truncation is allowed or required | `01-behavior-rule` | It changes user access to full meaning and prevents layout breakage. |
| Tooltip trigger/accessibility behavior | `03-primitive` or later pattern, after tokens | Tooltip behavior affects hover, focus, keyboard, dismissal, and accessible naming. |
| Tooltip visual values | `02-token` | Tooltip surface, text, border, shadow, z-index, spacing, and focus values must be signed tokens. |
| Component-specific truncation width | Later pattern/component seam | The containing component owns available space and layout constraints. |

This behavior must not be implemented by app-local `title` attributes alone
unless that is explicitly approved as a temporary exception.

## First-Pass Component Vocabulary

The current human names should be translated carefully:

| Human phrase | Harness meaning |
| --- | --- |
| Component | Too broad by itself; classify as primitive, pattern, component seam, or page/template. |
| Page Shell | Pattern or composition of shell-owned patterns; not entity-page-specific body content. |
| Entity Page Title Header | Likely page/body header pattern candidate. |
| Primary index nav | Pattern candidate, not a primitive. |
| Panel title header | Primitive or small pattern candidate; needs behavior details. |
| Secondary index nav | Nested variant of primary index navigation pattern. |
| Panel body | Pattern composition zone. |
| Accordion | Pattern candidate unless it is only a native disclosure primitive. |
| Workflow builder | Pattern or component seam candidate; too complex for primitive. |
| Priority select cards | Pattern or component seam candidate; likely uses select-card primitive/pattern internally. |
| Select cards | Pattern candidate, maybe primitive only if behavior is very small and generic. |
| Radio buttons | Primitive candidate if native radio behavior is preserved. |

## Initial Backwards Plan

1. Confirm the page shell boundary for items `1`, `2`, and `3`.
2. Define the first body behavior rule for `entity-management-page-outer-page`
   or equivalent, using item `4` as the body entry point and recording the
   required embedded-body variant.
3. Decide whether `index-navigation` is the first reusable body pattern to
   govern, since items `5` and `7` share structure.
4. Before pattern work, route to Layer 2 for the tokens needed by
   `index-navigation`, likely focus, text, border, spacing, target size, and
   selected/active state tokens.
5. Review `/design-system/tokens#token-radio-buttons` as an input to primitive
   vocabulary, not as signed token truth.

## Harness Backlog From Entity Page

This backlog records what the entity page reveals about the harness. It is not
a page implementation queue.

| Order | Layer | Candidate | Why it comes next |
| --- | --- | --- | --- |
| `1` | `01-behavior-rule` | `entity-body-placement` | The page needs the same entity body to work as a full-page body and as embedded content before tokens or primitives can safely target it. |
| `2` | `02-token` | Structural container, spacing, border, text, focus, overflow, and selected-state token seams | The placement rule will expose which visual values must be signed before downstream surfaces can consume them. |
| `3` | `01-behavior-rule` | `text-overflow-disclosure` | All text-based elements need truncation and full-text access behavior before text primitives can be governed. |
| `4` | `03-primitive` | Button, icon button, field row, tooltip trigger, selectable item, panel heading, and related low-level controls | These primitives should only be defined after their required signed token seams exist. |
| `5` | `04-pattern` | Index navigation, body header, panel region, truncation-with-tooltip behavior, accordion, and select-card groups | These are composed behaviors and layouts, so they should wait for the lower-layer contracts. |
| `6` | Later layers | Entity body seam, entity page template, canonical scenario, first app adoption, and parity tests | These should consume governed lower-layer seams rather than copying design-system route markup. |

The first recommended harness move is therefore the Layer 1
`entity-body-placement` behavior rule. That rule should define what remains
stable when the entity body moves between full-page and embedded hosts, and
what a host is allowed to own.

## Layer 2 Inventory For Entity Body Placement

Upstream behavior rule:

- `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md`

Current consumable Layer 2 seams:

| Token seam | Consumable status | Evidence |
| --- | --- | --- |
| `background-color` | Consumable for `default` only | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec` |
| `focus-ring` | Consumable for `default` only | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `label-text-style` | Consumable for `default` only for short-label typography | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `minimum-target-size` | Consumable for `default` only | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |
| `primary-color-source` | Consumable for `default` only | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/primary-color-source/systems/default.mjs#primaryColorSourceTokenSpec` |
| `primary-tinted-background` | Consumable for `default` only, but text-bearing use still needs approved foreground pairing | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/default.mjs#primaryTintedBackgroundTokenSpec` |
| `primary-tinted-foreground` | Consumable for `default` only for short primary text on approved primary-tinted backgrounds | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/default.mjs#primaryTintedForegroundTokenSpec` |
| `tooltip-surface` | Consumable for `default` only for full-text disclosure surface visuals | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec` |
| `tooltip-text-style` | Consumable for `default` only for full-text disclosure typography | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec` |

Needed but not yet consumable for `entity-body-placement`:

| Needed token area | Why the behavior rule reveals it |
| --- | --- |
| `focus-ring` or `outline` | Full-page and embedded bodies need visible focus movement through controls and regions. |
| `text-color` | Headings, labels, status text, and truncated text need governed contrast across placements and themes. |
| broader `text-style` variants | Body text, headings, helper text, error text, link text, and dense data text need signed typography before broader primitive or pattern work. |
| `surface` and `border-color` | Host/body boundaries and nested record containers need governed separation without route-local CSS. |
| `spacing`, `gap`, `padding`, and `sizing` | Full-page and embedded placements need stable readable structure under constrained width, zoom, and RTL. |
| `semantic-color` and state tokens | Selected, blocked, validation, loading, and error meanings need color-independent governed state support. |
| broader `z-index-layering` or overlay layering | Menus, drawers, dialogs, and non-tooltip overlays must not be clipped by embedded or scrollable hosts. |

Inventory result:

`background-color`, `focus-ring`, `label-text-style`, `minimum-target-size`,
`primary-color-source`, `primary-tinted-background`,
`primary-tinted-foreground`, `tooltip-surface`, and `tooltip-text-style` are
currently consumable by later layers for the `default` design system.

The next recommended move is now either a Layer 3 truncating-label or tooltip
trigger primitive, a selected-state token for index navigation, or structural
geometry tokens such as spacing, padding, border, and surface.
`label-text-style` gives us narrow short-label typography,
`primary-tinted-foreground` gives us a narrow readable text pairing for
primary-tinted backgrounds, `tooltip-surface` gives us full-text disclosure
surface visuals, and `tooltip-text-style` gives us disclosure typography with
a governed fallback stack. They do not provide tooltip trigger behavior,
placement, dismissal, general text color, selected meaning, or layout geometry.

## Open Questions

1. Is the search shell in item `2` global design-system search, page-local
   entity search, or template-review search?
2. Does item `4` own actions such as evidence and AI, or are those owned by the
   panel/detail region?
3. Does item `6` ever contain actions, status, help, or collapse controls, or
   is it only a heading and description?
4. Should item `5` and item `7` support identical keyboard behavior, or does
   the nested placement change keyboard expectations?
5. Are accordion, workflow builder, priority select cards, and select cards
   required for the first working version, or can the first version prove the
   page with simpler panel body content?
6. Which host containers must the embedded entity body support first: nested
   entity record, list-page record structure, drawer body, or another page
   template?
