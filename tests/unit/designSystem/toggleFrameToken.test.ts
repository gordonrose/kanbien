import { describe, expect, it } from "vitest";

import {
  toggleFrameTokenSpec,
  toggleFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/toggle-frame/systems/default.mjs";

describe("toggle-frame token seam", () => {
  it("exposes governed toggle frame variants for every required theme and state", () => {
    expect(toggleFrameTokenSpec).toMatchObject({
      contractId: "tokens.toggle-frame",
      systemKey: "default",
      tokenType: "toggle-frame",
    });

    expect(toggleFrameTokenVariants).toHaveLength(15);
    expect(toggleFrameTokenVariants.map((variant) => variant.id)).toEqual([
      "toggle-frame-off-original",
      "toggle-frame-on-original",
      "toggle-frame-read-only-original",
      "toggle-frame-disabled-original",
      "toggle-frame-error-original",
      "toggle-frame-off-dark",
      "toggle-frame-on-dark",
      "toggle-frame-read-only-dark",
      "toggle-frame-disabled-dark",
      "toggle-frame-error-dark",
      "toggle-frame-off-desert",
      "toggle-frame-on-desert",
      "toggle-frame-read-only-desert",
      "toggle-frame-disabled-desert",
      "toggle-frame-error-desert",
    ]);

    expect(toggleFrameTokenVariants[0]).toMatchObject({
      role: "toggle frame",
      state: "off",
      theme: "original",
      trackInlineSize: "2.75rem",
      trackBlockSize: "1.5rem",
      thumbInlineSize: "1.125rem",
      thumbBlockSize: "1.125rem",
      thumbOffsetValue: "0",
      trackPaddingValue: "0.1875rem",
      trackRadiusValue: "999px",
      thumbRadiusValue: "999px",
      motionDurationValue: "120ms",
      motionEasingValue: "ease-out",
    });

    expect(toggleFrameTokenVariants[1]).toMatchObject({
      state: "on",
      theme: "original",
      thumbOffsetValue: "1.25rem",
    });
    expect(toggleFrameTokenVariants.find((variant) => variant.id === "toggle-frame-off-dark")).toMatchObject({
      thumbBackgroundValue: "color-mix(in srgb, #f4f7fb 48%, #171b22)",
    });
    expect(toggleFrameTokenVariants.find((variant) => variant.id === "toggle-frame-on-dark")).toMatchObject({
      thumbBackgroundValue: "color-mix(in srgb, #f4f7fb 68%, #171b22)",
    });
  });

  it("makes dependency derivation and consumer limits explicit", () => {
    const onVariant = toggleFrameTokenVariants.find((variant) => variant.id === "toggle-frame-on-original");
    const errorVariant = toggleFrameTokenVariants.find((variant) => variant.id === "toggle-frame-error-original");

    expect(onVariant?.sourceTokenName).toContain("--primary-color-source-original");
    expect(onVariant?.sourceTokenName).toContain("--primary-tinted-background-original");
    expect(onVariant?.sourceTokenName).toContain("--primary-tinted-foreground-original");
    expect(onVariant?.formulaOrMapping).toContain("primary tint tokens");
    expect(errorVariant?.sourceTokenName).toContain("--error-text-style-default");
    expect(toggleFrameTokenSpec.diagnostic).toMatchObject({
      kind: "dependency-hex-override",
      label: "Review Primary Source Dependency",
    });
    expect(toggleFrameTokenSpec.consumerRestrictions.join(" ")).toContain("native toggle semantics");
    expect(toggleFrameTokenSpec.consumerRestrictions.join(" ")).toContain("minimum-target-size");
  });
});
