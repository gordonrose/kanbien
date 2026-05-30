import { dropdownListboxFrameTokenContract } from "../../../../layers/02-token/dropdown-listbox-frame/contract.mjs";
import { backgroundColorTokenVariants } from "./backgroundColor.tokens.mjs";
import { bodyRegionFrameTokenSpec } from "./bodyRegionFrame.tokens.mjs";
import { scrollbarSkinTokenSpec } from "./scrollbarSkin.tokens.mjs";

const surfaceByTheme = new Map(
  backgroundColorTokenVariants
    .filter((variant) => variant.role === "surface foundation")
    .map((variant) => [variant.theme, variant]),
);
const bodyRegionFrame = bodyRegionFrameTokenSpec.variants.find((variant) => variant.id === "body-region-frame-default");
const scrollbar = scrollbarSkinTokenSpec.variants.find((variant) => variant.id === "scrollbar-skin-primary");

if (!bodyRegionFrame || !scrollbar) {
  throw new Error("dropdown-listbox-frame requires signed body-region-frame and scrollbar-skin tokens.");
}

function surface(theme) {
  const variant = surfaceByTheme.get(theme);
  if (!variant) {
    throw new Error(`Missing background surface token for ${theme}.`);
  }
  return variant;
}

function makeVariant(theme) {
  const surfaceVariant = surface(theme);
  const backgroundValue = surfaceVariant.preview.background;
  const foregroundValue = surfaceVariant.preview.foreground;
  const borderValue = `color-mix(in srgb, ${foregroundValue} 16%, ${backgroundValue})`;

  return {
    id: `dropdown-listbox-frame-${theme}`,
    tokenName: `--dropdown-listbox-frame-${theme}`,
    value: {
      frameRole: "listbox popup frame",
      theme,
      backgroundValue,
      foregroundValue,
      borderValue,
      radiusValue: bodyRegionFrame.radiusValue,
      paddingBlockValue: "0.5rem",
      paddingInlineValue: "0.5rem",
      gapValue: "0.5rem",
      popupOffsetBlock: "0.25rem",
      desktopMaxBlockSize: "18rem",
      mobileMaxBlockSize: "min(70vh, 22rem)",
      scrollBehavior: "internal block-axis scroll when option content exceeds max block size",
      scrollbarSkinTokenName: scrollbar.tokenName,
      scrollbarWidthValue: scrollbar.scrollbarWidthValue,
      scrollbarThumbValue: scrollbar.scrollbarThumbValue,
      scrollbarTrackValue: scrollbar.scrollbarTrackValue,
      scrollbarRadiusValue: scrollbar.scrollbarRadiusValue,
    },
    derivation: {
      sourceTokenName: `${surfaceVariant.tokenName} + ${bodyRegionFrame.tokenName} + ${scrollbar.tokenName}`,
      sourceValue: `${backgroundValue} + ${bodyRegionFrame.radiusValue} + ${scrollbar.tokenValue}`,
      formulaOrMapping:
        "surface and foreground derive from background-color; radius derives from body-region-frame; scrollbar skin derives from scrollbar-skin; popup offset, padding, gap, and max heights are dropdown-listbox-frame values",
      renderedValue: `${backgroundValue} / ${foregroundValue} / ${borderValue} / ${bodyRegionFrame.radiusValue} radius / 18rem desktop max / min(70vh, 22rem) mobile max`,
    },
    preview: {
      kind: "scrollbar-sample",
      sample: "Dropdown options",
      background: backgroundValue,
      foreground: foregroundValue,
      border: borderValue,
      thumb: scrollbar.scrollbarThumbValue,
      track: scrollbar.scrollbarTrackValue,
      width: scrollbar.scrollbarWidthValue,
      radius: scrollbar.scrollbarRadiusValue,
      label: `${theme} dropdown listbox frame`,
    },
    metadata: {
      frameRole: "listbox popup frame",
      theme,
      accessibility:
        "Internal listbox scrolling must keep all options reachable by pointer, wheel, touch, and keyboard focus movement.",
    },
    useCaseInstructions: [
      "Use for simple dropdown listbox popup frame values.",
      "Do not use for drawers, command palettes, long searchable menus, page panels, or arbitrary cards.",
      "Pair with simple-dropdown-control primitive semantics and option frame tokens.",
    ],
  };
}

export const tokenTypeTemplate = {
  schema: "kanbien.designSystem.tokenTypeTemplate.v1",
  tokenType: "dropdown-listbox-frame",
  previewKind: "scrollbar-sample",
};

