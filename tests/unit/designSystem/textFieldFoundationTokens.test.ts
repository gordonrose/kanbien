import { describe, expect, it } from "vitest";

import { fieldValueTextStyleTokenVariants } from "../../../src/frontend/designSystem/layers/02-token/field-value-text-style/systems/default.mjs";
import { textControlFrameTokenVariants } from "../../../src/frontend/designSystem/layers/02-token/text-control-frame/systems/default.mjs";

type TokenVariantWithId = { id: string };

describe("text field foundation tokens", () => {
  it("exposes field value text and text control frame seams", () => {
    expect(fieldValueTextStyleTokenVariants[0]).toMatchObject({
      tokenName: "--field-value-text-style-default",
      fontSizeValue: "1rem",
      fontWeightValue: "400",
      lineHeightValue: "1.4",
      letterSpacingValue: "0",
    });

    expect(textControlFrameTokenVariants.map((variant: TokenVariantWithId) => variant.id)).toEqual([
      "text-control-frame-default-original",
      "text-control-frame-required-original",
      "text-control-frame-read-only-original",
      "text-control-frame-disabled-original",
      "text-control-frame-error-original",
      "text-control-frame-default-dark",
      "text-control-frame-required-dark",
      "text-control-frame-read-only-dark",
      "text-control-frame-disabled-dark",
      "text-control-frame-error-dark",
      "text-control-frame-default-desert",
      "text-control-frame-required-desert",
      "text-control-frame-read-only-desert",
      "text-control-frame-disabled-desert",
      "text-control-frame-error-desert",
    ]);

    expect(textControlFrameTokenVariants[0]).toMatchObject({
      tokenName: "--text-control-frame-default-original",
      frameRole: "text control default frame",
      state: "default",
      theme: "original",
      borderValue: "color-mix(in srgb, #0f1115 16%, #ffffff)",
      radiusValue: "0.375rem",
      minBlockSize: "44px",
      sourceTokenName: "--background-surface-original + --target-size-interactive-min",
    });
    expect(textControlFrameTokenVariants.find((variant: TokenVariantWithId) => variant.id === "text-control-frame-error-dark")).toMatchObject({
      state: "error",
      theme: "dark",
      backgroundValue: "color-mix(in srgb, #ffb4b4 6%, #171b22)",
      foregroundValue: "#ffb4b4",
      borderValue: "#ffb4b4",
    });
  });
});
