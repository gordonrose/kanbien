export const subNavigationRowStructureTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.sub-navigation-row-structure",
  tokenType: "sub-navigation-row-structure",
  requiredVariantRoles: ["sub-navigation row structure"],
  requiredValueFields: [
    "layoutRole",
    "columnCount",
    "minimumColumnInlineSize",
    "gapValue",
    "collapseBehavior",
    "lanes",
  ],
  requiredLaneFields: [
    "id",
    "label",
    "startColumn",
    "endColumn",
    "minimumColumns",
    "purpose",
  ],
  consumerRules: [
    "Every design system must expose governed sub-navigation row structure values before reusable sub-navigation patterns own breadcrumb and search row-width negotiation.",
    "Consumers must use the runtime seam instead of local sub-navigation column spans, lane ids, or collapse order.",
    "This token does not define breadcrumb item behavior, search input behavior, component seams, product workflow, or app adoption.",
  ],
};
