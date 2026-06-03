import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/toggle-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function diagnosticStyles(page: Page) {
  return page.evaluate(() => {
    const track = document.querySelector("[data-token-diagnostic-role='toggle-track-on']");
    const thumb = document.querySelector("[data-token-diagnostic-role='toggle-thumb-on']");
    const border = document.querySelector("[data-token-diagnostic-role='toggle-border-on']");

    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement) || !(border instanceof HTMLElement)) {
      return null;
    }

    return {
      trackBackground: getComputedStyle(track).backgroundColor,
      thumbColor: getComputedStyle(thumb).color,
      borderOutline: getComputedStyle(border).outlineColor,
    };
  });
}

test.describe("toggle frame token route", () => {
  test("renders governed toggle-frame variants and dependency diagnostic", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Toggle Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--toggle-frame-off-original")).toBeVisible();
    await expect(page.getByText("--toggle-frame-on-original")).toBeVisible();
    await expect(page.getByText("--toggle-frame-error-original")).toBeVisible();
    await expect(page.getByText("primary tint tokens").first()).toBeVisible();
    await expect(page.getByText("--target-size-interactive-min").first()).toBeVisible();
    await expect(page.getByText("Track padding").first()).toBeVisible();
    await expect(page.getByText("Track radius").first()).toBeVisible();
    await expect(page.getByLabel("Preview primary HEX")).toHaveValue("#635bff");
    await expect(page.getByLabel("Host surface")).toHaveValue("#ffffff");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const before = await diagnosticStyles(page);
    await page.getByLabel("Preview primary HEX").fill("#2f855a");
    await expect(page.getByText("Temporary preview only. Signed toggle-frame token values remain unchanged.")).toBeVisible();
    const after = await diagnosticStyles(page);

    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after?.trackBackground).not.toBe(before?.trackBackground);
    expect(after?.thumbColor).not.toBe(before?.thumbColor);
    expect(after?.borderOutline).not.toBe(before?.borderOutline);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Toggle Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--toggle-frame-on-desert")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
