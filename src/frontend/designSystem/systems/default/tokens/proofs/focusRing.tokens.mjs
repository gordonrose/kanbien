import { focusRingTokenContract } from "../../../../layers/02-token/focus-ring/contract.mjs";
import { variants as primaryColorSourceVariants } from "./primaryColorSource.tokens.mjs";

const primarySourceByTheme = new Map(primaryColorSourceVariants.map((variant) => [variant.value.themeMapping, variant]));

function primarySource(theme) {
  const source = primarySourceByTheme.get(theme);
  if (!source) {
    throw new Error(`Missing primary color source token for ${theme} theme.`);
  }

  return source;
}

function focusRingValue(theme) {
  return `0.125rem solid color-mix(in srgb, ${primarySource(theme).value.colorValue} 58%, white)`;
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "focus-ring",
  previewKind: "focus-ring-sample",
  variantSchema: {
    valueFields: [
      "focusRole",
      "sourceTokenId",
      "sourceTokenName",
      "sourceColorValue",
      "ringValue",
      "offsetValue",
      "contrastRequirement",
      "themeMapping",
      "layoutImpact",
    ],
    metadataFields: ["focusRole", "theme", "state", "layoutImpact", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "visibleFocusRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "focus-ring",
  tokenType: "focus-ring",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/focus-ring/FocusRing-Implementation.md",
  page: {
    route: "/design-system/default/tokens/focus-ring",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/focus-ring/index.html",
    title: "Focus Ring Tokens",
    description: "Review governed visible-focus ring variants, metadata, and use-case rules.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/focus-ring/contract.mjs",
    contractExport: "focusRingTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/focusRing.tokens.mjs",
    systemTokenExport: "focusRingTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "focus-ring-visible-original",
      tokenName: "--focus-ring-visible-original",
      value: {
        focusRole: "visible focus ring",
        sourceTokenId: primarySource("original").id,
        sourceTokenName: primarySource("original").tokenName,
        sourceColorValue: primarySource("original").value.colorValue,
        ringValue: focusRingValue("original"),
        offsetValue: "0.125rem",
        contrastRequirement:
          "Must remain visibly distinguishable against approved original page, surface, and subtle background foundations.",
        themeMapping: "original",
        layoutImpact: "Uses outline outside the element box and must not shift layout.",
      },
      preview: {
        kind: "focus-ring-sample",
        sample: "Focusable control",
        background: "#ffffff",
        foreground: "#0f1115",
        label: "Original focus ring",
      },
      metadata: {
        focusRole: "visible focus ring",
        theme: "original",
        state: "focus-visible",
        layoutImpact: "no layout shift",
        accessibility: "Keyboard focus must remain visible without relying on color as the only state carrier.",
      },
      useCaseInstructions: [
        "Use for keyboard-visible focus on governed interactive primitives in original theme.",
        "Do not use as selected, active, warning, error, or validation meaning.",
        "Do not remove browser or primitive focus behavior without a governed replacement.",
      ],
    },
    {
      id: "focus-ring-visible-dark",
      tokenName: "--focus-ring-visible-dark",
      value: {
        focusRole: "visible focus ring",
        sourceTokenId: primarySource("dark").id,
        sourceTokenName: primarySource("dark").tokenName,
        sourceColorValue: primarySource("dark").value.colorValue,
        ringValue: focusRingValue("dark"),
        offsetValue: "0.125rem",
        contrastRequirement: "Must remain visibly distinguishable against approved dark page and surface foundations.",
        themeMapping: "dark",
        layoutImpact: "Uses outline outside the element box and must not shift layout.",
      },
      preview: {
        kind: "focus-ring-sample",
        sample: "Focusable control",
        background: "#171b22",
        foreground: "#f4f7fb",
        label: "Dark focus ring",
      },
      metadata: {
        focusRole: "visible focus ring",
        theme: "dark",
        state: "focus-visible",
        layoutImpact: "no layout shift",
        accessibility: "Dark theme focus visibility must be reviewed separately from original theme visibility.",
      },
      useCaseInstructions: [
        "Use for keyboard-visible focus on governed interactive primitives in dark theme.",
        "Do not alias focus visibility to original-theme evidence.",
        "Do not use as selected, active, warning, error, or validation meaning.",
      ],
    },
    {
      id: "focus-ring-visible-desert",
      tokenName: "--focus-ring-visible-desert",
      value: {
        focusRole: "visible focus ring",
        sourceTokenId: primarySource("desert").id,
        sourceTokenName: primarySource("desert").tokenName,
        sourceColorValue: primarySource("desert").value.colorValue,
        ringValue: focusRingValue("desert"),
        offsetValue: "0.125rem",
        contrastRequirement: "Must remain visibly distinguishable against approved desert page and surface foundations.",
        themeMapping: "desert",
        layoutImpact: "Uses outline outside the element box and must not shift layout.",
      },
      preview: {
        kind: "focus-ring-sample",
        sample: "Focusable control",
        background: "#fffaf0",
        foreground: "#493327",
        label: "Desert focus ring",
      },
      metadata: {
        focusRole: "visible focus ring",
        theme: "desert",
        state: "focus-visible",
        layoutImpact: "no layout shift",
        accessibility: "Desert theme focus visibility must be reviewed separately from original and dark theme visibility.",
      },
      useCaseInstructions: [
        "Use for keyboard-visible focus on governed interactive primitives in desert theme.",
        "Do not alias focus visibility to original or dark theme evidence.",
        "Do not use as selected, active, warning, error, or validation meaning.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.ringValue,
    role: variant.metadata.focusRole,
    ringValue: variant.value.ringValue,
    sourceTokenId: variant.value.sourceTokenId,
    sourceTokenName: variant.value.sourceTokenName,
    sourceColorValue: variant.value.sourceColorValue,
    offsetValue: variant.value.offsetValue,
    contrastRequirement: variant.value.contrastRequirement,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    layoutImpact: variant.metadata.layoutImpact,
    accessibility: variant.metadata.accessibility,
    preview: {
      kind: variant.preview.kind,
      background: variant.preview.background,
      foreground: variant.preview.foreground,
      label: variant.preview.label,
      sample: variant.preview.sample,
      ringValue: variant.value.ringValue,
      offsetValue: variant.value.offsetValue,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Visible focus", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const focusRingTokenVariants = variants.map(toPageVariant);

export const focusRingTokenSpec = {
  contractId: focusRingTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "Each row is a reusable visible-focus decision with preview, metadata, and usage constraints.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Visible focus on original surfaces",
      variantId: "focus-ring-visible-original",
      supportingText: "Keyboard focus must be visible without shifting layout.",
    },
    {
      label: "Dark",
      title: "Dark theme proof",
      variantId: "focus-ring-visible-dark",
    },
    {
      label: "Desert",
      title: "Desert theme proof",
      variantId: "focus-ring-visible-desert",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["sourceTokenName", "Primary source"],
    ["sourceColorValue", "Source color"],
    ["ringValue", "Ring"],
    ["offsetValue", "Offset"],
    ["theme", "Theme"],
    ["state", "State"],
    ["layoutImpact", "Layout impact"],
    ["contrastRequirement", "Visibility requirement"],
  ],
  variants: focusRingTokenVariants,
  consumerRestrictions: [
    "Consumers must use this system token module instead of copying focus-ring literals.",
    "Primitives and patterns may consume exported variants after their own harness gates pass.",
    "App pages must not recreate these focus decisions with local CSS.",
    "Consumers must not use this token as selected, active, warning, error, or validation meaning.",
  ],
  requiredEvidence: [
    "Original, dark, and desert theme screenshots must show a visible focus ring.",
    "LTR and RTL rendering must preserve focus meaning and visible geometry.",
    "150% zoom must keep focus-ring variants readable and non-overlapping.",
    "75% zoom must keep the focus ring recognizable.",
    "Constrained embedded previews must show no layout shift when focus is visible.",
  ],
};
