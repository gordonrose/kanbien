import { topNavigationFrameTokenContract } from "../../../../layers/02-token/top-navigation-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { buttonFrameTokenSpec } from "./buttonFrame.tokens.mjs";
import { focusRingTokenSpec } from "./focusRing.tokens.mjs";
import { labelTextStyleTokenVariants } from "./labelTextStyle.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";
import { primaryTintedBackgroundTokenVariants } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";

const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);
const tintByTheme = new Map(primaryTintedBackgroundTokenVariants.map((variant) => [variant.theme, variant]));
const tintForegroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const labelTextStyle = labelTextStyleTokenVariants.find((variant) => variant.role === "short label text");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");
const focusRingOriginal = focusRingTokenSpec.variants.find((variant) => variant.id === "focus-ring-visible-original");
const quietButtonFrame = buttonFrameTokenSpec.variants.find(
  (variant) => variant.id === "button-frame-text-action-original",
);

if (!labelTextStyle || !minimumTarget || !focusRingOriginal || !quietButtonFrame) {
  throw new Error("top-navigation-frame requires signed label, target, focus, and button-frame token dependencies.");
}

const themeFallbacks = {
  original: {
    support: "#475569",
    separatorMix: "16%",
    menuShadow: "0 0.85rem 2rem rgba(15, 23, 42, 0.18)",
  },
  dark: {
    support: "#a8b5c7",
    separatorMix: "22%",
    menuShadow: "0 1rem 2.2rem rgba(0, 0, 0, 0.38)",
  },
  desert: {
    support: "#7a6652",
    separatorMix: "18%",
    menuShadow: "0 0.9rem 1.9rem rgba(83, 50, 28, 0.22)",
  },
};

function requireVariant(map, theme, tokenType) {
  const variant = map.get(theme);
  if (!variant) {
    throw new Error(`Missing ${tokenType} token variant for ${theme}.`);
  }
  return variant;
}

function surface(theme) {
  return requireVariant(surfaceByTheme, theme, "background surface");
}

function tint(theme) {
  return requireVariant(tintByTheme, theme, "primary tinted background");
}

function tintForeground(theme) {
  return requireVariant(tintForegroundByTheme, theme, "primary tinted foreground");
}

function borderValue(theme) {
  const surfaceVariant = surface(theme);
  const foreground = surfaceVariant.preview.foreground;
  return `color-mix(in srgb, ${foreground} ${themeFallbacks[theme].separatorMix}, ${surfaceVariant.preview.background})`;
}

function makeChromeVariant(theme) {
  const surfaceVariant = surface(theme);
  return {
    id: `top-navigation-frame-chrome-${theme}`,
    tokenName: `--top-navigation-frame-chrome-${theme}`,
    value: {
      frameRole: "top navigation chrome",
      backgroundValue: surfaceVariant.preview.background,
      foregroundValue: surfaceVariant.preview.foreground,
      supportingForegroundValue: themeFallbacks[theme].support,
      borderValue: borderValue(theme),
      radiusValue: "0",
      paddingBlockValue: "0.75rem",
      paddingInlineValue: "1rem",
      gapValue: "0.75rem",
      minBlockSize: "4rem",
      shadowValue: "none",
      zIndexValue: "uses standard-page-shell-frame topNavLayer",
      themeMapping: theme,
      stateMapping: "rest",
    },
    derivation: {
      sourceTokenName: `${surfaceVariant.tokenName} + ${labelTextStyle.tokenName}`,
      sourceValue: `${surfaceVariant.preview.background} + ${labelTextStyle.tokenValue}`,
      formulaOrMapping:
        "chrome surface and foreground derive from background-color; separator mixes foreground over the signed surface; label typography derives from label-text-style",
      renderedValue: `${surfaceVariant.preview.background} chrome / ${borderValue(theme)} separator`,
    },
    preview: {
      kind: "top-navigation-frame-sample",
      role: "chrome",
      sample: "Brand Current More Profile",
      background: surfaceVariant.preview.background,
      foreground: surfaceVariant.preview.foreground,
      supportingForeground: themeFallbacks[theme].support,
      border: borderValue(theme),
      radius: "0",
      shadow: "none",
      label: `${theme} top navigation chrome`,
    },
    metadata: {
      frameRole: "top navigation chrome",
      theme,
      state: "rest",
      accessibility: "Chrome foreground and separator values must preserve readable orientation across theme and zoom.",
    },
    useCaseInstructions: [
      "Use for the top-navigation chrome surface and neutral foreground/separator values.",
      "Do not use for sub navigation, context navigation, tools navigation, page body panels, or app-local shell CSS.",
      "Pattern proof must verify no overlap, clipping, or wrapping under TRP reference states.",
    ],
  };
}

