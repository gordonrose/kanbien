import { describe, expect, it } from "vitest";

import {
  focusInstructionDisclosurePrimitive,
  focusInstructionDisclosurePrimitiveContract,
  renderFocusInstructionDisclosurePrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/focus-instruction-disclosure/index.mjs";

describe("focus-instruction-disclosure primitive", () => {
  it("resolves signed tooltip tokens for the original theme", () => {
    const spec = focusInstructionDisclosurePrimitive({
      id: "keyboard-help",
      text: "Press Space to select or deselect this option.",
    });

    expect(spec).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "focus-instruction-disclosure",
      systemKey: "default",
      theme: "original",
      id: "keyboard-help",
      tokenDependencies: {
        tooltipSurface: {
          tokenName: "--tooltip-surface-original",
        },
        tooltipTextStyle: {
          tokenName: "--tooltip-text-style-default",
        },
      },
    });
    expect(spec.styleVars["--primitive-focus-instruction-background"]).toBe("#111827");
    expect(spec.styleVars["--primitive-focus-instruction-font-family"]).toContain("system-ui");
  });

  it("resolves theme-specific tooltip surfaces", () => {
    const dark = focusInstructionDisclosurePrimitive({
      id: "dark-help",
      text: "Use Alt plus Arrow Up or Arrow Down to reorder.",
      theme: "dark",
    });
    const desert = focusInstructionDisclosurePrimitive({
      id: "desert-help",
      text: "Use Alt plus Arrow Up or Arrow Down to reorder.",
      theme: "desert",
    });

    expect(dark.tokenDependencies.tooltipSurface.tokenName).toBe("--tooltip-surface-dark");
    expect(desert.tokenDependencies.tooltipSurface.tokenName).toBe("--tooltip-surface-desert");
  });

  it("renders a non-focusable described instruction surface", () => {
    const html = renderFocusInstructionDisclosurePrimitive({
      id: "rendered-help",
      text: "Use <Space> & keep focus on the option.",
      theme: "dark",
    });

    expect(html).toContain('id="rendered-help"');
    expect(html).toContain('data-focus-instruction-disclosure=""');
    expect(html).toContain('data-focus-instruction-disclosure-theme="dark"');
    expect(html).toContain("Use &lt;Space&gt; &amp; keep focus on the option.");
    expect(html).toContain("data-focus-instruction-disclosure-style=");
    expect(html).not.toContain("tabindex");
    expect(html).not.toContain("role=");
    expect(html).not.toContain(" style=");
  });

  it("rejects missing text and unsupported systems or themes", () => {
    expect(() => focusInstructionDisclosurePrimitive({ id: "empty", text: "" })).toThrow(
      "text must be a non-empty string.",
    );
    expect(() =>
      focusInstructionDisclosurePrimitive({
        id: "missing-system",
        text: "Help",
        systemKey: "missing",
      }),
    ).toThrow('focus-instruction-disclosure has no system proof for "missing".');
    expect(() =>
      focusInstructionDisclosurePrimitive({
        id: "missing-theme",
        text: "Help",
        theme: "missing",
      }),
    ).toThrow('focus-instruction-disclosure does not support theme "missing".');
  });

  it("documents the primitive boundary", () => {
    expect(focusInstructionDisclosurePrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "focus-instruction-disclosure",
      status: "review-ready",
      supportedSystems: ["default"],
      requiredTokens: ["tooltip-surface", "tooltip-text-style"],
    });
    expect(focusInstructionDisclosurePrimitiveContract.consumerRules).toContain(
      "Consumers must use this primitive for focus-only keyboard instruction disclosure.",
    );
  });
});
