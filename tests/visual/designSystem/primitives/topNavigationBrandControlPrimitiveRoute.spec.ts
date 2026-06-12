import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/top-navigation-brand-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("top navigation brand primitive route", () => {
  test("renders governed native brand anchors", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 760 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Top Navigation Brand Control Primitive", level: 1 })).toBeVisible();
    const proof = page.getByLabel("Primitive proof");
    const brand = proof.getByRole("link", { name: "Kanbien" });
    const longBrand = proof.getByRole("link", { name: "Very long product brand label" });

    await expect(brand).toBeVisible();
    await expect(longBrand).toBeVisible();
    await brand.focus();
    await expect(brand).toBeFocused();

    const boxes = await page.locator("[data-top-navigation-brand-control]").evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        const nestedFocusableCount = element.querySelectorAll("a, button, input, select, textarea, [tabindex]").length;
        return { width: box.width, height: box.height, nestedFocusableCount };
      }),
    );

    expect(boxes.length).toBe(2);
    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.nestedFocusableCount).toBe(0);
    }
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
