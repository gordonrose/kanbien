import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/choice-group-layout";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function renderedColumnCounts(page: Page) {
  return page.evaluate(() => {
    return [1, 2, 3, 4].map((columnCount) => {
      const card = document.querySelector(`[data-token-variant-id='choice-group-layout-${columnCount}-column']`);
      const preview = card?.querySelector(".token-spec-choice-grid-preview");

      if (!(preview instanceof HTMLElement)) {
        return { columnCount, renderedColumns: 0 };
      }

      const tracks = getComputedStyle(preview).gridTemplateColumns.split(" ").filter(Boolean);
      return { columnCount, renderedColumns: tracks.length };
    });
  });
}

test.describe("choice group layout token route", () => {
  test("renders 1-4 column layout variants", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Choice Group Layout Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--choice-group-layout-1-column")).toBeVisible();
    await expect(page.getByText("--choice-group-layout-2-column")).toBeVisible();
    await expect(page.getByText("--choice-group-layout-3-column")).toBeVisible();
    await expect(page.getByText("--choice-group-layout-4-column")).toBeVisible();
    await expect(page.getByText("The primitive may request a signed column count").first()).toBeVisible();
    await expect(page.getByText("12rem collapse threshold").first()).toBeVisible();
    await expect.poll(() => renderedColumnCounts(page)).toEqual([
      { columnCount: 1, renderedColumns: 1 },
      { columnCount: 2, renderedColumns: 2 },
      { columnCount: 3, renderedColumns: 3 },
      { columnCount: 4, renderedColumns: 4 },
    ]);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Choice Group Layout Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--choice-group-layout-4-column")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
