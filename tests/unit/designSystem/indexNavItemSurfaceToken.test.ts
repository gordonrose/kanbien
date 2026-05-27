import { describe, expect, it } from "vitest";

import {
  indexNavItemSurfaceTokenSpec,
  indexNavItemSurfaceTokenVariants,
  tokenDefinitionV1,
} from "../../../src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs";

describe("index-nav-item-surface token seam", () => {
  it("exposes resting, hover, current, and disabled states across supported themes", () => {
    expect(indexNavItemSurfaceTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-item-surface",
      systemKey: "default",
      tokenType: "index-nav-item-surface",
    });

    const keys = indexNavItemSurfaceTokenVariants.map(
      (variant: { theme: string; state: string }) => `${variant.theme}:${variant.state}`,
    );
    expect(keys).toEqual([
      "original:resting",
      "original:hover",
      "original:current",
      "original:disabled",
      "dark:resting",
      "dark:hover",
      "dark:current",
      "dark:disabled",
      "desert:resting",
      "desert:hover",
      "desert:current",
      "desert:disabled",
    ]);
  });

  it("keeps dependency and state semantics visible for downstream consumers", () => {
    const current = indexNavItemSurfaceTokenVariants.find(
      (variant: { id: string }) => variant.id === "index-nav-item-surface-current-original",
    );
    const disabled = indexNavItemSurfaceTokenVariants.find(
      (variant: { id: string }) => variant.id === "index-nav-item-surface-disabled-dark",
    );

    expect(current).toMatchObject({
      tokenName: "--index-nav-item-surface-current-original",
      sourceTokenName: "--primary-tinted-background-original",
      state: "current",
    });
    expect(current?.usage.map((item: { text: string }) => item.text).join(" ")).toContain(
      "programmatic current/selected semantics",
    );

    expect(disabled).toMatchObject({
      tokenName: "--index-nav-item-surface-disabled-dark",
      state: "disabled",
    });
    expect(disabled?.usage.map((item: { text: string }) => item.text).join(" ")).toContain("disabled semantics");
  });

  it("does not approve non-surface item decisions", () => {
    expect(tokenDefinitionV1.tokenType).toBe("surface");
    expect(indexNavItemSurfaceTokenSpec.consumerRestrictions).toContain(
      "This token does not approve item activation, keyboard behavior, disabled behavior, selected semantics, spacing, or radius.",
    );
  });
});
