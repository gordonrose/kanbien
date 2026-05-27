import { iconSizeTokenContract } from "../../../../layers/02-token/icon-size/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "icon-size",
  previewKind: "icon-size-sample",
  variantSchema: {
    valueFields: ["iconRole", "inlineSize", "blockSize", "viewBox"],
    metadataFields: ["iconRole", "viewBox", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "accessibility"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-navigation",
  tokenType: "icon-size",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/icon-size/IconSize-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/icon-size/IconSize-Implementation.md",
  page: {
    route: "/design-system/default/tokens/icon-size",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/icon-size/index.html",
    title: "Icon Size Token",
    description: "Review the governed visual glyph size used by icon-button primitives.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/icon-size/contract.mjs",
    contractExport: "iconSizeTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/iconSize.tokens.mjs",
    systemTokenExport: "iconSizeTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: [
    {
      id: "icon-size-button-glyph-default",
      tokenName: "--icon-button-glyph-size",
      value: {
        iconRole: "icon button glyph",
        inlineSize: "1rem",
        blockSize: "1rem",
        viewBox: "24",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "1rem",
        formulaOrMapping: "system implementation value",
        renderedValue: "1rem",
      },
      preview: {
        kind: "icon-size-sample",
        sample: "plus",
        inlineSize: "1rem",
        blockSize: "1rem",
        background: "inherit",
        foreground: "inherit",
        label: "Icon button glyph",
      },
      metadata: {
        iconRole: "icon button glyph",
        viewBox: "24",
        accessibility: "Icon size is visual only; the icon-button primitive must provide an accessible name and consume minimum-target-size.",
      },
      useCaseInstructions: [
        "Use for the visible glyph inside governed icon-button primitives.",
        "Do not use as the interactive target size, button frame, or icon-only accessible name.",
        "Pair with minimum-target-size, focus-ring, and a signed surface/frame token in interactive primitives.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    iconRole: variant.value.iconRole,
    inlineSize: variant.value.inlineSize,
    blockSize: variant.value.blockSize,
    viewBox: variant.value.viewBox,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const iconSizeTokenVariants = variants.map(toPageVariant);

export const iconSizeTokenSpec = {
  contractId: iconSizeTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "icon-size",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This token governs visual icon glyph size, not interactive target size.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Glyph",
      title: "Icon button glyph",
      variantId: "icon-size-button-glyph-default",
      supportingText: "The hit area remains owned by minimum-target-size.",
    },
  ],
  variantFields: [
    ["iconRole", "Role"],
    ["inlineSize", "Inline size"],
    ["blockSize", "Block size"],
    ["viewBox", "ViewBox basis"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: iconSizeTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding SVG width or height inside icon-button primitives.",
    "This token does not approve icon-button frame, focus, action semantics, or target size.",
  ],
  requiredEvidence: [
    "Rendered proof must show the glyph size and state that target size is separately governed.",
    "Icon-button primitives must consume this token plus minimum-target-size before later patterns use icon-only actions.",
  ],
};
