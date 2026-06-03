import { describe, expect, it } from "vitest";

import {
  renderVisualProofSurfacePrimitive,
  visualProofSurfacePrimitive,
  visualProofSurfacePrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/visual-proof-surface/index.mjs";

describe("visual-proof-surface primitive seam", () => {
  it("resolves brochure surface and backdrop ornament tokens from signed seams", () => {
    const surface = visualProofSurfacePrimitive({ id: "proof-surface" });

    expect(surface).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "visual-proof-surface",
      systemKey: "brochure",
      id: "proof-surface",
      tokenDependencies: {
        surfaceFrame: {
          tokenName: "--surface-frame-showcase",
          variantId: "surface-frame-showcase",
        },
        visualProofOrnament: [
          {
            tokenName: "--visual-proof-grid-lines",
            variantId: "visual-proof-grid-lines",
          },
          {
            tokenName: "--visual-proof-overlay-wash",
            variantId: "visual-proof-overlay-wash",
          },
        ],
      },
      semantics: {
        interactive: false,
        focusable: false,
        role: null,
        ariaHidden: true,
        accessibleNameRequired: false,
      },
    });
    expect(surface.styleVars).toMatchObject({
      "--primitive-visual-proof-surface-background":
        "linear-gradient(135deg, rgba(31, 111, 120, 0.08), rgba(199, 125, 42, 0.05)), rgba(255, 253, 248, 0.76)",
      "--primitive-visual-proof-grid-color": "rgba(40, 56, 71, 0.16)",
      "--primitive-visual-proof-overlay":
        "linear-gradient(140deg, rgba(31, 111, 120, 0.1), rgba(255, 253, 248, 0.92) 52%, rgba(199, 125, 42, 0.1))",
    });
  });

  it("renders only a decorative hidden surface rather than semantic diagram content", () => {
    const html = renderVisualProofSurfacePrimitive({ id: "proof-surface" });

    expect(html).toContain('class="ds-visual-proof-surface"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("data-visual-proof-surface-style=");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("role=");
    expect(html).not.toContain("ds-visual-proof-surface-chip");
    expect(html).not.toContain("ds-visual-proof-surface-marker");
    expect(html).not.toContain("ds-visual-proof-surface-line");
  });

  it("rejects unsupported systems and documents the consumer boundary", () => {
    expect(() => visualProofSurfacePrimitive({ systemKey: "default" })).toThrow(
      'visual-proof-surface has no system proof for "default".',
    );
    expect(visualProofSurfacePrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "visual-proof-surface",
      status: "review-ready",
      supportedSystems: ["brochure"],
      requiredTokens: ["surface-frame", "visual-proof-ornament"],
    });
    expect(visualProofSurfacePrimitiveContract.consumerRules).toContain(
      "Consumers must not copy proof-route markup or local CSS values into patterns or app pages.",
    );
  });
});