function makeDestinationVariant(theme, current = false) {
  const surfaceVariant = surface(theme);
  const tintVariant = tint(theme);
  const foregroundVariant = tintForeground(theme);
  const backgroundValue = current ? tintVariant.backgroundValue : surfaceVariant.preview.background;
  const foregroundValue = current ? foregroundVariant.colorValueOrMapping : surfaceVariant.preview.foreground;
  const border = current ? `color-mix(in srgb, ${foregroundValue} 34%, ${backgroundValue})` : "transparent";

  return {
    id: `top-navigation-frame-destination-${current ? "current-" : ""}${theme}`,
    tokenName: `--top-navigation-frame-destination-${current ? "current-" : ""}${theme}`,
    value: {
      frameRole: current ? "top navigation current destination" : "top navigation destination",
      backgroundValue,
      foregroundValue,
      supportingForegroundValue: themeFallbacks[theme].support,
      borderValue: border,
      radiusValue: "0.375rem",
      paddingBlockValue: "0.5rem",
      paddingInlineValue: "0.75rem",
      gapValue: "0.35rem",
      minInlineSize: "7rem",
      minBlockSize: minimumTarget.minimumHeight,
      shadowValue: "none",
      zIndexValue: "auto",
      themeMapping: theme,
      stateMapping: current ? "current" : "rest",
    },
    derivation: {
      sourceTokenName: current
        ? `${tintVariant.tokenName} + ${foregroundVariant.tokenName} + ${minimumTarget.tokenName}`
        : `${surfaceVariant.tokenName} + ${minimumTarget.tokenName}`,
      sourceValue: current
        ? `${tintVariant.backgroundValue} + ${foregroundVariant.colorValueOrMapping} + ${minimumTarget.tokenValue}`
        : `${surfaceVariant.preview.background} + ${minimumTarget.tokenValue}`,
      formulaOrMapping: current
        ? "current destination pairs primary-tinted background and foreground; primitive or pattern must add programmatic current semantics"
        : "rest destination uses chrome surface and the governed minimum target footprint",
      renderedValue: `${backgroundValue} / ${foregroundValue} / ${border}`,
    },
    preview: {
      kind: "top-navigation-frame-sample",
      role: current ? "current-destination" : "destination",
      sample: current ? "Current" : "Destination",
      background: backgroundValue,
      foreground: foregroundValue,
      supportingForeground: themeFallbacks[theme].support,
      border,
      radius: "0.375rem",
      shadow: "none",
      label: `${theme} ${current ? "current" : "resting"} destination`,
    },
    metadata: {
      frameRole: current ? "top navigation current destination" : "top navigation destination",
      theme,
      state: current ? "current" : "rest",
      accessibility: current
        ? "Current state must not rely on color alone; later layers must pair these values with aria-current or equivalent semantics."
        : "Resting destinations must preserve target size and readable label contrast.",
    },
    useCaseInstructions: [
      current
        ? "Use for current top-navigation destination frame values with programmatic current semantics."
        : "Use for resting top-navigation destination frame values.",
      "Do not use for index navigation, breadcrumb links, menu-simple-select options, route authorization, or app-local links.",
      "Primitive proof must verify target size, focus ring pairing, and text truncation behavior.",
    ],
  };
}

