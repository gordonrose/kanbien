import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.ceil(document.documentElement.scrollWidth - document.documentElement.clientWidth));
}

test.describe("default system proof index", () => {
  test("lists token, primitive, and pattern proof routes in grouped sections", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Default Render Proofs", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Token Proofs", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Primitive Proofs", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pattern Proofs", level: 2 })).toBeVisible();

    await expect(page.locator("[data-default-proof-index-summary] dd")).toHaveText(["48", "26", "22"]);
    await expect(page.locator("[data-default-proof-index-group]")).toHaveCount(16);

    await expect(page.getByRole("link", { name: /Background Color/ })).toHaveAttribute(
      "href",
      "/design-system/default/tokens/background-color",
    );
    await expect(page.getByRole("link", { name: /Text Field Control/ })).toHaveAttribute(
      "href",
      "/design-system/default/primitives/text-field-control",
    );
    await expect(page.getByRole("link", { name: /Record List Form/ })).toHaveAttribute(
      "href",
      "/design-system/default/patterns/record-list-form",
    );

    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps grouped proof links usable on mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Default Render Proofs", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Index Nav Panel Frame/ })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
