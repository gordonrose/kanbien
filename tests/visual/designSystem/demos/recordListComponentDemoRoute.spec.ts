import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/demos/record-list-component";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("record list component demo route", () => {
  test("direct route renders the Layer 5 component seam instead of the overview fallback", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Record List Component Demo", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design-System Route Families" })).toHaveCount(0);
    await expect(page.locator("[data-record-list-component]")).toHaveCount(1);
    await expect(page.locator("[data-record-list-pattern]")).toHaveCount(1);
    await expect(page.locator("[data-record-list-item-control]")).toHaveCount(4);
    await expect(page.locator("[data-detail-slot-control]")).toBeVisible();
    await expect(page.locator("[data-resize-handle-control]")).toBeVisible();
    await expect(page.locator("[data-record-list-pattern-live-region]")).toHaveAttribute("aria-live", "polite");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("root-users pressure fixture suppresses reorder affordances through allowReorder false", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-record-list-component-demo-control='fixtureState']").selectOption("root-users");

    await expect(page.getByRole("heading", { name: "Record List Component Demo", level: 1 })).toBeVisible();
    await expect(page.locator("[data-record-list-pattern-reorder='disabled']")).toHaveCount(1);
    await expect(page.locator("[draggable='true']")).toHaveCount(0);
    await expect(page.locator("[aria-keyshortcuts='Alt+ArrowUp Alt+ArrowDown']")).toHaveCount(0);
    await expect(page.getByText("Use Alt plus Arrow Up or Arrow Down to reorder.")).toHaveCount(0);
  });
});
