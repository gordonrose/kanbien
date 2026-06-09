import { backgroundColorTokenSpec } from "../../02-token/background-color/systems/default.mjs";
import { bodyRegionFrameTokenSpec } from "../../02-token/body-region-frame/systems/default.mjs";
import { feedbackTextStyleTokenSpec } from "../../02-token/feedback-text-style/systems/default.mjs";
import {
  attachCardListSelectPrimitiveController,
  renderCardListSelectPrimitive,
} from "../../03-primitive/card-list-select/index.mjs";
import {
  attachScrollRegionControlPrimitiveController,
  renderScrollRegionControlPrimitive,
  scrollRegionControlPrimitive,
} from "../../03-primitive/scroll-region-control/index.mjs";
import {
  attachSearchFieldControlPrimitiveController,
  renderSearchFieldControlPrimitive,
  searchFieldControlPrimitive,
} from "../../03-primitive/search-field-control/index.mjs";

const patternName = "searchable-selection-panel";
const supportedThemes = new Set(["original", "dark", "desert"]);
const allowedModes = new Set(["single", "multi"]);
const allowedStates = new Set(["default", "loading", "empty", "no-match", "error"]);
const attachedControllerRoots = new WeakSet();

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

function bodyRegionFrameVariant() {
  const variant = bodyRegionFrameTokenSpec.variants.find((candidate) => candidate.id === "body-region-frame-default");
  if (!variant) {
    throw new RangeError("searchable-selection-panel requires the signed body-region-frame token.");
  }
  return variant;
}

function backgroundSurfaceVariant(theme) {
  const variant = backgroundColorTokenSpec.variants.find(
    (candidate) => candidate.theme === theme && candidate.role === "surface foundation",
  );
  if (!variant) {
    throw new RangeError(`searchable-selection-panel requires a signed ${theme} background-color surface token.`);
  }
  return variant;
}

function feedbackToneForState(state) {
  if (state === "error") {
    return "error";
  }
  return "neutral";
}

function feedbackTextStyleVariant(theme, state) {
  const tone = feedbackToneForState(state);
  const variant = feedbackTextStyleTokenSpec.variants.find(
    (candidate) => candidate.theme === theme && candidate.feedbackTone === tone,
  );
  if (!variant) {
    throw new RangeError(`searchable-selection-panel requires a signed ${theme} ${tone} feedback-text-style token.`);
  }
  return variant;
}

function normalizeOptions(options) {
  const rawOptions = Array.isArray(options) ? options : [];
  return rawOptions.map((option, index) => {
    const value = option?.value ?? `option-${index + 1}`;
    const label = option?.label ?? value;
    assertString(value, `options[${index}].value`);
    assertString(label, `options[${index}].label`);
    return {
      idSuffix: option.idSuffix ?? String(index + 1),
      value,
      label,
      supportingText: option.supportingText ?? "",
      disabled: Boolean(option.disabled),
    };
  });
}

function uniqueValues(values) {
  return Array.from(new Set(Array.isArray(values) ? values.filter((value) => typeof value === "string") : []));
}

function matchesQuery(option, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return true;
  }
  return [option.label, option.supportingText, option.value]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}

function selectionState({ requestedState, options, query, matchingOptions }) {
  if (requestedState !== "default") {
    return requestedState;
  }
  if (options.length === 0) {
    return "empty";
  }
  if (query.trim() && matchingOptions.length === 0) {
    return "no-match";
  }
  return "default";
}

function cardListStateForPatternState(state) {
  return state === "error" ? "error" : "default";
}

export const searchableSelectionPanelPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/searchable-selection-panel/SearchableSelectionPanel-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: [
    "search-field-control",
    "card-list-select",
    "scroll-region-control",
  ],
  directTokenDependencies: ["body-region-frame", "background-color", "feedback-text-style"],
  eventName: "searchable-selection-panel:change",
  consumerRules: [
    "Consumers must use this pattern for reusable searchable selection panels.",
    "Consumers must not recreate search input, checkbox card, scroll-region, or text-disclosure behavior locally.",
    "Consumers must not treat this pattern as drawer select, filter persistence, backend search, route state, or app adoption.",
  ],
};

