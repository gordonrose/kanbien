import { indexNavItemPaddingTokenContract } from "../../../../layers/02-token/index-nav-item-padding/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "padding",
  previewKind: "padding-box",
  variantSchema: {
    valueFields: ["paddingRole", "axis", "lengthValue", "densityMapping", "directionBehavior", "targetSizeImpact"],
    metadataFields: ["paddingRole", "axis", "directionBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "targetSizeImpact"],
  },
};

function makeVariant({ id, tokenName, role, axis, value }) {
  return {
    id,
    tokenName,
    value: {
      paddingRole: role,
      axis,
      lengthValue: value,
      densityMapping: "default dense index navigation",
      directionBehavior: axis === "inline" ? "logical inline padding mirrors in RTL" : "logical block padding is unchanged by RTL",
      targetSizeImpact: "Contributes to visual comfort but does not replace minimum-target-size.",
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: value,
      formulaOrMapping: "system implementation value",
      renderedValue: value,
    },
    preview: {
      kind: "padding-box",
      sample: role,
      paddingBlock: axis === "block" ? value : "0.625rem",
      paddingInline: axis === "inline" ? value : "0.75rem",
      background: "#ffffff",
      foreground: "#111827",
      border: "#dbe4f0",
      label: role,
    },
    metadata: {
      paddingRole: role,
      axis,
      directionBehavior: axis === "inline" ? "logical inline" : "logical block",
      accessibility: "Padding alone does not prove target size; the primitive must also consume minimum-target-size.",
    },
    useCaseInstructions: [
      "Use for internal spacing inside governed rectangular index-navigation item controls.",
      "Do not use as general card, panel, list, or app-route padding.",
      "Pair with the minimum-target-size token for interactive controls.",
    ],
  };
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav-item",
  tokenType: "padding",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/index-nav-item-padding/IndexNavItemPadding-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/index-nav-item-padding/IndexNavItemPadding-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-item-padding",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-item-padding/index.html",
    title: "Index Nav Item Padding Tokens",
    description: "Review governed logical padding for rectangular index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-item-padding/contract.mjs",
    contractExport: "indexNavItemPaddingTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemPadding.tokens.mjs",
    systemTokenExport: "indexNavItemPaddingTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    makeVariant({
      id: "index-nav-item-padding-block",
      tokenName: "--index-nav-item-padding-block",
      role: "index nav item block padding",
      axis: "block",
      value: "0.625rem",
    }),
    makeVariant({
      id: "index-nav-item-padding-inline",
      tokenName: "--index-nav-item-padding-inline",
      role: "index nav item inline padding",
      axis: "inline",
      value: "0.75rem",
    }),
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.lengthValue,
    paddingRole: variant.value.paddingRole,
    axis: variant.value.axis,
    lengthValue: variant.value.lengthValue,
    densityMapping: variant.value.densityMapping,
    directionBehavior: variant.value.directionBehavior,
    targetSizeImpact: variant.value.targetSizeImpact,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Target size", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const indexNavItemPaddingTokenVariants = variants.map(toPageVariant);

export const indexNavItemPaddingTokenSpec = {
  contractId: indexNavItemPaddingTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-item-padding",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern the internal logical padding for rectangular index-navigation items.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Padding",
      title: "Logical frame",
      variantId: "index-nav-item-padding-inline",
      supportingText: "Inline spacing mirrors in RTL; target size remains a separate primitive obligation.",
    },
  ],
  variantFields: [
    ["paddingRole", "Role"],
    ["axis", "Axis"],
    ["lengthValue", "Length"],
    ["directionBehavior", "Direction behavior"],
    ["targetSizeImpact", "Target-size impact"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: indexNavItemPaddingTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding index item padding.",
    "This token does not approve activation behavior, selected state, disabled state, or minimum target size by itself.",
  ],
  requiredEvidence: [
    "Desktop and mobile proof routes must show block and inline padding without horizontal overflow.",
    "The rendered proof must expose that padding is logical and does not replace minimum-target-size.",
  ],
};
