import { expect, test, type Page } from "@playwright/test";

const routes = [
  {
    route: "/design-system/default/tokens/index-nav-item-radius",
    heading: "Index Nav Item Radius Token",
    sampleSelector: ".token-spec-radius-sample",
  },
  {
    route: "/design-system/default/tokens/index-nav-item-padding",
    heading: "Index Nav Item Padding Tokens",
    sampleSelector: ".token-spec-padding-sample",
  },
  {
    route: "/design-system/default/tokens/index-nav-item-gap",
    heading: "Index Nav Item Gap Token",
    sampleSelector: ".token-spec-gap-sample",
  },
] as const;

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav item frame token routes", () => {
  for (const item of routes) {
    test(`${item.heading} renders desktop and mobile proof`, async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(item.route);

      await expect(page.getByRole("heading", { name: item.heading, level: 1 })).toBeVisible();
      await expect(page.locator(item.sampleSelector).first()).toBeVisible();
      await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(item.route);

      await expect(page.getByRole("heading", { name: item.heading, level: 1 })).toBeVisible();
      await expect(page.locator(item.sampleSelector).first()).toBeVisible();
      await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
});
