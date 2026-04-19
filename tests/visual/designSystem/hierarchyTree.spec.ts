import { expect, test } from "@playwright/test";

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

test("hierarchy-tree RTL canonical mirrors row chrome and content docking", async ({ page }) => {
  await page.goto(
    "/design-system/patterns/hierarchy-tree/render?ref=HTR-024&state=rtl-docking&width=1220&theme=normal&dir=rtl&zoom=0&accent=%23635bff",
  );

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
