import { supportingTextStyleTokenContract } from "../../../../layers/02-token/supporting-text-style/contract.mjs";

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
  uiFamily: "supporting-text",
  tokenType: "text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/supporting-text-style/SupportingTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/supporting-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/supporting-text-style/index.html",
    title: "Supporting Text Style Token",
    description: "Review governed typography for secondary supporting text inside compact UIs.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/supporting-text-style/contract.mjs",
    contractExport: "supportingTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/supportingTextStyle.tokens.mjs",
    systemTokenExport: "supportingTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "supporting-text-style-default",
      tokenName: "--supporting-text-style-default",
      value: {
        textStyleRole: "supporting text",
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
        textStyleRole: "supporting text",
        theme: "all",
        state: "none",
        accessibility: "Supporting text style must remain readable under zoom and must not depend on opacity for hierarchy.",
      },
      useCaseInstructions: [
        "Use for secondary supporting text inside governed compact UI controls.",
        "Do not use as primary label text, body text, error text, status text, or tooltip text.",
        "When supporting text can overflow, preserve single-line truncation and inherit foreground from the consuming item context.",
      ],
    },
    {
      id: "supporting-text-style-control-eyebrow",
      tokenName: "--supporting-text-style-control-eyebrow",
      value: {
        textStyleRole: "control eyebrow text",
        fontFamilyValue: fontFamily,
        fontFallbackRule: "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        fontSizeValue: "0.75rem",
        fontWeightValue: "800",
        lineHeightValue: "1.2",
        letterSpacingValue: "0",
        textTransform: "uppercase",
        overflowReadiness: "Supports short single-line control labels without wrapping or negative letter spacing.",
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "supporting-text-style-default",
        sourceValue: "0.75rem / 1.2 at weight 800",
        formulaOrMapping: "same compact supporting style with uppercase transform for field-like control eyebrows",
        renderedValue: "0.75rem / 1.2 at weight 800 uppercase",
      },
      preview: {
        kind: "text-style-sample",
        sample: "Layer",
        background: "inherit",
        foreground: "inherit",
        fontFamily,
        fontSize: "0.75rem",
        fontWeight: "800",
        lineHeight: "1.2",
        letterSpacing: "0",
        textTransform: "uppercase",
        label: "Control eyebrow",
      },
      metadata: {
        textStyleRole: "control eyebrow text",
        theme: "all",
        state: "none",
        accessibility: "Control eyebrow text must remain readable under zoom and must not depend on opacity for hierarchy.",
      },
      useCaseInstructions: [
        "Use for short field-like eyebrow labels inside governed compact controls.",
        "Do not use as primary label text, body text, error text, status text, or tooltip text.",
        "When control eyebrow text can overflow, preserve single-line truncation and inherit foreground from the consuming control context.",
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

export const supportingTextStyleTokenVariants = variants.map(toPageVariant);

export const supportingTextStyleTokenSpec = {
  contractId: supportingTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "supporting-text-style",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs secondary supporting text style inside compact UI controls.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Supporting text",
      title: "Compact secondary row",
      variantId: "supporting-text-style-default",
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
  variants: supportingTextStyleTokenVariants,
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
