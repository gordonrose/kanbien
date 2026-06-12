import { toolsNavigationFrameTokenContract } from "../../../../layers/02-token/tools-navigation-frame/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "tools-navigation-frame",
  previewKind: "tools-navigation-frame-sample",
  variantSchema: {
    valueFields: toolsNavigationFrameTokenContract.valueFields,
    metadataFields: toolsNavigationFrameTokenContract.metadataFields,
    useCaseInstructionFields: toolsNavigationFrameTokenContract.useCaseInstructionFields,
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "tools-navigation",
  tokenType: "tools-navigation-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/tools-navigation-frame/ToolsNavigationFrame-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/tools-navigation-frame/ToolsNavigationFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/tools-navigation-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/tools-navigation-frame/index.html",
    title: "Tools Navigation Frame Token",
    description: "Review governed desktop right-rail values for tools navigation.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/tools-navigation-frame/contract.mjs",
    contractExport: "toolsNavigationFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/tools-navigation-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/toolsNavigationFrame.tokens.mjs",
    systemTokenExport: "toolsNavigationFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  diagnostic: {
    kind: "none",
    rule: "No diagnostic override is approved; primitive and pattern proof routes must verify desktop rail and mobile-hidden behavior.",
  },
  variants: [
    {
      id: "tools-navigation-frame-default",
      tokenName: "--tools-navigation-frame",
      value: {
        frameRole: "tools navigation frame",
        desktopPositioningModel: "fixed right rail",
        desktopRailInlineSize: "3.75rem",
        desktopRailTopOffset: "8rem",
        desktopRailBottomOffset: "0",
        desktopRailGapValue: "0.5rem",
        desktopRailPaddingBlockValue: "0.75rem",
        desktopRailPaddingInlineValue: "0.45rem",
        mobileBreakpoint: "44rem",
        mobileVisibility: "hidden",
        surfaceValue: "var(--surface-2)",
        borderValue: "0.0625rem solid var(--line)",
        shadowValue: "none",
        itemInlineSize: "2.75rem",
        itemBlockSize: "2.75rem",
        itemRadiusValue: "var(--radius-sm)",
        itemRestingBackgroundValue: "var(--surface-1)",
        itemRestingForegroundValue: "var(--ink-soft)",
        itemHoverBackgroundValue: "var(--accent-soft)",
        itemActiveBackgroundValue: "var(--accent)",
        itemActiveForegroundValue: "white",
        itemUnavailableOpacityValue: "0.56",
      },
      derivation: {
        sourceTokenName: "40-system right tool rail evidence + standard page shell frame",
        sourceValue:
          "docs/design-system/01-behavior-rule/shared/tools-navigation/ToolsNavigation-Behaviour.md",
        formulaOrMapping:
          "Right rail size, spacing, item target, active affordance, and mobile-hidden posture are lifted as the first governed tools-navigation slice.",
        renderedValue:
          "right rail 3.75rem / item 2.75rem / gap 0.5rem / top 8rem / mobile hidden below 44rem",
      },
      preview: {
        kind: "tools-navigation-frame-sample",
        sample: "Tools rail",
        background: "var(--surface-2)",
        foreground: "var(--ink)",
        border: "0.0625rem solid var(--line)",
        radius: "var(--radius-sm)",
        label: "Tools navigation",
      },
      metadata: {
        frameRole: "tools navigation frame",
        responsiveBehavior: "Desktop right rail is visible; mobile tools-navigation is hidden for this version.",
        stateModel: "resting, active, and unavailable item states are tokenized for the item primitive.",
        accessibility:
          "Token values must support named native controls, visible focus from the focus-ring token, and color-independent unavailable text in later layers.",
      },
      useCaseInstructions: [
        "Use for tools-navigation right rail and item affordance values.",
        "Do not use to invent mobile tools behavior, payload drawers, panel internals, app routing, or product action semantics.",
        "Primitive proof must show resting, active, and unavailable controls; pattern proof must show the rail hides on mobile.",
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
    desktopPositioningModel: variant.value.desktopPositioningModel,
    desktopRailInlineSize: variant.value.desktopRailInlineSize,
    desktopRailTopOffset: variant.value.desktopRailTopOffset,
    desktopRailBottomOffset: variant.value.desktopRailBottomOffset,
    desktopRailGapValue: variant.value.desktopRailGapValue,
    mobileBreakpoint: variant.value.mobileBreakpoint,
    mobileVisibility: variant.value.mobileVisibility,
    itemInlineSize: variant.value.itemInlineSize,
    itemBlockSize: variant.value.itemBlockSize,
    itemRadiusValue: variant.value.itemRadiusValue,
    itemRestingBackgroundValue: variant.value.itemRestingBackgroundValue,
    itemRestingForegroundValue: variant.value.itemRestingForegroundValue,
    itemHoverBackgroundValue: variant.value.itemHoverBackgroundValue,
    itemActiveBackgroundValue: variant.value.itemActiveBackgroundValue,
    itemActiveForegroundValue: variant.value.itemActiveForegroundValue,
    itemUnavailableOpacityValue: variant.value.itemUnavailableOpacityValue,
    surfaceValue: variant.value.surfaceValue,
    borderValue: variant.value.borderValue,
    shadowValue: variant.value.shadowValue,
    desktopRailPaddingBlockValue: variant.value.desktopRailPaddingBlockValue,
    desktopRailPaddingInlineValue: variant.value.desktopRailPaddingInlineValue,
    accessibility: variant.metadata.accessibility,
    theme: "all",
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Proof", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const toolsNavigationFrameTokenVariants = variants.map(toPageVariant);

export const toolsNavigationFrameTokenSpec = {
  contractId: toolsNavigationFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant governs the current desktop-only tools-navigation frame.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Tools",
      title: "Desktop right rail",
      variantId: "tools-navigation-frame-default",
      supportingText: "Mobile tools-navigation is intentionally hidden until a later reduced-width behavior is approved.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["desktopPositioningModel", "Desktop positioning"],
    ["desktopRailInlineSize", "Rail inline size"],
    ["desktopRailTopOffset", "Rail top offset"],
    ["desktopRailBottomOffset", "Rail bottom offset"],
    ["desktopRailGapValue", "Rail gap"],
    ["mobileBreakpoint", "Mobile breakpoint"],
    ["mobileVisibility", "Mobile visibility"],
    ["itemInlineSize", "Item width"],
    ["itemBlockSize", "Item height"],
    ["itemActiveBackgroundValue", "Active background"],
    ["itemUnavailableOpacityValue", "Unavailable opacity"],
    ["accessibility", "Accessibility"],
  ],
  variants: toolsNavigationFrameTokenVariants,
  consumerRestrictions: toolsNavigationFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Rendered proof must show desktop right rail values.",
    "Primitive proof must show resting, active, and unavailable tool controls.",
    "Pattern proof must show tools-navigation hides below the mobile breakpoint.",
  ],
};
