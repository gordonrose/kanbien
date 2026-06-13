# Default SubNavigationRowStructure Token Implementation

## Implementation Metadata

| Field | Value |
| --- | --- |
| Design system | `default` |
| Token type | `sub-navigation-row-structure` |
| Implementation status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/sub-navigation-row-structure/SubNavigationRowStructure-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/systems/default.mjs#subNavigationRowStructureTokenSpec` |
| Proof module | `src/frontend/designSystem/systems/default/tokens/proofs/subNavigationRowStructure.tokens.mjs` |
| Rendered route | `/design-system/default/tokens/sub-navigation-row-structure` |

## Token Definition

```js
export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "sub-navigation",
  tokenType: "sub-navigation-row-structure",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/sub-navigation-row-structure/SubNavigationRowStructure-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/sub-navigation-row-structure/SubNavigationRowStructure-Implementation.md",
  variants: [
    {
      id: "sub-navigation-row-structure-default",
      tokenName: "--sub-navigation-row-structure",
      value: {
        layoutRole: "sub-navigation row structure",
        columnCount: 24,
        minimumColumnInlineSize: "2.75rem",
        gapValue: "0",
        collapseBehavior:
          "remove reserve columns 18-24 first, preserve the gap lane while possible, then alternate breadcrumb and search column reductions while deriving breadcrumb mode from breadcrumb lane pressure",
        lanes: [
          { id: "breadcrumb", label: "1-7", startColumn: 1, endColumn: 8, minimumColumns: 3 },
          { id: "gap", label: "8", startColumn: 8, endColumn: 9, minimumColumns: 0 },
          { id: "search", label: "9-17", startColumn: 9, endColumn: 18, minimumColumns: 5 },
          { id: "reserve", label: "18-24", startColumn: 18, endColumn: 25, minimumColumns: 0 },
        ],
      },
    },
  ],
};
```

## Evidence

| Evidence | Path |
| --- | --- |
| Unit test | `tests/unit/designSystem/subNavigationRowStructureToken.test.ts` |
| Rendered proof | `/design-system/default/tokens/sub-navigation-row-structure` |
| Consumer proof | `/design-system/default/patterns/sub-navigation` |
