import { toggleFrameTokenContract } from "../../../../layers/02-token/toggle-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { errorTextStyleTokenSpec } from "./errorTextStyle.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";
import { primaryTintedBackgroundTokenVariants } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";
import { variants as primaryColorSourceVariants } from "./primaryColorSource.tokens.mjs";

const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);
const primarySourceByTheme = new Map(primaryColorSourceVariants.map((variant) => [variant.value.themeMapping, variant]));
const primaryBackgroundByTheme = new Map(primaryTintedBackgroundTokenVariants.map((variant) => [variant.theme, variant]));
const primaryForegroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const errorTextStyle = errorTextStyleTokenSpec.variants.find((variant) => variant.id === "error-text-style-default");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");

if (!errorTextStyle || !minimumTarget) {
  throw new Error("toggle-frame requires signed error-text-style and minimum-target-size dependencies.");
}

function requiredThemeToken(map, theme, label) {
  const variant = map.get(theme);
  if (!variant) {
    throw new Error(`Missing ${label} token for ${theme}.`);
  }
  return variant;
}

function themeSurface(theme) {
  return requiredThemeToken(surfaceByTheme, theme, "background surface");
}

function primarySource(theme) {
  return requiredThemeToken(primarySourceByTheme, theme, "primary-color-source");
}

function primaryBackground(theme) {
  return requiredThemeToken(primaryBackgroundByTheme, theme, "primary-tinted-background");
}

function primaryForeground(theme) {
  return requiredThemeToken(primaryForegroundByTheme, theme, "primary-tinted-foreground");
}

function restingThumbBackground(theme, surfaceValue, foregroundValue) {
  if (theme === "dark") {
    return `color-mix(in srgb, ${foregroundValue} 48%, ${surfaceValue})`;
  }

  return surfaceValue;
}

function activeThumbBackground(theme, surfaceValue, foregroundValue) {
  if (theme === "dark") {
    return `color-mix(in srgb, ${foregroundValue} 68%, ${surfaceValue})`;
  }

  return surfaceValue;
}

function stateValues(theme, state) {
  const surface = themeSurface(theme);
  const source = primarySource(theme);
  const onBackground = primaryBackground(theme);
  const onForeground = primaryForeground(theme);
  const surfaceValue = surface.preview.background;
  const foregroundValue = surface.preview.foreground;
  const baseBorder = `color-mix(in srgb, ${foregroundValue} 18%, ${surfaceValue})`;
  const thumbSurfaceValue = restingThumbBackground(theme, surfaceValue, foregroundValue);
  const sourceValue = source.value.colorValue;

  if (state === "on") {
    return {
      trackBackgroundValue: onBackground.backgroundValue,
      trackBorderValue: `color-mix(in srgb, ${onForeground.colorValueOrMapping} 68%, ${surfaceValue})`,
      thumbBackgroundValue: activeThumbBackground(theme, surfaceValue, foregroundValue),
      thumbForegroundValue: onForeground.colorValueOrMapping,
      sourceTokenName: `${source.tokenName} + ${onBackground.tokenName} + ${onForeground.tokenName} + ${surface.tokenName}`,
      sourceValue: `${sourceValue} + ${onBackground.backgroundValue} + ${onForeground.colorValueOrMapping} + ${surfaceValue}`,
      formulaOrMapping:
        "on track background and foreground use signed primary tint tokens; on border mixes primary foreground over the host surface; thumb uses the host surface",
    };
  }

  if (state === "disabled") {
    return {
      trackBackgroundValue: `color-mix(in srgb, ${foregroundValue} 5%, ${surfaceValue})`,
      trackBorderValue: `color-mix(in srgb, ${baseBorder} 58%, ${surfaceValue})`,
      thumbBackgroundValue: `color-mix(in srgb, ${foregroundValue} 18%, ${surfaceValue})`,
      thumbForegroundValue: `color-mix(in srgb, ${foregroundValue} 42%, ${surfaceValue})`,
      sourceTokenName: surface.tokenName,
      sourceValue: surfaceValue,
      formulaOrMapping:
        "disabled track, border, and thumb mix theme foreground or border over the host surface; disabled semantics remain primitive-owned",
    };
  }

  if (state === "read-only") {
    return {
      trackBackgroundValue: `color-mix(in srgb, ${foregroundValue} 7%, ${surfaceValue})`,
      trackBorderValue: baseBorder,
      thumbBackgroundValue: thumbSurfaceValue,
      thumbForegroundValue: `color-mix(in srgb, ${foregroundValue} 72%, ${surfaceValue})`,
      sourceTokenName: surface.tokenName,
      sourceValue: surfaceValue,
      formulaOrMapping:
        "read-only track and thumb derive from the host surface and theme foreground; read-only semantics remain primitive-owned",
    };
  }

  if (state === "error") {
    return {
      trackBackgroundValue: `color-mix(in srgb, ${errorTextStyle.foregroundValue} 8%, ${surfaceValue})`,
      trackBorderValue: errorTextStyle.foregroundValue,
      thumbBackgroundValue: surfaceValue,
      thumbForegroundValue: errorTextStyle.foregroundValue,
      sourceTokenName: `${surface.tokenName} + ${errorTextStyle.tokenName}`,
      sourceValue: `${surfaceValue} + ${errorTextStyle.foregroundValue}`,
      formulaOrMapping:
        "error track and thumb use signed error-text foreground over the host surface; error semantics and error text remain primitive-owned",
    };
  }

  return {
    trackBackgroundValue: `color-mix(in srgb, ${foregroundValue} 8%, ${surfaceValue})`,
    trackBorderValue: baseBorder,
    thumbBackgroundValue: thumbSurfaceValue,
    thumbForegroundValue: foregroundValue,
    sourceTokenName: surface.tokenName,
    sourceValue: surfaceValue,
    formulaOrMapping:
      "off track, border, and thumb derive from the signed host surface and theme foreground; off semantics remain primitive-owned",
  };
}

