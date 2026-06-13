import { indexNavPanelFrameTokenContract } from "../../../../layers/02-token/index-nav-panel-frame/contract.mjs";
import { panelCornerRadiusTokenSpec } from "./panelCornerRadius.tokens.mjs";

const flushPanelRadius = panelCornerRadiusTokenSpec.variants.find(
  (variant) => variant.id === "panel-corner-radius-flush",
);

if (!flushPanelRadius) {
  throw new Error("index-nav-panel-frame requires the signed panel-corner-radius-flush token.");
}

const themeSurfaces = {
  original: {
    suffix: "default",
    labelPrefix: "",
    panelTokenName: "--index-nav-panel-frame",
    headerTokenName: "--index-nav-panel-header-frame",
    actionTokenName: "--index-nav-panel-action-frame",
    backgroundValue: "#ffffff",
    foregroundValue: "#111827",
    borderValue: "#dbe4f0",
    actionBackgroundValue: "color-mix(in srgb, #4f46e5 10%, #ffffff)",
    actionForegroundValue: "#312e81",
    actionBorderValue: "color-mix(in srgb, #4f46e5 28%, #dbe4f0)",
  },
  dark: {
    suffix: "dark",
    labelPrefix: "Dark ",
    panelTokenName: "--index-nav-panel-frame-dark",
    headerTokenName: "--index-nav-panel-header-frame-dark",
    actionTokenName: "--index-nav-panel-action-frame-dark",
    backgroundValue: "#171b22",
    foregroundValue: "#f4f7fb",
    borderValue: "#303845",
    actionBackgroundValue: "color-mix(in srgb, #818cf8 18%, #171b22)",
    actionForegroundValue: "#f4f7fb",
    actionBorderValue: "color-mix(in srgb, #818cf8 36%, #303845)",
  },
  desert: {
    suffix: "desert",
    labelPrefix: "Desert ",
    panelTokenName: "--index-nav-panel-frame-desert",
    headerTokenName: "--index-nav-panel-header-frame-desert",
    actionTokenName: "--index-nav-panel-action-frame-desert",
    backgroundValue: "#fffaf0",
    foregroundValue: "#493327",
    borderValue: "#ead8be",
    actionBackgroundValue: "color-mix(in srgb, #a38b5f 16%, #fffaf0)",
    actionForegroundValue: "#493327",
    actionBorderValue: "color-mix(in srgb, #a38b5f 36%, #ead8be)",
  },
};

function variantId(baseId, theme) {
  return theme === "original" ? `${baseId}-default` : `${baseId}-${theme}`;
}

function panelFrameVariant(theme) {
  const surface = themeSurfaces[theme];
  return {
    id: variantId("index-nav-panel-frame", theme),
    tokenName: surface.panelTokenName,
    value: {
      frameRole: "panel frame",
      backgroundValue: surface.backgroundValue,
      foregroundValue: surface.foregroundValue,
      borderValue: surface.borderValue,
      radiusValue: flushPanelRadius.radiusValue,
      paddingBlockValue: "0.5rem",
      paddingInlineValue: "0.5rem",
      gapValue: "0.75rem",
      minInlineSize: "10rem",
      standardInlineSize: "13rem",
      doubleInlineSize: "26rem",
      maxInlineSize: "32rem",
      mobileInlineSize: "100vw",
      mobileBreakpointValue: "44rem",
      maxBlockSize: "32rem",
      scrollBehavior: "desktop panel owns internal list scrolling; mobile panel expands to screen width and scrolls with page",
    },
    derivation: {
      sourceTokenName: flushPanelRadius.tokenName,
      sourceValue: `${flushPanelRadius.radiusValue}; ${theme} index-nav surface values`,
      formulaOrMapping: "panel radius derives from the signed flush panel corner token; width, padding, surface, and scroll values remain index-nav panel frame decisions mapped per supported theme",
      renderedValue: "10rem min / 13rem standard / 26rem double / 32rem max / 100vw below 44rem",
    },
    preview: {
      kind: "surface-card",
      sample: "Index panel",
      background: surface.backgroundValue,
      foreground: surface.foregroundValue,
      border: surface.borderValue,
      radius: flushPanelRadius.radiusValue,
      label: `${surface.labelPrefix}panel frame`,
    },
    metadata: {
      frameRole: "panel frame",
      responsiveBehavior: "resizable desktop width between min and max limits; single width, optional double width, and mobile full-screen inline size below the governed mobile breakpoint",
      scrollBehavior: "desktop scroll region is internal; mobile uses document scroll",
      theme,
      accessibility: "Scroll ownership must not trap keyboard focus or hide list items from normal navigation.",
    },
    useCaseInstructions: [
      "Use for the index-nav panel container around one or two index lists.",
      "Do not use for item surfaces, cards, page shells, or app-local sidebars.",
      "Mobile full-screen behavior belongs to the panel pattern using this token, not to the list pattern.",
    ],
  };
}

