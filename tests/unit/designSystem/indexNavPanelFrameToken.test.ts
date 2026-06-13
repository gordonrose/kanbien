import { describe, expect, it } from "vitest";

import {
  indexNavPanelFrameTokenSpec,
  indexNavPanelFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs";

describe("index-nav-panel-frame token seam", () => {
  it("exposes governed panel, header, and add-action frame variants for every supported theme", () => {
    expect(indexNavPanelFrameTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-panel-frame",
      systemKey: "default",
      tokenType: "index-nav-panel-frame",
    });

    expect(indexNavPanelFrameTokenVariants).toHaveLength(9);
    expect(indexNavPanelFrameTokenVariants.find((variant: { id: string }) => variant.id === "index-nav-panel-frame-default")).toMatchObject({
      tokenName: "--index-nav-panel-frame",
      minInlineSize: "10rem",
      standardInlineSize: "13rem",
      doubleInlineSize: "26rem",
      maxInlineSize: "32rem",
      mobileInlineSize: "100vw",
      mobileBreakpointValue: "44rem",
      maxBlockSize: "32rem",
      radiusValue: "0",
      sourceTokenName: "--panel-corner-radius-flush",
    });
    expect(indexNavPanelFrameTokenVariants.find((variant: { id: string }) => variant.id === "index-nav-panel-action-default")).toMatchObject({
      tokenName: "--index-nav-panel-action-frame",
      frameRole: "panel action",
    });
    expect(indexNavPanelFrameTokenVariants.find((variant: { id: string }) => variant.id === "index-nav-panel-header-default")).toMatchObject({
      tokenName: "--index-nav-panel-header-frame",
      frameRole: "panel header",
      blockSize: "3.25rem",
      minBlockSize: "3.25rem",
      maxBlockSizeValue: "3.25rem",
      stickyInsetBlockStart: "0",
      borderValue: "#dbe4f0",
    });
    expect(indexNavPanelFrameTokenVariants.find((variant: { id: string }) => variant.id === "index-nav-panel-frame-dark")).toMatchObject({
      tokenName: "--index-nav-panel-frame-dark",
      frameRole: "panel frame",
      backgroundValue: "#171b22",
      foregroundValue: "#f4f7fb",
      borderValue: "#303845",
      theme: "dark",
    });
    expect(indexNavPanelFrameTokenVariants.find((variant: { id: string }) => variant.id === "index-nav-panel-header-dark")).toMatchObject({
      tokenName: "--index-nav-panel-header-frame-dark",
      frameRole: "panel header",
      borderValue: "#303845",
      theme: "dark",
    });
    expect(indexNavPanelFrameTokenVariants.find((variant: { id: string }) => variant.id === "index-nav-panel-action-desert")).toMatchObject({
      tokenName: "--index-nav-panel-action-frame-desert",
      frameRole: "panel action",
      theme: "desert",
    });
  });
});
