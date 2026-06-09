import {
  attachFieldContainerControlPrimitiveController,
  fieldContainerControlPrimitive,
  renderFieldContainerControlPrimitive,
} from "../../03-primitive/field-container-control/index.mjs";

const patternName = "form-field-section";
const supportedThemes = new Set(["original", "dark", "desert"]);
const allowedSpans = new Set(["span-1", "span-2"]);
const allowedViewports = new Set(["desktop", "mobile"]);
const allowedWidthPostures = new Set(["desktop", "narrow"]);

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

function normalizeFields(fields) {
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new TypeError("form-field-section requires at least one field.");
  }

  return fields.map((field, index) => {
    const id = field?.id ?? `field-${index + 1}`;
    const label = field?.label ?? id;
    const span = field?.span ?? "span-1";
    const contentHtml = field?.contentHtml ?? "";

    assertString(id, `fields[${index}].id`);
    assertString(label, `fields[${index}].label`);
    assertString(span, `fields[${index}].span`);

    if (!allowedSpans.has(span)) {
      throw new RangeError(`form-field-section does not support span "${span}".`);
    }

    return { id, label, span, contentHtml };
  });
}

export const formFieldSectionPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/form-field-section/FormFieldSection-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["field-container-control"],
  requiredPatterns: [],
  directTokenDependencies: [],
  allowedSpans: Array.from(allowedSpans),
  consumerRules: [
    "Consumers must use this pattern for reusable form-field section layout instead of local form grids or field cards.",
    "Consumers must provide governed hosted field primitives or field patterns for every field container.",
    "Consumers must not redefine hosted field semantics, focus behavior, keyboard behavior, validation behavior, tooltip behavior, drawer behavior, or token values locally.",
  ],
};

export function formFieldSectionPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `form-field-section-${Math.random().toString(36).slice(2, 10)}`;
  const title = options.title ?? "Form section";
  const supportingText = options.supportingText ?? "";
  const viewport = options.viewport ?? "desktop";
  const widthPosture = options.widthPosture ?? "desktop";
  const fields = normalizeFields(options.fields);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(title, "title");
  assertString(viewport, "viewport");
  assertString(widthPosture, "widthPosture");

  if (systemKey !== "default") {
    throw new RangeError(`form-field-section has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`form-field-section does not support theme "${theme}".`);
  }
  if (!allowedViewports.has(viewport)) {
    throw new RangeError(`form-field-section does not support viewport "${viewport}".`);
  }
  if (!allowedWidthPostures.has(widthPosture)) {
    throw new RangeError(`form-field-section does not support widthPosture "${widthPosture}".`);
  }

  const containers = fields.map((field) => ({
    ...field,
    primitive: fieldContainerControlPrimitive({
      systemKey,
      theme,
      id: `${id}-${field.id}-container`,
    }),
  }));

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    title,
    supportingText,
    viewport,
    widthPosture,
    fields: containers,
    primitives: {
      fieldContainers: containers.map((field) => field.primitive),
    },
    attributes: {
      id,
      class: "ds-form-field-section",
      "data-form-field-section": "",
      "data-form-field-section-theme": theme,
      "data-form-field-section-viewport": viewport,
      "data-form-field-section-width": widthPosture,
      "aria-labelledby": `${id}-title`,
      "aria-describedby": supportingText ? `${id}-supporting` : null,
    },
    consumerRestrictions: formFieldSectionPatternContract.consumerRules,
  };
}

export function renderFormFieldSectionPattern(options = {}) {
  const spec = formFieldSectionPattern(options);

  return `
    <section ${toAttributeString(spec.attributes)}>
      <header class="ds-form-field-section-header">
        <h2 id="${escapeHtml(spec.id)}-title">${escapeHtml(spec.title)}</h2>
        ${
          spec.supportingText
            ? `<p id="${escapeHtml(spec.id)}-supporting">${escapeHtml(spec.supportingText)}</p>`
            : ""
        }
      </header>
      <div class="ds-form-field-section-grid" data-form-field-section-grid>
        ${spec.fields
          .map(
            (field) => `
              <div
                class="ds-form-field-section-item"
                data-form-field-section-item="${escapeHtml(field.id)}"
                data-form-field-section-span="${escapeHtml(field.span)}"
              >
                ${renderFieldContainerControlPrimitive({
                  systemKey: spec.systemKey,
                  theme: spec.theme,
                  id: field.primitive.id,
                  childHtml: field.contentHtml,
                })}
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

export function attachFormFieldSectionPatternController(root = document) {
  attachFieldContainerControlPrimitiveController(root);
}
