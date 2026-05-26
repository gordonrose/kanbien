import { primaryTintedForegroundTokenContract } from "../../../../contracts/tokens/primaryTintedForeground.contract.mjs";
import { variants as primaryTintedBackgroundVariants } from "./primaryTintedBackground.tokens.mjs";

const backgroundByTheme = new Map(primaryTintedBackgroundVariants.map((variant) => [variant.value.themeMapping, variant]));

function pairedBackground(theme) {
  const background = backgroundByTheme.get(theme);
  if (!background) {
    throw new Error(`Missing primary tinted background token for ${theme} theme.`);
  }

  return background;
}

const foregroundMixByTheme = {
  original: { sourceRatio: "48%", mixTarget: "#111827" },
  dark: { sourceRatio: "22%", mixTarget: "#f4f7fb" },
  desert: { sourceRatio: "38%", mixTarget: "#493327" },
};

function foregroundValue(theme) {
  const background = pairedBackground(theme);
  const mix = foregroundMixByTheme[theme];

  return `color-mix(in srgb, ${background.value.sourceColorValue} ${mix.sourceRatio}, ${mix.mixTarget})`;
}

function foregroundFormula(theme) {
  const background = pairedBackground(theme);
  const mix = foregroundMixByTheme[theme];

  return `color-mix(in srgb, <${background.value.sourceTokenName}> ${mix.sourceRatio}, ${mix.mixTarget})`;
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "text-color",
  previewKind: "text-sample",
  variantSchema: {
    valueFields: [
      "textRole",
      "backgroundTokenId",
      "backgroundTokenName",
      "backgroundValue",
      "sourceTokenName",
      "sourceColorValue",
      "backgroundFormula",
      "colorValueOrMapping",
      "foregroundFormula",
      "contrastRequirement",
      "themeMapping",
      "stateMapping",
      "allowedContent",
    ],
    metadataFields: ["textRole", "backgroundPairing", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "approvedBackgrounds"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "primary-tinted-foreground",
  tokenType: "primary-tinted-foreground",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/primary-tinted-foreground/PrimaryTintedForeground-Implementation.md",
  page: {
    route: "/design-system/default/tokens/primary-tinted-foreground",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/primary-tinted-foreground/index.html",
    title: "Primary Tinted Foreground Tokens",
    description:
      "Review governed foreground variants paired with primary-tinted background tokens.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/contracts/tokens/primaryTintedForeground.contract.mjs",
    contractExport: "primaryTintedForegroundTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/primaryTintedForeground.tokens.mjs",
    systemTokenExport: "primaryTintedForegroundTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "primary-tinted-foreground-original",
      tokenName: "--primary-tinted-foreground-original",
      value: {
        textRole: "primary foreground on primary tint",
        backgroundTokenId: pairedBackground("original").id,
        backgroundTokenName: pairedBackground("original").tokenName,
        backgroundValue: pairedBackground("original").value.backgroundValue,
        sourceTokenName: pairedBackground("original").value.sourceTokenName,
        sourceColorValue: pairedBackground("original").value.sourceColorValue,
        backgroundFormula: "color-mix(in srgb, <primary-color-source> 12%, white)",
        colorValueOrMapping: foregroundValue("original"),
        foregroundFormula: foregroundFormula("original"),
        contrastRequirement: "Must remain readable on the original primary-tinted background.",
        themeMapping: "original",
        stateMapping: "none",
        allowedContent: "Short labels, badges, helper labels, and low-emphasis primary text.",
      },
      preview: {
        kind: "text-sample",
        sample: "Primary label",
        background: pairedBackground("original").value.backgroundValue,
        foreground: foregroundValue("original"),
        label: "Original foreground on tint",
      },
      metadata: {
        textRole: "primary foreground on primary tint",
        backgroundPairing: pairedBackground("original").tokenName,
        theme: "original",
        state: "none",
        accessibility: "Readable foreground proof is scoped to the paired original primary tint.",
      },
      useCaseInstructions: [
        "Use for short primary labels on the original primary-tinted background.",
        "Do not use as selected, active, warning, error, success, validation, or link meaning.",
        "Use only on --primary-tinted-background-original until broader pairings are signed.",
      ],
    },
    {
      id: "primary-tinted-foreground-dark",
      tokenName: "--primary-tinted-foreground-dark",
      value: {
        textRole: "primary foreground on primary tint",
        backgroundTokenId: pairedBackground("dark").id,
        backgroundTokenName: pairedBackground("dark").tokenName,
        backgroundValue: pairedBackground("dark").value.backgroundValue,
        sourceTokenName: pairedBackground("dark").value.sourceTokenName,
        sourceColorValue: pairedBackground("dark").value.sourceColorValue,
        backgroundFormula: "color-mix(in srgb, <primary-color-source> 16%, #171b22)",
        colorValueOrMapping: foregroundValue("dark"),
        foregroundFormula: foregroundFormula("dark"),
        contrastRequirement: "Must remain readable on the dark primary-tinted background.",
        themeMapping: "dark",
        stateMapping: "none",
        allowedContent: "Short labels, badges, helper labels, and low-emphasis primary text.",
      },
      preview: {
        kind: "text-sample",
        sample: "Primary label",
        background: pairedBackground("dark").value.backgroundValue,
        foreground: foregroundValue("dark"),
        label: "Dark foreground on tint",
      },
      metadata: {
        textRole: "primary foreground on primary tint",
        backgroundPairing: pairedBackground("dark").tokenName,
        theme: "dark",
        state: "none",
        accessibility: "Dark foreground proof is scoped to the paired dark primary tint.",
      },
      useCaseInstructions: [
        "Use for short primary labels on the dark primary-tinted background.",
        "Do not use as selected, active, warning, error, success, validation, or link meaning.",
        "Use only on --primary-tinted-background-dark until broader pairings are signed.",
      ],
    },
    {
      id: "primary-tinted-foreground-desert",
      tokenName: "--primary-tinted-foreground-desert",
      value: {
        textRole: "primary foreground on primary tint",
        backgroundTokenId: pairedBackground("desert").id,
        backgroundTokenName: pairedBackground("desert").tokenName,
        backgroundValue: pairedBackground("desert").value.backgroundValue,
        sourceTokenName: pairedBackground("desert").value.sourceTokenName,
        sourceColorValue: pairedBackground("desert").value.sourceColorValue,
        backgroundFormula: "color-mix(in srgb, <primary-color-source> 12%, #fffaf0)",
        colorValueOrMapping: foregroundValue("desert"),
        foregroundFormula: foregroundFormula("desert"),
        contrastRequirement: "Must remain readable on the desert primary-tinted background.",
        themeMapping: "desert",
        stateMapping: "none",
        allowedContent: "Short labels, badges, helper labels, and low-emphasis primary text.",
      },
      preview: {
        kind: "text-sample",
        sample: "Primary label",
        background: pairedBackground("desert").value.backgroundValue,
        foreground: foregroundValue("desert"),
        label: "Desert foreground on tint",
      },
      metadata: {
        textRole: "primary foreground on primary tint",
        backgroundPairing: pairedBackground("desert").tokenName,
        theme: "desert",
        state: "none",
        accessibility: "Desert foreground proof is scoped to the paired desert primary tint.",
      },
      useCaseInstructions: [
        "Use for short primary labels on the desert primary-tinted background.",
        "Do not use as selected, active, warning, error, success, validation, or link meaning.",
        "Use only on --primary-tinted-background-desert until broader pairings are signed.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.colorValueOrMapping,
    role: variant.metadata.textRole,
    backgroundTokenName: variant.value.backgroundTokenName,
    backgroundValue: variant.value.backgroundValue,
    sourceTokenName: variant.value.sourceTokenName,
    sourceColorValue: variant.value.sourceColorValue,
    backgroundFormula: variant.value.backgroundFormula,
    colorValueOrMapping: variant.value.colorValueOrMapping,
    foregroundFormula: variant.value.foregroundFormula,
    contrastRequirement: variant.value.contrastRequirement,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    allowedContent: variant.value.allowedContent,
    accessibility: variant.metadata.accessibility,
    preview: {
      kind: variant.preview.kind,
      background: variant.preview.background,
      foreground: variant.preview.foreground,
      label: variant.preview.label,
      sample: variant.preview.sample,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const primaryTintedForegroundTokenVariants = variants.map(toPageVariant);

export const primaryTintedForegroundTokenSpec = {
  contractId: primaryTintedForegroundTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a foreground/text decision paired with a primary-tinted background variant.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original foreground on tint",
      variantId: "primary-tinted-foreground-original",
      supportingText: "Readable short-label foreground on original primary tint.",
    },
    {
      label: "Dark",
      title: "Dark foreground on tint",
      variantId: "primary-tinted-foreground-dark",
      supportingText: "Readable short-label foreground on dark primary tint.",
    },
    {
      label: "Desert",
      title: "Desert foreground on tint",
      variantId: "primary-tinted-foreground-desert",
      supportingText: "Readable short-label foreground on desert primary tint.",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Temporary primary source override",
    description:
      "Use this local preview value to test whether the foreground and its paired tint respond to the primary color source. It does not change signed token values.",
    inputLabel: "Preview primary HEX",
    defaultHex: pairedBackground("original").value.sourceColorValue,
    resetLabel: "Reset",
    previewLabel: "Temporary foreground derivation preview",
    tintMixTarget: "white",
    tintSourceRatio: "12%",
    tintForeground: "#20242c",
    foregroundMixTarget: "#111827",
    foregroundSourceRatio: "48%",
    previews: [
      {
        role: "source",
        label: "Source",
        sample: pairedBackground("original").value.sourceColorValue,
      },
      {
        role: "primary-tinted-background",
        label: "Tint",
        sample: "Derived tint",
      },
      {
        role: "primary-tinted-foreground",
        label: "Foreground",
        sample: "Primary label",
      },
      {
        role: "label",
        label: "Formula label",
        sample: "Derived text",
      },
    ],
    validStatus: "Temporary preview only. Signed token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
  },
  variantFields: [
    ["role", "Role"],
    ["sourceTokenName", "Primary source"],
    ["sourceColorValue", "Source color"],
    ["backgroundTokenName", "Background pairing"],
    ["backgroundValue", "Background value"],
    ["backgroundFormula", "Background formula"],
    ["colorValueOrMapping", "Foreground value"],
    ["foregroundFormula", "Foreground formula"],
    ["contrastRequirement", "Contrast requirement"],
    ["theme", "Theme"],
    ["state", "State"],
    ["allowedContent", "Allowed content"],
  ],
  variants: primaryTintedForegroundTokenVariants,
  consumerRestrictions: [
    "Consumers must use this system token module instead of copying foreground literals.",
    "Consumers must pair each foreground variant only with its approved primary-tinted background variant.",
    "Consumers must not use this token as selected, active, warning, error, success, validation, or link meaning.",
    "App pages must not recreate these foreground decisions with local CSS.",
  ],
  requiredEvidence: [
    "Original, dark, and desert foreground-on-tint samples must render separately.",
    "Each variant must declare the matching primary-tinted-background token and background value.",
    "LTR and RTL rendering must preserve readable text samples and labels.",
    "150% zoom must keep foreground samples readable and non-overlapping.",
    "The proof must state that this token is not selected, status, validation, or link meaning.",
  ],
};
