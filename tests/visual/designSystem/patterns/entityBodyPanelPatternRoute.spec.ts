import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/entity-body-panel";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function topPosition(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => element.getBoundingClientRect().top);
}

test.describe("entity body panel pattern route", () => {
  test("renders the governed body panel pattern and width evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Entity Body Panel Pattern", level: 1 })).toBeVisible();
    const panel = page.locator("[data-entity-body-panel]").first();
    const region = page.locator("[data-body-region-control]").first();
    await expect(panel).toHaveAttribute("data-entity-body-panel-state", "default");
    await expect(region).toHaveAttribute("aria-label", "Entity body content");
    await expect(page.getByText("body-region-control", { exact: true })).toBeVisible();
    await expect(page.getByText("--body-region-frame")).toBeVisible();
    await expect(page.getByText("26rem", { exact: true })).toBeVisible();
    await expect(page.locator("[data-entity-body-panel-governed-form]")).toBeVisible();
    await expect(page.locator("[data-field-container-control]")).toHaveCount(7);
    await expect(page.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-text-field-control]").first()).toBeVisible();
    await expect(page.locator("[data-textarea-control]").first()).toBeVisible();
    await expect(page.locator("#entity-body-panel-proof-name-container [data-text-field-control]")).toBeVisible();

    await page.getByRole("button", { name: "Configuration" }).click();
    await expect(page.locator("[data-radio-simple-select-field]").first()).toBeVisible();
    await expect(page.locator("[data-simple-dropdown-field]").first()).toBeVisible();
    await expect(page.locator("[data-toggle-field]").first()).toBeVisible();
    await expect(page.locator("#entity-body-panel-proof-page-template-container [data-simple-dropdown-field]")).toBeVisible();

    await page.getByRole("button", { name: "List display" }).click();
    await expect(page.locator("[data-card-list-select-field]").first()).toBeVisible();
    await expect(page.locator("#entity-body-panel-proof-list-display-container [data-card-list-select-field]")).toBeVisible();
    await expect(page.locator("[data-entity-body-panel-blocked-foundations]")).toContainText("Drawer select and workflow builder");

    await page.locator("[data-entity-body-panel-width-control]").selectOption("squeezed");
    await expect(page.locator("[data-entity-body-panel-proof-host]")).toHaveAttribute(
      "data-entity-body-panel-proof-width",
      "squeezed",
    );
    await expect
      .poll(async () => {
        const firstTop = await topPosition(page, "#entity-body-panel-proof-name-container");
        const secondTop = await topPosition(page, "#entity-body-panel-proof-key-container");
        return secondTop > firstTop + 24;
      })
      .toBe(true);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps empty, loading, and blocked states honest", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const panel = page.locator("[data-entity-body-panel]").first();
    const scrollRegion = page.locator("[data-body-region-control] [data-scroll-region-control]").first();

    await page.locator("[data-entity-body-panel-state-control]").selectOption("empty");
    await expect(panel).toHaveAttribute("data-entity-body-panel-state", "empty");
    await expect(page.locator("[data-entity-body-panel-state-evidence]")).toContainText("renders no body children");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-entity-body-panel-state-control]").selectOption("loading");
    await expect(page.locator("[data-body-region-control]").first()).toHaveAttribute("aria-busy", "true");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-entity-body-panel-state-control]").selectOption("blocked-foundation");
    await expect(page.locator("[data-entity-body-panel-state-evidence]")).toContainText("renders no body children");
    await expect.poll(() => scrollRegion.evaluate((element) => element.children.length)).toBe(0);

    await page.locator("[data-entity-body-panel-state-control]").selectOption("default");
    await page.locator("[data-entity-body-panel-content-control]").selectOption("short");
    await expect(page.locator("[data-entity-body-panel-content-control]")).toHaveValue("short");
    await page.locator("[data-entity-body-panel-hosted-control]").selectOption("static-proof");
    await expect(page.locator("[data-entity-body-panel-governed-form]")).toHaveCount(0);
    await expect(scrollRegion.getByText("Static proof content, not a governed field.", { exact: true })).toBeVisible();

    await page.locator("[data-entity-body-panel-mobile-control]").selectOption("internal-scroll");
    await expect(scrollRegion).toHaveAttribute("data-scroll-region-control-mobile-mode", "internal-scroll");
    await page.locator("[data-entity-body-panel-direction-control]").selectOption("rtl");
    await expect(page.locator("[data-entity-body-panel-proof-host]")).toHaveAttribute("dir", "rtl");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
