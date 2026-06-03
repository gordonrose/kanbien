import {
  tokenTypeTemplate as sharedBackgroundColorTokenTypeTemplate,
  tokenDefinitionV1 as defaultTokenDefinition,
} from "../../../default/tokens/proofs/backgroundColor.tokens.mjs";
import { backgroundColorTokenContract } from "../../../../layers/02-token/background-color/contract.mjs";

export const tokenTypeTemplate = sharedBackgroundColorTokenTypeTemplate;

const brochurePreviewByTheme = {
  original: {
    page: "#f6f8f3",
    surface: "#fffdf8",
    subtle: "#fbf2df",
    foreground: "#1f2933",
  },
  dark: {
    page: "#162126",
    surface: "#223139",
    subtle: "#2c4149",
    foreground: "#f8faf7",
  },
  desert: {
    page: "#f7efe1",
    surface: "#fff8ec",
    subtle: "#ead7b8",
    foreground: "#2f261d",
  },
};

function roleKeyForVariant(variant) {
  const role = variant.metadata.backgroundRole;
  if (role.includes("surface")) {
    return "surface";
  }
  if (role.includes("subtle")) {
    return "subtle";
  }
  return "page";
}

function brochureSampleForVariant(variant) {
  const theme = variant.metadata.theme;
  const role = roleKeyForVariant(variant);
  return brochurePreviewByTheme[theme]?.[role] ?? variant.preview.sample;
}

export const tokenDefinitionV1 = {
  ...defaultTokenDefinition,
  designSystem: "brochure",
  tokenDefinitionPath: "docs/design-system/02-token/systems/brochure/background-color/BackgroundColor-Implementation.md",
  page: {
    route: "/design-system/brochure/tokens/background-color",
    htmlPath: "src/frontend/designSystem/systems/brochure/tokens/background-color/index.html",
    title: "Brochure Background Color Tokens",
    description: "Review the warm public brochure surface palette consumed by the same-origin brochure pages.",
  },
  codeSeam: {
    ...defaultTokenDefinition.codeSeam,
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/background-color/systems/brochure.mjs",
    systemProofModule: "src/frontend/designSystem/systems/brochure/tokens/proofs/backgroundColor.tokens.mjs",
  },
  variants: defaultTokenDefinition.variants.map((variant) => {
    const sample = brochureSampleForVariant(variant);
    return {
      ...variant,
      preview: {
        ...variant.preview,
        sample,
        background: sample,
        foreground: brochurePreviewByTheme[variant.metadata.theme]?.foreground ?? variant.preview.foreground,
        label: variant.preview.label.replace(/^Original|^Dark|^Desert/, (theme) => `Brochure ${theme}`),
      },
      useCaseInstructions: [
        "Use for public brochure page backgrounds and editorial content surfaces.",
        variant.useCaseInstructions[1],
        "Use the brochure foreground pairings exported by this system variant.",
      ],
    };
  }),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.preview.sample,
    role: variant.metadata.backgroundRole,
    surfaceRelationship: variant.metadata.surfaceRelationship,
    mappedPaletteToken: variant.value.mappedPaletteToken,
    theme: variant.metadata.theme,
    contrastPairings: variant.value.contrastPairings,
    state: variant.metadata.state,
    accessibility: variant.metadata.accessibility,
    preview: {
      background: variant.preview.background,
      foreground: variant.preview.foreground,
      label: variant.preview.label,
    },
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Foregrounds", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const backgroundColorTokenVariants = variants.map(toPageVariant);

export const backgroundColorTokenSpec = {
  contractId: backgroundColorTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: tokenDefinitionV1.tokenType,
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "Brochure background tokens preserve the shared roles while carrying the public editorial palette.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Page",
      title: "Warm public foundation",
      variantId: "background-page-original",
      supportingText: "The brochure page sits on a lightly tinted green-gray foundation.",
    },
    {
      label: "Surface",
      title: "Editorial panel",
      variantId: "background-surface-original",
    },
    {
      label: "Subtle",
      title: "Warm supporting band",
      variantId: "background-subtle-original",
    },
  ],
  variantFields: [
    ["role", "Role"],
    ["surfaceRelationship", "Surface relationship"],
    ["mappedPaletteToken", "Mapped palette token"],
    ["theme", "Theme"],
    ["contrastPairings", "Contrast pairings"],
    ["state", "State"],
  ],
  variants: backgroundColorTokenVariants,
  consumerRestrictions: [
    "Public brochure pages must consume this brochure system asset seam instead of owning local presentation assets.",
    "Default product design-system work must not inherit the brochure palette unless a separate system decision approves it.",
    "App pages must not recreate these background decisions with page-local CSS.",
  ],
  requiredEvidence: [
    "Brochure pages and the brochure system root must render with the same warm public identity.",
    "Mobile pipeline controls must remain readable on the brochure page foundation.",
    "The variant must preserve shared background-color token roles for future downstream primitives and patterns.",
  ],
};
