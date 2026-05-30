import { choiceOptionFrameTokenContract } from "../../../../layers/02-token/choice-option-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";
import { errorTextStyleTokenSpec } from "./errorTextStyle.tokens.mjs";
import { labelTextStyleTokenVariants } from "./labelTextStyle.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";
import { primaryTintedBackgroundTokenVariants } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";
import { supportingTextStyleTokenVariants } from "./supportingTextStyle.tokens.mjs";

const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");
const errorTextStyle = errorTextStyleTokenSpec.variants.find((variant) => variant.id === "error-text-style-default");
const labelTextStyle = labelTextStyleTokenVariants.find((variant) => variant.role === "short label text");
const supportingTextStyle = supportingTextStyleTokenVariants.find((variant) => variant.role === "supporting text");
const selectedBackgroundByTheme = new Map(primaryTintedBackgroundTokenVariants.map((variant) => [variant.theme, variant]));
const selectedForegroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);

if (!bodyRegionFrame || !minimumTarget || !errorTextStyle || !labelTextStyle || !supportingTextStyle) {
  throw new Error("choice-option-frame requires signed body-region, target-size, error text, label text, and supporting text tokens.");
}

function selectedBackground(theme) {
  const variant = selectedBackgroundByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing primary-tinted-background token for ${theme}.`);
  }
  return variant;
}

function selectedForeground(theme) {
  const variant = selectedForegroundByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing primary-tinted-foreground token for ${theme}.`);
  }
  return variant;
}

