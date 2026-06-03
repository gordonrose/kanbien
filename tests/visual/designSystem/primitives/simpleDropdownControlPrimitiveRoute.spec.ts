import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/simple-dropdown-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("simple-dropdown-control primitive route", () => {
  test("desktop renders button/listbox semantics and emits selection changes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Simple Dropdown Control Primitive", level: 1 })).toBeVisible();
    const trigger = page.getByRole("button", { name: "Record management page" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    await expect(trigger.locator(".ds-simple-dropdown-trigger-indicator")).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.getByRole("option", { name: "Record management list centric" }).click();
    await expect(page.getByRole("button", { name: "Record management list centric" })).toBeVisible();
    await expect(page.getByText("Selection log: record_management_list_centric")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("uses themed popup frame and signed internal scroll sizing", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await page.locator("[data-simple-dropdown-theme-control]").selectOption("dark");
    await page.locator("[data-simple-dropdown-option-length-control]").selectOption("overflow");
    const trigger = page.getByRole("button", { name: "Select one" });
    await expect
      .poll(() => trigger.evaluate((element) => getComputedStyle(element).backgroundColor))
      .toBe("rgb(23, 27, 34)");
    await trigger.click();

    const listbox = page.locator("[data-simple-dropdown-listbox]").first();
    await expect(listbox).toBeVisible();
    await expect(page.getByText("--dropdown-listbox-frame-dark")).toBeVisible();
    await expect
      .poll(() =>
        listbox.evaluate((element) => ({
          background: getComputedStyle(element).backgroundColor,
          canScroll: element.scrollHeight > element.clientHeight,
          maxBlockSize: getComputedStyle(element).maxBlockSize,
        })),
      )
      .toMatchObject({
        background: "rgb(23, 27, 34)",
        canScroll: true,
        maxBlockSize: "288px",
      });
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile proves keyboard, disabled, RTL, and overflow-gated disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-simple-dropdown-option-length-control]").selectOption("long");
    await page.locator("[data-simple-dropdown-width-control]").selectOption("narrow");
    await page.locator("[data-simple-dropdown-direction-control]").selectOption("rtl");

    const trigger = page.getByRole("button", { name: /Record management page/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.locator("[data-simple-dropdown-listbox]").first()).toHaveAttribute("id", "simple-dropdown-proof-listbox");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Selection log: record_management_list_centric")).toBeVisible();

    const updatedTrigger = page.getByRole("button", { name: /Record management list centric/ });
    await updatedTrigger.focus();
    await expect(page.locator("[data-simple-dropdown-trigger-tooltip]").filter({ hasText: /Record management list centric/ })).toBeVisible();

    await page.locator("[data-simple-dropdown-state-control]").selectOption("disabled");
    await expect(page.getByRole("button")).toBeDisabled();
    await page.locator("[data-simple-dropdown-state-control]").selectOption("error");
    await expect(page.getByRole("button")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Choose one page template before continuing.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
