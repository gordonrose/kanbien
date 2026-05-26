import { tooltipTextStyleTokenContract } from "../../../../contracts/tokens/tooltipTextStyle.contract.mjs";

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
  uiFamily: "tooltip-text-style",
  tokenType: "text-style",
  status: "review-ready",
  behaviorRulePath:
    "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/tooltip-text-style/TooltipTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/tooltip-text-style/TooltipTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/tooltip-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/tooltip-text-style/index.html",
    title: "Tooltip Text Style Tokens",
    description: "Review governed typography for full-text disclosure content inside tooltip surfaces.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/contracts/tokens/tooltipTextStyle.contract.mjs",
    contractExport: "tooltipTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/tooltipTextStyle.tokens.mjs",
    systemTokenExport: "tooltipTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  dependencies: [],
  diagnostic: {
    kind: "none",
    rule: "No upstream token dependency exists for this standalone tooltip text typography style.",
  },
  variants: [
    {
      id: "tooltip-text-style-default",
      tokenName: "--tooltip-text-style-default",
      value: {
        textStyleRole: "tooltip disclosure text",
        fontFamilyValue: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontFallbackRule: "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        fontSizeValue: "0.8125rem",
        fontWeightValue: "600",
        lineHeightValue: "1.35",
        letterSpacingValue: "0",
        textTransform: "none",
        overflowReadiness: "Supports readable wrapped disclosure text within the tooltip-surface max inline size.",
        zoomBehavior: "Must remain readable and contained at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "none",
        formulaOrMapping: "none",
        renderedValue: "0.8125rem / 1.35 at weight 600",
      },
      preview: {
        kind: "text-style-sample",
        sample: "Organization label with long text that is fully available here.",
        background: "#111827",
        foreground: "#ffffff",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontSize: "0.8125rem",
        fontWeight: "600",
        lineHeight: "1.35",
        letterSpacing: "0",
        textTransform: "none",
        label: "Tooltip disclosure text",
      },
      metadata: {
        textStyleRole: "tooltip disclosure text",
        theme: "all",
        state: "none",
        accessibility: "Tooltip disclosure text must remain readable when full text wraps inside the tooltip surface.",
      },
      useCaseInstructions: [
        "Use for full-text disclosure content inside governed tooltip surfaces after primitive gates pass.",
        "Do not use as compact labels, body text, error text, code text, hero text, or status meaning.",
        "When disclosure text is shown, preserve the text-overflow-disclosure behavior rule and tooltip-surface pairing.",
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

export const tooltipTextStyleTokenVariants = variants.map(toPageVariant);

export const tooltipTextStyleTokenSpec = {
  contractId: tooltipTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a complete typography style for full-text disclosure inside tooltip surfaces. It does not define tooltip behavior or placement.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Tooltip text",
      title: "Readable disclosure typography",
      variantId: "tooltip-text-style-default",
      supportingText: "Full-text disclosure uses a slightly lighter weight and taller line height than compact labels.",
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
  variants: tooltipTextStyleTokenVariants,
  consumerRestrictions: [
    "Consumers must use this token instead of local font-size, font-weight, line-height, or letter-spacing literals for tooltip disclosure text.",
    "Consumers must preserve the complete font family fallback stack.",
    "Consumers must pair this typography with an approved tooltip-surface foreground/background before rendering full disclosure text.",
    "This token does not replace the text-overflow-disclosure behavior rule or tooltip primitive behavior.",
  ],
  requiredEvidence: [
    "The text-style sample must render as text on a tooltip-like background, not only as metadata.",
    "The proof must expose the fallback stack as part of the governed token value.",
    "150% zoom must keep the sample readable and non-overlapping.",
    "RTL rendering must preserve readable disclosure text.",
    "The proof must state that tooltip trigger behavior, placement, dismissal, and ARIA remain later-layer work.",
  ],
};
