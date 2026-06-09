export const drawerOverlayPlacementTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.drawer-overlay-placement",
  tokenType: "drawer-overlay-placement",
  requiredVariantRoles: ["drawer page-shell overlay"],
  requiredValueFields: [
    "placementRole",
    "positionValue",
    "insetValue",
    "inlineSizeValue",
    "blockSizeValue",
    "layerValue",
    "underlayBehavior",
  ],
  consumerRules: [
    "Every design system must expose governed drawer overlay placement values before drawer-select or later drawer patterns can occupy the page-shell content region.",
    "Consumers must use the runtime seam instead of local fixed-position, page-shell-size, inset, or z-index literals.",
    "This token does not define panel surface colors, panel stack order, search behavior, selectable-card behavior, close behavior, focus trapping, or app adoption.",
  ],
};
