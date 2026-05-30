import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/dropdown-trigger-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("dropdown-trigger-frame token route", () => {
  test("renders state variants and dependency formulas without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Dropdown Trigger Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--dropdown-trigger-frame-default-original")).toBeVisible();
    await expect(page.getByText("--dropdown-trigger-frame-open-original")).toBeVisible();
    await expect(page.getByText("open trigger state uses signed primary tint background").first()).toBeVisible();
    await expect(page.getByText("Consumers must not reuse text-control-frame for dropdown triggers.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
