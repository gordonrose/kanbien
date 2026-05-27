import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/index-nav-list";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav list pattern route", () => {
  test("desktop renders configurable list proof with activation bubbling", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav List Pattern", level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary index" })).toBeVisible();
    await expect(page.locator("[data-index-nav-item]")).toHaveCount(5);
    await expect(page.getByRole("button", { name: "Identity and source authority ownership model" })).toHaveAttribute("aria-current", "true");
    await expect(page.getByRole("button", { name: "Compliance model with retention and audit setup" })).toBeDisabled();

    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByText("Activation log: workflows")).toBeVisible();

    await page.locator("[data-index-nav-list-theme-control]").selectOption("dark");
    await expect(page.locator("[data-index-nav-list-theme='dark']")).toBeVisible();
    await page.locator("[data-index-nav-list-current-control]").selectOption("relationships");
    await expect(page.getByRole("button", { name: "Relationship model and related record posture" })).toHaveAttribute("aria-current", "true");
    await page.locator("[data-index-nav-list-disabled-control]").selectOption("attributes");
    await expect(page.getByRole("button", { name: "Attribute catalog and display settings" })).toBeDisabled();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps list item heights stable when supporting text is hidden", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const firstItem = page.locator("#index-nav-list-proof-item-0-control");
    const visibleHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);

    await page.locator("[data-index-nav-list-supporting-text-control]").selectOption("hidden");
    await expect(page.locator("[data-index-nav-item-control-supporting-empty='true']")).toHaveCount(5);
    const hiddenHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);

    expect(Math.abs(visibleHeight - hiddenHeight)).toBeLessThanOrEqual(1);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("preserves list behavior under RTL and enlarged review scale", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const firstItem = page.locator("#index-nav-list-proof-item-0-control");
    const baseHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);

    await page.locator("[data-index-nav-list-direction-control]").selectOption("rtl");
    await page.locator("[data-index-nav-list-scale-control]").selectOption("1.5");
    await page.locator("[data-index-nav-list-width-control]").selectOption("10rem");

    const stage = page.locator("[data-index-nav-list-proof-stage]");
    await expect(stage).toHaveAttribute("dir", "rtl");
    await expect(stage).toHaveAttribute("data-index-nav-list-proof-scale", "1.5");
    await expect(page.getByRole("navigation", { name: "Primary index" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Identity and source authority ownership model" })).toHaveAttribute("aria-current", "true");
    const scaledHeight = await firstItem.evaluate((element) => element.getBoundingClientRect().height);
    expect(scaledHeight).toBeGreaterThan(baseHeight * 1.4);

    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByText("Activation log: workflows")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile keeps constrained list proof contained", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav List Pattern", level: 1 })).toBeVisible();
    await page.locator("[data-index-nav-list-width-control]").selectOption("10rem");
    await page.locator("[data-index-nav-list-count-control]").selectOption("6");
    await expect(page.locator("[data-index-nav-item]")).toHaveCount(6);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
