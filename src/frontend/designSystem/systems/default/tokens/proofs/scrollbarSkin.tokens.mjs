import { scrollbarSkinTokenContract } from "../../../../layers/02-token/scrollbar-skin/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "scrollbar-skin",
  previewKind: "scrollbar-sample",
  variantSchema: {
    valueFields: ["scrollbarWidthValue", "scrollbarThumbValue", "scrollbarTrackValue", "scrollbarRadiusValue"],
    metadataFields: ["sourceTokenName", "formulaOrMapping", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "fallbackUse"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "shared-scroll",
  tokenType: "scrollbar-skin",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/scrollbar-skin/ScrollbarSkin-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/scrollbar-skin/ScrollbarSkin-Implementation.md",
  page: {
    route: "/design-system/default/tokens/scrollbar-skin",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/scrollbar-skin/index.html",
    title: "Scrollbar Skin Token",
    description: "Review governed scrollbar skin values for internal scroll regions.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/scrollbar-skin/contract.mjs",
    contractExport: "scrollbarSkinTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/scrollbar-skin/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/scrollbarSkin.tokens.mjs",
    systemTokenExport: "scrollbarSkinTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "scrollbar-skin-primary",
      tokenName: "--scrollbar-skin-primary",
      value: {
        scrollbarWidthValue: "thin",
        scrollbarThumbValue: "color-mix(in srgb, #4f46e5 46%, #ffffff)",
        scrollbarTrackValue: "color-mix(in srgb, #4f46e5 10%, #ffffff)",
        scrollbarRadiusValue: "999px",
      },
      derivation: {
        sourceTokenName: "primary-color-source",
        sourceValue: "#4f46e5",
        formulaOrMapping: "thumb mixes primary source at 46% over white; track mixes primary source at 10% over white",
        renderedValue: "thin styled scrollbar with primary-tinted thumb and track",
      },
      preview: {
        kind: "scrollbar-sample",
        sample: "Scrollable list",
        background: "#ffffff",
        foreground: "#111827",
        border: "#dbe4f0",
        thumb: "color-mix(in srgb, #4f46e5 46%, #ffffff)",
        track: "color-mix(in srgb, #4f46e5 10%, #ffffff)",
        width: "thin",
        radius: "999px",
        label: "Primary scrollbar",
      },
      metadata: {
        accessibility: "Scrollbar styling must not be the only cue that content overflows. Keyboard and wheel scrolling remain browser-native.",
      },
      useCaseInstructions: [
        "Use for governed internal scroll regions.",
        "Do not use for page-level scrollbars, arbitrary drawers, or route-local proof wrappers.",
        "If unsupported by the browser, fall back to browser-native scrollbar rendering without changing scroll behavior.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    scrollbarWidthValue: variant.value.scrollbarWidthValue,
    scrollbarThumbValue: variant.value.scrollbarThumbValue,
    scrollbarTrackValue: variant.value.scrollbarTrackValue,
    scrollbarRadiusValue: variant.value.scrollbarRadiusValue,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "original",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Fallback", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const scrollbarSkinTokenVariants = variants.map(toPageVariant);

export const scrollbarSkinTokenSpec = {
  contractId: scrollbarSkinTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "scrollbar-skin",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This token governs scrollbar visual styling for internal scroll regions.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Scrollbar",
      title: "Primary tinted scroll skin",
      variantId: "scrollbar-skin-primary",
      supportingText: "Scrollbar styling is tokenized before the scroll-region primitive applies it.",
    },
  ],
  variantFields: [
    ["scrollbarWidthValue", "Width"],
    ["scrollbarThumbValue", "Thumb"],
    ["scrollbarTrackValue", "Track"],
    ["scrollbarRadiusValue", "Radius"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  diagnostic: {
    kind: "dependency-hex-override",
    kicker: "Diagnostic override",
    label: "Review Source Colour",
    description: "Change the proof-only primary colour source to inspect how the scrollbar thumb and track are derived.",
    inputLabel: "Primary colour source",
    defaultHex: "#4f46e5",
    resetLabel: "Reset",
    previewLabel: "Derived scrollbar skin",
    validStatus: "Proof-only source colour is valid.",
    invalidStatus: "Use a six-digit hex value such as #4f46e5.",
    previews: [
      {
        role: "source",
        label: "Primary source",
        sample: "#4f46e5",
      },
      {
        role: "scrollbar-thumb",
        label: "Scrollbar thumb",
        sample: "46% source over white",
      },
      {
        role: "scrollbar-track",
        label: "Scrollbar track",
        sample: "10% source over white",
      },
    ],
  },
  variants: scrollbarSkinTokenVariants,
  consumerRestrictions: [
    "Consumers must use this token through a governed scroll-region primitive or later-layer seam.",
    "Consumers must not hard-code custom scrollbar colors, widths, or pseudo-element styles.",
    "This token does not define scroll ownership, list behavior, or panel layout.",
  ],
  requiredEvidence: [
    "Rendered proof must show the source token, formula, thumb value, track value, and scrollable sample.",
    "A primitive proof must verify the token can be applied without changing keyboard or pointer scroll behavior.",
    "A pattern proof must verify desktop internal scroll and mobile page-scroll behavior remain distinct.",
  ],
};
