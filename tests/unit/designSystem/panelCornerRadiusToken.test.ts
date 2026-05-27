import { describe, expect, it } from "vitest";

import {
  panelCornerRadiusTokenSpec,
  panelCornerRadiusTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/panel-corner-radius/systems/default.mjs";
import { indexNavPanelFrameTokenVariants } from "../../../src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs";

describe("panel-corner-radius token seam", () => {
  it("exposes the governed flush panel radius", () => {
    expect(panelCornerRadiusTokenSpec).toMatchObject({
      contractId: "tokens.panel-corner-radius",
      systemKey: "default",
      tokenType: "panel-corner-radius",
    });

    expect(panelCornerRadiusTokenVariants).toHaveLength(1);
    expect(panelCornerRadiusTokenVariants[0]).toMatchObject({
      id: "panel-corner-radius-flush",
      tokenName: "--panel-corner-radius-flush",
      radiusRole: "flush panel corner radius",
      radiusValue: "0",
      cornerScope: "all outer panel corners",
    });
  });

  it("is consumed by the index nav panel frame instead of a local panel radius", () => {
    const panelFrame = indexNavPanelFrameTokenVariants.find(
      (variant: { id: string }) => variant.id === "index-nav-panel-frame-default",
    );

    expect(panelFrame).toMatchObject({
      radiusValue: "0",
      sourceTokenName: "--panel-corner-radius-flush",
    });
  });
});
