import { pageHeaderStructureTokenContract } from "../../../../layers/02-token/page-header-structure/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "page-header-structure",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "layoutRole",
      "visibleColumnCount",
      "gapValue",
      "collapseBehavior",
      "regions",
    ],
    metadataFields: ["role", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "consumerBoundary"],
  },
};

const regions = [
  { id: "leading-control", label: "1", startColumn: 1, endColumn: 2, purpose: "single leading control region" },
  { id: "secondary-control", label: "2", startColumn: 2, endColumn: 3, purpose: "single secondary control region" },
  { id: "primary-filter", label: "3-5", startColumn: 3, endColumn: 6, purpose: "three-column grouped control region" },
  { id: "secondary-filter", label: "6-8", startColumn: 6, endColumn: 9, purpose: "three-column grouped control region" },
  { id: "context-title", label: "9-19", startColumn: 9, endColumn: 20, purpose: "primary page context region" },
  { id: "action-1", label: "20", startColumn: 20, endColumn: 21, purpose: "single action region" },
  { id: "action-2", label: "21", startColumn: 21, endColumn: 22, purpose: "single action region" },
  { id: "action-3", label: "22", startColumn: 22, endColumn: 23, purpose: "single action region" },
  { id: "action-4", label: "23", startColumn: 23, endColumn: 24, purpose: "single action region" },
  { id: "action-5", label: "24", startColumn: 24, endColumn: 25, purpose: "single action region" },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "entity-page-header",
  tokenType: "page-header-structure",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/page-header-structure/PageHeaderStructure-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/page-header-structure/PageHeaderStructure-Implementation.md",
  page: {
    route: "/design-system/default/tokens/page-header-structure",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/page-header-structure/index.html",
    title: "Page Header Structure Token",
    description: "Review the governed 24-column page-header region map before populated header patterns consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/page-header-structure/contract.mjs",
    contractExport: "pageHeaderStructureTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/page-header-structure/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/pageHeaderStructure.tokens.mjs",
    systemTokenExport: "pageHeaderStructureTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "03-primitive", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "behavior.entity-page-structure",
      variantId: "foundation-header-24-column",
      tokenName: "shared foundation header",
      value: "24 columns",
      relationship: "derived-from",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "The region map is signed data; proof controls must not mutate the region ids or column spans.",
  },
  variants: [
    {
      id: "page-header-structure-default",
      tokenName: "--page-header-structure",
      value: {
        layoutRole: "page header structure",
        visibleColumnCount: 24,
        gapValue: "0.5rem",
        collapseBehavior:
          "collapse from rendered header width by removing unavailable trailing columns while remaining visible tracks fill the inline width",
        regions,
      },
      derivation: {
        sourceTokenName: "shared foundation header",
        sourceValue: "24 columns",
        formulaOrMapping:
          "Region start and end columns map to the existing page-header proof route over the 24-column foundation header.",
        renderedValue: "1, 2, 3-5, 6-8, 9-19, 20, 21, 22, 23, 24",
      },
      preview: {
        kind: "surface-card",
        sample: "24 columns",
        background: "#ffffff",
        foreground: "#111827",
        border: "#dbe4f0",
        radius: "0",
        label: "Page header structure",
      },
      metadata: {
        role: "page header structure",
        theme: "all",
        state: "none",
        accessibility:
          "The token has no interactive behavior; later primitive and pattern layers must preserve keyboard, focus, names, status, and color-independent meaning.",
      },
      useCaseInstructions: [
        "Use as the structural source for populated page header patterns.",
        "Do not copy the legacy /design-system/tokens/page-header route CSS into consumers.",
        "Do not use for panel headers, drawer headers, card headers, or app-local toolbar rows.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function formatRegion(region) {
  return `${region.label}: ${region.id} (${region.startColumn}-${region.endColumn - 1})`;
}

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    layoutRole: variant.value.layoutRole,
    visibleColumnCount: String(variant.value.visibleColumnCount),
    gapValue: variant.value.gapValue,
    collapseBehavior: variant.value.collapseBehavior,
    regions: variant.value.regions.map(formatRegion).join("; "),
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Boundary", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const pageHeaderStructureTokenVariants = variants.map(toPageVariant);

export const pageHeaderStructureTokenSpec = {
  contractId: pageHeaderStructureTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "page-header-structure",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This variant governs the page-header region map over the shared foundation header.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Page header",
      title: "24-column region map",
      variantId: "page-header-structure-default",
      supportingText: "Regions: 1, 2, 3-5, 6-8, 9-19, and 20-24.",
    },
  ],
  dependencySummary: [
    "Derived from the entity page structure behavior lock's shared 24-column foundation header.",
    "The legacy /design-system/tokens/page-header route remains evidence; later layers consume this runtime seam.",
  ],
  diagnostic: tokenDefinitionV1.diagnostic,
  variantFields: [
    ["layoutRole", "Layout role"],
    ["visibleColumnCount", "Visible columns"],
    ["gapValue", "Gap"],
    ["collapseBehavior", "Collapse behavior"],
    ["regions", "Regions"],
    ["sourceTokenName", "Source"],
    ["formulaOrMapping", "Mapping"],
  ],
  variants: pageHeaderStructureTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding page-header column spans, region ids, or collapse semantics.",
    "The page header structure token does not approve populated title copy, badges, actions, primitive behavior, component seams, or app adoption.",
    "Legacy route evidence may be reviewed, but downstream consumers must use this signed token seam.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity and the full page-header region map.",
    "Layer 3 primitives must own any interactive controls, text disclosure, focus behavior, or status semantics before populated header patterns consume them.",
    "Layer 4 header patterns must prove constrained-width, RTL, zoom, and status behavior before app adoption.",
  ],
};
