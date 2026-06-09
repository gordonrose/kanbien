import { feedbackTextStyleTokenContract } from "../../../../layers/02-token/feedback-text-style/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { statusColorTokenVariants } from "./statusColor.tokens.mjs";
import { textControlFrameTokenSpec } from "./textControlFrame.tokens.mjs";

const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
const themes = ["original", "dark", "desert"];
const tones = ["neutral", "warning", "error"];

const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);
const warningByTheme = new Map(statusColorTokenVariants.map((variant) => [variant.theme, variant]));
const errorFrameByTheme = new Map(
  textControlFrameTokenSpec.variants
    .filter((variant) => variant.state === "error")
    .map((variant) => [variant.theme, variant]),
);

function surface(theme) {
  const variant = surfaceByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing background surface token for ${theme}.`);
  }
  return variant;
}

function toneValues(theme, tone) {
  const surfaceVariant = surface(theme);
  if (tone === "warning") {
    const warning = warningByTheme.get(theme);
    if (!warning) {
      throw new Error(`Missing warning status-color token for ${theme}.`);
    }
    return {
      foregroundValue: warning.foregroundValue,
      sourceTokenName: warning.tokenName,
      sourceValue: warning.foregroundValue,
      formulaOrMapping: "warning feedback text uses the signed warning status-colour foreground",
    };
  }
  if (tone === "error") {
    const errorFrame = errorFrameByTheme.get(theme);
    if (!errorFrame) {
      throw new Error(`Missing text-control-frame error token for ${theme}.`);
    }
    return {
      foregroundValue: errorFrame.foregroundValue,
      sourceTokenName: errorFrame.tokenName,
      sourceValue: errorFrame.foregroundValue,
      formulaOrMapping: "error feedback text uses the signed themed text-control error foreground",
    };
  }
  return {
    foregroundValue: surfaceVariant.preview.foreground,
    sourceTokenName: surfaceVariant.tokenName,
    sourceValue: surfaceVariant.preview.foreground,
    formulaOrMapping: "neutral feedback text uses the signed theme surface foreground",
  };
}

function makeVariant(theme, tone) {
  const values = toneValues(theme, tone);
  const fontWeightValue = tone === "neutral" ? "700" : "800";

  return {
    id: `feedback-text-style-${tone}-${theme}`,
    tokenName: `--feedback-text-style-${tone}-${theme}`,
    value: {
      textStyleRole: "feedback text",
      feedbackTone: tone,
      theme,
      fontFamilyValue: fontFamily,
      fontFallbackRule:
        "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
      fontSizeValue: "0.875rem",
      fontWeightValue,
      lineHeightValue: "1.35",
      letterSpacingValue: "0",
      textTransform: "none",
      foregroundValue: values.foregroundValue,
      overflowReadiness: "Short feedback text may wrap; do not truncate without a later disclosure decision.",
      zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
    },
    derivation: {
      sourceTokenName: values.sourceTokenName,
      sourceValue: values.sourceValue,
      formulaOrMapping: `${values.formulaOrMapping}; typography is the default-system feedback text implementation value`,
      renderedValue: `${values.foregroundValue} / 0.875rem / 1.35 at weight ${fontWeightValue}`,
    },
    preview: {
      kind: "text-style-sample",
      sample: tone === "neutral" ? "No available options match the current search." : `${tone} feedback message`,
      background: surface(theme).preview.background,
      foreground: values.foregroundValue,
      fontFamily,
      fontSize: "0.875rem",
      fontWeight: fontWeightValue,
      lineHeight: "1.35",
      letterSpacing: "0",
      textTransform: "none",
      label: `${theme} ${tone} feedback text`,
    },
    metadata: {
      textStyleRole: "feedback text",
      feedbackTone: tone,
      theme,
      accessibility:
        "Feedback text must remain readable on the signed theme surface and must be paired with pattern-owned status semantics when the message is dynamic.",
    },
    useCaseInstructions: [
      `Use for short ${tone} non-field feedback messages in governed primitives or patterns.`,
      "Do not use for field-row errors, helper text, option supporting text, body paragraphs, tooltips, labels, badges, icons, product validation logic, or live-region semantics.",
      "Feedback text may wrap; do not clip or truncate feedback messages without a later disclosure decision.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "feedback-text-style",
  previewKind: "text-style-sample",
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "feedback-message",
  tokenType: "feedback-text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/feedback-text-style/FeedbackTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/feedback-text-style/FeedbackTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/feedback-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/feedback-text-style/index.html",
    title: "Feedback Text Style Token",
    description: "Review governed typography and foreground for short non-field feedback messages.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/feedback-text-style/contract.mjs",
    contractExport: "feedbackTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/feedback-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/feedbackTextStyle.tokens.mjs",
    systemTokenExport: "feedbackTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.background-color",
      variantId: "background-surface-*",
      tokenName: "--background-surface-*",
      value: "theme-specific surface foreground",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.status-color",
      variantId: "status-color-warning-*",
      tokenName: "--status-color-warning-*",
      value: "theme-specific warning foreground",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.text-control-frame",
      variantId: "text-control-frame-error-*",
      tokenName: "--text-control-frame-error-*",
      value: "theme-specific error foreground",
      relationship: "derived-from",
    },
  ],
  variants: themes.flatMap((theme) => tones.map((tone) => makeVariant(theme, tone))),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    role: variant.value.textStyleRole,
    feedbackTone: variant.value.feedbackTone,
    theme: variant.value.theme,
    foregroundValue: variant.value.foregroundValue,
    fontFamilyValue: variant.value.fontFamilyValue,
    fontFallbackRule: variant.value.fontFallbackRule,
    fontSizeValue: variant.value.fontSizeValue,
    fontWeightValue: variant.value.fontWeightValue,
    lineHeightValue: variant.value.lineHeightValue,
    letterSpacingValue: variant.value.letterSpacingValue,
    textTransform: variant.value.textTransform,
    overflowReadiness: variant.value.overflowReadiness,
    zoomBehavior: variant.value.zoomBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Overflow", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const feedbackTextStyleTokenVariants = variants.map(toPageVariant);

export const feedbackTextStyleTokenSpec = {
  contractId: feedbackTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "feedback-text-style",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These variants govern short non-field feedback text across neutral, warning, and error tones for each supported theme.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Neutral",
      title: "Panel feedback",
      variantId: "feedback-text-style-neutral-original",
      supportingText: "Short system messages are tokenized separately from helper text and field-row errors.",
    },
    {
      label: "Dark",
      title: "Dark feedback",
      variantId: "feedback-text-style-neutral-dark",
      supportingText: "Theme foreground comes from signed surface tokens.",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["feedbackTone", "Tone"],
    ["theme", "Theme"],
    ["foregroundValue", "Foreground"],
    ["fontFallbackRule", "Font fallback rule"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["letterSpacingValue", "Letter spacing"],
    ["textTransform", "Transform"],
    ["overflowReadiness", "Overflow readiness"],
    ["zoomBehavior", "Zoom behavior"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: feedbackTextStyleTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling short non-field feedback text locally.",
    "Consumers must not use this token for helper text, field-row errors, labels, option supporting text, tooltip text, or body paragraphs.",
    "This token does not define product copy, live-region semantics, validation behavior, icons, or empty-state layout.",
  ],
  requiredEvidence: [
    "Rendered proof must show neutral, warning, and error text across supported themes.",
    "Rendered proof must show foreground source token and mapping for each tone.",
    "150% zoom must keep feedback text readable and non-overlapping.",
  ],
};
