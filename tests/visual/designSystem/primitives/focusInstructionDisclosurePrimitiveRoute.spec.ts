import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/focus-instruction-disclosure";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function focusByKeyboard(page: Page, accessibleName: string) {
  const target = page.getByRole("button", { name: accessibleName });
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((node) => node === document.activeElement)) {
      return target;
    }
  }
  throw new Error(`Could not keyboard-focus ${accessibleName}.`);
}

test.describe("focus instruction disclosure primitive route", () => {
  test("shows focus-only instruction without stealing focus", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Focus Instruction Disclosure Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-focus-instruction-disclosure-host]")).toHaveCount(3);
    await expect(page.locator("[data-focus-instruction-disclosure]")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const reorderHost = page.getByRole("button", { name: "Reorderable record row" });
    const describedBy = await reorderHost.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Use Alt plus Arrow Up or Arrow Down to reorder.");
    await expect(page.locator(`#${describedBy}`)).toBeHidden();

    await focusByKeyboard(page, "Reorderable record row");
    await expect(reorderHost).toBeFocused();
    await expect(reorderHost).toHaveAttribute("data-focus-instruction-disclosure-open", "true");
    await expect(page.locator(`#${describedBy}`)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(reorderHost).toBeFocused();
    await expect(reorderHost).toHaveAttribute("data-focus-instruction-disclosure-open", "false");

    await page.keyboard.press("Tab");
    await expect(page.locator(`#${describedBy}`)).toBeHidden();
  });

  test("keeps constrained mobile instruction contained", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Focus Instruction Disclosure Primitive", level: 1 })).toBeVisible();
    await focusByKeyboard(page, "Constrained host with long focused label text");
    await expect(page.locator("#focus-instruction-disclosure-proof-constrained")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
