import { panelFrameTokenContract } from "../../../../layers/02-token/panel-frame/contract.mjs";
import { panelCornerRadiusTokenSpec } from "./panelCornerRadius.tokens.mjs";

const flushPanelRadius = panelCornerRadiusTokenSpec.variants.find(
  (variant) => variant.id === "panel-corner-radius-flush",
);

if (!flushPanelRadius) {
  throw new Error("panel-frame requires the signed panel-corner-radius dependency.");
}

const surface = "#ffffff";
const border = "#dbe4f0";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "panel-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "gapValue",
      "minInlineSize",
      "standardInlineSize",
      "doubleInlineSize",
      "maxInlineSize",
      "mobileInlineSize",
      "mobileBreakpointValue",
      "maxBlockSize",
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
  tokenType: "panel-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/panel-frame/PanelFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/panel-frame/PanelFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/panel-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/panel-frame/index.html",
    title: "Panel Frame Token",
    description: "Review governed generic panel shell values before panel primitives or patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/panel-frame/contract.mjs",
    contractExport: "panelFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/panelFrame.tokens.mjs",
    systemTokenExport: "panelFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.panel-corner-radius",
      variantId: flushPanelRadius.id,
      tokenName: flushPanelRadius.tokenName,
      value: flushPanelRadius.radiusValue,
      relationship: "derived-from",
    },
  ],
  variants: [
    {
      id: "panel-frame-default",
      tokenName: "--panel-frame",
      value: {
        frameRole: "panel frame",
        backgroundValue: surface,
        foregroundValue: "#111827",
        borderValue: border,
        radiusValue: flushPanelRadius.radiusValue,
        paddingBlockValue: "0.5rem",
        paddingInlineValue: "0.5rem",
        gapValue: "0.75rem",
        minInlineSize: "10rem",
        standardInlineSize: "13rem",
        doubleInlineSize: "26rem",
        maxInlineSize: "100%",
        mobileInlineSize: "100vw",
        mobileBreakpointValue: "44rem",
        maxBlockSize: "32rem",
        scrollBehavior: "desktop panels may own internal scrolling; mobile panels may expand to screen width and scroll with page when the pattern selects page-scroll placement",
      },
      derivation: {
        sourceTokenName: flushPanelRadius.tokenName,
        sourceValue: flushPanelRadius.radiusValue,
        formulaOrMapping: "panel radius derives from the signed flush panel corner token; width, padding, surface, and scroll values are generic panel frame decisions",
        renderedValue: "10rem min / 13rem standard / 26rem double / 100% available max / 100vw below 44rem",
      },
      preview: {
        kind: "surface-card",
        sample: "Panel",
        background: surface,
        foreground: "#111827",
        border,
        radius: flushPanelRadius.radiusValue,
        label: "Panel frame",
      },
      metadata: {
        frameRole: "panel frame",
        responsiveBehavior: "resizable desktop width between minimum and available container width; single width, optional double width, and mobile full-screen inline size below the governed mobile breakpoint",
        scrollBehavior: "desktop scroll ownership is selected by the consuming pattern; mobile page-scroll panels expand to content height",
        accessibility: "Scroll ownership must not trap keyboard focus or hide controls from normal navigation.",
      },
      useCaseInstructions: [
        "Use for reusable panel containers such as index panels and entity body panels.",
        "Do not use for item surfaces, cards, page shells, app-local sidebars, or arbitrary route wrappers.",
        "Mobile full-screen behavior belongs to the consuming pattern using this token, not to the token itself.",
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
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    gapValue: variant.value.gapValue,
    minInlineSize: variant.value.minInlineSize,
    standardInlineSize: variant.value.standardInlineSize,
    doubleInlineSize: variant.value.doubleInlineSize,
    maxInlineSize: variant.value.maxInlineSize,
    mobileInlineSize: variant.value.mobileInlineSize,
    mobileBreakpointValue: variant.value.mobileBreakpointValue,
    maxBlockSize: variant.value.maxBlockSize,
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

export const panelFrameTokenVariants = variants.map(toPageVariant);

export const panelFrameTokenSpec = {
  contractId: panelFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "panel-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs generic panel shell values.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Panel",
      title: "Reusable panel frame",
      variantId: "panel-frame-default",
      supportingText: "Panel width and scroll ownership values are tokenized before panel composition.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["minInlineSize", "Min width"],
    ["standardInlineSize", "Standard width"],
    ["doubleInlineSize", "Double width"],
    ["maxInlineSize", "Max width"],
    ["mobileInlineSize", "Mobile width"],
    ["mobileBreakpointValue", "Mobile breakpoint"],
    ["maxBlockSize", "Desktop max height"],
    ["scrollBehavior", "Scroll behavior"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: panelFrameTokenVariants,
  diagnostic: {
    kind: "inline-size-range",
    kicker: "Diagnostic override",
    label: "Review Desktop Resize Limits",
    description: "Drag from the signed minimum panel width toward full available width. This changes only the rendered review sample.",
    inputLabel: "Panel width",
    sourceVariantId: "panel-frame-default",
    minField: "minInlineSize",
    maxField: "maxInlineSize",
    defaultField: "standardInlineSize",
    previewLabel: "Resizable panel preview",
    statusPrefix: "Rendered review width",
  },
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding panel width, breakpoint, padding, surface, radius, or scroll-height values.",
    "The panel frame token does not approve panel header geometry, panel actions, navigation semantics, form controls, body slot anatomy, route selection, workflow behavior, or app adoption.",
    "Proof-only width controls may test width ranges, but downstream consumers must use the token variants.",
  ],
  requiredEvidence: [
    "Rendered proof must show standard width, double width, mobile full-width behavior, and dependency identity without horizontal overflow.",
    "Panel scroll behavior must be verified in a Layer 4 browser proof.",
    "Panel header primitives must consume their own signed header token before reusable panel patterns use them.",
  ],
};
