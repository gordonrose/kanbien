import { describe, expect, it } from "vitest";

import {
  renderToggleControlPrimitive,
  toggleControlPrimitive,
  toggleControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/toggle-control/index.mjs";

describe("toggle-control primitive seam", () => {
  it("resolves signed token dependencies for boolean switch states", () => {
    const toggle = toggleControlPrimitive({
      id: "workflow-enabled",
      name: "workflowEnabled",
      accessibleName: "Enable workflow",
      checked: true,
      state: "error",
    });

    expect(toggle).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "toggle-control",
      checked: true,
      tokenDependencies: {
        toggleFrame: {
          tokenName: "--toggle-frame-error-original",
        },
        toggleOffsetFrame: {
          tokenName: "--toggle-frame-on-original",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
        minimumTargetSize: {
          tokenName: "--target-size-interactive-min",
        },
      },
      inputAttributes: {
        type: "checkbox",
        role: "switch",
        "aria-invalid": "true",
      },
    });
  });

  it("renders one native checkbox switch and rejects unnamed controls", () => {
    const html = renderToggleControlPrimitive({
      id: "workflow-enabled",
      name: "workflowEnabled",
      accessibleName: "Enable workflow",
    });

    expect(html).toContain("<input");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-label="Enable workflow"');
    expect(html).toContain("data-toggle-control");
    expect(() => toggleControlPrimitive({ id: "bad-toggle" })).toThrow("accessibleName or labelledBy");
    expect(toggleControlPrimitiveContract).toMatchObject({
      primitiveName: "toggle-control",
      requiredTokens: ["toggle-frame", "focus-ring", "minimum-target-size"],
    });
  });
});