function makeVariant(theme, state) {
  const values = stateValues(theme, state);
  const trackInlineSize = "2.75rem";
  const trackBlockSize = "1.5rem";
  const trackBorderWidthValue = "0.0625rem";
  const thumbInlineSize = "1.125rem";
  const thumbBlockSize = "1.125rem";
  const thumbOffsetValue = state === "on" ? "1.25rem" : "0";
  const trackPaddingValue = "0.1875rem";
  const trackRadiusValue = "999px";
  const thumbRadiusValue = "999px";
  const thumbShadowValue = "0 0.0625rem 0.125rem color-mix(in srgb, currentColor 18%, transparent)";
  const motionDurationValue = "120ms";
  const motionEasingValue = "ease-out";

  return {
    id: `toggle-frame-${state}-${theme}`,
    tokenName: `--toggle-frame-${state}-${theme}`,
    value: {
      frameRole: "toggle frame",
      state,
      theme,
      trackBackgroundValue: values.trackBackgroundValue,
      trackBorderValue: values.trackBorderValue,
      trackBorderWidthValue,
      thumbBackgroundValue: values.thumbBackgroundValue,
      thumbForegroundValue: values.thumbForegroundValue,
      trackInlineSize,
      trackBlockSize,
      thumbInlineSize,
      thumbBlockSize,
      thumbOffsetValue,
      trackPaddingValue,
      trackRadiusValue,
      thumbRadiusValue,
      thumbShadowValue,
      motionDurationValue,
      motionEasingValue,
      minimumTargetWidth: minimumTarget.minimumWidth,
      minimumTargetHeight: minimumTarget.minimumHeight,
    },
    derivation: {
      sourceTokenName: `${values.sourceTokenName} + ${minimumTarget.tokenName}`,
      sourceValue: `${values.sourceValue} + ${minimumTarget.minimumWidth}/${minimumTarget.minimumHeight}`,
      formulaOrMapping: `${values.formulaOrMapping}; toggle geometry is signed by this token; minimum target size is paired for primitive hit area`,
      renderedValue: `${values.trackBackgroundValue} / ${values.trackBorderValue} / ${values.thumbBackgroundValue} / ${trackRadiusValue} track radius / ${thumbOffsetValue} thumb offset`,
    },
    preview: {
      kind: "toggle-frame-sample",
      sample: state === "on" ? "On" : state[0].toUpperCase() + state.slice(1),
      background: values.trackBackgroundValue,
      foreground: values.thumbForegroundValue,
      border: values.trackBorderValue,
      trackBorderWidth: trackBorderWidthValue,
      thumbBackground: values.thumbBackgroundValue,
      trackInlineSize,
      trackBlockSize,
      thumbInlineSize,
      thumbBlockSize,
      thumbOffset: thumbOffsetValue,
      trackPadding: trackPaddingValue,
      trackRadius: trackRadiusValue,
      thumbRadius: thumbRadiusValue,
      thumbShadow: thumbShadowValue,
      motionDuration: motionDurationValue,
      motionEasing: motionEasingValue,
      label: `${theme} ${state} toggle frame`,
    },
    metadata: {
      frameRole: "toggle frame",
      theme,
      state,
      accessibility:
        "Toggle frame color and position must be paired with primitive-owned boolean semantics, accessible name, focus visibility, and color-independent state communication.",
    },
    useCaseInstructions: [
      `Use for ${state} toggle track and thumb visuals in governed toggle primitives.`,
      "Do not use for checkbox lists, radio groups, card-list selects, dropdowns, buttons, arbitrary pills, or app-local switch markup.",
      "Pair with focus-ring, minimum-target-size, and a governed semantic toggle control in the consuming primitive.",
    ],
  };
}

