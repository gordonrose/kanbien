import { describe, expect, it } from "vitest";

import {
  standardPageShellFrameTokenSpec,
  standardPageShellFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/standard-page-shell-frame/systems/default.mjs";

describe("standard-page-shell-frame token seam", () => {
  it("exposes governed parent shell frame values", () => {
    expect(standardPageShellFrameTokenSpec).toMatchObject({
      contractId: "tokens.standard-page-shell-frame",
      systemKey: "default",
      tokenType: "standard-page-shell-frame",
    });

    expect(standardPageShellFrameTokenVariants).toHaveLength(1);
    expect(
      standardPageShellFrameTokenVariants.find(
        (variant: { id: string }) => variant.id === "standard-page-shell-frame-default",
      ),
    ).toMatchObject({
      tokenName: "--standard-page-shell-frame",
      frameRole: "standard page shell frame",
      topNavLayer: "6",
      subNavLayer: "4",
      contextNavLayer: "2147481000",
      contextNavDrawerLayer: "2147481001",
      contextNavMenuLayer: "2147481002",
      tooltipLayer: "2147483000",
      topNavPaddingBlockValue: "0.5rem",
      topNavPaddingInlineValue: "1rem",
      subNavPaddingBlockValue: "0.75rem",
      subNavSearchMaxInlineSize: "40rem",
      mobileBreakpoint: "44rem",
      contextRailInlineSize: "4.25rem",
      contextRailItemSize: "2.75rem",
      mobileContextBarOffset: "calc(4.125rem + env(safe-area-inset-bottom, 0))",
      mobileShellPagePaddingBottom: "5.75rem",
      sidePanelInlineSize: "min(22rem, calc(100vw - 4.25rem))",
      secondarySidePanelInlineStart: "calc(4.25rem + min(22rem, calc(100vw - 4.25rem)))",
      mobileContextBarColumns: "repeat(5, minmax(0, 1fr))",
      sourceTokenName: "40-system shell CSS",
    });
  });
});
