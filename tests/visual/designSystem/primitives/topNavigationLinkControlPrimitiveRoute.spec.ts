import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/top-navigation-link-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("top navigation link primitive route", () => {
  test("renders governed native anchors with current semantics and target size", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Top Navigation Link Control Primitive", level: 1 })).toBeVisible();

    const proof = page.getByLabel("Primitive proof");
    const home = proof.getByRole("link", { name: "Home" });
    const current = proof.getByRole("link", { name: "Current" });
    const settings = proof.getByRole("link", { name: "Settings" });
    await expect(home).toBeVisible();
    await expect(current).toBeVisible();
    await expect(settings).toBeVisible();
    await expect(current).toHaveAttribute("aria-current", "page");

    const linkBoxes = await page.locator("[data-top-navigation-link-control]").evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        const nestedFocusableCount = element.querySelectorAll("a, button, input, select, textarea, [tabindex]").length;
        return {
          width: box.width,
          height: box.height,
          nestedFocusableCount,
        };
      }),
    );

    expect(linkBoxes.length).toBeGreaterThanOrEqual(4);
    for (const box of linkBoxes) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.nestedFocusableCount).toBe(0);
    }

    await home.focus();
    await expect(home).toBeFocused();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps the primitive usable under narrow label pressure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 760 });
    await page.goto(route);

    const longLabel = page.getByRole("link", { name: "Very long destination label" });
    await expect(longLabel).toBeVisible();
    await longLabel.focus();
    await expect(longLabel).toBeFocused();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
