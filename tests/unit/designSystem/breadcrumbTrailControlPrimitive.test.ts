import { describe, expect, it } from "vitest";

import {
  breadcrumbTrailControlPrimitive,
  breadcrumbTrailControlPrimitiveContract,
  renderBreadcrumbTrailControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/breadcrumb-trail-control/index.mjs";

const items = [
  { id: "home", label: "Home", href: "#home" },
  { id: "workspace", label: "Workspace", href: "#workspace" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "brief", label: "Design brief", href: "#brief" },
  { id: "current", label: "Secondary navigation", current: true },
];

describe("breadcrumb-trail-control primitive", () => {
  it("resolves signed tokens and primitive dependencies", () => {
    const spec = breadcrumbTrailControlPrimitive({
      id: "breadcrumb-test",
      items,
      mode: "reduced-middle",
    });

    expect(spec).toMatchObject({
      primitiveName: "breadcrumb-trail-control",
      tokenDependencies: {
        buttonFrame: { variantId: "button-frame-text-action-original" },
        labelTextStyle: { variantId: "label-text-style-short-default" },
        focusRing: { variantId: "focus-ring-visible-original" },
        minimumTargetSize: { variantId: "target-size-interactive-all" },
        truncatingLabel: { primitiveName: "truncating-label" },
        iconButtonControl: { primitiveName: "icon-button-control" },
      },
    });
    expect(spec.visibleItems.map((item: { id: string }) => item.id)).toEqual(["home", "current"]);
    expect(spec.hiddenItems.map((item: { id: string }) => item.id)).toEqual(["workspace", "projects", "brief"]);
  });

  it("renders hidden breadcrumbs behind a middle reveal before the remaining visible trail", () => {
    const html = renderBreadcrumbTrailControlPrimitive({
      id: "breadcrumb-render",
      items,
      mode: "reduced-middle",
    });

    expect(html).toContain('data-breadcrumb-trail-control=""');
    expect(html).toContain('data-truncating-label=""');
    expect(html).toContain('data-truncating-label-tooltip-placement="below"');
    expect(html).toContain('aria-current="page"');
    expect(html.indexOf("Open hidden breadcrumb menu")).toBeLessThan(html.indexOf("Design brief"));
    expect(html).toContain('role="menu"');
    expect(html).toContain('role="menuitem"');
  });

  it("keeps row placement, search, app routes, and component seams outside the primitive", () => {
    expect(breadcrumbTrailControlPrimitiveContract.requiredTokens).toEqual([
      "button-frame",
      "label-text-style",
      "focus-ring",
      "minimum-target-size",
      "icon-size",
    ]);
    expect(breadcrumbTrailControlPrimitiveContract.primitiveDependencies).toEqual([
      "truncating-label",
      "icon-button-control",
    ]);
    expect(breadcrumbTrailControlPrimitiveContract.consumerRules.join(" ")).toContain("sub-navigation row placement");
    expect(breadcrumbTrailControlPrimitive().tokenDependencies).not.toHaveProperty("searchFieldControl");
  });

  it("renders compact collapse as a signpost icon button", () => {
    const html = renderBreadcrumbTrailControlPrimitive({
      id: "breadcrumb-compact",
      items,
      mode: "compact",
    });

    expect(html).toContain('aria-label="Open page structure menu"');
    expect(html).toContain('data-icon-button-control=""');
    expect(html).toContain("ds-breadcrumb-trail-control-compact-trigger");
    expect(html).toContain("M12 21V5");
    expect(html).not.toContain(">...</button>");
  });
});
