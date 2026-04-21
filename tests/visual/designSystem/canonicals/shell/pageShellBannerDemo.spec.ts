import { expect, test } from "@playwright/test";

test("page-shell banner demo reveals the full approved stack with visible dismiss controls and spacing below", async ({ page }) => {
  await page.goto("/design-system/templates/page-shell");

  await page.locator("#accessibility-button").click();
  await page.getByRole("button", { name: "Show banners" }).click();

  const bannerDemo = page.locator("[data-page-shell-banner-demo]");
  const bannerCards = page.locator("[data-page-shell-banner-card]");
  const header = page.locator(".component-catalog-section-header");

  await expect(bannerDemo).toBeVisible();
  await expect(bannerCards).toHaveCount(4);
  await expect(page.locator(".status-message-close")).toHaveCount(4);

  const geometry = await page.evaluate(() => {
    const demo = document.querySelector<HTMLElement>("[data-page-shell-banner-demo]");
    const headerNode = document.querySelector<HTMLElement>(".component-catalog-section-header");
    const firstBanner = document.querySelector<HTMLElement>("[data-page-shell-banner-card]");

    return {
      demoBottomMargin: demo ? Number.parseFloat(window.getComputedStyle(demo).marginBottom) : 0,
      gapToHeader:
        demo && headerNode
          ? Math.round(headerNode.getBoundingClientRect().top - demo.getBoundingClientRect().bottom)
          : 0,
      firstBannerHasClose:
        !!firstBanner?.querySelector<HTMLElement>(".status-message-close"),
    };
  });

  expect(geometry.firstBannerHasClose).toBe(true);
  expect(geometry.demoBottomMargin).toBeGreaterThan(0);
  expect(geometry.gapToHeader).toBeGreaterThanOrEqual(16);
});

test("page-shell banner demo keeps the remaining states visible after dismissing one banner", async ({ page }) => {
  await page.goto("/design-system/templates/page-shell");

  await page.locator("#accessibility-button").click();
  await page.getByRole("button", { name: "Show banners" }).click();
  await page.locator("[data-page-shell-banner-dismiss='warning']").click();

  await expect(page.locator("[data-page-shell-banner-card='warning']")).toHaveClass(/hidden/);
  await expect(page.locator("[data-page-shell-banner-card='info']")).toBeVisible();
  await expect(page.locator("[data-page-shell-banner-card='success']")).toBeVisible();
  await expect(page.locator("[data-page-shell-banner-card='danger']")).toBeVisible();
});
