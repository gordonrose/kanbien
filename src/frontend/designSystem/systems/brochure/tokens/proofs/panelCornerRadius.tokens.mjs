import { panelCornerRadiusTokenContract } from "../../../../layers/02-token/panel-corner-radius/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "border-radius",
  previewKind: "radius-box",
  variantSchema: {
    valueFields: ["radiusRole", "radiusValue", "cornerScope", "compositionPurpose", "forbiddenUse"],
    metadataFields: ["radiusRole", "cornerScope", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "panel",
  tokenType: "border-radius",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/panel-corner-radius/PanelCornerRadius-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/panel-corner-radius/PanelCornerRadius-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/panel-corner-radius",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/panel-corner-radius/index.html",
    title: "Panel Corner Radius Token",
    description: "Review the governed corner shape for brochure panel containers.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/panel-corner-radius/contract.mjs",
    contractExport: "panelCornerRadiusTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/panel-corner-radius/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/panelCornerRadius.tokens.mjs",
    systemTokenExport: "panelCornerRadiusTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "panel-corner-radius-flush",
      tokenName: "--panel-corner-radius-flush",
      value: {
        radiusRole: "brochure panel corner radius",
        radiusValue: "0.5rem",
        cornerScope: "all outer panel corners",
        compositionPurpose: "Lets brochure panels keep a restrained editorial card shape without changing panel behavior.",
        forbiddenUse: "Do not use for buttons, chips, badges, tooltips, item controls, or decorative cards.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "0.5rem",
        formulaOrMapping: "system implementation value",
        renderedValue: "0.5rem",
      },
      preview: {
        kind: "radius-box",
        sample: "Panel",
        radius: "0.5rem",
        background: "#fffdf8",
        foreground: "#1f2933",
        border: "rgba(40, 56, 71, 0.16)",
        label: "Brochure panel radius",
      },
      metadata: {
        radiusRole: "brochure panel corner radius",
        cornerScope: "all outer panel corners",
        accessibility: "Corner radius must not be the only indication of grouping, current state, or interactivity.",
      },
      useCaseInstructions: [
        "Use for governed brochure panel containers that need the public editorial surface shape.",
        "Do not use for buttons, icon buttons, index items, tooltips, select cards, or decorative product cards.",
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
    compositionPurpose: variant.value.compositionPurpose,
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

export const panelCornerRadiusTokenVariants = variants.map(toPageVariant);

export const panelCornerRadiusTokenSpec = {
  contractId: panelCornerRadiusTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "panel-corner-radius",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This token governs the brochure corner shape for panel containers.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Radius",
      title: "Brochure panel",
      variantId: "panel-corner-radius-flush",
      supportingText: "Brochure panels keep a restrained radius while controls keep their own tokens.",
    },
  ],
  variantFields: [
    ["radiusRole", "Role"],
    ["radiusValue", "Radius"],
    ["cornerScope", "Corner scope"],
    ["compositionPurpose", "Composition purpose"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: panelCornerRadiusTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding panel radius.",
    "This token does not approve button, item, tooltip, or decorative-card corner styling.",
  ],
  requiredEvidence: [
    "Desktop and mobile proof routes must show the radius on a visible panel container.",
    "The rendered proof must expose the actual radius value.",
  ],
};
