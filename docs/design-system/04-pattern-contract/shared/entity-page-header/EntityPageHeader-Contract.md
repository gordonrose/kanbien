# Entity Page Header Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `entity-page-header` |
| Pattern name | `entity-page-header` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/entity-page-header/EntityPageHeader-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/entity-page-header/EntityPageHeader-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs#entityPageHeaderPattern` |
| Rendered proof | `/design-system/default/patterns/entity-page-header` |

## Purpose

`entity-page-header` composes the governed page-header structure token,
header menu simple select pattern, text-backed readiness status primitive,
truncating labels, and optional icon-button trailing actions into one
populated entity page header.

It does not own page body layout, generic form controls, backend data
loading, route navigation, component seams, canonical scenarios, templates, or
app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Direct token dependency | `page-header-structure` is `review-ready` for `default` |
| Pattern dependency | `header-menu-simple-select` is `review-ready` for `default` |
| Primitive dependency | `readiness-status-control`, `icon-button-control`, `menu-simple-select-control` through `header-menu-simple-select`, and `truncating-label` are consumable for `default` |

## Composition Contract

The pattern renders one container with one inner `header`, optional leading
control slots, one context-title region, and optional trailing action slots.
The container owns the page-level inset around the strip. The inner `header`
owns the 24-column strip and region placement.

The page-header structure token supplies the possible 24-column foundation and
stable region identities. The pattern owns how populated optional regions are
resolved onto those columns.

The pattern must not preserve empty structural gaps for absent optional
controls. Leading regions compact left in declared order. Trailing actions
compact right in declared order. The `context-title` region expands into any
unused columns between them.

Slot identity stays stable even when resolved columns shift. For example, if
`secondary-control` is absent, `primary-filter` may resolve from `3-6` to
`2-5`, but it remains `primary-filter` in data and contract terms.

Visual compaction must not scramble semantics. DOM and keyboard order follow
the logical reading order: leading controls, context title, readiness status,
then trailing actions.

The context-title region is a single-line composition. Entity family, selected
entity, category, and readiness status must never stack into multiple rows
inside the header strip. When width is constrained, the composed
`truncating-label` primitive owns text disclosure and the pattern's responsive
rules hide lower-priority regions rather than allowing vertical text stacking.

At narrow and mobile widths, the pattern collapses the whole toolset into one
burger-menu trigger labelled `Header tools`. The collapsed menu represents all
header controls, not only hidden controls. It takes over the viewport, includes
a header with an explicit close button, and scrolls its body when needed so the
container always contains the available controls. Select entries reuse
`header-menu-simple-select`; on mobile their option sheet also takes over the
viewport and includes its own close button. Action controls remain a compact
labelled row per action because the collapsed menu must expose the accessible
names visibly, execute their action intent immediately, and then close the
tools menu.

## Composition Ledger

| Rendered Child | Allowed Category | Governed Seam Or Reason | Consumer Boundary |
| --- | --- | --- | --- |
| Header container | governed pattern wrapper | Pattern owns page-level inset and container-query boundary | Consume the pattern seam, not route markup. |
| Header grid | governed pattern strip | `page-header-structure` token supplies foundation; pattern resolves optional slots | Consume the pattern seam, not route markup. |
| Filter control | governed child pattern | `header-menu-simple-select` icon-trigger variant with filter glyph | Consumers must not recreate select trigger, option list, selected state, keyboard behavior, or anchored menu placement. |
| Sort control | governed child pattern | `header-menu-simple-select` icon-trigger variant with sort glyph | Consumers must not recreate select trigger, option list, selected state, keyboard behavior, or anchored menu placement. |
| Primary filter region | governed child pattern | `header-menu-simple-select` text-trigger variant with filter options | Consumers must not recreate select trigger, option list, selected state, keyboard behavior, or anchored menu placement. |
| Layer filter region | governed child pattern | `header-menu-simple-select` | Consumers must not recreate select trigger, option list, selected state, keyboard behavior, or anchored menu placement. |
| Collapsed tools trigger and menu | governed pattern responsive mode | Pattern owns the narrow/mobile full-viewport takeover; select rows still consume `header-menu-simple-select`; action rows expose visible names and dispatch the same action intent. | Consumers must not create a separate mobile header toolbar or copy the desktop controls into app-local menus. |
| Entity family, selected entity, category | governed primitive | `truncating-label` | Consumers provide text; primitive owns clipping/disclosure. |
| Readiness/status | governed primitive | `readiness-status-control` | Consumers provide state; primitive owns text-backed status semantics. |
| Trailing actions | governed primitive | `icon-button-control` | Consumers provide action intent; primitive owns button behavior. |

