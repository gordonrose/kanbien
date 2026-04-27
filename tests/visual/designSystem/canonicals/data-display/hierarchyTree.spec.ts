import { expect, test } from "@playwright/test";

import { expectCanonicalOverlayContainedInRenderSurface } from "../../support/helpers/canonicalOverlayGuards";

function generatedHierarchyRoute(ref: string): string {
  return `/design-system/canonical-renderings/hierarchy-tree/${ref}`;
}

test("hierarchy-tree pattern mounts under repo CSP and renders interactive rows", async ({ page }) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/design-system/patterns/hierarchy-tree");

  await expect(page.locator("#hierarchy-tree-detail-title")).toHaveText("Overview");
  await expect(page.locator(".hierarchy-tree-row")).toHaveCount(6);
  await expect(page.locator(".hierarchy-tree-row").first()).toContainText("Company Handbook");
  await expect(page.locator(".hierarchy-tree-row[data-selected='true']")).toContainText("Roadmap");

  expect(pageErrors).toEqual([]);
  expect(
    consoleErrors.filter(
      (message) => !message.includes("favicon"),
    ),
  ).toEqual([]);
});

test("hierarchy-tree top-level chevrons collapse roots and root menu supports collapse all and expand all", async ({ page }) => {
  await page.goto("/design-system/patterns/hierarchy-tree");

  const rows = page.locator(".hierarchy-tree-row");
  await expect(rows).toHaveCount(6);

  await page.locator(".hierarchy-tree-expander").first().click();
  await expect(rows).toHaveCount(4);

  await page.locator("#hierarchy-tree-root-menu-button").click();
  await page.locator('[data-root-action="collapse-all"]').click();
  await expect(rows).toHaveCount(2);

  await page.locator("#hierarchy-tree-root-menu-button").click();
  await page.locator('[data-root-action="expand-all"]').click();
  await expect(rows).toHaveCount(10);
});

test("hierarchy-tree desktop row hover and focus reveal subtle open actions with correct link semantics", async ({ page }) => {
  await page.goto("/design-system/patterns/hierarchy-tree");

  const roadmapRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Roadmap" }).first();
  const inlineActions = roadmapRow.locator(".hierarchy-tree-inline-actions");
  const links = inlineActions.locator(".hierarchy-tree-inline-action");

  await expect(links).toHaveCount(2);
  await expect(inlineActions).toHaveCSS("opacity", "0");

  await roadmapRow.hover();
  await expect(inlineActions).toHaveCSS("opacity", "1");
  await expect(links.nth(0)).toHaveAttribute("aria-label", "Open Roadmap");
  await expect(links.nth(0)).toHaveAttribute("href", /\/design-system\/patterns\/hierarchy-tree\/render\?/);
  await expect(links.nth(1)).toHaveAttribute("aria-label", "Open Roadmap in a new tab");
  await expect(links.nth(1)).toHaveAttribute("href", "/product/roadmap");
  await expect(links.nth(1)).toHaveAttribute("target", "_blank");
  await expect(links.nth(1)).toHaveAttribute("rel", "noopener noreferrer");

  const openIconState = await links.nth(0).evaluate((link) => {
    const svg = link.querySelector("svg");
    const outline = svg?.querySelector("path");
    const iconBox = svg?.getBoundingClientRect();

    if (!(svg instanceof SVGElement) || !(outline instanceof SVGPathElement)) {
      return null;
    }

    const svgStyle = window.getComputedStyle(svg);

    return {
      svgWidth: iconBox?.width ?? 0,
      svgHeight: iconBox?.height ?? 0,
      computedWidth: svgStyle.width,
      computedHeight: svgStyle.height,
      flexBasis: svgStyle.flexBasis,
    };
  });

  expect(openIconState).not.toBeNull();
  expect(openIconState?.svgWidth ?? 0).toBeGreaterThan(0);
  expect(openIconState?.svgHeight ?? 0).toBeGreaterThan(0);
  expect(openIconState?.computedWidth).not.toBe("0px");
  expect(openIconState?.computedHeight).not.toBe("0px");
  expect(openIconState?.flexBasis).not.toBe("0px");

  await roadmapRow.locator(".hierarchy-tree-label-button").focus();
  await expect(inlineActions).toHaveCSS("opacity", "1");
});

