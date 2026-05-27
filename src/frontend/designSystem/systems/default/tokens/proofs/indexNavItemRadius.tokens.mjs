import { indexNavItemRadiusTokenContract } from "../../../../layers/02-token/index-nav-item-radius/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "border-radius",
  previewKind: "radius-box",
  variantSchema: {
    valueFields: ["radiusRole", "radiusValue", "cornerScope", "sizeMapping", "surfaceRelationship", "forbiddenUse"],
    metadataFields: ["radiusRole", "cornerScope", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav-item",
  tokenType: "border-radius",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/index-nav-item-radius/IndexNavItemRadius-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/index-nav-item-radius/IndexNavItemRadius-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-item-radius",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-item-radius/index.html",
    title: "Index Nav Item Radius Token",
    description: "Review the governed corner radius for rectangular index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-item-radius/contract.mjs",
    contractExport: "indexNavItemRadiusTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemRadius.tokens.mjs",
    systemTokenExport: "indexNavItemRadiusTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "index-nav-item-radius-default",
      tokenName: "--index-nav-item-radius",
      value: {
        radiusRole: "index nav item corner radius",
        radiusValue: "0.375rem",
        cornerScope: "all item corners",
        sizeMapping: "compact rectangular control",
        surfaceRelationship: "pairs with index-nav-item-surface without implying a card container",
        forbiddenUse: "Do not use as a general card or panel radius.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "0.375rem",
        formulaOrMapping: "system implementation value",
        renderedValue: "0.375rem",
      },
      preview: {
        kind: "radius-box",
        sample: "Index item",
        radius: "0.375rem",
        background: "#ffffff",
        foreground: "#111827",
        border: "#dbe4f0",
        label: "Default item radius",
      },
      metadata: {
        radiusRole: "index nav item corner radius",
        cornerScope: "all item corners",
        accessibility: "Radius must not be the only indication of selected, current, or disabled state.",
      },
      useCaseInstructions: [
        "Use for governed rectangular index-navigation item controls.",
        "Do not use for page panels, cards, popovers, or route-local item styling.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.radiusValue,
    radiusRole: variant.value.radiusRole,
    radiusValue: variant.value.radiusValue,
    cornerScope: variant.value.cornerScope,
    sizeMapping: variant.value.sizeMapping,
    surfaceRelationship: variant.value.surfaceRelationship,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
    ],
  };
}

export const indexNavItemRadiusTokenVariants = variants.map(toPageVariant);

export const indexNavItemRadiusTokenSpec = {
  contractId: indexNavItemRadiusTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-item-radius",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This single token governs the item corner shape for rectangular index-navigation items.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Radius",
      title: "Compact rectangle",
      variantId: "index-nav-item-radius-default",
      supportingText: "The value belongs to the token seam, not to the later card CSS.",
    },
  ],
  variantFields: [
    ["radiusRole", "Role"],
    ["radiusValue", "Radius"],
    ["cornerScope", "Corner scope"],
    ["sizeMapping", "Size mapping"],
    ["surfaceRelationship", "Surface relationship"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: indexNavItemRadiusTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding index item radius.",
    "This token does not approve selected state, disabled state, padding, gap, or activation behavior.",
  ],
  requiredEvidence: [
    "Desktop and mobile proof routes must show the radius on a visible rectangular item.",
    "The rendered proof must expose the actual radius value.",
  ],
};
