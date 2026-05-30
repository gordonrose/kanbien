import { choiceGroupLayoutTokenContract } from "../../../../layers/02-token/choice-group-layout/contract.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";

const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");

if (!bodyRegionFrame) {
  throw new Error("choice-group-layout requires the signed body-region-frame dependency.");
}

function makeVariant(columnCount) {
  const rowGapValue = bodyRegionFrame.gapValue;
  const columnGapValue = bodyRegionFrame.gapValue;
  const optionCollapseThresholdInlineSize = "12rem";
  const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  return {
    id: `choice-group-layout-${columnCount}-column`,
    tokenName: `--choice-group-layout-${columnCount}-column`,
    value: {
      layoutRole: "choice group layout",
      columnCount,
      gridTemplateColumns,
      rowGapValue,
      columnGapValue,
      optionCollapseThresholdInlineSize,
      maxInlineSize: "100%",
      responsiveBehavior:
        "The requested column count and collapse threshold are signed here; consuming primitives must prove any constrained-width collapse without changing option behavior.",
    },
    derivation: {
      sourceTokenName: bodyRegionFrame.tokenName,
      sourceValue: bodyRegionFrame.gapValue,
      formulaOrMapping:
        "row and column gaps derive from body-region content gap; column count and option collapse threshold are choice-group layout values",
      renderedValue: `${gridTemplateColumns} / ${rowGapValue} row gap / ${columnGapValue} column gap / ${optionCollapseThresholdInlineSize} collapse threshold`,
    },
    preview: {
      kind: "choice-grid-sample",
      sample: `${columnCount} column`,
      columnCount: String(columnCount),
      rowGap: rowGapValue,
      columnGap: columnGapValue,
      optionCollapseThresholdInlineSize,
      label: `${columnCount} column choice group`,
    },
    metadata: {
      layoutRole: "choice group layout",
      columnCount,
      responsiveBehavior:
        "Desktop may render the requested column count when enough inline space exists; mobile or narrow surfaces may collapse in the primitive proof.",
      accessibility:
        "Column layout must preserve readable option order and must not create overlap at zoom, RTL, or constrained width.",
    },
    useCaseInstructions: [
      `Use for governed choice groups requesting ${columnCount} column${columnCount === 1 ? "" : "s"}.`,
      "Do not use for page grids, panel columns, index navigation, card-list priority layout, or app-local form CSS.",
      "Pair with a choice-option-frame token and a primitive that proves responsive collapse and text disclosure.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "choice-group-layout",
  previewKind: "choice-grid-sample",
  variantSchema: {
    valueFields: [
      "layoutRole",
      "columnCount",
      "gridTemplateColumns",
      "rowGapValue",
      "columnGapValue",
      "optionCollapseThresholdInlineSize",
      "maxInlineSize",
      "responsiveBehavior",
    ],
    metadataFields: ["layoutRole", "columnCount", "responsiveBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "responsiveRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "radio-simple-select",
  tokenType: "choice-group-layout",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/choice-group-layout/ChoiceGroupLayout-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/choice-group-layout/ChoiceGroupLayout-Implementation.md",
  page: {
    route: "/design-system/default/tokens/choice-group-layout",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/choice-group-layout/index.html",
    title: "Choice Group Layout Token",
    description: "Review reusable 1-4 column choice-group layout values before radio primitives consume them.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/choice-group-layout/contract.mjs",
    contractExport: "choiceGroupLayoutTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/choice-group-layout/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/choiceGroupLayout.tokens.mjs",
    systemTokenExport: "choiceGroupLayoutTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.body-region-frame",
      variantId: bodyRegionFrame.id,
      tokenName: bodyRegionFrame.tokenName,
      value: bodyRegionFrame.gapValue,
      relationship: "derived-from",
    },
  ],
  variants: [1, 2, 3, 4].map(makeVariant),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    layoutRole: variant.value.layoutRole,
    columnCount: String(variant.value.columnCount),
    gridTemplateColumns: variant.value.gridTemplateColumns,
    rowGapValue: variant.value.rowGapValue,
    columnGapValue: variant.value.columnGapValue,
    optionCollapseThresholdInlineSize: variant.value.optionCollapseThresholdInlineSize,
    maxInlineSize: variant.value.maxInlineSize,
    responsiveBehavior: variant.value.responsiveBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Responsive", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const choiceGroupLayoutTokenVariants = variants.map(toPageVariant);

export const choiceGroupLayoutTokenSpec = {
  contractId: choiceGroupLayoutTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "choice-group-layout",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "These variants govern requested choice-group column counts and gaps. Responsive collapse belongs to the consuming primitive proof.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Columns",
      title: "1-4 column options",
      variantId: "choice-group-layout-2-column",
      supportingText: "The primitive may request a signed column count and must prove constrained-width behavior.",
    },
  ],
  variantFields: [
    ["layoutRole", "Role"],
    ["columnCount", "Columns"],
    ["gridTemplateColumns", "Grid template"],
    ["rowGapValue", "Row gap"],
    ["columnGapValue", "Column gap"],
    ["optionCollapseThresholdInlineSize", "Collapse threshold"],
    ["maxInlineSize", "Max width"],
    ["responsiveBehavior", "Responsive behavior"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: choiceGroupLayoutTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding choice-group column templates or gaps.",
    "This token does not approve option frame visuals, native radio behavior, focus behavior, selected state, or text disclosure.",
  ],
  requiredEvidence: [
    "Rendered proof must show 1, 2, 3, and 4 column variants.",
    "Desktop and mobile proof must avoid horizontal overflow and visible text overlap.",
    "Radio primitives must prove responsive collapse when requested columns cannot preserve the signed collapse threshold safely.",
  ],
};
