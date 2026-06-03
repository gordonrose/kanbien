import { spacingScaleTokenContract } from "../../../../layers/02-token/spacing-scale/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "spacing-scale",
  previewKind: "gap-sample",
  variantSchema: {
    valueFields: ["spacingRole", "lengthValue", "layoutContext", "responsiveMapping", "densityMapping"],
    metadataFields: ["spacingRole", "layoutContext", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "densityRule"],
  },
};

const variantsInput = [
  ["spacing-page-gutter", "--spacing-page-gutter", "page gutter", "clamp(2rem, 8vw, 8rem)", "outer brochure page gutters", "responsive viewport clamp", "comfortable public-site page density"],
  ["spacing-section-padding", "--spacing-section-padding", "section padding", "clamp(1rem, 2vw, 1.5rem)", "panel and section inner padding", "responsive viewport clamp", "editorial panel density"],
  ["spacing-content-gap", "--spacing-content-gap", "content gap", "0.85rem", "stacked text and action groups", "fixed until a density mode is signed", "standard editorial rhythm"],
  ["spacing-compact-gap", "--spacing-compact-gap", "compact gap", "0.55rem", "tabs, process rows, and compact visual proof rows", "fixed until a density mode is signed", "compact control rhythm"],
  ["spacing-micro-gap", "--spacing-micro-gap", "compact gap", "0.35rem", "small label/value stacks", "fixed until a density mode is signed", "micro supporting rhythm"],
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "spacing-scale",
  tokenType: "spacing-scale",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/spacing-scale/SpacingScale-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/spacing-scale/SpacingScale-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/spacing-scale",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/spacing-scale/index.html",
    title: "Spacing Scale Tokens",
    description: "Review governed brochure spacing values before layout primitives and patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/spacing-scale/contract.mjs",
    contractExport: "spacingScaleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/spacing-scale/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/spacingScale.tokens.mjs",
    systemTokenExport: "spacingScaleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: variantsInput.map(([id, tokenName, spacingRole, lengthValue, layoutContext, responsiveMapping, densityMapping]) => ({
    id,
    tokenName,
    value: { spacingRole, lengthValue, layoutContext, responsiveMapping, densityMapping },
    derivation: {
      sourceTokenName: "none",
      sourceValue: lengthValue,
      formulaOrMapping: "system implementation value",
      renderedValue: lengthValue,
    },
    preview: {
      kind: "gap-sample",
      sample: spacingRole,
      gap: lengthValue,
      background: "#fffdf8",
      foreground: "#1f2933",
      border: "rgba(40, 56, 71, 0.16)",
      label: spacingRole,
    },
    metadata: {
      spacingRole,
      layoutContext,
      theme: "all",
      accessibility: "Spacing must not replace target-size, reading order, or overflow behavior.",
    },
    useCaseInstructions: [
      `Use for ${layoutContext}.`,
      "Do not use as component anatomy, product workflow spacing, or one-off route-local spacing.",
      `Density posture: ${densityMapping}.`,
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.lengthValue,
    spacingRole: variant.value.spacingRole,
    lengthValue: variant.value.lengthValue,
    layoutContext: variant.value.layoutContext,
    responsiveMapping: variant.value.responsiveMapping,
    densityMapping: variant.value.densityMapping,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Density", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const spacingScaleTokenVariants = variants.map(toPageVariant);

export const spacingScaleTokenSpec = {
  contractId: spacingScaleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern reusable brochure spacing values without defining component anatomy.",
  tokenTypeTemplate,
  summaryPanels: [
    { label: "Gutter", title: "Responsive page gutter", variantId: "spacing-page-gutter" },
    { label: "Panel", title: "Responsive section padding", variantId: "spacing-section-padding" },
    { label: "Gap", title: "Editorial content gap", variantId: "spacing-content-gap" },
  ],
  variantFields: [
    ["spacingRole", "Role"],
    ["lengthValue", "Length"],
    ["layoutContext", "Layout context"],
    ["responsiveMapping", "Responsive mapping"],
    ["densityMapping", "Density"],
  ],
  variants: spacingScaleTokenVariants,
  consumerRestrictions: spacingScaleTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render every spacing value.",
    "Later primitives and patterns must consume these spacing values through the runtime seam.",
  ],
};
