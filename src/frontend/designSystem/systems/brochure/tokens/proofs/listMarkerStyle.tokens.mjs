import { listMarkerStyleTokenContract } from "../../../../layers/02-token/list-marker-style/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "list-marker-style",
  previewKind: "indicator-sample",
  variantSchema: {
    valueFields: [
      "markerRole",
      "inlineSizeValue",
      "blockSizeValue",
      "radiusValue",
      "backgroundValue",
      "borderValue",
      "layoutContext",
    ],
    metadataFields: ["markerRole", "layoutContext", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "meaningRule"],
  },
};

const variantsInput = [
  {
    id: "list-marker-bullet",
    tokenName: "--list-marker-bullet",
    markerRole: "bullet marker",
    inlineSizeValue: "0.42rem",
    blockSizeValue: "0.42rem",
    radiusValue: "999px",
    backgroundValue: "#1f6f78",
    borderValue: "none",
    layoutContext: "standard brochure check-list and repo evidence bullets",
    sample: "Evidence item",
  },
  {
    id: "list-marker-process",
    tokenName: "--list-marker-process",
    markerRole: "process marker",
    inlineSizeValue: "0.42rem",
    blockSizeValue: "0.42rem",
    radiusValue: "999px",
    backgroundValue: "rgba(31, 111, 120, 0.5)",
    borderValue: "none",
    layoutContext: "process-flow rows and staged proof lists",
    sample: "Process item",
  },
  {
    id: "list-marker-tag",
    tokenName: "--list-marker-tag",
    markerRole: "tag marker",
    inlineSizeValue: "auto",
    blockSizeValue: "auto",
    radiusValue: "999px",
    backgroundValue: "rgba(31, 111, 120, 0.14)",
    borderValue: "none",
    layoutContext: "small proof tags inside visual evidence cards",
    sample: "Proof",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "list-marker-style",
  tokenType: "list-marker-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-overflow-disclosure/TextOverflowDisclosure-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/list-marker-style/ListMarkerStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/list-marker-style/ListMarkerStyle-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/list-marker-style",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/list-marker-style/index.html",
    title: "List Marker Style Tokens",
    description: "Review governed brochure marker values before list primitives and patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/list-marker-style/contract.mjs",
    contractExport: "listMarkerStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/list-marker-style/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/listMarkerStyle.tokens.mjs",
    systemTokenExport: "listMarkerStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      markerRole: variant.markerRole,
      inlineSizeValue: variant.inlineSizeValue,
      blockSizeValue: variant.blockSizeValue,
      radiusValue: variant.radiusValue,
      backgroundValue: variant.backgroundValue,
      borderValue: variant.borderValue,
      layoutContext: variant.layoutContext,
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: `${variant.inlineSizeValue} / ${variant.backgroundValue}`,
      formulaOrMapping: "system implementation value",
      renderedValue: `${variant.inlineSizeValue} x ${variant.blockSizeValue}`,
    },
    preview: {
      kind: "indicator-sample",
      sample: variant.sample,
      background: "#fffdf8",
      foreground: "#1f2933",
      border: "rgba(40, 56, 71, 0.16)",
      indicatorInlineSize: variant.inlineSizeValue === "auto" ? "1.8rem" : variant.inlineSizeValue,
      indicatorMinBlockSize: variant.blockSizeValue === "auto" ? "1rem" : variant.blockSizeValue,
      indicatorBlockSizeBehavior: "fixed marker size",
      indicatorRadius: variant.radiusValue,
      label: variant.markerRole,
    },
    metadata: {
      markerRole: variant.markerRole,
      layoutContext: variant.layoutContext,
      theme: "all",
      accessibility: "Markers must not be the only carrier of state, validation, or selection meaning.",
    },
    useCaseInstructions: [
      `Use for ${variant.layoutContext}.`,
      "Do not use as status, validation, selected, or interactive meaning.",
      "List semantics, text style, and spacing remain owned by later primitives or patterns.",
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.inlineSizeValue} / ${variant.value.backgroundValue}`,
    markerRole: variant.value.markerRole,
    inlineSizeValue: variant.value.inlineSizeValue,
    blockSizeValue: variant.value.blockSizeValue,
    radiusValue: variant.value.radiusValue,
    backgroundValue: variant.value.backgroundValue,
    borderValue: variant.value.borderValue,
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

export const listMarkerStyleTokenVariants = variants.map(toPageVariant);

export const listMarkerStyleTokenSpec = {
  contractId: listMarkerStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern reusable brochure list markers without defining list semantics.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Bullet", title: "Evidence bullet marker", variantId: "list-marker-bullet" },
    { label: "Process", title: "Process row marker", variantId: "list-marker-process" },
    { label: "Tag", title: "Proof tag marker", variantId: "list-marker-tag" },
  ],
  variantFields: [
    ["markerRole", "Role"],
    ["inlineSizeValue", "Inline size"],
    ["blockSizeValue", "Block size"],
    ["radiusValue", "Radius"],
    ["backgroundValue", "Background"],
    ["layoutContext", "Layout context"],
  ],
  variants: listMarkerStyleTokenVariants,
  consumerRestrictions: listMarkerStyleTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render every marker style.",
    "Later list primitives and patterns must consume these marker values through the runtime seam.",
  ],
};
