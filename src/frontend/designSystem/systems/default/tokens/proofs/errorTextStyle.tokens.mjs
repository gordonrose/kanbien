import { errorTextStyleTokenContract } from "../../../../layers/02-token/error-text-style/contract.mjs";
import { textControlFrameTokenSpec } from "./textControlFrame.tokens.mjs";

const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
const errorFrame = textControlFrameTokenSpec.variants.find((variant) => variant.id === "text-control-frame-error");

if (!errorFrame) {
  throw new Error("error-text-style requires the signed text-control-frame error variant.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "error-text-style",
  previewKind: "text-style-sample",
  variantSchema: {
    valueFields: [
      "textStyleRole",
      "fontFamilyValue",
      "fontFallbackRule",
      "fontSizeValue",
      "fontWeightValue",
      "lineHeightValue",
      "letterSpacingValue",
      "textTransform",
      "foregroundValue",
      "overflowReadiness",
      "zoomBehavior",
    ],
    metadataFields: ["textStyleRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "overflowRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "form-field",
  tokenType: "error-text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/error-text-style/ErrorTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/error-text-style/ErrorTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/error-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/error-text-style/index.html",
    title: "Error Text Style Token",
    description: "Review governed typography and foreground for field-row error text.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/error-text-style/contract.mjs",
    contractExport: "errorTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/error-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/errorTextStyle.tokens.mjs",
    systemTokenExport: "errorTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.text-control-frame",
      variantId: errorFrame.id,
      tokenName: errorFrame.tokenName,
      value: errorFrame.foregroundValue,
      relationship: "derived-from",
    },
  ],
  variants: [
    {
      id: "error-text-style-default",
      tokenName: "--error-text-style-default",
      value: {
        textStyleRole: "field error text",
        fontFamilyValue: fontFamily,
        fontFallbackRule:
          "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        fontSizeValue: "0.75rem",
        fontWeightValue: "800",
        lineHeightValue: "1.2",
        letterSpacingValue: "0",
        textTransform: "none",
        foregroundValue: errorFrame.foregroundValue,
        overflowReadiness: "Error text may wrap and must remain readable without clipping.",
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: errorFrame.tokenName,
        sourceValue: errorFrame.foregroundValue,
        formulaOrMapping:
          "error text typography follows supporting text scale; foreground derives from the signed text-control error foreground so field-row messages align with errored text controls",
        renderedValue: `${errorFrame.foregroundValue} / 0.75rem / 1.2 at weight 800`,
      },
      preview: {
        kind: "text-style-sample",
        sample: "Error text is wired to the field description.",
        background: errorFrame.backgroundValue,
        foreground: errorFrame.foregroundValue,
        fontFamily,
        fontSize: "0.75rem",
        fontWeight: "800",
        lineHeight: "1.2",
        letterSpacing: "0",
        textTransform: "none",
        label: "Field error text",
      },
      metadata: {
        textStyleRole: "field error text",
        theme: "all",
        state: "error",
        accessibility: "Error text color must be paired with programmatic error-description wiring and must not be the only error cue.",
      },
      useCaseInstructions: [
        "Use for field-row error messages after the primitive exposes error description wiring.",
        "Do not use as helper text, supporting item text, body text, label text, tooltip text, input border color, or validation behavior.",
        "Error text may wrap; do not clip or truncate error messages without a later disclosure decision.",
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
    role: variant.metadata.textStyleRole,
    fontFamilyValue: variant.value.fontFamilyValue,
    fontFallbackRule: variant.value.fontFallbackRule,
    fontSizeValue: variant.value.fontSizeValue,
    fontWeightValue: variant.value.fontWeightValue,
    lineHeightValue: variant.value.lineHeightValue,
    letterSpacingValue: variant.value.letterSpacingValue,
    textTransform: variant.value.textTransform,
    foregroundValue: variant.value.foregroundValue,
    overflowReadiness: variant.value.overflowReadiness,
    zoomBehavior: variant.value.zoomBehavior,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Overflow", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const errorTextStyleTokenVariants = variants.map(toPageVariant);

export const errorTextStyleTokenSpec = {
  contractId: errorTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "error-text-style",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs field-row error text typography and foreground. It does not define validation behavior.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Error text",
      title: "Field error message",
      variantId: "error-text-style-default",
      supportingText: "Error text foreground derives from the signed text-control error frame.",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["foregroundValue", "Foreground"],
    ["fontFallbackRule", "Font fallback rule"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["letterSpacingValue", "Letter spacing"],
    ["textTransform", "Transform"],
    ["overflowReadiness", "Overflow readiness"],
    ["zoomBehavior", "Zoom behavior"],
  ],
  variants: errorTextStyleTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling error text locally.",
    "Consumers must not use this token as helper text, item supporting text, body text, label text, tooltip text, or input frame color.",
    "This token does not replace invalid semantics or error-description wiring.",
  ],
  requiredEvidence: [
    "The proof must expose the fallback stack, foreground value, and rendered error message sample.",
    "Field-row primitives must consume this token before rendering error message text.",
  ],
};
