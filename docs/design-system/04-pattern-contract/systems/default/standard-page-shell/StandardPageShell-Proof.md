# Default Standard Page Shell Pattern Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| Pattern | `standard-page-shell` |
| Proof status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/standard-page-shell/StandardPageShell-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/standard-page-shell/index.mjs#standardPageShellPattern` |
| Rendered route | `/design-system/default/patterns/standard-page-shell` |

## Proved Composition

| Child pattern | Runtime seam |
| --- | --- |
| `top-navigation` | `src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs#topNavigationPattern` |
| `sub-navigation` | `src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs#subNavigationPattern` |
| `context-navigation` | `src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs#contextNavigationPattern` |
| `tools-navigation` | `src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs#toolsNavigationPattern` |

## Audit

The proof composes governed child pattern renderers. It does not rebuild
top navigation, secondary navigation, context navigation, tools navigation,
or child primitive markup inside the standard shell.

The proof also verifies that selecting a non-original theme scopes the whole
standard shell frame. The shell emits `data-theme-scope` for the selected
theme, passes that theme to child pattern seams, and keeps shell-owned body and
side-rail surfaces on the same scoped palette.
