import { countCardFrameTokenContract } from "../../../../layers/02-token/count-card-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";
import { errorTextStyleTokenSpec } from "./errorTextStyle.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";
import { primaryTintedBackgroundTokenVariants } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";
import { statusColorTokenVariants } from "./statusColor.tokens.mjs";

const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");
const errorTextStyle = errorTextStyleTokenSpec.variants.find((variant) => variant.id === "error-text-style-default");
const selectedBackgroundByTheme = new Map(primaryTintedBackgroundTokenVariants.map((variant) => [variant.theme, variant]));
const selectedForegroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const warningStatusByTheme = new Map(
  statusColorTokenVariants
    .filter((variant) => variant.status === "warning")
    .map((variant) => [variant.theme, variant]),
);
const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);

if (!bodyRegionFrame || !minimumTarget || !errorTextStyle) {
  throw new Error("count-card-frame requires signed body-region-frame, minimum-target-size, and error-text-style tokens.");
}

function surface(theme) {
  const variant = surfaceByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing background surface token for ${theme}.`);
  }
  return variant;
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

function warningStatus(theme) {
  const variant = warningStatusByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing status-color warning token for ${theme}.`);
  }
  return variant;
}

function valuesForState(theme, state) {
  const surfaceVariant = surface(theme);
  const baseBackground = surfaceVariant.preview.background;
  const baseForeground = surfaceVariant.preview.foreground;
  const baseBorder = `color-mix(in srgb, ${baseForeground} 18%, ${baseBackground})`;
  const countBaseBackground = `color-mix(in srgb, ${baseForeground} 6%, ${baseBackground})`;

  if (state === "selected") {
    const selectedBg = selectedBackground(theme);
    const selectedFg = selectedForeground(theme);
    return {
      backgroundValue: selectedBg.backgroundValue,
      foregroundValue: selectedFg.colorValueOrMapping,
      borderValue: `color-mix(in srgb, ${selectedFg.colorValueOrMapping} 68%, ${baseBackground})`,
      countBackgroundValue: `color-mix(in srgb, ${selectedFg.colorValueOrMapping} 16%, ${baseBackground})`,
      countForegroundValue: selectedFg.colorValueOrMapping,
      countBorderValue: `color-mix(in srgb, ${selectedFg.colorValueOrMapping} 44%, ${baseBackground})`,
      sourceTokenName: `${selectedBg.tokenName} + ${selectedFg.tokenName} + ${surfaceVariant.tokenName}`,
      sourceValue: `${selectedBg.backgroundValue} + ${selectedFg.colorValueOrMapping} + ${baseBackground}`,
      formulaOrMapping:
        "selected count-card frame uses signed primary tint tokens; selected border and count slot mix selected foreground over the host surface",
    };
  }

  if (state === "disabled") {
    return {
      backgroundValue: `color-mix(in srgb, ${baseForeground} 3%, ${baseBackground})`,
      foregroundValue: `color-mix(in srgb, ${baseForeground} 48%, ${baseBackground})`,
      borderValue: `color-mix(in srgb, ${baseBorder} 62%, ${baseBackground})`,
      countBackgroundValue: `color-mix(in srgb, ${baseForeground} 5%, ${baseBackground})`,
      countForegroundValue: `color-mix(in srgb, ${baseForeground} 44%, ${baseBackground})`,
      countBorderValue: `color-mix(in srgb, ${baseBorder} 52%, ${baseBackground})`,
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: baseBackground,
      formulaOrMapping:
        "disabled count-card frame mixes theme foreground and border over the theme surface; disabled behavior remains primitive-owned",
    };
  }

  if (state === "warning") {
    const warning = warningStatus(theme);
    return {
      backgroundValue: warning.backgroundValue,
      foregroundValue: warning.foregroundValue,
      borderValue: warning.borderValue,
      countBackgroundValue: warning.strongBackgroundValue,
      countForegroundValue: warning.foregroundValue,
      countBorderValue: warning.borderValue,
      sourceTokenName: `${surfaceVariant.tokenName} + ${warning.tokenName}`,
      sourceValue: `${baseBackground} + ${warning.tokenValue}`,
      formulaOrMapping:
        "warning values consume signed status-color warning pairings; count slot uses the status token strong background",
    };
  }

  if (state === "error") {
    const errorForeground = errorTextStyle.foregroundValue;
    return {
      backgroundValue: `color-mix(in srgb, ${errorForeground} 6%, ${baseBackground})`,
      foregroundValue: errorForeground,
      borderValue: `color-mix(in srgb, ${errorForeground} 56%, ${baseBackground})`,
      countBackgroundValue: `color-mix(in srgb, ${errorForeground} 12%, ${baseBackground})`,
      countForegroundValue: errorForeground,
      countBorderValue: `color-mix(in srgb, ${errorForeground} 48%, ${baseBackground})`,
      sourceTokenName: `${surfaceVariant.tokenName} + ${errorTextStyle.tokenName}`,
      sourceValue: `${baseBackground} + ${errorForeground}`,
      formulaOrMapping:
        "error frame derives foreground from signed error-text-style and mixes it over the theme surface; error behavior remains primitive-owned",
    };
  }

  return {
    backgroundValue: baseBackground,
    foregroundValue: baseForeground,
    borderValue: baseBorder,
    countBackgroundValue: countBaseBackground,
    countForegroundValue: baseForeground,
    countBorderValue: baseBorder,
    sourceTokenName: surfaceVariant.tokenName,
    sourceValue: baseBackground,
    formulaOrMapping: "default count-card frame inherits theme surface and foreground; count slot is a low-emphasis surface mix",
  };
}

