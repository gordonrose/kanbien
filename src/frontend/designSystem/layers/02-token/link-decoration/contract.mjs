export const linkDecorationTokenContract = {
  schema: "kanbien.designSystem.tokenContract.v1",
  contractId: "tokens.link-decoration",
  tokenType: "link-decoration",
  status: "review-ready",
  contractPath: "docs/design-system/02-token/shared/link-decoration/LinkDecoration-Contract.md",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/brochure-text-link-action/BrochureTextLinkAction-Behaviour.md",
  requiredFields: [
    "decorationRole",
    "textDecorationLineValue",
    "textDecorationThicknessValue",
    "textUnderlineOffsetValue",
    "hoverTextDecorationLineValue",
    "colorIndependentMeaningRule",
    "layoutContext",
  ],
  consumerRules: [
    "Consumers must use this token through a governed runtime seam.",
    "Consumers must not copy link underline literals into route-local or app-local CSS.",
    "Link primitives must pair this token with native anchor semantics and signed focus tokens.",
  ],
};
