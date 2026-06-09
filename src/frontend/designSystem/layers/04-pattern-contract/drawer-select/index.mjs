import {
  attachCountCardControlPrimitiveController,
  countCardControlPrimitive,
  renderCountCardControlPrimitive,
} from "../../03-primitive/count-card-control/index.mjs";
import {
  attachIconButtonControlPrimitiveController,
  iconButtonControlPrimitive,
} from "../../03-primitive/icon-button-control/index.mjs";
import {
  attachPanelHeaderControlPrimitiveController,
  panelHeaderControlPrimitive,
  renderPanelHeaderControlPrimitive,
} from "../../03-primitive/panel-header-control/index.mjs";
import {
  attachTextActionButtonControlPrimitiveController,
  renderTextActionButtonControlPrimitive,
  textActionButtonControlPrimitive,
} from "../../03-primitive/text-action-button-control/index.mjs";
import {
  attachPanelStackPatternController,
  panelStackPattern,
  renderPanelStackPattern,
} from "../panel-stack/index.mjs";
import { drawerOverlayPlacementTokenSpec } from "../../02-token/drawer-overlay-placement/systems/default.mjs";
import {
  attachSearchableSelectionPanelPatternController,
  renderSearchableSelectionPanelPattern,
  searchableSelectionPanelPattern,
} from "../searchable-selection-panel/index.mjs";

const patternName = "drawer-select";
const supportedThemes = new Set(["original", "dark", "desert"]);
const allowedModes = new Set(["single", "multi"]);
const allowedOrigins = new Set(["left", "right"]);
const allowedViewports = new Set(["desktop", "mobile"]);
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

