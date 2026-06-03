import { fieldValueTextStyleTokenSpec } from "../../02-token/field-value-text-style/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { textControlFrameTokenSpec } from "../../02-token/text-control-frame/systems/default.mjs";

const primitiveName = "search-field-control";
const allowedStates = new Set(["default", "disabled", "error"]);
const supportedThemes = new Set(["original", "dark", "desert"]);

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toAttributeString(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
    .join(" ");
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function tokenDependenciesForState(theme, state) {
  const textControlState = state === "disabled" ? "disabled" : state === "error" ? "error" : "default";
  const textControlFrame = findVariant(
    textControlFrameTokenSpec,
    (variant) => variant.id === `text-control-frame-${textControlState}`,
    `search-field-control requires the signed text-control-frame token for ${textControlState}.`,
  );
  const fieldValueTextStyle = findVariant(
    fieldValueTextStyleTokenSpec,
    (variant) => variant.id === "field-value-text-style-default",
    "search-field-control requires the signed field-value-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.theme === theme,
    `search-field-control requires the signed focus-ring token for ${theme}.`,
  );
  const minimumTarget = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "search-field-control requires the signed minimum-target-size token.",
  );

  return { fieldValueTextStyle, focusRing, minimumTarget, textControlFrame };
}

export const searchFieldControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/search-field-control/SearchFieldControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  requiredTokens: ["text-control-frame", "field-value-text-style", "focus-ring", "minimum-target-size"],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this primitive for governed search text entry inside search, filter, selection, and drawer panels.",
    "Consumers must not recreate native search input frame, focus behavior, label wiring, or state attributes locally.",
    "Consumers must not add filtering, selected grouping, async loading, count summaries, or drawer behavior inside this primitive.",
  ],
};

export function searchFieldControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `search-field-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Search";
  const state = options.state ?? "default";
  const name = options.name ?? id;
  const value = options.value ?? "";
  const placeholder = options.placeholder ?? "Search";
  const describedBy = options.describedBy ?? "";
  const autocomplete = options.autocomplete ?? "off";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");
  assertString(name, "name");
  assertString(placeholder, "placeholder");

  if (systemKey !== "default") {
    throw new RangeError(`search-field-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`search-field-control does not support theme "${theme}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`search-field-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesForState(theme, state);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    state,
    name,
    value,
    placeholder,
    ids: {
      inputId: `${id}-input`,
      labelId: `${id}-label`,
      describedBy,
    },
    tokenDependencies: {
      textControlFrame: {
        tokenName: tokens.textControlFrame.tokenName,
        variantId: tokens.textControlFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/text-control-frame/systems/default.mjs#textControlFrameTokenSpec",
      },
      fieldValueTextStyle: {
        tokenName: tokens.fieldValueTextStyle.tokenName,
        variantId: tokens.fieldValueTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/field-value-text-style/systems/default.mjs#fieldValueTextStyleTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTarget.tokenName,
        variantId: tokens.minimumTarget.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
      },
    },
    inputAttributes: {
      id: `${id}-input`,
      class: "ds-search-field-control-input ds-text-field-control-input",
      type: "search",
      name,
      value,
      placeholder,
      autocomplete,
      "aria-labelledby": `${id}-label`,
      "aria-describedby": describedBy || null,
      "aria-invalid": state === "error" ? "true" : null,
      disabled: state === "disabled" ? true : null,
      "data-search-field-control-input": "",
      "data-search-field-control-state": state,
    },
    styleVars: {
      "--primitive-text-control-background": tokens.textControlFrame.backgroundValue,
      "--primitive-text-control-foreground": tokens.textControlFrame.foregroundValue,
      "--primitive-text-control-border": tokens.textControlFrame.borderValue,
      "--primitive-text-control-radius": tokens.textControlFrame.radiusValue,
      "--primitive-text-control-padding-block": tokens.textControlFrame.paddingBlockValue,
      "--primitive-text-control-padding-inline": tokens.textControlFrame.paddingInlineValue,
      "--primitive-text-control-min-block-size": tokens.textControlFrame.minBlockSize,
      "--primitive-text-control-max-inline-size": tokens.textControlFrame.maxInlineSize,
      "--primitive-text-value-font-family": tokens.fieldValueTextStyle.fontFamilyValue,
      "--primitive-text-value-font-size": tokens.fieldValueTextStyle.fontSizeValue,
      "--primitive-text-value-font-weight": tokens.fieldValueTextStyle.fontWeightValue,
      "--primitive-text-value-line-height": tokens.fieldValueTextStyle.lineHeightValue,
      "--primitive-text-value-letter-spacing": tokens.fieldValueTextStyle.letterSpacingValue,
      "--primitive-text-control-focus-ring": tokens.focusRing.ringValue,
      "--primitive-text-control-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-text-control-target-min-width": tokens.minimumTarget.minimumWidth,
      "--primitive-text-control-target-min-height": tokens.minimumTarget.minimumHeight,
    },
    consumerRestrictions: searchFieldControlPrimitiveContract.consumerRules,
  };
}

export function renderSearchFieldControlPrimitive(options = {}) {
  const spec = searchFieldControlPrimitive(options);
  return `
    <div
      class="ds-search-field-control"
      data-search-field-control
      data-search-field-control-theme="${escapeHtml(spec.theme)}"
      data-search-field-control-state="${escapeHtml(spec.state)}"
      data-search-field-control-style="${escapeHtml(cssVarStyle(spec.styleVars))}"
    >
      <label id="${escapeHtml(spec.ids.labelId)}" class="ds-search-field-control-label" for="${escapeHtml(spec.ids.inputId)}">
        ${escapeHtml(spec.label)}
      </label>
      <input ${toAttributeString(spec.inputAttributes)} />
    </div>
  `;
}

export function attachSearchFieldControlPrimitiveController(root = document) {
  for (const searchField of root.querySelectorAll("[data-search-field-control]")) {
    if (!(searchField instanceof HTMLElement) || searchField.dataset.searchFieldControlController === "attached") {
      continue;
    }

    searchField.dataset.searchFieldControlController = "attached";
    const styleDeclaration = searchField.getAttribute("data-search-field-control-style");
    if (!styleDeclaration) {
      continue;
    }

    for (const declaration of styleDeclaration.split(";")) {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }
      const property = declaration.slice(0, separatorIndex).trim();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        searchField.style.setProperty(property, value);
      }
    }
  }
}
