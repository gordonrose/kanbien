import { fieldValueTextStyleTokenContract } from "../../../../layers/02-token/field-value-text-style/contract.mjs";

const fontFamily = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "field-value-text-style",
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
  uiFamily: "text-entry-control",
  tokenType: "field-value-text-style",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-entry-control/TextEntryControl-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/field-value-text-style/FieldValueTextStyle-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/field-value-text-style/FieldValueTextStyle-Implementation.md",
  page: {
    route: "/design-system/default/tokens/field-value-text-style",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/field-value-text-style/index.html",
    title: "Field Value Text Style Token",
    description: "Review governed typography for user-visible values inside text-entry controls.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/field-value-text-style/contract.mjs",
    contractExport: "fieldValueTextStyleTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/field-value-text-style/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/fieldValueTextStyle.tokens.mjs",
    systemTokenExport: "fieldValueTextStyleTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [],
  variants: [
    {
      id: "field-value-text-style-default",
      tokenName: "--field-value-text-style-default",
      value: {
        textStyleRole: "field value text",
        fontFamilyValue: fontFamily,
        fontFallbackRule: "Use Inter when available, then fall back to ui-sans-serif, system-ui, platform UI fonts, and sans-serif.",
        fontSizeValue: "1rem",
        fontWeightValue: "400",
        lineHeightValue: "1.4",
        letterSpacingValue: "0",
        textTransform: "none",
        overflowReadiness: "Single-line text fields rely on native horizontal text handling; multi-line text areas wrap when that primitive exists.",
        zoomBehavior: "Must remain readable and non-overlapping at 150% zoom.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "none",
        formulaOrMapping: "system implementation value",
        renderedValue: "1rem / 1.4 at weight 400",
      },
      preview: {
        kind: "text-style-sample",
        sample: "entity.organization.label.singular",
        background: "#ffffff",
        foreground: "#111827",
        fontFamily,
        fontSize: "1rem",
        fontWeight: "400",
        lineHeight: "1.4",
        letterSpacing: "0",
        textTransform: "none",
        label: "Field value text",
      },
      metadata: {
        textStyleRole: "field value text",
        theme: "all",
        state: "none",
        accessibility: "Entered values must remain readable under zoom and must not use negative letter spacing.",
      },
      useCaseInstructions: [
        "Use for user-visible values inside governed text-entry controls.",
        "Do not use as label text, helper text, error text, body copy, code text, or navigation text.",
        "Placeholder, validation, and product formatting behavior remain downstream decisions.",
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
    overflowReadiness: variant.value.overflowReadiness,
    zoomBehavior: variant.value.zoomBehavior,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Boundary", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const fieldValueTextStyleTokenVariants = variants.map(toPageVariant);

export const fieldValueTextStyleTokenSpec = {
  contractId: fieldValueTextStyleTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "field-value-text-style",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs typography for values inside text-entry controls.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Value",
      title: "Readable field value text",
      variantId: "field-value-text-style-default",
      supportingText: "Value text is tokenized separately from labels and helper text.",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["fontFallbackRule", "Font fallback rule"],
    ["fontSizeValue", "Font size"],
    ["fontWeightValue", "Font weight"],
    ["lineHeightValue", "Line height"],
    ["letterSpacingValue", "Letter spacing"],
    ["textTransform", "Transform"],
    ["overflowReadiness", "Overflow readiness"],
    ["zoomBehavior", "Zoom behavior"],
  ],
  variants: fieldValueTextStyleTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of styling text-entry values locally.",
    "This token does not define label text, helper text, validation color, input frame geometry, placeholder behavior, parsing, persistence, or submission.",
  ],
  requiredEvidence: [
    "The proof must expose the fallback stack and rendered text sample.",
    "Text field primitives must consume this token before rendering native input value text.",
  ],
};
