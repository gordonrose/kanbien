import { describe, expect, it } from "vitest";

import {
  indexNavItemControlPrimitive,
  indexNavItemControlPrimitiveContract,
  renderIndexNavItemControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/index-nav-item-control/index.mjs";

describe("index-nav-item-control primitive seam", () => {
  it("resolves signed token dependencies for a current original item", () => {
    const item = indexNavItemControlPrimitive({
      id: "identity-item",
      label: "Identity model with long governed label text",
      supportingText: "3 items",
      state: "current",
    });

    expect(item).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "index-nav-item-control",
      systemKey: "default",
      theme: "original",
      state: "current",
      current: true,
      disabled: false,
      semantics: {
        element: "button",
        type: "button",
        accessibleName: "Identity model with long governed label text",
      },
      tokenDependencies: {
        surface: {
          tokenName: "--index-nav-item-surface-current-original",
        },
        currentIndicator: {
          tokenName: "--index-nav-item-current-indicator",
        },
        radius: {
          tokenName: "--index-nav-item-radius",
        },
        paddingBlock: {
          tokenName: "--index-nav-item-padding-block",
        },
        paddingInline: {
          tokenName: "--index-nav-item-padding-inline",
        },
        gap: {
          tokenName: "--index-nav-item-content-gap",
        },
        supportingTextStyle: {
          tokenName: "--supporting-text-style-default",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
      },
    });
    expect(item.attributes["aria-current"]).toBe("true");
    expect(item.attributes.disabled).toBeNull();
  });

  it("uses native disabled semantics and rejects unsupported input", () => {
    const disabled = indexNavItemControlPrimitive({
      id: "disabled-item",
      label: "Disabled item",
      state: "disabled",
    });

    expect(disabled.attributes.disabled).toBe(true);
    expect(disabled.current).toBe(false);
    expect(() => indexNavItemControlPrimitive({ label: "" })).toThrow("label must be a non-empty string.");
    expect(() => indexNavItemControlPrimitive({ label: "Item", state: "selected" })).toThrow(
      'index-nav-item-control does not support state "selected".',
    );
  });

  it("owns render markup without route-local proof classes", () => {
    const html = renderIndexNavItemControlPrimitive({
      id: "rendered-item",
      label: "Rendered <item> & label",
      state: "current",
    });

    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-current="true"');
    expect(html).toContain('data-index-nav-item-control=""');
    expect(html).toContain('role="tooltip"');
    expect(html).toContain('aria-label="Rendered &lt;item&gt; &amp; label"');
    expect(html).not.toContain("primitive-proof-row");
  });

  it("reserves supporting-text row geometry when supporting text is absent", () => {
    const html = renderIndexNavItemControlPrimitive({
      id: "rendered-item-no-supporting",
      label: "Rendered item without supporting text",
      state: "resting",
    });

    expect(html).toContain('data-index-nav-item-control-supporting=""');
    expect(html).toContain('data-index-nav-item-control-supporting-empty="true"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("&nbsp;");
  });

  it("documents the primitive boundary", () => {
    expect(indexNavItemControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "index-nav-item-control",
      status: "review-ready",
      eventName: "index-nav-item-control:activate",
    });
    expect(indexNavItemControlPrimitiveContract.consumerRules).toContain(
      "Consumers must not nest another focusable primitive inside this button.",
    );
  });

  it("keeps hover visuals out of local primitive CSS filters", () => {
    const hover = indexNavItemControlPrimitive({
      id: "hover-item",
      label: "Hover item",
      state: "hover",
    });

    expect(hover.tokenDependencies.surface.tokenName).toBe("--index-nav-item-surface-hover-original");
    expect(hover.semantics.pointer.join(" ")).toContain("signed hover surface token");
    expect(hover.semantics.pointer.join(" ")).toContain("not local CSS filters");
  });
});
