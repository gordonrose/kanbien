import { contentWidthTokenContract } from "../../../../layers/02-token/content-width/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "content-width",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: ["widthRole", "inlineSizeValue", "layoutContext", "responsiveMapping", "overflowRule"],
    metadataFields: ["widthRole", "layoutContext", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "overflowRule"],
  },
};

const variantsInput = [
  {
    id: "content-width-page-measure",
    tokenName: "--content-width-page-measure",
    widthRole: "content measure",
    inlineSizeValue: "62rem",
    layoutContext: "brochure page panels, home fold, workstream list, and project detail sections",
    responsiveMapping: "used with responsive gutters so the measure never exceeds available inline size",
    overflowRule: "content must reflow inside the measure rather than forcing horizontal scroll",
    label: "Page measure",
    sample: "62rem content measure",
  },
  {
    id: "content-width-intro-measure",
    tokenName: "--content-width-intro-measure",
    widthRole: "text measure",
    inlineSizeValue: "46rem",
    layoutContext: "intro copy and lead text groups",
    responsiveMapping: "same value across viewport sizes with container clamping",
    overflowRule: "long text wraps; truncation is not approved for editorial body copy",
    label: "Intro measure",
    sample: "46rem text measure",
  },
  {
    id: "content-width-heading-measure",
    tokenName: "--content-width-heading-measure",
    widthRole: "text measure",
    inlineSizeValue: "42rem",
    layoutContext: "page titles and hero headings",
    responsiveMapping: "same value across viewport sizes with container clamping",
    overflowRule: "headings wrap naturally and must not overlap adjacent content",
    label: "Heading measure",
    sample: "42rem heading measure",
  },
  {
    id: "content-width-showcase-media-min",
    tokenName: "--content-width-showcase-media-min",
    widthRole: "media minimum",
    inlineSizeValue: "18rem",
    layoutContext: "showcase media column minimum before responsive stacking",
    responsiveMapping: "paired with grid behavior in later pattern work",
    overflowRule: "media proof must stack before it squeezes below the signed minimum",
    label: "Media minimum",
    sample: "18rem media minimum",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "content-width",
  tokenType: "content-width",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/content-width/ContentWidth-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/content-width/ContentWidth-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/content-width",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/content-width/index.html",
    title: "Content Width Tokens",
    description: "Review governed brochure content measures before layout primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/content-width/contract.mjs",
    contractExport: "contentWidthTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/content-width/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/contentWidth.tokens.mjs",
    systemTokenExport: "contentWidthTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      widthRole: variant.widthRole,
      inlineSizeValue: variant.inlineSizeValue,
      layoutContext: variant.layoutContext,
      responsiveMapping: variant.responsiveMapping,
      overflowRule: variant.overflowRule,
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: variant.inlineSizeValue,
      formulaOrMapping: "system implementation value",
      renderedValue: variant.inlineSizeValue,
    },
    preview: {
      kind: "surface-card",
      sample: variant.sample,
      background: "#fffdf8",
      foreground: "#1f2933",
      border: "rgba(40, 56, 71, 0.16)",
      radius: "0.5rem",
      label: variant.label,
    },
    metadata: {
      widthRole: variant.widthRole,
      layoutContext: variant.layoutContext,
      theme: "all",
      accessibility: "Width tokens must preserve readable reflow and must not require horizontal scrolling.",
    },
    useCaseInstructions: [
      `Use for ${variant.layoutContext}.`,
      "Do not use as a component API, breakpoint rule, grid template, or route-local width shortcut.",
      variant.overflowRule,
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.inlineSizeValue,
    widthRole: variant.value.widthRole,
    inlineSizeValue: variant.value.inlineSizeValue,
    layoutContext: variant.value.layoutContext,
    responsiveMapping: variant.value.responsiveMapping,
    overflowRule: variant.value.overflowRule,
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

export const contentWidthTokenVariants = variants.map(toPageVariant);

export const contentWidthTokenSpec = {
  contractId: contentWidthTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern reusable brochure content measures without defining layout anatomy.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Page", title: "62rem content measure", variantId: "content-width-page-measure" },
    { label: "Intro", title: "46rem text measure", variantId: "content-width-intro-measure" },
    { label: "Media", title: "18rem minimum", variantId: "content-width-showcase-media-min" },
  ],
  variantFields: [
    ["widthRole", "Role"],
    ["inlineSizeValue", "Inline size"],
    ["layoutContext", "Layout context"],
    ["responsiveMapping", "Responsive mapping"],
    ["overflowRule", "Overflow rule"],
  ],
  variants: contentWidthTokenVariants,
  consumerRestrictions: contentWidthTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must expose every signed content measure.",
    "Later primitives and patterns must consume these widths through the runtime seam.",
  ],
};
