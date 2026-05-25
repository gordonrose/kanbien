import { backgroundColorTokenContract } from "../../../../contracts/tokens/backgroundColor.contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "background-color",
  previewKind: "surface-swatch",
  variantSchema: {
    valueFields: [
      "backgroundRole",
      "surfaceRelationship",
      "mappedPaletteToken",
      "themeMapping",
      "contrastPairings",
      "stateMapping",
    ],
    metadataFields: ["backgroundRole", "surfaceRelationship", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "approvedForegrounds"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "background-color",
  tokenType: "background-color",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/background-color/BackgroundColor-Implementation.md",
  page: {
    route: "/design-system/default/tokens/background-color",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/background-color/index.html",
    title: "Background Color Tokens",
    description: "Review governed background color variants, metadata, and use-case rules.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/contracts/tokens/backgroundColor.contract.mjs",
    contractExport: "backgroundColorTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/backgroundColor.tokens.mjs",
    systemTokenExport: "backgroundColorTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "background-page-original",
      tokenName: "--background-page-original",
      value: {
        backgroundRole: "page foundation",
        surfaceRelationship: "supports original surfaces and page chrome",
        mappedPaletteToken: "palette.neutral.0",
        themeMapping: "original",
        contrastPairings: "text-primary, border-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#ffffff",
        background: "#ffffff",
        foreground: "#0f1115",
        label: "Original page background",
      },
      metadata: {
        backgroundRole: "page foundation",
        surfaceRelationship: "supports original surfaces and page chrome",
        theme: "original",
        state: "none",
        accessibility: "Approved foreground pairings must maintain text contrast.",
      },
      useCaseInstructions: [
        "Use for original full-page background behind governed surfaces.",
        "Do not use as a status, selected, warning, or error background.",
        "Use text-primary and border-subtle until semantic mappings expand.",
      ],
    },
    {
      id: "background-surface-original",
      tokenName: "--background-surface-original",
      value: {
        backgroundRole: "surface foundation",
        surfaceRelationship: "sits above original page foundation",
        mappedPaletteToken: "palette.neutral.0",
        themeMapping: "original",
        contrastPairings: "text-primary, border-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#ffffff",
        background: "#ffffff",
        foreground: "#0f1115",
        label: "Original surface",
      },
      metadata: {
        backgroundRole: "surface foundation",
        surfaceRelationship: "sits above original page foundation",
        theme: "original",
        state: "none",
        accessibility: "Must remain distinguishable from page foundation using border or elevation when adjacent.",
      },
      useCaseInstructions: [
        "Use for primary content regions on the original page foundation.",
        "Do not use as a nested card-within-card background without a signed surface rule.",
        "Use text-primary and border-subtle.",
      ],
    },
    {
      id: "background-subtle-original",
      tokenName: "--background-subtle-original",
      value: {
        backgroundRole: "subtle foundation",
        surfaceRelationship: "supports low-emphasis bands and inactive regions",
        mappedPaletteToken: "palette.neutral.50",
        themeMapping: "original",
        contrastPairings: "text-primary, border-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#f7f8fb",
        background: "#f7f8fb",
        foreground: "#20242c",
        label: "Subtle background",
      },
      metadata: {
        backgroundRole: "subtle foundation",
        surfaceRelationship: "supports low-emphasis bands and inactive regions",
        theme: "original",
        state: "none",
        accessibility: "Must not reduce text contrast below the approved foreground pairing.",
      },
      useCaseInstructions: [
        "Use for low-emphasis page bands and empty-region backgrounds.",
        "Do not use to communicate disabled, loading, warning, or error state by itself.",
        "Use text-primary and border-subtle.",
      ],
    },
    {
      id: "background-page-dark",
      tokenName: "--background-page-dark",
      value: {
        backgroundRole: "page foundation",
        surfaceRelationship: "supports dark theme surfaces and page chrome",
        mappedPaletteToken: "palette.neutral.950",
        themeMapping: "dark",
        contrastPairings: "text-inverse, border-inverse-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#101318",
        background: "#101318",
        foreground: "#f4f7fb",
        label: "Dark page background",
      },
      metadata: {
        backgroundRole: "page foundation",
        surfaceRelationship: "supports dark theme surfaces and page chrome",
        theme: "dark",
        state: "none",
        accessibility: "Dark theme pairings must be tested separately from original theme pairings.",
      },
      useCaseInstructions: [
        "Use for dark theme page foundation only.",
        "Do not alias this to the original theme background.",
        "Use text-inverse and border-inverse-subtle until semantic mappings expand.",
      ],
    },
    {
      id: "background-surface-dark",
      tokenName: "--background-surface-dark",
      value: {
        backgroundRole: "surface foundation",
        surfaceRelationship: "sits above dark page foundation",
        mappedPaletteToken: "palette.neutral.900",
        themeMapping: "dark",
        contrastPairings: "text-inverse, border-inverse-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#171b22",
        background: "#171b22",
        foreground: "#f4f7fb",
        label: "Dark surface",
      },
      metadata: {
        backgroundRole: "surface foundation",
        surfaceRelationship: "sits above dark page foundation",
        theme: "dark",
        state: "none",
        accessibility: "Must be reviewed separately from original theme surface contrast.",
      },
      useCaseInstructions: [
        "Use for dark theme primary content regions.",
        "Do not alias to default surfaces or reuse as a modal scrim.",
        "Use text-inverse and border-inverse-subtle.",
      ],
    },
    {
      id: "background-page-desert",
      tokenName: "--background-page-desert",
      value: {
        backgroundRole: "page foundation",
        surfaceRelationship: "supports desert theme surfaces and page chrome",
        mappedPaletteToken: "palette.sand.0",
        themeMapping: "desert",
        contrastPairings: "text-primary, border-warm-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#fffdf7",
        background: "#fffdf7",
        foreground: "#493327",
        label: "Desert page background",
      },
      metadata: {
        backgroundRole: "page foundation",
        surfaceRelationship: "supports desert theme surfaces and page chrome",
        theme: "desert",
        state: "none",
        accessibility: "Desert theme pairings must be tested separately from original and dark themes.",
      },
      useCaseInstructions: [
        "Use for desert theme page foundation only.",
        "Do not use as a decorative warm card fill.",
        "Use text-primary and border-warm-subtle until semantic mappings expand.",
      ],
    },
    {
      id: "background-surface-desert",
      tokenName: "--background-surface-desert",
      value: {
        backgroundRole: "surface foundation",
        surfaceRelationship: "sits above desert page foundation",
        mappedPaletteToken: "palette.sand.25",
        themeMapping: "desert",
        contrastPairings: "text-primary, border-warm-subtle",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: "#fffaf0",
        background: "#fffaf0",
        foreground: "#493327",
        label: "Desert surface",
      },
      metadata: {
        backgroundRole: "surface foundation",
        surfaceRelationship: "sits above desert page foundation",
        theme: "desert",
        state: "none",
        accessibility: "Must preserve readable text without becoming a decorative palette wash.",
      },
      useCaseInstructions: [
        "Use for desert theme primary content regions.",
        "Do not use as a brand accent or decorative marketing panel.",
        "Use text-primary and border-warm-subtle.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.preview.sample,
    role: variant.metadata.backgroundRole,
    surfaceRelationship: variant.metadata.surfaceRelationship,
    mappedPaletteToken: variant.value.mappedPaletteToken,
    theme: variant.metadata.theme,
    contrastPairings: variant.value.contrastPairings,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: {
      background: variant.preview.background,
      foreground: variant.preview.foreground,
      label: variant.preview.label,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Foregrounds", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const backgroundColorTokenVariants = variants.map(toPageVariant);

export const backgroundColorTokenSpec = {
  contractId: backgroundColorTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "Each row is a reusable background decision with preview, metadata, and usage constraints.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Page",
      title: "Original foundation",
      variantId: "background-page-original",
      supportingText: "Text and cards sit on top of the background token.",
    },
    {
      label: "Dark",
      title: "Dark foundation",
      variantId: "background-page-dark",
    },
    {
      label: "Desert",
      title: "Desert foundation",
      variantId: "background-page-desert",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["surfaceRelationship", "Surface relationship"],
    ["mappedPaletteToken", "Mapped palette token"],
    ["theme", "Theme"],
    ["contrastPairings", "Contrast pairings"],
    ["state", "State"],
  ],
  variants: backgroundColorTokenVariants,
  consumerRestrictions: [
    "Consumers must use this system token module instead of copying background color literals.",
    "Primitives and patterns may consume exported variants after their own harness gates pass.",
    "App pages must not recreate these background decisions with local CSS.",
  ],
  requiredEvidence: [
    "Original, dark, and desert theme screenshots must show readable foreground pairings.",
    "150% zoom must keep variant labels, values, metadata, and use-case instructions readable.",
    "Color must not be the only carrier of state or meaning.",
  ],
};
