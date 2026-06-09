import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/radio-simple-select-field";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("radio-simple-select-field pattern route", () => {
  test("desktop composes field label and native radio selection", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Radio Simple Select Field Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-field-row-control]")).toHaveCount(1);
    await expect(page.locator("[data-radio-simple-select]")).toHaveCount(1);
    await expect(page.locator("legend[data-radio-simple-select-legend-presentation='visually-hidden']")).toHaveCount(1);

    const existing = page.getByRole("radio", { name: "Existing" });
    const planned = page.getByRole("radio", { name: "Planned" });
    await expect(existing).toBeChecked();
    await existing.focus();
    await page.keyboard.press("ArrowRight");
    await expect(planned).toBeFocused();
    await expect(planned).toBeChecked();
    await expect(existing).not.toBeChecked();
    await expect(page.getByText("Selection log: planned")).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(existing).toBeFocused();
    await expect(existing).toBeChecked();
    await planned.check();
    await expect(planned).toBeChecked();
    await expect(existing).not.toBeChecked();
    await expect(page.getByText("Selection log: planned")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls prove error, disabled, RTL, truncation disclosure, and column collapse", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-radio-field-option-text-control]").selectOption("supporting");
    await page.locator("[data-radio-field-label-control]").selectOption("long");
    await page.locator("[data-radio-field-columns-control]").selectOption("4");
    await page.locator("[data-radio-field-width-control]").selectOption("narrow");
    await page.locator("[data-radio-field-direction-control]").selectOption("rtl");

    const host = page.locator("[data-radio-simple-select-field-review-width]").first();
    const group = page.locator("[data-radio-simple-select]").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(group).toHaveAttribute("data-radio-simple-select-columns-rendered", "1");

    await page.getByRole("radio", { name: /Operational handoff posture/ }).focus();
    await expect(page.locator("[data-radio-simple-select-tooltip]").filter({ hasText: /Operational handoff posture/ })).toBeVisible();

    await page.locator("[data-radio-field-state-control]").selectOption("error");
    await expect(page.getByRole("radio", { name: "Existing" })).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveCSS("color", "rgb(122, 31, 31)");

    await page.locator("[data-radio-field-state-control]").selectOption("disabled");
    await expect(page.getByRole("radio", { name: "Existing" })).toBeDisabled();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