function makeTriggerVariant(theme, open = false) {
  const surfaceVariant = surface(theme);
  const tintVariant = tint(theme);
  const foregroundVariant = tintForeground(theme);
  const backgroundValue = open ? tintVariant.backgroundValue : surfaceVariant.preview.background;
  const foregroundValue = open ? foregroundVariant.colorValueOrMapping : surfaceVariant.preview.foreground;
  const border = open ? `color-mix(in srgb, ${foregroundValue} 34%, ${backgroundValue})` : borderValue(theme);

  return {
    id: `top-navigation-frame-trigger-${open ? "open-" : ""}${theme}`,
    tokenName: `--top-navigation-frame-trigger-${open ? "open-" : ""}${theme}`,
    value: {
      frameRole: open ? "top navigation open trigger" : "top navigation trigger",
      backgroundValue,
      foregroundValue,
      supportingForegroundValue: themeFallbacks[theme].support,
      borderValue: border,
      radiusValue: "0.375rem",
      paddingBlockValue: "0.5rem",
      paddingInlineValue: "0.75rem",
      gapValue: "0.35rem",
      minInlineSize: "7rem",
      minBlockSize: minimumTarget.minimumHeight,
      shadowValue: "none",
      zIndexValue: "auto",
      themeMapping: theme,
      stateMapping: open ? "open" : "closed",
    },
    derivation: {
      sourceTokenName: open
        ? `${tintVariant.tokenName} + ${foregroundVariant.tokenName} + ${minimumTarget.tokenName}`
        : `${surfaceVariant.tokenName} + ${minimumTarget.tokenName}`,
      sourceValue: open
        ? `${tintVariant.backgroundValue} + ${foregroundVariant.colorValueOrMapping} + ${minimumTarget.tokenValue}`
        : `${surfaceVariant.preview.background} + ${minimumTarget.tokenValue}`,
      formulaOrMapping: open
        ? "open trigger pairs primary-tinted background and foreground; primitive or pattern must add aria-expanded semantics"
        : "resting trigger uses chrome surface, theme separator, and the governed minimum target footprint",
      renderedValue: `${backgroundValue} / ${foregroundValue} / ${border}`,
    },
    preview: {
      kind: "top-navigation-frame-sample",
      role: open ? "open-trigger" : "trigger",
      sample: open ? "More open" : "More",
      background: backgroundValue,
      foreground: foregroundValue,
      supportingForeground: themeFallbacks[theme].support,
      border,
      radius: "0.375rem",
      shadow: "none",
      label: `${theme} ${open ? "open" : "closed"} trigger`,
    },
    metadata: {
      frameRole: open ? "top navigation open trigger" : "top navigation trigger",
      theme,
      state: open ? "open" : "closed",
      accessibility: open
        ? "Open trigger state must not rely on color alone; later layers must pair these values with aria-expanded semantics."
        : "Resting triggers must preserve target size, readable label contrast, and an understandable control name.",
    },
    useCaseInstructions: [
      open
        ? "Use for opened top-navigation overflow, profile, or mobile triggers with programmatic expanded semantics."
        : "Use for resting top-navigation overflow, profile, or mobile trigger frame values.",
      "Do not use for destination links, select triggers, arbitrary buttons, route authorization, or app-local actions.",
      "Primitive proof must verify target size, focus ring pairing, native button semantics, and expanded state.",
    ],
  };
}

function makeMenuPanelVariant(theme) {
  const surfaceVariant = surface(theme);
  return {
    id: `top-navigation-frame-menu-panel-${theme}`,
    tokenName: `--top-navigation-frame-menu-panel-${theme}`,
    value: {
      frameRole: "top navigation menu panel",
      backgroundValue: surfaceVariant.preview.background,
      foregroundValue: surfaceVariant.preview.foreground,
      supportingForegroundValue: themeFallbacks[theme].support,
      borderValue: borderValue(theme),
      radiusValue: "0.5rem",
      paddingBlockValue: "0.5rem",
      paddingInlineValue: "0.5rem",
      gapValue: "0.25rem",
      minInlineSize: "12rem",
      minBlockSize: "auto",
      shadowValue: themeFallbacks[theme].menuShadow,
      zIndexValue: "above top chrome and below tooltip layer",
      themeMapping: theme,
      stateMapping: "open",
    },
    derivation: {
      sourceTokenName: `${surfaceVariant.tokenName} + ${focusRingOriginal.tokenName}`,
      sourceValue: `${surfaceVariant.preview.background} + ${focusRingOriginal.ringValue}`,
      formulaOrMapping:
        "menu panel uses signed surface foreground, a theme separator mix, and top-navigation-specific elevation/radius for lightweight anchored shell menus",
      renderedValue: `${surfaceVariant.preview.background} / ${borderValue(theme)} / ${themeFallbacks[theme].menuShadow}`,
    },
    preview: {
      kind: "top-navigation-frame-sample",
      role: "menu-panel",
      sample: "Menu",
      background: surfaceVariant.preview.background,
      foreground: surfaceVariant.preview.foreground,
      supportingForeground: themeFallbacks[theme].support,
      border: borderValue(theme),
      radius: "0.5rem",
      shadow: themeFallbacks[theme].menuShadow,
      label: `${theme} top navigation menu panel`,
    },
    metadata: {
      frameRole: "top navigation menu panel",
      theme,
      state: "open",
      accessibility: "Menu panel surface must remain visually separated without defining menu keyboard behavior.",
    },
    useCaseInstructions: [
      "Use for lightweight anchored top-navigation overflow and profile menu panel frame values.",
      "Do not use for select listboxes, command palettes, drawers, modals, arbitrary popovers, or app-local menus.",
      "Primitive and pattern proof must verify menu naming, focus recovery, dismissal, and layering.",
    ],
  };
}

