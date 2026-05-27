import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
  truncatingLabelPrimitive,
} from "../../03-primitive/truncating-label/index.mjs";

const patternName = "index-nav-label";

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

export const indexNavLabelPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/index-nav-label/IndexNavLabel-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["truncating-label"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use the truncating-label primitive for governed index-navigation labels.",
    "Consumers must not recreate truncation, tooltip disclosure, focus behavior, ARIA, or token values locally.",
    "Consumers must not nest this focusable pattern inside another interactive control without a later governed focus-composition decision.",
    "Consumers must not treat this pattern as a full nav item, route, selected state, count badge, or component seam.",
  ],
};

export function indexNavLabelPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const text = options.text ?? "";
  const id = options.id ?? `index-nav-label-${Math.random().toString(36).slice(2, 10)}`;
  const slot = options.slot ?? "primary-index";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(text, "text");
  assertString(id, "id");
  assertString(slot, "slot");

  if (options.interactiveHost === true) {
    throw new TypeError(
      "index-nav-label cannot be nested inside an interactive host until a later governed focus-composition decision exists.",
    );
  }

  const primitive = truncatingLabelPrimitive({ systemKey, theme, text, id: `${id}-primitive` });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    text,
    id,
    slot,
    primitive,
    states: {
      labelFits: "The primitive may render without visible clipping while preserving the full label value.",
      labelTruncated: "The primitive clips visible text and exposes the full value through governed disclosure.",
      hostIsInteractive:
        "Consumers must route to a later governed focus-composition decision before nesting this focusable pattern inside an interactive host.",
    },
    attributes: {
      id,
      class: "ds-index-nav-label",
      "data-index-nav-label": "",
      "data-index-nav-label-slot": slot,
      "data-index-nav-label-theme": theme,
    },
    consumerRestrictions: indexNavLabelPatternContract.consumerRules,
  };
}

export function renderIndexNavLabelPattern(options = {}) {
  const spec = indexNavLabelPattern(options);

  return `
    <span ${toAttributeString(spec.attributes)}>
      ${renderTruncatingLabelPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        text: spec.text,
        id: spec.primitive.id,
      })}
    </span>
  `;
}

export function attachIndexNavLabelPatternController(root = document) {
  attachTruncatingLabelPrimitiveController(root);
}
