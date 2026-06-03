export const panelStackPlacementTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.panel-stack-placement",
  tokenType: "panel-stack-placement",
  requiredVariantRoles: ["panel stack placement"],
  requiredValueFields: [
    "placementRole",
    "originSides",
    "desktopAdjacencyGapValue",
    "overlayInsetValue",
    "mobileBreakpointValue",
    "layerBaseValue",
    "layerStepValue",
    "coveredPanelBehavior",
  ],
  consumerRules: [
    "Every design system must expose governed panel-stack placement values before reusable panel-stack primitives or patterns own side-by-side adjacency, overlay inset, or layering order.",
    "Consumers must use the runtime seam instead of local stack gap, overlay inset, z-index base, z-index step, or mobile breakpoint literals.",
    "This token does not define panel surface values, panel header geometry, close behavior, focus behavior, selectable-card behavior, search behavior, route topology, or app adoption.",
  ],
};