test("hierarchy-tree mobile keeps open actions in the menu and hides inline hover icons", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(generatedHierarchyRoute("HTR-022"));

  const roadmapRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Roadmap" }).first();
  await expect(roadmapRow.locator(".hierarchy-tree-inline-actions")).toBeHidden();

  const rowMenu = page.locator(".hierarchy-tree-row-menu");
  await expect(rowMenu).toContainText("Open");
  await expect(rowMenu).toContainText("Open in new tab");
});

test("hierarchy-tree generated mobile states render mobile posture inside a desktop browser", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(generatedHierarchyRoute("HTR-021"));

  await expect(page.locator("body")).toHaveAttribute("data-hierarchy-tree-review-viewport", "mobile");
  await expect(page.locator(".hierarchy-tree-preview-shell")).toHaveCSS("width", "390px");
  await expect(page.locator("#hierarchy-tree-live-note")).toHaveText("Mobile uses menu-only structural edits.");
  await expect(page.locator(".hierarchy-tree-drawer-resize")).toBeHidden();
  await expect(page.locator(".hierarchy-tree-inline-actions").first()).toBeHidden();

  const geometry = await page.evaluate(() => {
    const host = document.querySelector(".hierarchy-tree-preview-shell");
    const drawer = document.getElementById("hierarchy-tree-drawer");
    if (!(host instanceof HTMLElement) || !(drawer instanceof HTMLElement)) {
      return null;
    }

    const hostRect = host.getBoundingClientRect();
    const drawerRect = drawer.getBoundingClientRect();
    return {
      hostLeft: hostRect.left,
      hostRight: hostRect.right,
      drawerLeft: drawerRect.left,
      drawerRight: drawerRect.right,
      drawerWidth: drawerRect.width,
    };
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs(geometry!.drawerLeft - geometry!.hostLeft)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry!.drawerRight - geometry!.hostRight)).toBeLessThanOrEqual(1);
  expect(geometry!.drawerWidth).toBeLessThanOrEqual(391);
});

