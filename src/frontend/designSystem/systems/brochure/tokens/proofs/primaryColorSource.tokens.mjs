import { primaryColorSourceTokenContract } from "../../../../layers/02-token/primary-color-source/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "color-palette",
  previewKind: "color-swatch",
  variantSchema: {
    valueFields: ["paletteRole", "scaleStep", "colorValue", "colorSpace", "themeMapping", "allowedDerivations"],
    metadataFields: ["paletteRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "literalRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "primary-color-source",
  tokenType: "primary-color-source",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/primary-color-source/PrimaryColorSource-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/primary-color-source",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/primary-color-source/index.html",
    title: "Primary Color Source Tokens",
    description: "Review governed primary source-color variants before downstream color tokens derive visual roles from them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/primary-color-source/contract.mjs",
    contractExport: "primaryColorSourceTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/primary-color-source/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/primaryColorSource.tokens.mjs",
    systemTokenExport: "primaryColorSourceTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "primary-color-source-original",
      tokenName: "--primary-color-source-original",
      value: {
        paletteRole: "primary color source",
        scaleStep: "source",
        colorValue: "#1f6f78",
        colorSpace: "srgb",
        themeMapping: "original",
        allowedDerivations:
          "May be referenced by governed text, focus, selected, and subtle-background tokens after those tokens prove their own accessibility requirements.",
      },
      preview: {
        kind: "color-swatch",
        background: "#1f6f78",
        foreground: "#ffffff",
        label: "Original primary source",
      },
      metadata: {
        paletteRole: "primary color source",
        theme: "original",
        state: "source",
        accessibility: "This source value alone does not prove readable text or state meaning.",
      },
      useCaseInstructions: [
        "Use as the brochure design system's original-theme primary source for downstream governed color derivations.",
        "Do not use directly as body text, selected state, validation, warning, error, or success meaning.",
        "Do not copy this literal into app CSS or route-local styling.",
      ],
    },
    {
      id: "primary-color-source-dark",
      tokenName: "--primary-color-source-dark",
      value: {
        paletteRole: "primary color source",
        scaleStep: "source",
        colorValue: "#68b0a6",
        colorSpace: "srgb",
        themeMapping: "dark",
        allowedDerivations:
          "May be referenced by governed dark-theme text, focus, selected, and subtle-background tokens after those tokens prove their own accessibility requirements.",
      },
      preview: {
        kind: "color-swatch",
        background: "#68b0a6",
        foreground: "#111827",
        label: "Dark primary source",
      },
      metadata: {
        paletteRole: "primary color source",
        theme: "dark",
        state: "source",
        accessibility: "Dark theme derivations must be reviewed separately from original theme derivations.",
      },
      useCaseInstructions: [
        "Use as the brochure design system's dark-theme primary source for downstream governed color derivations.",
        "Do not alias dark-theme contrast evidence to original-theme evidence.",
        "Do not copy this literal into app CSS or route-local styling.",
      ],
    },
    {
      id: "primary-color-source-desert",
      tokenName: "--primary-color-source-desert",
      value: {
        paletteRole: "primary color source",
        scaleStep: "source",
        colorValue: "#c77d2a",
        colorSpace: "srgb",
        themeMapping: "desert",
        allowedDerivations:
          "May be referenced by governed desert-theme text, focus, selected, and subtle-background tokens after those tokens prove their own accessibility requirements.",
      },
      preview: {
        kind: "color-swatch",
        background: "#c77d2a",
        foreground: "#fffaf0",
        label: "Desert primary source",
      },
      metadata: {
        paletteRole: "primary color source",
        theme: "desert",
        state: "source",
        accessibility: "Desert theme derivations must be reviewed separately from original and dark theme derivations.",
      },
      useCaseInstructions: [
        "Use as the brochure design system's desert-theme primary source for downstream governed color derivations.",
        "Do not alias desert-theme contrast evidence to original or dark theme evidence.",
        "Do not copy this literal into app CSS or route-local styling.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.colorValue,
    role: variant.metadata.paletteRole,
    paletteRole: variant.value.paletteRole,
    scaleStep: variant.value.scaleStep,
    colorValue: variant.value.colorValue,
    colorSpace: variant.value.colorSpace,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    allowedDerivations: variant.value.allowedDerivations,
    accessibility: variant.metadata.accessibility,
    preview: {
      kind: variant.preview.kind,
      background: variant.preview.background,
      foreground: variant.preview.foreground,
      label: variant.preview.label,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Literal rule", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const primaryColorSourceTokenVariants = variants.map(toPageVariant);

export const primaryColorSourceTokenSpec = {
  contractId: primaryColorSourceTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is an approved primary source-color decision. Derived color tokens must prove their own contrast and state semantics.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original primary source",
      variantId: "primary-color-source-original",
      supportingText: "Root source for the brochure teal accent family.",
    },
    {
      label: "Dark",
      title: "Dark primary source",
      variantId: "primary-color-source-dark",
      supportingText: "Root source for dark-theme brochure teal highlights.",
    },
    {
      label: "Desert",
      title: "Desert primary source",
      variantId: "primary-color-source-desert",
      supportingText: "Root source for the brochure warm accent family.",
    },
  ],
  diagnostic: {
    kind: "primary-color-source-override",
    kicker: "Review diagnostic",
    label: "Temporary HEX override",
    description:
      "Use this local preview value to test source-color derivation. It does not change the signed token definition.",
    inputLabel: "Preview HEX",
    defaultHex: "#1f6f78",
    resetLabel: "Reset",
    previewLabel: "Temporary primary derivation previews",
    sourceLabel: "Source",
    subtleLabel: "Subtle background",
    labelColorLabel: "Label text",
    ringLabel: "Focus ring",
    subtleSample: "Derived surface",
    labelSample: "Derived label",
    ringSample: "Derived ring",
    validStatus: "Temporary preview only. Signed token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
  },
  variantFields: [
    ["role", "Role"],
    ["scaleStep", "Scale step"],
    ["colorValue", "Color value"],
    ["colorSpace", "Color space"],
    ["theme", "Theme"],
    ["state", "State"],
    ["allowedDerivations", "Allowed derivations"],
  ],
  variants: primaryColorSourceTokenVariants,
  consumerRestrictions: [
    "Consumers must use this system token module instead of copying primary color literals.",
    "Derived color tokens may reference this source only when they define their own accessibility evidence and consumer contract.",
    "Primitives must not treat this source token as proof of readable text, focus visibility, or selected-state meaning.",
    "App pages must not recreate these source decisions with local CSS.",
  ],
  requiredEvidence: [
    "Original, dark, and desert source variants must render as distinct reviewable swatches.",
    "LTR and RTL rendering must preserve source-token labels and card readability.",
    "150% zoom must keep source-token details readable and non-overlapping.",
    "75% zoom must keep the swatches and usage text recognizable.",
    "The proof must state that source-color readiness is not contrast, focus, or state readiness.",
  ],
};
