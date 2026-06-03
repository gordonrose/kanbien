import { describe, expect, it } from "vitest";

import { dragDropAffordanceFrameTokenContract } from "../../../src/frontend/designSystem/layers/02-token/drag-drop-affordance-frame/contract.mjs";
import {
  dragDropAffordanceFrameTokenSpec,
  tokenDefinitionV1,
} from "../../../src/frontend/designSystem/layers/02-token/drag-drop-affordance-frame/systems/default.mjs";

type TokenVariant = {
  id: string;
  value?: unknown;
};

describe("drag-drop-affordance-frame token", () => {
  it("declares reusable drag/drop roles and value fields", () => {
    expect(dragDropAffordanceFrameTokenContract).toMatchObject({
      contractId: "tokens.drag-drop-affordance-frame",
      tokenType: "drag-drop-affordance-frame",
      requiredVariantRoles: [
        "drag source",
        "drag preview",
        "drop marker",
      ],
    });
    expect(dragDropAffordanceFrameTokenContract.requiredValueFields).toEqual(
      expect.arrayContaining([
        "accentValue",
        "previewElevationValue",
        "markerMinBlockSize",
        "markerLabelValue",
      ]),
    );
  });

  it("exposes default-system drag source, preview, and marker variants", () => {
    expect(tokenDefinitionV1).toMatchObject({
      designSystem: "default",
      uiFamily: "drag-drop-affordance",
      tokenType: "drag-drop-affordance-frame",
      status: "review-ready",
      page: {
        route: "/design-system/default/tokens/drag-drop-affordance-frame",
      },
      codeSeam: {
        governedRuntimeModule: "src/frontend/designSystem/layers/02-token/drag-drop-affordance-frame/systems/default.mjs",
        systemTokenExport: "dragDropAffordanceFrameTokenSpec",
      },
    });

    expect(tokenDefinitionV1.variants.map((variant: TokenVariant) => variant.id)).toEqual(
      expect.arrayContaining([
        "drag-drop-affordance-frame-source",
        "drag-drop-affordance-frame-preview",
        "drag-drop-affordance-frame-drop-marker",
        "drag-drop-affordance-frame-source-dark",
        "drag-drop-affordance-frame-drop-marker-desert",
      ]),
    );
    expect(tokenDefinitionV1.variants).toHaveLength(9);
    expect(tokenDefinitionV1.variants.find((variant: TokenVariant) => variant.id === "drag-drop-affordance-frame-drop-marker")?.value).toMatchObject({
      frameRole: "drop marker",
      markerMinBlockSize: "4.75rem",
      markerLabelValue: "Drop here",
    });
  });

  it("renders a token spec model for later patterns to consume", () => {
    expect(dragDropAffordanceFrameTokenSpec).toMatchObject({
      contractId: "tokens.drag-drop-affordance-frame",
      systemKey: "default",
      tokenType: "drag-drop-affordance-frame",
      title: "Drag Drop Affordance Frame Token",
    });
    expect(dragDropAffordanceFrameTokenSpec.variants).toHaveLength(9);
    expect(dragDropAffordanceFrameTokenSpec.consumerRestrictions).toContain(
      "This token does not define drag event handling, keyboard fallback behavior, persistence, board columns, or drawer composition.",
    );
  });
});
