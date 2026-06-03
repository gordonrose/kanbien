import { describe, expect, it } from "vitest";

import {
  accordionGroupPattern,
  accordionGroupPatternContract,
  renderAccordionGroupPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/accordion-group/index.mjs";

const sections = [
  {
    value: "identity",
    title: "Identity",
    expanded: true,
    contentHtml: "<p>Identity content</p>",
  },
  {
    value: "workflows",
    title: "Workflows",
    disabled: true,
    contentHtml: "<p>Workflow content</p>",
  },
];

type AccordionSectionState = {
  expanded: boolean;
};

describe("accordion-group pattern seam", () => {
  it("composes accordion-section-control without direct token ownership", () => {
    const group = accordionGroupPattern({
      id: "entity-sections",
      label: "Entity sections",
      sections,
    });

    expect(group).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "accordion-group",
      id: "entity-sections",
      label: "Entity sections",
      primitives: [
        {
          primitiveName: "accordion-section-control",
          id: "entity-sections-identity",
          expanded: true,
        },
        {
          primitiveName: "accordion-section-control",
          id: "entity-sections-workflows",
          state: "disabled",
        },
      ],
    });
    expect(accordionGroupPatternContract).toMatchObject({
      patternName: "accordion-group",
      requiredPrimitives: ["accordion-section-control"],
      directTokenDependencies: [],
    });
    expect(accordionGroupPatternContract.consumerRules[0]).toContain("single-open");
  });

  it("renders a labelled multi-section group with primitive-owned section semantics", () => {
    const html = renderAccordionGroupPattern({
      id: "entity-sections",
      label: "Entity sections",
      sections,
    });

    expect(html).toContain('data-accordion-group=""');
    expect(html).toContain('aria-label="Entity sections"');
    expect(html.match(/data-accordion-section-control=""/g)).toHaveLength(2);
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('disabled');
    expect(html).toContain('role="region"');
    expect(html).toContain("Identity content");
    expect(html).toContain("Workflow content");
  });

  it("normalizes multiple initially expanded sections to one open section", () => {
    const group = accordionGroupPattern({
      id: "entity-sections",
      label: "Entity sections",
      sections: [
        { value: "identity", title: "Identity", expanded: true },
        { value: "workflows", title: "Workflows", expanded: true },
        { value: "display", title: "Display", expanded: true },
      ],
    });

    expect(group.sections.map((section: AccordionSectionState) => section.expanded)).toEqual([true, false, false]);
    expect(group.primitives.map((primitive: AccordionSectionState) => primitive.expanded)).toEqual([
      true,
      false,
      false,
    ]);
  });

  it("rejects empty groups because the pattern cannot prove absent section behavior", () => {
    expect(() =>
      accordionGroupPattern({
        sections: [],
      }),
    ).toThrow("accordion-group requires at least one section.");
  });
});
