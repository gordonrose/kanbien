import { fieldContainerFrameTokenContract } from "../../../../layers/02-token/field-container-frame/contract.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";

const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");

if (!bodyRegionFrame) {
  throw new Error("field-container-frame requires the signed body-region-frame dependency.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "field-container-frame",
  previewKind: "field-container-frame-sample",
  variantSchema: {
    valueFields: [
      "frameRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "minBlockSize",
      "minInlineSize",
      "maxInlineSize",
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
  tokenType: "field-container-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/field-container-frame/FieldContainerFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/field-container-frame/FieldContainerFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/field-container-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/field-container-frame/index.html",
    title: "Field Container Frame Token",
    description: "Review governed outer field-container values before field-container primitives or form patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/field-container-frame/contract.mjs",
    contractExport: "fieldContainerFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/field-container-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/fieldContainerFrame.tokens.mjs",
    systemTokenExport: "fieldContainerFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.body-region-frame",
      variantId: bodyRegionFrame.id,
      tokenName: bodyRegionFrame.tokenName,
      value: bodyRegionFrame.tokenValue,
      relationship: "derived-from",
    },
  ],
  variants: [
    {
      id: "field-container-frame-default",
      tokenName: "--field-container-frame",
      value: {
        frameRole: "field container frame",
        backgroundValue: bodyRegionFrame.backgroundValue,
        foregroundValue: bodyRegionFrame.foregroundValue,
        borderValue: bodyRegionFrame.borderValue,
        radiusValue: "0.375rem",
        paddingBlockValue: "1rem",
        paddingInlineValue: "1rem",
        minBlockSize: "8.5rem",
        minInlineSize: "min(100%, 16rem)",
        maxInlineSize: "100%",
      },
      derivation: {
        sourceTokenName: bodyRegionFrame.tokenName,
        sourceValue: bodyRegionFrame.tokenValue,
        formulaOrMapping:
          "field-container surface, foreground, and border derive from body-region-frame; radius, padding, and minimum field height are field-container decisions",
        renderedValue:
          "body-region surface / body-region foreground / body-region border / 0.375rem radius / 1rem padding / 8.5rem minimum height / full available inline size",
      },
      preview: {
        kind: "field-container-frame-sample",
        sample: "Field container",
        background: bodyRegionFrame.backgroundValue,
        foreground: bodyRegionFrame.foregroundValue,
        border: bodyRegionFrame.borderValue,
        radius: "0.375rem",
        paddingBlock: "1rem",
        paddingInline: "1rem",
        minBlockSize: "8.5rem",
        label: "Field label",
        control: "Hosted field control",
      },
      metadata: {
        frameRole: "field container frame",
        responsiveBehavior:
          "field containers fill their grid slot, preserve internal field content at constrained widths, and may stack when the containing pattern collapses",
        accessibility:
          "Field-container spacing must not hide labels, helper text, error text, focus rings, or control target areas at zoom, RTL, or constrained width.",
      },
      useCaseInstructions: [
        "Use for the outer surface around one complete governed field or field pattern inside form/body regions.",
        "Do not use for native input frames, selectable option cards, body regions, panel shells, workflow builders, or app-local form CSS.",
        "Hosted field content must still consume its own governed primitive or pattern before being placed inside this frame.",
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
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    minBlockSize: variant.value.minBlockSize,
    minInlineSize: variant.value.minInlineSize,
    maxInlineSize: variant.value.maxInlineSize,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Hosted content", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const fieldContainerFrameTokenVariants = variants.map(toPageVariant);

export const fieldContainerFrameTokenSpec = {
  contractId: fieldContainerFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "field-container-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs reusable outer field-container surface, padding, and sizing.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Field",
      title: "Reusable field container",
      variantId: "field-container-frame-default",
      supportingText: "Outer field surface, padding, and minimum field height are tokenized before form primitives consume them.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Block padding"],
    ["paddingInlineValue", "Inline padding"],
    ["minBlockSize", "Min height"],
    ["minInlineSize", "Min width"],
    ["maxInlineSize", "Max width"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: fieldContainerFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding field-container surface, padding, border, radius, or sizing values.",
    "The field container frame token does not approve label semantics, native input styling, selector behavior, validation behavior, product copy, form submission, or app adoption.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity and field-container frame values.",
    "Layer 3 field-container primitives must consume this token before owning outer field wrapper markup.",
    "Layer 4 form/body patterns must prove field containers wrap governed child fields without changing child behavior.",
  ],
};
