import { describe, expect, it } from "vitest";

import { toolsNavigationFrameTokenContract } from "../../../src/frontend/designSystem/layers/02-token/tools-navigation-frame/contract.mjs";
import { toolsNavigationFrameTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/tools-navigation-frame/systems/default.mjs";

describe("tools-navigation-frame token", () => {
  it("exposes desktop right-rail values and mobile-hidden posture", () => {
    const [variant] = toolsNavigationFrameTokenSpec.variants;

    expect(variant).toMatchObject({
      id: "tools-navigation-frame-default",
      tokenName: "--tools-navigation-frame",
      desktopPositioningModel: "fixed right rail",
      desktopRailInlineSize: "3.75rem",
      mobileBreakpoint: "44rem",
      mobileVisibility: "hidden",
      itemInlineSize: "2.75rem",
      itemBlockSize: "2.75rem",
    });
  });

  it("documents the mobile boundary", () => {
    expect(toolsNavigationFrameTokenContract.consumerRules).toContain(
      "Mobile tools-navigation is hidden in this token version; consumers must not invent a mobile drawer, bottom bar, floating launcher, or overflow menu from this token.",
    );
  });
});
