import {
  attachBodyRegionControlPrimitiveController,
  bodyRegionControlPrimitive,
  renderBodyRegionControlPrimitive,
} from "../../03-primitive/body-region-control/index.mjs";

const patternName = "entity-body-panel";
const allowedStates = new Set(["default", "empty", "loading", "read-only", "editable", "error", "blocked-foundation"]);
const emptyBodyStates = new Set(["empty", "loading", "blocked-foundation"]);

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

export const entityBodyPanelPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/entity-body-panel/EntityBodyPanel-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: [],
  requiredPrimitives: ["body-region-control"],
  directTokenDependencies: ["not-applicable; tokens consumed through primitive"],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this pattern for governed entity body/content panel regions.",
    "Consumers must not recreate body-region markup, scroll composition, body state handling, or width rails locally.",
    "Consumers must not render ungoverned form fields, builders, selectors, accordions, validation UI, or workflow controls inside this pattern.",
  ],
};

export function entityBodyPanelPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `entity-body-panel-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Entity body content";
  const state = options.state ?? "default";
  const mobileMode = options.mobileMode ?? "page-scroll";
  const bodyHtml = options.bodyHtml ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");
  assertString(mobileMode, "mobileMode");

  if (!allowedStates.has(state)) {
    throw new RangeError(`entity-body-panel does not support state "${state}".`);
  }

  const primitive = bodyRegionControlPrimitive({
    systemKey,
    theme,
    id: `${id}-body-region`,
    label,
    state,
    mobileMode,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    state,
    mobileMode,
    bodyHtml,
    bodyContentAllowed: !emptyBodyStates.has(state),
    primitive,
    attributes: {
      id,
      class: "ds-entity-body-panel",
      "data-entity-body-panel": "",
      "data-entity-body-panel-theme": theme,
      "data-entity-body-panel-state": state,
      "data-entity-body-panel-mobile-mode": mobileMode,
    },
    consumerRestrictions: entityBodyPanelPatternContract.consumerRules,
  };
}

export function renderEntityBodyPanelPattern(options = {}) {
  const spec = entityBodyPanelPattern(options);
  const attributes = spec.attributes;
  const contentHtml = spec.bodyContentAllowed ? spec.bodyHtml : "";

  return `
    <section ${toAttributeString(attributes)}>
      ${renderBodyRegionControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-body-region`,
        label: spec.label,
        state: spec.state,
        mobileMode: spec.mobileMode,
        contentHtml,
      })}
    </section>
  `;
}

export function attachEntityBodyPanelPatternController(root = document) {
  attachBodyRegionControlPrimitiveController(root);
}
