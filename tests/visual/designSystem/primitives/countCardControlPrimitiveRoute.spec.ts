import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/count-card-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function tabToCountCard(page: Page) {
  for (let index = 0; index < 40; index += 1) {
    const focused = await page.evaluate(
      () => (document.activeElement?.matches("[data-count-card-control]") ?? false) && (document.activeElement?.matches(":focus-visible") ?? false),
    );
    if (focused) {
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error("count-card-control did not receive keyboard focus.");
}

test.describe("count-card-control primitive route", () => {
  test("desktop proves static/actionable states and disabled blocking", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Count Card Control Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-count-card-control]")).toHaveAttribute("data-count-card-control-actionable", "false");
    await expect(page.getByText("Activation log: none")).toBeVisible();

    await page.locator("[data-count-card-mode-control]").selectOption("actionable");
    const button = page.getByRole("button", { name: /Records matching active filters/ });
    await button.click();
    await expect(page.getByText("Activation log: active-filter-count (default)")).toBeVisible();
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    await tabToCountCard(page);
    await expect
      .poll(() => button.evaluate((element) => getComputedStyle(element).outlineStyle))
      .not.toBe("none");

    await page.locator("[data-count-card-state-control]").selectOption("disabled");
    await expect(page.getByRole("button", { name: /Disabled/ })).toBeDisabled();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("proves overflow-gated tooltip and non-colour state cues", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await page.locator("[data-count-card-width-control]").selectOption("narrow");
    await page.locator("[data-count-card-label-control]").selectOption("long");
    const card = page.locator("[data-count-card-control]");
    await expect(card).toHaveAttribute("data-count-card-control-overflow", "true");
    await card.hover();
    await expect(page.locator("[data-count-card-control-tooltip]")).toBeVisible();

    await page.locator("[data-count-card-state-control]").selectOption("warning");
    await expect(page.locator(".ds-count-card-control-state-cue", { hasText: "Warning" })).toBeVisible();
    await expect(page.getByText("--count-card-frame-warning-original")).toBeVisible();

    await page.locator("[data-count-card-width-control]").selectOption("wide");
    await page.locator("[data-count-card-label-control]").selectOption("short");
    await expect(page.locator("[data-count-card-control]")).toHaveAttribute("data-count-card-control-overflow", "false");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile proves RTL and alternate theme rendering without page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-count-card-theme-control]").selectOption("dark");
    await page.locator("[data-count-card-direction-control]").selectOption("rtl");
    await page.locator("[data-count-card-state-control]").selectOption("error");
    const card = page.locator("[data-count-card-control]");
    await expect(card).toHaveAttribute("data-count-card-control-theme", "dark");
    await expect(page.locator(".ds-count-card-control-state-cue", { hasText: "Error" })).toBeVisible();
    await expect(page.getByText("--count-card-frame-error-dark")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
