import { describe, expect, it } from "vitest";

import {
  brochureEvidenceSectionPattern,
  brochureEvidenceSectionPatternContract,
  renderBrochureEvidenceSectionPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/brochure-evidence-section/index.mjs";

describe("brochure evidence section pattern", () => {
  it("records the governed brochure token seams it consumes directly", () => {
    const spec = brochureEvidenceSectionPattern({
      id: "evidence-proof",
      items: [{ label: "Design-system artifacts", body: "record governed decisions." }],
    });

    expect(spec.patternName).toBe("brochure-evidence-section");
    expect(spec.systemKey).toBe("brochure");
    expect(spec.tokenDependencies.surfaceFrame.runtimeSeam).toContain("surface-frame/systems/brochure.mjs#surfaceFrameTokenSpec");
    expect(spec.tokenDependencies.spacing).toHaveLength(3);
    expect(spec.tokenDependencies.typographyScale.map((token: { variantId: string }) => token.variantId)).toEqual([
      "typography-eyebrow",
      "typography-section-heading",
    ]);
    expect(spec.tokenDependencies.listMarkerStyle.variantId).toBe("list-marker-bullet");
    expect(brochureEvidenceSectionPatternContract.directTokenDependencies).toContain("surface-frame");
    expect(brochureEvidenceSectionPatternContract.requiredPrimitives).toContain(
      "brochure-text-link-action when action slot is used",
    );
  });

  it("renders section, heading, and list semantics without interactive controls", () => {
    const html = renderBrochureEvidenceSectionPattern({
      id: "evidence-proof",
      heading: "Evidence in the repo",
      items: [{ label: "Visual proof", body: "verifies responsive behavior." }],
    });

    expect(html).toContain('<section id="evidence-proof"');
    expect(html).toContain('aria-labelledby="evidence-proof-heading"');
    expect(html).toContain('<h2 class="ds-brochure-evidence-heading" id="evidence-proof-heading">Evidence in the repo</h2>');
    expect(html).toContain('<ul class="ds-brochure-evidence-list">');
    expect(html).toContain('class="ds-brochure-evidence-marker" aria-hidden="true"');
    expect(html).not.toContain("<a ");
    expect(html).not.toContain("<button");
  });

  it("renders an optional action through the governed brochure text-link primitive", () => {
    const spec = brochureEvidenceSectionPattern({
      id: "evidence-proof",
      items: [{ label: "Visual proof", body: "verifies responsive behavior." }],
      action: { href: "/design-system/brochure/", label: "View brochure system" },
    });
    const html = renderBrochureEvidenceSectionPattern({
      id: "evidence-proof",
      items: [{ label: "Visual proof", body: "verifies responsive behavior." }],
      action: { href: "/design-system/brochure/", label: "View brochure system" },
    });

    expect(spec.tokenDependencies.brochureTextLinkAction?.primitiveName).toBe("brochure-text-link-action");
    expect(html).toContain('data-brochure-text-link-action=""');
    expect(html).toContain('href="/design-system/brochure/"');
    expect(html).toContain(
      '<span class="ds-brochure-text-link-action-label" data-brochure-text-link-action-label>View brochure system</span>',
    );
  });

  it("escapes evidence text", () => {
    const html = renderBrochureEvidenceSectionPattern({
      id: "evidence-proof",
      heading: "<Evidence>",
      items: [{ label: "Artifacts", body: "record <unsafe> decisions." }],
    });

    expect(html).toContain("&lt;Evidence&gt;");
    expect(html).toContain("record &lt;unsafe&gt; decisions.");
  });

  it("rejects empty required text and unsupported systems", () => {
    expect(() => brochureEvidenceSectionPattern({ heading: " " })).toThrow("heading must be a non-empty string");
    expect(() => brochureEvidenceSectionPattern({ items: [] })).toThrow("requires at least one evidence item");
    expect(() => brochureEvidenceSectionPattern({ items: [{ label: "", body: "copy" }] })).toThrow(
      "items[0].label must be a non-empty string",
    );
    expect(() => brochureEvidenceSectionPattern({ action: { label: "", href: "/design-system/brochure/" } })).toThrow(
      "action.label must be a non-empty string",
    );
    expect(() => brochureEvidenceSectionPattern({ systemKey: "default" })).toThrow(
      'brochure-evidence-section has no system proof for "default"',
    );
  });
});
