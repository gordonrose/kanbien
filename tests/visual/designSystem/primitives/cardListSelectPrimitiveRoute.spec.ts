import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/card-list-select";

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

async function renderedAffordanceGlyphSemantics(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".ds-card-list-select-affordance")).map((glyph) =>
      glyph instanceof HTMLElement ? glyph.dataset.cardListSelectGlyphSemantic : "",
    ),
  );
}

test.describe("card list select primitive route", () => {
  test("renders visibility and priority variants with native checkbox behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Card List Select Primitive", level: 1 })).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(4);
    await expect(page.getByText("--choice-card-state-affordance-visible-original")).toBeVisible();
    await expect(page.locator(".ds-card-list-select-affordance").first()).toHaveAttribute("data-card-list-select-glyph-semantic", "visibility-on");
    await expect.poll(() => renderedAffordanceGlyphSemantics(page)).toContain("visibility-off");
    await expect(page.locator(".ds-card-list-select-affordance svg")).toHaveCount(4);
    await expect(page.locator(".ds-card-list-select-state-text", { hasText: "Visible" }).first()).toBeVisible();
    await page.getByLabel("Variant").selectOption("priority");
    await expect(page.locator(".ds-card-list-select-affordance").first()).toHaveAttribute("data-card-list-select-glyph-semantic", "selected-check");
    await expect(page.locator(".ds-card-list-select-affordance").nth(1)).toHaveAttribute("data-card-list-select-glyph-semantic", "selected-check");
    await expect.poll(() => renderedAffordanceGlyphSemantics(page)).toContain("not-selected-x");
    await expect(page.locator(".ds-card-list-select-state-text", { hasText: "Priority 1" }).first()).toBeVisible();
    await expect(page.locator(".ds-card-list-select-state-text", { hasText: "Not on" }).first()).toBeVisible();
    await page.locator('input[value="owner"]').check({ force: true });
    await expect(page.locator(".ds-card-list-select-state-text", { hasText: "Priority 3" }).first()).toBeVisible();
    await page.locator('input[value="description"]').uncheck({ force: true });
    await expect(page.locator(".ds-card-list-select-state-text", { hasText: "Priority 2" }).first()).toBeVisible();
    await expect.poll(() => renderedOptionLines(page)).not.toContain(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps constrained mobile proof readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.getByLabel("Option text").selectOption("supporting");
    await page.getByLabel("Review width").selectOption("narrow");
    await page.locator("[data-card-list-direction-control]").selectOption("rtl");
    await expect(page.getByRole("heading", { name: "Card List Select Primitive", level: 1 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
