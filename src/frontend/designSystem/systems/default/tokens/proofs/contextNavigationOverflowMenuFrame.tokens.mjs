import { contextNavigationOverflowMenuFrameTokenContract } from "../../../../layers/02-token/context-navigation-overflow-menu-frame/contract.mjs";
import { contextNavigationFrameTokenSpec } from "./contextNavigationFrame.tokens.mjs";

const contextFrame = contextNavigationFrameTokenSpec.variants.find(
  (variant) => variant.id === "context-navigation-frame-default",
);

if (!contextFrame) {
  throw new Error("context-navigation-overflow-menu-frame requires the signed context-navigation-frame dependency.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "context-navigation-overflow-menu-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: contextNavigationOverflowMenuFrameTokenContract.valueFields,
    metadataFields: contextNavigationOverflowMenuFrameTokenContract.metadataFields,
    useCaseInstructionFields: contextNavigationOverflowMenuFrameTokenContract.useCaseInstructionFields,
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "context-navigation",
  tokenType: "context-navigation-overflow-menu-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/context-navigation-overflow-menu-frame/ContextNavigationOverflowMenuFrame-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/context-navigation-overflow-menu-frame/ContextNavigationOverflowMenuFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/context-navigation-overflow-menu-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/context-navigation-overflow-menu-frame/index.html",
    title: "Context Navigation Overflow Menu Frame Token",
    description: "Review governed overflow menu frame values for context-navigation More menus.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/context-navigation-overflow-menu-frame/contract.mjs",
    contractExport: "contextNavigationOverflowMenuFrameTokenContract",
    governedRuntimeModule:
      "src/frontend/designSystem/layers/02-token/context-navigation-overflow-menu-frame/systems/default.mjs",
    systemProofModule:
      "src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationOverflowMenuFrame.tokens.mjs",
    systemTokenExport: "contextNavigationOverflowMenuFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.context-navigation-frame",
      variantId: contextFrame.id,
      tokenName: contextFrame.tokenName,
      value: "menu layer paired with context navigation frame",
      relationship: "paired-with",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "No diagnostic override is approved; primitive proof must verify open and close behavior.",
  },
  variants: [
    {
      id: "context-navigation-overflow-menu-frame-default",
      tokenName: "--context-navigation-overflow-menu-frame",
      value: {
        frameRole: "context navigation overflow menu frame",
        minInlineSize: "12rem",
        paddingValue: "0.35rem",
        borderValue: "0.0625rem solid var(--line)",
        radiusValue: "var(--radius)",
        backgroundValue: "var(--surface-1)",
        shadowValue: "var(--shadow)",
        zIndexValue: "var(--context-nav-menu-layer)",
        desktopBottomOffset: "calc(100% + 0.65rem)",
        desktopInlineOffset: "0",
        mobileBottomOffset: "calc(100% + 0.45rem)",
        mobileInlineInset: "0.25rem",
      },
      derivation: {
        sourceTokenName: `${contextFrame.tokenName} + 40-system context-nav More menu CSS`,
        sourceValue: "src/frontend/designSystem/assets/styles.css",
        formulaOrMapping:
          "Menu frame, bottom offsets, inline mobile inset, surface, border, radius, shadow, and layer are lifted from existing context-nav More menu CSS.",
        renderedValue:
          "min 12rem / padding 0.35rem / bottom calc(100% + 0.65rem) desktop / mobile inset 0.25rem and bottom calc(100% + 0.45rem)",
      },
      preview: {
        kind: "surface-card",
        sample: "More menu",
        background: "var(--surface-1)",
        foreground: "var(--ink)",
        border: "0.0625rem solid var(--line)",
        radius: "var(--radius)",
        label: "Overflow menu frame",
      },
      metadata: {
        frameRole: "context navigation overflow menu frame",
        placementBehavior: "menu opens above More trigger; mobile uses inline inset inside bottom-bar context",
        accessibility: "Frame values must support keyboard-reachable menu content without clipping at mobile bottom-bar placement.",
      },
      useCaseInstructions: [
        "Use for context-navigation More menu frame and placement values.",
        "Do not use for item semantics, trigger behavior, drawer payloads, tooltip disclosure, or app routing.",
        "Primitive proof must verify open, close, Escape, outside click, and focus restoration behavior.",
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
    minInlineSize: variant.value.minInlineSize,
    paddingValue: variant.value.paddingValue,
    borderValue: variant.value.borderValue,
    radiusValue: variant.value.radiusValue,
    backgroundValue: variant.value.backgroundValue,
    shadowValue: variant.value.shadowValue,
    zIndexValue: variant.value.zIndexValue,
    desktopBottomOffset: variant.value.desktopBottomOffset,
    desktopInlineOffset: variant.value.desktopInlineOffset,
    mobileBottomOffset: variant.value.mobileBottomOffset,
    mobileInlineInset: variant.value.mobileInlineInset,
    placementBehavior: variant.metadata.placementBehavior,
    accessibility: variant.metadata.accessibility,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Proof", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const contextNavigationOverflowMenuFrameTokenVariants = variants.map(toPageVariant);

export const contextNavigationOverflowMenuFrameTokenSpec = {
  contractId: contextNavigationOverflowMenuFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs the context-navigation overflow menu frame and placement values.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "More menu",
      title: "Overflow frame",
      variantId: "context-navigation-overflow-menu-frame-default",
      supportingText: "Placement and frame values are reviewed before the More menu primitive consumes them.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["minInlineSize", "Min inline size"],
    ["paddingValue", "Padding"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["backgroundValue", "Background"],
    ["shadowValue", "Shadow"],
    ["zIndexValue", "Layer"],
    ["desktopBottomOffset", "Desktop bottom offset"],
    ["mobileBottomOffset", "Mobile bottom offset"],
    ["mobileInlineInset", "Mobile inline inset"],
    ["accessibility", "Accessibility"],
  ],
  variants: contextNavigationOverflowMenuFrameTokenVariants,
  consumerRestrictions: contextNavigationOverflowMenuFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Rendered proof must show the menu frame values.",
    "Primitive proof must verify open, close, Escape, outside click, and focus restoration.",
    "Pattern proof must show excess mobile primary and utility items remain reachable through More.",
  ],
};