export const tokenDefinitionV1 = {
  schema: "kanbien.designSystem.tokenDefinition.v1",
  contractScope: "shared",
  designSystem: "default",
  uiFamily: "simple-dropdown",
  tokenType: "dropdown-listbox-frame",
  status: "review-ready",
  behaviorRulePath: "docs/design-system/01-behavior-rule/shared/simple-dropdown/SimpleDropdown-Behaviour.md",
  tokenContractPath: "docs/design-system/02-token/shared/dropdown-listbox-frame/DropdownListboxFrame-Contract.md",
  tokenDefinitionPath: "docs/design-system/02-token/systems/default/dropdown-listbox-frame/DropdownListboxFrame-Implementation.md",
  page: {
    route: "/design-system/default/tokens/dropdown-listbox-frame",
    htmlPath: "src/frontend/designSystem/systems/default/tokens/dropdown-listbox-frame/index.html",
    title: "Dropdown Listbox Frame Token",
    description: "Review simple dropdown popup/listbox frame, max-height, scroll, and theme values.",
  },
  codeSeam: {
    contractModule: "src/frontend/designSystem/layers/02-token/dropdown-listbox-frame/contract.mjs",
    contractExport: "dropdownListboxFrameTokenContract",
    governedRuntimeModule: "src/frontend/designSystem/layers/02-token/dropdown-listbox-frame/systems/default.mjs",
    systemProofModule: "src/frontend/designSystem/systems/default/tokens/proofs/dropdownListboxFrame.tokens.mjs",
    systemTokenExport: "dropdownListboxFrameTokenSpec",
    rendererModule: "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs",
    rendererExport: "renderTokenSpecPage",
    allowedConsumers: ["03-primitive"],
  },
  variants: ["original", "dark", "desert"].map((theme) => makeVariant(theme)),
};

export const variants = tokenDefinitionV1.variants;

function toPageVariant(variant) {
  return {
    id: variant.id,
    tokenName: variant.tokenName,
    tokenValue: variant.derivation.renderedValue,
    ...variant.value,
    sourceTokenName: variant.derivation.sourceTokenName,
    sourceValue: variant.derivation.sourceValue,
    formulaOrMapping: variant.derivation.formulaOrMapping,
    theme: variant.value.theme,
    accessibility: variant.metadata.accessibility,
    preview: variant.preview,
    usage: [
      { label: "Allowed", text: variant.useCaseInstructions[0] },
      { label: "Denied", text: variant.useCaseInstructions[1] },
      { label: "Pairing", text: variant.useCaseInstructions[2] },
    ],
  };
}

export const dropdownListboxFrameTokenVariants = variants.map(toPageVariant);

export const dropdownListboxFrameTokenSpec = {
  contractId: dropdownListboxFrameTokenContract.contractId,
  systemKey: tokenDefinitionV1.designSystem,
  tokenType: "dropdown-listbox-frame",
  title: tokenDefinitionV1.page.title,
  description: tokenDefinitionV1.page.description,
  variantSectionDescription: "These variants govern simple dropdown listbox popup frame values across theme.",
  tokenTypeTemplate,
  summaryPanels: [
    {
      label: "Original",
      title: "Original popup frame",
      variantId: "dropdown-listbox-frame-original",
      supportingText: "Popup frame surface, max height, scroll skin, and offset are signed before primitive consumption.",
    },
    {
      label: "Dark",
      title: "Dark popup frame",
      variantId: "dropdown-listbox-frame-dark",
    },
    {
      label: "Desert",
      title: "Desert popup frame",
      variantId: "dropdown-listbox-frame-desert",
    },
  ],
  variantFields: [
    ["frameRole", "Role"],
    ["theme", "Theme"],
    ["backgroundValue", "Background"],
    ["foregroundValue", "Foreground"],
    ["borderValue", "Border"],
    ["radiusValue", "Radius"],
    ["paddingBlockValue", "Padding block"],
    ["paddingInlineValue", "Padding inline"],
    ["gapValue", "Gap"],
    ["popupOffsetBlock", "Popup offset"],
    ["desktopMaxBlockSize", "Desktop max height"],
    ["mobileMaxBlockSize", "Mobile max height"],
    ["scrollBehavior", "Scroll behavior"],
    ["scrollbarSkinTokenName", "Scrollbar skin"],
    ["sourceTokenName", "Source token"],
    ["formulaOrMapping", "Formula"],
  ],
  variants: dropdownListboxFrameTokenVariants,
  consumerRestrictions: dropdownListboxFrameTokenContract.consumerRules,
  requiredEvidence: [
    "Rendered token proof shows original, dark, and desert popup frame variants.",
    "Primitive proof consumes max-height and scrollbar values through this token seam.",
    "Browser verification confirms long popup options remain reachable without horizontal overflow.",
  ],
};