function headerFrameVariant(theme) {
  const surface = themeSurfaces[theme];
  return {
    id: variantId("index-nav-panel-header", theme),
    tokenName: surface.headerTokenName,
    value: {
      frameRole: "panel header",
      backgroundValue: "inherit",
      foregroundValue: "inherit",
      borderValue: surface.borderValue,
      radiusValue: "0",
      paddingBlockValue: "0",
      paddingInlineValue: "0",
      gapValue: "0.75rem",
      minInlineSize: "0",
      standardInlineSize: "auto",
      doubleInlineSize: "auto",
      maxInlineSize: "100%",
      mobileInlineSize: "100%",
      mobileBreakpointValue: "44rem",
      maxBlockSize: "none",
      blockSize: "3.25rem",
      minBlockSize: "3.25rem",
      maxBlockSizeValue: "3.25rem",
      stickyInsetBlockStart: "0",
      scrollBehavior: "header remains fixed-height and sticky at the top of the panel scroll context",
    },
    derivation: {
      sourceTokenName: "minimum-target-size + index-nav-panel-frame",
      sourceValue: `2.75rem interactive target height; ${surface.borderValue} ${theme} panel border`,
      formulaOrMapping: "minimum target height plus 0.25rem block breathing room on each side; separator inherits the same-theme panel border value",
      renderedValue: "3.25rem fixed header height with panel-border separator",
    },
    preview: {
      kind: "surface-card",
      sample: "Primary index",
      background: surface.backgroundValue,
      foreground: surface.foregroundValue,
      border: surface.borderValue,
      label: `${surface.labelPrefix}panel header`,
    },
    metadata: {
      frameRole: "panel header",
      responsiveBehavior: "fixed block size across item counts and viewport modes; sticky within the panel scroll context",
      scrollBehavior: "sticky header belongs to the panel header primitive; scrollbar appearance remains browser-native unless a future scrollbar token is signed",
      theme,
      accessibility: "Header height must not reduce the icon button target below the signed minimum target size.",
    },
    useCaseInstructions: [
      "Use for index-nav panel header height, title/action alignment, and sticky top inset.",
      "Do not use for list items, page headers, app-local sidebars, or arbitrary toolbar rows.",
      "Pair with the governed icon-button primitive when an add action is present.",
    ],
  };
}

