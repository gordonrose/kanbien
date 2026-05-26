import { primaryTintedBackgroundTokenContract } from "../../../../layers/02-token/primary-tinted-background/contract.mjs";
import { variants as primaryColorSourceVariants } from "./primaryColorSource.tokens.mjs";

const primarySourceByTheme = new Map(primaryColorSourceVariants.map((variant) => [variant.value.themeMapping, variant]));

function primarySource(theme) {
  const source = primarySourceByTheme.get(theme);
  if (!source) {
    throw new Error(`Missing primary color source token for ${theme} theme.`);
  }

  return source;
}

function tintedBackgroundValue(theme, mixTarget = "white", sourceRatio = "12%") {
  return `color-mix(in srgb, ${primarySource(theme).value.colorValue} ${sourceRatio}, ${mixTarget})`;
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "background-color",
  previewKind: "surface-swatch",
  variantSchema: {
    valueFields: [
      "backgroundRole",
      "sourceTokenId",
      "sourceTokenName",
      "sourceColorValue",
      "backgroundValue",
      "foregroundPairing",
      "contrastRequirement",
      "themeMapping",
      "stateMapping",
    ],
    metadataFields: ["backgroundRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "contrastRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "primary-tinted-background",
  tokenType: "primary-tinted-background",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/primary-tinted-background/PrimaryTintedBackground-Implementation.md",
  page: {
    route: "/design-system/default/tokens/primary-tinted-background",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/primary-tinted-background/index.html",
    title: "Primary Tinted Background Tokens",
    description:
      "Review governed primary-tinted background variants derived from primary color source tokens.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/primary-tinted-background/contract.mjs",
    contractExport: "primaryTintedBackgroundTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedBackground.tokens.mjs",
    systemTokenExport: "primaryTintedBackgroundTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "primary-tinted-background-original",
      tokenName: "--primary-tinted-background-original",
      value: {
        backgroundRole: "primary tinted subtle background",
        sourceTokenId: primarySource("original").id,
        sourceTokenName: primarySource("original").tokenName,
        sourceColorValue: primarySource("original").value.colorValue,
        backgroundValue: tintedBackgroundValue("original"),
        foregroundPairing: "text-primary",
        contrastRequirement: "Must support approved primary-readable text or label tokens before text-bearing use.",
        themeMapping: "original",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: tintedBackgroundValue("original"),
        background: tintedBackgroundValue("original"),
        foreground: "#20242c",
        label: "Original primary tint",
      },
      metadata: {
        backgroundRole: "primary tinted subtle background",
        theme: "original",
        state: "none",
        accessibility:
          "This tint may provide low-emphasis primary context, but it is not selected, status, or validation meaning.",
      },
      useCaseInstructions: [
        "Use for low-emphasis primary-tinted surfaces after the consuming primitive or pattern proves text pairing.",
        "Do not use as selected, active, warning, error, success, or validation meaning.",
        "Do not place text on this tint without an approved foreground token pairing.",
      ],
    },
    {
      id: "primary-tinted-background-dark",
      tokenName: "--primary-tinted-background-dark",
      value: {
        backgroundRole: "primary tinted subtle background",
        sourceTokenId: primarySource("dark").id,
        sourceTokenName: primarySource("dark").tokenName,
        sourceColorValue: primarySource("dark").value.colorValue,
        backgroundValue: tintedBackgroundValue("dark", "#171b22", "16%"),
        foregroundPairing: "text-inverse",
        contrastRequirement: "Must support approved dark-theme primary-readable text or label tokens before text-bearing use.",
        themeMapping: "dark",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: tintedBackgroundValue("dark", "#171b22", "16%"),
        background: tintedBackgroundValue("dark", "#171b22", "16%"),
        foreground: "#f4f7fb",
        label: "Dark primary tint",
      },
      metadata: {
        backgroundRole: "primary tinted subtle background",
        theme: "dark",
        state: "none",
        accessibility: "Dark-theme primary tint must be reviewed separately from original-theme tint.",
      },
      useCaseInstructions: [
        "Use for low-emphasis dark-theme primary-tinted surfaces after the consuming primitive or pattern proves text pairing.",
        "Do not use as selected, active, warning, error, success, validation, or original-theme evidence.",
        "Do not place text on this tint without an approved dark-theme foreground token pairing.",
      ],
    },
    {
      id: "primary-tinted-background-desert",
      tokenName: "--primary-tinted-background-desert",
      value: {
        backgroundRole: "primary tinted subtle background",
        sourceTokenId: primarySource("desert").id,
        sourceTokenName: primarySource("desert").tokenName,
        sourceColorValue: primarySource("desert").value.colorValue,
        backgroundValue: tintedBackgroundValue("desert", "#fffaf0", "12%"),
        foregroundPairing: "text-primary",
        contrastRequirement: "Must support approved desert-theme primary-readable text or label tokens before text-bearing use.",
        themeMapping: "desert",
        stateMapping: "none",
      },
      preview: {
        kind: "surface-swatch",
        sample: tintedBackgroundValue("desert", "#fffaf0", "12%"),
        background: tintedBackgroundValue("desert", "#fffaf0", "12%"),
        foreground: "#493327",
        label: "Desert primary tint",
      },
      metadata: {
        backgroundRole: "primary tinted subtle background",
        theme: "desert",
        state: "none",
        accessibility: "Desert-theme primary tint must be reviewed separately from original and dark theme tint.",
      },
      useCaseInstructions: [
        "Use for low-emphasis desert-theme primary-tinted surfaces after the consuming primitive or pattern proves text pairing.",
        "Do not use as selected, active, warning, error, success, validation, or other-theme evidence.",
        "Do not place text on this tint without an approved desert-theme foreground token pairing.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.backgroundValue,
    role: variant.metadata.backgroundRole,
    sourceTokenName: variant.value.sourceTokenName,
    sourceColorValue: variant.value.sourceColorValue,
    backgroundValue: variant.value.backgroundValue,
    foregroundPairing: variant.value.foregroundPairing,
    contrastRequirement: variant.value.contrastRequirement,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
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
      { label: "Contrast", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const primaryTintedBackgroundTokenVariants = variants.map(toPageVariant);

export const primaryTintedBackgroundTokenSpec = {
  contractId: primaryTintedBackgroundTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a primary-tinted background derived from the matching primary color source variant.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original primary tint",
      variantId: "primary-tinted-background-original",
      supportingText: "Low-emphasis primary context without selected or status meaning.",
    },
    {
      label: "Dark",
      title: "Dark primary tint",
      variantId: "primary-tinted-background-dark",
      supportingText: "Dark-theme tint derived from dark primary source.",
    },
    {
      label: "Desert",
      title: "Desert primary tint",
      variantId: "primary-tinted-background-desert",
      supportingText: "Warm-theme tint derived from desert primary source.",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Temporary primary source override",
    description:
      "Use this local preview value to test whether the primary-tinted background responds to its source token. It does not change signed token values.",
    inputLabel: "Preview primary HEX",
    defaultHex: primarySource("original").value.colorValue,
    resetLabel: "Reset",
    previewLabel: "Temporary derived tint preview",
    tintMixTarget: "white",
    tintSourceRatio: "12%",
    tintForeground: "#20242c",
    previews: [
      {
        role: "source",
        label: "Source",
        sample: primarySource("original").value.colorValue,
      },
      {
        role: "primary-tinted-background",
        label: "Primary tint",
        sample: "Derived tint",
      },
      {
        role: "label",
        label: "Source label",
        sample: "Derived label",
      },
      {
        role: "ring",
        label: "Focus reference",
        sample: "Derived ring",
      },
    ],
    validStatus: "Temporary preview only. Signed token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
  },
  variantFields: [
    ["role", "Role"],
    ["sourceTokenName", "Primary source"],
    ["sourceColorValue", "Source color"],
    ["backgroundValue", "Tint value"],
    ["foregroundPairing", "Foreground pairing"],
    ["theme", "Theme"],
    ["state", "State"],
    ["contrastRequirement", "Contrast requirement"],
  ],
  variants: primaryTintedBackgroundTokenVariants,
  consumerRestrictions: [
    "Consumers must use this system token module instead of copying primary tint literals.",
    "Consumers must not use this token as selected, active, warning, error, success, or validation meaning.",
    "Text-bearing use requires an approved foreground token pairing in the consuming primitive or pattern.",
    "App pages must not recreate these tint decisions with local CSS.",
  ],
  requiredEvidence: [
    "Original, dark, and desert primary-tinted backgrounds must render separately.",
    "Each variant must declare the matching primary-color-source token and source color.",
    "LTR and RTL rendering must preserve tint labels and card readability.",
    "150% zoom must keep tint details readable and non-overlapping.",
    "The proof must state that this token is not selected, status, or validation meaning.",
  ],
};
