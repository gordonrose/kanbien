import { indexNavItemSurfaceTokenContract } from "../../../../layers/02-token/index-nav-item-surface/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { primaryTintedBackgroundTokenVariants } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenVariants } from "./primaryTintedForeground.tokens.mjs";
import { variants as primaryColorSourceVariants } from "./primaryColorSource.tokens.mjs";

const backgroundById = new Map(backgroundColorTokenVariants.map((variant) => [variant.id, variant]));
const tintByTheme = new Map(primaryTintedBackgroundTokenVariants.map((variant) => [variant.theme, variant]));
const foregroundByTheme = new Map(primaryTintedForegroundTokenVariants.map((variant) => [variant.theme, variant]));
const primarySourceByTheme = new Map(primaryColorSourceVariants.map((variant) => [variant.value.themeMapping, variant]));

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

function primaryTint(theme) {
  const variant = tintByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing primary-tinted-background token for ${theme}.`);
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

function themeBase(theme) {
  if (theme === "original") {
    return {
      surface: background("background-surface-original"),
      page: background("background-page-original"),
      subtle: background("background-subtle-original"),
      border: "#dbe4f0",
      disabledBorder: "#e8edf5",
      foreground: "#20242c",
      disabledForeground: "#929baa",
    };
  }
  if (theme === "dark") {
    return {
      surface: background("background-surface-dark"),
      page: background("background-page-dark"),
      subtle: background("background-page-dark"),
      border: "rgba(180, 190, 216, 0.28)",
      disabledBorder: "rgba(180, 190, 216, 0.16)",
      foreground: "#f4f7fb",
      disabledForeground: "#788292",
    };
  }
  return {
    surface: background("background-surface-desert"),
    page: background("background-page-desert"),
    subtle: background("background-page-desert"),
    border: "rgba(151, 111, 74, 0.28)",
    disabledBorder: "rgba(151, 111, 74, 0.16)",
    foreground: "#493327",
    disabledForeground: "#929baa",
  };
}

function hoverBackground(theme) {
  const base = themeBase(theme);
  const source = primarySource(theme).value.colorValue;
  const mixTarget = theme === "dark" ? base.surface.preview.background : base.surface.preview.background;
  const ratio = theme === "dark" ? "10%" : "7%";
  return `color-mix(in srgb, ${source} ${ratio}, ${mixTarget})`;
}

function borderFromPrimary(theme, ratio = "34%") {
  const source = primarySource(theme).value.colorValue;
  const mixTarget = theme === "dark" ? "#f4f7fb" : themeBase(theme).foreground;
  return `color-mix(in srgb, ${source} ${ratio}, ${mixTarget})`;
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "surface",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "surfaceRole",
      "backgroundValue",
      "borderValue",
      "elevationValue",
      "nestingRule",
      "themeMapping",
    ],
    metadataFields: ["surfaceRole", "theme", "nestingRule", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "nestingRule"],
  },
};

function makeVariant({ theme, state, role, tokenName, backgroundValue, borderValue, foregroundValue, sourceTokenName, sourceValue, formulaOrMapping, accessibility, allowed, forbidden }) {
  return {
    id: `${tokenName.replace(/^--/, "")}`,
    tokenName,
    value: {
      surfaceRole: role,
      backgroundValue,
      borderValue,
      elevationValue: "none",
      nestingRule: "May sit in a governed index-navigation list; must not be used as a card-within-card surface.",
      themeMapping: theme,
    },
    derivation: {
      sourceTokenName,
      sourceValue,
      formulaOrMapping,
      renderedValue: `${backgroundValue} / ${borderValue}`,
    },
    preview: {
      kind: "surface-card",
      sample: "Index item",
      background: backgroundValue,
      foreground: foregroundValue,
      border: borderValue,
      label: `${theme} ${state}`,
    },
    metadata: {
      surfaceRole: role,
      theme,
      nestingRule: "index-navigation only",
      state,
      accessibility,
    },
    useCaseInstructions: [
      allowed,
      forbidden,
      "State meaning must be paired with programmatic selected/current/disabled semantics in the consuming primitive or pattern.",
    ],
  };
}

function variantsForTheme(theme) {
  const base = themeBase(theme);
  const tint = primaryTint(theme);
  const foreground = primaryForeground(theme);
  const primary = primarySource(theme);

  return [
    makeVariant({
      theme,
      state: "resting",
      role: "index nav item resting surface",
      tokenName: `--index-nav-item-surface-rest-${theme}`,
      backgroundValue: base.surface.preview.background,
      borderValue: base.border,
      foregroundValue: base.foreground,
      sourceTokenName: base.surface.tokenName,
      sourceValue: base.surface.preview.background,
      formulaOrMapping: `paired with ${base.surface.tokenName}`,
      accessibility: "Resting item surface must remain readable and distinguishable from surrounding index background.",
      allowed: "Use for non-current index-navigation items.",
      forbidden: "Do not use to communicate current, selected, disabled, warning, error, or success state.",
    }),
    makeVariant({
      theme,
      state: "hover",
      role: "index nav item hover surface",
      tokenName: `--index-nav-item-surface-hover-${theme}`,
      backgroundValue: hoverBackground(theme),
      borderValue: borderFromPrimary(theme, "24%"),
      foregroundValue: base.foreground,
      sourceTokenName: primary.tokenName,
      sourceValue: primary.value.colorValue,
      formulaOrMapping: "subtle primary mix over the resting surface",
      accessibility: "Hover must not be the only carrier of current or selected meaning.",
      allowed: "Use for pointer hover preview on enabled index-navigation items.",
      forbidden: "Do not use as current, selected, disabled, or keyboard focus evidence.",
    }),
    makeVariant({
      theme,
      state: "current",
      role: "index nav item current surface",
      tokenName: `--index-nav-item-surface-current-${theme}`,
      backgroundValue: tint.backgroundValue,
      borderValue: borderFromPrimary(theme, "38%"),
      foregroundValue: foreground.colorValueOrMapping,
      sourceTokenName: tint.tokenName,
      sourceValue: tint.backgroundValue,
      formulaOrMapping: `paired with ${foreground.tokenName}`,
      accessibility: "Current item meaning must also be exposed programmatically and not rely on surface color alone.",
      allowed: "Use as the surface for the current index-navigation item after the item primitive exposes current/selected state.",
      forbidden: "Do not use before the consuming primitive or pattern defines programmatic current/selected semantics.",
    }),
    makeVariant({
      theme,
      state: "disabled",
      role: "index nav item disabled surface",
      tokenName: `--index-nav-item-surface-disabled-${theme}`,
      backgroundValue: `color-mix(in srgb, ${base.subtle.preview.background} 82%, ${base.page.preview.background})`,
      borderValue: base.disabledBorder,
      foregroundValue: base.disabledForeground,
      sourceTokenName: base.subtle.tokenName,
      sourceValue: base.subtle.preview.background,
      formulaOrMapping: "low-emphasis mix of subtle and page background",
      accessibility: "Disabled surface must be paired with disabled semantics and activation denial.",
      allowed: "Use for disabled index-navigation items after the primitive defines disabled behavior.",
      forbidden: "Do not use as a replacement for disabled semantics or activation denial.",
    }),
  ];
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav-item",
  tokenType: "surface",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/index-nav-item-surface/IndexNavItemSurface-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/index-nav-item-surface/IndexNavItemSurface-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-item-surface",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-item-surface/index.html",
    title: "Index Nav Item Surface Tokens",
    description: "Review governed surface states for future rectangular index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-item-surface/contract.mjs",
    contractExport: "indexNavItemSurfaceTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemSurface.tokens.mjs",
    systemTokenExport: "indexNavItemSurfaceTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.background-color",
      variantId: "background-surface-*",
      tokenName: "--background-surface-*",
      value: "theme-specific surface background",
      relationship: "paired-with",
    },
    {
      contractId: "tokens.primary-tinted-background",
      variantId: "primary-tinted-background-*",
      tokenName: "--primary-tinted-background-*",
      value: "theme-specific current surface background",
      relationship: "paired-with",
    },
    {
      contractId: "tokens.primary-tinted-foreground",
      variantId: "primary-tinted-foreground-*",
      tokenName: "--primary-tinted-foreground-*",
      value: "theme-specific current foreground",
      relationship: "paired-with",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "This surface token composes signed theme variants; upstream hex override remains on source token proof pages.",
  },
  variants: ["original", "dark", "desert"].flatMap(variantsForTheme),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.backgroundValue} / ${variant.value.borderValue}`,
    role: variant.metadata.surfaceRole,
    surfaceRole: variant.value.surfaceRole,
    backgroundValue: variant.value.backgroundValue,
    borderValue: variant.value.borderValue,
    elevationValue: variant.value.elevationValue,
    nestingRule: variant.value.nestingRule,
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
      { label: "State rule", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const indexNavItemSurfaceTokenVariants = variants.map(toPageVariant);

export const indexNavItemSurfaceTokenSpec = {
  contractId: indexNavItemSurfaceTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-item-surface",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "Each row is a reusable surface-state decision for a future rectangular index-navigation item.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Resting",
      title: "Original item",
      variantId: "index-nav-item-surface-rest-original",
      supportingText: "Default item surface before activation semantics exist.",
    },
    {
      label: "Current",
      title: "Current item",
      variantId: "index-nav-item-surface-current-original",
      supportingText: "Visual surface only; semantic current state belongs to the future primitive/pattern.",
    },
    {
      label: "Disabled",
      title: "Disabled item",
      variantId: "index-nav-item-surface-disabled-original",
      supportingText: "Visual surface only; activation denial belongs to the future primitive.",
    },
  ],
  variantFields: [
    ["surfaceRole", "Role"],
    ["backgroundValue", "Background"],
    ["borderValue", "Border"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula or mapping"],
    ["theme", "Theme"],
    ["state", "State"],
  ],
  variants: indexNavItemSurfaceTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of copying index-navigation item surface literals.",
    "This token does not approve item activation, keyboard behavior, disabled behavior, selected semantics, spacing, or radius.",
    "Current and disabled visual states must be paired with programmatic semantics in the consuming primitive or pattern.",
  ],
  requiredEvidence: [
    "Original, dark, and desert theme variants must render as distinct reviewable surface states.",
    "Current and disabled state meaning must not rely on surface color alone.",
    "Rendered proof must show source token names and formula or mapping for derived states.",
    "150% zoom and mobile widths must keep token values and state labels readable.",
  ],
};
