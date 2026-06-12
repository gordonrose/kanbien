import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  contextNavigationBottomBarPrimitive,
  contextNavigationBottomBarPrimitiveContract,
  renderContextNavigationBottomBarPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/context-navigation-bottom-bar/index.mjs";

describe("context-navigation-bottom-bar primitive seam", () => {
  it("resolves bottom-bar frame values from signed context-navigation tokens", () => {
    const bar = contextNavigationBottomBarPrimitive({
      id: "context-navigation-bottom-bar",
      label: "Context navigation",
    });

    expect(bar).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "context-navigation-bottom-bar",
      tokenDependencies: {
        contextNavigationFrame: {
          tokenName: "--context-navigation-frame",
          variantId: "context-navigation-frame-default",
        },
      },
      attributes: {
        "aria-label": "Context navigation",
        "data-context-navigation-bottom-bar-mode": "default",
      },
      styleVars: {
        "--primitive-context-nav-bottom-bar-columns": "repeat(5, minmax(0, 1fr))",
        "--primitive-context-nav-bottom-bar-page-reserve": "5.75rem",
        "--primitive-context-nav-bottom-bar-drawer-offset": "calc(4.125rem + env(safe-area-inset-bottom, 0))",
      },
      behavior: {
        viewportPinning: "bottom bar remains fixed to the visual viewport bottom during document scroll and page-end pressure",
      },
    });
  });

  it("renders a named nav frame without owning destination item anatomy", () => {
    const html = renderContextNavigationBottomBarPrimitive({
      id: "context-navigation-bottom-bar",
      label: "Context navigation",
      slotHtml: '<span data-proof-slot="">Home</span>',
    });

    expect(html).toContain("<nav ");
    expect(html).toContain('data-context-navigation-bottom-bar=""');
    expect(html).toContain('aria-label="Context navigation"');
    expect(html).toContain('data-proof-slot=""');
    expect(html).toContain("--primitive-context-nav-bottom-bar-columns");
  });

  it("guards unsupported modes", () => {
    expect(() =>
      contextNavigationBottomBarPrimitive({
        id: "context-navigation-bottom-bar",
        label: "Context navigation",
        mode: "rail",
      }),
    ).toThrow('context-navigation-bottom-bar does not support mode "rail".');
  });

  it("keeps overflow menus visible above the fixed mobile bar", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const bottomBarRule = styles.match(/\.ds-context-navigation-bottom-bar\s*\{[^}]+\}/)?.[0] ?? "";

    expect(bottomBarRule).toContain("overflow: visible;");
    expect(bottomBarRule).toContain("contain: layout;");
    expect(bottomBarRule).not.toContain("contain: layout paint;");
  });

  it("documents its primitive boundary", () => {
    expect(contextNavigationBottomBarPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "context-navigation-bottom-bar",
      requiredTokens: ["context-navigation-frame"],
      requiredPrimitives: [],
    });
  });
});
