import { describe, expect, it } from "vitest";

import { resolveTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/token-spec-resolver.mjs";

describe("design-system token spec resolver", () => {
  it("resolves registered token specs for a design system", () => {
    expect(resolveTokenSpec({ systemKey: "default", tokenType: "standard-page-shell-frame" })).toMatchObject({
      systemKey: "default",
      tokenType: "standard-page-shell-frame",
    });
    expect(resolveTokenSpec({ systemKey: "default", tokenType: "button-frame" })).toMatchObject({
      systemKey: "default",
      tokenType: "button-frame",
    });
    expect(resolveTokenSpec({ systemKey: "default", tokenType: "focus-ring" })).toMatchObject({
      systemKey: "default",
      tokenType: "focus-ring",
    });
    expect(resolveTokenSpec({ systemKey: "default", tokenType: "label-text-style" })).toMatchObject({
      contractId: "tokens.label-text-style",
      systemKey: "default",
    });
    expect(resolveTokenSpec({ systemKey: "default", tokenType: "minimum-target-size" })).toMatchObject({
      contractId: "tokens.minimum-target-size",
      systemKey: "default",
    });
  });

  it("rejects unknown systems and unknown token types without falling back", () => {
    expect(() => resolveTokenSpec({ systemKey: "missing", tokenType: "standard-page-shell-frame" })).toThrow(
      /No design-system token registry exists/,
    );
    expect(() => resolveTokenSpec({ systemKey: "default", tokenType: "missing-token" })).toThrow(
      /No "missing-token" token spec is registered/,
    );
  });
});
