import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/minimum-target-size";

async function visibleTextOverflow(page: Page) {
  return page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".token-spec-page h1, .token-spec-page h2, .token-spec-page h3, .token-spec-page p, .token-spec-page code, .token-spec-page li, .token-spec-page dd, .token-spec-page dt",
      ),
    )
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element.offsetParent !== null)
      .map((element) => ({
        text: element.textContent?.trim().slice(0, 80) ?? "",
        overflow: element.scrollWidth - element.clientWidth,
      }))
      .filter((item) => item.overflow > 2);
  });
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function targetBoxGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".token-spec-target-box")).map((element) => {
      const target = element as HTMLElement;
      const rect = target.getBoundingClientRect();

      return {
        text: target.textContent?.trim() ?? "",
        width: rect.width,
        height: rect.height,
      };
    });
  });
}

test.describe("minimum target size token route", () => {
  test("desktop renders governed target-size boxes without layout overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Minimum Target Size Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(2);
    await expect(page.getByText("Each row is a reusable target-size decision")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const boxes = await targetBoxGeometry(page);
    const target = boxes.find((box) => box.text === "44 x 44");
    const gap = boxes.find((box) => box.text === "8px gap");

    expect(target).toBeDefined();
    expect(target?.width).toBeGreaterThanOrEqual(44);
    expect(target?.height).toBeGreaterThanOrEqual(44);
    expect(gap).toBeDefined();
    expect(gap?.width).toBeGreaterThanOrEqual(8);
    expect(gap?.height).toBeGreaterThanOrEqual(8);
  });

  test("mobile and rtl keep target-size proof visible and navigation operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Minimum Target Size Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const target = (await targetBoxGeometry(page)).find((box) => box.text === "44 x 44");

    expect(target).toBeDefined();
    expect(target?.width).toBeGreaterThanOrEqual(44);
    expect(target?.height).toBeGreaterThanOrEqual(44);

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
