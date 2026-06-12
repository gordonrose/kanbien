import { describe, expect, it } from "vitest";

import {
  contextNavigationFrameTokenSpec,
  contextNavigationFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs";

describe("context-navigation-frame token seam", () => {
  it("exposes governed context navigation frame values", () => {
    expect(contextNavigationFrameTokenSpec).toMatchObject({
      contractId: "tokens.context-navigation-frame",
      systemKey: "default",
      tokenType: "context-navigation-frame",
    });

    expect(contextNavigationFrameTokenVariants).toHaveLength(1);
    expect(
      contextNavigationFrameTokenVariants.find((variant: { id: string }) => variant.id === "context-navigation-frame-default"),
    ).toMatchObject({
      tokenName: "--context-navigation-frame",
      frameRole: "context navigation frame",
      desktopRailInlineSize: "4.25rem",
      desktopRailTopOffset: "var(--context-nav-top, 8rem)",
      desktopPrimaryScrollBehavior: "primary zone flexes and scrolls with overscroll-behavior: contain",
      utilityZoneAnchorBehavior: "bottom utility zone remains anchored with margin-top: auto",
      mobileBreakpoint: "44rem",
      mobileBarColumns: "repeat(5, minmax(0, 1fr))",
      mobilePageBottomReserve: "5.75rem",
      mobileDrawerBottomOffset: "calc(4.125rem + env(safe-area-inset-bottom, 0))",
      mobileViewportPinningBehavior: "bottom bar remains fixed to the visual viewport bottom during document scroll and page-end pressure",
    });
  });
});
