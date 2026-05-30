import {
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../03-primitive/field-row-control/index.mjs";
import {
  attachSimpleDropdownControlPrimitiveController,
  renderSimpleDropdownControlPrimitive,
  simpleDropdownControlPrimitive,
} from "../../03-primitive/simple-dropdown-control/index.mjs";

const patternName = "simple-dropdown-field";
const allowedStates = new Set(["default", "required", "disabled", "error"]);

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

export const simpleDropdownFieldPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/simple-dropdown-field/SimpleDropdownField-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["field-row-control", "simple-dropdown-control"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern for governed simple dropdown fields.",
    "Consumers must not recreate field-row labels, dropdown trigger/listbox semantics, keyboard behavior, error wiring, or text disclosure locally.",
    "Consumers must not use this pattern for search, multi-select, drawer select, card-list select, or persistence behavior.",
  ],
};

export function simpleDropdownFieldPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `simple-dropdown-field-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? `${id}-name`;
  const label = options.label ?? "Dropdown field";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";
  const state = options.state ?? "default";
  const selectedValue = options.selectedValue ?? "";
  const placeholder = options.placeholder ?? "Select one";
  const optionsList = Array.isArray(options.options) ? options.options : [];

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(label, "label");
  assertString(state, "state");

  if (systemKey !== "default") {
    throw new RangeError(`simple-dropdown-field has no system proof for "${systemKey}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`simple-dropdown-field does not support state "${state}".`);
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
  const dropdown = simpleDropdownControlPrimitive({
    systemKey,
    theme,
    id: `${id}-dropdown`,
    name,
    label,
    state,
    selectedValue,
    placeholder,
    errorText: state === "error" ? errorText : "",
    options: optionsList,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    name,
    label,
    helperText,
    errorText,
    state,
    selectedValue,
    placeholder,
    options: optionsList,
    primitives: { dropdown, fieldRow: row },
    attributes: {
      id,
      class: "ds-simple-dropdown-field",
      "data-simple-dropdown-field": "",
      "data-simple-dropdown-field-state": state,
      "data-simple-dropdown-field-theme": theme,
    },
    consumerRestrictions: simpleDropdownFieldPatternContract.consumerRules,
  };
}

export function renderSimpleDropdownFieldPattern(options = {}) {
  const spec = simpleDropdownFieldPattern(options);
  const dropdownHtml = renderSimpleDropdownControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.dropdown.id,
    name: spec.name,
    label: spec.label,
    state: spec.state,
    selectedValue: spec.selectedValue,
    placeholder: spec.placeholder,
    errorText: spec.state === "error" ? spec.errorText : "",
    options: spec.options,
  });
  const rowHtml = renderFieldRowControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.fieldRow.id,
    label: spec.label,
    state: spec.state,
    helperText: spec.state === "error" ? "" : spec.helperText,
    errorText: spec.state === "error" ? spec.errorText : "",
    controlHtml: dropdownHtml,
  });

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${rowHtml}
    </div>
  `;
}

export function attachSimpleDropdownFieldPatternController(root = document) {
  attachSimpleDropdownControlPrimitiveController(root);
}
