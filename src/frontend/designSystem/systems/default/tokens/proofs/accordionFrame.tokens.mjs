import { accordionFrameTokenContract } from "../../../../layers/02-token/accordion-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { iconSizeTokenSpec } from "./iconSize.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";
import { panelCornerRadiusTokenSpec } from "./panelCornerRadius.tokens.mjs";
import { primaryTintedBackgroundTokenSpec } from "./primaryTintedBackground.tokens.mjs";
import { primaryTintedForegroundTokenSpec } from "./primaryTintedForeground.tokens.mjs";

const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);
const pageByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "page foundation")
    .map((variant) => [variant.theme, variant]),
);
const primaryTintByTheme = new Map(primaryTintedBackgroundTokenSpec.variants.map((variant) => [variant.theme, variant]));
const primaryTintForegroundByTheme = new Map(primaryTintedForegroundTokenSpec.variants.map((variant) => [variant.theme, variant]));
const iconSize = iconSizeTokenSpec.variants.find((variant) => variant.id === "icon-size-button-glyph-default");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");
const panelRadius = panelCornerRadiusTokenSpec.variants.find((variant) => variant.id === "panel-corner-radius-flush");

if (!iconSize || !minimumTarget || !panelRadius) {
  throw new Error("accordion-frame requires signed icon-size, minimum-target-size, and panel-corner-radius dependencies.");
}

