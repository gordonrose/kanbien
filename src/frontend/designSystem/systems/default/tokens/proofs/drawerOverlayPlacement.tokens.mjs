import { drawerOverlayPlacementTokenContract } from "../../../../layers/02-token/drawer-overlay-placement/contract.mjs";
import { panelStackPlacementTokenSpec } from "./panelStackPlacement.tokens.mjs";

const panelStackPlacement = panelStackPlacementTokenSpec.variants.find(
  (variant) => variant.id === "panel-stack-placement-default",
);

if (!panelStackPlacement) {
  throw new Error("drawer-overlay-placement requires the signed panel-stack-placement dependency.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "drawer-overlay-placement",
  previewKind: "drawer-overlay-placement-sample",
  variantSchema: {
    valueFields: [
      "placementRole",
      "positionValue",
      "insetValue",
      "inlineSizeValue",
      "blockSizeValue",
      "layerValue",
      "underlayBehavior",
    ],
    metadataFields: ["responsiveBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "proofOwner"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "drawer-select",
  tokenType: "drawer-overlay-placement",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/drawer-overlay-placement/DrawerOverlayPlacement-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/drawer-overlay-placement/DrawerOverlayPlacement-Implementation.md",
  page: {
    route: "/design-system/default/tokens/drawer-overlay-placement",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/drawer-overlay-placement/index.html",
    title: "Drawer Overlay Placement Token",
    description:
      "Review governed page-shell overlay placement before drawer-select patterns consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/drawer-overlay-placement/contract.mjs",
    contractExport: "drawerOverlayPlacementTokenContract",
    governedRuntimeModule:
      "src/frontend/designSystem/layers/02-token/drawer-overlay-placement/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/drawerOverlayPlacement.tokens.mjs",
    systemTokenExport: "drawerOverlayPlacementTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.panel-stack-placement",
      variantId: panelStackPlacement.id,
      tokenName: panelStackPlacement.tokenName,
      value: `${panelStackPlacement.layerBaseValue} layer base / ${panelStackPlacement.layerStepValue} layer step`,
      relationship: "extends-page-shell-overlay",
    },
  ],
  variants: [
    {
      id: "drawer-overlay-placement-page-shell",
      tokenName: "--drawer-overlay-placement-page-shell",
      value: {
        placementRole: "drawer page-shell overlay",
        positionValue: "fixed",
        insetValue: "var(--drawer-overlay-page-shell-inset, 4rem 0 0 4.25rem)",
        inlineSizeValue: "calc(100vw - var(--drawer-overlay-page-shell-inline-offset, 4.25rem))",
        blockSizeValue: "calc(100dvh - var(--drawer-overlay-page-shell-block-start, 4rem))",
        layerValue: "60",
        underlayBehavior:
          "open drawer covers the page-shell content region while preserving top, side, and bottom shell chrome",
      },
      derivation: {
        sourceTokenName: panelStackPlacement.tokenName,
        sourceValue: `${panelStackPlacement.layerBaseValue} layer base / ${panelStackPlacement.layerStepValue} layer step`,
        formulaOrMapping:
          "drawer overlay layer is above the signed panel-stack layer range while preserving stack-owned panel order inside the overlay",
        renderedValue:
          "fixed / page-shell inset / calc(100vw - shell inline offset) x calc(100dvh - shell block start) / layer 60",
      },
      preview: {
        kind: "drawer-overlay-placement-sample",
        label: "Page-shell overlay",
        background: "#f8fafc",
      },
      metadata: {
        responsiveBehavior:
          "The drawer-select pattern applies this placement whenever open; panel-stack still governs the panel order inside the overlay.",
        accessibility:
          "The overlay must keep drawer controls reachable and prevent pointer access to the covered page-shell content while open.",
      },
      useCaseInstructions: [
        "Use for drawer-select page-shell overlay placement and layer above the surrounding page/proof content underlay.",
        "Do not use for panel-stack internal overlay order, panel visuals, panel headers, search fields, option cards, or app-local drawer CSS.",
        "The consuming pattern must prove left/right alignment, close, Escape, keyboard selection, no horizontal overflow, and page-shell underlay coverage in the browser.",
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
    placementRole: variant.value.placementRole,
    positionValue: variant.value.positionValue,
    insetValue: variant.value.insetValue,
    inlineSizeValue: variant.value.inlineSizeValue,
    blockSizeValue: variant.value.blockSizeValue,
    layerValue: variant.value.layerValue,
    underlayBehavior: variant.value.underlayBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Proof owner", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const drawerOverlayPlacementTokenVariants = variants.map(toPageVariant);

export const drawerOverlayPlacementTokenSpec = {
  contractId: drawerOverlayPlacementTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "drawer-overlay-placement",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This variant governs the open page-shell overlay posture for drawer-select.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Drawer overlay",
      title: "Page-shell overlay",
      variantId: "drawer-overlay-placement-page-shell",
      supportingText:
        "Placement and layer values are signed before drawer-select occupies the page-shell content region.",
    },
  ],
  variantFields: [
    ["placementRole", "Role"],
    ["positionValue", "Position"],
    ["insetValue", "Inset"],
    ["inlineSizeValue", "Inline size"],
    ["blockSizeValue", "Block size"],
    ["layerValue", "Layer"],
    ["underlayBehavior", "Underlay behavior"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: drawerOverlayPlacementTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding drawer fixed positioning, page-shell dimensions, inset, or z-index values.",
    "This token does not approve panel visuals, internal stack order, search behavior, option-card behavior, or focus behavior.",
    "Proof-only routes may switch viewport posture, but downstream patterns must consume the signed values.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity, source layer values, and final overlay values.",
    "Drawer-select pattern proof must verify page-shell overlay coverage, left/right alignment, close behavior, Escape behavior, and no horizontal overflow.",
  ],
};
