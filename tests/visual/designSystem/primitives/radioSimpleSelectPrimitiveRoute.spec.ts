import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/radio-simple-select";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("radio-simple-select primitive route", () => {
  test("desktop renders native radio behavior and token-backed selection states", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Radio Simple Select Primitive", level: 1 })).toBeVisible();
    const existing = page.getByRole("radio", { name: "Existing" });
    const planned = page.getByRole("radio", { name: "Planned" });

    await expect(existing).toBeChecked();
    await planned.check();
    await expect(planned).toBeChecked();
    await expect(existing).not.toBeChecked();
    await expect(page.getByText("Selection log: planned")).toBeVisible();
    await expect(page.getByText("--choice-option-frame-default-original")).toBeVisible();
    await expect(page.getByText("--choice-group-layout-2-column")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls prove states, collapse, RTL, and tooltip gating", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-radio-option-text-control]").selectOption("supporting");
    await page.locator("[data-radio-label-length-control]").selectOption("long");
    await page.locator("[data-radio-group-supporting-control]").selectOption("shown");
    await page.locator("[data-radio-columns-control]").selectOption("4");
    await page.locator("[data-radio-width-control]").selectOption("narrow");
    await page.locator("[data-radio-direction-control]").selectOption("rtl");

    const host = page.locator("[data-radio-simple-select-review-width]").first();
    const group = page.locator("[data-radio-simple-select]").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(group).toHaveAttribute("data-radio-simple-select-columns-rendered", "1");

    const longOption = page.getByRole("radio", { name: /Operational handoff posture/ });
    await longOption.focus();
    await expect(page.locator("[data-radio-simple-select-tooltip]").filter({ hasText: /Operational handoff posture/ })).toBeVisible();

    await page.locator("[data-radio-label-length-control]").selectOption("short");
    await page.locator("[data-radio-option-text-control]").selectOption("plain");
    await page.locator("[data-radio-width-control]").selectOption("wide");
    await page.getByRole("radio", { name: "Existing" }).focus();
    await expect(page.locator("[data-radio-simple-select-tooltip]").filter({ hasText: "Existing" })).toBeHidden();

    await page.locator("[data-radio-state-control]").selectOption("error");
    await expect(page.getByRole("radio", { name: "Existing" })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Select one feature status before continuing.")).toBeVisible();

    await page.locator("[data-radio-state-control]").selectOption("disabled-option");
    await expect(page.getByRole("radio", { name: "Planned" })).toBeDisabled();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});

