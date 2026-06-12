# Sub Navigation Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `sub-navigation` |
| Pattern name | `sub-navigation` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/sub-navigation/SubNavigation-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/sub-navigation/SubNavigation-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs#subNavigationPattern` |
| Rendered proof | `/design-system/default/patterns/sub-navigation` |

## Purpose

`sub-navigation` composes the governed breadcrumb trail primitive and search
shell primitive into the secondary chrome row below top navigation.

The pattern owns row composition, responsive slot switching, RTL row posture,
and the mobile fallback where breadcrumb is absent and search fills the row.

## Layer Boundary

This PatternContractArtifact may define Layer 4 composition only.

It must not define token values, primitive internals, component receptors,
breadcrumb route generation, search result loading, canonical fixtures, app
wrappers, backend behavior, or app adoption.

## Upstream Gate Check

| Dependency | Required Layer Input | Current Status | Pattern Decision |
| --- | --- | --- | --- |
| `sub-navigation` behavior | Review-ready Layer 1 behavior rule. | `review-ready`; `docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md`. | Eligible. |
| `breadcrumb` behavior | Review-ready Layer 1 child behavior rule. | `review-ready`; `docs/design-system/01-behavior-rule/shared/breadcrumb/Breadcrumb-Behaviour.md`. | Eligible child obligation. |
| `search-shell` behavior | Review-ready Layer 1 child behavior rule. | `review-ready`; `docs/design-system/01-behavior-rule/shared/search-shell/SearchShell-Behaviour.md`. | Eligible child obligation. |
| `standard-page-shell-frame` | Review-ready shell frame token. | `review-ready`; `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec`. | Eligible direct token dependency for row placement and search width. |
| `breadcrumb-trail-control` | Review-ready primitive contract and default proof. | `review-ready`; `src/frontend/designSystem/layers/03-primitive/breadcrumb-trail-control/index.mjs#breadcrumbTrailControlPrimitive`. | Required child primitive. |
| `search-shell-control` | Review-ready primitive contract and default proof. | `review-ready`; `src/frontend/designSystem/layers/03-primitive/search-shell-control/index.mjs#searchShellControlPrimitive`. | Required child primitive. |

## Composition Contract

The pattern must compose:

- breadcrumb region from `breadcrumb-trail-control`
- search region from `search-shell-control`
- responsive row slots for desktop, compressed, compact, and mobile fallback

The pattern must not recreate breadcrumb links, breadcrumb reveal behavior,
native search input behavior, search hints, focus behavior, or child primitive
styling locally.

## Required States

| State | Required Behavior |
| --- | --- |
| desktop | Breadcrumb is fully visible and search is centered and bounded. |
| compressed | Breadcrumb reduces through the approved hidden-path reveal before search leaves the row. |
| compact | Breadcrumb becomes compact reveal and search remains bounded. |
| mobile | Breadcrumb is absent and search fills the available sub-navigation width. |
| RTL | Row direction, breadcrumb ordering, separator flow, and search presentation mirror. |
| themed | Original, dark, and desert themes reuse child primitive token seams without pattern-local colour invention. |

## Consumer Rules

- Consumers must use this pattern for governed secondary navigation row composition.
- Consumers must not recreate breadcrumb, search, collapse, mobile fallback, or row-width negotiation markup locally.
- Consumers must not add search results, breadcrumb route generation, component props, app adoption, or app-local CSS.

## Evidence

| Evidence | Path |
| --- | --- |
| System proof | `docs/design-system/04-pattern-contract/systems/default/sub-navigation/SubNavigation-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs` |
| Unit test | `tests/unit/designSystem/subNavigationPattern.test.ts` |
| Visual/browser proof | `tests/visual/designSystem/patterns/subNavigationPatternRoute.spec.ts` |
| Rendered proof | `/design-system/default/patterns/sub-navigation` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected consumer | `standard-page-shell` Layer 4 pattern |
| Next layer status | `allowed after proof passes` |
| Reason | The standard page shell can now compose a governed sub-navigation child seam instead of approximating breadcrumb/search chrome. |