## Accessibility Contract

The header is labelled by the selected entity text. If the selected entity is
not available, consumers must supply an explicit empty or selection-required
label before app adoption.

Every icon-only action must use `icon-button-control` and have an accessible
name. Icon-trigger selects must use `header-menu-simple-select` and preserve
the primitive's full accessible trigger name and current-value announcement.
Readiness state must use `readiness-status-control` so status meaning is
visible and programmatically exposed.

The header must preserve logical reading order under compaction, RTL, zoom, and
constrained width. Colour, position, or shape must not be the only carrier of
status meaning.

## Allowed States

| State | Required Behavior |
| --- | --- |
| `ready` | Composes `readiness-status-control` with visible `Ready` text. |
| `needs-review` | Composes `readiness-status-control` with visible `Needs review` text. |
| `blocked` | Composes `readiness-status-control` with visible `Blocked` text. |
| `unknown` | Composes `readiness-status-control` with visible `Unknown` text. |
| absent optional leading slot | Later leading slots compact left and context title expands. |
| reduced trailing actions | Present actions compact right and context title expands. |

## Data Or Event Contract

The pattern accepts entity family text, selected entity text, category text,
readiness state, optional leading control definitions, and optional trailing
action definitions. Select open, dismiss, and selection behavior remains owned
by the composed `header-menu-simple-select` child pattern and its primitive.
Action activation behavior remains owned by the composed `icon-button-control`
primitive. The pattern does not fetch, route, persist, or authorize product
data.

## Text Overflow Disclosure

| Text Area | Can Truncate? | Governing Primitive Or Proof | Browser Evidence | Consumer Boundary |
| --- | --- | --- | --- | --- |
| entity family | yes | `truncating-label` | unit and browser proof | Consumers must not add title-only fallback. |
| selected entity | yes | `truncating-label` | unit and browser proof | Consumers must not clip locally. |
| category | yes | `truncating-label` | unit and browser proof | Consumers must not add route-local tooltip logic. |
| readiness status | no | `readiness-status-control` | unit proof | Use short approved state text only. |

The pattern may place truncating labels side by side, but it must not add
route-local clipping, title-only fallback, or multi-row label layout around
them. Text disclosure remains primitive-owned.

## Visual-Skin Boundary

Region placement and the continuous strip gap come from
`page-header-structure` plus this pattern's compaction algorithm. The pattern
owns the container surface; it does not turn the strip or each region into a
separate card. Text, icon action, select, and status semantics come through
governed primitives or child patterns. The pattern does not approve badge
surfaces, generic dropdown styling, app-local spacing, or page-shell adoption.

The strip outline and internal region borders are optional diagnostics only.
The production/default pattern state must render with region boundaries off.
Proof routes may expose a `Region guides` control to inspect column placement,
but consumers must not rely on those guides as production dividers.

The container owns the page-header inset around the strip. Consumers must not
wrap the pattern in app-local padding to approximate the entity page header
placement; later layers should consume this container seam.

The populated header background is owned by the pattern container. The inner
strip and individual regions must not introduce their own section backgrounds
unless a later signed token explicitly defines a state or selection surface for
that region. In the base state, the strip and regions remain transparent and
do not render internal borders.

Slot placement must be applied by the pattern controller from signed slot
metadata. The renderer must not rely on inline `style` attributes for
grid-column placement because the served design-system CSP does not make inline
styles a reliable construction path.

Responsive collapse must follow `page-header-structure`: the proof host uses
the same `token-foundation-header` container, the pattern grid consumes the
same visible-column count, and trailing action placement uses the token tail
column variables so actions shift left as columns are removed. At the narrow
mobile breakpoint, only the leading-control region remains visible and fills
the available strip width.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned pattern module | `src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs` |
| Planned pattern export | `entityPageHeaderPattern` |
| Allowed consumers | Later component seam, demo, canonical, and app-adoption layers after those gates are active. |
| Consumers must use | `src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs` |
| Consumers must not use | copied app markup, legacy route markup, screenshots, local CSS values, duplicated primitive behavior, or route-local proof markup |

