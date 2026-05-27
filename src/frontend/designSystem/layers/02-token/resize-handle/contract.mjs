export const resizeHandleTokenContract = {
  contractId: "tokens.resize-handle",
  layer: "02-token",
  tokenType: "resize-handle",
  sharedContractPath: "docs/design-system/02-token/shared/resize-handle/ResizeHandle-Contract.md",
  requiredRoles: ["inline resize handle"],
  requiredFields: [
    "handleRole",
    "placement",
    "hitAreaInlineSize",
    "visualInlineSize",
    "visualRadiusValue",
    "minBlockSize",
    "cursorValue",
    "touchActionValue",
    "visualColorValue",
  ],
  allowedConsumers: ["03-primitive", "04-pattern-contract"],
};
