import { describe, expect, it } from "vitest";

import {
  detailSlotFrameTokenSpec,
  detailSlotFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/detail-slot-frame/systems/default.mjs";

describe("detail-slot-frame token seam", () => {
  it("exposes governed themed detail slot frame variants", () => {
    expect(detailSlotFrameTokenSpec).toMatchObject({
      contractId: "tokens.detail-slot-frame",
      systemKey: "default",
      tokenType: "detail-slot-frame",
    });

    expect(detailSlotFrameTokenVariants).toHaveLength(3);
    expect(detailSlotFrameTokenVariants.find((variant: { id: string }) => variant.id === "detail-slot-frame-dark")).toMatchObject({
      tokenName: "--detail-slot-frame-dark",
      theme: "dark",
      backgroundValue: "#171b22",
      foregroundValue: "#f4f7fb",
      borderValue: "#334155",
      detailSurfaceValue: "#1e2634",
      minInlineSize: "18rem",
      maxBlockSize: "32rem",
      preview: {
        kind: "detail-slot-frame-sample",
        detailSurface: "#1e2634",
      },
    });
  });
});
