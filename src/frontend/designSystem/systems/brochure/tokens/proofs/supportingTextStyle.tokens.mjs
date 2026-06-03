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
  designSystem: "brochure",
  uiFamily: "supporting-text",
  tokenType: "text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/brochure/supporting-text-style/SupportingTextStyle-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/supporting-text-style",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/supporting-text-style/index.html",
    title: "Supporting Text Style Token",
    description: "Review governed typography for secondary supporting text inside compact UIs.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/supporting-text-style/contract.mjs",
    contractExport: "supportingTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/supportingTextStyle.tokens.mjs",
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
        fontSizeValue: "1rem",
        fontWeightValue: "400",
        lineHeightValue: "1.6",
        letterSpacingValue: "0",
        textTransform: "none",
        overflowReadiness: "Supports single-line truncation by preserving stable line height and no negative letter spacing.",
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "none",
        formulaOrMapping: "system implementation value",
        renderedValue: "1rem / 1.6 at weight 400",
      },
      preview: {
        kind: "text-style-sample",
        sample: "Secondary brochure copy with enough length to check line rhythm",
        background: "#fffdf8",
        foreground: "#53616f",
        fontFamily,
        fontSize: "1rem",
        fontWeight: "400",
        lineHeight: "1.6",
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
        "When supporting text can overflow, preserve signed overflow behavior and inherit foreground from the consuming item context.",
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
      title: "Brochure supporting copy",
      variantId: "supporting-text-style-default",
      supportingText: "A calmer copy rhythm is tokenized separately from compact labels.",
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
    "The rendered sample must expose the brochure supporting foreground without turning it into a semantic status color.",
    "150% zoom must keep supporting text readable and non-overlapping.",
  ],
};