export function searchableSelectionPanelPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `searchable-selection-panel-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Searchable selection";
  const searchLabel = options.searchLabel ?? "Search options";
  const searchPlaceholder = options.searchPlaceholder ?? "Search options";
  const query = String(options.query ?? "");
  const selectionMode = options.selectionMode ?? "multi";
  const requestedState = options.state ?? "default";
  const columns = Number(options.columns ?? 1);
  const mobileMode = options.mobileMode ?? "internal-scroll";
  const optionList = normalizeOptions(options.options);
  const selectedValues = uniqueValues(options.selectedValues);
  const selectedValue = typeof options.selectedValue === "string" ? options.selectedValue : selectedValues[0] ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(searchLabel, "searchLabel");
  assertString(searchPlaceholder, "searchPlaceholder");
  assertString(selectionMode, "selectionMode");
  assertString(requestedState, "state");
  assertString(mobileMode, "mobileMode");

  if (systemKey !== "default") {
    throw new RangeError(`searchable-selection-panel has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`searchable-selection-panel does not support theme "${theme}".`);
  }
  if (!allowedModes.has(selectionMode)) {
    throw new RangeError(`searchable-selection-panel does not support selectionMode "${selectionMode}".`);
  }
  if (!allowedStates.has(requestedState)) {
    throw new RangeError(`searchable-selection-panel does not support state "${requestedState}".`);
  }
  if (!Number.isInteger(columns) || columns < 1 || columns > 4) {
    throw new RangeError("searchable-selection-panel columns must be 1, 2, 3, or 4.");
  }

  const bodyFrame = bodyRegionFrameVariant();
  const surface = backgroundSurfaceVariant(theme);
  const selectedSet = new Set(selectionMode === "single" ? [selectedValue].filter(Boolean) : selectedValues);
  const selectedOptions = optionList.filter((option) => selectedSet.has(option.value));
  const unselectedOptions = optionList.filter((option) => !selectedSet.has(option.value));
  const matchingOptions = optionList.filter((option) => matchesQuery(option, query));
  const availableOptions = unselectedOptions.filter((option) => matchesQuery(option, query));
  const state = selectionState({ requestedState, options: optionList, query, matchingOptions });
  const feedbackTextStyle = feedbackTextStyleVariant(theme, state);

  const search = searchFieldControlPrimitive({
    systemKey,
    theme,
    id: `${id}-search`,
    label: searchLabel,
    name: `${id}-search`,
    value: query,
    placeholder: searchPlaceholder,
    state: state === "error" ? "error" : "default",
  });
  const scrollRegion = scrollRegionControlPrimitive({
    systemKey,
    theme,
    id: `${id}-scroll`,
    mobileMode,
    maxBlockSize: bodyFrame.desktopMaxBlockSize,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    searchLabel,
    searchPlaceholder,
    query,
    selectionMode,
    state,
    columns,
    mobileMode,
    options: optionList,
    selectedValue,
    selectedValues: Array.from(selectedSet),
    selectedOptions,
    availableOptions,
    matchingOptions,
    primitives: {
      scrollRegion,
      search,
    },
    tokenDependencies: {
      bodyRegionFrame: {
        tokenName: bodyFrame.tokenName,
        variantId: bodyFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/body-region-frame/systems/default.mjs#bodyRegionFrameTokenSpec",
      },
      backgroundColorSurface: {
        tokenName: surface.tokenName,
        variantId: surface.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec",
      },
      feedbackTextStyle: {
        tokenName: feedbackTextStyle.tokenName,
        variantId: feedbackTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/feedback-text-style/systems/default.mjs#feedbackTextStyleTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-searchable-selection-panel",
      "data-searchable-selection-panel": "",
      "data-searchable-selection-panel-mode": selectionMode,
      "data-searchable-selection-panel-state": state,
      "data-searchable-selection-panel-theme": theme,
      "data-searchable-selection-panel-query": query,
      "data-searchable-selection-panel-style": cssVarStyle({
        "--pattern-searchable-selection-background": surface.preview.background,
        "--pattern-searchable-selection-foreground": surface.preview.foreground,
        "--pattern-searchable-selection-border": bodyFrame.borderValue,
        "--pattern-searchable-selection-radius": bodyFrame.radiusValue,
        "--pattern-searchable-selection-padding-block": bodyFrame.paddingBlockValue,
        "--pattern-searchable-selection-padding-inline": bodyFrame.paddingInlineValue,
        "--pattern-searchable-selection-gap": bodyFrame.gapValue,
        "--pattern-searchable-selection-section-gap": bodyFrame.sectionGapValue,
        "--pattern-searchable-selection-min-block-size": bodyFrame.minBlockSize,
        "--pattern-searchable-selection-feedback-foreground": feedbackTextStyle.foregroundValue,
        "--pattern-searchable-selection-feedback-font-family": feedbackTextStyle.fontFamilyValue,
        "--pattern-searchable-selection-feedback-font-size": feedbackTextStyle.fontSizeValue,
        "--pattern-searchable-selection-feedback-font-weight": feedbackTextStyle.fontWeightValue,
        "--pattern-searchable-selection-feedback-line-height": feedbackTextStyle.lineHeightValue,
        "--pattern-searchable-selection-feedback-letter-spacing": feedbackTextStyle.letterSpacingValue,
        "--pattern-searchable-selection-feedback-text-transform": feedbackTextStyle.textTransform,
      }),
      role: "region",
      "aria-label": label,
    },
    consumerRestrictions: searchableSelectionPanelPatternContract.consumerRules,
  };
}

function renderStatus(spec) {
  if (spec.state === "loading") {
    return `<p class="ds-searchable-selection-panel-status" data-searchable-selection-panel-status>Loading options.</p>`;
  }
  if (spec.state === "empty") {
    return `<p class="ds-searchable-selection-panel-status" data-searchable-selection-panel-status>No options supplied.</p>`;
  }
  if (spec.state === "no-match") {
    return `<p class="ds-searchable-selection-panel-status" data-searchable-selection-panel-status>No available options match the current search.</p>`;
  }
  if (spec.state === "error") {
    return `<p class="ds-searchable-selection-panel-status" data-searchable-selection-panel-status>Options could not be loaded.</p>`;
  }
  return "";
}

function renderSelectionGroups(spec) {
  const selectedGroup = spec.selectedOptions.length
    ? `
      <section class="ds-searchable-selection-panel-section" aria-label="Selected options">
        ${renderCardListSelectPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-selected-options`,
          name: `${spec.id}-selected-options`,
          label: "Selected options",
          variant: "visibility",
          state: cardListStateForPatternState(spec.state),
          columns: spec.columns,
          affordancePresentation: "text-only",
          selectedValues: spec.selectedValues,
          options: spec.selectedOptions,
        })}
      </section>
    `
    : "";

  const availableGroup = spec.availableOptions.length
    ? `
      <section class="ds-searchable-selection-panel-section" aria-label="Available options">
        ${renderCardListSelectPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-available-options`,
          name: `${spec.id}-available-options`,
          label: "Available options",
          variant: "visibility",
          state: cardListStateForPatternState(spec.state),
          columns: spec.columns,
          affordancePresentation: "text-only",
          selectedValues: [],
          options: spec.availableOptions,
        })}
      </section>
    `
    : "";

  return `${selectedGroup}${availableGroup}`;
}