function actionFrameVariant(theme) {
  const surface = themeSurfaces[theme];
  return {
    id: variantId("index-nav-panel-action", theme),
    tokenName: surface.actionTokenName,
    value: {
      frameRole: "panel action",
      backgroundValue: surface.actionBackgroundValue,
      foregroundValue: surface.actionForegroundValue,
      borderValue: surface.actionBorderValue,
      radiusValue: "0.375rem",
      paddingBlockValue: "0.35rem",
      paddingInlineValue: "0.55rem",
      gapValue: "0.25rem",
      minInlineSize: "auto",
      standardInlineSize: "auto",
      doubleInlineSize: "auto",
      maxInlineSize: "auto",
      mobileInlineSize: "auto",
      mobileBreakpointValue: "not applicable",
      maxBlockSize: "none",
      scrollBehavior: "not applicable to action control",
    },
    derivation: {
      sourceTokenName: "primary-color-source + index-nav-panel-frame",
      sourceValue: `${theme} action tint over ${surface.backgroundValue}`,
      formulaOrMapping: "primary source mixed into the same-theme panel surface and border",
      renderedValue: "tinted action surface",
    },
    preview: {
      kind: "surface-card",
      sample: "Add",
      background: surface.actionBackgroundValue,
      foreground: surface.actionForegroundValue,
      border: surface.actionBorderValue,
      label: `${surface.labelPrefix}panel action`,
    },
    metadata: {
      frameRole: "panel action",
      responsiveBehavior: "uses target-size primitive sizing rather than panel width",
      scrollBehavior: "not applicable",
      theme,
      accessibility: "Action contrast and focus visibility must be verified in the consuming primitive.",
    },
    useCaseInstructions: [
      "Use for the index-nav add action frame.",
      "Do not use for destructive, navigation, or item-current state actions.",
      "Pair with minimum-target-size and focus-ring in the action primitive.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "index-nav-panel-frame",
  previewKind: "surface-card",
  variantSchema: {
    valueFields: [
      "frameRole",
      "backgroundValue",
      "foregroundValue",
      "borderValue",
      "radiusValue",
      "paddingBlockValue",
      "paddingInlineValue",
      "gapValue",
      "minInlineSize",
      "standardInlineSize",
      "doubleInlineSize",
      "maxInlineSize",
      "mobileInlineSize",
      "mobileBreakpointValue",
      "maxBlockSize",
      "blockSize",
      "minBlockSize",
      "maxBlockSizeValue",
      "stickyInsetBlockStart",
      "scrollBehavior",
    ],
    metadataFields: ["frameRole", "responsiveBehavior", "scrollBehavior", "accessibility"],
    useCaseInstructionFields: ["allowedUse", "forbiddenUse", "responsiveBehavior"],
  },
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "index-nav",
  tokenType: "index-nav-panel-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/index-nav-panel-frame/IndexNavPanelFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/index-nav-panel-frame/IndexNavPanelFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/index-nav-panel-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/index-nav-panel-frame/index.html",
    title: "Index Nav Panel Frame Token",
    description: "Review governed panel container, scroll, and add-action frame values for index navigation.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/index-nav-panel-frame/contract.mjs",
    contractExport: "indexNavPanelFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/indexNavPanelFrame.tokens.mjs",
    systemTokenExport: "indexNavPanelFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive", "04-pattern-contract"],
  },
  variants: ["original", "dark", "desert"].flatMap((theme) => [
    panelFrameVariant(theme),
    headerFrameVariant(theme),
    actionFrameVariant(theme),
  ]),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    frameRole: variant.value.frameRole,
    backgroundValue: variant.value.backgroundValue,
    foregroundValue: variant.value.foregroundValue,
    borderValue: variant.value.borderValue,
    radiusValue: variant.value.radiusValue,
    paddingBlockValue: variant.value.paddingBlockValue,
    paddingInlineValue: variant.value.paddingInlineValue,
    gapValue: variant.value.gapValue,
    minInlineSize: variant.value.minInlineSize,
    standardInlineSize: variant.value.standardInlineSize,
    doubleInlineSize: variant.value.doubleInlineSize,
    maxInlineSize: variant.value.maxInlineSize,
    mobileInlineSize: variant.value.mobileInlineSize,
    mobileBreakpointValue: variant.value.mobileBreakpointValue,
    maxBlockSize: variant.value.maxBlockSize,
    blockSize: variant.value.blockSize,
    minBlockSize: variant.value.minBlockSize,
    maxBlockSizeValue: variant.value.maxBlockSizeValue,
    stickyInsetBlockStart: variant.value.stickyInsetBlockStart,
    scrollBehavior: variant.value.scrollBehavior,
    sourceTokenName: variant.derivation.sourceTokenName,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.metadata.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Responsive", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const indexNavPanelFrameTokenVariants = variants.map(toPageVariant);

export const indexNavPanelFrameTokenSpec = {
  contractId: indexNavPanelFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "index-nav-panel-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These variants govern the index-nav panel frame, header frame, and add-action frame.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Panel",
      title: "Single and double width",
      variantId: "index-nav-panel-frame-default",
      supportingText: "Panel width and scroll ownership are tokenized before panel composition.",
    },
    {
      label: "Header",
      title: "Fixed sticky header",
      variantId: "index-nav-panel-header-default",
      supportingText: "Header height and sticky inset are tokenized before the panel pattern uses them.",
    },
    {
      label: "Action",
      title: "Add action frame",
      variantId: "index-nav-panel-action-default",
      supportingText: "Action appearance is tokenized before the add primitive consumes it.",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["minInlineSize", "Min width"],
    ["standardInlineSize", "Standard width"],
    ["doubleInlineSize", "Double width"],
    ["maxInlineSize", "Max width"],
    ["mobileInlineSize", "Mobile width"],
    ["mobileBreakpointValue", "Mobile breakpoint"],
    ["maxBlockSize", "Desktop max height"],
    ["blockSize", "Header height"],
    ["minBlockSize", "Header min height"],
    ["maxBlockSizeValue", "Header max height"],
    ["stickyInsetBlockStart", "Sticky top"],
    ["scrollBehavior", "Scroll behavior"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula or mapping"],
  ],
  variants: indexNavPanelFrameTokenVariants,
  diagnostic: {
    kind: "inline-size-range",
    kicker: "Diagnostic override",
    label: "Review Desktop Resize Limits",
    description: "Drag within the signed minimum and maximum panel widths. This changes only the rendered review sample.",
    inputLabel: "Panel width",
    sourceVariantId: "index-nav-panel-frame-default",
    minField: "minInlineSize",
    maxField: "maxInlineSize",
    defaultField: "standardInlineSize",
    previewLabel: "Resizable panel preview",
    statusPrefix: "Rendered review width",
  },
  consumerRestrictions: [
    "Consumers must import this token seam instead of hard-coding index-nav panel width, breakpoint, padding, surface, radius, or scroll height.",
    "The panel frame token does not approve list item behavior, route selection, or app adoption.",
    "Proof-only width controls may test single and double width, but downstream consumers must use the token variants.",
  ],
  requiredEvidence: [
    "Rendered proof must show single width, double width, and mobile full-width behavior from the governed breakpoint without horizontal overflow.",
    "Panel scroll behavior must be verified in a Layer 4 browser proof.",
    "The panel header and add action must consume this token through governed primitives before the panel pattern uses them.",
  ],
};
