import { describe, expect, it } from "vitest";

import {
  attachContextNavigationItemControlPrimitiveController,
  contextNavigationItemControlPrimitive,
  contextNavigationItemControlPrimitiveContract,
  renderContextNavigationItemControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs";
import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

describe("context-navigation-item-control primitive seam", () => {
  it("resolves signed token dependencies for a current destination item", () => {
    const item = contextNavigationItemControlPrimitive({
      id: "overview-item",
      label: "Overview",
      kind: "destination",
      href: "#overview",
      state: "current",
    });

    expect(item).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "context-navigation-item-control",
      systemKey: "default",
      theme: "original",
      kind: "destination",
      state: "current",
      current: true,
      disabled: false,
      icon: "context-list",
      systemDependencies: {
        glyphRegistry: {
          semanticGlyphName: "context-list",
        },
      },
      semantics: {
        element: "a",
        type: "link",
        accessibleName: "Overview",
      },
      tokenDependencies: {
        contextFrame: {
          tokenName: "--context-navigation-frame",
        },
        itemAffordance: {
          tokenName: "--context-navigation-item-affordance",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
        iconSize: {
          tokenName: "--icon-button-glyph-size",
        },
        minimumTargetSize: {
          tokenName: "--target-size-interactive-min",
        },
      },
    });
    expect(item.attributes.href).toBe("#overview");
    expect(item.attributes["aria-current"]).toBe("page");
  });

  it("renders utility controls as buttons and disabled controls as native disabled buttons", () => {
    const utility = contextNavigationItemControlPrimitive({
      id: "more-item",
      label: "More",
      kind: "utility",
      state: "resting",
    });
    const disabled = contextNavigationItemControlPrimitive({
      id: "archive-item",
      label: "Archive",
      kind: "utility",
      state: "disabled",
    });

    expect(utility.semantics.element).toBe("button");
    expect(utility.attributes.type).toBe("button");
    expect(utility.attributes.disabled).toBeNull();
    expect(disabled.semantics.element).toBe("button");
    expect(disabled.attributes.disabled).toBe(true);
  });

  it("rejects unsupported or underspecified input", () => {
    expect(() => contextNavigationItemControlPrimitive({ label: "" })).toThrow(
      "label must be a non-empty string.",
    );
    expect(() =>
      contextNavigationItemControlPrimitive({
        label: "Broken",
        kind: "destination",
        state: "resting",
      }),
    ).toThrow("href must be a non-empty string.");
    expect(() =>
      contextNavigationItemControlPrimitive({
        label: "More",
        kind: "utility",
        state: "current",
      }),
    ).toThrow("current state is only allowed for destination items");
    expect(() => contextNavigationItemControlPrimitive({ label: "Item", kind: "tab" })).toThrow(
      'context-navigation-item-control does not support kind "tab".',
    );
    expect(() => contextNavigationItemControlPrimitive({ label: "Item", icon: "missing", href: "#item" })).toThrow(
      'context-navigation-item-control does not support icon "missing".',
    );
  });

  it("owns render markup without proof-only row wrappers", () => {
    const html = renderContextNavigationItemControlPrimitive({
      id: "rendered-item",
      label: "Rendered <item> & label",
      icon: "home",
      kind: "destination",
      href: "#rendered",
      state: "current",
    });

    expect(html).toContain("<a");
    expect(html).toContain("<svg ");
    expect(html).toContain("<path ");
    expect(html).toContain(resolveDefaultGlyphPath("home"));
    expect(html).toContain('href="#rendered"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('data-context-navigation-item-control=""');
    expect(html).toContain("Rendered &lt;item&gt; &amp; label");
    expect(html).not.toContain("primitive-proof-row");
  });

  it("exports a controller for browser proof activation behavior", () => {
    expect(attachContextNavigationItemControlPrimitiveController).toEqual(expect.any(Function));
    expect(
      renderContextNavigationItemControlPrimitive({
        id: "more-item",
        label: "More",
        icon: "context-more",
        kind: "utility",
        state: "resting",
        value: "more",
      }),
    ).toContain('data-context-navigation-item-control-kind="utility"');
    expect(
      renderContextNavigationItemControlPrimitive({
        id: "archive-item",
        label: "Archive",
        icon: "accessibility",
        kind: "utility",
        state: "disabled",
        value: "archive",
      }),
    ).toContain("disabled");
  });

  it("documents the primitive boundary", () => {
    expect(contextNavigationItemControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "context-navigation-item-control",
      status: "review-ready",
      eventName: "context-navigation-item-control:activate",
      iconButtonControlCompatibility: {
        relatedPrimitive: "icon-button-control",
        decision: "not-composed",
      },
    });
    expect(contextNavigationItemControlPrimitiveContract.requiredSystemRegistries).toContain("glyph-registry");
    expect(contextNavigationItemControlPrimitiveContract.consumerRules).toContain(
      "Consumers must not use this primitive to invent current-state rail styling, drawer behavior, More-menu overflow, or app-local CSS.",
    );
  });
});
