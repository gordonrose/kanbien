import { typographyScaleTokenContract } from "../../../../layers/02-token/typography-scale/contract.mjs";

const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "typography-scale",
  previewKind: "text-style-sample",
  variantSchema: {
    valueFields: [
      "textStyleRole",
      "fontFamilyValue",
      "fontSizeValue",
      "fontWeightValue",
      "lineHeightValue",
      "letterSpacingValue",
      "textTransform",
      "layoutContext",
      "zoomBehavior",
    ],
    metadataFields: ["textStyleRole", "layoutContext", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "overflowRule"],
  },
};

const variantsInput = [
  ["typography-eyebrow", "--typography-eyebrow", "eyebrow text", "0.76rem", "800", "1.2", "0", "uppercase", "section kickers and card kickers", "FLOW"],
  ["typography-page-title", "--typography-page-title", "page title", "1.4rem", "800", "1.2", "0", "none", "brochure page h1 text", "A public version of the pipeline"],
  ["typography-section-heading", "--typography-section-heading", "section heading", "1.15rem", "800", "1.25", "0", "none", "section headings and detail panel headings", "Evidence in the repo"],
  ["typography-body-copy", "--typography-body-copy", "body copy", "1rem", "400", "1.68", "0", "none", "brochure paragraphs and lede copy", "The public evidence is the shape of the governed front-end harness."],
  ["typography-card-heading", "--typography-card-heading", "section heading", "clamp(1.18rem, 1.7vw, 1.45rem)", "800", "1.18", "0", "none", "focus cards and timeline headings", "Design-system proof"],
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "typography-scale",
  tokenType: "typography-scale",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/typography-scale/TypographyScale-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/typography-scale/TypographyScale-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/typography-scale",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/typography-scale/index.html",
    title: "Typography Scale Tokens",
    description: "Review governed brochure editorial typography before text primitives and patterns consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/typography-scale/contract.mjs",
    contractExport: "typographyScaleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/typography-scale/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/typographyScale.tokens.mjs",
    systemTokenExport: "typographyScaleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: variantsInput.map(
    ([id, tokenName, textStyleRole, fontSizeValue, fontWeightValue, lineHeightValue, letterSpacingValue, textTransform, layoutContext, sample]) => ({
      id,
      tokenName,
      value: {
        textStyleRole,
        fontFamilyValue: fontFamily,
        fontSizeValue,
        fontWeightValue,
        lineHeightValue,
        letterSpacingValue,
        textTransform,
        layoutContext,
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: `${fontSizeValue} / ${lineHeightValue} at weight ${fontWeightValue}`,
        formulaOrMapping: "system implementation value",
        renderedValue: `${fontSizeValue} / ${lineHeightValue} at weight ${fontWeightValue}`,
      },
      preview: {
        kind: "text-style-sample",
        sample,
        background: "#fffdf8",
        foreground: textStyleRole === "eyebrow text" ? "#174d54" : "#1f2933",
        fontFamily,
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
        lineHeight: lineHeightValue,
        letterSpacing: letterSpacingValue,
        textTransform,
        label: textStyleRole,
      },
      metadata: {
        textStyleRole,
        layoutContext,
        theme: "all",
        accessibility: "Typography must remain readable under zoom and must not rely on clipping for normal editorial text.",
      },
      useCaseInstructions: [
        `Use for ${layoutContext}.`,
        "Do not use for form labels, status text, tooltip text, or compact controls unless a later primitive explicitly maps it.",
        "Editorial text should wrap naturally; truncation requires a later overflow-disclosure decision.",
      ],
    }),
  ),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.fontSizeValue} / ${variant.value.lineHeightValue}, ${variant.value.fontWeightValue}`,
    textStyleRole: variant.value.textStyleRole,
    fontFamilyValue: variant.value.fontFamilyValue,
    fontSizeValue: variant.value.fontSizeValue,
    fontWeightValue: variant.value.fontWeightValue,
    lineHeightValue: variant.value.lineHeightValue,
    letterSpacingValue: variant.value.letterSpacingValue,
    textTransform: variant.value.textTransform,
    layoutContext: variant.value.layoutContext,
    zoomBehavior: variant.value.zoomBehavior,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Overflow", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const typographyScaleTokenVariants = variants.map(toPageVariant);

export const typographyScaleTokenSpec = {
  contractId: typographyScaleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern brochure editorial typography without defining component behavior.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Eyebrow", title: "Uppercase section kicker", variantId: "typography-eyebrow" },
    { label: "Title", title: "Compact brochure page title", variantId: "typography-page-title" },
    { label: "Copy", title: "Readable public-site body copy", variantId: "typography-body-copy" },
  ],
  variantFields: [
    ["textStyleRole", "Role"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["textTransform", "Transform"],
    ["layoutContext", "Layout context"],
    ["zoomBehavior", "Zoom behavior"],
  ],
  variants: typographyScaleTokenVariants,
  consumerRestrictions: typographyScaleTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render each typography sample as text.",
    "Later primitives and patterns must consume these styles through the runtime seam.",
  ],
};