function variantsForTheme(theme) {
  return ["off", "on", "read-only", "disabled", "error"].map((state) => makeVariant(theme, state));
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "toggle-frame",
  previewKind: "toggle-frame-sample",
  variantSchema: {
    valueFields: [
      "frameRole",
      "state",
      "theme",
      "trackBackgroundValue",
      "trackBorderValue",
      "trackBorderWidthValue",
      "thumbBackgroundValue",
      "thumbForegroundValue",
      "trackInlineSize",
      "trackBlockSize",
      "thumbInlineSize",
      "thumbBlockSize",
      "thumbOffsetValue",
      "trackPaddingValue",
      "trackRadiusValue",
      "thumbRadiusValue",
      "thumbShadowValue",
      "motionDurationValue",
      "motionEasingValue",
      "minimumTargetWidth",
      "minimumTargetHeight",
    ],
    metadataFields: ["frameRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "toggle-control",
  tokenType: "toggle-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/toggle-frame/ToggleFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/toggle-frame/ToggleFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/toggle-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/toggle-frame/index.html",
    title: "Toggle Frame Token",
    description: "Review governed toggle track and thumb values before toggle primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/toggle-frame/contract.mjs",
    contractExport: "toggleFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/toggle-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/toggleFrame.tokens.mjs",
    systemTokenExport: "toggleFrameTokenSpec",
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
      contractId: "tokens.primary-tinted-background",
      variantId: "primary-tinted-background-*",
      tokenName: "--primary-tinted-background-*",
      value: "theme-specific on-track background",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.primary-tinted-foreground",
      variantId: "primary-tinted-foreground-*",
      tokenName: "--primary-tinted-foreground-*",
      value: "theme-specific on-state foreground",
      relationship: "paired-with",
    },
    {
      contractId: "tokens.background-color",
      variantId: "background-surface-*",
      tokenName: "--background-surface-*",
      value: "theme-specific host surface",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.error-text-style",
      variantId: errorTextStyle.id,
      tokenName: errorTextStyle.tokenName,
      value: errorTextStyle.foregroundValue,
      relationship: "paired-with",
    },
    {
      contractId: "tokens.minimum-target-size",
      variantId: minimumTarget.id,
      tokenName: minimumTarget.tokenName,
      value: `${minimumTarget.minimumWidth}/${minimumTarget.minimumHeight}`,
      relationship: "paired-with",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    rule: "Proof-only primary source and host-surface overrides may change the rendered diagnostic previews; they must not mutate signed toggle-frame token data.",
  },
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
    state: variant.value.state,
    theme: variant.metadata.theme,
    trackBackgroundValue: variant.value.trackBackgroundValue,
    trackBorderValue: variant.value.trackBorderValue,
    trackBorderWidthValue: variant.value.trackBorderWidthValue,
    thumbBackgroundValue: variant.value.thumbBackgroundValue,
    thumbForegroundValue: variant.value.thumbForegroundValue,
    trackInlineSize: variant.value.trackInlineSize,
    trackBlockSize: variant.value.trackBlockSize,
    thumbInlineSize: variant.value.thumbInlineSize,
    thumbBlockSize: variant.value.thumbBlockSize,
    thumbOffsetValue: variant.value.thumbOffsetValue,
    trackPaddingValue: variant.value.trackPaddingValue,
    trackRadiusValue: variant.value.trackRadiusValue,
    thumbRadiusValue: variant.value.thumbRadiusValue,
    thumbShadowValue: variant.value.thumbShadowValue,
    motionDurationValue: variant.value.motionDurationValue,
    motionEasingValue: variant.value.motionEasingValue,
    minimumTargetWidth: variant.value.minimumTargetWidth,
    minimumTargetHeight: variant.value.minimumTargetHeight,
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

export const toggleFrameTokenVariants = variants.map(toPageVariant);

export const toggleFrameTokenSpec = {
  contractId: toggleFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "toggle-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These variants govern reusable toggle track and thumb visuals for off, on, read-only, disabled, and error states.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Off",
      title: "Surface-derived off state",
      variantId: "toggle-frame-off-original",
      supportingText: "Off state derives from the signed host surface and theme foreground.",
    },
    {
      label: "On",
      title: "Primary-derived on state",
      variantId: "toggle-frame-on-original",
      supportingText: "On state derives from signed primary tint tokens and reacts to the primary source diagnostic.",
    },
    {
      label: "Error",
      title: "Error-aware frame",
      variantId: "toggle-frame-error-original",
      supportingText: "Error visuals pair with primitive-owned invalid semantics and error text.",
    },
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Dependency diagnostic",
    label: "Review Primary Source Dependency",
    description:
      "Change the proof-only primary source HEX and host surface to verify on-state toggle derivations without changing signed token data.",
    inputLabel: "Preview primary HEX",
    defaultHex: "#635bff",
    resetLabel: "Reset",
    previewLabel: "Temporary toggle-frame derivation previews",
    validStatus: "Temporary preview only. Signed toggle-frame token values remain unchanged.",
    invalidStatus: "Enter a six-digit HEX value such as #2f855a.",
    tintSourceRatio: "12%",
    foregroundSourceRatio: "88%",
    foregroundMixTarget: themeSurface("original").preview.foreground,
    previews: [
      { role: "source", label: "Source", sample: "#635bff" },
      { role: "toggle-track-on", label: "On track", sample: "12% source over surface" },
      { role: "toggle-thumb-on", label: "On thumb foreground", sample: "88% source over foreground" },
      { role: "toggle-border-on", label: "On border", sample: "68% on foreground over surface" },
    ],
    surfaceInputLabel: "Host surface",
    surfaceOptions: [
      {
        label: "Original surface",
        value: themeSurface("original").preview.background,
        tokenName: "--background-surface-original",
      },
      {
        label: "Original page",
        value: backgroundColorTokenVariants.find((variant) => variant.id === "background-page-original")?.preview.background ?? "#ffffff",
        tokenName: "--background-page-original",
      },
    ],
  },
  variantFields: [
    ["role", "Role"],
    ["state", "State"],
    ["trackBackgroundValue", "Track background"],
    ["trackBorderValue", "Track border"],
    ["trackBorderWidthValue", "Track border width"],
    ["thumbBackgroundValue", "Thumb background"],
    ["thumbForegroundValue", "Thumb foreground"],
    ["trackInlineSize", "Track width"],
    ["trackBlockSize", "Track height"],
    ["thumbInlineSize", "Thumb width"],
    ["thumbBlockSize", "Thumb height"],
    ["thumbOffsetValue", "Thumb offset"],
    ["trackPaddingValue", "Track padding"],
    ["trackRadiusValue", "Track radius"],
    ["thumbRadiusValue", "Thumb radius"],
    ["thumbShadowValue", "Thumb shadow"],
    ["motionDurationValue", "Motion duration"],
    ["motionEasingValue", "Motion easing"],
    ["minimumTargetWidth", "Minimum target width"],
    ["minimumTargetHeight", "Minimum target height"],
    ["sourceTokenName", "Source tokens"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: toggleFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling toggle track, thumb, state, or motion values locally.",
    "Consumers must not use this token as proof of native toggle semantics, accessible names, keyboard behavior, or validation behavior.",
    "Toggle primitives must pair this token with focus-ring, minimum-target-size, and a governed semantic control strategy.",
  ],
  requiredEvidence: [
    "Rendered proof must show off, on, read-only, disabled, and error states across original, dark, and desert themes.",
    "Proof must show upstream source tokens and formula or mapping for derived toggle values.",
    "Proof-only primary HEX and host-surface overrides must change on-state derived previews without changing signed token values.",
  ],
};
