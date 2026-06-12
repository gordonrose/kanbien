import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/context-navigation-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("context navigation frame token route", () => {
  test("renders signed context navigation frame and mobile pinning evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Context Navigation Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--context-navigation-frame")).toBeVisible();
    await expect(page.locator(".token-spec-context-nav-frame-preview").first()).toBeVisible();
    await expect(page.locator(".token-spec-context-nav-frame-diagram--desktop").first()).toBeVisible();
    await expect(page.locator(".token-spec-context-nav-frame-diagram--mobile").first()).toBeVisible();
    await expect(page.getByText("Desktop rail").first()).toBeVisible();
    await expect(page.getByText("Primary scroll").first()).toBeVisible();
    await expect(page.getByText("Utility anchor").first()).toBeVisible();
    await expect(page.getByText("Mobile bottom bar").first()).toBeVisible();
    await expect(page.getByText("Viewport pinned").first()).toBeVisible();
    await expect(page.getByText("5.75rem", { exact: true })).toBeVisible();
    await expect(page.getByText("bottom bar remains fixed to the visual viewport bottom during document scroll and page-end pressure")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByText("Mobile bottom bar").first()).toBeVisible();
    await expect(page.getByText("Viewport pinned").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
