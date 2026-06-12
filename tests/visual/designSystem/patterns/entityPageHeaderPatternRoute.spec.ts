import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/entity-page-header";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("entity page header pattern route", () => {
  test("renders the governed header pattern and slot evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Entity Page Header Pattern", level: 1 })).toBeVisible();
    const header = page.locator("[data-entity-page-header]").first();
    await expect(header).toBeVisible();
    await expect(page.locator("[data-readiness-status-control]").first()).toHaveAttribute(
      "aria-label",
      "Status: Ready",
    );
    await expect(page.getByText("entityPageHeaderPattern", { exact: true })).toBeVisible();
    await expect(page.getByText("--page-header-structure", { exact: true })).toBeVisible();
    await expect(page.locator('[data-entity-page-header-slot-summary="context-title"]')).toHaveText("11-19");

    await page.locator("[data-entity-page-header-region-boundaries-control]").setChecked(false);
    await expect(header).toHaveAttribute("data-entity-page-header-region-boundaries", "false");
    await page.locator("[data-entity-page-header-primary-filter-control]").setChecked(false);
    await expect(page.locator('[data-entity-page-header-slot-summary="primary-filter"]')).toHaveCount(0);
    await page.locator("[data-entity-page-header-primary-filter-control]").setChecked(true);
    await page.locator("[data-entity-page-header-secondary-filter-control]").setChecked(false);
    await expect(page.locator('[data-entity-page-header-slot-summary="secondary-filter"]')).toHaveCount(0);
    await page.locator("[data-entity-page-header-secondary-filter-control]").setChecked(true);
    await page.locator("[data-entity-page-header-secondary-control]").setChecked(false);
    await expect(page.locator('[data-entity-page-header-slot-summary="primary-filter"]')).toHaveText("2-5");
    await expect(page.locator('[data-entity-page-header-slot-summary="secondary-filter"]')).toHaveText("6-9");
    await expect(page.locator('[data-entity-page-header-slot-summary="context-title"]')).toHaveText("10-19");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps actions compacted to the right under width pressure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-entity-page-header-action-count-control]").selectOption("2");
    await expect(page.locator('[data-entity-page-header-slot-summary="context-title"]')).toHaveText("11-22");
    await expect(page.locator('[data-entity-page-header-slot-summary="action-1"]')).toHaveText("23-23");
    await expect(page.locator('[data-entity-page-header-slot-summary="action-2"]')).toHaveText("24-24");

    await page.locator("[data-entity-page-header-readiness-control]").selectOption("blocked");
    await expect(page.locator("[data-readiness-status-control]").first()).toHaveAttribute(
      "aria-label",
      "Status: Blocked",
    );
    await page.locator("[data-entity-page-header-width-control]").selectOption("squeezed");
    await expect(page.locator("[data-entity-page-header-proof-host]")).toHaveAttribute(
      "data-entity-page-header-proof-width",
      "squeezed",
    );

    const toolsTrigger = page.locator("[data-entity-page-header-tools-trigger]");
    await expect(toolsTrigger).toHaveAttribute("data-icon-button-control", "");
    await toolsTrigger.click();
    const toolsMenu = page.locator("[data-entity-page-header-tools-menu]");
    await expect(toolsMenu).toBeVisible();
    await expect(toolsMenu.locator("[data-entity-page-header-tools-close]")).toHaveAttribute(
      "data-icon-button-control",
      "",
    );
    await expect(toolsMenu.locator("[data-entity-page-header-tools-action][data-text-action-button-control]")).toHaveCount(
      2,
    );

    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
