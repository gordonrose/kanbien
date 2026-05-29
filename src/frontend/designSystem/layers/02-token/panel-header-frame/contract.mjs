export const panelHeaderFrameTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.panel-header-frame",
  tokenType: "panel-header-frame",
  requiredVariantRoles: ["panel header"],
  requiredValueFields: [
    "frameRole",
    "backgroundValue",
    "foregroundValue",
    "borderValue",
    "gapValue",
    "blockSize",
    "minBlockSize",
    "maxBlockSizeValue",
    "stickyInsetBlockStart",
    "scrollBehavior",
  ],
  consumerRules: [
    "Every design system must expose governed generic panel header frame values before reusable panel header primitives own header height, separator, sticky inset, or title/action gap.",
    "Consumers must use the runtime seam instead of local panel header height, separator, sticky inset, or gap literals.",
    "This token does not define panel shell width, panel actions, body scrolling, navigation semantics, form controls, route selection, workflow behavior, or app adoption.",
  ],
};
