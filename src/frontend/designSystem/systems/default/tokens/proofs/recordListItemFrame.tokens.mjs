import { recordListItemFrameTokenContract } from "../../../../layers/02-token/record-list-item-frame/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "record-list-item-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: recordListItemFrameTokenContract.requiredValueFields,
    metadataFields: ["frameRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "proofRequirement"],
  },
};

const themeValues = {
  original: {
    surface: "#ffffff",
    selectedSurface: "#e4f4f1",
    disabledSurface: "#f8fafc",
    foreground: "#111827",
    supporting: "#475569",
    border: "#d6deeb",
    selectedBorder: "#77c2b6",
  },
  dark: {
    surface: "#171b22",
    selectedSurface: "#123c3a",
    disabledSurface: "#111827",
    foreground: "#f4f7fb",
    supporting: "#a8b5c7",
    border: "#334155",
    selectedBorder: "#5eead4",
  },
  desert: {
    surface: "#fffaf0",
    selectedSurface: "#f0ead2",
    disabledSurface: "#f7eddc",
    foreground: "#493327",
    supporting: "#7a6652",
    border: "#decfb8",
    selectedBorder: "#a38b5f",
  },
};

function themedId(baseId, theme) {
  return theme === "original" ? baseId : `${baseId}-${theme}`;
}

function baseValue(values, frameRole, state) {
  const selected = state === "selected";
  const disabled = state === "disabled";
  return {
    frameRole,
    backgroundValue: selected ? values.selectedSurface : disabled ? values.disabledSurface : values.surface,
    foregroundValue: disabled ? values.supporting : values.foreground,
    supportingForegroundValue: values.supporting,
    borderValue: selected ? values.selectedBorder : values.border,
    radiusValue: "0.375rem",
    paddingBlockValue: "0.625rem",
    paddingInlineValue: "0.75rem",
    gapValue: "0.25rem",
    minBlockSize: "4.5rem",
    motionValue: "120ms ease",
  };
}

function variant({ id, tokenName, values, theme, frameRole, state, sample, instructions }) {
  const value = baseValue(values, frameRole, state);
  return {
    id: themedId(id, theme),
    tokenName: `${tokenName}-${theme}`,
    value,
    derivation: {
      sourceTokenName: "background-color + focus-ring",
      sourceValue: `${value.backgroundValue} / ${value.borderValue}`,
      formulaOrMapping: "record row frame values pair shared theme surfaces with list-item state geometry",
      renderedValue: `${value.minBlockSize} min block row with ${value.radiusValue} radius`,
    },
    preview: {
      kind: "surface-card",
      sample,
      background: value.backgroundValue,
      foreground: value.foregroundValue,
      border: value.borderValue,
      radius: value.radiusValue,
      label: `${frameRole} ${theme}`,
    },
    metadata: {
      frameRole,
      theme,
      state,
      accessibility: "State must also be exposed programmatically by the consuming primitive.",
    },
    useCaseInstructions: instructions,
  };
}

function variantsForTheme(theme) {
  const values = themeValues[theme];
  return [
    variant({
      id: "record-list-item-frame-row",
      tokenName: "--record-list-item-frame-row",
      values,
      theme,
      frameRole: "item row",
      state: "default",
      sample: "Northstar Operations",
      instructions: [
        "Use for enabled item rows before selection.",
        "Do not use for menu options, form cards, panels, drag/drop affordances, or drawer shells.",
        "Primitive proof must verify click and keyboard activation.",
      ],
    }),
    variant({
      id: "record-list-item-frame-selected",
      tokenName: "--record-list-item-frame-selected",
      values,
      theme,
      frameRole: "selected item row",
      state: "selected",
      sample: "Northstar Operations",
      instructions: [
        "Use for the currently selected item row.",
        "Do not add a leading vertical strip for selected rows.",
        "Primitive proof must show selected state in list context.",
      ],
    }),
    variant({
      id: "record-list-item-frame-disabled",
      tokenName: "--record-list-item-frame-disabled",
      values,
      theme,
      frameRole: "disabled item row",
      state: "disabled",
      sample: "Archived record",
      instructions: [
        "Use for unavailable rows that cannot be opened or moved.",
        "Do not use for merely unselected rows.",
        "Primitive proof must verify disabled rows do not emit open events.",
      ],
    }),
  ];
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "record-list-item",
  tokenType: "record-list-item-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/record-list-item-frame/RecordListItemFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/record-list-item-frame/RecordListItemFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/record-list-item-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/record-list-item-frame/index.html",
    title: "Record List Item Frame Token",
    description: "Review governed row, selected row, and disabled row values for reusable list items.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/record-list-item-frame/contract.mjs",
    contractExport: "recordListItemFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/record-list-item-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/recordListItemFrame.tokens.mjs",
    systemTokenExport: "recordListItemFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "tokens.background-color",
      variantId: "background-color-surface-original",
      tokenName: "--background-color-surface-original",
      value: "#ffffff",
      relationship: "paired-with",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "Primitive and pattern proofs own interaction state controls.",
  },
  variants: ["original", "dark", "desert"].flatMap(variantsForTheme),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(source) {
  return {
    id: source.id,
    tokenName: source.tokenName,
    tokenValue: source.derivation.renderedValue,
    ...source.value,
    sourceTokenName: source.derivation.sourceTokenName,
    formulaOrMapping: source.derivation.formulaOrMapping,
    state: source.metadata.state,
    theme: source.metadata.theme,
    accessibility: source.metadata.accessibility,
    metadata: source.metadata,
    usage: [
      { label: "Allowed", text: source.useCaseInstructions[0] },
      { label: "Denied", text: source.useCaseInstructions[1] },
      { label: "Proof", text: source.useCaseInstructions[2] },
    ],
    preview: source.preview,
  };
}

export const recordListItemFrameTokenSpec = {
  schema: "kanbien.designSystem.tokenSpecPage.v1",
  contractId: recordListItemFrameTokenContract.contractId,
  systemKey: "default",
  tokenType: "record-list-item-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant set governs reusable item row, selected row, and disabled row frames. Drag/drop affordances are governed separately by drag-drop-affordance-frame.",
  tokenTypeTemplate,
  variantFields: [
    ["frameRole", "Frame role"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["supportingForegroundValue", "Supporting foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Block padding"],
    ["paddingInlineValue", "Inline padding"],
    ["gapValue", "Gap"],
    ["minBlockSize", "Minimum block size"],
    ["motionValue", "Motion"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Mapping"],
  ],
  summaryPanels: [
    {
      label: "Selected",
      title: "Selected row",
      variantId: "record-list-item-frame-selected",
      supportingText: "The row uses selected surface and border; programmatic state belongs to the primitive.",
    },
  ],
  tokenDefinition: tokenDefinitionV1,
  variants: variants.map(toPageVariant),
  consumerRestrictions: recordListItemFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Unit tests prove token roles, runtime seam, and proof model.",
    "Primitive proof verifies selected and disabled row state consumption.",
    "Registry guard serves the default-system token route.",
  ],
};

export const recordListItemFrameTokenVariants = variants;
