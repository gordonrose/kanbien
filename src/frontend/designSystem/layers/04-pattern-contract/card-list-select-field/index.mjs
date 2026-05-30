import {
  attachCardListSelectPrimitiveController,
  cardListSelectPrimitive,
  renderCardListSelectPrimitive,
} from "../../03-primitive/card-list-select/index.mjs";
import {
  attachFieldRowControlPrimitiveController,
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../03-primitive/field-row-control/index.mjs";

const patternName = "card-list-select-field";
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

function cardListStateForPatternState(state) {
  if (state === "disabled") {
    return "disabled-group";
  }
  if (state === "error") {
    return "error";
  }
  return "default";
}

export const cardListSelectFieldPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/card-list-select-field/CardListSelectField-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["field-row-control", "card-list-select"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern for governed multi-select card-list fields inside form surfaces.",
    "Consumers must not recreate field-row labels, native checkbox semantics, priority ranking, card state affordances, error wiring, or truncation disclosure locally.",
    "Consumers must not use this pattern for radio groups, dropdowns, navigation, workflow builders, drawer selection, or persistence behavior.",
  ],
};

export function cardListSelectFieldPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `card-list-select-field-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? `${id}-name`;
  const label = options.label ?? "Card list field";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";
  const state = options.state ?? "default";
  const variant = options.variant ?? "visibility";
  const columns = Number(options.columns ?? 2);
  const selectedValues = Array.isArray(options.selectedValues) ? options.selectedValues : [];
  const priorityOrder = Array.isArray(options.priorityOrder) ? options.priorityOrder : selectedValues;
  const optionsList = Array.isArray(options.options) ? options.options : [];

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(label, "label");
  assertString(state, "state");
  assertString(variant, "variant");

  if (systemKey !== "default") {
    throw new RangeError(`card-list-select-field has no system proof for "${systemKey}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`card-list-select-field does not support state "${state}".`);
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
  const cardList = cardListSelectPrimitive({
    systemKey,
    theme,
    id: `${id}-card-list`,
    name,
    label,
    variant,
    state: cardListStateForPatternState(state),
    columns,
    selectedValues,
    priorityOrder,
    externalDescriptionIds: row.ids.describedBy ? row.ids.describedBy.split(" ") : [],
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
    variant,
    columns,
    selectedValues,
    priorityOrder,
    options: optionsList,
    primitives: {
      cardList,
      fieldRow: row,
    },
    attributes: {
      id,
      class: "ds-card-list-select-field",
      "data-card-list-select-field": "",
      "data-card-list-select-field-state": state,
      "data-card-list-select-field-variant": variant,
      "data-card-list-select-field-theme": theme,
    },
    consumerRestrictions: cardListSelectFieldPatternContract.consumerRules,
  };
}

export function renderCardListSelectFieldPattern(options = {}) {
  const spec = cardListSelectFieldPattern(options);
  const cardListHtml = renderCardListSelectPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.primitives.cardList.id,
    name: spec.name,
    label: spec.label,
    variant: spec.variant,
    state: cardListStateForPatternState(spec.state),
    columns: spec.columns,
    selectedValues: spec.selectedValues,
    priorityOrder: spec.priorityOrder,
    externalDescriptionIds: spec.primitives.fieldRow.ids.describedBy ? spec.primitives.fieldRow.ids.describedBy.split(" ") : [],
    legendPresentation: "visually-hidden",
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
    controlHtml: cardListHtml,
  });

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${rowHtml}
    </div>
  `;
}

export function attachCardListSelectFieldPatternController(root = document) {
  attachFieldRowControlPrimitiveController(root);
  attachCardListSelectPrimitiveController(root);
}
