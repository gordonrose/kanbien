import { describe, expect, it } from "vitest";
import {
  paragraphColourVariants,
  paragraphTokenDefinitions,
  renderParagraphTokenSections,
} from "../../../src/frontend/designSystem/assets/tokenParagraphModel.mjs";

describe("paragraph token model seam", () => {
  it("exports governed paragraph typography with semantic colour variants", () => {
    const tokens = paragraphTokenDefinitions.map((definition: (typeof paragraphTokenDefinitions)[number]) => definition.token);
    const variants = paragraphColourVariants.map((variant: (typeof paragraphColourVariants)[number]) => variant.key);

    expect(tokens).toEqual([
      "paragraph.main",
      "paragraph.mainLarge",
      "paragraph.mainExtraLarge",
      "paragraph.mainMinor",
      "paragraph.label",
    ]);
    expect(variants).toEqual(["normal", "dark", "desert", "warning", "success", "error"]);

    expect(paragraphTokenDefinitions).toContainEqual(
      expect.objectContaining({
        token: "paragraph.main",
        warningInk: "var(--paragraph-warning-ink)",
        warningInkNote: "var(--colour-warning-100)",
      }),
    );
    expect(paragraphTokenDefinitions).toContainEqual(
      expect.objectContaining({
        token: "paragraph.mainLarge",
        successInk: "var(--paragraph-success-ink)",
        successInkNote: "var(--colour-success-100)",
      }),
    );
    expect(paragraphTokenDefinitions).toContainEqual(
      expect.objectContaining({
        token: "paragraph.label",
        errorInk: "var(--paragraph-error-ink)",
        errorInkNote: "var(--colour-error-100)",
      }),
    );
  });

  it("renders the token review sections from the consumable model", () => {
    const html = renderParagraphTokenSections();

    expect(html).toContain("Main Extra Large");
    expect(html).toContain("Main Minor");
    expect(html).toContain("<code>1rem</code>");
    expect(html).toContain("<code>1.25rem</code>");
    expect(html).toContain("<code>1.5rem</code>");
    expect(html).toContain("<code>0.75rem</code>");
    expect(html).toContain("<code>1.2</code>");
    expect(html).toContain("<code>600</code>");
    expect(html).toContain("<code>800</code>");
    expect(html).toContain("<code>uppercase</code>");
    expect(html).toContain("computed as 1.2em");
    expect(html).toContain("var(--paragraph-main-ink)");
    expect(html).toContain("var(--paragraph-label-ink)");
    expect(html).toContain("var(--colour-text-20)");
    expect(html).toContain("var(--colour-primary-100)");
    expect(html).toContain("var(--colour-dark-100)");
    expect(html).toContain("var(--colour-desert-100)");
    expect(html).toContain("var(--colour-warning-100)");
    expect(html).toContain("var(--colour-success-100)");
    expect(html).toContain("var(--colour-error-100)");
    expect(html).toContain('aria-label="Main colour previews"');
    expect(html).toContain('aria-label="Main Large colour previews"');
    expect(html).toContain('aria-label="Main Extra Large colour previews"');
    expect(html).toContain('aria-label="Main Minor colour previews"');
    expect(html).toContain('aria-label="Label colour previews"');
    expect(html).toContain('data-theme-scope="dark"');
    expect(html).toContain('data-theme-scope="desert"');
    expect(html).toContain("token-paragraph-colour-warning");
    expect(html).toContain("token-paragraph-colour-success");
    expect(html).toContain("token-paragraph-colour-error");
    expect(html).toContain("paragraph.mainExtraLarge");
    expect(html).not.toContain("paragraph.warning");
    expect(html).not.toContain("paragraph.success");
    expect(html).not.toContain("paragraph.error");
  });
});