test("hierarchy-tree RTL canonical mirrors row chrome and content docking", async ({ page }) => {
  await page.goto(generatedHierarchyRoute("HTR-024"));

  const firstExpandableRow = page.locator(".hierarchy-tree-row").filter({ has: page.locator(".hierarchy-tree-expander") }).first();
  await expect(firstExpandableRow).toBeVisible();

  const geometry = await firstExpandableRow.evaluate((row) => {
    const expander = row.querySelector(".hierarchy-tree-expander");
    const actions = row.querySelector(".hierarchy-tree-row-actions");
    const content = row.querySelector(".hierarchy-tree-content");
    const title = row.querySelector(".hierarchy-tree-title");

    if (!(expander instanceof HTMLElement) || !(actions instanceof HTMLElement) || !(content instanceof HTMLElement) || !(title instanceof HTMLElement)) {
      return null;
    }

    const rowRect = row.getBoundingClientRect();
    const expanderRect = expander.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const titleAlign = getComputedStyle(title.closest(".hierarchy-tree-label-button") ?? title).textAlign;

    return {
      expanderCenter: expanderRect.left + (expanderRect.width / 2),
      actionsCenter: actionsRect.left + (actionsRect.width / 2),
      contentCenter: contentRect.left + (contentRect.width / 2),
      rowLeft: rowRect.left,
      rowRight: rowRect.right,
      titleAlign,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry!.expanderCenter).toBeGreaterThan(geometry!.contentCenter);
  expect(geometry!.actionsCenter).toBeLessThan(geometry!.contentCenter);
  expect(geometry!.titleAlign).toBe("right");
});

test("hierarchy-tree dark generated route keeps row copy and controls readable", async ({ page }) => {
  await page.goto(generatedHierarchyRoute("HTR-026"));

  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveAttribute("data-hierarchy-tree-surface", "canonical");
  await expect(page.locator(".hierarchy-tree-preview-shell")).toHaveAttribute("data-theme-scope", "dark");

  const themeScope = await page.evaluate(() => {
    const topNav = document.querySelector(".top-nav");
    const previewShell = document.querySelector(".hierarchy-tree-preview-shell");
    if (!(topNav instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
      return null;
    }

    const parseRgb = (value: string): number[] => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
    };
    const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      topNavBackgroundAverage: average(parseRgb(getComputedStyle(topNav).backgroundColor)),
      previewBackgroundAverage: average(parseRgb(getComputedStyle(previewShell).backgroundColor)),
    };
  });

  expect(themeScope).not.toBeNull();
  expect(themeScope!.topNavBackgroundAverage).toBeGreaterThan(200);
  expect(themeScope!.previewBackgroundAverage).toBeLessThan(80);

  const selectedRow = page.locator('.hierarchy-tree-row[data-selected="true"]').first();
  await expect(selectedRow).toContainText("Roadmap");

  const contrastState = await selectedRow.evaluate((row) => {
    const title = row.querySelector(".hierarchy-tree-title");
    const menuButton = row.querySelector(".hierarchy-tree-menu-button");
    if (!(title instanceof HTMLElement) || !(menuButton instanceof HTMLElement)) {
      return null;
    }

    const parseRgb = (value: string): number[] => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
    };
    const titleColor = parseRgb(getComputedStyle(title).color);
    const menuColor = parseRgb(getComputedStyle(menuButton).color);
    const rowBackground = parseRgb(getComputedStyle(row).backgroundColor);

    return {
      titleAverage: titleColor.reduce((sum, value) => sum + value, 0) / titleColor.length,
      menuAverage: menuColor.reduce((sum, value) => sum + value, 0) / menuColor.length,
      rowBackgroundAverage: rowBackground.reduce((sum, value) => sum + value, 0) / rowBackground.length,
    };
  });

  expect(contrastState).not.toBeNull();
  expect(contrastState!.titleAverage).toBeGreaterThan(150);
  expect(contrastState!.menuAverage).toBeGreaterThan(130);
  expect(contrastState!.rowBackgroundAverage).toBeLessThan(120);
});

test("hierarchy-tree generated magnification stays inside the render surface", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(generatedHierarchyRoute("HTR-027"));

  await expect(page.locator("html")).not.toHaveCSS("--ui-scale", "2");
  await expect(page.locator(".hierarchy-tree-preview-shell")).toHaveCSS("--ui-scale", "2");
  await expect(page.locator(".top-nav")).not.toHaveClass(/force-mobile-nav/);
  await expect(page.locator(".top-nav .mobile-nav-button")).toBeHidden();

  const shellGeometry = await page.evaluate(() => {
    const breadcrumbNav = document.querySelector(".design-system-shell > .sub-nav .breadcrumb-nav");
    const searchShell = document.querySelector(".design-system-shell > .sub-nav .search-shell");
    const topNavBrand = document.querySelector(".design-system-shell > .top-nav .brand-lockup");
    const renderFrame = document.querySelector(".canonical-render-frame");
    const previewShell = document.querySelector(".hierarchy-tree-preview-shell");

    if (
      !(breadcrumbNav instanceof HTMLElement) ||
      !(searchShell instanceof HTMLElement) ||
      !(topNavBrand instanceof HTMLElement) ||
      !(renderFrame instanceof HTMLElement) ||
      !(previewShell instanceof HTMLElement)
    ) {
      return null;
    }

    const breadcrumbRect = breadcrumbNav.getBoundingClientRect();
    const searchRect = searchShell.getBoundingClientRect();
    const brandRect = topNavBrand.getBoundingClientRect();
    const frameRect = renderFrame.getBoundingClientRect();
    const previewRect = previewShell.getBoundingClientRect();

    return {
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      breadcrumbRight: breadcrumbRect.right,
      searchLeft: searchRect.left,
      brandHeight: brandRect.height,
      frameClientWidth: renderFrame.clientWidth,
      frameScrollWidth: renderFrame.scrollWidth,
      frameRight: frameRect.right,
      previewWidth: previewRect.width,
      previewUnscaledWidth: previewShell.offsetWidth,
    };
  });

  expect(shellGeometry).not.toBeNull();
  expect(shellGeometry!.breadcrumbRight).toBeLessThanOrEqual(shellGeometry!.searchLeft + 1);
  expect(shellGeometry!.brandHeight).toBeLessThan(90);
  expect(shellGeometry!.documentScrollWidth).toBeLessThanOrEqual(shellGeometry!.documentClientWidth + 1);
  expect(shellGeometry!.frameScrollWidth).toBeGreaterThan(shellGeometry!.frameClientWidth);
  expect(shellGeometry!.frameRight).toBeLessThanOrEqual(shellGeometry!.documentClientWidth + 1);
  expect(shellGeometry!.previewWidth).toBeGreaterThan(shellGeometry!.previewUnscaledWidth);
});

