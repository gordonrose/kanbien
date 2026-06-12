import { contextNavigationItemAffordanceTokenContract } from "../../../../layers/02-token/context-navigation-item-affordance/contract.mjs";
import { contextNavigationFrameTokenSpec } from "./contextNavigationFrame.tokens.mjs";

const contextFrame = contextNavigationFrameTokenSpec.variants.find(
  (variant) => variant.id === "context-navigation-frame-default",
);

if (!contextFrame) {
  throw new Error("context-navigation-item-affordance requires the signed context-navigation-frame dependency.");
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "context-navigation-item-affordance",
  previewKind: "context-navigation-item-affordance-sample",
  variantSchema: {
    valueFields: contextNavigationItemAffordanceTokenContract.valueFields,
    metadataFields: contextNavigationItemAffordanceTokenContract.metadataFields,
    useCaseInstructionFields: contextNavigationItemAffordanceTokenContract.useCaseInstructionFields,
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "context-navigation",
  tokenType: "context-navigation-item-affordance",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/context-navigation/ContextNavigation-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/context-navigation-item-affordance/ContextNavigationItemAffordance-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/context-navigation-item-affordance/ContextNavigationItemAffordance-Implementation.md",
  page: {
    route: "/design-system/default/tokens/context-navigation-item-affordance",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/context-navigation-item-affordance/index.html",
    title: "Context Navigation Item Affordance Token",
    description:
      "Review governed context-navigation item state values before item primitives and rail or bottom-bar patterns consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/contract.mjs",
    contractExport: "contextNavigationItemAffordanceTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationItemAffordance.tokens.mjs",
    systemTokenExport: "contextNavigationItemAffordanceTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract", "05-component-seam"],
  },
  dependencies: [
    {
      contractId: "tokens.context-navigation-frame",
      variantId: contextFrame.id,
      tokenName: contextFrame.tokenName,
      value: "desktop rail item 2.75rem / mobile item padding 0.55rem 0.35rem",
      relationship: "paired-with",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "No diagnostic override is approved; the proof must show resting, hover, current, and disabled state affordances together.",
  },
  variants: [
    {
      id: "context-navigation-item-affordance-default",
      tokenName: "--context-navigation-item-affordance",
      value: {
        itemRole: "context navigation item affordance",
        desktopInlineSize: "2.75rem",
        desktopBlockSize: "2.75rem",
        mobilePaddingBlockValue: "0.55rem",
        mobilePaddingInlineValue: "0.35rem",
        radiusValue: "var(--radius-sm)",
        restingBorderValue: "0.0625rem solid var(--line)",
        restingBackgroundValue: "var(--surface-1)",
        restingForegroundValue: "var(--ink-soft)",
        hoverBorderValue: "0.0625rem solid var(--line-strong)",
        hoverBackgroundValue: "var(--surface-1)",
        hoverForegroundValue: "var(--ink)",
        currentBorderValue: "0.0625rem solid rgba(99, 91, 255, 0.22)",
        currentBackgroundValue: "var(--accent-soft)",
        currentForegroundValue: "var(--accent-text)",
        disabledOpacityValue: "0.58",
      },
      derivation: {
        sourceTokenName: `${contextFrame.tokenName} + 40-system context-nav item CSS`,
        sourceValue: "src/frontend/designSystem/assets/styles.css",
        formulaOrMapping:
          "Desktop dimensions, mobile padding, resting, hover, current, and disabled affordance values are lifted from existing context-nav item CSS and paired with the signed context-navigation-frame token.",
        renderedValue:
          "desktop item 2.75rem square / mobile padding 0.55rem 0.35rem / current background var(--accent-soft) and border rgba(99, 91, 255, 0.22)",
      },
      preview: {
        kind: "context-navigation-item-affordance-sample",
        sample: "Context item states",
        background: "var(--surface-2)",
        foreground: "var(--ink)",
        label: "Context item states",
      },
      metadata: {
        itemRole: "context navigation item affordance",
        stateModel: "resting, hover, current, and disabled visual values move as one item-affordance decision",
        responsiveBehavior: "desktop uses fixed item dimensions; mobile uses full-column item placement with signed padding",
        accessibility: "Current state visual affordance must be paired with aria-current or equivalent programmatic current semantics.",
      },
      useCaseInstructions: [
        "Use for context-navigation item controls that need resting, hover, current, and disabled item affordance values.",
        "Do not use for context-navigation rail placement, bottom-bar pinning, icon artwork, tooltip disclosure, drawer payloads, or More-menu overflow behavior.",
        "Proof must show resting, hover, current, and disabled item states together and state that current semantics remain owned by the consuming primitive.",
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
    itemRole: variant.value.itemRole,
    desktopInlineSize: variant.value.desktopInlineSize,
    desktopBlockSize: variant.value.desktopBlockSize,
    mobilePaddingBlockValue: variant.value.mobilePaddingBlockValue,
    mobilePaddingInlineValue: variant.value.mobilePaddingInlineValue,
    radiusValue: variant.value.radiusValue,
    restingBorderValue: variant.value.restingBorderValue,
    restingBackgroundValue: variant.value.restingBackgroundValue,
    restingForegroundValue: variant.value.restingForegroundValue,
    hoverBorderValue: variant.value.hoverBorderValue,
    hoverBackgroundValue: variant.value.hoverBackgroundValue,
    hoverForegroundValue: variant.value.hoverForegroundValue,
    currentBorderValue: variant.value.currentBorderValue,
    currentBackgroundValue: variant.value.currentBackgroundValue,
    currentForegroundValue: variant.value.currentForegroundValue,
    disabledOpacityValue: variant.value.disabledOpacityValue,
    stateModel: variant.metadata.stateModel,
    responsiveBehavior: variant.metadata.responsiveBehavior,
    accessibility: variant.metadata.accessibility,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    preview: {
      ...variant.preview,
      desktopInlineSize: variant.value.desktopInlineSize,
      desktopBlockSize: variant.value.desktopBlockSize,
      radiusValue: variant.value.radiusValue,
      restingBorderValue: variant.value.restingBorderValue,
      restingBackgroundValue: variant.value.restingBackgroundValue,
      restingForegroundValue: variant.value.restingForegroundValue,
      hoverBorderValue: variant.value.hoverBorderValue,
      hoverBackgroundValue: variant.value.hoverBackgroundValue,
      hoverForegroundValue: variant.value.hoverForegroundValue,
      currentBorderValue: variant.value.currentBorderValue,
      currentBackgroundValue: variant.value.currentBackgroundValue,
      currentForegroundValue: variant.value.currentForegroundValue,
      disabledOpacityValue: variant.value.disabledOpacityValue,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Proof", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const contextNavigationItemAffordanceTokenVariants = variants.map(toPageVariant);

export const contextNavigationItemAffordanceTokenSpec = {
  contractId: contextNavigationItemAffordanceTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This variant governs the context-navigation item state affordance bundle for resting, hover, current, and disabled item controls.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Context item",
      title: "State affordance bundle",
      variantId: "context-navigation-item-affordance-default",
      supportingText: "The proof shows resting, hover, current, and disabled item states as one governed token decision.",
    },
  ],
  variantFields: [
    ["itemRole", "Role"],
    ["desktopInlineSize", "Desktop inline size"],
    ["desktopBlockSize", "Desktop block size"],
    ["mobilePaddingBlockValue", "Mobile padding block"],
    ["mobilePaddingInlineValue", "Mobile padding inline"],
    ["radiusValue", "Radius"],
    ["restingBackgroundValue", "Resting background"],
    ["hoverBackgroundValue", "Hover background"],
    ["currentBackgroundValue", "Current background"],
    ["disabledOpacityValue", "Disabled opacity"],
    ["stateModel", "State model"],
    ["accessibility", "Accessibility"],
  ],
  variants: contextNavigationItemAffordanceTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding context-navigation item state values.",
    "Current visual affordance must be paired with programmatic current semantics.",
    "This token does not approve icon artwork, tooltip disclosure, label truncation, drawer behavior, More-menu overflow, or rail placement.",
    "App pages must not recreate these item affordance values with local CSS.",
  ],
  requiredEvidence: [
    "Rendered proof must show resting, hover, current, and disabled item states together.",
    "Primitive proof must show current destination items expose programmatic current semantics.",
    "Mobile proof must preserve item target geometry without relying on page-local CSS.",
  ],
};
