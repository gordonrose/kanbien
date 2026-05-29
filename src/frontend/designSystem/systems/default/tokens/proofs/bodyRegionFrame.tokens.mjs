import { bodyRegionFrameTokenContract } from "../../../../layers/02-token/body-region-frame/contract.mjs";
import { panelFrameTokenSpec } from "./panelFrame.tokens.mjs";

const panelFrame = panelFrameTokenSpec.variants.find((variant) => variant.id === "panel-frame-default");

if (!panelFrame) {
  throw new Error("body-region-frame requires the signed panel-frame dependency.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "body-region-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "gapValue",
      "sectionGapValue",
      "minInlineSize",
      "maxInlineSize",
      "minBlockSize",
      "desktopMaxBlockSize",
      "mobileBlockSizeBehavior",
      "stateSpacingValue",
    ],
    metadataFields: ["frameRole", "responsiveBehavior", "scrollBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "responsiveBehavior"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "body-region",
  tokenType: "body-region-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/body-region-frame/BodyRegionFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/body-region-frame/BodyRegionFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/body-region-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/body-region-frame/index.html",
    title: "Body Region Frame Token",
    description: "Review governed inner body/content-region frame values before body primitives or patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/body-region-frame/contract.mjs",
    contractExport: "bodyRegionFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/body-region-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/bodyRegionFrame.tokens.mjs",
    systemTokenExport: "bodyRegionFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.panel-frame",
      variantId: panelFrame.id,
      tokenName: panelFrame.tokenName,
      value: panelFrame.tokenValue,
      relationship: "derived-from",
    },
  ],
  variants: [
    {
      id: "body-region-frame-default",
      tokenName: "--body-region-frame",
      value: {
        frameRole: "body region frame",
        backgroundValue: panelFrame.backgroundValue,
        foregroundValue: panelFrame.foregroundValue,
        borderValue: panelFrame.borderValue,
        radiusValue: panelFrame.radiusValue,
        paddingBlockValue: "1rem",
        paddingInlineValue: "1rem",
        gapValue: "0.75rem",
        sectionGapValue: "1rem",
        minInlineSize: panelFrame.doubleInlineSize,
        maxInlineSize: panelFrame.maxInlineSize,
        minBlockSize: "12rem",
        desktopMaxBlockSize: panelFrame.maxBlockSize,
        mobileBlockSizeBehavior: "mobile body regions may expand to content height when the containing pattern selects page-scroll placement",
        stateSpacingValue: "0.75rem",
      },
      derivation: {
        sourceTokenName: panelFrame.tokenName,
        sourceValue: panelFrame.tokenValue,
        formulaOrMapping: "body region surface, foreground, border, radius, min width, max width, and desktop max height derive from panel-frame; padding and state spacing are body-region decisions",
        renderedValue: "panel-frame double min width / panel-frame available max width / 1rem padding / 0.75rem content gap / 1rem section gap / 12rem minimum height / panel-frame desktop max height",
      },
      preview: {
        kind: "surface-card",
        sample: "Body region",
        background: panelFrame.backgroundValue,
        foreground: panelFrame.foregroundValue,
        border: panelFrame.borderValue,
        radius: panelFrame.radiusValue,
        label: "Body region frame",
      },
      metadata: {
        frameRole: "body region frame",
        responsiveBehavior: "desktop body regions may use a governed internal scroll owner; mobile body regions may expand with page scroll when the containing pattern selects that posture",
        scrollBehavior: "scroll ownership belongs to the consuming primitive or pattern; this token supplies frame and sizing values only",
        accessibility: "Body-region spacing and scroll sizing must keep content reachable at zoom and must not hide errors, blocked states, or controls.",
      },
      useCaseInstructions: [
        "Use for inner body/content regions inside governed panels.",
        "Do not use for outer panel shells, navigation lists, cards, fields, builders, route wrappers, or app-local form layouts.",
        "Hosted controls still need their own governed token and primitive foundations before the body region may render them as real controls.",
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
    gapValue: variant.value.gapValue,
    sectionGapValue: variant.value.sectionGapValue,
    minInlineSize: variant.value.minInlineSize,
    maxInlineSize: variant.value.maxInlineSize,
    minBlockSize: variant.value.minBlockSize,
    desktopMaxBlockSize: variant.value.desktopMaxBlockSize,
    mobileBlockSizeBehavior: variant.value.mobileBlockSizeBehavior,
    stateSpacingValue: variant.value.stateSpacingValue,
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

export const bodyRegionFrameTokenVariants = variants.map(toPageVariant);

export const bodyRegionFrameTokenSpec = {
  contractId: bodyRegionFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "body-region-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs inner body/content-region frame values.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Body",
      title: "Reusable body region frame",
      variantId: "body-region-frame-default",
      supportingText: "Inner content surface, spacing, state spacing, and reachability values are tokenized before body composition.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["paddingBlockValue", "Block padding"],
    ["paddingInlineValue", "Inline padding"],
    ["gapValue", "Content gap"],
    ["sectionGapValue", "Section gap"],
    ["minInlineSize", "Min width"],
    ["maxInlineSize", "Max width"],
    ["minBlockSize", "Min height"],
    ["desktopMaxBlockSize", "Desktop max height"],
    ["mobileBlockSizeBehavior", "Mobile height behavior"],
    ["stateSpacingValue", "State spacing"],
    ["sourceTokenName", "Source token"],
    ["sourceValue", "Source value"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: bodyRegionFrameTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding body-region surface, padding, gap, radius, height, or state-spacing values.",
    "The body region frame token does not approve hosted form controls, validation semantics, workflow behavior, product data, component seams, or app adoption.",
    "Proof-only content pressure may test reachability, but downstream consumers must use signed token variants.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity and body-region frame values.",
    "Layer 3 body primitives must consume this token before owning body-region markup.",
    "Layer 4 body patterns must prove long-content reachability and hosted-control blockers in the browser.",
  ],
};
