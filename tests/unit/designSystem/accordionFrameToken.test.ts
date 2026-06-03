import { describe, expect, it } from "vitest";

import {
  accordionFrameTokenSpec,
  accordionFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/accordion-frame/systems/default.mjs";

describe("accordion-frame token seam", () => {
  it("exposes governed accordion frame variants for supported themes", () => {
    expect(accordionFrameTokenSpec).toMatchObject({
      contractId: "tokens.accordion-frame",
      systemKey: "default",
      tokenType: "accordion-frame",
    });

    expect(accordionFrameTokenVariants).toHaveLength(6);
    expect(accordionFrameTokenVariants.map((variant) => variant.id)).toEqual([
      "accordion-frame-original",
      "accordion-frame-tinted-original",
      "accordion-frame-dark",
      "accordion-frame-tinted-dark",
      "accordion-frame-desert",
      "accordion-frame-tinted-desert",
    ]);
  });

  it("derives frame values from signed lower-layer tokens", () => {
    const dark = accordionFrameTokenVariants.find((variant) => variant.id === "accordion-frame-dark");

    expect(dark).toMatchObject({
      tokenName: "--accordion-frame-dark",
      frameRole: "accordion section frame",
      theme: "dark",
      headerBackgroundValue: "#171b22",
      headerForegroundValue: "#f4f7fb",
      contentBackgroundValue: "#171b22",
      headerMinBlockSize: "44px",
      indicatorInlineSize: "1rem",
      radiusValue: "0",
    });
    expect(dark?.sourceTokenName).toContain("--background-surface-dark");
    expect(dark?.sourceTokenName).toContain("--icon-button-glyph-size");
    expect(dark?.sourceTokenName).toContain("--target-size-interactive-min");
    expect(dark?.sourceTokenName).toContain("--panel-corner-radius-flush");

    const tinted = accordionFrameTokenVariants.find((variant) => variant.id === "accordion-frame-tinted-original");
    expect(tinted).toMatchObject({
      tokenName: "--accordion-frame-tinted-original",
      tone: "tinted",
      headerBackgroundValue: "color-mix(in srgb, #635bff 4%, #ffffff)",
      sourceTokenName: expect.stringContaining("--primary-tinted-background-original"),
    });
  });
});
