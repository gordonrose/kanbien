export const dropdownTriggerFrameTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.dropdown-trigger-frame",
  tokenType: "dropdown-trigger-frame",
  requiredVariantRoles: ["dropdown trigger frame"],
  requiredStates: ["default", "open", "disabled", "error"],
  consumerRules: [
    "Consumers must use this token for governed simple dropdown trigger frame visuals.",
    "Consumers must not reuse text-control-frame for dropdown triggers.",
    "This token does not define listbox semantics, option behavior, keyboard behavior, popup positioning, glyphs, validation copy, or app adoption.",
  ],
};
