import { minimumTargetSizeTokenContract } from "../../../../layers/02-token/minimum-target-size/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "minimum-target-size",
  previewKind: "target-size-box",
  variantSchema: {
    valueFields: [
      "inputModality",
      "minimumWidth",
      "minimumHeight",
      "exceptionRule",
      "spacingRelationship",
      "proofRequirement",
    ],
    metadataFields: ["inputModality", "minimumWidth", "minimumHeight", "exceptionRule", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "exceptionRule"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "minimum-target-size",
  tokenType: "minimum-target-size",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md",
  page: {
    route: "/design-system/default/tokens/minimum-target-size",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/minimum-target-size/index.html",
    title: "Minimum Target Size Tokens",
    description: "Review governed interactive target-size variants, metadata, and use-case rules.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/minimum-target-size/contract.mjs",
    contractExport: "minimumTargetSizeTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/minimumTargetSize.tokens.mjs",
    systemTokenExport: "minimumTargetSizeTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  variants: [
    {
      id: "target-size-interactive-all",
      tokenName: "--target-size-interactive-min",
      value: {
        inputModality: "pointer, touch, keyboard focus target",
        minimumWidth: "44px",
        minimumHeight: "44px",
        exceptionRule: "Inline text links and non-interactive visual icons are excluded; icon-only controls are not excluded.",
        spacingRelationship: "Adjacent small interactive targets should preserve at least 8px separation unless the larger hit area already prevents overlap.",
        proofRequirement: "Computed target boxes must be at least 44px by 44px in rendered proof.",
      },
      preview: {
        kind: "target-size-box",
        sample: "44 x 44",
        background: "#ffffff",
        foreground: "#0f1115",
        label: "Interactive target minimum",
      },
      metadata: {
        inputModality: "pointer, touch, keyboard focus target",
        minimumWidth: "44px",
        minimumHeight: "44px",
        exceptionRule: "Inline text links excluded; icon-only controls included.",
        accessibility: "Interactive controls must remain reachable in dense, embedded, and mobile placements.",
      },
      useCaseInstructions: [
        "Use for buttons, icon buttons, inputs, selects, toggles, region triggers, and other interactive primitives.",
        "Do not treat a smaller visual icon as the hit area for an icon-only control.",
        "Inline text links may be smaller only when their line box and surrounding text preserve normal text-link behavior.",
      ],
    },
    {
      id: "target-size-adjacent-spacing-all",
      tokenName: "--target-size-adjacent-gap-min",
      value: {
        inputModality: "touch and pointer target separation",
        minimumWidth: "8px",
        minimumHeight: "8px",
        exceptionRule: "Spacing may be internal to expanded hit areas instead of visible as external gap.",
        spacingRelationship: "Adjacent small targets should preserve at least 8px non-overlapping separation.",
        proofRequirement: "Rendered proof must show adjacent targets do not overlap their hit areas.",
      },
      preview: {
        kind: "target-size-box",
        sample: "8px gap",
        background: "#f7f8fb",
        foreground: "#20242c",
        label: "Adjacent target spacing",
      },
      metadata: {
        inputModality: "touch and pointer target separation",
        minimumWidth: "8px",
        minimumHeight: "8px",
        exceptionRule: "May be satisfied by expanded non-overlapping hit areas.",
        accessibility: "Dense controls must not create ambiguous or overlapping interactive targets.",
      },
      useCaseInstructions: [
        "Use to review dense icon-button clusters, carousel controls, resize handles, and nested record controls.",
        "Do not use as a substitute for the 44px minimum interactive target.",
        "Spacing may be invisible when non-overlapping hit areas provide the separation.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: `${variant.value.minimumWidth} / ${variant.value.minimumHeight}`,
    role: variant.id === "target-size-interactive-all" ? "interactive target" : "adjacent target spacing",
    inputModality: variant.metadata.inputModality,
    minimumWidth: variant.value.minimumWidth,
    minimumHeight: variant.value.minimumHeight,
    exceptionRule: variant.value.exceptionRule,
    spacingRelationship: variant.value.spacingRelationship,
    proofRequirement: variant.value.proofRequirement,
    theme: "all",
    state: "minimum",
    accessibility: variant.metadata.accessibility,
    preview: {
      kind: variant.preview.kind,
      background: variant.preview.background,
      foreground: variant.preview.foreground,
      label: variant.preview.label,
      sample: variant.preview.sample,
      minimumWidth: variant.value.minimumWidth,
      minimumHeight: variant.value.minimumHeight,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Exception", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const minimumTargetSizeTokenVariants = variants.map(toPageVariant);

export const minimumTargetSizeTokenSpec = {
  contractId: minimumTargetSizeTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "Each row is a reusable target-size decision with preview, metadata, and usage constraints.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Target",
      title: "44px interactive floor",
      variantId: "target-size-interactive-all",
      supportingText: "The visible shape may be smaller, but the hit area must not be.",
    },
    {
      label: "Gap",
      title: "Adjacent target separation",
      variantId: "target-size-adjacent-spacing-all",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["inputModality", "Input modality"],
    ["minimumWidth", "Minimum width"],
    ["minimumHeight", "Minimum height"],
    ["exceptionRule", "Exception rule"],
    ["spacingRelationship", "Spacing relationship"],
    ["proofRequirement", "Proof requirement"],
  ],
  variants: minimumTargetSizeTokenVariants,
  consumerRestrictions: [
    "Consumers must use this system token module instead of copying target-size literals.",
    "Primitives and patterns may consume exported variants after their own harness gates pass.",
    "App pages must not recreate these target-size decisions with local CSS.",
    "Consumers must not treat visual icon size as the interactive hit-area size.",
  ],
  requiredEvidence: [
    "Desktop and mobile proof must show target boxes at least 44px by 44px for the interactive target variant.",
    "RTL rendering must preserve target geometry and adjacent target separation.",
    "150% zoom must keep target-size labels and proof boxes readable without overlap.",
    "Dense adjacent target proof must show non-overlapping hit areas.",
  ],
};
