import { resizeHandleTokenContract } from "../../../../layers/02-token/resize-handle/contract.mjs";
import { variants as primaryColorSourceVariants } from "./primaryColorSource.tokens.mjs";
import { indexNavPanelFrameTokenVariants } from "./indexNavPanelFrame.tokens.mjs";

const primarySource = primaryColorSourceVariants.find((variant) => variant.id === "primary-color-source-original");
const panelFrame = indexNavPanelFrameTokenVariants.find((variant) => variant.id === "index-nav-panel-frame-default");

if (!primarySource || !panelFrame) {
  throw new Error("resize-handle proof requires primary-color-source and index-nav-panel-frame line context.");
}

const primarySourceValue = primarySource.value.colorValue;
const lineContextValue = panelFrame.borderValue;
const visualColorValue = `color-mix(in srgb, ${primarySourceValue} 36%, ${lineContextValue})`;

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "resize-handle",
  previewKind: "resize-handle-sample",
  variantSchema: {
    valueFields: [
      "handleRole",
      "placement",
      "hitAreaInlineSize",
      "visualInlineSize",
      "visualRadiusValue",
      "minBlockSize",
      "cursorValue",
      "touchActionValue",
      "visualColorValue",
    ],
    metadataFields: ["handleRole", "inputModality", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "resize-handle",
  tokenType: "resize-handle",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/resize-handle/ResizeHandle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/resize-handle/ResizeHandle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/resize-handle",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/resize-handle/index.html",
    title: "Resize Handle Token",
    description: "Review governed resize-handle affordance values before resize primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/resize-handle/contract.mjs",
    contractExport: "resizeHandleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/resize-handle/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/resizeHandle.tokens.mjs",
    systemTokenExport: "resizeHandleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "resize-handle-inline-default",
      tokenName: "--resize-handle-inline-default",
      value: {
        handleRole: "inline resize handle",
        placement: "inline-end",
        hitAreaInlineSize: "0.75rem",
        visualInlineSize: "0.125rem",
        visualRadiusValue: "999px",
        minBlockSize: "44px",
        cursorValue: "col-resize",
        touchActionValue: "none",
        visualColorValue,
      },
      derivation: {
        sourceTokenName: `${primarySource.tokenName} + ${panelFrame.tokenName} border`,
        sourceValue: `${primarySourceValue} + ${lineContextValue}`,
        formulaOrMapping: "visual rail mixes primary source 36% over the signed line context; cursor follows entity-page-structure precedent",
        renderedValue: `0.75rem hit area / 0.125rem visual rail / 999px rail radius / col-resize / ${visualColorValue}`,
      },
      preview: {
        kind: "resize-handle-sample",
        sample: "Resize",
        background: "#ffffff",
        foreground: "#111827",
        border: lineContextValue,
        hitAreaInlineSize: "0.75rem",
        visualInlineSize: "0.125rem",
        visualRadius: "999px",
        minBlockSize: "44px",
        cursor: "col-resize",
        visualColor: visualColorValue,
        label: "Inline resize handle",
      },
      metadata: {
        handleRole: "inline resize handle",
        inputModality: "pointer, touch, and keyboard",
        accessibility: "Resize handle primitives must expose keyboard resizing and preserve minimum target-size.",
      },
      useCaseInstructions: [
        "Use for inline panel resizing affordances that receive min and max constraints from their containing pattern.",
        "Do not use as a panel width token; width constraints belong to the containing frame token.",
        "Pair with focus-ring, minimum-target-size, and a primitive that clamps values before applying them.",
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
    handleRole: variant.value.handleRole,
    placement: variant.value.placement,
    hitAreaInlineSize: variant.value.hitAreaInlineSize,
    visualInlineSize: variant.value.visualInlineSize,
    visualRadiusValue: variant.value.visualRadiusValue,
    minBlockSize: variant.value.minBlockSize,
    cursorValue: variant.value.cursorValue,
    touchActionValue: variant.value.touchActionValue,
    visualColorValue: variant.value.visualColorValue,
    theme: "all",
    state: "enabled",
    accessibility: variant.metadata.accessibility,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const resizeHandleTokenVariants = variants.map(toPageVariant);

export const resizeHandleTokenSpec = {
  contractId: resizeHandleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs the resize affordance only. Min and max panel widths remain owned by the consuming panel-frame token.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Resize",
      title: "Inline handle affordance",
      variantId: "resize-handle-inline-default",
      supportingText: "Affordance values only; panel width constraints are inherited.",
    },
  ],
  variantFields: [
    ["handleRole", "Role"],
    ["placement", "Placement"],
    ["hitAreaInlineSize", "Hit area inline size"],
    ["visualInlineSize", "Visual inline size"],
    ["visualRadiusValue", "Visual radius"],
    ["minBlockSize", "Minimum block size"],
    ["cursorValue", "Cursor"],
    ["touchActionValue", "Touch action"],
    ["visualColorValue", "Visual color"],
    ["sourceTokenName", "Source tokens"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: resizeHandleTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling resize handles locally.",
    "Consumers must not use this token as panel width authority; min and max constraints must come from the owning frame token or containing pattern.",
    "Resize primitives must preserve keyboard access and clamp resized values before applying them.",
  ],
  requiredEvidence: [
    "Rendered proof must expose the handle affordance values and consumer restrictions.",
    "Primitive proof must verify keyboard resizing and min/max clamping.",
    "Pattern proof must verify resize handles respect signed panel-frame min and max widths.",
  ],
};
