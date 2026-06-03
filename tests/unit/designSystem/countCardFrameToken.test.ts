import { describe, expect, it } from "vitest";

import {
  countCardFrameTokenSpec,
  countCardFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/count-card-frame/systems/default.mjs";

describe("count-card-frame token seam", () => {
  it("exposes governed count-card frame states across themes", () => {
    expect(countCardFrameTokenSpec).toMatchObject({
      contractId: "tokens.count-card-frame",
      systemKey: "default",
      tokenType: "count-card-frame",
    });

    expect(countCardFrameTokenVariants).toHaveLength(15);
    expect(countCardFrameTokenVariants.map((variant) => variant.state)).toEqual([
      "default",
      "selected",
      "disabled",
      "warning",
      "error",
      "default",
      "selected",
      "disabled",
      "warning",
      "error",
      "default",
      "selected",
      "disabled",
      "warning",
      "error",
    ]);
  });

  it("derives selected and error values from signed lower-layer tokens", () => {
    const selected = countCardFrameTokenVariants.find(
      (variant) => variant.id === "count-card-frame-selected-original",
    );
    const error = countCardFrameTokenVariants.find((variant) => variant.id === "count-card-frame-error-original");

    expect(selected?.sourceTokenName).toContain("--primary-tinted-background-original");
    expect(selected?.sourceTokenName).toContain("--primary-tinted-foreground-original");
    expect(selected?.formulaOrMapping).toContain("signed primary tint tokens");
    expect(error?.sourceTokenName).toContain("--error-text-style-default");
    expect(error?.formulaOrMapping).toContain("error-text-style");
  });

  it("derives warning from the broader status-color warning token", () => {
    const warning = countCardFrameTokenVariants.find(
      (variant) => variant.id === "count-card-frame-warning-original",
    );

    expect(warning?.sourceTokenName).toContain("--status-color-warning-original");
    expect(warning?.formulaOrMapping).toContain("status-color warning");
    expect(countCardFrameTokenSpec.consumerRestrictions.join(" ")).toContain("status-color");
  });
});
