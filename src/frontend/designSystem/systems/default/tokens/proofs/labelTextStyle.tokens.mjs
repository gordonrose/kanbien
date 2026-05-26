import { labelTextStyleTokenContract } from "../../../../layers/02-token/label-text-style/contract.mjs";

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
  uiFamily: "label-text-style",
  tokenType: "text-style",
  status: "review-ready",
  behaviorRulePath:
    "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/label-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/label-text-style/index.html",
    title: "Label Text Style Tokens",
    description: "Review governed typography for short text labels before text primitives consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/label-text-style/contract.mjs",
    contractExport: "labelTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/labelTextStyle.tokens.mjs",
    systemTokenExport: "labelTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  dependencies: [],
  diagnostic: {
    kind: "none",
    rule: "No upstream token dependency exists for this standalone typography style.",
  },
  variants: [
    {
      id: "label-text-style-short-default",
      tokenName: "--label-text-style-short-default",
      value: {
        textStyleRole: "short label text",
        fontFamilyValue: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontFallbackRule: "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        fontSizeValue: "0.8125rem",
        fontWeightValue: "700",
        lineHeightValue: "1.25",
        letterSpacingValue: "0",
        textTransform: "none",
        overflowReadiness: "Supports single-line truncation by preserving stable line height and no negative letter spacing.",
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "none",
        formulaOrMapping: "none",
        renderedValue: "0.8125rem / 1.25 at weight 700",
      },
      preview: {
        kind: "text-style-sample",
        sample: "Organization label with long text",
        background: "#ffffff",
        foreground: "#20242c",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontSize: "0.8125rem",
        fontWeight: "700",
        lineHeight: "1.25",
        letterSpacing: "0",
        textTransform: "none",
        label: "Short label text",
      },
      metadata: {
        textStyleRole: "short label text",
        theme: "all",
        state: "none",
        accessibility: "Text style must remain readable under zoom and must not create overlap when truncation is applied.",
      },
      useCaseInstructions: [
        "Use for short governed labels, chips, compact headings, and small navigation labels after primitive gates pass.",
        "Do not use as body text, error text, code text, hero text, or status meaning.",
        "When the label can overflow, preserve the text-overflow-disclosure behavior rule.",
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

export const labelTextStyleTokenVariants = variants.map(toPageVariant);

export const labelTextStyleTokenSpec = {
  contractId: labelTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a complete short-label typography style. It does not define color, truncation behavior, or tooltip disclosure.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Short label",
      title: "Stable compact label typography",
      variantId: "label-text-style-short-default",
      supportingText: "Size, weight, line height, and letter spacing move together as one governed style.",
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
  variants: labelTextStyleTokenVariants,
  consumerRestrictions: [
    "Consumers must use this token instead of local font-size, font-weight, line-height, or letter-spacing literals for short labels.",
    "Consumers must preserve the complete font family fallback stack.",
    "Consumers must not treat this token as body text, status text, error text, or link text.",
    "This token does not replace the text-overflow-disclosure behavior rule.",
    "App pages must not recreate this typography style with local CSS.",
  ],
  requiredEvidence: [
    "The text-style sample must render as text, not only as metadata.",
    "The proof must expose the fallback stack as part of the governed token value.",
    "150% zoom must keep the sample readable and non-overlapping.",
    "RTL rendering must preserve readable label text.",
    "The proof must state that truncation behavior and tooltip disclosure remain later-layer work.",
  ],
};
