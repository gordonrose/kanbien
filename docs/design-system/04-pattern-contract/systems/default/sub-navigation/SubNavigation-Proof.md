# Default Sub Navigation Pattern Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| Pattern | `sub-navigation` |
| Proof status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/sub-navigation/SubNavigation-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs#subNavigationPattern` |
| Rendered route | `/design-system/default/patterns/sub-navigation` |

## Source References

- `docs/workspace/design-system/behavior-locks/sub-nav-row-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/sub-nav-row-reference-pack.md`
- `docs/workspace/design-system/behavior-locks/breadcrumb-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/breadcrumb-reference-pack.md`
- `docs/workspace/design-system/behavior-locks/search-shell-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/search-shell-reference-pack.md`

## Proved Token Consumption

| Token | Runtime seam |
| --- | --- |
| `standard-page-shell-frame` | `src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs#standardPageShellFrameTokenSpec` |
| `sub-navigation-row-structure` | `src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/systems/default.mjs#subNavigationRowStructureTokenSpec` |

## Proved Variants

| Variant | Evidence |
| --- | --- |
| Desktop full | Breadcrumb and centered bounded search render together. |
| Compressed | Breadcrumb reveals hidden path items while search remains bounded. |
| Compact | Breadcrumb compact reveal remains available. |
| Mobile | Breadcrumb is absent and search fills the viewport row. |
| RTL | Direction is passed through to child primitives. |
| Themes | Original, dark, and desert route controls reuse child primitive token seams. |
| Auto resize | Pattern controller resolves row slots from rendered inline size and signed row-structure columns. |
| Breadcrumb tooltip placement | Long breadcrumb-label disclosure is requested below the label so it does not collide with top-navigation chrome. |

## Audit

The proof composes only `breadcrumb-trail-control` and `search-shell-control`
inside the signed `sub-navigation-row-structure` lane map. It does not invent
lower-layer breadcrumb links, search inputs, row tokens, search results, route
generation, component props, or app-local CSS.
