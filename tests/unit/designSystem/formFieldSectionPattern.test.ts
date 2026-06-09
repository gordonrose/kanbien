import { describe, expect, it } from "vitest";

import {
  formFieldSectionPattern,
  formFieldSectionPatternContract,
  renderFormFieldSectionPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/form-field-section/index.mjs";

const fields = [
  {
    id: "entity-name",
    label: "Entity name",
    span: "span-1",
    contentHtml: '<div data-child-field="entity-name">Entity name field</div>',
  },
  {
    id: "description",
    label: "Description fallback",
    span: "span-2",
    contentHtml: '<div data-child-field="description">Description field</div>',
  },
];

describe("form-field-section pattern", () => {
  it("wraps governed hosted fields in field-container primitives", () => {
    const spec = formFieldSectionPattern({
      id: "form-section-test",
      title: "Primary details",
      supportingText: "Human-facing identity fields.",
      fields,
    });

    expect(spec).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "form-field-section",
      title: "Primary details",
      primitives: {
        fieldContainers: [
          { primitiveName: "field-container-control" },
          { primitiveName: "field-container-control" },
        ],
      },
    });
    expect(formFieldSectionPatternContract.requiredPrimitives).toEqual(["field-container-control"]);
    expect(formFieldSectionPatternContract.requiredPatterns).toEqual([]);
    expect(formFieldSectionPatternContract.directTokenDependencies).toEqual([]);
    expect(formFieldSectionPatternContract.allowedSpans).toEqual(["span-1", "span-2"]);
  });

  it("renders section semantics, span attributes, and provided field content", () => {
    const html = renderFormFieldSectionPattern({
      id: "form-section-test",
      title: "Primary details",
      supportingText: "Human-facing identity fields.",
      fields,
    });

    expect(html).toContain('data-form-field-section=""');
    expect(html).toContain('aria-labelledby="form-section-test-title"');
    expect(html).toContain('aria-describedby="form-section-test-supporting"');
    expect(html).toContain('data-form-field-section-span="span-1"');
    expect(html).toContain('data-form-field-section-span="span-2"');
    expect(html).toContain("data-field-container-control");
    expect(html).toContain('data-field-container-control-slot="provided"');
    expect(html).toContain('data-child-field="description"');
  });

  it("rejects unsupported spans instead of allowing local layout invention", () => {
    expect(() =>
      renderFormFieldSectionPattern({
        id: "form-section-invalid",
        title: "Invalid section",
        fields: [
          {
            id: "invalid",
            label: "Invalid",
            span: "span-3",
            contentHtml: "Invalid",
          },
        ],
      }),
    ).toThrow('form-field-section does not support span "span-3"');
  });
});
