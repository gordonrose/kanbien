import { expect, test } from "@playwright/test";

test("uses only the styled dropdown for public showcase navigation on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("/projects/front-end-builder");

  const select = page.locator("[data-showcase-select]");
  const tabs = page.locator(".public-site-showcase-tabs");

  await expect(select).toBeVisible();
  await expect(tabs).toBeHidden();

  const selectStyle = await select.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      appearance: style.appearance,
      backgroundImage: style.backgroundImage,
      borderTopColor: style.borderTopColor,
      boxShadow: style.boxShadow,
      minHeight: style.minHeight,
    };
  });

  expect(selectStyle.appearance).toBe("none");
  expect(selectStyle.backgroundImage).toContain("linear-gradient");
  expect(selectStyle.borderTopColor).not.toBe("rgb(0, 0, 0)");
  expect(selectStyle.boxShadow).not.toBe("none");
  expect(selectStyle.minHeight).toBe("54.4px");
});

test("keeps the public showcase tablist on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto("/projects/front-end-builder");

  await expect(page.locator("[data-showcase-select]")).toBeHidden();
  await expect(page.locator(".public-site-showcase-tabs")).toBeVisible();
});
