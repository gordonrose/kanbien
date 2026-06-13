# SubNavigationRowStructure Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `sub-navigation` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/sub-navigation-row-structure/SubNavigationRowStructure-Contract.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Sub-navigation needs stable breadcrumb/search row geometry so search remains centered and breadcrumb collapse is based on the breadcrumb lane width. |
| Token category | `layout` |
| Token job | Govern the reusable 24-column row allocation, lane identities, and column removal order for secondary shell navigation rows. |
| Non-goals | Breadcrumb item anatomy, breadcrumb menu behavior, search input behavior, search results, component props, app adoption, or route hierarchy generation. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern markup, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/contract.mjs` |
| Required roles or fields | `layoutRole`, `columnCount`, `minimumColumnInlineSize`, `gapValue`, `collapseBehavior`, `lanes` |
| Required lane fields | `id`, `label`, `startColumn`, `endColumn`, `minimumColumns`, `purpose` |
| Cross-system consumer rule | Every design system must expose a governed sub-navigation row structure token before reusable sub-navigation patterns own breadcrumb/search row-width negotiation. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | The row uses a 24-column foundation. | `24` |
| shared contract | Full-width breadcrumb lane. | columns `1-7` |
| shared contract | Protected gap lane. | column `8` |
| shared contract | Full-width centered search lane. | columns `9-17` |
| shared contract | Blank reserve lane. | columns `18-24` |
| shared contract | First collapse step. | Remove reserve columns before shrinking breadcrumb, gap, or search. |
| shared contract | Second collapse step. | After reserve columns are unavailable, preserve the gap lane while possible; then breadcrumb and search lose columns one at a time while preserving their relative order. |
| shared contract | Breadcrumb collapse trigger. | Later pattern logic must derive breadcrumb mode from the rendered breadcrumb lane width. |

## Consumer Rules

- Consumers must import the governed runtime seam instead of hard-coding the
  24-column row, breadcrumb lane, gap lane, search lane, reserve lane, or
  collapse order.
- Consumers must not recreate breadcrumb collapse behavior from whole-row width
  when the breadcrumb lane width is available.
- Consumers must not use this token as permission to invent breadcrumb item
  behavior, search behavior, component receptors, app wrappers, or app-local CSS.

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| token proof | Rendered token route must show the 24-column row map and lane identities. |
| pattern consumption | Sub-navigation pattern must consume this token seam for row layout. |
| centered search | Browser proof must assert the search lane is centered in the row. |
| breadcrumb lane collapse | Browser proof must assert breadcrumb collapse follows lane pressure rather than whole-row width alone. |
