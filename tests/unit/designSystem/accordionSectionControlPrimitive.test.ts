import { describe, expect, it } from "vitest";

import {
  accordionSectionControlPrimitive,
  renderAccordionSectionControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/accordion-section-control/index.mjs";

describe("accordion-section-control primitive", () => {
  it("wires header button and controlled region semantics", () => {
    const spec = accordionSectionControlPrimitive({
      id: "identity-section",
      title: "Identity",
      expanded: true,
      theme: "dark",
      tone: "tinted",
      supportingText: "Name and description for this view definition.",
    });

    expect(spec).toMatchObject({
      primitiveName: "accordion-section-control",
      theme: "dark",
      tone: "tinted",
      expanded: true,
      ids: {
        buttonId: "identity-section-button",
        panelId: "identity-section-panel",
      },
      tokenDependencies: {
        accordionFrame: { tokenName: "--accordion-frame-tinted-dark" },
        labelTextStyle: { tokenName: "--label-text-style-short-default" },
        supportingTextStyle: { tokenName: "--supporting-text-style-default" },
        focusRing: { tokenName: "--focus-ring-visible-dark" },
        minimumTargetSize: { tokenName: "--target-size-interactive-min" },
      },
      systemDependencies: {
        glyphRegistry: { semanticGlyphName: "chevron-down" },
      },
    });
    expect(spec.buttonAttributes["aria-expanded"]).toBe("true");
    expect(spec.buttonAttributes["aria-controls"]).toBe("identity-section-panel");
    expect(spec.panelAttributes["aria-labelledby"]).toBe("identity-section-button");
    expect(spec.panelAttributes.hidden).toBeNull();
  });

  it("renders collapsed content hidden and title disclosure seam", () => {
    const html = renderAccordionSectionControlPrimitive({
      id: "identity-section",
      title: "Identity with very long section title",
      expanded: false,
      contentHtml: "<p>Proof content</p>",
      supportingText: "Supporting text with a long governed line",
    });

    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="identity-section-panel"');
    expect(html).toContain('hidden');
    expect(html).toContain('data-truncating-label');
    expect(html).toContain('data-truncating-label-text-style="supporting"');
    expect(html).toContain("Proof content");
  });
});
