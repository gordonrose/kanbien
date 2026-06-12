import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  contextNavigationOverflowMenuPrimitive,
  contextNavigationOverflowMenuPrimitiveContract,
  renderContextNavigationOverflowMenuPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/context-navigation-overflow-menu/index.mjs";

const items = [
  { id: "reports", value: "reports", label: "Reports", kind: "destination", href: "#reports" },
  { id: "exports", value: "exports", label: "Exports", kind: "utility" },
];

describe("context-navigation-overflow-menu primitive seam", () => {
  it("resolves frame token and source-style menu items", () => {
    const menu = contextNavigationOverflowMenuPrimitive({
      id: "overflow-menu-test",
      items,
      mode: "mobile",
    });

    expect(menu).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "context-navigation-overflow-menu",
      mode: "mobile",
      tokenDependencies: {
        overflowMenuFrame: {
          tokenName: "--context-navigation-overflow-menu-frame",
        },
      },
    });
    expect(menu.items).toHaveLength(2);
  });

  it("renders More trigger and hidden menu panel with overflow items", () => {
    const html = renderContextNavigationOverflowMenuPrimitive({
      id: "overflow-menu-render",
      items,
      mode: "mobile",
    });

    expect(html).toContain('data-context-navigation-overflow-menu=""');
    expect(html).toContain('data-context-navigation-overflow-trigger=""');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('role="menu"');
    expect(html).toContain('class="menu-item"');
    expect(html).toContain('class="menu-item menu-item-button"');
    expect(html).toContain('data-context-navigation-overflow-menu-item=""');
    expect(html).toContain('role="menuitem"');
    expect(html).toContain("Reports");
    expect(html).toContain("Exports");
    expect(html).not.toContain('data-context-navigation-overflow-menu-item="" role="menuitem"');
  });

  it("keeps panel items aligned to the source menu-item presentation", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const sourceStyles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/styles.css"),
      "utf8",
    );
    const sourceMenuRule =
      Array.from(sourceStyles.matchAll(/\.menu-item\s*\{[^}]+\}/g))
        .map((match) => match[0])
        .find((rule) => rule.includes("display: block;")) ?? "";
    const panelIconRule =
      styles.match(/\.ds-context-navigation-overflow-menu-panel \[data-context-navigation-overflow-menu-item\] \.ds-context-navigation-item-control-icon\s*\{[^}]+\}/)
        ?.[0] ?? "";

    expect(sourceMenuRule).toContain("display: block;");
    expect(sourceMenuRule).toContain("padding: 0.85rem 1rem;");
    expect(sourceMenuRule).toContain("text-align: left;");
    expect(panelIconRule).toBe("");
  });

  it("rejects unsupported modes and documents the boundary", () => {
    expect(() => contextNavigationOverflowMenuPrimitive({ mode: "drawer" })).toThrow(
      'context-navigation-overflow-menu does not support mode "drawer".',
    );
    expect(contextNavigationOverflowMenuPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "context-navigation-overflow-menu",
      status: "review-ready",
      requiredPrimitives: ["context-navigation-item-control"],
    });
  });
});
