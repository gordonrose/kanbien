import { describe, expect, it } from "vitest";

import {
  panelStackPlacementTokenSpec,
  panelStackPlacementTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/panel-stack-placement/systems/default.mjs";

describe("panel-stack-placement token seam", () => {
  it("exposes governed stack adjacency, overlay, and layering values", () => {
    expect(panelStackPlacementTokenSpec).toMatchObject({
      contractId: "tokens.panel-stack-placement",
      systemKey: "default",
      tokenType: "panel-stack-placement",
    });

    expect(panelStackPlacementTokenVariants).toHaveLength(1);
    expect(
      panelStackPlacementTokenVariants.find(
        (variant: { id: string }) => variant.id === "panel-stack-placement-default",
      ),
    ).toMatchObject({
      tokenName: "--panel-stack-placement",
      originSides: "left and right",
      desktopAdjacencyGapValue: "0px",
      overlayInsetValue: "0px",
      mobileBreakpointValue: "44rem",
      layerBaseValue: "30",
      layerStepValue: "1",
      sourceTokenName: "--panel-frame",
    });
  });
});
