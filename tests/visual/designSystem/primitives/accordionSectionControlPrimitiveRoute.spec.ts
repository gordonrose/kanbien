import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/accordion-section-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("accordion section control primitive route", () => {
  test("toggles disclosure state and emits events", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Accordion Section Control Primitive", level: 1 })).toBeVisible();
    const button = page.getByRole("button", { name: "Primary details" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#accordion-section-proof-panel")).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#accordion-section-proof-panel")).toBeVisible();
    await expect(page.getByText("Toggle log: expanded")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("blocks disabled sections", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);
    await page.locator("[data-accordion-disabled-control]").selectOption("disabled");

    const button = page.getByRole("button", { name: "Primary details" });
    await expect(button).toBeDisabled();
    await button.click({ force: true });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Toggle log: collapsed")).toBeVisible();
  });

  test("returns focus to header when collapsing focused content", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);
    await page.locator("[data-accordion-expanded-control]").selectOption("expanded");

    const button = page.getByRole("button", { name: "Primary details" });
    await page.locator("[data-accordion-section-proof-focus-target]").focus();
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>("[data-accordion-section-control-button]")?.click();
    });
    await expect(button).toBeFocused();
    await expect(page.locator("#accordion-section-proof-panel")).toBeHidden();
  });

  test("tabs from review controls into the rendered accordion button", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-accordion-direction-control]").focus();
    await page.keyboard.press("Tab");

    const button = page.getByRole("button", { name: "Primary details" });
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    await expect(button).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#accordion-section-proof-panel")).toBeVisible();

    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#accordion-section-proof-panel")).toBeHidden();
  });

  test("keeps dark RTL long-title proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.locator("[data-accordion-title-control]").selectOption("long");
    await page.locator("[data-accordion-theme-control]").selectOption("dark");
    await page.locator("[data-accordion-direction-control]").selectOption("rtl");
    await expect(page.locator("[data-accordion-section-control] .ds-accordion-section-control-indicator")).toHaveCSS(
      "transform",
      "matrix(0, 1, -1, 0, 0, 0)",
    );
    await page.locator("[data-accordion-expanded-control]").selectOption("expanded");

    const button = page.getByRole("button", {
      name: "Primary details with long governed accordion title text that must truncate before overlap",
    });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect
      .poll(() =>
        button.evaluate((element) => ({
          background: getComputedStyle(element).backgroundColor,
          color: getComputedStyle(element).color,
        })),
      )
      .toEqual({
        background: "color(srgb 0.108392 0.122824 0.168)",
        color: "color(srgb 0.866275 0.872 0.987765)",
      });
    await expect(page.locator("#accordion-section-proof-panel")).toHaveCSS("background-color", "rgb(23, 27, 34)");
    await expect(page.locator("#accordion-section-proof-panel")).toHaveCSS("color", "rgb(244, 247, 251)");
    await expect(page.locator("[data-truncating-label]").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
