export const listMarkerStyleTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.list-marker-style",
  tokenType: "list-marker-style",
  requiredVariantRoles: ["bullet marker", "process marker", "tag marker"],
  requiredThemes: ["all"],
  requiredVariantFields: ["id", "tokenName", "value", "preview", "metadata", "useCaseInstructions"],
  valueFields: [
    "markerRole",
    "inlineSizeValue",
    "blockSizeValue",
    "radiusValue",
    "backgroundValue",
    "borderValue",
    "layoutContext",
  ],
  metadataFields: ["markerRole", "layoutContext", "theme", "accessibility"],
  useCaseInstructionFields: ["allowedUse", "forbiddenUse", "meaningRule"],
  consumerRules: [
    "Consumers must use this token for governed list markers instead of local pseudo-element size, radius, or color literals.",
    "Markers must not be the only carrier of status, validation, or selected meaning.",
    "This token does not define list item spacing, text style, or list semantics.",
  ],
};
