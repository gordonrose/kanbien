import { describe, expect, it } from "vitest";

import {
  renderTruncatingLabelPrimitive,
  truncatingLabelPrimitive,
  truncatingLabelPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs";

describe("truncating-label primitive seam", () => {
  it("resolves signed token dependencies for the default original theme", () => {
    const label = truncatingLabelPrimitive({
      id: "entity-label",
      text: "Organization label with long text",
    });

    expect(label).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "truncating-label",
      systemKey: "default",
      theme: "original",
      id: "entity-label",
      tooltipId: "entity-label-tooltip",
      semantics: {
        element: "span",
        focusable: true,
        interactiveRole: null,
        accessibleName: "Organization label with long text",
      },
      tokenDependencies: {
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
        tooltipSurface: {
          tokenName: "--tooltip-surface-original",
        },
        tooltipTextStyle: {
          tokenName: "--tooltip-text-style-default",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
        minimumTargetSize: {
          tokenName: "--target-size-interactive-min",
        },
      },
    });
    expect(label.attributes["aria-label"]).toBe("Organization label with long text");
    expect(label.attributes["aria-describedby"]).toBeNull();
    expect(label.semantics.describedBy).toBe("set only when rendered text is truncated");
    expect(label.styleVars["--primitive-label-font-family"]).toContain("system-ui");
    expect(label.styleVars["--primitive-tooltip-background"]).toBe("#111827");
  });

  it("resolves theme-specific tooltip surface and focus-ring tokens", () => {
    const dark = truncatingLabelPrimitive({
      id: "dark-label",
      text: "Dark theme label",
      theme: "dark",
    });
    const desert = truncatingLabelPrimitive({
      id: "desert-label",
      text: "Desert theme label",
      theme: "desert",
    });

    expect(dark.tokenDependencies.tooltipSurface.tokenName).toBe("--tooltip-surface-dark");
    expect(dark.tokenDependencies.focusRing.tokenName).toBe("--focus-ring-visible-dark");
    expect(desert.tokenDependencies.tooltipSurface.tokenName).toBe("--tooltip-surface-desert");
    expect(desert.tokenDependencies.focusRing.tokenName).toBe("--focus-ring-visible-desert");
  });

  it("rejects missing text and unsupported systems or themes", () => {
    expect(() => truncatingLabelPrimitive({ text: "" })).toThrow("text must be a non-empty string.");
    expect(() => truncatingLabelPrimitive({ systemKey: "missing", text: "Label" })).toThrow(
      'truncating-label has no system proof for "missing".',
    );
    expect(() => truncatingLabelPrimitive({ theme: "missing", text: "Label" })).toThrow(
      "truncating-label has no signed default tooltip-surface token for missing.",
    );
  });

  it("owns render markup without exposing route-local proof markup as the seam", () => {
    const html = renderTruncatingLabelPrimitive({
      id: "rendered-label",
      text: "Rendered <label> & text",
    });

    expect(html).toContain('data-truncating-label=""');
    expect(html).toContain("data-truncating-label-style=");
    expect(html).toContain('role="tooltip"');
    expect(html).toContain('aria-label="Rendered &lt;label&gt; &amp; text"');
    expect(html).toContain("Rendered &lt;label&gt; &amp; text");
    expect(html).not.toContain(" style=");
    expect(html).not.toContain("primitive-proof-row");
  });

  it("documents the primitive boundary", () => {
    expect(truncatingLabelPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "truncating-label",
      status: "accepted",
      supportedSystems: ["default"],
    });
    expect(truncatingLabelPrimitiveContract.consumerRules).toContain(
      "Consumers must not replace the signed token values with local CSS literals.",
    );
  });
});
