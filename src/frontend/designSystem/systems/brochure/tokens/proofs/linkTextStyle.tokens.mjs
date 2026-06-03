import { linkTextStyleTokenContract } from "../../../../layers/02-token/link-text-style/contract.mjs";

const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "link-text-style",
  previewKind: "text-style-sample",
  variantSchema: {
    valueFields: [
      "linkRole",
      "fontFamilyValue",
      "fontSizeValue",
      "fontWeightValue",
      "lineHeightValue",
      "letterSpacingValue",
      "textTransform",
      "foregroundValue",
      "hoverForegroundValue",
      "layoutContext",
    ],
    metadataFields: ["linkRole", "layoutContext", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

const variantsInput = [
  {
    id: "link-text-style-standalone",
    tokenName: "--link-text-style-standalone",
    linkRole: "standalone text link",
    fontFamilyValue: fontFamily,
    fontSizeValue: "1rem",
    fontWeightValue: "600",
    lineHeightValue: "1.6",
    letterSpacingValue: "0",
    textTransform: "none",
    foregroundValue: "#174d54",
    hoverForegroundValue: "#1f6f78",
    layoutContext: "standalone public brochure evidence and related navigation links",
    sample: "View the brochure design-system variant",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "brochure-text-link-action",
  tokenType: "link-text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/link-text-style/LinkTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/link-text-style/LinkTextStyle-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/link-text-style",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/link-text-style/index.html",
    title: "Link Text Style Tokens",
    description: "Review governed brochure text-link typography and foreground values before link primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/link-text-style/contract.mjs",
    contractExport: "linkTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/link-text-style/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/linkTextStyle.tokens.mjs",
    systemTokenExport: "linkTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      linkRole: variant.linkRole,
      fontFamilyValue: variant.fontFamilyValue,
      fontSizeValue: variant.fontSizeValue,
      fontWeightValue: variant.fontWeightValue,
      lineHeightValue: variant.lineHeightValue,
      letterSpacingValue: variant.letterSpacingValue,
      textTransform: variant.textTransform,
      foregroundValue: variant.foregroundValue,
      hoverForegroundValue: variant.hoverForegroundValue,
      layoutContext: variant.layoutContext,
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: `${variant.foregroundValue} / ${variant.hoverForegroundValue}`,
      formulaOrMapping: "system implementation value promoted from current brochure text-link treatment",
      renderedValue: `${variant.fontSizeValue} / ${variant.lineHeightValue} at weight ${variant.fontWeightValue}`,
    },
    preview: {
      kind: "text-style-sample",
      sample: variant.sample,
      background: "#fffdf8",
      foreground: variant.foregroundValue,
      fontFamily: variant.fontFamilyValue,
      fontSize: variant.fontSizeValue,
      fontWeight: variant.fontWeightValue,
      lineHeight: variant.lineHeightValue,
      letterSpacing: variant.letterSpacingValue,
      textTransform: variant.textTransform,
      label: variant.linkRole,
    },
    metadata: {
      linkRole: variant.linkRole,
      layoutContext: variant.layoutContext,
      theme: "original",
      accessibility: "Link text must be paired with signed underline decoration and visible focus behavior.",
    },
    useCaseInstructions: [
      `Use for ${variant.layoutContext}.`,
      "Do not use for buttons, tabs, selected states, inline prose links, or non-navigation actions.",
      "Pair with link-decoration, focus-ring, and target-size tokens inside the link primitive.",
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.fontSizeValue} / ${variant.value.lineHeightValue}, ${variant.value.fontWeightValue}`,
    role: variant.value.linkRole,
    linkRole: variant.value.linkRole,
    fontFamilyValue: variant.value.fontFamilyValue,
    fontSizeValue: variant.value.fontSizeValue,
    fontWeightValue: variant.value.fontWeightValue,
    lineHeightValue: variant.value.lineHeightValue,
    letterSpacingValue: variant.value.letterSpacingValue,
    textTransform: variant.value.textTransform,
    foregroundValue: variant.value.foregroundValue,
    hoverForegroundValue: variant.value.hoverForegroundValue,
    layoutContext: variant.value.layoutContext,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const linkTextStyleTokenVariants = variants.map(toPageVariant);

export const linkTextStyleTokenSpec = {
  contractId: linkTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern brochure text-link typography and foreground values without defining anchor behavior.",
  tokenTypeTemplate,
  summaryPanels: [{ label: "Link", title: "Standalone text link", variantId: "link-text-style-standalone" }],
  variantFields: [
    ["linkRole", "Role"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["foregroundValue", "Foreground"],
    ["hoverForegroundValue", "Hover foreground"],
    ["layoutContext", "Layout context"],
  ],
  variants: linkTextStyleTokenVariants,
  consumerRestrictions: linkTextStyleTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render the standalone link text sample as text.",
    "The link primitive must consume this token with link-decoration and focus-ring tokens.",
  ],
};
