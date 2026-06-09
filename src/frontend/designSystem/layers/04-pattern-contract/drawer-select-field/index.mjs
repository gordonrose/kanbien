import {
  attachFieldRowControlPrimitiveController,
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../03-primitive/field-row-control/index.mjs";
import {
  attachDrawerSelectPatternController,
  drawerSelectPattern,
  renderDrawerSelectPattern,
} from "../drawer-select/index.mjs";

const patternName = "drawer-select-field";
const allowedStates = new Set(["default", "required", "disabled", "error"]);
const allowedModes = new Set(["single", "multi"]);
const allowedOrigins = new Set(["left", "right"]);
const allowedViewports = new Set(["desktop", "mobile"]);

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
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");
}

function normalizeOptions(options) {
  return Array.isArray(options) ? options : [];
}

export const drawerSelectFieldPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/drawer-select-field/DrawerSelectField-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["field-row-control"],
  requiredPatterns: ["drawer-select"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern for governed drawer-select fields inside form surfaces.",
    "Consumers must not recreate field-row labels, drawer trigger, panel-stack posture, searchable selection behavior, action behavior, or pending-versus-committed behavior locally.",
    "Consumers must not use this pattern for compact dropdowns, radio groups, card-list prioritization, workflow builders, backend search, persistence, or app adoption.",
  ],
};

export function drawerSelectFieldPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `drawer-select-field-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Drawer select field";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";
  const state = options.state ?? "default";
  const mode = options.mode ?? "multi";
  const open = Boolean(options.open);
  const origin = options.origin ?? "right";
  const viewport = options.viewport ?? "desktop";
  const query = String(options.query ?? "");
  const panelState = options.panelState ?? "default";
  const columns = Number(options.columns ?? 1);
  const showActions = options.showActions !== false;
  const requestInitialFocus = Boolean(options.requestInitialFocus);
  const committedValue = options.committedValue ?? "";
  const committedValues = Array.isArray(options.committedValues) ? options.committedValues : [];
  const pendingValues = Array.isArray(options.pendingValues) ? options.pendingValues : committedValues;
  const optionsList = normalizeOptions(options.options);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");
  assertString(mode, "mode");
  assertString(origin, "origin");
  assertString(viewport, "viewport");

  if (systemKey !== "default") {
    throw new RangeError(`drawer-select-field has no system proof for "${systemKey}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`drawer-select-field does not support state "${state}".`);
  }
  if (!allowedModes.has(mode)) {
    throw new RangeError(`drawer-select-field does not support mode "${mode}".`);
  }
  if (!allowedOrigins.has(origin)) {
    throw new RangeError(`drawer-select-field does not support origin "${origin}".`);
  }
  if (!allowedViewports.has(viewport)) {
    throw new RangeError(`drawer-select-field does not support viewport "${viewport}".`);
  }

  const fieldRow = fieldRowControlPrimitive({
    systemKey,
    theme,
    id: `${id}-field-row`,
    label,
    state,
    helperText: state === "error" ? "" : helperText,
    errorText: state === "error" ? errorText : "",
  });
  const drawer = drawerSelectPattern({
    systemKey,
    theme,
    id: `${id}-drawer`,
    label,
    mode,
    open: state === "disabled" ? false : open,
    disabled: state === "disabled",
    origin,
    viewport,
    query,
    panelState,
    columns,
    showActions,
    requestInitialFocus,
    committedValue,
    committedValues,
    pendingValues,
    options: optionsList,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    helperText,
    errorText,
    state,
    mode,
    open: drawer.open,
    origin,
    viewport,
    query,
    panelState,
    columns,
    showActions,
    requestInitialFocus,
    committedValue,
    committedValues,
    pendingValues,
    options: optionsList,
    primitives: { fieldRow },
    patterns: { drawer },
    attributes: {
      id,
      class: "ds-drawer-select-field",
      "data-drawer-select-field": "",
      "data-drawer-select-field-state": state,
      "data-drawer-select-field-mode": mode,
      "data-drawer-select-field-theme": theme,
      "data-drawer-select-field-viewport": viewport,
    },
    consumerRestrictions: drawerSelectFieldPatternContract.consumerRules,
  };
}

export function renderDrawerSelectFieldPattern(options = {}) {
  const spec = drawerSelectFieldPattern(options);
  const drawerHtml = renderDrawerSelectPattern({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.patterns.drawer.id,
    label: spec.label,
    mode: spec.mode,
    open: spec.open,
    disabled: spec.state === "disabled",
    origin: spec.origin,
    viewport: spec.viewport,
    query: spec.query,
    panelState: spec.panelState,
    columns: spec.columns,
    showActions: spec.showActions,
    committedValue: spec.committedValue,
    committedValues: spec.committedValues,
    pendingValues: spec.pendingValues,
    options: spec.options,
    requestInitialFocus: spec.requestInitialFocus,
  });
  const rowHtml = renderFieldRowControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.fieldRow.id,
    label: spec.label,
    state: spec.state,
    helperText: spec.state === "error" ? "" : spec.helperText,
    errorText: spec.state === "error" ? spec.errorText : "",
    controlHtml: drawerHtml,
  });

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${rowHtml}
    </div>
  `;
}

export function attachDrawerSelectFieldPatternController(root = document) {
  attachFieldRowControlPrimitiveController(root);
  attachDrawerSelectPatternController(root);
}
