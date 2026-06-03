import { tooltipTextStyleTokenContract } from "../../../../layers/02-token/tooltip-text-style/contract.mjs";

const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "text-style",
  previewKind: "text-style-sample",
  variantSchema: {
    valueFields: [
      "textStyleRole",
      "fontFamilyValue",
      "fontFallbackRule",
      "fontSizeValue",
      "fontWeightValue",
      "lineHeightValue",
      "letterSpacingValue",
      "textTransform",
      "overflowReadiness",
      "zoomBehavior",
    ],
    metadataFields: ["textStyleRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "overflowRule"],
  },
};

const variantsInput = [
  {
    id: "tooltip-text-style-brochure",
    tokenName: "--tooltip-text-style-brochure",
    textStyleRole: "tooltip disclosure text",
    fontFamilyValue: fontFamily,
    fontFallbackRule: "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
    fontSizeValue: "0.8125rem",
    fontWeightValue: "600",
    lineHeightValue: "1.35",
    letterSpacingValue: "0",
    textTransform: "none",
    overflowReadiness: "Supports readable wrapped disclosure text within the brochure tooltip-surface max inline size.",
    zoomBehavior: "Must remain readable and contained at 150% zoom.",
    sample: "View the governed brochure evidence section pattern proof.",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "brochure-text-link-action",
  tokenType: "text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/tooltip-text-style/TooltipTextStyle-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/tooltip-text-style",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/tooltip-text-style/index.html",
    title: "Tooltip Text Style Tokens",
    description: "Review governed brochure disclosure text typography before text-link primitives consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/tooltip-text-style/contract.mjs",
    contractExport: "tooltipTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/tooltipTextStyle.tokens.mjs",
    systemTokenExport: "tooltipTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      textStyleRole: variant.textStyleRole,
      fontFamilyValue: variant.fontFamilyValue,
      fontFallbackRule: variant.fontFallbackRule,
      fontSizeValue: variant.fontSizeValue,
      fontWeightValue: variant.fontWeightValue,
      lineHeightValue: variant.lineHeightValue,
      letterSpacingValue: variant.letterSpacingValue,
      textTransform: variant.textTransform,
      overflowReadiness: variant.overflowReadiness,
      zoomBehavior: variant.zoomBehavior,
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: "none",
      formulaOrMapping: "brochure system implementation value for text-link full-text disclosure",
      renderedValue: `${variant.fontSizeValue} / ${variant.lineHeightValue} at weight ${variant.fontWeightValue}`,
    },
    preview: {
      kind: "text-style-sample",
      sample: variant.sample,
      background: "#123f46",
      foreground: "#fffdf8",
      fontFamily: variant.fontFamilyValue,
      fontSize: variant.fontSizeValue,
      fontWeight: variant.fontWeightValue,
      lineHeight: variant.lineHeightValue,
      letterSpacing: variant.letterSpacingValue,
      textTransform: variant.textTransform,
      label: variant.textStyleRole,
    },
    metadata: {
      textStyleRole: variant.textStyleRole,
      theme: "all",
      state: "overflow disclosure",
      accessibility: "Tooltip disclosure text must remain readable when full link text wraps inside the tooltip surface.",
    },
    useCaseInstructions: [
      "Use for full-text disclosure content inside governed brochure text-link tooltip surfaces.",
      "Do not use as compact labels, body text, error text, code text, hero text, or status meaning.",
      "When disclosure text is shown, preserve the brochure text-link overflow behavior and tooltip-surface pairing.",
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.fontSizeValue} / ${variant.value.lineHeightValue}, ${variant.value.fontWeightValue}`,
    role: variant.metadata.textStyleRole,
    fontFamilyValue: variant.value.fontFamilyValue,
    fontFallbackRule: variant.value.fontFallbackRule,
    fontSizeValue: variant.value.fontSizeValue,
    fontWeightValue: variant.value.fontWeightValue,
    lineHeightValue: variant.value.lineHeightValue,
    letterSpacingValue: variant.value.letterSpacingValue,
    textTransform: variant.value.textTransform,
    overflowReadiness: variant.value.overflowReadiness,
    zoomBehavior: variant.value.zoomBehavior,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Overflow", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const tooltipTextStyleTokenVariants = variants.map(toPageVariant);

export const tooltipTextStyleTokenSpec = {
  contractId: tooltipTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs brochure disclosure typography without defining trigger behavior, placement, or dismissal.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Tooltip text", title: "Brochure disclosure text", variantId: "tooltip-text-style-brochure" },
  ],
  variantFields: [
    ["role", "Role"],
    ["fontFallbackRule", "Font fallback rule"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["overflowReadiness", "Overflow readiness"],
    ["zoomBehavior", "Zoom behavior"],
  ],
  variants: tooltipTextStyleTokenVariants,
  consumerRestrictions: tooltipTextStyleTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render the disclosure text style sample.",
    "The brochure text-link primitive must consume this token when long labels overflow.",
  ],
};
