# Layer 4 Pattern Contract Readiness Index

This index prevents legacy pattern routes, screenshots, examples, or app
fragments from being mistaken for governed Layer 4 pattern contracts.

A pattern is consumable by later layers only when it has a review-ready or
accepted shared pattern contract, any required system proof for the selected
design system, accepted primitive dependencies for that system, and signed
direct token dependencies when the pattern consumes tokens itself.

## Consumable For Later Layers

| Pattern | Shared contract status | System key | System proof status | Runtime seam | Primitive dependencies | Direct token dependencies | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `index-nav-item` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-item/index.mjs#indexNavItemPattern` | `index-nav-item-control` review-ready for `default` | `not-applicable; tokens consumed through primitive` | `docs/design-system/04-pattern-contract/shared/index-nav-item/IndexNavItem-Contract.md`; `docs/design-system/04-pattern-contract/systems/default/index-nav-item/IndexNavItem-Proof.md`; `docs/design-system/03-primitive/primitive-readiness-index.md`; `tests/unit/designSystem/indexNavItemPattern.test.ts`; `tests/visual/designSystem/patterns/indexNavItemPatternRoute.spec.ts`; rendered view `/design-system/default/patterns/index-nav-item` |
| `index-nav-label` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-label/index.mjs#indexNavLabelPattern` | `truncating-label` accepted for `default` | `not-applicable; tokens consumed through primitive` | `docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md`; `docs/design-system/04-pattern-contract/systems/default/index-nav-label/IndexNavLabel-Proof.md`; `docs/design-system/03-primitive/primitive-readiness-index.md`; `tests/unit/designSystem/indexNavLabelPattern.test.ts`; `tests/visual/designSystem/patterns/indexNavLabelPatternRoute.spec.ts`; rendered view `/design-system/default/patterns/index-nav-label` |
| `index-nav-list` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-list/index.mjs#indexNavListPattern` | `index-nav-item` review-ready for `default` | `index-nav-list-gap` review-ready for `default` | `docs/design-system/04-pattern-contract/shared/index-nav-list/IndexNavList-Contract.md`; `docs/design-system/04-pattern-contract/systems/default/index-nav-list/IndexNavList-Proof.md`; `docs/design-system/02-token/token-readiness-index.md`; `tests/unit/designSystem/indexNavListPattern.test.ts`; `tests/visual/designSystem/patterns/indexNavListPatternRoute.spec.ts`; rendered view `/design-system/default/patterns/index-nav-list` |
| `index-nav` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/04-pattern-contract/index-nav/index.mjs#indexNavPattern` | `index-nav-panel` review-ready for `default` | `index-nav-panel-frame` review-ready for `default` | `docs/design-system/04-pattern-contract/shared/index-nav/IndexNav-Contract.md`; `docs/design-system/04-pattern-contract/systems/default/index-nav/IndexNav-Proof.md`; `docs/design-system/02-token/token-readiness-index.md`; `tests/unit/designSystem/indexNavPattern.test.ts`; `tests/visual/designSystem/patterns/indexNavPatternRoute.spec.ts`; rendered view `/design-system/default/patterns/index-nav` |
| `index-nav-panel` | `review-ready` | `default` | `review-ready` | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-panel/index.mjs#indexNavPanelPattern` | `index-nav-list` review-ready for `default`; `index-nav-icon-button-control` review-ready for `default` | `index-nav-panel-frame` review-ready for `default`; `label-text-style` review-ready for `default` | `docs/design-system/04-pattern-contract/shared/index-nav-panel/IndexNavPanel-Contract.md`; `docs/design-system/04-pattern-contract/systems/default/index-nav-panel/IndexNavPanel-Proof.md`; `docs/design-system/02-token/token-readiness-index.md`; `docs/design-system/03-primitive/primitive-readiness-index.md`; `tests/unit/designSystem/indexNavPanelPattern.test.ts`; `tests/visual/designSystem/patterns/indexNavPanelPatternRoute.spec.ts`; rendered view `/design-system/default/patterns/index-nav-panel` |

## Template Only Or Not Yet Created

The Layer 4 harness is active. Reusable structures such as index navigation,
panel title headers, field display rows, accordion headers, tooltip-backed
label groupings, and page/body structures are still not consumable until each
has a governed shared pattern contract and required proof.

Legacy top-level `src/frontend/designSystem/patterns/` routes remain
pre-governed inventory unless a Layer 4 artifact explicitly promotes a pattern.

## Update Rule

When a pattern moves out of template-only or missing status, update this index
in the same change as the shared pattern contract, any system proof artifact,
runtime seam planning or implementation, and focused verification evidence.
