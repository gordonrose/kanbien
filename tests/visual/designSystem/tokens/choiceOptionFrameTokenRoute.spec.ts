import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/choice-option-frame";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function diagnosticStyles(page: Page) {
  return page.evaluate(() => {
    const background = document.querySelector("[data-token-diagnostic-role='choice-option-background']");
    const border = document.querySelector("[data-token-diagnostic-role='choice-option-border']");

    if (!(background instanceof HTMLElement) || !(border instanceof HTMLElement)) {
      return null;
    }

    return {
      background: getComputedStyle(background).backgroundColor,
      borderOutline: getComputedStyle(border).outlineColor,
    };
  });
}

test.describe("choice option frame token route", () => {
  test("renders selectable option frame states and dependency diagnostic", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Choice Option Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--choice-option-frame-default-original")).toBeVisible();
    await expect(page.getByText("--choice-option-frame-selected-original")).toBeVisible();
    await expect(page.getByText("--choice-option-frame-disabled-original")).toBeVisible();
    await expect(page.getByText("--choice-option-frame-error-original")).toBeVisible();
    await expect(page.getByText("--choice-option-frame-selected-dark")).toBeVisible();
    await expect(page.getByText("--choice-option-frame-selected-desert")).toBeVisible();
    await expect(page.getByText("Original selected option")).toBeVisible();
    await expect(page.getByText("Dark selected option")).toBeVisible();
    await expect(page.getByText("Desert selected option")).toBeVisible();
    await expect(page.getByText("undefined")).toHaveCount(0);
    await expect(page.getByText("--label-text-style-short-default").first()).toBeVisible();
    await expect(page.getByText("--supporting-text-style-default").first()).toBeVisible();
    await expect(page.getByLabel("Preview primary HEX")).toHaveValue("#635bff");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const before = await diagnosticStyles(page);
    await page.getByLabel("Preview primary HEX").fill("#2f855a");
    await expect(page.getByText("Temporary preview only. Signed choice-option-frame token values remain unchanged.")).toBeVisible();
    const after = await diagnosticStyles(page);

    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after?.background).not.toBe(before?.background);
    expect(after?.borderOutline).not.toBe(before?.borderOutline);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Choice Option Frame Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--choice-option-frame-selected-desert")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
