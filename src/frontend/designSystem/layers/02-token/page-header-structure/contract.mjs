export const pageHeaderStructureTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.page-header-structure",
  tokenType: "page-header-structure",
  requiredVariantRoles: ["page header structure"],
  requiredValueFields: [
    "layoutRole",
    "visibleColumnCount",
    "gapValue",
    "collapseBehavior",
    "regions",
  ],
  requiredRegionFields: [
    "id",
    "label",
    "startColumn",
    "endColumn",
    "purpose",
  ],
  consumerRules: [
    "Every design system must expose governed page-header structure values before reusable populated page header patterns own region placement.",
    "Consumers must use the runtime seam instead of local page-header column spans, region ids, or collapse semantics.",
    "This token does not define populated title copy, badge semantics, action behavior, primitive markup, component seams, product workflow, or app adoption.",
  ],
};
