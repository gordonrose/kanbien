import { subNavigationRowStructureTokenContract } from "../../../../layers/02-token/sub-navigation-row-structure/contract.mjs";

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "sub-navigation-row-structure",
  previewKind: "sub-navigation-row-structure-map",
  variantSchema: {
    valueFields: [
      "layoutRole",
      "columnCount",
      "minimumColumnInlineSize",
      "gapValue",
      "collapseBehavior",
      "lanes",
    ],
    metadataFields: ["role", "theme", "state", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "consumerBoundary"],
  },
};

const lanes = [
  {
    id: "breadcrumb",
    label: "1-7",
    startColumn: 1,
    endColumn: 8,
    minimumColumns: 3,
    purpose: "breadcrumb orientation lane",
  },
  {
    id: "gap",
    label: "8",
    startColumn: 8,
    endColumn: 9,
    minimumColumns: 0,
    purpose: "protected spacer lane between breadcrumb and search",
  },
  {
    id: "search",
    label: "9-17",
    startColumn: 9,
    endColumn: 18,
    minimumColumns: 5,
    purpose: "centered bounded search lane",
  },
  {
    id: "reserve",
    label: "18-24",
    startColumn: 18,
    endColumn: 25,
    minimumColumns: 0,
    purpose: "blank reserve lane that disappears before breadcrumb or search shrink",
  },
];

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "sub-navigation",
  tokenType: "sub-navigation-row-structure",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/sub-navigation/SubNavigation-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/sub-navigation-row-structure/SubNavigationRowStructure-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/sub-navigation-row-structure/SubNavigationRowStructure-Implementation.md",
  page: {
    route: "/design-system/default/tokens/sub-navigation-row-structure",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/sub-navigation-row-structure/index.html",
    title: "Sub Navigation Row Structure Token",
    description:
      "Review the governed 24-column breadcrumb, gap, search, and reserve lane map before sub-navigation patterns consume it.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/contract.mjs",
    contractExport: "subNavigationRowStructureTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/subNavigationRowStructure.tokens.mjs",
    systemTokenExport: "subNavigationRowStructureTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["02-token", "04-pattern-contract"],
  },
  dependencies: [
    {
      contractId: "behavior.sub-navigation",
      variantId: "breadcrumb-search-row",
      tokenName: "sub-navigation behavior rule",
      value: "breadcrumb/search coexistence without search drift",
      relationship: "derived-from",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "The lane map is signed data; proof controls must not mutate lane ids or column spans.",
  },
  variants: [
    {
      id: "sub-navigation-row-structure-default",
      tokenName: "--sub-navigation-row-structure",
      value: {
        layoutRole: "sub-navigation row structure",
        columnCount: 24,
        minimumColumnInlineSize: "2.75rem",
        gapValue: "0",
        collapseBehavior:
          "remove reserve columns 18-24 first, preserve the gap lane while possible, then alternate breadcrumb and search column reductions while deriving breadcrumb mode from breadcrumb lane pressure",
        lanes,
      },
      derivation: {
        sourceTokenName: "sub-navigation behavior rule",
        sourceValue: "breadcrumb and centered bounded search coexist across constrained widths",
        formulaOrMapping:
          "Columns 1-7 map to breadcrumb, column 8 maps to protected spacing, columns 9-17 map to search, and columns 18-24 map to reserve; reserve disappears before breadcrumb, gap, or search shrink.",
        renderedValue: "breadcrumb 1-7; gap 8; search 9-17; reserve 18-24",
      },
      preview: {
        kind: "sub-navigation-row-structure-map",
        sample: "lane map",
        background: "#ffffff",
        foreground: "#111827",
        border: "#dbe4f0",
        radius: "0",
        label: "Sub-navigation row structure",
        gap: "0",
        columnCount: 24,
        lanes,
      },
      metadata: {
        role: "sub-navigation row structure",
        theme: "all",
        state: "none",
        accessibility:
          "The token has no interactive behavior; breadcrumb and search primitives own keyboard, focus, names, and disclosure behavior.",
      },
      useCaseInstructions: [
        "Use as the structural source for sub-navigation breadcrumb/search row patterns.",
        "Do not copy route-local sub-navigation CSS into consumers.",
        "Do not use for page headers, panel headers, card headers, or product toolbars.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function formatLane(lane) {
  return `${lane.label}: ${lane.id} (${lane.startColumn}-${lane.endColumn - 1}, min ${lane.minimumColumns})`;
}

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    layoutRole: variant.value.layoutRole,
    columnCount: String(variant.value.columnCount),
    minimumColumnInlineSize: variant.value.minimumColumnInlineSize,
    gapValue: variant.value.gapValue,
    collapseBehavior: variant.value.collapseBehavior,
    lanes: variant.value.lanes.map(formatLane).join("; "),
    laneDefinitions: variant.value.lanes,
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

export const subNavigationRowStructureTokenVariants = variants.map(toPageVariant);

export const subNavigationRowStructureTokenSpec = {
  contractId: subNavigationRowStructureTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "sub-navigation-row-structure",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This variant governs the sub-navigation row lane map over a 24-column foundation.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Sub navigation",
      title: "24-column lane map",
      variantId: "sub-navigation-row-structure-default",
      supportingText: "Breadcrumb: 1-7; gap: 8; search: 9-17; reserve: 18-24.",
    },
  ],
  dependencySummary: [
    "Derived from the sub-navigation behavior rule's breadcrumb/search coexistence requirement.",
    "Later layers consume this runtime seam instead of hard-coding row geometry.",
  ],
  diagnostic: tokenDefinitionV1.diagnostic,
  variantFields: [
    ["layoutRole", "Layout role"],
    ["columnCount", "Columns"],
    ["minimumColumnInlineSize", "Minimum column width"],
    ["gapValue", "Gap"],
    ["collapseBehavior", "Collapse behavior"],
    ["lanes", "Lanes"],
    ["sourceTokenName", "Source"],
    ["formulaOrMapping", "Mapping"],
  ],
  variants: subNavigationRowStructureTokenVariants,
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding sub-navigation column spans, lane ids, or collapse order.",
    "The sub-navigation row structure token does not approve breadcrumb behavior, search behavior, component seams, or app adoption.",
    "Route evidence may be reviewed, but downstream consumers must use this signed token seam.",
  ],
  requiredEvidence: [
    "Rendered proof must show dependency identity and the full sub-navigation lane map.",
    "Layer 4 sub-navigation pattern must prove centered search and lane-pressure breadcrumb collapse.",
    "Component and app adoption remain blocked until later layer gates pass.",
  ],
};
