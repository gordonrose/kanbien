import { indexNavItemGapTokenContract } from "../../../../layers/02-token/index-nav-item-gap/contract.mjs";

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
  uiFamily: "index-nav-item",
  tokenType: "gap",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/index-nav-item-gap/IndexNavItemGap-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/index-nav-item-gap/IndexNavItemGap-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-item-gap",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-item-gap/index.html",
    title: "Index Nav Item Gap Token",
    description: "Review the governed internal content gap for rectangular index-navigation items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-item-gap/contract.mjs",
    contractExport: "indexNavItemGapTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavItemGap.tokens.mjs",
    systemTokenExport: "indexNavItemGapTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "index-nav-item-gap-content",
      tokenName: "--index-nav-item-content-gap",
      value: {
        gapRole: "index nav item content gap",
        lengthValue: "0.25rem",
        layoutContext: "vertical content stack inside one item",
        responsiveMapping: "same value across desktop and mobile until a density token exists",
        densityMapping: "default dense index navigation",
        wrapBehavior: "Text rows may truncate; gap must not be used to solve overflow.",
      },
      derivation: {
        sourceTokenName: "none",
        sourceValue: "0.25rem",
        formulaOrMapping: "system implementation value",
        renderedValue: "0.25rem",
      },
      preview: {
        kind: "gap-sample",
        sample: "Index item",
        gap: "0.25rem",
        background: "#ffffff",
        foreground: "#111827",
        border: "#dbe4f0",
        label: "Content gap",
      },
      metadata: {
        gapRole: "index nav item content gap",
        layoutContext: "vertical content stack",
        wrapBehavior: "truncate text rows before they overlap",
        accessibility: "Gap does not replace truncation, tooltip, or accessible-name requirements.",
      },
      useCaseInstructions: [
        "Use between stacked text rows inside a governed rectangular index-navigation item.",
        "Do not use as list gap, panel gap, card gap, page gutter, or route-local spacing.",
        "Text overflow must be handled by the consuming primitive or pattern, not by increasing gap locally.",
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

export const indexNavItemGapTokenVariants = variants.map(toPageVariant);

export const indexNavItemGapTokenSpec = {
  contractId: indexNavItemGapTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-item-gap",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This token governs the internal row gap for stacked item content.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Gap",
      title: "Stacked rows",
      variantId: "index-nav-item-gap-content",
      supportingText: "Spacing is governed separately from truncation and tooltip behavior.",
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
  variants: indexNavItemGapTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding index item content gap.",
    "This token does not approve text wrapping, truncation, tooltip behavior, or layout row count.",
  ],
  requiredEvidence: [
    "Desktop and mobile proof routes must show the content gap without horizontal overflow.",
    "The rendered proof must expose that text overflow is solved by later primitives, not by gap changes.",
  ],
};
