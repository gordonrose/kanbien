# Standard Page Shell Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `standard-page-shell` |
| Pattern name | `standard-page-shell` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `blocked` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/standard-page-shell/StandardPageShell-Contract.md` |
| System proof path | `blocked until required child patterns exist` |
| Runtime seam | `blocked until required child patterns exist` |
| Rendered proof | `blocked until required child patterns exist` |

## Purpose

`standard-page-shell` will compose the governed top navigation, sub navigation,
context navigation, tools navigation, and page body boundary into one reusable
shell pattern.

It must not become a construction API for app pages until every child shell
family it composes has its own consumable governed seam.

## Layer Boundary

This PatternContractArtifact may define Layer 4 composition requirements and
blockers only.

It must not define token values, primitive behavior, component receptors,
use-case fixtures, canonical scenarios, app wrappers, backend behavior, route
topology, or app adoption.

## Upstream Gate Check

| Dependency | Required Layer 4 Input | Current Status | Pattern Decision |
| --- | --- | --- | --- |
| `top-navigation` | Review-ready or accepted top-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs#topNavigationPattern`. | Eligible child dependency once sub-navigation is ready. |
| `sub-navigation` | Review-ready or accepted sub-navigation pattern contract and runtime seam. | `blocked`; only `01-behavior-rule` exists. | Standard page shell pattern cannot compose breadcrumb/search chrome yet. |
| `context-navigation` | Review-ready or accepted context-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs#contextNavigationPattern`. | Eligible child dependency once other shell children are ready. |
| `tools-navigation` | Review-ready or accepted tools-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs#toolsNavigationPattern`. | Eligible child dependency once other shell children are ready. |
| `standard-page-shell-frame` | Review-ready shell frame token. | `review-ready`; `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec`. | Eligible direct token dependency. |

## Blocked Composition Contract

The eventual pattern must compose these regions without recreating child
markup, controller behavior, state semantics, focus behavior, or CSS values
locally:

- top-navigation region
- sub-navigation region
- context-navigation region
- tools-navigation region
- page body slot

Until sub-navigation has a consumable Layer 4 seam, no
standard-page-shell runtime seam, proof route, component seam, use-case page,
canonical, parity test, or app adoption may claim to consume a governed
standard page shell.

## Allowed Work While Blocked

- Continue sub-navigation through its child behavior decision, Layer 2 token,
  Layer 3 primitive, and Layer 4 pattern chain.
- Keep `top-navigation` as an eligible child dependency; do not copy its
  primitive or pattern markup into a blocked shell runtime.
- Maintain context-navigation and tools-navigation fixes as upstream evidence.
- Keep this contract as a blocker ledger so later layers cannot silently
  rebuild missing shell chrome.

## Forbidden Work While Blocked

- Do not create a standard-page-shell runtime composition from route-local
  markup, screenshots, canonical pages, 40-system files, or chat history.
- Do not approximate top-navigation or sub-navigation inside the shell pattern.
- Do not expose a shell component seam before this pattern is unblocked.
- Do not use app-local CSS or app page wrappers to fill the missing shell
  children.

## Required Evidence To Unblock

| Evidence Area | Requirement |
| --- | --- |
| top-navigation | `top-navigation` appears as consumable in `docs/design-system/04-pattern-contract/pattern-readiness-index.md`. |
| sub-navigation | `sub-navigation` appears as consumable in `docs/design-system/04-pattern-contract/pattern-readiness-index.md`. |
| child preservation | Unit coverage proves the standard shell consumes child pattern seams instead of rebuilding their markup or controller behavior. |
| rendered shell proof | A `/design-system/default/patterns/standard-page-shell` proof route shows desktop, reduced-width, mobile, RTL, and overflow states with child seams intact. |
| browser evidence | Visual or browser tests prove context bottom bar pinning, tools-nav mobile hiding, top/sub chrome attachment, and page body non-overlap. |

## Consumer Restrictions

Consumers must not consume this blocked contract as a component seam or app
adoption boundary.

Consumers must wait for an unblocked Layer 4 runtime seam and later Layer 5
component seam before using the standard page shell in app surfaces.

## Next Layer

| Field | Value |
| --- | --- |
| Next required work | Continue the missing `sub-navigation` child chain before creating the standard-page-shell runtime seam. |
| Next layer status | `blocked for standard-page-shell`; `allowed for missing child families` |
| Reason | The shell can only compose governed child patterns; two required child families are still behavior-rule only. |
