import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/accordion-group";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("accordion group pattern route", () => {
  test("renders a single-open accordion group and forwards section events", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Accordion Group Pattern", level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#accordion-group-proof-identity-panel")).toBeVisible();

    const workflows = page.getByRole("button", { name: "Workflows" });
    await expect(workflows).toHaveAttribute("aria-expanded", "false");
    await workflows.click();

    await expect(workflows).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#accordion-group-proof-identity-panel")).toBeHidden();
    await expect(page.locator("#accordion-group-proof-workflows-panel")).toBeVisible();
    await expect(page.getByText("Group log: accordion-group-proof-workflows expanded")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("blocks disabled section activation without adding group-local behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);
    await page.locator("[data-accordion-group-disabled-control]").selectOption("disabled-middle");

    const workflows = page.getByRole("button", { name: "Workflows" });
    await expect(workflows).toBeDisabled();
    await expect(workflows).toHaveAttribute("aria-expanded", "false");
    await workflows.click({ force: true });

    await expect(workflows).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#accordion-group-proof-workflows-panel")).toBeHidden();
    await expect(page.getByText("Group log: none")).toBeVisible();
  });

  test("updates proof controls for section count and initially expanded fixtures", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-accordion-group-count-control]").selectOption("many");
    await expect(page.getByRole("button", { name: "Compliance model" })).toBeVisible();
    await expect(page.locator(".token-spec-definition-grid")).toContainText("Sections4");

    await page.locator("[data-accordion-group-expanded-control]").selectOption("workflows-open");
    await expect(page.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("button", { name: "Workflows" })).toHaveAttribute("aria-expanded", "true");
  });

  test("tabs from review controls into the rendered accordion group", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-accordion-group-supporting-control]").focus();
    await page.keyboard.press("Tab");

    const identity = page.getByRole("button", { name: "Identity" });
    await expect(identity).toBeFocused();
    await expect(identity).toHaveCSS("outline-style", "solid");
    await expect(identity).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Enter");
    await expect(identity).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#accordion-group-proof-identity-panel")).toBeHidden();

    await page.keyboard.press("Space");
    await expect(identity).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#accordion-group-proof-identity-panel")).toBeVisible();
  });

  test("preserves long-title disclosure, RTL, and dark surface rendering under mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.locator("[data-accordion-group-title-control]").selectOption("long");
    await page.locator("[data-accordion-group-theme-control]").selectOption("dark");
    await page.locator("[data-accordion-group-direction-control]").selectOption("rtl");

    const host = page.locator(".accordion-group-proof-host").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    const longTitle = page.getByRole("button", {
      name: "Identity and source authority accordion section with long governed title text",
    });
    await expect(longTitle).toBeVisible();
    await expect
      .poll(() =>
        longTitle.evaluate((element) => ({
          background: getComputedStyle(element).backgroundColor,
          color: getComputedStyle(element).color,
        })),
      )
      .toEqual({
        background: "color(srgb 0.108392 0.122824 0.168)",
        color: "color(srgb 0.866275 0.872 0.987765)",
      });
    await expect(host.locator("[data-truncating-label]").first()).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
