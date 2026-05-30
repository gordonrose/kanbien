import { dropdownTriggerFrameTokenContract } from "../../../../layers/02-token/dropdown-trigger-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";
import { errorTextStyleTokenSpec } from "./errorTextStyle.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";
import { primaryTintedBackgroundTokenVariants } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";

const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");
const errorTextStyle = errorTextStyleTokenSpec.variants.find((variant) => variant.id === "error-text-style-default");
const selectedBackgroundByTheme = new Map(primaryTintedBackgroundTokenVariants.map((variant) => [variant.theme, variant]));
const selectedForegroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);

if (!bodyRegionFrame || !minimumTarget || !errorTextStyle) {
  throw new Error("dropdown-trigger-frame requires signed body-region-frame, minimum-target-size, and error-text-style tokens.");
}

function primaryBackground(theme) {
  const variant = selectedBackgroundByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing primary-tinted-background token for ${theme}.`);
  }
  return variant;
}

function primaryForeground(theme) {
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

function stateValues(theme, state) {
  const surfaceVariant = surface(theme);
  const baseBackground = surfaceVariant.preview.background;
  const baseForeground = surfaceVariant.preview.foreground;
  const baseBorder = `color-mix(in srgb, ${baseForeground} 16%, ${baseBackground})`;

  if (state === "open") {
    const tint = primaryBackground(theme);
    const foreground = primaryForeground(theme);
    return {
      backgroundValue: tint.backgroundValue,
      foregroundValue: foreground.colorValueOrMapping,
      borderValue: foreground.colorValueOrMapping,
      sourceTokenName: `${tint.tokenName} + ${foreground.tokenName}`,
      sourceValue: `${tint.backgroundValue} + ${foreground.colorValueOrMapping}`,
      formulaOrMapping: "open trigger state uses signed primary tint background and foreground tokens",
    };
  }

  if (state === "disabled") {
    return {
      backgroundValue: `color-mix(in srgb, ${baseForeground} 4%, ${baseBackground})`,
      foregroundValue: `color-mix(in srgb, ${baseForeground} 54%, ${baseBackground})`,
      borderValue: `color-mix(in srgb, ${baseBorder} 64%, ${baseBackground})`,
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: baseBackground,
      formulaOrMapping: "disabled trigger values mix theme foreground and border over the theme surface",
    };
  }

  if (state === "error") {
    return {
      backgroundValue: baseBackground,
      foregroundValue: errorTextStyle.foregroundValue,
      borderValue: errorTextStyle.foregroundValue,
      sourceTokenName: `${surfaceVariant.tokenName} + ${errorTextStyle.tokenName}`,
      sourceValue: `${baseBackground} + ${errorTextStyle.foregroundValue}`,
      formulaOrMapping: "error trigger keeps theme surface and uses signed error foreground for text and border",
    };
  }

  return {
    backgroundValue: baseBackground,
    foregroundValue: baseForeground,
    borderValue: baseBorder,
    sourceTokenName: surfaceVariant.tokenName,
    sourceValue: baseBackground,
    formulaOrMapping: "default trigger inherits theme surface, foreground, and border",
  };
}

function makeVariant(theme, state) {
  const values = stateValues(theme, state);
  const radiusValue = bodyRegionFrame.radiusValue;
  const paddingBlockValue = "0.5rem";
  const paddingInlineValue = "0.75rem";

  return {
    id: `dropdown-trigger-frame-${state}-${theme}`,
    tokenName: `--dropdown-trigger-frame-${state}-${theme}`,
    value: {
      frameRole: "dropdown trigger frame",
      state,
      theme,
      backgroundValue: values.backgroundValue,
      foregroundValue: values.foregroundValue,
      borderValue: values.borderValue,
      radiusValue,
      paddingBlockValue,
      paddingInlineValue,
      minBlockSize: minimumTarget.minimumHeight,
      maxInlineSize: "100%",
    },
    derivation: {
      sourceTokenName: `${values.sourceTokenName} + ${minimumTarget.tokenName}`,
      sourceValue: `${values.sourceValue} + ${minimumTarget.minimumHeight}`,
      formulaOrMapping: `${values.formulaOrMapping}; radius derives from body-region-frame; padding is dropdown-trigger-frame owned`,
      renderedValue: `${values.backgroundValue} / ${values.foregroundValue} / ${values.borderValue} / ${radiusValue} radius / ${minimumTarget.minimumHeight} min height`,
    },
    preview: {
      kind: "surface-card",
      sample: state === "open" ? "Open dropdown" : `${state[0].toUpperCase()}${state.slice(1)} dropdown`,
      background: values.backgroundValue,
      foreground: values.foregroundValue,
      border: values.borderValue,
      radius: radiusValue,
      label: `${theme} ${state} dropdown trigger`,
    },
    metadata: {
      frameRole: "dropdown trigger frame",
      theme,
      state,
      accessibility: "Trigger frame state must be paired with primitive-owned button and listbox semantics.",
    },
    useCaseInstructions: [
      `Use for ${state} simple dropdown trigger frame visuals.`,
      "Do not use for text input, textarea, menu button, combobox, drawer select, or arbitrary card frames.",
      "Pair with focus-ring, minimum-target-size, field-value text, and primitive-owned listbox semantics.",
    ],
  };
}

const themes = ["original", "dark", "desert"];
const states = ["default", "open", "disabled", "error"];

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "dropdown-trigger-frame",
  previewKind: "surface-card",
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "simple-dropdown",
  tokenType: "dropdown-trigger-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/simple-dropdown/SimpleDropdown-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/dropdown-trigger-frame/DropdownTriggerFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/dropdown-trigger-frame/DropdownTriggerFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/dropdown-trigger-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/dropdown-trigger-frame/index.html",
    title: "Dropdown Trigger Frame Token",
    description: "Review reusable trigger frame values before simple dropdown primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/dropdown-trigger-frame/contract.mjs",
    contractExport: "dropdownTriggerFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/dropdown-trigger-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/dropdownTriggerFrame.tokens.mjs",
    systemTokenExport: "dropdownTriggerFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: themes.flatMap((theme) => states.map((state) => makeVariant(theme, state))),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    frameRole: variant.value.frameRole,
    state: variant.value.state,
    theme: variant.value.theme,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    minBlockSize: variant.value.minBlockSize,
    maxInlineSize: variant.value.maxInlineSize,
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

export const dropdownTriggerFrameTokenVariants = variants.map(toPageVariant);

export const dropdownTriggerFrameTokenSpec = {
  contractId: dropdownTriggerFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "dropdown-trigger-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These variants govern simple dropdown trigger frame values across state and theme.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Default",
      title: "Surface trigger",
      variantId: "dropdown-trigger-frame-default-original",
      supportingText: "Dropdown trigger frame values are signed separately from text-entry controls.",
    },
    {
      label: "Open",
      title: "Primary-tinted open trigger",
      variantId: "dropdown-trigger-frame-open-original",
      supportingText: "Open trigger color derives from signed primary tint tokens.",
    },
    {
      label: "Error",
      title: "Error trigger",
      variantId: "dropdown-trigger-frame-error-original",
      supportingText: "Error color derives from signed error text foreground.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["state", "State"],
    ["theme", "Theme"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Padding block"],
    ["paddingInlineValue", "Padding inline"],
    ["minBlockSize", "Minimum height"],
    ["maxInlineSize", "Max width"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula"],
  ],
  variants: dropdownTriggerFrameTokenVariants,
  consumerRestrictions: dropdownTriggerFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Rendered token proof shows default, open, disabled, and error trigger frames across supported themes.",
    "Rendered token proof exposes source token names and derivation formulas for state color decisions.",
    "Browser verification confirms the token route renders without horizontal overflow.",
  ],
};
