import { linkDecorationTokenContract } from "../../../../layers/02-token/link-decoration/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "link-decoration",
  previewKind: "link-decoration-sample",
  variantSchema: {
    valueFields: [
      "decorationRole",
      "textDecorationLineValue",
      "textDecorationThicknessValue",
      "textUnderlineOffsetValue",
      "hoverTextDecorationLineValue",
      "colorIndependentMeaningRule",
      "layoutContext",
    ],
    metadataFields: ["decorationRole", "layoutContext", "theme", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "meaningRule"],
  },
};

const variantsInput = [
  {
    id: "link-decoration-standalone",
    tokenName: "--link-decoration-standalone",
    decorationRole: "standalone text link decoration",
    textDecorationLineValue: "underline",
    textDecorationThicknessValue: "0.08em",
    textUnderlineOffsetValue: "0.22em",
    hoverTextDecorationLineValue: "underline",
    colorIndependentMeaningRule: "Underline remains present by default and on hover/focus so link meaning is not color-only.",
    layoutContext: "standalone public brochure evidence and related navigation links",
    sample: "View supporting proof",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "brochure",
  uiFamily: "brochure-text-link-action",
  tokenType: "link-decoration",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/link-decoration/LinkDecoration-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/link-decoration/LinkDecoration-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/link-decoration",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/link-decoration/index.html",
    title: "Link Decoration Tokens",
    description: "Review governed brochure text-link underline treatment before link primitives consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/link-decoration/contract.mjs",
    contractExport: "linkDecorationTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/link-decoration/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/linkDecoration.tokens.mjs",
    systemTokenExport: "linkDecorationTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: variantsInput.map((variant) => ({
    id: variant.id,
    tokenName: variant.tokenName,
    value: {
      decorationRole: variant.decorationRole,
      textDecorationLineValue: variant.textDecorationLineValue,
      textDecorationThicknessValue: variant.textDecorationThicknessValue,
      textUnderlineOffsetValue: variant.textUnderlineOffsetValue,
      hoverTextDecorationLineValue: variant.hoverTextDecorationLineValue,
      colorIndependentMeaningRule: variant.colorIndependentMeaningRule,
      layoutContext: variant.layoutContext,
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: `${variant.textDecorationLineValue} / ${variant.textDecorationThicknessValue} / ${variant.textUnderlineOffsetValue}`,
      formulaOrMapping: "system implementation value promoted from current brochure text-link treatment",
      renderedValue: `${variant.textDecorationLineValue} ${variant.textDecorationThicknessValue} offset ${variant.textUnderlineOffsetValue}`,
    },
    preview: {
      kind: "link-decoration-sample",
      sample: variant.sample,
      background: "#fffdf8",
      foreground: "#174d54",
      decorationLine: variant.textDecorationLineValue,
      decorationThickness: variant.textDecorationThicknessValue,
      underlineOffset: variant.textUnderlineOffsetValue,
      label: variant.decorationRole,
    },
    metadata: {
      decorationRole: variant.decorationRole,
      layoutContext: variant.layoutContext,
      theme: "original",
      accessibility: "Underline treatment ensures link meaning is not exposed by color alone.",
    },
    useCaseInstructions: [
      `Use for ${variant.layoutContext}.`,
      "Do not use for buttons, tabs, selected states, inline prose links, or status indicators.",
      variant.colorIndependentMeaningRule,
    ],
  })),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.textDecorationLineValue} / ${variant.value.textDecorationThicknessValue}`,
    role: variant.value.decorationRole,
    decorationRole: variant.value.decorationRole,
    textDecorationLineValue: variant.value.textDecorationLineValue,
    textDecorationThicknessValue: variant.value.textDecorationThicknessValue,
    textUnderlineOffsetValue: variant.value.textUnderlineOffsetValue,
    hoverTextDecorationLineValue: variant.value.hoverTextDecorationLineValue,
    colorIndependentMeaningRule: variant.value.colorIndependentMeaningRule,
    layoutContext: variant.value.layoutContext,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Meaning", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const linkDecorationTokenVariants = variants.map(toPageVariant);

export const linkDecorationTokenSpec = {
  contractId: linkDecorationTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These tokens govern brochure text-link underline treatment without defining anchor behavior.",
  tokenTypeTemplate,
  summaryPanels: [{ label: "Underline", title: "Standalone link underline", variantId: "link-decoration-standalone" }],
  variantFields: [
    ["decorationRole", "Role"],
    ["textDecorationLineValue", "Decoration line"],
    ["textDecorationThicknessValue", "Thickness"],
    ["textUnderlineOffsetValue", "Underline offset"],
    ["hoverTextDecorationLineValue", "Hover decoration"],
    ["colorIndependentMeaningRule", "Meaning rule"],
    ["layoutContext", "Layout context"],
  ],
  variants: linkDecorationTokenVariants,
  consumerRestrictions: linkDecorationTokenContract.consumerRules,
  requiredEvidence: [
    "The proof route must render the standalone link underline treatment.",
    "The link primitive must consume this token with link-text-style and focus-ring tokens.",
  ],
};
