import { indexNavItemCurrentIndicatorTokenContract } from "../../../../layers/02-token/index-nav-item-current-indicator/contract.mjs";
import { indexNavItemSurfaceTokenVariants } from "./indexNavItemSurface.tokens.mjs";

const currentSurfacePreview = indexNavItemSurfaceTokenVariants.find(
  (variant) => variant.id === "index-nav-item-surface-current-original",
);

if (!currentSurfacePreview) {
  throw new Error("index-nav-item-current-indicator proof requires the original current surface token preview.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "state-indicator",
  previewKind: "indicator-sample",
  variantSchema: {
    valueFields: ["indicatorRole", "inlineSize", "minBlockSize", "blockSizeBehavior", "radiusValue", "placement", "colorSource"],
    metadataFields: ["indicatorRole", "placement", "blockSizeBehavior", "colorSource", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "semanticOwner"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav-item",
  tokenType: "state-indicator",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-item-current-indicator",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-item-current-indicator/index.html",
    title: "Index Nav Item Current Indicator Token",
    description: "Review the governed non-color current-state indicator for rectangular index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/contract.mjs",
    contractExport: "indexNavItemCurrentIndicatorTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemCurrentIndicator.tokens.mjs",
    systemTokenExport: "indexNavItemCurrentIndicatorTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "index-nav-item-current-indicator-default",
      tokenName: "--index-nav-item-current-indicator",
      value: {
        indicatorRole: "index nav item current indicator",
        inlineSize: "0.25rem",
        minBlockSize: "1.5rem",
        blockSizeBehavior: "stretch",
        radiusValue: "999px",
        placement: "logical inline-start inside item control",
        colorSource: "currentColor",
      },
      derivation: {
        sourceTokenName: "current text color",
        sourceValue: "currentColor",
        formulaOrMapping: "state indicator uses current foreground color",
        renderedValue: "0.25rem inline-size / stretch block-size / 1.5rem minimum / 999px radius",
      },
      preview: {
        kind: "indicator-sample",
        sample: "Current item",
        indicatorInlineSize: "0.25rem",
        indicatorMinBlockSize: "1.5rem",
        indicatorBlockSizeBehavior: "stretch",
        indicatorRadius: "999px",
        background: currentSurfacePreview.preview.background,
        foreground: currentSurfacePreview.preview.foreground,
        border: currentSurfacePreview.preview.border,
        label: "Current indicator",
      },
      metadata: {
        indicatorRole: "index nav item current indicator",
        placement: "logical inline-start",
        blockSizeBehavior: "stretch to the item content stack",
        colorSource: "currentColor",
        accessibility: "Indicator provides a non-color visual affordance; aria-current remains owned by the primitive.",
      },
      useCaseInstructions: [
        "Use only with a primitive that exposes current state programmatically.",
        "Do not use as hover, focus, disabled, warning, error, or decorative styling.",
        "Semantic owner is the consuming primitive, not this token.",
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
    indicatorRole: variant.value.indicatorRole,
    inlineSize: variant.value.inlineSize,
    minBlockSize: variant.value.minBlockSize,
    blockSizeBehavior: variant.value.blockSizeBehavior,
    radiusValue: variant.value.radiusValue,
    placement: variant.value.placement,
    colorSource: variant.value.colorSource,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Semantics", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const indexNavItemCurrentIndicatorTokenVariants = variants.map(toPageVariant);

export const indexNavItemCurrentIndicatorTokenSpec = {
  contractId: indexNavItemCurrentIndicatorTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-item-current-indicator",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This token governs the visible non-color affordance for current index-navigation items.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Indicator",
      title: "Current marker",
      variantId: "index-nav-item-current-indicator-default",
      supportingText: "The marker is visual only; the primitive owns aria-current.",
    },
  ],
  variantFields: [
    ["indicatorRole", "Role"],
    ["inlineSize", "Inline size"],
    ["minBlockSize", "Minimum block size"],
    ["blockSizeBehavior", "Block size behavior"],
    ["radiusValue", "Radius"],
    ["placement", "Placement"],
    ["colorSource", "Color source"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: indexNavItemCurrentIndicatorTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam before rendering an index item current marker.",
    "This token does not approve current semantics, activation behavior, hover, focus, or disabled behavior.",
  ],
  requiredEvidence: [
    "Rendered proof must show the indicator as a non-color affordance.",
    "Rendered proof context must use signed item surface values rather than hard-coded colour samples.",
    "Primitive proof must separately verify aria-current and current-state behavior.",
  ],
};
