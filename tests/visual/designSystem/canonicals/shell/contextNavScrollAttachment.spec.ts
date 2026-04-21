import { expect, test } from "@playwright/test";

test("context-nav stays attached to the shell during scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/design-system/canonicals/context-nav");

  const topNav = page.locator(".top-nav");
  const subNav = page.locator(".sub-nav");
  const contextNav = page.locator(".context-nav");

  await expect(topNav).toBeVisible();
  await expect(subNav).toBeVisible();
  await expect(contextNav).toBeVisible();

  const assertAttachment = async (scrollY: number) => {
    await page.evaluate((value) => window.scrollTo(0, value), scrollY);

    const topNavBox = await topNav.boundingBox();
    const subNavBox = await subNav.boundingBox();
    const contextNavBox = await contextNav.boundingBox();

    expect(topNavBox).not.toBeNull();
    expect(subNavBox).not.toBeNull();
    expect(contextNavBox).not.toBeNull();

    if (!topNavBox || !subNavBox || !contextNavBox) {
      return;
    }

    expect(Math.round(topNavBox.y)).toBe(0);

    const expectedContextTop = Math.max(
      Math.round(topNavBox.y + topNavBox.height),
      Math.round(subNavBox.y + subNavBox.height),
    );

    expect(Math.round(contextNavBox.y)).toBe(expectedContextTop);
  };

  await assertAttachment(60);
  await assertAttachment(320);
});