export function renderSearchableSelectionPanelPattern(options = {}) {
  const spec = searchableSelectionPanelPattern(options);
  const contentHtml = `
    ${renderStatus(spec)}
    ${renderSelectionGroups(spec)}
  `;

  return `
    <section ${toAttributeString(spec.attributes)}>
      ${renderSearchFieldControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: spec.primitives.search.id,
        label: spec.searchLabel,
        name: spec.primitives.search.name,
        value: spec.query,
        placeholder: spec.searchPlaceholder,
        state: spec.primitives.search.state,
      })}
      ${renderScrollRegionControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: spec.primitives.scrollRegion.id,
        mobileMode: spec.mobileMode,
        maxBlockSize: spec.primitives.scrollRegion.maxBlockSize,
        contentHtml,
        extraAttributes: {
          "data-searchable-selection-panel-scroll": "",
        },
      })}
    </section>
  `;
}

export function attachSearchableSelectionPanelPatternController(root = document) {
  for (const panel of root.querySelectorAll("[data-searchable-selection-panel]")) {
    if (!(panel instanceof HTMLElement) || panel.dataset.searchableSelectionPanelController === "attached") {
      continue;
    }
    panel.dataset.searchableSelectionPanelController = "attached";
    const styleDeclaration = panel.getAttribute("data-searchable-selection-panel-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          panel.style.setProperty(property, value);
        }
      }
    }
  }

  attachSearchFieldControlPrimitiveController(root);
  attachScrollRegionControlPrimitiveController(root);
  attachCardListSelectPrimitiveController(root);

  if (attachedControllerRoots.has(root)) {
    return;
  }
  attachedControllerRoots.add(root);

  root.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.matches("[data-search-field-control-input]")) {
      return;
    }
    const panel = target.closest("[data-searchable-selection-panel]");
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    panel.dispatchEvent(
      new CustomEvent("searchable-selection-panel:query", {
        bubbles: true,
        detail: {
          query: target.value,
        },
      }),
    );
  });

  root.addEventListener("card-list-select:change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const panel = target.closest("[data-searchable-selection-panel]");
    if (!(panel instanceof HTMLElement)) {
      return;
    }
    const mode = panel.getAttribute("data-searchable-selection-panel-mode") ?? "multi";
    let selectedValues = Array.from(panel.querySelectorAll("[data-card-list-select-input]"))
      .filter((input) => input instanceof HTMLInputElement && input.checked && !input.disabled)
      .map((input) => input.value);
    if (mode === "single") {
      const eventValue = typeof event.detail?.value === "string" ? event.detail.value : "";
      const eventSelectedValues = Array.isArray(event.detail?.selectedValues) ? event.detail.selectedValues : [];
      selectedValues = eventSelectedValues.includes(eventValue) ? [eventValue] : [];
    }
    panel.dispatchEvent(
      new CustomEvent(searchableSelectionPanelPatternContract.eventName, {
        bubbles: true,
        detail: {
          selectionMode: mode,
          query: panel.getAttribute("data-searchable-selection-panel-query") ?? "",
          changedValue: typeof event.detail?.value === "string" ? event.detail.value : "",
          selectedValue: selectedValues[0] ?? "",
          selectedValues,
        },
      }),
    );
  });
}
