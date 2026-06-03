import { describe, expect, it } from "vitest";

import {
  brochureTextLinkActionPrimitive,
  brochureTextLinkActionPrimitiveContract,
  renderBrochureTextLinkActionPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs";

describe("brochure text link action primitive", () => {
  it("records signed brochure token dependencies", () => {
    const spec = brochureTextLinkActionPrimitive({
      id: "link-proof",
      href: "/design-system/brochure/",
      label: "View brochure system",
    });

    expect(spec.primitiveName).toBe("brochure-text-link-action");
    expect(spec.systemKey).toBe("brochure");
    expect(spec.tokenDependencies.linkTextStyle.variantId).toBe("link-text-style-standalone");
    expect(spec.tokenDependencies.linkDecoration.variantId).toBe("link-decoration-standalone");
    expect(spec.tokenDependencies.focusRing.runtimeSeam).toContain("focus-ring/systems/brochure.mjs#focusRingTokenSpec");
    expect(spec.tokenDependencies.minimumTargetSize.variantId).toBe("target-size-interactive-all");
    expect(spec.tokenDependencies.tooltipSurface.variantId).toBe("tooltip-surface-brochure-original");
    expect(spec.tokenDependencies.tooltipTextStyle.variantId).toBe("tooltip-text-style-brochure");
    expect(brochureTextLinkActionPrimitiveContract.requiredTokens).toEqual([
      "link-text-style",
      "link-decoration",
      "focus-ring",
      "minimum-target-size",
      "tooltip-surface",
      "tooltip-text-style",
    ]);
  });

  it("renders a native anchor with label and href", () => {
    const html = renderBrochureTextLinkActionPrimitive({
      id: "link-proof",
      href: "/design-system/brochure/",
      label: "View brochure system",
    });

    expect(html).toContain('<a id="link-proof"');
    expect(html).toContain('href="/design-system/brochure/"');
    expect(html).toContain('aria-label="View brochure system"');
    expect(html).toContain('data-brochure-text-link-action=""');
    expect(html).toContain('data-brochure-text-link-action-label');
    expect(html).toContain('data-brochure-text-link-action-tooltip');
    expect(html).toContain('role="tooltip"');
    expect(html).not.toContain('role="button"');
    expect(html).not.toContain("<button");
  });

  it("renders long-label overflow disclosure hooks without nesting a focusable truncating label", () => {
    const html = renderBrochureTextLinkActionPrimitive({
      id: "link-proof-long",
      href: "/design-system/brochure/patterns/brochure-evidence-section",
      label: "View the governed brochure evidence section pattern proof",
    });

    expect(html).toContain('id="link-proof-long-tooltip"');
    expect(html).toContain("View the governed brochure evidence section pattern proof");
    expect(html).toContain("--primitive-brochure-link-tooltip-background: #123f46");
    expect(html).not.toContain("data-truncating-label");
    expect(html).not.toContain('tabindex="0"');
  });

  it("escapes label and destination text", () => {
    const html = renderBrochureTextLinkActionPrimitive({
      id: "link-proof",
      href: "/design-system/brochure/?q=<script>",
      label: "View <proof>",
    });

    expect(html).toContain("View &lt;proof&gt;");
    expect(html).toContain("/design-system/brochure/?q=&lt;script&gt;");
  });

  it("rejects empty required values and unsupported systems", () => {
    expect(() => brochureTextLinkActionPrimitive({ label: " " })).toThrow("label must be a non-empty string");
    expect(() => brochureTextLinkActionPrimitive({ href: " " })).toThrow("href must be a non-empty string");
    expect(() => brochureTextLinkActionPrimitive({ systemKey: "default" })).toThrow(
      'brochure-text-link-action has no system proof for "default"',
    );
  });
});
