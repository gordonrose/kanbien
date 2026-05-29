import { panelHeaderFrameTokenContract } from "../../../../layers/02-token/panel-header-frame/contract.mjs";

const border = "#dbe4f0";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "panel-header-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "gapValue",
      "blockSize",
      "minBlockSize",
      "maxBlockSizeValue",
      "stickyInsetBlockStart",
      "scrollBehavior",
    ],
    metadataFields: ["frameRole", "responsiveBehavior", "scrollBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "responsiveBehavior"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "panel",
  tokenType: "panel-header-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/panel-header-frame/PanelHeaderFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/panel-header-frame/PanelHeaderFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/panel-header-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/panel-header-frame/index.html",
    title: "Panel Header Frame Token",
    description: "Review governed generic panel header geometry before panel header primitives consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/panel-header-frame/contract.mjs",
    contractExport: "panelHeaderFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/panel-header-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/panelHeaderFrame.tokens.mjs",
    systemTokenExport: "panelHeaderFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.minimum-target-size",
      variantId: "minimum-target-size-pointer",
      tokenName: "--minimum-target-size-pointer",
      value: "2.75rem",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.panel-frame",
      variantId: "panel-frame-default",
      tokenName: "--panel-frame",
      value: border,
      relationship: "paired-with",
    },
  ],
  variants: [
    {
      id: "panel-header-frame-default",
      tokenName: "--panel-header-frame",
      value: {
        frameRole: "panel header",
        backgroundValue: "inherit",
        foregroundValue: "inherit",
        borderValue: border,
        gapValue: "0.75rem",
        blockSize: "3.25rem",
        minBlockSize: "3.25rem",
        maxBlockSizeValue: "3.25rem",
        stickyInsetBlockStart: "0",
        scrollBehavior: "header remains fixed-height and may stick at the top of the containing panel scroll context when the consuming pattern selects sticky behavior",
      },
      derivation: {
        sourceTokenName: "minimum-target-size + panel-frame",
        sourceValue: "2.75rem interactive target height; #dbe4f0 panel border",
        formulaOrMapping: "minimum target height plus 0.25rem block breathing room on each side; separator aligns with the default panel border posture",
        renderedValue: "3.25rem fixed header height with panel-border separator",
      },
      preview: {
        kind: "surface-card",
        sample: "Panel header",
        background: "#ffffff",
        foreground: "#111827",
        border,
        label: "Panel header",
      },
      metadata: {
        frameRole: "panel header",
        responsiveBehavior: "fixed block size across content counts and viewport modes; sticky behavior is selected by the consuming pattern",
        scrollBehavior: "header geometry is tokenized separately from scroll-region behavior",
        accessibility: "Header height must not reduce icon button targets below the signed minimum target size.",
      },
      useCaseInstructions: [
        "Use for reusable panel header height, title/action alignment, separator, and sticky inset.",
        "Do not use for panel shells, list items, page headers, app-local sidebars, or arbitrary toolbar rows.",
        "Pair with governed button and truncating-label primitives when actions or clipped titles are present.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    frameRole: variant.value.frameRole,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    gapValue: variant.value.gapValue,
    blockSize: variant.value.blockSize,
    minBlockSize: variant.value.minBlockSize,
    maxBlockSizeValue: variant.value.maxBlockSizeValue,
    stickyInsetBlockStart: variant.value.stickyInsetBlockStart,
    scrollBehavior: variant.value.scrollBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Responsive", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const panelHeaderFrameTokenVariants = variants.map(toPageVariant);

export const panelHeaderFrameTokenSpec = {
  contractId: panelHeaderFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "panel-header-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs generic panel header geometry.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Header",
      title: "Fixed panel header",
      variantId: "panel-header-frame-default",
      supportingText: "Header height, separator, gap, and sticky inset are tokenized before header primitives consume them.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["blockSize", "Header height"],
    ["minBlockSize", "Header min height"],
    ["maxBlockSizeValue", "Header max height"],
    ["stickyInsetBlockStart", "Sticky top"],
    ["gapValue", "Title/action gap"],
    ["borderValue", "Separator"],
    ["scrollBehavior", "Scroll behavior"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: panelHeaderFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding panel header height, separator, sticky inset, or gap values.",
    "The panel header frame token does not approve panel shell width, panel action appearance, body scrolling, navigation semantics, form controls, route selection, workflow behavior, or app adoption.",
  ],
  requiredEvidence: [
    "Rendered proof must show fixed header height, separator, source identity, and dependency mapping.",
    "Panel header primitives must consume this token before reusable panel patterns use them.",
  ],
};
