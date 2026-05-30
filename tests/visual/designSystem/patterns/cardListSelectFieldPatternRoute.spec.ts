import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/card-list-select-field";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function renderedOptionLines(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".ds-card-list-select-text")).map((text) => {
      if (!(text instanceof HTMLElement)) {
        return 0;
      }
      const styles = getComputedStyle(text);
      const lineHeight = Number.parseFloat(styles.lineHeight) || text.getBoundingClientRect().height;
      return Math.round(text.getBoundingClientRect().height / lineHeight);
    }),
  );
}

test.describe("card-list-select-field pattern route", () => {
  test("desktop composes field label and native checkbox multi-selection", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Card List Select Field Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-field-row-control]")).toHaveCount(1);
    await expect(page.locator("[data-card-list-select]")).toHaveCount(1);
    await expect(page.locator("legend[data-card-list-select-legend-presentation='visually-hidden']")).toHaveCount(1);

    const owner = page.getByRole("checkbox", { name: /Owner/ });
    await expect(owner).not.toBeChecked();
    await owner.check({ force: true });
    await expect(owner).toBeChecked();
    await expect(page.getByText(/Selection log: email, description, owner/)).toBeVisible();
    await expect.poll(() => renderedOptionLines(page)).not.toContain(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls prove priority, error, RTL, truncation disclosure, and column collapse", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-card-list-select-field-variant-control]").selectOption("priority");
    await page.locator("[data-card-list-select-field-option-text-control]").selectOption("supporting");
    await page.locator("[data-card-list-select-field-label-control]").selectOption("long");
    await page.locator("[data-card-list-select-field-columns-control]").selectOption("4");
    await page.locator("[data-card-list-select-field-width-control]").selectOption("narrow");
    await page.locator("[data-card-list-select-field-direction-control]").selectOption("rtl");

    const host = page.locator("[data-card-list-select-field-review-width]").first();
    const group = page.locator("[data-card-list-select]").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(group).toHaveAttribute("data-card-list-select-columns-rendered", "1");
    await expect(page.locator(".ds-card-list-select-state-text", { hasText: "Priority 1" }).first()).toBeVisible();

    await page.getByRole("checkbox", { name: /Updated at timestamp/ }).focus();
    await expect(page.locator("[data-card-list-select-tooltip]").filter({ hasText: /Updated at timestamp/ })).toBeVisible();

    await page.locator("[data-card-list-select-field-state-control]").selectOption("error");
    await expect(page.getByRole("checkbox", { name: /Email/ })).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveText("Choose at least one governed list display option.");

    await page.locator("[data-card-list-select-field-state-control]").selectOption("disabled");
    await expect(page.getByRole("checkbox", { name: /Email/ })).toBeDisabled();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