function makeVariant(theme, state) {
  const values = valuesForState(theme, state);
  const radiusValue = bodyRegionFrame.radiusValue;
  const paddingBlockValue = "0.75rem";
  const paddingInlineValue = "1rem";
  const contentGapValue = "0.75rem";
  const countSlotMinInlineSize = "2.75rem";

  return {
    id: `count-card-frame-${state}-${theme}`,
    tokenName: `--count-card-frame-${state}-${theme}`,
    value: {
      frameRole: "count card frame",
      state,
      theme,
      backgroundValue: values.backgroundValue,
      foregroundValue: values.foregroundValue,
      borderValue: values.borderValue,
      radiusValue,
      paddingBlockValue,
      paddingInlineValue,
      contentGapValue,
      minBlockSize: minimumTarget.minimumHeight,
      countSlotMinInlineSize,
      countBackgroundValue: values.countBackgroundValue,
      countForegroundValue: values.countForegroundValue,
      countBorderValue: values.countBorderValue,
    },
    derivation: {
      sourceTokenName: `${values.sourceTokenName} + ${bodyRegionFrame.tokenName} + ${minimumTarget.tokenName}`,
      sourceValue: `${values.sourceValue} + ${radiusValue} + ${minimumTarget.minimumHeight}`,
      formulaOrMapping: `${values.formulaOrMapping}; radius derives from body-region-frame; padding, content gap, and count-slot minimum width are count-card-frame values`,
      renderedValue: `${values.backgroundValue} / ${values.foregroundValue} / ${values.borderValue} / ${values.countBackgroundValue} count background / ${radiusValue} radius / ${minimumTarget.minimumHeight} min height`,
    },
    preview: {
      kind: "count-card-frame-sample",
      sample: state === "selected" ? "Selected filter" : `${state[0].toUpperCase()}${state.slice(1)} filter`,
      count: state === "disabled" ? "0" : "12",
      background: values.backgroundValue,
      foreground: values.foregroundValue,
      border: values.borderValue,
      radius: radiusValue,
      paddingBlock: paddingBlockValue,
      paddingInline: paddingInlineValue,
      contentGap: contentGapValue,
      countBackground: values.countBackgroundValue,
      countForeground: values.countForegroundValue,
      countBorder: values.countBorderValue,
      countSlotMinInlineSize,
      label: `${theme} ${state} count card`,
    },
    metadata: {
      frameRole: "count card frame",
      theme,
      state,
      accessibility:
        "Count-card state visuals must be paired with semantic state, accessible names, focus visibility when interactive, and text disclosure when labels truncate.",
    },
    useCaseInstructions: [
      `Use for ${state} count-card frame visuals in governed selection, filter, or summary-card primitives.`,
      "Do not use for arbitrary cards, selectable choice cards, index navigation items, panels, native controls, product sections, or app-local cards.",
      "Warning and error values are count-card-frame states only; they must not be reused as broad semantic status tokens.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "count-card-frame",
  previewKind: "count-card-frame-sample",
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
      "contentGapValue",
      "minBlockSize",
      "countSlotMinInlineSize",
      "countBackgroundValue",
      "countForegroundValue",
      "countBorderValue",
    ],
    metadataFields: ["frameRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "statusScope"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "count-card",
  tokenType: "count-card-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/count-card-frame/CountCardFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/count-card-frame/CountCardFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/count-card-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/count-card-frame/index.html",
    title: "Count Card Frame Token",
    description: "Review reusable count-card frame values before count-card primitives or panel patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/count-card-frame/contract.mjs",
    contractExport: "countCardFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/count-card-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/countCardFrame.tokens.mjs",
    systemTokenExport: "countCardFrameTokenSpec",
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
      contractId: "tokens.status-color",
      variantId: "status-color-warning-*",
      tokenName: "--status-color-warning-*",
      value: "theme-specific warning status colour pairing",
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
    rule: "Proof-only primary source and host-surface changes may alter selected count-card previews but must not mutate signed token data.",
  },
  variants: ["original", "dark", "desert"].flatMap((theme) =>
    ["default", "selected", "disabled", "warning", "error"].map((state) => makeVariant(theme, state)),
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
    contentGapValue: variant.value.contentGapValue,
    minBlockSize: variant.value.minBlockSize,
    countSlotMinInlineSize: variant.value.countSlotMinInlineSize,
    countBackgroundValue: variant.value.countBackgroundValue,
    countForegroundValue: variant.value.countForegroundValue,
    countBorderValue: variant.value.countBorderValue,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Status scope", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const countCardFrameTokenVariants = variants.map(toPageVariant);

export const countCardFrameTokenSpec = {
  contractId: countCardFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "count-card-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a reusable count-card frame decision. Count calculations, grouping, and behavior remain primitive or pattern-owned.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Default",
      title: "Count card surface",
      variantId: "count-card-frame-default-original",
      supportingText: "Default count-card frame inherits the original surface.",
    },
    {
      label: "Selected",
      title: "Primary-tinted count card",
      variantId: "count-card-frame-selected-original",
      supportingText: "Selected count cards derive from signed primary tint tokens.",
    },
    {
      label: "Warning",
      title: "Count-card warning state",
      variantId: "count-card-frame-warning-original",
      supportingText: "Warning consumes the reusable status-color warning token.",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Review Primary Source Dependency",
    description:
      "Change the proof-only primary source HEX and host surface to verify selected count-card derivations without changing signed token data.",
    inputLabel: "Preview primary HEX",
    defaultHex: "#635bff",
    resetLabel: "Reset",
    previewLabel: "Temporary selected count-card derivation previews",
    validStatus: "Temporary preview only. Signed count-card-frame token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
    tintSourceRatio: "12%",
    tintMixTarget: bodyRegionFrame.backgroundValue,
    foregroundSourceRatio: "48%",
    foregroundMixTarget: bodyRegionFrame.foregroundValue,
    previews: [
      { role: "source", label: "Source", sample: "#635bff" },
      { role: "choice-option-background", label: "Selected background", sample: "12% source over surface" },
      { role: "choice-option-foreground", label: "Selected foreground", sample: "48% source over foreground" },
      { role: "choice-option-border", label: "Selected border", sample: "68% foreground over surface" },
    ],
    surfaceInputLabel: "Host surface",
    surfaceOptions: [
      { label: "Body region surface", value: bodyRegionFrame.backgroundValue, tokenName: bodyRegionFrame.tokenName },
      { label: "Body region foreground", value: bodyRegionFrame.foregroundValue, tokenName: bodyRegionFrame.tokenName },
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
    ["contentGapValue", "Content gap"],
    ["minBlockSize", "Min height"],
    ["countSlotMinInlineSize", "Count min width"],
    ["countBackgroundValue", "Count background"],
    ["countForegroundValue", "Count foreground"],
    ["countBorderValue", "Count border"],
    ["sourceTokenName", "Source tokens"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: countCardFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling count-card frames locally.",
    "Consumers must not use this token as proof of count calculation, search behavior, filtering, grouping, selected records, accessible names, focus visibility, or text disclosure.",
    "Warning values must come from status-color; count-card-frame does not own broad status colour decisions.",
  ],
  requiredEvidence: [
    "Rendered proof must show default, selected, disabled, warning, and error variants across original, dark, and desert themes.",
    "Proof must show upstream token identities and formulas for derived frame values.",
    "Proof-only primary HEX and host-surface overrides must change selected count-card derived previews without changing signed token values.",
    "Desktop and mobile proof must avoid horizontal overflow, count-slot collapse, and visible text overlap.",
  ],
};
