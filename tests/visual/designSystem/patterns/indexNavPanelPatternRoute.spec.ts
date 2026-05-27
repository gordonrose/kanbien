import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/index-nav-panel";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav panel pattern route", () => {
  test("renders standard and double width panel proof with add and list activation", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Panel Pattern", level: 1 })).toBeVisible();
    const panel = page.locator("[data-index-nav-panel]");
    await expect(panel).toHaveAttribute("data-index-nav-panel-width-mode", "standard");
    await expect(page.locator("[data-index-nav-panel-header-control]")).toHaveCSS("position", "sticky");
    const standardWidth = await panel.evaluate((element) => element.getBoundingClientRect().width);

    await page.locator("[data-index-nav-panel-width-control]").selectOption("double");
    await expect(panel).toHaveAttribute("data-index-nav-panel-width-mode", "double");
    const doubleWidth = await panel.evaluate((element) => element.getBoundingClientRect().width);
    expect(doubleWidth).toBeGreaterThan(standardWidth * 1.8);

    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText(/Activation log: add/)).toBeVisible();

    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByText("Activation log: item workflows")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("shows empty state and proof-only current update mode", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-index-nav-panel-count-control]").selectOption("0");
    await expect(page.locator("[data-index-nav-panel-empty]")).toHaveText("No sections yet.");

    await page.locator("[data-index-nav-panel-count-control]").selectOption("3");
    await page.locator("[data-index-nav-panel-activation-control]").selectOption("update-current");
    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByRole("button", { name: "Workflow routing and operational handoff posture" })).toHaveAttribute("aria-current", "true");
  });

  test("keeps desktop list internally scrollable and mobile page-scroll posture full width", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const scrollState = await page.locator("[data-index-nav-panel-scroll]").evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowY: getComputedStyle(element).overflowY,
      scrollbarWidth: getComputedStyle(element).scrollbarWidth,
      scrollbarColor: getComputedStyle(element).scrollbarColor,
    }));
    expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.clientHeight);
    expect(scrollState.overflowY).toBe("auto");
    expect(scrollState.scrollbarWidth).toBe("auto");
    expect(scrollState.scrollbarColor).toBe("auto");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator("[data-index-nav-panel]")).toHaveAttribute("data-index-nav-panel-viewport", "mobile");
    const mobileState = await page.locator("[data-index-nav-panel-scroll]").evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowY: getComputedStyle(element).overflowY,
      maxHeight: getComputedStyle(element).maxHeight,
    }));
    expect(mobileState.overflowY).toBe("visible");
    expect(mobileState.maxHeight).toBe("none");
    expect(mobileState.scrollHeight).toBeLessThanOrEqual(mobileState.clientHeight + 1);
    await expect(page.locator("[data-index-nav-panel-scroll-evidence]")).toContainText("page or proof container");
    await expect(page.locator("[data-index-nav-panel-proof-slot]")).toHaveCSS("overflow-y", "auto");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("distinguishes mobile page-scroll from mobile internal-scroll in rendered proof", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-index-nav-panel-viewport-control]").selectOption("mobile");
    await page.locator("[data-index-nav-panel-mobile-control]").selectOption("page-scroll");
    await expect(page.locator("[data-index-nav-panel]")).toHaveAttribute("data-index-nav-panel-viewport", "mobile");
    await expect(page.locator("[data-index-nav-panel-scroll-evidence]")).toContainText("page or proof container");
    await expect(page.locator("[data-index-nav-panel-scroll]")).toHaveCSS("overflow-y", "visible");

    await page.locator("[data-index-nav-panel-mobile-control]").selectOption("internal-scroll");
    await expect(page.locator("[data-index-nav-panel-scroll-evidence]")).toContainText("panel list region");
    await expect(page.locator("[data-index-nav-panel-scroll]")).toHaveCSS("overflow-y", "auto");
  });

  test("preserves RTL containment", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-index-nav-panel-direction-control]").selectOption("rtl");
    await expect(page.locator("[data-index-nav-panel-proof-stage]")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
