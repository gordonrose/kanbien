import { textControlFrameTokenContract } from "../../../../layers/02-token/text-control-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";

const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");
const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);

if (!minimumTarget) {
  throw new Error("text-control-frame requires signed minimum-target-size dependency.");
}

const errorSourceByTheme = {
  original: "#7a1f1f",
  dark: "#ffb4b4",
  desert: "#7a1f1f",
};

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

  if (state === "read-only") {
    return {
      backgroundValue: `color-mix(in srgb, ${baseForeground} 4%, ${baseBackground})`,
      foregroundValue: `color-mix(in srgb, ${baseForeground} 78%, ${baseBackground})`,
      borderValue: `color-mix(in srgb, ${baseBorder} 82%, ${baseBackground})`,
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: baseBackground,
      formulaOrMapping: "read-only text-control values mix theme foreground and border over the signed theme surface",
    };
  }

  if (state === "disabled") {
    return {
      backgroundValue: `color-mix(in srgb, ${baseForeground} 4%, ${baseBackground})`,
      foregroundValue: `color-mix(in srgb, ${baseForeground} 54%, ${baseBackground})`,
      borderValue: `color-mix(in srgb, ${baseBorder} 64%, ${baseBackground})`,
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: baseBackground,
      formulaOrMapping: "disabled text-control values mix theme foreground and border over the signed theme surface",
    };
  }

  if (state === "error") {
    const errorForeground = errorSourceByTheme[theme];
    return {
      backgroundValue: `color-mix(in srgb, ${errorForeground} 6%, ${baseBackground})`,
      foregroundValue: errorForeground,
      borderValue: errorForeground,
      sourceTokenName: surfaceVariant.tokenName,
      sourceValue: `${baseBackground} + error source ${errorForeground}`,
      formulaOrMapping:
        "error text-control values mix a system error source over the signed theme surface; primitive semantics still own aria-invalid and error-description wiring",
    };
  }

  return {
    backgroundValue: baseBackground,
    foregroundValue: baseForeground,
    borderValue: baseBorder,
    sourceTokenName: surfaceVariant.tokenName,
    sourceValue: baseBackground,
    formulaOrMapping: `${state} text-control frame inherits signed theme surface, foreground, and border`,
  };
}

function textControlFrameVariant({ theme, state, stateInstruction }) {
  const values = stateValues(theme, state);
  const radiusValue = "0.375rem";
  const paddingBlockValue = "0.5rem";
  const paddingInlineValue = "0.75rem";

  return {
    id: `text-control-frame-${state}-${theme}`,
    tokenName: `--text-control-frame-${state}-${theme}`,
    value: {
      state,
      theme,
      frameRole: `text control ${state} frame`,
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
      sourceValue: `${values.sourceValue}; ${minimumTarget.minimumHeight} target height`,
      formulaOrMapping: `${values.formulaOrMapping}; minimum block size is the signed interactive target height; radius and padding are shared text-control frame values`,
      renderedValue: `${values.backgroundValue} / ${values.foregroundValue} / ${values.borderValue} / ${radiusValue} radius / ${minimumTarget.minimumHeight} min height`,
    },
    preview: {
      kind: "surface-card",
      sample: "Text control",
      background: values.backgroundValue,
      foreground: values.foregroundValue,
      border: values.borderValue,
      radius: radiusValue,
      label: `${theme} text control ${state} frame`,
    },
    metadata: {
      state,
      theme,
      frameRole: `text control ${state} frame`,
      responsiveBehavior: "text controls fill their field-row slot without creating horizontal overflow",
      accessibility:
        "The frame must preserve signed minimum target height and pair visual state with primitive-owned native semantics.",
    },
    useCaseInstructions: [
      stateInstruction,
      "Do not use for buttons, select popovers, radio cards, toggles, accordions, workflow builders, or arbitrary panels.",
      "Pair with field-value-text-style, focus-ring, and native input semantics in the consuming primitive.",
    ],
  };
}

const themes = ["original", "dark", "desert"];
const states = ["default", "required", "read-only", "disabled", "error"];

const stateInstructions = {
  default: "Use for editable text-entry controls in the default state.",
  required:
    "Use for required text-entry controls; required meaning still needs primitive-owned required semantics and marker behavior.",
  "read-only":
    "Use for read-only text-entry controls; read-only meaning still needs native readonly semantics in the consuming primitive.",
  disabled:
    "Use for disabled text-entry controls; disabled meaning still needs native disabled semantics in the consuming primitive.",
  error:
    "Use for invalid text-entry controls; error meaning still needs aria-invalid and error-description wiring in the consuming primitive.",
};

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "text-control-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "state",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "minBlockSize",
      "maxInlineSize",
    ],
    metadataFields: ["frameRole", "state", "responsiveBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "text-entry-control",
  tokenType: "text-control-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-entry-control/TextEntryControl-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/text-control-frame/TextControlFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/text-control-frame/TextControlFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/text-control-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/text-control-frame/index.html",
    title: "Text Control Frame Token",
    description: "Review governed frame values for text-entry controls before native input primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/text-control-frame/contract.mjs",
    contractExport: "textControlFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/text-control-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/textControlFrame.tokens.mjs",
    systemTokenExport: "textControlFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.background-color",
      variantId: "background-surface-*",
      tokenName: "--background-surface-*",
      value: "theme-specific surface foundation",
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
  variants: themes.flatMap((theme) =>
    states.map((state) =>
      textControlFrameVariant({
        theme,
        state,
        stateInstruction: stateInstructions[state],
      }),
    ),
  ),
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

export const textControlFrameTokenVariants = variants.map(toPageVariant);

export const textControlFrameTokenSpec = {
  contractId: textControlFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "text-control-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These variants govern reusable native text-entry frame values for default, required, read-only, disabled, and error states.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Frame",
      title: "Reusable text control frame",
      variantId: "text-control-frame-default-original",
      supportingText: "Surface, border, radius, padding, and target-height values are tokenized before native input primitives consume them.",
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
    ["paddingBlockValue", "Block padding"],
    ["paddingInlineValue", "Inline padding"],
    ["minBlockSize", "Min height"],
    ["maxInlineSize", "Max width"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: textControlFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding text-control surface, foreground, border, padding, radius, or minimum-height values.",
    "The text control frame token does not approve value typography, focus behavior, field labels, helper text, textarea auto-growth, parsing, persistence, or form submission.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity and state-specific text-control frame values.",
    "Text-entry primitives must consume this token before rendering native controls.",
  ],
};
