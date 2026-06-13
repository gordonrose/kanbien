# Standard Page Shell Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `standard-page-shell` |
| Pattern name | `standard-page-shell` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/standard-page-shell/StandardPageShell-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/standard-page-shell/StandardPageShell-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/standard-page-shell/StandardPageShell-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/standard-page-shell/index.mjs#standardPageShellPattern` |
| Rendered proof | `/design-system/default/patterns/standard-page-shell` |

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
| `top-navigation` | Review-ready or accepted top-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs#topNavigationPattern`. | Required child dependency. |
| `sub-navigation` | Review-ready or accepted sub-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs#subNavigationPattern`. | Required child dependency. |
| `context-navigation` | Review-ready or accepted context-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs#contextNavigationPattern`. | Required child dependency. |
| `tools-navigation` | Review-ready or accepted tools-navigation pattern contract and runtime seam. | `review-ready`; `src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs#toolsNavigationPattern`. | Required child dependency. |
| `standard-page-shell-frame` | Review-ready shell frame token. | `review-ready`; `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec`. | Eligible direct token dependency. |

## Composition Contract

The eventual pattern must compose these regions without recreating child
markup, controller behavior, state semantics, focus behavior, or CSS values
locally:

- top-navigation region
- sub-navigation region
- context-navigation region
- tools-navigation region
- page body slot

The runtime seam composes those child patterns directly. Later component seam,
use-case page, canonical, parity, and app adoption work may consume the shell
only after their own layer gates pass.

The selected non-original theme must be emitted as the shell's
`data-theme-scope` so shell-owned body, context rail, tools rail, and composed
child patterns resolve against one scoped palette. The shell may pass theme
inputs to child patterns, but it must not leave the page body or side rail
surfaces outside the active theme scope.

## Forbidden Work

- Do not create a standard-page-shell runtime composition from route-local
  markup, screenshots, canonical pages, 40-system files, or chat history.
- Do not approximate top-navigation or sub-navigation inside the shell pattern.
- Do not expose a shell component seam before Layer 5 creates it.
- Do not use app-local CSS or app page wrappers to fill the missing shell
  children.

## Required Evidence To Unblock

| Evidence Area | Requirement |
| --- | --- |
| top-navigation | `top-navigation` appears as consumable in `docs/design-system/04-pattern-contract/pattern-readiness-index.md`. |
| sub-navigation | `sub-navigation` appears as consumable in `docs/design-system/04-pattern-contract/pattern-readiness-index.md`. |
| child preservation | Unit coverage proves the standard shell consumes child pattern seams instead of rebuilding their markup or controller behavior. |
| theme scope | Unit and browser coverage prove non-original themes apply to the shell frame, side rails, page body, and child pattern seams. |
| rendered shell proof | A `/design-system/default/patterns/standard-page-shell` proof route shows desktop, reduced-width, mobile, RTL, and overflow states with child seams intact. |
| browser evidence | Visual or browser tests prove context bottom bar pinning, tools-nav mobile hiding, top/sub chrome attachment, and page body non-overlap. |

## Consumer Restrictions

Consumers must not consume this Layer 4 contract as a component seam or app
adoption boundary.

Consumers must wait for a later Layer 5 component seam before using the
standard page shell in app surfaces.

## Next Layer

| Field | Value |
| --- | --- |
| Next required work | Create a Layer 5 component seam if product or app surfaces need to consume this shell. |
| Next layer status | `allowed for Layer 5 after proof passes` |
| Reason | The shell now composes governed top, sub, context, and tools navigation child patterns. |
