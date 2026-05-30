import {
  attachFieldRowControlPrimitiveController,
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../03-primitive/field-row-control/index.mjs";
import {
  attachRadioSimpleSelectPrimitiveController,
  radioSimpleSelectPrimitive,
  renderRadioSimpleSelectPrimitive,
} from "../../03-primitive/radio-simple-select/index.mjs";

const patternName = "radio-simple-select-field";
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

function radioStateForPatternState(state) {
  if (state === "disabled") {
    return "disabled-group";
  }
  return state;
}

function fieldRowStateForPatternState(state) {
  return state;
}

export const radioSimpleSelectFieldPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "accepted",
  contractPath:
    "docs/design-system/04-pattern-contract/shared/radio-simple-select-field/RadioSimpleSelectField-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["field-row-control", "radio-simple-select"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern for governed simple radio fields inside form surfaces.",
    "Consumers must not recreate field-row labels, native radio semantics, error wiring, truncation disclosure, or option frame styling locally.",
    "Consumers must not use this pattern for multi-select, card-list prioritization, toggles, dropdowns, drawers, workflow builders, or persistence behavior.",
  ],
};

export function radioSimpleSelectFieldPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `radio-simple-select-field-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? `${id}-name`;
  const label = options.label ?? "Radio field";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";
  const state = options.state ?? "default";
  const columns = Number(options.columns ?? 2);
  const selectedValue = options.selectedValue ?? "";
  const optionsList = Array.isArray(options.options) ? options.options : [];

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(label, "label");
  assertString(state, "state");

  if (systemKey !== "default") {
    throw new RangeError(`radio-simple-select-field has no system proof for "${systemKey}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`radio-simple-select-field does not support state "${state}".`);
  }

  const row = fieldRowControlPrimitive({
    systemKey,
    theme,
    id: `${id}-field-row`,
    label,
    state: fieldRowStateForPatternState(state),
    helperText: state === "error" ? "" : helperText,
    errorText: state === "error" ? errorText : "",
  });
  const radio = radioSimpleSelectPrimitive({
    systemKey,
    theme,
    id: `${id}-radio`,
    name,
    label,
    state: radioStateForPatternState(state),
    columns,
    selectedValue,
    errorText: state === "error" ? errorText : "",
    legendPresentation: "visually-hidden",
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
    columns,
    selectedValue,
    options: optionsList,
    primitives: {
      fieldRow: row,
      radio,
    },
    attributes: {
      id,
      class: "ds-radio-simple-select-field",
      "data-radio-simple-select-field": "",
      "data-radio-simple-select-field-state": state,
      "data-radio-simple-select-field-theme": theme,
    },
    consumerRestrictions: radioSimpleSelectFieldPatternContract.consumerRules,
  };
}

export function renderRadioSimpleSelectFieldPattern(options = {}) {
  const spec = radioSimpleSelectFieldPattern(options);
  const radioHtml = renderRadioSimpleSelectPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.radio.id,
    name: spec.name,
    label: spec.label,
    state: radioStateForPatternState(spec.state),
    columns: spec.columns,
    selectedValue: spec.selectedValue,
    errorText: spec.state === "error" ? spec.errorText : "",
    legendPresentation: "visually-hidden",
    options: spec.options,
  });
  const rowHtml = renderFieldRowControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.fieldRow.id,
    label: spec.label,
    state: fieldRowStateForPatternState(spec.state),
    helperText: spec.state === "error" ? "" : spec.helperText,
    errorText: spec.state === "error" ? spec.errorText : "",
    controlHtml: radioHtml,
  });

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${rowHtml}
    </div>
  `;
}

export function attachRadioSimpleSelectFieldPatternController(root = document) {
  attachFieldRowControlPrimitiveController(root);
  attachRadioSimpleSelectPrimitiveController(root);
}
