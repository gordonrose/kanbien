import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/button-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function diagnosticStyles(page: Page) {
  return page.evaluate(() => {
    const background = document.querySelector("[data-token-diagnostic-role='button-background']");
    const border = document.querySelector("[data-token-diagnostic-role='button-border']");

    if (!(background instanceof HTMLElement) || !(border instanceof HTMLElement)) {
      return null;
    }

    return {
      background: getComputedStyle(background).backgroundColor,
      borderOutline: getComputedStyle(border).outlineColor,
    };
  });
}

test.describe("button frame token route", () => {
  test("renders reusable button-frame variants and dependency diagnostic", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Button Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--button-frame-icon-quiet-original")).toBeVisible();
    await expect(page.getByText("--button-frame-icon-subtle-original")).toBeVisible();
    await expect(page.getByText("--button-frame-text-action-original")).toBeVisible();
    await expect(page.getByText("background uses the signed host surface directly").first()).toBeVisible();
    await expect(page.getByText("background mixes primary source 10%").first()).toBeVisible();
    await expect(page.getByText("--label-text-style-short-default").first()).toBeVisible();
    await expect(page.getByLabel("Preview primary HEX")).toHaveValue("#635bff");
    await expect(page.getByLabel("Host surface")).toHaveValue("#ffffff");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const before = await diagnosticStyles(page);
    await page.getByLabel("Preview primary HEX").fill("#2f855a");
    await expect(page.getByText("Temporary preview only. Signed button-frame token values remain unchanged.")).toBeVisible();
    const after = await diagnosticStyles(page);

    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after?.background).not.toBe(before?.background);
    expect(after?.borderOutline).not.toBe(before?.borderOutline);

    await page.getByLabel("Host surface").selectOption("#f7f8fb");
    const afterSurface = await diagnosticStyles(page);

    expect(afterSurface?.background).not.toBe(after?.background);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Button Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--button-frame-icon-quiet-desert")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
