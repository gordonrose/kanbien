import {
  accordionSectionControlPrimitive,
  attachAccordionSectionControlPrimitiveController,
  renderAccordionSectionControlPrimitive,
} from "../../03-primitive/accordion-section-control/index.mjs";
import { attachTruncatingLabelPrimitiveController } from "../../03-primitive/truncating-label/index.mjs";

const patternName = "accordion-group";

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

function normalizeSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) {
    throw new TypeError("accordion-group requires at least one section.");
  }

  return sections.map((section, index) => {
    const value = section.value ?? `section-${index + 1}`;
    const title = section.title ?? "";
    assertString(value, `sections[${index}].value`);
    assertString(title, `sections[${index}].title`);
    return {
      value,
      title,
      supportingText: section.supportingText ?? "",
      expanded: Boolean(section.expanded),
      disabled: Boolean(section.disabled),
      containsError: Boolean(section.containsError),
      contentHtml: section.contentHtml ?? "",
    };
  });
}

export const accordionGroupPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/accordion-group/AccordionGroup-Contract.md",
  supportedSystems: ["default"],
  requiredPrimitives: ["accordion-section-control"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern for governed single-open accordion section groups.",
    "Consumers must not recreate accordion section header behavior, ARIA wiring, text disclosure, or controller behavior locally.",
    "Consumers must not use this pattern for multi-open accordions, workflow builders, drawer navigation, validation, persistence, or app adoption.",
  ],
};

export function accordionGroupPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const tone = options.tone ?? "neutral";
  const id = options.id ?? `accordion-group-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Accordion group";
  const headingLevel = options.headingLevel ?? 3;
  let openSectionSeen = false;
  const sections = normalizeSections(options.sections).map((section) => {
    const expanded = section.expanded && !section.disabled && !openSectionSeen;
    if (expanded) {
      openSectionSeen = true;
    }
    return { ...section, expanded };
  });

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(tone, "tone");
  assertString(id, "id");
  assertString(label, "label");
  if (systemKey !== "default") {
    throw new RangeError(`accordion-group has no system proof for "${systemKey}".`);
  }

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    tone,
    id,
    label,
    headingLevel,
    sections,
    primitives: sections.map((section, index) =>
      accordionSectionControlPrimitive({
        systemKey,
        theme,
        tone,
        id: `${id}-${section.value}`,
        title: section.title,
        supportingText: section.supportingText,
        state: section.disabled ? "disabled" : "default",
        expanded: section.expanded,
        containsError: section.containsError,
        headingLevel,
      }),
    ),
    attributes: {
      id,
      class: "ds-accordion-group",
      "data-accordion-group": "",
      "data-accordion-group-theme": theme,
      "data-accordion-group-tone": tone,
      "aria-label": label,
    },
    consumerRestrictions: accordionGroupPatternContract.consumerRules,
  };
}

export function renderAccordionGroupPattern(options = {}) {
  const spec = accordionGroupPattern(options);
  const sectionHtml = spec.sections
    .map((section) =>
      renderAccordionSectionControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        tone: spec.tone,
        id: `${spec.id}-${section.value}`,
        title: section.title,
        supportingText: section.supportingText,
        state: section.disabled ? "disabled" : "default",
        expanded: section.expanded,
        containsError: section.containsError,
        headingLevel: spec.headingLevel,
        contentHtml: section.contentHtml,
      }),
    )
    .join("");

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${sectionHtml}
    </div>
  `;
}

export function attachAccordionGroupPatternController(root = document) {
  attachAccordionSectionControlPrimitiveController(root);
  attachTruncatingLabelPrimitiveController(root);

  for (const group of root.querySelectorAll("[data-accordion-group]")) {
    if (!(group instanceof HTMLElement) || group.dataset.accordionGroupController === "attached") {
      continue;
    }
    group.dataset.accordionGroupController = "attached";

    group.addEventListener("accordion-section-control:toggle", (event) => {
      const openedSectionId = event.detail?.expanded ? event.detail?.id : "";
      if (openedSectionId) {
        for (const section of group.querySelectorAll("[data-accordion-section-control]")) {
          if (!(section instanceof HTMLElement) || section.id === openedSectionId) {
            continue;
          }
          const button = section.querySelector("[data-accordion-section-control-button]");
          const panel = section.querySelector("[data-accordion-section-control-panel]");
          if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
            continue;
          }
          section.dataset.accordionSectionControlExpanded = "false";
          button.setAttribute("aria-expanded", "false");
          panel.setAttribute("hidden", "");
        }
      }

      group.dispatchEvent(
        new CustomEvent("accordion-group:section-toggle", {
          bubbles: true,
          detail: {
            sectionId: event.detail?.id ?? "",
            expanded: Boolean(event.detail?.expanded),
          },
        }),
      );
    });
  }
}