function normalizeOptions(options) {
  const rawOptions = Array.isArray(options) ? options : [];
  return rawOptions.map((option, index) => {
    const value = option?.value ?? `option-${index + 1}`;
    const label = option?.label ?? value;
    assertString(value, `options[${index}].value`);
    assertString(label, `options[${index}].label`);
    return {
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

function selectedValuesForMode({ mode, committedValue, committedValues }) {
  if (mode === "single") {
    return [committedValue || committedValues[0]].filter(Boolean);
  }
  return committedValues;
}

function optionLabelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function summaryLabel(options, selectedValues) {
  if (selectedValues.length === 0) {
    return "No selection";
  }
  if (selectedValues.length === 1) {
    return optionLabelFor(options, selectedValues[0]);
  }
  return `${selectedValues.length} selected`;
}

function selectionChanged(committedValues, pendingValues) {
  if (committedValues.length !== pendingValues.length) {
    return true;
  }
  const committed = new Set(committedValues);
  return pendingValues.some((value) => !committed.has(value));
}

function actionBarHtml({ id, systemKey, theme, showActions }) {
  if (!showActions) {
    return "";
  }
  return `
    <div class="ds-drawer-select-actions" data-drawer-select-actions>
      ${renderTextActionButtonControlPrimitive({
        systemKey,
        theme,
        id: `${id}-cancel`,
        label: "Cancel",
        value: "cancel",
      })}
      ${renderTextActionButtonControlPrimitive({
        systemKey,
        theme,
        id: `${id}-apply`,
        label: "Apply",
        value: "apply",
      })}
    </div>
  `;
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

function drawerOverlayVariant() {
  const variant = drawerOverlayPlacementTokenSpec.variants.find(
    (candidate) => candidate.id === "drawer-overlay-placement-page-shell",
  );
  if (!variant) {
    throw new RangeError("drawer-select requires the signed drawer-overlay-placement token.");
  }
  return variant;
}

export const drawerSelectPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  behaviorRule:
    "docs/design-system/01-behavior-rule/shared/drawer-select/DrawerSelect-Behaviour.md",
  contractPath:
    "docs/design-system/04-pattern-contract/shared/drawer-select/DrawerSelect-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["count-card-control", "icon-button-control", "panel-header-control", "text-action-button-control"],
  requiredPatterns: ["panel-stack", "searchable-selection-panel"],
  directTokenDependencies: ["drawer-overlay-placement"],
  eventNames: {
    open: "drawer-select:open",
    close: "drawer-select:close",
    apply: "drawer-select:apply",
    pendingChange: "drawer-select:pending-change",
  },
  consumerRules: [
    "Consumers must use this pattern for governed drawer-select composition.",
    "Consumers must not recreate trigger, drawer stack, searchable selection panel, panel header, close action, text actions, or pending-versus-committed behavior locally.",
    "Consumers must not treat this pattern as a component seam, backend search contract, route state contract, or app adoption seam.",
  ],
};

export function drawerSelectPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `drawer-select-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Drawer select";
  const searchLabel = options.searchLabel ?? "Search options";
  const searchPlaceholder = options.searchPlaceholder ?? "Search options";
  const mode = options.mode ?? "multi";
  const open = Boolean(options.open);
  const disabled = Boolean(options.disabled);
  const origin = options.origin ?? "right";
  const viewport = options.viewport ?? "desktop";
  const query = String(options.query ?? "");
  const panelState = options.panelState ?? "default";
  const columns = Number(options.columns ?? 1);
  const showActions = options.showActions !== false;
  const requestInitialFocus = Boolean(options.requestInitialFocus);
  const optionsList = normalizeOptions(options.options);
  const committedValues = selectedValuesForMode({
    mode,
    committedValue: options.committedValue ?? "",
    committedValues: uniqueValues(options.committedValues),
  });
  const pendingValues = uniqueValues(Array.isArray(options.pendingValues) ? options.pendingValues : committedValues);
  const normalizedPendingValues = mode === "single" ? pendingValues.slice(0, 1) : pendingValues;
  const overlay = drawerOverlayVariant();
  const usePageShellOverlay = open;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(mode, "mode");
  assertString(origin, "origin");
  assertString(viewport, "viewport");

  if (systemKey !== "default") {
    throw new RangeError(`drawer-select has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`drawer-select does not support theme "${theme}".`);
  }
  if (!allowedModes.has(mode)) {
    throw new RangeError(`drawer-select does not support mode "${mode}".`);
  }
  if (!allowedOrigins.has(origin)) {
    throw new RangeError(`drawer-select does not support origin "${origin}".`);
  }
  if (!allowedViewports.has(viewport)) {
    throw new RangeError(`drawer-select does not support viewport "${viewport}".`);
  }

  const trigger = countCardControlPrimitive({
    systemKey,
    theme,
    id: `${id}-trigger`,
    label: summaryLabel(optionsList, committedValues),
    count: committedValues.length,
    state: disabled ? "disabled" : open ? "selected" : "default",
    mode: disabled ? "static" : "actionable",
    value: "open",
  });
  const close = iconButtonControlPrimitive({
    systemKey,
    theme,
    id: `${id}-close`,
    label: "Close selector",
    value: "close",
    icon: "close",
    frameIntent: "quiet",
  });
  const header = panelHeaderControlPrimitive({
    systemKey,
    theme,
    id: `${id}-header`,
    title: label,
    showAction: true,
    actionLabel: "Close selector",
    actionIcon: "close",
  });
  const cancel = textActionButtonControlPrimitive({
    systemKey,
    theme,
    id: `${id}-cancel`,
    label: "Cancel",
    value: "cancel",
  });
  const apply = textActionButtonControlPrimitive({
    systemKey,
    theme,
    id: `${id}-apply`,
    label: "Apply",
    value: "apply",
  });
  const selectionPanel = searchableSelectionPanelPattern({
    systemKey,
    theme,
    id: `${id}-selection-panel`,
    label,
    searchLabel,
    searchPlaceholder,
    query,
    selectionMode: mode,
    selectedValue: normalizedPendingValues[0] ?? "",
    selectedValues: normalizedPendingValues,
    state: panelState,
    columns,
    mobileMode: viewport === "mobile" ? "page-scroll" : "internal-scroll",
    options: optionsList,
  });
  const stack = open
      ? panelStackPattern({
        systemKey,
        theme,
        id: `${id}-stack`,
        label: `${label} drawer stack`,
        origin,
        viewport,
        activePanelId: "selector",
        panels: [
          {
            id: "selector",
            label,
            contentHtml: "",
          },
        ],
      })
    : null;

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    searchLabel,
    searchPlaceholder,
    mode,
    open,
    disabled,
    origin,
    viewport,
    query,
    panelState,
    columns,
    showActions,
    requestInitialFocus,
    options: optionsList,
    committedValues,
    pendingValues: normalizedPendingValues,
    pendingChanged: selectionChanged(committedValues, normalizedPendingValues),
    eventNames: drawerSelectPatternContract.eventNames,
    primitives: {
      trigger,
      header,
      close,
      cancel,
      apply,
    },
    patterns: {
      panelStack: stack,
      searchableSelectionPanel: selectionPanel,
    },
    tokenDependencies: {
      drawerOverlayPlacement: {
        tokenName: overlay.tokenName,
        variantId: overlay.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/drawer-overlay-placement/systems/default.mjs#drawerOverlayPlacementTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-drawer-select",
      "data-drawer-select": "",
      "data-drawer-select-open": open ? "true" : "false",
      "data-drawer-select-overlay": usePageShellOverlay ? "page-shell" : "none",
      "data-drawer-select-mode": mode,
      "data-drawer-select-theme": theme,
      "data-drawer-select-origin": origin,
      "data-drawer-select-viewport": viewport,
      "data-drawer-select-pending-changed": selectionChanged(committedValues, normalizedPendingValues) ? "true" : "false",
      "data-drawer-select-request-initial-focus": requestInitialFocus ? "true" : null,
    },
    styleVars: {
      "--pattern-drawer-overlay-position": overlay.positionValue,
      "--pattern-drawer-overlay-inset": overlay.insetValue,
      "--pattern-drawer-overlay-inline-size": overlay.inlineSizeValue,
      "--pattern-drawer-overlay-block-size": overlay.blockSizeValue,
      "--pattern-drawer-overlay-layer": overlay.layerValue,
    },
    consumerRestrictions: drawerSelectPatternContract.consumerRules,
  };
}

export function renderDrawerSelectPattern(options = {}) {
  const spec = drawerSelectPattern(options);
  const drawerContentHtml = `
    <div class="ds-drawer-select-panel">
      ${renderPanelHeaderControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: spec.primitives.header.id,
        title: spec.label,
        showAction: true,
        actionLabel: "Close selector",
        actionIcon: "close",
      })}
      ${renderSearchableSelectionPanelPattern({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: spec.patterns.searchableSelectionPanel.id,
        label: spec.label,
        searchLabel: spec.searchLabel,
        searchPlaceholder: spec.searchPlaceholder,
        query: spec.query,
        selectionMode: spec.mode,
        selectedValue: spec.pendingValues[0] ?? "",
        selectedValues: spec.pendingValues,
        state: spec.panelState,
        columns: spec.columns,
        mobileMode: spec.viewport === "mobile" ? "page-scroll" : "internal-scroll",
        options: spec.options,
      })}
      ${actionBarHtml({
        id: spec.id,
        systemKey: spec.systemKey,
        theme: spec.theme,
        showActions: spec.showActions,
      })}
    </div>
  `;

  return `
    <section ${toAttributeString({
      ...spec.attributes,
      "data-drawer-select-style": cssVarStyle(spec.styleVars),
    })}>
      <div class="ds-drawer-select-trigger">
        ${renderCountCardControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: spec.primitives.trigger.id,
          label: spec.primitives.trigger.label,
          count: spec.primitives.trigger.count,
          state: spec.primitives.trigger.state,
          mode: spec.primitives.trigger.mode,
          value: "open",
        })}
      </div>
      ${
        spec.open
          ? renderPanelStackPattern({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: `${spec.id}-stack`,
              label: `${spec.label} drawer stack`,
              origin: spec.origin,
              viewport: spec.viewport,
              activePanelId: "selector",
              panels: [
                {
                  id: "selector",
                  label: spec.label,
                  contentHtml: drawerContentHtml,
                },
              ],
            })
          : ""
      }
    </section>
  `;
}

export function focusDrawerSelectInitialControl(root = document) {
  const drawer = root.querySelector("[data-drawer-select][data-drawer-select-open='true']");
  if (!(drawer instanceof HTMLElement)) {
    return false;
  }

  const focusScope = drawer.querySelector(".ds-drawer-select-panel") ?? drawer;
  const focusSelectors = [
    "[data-search-field-control-input]",
    "[data-panel-header-control] button",
    "[data-drawer-select-actions] button",
    "button:not([disabled])",
    "input:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  const focusTarget = focusSelectors
    .map((selector) => focusScope.querySelector(selector))
    .find((candidate) => candidate instanceof HTMLElement);

  if (!(focusTarget instanceof HTMLElement)) {
    return false;
  }

  focusTarget.focus({ preventScroll: true });
  return true;
}

function scheduleDrawerSelectInitialFocus(root) {
  const focus = () => focusDrawerSelectInitialControl(root);
  focus();
  window.requestAnimationFrame(() => {
    focus();
    window.setTimeout(focus, 50);
  });
}

export function attachDrawerSelectPatternController(root = document) {
  attachCountCardControlPrimitiveController(root);
  attachIconButtonControlPrimitiveController(root);
  attachPanelHeaderControlPrimitiveController(root);
  attachTextActionButtonControlPrimitiveController(root);
  attachPanelStackPatternController(root);
  attachSearchableSelectionPanelPatternController(root);

  for (const drawer of root.querySelectorAll("[data-drawer-select]")) {
    if (!(drawer instanceof HTMLElement)) {
      continue;
    }
    const styleDeclaration = drawer.getAttribute("data-drawer-select-style");
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
        drawer.style.setProperty(property, value);
      }
    }
    if (
      drawer.getAttribute("data-drawer-select-open") === "true" &&
      drawer.getAttribute("data-drawer-select-request-initial-focus") === "true"
    ) {
      scheduleDrawerSelectInitialFocus(root);
    }
  }

  if (attachedControllerRoots.has(root)) {
    return;
  }
  attachedControllerRoots.add(root);

  root.addEventListener("count-card:activate", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const drawer = target.closest("[data-drawer-select]");
    if (!(drawer instanceof HTMLElement)) {
      return;
    }
    drawer.dispatchEvent(
      new CustomEvent(drawerSelectPatternContract.eventNames.open, {
        bubbles: true,
        detail: { id: drawer.id },
      }),
    );
  });

  root.addEventListener("icon-button-control:activate", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const drawer = target.closest("[data-drawer-select]");
    const isDrawerClose =
      event.detail?.value === "close" ||
      (typeof event.detail?.value === "string" && event.detail.value.endsWith("-header-action"));
    if (!(drawer instanceof HTMLElement) || !isDrawerClose) {
      return;
    }
    drawer.dispatchEvent(
      new CustomEvent(drawerSelectPatternContract.eventNames.close, {
        bubbles: true,
        detail: { id: drawer.id, reason: "close" },
      }),
    );
  });

  root.addEventListener("text-action-button-control:activate", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const drawer = target.closest("[data-drawer-select]");
    if (!(drawer instanceof HTMLElement)) {
      return;
    }
    const value = event.detail?.value;
    if (value === "apply") {
      drawer.dispatchEvent(
        new CustomEvent(drawerSelectPatternContract.eventNames.apply, {
          bubbles: true,
          detail: { id: drawer.id },
        }),
      );
    }
    if (value === "cancel") {
      drawer.dispatchEvent(
        new CustomEvent(drawerSelectPatternContract.eventNames.close, {
          bubbles: true,
          detail: { id: drawer.id, reason: "cancel" },
        }),
      );
    }
  });

  root.addEventListener("searchable-selection-panel:change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const drawer = target.closest("[data-drawer-select]");
    if (!(drawer instanceof HTMLElement)) {
      return;
    }
    drawer.dispatchEvent(
      new CustomEvent(drawerSelectPatternContract.eventNames.pendingChange, {
        bubbles: true,
        detail: {
          id: drawer.id,
          changedValue: typeof event.detail?.changedValue === "string" ? event.detail.changedValue : "",
          selectedValue: event.detail?.selectedValue ?? "",
          selectedValues: Array.isArray(event.detail?.selectedValues) ? event.detail.selectedValues : [],
        },
      }),
    );
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const drawer = target.closest("[data-drawer-select][data-drawer-select-open='true']");
    if (!(drawer instanceof HTMLElement)) {
      return;
    }
    drawer.dispatchEvent(
      new CustomEvent(drawerSelectPatternContract.eventNames.close, {
        bubbles: true,
        detail: { id: drawer.id, reason: "escape" },
      }),
    );
  });
}
