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
    await expect(page.locator('[data-entity-page-header-slot-summary="context-title"]')).toHaveText("9-19");

    await page.locator("[data-entity-page-header-secondary-control]").setChecked(false);
    await expect(page.locator('[data-entity-page-header-slot-summary="primary-filter"]')).toHaveText("2-4");
    await expect(page.locator('[data-entity-page-header-slot-summary="secondary-filter"]')).toHaveText("5-7");
    await expect(page.locator('[data-entity-page-header-slot-summary="context-title"]')).toHaveText("8-19");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps actions compacted to the right under width pressure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-entity-page-header-action-count-control]").selectOption("2");
    await expect(page.locator('[data-entity-page-header-slot-summary="context-title"]')).toHaveText("9-22");
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
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
