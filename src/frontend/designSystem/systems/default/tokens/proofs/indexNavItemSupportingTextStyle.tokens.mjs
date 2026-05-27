import { indexNavItemSupportingTextStyleTokenContract } from "../../../../layers/02-token/index-nav-item-supporting-text-style/contract.mjs";

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

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav-item",
  tokenType: "text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-item-supporting-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-item-supporting-text-style/index.html",
    title: "Index Nav Item Supporting Text Style Token",
    description: "Review governed typography for secondary supporting text inside index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/contract.mjs",
    contractExport: "indexNavItemSupportingTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSupportingTextStyle.tokens.mjs",
    systemTokenExport: "indexNavItemSupportingTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "index-nav-item-supporting-text-style-default",
      tokenName: "--index-nav-item-supporting-text-style-default",
      value: {
        textStyleRole: "index nav item supporting text",
        fontFamilyValue: fontFamily,
        fontFallbackRule: "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        fontSizeValue: "0.75rem",
        fontWeightValue: "800",
        lineHeightValue: "1.2",
        letterSpacingValue: "0",
        textTransform: "none",
        overflowReadiness: "Supports single-line truncation by preserving stable line height and no negative letter spacing.",
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "none",
        formulaOrMapping: "system implementation value",
        renderedValue: "0.75rem / 1.2 at weight 800",
      },
      preview: {
        kind: "text-style-sample",
        sample: "3 items with long supporting text",
        background: "inherit",
        foreground: "inherit",
        fontFamily,
        fontSize: "0.75rem",
        fontWeight: "800",
        lineHeight: "1.2",
        letterSpacing: "0",
        textTransform: "none",
        label: "Supporting text",
      },
      metadata: {
        textStyleRole: "index nav item supporting text",
        theme: "all",
        state: "none",
        accessibility: "Supporting text style must remain readable under zoom and must not depend on opacity for hierarchy.",
      },
      useCaseInstructions: [
        "Use for secondary supporting text inside governed index-navigation item controls.",
        "Do not use as primary label text, body text, error text, status text, or tooltip text.",
        "When supporting text can overflow, preserve single-line truncation and inherit foreground from the consuming item context.",
      ],
    },
  ],
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

export const indexNavItemSupportingTextStyleTokenVariants = variants.map(toPageVariant);

export const indexNavItemSupportingTextStyleTokenSpec = {
  contractId: indexNavItemSupportingTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-item-supporting-text-style",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs the secondary supporting text style inside an index-navigation item.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Supporting text",
      title: "Compact secondary row",
      variantId: "index-nav-item-supporting-text-style-default",
      supportingText: "Typography is tokenized separately from primary label text.",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["fontFallbackRule", "Font fallback rule"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["letterSpacingValue", "Letter spacing"],
    ["textTransform", "Transform"],
    ["overflowReadiness", "Overflow readiness"],
    ["zoomBehavior", "Zoom behavior"],
  ],
  variants: indexNavItemSupportingTextStyleTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling supporting text locally.",
    "Consumers must not use opacity as an unsigned hierarchy or contrast value.",
    "This token does not define count calculation, item state, foreground color, or tooltip behavior.",
  ],
  requiredEvidence: [
    "The text-style sample must render as text.",
    "The proof must expose the fallback stack.",
    "The rendered sample must inherit foreground from its proof context instead of hard-coding colour.",
    "150% zoom must keep supporting text readable and non-overlapping.",
  ],
};
