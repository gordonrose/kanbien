import { topNavigationBaseTokensContract } from "../../../../layers/02-token/top-navigation-base-tokens/contract.mjs";

const mapped41TokenSeams = [
  "background-color: page, surface, and subtle foundations",
  "primary-color-source: primary source values for later derivations",
  "primary-tinted-background: low-emphasis primary-tinted surfaces",
  "primary-tinted-foreground: foreground on primary-tinted surfaces",
  "focus-ring: visible focus rings",
  "button-frame: governed button/icon-button frame values where child controls need them",
  "panel-frame: generic floating/panel shell values where top-nav menus can prove compatibility",
  "panel-corner-radius: flush panel radius only where flush panel composition is intended",
];

const missing41TokenSeams = [
  "resolved by top-navigation-frame: shell surface role",
  "resolved by top-navigation-frame: neutral foreground/text role",
  "resolved by top-navigation-frame: border/separator role",
  "resolved by top-navigation-frame: active/current navigation state role",
  "resolved by top-navigation-frame: floating menu elevation role",
  "resolved by top-navigation-frame: non-flush control/menu radius role",
];

const retired40VariableGroups = [
  "--surface-*",
  "--ink*",
  "--line*",
  "--accent*",
  "--shadow*",
  "--radius*",
];

const localOnlyDecisions = [
  "brand mark size",
  "overflow measurement",
  "2 items plus More threshold",
  "breakpoint thresholds",
  "header grid geometry",
];

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "top-navigation-base-tokens",
  previewKind: "top-navigation-base-tokens-sample",
  variantSchema: {
    valueFields: topNavigationBaseTokensContract.valueFields,
    metadataFields: topNavigationBaseTokensContract.metadataFields,
    useCaseInstructionFields: topNavigationBaseTokensContract.useCaseInstructionFields,
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "top-navigation",
  tokenType: "top-navigation-base-tokens",
  status: "blocked",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/top-navigation/TopNavigation-Behaviour.md",
  tokenContractPath:
    "docs/design-system/02-token/shared/top-navigation-base-tokens/TopNavigationBaseTokens-Contract.md",
  tokenDefinitionPath:
    "docs/design-system/02-token/systems/default/top-navigation-base-tokens/TopNavigationBaseTokens-Implementation.md",
  page: {
    route: "/design-system/default/tokens/top-navigation-base-tokens",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/top-navigation-base-tokens/index.html",
    title: "Top Navigation 41 Token Inventory",
    description:
      "Review which top-navigation visual decisions map to existing 41 tokens and which token seams are still missing.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/contract.mjs",
    contractExport: "topNavigationBaseTokensContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/topNavigationBaseTokens.tokens.mjs",
    systemTokenExport: "topNavigationBaseTokensSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: [],
  },
  dependencies: [
    {
      contractId: "tokens.background-color",
      variantId: "background-*-*",
      tokenName: "--background-*-*",
      value: "mapped existing 41 surface foundation roles",
      relationship: "candidate-mapping",
    },
    {
      contractId: "tokens.primary-color-source / tokens.primary-tinted-background / tokens.primary-tinted-foreground",
      variantId: "theme-specific primary derivation variants",
      tokenName: "--primary-*-*",
      value: "mapped existing 41 primary emphasis candidates",
      relationship: "candidate-mapping",
    },
    {
      contractId: "tokens.top-navigation-frame",
      variantId: "top-navigation-frame-*",
      tokenName: "--top-navigation-frame-*",
      value: "resolves top-navigation text, border, elevation, radius, and state frame roles",
      relationship: "resolved-by",
    },
  ],
  diagnostic: {
    kind: "none",
    rule: "No diagnostic override is approved; this blocked slice is an inventory and must not be consumed by later layers.",
  },
  variants: [
    {
      id: "top-navigation-base-tokens-blocked",
      tokenName: "--top-navigation-base-tokens",
      value: {
        mapped41TokenSeams,
        missing41TokenSeams,
        retired40VariableGroups,
        localOnlyDecisions,
      },
      derivation: {
        sourceTokenName: "41 token readiness index + top-nav source review",
        sourceValue:
          "docs/design-system/02-token/token-readiness-index.md; docs/workspace/design-system/token-reviews/top-nav-token-candidacy-review.md",
        formulaOrMapping:
          "Old default CSS variable groups are reference evidence only. Top navigation must consume top-navigation-frame for concrete 41 frame and state roles.",
        renderedValue: "blocked inventory: downstream work must consume top-navigation-frame",
      },
      preview: {
        kind: "top-navigation-base-tokens-sample",
        sample: "Top navigation",
        background: "#ffffff",
        foreground: "#111827",
        border: "#dbe4f0",
        radius: "0",
        label: "Blocked inventory",
      },
      metadata: {
        role: "top navigation 41-token inventory",
        theme: "all",
        state: "blocked",
        accessibility:
          "Top-navigation visual accessibility depends on primitives consuming top-navigation-frame, focus-ring, minimum-target-size, and programmatic current semantics.",
      },
      useCaseInstructions: [
        "Use this blocked route to review how top-navigation base-token gaps were resolved.",
        "Do not consume this seam in primitives, patterns, components, app pages, or proof-only CSS.",
        "Consume top-navigation-frame before top-navigation primitive or pattern work proceeds.",
      ],
    },
  ],
};

export const variants = tokenDefinitionV1.variants;

function joinTokens(tokens) {
  return tokens.join(" / ");
}

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    role: variant.metadata.role,
    mapped41TokenSeams: joinTokens(variant.value.mapped41TokenSeams),
    missing41TokenSeams: joinTokens(variant.value.missing41TokenSeams),
    retired40VariableGroups: joinTokens(variant.value.retired40VariableGroups),
    localOnlyDecisions: joinTokens(variant.value.localOnlyDecisions),
    accessibility: variant.metadata.accessibility,
    theme: variant.metadata.theme,
    state: variant.metadata.state,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Blocker", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const topNavigationBaseTokenVariants = variants.map(toPageVariant);

export const topNavigationBaseTokensSpec = {
  contractId: topNavigationBaseTokensContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription:
    "This route is blocked: it inventories 41 token coverage for top navigation and points downstream work to top-navigation-frame.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Blocked",
      title: "41 token inventory",
      variantId: "top-navigation-base-tokens-blocked",
      supportingText: "Old design-system CSS variables are reference material only, not a consumable 41 token seam.",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["mapped41TokenSeams", "Mapped 41 seams"],
    ["missing41TokenSeams", "Resolved 41 seams"],
    ["retired40VariableGroups", "Retired 40 groups"],
    ["localOnlyDecisions", "Local-only boundary"],
    ["sourceValue", "Source review"],
    ["accessibility", "Accessibility"],
  ],
  variants: topNavigationBaseTokenVariants,
  consumerRestrictions: topNavigationBaseTokensContract.consumerRules,
  requiredEvidence: [
    "Rendered proof must show that this top-navigation token inventory is blocked.",
    "Unit proof must assert that old 40 CSS variable groups are retired reference material, not consumable token dependencies.",
    "Top-navigation primitive and pattern work must consume top-navigation-frame for frame and state values.",
  ],
};
