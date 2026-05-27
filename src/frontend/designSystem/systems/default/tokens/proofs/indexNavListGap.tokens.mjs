import { indexNavListGapTokenContract } from "../../../../layers/02-token/index-nav-list-gap/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "gap",
  previewKind: "gap-sample",
  variantSchema: {
    valueFields: ["gapRole", "lengthValue", "layoutContext", "responsiveMapping", "densityMapping", "wrapBehavior"],
    metadataFields: ["gapRole", "layoutContext", "wrapBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "wrapBehavior"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav-list",
  tokenType: "gap",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/index-nav-list-gap/IndexNavListGap-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/index-nav-list-gap/IndexNavListGap-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-list-gap",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-list-gap/index.html",
    title: "Index Nav List Gap Token",
    description: "Review governed spacing between rectangular index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-list-gap/contract.mjs",
    contractExport: "indexNavListGapTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-list-gap/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavListGap.tokens.mjs",
    systemTokenExport: "indexNavListGapTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["04-pattern-contract"],
  },
  variants: [
    {
      id: "index-nav-list-gap-default",
      tokenName: "--index-nav-list-gap",
      value: {
        gapRole: "index nav list item gap",
        lengthValue: "0.5rem",
        layoutContext: "vertical stack of governed index-nav-item patterns",
        responsiveMapping: "same value across desktop and mobile until density tokens exist",
        densityMapping: "default dense index navigation",
        wrapBehavior: "List gap must not be used to solve item overflow.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "0.5rem",
        formulaOrMapping: "system implementation value",
        renderedValue: "0.5rem",
      },
      preview: {
        kind: "gap-sample",
        sample: "Index item",
        gap: "0.5rem",
        background: "inherit",
        foreground: "inherit",
        border: "currentColor",
        label: "List item gap",
      },
      metadata: {
        gapRole: "index nav list item gap",
        layoutContext: "vertical list stack",
        wrapBehavior: "item overflow belongs to index-nav-item",
        accessibility: "Gap must preserve scannability without replacing item focus or state evidence.",
      },
      useCaseInstructions: [
        "Use between governed index-nav-item entries in a vertical index navigation list.",
        "Do not use inside one item or as page, panel, card, or app-route spacing.",
        "Item text overflow and scroll containment are separate pattern or primitive responsibilities.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.value.lengthValue,
    gapRole: variant.value.gapRole,
    lengthValue: variant.value.lengthValue,
    layoutContext: variant.value.layoutContext,
    responsiveMapping: variant.value.responsiveMapping,
    densityMapping: variant.value.densityMapping,
    wrapBehavior: variant.value.wrapBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Overflow", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const indexNavListGapTokenVariants = variants.map(toPageVariant);

export const indexNavListGapTokenSpec = {
  contractId: indexNavListGapTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-list-gap",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This token governs the spacing between rectangular index-navigation items.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "List gap",
      title: "Between items",
      variantId: "index-nav-list-gap-default",
      supportingText: "This is list composition spacing, not internal item spacing.",
    },
  ],
  variantFields: [
    ["gapRole", "Role"],
    ["lengthValue", "Length"],
    ["layoutContext", "Layout context"],
    ["responsiveMapping", "Responsive mapping"],
    ["wrapBehavior", "Wrap behavior"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: indexNavListGapTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding list row gaps.",
    "This token does not approve item internals, list padding, scrolling, or current selection behavior.",
  ],
  requiredEvidence: [
    "Desktop and mobile proof routes must show the list gap without horizontal overflow.",
    "The rendered proof must state that item overflow is not solved by list spacing.",
  ],
};
