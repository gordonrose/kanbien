import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/toggle-field";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function labelToControlGap(page: Page) {
  return page.evaluate(() => {
    const labelLine = document.querySelector(".ds-toggle-field .ds-field-row-control-label-line");
    const toggle = document.querySelector("[data-toggle-control]");
    if (!(labelLine instanceof HTMLElement) || !(toggle instanceof HTMLElement)) {
      throw new Error("Missing toggle field label or switch for gap assertion.");
    }

    const labelBox = labelLine.getBoundingClientRect();
    const toggleBox = toggle.getBoundingClientRect();
    return Math.round(toggleBox.top - labelBox.bottom);
  });
}

test.describe("toggle field pattern route", () => {
  test("renders field-row plus switch composition and forwards toggle events", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Toggle Field Pattern", level: 1 })).toBeVisible();
    const toggle = page.getByRole("switch", { name: "Enable workflow automation" });
    await expect(toggle).toBeVisible();
    await expect(toggle).not.toBeChecked();
    await expect(toggle).toHaveAttribute("aria-describedby", "toggle-field-proof-field-row-helper");
    await expect.poll(() => labelToControlGap(page)).toBeLessThanOrEqual(8);

    await toggle.click();
    await expect(toggle).toBeChecked();
    await expect(page.getByText("Selection log: checked")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("lets the label row activate the switch without breaking disclosure ownership", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const toggle = page.getByRole("switch", { name: "Enable workflow automation" });
    const labelLine = page.locator(".ds-toggle-field .ds-field-row-control-label-line").first();
    await expect(toggle).not.toBeChecked();
    await labelLine.click();
    await expect(toggle).toBeChecked();
  });

  test("blocks read-only and disabled states through the composed primitives", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-toggle-field-checked-control]").selectOption("checked");
    await page.locator("[data-toggle-field-state-control]").selectOption("read-only");
    const readOnlyToggle = page.getByRole("switch", { name: "Enable workflow automation" });
    await expect(readOnlyToggle).toBeChecked();
    await readOnlyToggle.click();
    await expect(readOnlyToggle).toBeChecked();

    await page.locator("[data-toggle-field-state-control]").selectOption("disabled");
    const disabledToggle = page.getByRole("switch", { name: "Enable workflow automation" });
    await expect(disabledToggle).toBeDisabled();
  });

  test("wires error text and preserves constrained RTL rendering", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.locator("[data-toggle-field-state-control]").selectOption("error");
    await page.locator("[data-toggle-field-label-control]").selectOption("long");
    await page.locator("[data-toggle-field-width-control]").selectOption("narrow");
    await page.locator("[data-toggle-field-direction-control]").selectOption("rtl");
    await page.locator("[data-toggle-field-theme-control]").selectOption("dark");

    const host = page.locator(".toggle-field-proof-host").first();
    await expect(host).toHaveAttribute("data-toggle-field-proof-surface-token", "--background-surface-dark");
    await expect
      .poll(() =>
        host.evaluate((element) => ({
          background: getComputedStyle(element).backgroundColor,
          color: getComputedStyle(element).color,
        })),
      )
      .toEqual({ background: "rgb(23, 27, 34)", color: "rgb(244, 247, 251)" });

    const toggle = page.getByRole("switch", {
      name: "Enable workflow automation with long governed label text that must truncate before it overlaps",
    });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-invalid", "true");
    await expect(toggle).toHaveAttribute("aria-describedby", "toggle-field-proof-field-row-error");
    await expect(page.getByText("Toggle must be enabled before this workflow can continue.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
