# Top Navigation Frame Token Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| UI family | `top-navigation` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/top-navigation-frame/TopNavigationFrame-Contract.md` |
| Rendered view | `/design-system/default/tokens/top-navigation-frame` |

## System Token Implementation

| Field | Value |
| --- | --- |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/topNavigationFrame.tokens.mjs` |
| System token export | `topNavigationFrameTokenSpec` |
| System page route | `/design-system/default/tokens/top-navigation-frame` |
| Proof status | `review-ready` |

## Token Definition

```json
{
  "schema": "kanbien.designSystem.tokenDefinition.v1",
  "contractScope": "shared",
  "designSystem": "default",
  "uiFamily": "top-navigation",
  "tokenType": "top-navigation-frame",
  "status": "review-ready",
  "behaviorRulePath": "docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md",
  "tokenContractPath": "docs/design-system/02-token/shared/top-navigation-frame/TopNavigationFrame-Contract.md",
  "tokenDefinitionPath": "docs/design-system/02-token/systems/default/top-navigation-frame/TopNavigationFrame-Implementation.md",
  "page": {
    "route": "/design-system/default/tokens/top-navigation-frame",
    "title": "Top Navigation Frame Token"
  },
  "codeSeam": {
    "contractModule": "src/frontend/designSystem/layers/02-token/top-navigation-frame/contract.mjs",
    "governedRuntimeModule": "src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs",
    "systemProofModule": "src/frontend/designSystem/systems/default/tokens/proofs/topNavigationFrame.tokens.mjs",
    "systemTokenExport": "topNavigationFrameTokenSpec",
    "allowedConsumers": ["03-primitive", "04-pattern-contract"]
  },
  "variants": [
    "top-navigation-frame-chrome-*",
    "top-navigation-frame-destination-*",
    "top-navigation-frame-destination-current-*",
    "top-navigation-frame-trigger-*",
    "top-navigation-frame-trigger-open-*",
    "top-navigation-frame-menu-panel-*"
  ]
}
```

## Dependency Chain

| Dependency | Use |
| --- | --- |
| `background-color` | Theme surfaces and neutral foreground pairings. |
| `primary-tinted-background` and `primary-tinted-foreground` | Current-destination frame pairing. |
| `button-frame` | Button-frame alignment precedent only; top-navigation state values remain owned here. |
| `focus-ring` | Required later primitive focus pairing. |
| `label-text-style` | Short-label typography pairing for proof and primitive text. |
| `minimum-target-size` | Destination target-size pairing for primitives. |

## Governed Default Values

- Destination and trigger frame variants set `minInlineSize` to `7rem` so the
  top-navigation pattern can move items into overflow before controls collapse
  into unreadable glyph-width buttons.

## Required Evidence

- Unit test must import the runtime seam and verify roles, dependencies, open-trigger pairing, and old-variable denial.
- Registry check must include `tokens.top-navigation-frame`.
- Rendered proof must show the actual top-navigation token roles, not a generic card.
- Later primitive proof must pair current state with programmatic semantics, open trigger state with `aria-expanded`, and visible focus.

## Next Layer

`03-primitive` is allowed once focused token tests, registry check, and rendered route evidence pass.
