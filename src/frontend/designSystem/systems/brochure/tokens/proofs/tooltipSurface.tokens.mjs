import { tooltipSurfaceTokenContract } from "../../../../layers/02-token/tooltip-surface/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "tooltip-surface",
  previewKind: "tooltip-surface-sample",
  variantSchema: {
    valueFields: [
      "surfaceRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "shadowValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "maxInlineSizeValue",
      "zIndexValue",
      "motionDurationValue",
      "motionEasingValue",
    ],
    metadataFields: ["surfaceRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "accessibilityRule"],
  },
};

const variantsInput = [
  {
    id: "tooltip-surface-brochure-original",
    tokenName: "--tooltip-surface-brochure-original",
    surfaceRole: "text overflow disclosure surface",
    backgroundValue: "#123f46",
    foregroundValue: "#fffdf8",
    borderValue: "rgba(255, 253, 248, 0.22)",
    shadowValue: "0 0.75rem 1.7rem rgba(18, 63, 70, 0.2)",
    radiusValue: "0.375rem",
    paddingBlockValue: "0.45rem",
    paddingInlineValue: "0.6rem",
    maxInlineSizeValue: "20rem",
    zIndexValue: "1300",
    motionDurationValue: "120ms",
    motionEasingValue: "ease-out",
    sample: "View the governed brochure evidence section pattern proof.",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "brochure-text-link-action",
  tokenType: "tooltip-surface",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/tooltip-surface/TooltipSurface-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/tooltip-surface/TooltipSurface-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/tooltip-surface",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/tooltip-surface/index.html",
    title: "Tooltip Surface Tokens",
    description: "Review governed brochure full-text disclosure surface values before text-link primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/tooltip-surface/contract.mjs",
    contractExport: "tooltipSurfaceTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/tooltip-surface/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/tooltipSurface.tokens.mjs",
    systemTokenExport: "tooltipSurfaceTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      surfaceRole: variant.surfaceRole,
      backgroundValue: variant.backgroundValue,
      foregroundValue: variant.foregroundValue,
      borderValue: variant.borderValue,
      shadowValue: variant.shadowValue,
      radiusValue: variant.radiusValue,
      paddingBlockValue: variant.paddingBlockValue,
      paddingInlineValue: variant.paddingInlineValue,
      maxInlineSizeValue: variant.maxInlineSizeValue,
      zIndexValue: variant.zIndexValue,
      motionDurationValue: variant.motionDurationValue,
      motionEasingValue: variant.motionEasingValue,
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: `${variant.backgroundValue} / ${variant.foregroundValue}`,
      formulaOrMapping: "brochure system implementation value for text-link full-text disclosure",
      renderedValue: `${variant.backgroundValue} surface with ${variant.foregroundValue} text`,
    },
    preview: {
      kind: "tooltip-surface-sample",
      sample: variant.sample,
      label: "Brochure tooltip surface",
      background: variant.backgroundValue,
      foreground: variant.foregroundValue,
      border: variant.borderValue,
      shadow: variant.shadowValue,
      radius: variant.radiusValue,
      paddingBlock: variant.paddingBlockValue,
      paddingInline: variant.paddingInlineValue,
      maxInlineSize: variant.maxInlineSizeValue,
    },
    metadata: {
      surfaceRole: variant.surfaceRole,
      theme: "original",
      state: "overflow disclosure",
      accessibility: "Surface values must keep full link text readable and visually separated from the brochure page foundation.",
    },
    useCaseInstructions: [
      "Use for full-text disclosure surfaces owned by governed brochure text-link primitives.",
      "Do not use as menu, popover, dialog, toast, validation, selected, active, or app-local tooltip approval.",
      "A consuming primitive must provide keyboard, pointer, touch, dismissal, accessible-name, and placement behavior.",
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.backgroundValue} / ${variant.value.foregroundValue}`,
    role: variant.metadata.surfaceRole,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    shadowValue: variant.value.shadowValue,
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    maxInlineSizeValue: variant.value.maxInlineSizeValue,
    zIndexValue: variant.value.zIndexValue,
    motionDurationValue: variant.value.motionDurationValue,
    motionEasingValue: variant.value.motionEasingValue,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Behavior", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const tooltipSurfaceTokenVariants = variants.map(toPageVariant);

export const tooltipSurfaceTokenSpec = {
  contractId: tooltipSurfaceTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs brochure full-text disclosure surface values without defining trigger behavior or placement.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Surface", title: "Brochure disclosure surface", variantId: "tooltip-surface-brochure-original" },
  ],
  variantFields: [
    ["role", "Role"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["shadowValue", "Shadow"],
    ["radiusValue", "Radius"],
    ["maxInlineSizeValue", "Max inline size"],
  ],
  variants: tooltipSurfaceTokenVariants,
  consumerRestrictions: tooltipSurfaceTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render the brochure tooltip surface sample.",
    "The brochure text-link primitive must consume this token when long labels overflow.",
  ],
};
