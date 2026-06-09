import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/text-field-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function cssValue(page: Page, selector: string, property: string) {
  return page.locator(selector).first().evaluate((element, cssProperty) => window.getComputedStyle(element).getPropertyValue(cssProperty), property);
}

test.describe("text-field-control primitive route", () => {
  test("renders a native labelled text input with token-backed frame", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Text Field Control Primitive", level: 1 })).toBeVisible();
    const input = page.locator("[data-text-field-control-input]").first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveAttribute("aria-labelledby", "text-field-control-proof-label");
    await expect(input).toHaveAttribute("aria-describedby", "text-field-control-proof-helper");
    await expect(page.getByText("--text-control-frame-default-original")).toBeVisible();
    await expect(page.getByText("--field-value-text-style-default")).toBeVisible();
    await expect(page.locator("[data-text-field-proof-state-evidence]").getByText("Default text field")).toBeVisible();
    await expect.poll(() => input.evaluate((element) => window.getComputedStyle(element).minHeight)).toBe("44px");
  });

  test("review controls change native state, direction, width, and error semantics", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const host = page.locator("[data-text-field-review-width]").first();
    const input = page.locator("[data-text-field-control-input]").first();

    await page.locator("[data-text-field-state-control]").selectOption("error");
    await page.locator("[data-text-field-direction-control]").selectOption("rtl");
    await page.locator("[data-text-field-width-control]").selectOption("narrow");

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-describedby", "text-field-control-proof-error");
    await expect(page.locator("[data-text-field-proof-state-evidence]").getByText("Error text field")).toBeVisible();
    await expect(page.locator("[data-text-field-proof-state-evidence]").getByText("aria-invalidfalse")).toHaveCount(0);
    await expect.poll(() => cssValue(page, "[data-text-field-control-input]", "background-color")).toContain("color(srgb");
    await expect(input).toHaveCSS("border-color", "rgb(122, 31, 31)");
    await expect(input).toHaveCSS("color", "rgb(122, 31, 31)");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveCSS("color", "rgb(122, 31, 31)");
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(host).toHaveAttribute("data-text-field-review-width", "narrow");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.locator("[data-text-field-state-control]").selectOption("read-only");
    await expect(input).toHaveAttribute("readonly", "");
    await expect(page.locator("[data-text-field-proof-state-evidence]").getByText("Read-only text field")).toBeVisible();
    await expect.poll(() => cssValue(page, "[data-text-field-control-input]", "background-color")).toContain("color(srgb");
    await page.locator("[data-text-field-state-control]").selectOption("disabled");
    await expect(input).toBeDisabled();
    await expect(page.locator("[data-text-field-proof-state-evidence]").getByText("Disabled text field")).toBeVisible();
    await expect.poll(() => cssValue(page, "[data-text-field-control-input]", "background-color")).toContain("color(srgb");
    await expect.poll(() => cssValue(page, "[data-text-field-control-input]", "color")).toContain("color(srgb");
  });
});
