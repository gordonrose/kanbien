import { choiceCardStateAffordanceTokenContract } from "../../../../layers/02-token/choice-card-state-affordance/contract.mjs";
import { choiceOptionFrameTokenVariants } from "./choiceOptionFrame.tokens.mjs";
import { supportingTextStyleTokenVariants } from "./supportingTextStyle.tokens.mjs";

const supportingTextStyle = supportingTextStyleTokenVariants.find((variant) => variant.id === "supporting-text-style-default");

if (!supportingTextStyle) {
  throw new Error("choice-card-state-affordance requires the signed supporting-text-style token.");
}

function choiceOptionFrame(theme, state) {
  const variant = choiceOptionFrameTokenVariants.find(
    (candidate) => candidate.theme === theme && candidate.state === state,
  );
  if (!variant) {
    throw new Error(`Missing choice-option-frame ${state} variant for ${theme}.`);
  }
  return variant;
}

const stateDefinitions = [
  {
    state: "visible",
    variant: "visible-hidden",
    glyphSemantic: "visibility-on",
    glyphDisplay: "eye",
    stateTextRole: "visible status text",
    sampleStateText: "Visible",
    sampleLabel: "Email",
    sourceFrameState: "selected",
  },
  {
    state: "hidden",
    variant: "visible-hidden",
    glyphSemantic: "visibility-off",
    glyphDisplay: "eye-off",
    stateTextRole: "hidden status text",
    sampleStateText: "Hidden",
    sampleLabel: "Owner",
    sourceFrameState: "default",
  },
  {
    state: "priority-selected",
    variant: "priority",
    glyphSemantic: "selected-check",
    glyphDisplay: "check",
    stateTextRole: "priority rank text",
    sampleStateText: "Priority 2",
    sampleLabel: "Description",
    sourceFrameState: "selected",
  },
  {
    state: "priority-not-on",
    variant: "priority",
    glyphSemantic: "not-selected-x",
    glyphDisplay: "x",
    stateTextRole: "not-on status text",
    sampleStateText: "Not on",
    sampleLabel: "Updated at",
    sourceFrameState: "default",
  },
];

