import { describe, expect, it } from "vitest";

import {
  feedbackTextStyleTokenSpec,
  feedbackTextStyleTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/feedback-text-style/systems/default.mjs";

describe("feedback-text-style token seam", () => {
  it("exposes governed feedback text variants for every supported tone and theme", () => {
    expect(feedbackTextStyleTokenSpec).toMatchObject({
      contractId: "tokens.feedback-text-style",
      systemKey: "default",
      tokenType: "feedback-text-style",
    });

    expect(feedbackTextStyleTokenVariants.map((variant: { id: string }) => variant.id)).toEqual([
      "feedback-text-style-neutral-original",
      "feedback-text-style-warning-original",
      "feedback-text-style-error-original",
      "feedback-text-style-neutral-dark",
      "feedback-text-style-warning-dark",
      "feedback-text-style-error-dark",
      "feedback-text-style-neutral-desert",
      "feedback-text-style-warning-desert",
      "feedback-text-style-error-desert",
    ]);
  });

  it("derives foreground values from signed upstream token seams", () => {
    const neutralDark = feedbackTextStyleTokenVariants.find(
      (variant: { id: string }) => variant.id === "feedback-text-style-neutral-dark",
    );
    const warningDark = feedbackTextStyleTokenVariants.find(
      (variant: { id: string }) => variant.id === "feedback-text-style-warning-dark",
    );
    const errorDark = feedbackTextStyleTokenVariants.find(
      (variant: { id: string }) => variant.id === "feedback-text-style-error-dark",
    );

    expect(neutralDark).toMatchObject({
      tokenName: "--feedback-text-style-neutral-dark",
      sourceTokenName: "--background-surface-dark",
      foregroundValue: "#f4f7fb",
      fontSizeValue: "0.875rem",
      fontWeightValue: "700",
      lineHeightValue: "1.35",
      letterSpacingValue: "0",
    });
    expect(warningDark).toMatchObject({
      sourceTokenName: "--status-color-warning-dark",
      fontWeightValue: "800",
    });
    expect(errorDark).toMatchObject({
      sourceTokenName: "--text-control-frame-error-dark",
      fontWeightValue: "800",
    });
  });
});
