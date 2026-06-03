import { panelStackPlacementTokenContract } from "../../../../layers/02-token/panel-stack-placement/contract.mjs";
import { panelFrameTokenSpec } from "./panelFrame.tokens.mjs";

const panelFrame = panelFrameTokenSpec.variants.find((variant) => variant.id === "panel-frame-default");

if (!panelFrame) {
  throw new Error("panel-stack-placement requires the signed panel-frame dependency.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "panel-stack-placement",
  previewKind: "panel-stack-placement-sample",
  variantSchema: {
    valueFields: [
      "placementRole",
      "originSides",
      "desktopAdjacencyGapValue",
      "overlayInsetValue",
      "mobileBreakpointValue",
      "layerBaseValue",
      "layerStepValue",
      "coveredPanelBehavior",
    ],
    metadataFields: ["responsiveBehavior", "layeringBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "responsiveBehavior"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "panel-stack",
  tokenType: "panel-stack-placement",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/panel-stack/PanelStack-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/panel-stack-placement/PanelStackPlacement-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/panel-stack-placement/PanelStackPlacement-Implementation.md",
  page: {
    route: "/design-system/default/tokens/panel-stack-placement",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/panel-stack-placement/index.html",
    title: "Panel Stack Placement Token",
    description: "Review governed side-panel stack placement values before panel-stack primitives or patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/panel-stack-placement/contract.mjs",
    contractExport: "panelStackPlacementTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/panel-stack-placement/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/panelStackPlacement.tokens.mjs",
    systemTokenExport: "panelStackPlacementTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.panel-frame",
      variantId: panelFrame.id,
      tokenName: panelFrame.tokenName,
      value: `${panelFrame.standardInlineSize} standard / ${panelFrame.mobileBreakpointValue} mobile breakpoint`,
      relationship: "paired-with",
    },
  ],
  variants: [
    {
      id: "panel-stack-placement-default",
      tokenName: "--panel-stack-placement",
      value: {
        placementRole: "panel stack placement",
        originSides: "left and right",
        desktopAdjacencyGapValue: "0px",
        overlayInsetValue: "0px",
        mobileBreakpointValue: panelFrame.mobileBreakpointValue,
        layerBaseValue: "30",
        layerStepValue: "1",
        coveredPanelBehavior: "covered panels remain in the stack but must not compete with the active overlay panel",
      },
      derivation: {
        sourceTokenName: panelFrame.tokenName,
        sourceValue: `${panelFrame.standardInlineSize} / ${panelFrame.mobileBreakpointValue}`,
        formulaOrMapping:
          "stack placement inherits the signed panel mobile breakpoint; desktop adjacency and overlay inset are signed stack relationship values",
        renderedValue: "0px desktop gap / 0px overlay inset / layer base 30 / layer step 1 / inherits 44rem breakpoint",
      },
      preview: {
        kind: "panel-stack-placement-sample",
        sample: "Panel stack",
        background: panelFrame.backgroundValue,
        foreground: panelFrame.foregroundValue,
        border: panelFrame.borderValue,
        radius: panelFrame.radiusValue,
        label: "Flush stacked panels",
      },
      metadata: {
        responsiveBehavior:
          "desktop panels stack flush side by side; at the inherited panel mobile breakpoint the consuming pattern overlays panels in stack order",
        layeringBehavior:
          "layer base and layer step are signed values for ordered panel overlays; route-local z-index values are forbidden",
        accessibility:
          "Layering values must support focus staying within the active panel and prevent covered panels from competing with it.",
      },
      useCaseInstructions: [
        "Use for reusable side-panel stack adjacency, origin-side support, overlay inset, mobile breakpoint inheritance, and layer order.",
        "Do not use for panel surfaces, panel widths, panel headers, selectable cards, search fields, route topology, or app-local drawers.",
        "The consuming primitive or pattern must prove focus and covered-panel behavior; this token only signs placement and layering values.",
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
    originSides: variant.value.originSides,
    desktopAdjacencyGapValue: variant.value.desktopAdjacencyGapValue,
    overlayInsetValue: variant.value.overlayInsetValue,
    mobileBreakpointValue: variant.value.mobileBreakpointValue,
    layerBaseValue: variant.value.layerBaseValue,
    layerStepValue: variant.value.layerStepValue,
    coveredPanelBehavior: variant.value.coveredPanelBehavior,
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

export const panelStackPlacementTokenVariants = variants.map(toPageVariant);

export const panelStackPlacementTokenSpec = {
  contractId: panelStackPlacementTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "panel-stack-placement",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs reusable side-panel stack placement and layering values.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Panel stack",
      title: "Flush side-panel stack",
      variantId: "panel-stack-placement-default",
      supportingText: "Placement and layering values are signed before stack primitives or patterns consume them.",
    },
  ],
  variantFields: [
    ["placementRole", "Role"],
    ["originSides", "Origin sides"],
    ["desktopAdjacencyGapValue", "Desktop gap"],
    ["overlayInsetValue", "Overlay inset"],
    ["mobileBreakpointValue", "Mobile breakpoint"],
    ["layerBaseValue", "Layer base"],
    ["layerStepValue", "Layer step"],
    ["coveredPanelBehavior", "Covered panel behavior"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: panelStackPlacementTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding panel-stack gap, overlay inset, mobile breakpoint, or z-index values.",
    "The panel-stack placement token does not approve panel shell visuals, panel header geometry, close behavior, focus behavior, search, selection, or app adoption.",
    "Proof-only stack fixtures may vary panel count, origin side, or viewport pressure, but downstream consumers must use the signed values.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity, source breakpoint, final stack values, and no route-local z-index literals.",
    "Panel-stack primitive proof must verify active panel and covered panel behavior with keyboard focus.",
    "Panel-stack pattern proof must verify left and right origins, desktop flush stacking, and mobile overlay order.",
  ],
};
