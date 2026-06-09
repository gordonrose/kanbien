import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/searchable-selection-panel";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("searchable-selection-panel pattern route", () => {
  test("desktop proves search, grouped multi-select, and selected preservation", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Searchable Selection Panel Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-search-field-control]")).toHaveCount(1);
    await expect(page.locator("[data-count-card-control]")).toHaveCount(0);
    await expect(page.locator("[data-scroll-region-control]")).toHaveCount(1);
    await expect(page.locator("[data-card-list-select]")).toHaveCount(2);
    await expect(page.locator(".ds-card-list-select-affordance")).toHaveCount(0);

    await page.getByRole("searchbox", { name: "Search page templates" }).fill("workflow");
    await expect(page.getByText("Record management page").first()).toBeVisible();
    await expect(page.getByText("Workflow routing and operational handoff posture").first()).toBeVisible();

    await page.getByRole("checkbox", { name: /Workflow routing/ }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByText(/Selection log: .*workflow/)).toBeVisible();
    await page.locator("[data-searchable-selection-columns-control]").selectOption("2");
    await expect(page.locator("[data-card-list-select]").first()).toHaveAttribute("data-card-list-select-columns-requested", "2");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile proves single mode, no-match state, RTL, theme, and truncation disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-searchable-selection-mode-control]").selectOption("single");
    await page.locator("[data-searchable-selection-query-control]").selectOption("workflow");
    await page.locator("[data-searchable-selection-width-control]").selectOption("narrow");
    await page.locator("[data-searchable-selection-direction-control]").selectOption("rtl");
    await page.locator("[data-searchable-selection-theme-control]").selectOption("dark");

    await expect(page.locator("[data-searchable-selection-review-width]").first()).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-searchable-selection-panel]").first()).toHaveCSS("background-color", "rgb(23, 27, 34)");
    await expect(page.getByRole("searchbox", { name: "Search page templates" })).toHaveCSS("background-color", "rgb(23, 27, 34)");
    await expect(page.getByRole("searchbox", { name: "Search page templates" })).toHaveCSS("color", "rgb(244, 247, 251)");
    await expect(page.locator("[data-radio-simple-select]")).toHaveCount(0);
    await expect(page.locator("[data-card-list-select]")).toHaveCount(2);
    await expect(page.getByText("Record management page").first()).toBeVisible();

    await page.getByRole("checkbox", { name: /Workflow routing/ }).focus();
    await expect(page.locator("[data-card-list-select-tooltip]").filter({ hasText: /Workflow routing/ })).toBeVisible();
    await page.keyboard.press("Space");
    await expect(page.getByText("Selection log: workflow")).toBeVisible();
    await expect(
      page.locator("[aria-label='Selected options'] [data-card-list-select-disclosure-source]", {
        hasText: "Workflow routing and operational handoff posture",
      }),
    ).toBeVisible();

    await page.locator("[data-searchable-selection-query-control]").selectOption("zzzz");
    await expect(page.getByText("No available options match the current search.")).toBeVisible();
    await expect(page.locator("[data-searchable-selection-panel-status]")).toHaveCSS("color", "rgb(244, 247, 251)");
    await expect(page.getByText("--feedback-text-style-neutral-dark")).toBeVisible();
    await expect(page.getByText("Workflow routing and operational handoff posture").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
