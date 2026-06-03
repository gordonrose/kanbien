import {
  attachFieldRowControlPrimitiveController,
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../03-primitive/field-row-control/index.mjs";
import {
  attachToggleControlPrimitiveController,
  renderToggleControlPrimitive,
  toggleControlPrimitive,
} from "../../03-primitive/toggle-control/index.mjs";

const patternName = "toggle-field";
const allowedStates = new Set(["default", "required", "read-only", "disabled", "error"]);

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

export const toggleFieldPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/toggle-field/ToggleField-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["field-row-control", "toggle-control"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern for governed boolean toggle fields inside form surfaces.",
    "Consumers must not recreate field-row labels, switch semantics, description wiring, truncation disclosure, read-only blocking, or toggle frame styling locally.",
    "Consumers must not use this pattern for checkbox lists, radio groups, multi-select, dropdowns, drawers, workflow builders, persistence, or saving behavior.",
  ],
};

export function toggleFieldPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `toggle-field-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? `${id}-name`;
  const value = options.value ?? "on";
  const label = options.label ?? "Toggle field";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";
  const state = options.state ?? "default";
  const checked = Boolean(options.checked);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(value, "value");
  assertString(label, "label");
  assertString(state, "state");

  if (systemKey !== "default") {
    throw new RangeError(`toggle-field has no system proof for "${systemKey}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`toggle-field does not support state "${state}".`);
  }

  const row = fieldRowControlPrimitive({
    systemKey,
    theme,
    id: `${id}-field-row`,
    label,
    state,
    helperText: state === "error" ? "" : helperText,
    errorText: state === "error" ? errorText : "",
  });
  const toggle = toggleControlPrimitive({
    systemKey,
    theme,
    id: `${id}-toggle`,
    name,
    value,
    state,
    checked,
    labelledBy: row.ids.labelId,
    describedBy: row.ids.describedBy,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    name,
    value,
    label,
    helperText,
    errorText,
    state,
    checked,
    primitives: {
      fieldRow: row,
      toggle,
    },
    attributes: {
      id,
      class: "ds-toggle-field",
      "data-toggle-field": "",
      "data-toggle-field-state": state,
      "data-toggle-field-theme": theme,
      "data-toggle-field-toggle-id": toggle.id,
    },
    consumerRestrictions: toggleFieldPatternContract.consumerRules,
  };
}

export function renderToggleFieldPattern(options = {}) {
  const spec = toggleFieldPattern(options);
  const toggleHtml = renderToggleControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.toggle.id,
    name: spec.name,
    value: spec.value,
    state: spec.state,
    checked: spec.checked,
    labelledBy: spec.primitives.fieldRow.ids.labelId,
    describedBy: spec.primitives.fieldRow.ids.describedBy,
  });
  const rowHtml = renderFieldRowControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.fieldRow.id,
    label: spec.label,
    state: spec.state,
    helperText: spec.state === "error" ? "" : spec.helperText,
    errorText: spec.state === "error" ? spec.errorText : "",
    controlHtml: toggleHtml,
  });

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${rowHtml}
    </div>
  `;
}

export function attachToggleFieldPatternController(root = document) {
  attachFieldRowControlPrimitiveController(root);
  attachToggleControlPrimitiveController(root);

  for (const toggleField of root.querySelectorAll("[data-toggle-field]")) {
    if (!(toggleField instanceof HTMLElement) || toggleField.dataset.toggleFieldController === "attached") {
      continue;
    }

    toggleField.dataset.toggleFieldController = "attached";
    const toggleId = toggleField.getAttribute("data-toggle-field-toggle-id");
    const input = toggleId ? toggleField.querySelector(`#${CSS.escape(toggleId)}`) : null;
    const labelLine = toggleField.querySelector(".ds-field-row-control-label-line");

    if (!(input instanceof HTMLInputElement) || !(labelLine instanceof HTMLElement)) {
      continue;
    }

    labelLine.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("[data-toggle-control]")) {
        return;
      }
      input.click();
    });
  }
}
