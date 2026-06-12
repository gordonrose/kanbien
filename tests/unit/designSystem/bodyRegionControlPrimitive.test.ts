import { describe, expect, it } from "vitest";

import {
  bodyRegionControlPrimitive,
  bodyRegionControlPrimitiveContract,
  renderBodyRegionControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/body-region-control/index.mjs";

describe("body-region-control primitive seam", () => {
  it("resolves body-region frame values from signed tokens", () => {
    const region = bodyRegionControlPrimitive({
      id: "entity-body-region",
      label: "Entity body content",
      state: "loading",
    });

    expect(region).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "body-region-control",
      state: "loading",
      tokenDependencies: {
        bodyRegionFrame: {
          tokenName: "--body-region-frame",
          variantId: "body-region-frame-default",
        },
      },
      attributes: {
        "aria-label": "Entity body content",
        "aria-busy": "true",
      },
      styleVars: {
        "--primitive-body-region-padding-block": "1rem",
        "--primitive-body-region-section-gap": "1rem",
        "--primitive-body-region-min-inline-size": "26rem",
        "--primitive-body-region-max-inline-size": "100%",
        "--primitive-body-region-min-block-size": "12rem",
      },
    });
  });

  it("resolves same-theme body-region frame values", () => {
    const region = bodyRegionControlPrimitive({
      id: "entity-body-region-dark",
      label: "Dark entity body content",
      theme: "dark",
    });

    expect(region).toMatchObject({
      theme: "dark",
      tokenDependencies: {
        bodyRegionFrame: {
          tokenName: "--body-region-frame-dark",
          variantId: "body-region-frame-default-dark",
        },
      },
      styleVars: {
        "--primitive-body-region-background": "#171b22",
        "--primitive-body-region-foreground": "#f4f7fb",
        "--primitive-body-region-border": "#303845",
      },
    });
  });

  it("renders a named section and composes the governed scroll primitive", () => {
    const html = renderBodyRegionControlPrimitive({
      id: "entity-body-region",
      label: "Entity body content",
      contentHtml: "<p>Proof-only body content</p>",
    });

    expect(html).toContain('data-body-region-control=""');
    expect(html).toContain('aria-label="Entity body content"');
    expect(html).toContain("data-scroll-region-control");
    expect(html).toContain("Proof-only body content");
    expect(html).toContain("--primitive-body-region-background");
  });

  it("guards unsupported state values", () => {
    expect(() =>
      bodyRegionControlPrimitive({
        id: "entity-body-region",
        label: "Entity body content",
        state: "selected",
      }),
    ).toThrow('body-region-control does not support state "selected".');
  });

  it("documents its primitive boundary", () => {
    expect(bodyRegionControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "body-region-control",
      requiredTokens: ["body-region-frame"],
      requiredPrimitives: ["scroll-region-control"],
    });
  });
});
