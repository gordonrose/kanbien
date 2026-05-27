# Index Nav Item Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Pattern | `index-nav-item` |
| System key | `default` |
| Status | `review-ready` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/index-nav-item/IndexNavItem-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/index-nav-item/index.mjs#indexNavItemPattern` |
| Rendered proof | `/design-system/default/patterns/index-nav-item` |

## Proof Scope

The default proof composes the `index-nav-item-control` primitive into the
rectangular index-navigation item/card used by later index-list patterns.

The proof exposes theme, item state, and slot width controls because those
change signed upstream variants or accessibility-sensitive layout behavior.
