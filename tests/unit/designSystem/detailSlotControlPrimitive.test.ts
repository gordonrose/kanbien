import { describe, expect, it } from "vitest";

import {
  detailSlotControlPrimitive,
  detailSlotControlPrimitiveContract,
  renderDetailSlotControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/detail-slot-control/index.mjs";

describe("detail-slot-control primitive seam", () => {
  it("consumes the themed detail-slot-frame token", () => {
    const primitive = detailSlotControlPrimitive({
      id: "detail-slot-test",
      theme: "dark",
      label: "Organization detail",
      title: "Organization detail",
    });

    expect(primitive).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "detail-slot-control",
      tokenDependencies: {
        detailSlotFrame: {
          tokenName: "--detail-slot-frame-dark",
          variantId: "detail-slot-frame-dark",
        },
      },
    });
    expect(primitive.styleVars["--primitive-detail-slot-background"]).toBe("#171b22");
    expect(primitive.styleVars["--primitive-detail-slot-surface"]).toBe("#1e2634");
  });

  it("renders aside semantics and composes the governed icon button close action", () => {
    const html = renderDetailSlotControlPrimitive({
      id: "detail-slot-render",
      label: "Organization detail",
      title: "Organization detail",
      bodyHtml: '<div data-test-body>Body</div>',
    });

    expect(html).toContain('data-detail-slot-control=""');
    expect(html).toContain('aria-label="Organization detail"');
    expect(html).toContain('data-icon-button-control=""');
    expect(html).toContain('aria-label="Close detail"');
    expect(html).toContain("data-test-body");
  });

  it("documents the primitive boundary", () => {
    expect(detailSlotControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "detail-slot-control",
      status: "review-ready",
      requiredTokens: ["detail-slot-frame"],
      requiredPrimitives: ["icon-button-control"],
      closeEventName: "detail-slot-control:close",
    });
  });
});
