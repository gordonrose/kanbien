import { describe, expect, it } from "vitest";

import {
  accordionFormSectionPattern,
  accordionFormSectionPatternContract,
  renderAccordionFormSectionPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/accordion-form-section/index.mjs";

const fields = [
  {
    id: "entity-name",
    label: "Entity name",
    span: "span-1",
    contentHtml: '<input aria-label="Entity name" value="Organization">',
  },
  {
    id: "description",
    label: "Description",
    span: "span-2",
    contentHtml: '<textarea aria-label="Description">Description</textarea>',
  },
];

const sections = [
  {
    value: "identity",
    title: "Identity",
    supportingText: "Identity fields.",
    formTitle: "Identity fields",
    formSupportingText: "Governed identity fields.",
    expanded: true,
    fields,
  },
  {
    value: "display",
    title: "Display",
    formTitle: "Display fields",
    fields: [
      {
        id: "display-mode",
        label: "Display mode",
        span: "span-1",
        contentHtml: '<button type="button">Display mode</button>',
      },
    ],
  },
];

describe("accordion-form-section pattern", () => {
  it("declares accordion-group and form-field-section as required child patterns", () => {
    const spec = accordionFormSectionPattern({
      id: "accordion-form-test",
      label: "Entity body sections",
      sections,
    });

    expect(spec).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "accordion-form-section",
      childPatterns: {
        accordion: { patternName: "accordion-group" },
        formFieldSections: [{ patternName: "form-field-section" }, { patternName: "form-field-section" }],
      },
    });
    expect(accordionFormSectionPatternContract.requiredPatterns).toEqual(["accordion-group", "form-field-section"]);
    expect(accordionFormSectionPatternContract.directTokenDependencies).toEqual([]);
  });

  it("renders accordion sections with hosted form-field-section content", () => {
    const html = renderAccordionFormSectionPattern({
      id: "accordion-form-test",
      label: "Entity body sections",
      sections,
    });

    expect(html).toContain('data-accordion-form-section');
    expect(html).toContain('data-accordion-group');
    expect(html).toContain('data-form-field-section');
    expect(html).toContain('data-form-field-section-span="span-1"');
    expect(html).toContain('data-form-field-section-span="span-2"');
    expect(html).toContain('aria-label="Entity body sections"');
  });

  it("rejects unsupported viewport posture instead of inventing layout behavior", () => {
    expect(() =>
      accordionFormSectionPattern({
        id: "accordion-form-invalid",
        viewport: "tablet",
        sections,
      }),
    ).toThrow('accordion-form-section does not support viewport "tablet"');
  });
});
