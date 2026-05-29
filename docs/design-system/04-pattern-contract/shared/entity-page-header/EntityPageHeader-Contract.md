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
text-backed readiness status primitive, truncating labels, and optional
icon-button actions into one populated entity page header.

It does not own page body layout, form controls, dropdown fields, backend data
loading, route navigation, component seams, canonical scenarios, templates, or
app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Direct token dependency | `page-header-structure` is `review-ready` for `default` |
| Primitive dependency | `readiness-status-control`, `icon-button-control`, and `truncating-label` are consumable for `default` |

## Composition Contract

The pattern renders one `header` with optional leading control slots, one
context-title region, and optional trailing action slots.

The page-header structure token supplies the possible 24-column foundation and
stable region identities. The pattern owns how populated optional regions are
resolved onto those columns.

The pattern must not preserve empty structural gaps for absent optional
controls. Leading regions compact left in declared order. Trailing actions
compact right in declared order. The `context-title` region expands into any
unused columns between them.

Slot identity stays stable even when resolved columns shift. For example, if
`secondary-control` is absent, `primary-filter` may resolve from `3-5` to
`2-4`, but it remains `primary-filter` in data and contract terms.

Visual compaction must not scramble semantics. DOM and keyboard order follow
the logical reading order: leading controls, context title, readiness status,
then trailing actions.

## Composition Ledger

| Rendered Child | Allowed Category | Governed Seam Or Reason | Consumer Boundary |
| --- | --- | --- | --- |
| Header grid | governed pattern wrapper | `page-header-structure` token supplies foundation; pattern resolves optional slots | Consume the pattern seam, not route markup. |
| Leading controls | governed primitive | `icon-button-control` | Consumers provide action intent; primitive owns button behavior. |
| Primary and secondary filter regions | governed pattern placeholder | `page-header-structure` token supplies three-column spans; filter primitive remains downstream | Consumers must not treat proof placeholder copy as a control API. |
| Entity family, selected entity, category | governed primitive | `truncating-label` | Consumers provide text; primitive owns clipping/disclosure. |
| Readiness/status | governed primitive | `readiness-status-control` | Consumers provide state; primitive owns text-backed status semantics. |
| Trailing actions | governed primitive | `icon-button-control` | Consumers provide action intent; primitive owns button behavior. |

## Accessibility Contract

The header is labelled by the selected entity text. If the selected entity is
not available, consumers must supply an explicit empty or selection-required
label before app adoption.

Every icon-only control must use `icon-button-control` and have an accessible
name. Readiness state must use `readiness-status-control` so status meaning is
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
action definitions. Action activation behavior remains owned by the composed
`icon-button-control` primitive. The pattern does not fetch, route, persist, or
authorize product data.

## Text Overflow Disclosure

| Text Area | Can Truncate? | Governing Primitive Or Proof | Browser Evidence | Consumer Boundary |
| --- | --- | --- | --- | --- |
| entity family | yes | `truncating-label` | visual route pending local browser dependencies | Consumers must not add title-only fallback. |
| selected entity | yes | `truncating-label` | visual route pending local browser dependencies | Consumers must not clip locally. |
| category | yes | `truncating-label` | visual route pending local browser dependencies | Consumers must not add route-local tooltip logic. |
| readiness status | no | `readiness-status-control` | unit proof | Use short approved state text only. |

## Visual-Skin Boundary

Region placement and the continuous strip gap come from
`page-header-structure` plus this pattern's compaction algorithm. The pattern
owns the single outer frame and dividers between composed regions; it does not
turn each region into a separate card. Text, icon action, and status semantics
come through governed primitives. The pattern does not approve badge surfaces,
dropdown styling, app-local spacing, or page-shell adoption.

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
| primitive consumption | Unit test covers `readiness-status-control`, `icon-button-control`, and `truncating-label` markers. |
| token consumption | Unit test covers `page-header-structure` dependency. |
| rendered verification | Proof route created; Playwright browser execution depends on local Chromium dependencies. |
| text-disclosure audit | Later browser proof must verify truncated labels when local browser dependencies are available. |
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
| secondary-control visibility | proof-only diagnostic over pattern slot resolver | no proof-only | visual route pending local browser dependencies | Proves leading compaction. | available |
| filter group visibility | proof-only diagnostic over pattern slot resolver | no proof-only | visual route pending local browser dependencies | Proves context title expansion. | available |
| trailing action count | proof-only diagnostic over pattern slot resolver | no proof-only | visual route pending local browser dependencies | Proves right compaction. | available |
| readiness state | primitive state | yes | unit proof; visual route pending local browser dependencies | Proves status semantics. | available |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling,
or token values locally.

Consumers must not use legacy top-level `/design-system/patterns` route markup
as the pattern source of truth.

Consumers must not weaken the accessibility requirements recorded here.

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
