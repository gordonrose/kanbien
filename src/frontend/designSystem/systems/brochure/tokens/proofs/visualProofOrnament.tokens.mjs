import { visualProofOrnamentTokenContract } from "../../../../layers/02-token/visual-proof-ornament/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "visual-proof-ornament",
  previewKind: "visual-proof-ornament-sample",
  variantSchema: {
    valueFields: visualProofOrnamentTokenContract.valueFields,
    metadataFields: visualProofOrnamentTokenContract.metadataFields,
    useCaseInstructionFields: visualProofOrnamentTokenContract.useCaseInstructionFields,
  },
};

const sharedValues = {
  backgroundValue: "#fffdf8",
  foregroundValue: "#1f2933",
  gridColorValue: "rgba(40, 56, 71, 0.16)",
  gridSizeValue: "1.25rem",
  chipBackgroundValue: "rgba(255, 253, 248, 0.9)",
  chipBorderValue: "rgba(40, 56, 71, 0.16)",
  chipRadiusValue: "0.5rem",
  chipOpacityValue: "1",
  lineColorValue: "rgba(31, 111, 120, 0.34)",
  lineSizeValue: "0.18rem",
  accentBarValue: "linear-gradient(90deg, #1f6f78, #c77d2a)",
  overlayValue: "linear-gradient(140deg, rgba(31, 111, 120, 0.1), rgba(255, 253, 248, 0.92) 52%, rgba(199, 125, 42, 0.1))",
  markerSizeValue: "1.2rem",
  markerBackgroundValue: "rgba(199, 125, 42, 0.18)",
  markerRadiusValue: "999px",
};

const roles = [
  ["visual-proof-grid-lines", "--visual-proof-grid-lines", "grid lines", "Grid lines"],
  ["visual-proof-chip", "--visual-proof-chip", "visual chip", "Visual chips"],
  ["visual-proof-connector-line", "--visual-proof-connector-line", "connector line", "Connector lines"],
  ["visual-proof-accent-bar", "--visual-proof-accent-bar", "accent bar", "Accent bar"],
  ["visual-proof-overlay-wash", "--visual-proof-overlay-wash", "overlay wash", "Overlay wash"],
  ["visual-proof-marker", "--visual-proof-marker", "visual marker", "Visual marker"],
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "visual-proof-ornament",
  tokenType: "visual-proof-ornament",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/visual-proof-diagram/VisualProofDiagram-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/visual-proof-ornament/VisualProofOrnament-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/brochure/visual-proof-ornament/VisualProofOrnament-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/visual-proof-ornament",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/visual-proof-ornament/index.html",
    title: "Visual Proof Ornament Tokens",
    description: "Review governed diagram ornament materials before visual proof primitives and patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/visual-proof-ornament/contract.mjs",
    contractExport: "visualProofOrnamentTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/visual-proof-ornament/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/visualProofOrnament.tokens.mjs",
    systemTokenExport: "visualProofOrnamentTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: roles.map(([id, tokenName, ornamentRole, label]) => ({
    id,
    tokenName,
    value: {
      ornamentRole,
      ...sharedValues,
      layoutContext: "abstract proof diagrams and visual evidence stages",
    },
    derivation: {
      sourceTokenName: "surface-frame + primary-color-source",
      sourceValue: "brochure panel, teal, warm accent, and line values",
      formulaOrMapping: "system implementation values composed as reusable diagram materials",
      renderedValue: ornamentRole,
    },
    preview: {
      kind: "visual-proof-ornament-sample",
      ornamentId: id,
      sample: label,
      background: sharedValues.backgroundValue,
      foreground: sharedValues.foregroundValue,
      border: sharedValues.chipBorderValue,
      gridColor: sharedValues.gridColorValue,
      gridSize: sharedValues.gridSizeValue,
      chipBackground: sharedValues.chipBackgroundValue,
      chipBorder: sharedValues.chipBorderValue,
      chipRadius: sharedValues.chipRadiusValue,
      chipOpacity: sharedValues.chipOpacityValue,
      lineColor: sharedValues.lineColorValue,
      lineSize: sharedValues.lineSizeValue,
      accentBar: sharedValues.accentBarValue,
      overlay: sharedValues.overlayValue,
      markerSize: sharedValues.markerSizeValue,
      markerBackground: sharedValues.markerBackgroundValue,
      markerRadius: sharedValues.markerRadiusValue,
      label,
    },
    metadata: {
      ornamentRole,
      layoutContext: "abstract proof diagrams and visual evidence stages",
      theme: "all",
      accessibility: "Diagram ornaments are decorative materials and must not be the only carrier of proof outcome or status.",
    },
    useCaseInstructions: [
      "Use as reusable visual material inside governed abstract proof diagrams.",
      "Do not use as artifact content, workflow state, validation state, selected state, animation, or component layout.",
      "Any semantic proof outcome must be represented by text or later governed state semantics.",
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.ornamentRole,
    ornamentRole: variant.value.ornamentRole,
    backgroundValue: variant.value.backgroundValue,
    gridColorValue: variant.value.gridColorValue,
    gridSizeValue: variant.value.gridSizeValue,
    chipBackgroundValue: variant.value.chipBackgroundValue,
    chipBorderValue: variant.value.chipBorderValue,
    chipRadiusValue: variant.value.chipRadiusValue,
    chipOpacityValue: variant.value.chipOpacityValue,
    lineColorValue: variant.value.lineColorValue,
    lineSizeValue: variant.value.lineSizeValue,
    accentBarValue: variant.value.accentBarValue,
    overlayValue: variant.value.overlayValue,
    markerSizeValue: variant.value.markerSizeValue,
    markerBackgroundValue: variant.value.markerBackgroundValue,
    markerRadiusValue: variant.value.markerRadiusValue,
    layoutContext: variant.value.layoutContext,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Meaning", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const visualProofOrnamentTokenVariants = variants.map(toPageVariant);

export const visualProofOrnamentTokenSpec = {
  contractId: visualProofOrnamentTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These tokens govern reusable abstract diagram ornament materials without defining illustration layout or semantics.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Grid", title: "Faint proof grid", variantId: "visual-proof-grid-lines" },
    { label: "Chip", title: "Translucent artifact chips", variantId: "visual-proof-chip" },
    { label: "Accent", title: "Teal-to-warm proof accent", variantId: "visual-proof-accent-bar" },
  ],
  variantFields: [
    ["ornamentRole", "Role"],
    ["gridColorValue", "Grid color"],
    ["chipBackgroundValue", "Chip background"],
    ["lineColorValue", "Connector line"],
    ["accentBarValue", "Accent bar"],
    ["overlayValue", "Overlay"],
    ["markerSizeValue", "Marker size"],
    ["layoutContext", "Layout context"],
  ],
  variants: visualProofOrnamentTokenVariants,
  consumerRestrictions: visualProofOrnamentTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render the combined ornament materials.",
    "Later visual proof primitives and patterns must consume these materials through the runtime seam.",
  ],
};
