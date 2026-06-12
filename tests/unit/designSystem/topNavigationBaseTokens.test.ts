import { describe, expect, it } from "vitest";

import { topNavigationBaseTokensContract } from "../../../src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/contract.mjs";
import {
  tokenDefinitionV1,
  topNavigationBaseTokensSpec,
} from "../../../src/frontend/designSystem/layers/02-token/top-navigation-base-tokens/systems/default.mjs";

describe("top-navigation-base-tokens", () => {
  it("is blocked until top navigation maps to concrete 41 token seams", () => {
    expect(topNavigationBaseTokensContract.status).toBe("blocked");
    expect(tokenDefinitionV1.status).toBe("blocked");
    expect(tokenDefinitionV1.codeSeam.allowedConsumers).toEqual([]);
    expect(topNavigationBaseTokensSpec.variantSectionDescription).toContain("top-navigation-frame");
  });

  it("records mapped 41 candidates and missing 41 seams instead of approving old CSS variables", () => {
    const [variant] = topNavigationBaseTokensSpec.variants;

    expect(variant).toMatchObject({
      id: "top-navigation-base-tokens-blocked",
      tokenName: "--top-navigation-base-tokens",
      state: "blocked",
    });

    expect(variant.mapped41TokenSeams).toContain("background-color");
    expect(variant.mapped41TokenSeams).toContain("primary-color-source");
    expect(variant.missing41TokenSeams).toContain("resolved by top-navigation-frame: neutral foreground/text role");
    expect(variant.missing41TokenSeams).toContain("resolved by top-navigation-frame: floating menu elevation role");
    expect(variant.retired40VariableGroups).toContain("--surface-*");
    expect(variant.retired40VariableGroups).toContain("--radius*");
  });

  it("keeps top-navigation geometry out of the token contract", () => {
    expect(topNavigationBaseTokensContract.valueFields).not.toContain("brandMarkSize");
    expect(topNavigationBaseTokensContract.valueFields).not.toContain("mobileBreakpoint");
    expect(topNavigationBaseTokensContract.valueFields).not.toContain("overflowMeasurement");
    expect(topNavigationBaseTokensContract.valueFields).not.toContain("gridTemplateColumns");

    expect(topNavigationBaseTokensContract.consumerRules).toContain(
      "This slice is blocked and is not consumable by top-navigation primitives or patterns.",
    );
  });
});
