import { describe, expect, it } from "vitest";

import {
  panelStackPattern,
  panelStackPatternContract,
  renderPanelStackPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/panel-stack/index.mjs";

const panels = [
  { id: "primary", label: "Primary panel", contentHtml: "<p>Primary</p>" },
  { id: "secondary", label: "Secondary panel", contentHtml: "<p>Secondary</p>" },
  { id: "tertiary", label: "Tertiary panel", contentHtml: "<p>Tertiary</p>" },
];

describe("panel-stack pattern seam", () => {
  it("keeps desktop panels active and consumes the signed stack placement token", () => {
    const stack = panelStackPattern({
      id: "drawer-stack",
      label: "Drawer stack",
      origin: "right",
      viewport: "desktop",
      activePanelId: "secondary",
      panels,
    });

    expect(stack).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "panel-stack",
      origin: "right",
      viewport: "desktop",
      tokenDependencies: {
        panelStackPlacement: {
          tokenName: "--panel-stack-placement",
          variantId: "panel-stack-placement-default",
        },
      },
      styleVars: {
        "--pattern-panel-stack-desktop-gap": "0px",
        "--pattern-panel-stack-overlay-inset": "0px",
        "--pattern-panel-stack-mobile-breakpoint": "44rem",
      },
    });
    expect(stack.panels.map((panel: { state: string }) => panel.state)).toEqual(["active", "active", "active"]);
  });

  it("marks non-active mobile panels as covered through the panel surface primitive", () => {
    const stack = panelStackPattern({
      id: "drawer-stack",
      label: "Drawer stack",
      origin: "left",
      viewport: "mobile",
      activePanelId: "secondary",
      panels,
    });

    expect(stack.panels.map((panel: { id: string; state: string }) => [panel.id, panel.state])).toEqual([
      ["primary", "covered"],
      ["secondary", "active"],
      ["tertiary", "covered"],
    ]);

    const html = renderPanelStackPattern({
      id: "drawer-stack",
      label: "Drawer stack",
      origin: "left",
      viewport: "mobile",
      activePanelId: "secondary",
      panels,
    });

    expect(html).toContain('data-panel-stack-origin="left"');
    expect(html).toContain('data-panel-stack-viewport="mobile"');
    expect(html).toContain('data-panel-surface-control-state="covered"');
    expect(html).toContain("--pattern-panel-stack-panel-layer");
  });

  it("guards unsupported origins and active panels", () => {
    expect(() =>
      panelStackPattern({
        origin: "center",
        panels,
      }),
    ).toThrow('panel-stack does not support origin "center".');

    expect(() =>
      panelStackPattern({
        activePanelId: "missing",
        panels,
      }),
    ).toThrow('panel-stack activePanelId "missing" does not match a panel.');
  });

  it("documents its pattern boundary", () => {
    expect(panelStackPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "panel-stack",
      requiredPrimitives: ["panel-surface-control"],
      directTokenDependencies: ["panel-stack-placement"],
    });
  });
});
