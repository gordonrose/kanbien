import { describe, expect, it } from "vitest";

import { fieldValueTextStyleTokenVariants } from "../../../src/frontend/designSystem/layers/02-token/field-value-text-style/systems/default.mjs";
import { textControlFrameTokenVariants } from "../../../src/frontend/designSystem/layers/02-token/text-control-frame/systems/default.mjs";

describe("text field foundation tokens", () => {
  it("exposes field value text and text control frame seams", () => {
    expect(fieldValueTextStyleTokenVariants[0]).toMatchObject({
      tokenName: "--field-value-text-style-default",
      fontSizeValue: "1rem",
      fontWeightValue: "400",
      lineHeightValue: "1.4",
      letterSpacingValue: "0",
    });

    expect(textControlFrameTokenVariants.map((variant) => variant.id)).toEqual([
      "text-control-frame-default",
      "text-control-frame-required",
      "text-control-frame-read-only",
      "text-control-frame-disabled",
      "text-control-frame-error",
    ]);

    expect(textControlFrameTokenVariants[0]).toMatchObject({
      tokenName: "--text-control-frame-default",
      frameRole: "text control default frame",
      state: "default",
      borderValue: "#dbe4f0",
      radiusValue: "0.375rem",
      minBlockSize: "44px",
      sourceTokenName: "body-region-frame + minimum-target-size",
    });
    expect(textControlFrameTokenVariants.find((variant) => variant.id === "text-control-frame-error")).toMatchObject({
      state: "error",
      backgroundValue: "#fff7f7",
      foregroundValue: "#7a1f1f",
      borderValue: "#d94a4a",
    });
  });
});
