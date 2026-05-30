import { describe, expect, it } from "vitest";

import { recordListItemFrameTokenContract } from "../../../src/frontend/designSystem/layers/02-token/record-list-item-frame/contract.mjs";
import {
  recordListItemFrameTokenSpec,
  tokenDefinitionV1,
} from "../../../src/frontend/designSystem/layers/02-token/record-list-item-frame/systems/default.mjs";

describe("record-list-item-frame token", () => {
  it("declares required roles and value fields", () => {
    expect(recordListItemFrameTokenContract).toMatchObject({
      contractId: "tokens.record-list-item-frame",
      tokenType: "record-list-item-frame",
      requiredVariantRoles: [
        "item row",
        "selected item row",
        "disabled item row",
      ],
    });
    expect(recordListItemFrameTokenContract.requiredValueFields).toEqual(
      expect.arrayContaining([
        "backgroundValue",
        "borderValue",
        "minBlockSize",
        "motionValue",
      ]),
    );
  });

  it("exposes default-system row, selected, and disabled variants", () => {
    expect(tokenDefinitionV1).toMatchObject({
      designSystem: "default",
      uiFamily: "record-list-item",
      tokenType: "record-list-item-frame",
      status: "review-ready",
      page: {
        route: "/design-system/default/tokens/record-list-item-frame",
      },
      codeSeam: {
        governedRuntimeModule: "src/frontend/designSystem/layers/02-token/record-list-item-frame/systems/default.mjs",
        systemTokenExport: "recordListItemFrameTokenSpec",
      },
    });

    expect(tokenDefinitionV1.variants.map((variant) => variant.id)).toEqual(
      expect.arrayContaining([
        "record-list-item-frame-row",
        "record-list-item-frame-selected",
        "record-list-item-frame-disabled",
        "record-list-item-frame-row-dark",
        "record-list-item-frame-selected-desert",
      ]),
    );
    expect(tokenDefinitionV1.variants).toHaveLength(9);
    expect(tokenDefinitionV1.variants.find((variant) => variant.id === "record-list-item-frame-selected")?.value).toMatchObject({
      frameRole: "selected item row",
      backgroundValue: "#e4f4f1",
      borderValue: "#77c2b6",
    });
  });

  it("renders a token spec model for the shared proof page renderer", () => {
    expect(recordListItemFrameTokenSpec).toMatchObject({
      contractId: "tokens.record-list-item-frame",
      systemKey: "default",
      tokenType: "record-list-item-frame",
      title: "Record List Item Frame Token",
    });
    expect(recordListItemFrameTokenSpec.variants).toHaveLength(9);
    expect(recordListItemFrameTokenSpec.consumerRestrictions).toContain(
      "This token does not define row activation, keyboard movement, drag/drop affordances, drawer composition, board columns, or app adoption.",
    );
  });
});