test("hierarchy-tree long-title generated route preserves truncation and row menu access", async ({ page }) => {
  await page.goto(generatedHierarchyRoute("HTR-030"));

  const longTitle = page
    .locator(".hierarchy-tree-title")
    .filter({ hasText: "Roadmap for internationalization readiness" })
    .first();
  await expect(longTitle).toBeVisible();

  const overflowState = await longTitle.evaluate((title) => {
    const row = title.closest(".hierarchy-tree-row");
    const menuButton = row?.querySelector(".hierarchy-tree-menu-button");
    const rowActions = row?.querySelector(".hierarchy-tree-row-actions");
    if (!(title instanceof HTMLElement) || !(row instanceof HTMLElement) || !(menuButton instanceof HTMLElement) || !(rowActions instanceof HTMLElement)) {
      return null;
    }

    const titleRect = title.getBoundingClientRect();
    const menuRect = menuButton.getBoundingClientRect();
    const actionsRect = rowActions.getBoundingClientRect();

    return {
      clientWidth: title.clientWidth,
      scrollWidth: title.scrollWidth,
      tooltip: title.dataset.tooltip ?? "",
      titleRight: titleRect.right,
      menuLeft: menuRect.left,
      actionsLeft: actionsRect.left,
      menuWidth: menuRect.width,
    };
  });

  expect(overflowState).not.toBeNull();
  expect(overflowState!.scrollWidth).toBeGreaterThan(overflowState!.clientWidth);
  expect(overflowState!.tooltip).toContain("Roadmap for internationalization readiness");
  expect(overflowState!.titleRight).toBeLessThanOrEqual(overflowState!.actionsLeft + 1);
  expect(overflowState!.menuWidth).toBeGreaterThan(0);
});

test("hierarchy-tree canonical launcher and render routes populate breadcrumb structure accurately", async ({ page }) => {
  await page.goto("/design-system/canonicals/hierarchy-tree");
  const launcherBreadcrumb = page.locator("#breadcrumb-list");
  await expect(launcherBreadcrumb).toContainText("Home");
  await expect(launcherBreadcrumb).toContainText("Hierarchy Tree");
  await expect(launcherBreadcrumb).toContainText("Canonicals");
  await expect(page.locator(".canonical-launcher-button")).toHaveCount(34);
  await expect(page.locator('.canonical-launcher-button[href*="ref=HTR-034"]')).toBeVisible();

  await page.goto(
    "/design-system/patterns/hierarchy-tree/render?ref=HTR-010&state=row-menu-open&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
  );
  const renderBreadcrumb = page.locator("#breadcrumb-list");
  await expect(renderBreadcrumb).not.toHaveClass(/hidden/);
  await expect(page.locator("#breadcrumb-compact")).toHaveClass(/hidden/);
  await expect(renderBreadcrumb).toContainText("Home");
  await expect(renderBreadcrumb).toContainText("Canonicals");
  await expect(page.locator("#breadcrumb-current-item .breadcrumb-current")).toHaveText(/HTR-010/);
});

