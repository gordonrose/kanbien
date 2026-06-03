import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/status-color";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function diagnosticStyles(page: Page) {
  return page.evaluate(() => {
    const background = document.querySelector("[data-token-diagnostic-role='status-background']");
    const foreground = document.querySelector("[data-token-diagnostic-role='status-foreground']");
    const border = document.querySelector("[data-token-diagnostic-role='status-border']");
    const subtle = document.querySelector("[data-token-diagnostic-role='status-subtle']");
    const strong = document.querySelector("[data-token-diagnostic-role='status-strong']");

    if (
      !(background instanceof HTMLElement) ||
      !(foreground instanceof HTMLElement) ||
      !(border instanceof HTMLElement) ||
      !(subtle instanceof HTMLElement) ||
      !(strong instanceof HTMLElement)
    ) {
      return null;
    }

    return {
      backgroundColor: getComputedStyle(background).backgroundColor,
      foregroundColor: getComputedStyle(foreground).color,
      borderOutline: getComputedStyle(border).outlineColor,
      subtleBackground: getComputedStyle(subtle).backgroundColor,
      strongBackground: getComputedStyle(strong).backgroundColor,
    };
  });
}

test.describe("status-color token route", () => {
  test("renders warning status colours and proof-only dependency diagnostic", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Status Color Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--status-color-warning-original")).toBeVisible();
    await expect(page.getByText("--status-color-warning-dark")).toBeVisible();
    await expect(page.getByText("--status-color-warning-desert")).toBeVisible();
    await expect(page.getByText("--background-surface-original").first()).toBeVisible();
    await expect(page.getByText("warning status values mix a signed warning source color").first()).toBeVisible();
    await expect(page.getByLabel("Preview warning HEX")).toHaveValue("#8a4b08");
    await expect(page.getByLabel("Host surface")).toHaveValue("#ffffff");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const before = await diagnosticStyles(page);
    await page.getByLabel("Preview warning HEX").fill("#b45309");
    await page.getByLabel("Host surface").selectOption({ label: "desert surface" });
    await expect(page.getByText("Temporary preview only. Signed status-colour token values remain unchanged.")).toBeVisible();
    const after = await diagnosticStyles(page);

    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after?.backgroundColor).not.toBe(before?.backgroundColor);
    expect(after?.foregroundColor).not.toBe(before?.foregroundColor);
    expect(after?.borderOutline).not.toBe(before?.borderOutline);
    expect(after?.subtleBackground).not.toBe(before?.subtleBackground);
    expect(after?.strongBackground).not.toBe(before?.strongBackground);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Status Color Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--status-color-warning-desert")).toBeVisible();
    await expect(page.getByLabel("Preview warning HEX")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
