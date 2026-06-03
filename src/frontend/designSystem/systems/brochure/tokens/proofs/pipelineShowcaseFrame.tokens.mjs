import { pipelineShowcaseFrameTokenContract } from "../../../../layers/02-token/pipeline-showcase-frame/contract.mjs";
import { focusRingTokenVariants } from "./focusRing.tokens.mjs";
import { labelTextStyleTokenVariants } from "./labelTextStyle.tokens.mjs";
import { minimumTargetSizeTokenVariants } from "./minimumTargetSize.tokens.mjs";
import { spacingScaleTokenVariants } from "./spacingScale.tokens.mjs";
import { surfaceFrameTokenVariants } from "./surfaceFrame.tokens.mjs";

const focusRing = focusRingTokenVariants.find((variant) => variant.role === "visible focus ring");
const labelText = labelTextStyleTokenVariants.find((variant) => variant.role === "short label text");
const targetSize = minimumTargetSizeTokenVariants.find((variant) => variant.role === "interactive target");
const compactSpacing = spacingScaleTokenVariants.find((variant) => variant.id === "spacing-compact-gap");
const showcaseSurface = surfaceFrameTokenVariants.find((variant) => variant.id === "surface-frame-showcase");

if (!focusRing || !labelText || !targetSize || !compactSpacing || !showcaseSurface) {
  throw new Error("pipeline-showcase-frame proof requires signed brochure focus, label, target, spacing, and surface tokens.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "pipeline-showcase-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "borderWidthValue",
      "radiusValue",
      "shadowValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "minBlockSizeValue",
      "gapValue",
      "layoutContext",
    ],
    metadataFields: ["frameRole", "state", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

const variantsInput = [
  {
    id: "pipeline-showcase-step-selector-inactive",
    tokenName: "--pipeline-showcase-step-selector-inactive",
    frameRole: "step selector inactive frame",
    state: "inactive",
    backgroundValue: "transparent",
    foregroundValue: "#1f2933",
    borderValue: "rgba(40, 56, 71, 0.16)",
    borderWidthValue: "0.0625rem",
    radiusValue: "0.5rem",
    shadowValue: "none",
    paddingBlockValue: "0.8rem",
    paddingInlineValue: "0.8rem",
    minBlockSizeValue: "5.5rem",
    gapValue: "0.42rem",
    layoutContext: "desktop ordered pipeline step selector",
    label: "Inactive step",
    sample: "Step",
  },
  {
    id: "pipeline-showcase-step-selector-active",
    tokenName: "--pipeline-showcase-step-selector-active",
    frameRole: "step selector active frame",
    state: "active",
    backgroundValue: "rgba(31, 111, 120, 0.07)",
    foregroundValue: "#1f2933",
    borderValue: "rgba(31, 111, 120, 0.44)",
    borderWidthValue: "0.125rem",
    radiusValue: "0.5rem",
    shadowValue: "none",
    paddingBlockValue: "0.8rem",
    paddingInlineValue: "0.8rem",
    minBlockSizeValue: "5.5rem",
    gapValue: "0.42rem",
    layoutContext: "desktop selected ordered pipeline step selector",
    label: "Active step",
    sample: "Active",
  },
  {
    id: "pipeline-showcase-mobile-dropdown-selector",
    tokenName: "--pipeline-showcase-mobile-dropdown-selector",
    frameRole: "mobile dropdown selector frame",
    state: "mobile selector",
    backgroundValue:
      "linear-gradient(135deg, rgba(31, 111, 120, 0.08), rgba(199, 125, 42, 0.04)), #fffdf8",
    foregroundValue: "#1f2933",
    borderValue: "rgba(31, 111, 120, 0.28)",
    borderWidthValue: "0.0625rem",
    radiusValue: "0.5rem",
    shadowValue: "0 0.5rem 1rem rgba(23, 38, 47, 0.08)",
    paddingBlockValue: "0.78rem",
    paddingInlineValue: "0.9rem 3rem",
    minBlockSizeValue: "3.4rem",
    gapValue: "0",
    layoutContext: "mobile replacement selector for the ordered pipeline",
    label: "Dropdown",
    sample: "01 Step",
  },
  {
    id: "pipeline-showcase-active-step-panel",
    tokenName: "--pipeline-showcase-active-step-panel",
    frameRole: "active step panel frame",
    state: "active panel",
    backgroundValue: showcaseSurface.backgroundValue,
    foregroundValue: showcaseSurface.foregroundValue,
    borderValue: showcaseSurface.borderValue,
    borderWidthValue: showcaseSurface.borderWidthValue,
    radiusValue: showcaseSurface.radiusValue,
    shadowValue: showcaseSurface.shadowValue,
    paddingBlockValue: "clamp(1rem, 2vw, 1.35rem)",
    paddingInlineValue: "clamp(1rem, 2vw, 1.35rem)",
    minBlockSizeValue: "auto",
    gapValue: "clamp(1rem, 2vw, 1.5rem)",
    layoutContext: "active pipeline step detail panel",
    label: "Panel",
    sample: "Panel",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "brochure-pipeline-showcase",
  tokenType: "pipeline-showcase-frame",
  status: "review-ready",
  behaviorRulePath:
    "docs/design-system/01-behavior-rule/shared/brochure-pipeline-showcase/BrochurePipelineShowcase-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/pipeline-showcase-frame/PipelineShowcaseFrame-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/brochure/pipeline-showcase-frame/PipelineShowcaseFrame-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/pipeline-showcase-frame",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/pipeline-showcase-frame/index.html",
    title: "Pipeline Showcase Frame Tokens",
    description: "Review governed brochure pipeline selector and panel frame values before primitives and patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/contract.mjs",
    contractExport: "pipelineShowcaseFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/pipelineShowcaseFrame.tokens.mjs",
    systemTokenExport: "pipelineShowcaseFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.focus-ring",
      variantId: focusRing.id,
      tokenName: focusRing.tokenName,
      value: focusRing.ringValue,
      relationship: "paired-with",
    },
    {
      contractId: "tokens.label-text-style",
      variantId: labelText.id,
      tokenName: labelText.tokenName,
      value: labelText.tokenValue,
      relationship: "paired-with",
    },
    {
      contractId: "tokens.minimum-target-size",
      variantId: targetSize.id,
      tokenName: targetSize.tokenName,
      value: targetSize.tokenValue,
      relationship: "paired-with",
    },
    {
      contractId: "tokens.spacing-scale",
      variantId: compactSpacing.id,
      tokenName: compactSpacing.tokenName,
      value: compactSpacing.tokenValue,
      relationship: "paired-with",
    },
    {
      contractId: "tokens.surface-frame",
      variantId: showcaseSurface.id,
      tokenName: showcaseSurface.tokenName,
      value: showcaseSurface.tokenValue,
      relationship: "derived-from",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "No proof-only diagnostic is required because the route renders signed frame variants and their dependency chain.",
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      frameRole: variant.frameRole,
      backgroundValue: variant.backgroundValue,
      foregroundValue: variant.foregroundValue,
      borderValue: variant.borderValue,
      borderWidthValue: variant.borderWidthValue,
      radiusValue: variant.radiusValue,
      shadowValue: variant.shadowValue,
      paddingBlockValue: variant.paddingBlockValue,
      paddingInlineValue: variant.paddingInlineValue,
      minBlockSizeValue: variant.minBlockSizeValue,
      gapValue: variant.gapValue,
      layoutContext: variant.layoutContext,
    },
    derivation: {
      sourceTokenName:
        variant.id === "pipeline-showcase-active-step-panel"
          ? showcaseSurface.tokenName
          : `${focusRing.tokenName} + ${labelText.tokenName} + ${targetSize.tokenName} + ${compactSpacing.tokenName}`,
      sourceValue:
        variant.id === "pipeline-showcase-active-step-panel"
          ? showcaseSurface.tokenValue
          : `${focusRing.ringValue} + ${labelText.tokenValue} + ${targetSize.tokenValue} + ${compactSpacing.tokenValue}`,
      formulaOrMapping:
        variant.id === "pipeline-showcase-active-step-panel"
          ? "panel frame derives from the signed showcase surface-frame token and adds pipeline panel padding/gap values"
          : "selector frame uses system implementation values and must pair with signed focus, label, target-size, and spacing tokens",
      renderedValue: `${variant.backgroundValue} / ${variant.borderValue} / ${variant.shadowValue}`,
    },
    preview: {
      kind: "surface-card",
      sample: variant.sample,
      background: variant.backgroundValue,
      foreground: variant.foregroundValue,
      border: variant.borderValue,
      radius: variant.radiusValue,
      shadow: variant.shadowValue,
      label: variant.label,
    },
    metadata: {
      frameRole: variant.frameRole,
      state: variant.state,
      theme: "all",
      accessibility:
        "Frame values must be paired with programmatic selected state, visible focus, and color-independent active treatment in the consuming primitive or pattern.",
    },
    useCaseInstructions: [
      `Use for ${variant.layoutContext}.`,
      "Do not use as tablist semantics, select behavior, panel composition, route state, or app-local styling.",
      "Pair with focus-ring, label text, target-size, spacing, and responsive pattern evidence.",
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.backgroundValue} / ${variant.value.borderValue}`,
    frameRole: variant.value.frameRole,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    borderWidthValue: variant.value.borderWidthValue,
    radiusValue: variant.value.radiusValue,
    shadowValue: variant.value.shadowValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    minBlockSizeValue: variant.value.minBlockSizeValue,
    gapValue: variant.value.gapValue,
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

export const pipelineShowcaseFrameTokenVariants = variants.map(toPageVariant);

export const pipelineShowcaseFrameTokenSpec = {
  contractId: pipelineShowcaseFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These tokens govern reusable pipeline selector and panel frame values without defining tab behavior or panel composition.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Inactive", title: "Inactive desktop step", variantId: "pipeline-showcase-step-selector-inactive" },
    { label: "Active", title: "Selected desktop step", variantId: "pipeline-showcase-step-selector-active" },
    { label: "Mobile", title: "Mobile replacement selector", variantId: "pipeline-showcase-mobile-dropdown-selector" },
    { label: "Panel", title: "Active step detail panel", variantId: "pipeline-showcase-active-step-panel" },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["backgroundValue", "Background"],
    ["borderValue", "Border"],
    ["borderWidthValue", "Border width"],
    ["radiusValue", "Radius"],
    ["shadowValue", "Shadow"],
    ["paddingBlockValue", "Padding block"],
    ["paddingInlineValue", "Padding inline"],
    ["minBlockSizeValue", "Minimum block size"],
    ["gapValue", "Gap"],
    ["layoutContext", "Layout context"],
  ],
  variants: pipelineShowcaseFrameTokenVariants,
  consumerRestrictions: pipelineShowcaseFrameTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render inactive, active, mobile dropdown, and panel frame variants.",
    "Later primitives and patterns must consume these frame values through the runtime seam.",
    "Responsive selector switching and keyboard behavior remain owned by downstream primitive or pattern proof.",
  ],
};