function makeVariant(theme, definition) {
  const sourceFrame = choiceOptionFrame(theme, definition.sourceFrameState);
  const glyphInlineSize = "1.1rem";
  const glyphBlockSize = "1.1rem";
  const leadingInlineSize = "1.45rem";
  const trailingMinInlineSize = "4.75rem";
  const contentGapValue = sourceFrame.textGapValue;
  const glyphColorValue = sourceFrame.foregroundValue;
  const stateTextColorValue = sourceFrame.foregroundValue;

  return {
    id: `choice-card-state-affordance-${definition.state}-${theme}`,
    tokenName: `--choice-card-state-affordance-${definition.state}-${theme}`,
    value: {
      affordanceRole: "choice card state affordance",
      variant: definition.variant,
      state: definition.state,
      theme,
      glyphSemantic: definition.glyphSemantic,
      glyphDisplay: definition.glyphDisplay,
      stateTextRole: definition.stateTextRole,
      glyphInlineSize,
      glyphBlockSize,
      leadingInlineSize,
      trailingMinInlineSize,
      contentGapValue,
      glyphColorValue,
      stateTextColorValue,
      stateTextStyleTokenName: supportingTextStyle.tokenName,
    },
    derivation: {
      sourceTokenName: `${sourceFrame.tokenName} + ${supportingTextStyle.tokenName}`,
      sourceValue: `${sourceFrame.foregroundValue} + ${supportingTextStyle.tokenValue}`,
      formulaOrMapping:
        "glyph and state text inherit the signed choice-option foreground for this state; content gap derives from choice-option-frame; glyph and trailing slot dimensions are state-affordance values",
      renderedValue: `${leadingInlineSize} leading slot / ${glyphInlineSize} glyph / ${trailingMinInlineSize} trailing slot / ${contentGapValue} gap`,
    },
    preview: {
      kind: "choice-card-state-affordance-sample",
      sample: definition.sampleLabel,
      stateText: definition.sampleStateText,
      glyphSemantic: definition.glyphSemantic,
      glyphDisplay: definition.glyphDisplay,
      background: sourceFrame.backgroundValue,
      foreground: sourceFrame.foregroundValue,
      border: sourceFrame.borderValue,
      radius: sourceFrame.radiusValue,
      glyphInlineSize,
      glyphBlockSize,
      leadingInlineSize,
      trailingMinInlineSize,
      contentGapValue,
      fontFamily: supportingTextStyle.fontFamilyValue,
      fontSize: supportingTextStyle.fontSizeValue,
      fontWeight: supportingTextStyle.fontWeightValue,
      lineHeight: supportingTextStyle.lineHeightValue,
      label: `${definition.variant} ${definition.state} ${theme}`,
    },
    metadata: {
      affordanceRole: "choice card state affordance",
      variant: definition.variant,
      state: definition.state,
      theme,
      glyphSemantic: definition.glyphSemantic,
      accessibility:
        "State communication must remain color-independent through the glyph semantic and trailing state text. The primitive owns checked state, priority ranking, and accessible control semantics.",
    },
    useCaseInstructions: [
      `Use for ${definition.state} affordance slots inside governed card-list select options.`,
      "Do not use for icon buttons, navigation items, text controls, arbitrary cards, or product workflow status.",
      "Pair with choice-option-frame, choice-group-layout, focus-ring, text disclosure, and native multi-select behavior in the consuming primitive.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "choice-card-state-affordance",
  previewKind: "choice-card-state-affordance-sample",
  variantSchema: {
    valueFields: [
      "affordanceRole",
      "variant",
      "state",
      "theme",
      "glyphSemantic",
      "glyphDisplay",
      "stateTextRole",
      "glyphInlineSize",
      "glyphBlockSize",
      "leadingInlineSize",
      "trailingMinInlineSize",
      "contentGapValue",
      "glyphColorValue",
      "stateTextColorValue",
      "stateTextStyleTokenName",
    ],
    metadataFields: ["affordanceRole", "variant", "state", "theme", "glyphSemantic", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "pairingRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "card-list-select",
  tokenType: "choice-card-state-affordance",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/choice-card-state-affordance/ChoiceCardStateAffordance-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/choice-card-state-affordance/ChoiceCardStateAffordance-Implementation.md",
  page: {
    route: "/design-system/default/tokens/choice-card-state-affordance",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/choice-card-state-affordance/index.html",
    title: "Choice Card State Affordance Token",
    description:
      "Review reusable leading glyph and trailing state-text slots for multi-select choice cards.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/choice-card-state-affordance/contract.mjs",
    contractExport: "choiceCardStateAffordanceTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/choice-card-state-affordance/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/choiceCardStateAffordance.tokens.mjs",
    systemTokenExport: "choiceCardStateAffordanceTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.choice-option-frame",
      variantId: "choice-option-frame-default-* + choice-option-frame-selected-*",
      tokenName: "--choice-option-frame-*",
      value: "theme-specific card state foreground, frame gap, and frame surface",
      relationship: "derived-from",
    },
    {
      contractId: "tokens.supporting-text-style",
      variantId: supportingTextStyle.id,
      tokenName: supportingTextStyle.tokenName,
      value: supportingTextStyle.tokenValue,
      relationship: "derived-from",
    },
  ],
  variants: ["original", "dark", "desert"].flatMap((theme) =>
    stateDefinitions.map((definition) => makeVariant(theme, definition)),
  ),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    affordanceRole: variant.value.affordanceRole,
    variant: variant.value.variant,
    state: variant.value.state,
    theme: variant.value.theme,
    glyphSemantic: variant.value.glyphSemantic,
    glyphDisplay: variant.value.glyphDisplay,
    stateTextRole: variant.value.stateTextRole,
    glyphInlineSize: variant.value.glyphInlineSize,
    glyphBlockSize: variant.value.glyphBlockSize,
    leadingInlineSize: variant.value.leadingInlineSize,
    trailingMinInlineSize: variant.value.trailingMinInlineSize,
    contentGapValue: variant.value.contentGapValue,
    glyphColorValue: variant.value.glyphColorValue,
    stateTextColorValue: variant.value.stateTextColorValue,
    stateTextStyleTokenName: variant.value.stateTextStyleTokenName,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const choiceCardStateAffordanceTokenVariants = variants.map(toPageVariant);

export const choiceCardStateAffordanceTokenSpec = {
  contractId: choiceCardStateAffordanceTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "choice-card-state-affordance",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These variants govern state-affordance slots for card-list select. Selection behavior and priority ordering remain primitive-owned.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Visible/hidden",
      title: "State glyph plus status text",
      variantId: "choice-card-state-affordance-visible-original",
      supportingText: "The token signs slot geometry; the primitive owns toggling behavior.",
    },
    {
      label: "Priority",
      title: "Rank glyph plus priority text",
      variantId: "choice-card-state-affordance-priority-selected-original",
      supportingText: "Priority order is behavior, not token data.",
    },
  ],
  variantFields: [
    ["affordanceRole", "Role"],
    ["variant", "Variant"],
    ["state", "State"],
    ["theme", "Theme"],
    ["glyphSemantic", "Glyph semantic"],
    ["glyphDisplay", "Proof glyph"],
    ["stateTextRole", "State text role"],
    ["glyphInlineSize", "Glyph width"],
    ["glyphBlockSize", "Glyph height"],
    ["leadingInlineSize", "Leading slot"],
    ["trailingMinInlineSize", "Trailing slot min"],
    ["contentGapValue", "Content gap"],
    ["stateTextStyleTokenName", "State text style"],
    ["sourceTokenName", "Source tokens"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: choiceCardStateAffordanceTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding choice-card state glyph slots, trailing status widths, or state text gaps.",
    "Consumers must not treat glyph semantics as final artwork; a design-system glyph seam may supply concrete icons later.",
    "This token does not approve checkbox behavior, priority ranking, selected state mutation, focus behavior, option frame visuals, or text disclosure.",
  ],
  requiredEvidence: [
    "Rendered proof must show visible, hidden, priority-selected, and priority-not-on variants across original, dark, and desert themes.",
    "Proof must show source token identity and formulas for inherited foreground and gap values.",
    "Desktop and mobile proof must avoid horizontal overflow and visible text overlap.",
  ],
};
