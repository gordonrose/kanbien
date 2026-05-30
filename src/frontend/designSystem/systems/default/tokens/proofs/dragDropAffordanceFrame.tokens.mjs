import { dragDropAffordanceFrameTokenContract } from "../../../../layers/02-token/drag-drop-affordance-frame/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "drag-drop-affordance-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: dragDropAffordanceFrameTokenContract.requiredValueFields,
    metadataFields: ["frameRole", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "proofRequirement"],
  },
};

const themeValues = {
  original: {
    surface: "#ffffff",
    markerSurface: "#eef2ff",
    foreground: "#111827",
    supporting: "#64748b",
    border: "#d6deeb",
    accent: "#008575",
  },
  dark: {
    surface: "#171b22",
    markerSurface: "#1e2634",
    foreground: "#f4f7fb",
    supporting: "#a8b5c7",
    border: "#334155",
    accent: "#5eead4",
  },
  desert: {
    surface: "#fffaf0",
    markerSurface: "#f8efd8",
    foreground: "#493327",
    supporting: "#7a6652",
    border: "#decfb8",
    accent: "#0f766e",
  },
};

function themedId(baseId, theme) {
  return theme === "original" ? baseId : `${baseId}-${theme}`;
}

function baseValue(values, frameRole, state) {
  const marker = state === "drop-marker";
  const preview = state === "preview";
  return {
    frameRole,
    backgroundValue: marker ? values.markerSurface : values.surface,
    foregroundValue: values.foreground,
    supportingForegroundValue: values.supporting,
    borderValue: values.border,
    accentValue: values.accent,
    radiusValue: "0.375rem",
    paddingBlockValue: "0.625rem",
    paddingInlineValue: "0.75rem",
    minBlockSize: "4.5rem",
    previewElevationValue: preview ? "0 0.85rem 1.7rem rgba(15, 31, 45, 0.14)" : "none",
    markerMinBlockSize: marker ? "4.75rem" : "0",
    markerLabelValue: marker ? "Drop here" : "",
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
      formulaOrMapping: "drag/drop affordance values pair shared theme surfaces with item-reorder state geometry",
      renderedValue: `${value.frameRole} using ${value.radiusValue} radius and ${value.motionValue} motion`,
    },
    preview: {
      kind: "drag-drop-affordance-sample",
      sample,
      supportingText: frameRole,
      background: value.backgroundValue,
      foreground: value.foregroundValue,
      border: value.borderValue,
      accent: value.accentValue,
      radius: value.radiusValue,
      paddingBlock: value.paddingBlockValue,
      paddingInline: value.paddingInlineValue,
      minBlockSize: value.minBlockSize,
      markerMinBlockSize: value.markerMinBlockSize,
      markerLabel: value.markerLabelValue,
      shadow: value.previewElevationValue,
      state,
      label: `${frameRole} ${theme}`,
    },
    metadata: {
      frameRole,
      theme,
      state,
      accessibility: "Drag/drop meaning must also be exposed through primitive or pattern behavior and cannot rely on color alone.",
    },
    useCaseInstructions: instructions,
  };
}

function variantsForTheme(theme) {
  const values = themeValues[theme];
  return [
    variant({
      id: "drag-drop-affordance-frame-source",
      tokenName: "--drag-drop-affordance-frame-source",
      values,
      theme,
      frameRole: "drag source",
      state: "dragging",
      sample: "Dragging source",
      instructions: [
        "Use while an enabled draggable item is being moved.",
        "Do not use without primitive-owned drag state.",
        "Primitive proof must show source state and cleanup.",
      ],
    }),
    variant({
      id: "drag-drop-affordance-frame-preview",
      tokenName: "--drag-drop-affordance-frame-preview",
      values,
      theme,
      frameRole: "drag preview",
      state: "preview",
      sample: "Drag preview",
      instructions: [
        "Use for the temporary drag image attached to pointer drag.",
        "Do not use for persisted cards, rows, or selected states.",
        "Primitive proof must verify preview is decorative.",
      ],
    }),
    variant({
      id: "drag-drop-affordance-frame-drop-marker",
      tokenName: "--drag-drop-affordance-frame-drop-marker",
      values,
      theme,
      frameRole: "drop marker",
      state: "drop-marker",
      sample: "Drop here",
      instructions: [
        "Use for the single visible candidate drop position.",
        "Do not render multiple simultaneous markers in one reorder context.",
        "Primitive proof must verify marker placement changes with dragover.",
      ],
    }),
  ];
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "drag-drop-affordance",
  tokenType: "drag-drop-affordance-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/drag-drop-affordance-frame/DragDropAffordanceFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/drag-drop-affordance-frame/DragDropAffordanceFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/drag-drop-affordance-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/drag-drop-affordance-frame/index.html",
    title: "Drag Drop Affordance Frame Token",
    description: "Review governed drag source, drag preview, and drop-marker values for reusable reorderable item patterns.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/drag-drop-affordance-frame/contract.mjs",
    contractExport: "dragDropAffordanceFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/drag-drop-affordance-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/dragDropAffordanceFrame.tokens.mjs",
    systemTokenExport: "dragDropAffordanceFrameTokenSpec",
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

export const dragDropAffordanceFrameTokenSpec = {
  schema: "kanbien.designSystem.tokenSpecPage.v1",
  contractId: dragDropAffordanceFrameTokenContract.contractId,
  systemKey: "default",
  tokenType: "drag-drop-affordance-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "This variant set governs reusable drag source, drag preview, and drop-marker affordances for list, board, tree, and kanban patterns.",
  tokenTypeTemplate,
  variantFields: [
    ["frameRole", "Frame role"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["supportingForegroundValue", "Supporting foreground"],
    ["borderValue", "Border"],
    ["accentValue", "Accent"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Block padding"],
    ["paddingInlineValue", "Inline padding"],
    ["minBlockSize", "Minimum block size"],
    ["previewElevationValue", "Preview elevation"],
    ["markerMinBlockSize", "Marker minimum block size"],
    ["markerLabelValue", "Marker label"],
    ["motionValue", "Motion"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Mapping"],
  ],
  summaryPanels: [
    {
      label: "Source",
      title: "Drag source",
      variantId: "drag-drop-affordance-frame-source",
      supportingText: "Shows the item currently being moved; behavior belongs to the consuming primitive.",
    },
    {
      label: "Drop",
      title: "Drop marker",
      variantId: "drag-drop-affordance-frame-drop-marker",
      supportingText: "Only one marker should appear at a time inside the consuming reorder context.",
    },
  ],
  tokenDefinition: tokenDefinitionV1,
  variants: variants.map(toPageVariant),
  consumerRestrictions: dragDropAffordanceFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Unit tests prove token roles, runtime seam, and proof model.",
    "Record-list-item-control primitive consumes this token for drag/drop affordances.",
    "Registry guard serves the default-system token route.",
  ],
};

export const dragDropAffordanceFrameTokenVariants = variants;
