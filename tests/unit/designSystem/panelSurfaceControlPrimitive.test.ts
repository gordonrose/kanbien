import { describe, expect, it } from "vitest";

import {
  panelSurfaceControlPrimitive,
  panelSurfaceControlPrimitiveContract,
  renderPanelSurfaceControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/panel-surface-control/index.mjs";

describe("panel-surface-control primitive seam", () => {
  it("resolves panel frame values from the signed token seam", () => {
    const panel = panelSurfaceControlPrimitive({
      id: "drawer-panel",
      label: "Drawer panel",
      state: "active",
    });

    expect(panel).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "panel-surface-control",
      state: "active",
      tokenDependencies: {
        panelFrame: {
          tokenName: "--panel-frame",
          variantId: "panel-frame-default",
        },
      },
      attributes: {
        "aria-label": "Drawer panel",
      },
      styleVars: {
        "--primitive-panel-surface-min-inline-size": "10rem",
        "--primitive-panel-surface-standard-inline-size": "13rem",
        "--primitive-panel-surface-double-inline-size": "26rem",
        "--primitive-panel-surface-max-inline-size": "100%",
        "--primitive-panel-surface-mobile-inline-size": "100vw",
      },
    });
  });

  it("resolves theme-specific panel frame values", () => {
    const panel = panelSurfaceControlPrimitive({
      id: "drawer-panel-dark",
      label: "Drawer panel",
      state: "active",
      theme: "dark",
    });

    expect(panel).toMatchObject({
      theme: "dark",
      tokenDependencies: {
        panelFrame: {
          tokenName: "--panel-frame-dark",
          variantId: "panel-frame-dark",
        },
      },
      styleVars: {
        "--primitive-panel-surface-background": "#171b22",
        "--primitive-panel-surface-foreground": "#f4f7fb",
        "--primitive-panel-surface-border": "#303845",
      },
    });
  });

  it("renders covered panels as non-competing panel surfaces", () => {
    const html = renderPanelSurfaceControlPrimitive({
      id: "covered-panel",
      label: "Covered panel",
      state: "covered",
      contentHtml: "<p>Covered panel content</p>",
    });

    expect(html).toContain('data-panel-surface-control=""');
    expect(html).toContain('data-panel-surface-control-state="covered"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("inert");
    expect(html).toContain("Covered panel content");
    expect(html).toContain("--primitive-panel-surface-background");
  });

  it("guards unsupported panel states", () => {
    expect(() =>
      panelSurfaceControlPrimitive({
        id: "drawer-panel",
        label: "Drawer panel",
        state: "selected",
      }),
    ).toThrow('panel-surface-control does not support state "selected".');
  });

  it("documents its primitive boundary", () => {
    expect(panelSurfaceControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "panel-surface-control",
      supportedThemes: ["original", "dark", "desert"],
      requiredTokens: ["panel-frame"],
      requiredPrimitives: [],
    });
  });
});
