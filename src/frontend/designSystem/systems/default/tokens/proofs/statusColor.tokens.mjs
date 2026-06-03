import { statusColorTokenContract } from "../../../../layers/02-token/status-color/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";

const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);

const warningSourceByTheme = {
  original: "#8a4b08",
  dark: "#ffd27a",
  desert: "#8a4b08",
};

function surface(theme) {
  const variant = surfaceByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing background surface token for ${theme}.`);
  }
  return variant;
}

function makeWarningVariant(theme) {
  const surfaceVariant = surface(theme);
  const surfaceValue = surfaceVariant.preview.background;
  const sourceColorValue = warningSourceByTheme[theme];
  const foregroundValue = sourceColorValue;
  const backgroundValue = `color-mix(in srgb, ${sourceColorValue} 8%, ${surfaceValue})`;
  const subtleBackgroundValue = `color-mix(in srgb, ${sourceColorValue} 6%, ${surfaceValue})`;
  const strongBackgroundValue = `color-mix(in srgb, ${sourceColorValue} 16%, ${surfaceValue})`;
  const borderValue = `color-mix(in srgb, ${sourceColorValue} 54%, ${surfaceValue})`;

  return {
    id: `status-color-warning-${theme}`,
    tokenName: `--status-color-warning-${theme}`,
    value: {
      statusRole: "status color",
      status: "warning",
      theme,
      sourceColorValue,
      backgroundValue,
      foregroundValue,
      borderValue,
      subtleBackgroundValue,
      strongBackgroundValue,
      contrastPairing:
        "Warning foreground must remain readable on warning background and must be paired with text, icon, or programmatic status meaning.",
    },
    derivation: {
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: `${surfaceValue} + warning source ${sourceColorValue}`,
      formulaOrMapping:
        "warning status values mix a signed warning source color over the signed theme surface; this token owns warning color pairing, not warning behavior",
      renderedValue: `${backgroundValue} / ${foregroundValue} / ${borderValue} / ${subtleBackgroundValue} subtle / ${strongBackgroundValue} strong`,
    },
    preview: {
      kind: "surface-card",
      sample: "Warning status",
      background: backgroundValue,
      foreground: foregroundValue,
      border: borderValue,
      radius: "0.375rem",
      label: `${theme} warning status color`,
    },
    metadata: {
      statusRole: "status color",
      theme,
      status: "warning",
      accessibility:
        "Warning colour must be paired with visible text, an icon, or programmatic status context; colour alone is not sufficient.",
    },
    useCaseInstructions: [
      "Use for warning-colour pairings in governed status-aware primitives and patterns.",
      "Do not use for selected, active, focus, disabled, success, info, validation behavior, product copy, or arbitrary decorative colour.",
      "Pair with non-colour status communication in the consuming primitive or pattern.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "status-color",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "statusRole",
      "status",
      "theme",
      "sourceColorValue",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "subtleBackgroundValue",
      "strongBackgroundValue",
      "contrastPairing",
    ],
    metadataFields: ["statusRole", "theme", "status", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "colorIndependentRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "colours",
  tokenType: "status-color",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/status-color/StatusColor-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/status-color/StatusColor-Implementation.md",
  page: {
    route: "/design-system/default/tokens/status-color",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/status-color/index.html",
    title: "Status Color Token",
    description: "Review governed status-colour pairings before status-aware primitives or patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/status-color/contract.mjs",
    contractExport: "statusColorTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/status-color/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/statusColor.tokens.mjs",
    systemTokenExport: "statusColorTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.background-color",
      variantId: "background-surface-*",
      tokenName: "--background-surface-*",
      value: "theme-specific surface foundation",
      relationship: "derived-from",
    },
  ],
  variants: ["original", "dark", "desert"].map(makeWarningVariant),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    role: variant.metadata.statusRole,
    status: variant.value.status,
    theme: variant.value.theme,
    sourceColorValue: variant.value.sourceColorValue,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    subtleBackgroundValue: variant.value.subtleBackgroundValue,
    strongBackgroundValue: variant.value.strongBackgroundValue,
    contrastPairing: variant.value.contrastPairing,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Non-colour cue", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const statusColorTokenVariants = variants.map(toPageVariant);

export const statusColorTokenSpec = {
  contractId: statusColorTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "status-color",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "The first review-ready status-colour variants are warning pairings across supported themes. Other statuses remain unapproved until added explicitly.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original warning",
      variantId: "status-color-warning-original",
      supportingText: "Warning colour pairing on original surface.",
    },
    {
      label: "Dark",
      title: "Dark warning",
      variantId: "status-color-warning-dark",
      supportingText: "Dark warning is distinct from original warning.",
    },
    {
      label: "Desert",
      title: "Desert warning",
      variantId: "status-color-warning-desert",
      supportingText: "Desert warning remains separate from selected or accent colour.",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["status", "Status"],
    ["theme", "Theme"],
    ["sourceColorValue", "Source colour"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["subtleBackgroundValue", "Subtle background"],
    ["strongBackgroundValue", "Strong background"],
    ["contrastPairing", "Contrast pairing"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: statusColorTokenVariants,
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Review Warning Source Dependency",
    description:
      "Change the proof-only warning source HEX and host surface to verify status colour derivations without changing signed token data.",
    inputLabel: "Preview warning HEX",
    defaultHex: warningSourceByTheme.original,
    resetLabel: "Reset",
    previewLabel: "Derived warning colour values",
    validStatus: "Temporary preview only. Signed status-colour token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #8a4b08.",
    surfaceInputLabel: "Host surface",
    surfaceOptions: [...surfaceByTheme.entries()].map(([theme, variant]) => ({
      label: `${theme} surface`,
      tokenName: variant.tokenName,
      value: variant.preview.background,
    })),
    previews: [
      {
        role: "source",
        label: "Warning source",
        sample: warningSourceByTheme.original,
      },
      {
        role: "status-background",
        label: "Warning background",
        sample: "8% source over surface",
      },
      {
        role: "status-foreground",
        label: "Warning foreground",
        sample: "source colour",
      },
      {
        role: "status-border",
        label: "Warning border",
        sample: "54% source over surface",
      },
      {
        role: "status-subtle",
        label: "Subtle background",
        sample: "6% source over surface",
      },
      {
        role: "status-strong",
        label: "Strong background",
        sample: "16% source over surface",
      },
    ],
  },
  consumerRestrictions: [
    "Consumers must import this token seam instead of inventing local warning colours.",
    "The current token approves warning only; success, info, destructive, and broader error status colours remain unapproved here.",
    "Consumers must pair status colour with non-colour meaning such as text, glyph, ARIA status context, or state copy.",
  ],
  requiredEvidence: [
    "Rendered proof must show warning variants across original, dark, and desert themes.",
    "Proof must show source surface identities and formulas for status colour pairings.",
    "Downstream primitives must consume this token before using warning frame colours.",
  ],
};
