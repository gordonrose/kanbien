import { fieldRowFrameTokenContract } from "../../../../layers/02-token/field-row-frame/contract.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";
import { minimumTargetSizeTokenSpec } from "./minimumTargetSize.tokens.mjs";

const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");
const minimumTarget = minimumTargetSizeTokenSpec.variants.find((variant) => variant.id === "target-size-interactive-all");

if (!bodyRegionFrame || !minimumTarget) {
  throw new Error("field-row-frame requires signed body-region-frame and minimum-target-size dependencies.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "field-row-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "rowGapValue",
      "labelToControlGapValue",
      "controlToMessageGapValue",
    "controlSlotMinBlockSize",
    "controlSlotBorderValue",
    "minInlineSize",
      "maxInlineSize",
      "readableOrder",
    ],
    metadataFields: ["frameRole", "responsiveBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "responsiveBehavior"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "form-field",
  tokenType: "field-row-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/field-row-frame/FieldRowFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/field-row-frame/FieldRowFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/field-row-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/field-row-frame/index.html",
    title: "Field Row Frame Token",
    description: "Review governed field-row spacing and control-slot sizing before form-field primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/field-row-frame/contract.mjs",
    contractExport: "fieldRowFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/field-row-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/fieldRowFrame.tokens.mjs",
    systemTokenExport: "fieldRowFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.body-region-frame",
      variantId: bodyRegionFrame.id,
      tokenName: bodyRegionFrame.tokenName,
      value: bodyRegionFrame.gapValue,
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
  variants: [
    {
      id: "field-row-frame-default",
      tokenName: "--field-row-frame",
      value: {
        frameRole: "field row frame",
        rowGapValue: bodyRegionFrame.gapValue,
        labelToControlGapValue: "0.5rem",
        controlToMessageGapValue: "0.375rem",
        controlSlotMinBlockSize: minimumTarget.minimumHeight,
        controlSlotBorderValue: bodyRegionFrame.borderValue,
        minInlineSize: "min(100%, 16rem)",
        maxInlineSize: "100%",
        readableOrder: "label, control slot, helper or error message; preserve this order in LTR and RTL",
      },
      derivation: {
        sourceTokenName: "body-region-frame + minimum-target-size",
        sourceValue: `${bodyRegionFrame.gapValue} body-region content gap; ${minimumTarget.minimumHeight} pointer target height`,
        formulaOrMapping:
          "row gap follows body-region content gap; label and message gaps are smaller field-row intervals; control slot minimum height is the signed pointer target height",
        renderedValue: `${bodyRegionFrame.gapValue} row gap / 0.5rem label gap / 0.375rem message gap / ${minimumTarget.minimumHeight} control slot minimum height / ${bodyRegionFrame.borderValue} slot boundary`,
      },
      preview: {
        kind: "surface-card",
        sample: "Field row",
        background: bodyRegionFrame.backgroundValue,
        foreground: bodyRegionFrame.foregroundValue,
        border: bodyRegionFrame.borderValue,
        radius: bodyRegionFrame.radiusValue,
        label: "Field row frame",
      },
      metadata: {
        frameRole: "field row frame",
        responsiveBehavior: "field rows must preserve readable order and avoid horizontal overflow under constrained width, zoom, and RTL review",
        accessibility: "The control slot minimum height must allow later hosted controls to preserve signed pointer target sizing.",
      },
      useCaseInstructions: [
        "Use for one label, one hosted control slot, and optional helper or error text.",
        "Do not use for native input borders, textarea growth, selector popovers, radio layout, validation behavior, form submission, or app-local form CSS.",
        "Future hosted controls must consume their own signed tokens and primitive contracts before occupying the slot as real controls.",
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
    frameRole: variant.value.frameRole,
    rowGapValue: variant.value.rowGapValue,
    labelToControlGapValue: variant.value.labelToControlGapValue,
    controlToMessageGapValue: variant.value.controlToMessageGapValue,
    controlSlotMinBlockSize: variant.value.controlSlotMinBlockSize,
    controlSlotBorderValue: variant.value.controlSlotBorderValue,
    minInlineSize: variant.value.minInlineSize,
    maxInlineSize: variant.value.maxInlineSize,
    readableOrder: variant.value.readableOrder,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Hosted controls", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const fieldRowFrameTokenVariants = variants.map(toPageVariant);

export const fieldRowFrameTokenSpec = {
  contractId: fieldRowFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "field-row-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs reusable field-row spacing and hosted-control slot sizing.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Field",
      title: "Reusable field row frame",
      variantId: "field-row-frame-default",
      supportingText: "Label, control slot, and helper/error spacing are tokenized before form primitives consume them.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["rowGapValue", "Row gap"],
    ["labelToControlGapValue", "Label to control gap"],
    ["controlToMessageGapValue", "Control to message gap"],
    ["controlSlotMinBlockSize", "Control slot min height"],
    ["controlSlotBorderValue", "Control slot boundary"],
    ["minInlineSize", "Min width"],
    ["maxInlineSize", "Max width"],
    ["readableOrder", "Readable order"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: fieldRowFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding field-row spacing, control-slot minimum size, or width literals.",
    "The field row frame token does not approve native input styling, textarea sizing, selector behavior, radio state, toggle behavior, validation semantics, product copy, form submission, or app adoption.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity and field-row frame values.",
    "Layer 3 field-row primitives must consume this token before owning label/control/message structure.",
  ],
};
