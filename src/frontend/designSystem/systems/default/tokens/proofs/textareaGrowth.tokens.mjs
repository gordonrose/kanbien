import { textareaGrowthTokenContract } from "../../../../layers/02-token/textarea-growth/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "textarea-growth",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "growthRole",
      "initialRows",
      "maxViewportBlockRatio",
      "maxBlockSizeValue",
      "resizeBehavior",
      "growthBehavior",
    ],
    metadataFields: ["growthRole", "responsiveBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "growthRule"],
  },
};

function makeVariant({ id, tokenName, role, rows, ratio, sample }) {
  return {
    id,
    tokenName,
    value: {
      growthRole: role,
      initialRows: String(rows),
      maxViewportBlockRatio: String(ratio),
      maxBlockSizeValue: `${ratio}vh`,
      resizeBehavior: "vertical resize is disabled; primitive-owned auto-growth handles block size until the signed cap",
      growthBehavior: "auto-grow to scrollHeight until the signed viewport cap, then preserve internal scrolling",
    },
    derivation: {
      sourceTokenName: "none",
      sourceValue: "none",
      formulaOrMapping: "system implementation value based on requested one-line, multi-line, and paragraph textarea postures",
      renderedValue: `${rows} initial rows / ${ratio}vh max block size`,
    },
    preview: {
      kind: "surface-card",
      sample,
      background: "#ffffff",
      foreground: "#111827",
      border: "#dbe4f0",
      label: role,
    },
    metadata: {
      growthRole: role,
      responsiveBehavior: "viewport-height cap changes the maximum growth height without changing label or native textarea semantics",
      accessibility: "Auto-growth must not hide content or remove keyboard access once the cap is reached.",
    },
    useCaseInstructions: [
      `Use for ${role}.`,
      "Do not use for single-line text fields, rich text editors, code editors, workflow builders, or arbitrary scroll regions.",
      "The primitive owns auto-growth; product validation and persistence remain downstream.",
    ],
  };
}

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "text-entry-control",
  tokenType: "textarea-growth",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/text-entry-control/TextEntryControl-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/textarea-growth/TextareaGrowth-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/textarea-growth/TextareaGrowth-Implementation.md",
  page: {
    route: "/design-system/default/tokens/textarea-growth",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/textarea-growth/index.html",
    title: "Textarea Growth Token",
    description: "Review governed textarea row presets and viewport growth caps.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/textarea-growth/contract.mjs",
    contractExport: "textareaGrowthTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/textarea-growth/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/textareaGrowth.tokens.mjs",
    systemTokenExport: "textareaGrowthTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  dependencies: [],
  variants: [
    makeVariant({
      id: "textarea-growth-one-line",
      tokenName: "--textarea-growth-one-line",
      role: "one-line textarea growth",
      rows: 1,
      ratio: 50,
      sample: "One line",
    }),
    makeVariant({
      id: "textarea-growth-multi-line",
      tokenName: "--textarea-growth-multi-line",
      role: "multi-line textarea growth",
      rows: 5,
      ratio: 75,
      sample: "Five lines",
    }),
    makeVariant({
      id: "textarea-growth-paragraph",
      tokenName: "--textarea-growth-paragraph",
      role: "paragraph textarea growth",
      rows: 15,
      ratio: 90,
      sample: "Paragraph",
    }),
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    growthRole: variant.value.growthRole,
    initialRows: variant.value.initialRows,
    maxViewportBlockRatio: variant.value.maxViewportBlockRatio,
    maxBlockSizeValue: variant.value.maxBlockSizeValue,
    resizeBehavior: variant.value.resizeBehavior,
    growthBehavior: variant.value.growthBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: "all",
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Growth", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const textareaGrowthTokenVariants = variants.map(toPageVariant);

export const textareaGrowthTokenSpec = {
  contractId: textareaGrowthTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "textarea-growth",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These variants govern textarea row presets and viewport growth caps.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "One line",
      title: "1 row / 50vh cap",
      variantId: "textarea-growth-one-line",
      supportingText: "Default textarea posture starts compact and grows until half viewport height.",
    },
    {
      label: "Multi",
      title: "5 rows / 75vh cap",
      variantId: "textarea-growth-multi-line",
    },
    {
      label: "Paragraph",
      title: "15 rows / 90vh cap",
      variantId: "textarea-growth-paragraph",
    },
  ],
  variantFields: [
    ["growthRole", "Role"],
    ["initialRows", "Initial rows"],
    ["maxViewportBlockRatio", "Viewport cap"],
    ["maxBlockSizeValue", "Max height"],
    ["resizeBehavior", "Resize behavior"],
    ["growthBehavior", "Growth behavior"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: textareaGrowthTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding textarea rows, max-height percentages, or resize behavior.",
    "The textarea growth token does not approve value typography, input frame styling, label/helper structure, validation, persistence, or form submission.",
  ],
  requiredEvidence: [
    "Rendered proof must show all three requested row/cap variants.",
    "Textarea primitives must consume this token before implementing auto-growth.",
  ],
};
