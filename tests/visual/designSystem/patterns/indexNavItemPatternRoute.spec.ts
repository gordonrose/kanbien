import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/index-nav-item";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav item pattern route", () => {
  test("desktop renders configurable item/card proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-index-nav-item]")).toHaveCount(3);
    await expect(page.getByRole("button", { name: "Identity and source authority ownership model" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByText("Activation log: workflow")).toBeVisible();

    await page.locator("[data-index-nav-item-theme-control]").selectOption("dark");
    await expect(page.locator("[data-index-nav-item-control-theme='dark']")).toHaveCount(3);
    await page.locator("[data-index-nav-item-state-control]").selectOption("disabled");
    await expect(page.getByRole("button", { name: "Identity and source authority ownership model" })).toBeDisabled();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps item height stable when supporting text is hidden", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const firstItem = page.locator("#index-nav-item-proof-0-control");
    const visibleHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);

    await page.locator("[data-index-nav-item-supporting-text-control]").selectOption("hidden");
    await expect(page.locator("[data-index-nav-item-control-supporting-empty='true']")).toHaveCount(3);
    const hiddenHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);

    expect(Math.abs(visibleHeight - hiddenHeight)).toBeLessThanOrEqual(1);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("preserves item behavior under RTL and enlarged review scale", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const firstItem = page.locator("#index-nav-item-proof-0-control");
    const baseHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);

    await page.locator("[data-index-nav-item-direction-control]").selectOption("rtl");
    await page.locator("[data-index-nav-item-scale-control]").selectOption("1.5");
    await page.locator("[data-index-nav-item-width-control]").selectOption("9rem");

    const stage = page.locator("[data-index-nav-item-proof-stage]");
    await expect(stage).toHaveAttribute("dir", "rtl");
    await expect(stage).toHaveAttribute("data-index-nav-item-proof-scale", "1.5");
    await expect(page.getByRole("button", { name: "Identity and source authority ownership model" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    const scaledHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);
    expect(scaledHeight).toBeGreaterThan(baseHeight * 1.4);

    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByText("Activation log: workflow")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile keeps constrained item proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Pattern", level: 1 })).toBeVisible();
    await page.locator("[data-index-nav-item-width-control]").selectOption("9rem");
    await expect(page.locator("[data-index-nav-item]")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
