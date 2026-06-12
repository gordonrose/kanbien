import { describe, expect, it } from "vitest";

import {
  bodyRegionFrameTokenSpec,
  bodyRegionFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/body-region-frame/systems/default.mjs";

describe("body-region-frame token seam", () => {
  it("exposes governed inner body region frame values", () => {
    expect(bodyRegionFrameTokenSpec).toMatchObject({
      contractId: "tokens.body-region-frame",
      systemKey: "default",
      tokenType: "body-region-frame",
    });

    expect(bodyRegionFrameTokenVariants).toHaveLength(3);
    expect(bodyRegionFrameTokenVariants.find((variant: { id: string }) => variant.id === "body-region-frame-default")).toMatchObject({
      tokenName: "--body-region-frame",
      frameRole: "body region frame",
      backgroundValue: "#ffffff",
      foregroundValue: "#111827",
      paddingBlockValue: "1rem",
      paddingInlineValue: "1rem",
      gapValue: "0.75rem",
      sectionGapValue: "1rem",
      minInlineSize: "26rem",
      maxInlineSize: "100%",
      minBlockSize: "12rem",
      desktopMaxBlockSize: "32rem",
      stateSpacingValue: "0.75rem",
      sourceTokenName: "--panel-frame",
      theme: "original",
    });
    expect(
      bodyRegionFrameTokenVariants.find((variant: { id: string }) => variant.id === "body-region-frame-default-dark"),
    ).toMatchObject({
      tokenName: "--body-region-frame-dark",
      backgroundValue: "#171b22",
      foregroundValue: "#f4f7fb",
      borderValue: "#303845",
      sourceTokenName: "--panel-frame-dark",
      theme: "dark",
    });
    expect(
      bodyRegionFrameTokenVariants.find((variant: { id: string }) => variant.id === "body-region-frame-default-desert"),
    ).toMatchObject({
      tokenName: "--body-region-frame-desert",
      backgroundValue: "#fffaf0",
      foregroundValue: "#493327",
      borderValue: "#ead8be",
      sourceTokenName: "--panel-frame-desert",
      theme: "desert",
    });
  });
});
