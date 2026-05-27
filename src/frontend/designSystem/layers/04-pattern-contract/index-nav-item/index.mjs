import {
  attachIndexNavItemControlPrimitiveController,
  indexNavItemControlPrimitive,
  renderIndexNavItemControlPrimitive,
} from "../../03-primitive/index-nav-item-control/index.mjs";

const patternName = "index-nav-item";

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

export const indexNavItemPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/index-nav-item/IndexNavItem-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["index-nav-item-control"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use the index-nav-item-control primitive for the interactive item.",
    "Consumers must not recreate item button markup, ARIA, current state, disabled behavior, tooltip behavior, or token values locally.",
    "Consumers must not treat this pattern as a full index list, tablist, route, component seam, template, or app adoption seam.",
  ],
};

export function indexNavItemPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const state = options.state ?? "resting";
  const label = options.label ?? "";
  const supportingText = options.supportingText ?? "";
  const value = options.value ?? label;
  const slot = options.slot ?? "index-nav";
  const id = options.id ?? `index-nav-item-${Math.random().toString(36).slice(2, 10)}`;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(state, "state");
  assertString(label, "label");
  assertString(id, "id");
  assertString(slot, "slot");

  const primitive = indexNavItemControlPrimitive({
    systemKey,
    theme,
    state,
    label,
    supportingText,
    value,
    id: `${id}-control`,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    state,
    label,
    supportingText,
    value,
    id,
    slot,
    primitive,
    attributes: {
      id,
      class: "ds-index-nav-item",
      "data-index-nav-item": "",
      "data-index-nav-item-slot": slot,
      "data-index-nav-item-state": state,
      "data-index-nav-item-theme": theme,
    },
    consumerRestrictions: indexNavItemPatternContract.consumerRules,
  };
}

export function renderIndexNavItemPattern(options = {}) {
  const spec = indexNavItemPattern(options);

  return `
    <span ${toAttributeString(spec.attributes)}>
      ${renderIndexNavItemControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        state: spec.state,
        label: spec.label,
        supportingText: spec.supportingText,
        value: spec.value,
        id: spec.primitive.id,
      })}
    </span>
  `;
}

export function attachIndexNavItemPatternController(root = document) {
  attachIndexNavItemControlPrimitiveController(root);
}