function requiredThemeToken(map, theme, label) {
  const variant = map.get(theme);
  if (!variant) {
    throw new Error(`Missing ${label} token for ${theme}.`);
  }
  return variant;
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "accordion-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "theme",
      "headerBackgroundValue",
      "headerForegroundValue",
      "contentBackgroundValue",
      "contentForegroundValue",
      "borderValue",
      "separatorValue",
      "headerMinBlockSize",
      "headerPaddingBlockValue",
      "headerPaddingInlineValue",
      "contentPaddingBlockValue",
      "contentPaddingInlineValue",
      "gapValue",
      "indicatorInlineSize",
      "indicatorBlockSize",
      "motionDurationValue",
      "motionEasingValue",
    ],
    metadataFields: ["frameRole", "theme", "responsiveBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

function makeVariant(theme, tone = "neutral") {
  const surface = requiredThemeToken(surfaceByTheme, theme, "surface background");
  const page = requiredThemeToken(pageByTheme, theme, "page background");
  const primaryTint = requiredThemeToken(primaryTintByTheme, theme, "primary tinted background");
  const primaryTintForeground = requiredThemeToken(primaryTintForegroundByTheme, theme, "primary tinted foreground");
  const tinted = tone === "tinted";
  const headerBackgroundValue = tinted
    ? `color-mix(in srgb, ${primaryTint.sourceColorValue} 4%, ${surface.preview.background})`
    : surface.preview.background;
  const headerForegroundValue = tinted ? primaryTintForeground.colorValueOrMapping : surface.preview.foreground;
  const contentBackgroundValue = surface.preview.background;
  const contentForegroundValue = surface.preview.foreground;
  const borderSource = tinted ? primaryTintForeground.colorValueOrMapping : surface.preview.foreground;
  const borderValue = `color-mix(in srgb, ${borderSource} 18%, ${surface.preview.background})`;
  const separatorValue = `color-mix(in srgb, ${borderSource} 14%, ${surface.preview.background})`;
  const headerMinBlockSize = minimumTarget.minimumHeight;
  const headerPaddingBlockValue = "0.625rem";
  const headerPaddingInlineValue = "0.875rem";
  const contentPaddingBlockValue = "0.875rem";
  const contentPaddingInlineValue = "0.875rem";
  const gapValue = "0.75rem";
  const motionDurationValue = "120ms";
  const motionEasingValue = "ease-out";

  return {
    id: tinted ? `accordion-frame-tinted-${theme}` : `accordion-frame-${theme}`,
    tokenName: tinted ? `--accordion-frame-tinted-${theme}` : `--accordion-frame-${theme}`,
    value: {
      frameRole: "accordion section frame",
      theme,
      tone,
      headerBackgroundValue,
      headerForegroundValue,
      contentBackgroundValue,
      contentForegroundValue,
      borderValue,
      separatorValue,
      radiusValue: panelRadius.radiusValue,
      headerMinBlockSize,
      headerPaddingBlockValue,
      headerPaddingInlineValue,
      contentPaddingBlockValue,
      contentPaddingInlineValue,
      gapValue,
      indicatorInlineSize: iconSize.inlineSize,
      indicatorBlockSize: iconSize.blockSize,
      motionDurationValue,
      motionEasingValue,
    },
    derivation: {
      sourceTokenName: tinted
        ? `${primaryTint.tokenName} + ${primaryTintForeground.tokenName} + ${surface.tokenName} + ${page.tokenName} + ${iconSize.tokenName} + ${minimumTarget.tokenName} + ${panelRadius.tokenName}`
        : `${surface.tokenName} + ${page.tokenName} + ${iconSize.tokenName} + ${minimumTarget.tokenName} + ${panelRadius.tokenName}`,
      sourceValue: tinted
        ? `${primaryTint.sourceColorValue} 4% over ${surface.preview.background}/${primaryTintForeground.colorValueOrMapping} header; ${iconSize.inlineSize} icon; ${minimumTarget.minimumHeight} target; ${panelRadius.radiusValue} radius`
        : `${surface.preview.background}/${surface.preview.foreground} over ${page.preview.background}; ${iconSize.inlineSize} icon; ${minimumTarget.minimumHeight} target; ${panelRadius.radiusValue} radius`,
      formulaOrMapping:
        tinted
          ? "header uses an accordion-specific subtle tint derived from the signed primary-tinted background source color over the signed surface, plus paired primary-tinted foreground; content inherits signed surface background/foreground; separators mix tinted foreground over surface; header minimum height comes from minimum target size; indicator size comes from icon-size; radius comes from panel-corner-radius"
          : "header and content inherit signed surface background/foreground; separators mix foreground over surface; header minimum height comes from minimum target size; indicator size comes from icon-size; radius comes from panel-corner-radius",
      renderedValue: `${headerBackgroundValue} header / ${contentBackgroundValue} content / ${borderValue} border / ${separatorValue} separator / ${headerMinBlockSize} header min height`,
    },
    preview: {
      kind: "surface-card",
      sample: "Accordion section",
      background: headerBackgroundValue,
      foreground: headerForegroundValue,
      border: borderValue,
      radius: panelRadius.radiusValue,
      label: `${theme} ${tone} accordion frame`,
    },
    metadata: {
      frameRole: "accordion section frame",
      theme,
      tone,
      responsiveBehavior: "header target size, padding, and content padding must remain stable under constrained width and zoom",
      accessibility:
        "Frame values must preserve readable header/content text, visible separators, and enough indicator space without becoming the only expanded/collapsed cue.",
    },
    useCaseInstructions: [
      "Use for accordion section header/content frame values before accordion primitives render disclosure controls.",
      "Do not use for field rows, panel shells, dropdowns, cards, navigation items, workflow steps, or app-local collapsible regions.",
      "Pair with focus-ring, label-text-style, supporting-text-style, truncating-label, and governed accordion semantics in the consuming primitive.",
    ],
  };
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "accordion",
  tokenType: "accordion-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/accordion/Accordion-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/accordion-frame/AccordionFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/accordion-frame/AccordionFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/accordion-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/accordion-frame/index.html",
    title: "Accordion Frame Token",
    description: "Review governed accordion section frame values before accordion primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/accordion-frame/contract.mjs",
    contractExport: "accordionFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/accordion-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/accordionFrame.tokens.mjs",
    systemTokenExport: "accordionFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: ["original", "dark", "desert"].flatMap((theme) => [makeVariant(theme), makeVariant(theme, "tinted")]),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    frameRole: variant.value.frameRole,
    theme: variant.value.theme,
    tone: variant.value.tone,
    headerBackgroundValue: variant.value.headerBackgroundValue,
    headerForegroundValue: variant.value.headerForegroundValue,
    contentBackgroundValue: variant.value.contentBackgroundValue,
    contentForegroundValue: variant.value.contentForegroundValue,
    borderValue: variant.value.borderValue,
    separatorValue: variant.value.separatorValue,
    radiusValue: variant.value.radiusValue,
    headerMinBlockSize: variant.value.headerMinBlockSize,
    headerPaddingBlockValue: variant.value.headerPaddingBlockValue,
    headerPaddingInlineValue: variant.value.headerPaddingInlineValue,
    contentPaddingBlockValue: variant.value.contentPaddingBlockValue,
    contentPaddingInlineValue: variant.value.contentPaddingInlineValue,
    gapValue: variant.value.gapValue,
    indicatorInlineSize: variant.value.indicatorInlineSize,
    indicatorBlockSize: variant.value.indicatorBlockSize,
    motionDurationValue: variant.value.motionDurationValue,
    motionEasingValue: variant.value.motionEasingValue,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pair with", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const accordionFrameTokenVariants = variants.map(toPageVariant);

export const accordionFrameTokenSpec = {
  contractId: accordionFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "accordion-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These variants govern accordion section frame values across supported themes.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original accordion frame",
      variantId: "accordion-frame-original",
      supportingText: "Surface, separator, target height, indicator size, and spacing are tokenized before primitive semantics.",
    },
    {
      label: "Dark",
      title: "Dark accordion frame",
      variantId: "accordion-frame-dark",
    },
    {
      label: "Desert",
      title: "Desert accordion frame",
      variantId: "accordion-frame-desert",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["theme", "Theme"],
    ["tone", "Tone"],
    ["headerBackgroundValue", "Header background"],
    ["headerForegroundValue", "Header foreground"],
    ["contentBackgroundValue", "Content background"],
    ["borderValue", "Border"],
    ["separatorValue", "Separator"],
    ["radiusValue", "Radius"],
    ["headerMinBlockSize", "Header min height"],
    ["indicatorInlineSize", "Indicator width"],
    ["motionDurationValue", "Motion duration"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: accordionFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding accordion header, content, separator, indicator, radius, or motion values.",
    "The accordion-frame token does not approve disclosure semantics, section grouping, nested field behavior, validation, persistence, workflow behavior, or app adoption.",
  ],
  requiredEvidence: [
    "Rendered proof must show original, dark, and desert frame variants with source token identity and formula mapping.",
    "Accordion primitives must consume this token before reusable accordion patterns use them.",
  ],
};