test("hierarchy-tree generated launcher exposes generated render links for the priority batch", async ({ page }) => {
  await page.goto("/design-system/canonical-renderings/hierarchy-tree");

  const launcherButtons = page.locator(".canonical-launcher-button");
  await expect(launcherButtons).toHaveCount(34);

  for (const ref of ["HTR-022", "HTR-024", "HTR-026", "HTR-030"]) {
    await expect(page.locator(`.canonical-launcher-button[href="${generatedHierarchyRoute(ref)}"]`)).toBeVisible();
  }
});

test("hierarchy-tree generated canonical-rendering route preserves the signed-off specimen surface", async ({ page }) => {
  await page.goto(generatedHierarchyRoute("HTR-022"));

  await expect(page.locator(".design-system-page-main")).toHaveClass(/canonical-render-page/);
  await expect(page.locator(".canonical-render-frame")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review This Pattern" })).toHaveCount(0);
  await expect(page.getByText("This route is now the live hierarchy-tree reference page")).toHaveCount(0);
  await expect(page.locator("#hierarchy-tree-tree .hierarchy-tree-row")).not.toHaveCount(0);
  await expect(page.locator("body")).toHaveAttribute("data-hierarchy-tree-surface", "canonical");
  await expect(page.locator(".hierarchy-tree-row-menu")).toContainText("Open in new tab");
  await expect(page.locator("#breadcrumb-current-item .breadcrumb-current")).toHaveText(/HTR-022/);
  await expect(page.getByRole("heading", { name: /Design-System Route Families/i })).toHaveCount(0);
});

test("hierarchy-tree generated drawer stays inside the canonical preview shell", async ({ page }) => {
  await page.goto(generatedHierarchyRoute("HTR-022"));

  await expectCanonicalOverlayContainedInRenderSurface(page, {
    label: "HTR-022 hierarchy-tree drawer",
    overlay: "#hierarchy-tree-drawer",
    panel: "#hierarchy-tree-drawer",
    hostSurface: ".hierarchy-tree-preview-shell",
    renderFrame: ".hierarchy-tree-preview-shell",
    requirePanelWidthWithinHost: true,
  });
  await expect(page.locator(".hierarchy-tree-preview-shell")).toHaveAttribute("data-canonical-drawer-host", "true");
});

test("hierarchy-tree paired display drawer hugs the hierarchy drawer", async ({ page }) => {
  await page.goto(generatedHierarchyRoute("HTR-020"));

  await expect(page.locator("#hierarchy-tree-drawer")).toBeVisible();
  await expect(page.locator("#hierarchy-tree-display-drawer")).toBeVisible();

  const geometry = await page.evaluate(() => {
    const host = document.querySelector(".hierarchy-tree-preview-shell");
    const drawer = document.getElementById("hierarchy-tree-drawer");
    const displayDrawer = document.getElementById("hierarchy-tree-display-drawer");
    if (!(host instanceof HTMLElement) || !(drawer instanceof HTMLElement) || !(displayDrawer instanceof HTMLElement)) {
      return null;
    }

    const hostRect = host.getBoundingClientRect();
    const drawerRect = drawer.getBoundingClientRect();
    const displayRect = displayDrawer.getBoundingClientRect();

    return {
      hostLeft: hostRect.left,
      hostRight: hostRect.right,
      drawerLeft: drawerRect.left,
      drawerRight: drawerRect.right,
      displayLeft: displayRect.left,
      displayRight: displayRect.right,
      displayWidth: displayRect.width,
    };
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs(geometry!.displayLeft - geometry!.drawerRight)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry!.drawerLeft - geometry!.hostLeft)).toBeLessThanOrEqual(1);
  expect(geometry!.displayRight).toBeLessThanOrEqual(geometry!.hostRight + 1);
  expect(geometry!.displayWidth).toBeGreaterThan(320);
});