function surface(theme) {
  const variant = surfaceByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing background surface token for ${theme}.`);
  }
  return variant;
}

function valuesForState(theme, state) {
  const selectedBg = selectedBackground(theme);
  const selectedFg = selectedForeground(theme);
  const surfaceVariant = surface(theme);
  const baseBackground = surfaceVariant.preview.background;
  const baseForeground = surfaceVariant.preview.foreground;
  const baseBorder = `color-mix(in srgb, ${baseForeground} 16%, ${baseBackground})`;
  const errorForeground = errorTextStyle.foregroundValue;

  if (state === "selected") {
    const selectedBackgroundValue = selectedBg.backgroundValue;
    const selectedForegroundValue = selectedFg.colorValueOrMapping;
    return {
      backgroundValue: selectedBackgroundValue,
      foregroundValue: selectedForegroundValue,
      borderValue: `color-mix(in srgb, ${selectedForegroundValue} 68%, ${baseBackground})`,
      sourceTokenName: `${selectedBg.tokenName} + ${selectedFg.tokenName} + ${surfaceVariant.tokenName}`,
      sourceValue: `${selectedBackgroundValue} + ${selectedForegroundValue}`,
      formulaOrMapping:
        "selected background and foreground use signed primary tint tokens; selected border mixes the selected foreground over the theme surface",
    };
  }

  if (state === "disabled") {
    return {
      backgroundValue: `color-mix(in srgb, ${baseForeground} 4%, ${baseBackground})`,
      foregroundValue: `color-mix(in srgb, ${baseForeground} 54%, ${baseBackground})`,
      borderValue: `color-mix(in srgb, ${baseBorder} 64%, ${baseBackground})`,
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: baseBackground,
      formulaOrMapping:
        "disabled background, foreground, and border mix theme foreground or border over the theme surface; disabled semantics remain primitive-owned",
    };
  }

  if (state === "error") {
    return {
      backgroundValue: baseBackground,
      foregroundValue: errorForeground,
      borderValue: errorForeground,
      sourceTokenName: `${surfaceVariant.tokenName} + ${errorTextStyle.tokenName}`,
      sourceValue: `${baseBackground} + ${errorForeground}`,
      formulaOrMapping:
        "error frame keeps the theme surface and uses the signed error-text foreground for foreground and border; error semantics remain primitive-owned",
    };
  }

  return {
    backgroundValue: baseBackground,
    foregroundValue: baseForeground,
    borderValue: baseBorder,
    sourceTokenName: surfaceVariant.tokenName,
    sourceValue: baseBackground,
    formulaOrMapping:
      "default frame inherits theme surface, foreground, and border; state behavior remains primitive-owned",
  };
}

function makeVariant(theme, state) {
  const stateValues = valuesForState(theme, state);
  const radiusValue = bodyRegionFrame.radiusValue;
  const paddingBlockValue = "0.75rem";
  const paddingInlineValue = "1rem";
  const textGapValue = "0.25rem";

  return {
    id: `choice-option-frame-${state}-${theme}`,
    tokenName: `--choice-option-frame-${state}-${theme}`,
    value: {
      frameRole: "choice option frame",
      state,
      theme,
      backgroundValue: stateValues.backgroundValue,
      foregroundValue: stateValues.foregroundValue,
      borderValue: stateValues.borderValue,
      radiusValue,
      paddingBlockValue,
      paddingInlineValue,
      textGapValue,
      minBlockSize: minimumTarget.minimumHeight,
      labelTextStyleTokenName: labelTextStyle.tokenName,
      supportingTextStyleTokenName: supportingTextStyle.tokenName,
    },
    derivation: {
      sourceTokenName: `${stateValues.sourceTokenName} + ${minimumTarget.tokenName} + ${labelTextStyle.tokenName} + ${supportingTextStyle.tokenName}`,
      sourceValue: `${stateValues.sourceValue} + ${minimumTarget.minimumHeight} + ${labelTextStyle.tokenValue} + ${supportingTextStyle.tokenValue}`,
      formulaOrMapping: `${stateValues.formulaOrMapping}; radius derives from body-region-frame; padding and internal text gap are choice-option-frame values`,
      renderedValue: `${stateValues.backgroundValue} / ${stateValues.foregroundValue} / ${stateValues.borderValue} / ${radiusValue} radius / ${minimumTarget.minimumHeight} min height`,
    },
    preview: {
      kind: "surface-card",
      sample: state === "selected" ? "Selected option" : `${state[0].toUpperCase()}${state.slice(1)} option`,
      background: stateValues.backgroundValue,
      foreground: stateValues.foregroundValue,
      border: stateValues.borderValue,
      radius: radiusValue,
      label: `${theme} ${state} choice option`,
    },
    metadata: {
      frameRole: "choice option frame",
      theme,
      state,
      accessibility:
        "Choice-option frame state must be paired with native control semantics, focus visibility, and color-independent state communication in the consuming primitive.",
    },
    useCaseInstructions: [
      `Use for ${state} selectable choice-option frame visuals in governed choice primitives.`,
      "Do not use for text controls, buttons, navigation items, panels, arbitrary cards, or app-local option rows.",
      "Pair with label-text-style, supporting-text-style, focus-ring, minimum-target-size, and native input semantics in the consuming primitive.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "choice-option-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "state",
      "theme",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "textGapValue",
      "minBlockSize",
      "labelTextStyleTokenName",
      "supportingTextStyleTokenName",
    ],
    metadataFields: ["frameRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "radio-simple-select",
  tokenType: "choice-option-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/choice-option-frame/ChoiceOptionFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/choice-option-frame/ChoiceOptionFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/choice-option-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/choice-option-frame/index.html",
    title: "Choice Option Frame Token",
    description: "Review reusable selectable option frame values before radio or card choice primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/choice-option-frame/contract.mjs",
    contractExport: "choiceOptionFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/choice-option-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/choiceOptionFrame.tokens.mjs",
    systemTokenExport: "choiceOptionFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.body-region-frame",
      variantId: bodyRegionFrame.id,
      tokenName: bodyRegionFrame.tokenName,
      value: bodyRegionFrame.tokenValue,
      relationship: "derived-from",
    },
    {
      contractId: "tokens.primary-tinted-background",
      variantId: "primary-tinted-background-*",
      tokenName: "--primary-tinted-background-*",
      value: "theme-specific selected background",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.primary-tinted-foreground",
      variantId: "primary-tinted-foreground-*",
      tokenName: "--primary-tinted-foreground-*",
      value: "theme-specific selected foreground",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.error-text-style",
      variantId: errorTextStyle.id,
      tokenName: errorTextStyle.tokenName,
      value: errorTextStyle.foregroundValue,
      relationship: "derived-from",
    },
    {
      contractId: "tokens.minimum-target-size",
      variantId: minimumTarget.id,
      tokenName: minimumTarget.tokenName,
      value: minimumTarget.minimumHeight,
      relationship: "derived-from",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    rule:
      "Proof-only primary source and host-surface changes may alter rendered selected choice-option previews but must not mutate signed token data.",
  },
  variants: ["original", "dark", "desert"].flatMap((theme) =>
    ["default", "selected", "disabled", "error"].map((state) => makeVariant(theme, state)),
  ),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    role: variant.metadata.frameRole,
    frameRole: variant.value.frameRole,
    state: variant.value.state,
    theme: variant.value.theme,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    textGapValue: variant.value.textGapValue,
    minBlockSize: variant.value.minBlockSize,
    labelTextStyleTokenName: variant.value.labelTextStyleTokenName,
    supportingTextStyleTokenName: variant.value.supportingTextStyleTokenName,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const choiceOptionFrameTokenVariants = variants.map(toPageVariant);

export const choiceOptionFrameTokenSpec = {
  contractId: choiceOptionFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "choice-option-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a reusable selectable option frame decision. Native control behavior remains owned by primitives.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original selected option",
      variantId: "choice-option-frame-selected-original",
      supportingText: "Selected frame using original primary tint tokens.",
    },
    {
      label: "Dark",
      title: "Dark selected option",
      variantId: "choice-option-frame-selected-dark",
      supportingText: "Selected frame using dark primary tint tokens.",
    },
    {
      label: "Desert",
      title: "Desert selected option",
      variantId: "choice-option-frame-selected-desert",
      supportingText: "Selected frame using desert primary tint tokens.",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Review Primary Source Dependency",
    description:
      "Change the proof-only primary source HEX and host surface to verify selected choice-option derivations without changing signed token data.",
    inputLabel: "Preview primary HEX",
    defaultHex: "#635bff",
    resetLabel: "Reset",
    previewLabel: "Temporary choice-option derivation previews",
    validStatus: "Temporary preview only. Signed choice-option-frame token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
    tintSourceRatio: "12%",
    tintMixTarget: bodyRegionFrame.backgroundValue,
    foregroundSourceRatio: "88%",
    foregroundMixTarget: bodyRegionFrame.foregroundValue,
    previews: [
      { role: "source", label: "Source", sample: "#635bff" },
      { role: "choice-option-background", label: "Selected background", sample: "12% source over surface" },
      { role: "choice-option-foreground", label: "Selected foreground", sample: "88% source over foreground" },
      { role: "choice-option-border", label: "Selected border", sample: "68% foreground over surface" },
    ],
    surfaceInputLabel: "Host surface",
    surfaceOptions: [
      {
        label: "Body region surface",
        value: bodyRegionFrame.backgroundValue,
        tokenName: bodyRegionFrame.tokenName,
      },
      {
        label: "Body region foreground",
        value: bodyRegionFrame.foregroundValue,
        tokenName: bodyRegionFrame.tokenName,
      },
    ],
  },
  variantFields: [
    ["role", "Role"],
    ["state", "State"],
    ["theme", "Theme"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Block padding"],
    ["paddingInlineValue", "Inline padding"],
    ["textGapValue", "Text gap"],
    ["minBlockSize", "Min height"],
    ["labelTextStyleTokenName", "Label text"],
    ["supportingTextStyleTokenName", "Supporting text"],
    ["sourceTokenName", "Source tokens"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: choiceOptionFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling selectable option frames locally.",
    "Consumers must not use this token as proof of radio behavior, checked state, accessible names, focus visibility, option-grid layout, or text disclosure.",
    "Choice primitives must pair this token with native input semantics, focus-ring, minimum-target-size, label-text-style, supporting-text-style, and text-overflow disclosure.",
  ],
  requiredEvidence: [
    "Rendered proof must show default, selected, disabled, and error variants across original, dark, and desert themes.",
    "Proof must show upstream token identities and formulas for derived frame values.",
    "Proof-only primary HEX and host-surface overrides must change selected option derived previews without changing signed token values.",
    "Desktop and mobile proof must avoid horizontal overflow and visible text overlap.",
  ],
};
