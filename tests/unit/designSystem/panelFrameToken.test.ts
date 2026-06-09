import { describe, expect, it } from "vitest";

import {
  panelFrameTokenSpec,
  panelFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs";

describe("panel-frame token seam", () => {
  it("exposes governed generic panel frame, header, and action variants", () => {
    expect(panelFrameTokenSpec).toMatchObject({
      contractId: "tokens.panel-frame",
      systemKey: "default",
      tokenType: "panel-frame",
    });

    expect(panelFrameTokenVariants).toHaveLength(3);
    expect(panelFrameTokenVariants.find((variant: { id: string }) => variant.id === "panel-frame-default")).toMatchObject({
      tokenName: "--panel-frame",
      theme: "original",
      minInlineSize: "10rem",
      standardInlineSize: "13rem",
      doubleInlineSize: "26rem",
      maxInlineSize: "100%",
      mobileInlineSize: "100vw",
      mobileBreakpointValue: "44rem",
      maxBlockSize: "32rem",
      radiusValue: "0",
      sourceTokenName: "--panel-corner-radius-flush + background-color",
    });
    expect(panelFrameTokenVariants.find((variant: { id: string }) => variant.id === "panel-frame-dark")).toMatchObject({
      tokenName: "--panel-frame-dark",
      theme: "dark",
      sourceTokenName: "--panel-corner-radius-flush + background-color",
      backgroundValue: "#171b22",
      foregroundValue: "#f4f7fb",
      borderValue: "#303845",
    });
    expect(panelFrameTokenVariants.find((variant: { id: string }) => variant.id === "panel-frame-desert")).toMatchObject({
      tokenName: "--panel-frame-desert",
      theme: "desert",
      sourceTokenName: "--panel-corner-radius-flush + background-color",
      backgroundValue: "#fffaf0",
      foregroundValue: "#493327",
      borderValue: "#ead8be",
    });
  });
});
