import { describe, expect, it } from "vitest";

import {
  surfaceFoundationPrimitive,
  surfaceFoundationPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs";

describe("surface-foundation primitive seam", () => {
  it("resolves the default neutral surface from the signed background token seam", () => {
    const surface = surfaceFoundationPrimitive();

    expect(surface).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "surface-foundation",
      systemKey: "default",
      role: "surface foundation",
      theme: "original",
      tokenDependency: {
        tokenType: "background-color",
        tokenName: "--background-surface-original",
        variantId: "background-surface-original",
        role: "surface foundation",
        theme: "original",
      },
      semantics: {
        interactive: false,
        focusable: false,
        role: null,
        accessibleNameRequired: false,
      },
    });
    expect(surface.consumerRestrictions).toContain(
      "Consumers must use signed background-color token variants instead of local color literals.",
    );
  });

  it("resolves explicit signed page and subtle foundation variants", () => {
    expect(surfaceFoundationPrimitive({ role: "page foundation", theme: "dark" }).tokenDependency).toMatchObject({
      tokenName: "--background-page-dark",
      variantId: "background-page-dark",
    });

    expect(surfaceFoundationPrimitive({ role: "subtle foundation", theme: "original" }).tokenDependency).toMatchObject({
      tokenName: "--background-subtle-original",
      variantId: "background-subtle-original",
    });
  });

  it("rejects unsupported systems, roles, and unsigned role/theme combinations", () => {
    expect(() => surfaceFoundationPrimitive({ systemKey: "missing" })).toThrow(
      'surface-foundation has no system proof for "missing".',
    );
    expect(() => surfaceFoundationPrimitive({ role: "card" })).toThrow('surface-foundation does not allow role "card".');
    expect(() => surfaceFoundationPrimitive({ role: "subtle foundation", theme: "dark" })).toThrow(
      "surface-foundation has no signed default background-color token for subtle foundation in dark.",
    );
  });

  it("documents the primitive contract boundary without exposing markup or CSS as the seam", () => {
    expect(surfaceFoundationPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "surface-foundation",
      status: "review-ready",
      supportedSystems: ["default"],
      allowedRoles: ["page foundation", "surface foundation", "subtle foundation"],
    });
    expect(surfaceFoundationPrimitiveContract.consumerRules).toContain(
      "Consumers must not rely on shared CSS alone as the primitive seam.",
    );
  });
});
