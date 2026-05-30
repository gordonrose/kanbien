import { describe, expect, it } from "vitest";

import { menuSimpleSelectFrameTokenContract } from "../../../src/frontend/designSystem/layers/02-token/menu-simple-select-frame/contract.mjs";
import {
  menuSimpleSelectFrameTokenSpec,
  tokenDefinitionV1,
} from "../../../src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs";

describe("menu-simple-select-frame token", () => {
  it("declares required frame roles and value fields", () => {
    expect(menuSimpleSelectFrameTokenContract).toMatchObject({
      contractId: "tokens.menu-simple-select-frame",
      tokenType: "menu-simple-select-frame",
      requiredVariantRoles: [
        "trigger frame",
        "icon trigger frame",
        "menu panel",
        "option item",
        "current option item",
        "disabled option item",
      ],
    });
    expect(menuSimpleSelectFrameTokenContract.requiredValueFields).toEqual(
      expect.arrayContaining([
        "backgroundValue",
        "foregroundValue",
        "borderValue",
        "radiusValue",
        "paddingBlockValue",
        "paddingInlineValue",
        "minBlockSize",
        "maxBlockSize",
        "zIndexValue",
        "scrollBehavior",
      ]),
    );
  });

  it("exposes governed trigger, panel, and option state variants", () => {
    expect(tokenDefinitionV1).toMatchObject({
      designSystem: "default",
      uiFamily: "menu-simple-select",
      tokenType: "menu-simple-select-frame",
      status: "review-ready",
      page: {
        route: "/design-system/default/tokens/menu-simple-select-frame",
      },
      codeSeam: {
        governedRuntimeModule: "src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs",
        systemTokenExport: "menuSimpleSelectFrameTokenSpec",
      },
    });

    expect(tokenDefinitionV1.variants.map((variant) => variant.id)).toEqual(
      expect.arrayContaining([
        "menu-simple-select-trigger-frame-default",
        "menu-simple-select-trigger-frame-icon",
        "menu-simple-select-panel-frame-default",
        "menu-simple-select-option-frame-rest",
        "menu-simple-select-option-frame-current",
        "menu-simple-select-option-frame-disabled",
        "menu-simple-select-trigger-frame-default-dark",
        "menu-simple-select-trigger-frame-icon-dark",
        "menu-simple-select-panel-frame-default-dark",
        "menu-simple-select-trigger-frame-default-desert",
        "menu-simple-select-trigger-frame-icon-desert",
        "menu-simple-select-panel-frame-default-desert",
      ]),
    );
    expect(tokenDefinitionV1.variants).toHaveLength(18);
    expect(tokenDefinitionV1.variants.find((variant) => variant.id === "menu-simple-select-trigger-frame-icon")?.value).toMatchObject({
      minInlineSize: "2.75rem",
      maxInlineSize: "2.75rem",
      paddingInlineValue: "0",
    });
    expect(tokenDefinitionV1.variants.find((variant) => variant.id.endsWith("panel-frame-default"))?.value).toMatchObject({
      maxBlockSize: "32rem",
      zIndexValue: "20",
      scrollBehavior: "anchored panel owns internal option scrolling when options exceed max block size",
    });
    expect(tokenDefinitionV1.variants.find((variant) => variant.id.endsWith("option-frame-current"))?.metadata).toMatchObject({
      state: "current",
    });
  });

  it("renders a token spec model for the shared proof page renderer", () => {
    expect(menuSimpleSelectFrameTokenSpec).toMatchObject({
      contractId: "tokens.menu-simple-select-frame",
      systemKey: "default",
      tokenType: "menu-simple-select-frame",
      title: "Menu Simple Select Frame Token",
    });
    expect(menuSimpleSelectFrameTokenSpec.variants).toHaveLength(18);
    expect(menuSimpleSelectFrameTokenSpec.consumerRestrictions).toContain(
      "Current and disabled frame values must be paired with primitive-owned programmatic state semantics.",
    );
  });
});