function variantsForTheme(theme) {
  return [
    makeChromeVariant(theme),
    makeDestinationVariant(theme, false),
    makeDestinationVariant(theme, true),
    makeTriggerVariant(theme, false),
    makeTriggerVariant(theme, true),
    makeMenuPanelVariant(theme),
  ];
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "top-navigation-frame",
  previewKind: "top-navigation-frame-sample",
  variantSchema: {
    valueFields: topNavigationFrameTokenContract.valueFields,
    metadataFields: topNavigationFrameTokenContract.metadataFields,
    useCaseInstructionFields: topNavigationFrameTokenContract.useCaseInstructionFields,
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "top-navigation",
  tokenType: "top-navigation-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/top-navigation-frame/TopNavigationFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/top-navigation-frame/TopNavigationFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/top-navigation-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/top-navigation-frame/index.html",
    title: "Top Navigation Frame Token",
    description: "Review governed top-navigation chrome, destination, current-state, and menu frame values.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/top-navigation-frame/contract.mjs",
    contractExport: "topNavigationFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/topNavigationFrame.tokens.mjs",
    systemTokenExport: "topNavigationFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    { contractId: "tokens.background-color", variantId: "background-surface-*", tokenName: "--background-surface-*", relationship: "derived-from" },
    { contractId: "tokens.primary-tinted-background", variantId: "primary-tinted-background-*", tokenName: "--primary-tinted-background-*", relationship: "paired-with-current-state" },
    { contractId: "tokens.primary-tinted-foreground", variantId: "primary-tinted-foreground-*", tokenName: "--primary-tinted-foreground-*", relationship: "paired-with-current-state" },
    { contractId: "tokens.button-frame", variantId: quietButtonFrame.id, tokenName: quietButtonFrame.tokenName, relationship: "alignment-precedent" },
    { contractId: "tokens.focus-ring", variantId: "focus-ring-visible-*", tokenName: "--focus-ring-visible-*", relationship: "primitive-pairing" },
    { contractId: "tokens.label-text-style", variantId: labelTextStyle.id, tokenName: labelTextStyle.tokenName, relationship: "text-style-pairing" },
    { contractId: "tokens.minimum-target-size", variantId: minimumTarget.id, tokenName: minimumTarget.tokenName, relationship: "target-size-pairing" },
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
    ...variant.value,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Proof", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const topNavigationFrameTokenVariants = variants.map(toPageVariant);

export const topNavigationFrameTokenSpec = {
  contractId: topNavigationFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These variants govern top-navigation frame values only. Behavior, markup, overflow measurement, expanded state, and menu semantics remain later-layer work.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Top navigation",
      title: "Chrome, current state, and menu frame",
      variantId: "top-navigation-frame-chrome-original",
      supportingText:
        "This token replaces missing 40 variable groups with explicit 41 frame/state roles before primitive extraction.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["themeMapping", "Theme"],
    ["stateMapping", "State"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["supportingForegroundValue", "Supporting foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Padding block"],
    ["paddingInlineValue", "Padding inline"],
    ["gapValue", "Gap"],
    ["minInlineSize", "Min width"],
    ["minBlockSize", "Min height"],
    ["shadowValue", "Shadow"],
    ["zIndexValue", "Layer"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: topNavigationFrameTokenVariants,
  consumerRestrictions: topNavigationFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Rendered proof must show chrome, rest destination, current destination, trigger, open trigger, and menu panel roles across original, dark, and desert themes.",
    "Current destination values must be paired with non-color programmatic current semantics in Layer 3 or Layer 4.",
    "Open trigger values must be paired with non-color programmatic expanded semantics in Layer 3 or Layer 4.",
    "Primitive proof must pair these frame values with focus-ring, minimum-target-size, text-overflow disclosure, and native interactive semantics.",
    "Pattern proof must verify the TRP top-nav reference states without copying 40 route markup.",
  ],
};
