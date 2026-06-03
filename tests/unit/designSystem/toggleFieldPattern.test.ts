import { describe, expect, it } from "vitest";

import {
  renderToggleFieldPattern,
  toggleFieldPattern,
  toggleFieldPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/toggle-field/index.mjs";

describe("toggle-field pattern seam", () => {
  it("composes field-row-control and toggle-control without direct token ownership", () => {
    const field = toggleFieldPattern({
      id: "workflow-toggle",
      name: "workflowEnabled",
      label: "Enable workflow",
      helperText: "Changes workflow behavior.",
      checked: true,
    });

    expect(field).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "toggle-field",
      primitives: {
        fieldRow: {
          primitiveName: "field-row-control",
        },
        toggle: {
          primitiveName: "toggle-control",
          inputAttributes: {
            role: "switch",
            "aria-labelledby": "workflow-toggle-field-row-label",
            "aria-describedby": "workflow-toggle-field-row-helper",
          },
        },
      },
    });
    expect(field.primitives.toggle.tokenDependencies.toggleFrame.tokenName).toBe("--toggle-frame-on-original");
    expect(toggleFieldPatternContract).toMatchObject({
      patternName: "toggle-field",
      requiredPrimitives: ["field-row-control", "toggle-control"],
      directTokenDependencies: [],
    });
  });

  it("renders a field row with one native switch and state wiring", () => {
    const html = renderToggleFieldPattern({
      id: "workflow-toggle",
      name: "workflowEnabled",
      label: "Enable workflow",
      errorText: "Required.",
      state: "error",
    });

    expect(html).toContain('data-toggle-field=""');
    expect(html).toContain('data-field-row-control=""');
    expect(html).toContain("data-toggle-control");
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="workflow-toggle-field-row-error"');
  });
});
