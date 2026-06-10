import {
  accordionGroupPattern,
  attachAccordionGroupPatternController,
  renderAccordionGroupPattern,
} from "../accordion-group/index.mjs";
import {
  attachFormFieldSectionPatternController,
  formFieldSectionPattern,
  renderFormFieldSectionPattern,
} from "../form-field-section/index.mjs";

const patternName = "accordion-form-section";
const supportedThemes = new Set(["original", "dark", "desert"]);
const allowedViewports = new Set(["desktop", "mobile"]);
const allowedWidthPostures = new Set(["desktop", "narrow"]);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function normalizeSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) {
    throw new TypeError("accordion-form-section requires at least one section.");
  }

  return sections.map((section, index) => {
    const value = section?.value ?? `section-${index + 1}`;
    const title = section?.title ?? "";
    const formTitle = section?.formTitle ?? title;
    const fields = section?.fields ?? [];

    assertString(value, `sections[${index}].value`);
    assertString(title, `sections[${index}].title`);
    assertString(formTitle, `sections[${index}].formTitle`);

    return {
      value,
      title,
      supportingText: section?.supportingText ?? "",
      formTitle,
      formSupportingText: section?.formSupportingText ?? "",
      fields,
      expanded: Boolean(section?.expanded),
      disabled: Boolean(section?.disabled),
      containsError: Boolean(section?.containsError),
    };
  });
}

export const accordionFormSectionPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/accordion-form-section/AccordionFormSection-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: [],
  requiredPatterns: ["accordion-group", "form-field-section"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern when accordion sections host reusable form-field sections.",
    "Consumers must provide governed hosted field primitives or governed field patterns for every field entry.",
    "Consumers must not recreate accordion-group behavior, form-field-section layout, child field semantics, drawer behavior, tooltip behavior, focus behavior, or token values locally.",
  ],
};

export function accordionFormSectionPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const tone = options.tone ?? "neutral";
  const id = options.id ?? `accordion-form-section-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Accordion form sections";
  const headingLevel = options.headingLevel ?? 3;
  const viewport = options.viewport ?? "desktop";
  const widthPosture = options.widthPosture ?? "desktop";
  const sections = normalizeSections(options.sections);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(tone, "tone");
  assertString(id, "id");
  assertString(label, "label");
  assertString(viewport, "viewport");
  assertString(widthPosture, "widthPosture");

  if (systemKey !== "default") {
    throw new RangeError(`accordion-form-section has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`accordion-form-section does not support theme "${theme}".`);
  }
  if (!allowedViewports.has(viewport)) {
    throw new RangeError(`accordion-form-section does not support viewport "${viewport}".`);
  }
  if (!allowedWidthPostures.has(widthPosture)) {
    throw new RangeError(`accordion-form-section does not support widthPosture "${widthPosture}".`);
  }

  const childFormSections = sections.map((section) =>
    formFieldSectionPattern({
      systemKey,
      theme,
      id: `${id}-${section.value}-form`,
      title: section.formTitle,
      supportingText: section.formSupportingText,
      viewport,
      widthPosture,
      fields: section.fields,
    }),
  );

  const accordion = accordionGroupPattern({
    systemKey,
    theme,
    tone,
    id,
    label,
    headingLevel,
    sections: sections.map((section, index) => ({
      value: section.value,
      title: section.title,
      supportingText: section.supportingText,
      expanded: section.expanded,
      disabled: section.disabled,
      containsError: section.containsError,
      contentHtml: "",
      childFormSection: childFormSections[index],
    })),
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    tone,
    id,
    label,
    headingLevel,
    viewport,
    widthPosture,
    sections,
    childPatterns: {
      accordion,
      formFieldSections: childFormSections,
    },
    attributes: {
      id,
      class: "ds-accordion-form-section",
      "data-accordion-form-section": "",
      "data-accordion-form-section-theme": theme,
      "data-accordion-form-section-viewport": viewport,
      "data-accordion-form-section-width": widthPosture,
    },
    consumerRestrictions: accordionFormSectionPatternContract.consumerRules,
  };
}

export function renderAccordionFormSectionPattern(options = {}) {
  const spec = accordionFormSectionPattern(options);
  const sections = spec.sections.map((section) => ({
    value: section.value,
    title: section.title,
    supportingText: section.supportingText,
    expanded: section.expanded,
    disabled: section.disabled,
    containsError: section.containsError,
    contentHtml: renderFormFieldSectionPattern({
      systemKey: spec.systemKey,
      theme: spec.theme,
      id: `${spec.id}-${section.value}-form`,
      title: section.formTitle,
      supportingText: section.formSupportingText,
      viewport: spec.viewport,
      widthPosture: spec.widthPosture,
      fields: section.fields,
    }),
  }));

  return `
    <div id="${escapeHtml(spec.id)}" class="ds-accordion-form-section" data-accordion-form-section data-accordion-form-section-theme="${escapeHtml(spec.theme)}" data-accordion-form-section-viewport="${escapeHtml(spec.viewport)}" data-accordion-form-section-width="${escapeHtml(spec.widthPosture)}">
      ${renderAccordionGroupPattern({
        systemKey: spec.systemKey,
        theme: spec.theme,
        tone: spec.tone,
        id: `${spec.id}-accordion`,
        label: spec.label,
        headingLevel: spec.headingLevel,
        sections,
      })}
    </div>
  `;
}

export function attachAccordionFormSectionPatternController(root = document) {
  attachAccordionGroupPatternController(root);
  attachFormFieldSectionPatternController(root);
}