## Runtime Pattern Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | implemented |
| Allowed seam shape | render helper plus slot-resolution helper |
| Planned module | `src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs` |
| Planned export | `entityPageHeaderPattern` |
| Seam must own | optional-slot compaction, slot validation, primitive composition, state wiring |
| Seam must not own | component props, app wrappers, product workflow, backend calls, unsigned visual values, or primitive reimplementation |
| First implementation posture | Smallest populated header pattern that proves structure, status semantics, title text, and optional actions. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit test covers slot compaction and rendered child composition. |
| accessibility | Unit test covers status role and icon-button labels. |
| pattern consumption | Unit test covers `header-menu-simple-select` markers for filter icon, sort icon, primary text, layer text, and collapsed tools menu regions. |
| primitive consumption | Unit test covers `readiness-status-control`, `icon-button-control`, and `truncating-label` markers. |
| token consumption | Unit test covers `page-header-structure` dependency. |
| rendered verification | Browser proof verifies desktop header select instances, collapsed tools select instances, filter/sort icon triggers, grouped text triggers, and slot containment. |
| text-disclosure audit | Browser proof and text-disclosure audit must continue to reject local clipping around header text. |
| consumer boundary | Readiness index and contract forbid route-local or app-local header reconstruction. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/entity-page-header` |
| Rendered view status | available |
| If unavailable | not-applicable |

## Rendered Proof Controls

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| secondary-control visibility | proof-only diagnostic over pattern slot resolver | no proof-only | unit and browser proof | Proves leading compaction. | available |
| filter group visibility | proof-only diagnostic over pattern slot resolver | no proof-only | unit and browser proof | Proves context title expansion. | available |
| trailing action count | proof-only diagnostic over pattern slot resolver | no proof-only | unit and browser proof | Proves right compaction. | available |
| readiness state | primitive state | yes | unit and browser proof | Proves status semantics. | available |
| filter icon select | child pattern | yes through `header-menu-simple-select` | unit and browser proof | Proves the first one-column control is an icon-trigger menu select with filter glyph. | available |
| sort icon select | child pattern | yes through `header-menu-simple-select` | unit and browser proof | Proves the second one-column control is an icon-trigger menu select with sort glyph. | available |
| primary filter select | child pattern | yes through `header-menu-simple-select` | unit and browser proof | Proves the primary grouped region uses the same menu-select pattern as the secondary grouped region. | available |
| layer select | child pattern | yes through `header-menu-simple-select` | unit and browser proof | Proves the layer selector is consumed from the governed select pattern rather than local placeholder markup. | available |
| collapsed tools menu | responsive pattern mode | yes through `entity-page-header` | unit and browser proof | Proves narrow/mobile header tooling collapses behind one burger trigger while preserving select/action behavior. | available |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling,
or token values locally.

Consumers must not use legacy top-level `/design-system/patterns` route markup
as the pattern source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not replace the narrow/mobile `Header tools` menu with
app-local copied controls, separate mobile action bars, or CSS-only hidden
desktop controls.

Consumers must not treat the pattern as a component seam or app adoption seam.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared pattern contract at | `docs/design-system/04-pattern-contract/shared/entity-page-header/EntityPageHeader-Contract.md` |
| Store system proof at | `docs/design-system/04-pattern-contract/systems/default/entity-page-header/EntityPageHeader-Proof.md` |
| Stable lookup key | `shared/entity-page-header/entity-page-header/04-pattern-contract` |
| How later layers consume it | Later layers read the shared pattern contract and selected system proof by path or stable lookup key before making component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve composition, primitive dependencies, accessibility, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a pattern revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `04-pattern-contract/EVAL.md` |
| Required accessibility eval | `04-pattern-contract/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | 04-pattern-contract | Treat this pattern as review-ready if focused tests pass. | none |
| 2 | 05-component-seam | Activate the component-seam harness before creating a public app-consumable component. | Layer 5 is scaffold-only. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | 05-component-seam |
| Next layer status | scaffold-only |
| Reason | Pattern work can pass, but component seam work must wait for the Layer 5 harness. |
