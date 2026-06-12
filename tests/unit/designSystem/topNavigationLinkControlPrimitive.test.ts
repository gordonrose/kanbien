import { describe, expect, it } from "vitest";

import {
  renderTopNavigationLinkControlPrimitive,
  topNavigationLinkControlPrimitive,
  topNavigationLinkControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs";

describe("top-navigation-link-control primitive seam", () => {
  it("resolves signed token and primitive dependencies for a destination link", () => {
    const destination = topNavigationLinkControlPrimitive({
      id: "top-navigation-destination",
      label: "Destination",
      href: "/destination",
    });

    expect(destination).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "top-navigation-link-control",
      tokenDependencies: {
        topNavigationFrame: {
          tokenName: "--top-navigation-frame-destination-original",
        },
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
        minimumTargetSize: {
          tokenName: "--target-size-interactive-min",
        },
        truncatingLabel: {
          primitiveName: "truncating-label",
        },
      },
      semantics: {
        element: "a",
        role: "native link",
        accessibleName: "Destination",
      },
    });
    expect(destination.styleVars["--primitive-top-navigation-link-min-inline-size"]).toBe("7rem");
  });

  it("renders a current native anchor with programmatic current semantics", () => {
    const html = renderTopNavigationLinkControlPrimitive({
      id: "top-navigation-current",
      label: "Current",
      href: "/current",
      current: true,
    });

    expect(html).toContain("<a");
    expect(html).toContain('href="/current"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Current"');
    expect(html).toContain('data-top-navigation-link-control=""');
    expect(html).toContain('data-truncating-label=""');
    expect(html).not.toContain("tabindex=");
    expect(topNavigationLinkControlPrimitiveContract).toMatchObject({
      primitiveName: "top-navigation-link-control",
      primitiveDependencies: ["truncating-label"],
    });
  });

  it("rejects unsupported kinds instead of silently inventing behavior", () => {
    expect(() =>
      topNavigationLinkControlPrimitive({
        id: "top-navigation-trigger",
        label: "More",
        href: "#more",
        kind: "menu-trigger",
      }),
    ).toThrow('top-navigation-link-control does not support kind "menu-trigger"');
  });
});
