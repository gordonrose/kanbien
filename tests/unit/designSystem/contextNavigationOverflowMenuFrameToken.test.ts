import { describe, expect, it } from "vitest";

import {
  contextNavigationOverflowMenuFrameTokenSpec,
  contextNavigationOverflowMenuFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/context-navigation-overflow-menu-frame/systems/default.mjs";

describe("context-navigation-overflow-menu-frame token seam", () => {
  it("exposes governed overflow menu frame values", () => {
    expect(contextNavigationOverflowMenuFrameTokenSpec).toMatchObject({
      contractId: "tokens.context-navigation-overflow-menu-frame",
      systemKey: "default",
      tokenType: "context-navigation-overflow-menu-frame",
    });

    expect(contextNavigationOverflowMenuFrameTokenVariants[0]).toMatchObject({
      id: "context-navigation-overflow-menu-frame-default",
      tokenName: "--context-navigation-overflow-menu-frame",
      minInlineSize: "12rem",
      paddingValue: "0.35rem",
      desktopBottomOffset: "calc(100% + 0.65rem)",
      mobileBottomOffset: "calc(100% + 0.45rem)",
      mobileInlineInset: "0.25rem",
    });
  });
});
