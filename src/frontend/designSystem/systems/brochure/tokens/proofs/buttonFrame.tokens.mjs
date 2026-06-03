import { buttonFrameTokenContract } from "../../../../layers/02-token/button-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { labelTextStyleTokenVariants } from "./labelTextStyle.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";
import { variants as primaryColorSourceVariants } from "./primaryColorSource.tokens.mjs";

const backgroundById = new Map(backgroundColorTokenVariants.map((variant) => [variant.id, variant]));
const foregroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const primarySourceByTheme = new Map(primaryColorSourceVariants.map((variant) => [variant.value.themeMapping, variant]));
const labelTextStyle = labelTextStyleTokenVariants.find((variant) => variant.role === "short label text");

if (!labelTextStyle) {
  throw new Error("button-frame proof requires the signed label-text-style token preview.");
}

function background(id) {
  const variant = backgroundById.get(id);
  if (!variant) {
    throw new Error(`Missing background-color token variant ${id}.`);
  }
  return variant;
}

function primarySource(theme) {
  const variant = primarySourceByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing primary-color-source token for ${theme}.`);
  }
  return variant;
}

function primaryForeground(theme) {
  const variant = foregroundByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing primary-tinted-foreground token for ${theme}.`);
  }
  return variant;
}

function themeSurface(theme) {
  if (theme === "original") {
    return background("background-surface-original");
  }
  if (theme === "dark") {
    return background("background-surface-dark");
  }
  return background("background-surface-desert");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "button-frame",
  previewKind: "button-frame-sample",
  variantSchema: {
    valueFields: [
      "frameRole",
      "intent",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "gapValue",
      "visualInsetValue",
      "themeMapping",
      "hostSurfaceTokenName",
      "textStyleTokenName",
    ],
    metadataFields: ["frameRole", "intent", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

function makeVariant({ theme, role, intent, tokenName, paddingBlockValue, paddingInlineValue, sample }) {
  const source = primarySource(theme);
  const surface = themeSurface(theme);
  const foreground = primaryForeground(theme);
  const sourceValue = source.value.colorValue;
  const surfaceValue = surface.preview.background;
  const isQuietFrame = intent === "quiet";
  const backgroundValue = isQuietFrame ? surfaceValue : `color-mix(in srgb, ${sourceValue} 10%, ${surfaceValue})`;
  const borderValue = `color-mix(in srgb, ${sourceValue} 30%, ${surfaceValue})`;
  const backgroundFormula = isQuietFrame
    ? "background uses the signed host surface directly"
    : "background mixes primary source 10% over the host surface";

  return {
    id: `${tokenName.replace(/^--/, "")}`,
    tokenName,
    value: {
      frameRole: role,
      intent,
      backgroundValue,
      foregroundValue: foreground.colorValueOrMapping,
      borderValue,
      radiusValue: "0.375rem",
      paddingBlockValue,
      paddingInlineValue,
      gapValue: "0.25rem",
      visualInsetValue: role === "icon button frame" ? "0.25rem" : "0",
      themeMapping: theme,
      hostSurfaceTokenName: surface.tokenName,
      textStyleTokenName: labelTextStyle.tokenName,
    },
    derivation: {
      sourceTokenName: `${source.tokenName} + ${surface.tokenName} + ${foreground.tokenName} + ${labelTextStyle.tokenName}`,
      sourceValue: `${sourceValue} + ${surfaceValue} + ${foreground.colorValueOrMapping} + ${labelTextStyle.tokenValue}`,
      formulaOrMapping:
        `${backgroundFormula}; border mixes primary source 30% over the host surface; foreground uses primary-tinted-foreground; sample text uses label-text-style`,
      renderedValue: `${backgroundValue} / ${foreground.colorValueOrMapping} / ${borderValue}`,
    },
    preview: {
      kind: "button-frame-sample",
      sample,
      background: backgroundValue,
      foreground: foreground.colorValueOrMapping,
      border: borderValue,
      radius: "0.375rem",
      paddingBlock: paddingBlockValue,
      paddingInline: paddingInlineValue,
      gap: "0.25rem",
      visualInset: role === "icon button frame" ? "0.25rem" : "0",
      fontFamily: labelTextStyle.fontFamilyValue,
      fontSize: labelTextStyle.fontSizeValue,
      fontWeight: labelTextStyle.fontWeightValue,
      lineHeight: labelTextStyle.lineHeightValue,
      letterSpacing: labelTextStyle.letterSpacingValue,
      textTransform: labelTextStyle.textTransform,
      label: `${theme} ${role}`,
    },
    metadata: {
      frameRole: role,
      intent,
      theme,
      state: "enabled",
      accessibility:
        "Button frame color must remain paired with primitive-owned focus-ring, accessible name, and minimum target-size evidence.",
    },
    useCaseInstructions: [
      `Use for ${intent} ${role} visuals in governed button primitives.`,
      "Do not use for destructive, validation, selected/current, disabled, or navigation-state meaning.",
      "Pair with focus-ring, minimum-target-size, and native button semantics in the consuming primitive.",
    ],
  };
}

function variantsForTheme(theme) {
  return [
    makeVariant({
      theme,
      role: "icon button frame",
      intent: "quiet",
      tokenName: `--button-frame-icon-quiet-${theme}`,
      paddingBlockValue: "0",
      paddingInlineValue: "0",
      sample: "+",
    }),
    makeVariant({
      theme,
      role: "icon button frame",
      intent: "subtle",
      tokenName: `--button-frame-icon-subtle-${theme}`,
      paddingBlockValue: "0",
      paddingInlineValue: "0",
      sample: "+",
    }),
    makeVariant({
      theme,
      role: "text action button frame",
      intent: "subtle",
      tokenName: `--button-frame-text-action-${theme}`,
      paddingBlockValue: "0.35rem",
      paddingInlineValue: "0.55rem",
      sample: "Add",
    }),
  ];
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "button-frame",
  tokenType: "button-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/button-frame/ButtonFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/button-frame/ButtonFrame-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/button-frame",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/button-frame/index.html",
    title: "Button Frame Token",
    description: "Review governed reusable button frame values before button primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/button-frame/contract.mjs",
    contractExport: "buttonFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/button-frame/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/buttonFrame.tokens.mjs",
    systemTokenExport: "buttonFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.primary-color-source",
      variantId: "primary-color-source-*",
      tokenName: "--primary-color-source-*",
      value: "theme-specific primary source",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.background-color",
      variantId: "background-surface-*",
      tokenName: "--background-surface-*",
      value: "theme-specific host-surface mix target",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.primary-tinted-foreground",
      variantId: "primary-tinted-foreground-*",
      tokenName: "--primary-tinted-foreground-*",
      value: "theme-specific button foreground",
      relationship: "paired-with",
    },
    {
      contractId: "tokens.label-text-style",
      variantId: "label-text-style-short-default",
      tokenName: "--label-text-style-short-default",
      value: "proof sample text style",
      relationship: "proof-sample",
    },
  ],
  variants: ["original", "dark", "desert"].flatMap(variantsForTheme),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    role: variant.metadata.frameRole,
    frameRole: variant.value.frameRole,
    intent: variant.value.intent,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    gapValue: variant.value.gapValue,
    visualInsetValue: variant.value.visualInsetValue,
    hostSurfaceTokenName: variant.value.hostSurfaceTokenName,
    textStyleTokenName: variant.value.textStyleTokenName,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const buttonFrameTokenVariants = variants.map(toPageVariant);

export const buttonFrameTokenSpec = {
  contractId: buttonFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "button-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a reusable button-frame visual decision. Behavior and accessibility remain owned by primitives.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Icon",
      title: "Quiet icon button frame",
      variantId: "button-frame-icon-quiet-original",
      supportingText: "Pattern-selectable visual intent; hit area comes from minimum-target-size.",
    },
    {
      label: "Text",
      title: "Text action frame",
      variantId: "button-frame-text-action-original",
      supportingText: "Padding is frame-specific; activation remains primitive-owned.",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Review Primary Source Dependency",
    description:
      "Change the proof-only primary source HEX and host surface to verify that button background and border derivations respond without changing signed token data.",
    inputLabel: "Preview primary HEX",
    defaultHex: "#1f6f78",
    resetLabel: "Reset",
    previewLabel: "Temporary button-frame derivation previews",
    validStatus: "Temporary preview only. Signed button-frame token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
    previews: [
      { role: "source", label: "Source", sample: "#1f6f78" },
      { role: "button-background", label: "Button background", sample: "10% source over surface" },
      { role: "button-foreground", label: "Button foreground", sample: "derived foreground" },
      { role: "button-border", label: "Button border", sample: "30% source over host surface" },
    ],
    surfaceInputLabel: "Host surface",
    surfaceOptions: [
      {
        label: "Original surface",
        value: background("background-surface-original").preview.background,
        tokenName: "--background-surface-original",
      },
      {
        label: "Original page",
        value: background("background-page-original").preview.background,
        tokenName: "--background-page-original",
      },
      {
        label: "Original subtle",
        value: background("background-subtle-original").preview.background,
        tokenName: "--background-subtle-original",
      },
    ],
  },
  variantFields: [
    ["role", "Role"],
    ["intent", "Intent"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Padding block"],
    ["paddingInlineValue", "Padding inline"],
    ["gapValue", "Gap"],
    ["hostSurfaceTokenName", "Host surface"],
    ["textStyleTokenName", "Sample text style"],
    ["sourceTokenName", "Source tokens"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: buttonFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling reusable button frames locally.",
    "Consumers must not use this token as proof of native button behavior, accessible names, focus visibility, or target size.",
    "Icon-only and text-action primitives must pair this token with focus-ring and minimum-target-size.",
  ],
  requiredEvidence: [
    "Rendered proof must show icon-only and text-action frame variants across original, dark, and desert themes.",
    "Proof must show upstream source tokens and formula or mapping for derived button values.",
    "Proof-only primary HEX and host-surface overrides must change button-frame derived previews without changing signed token values.",
    "Rendered button proof text must consume label-text-style instead of proof-local typography.",
    "Desktop and mobile proof must avoid horizontal overflow and visible text overlap.",
  ],
};
