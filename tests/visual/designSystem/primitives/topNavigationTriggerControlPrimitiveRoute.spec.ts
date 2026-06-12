import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/top-navigation-trigger-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("top navigation trigger primitive route", () => {
  test("renders governed native triggers with expanded semantics and target size", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Top Navigation Trigger Control Primitive", level: 1 })).toBeVisible();

    const proof = page.getByLabel("Primitive proof");
    const more = proof.getByRole("button", { name: "More", exact: true }).first();
    const moreOpen = proof.locator("#top-navigation-trigger-proof-more-open");
    const profile = proof.getByRole("button", { name: "Profile", exact: true });
    const menu = proof.getByRole("button", { name: "Menu", exact: true });
    await expect(more).toBeVisible();
    await expect(moreOpen).toHaveAttribute("aria-expanded", "true");
    await expect(profile).toBeVisible();
    await expect(menu).toBeVisible();

    const triggerBoxes = await page.locator("[data-top-navigation-trigger-control]").evaluateAll((elements) =>
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

    expect(triggerBoxes.length).toBeGreaterThanOrEqual(5);
    for (const box of triggerBoxes) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.nestedFocusableCount).toBe(0);
    }

    await profile.focus();
    await expect(profile).toBeFocused();
    await profile.click();
    await expect(page.getByText("Toggle request log: profile / closed")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps the primitive usable under narrow trigger label pressure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 760 });
    await page.goto(route);

    const longProfile = page.getByRole("button", { name: "Long profile account label" });
    await expect(longProfile).toBeVisible();
    await longProfile.focus();
    await expect(longProfile).toBeFocused();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
