import { describe, expect, it } from "vitest";

import {
  panelHeaderFrameTokenSpec,
  panelHeaderFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/panel-header-frame/systems/default.mjs";

describe("panel-header-frame token seam", () => {
  it("exposes governed generic panel header geometry", () => {
    expect(panelHeaderFrameTokenSpec).toMatchObject({
      contractId: "tokens.panel-header-frame",
      systemKey: "default",
      tokenType: "panel-header-frame",
    });

    expect(panelHeaderFrameTokenVariants).toHaveLength(1);
    expect(panelHeaderFrameTokenVariants[0]).toMatchObject({
      tokenName: "--panel-header-frame",
      frameRole: "panel header",
      blockSize: "3.25rem",
      minBlockSize: "3.25rem",
      maxBlockSizeValue: "3.25rem",
      stickyInsetBlockStart: "0",
      borderValue: "#dbe4f0",
    });
  });
});
