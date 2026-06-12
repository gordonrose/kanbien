import { describe, expect, it } from "vitest";

import {
  renderTopNavigationBrandControlPrimitive,
  topNavigationBrandControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/top-navigation-brand-control/index.mjs";

describe("top-navigation-brand-control primitive seam", () => {
  it("resolves signed token and primitive dependencies for a brand link", () => {
    const brand = topNavigationBrandControlPrimitive({
      id: "top-navigation-brand",
      label: "Kanbien",
      href: "/design-system",
    });

    expect(brand).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "top-navigation-brand-control",
      tokenDependencies: {
        topNavigationFrame: {
          tokenName: "--top-navigation-frame-chrome-original",
        },
        primaryTintedBackground: {
          tokenName: "--primary-tinted-background-original",
        },
        primaryTintedForeground: {
          tokenName: "--primary-tinted-foreground-original",
        },
        truncatingLabel: {
          primitiveName: "truncating-label",
        },
      },
      semantics: {
        element: "a",
        accessibleName: "Kanbien",
      },
    });
  });

  it("renders one native anchor with decorative mark and truncating label", () => {
    const html = renderTopNavigationBrandControlPrimitive({
      id: "top-navigation-brand",
      label: "Kanbien",
      mark: "K",
      href: "/design-system",
    });

    expect(html).toContain("<a");
    expect(html).toContain('href="/design-system"');
    expect(html).toContain('aria-label="Kanbien"');
    expect(html).toContain('data-top-navigation-brand-control=""');
    expect(html).toContain('aria-hidden="true">K</span>');
    expect(html).toContain('data-truncating-label=""');
    expect(html).not.toContain("tabindex=");
  });
});
