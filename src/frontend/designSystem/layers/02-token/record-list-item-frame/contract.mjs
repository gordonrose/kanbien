export const recordListItemFrameTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.record-list-item-frame",
  tokenType: "record-list-item-frame",
  requiredVariantRoles: [
    "item row",
    "selected item row",
    "disabled item row",
  ],
  requiredValueFields: [
    "frameRole",
    "backgroundValue",
    "foregroundValue",
    "supportingForegroundValue",
    "borderValue",
    "radiusValue",
    "paddingBlockValue",
    "paddingInlineValue",
    "gapValue",
    "minBlockSize",
    "motionValue",
  ],
  consumerRules: [
    "Every design system must expose governed item row, selected row, and disabled row values before item-list primitives own those visuals.",
    "Consumers must use the runtime seam instead of local row surface, border, padding, radius, or motion literals.",
    "Selected rows must not add a leading vertical strip; selection is communicated by selected surface, border, and primitive-owned programmatic state.",
    "This token does not define row activation, keyboard movement, drag/drop affordances, drawer composition, board columns, or app adoption.",
  ],
};
