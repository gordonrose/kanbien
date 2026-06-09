import { describe, expect, it } from "vitest";

import {
  drawerOverlayPlacementTokenSpec,
  drawerOverlayPlacementTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/drawer-overlay-placement/systems/default.mjs";

describe("drawer-overlay-placement token seam", () => {
  it("exposes governed page-shell overlay values", () => {
    expect(drawerOverlayPlacementTokenSpec).toMatchObject({
      contractId: "tokens.drawer-overlay-placement",
      systemKey: "default",
      tokenType: "drawer-overlay-placement",
    });

    expect(drawerOverlayPlacementTokenVariants).toHaveLength(1);
    expect(
      drawerOverlayPlacementTokenVariants.find(
        (variant: { id: string }) => variant.id === "drawer-overlay-placement-page-shell",
      ),
    ).toMatchObject({
      tokenName: "--drawer-overlay-placement-page-shell",
      placementRole: "drawer page-shell overlay",
      positionValue: "fixed",
      insetValue: "var(--drawer-overlay-page-shell-inset, 4rem 0 0 4.25rem)",
      inlineSizeValue: "calc(100vw - var(--drawer-overlay-page-shell-inline-offset, 4.25rem))",
      blockSizeValue: "calc(100dvh - var(--drawer-overlay-page-shell-block-start, 4rem))",
      layerValue: "60",
      sourceTokenName: "--panel-stack-placement",
    });
  });
});
