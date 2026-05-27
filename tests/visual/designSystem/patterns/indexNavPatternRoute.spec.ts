import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/index-nav";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav pattern route", () => {
  test("renders primary and secondary panels with add actions", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-index-nav]")).toHaveAttribute("data-index-nav-double-width", "true");
    await expect(page.locator("[data-index-nav-panel]")).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Add" })).toHaveCount(2);

    const listTopState = await page.locator("[data-index-nav-panel]").evaluateAll((panels) =>
      panels.map((panel) => {
        const header = panel.querySelector("[data-index-nav-panel-header-control]");
        const firstItem = panel.querySelector("[data-index-nav-item-control]");
        const headerBox = header?.getBoundingClientRect();
        const firstItemBox = firstItem?.getBoundingClientRect();
        return {
          gapAfterHeader: headerBox && firstItemBox ? firstItemBox.top - headerBox.bottom : null,
        };
      }),
    );
    expect(listTopState).toHaveLength(2);
    for (const state of listTopState) {
      expect(state.gapAfterHeader).not.toBeNull();
      expect(state.gapAfterHeader ?? 0).toBeGreaterThanOrEqual(11);
      expect(state.gapAfterHeader ?? 0).toBeLessThanOrEqual(13);
    }

    await page.getByRole("button", { name: "Add" }).first().click();
    await expect(page.getByText(/Activation log: add/)).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps the single-panel double width control honest", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-index-nav-secondary-control]").selectOption("hidden");
    const panel = page.locator("[data-index-nav-panel]");
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute("data-index-nav-panel-width-mode", "double");
    const doubleWidth = await panel.evaluate((element) => element.getBoundingClientRect().width);

    await page.locator("[data-index-nav-double-control]").selectOption("off");
    await expect(panel).toHaveAttribute("data-index-nav-panel-width-mode", "standard");
    const standardWidth = await panel.evaluate((element) => element.getBoundingClientRect().width);
    expect(doubleWidth).toBeGreaterThan(standardWidth * 1.8);
  });

  test("shows empty primary list and proof-only current updates", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-index-nav-count-control]").selectOption("0");
    await expect(page.locator("[data-index-nav-panel-empty]").first()).toHaveText("No primary sections yet.");

    await page.locator("[data-index-nav-count-control]").selectOption("3");
    await page.locator("[data-index-nav-activation-control]").selectOption("update-current");
    await page.getByRole("button", { name: "Workflow routing and operational handoff posture" }).click();
    await expect(page.getByRole("button", { name: "Workflow routing and operational handoff posture" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("preserves mobile page-scroll and RTL containment", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-index-nav-direction-control]").selectOption("rtl");
    await expect(page.locator("[data-index-nav-proof-slot]")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-index-nav]")).toHaveAttribute("data-index-nav-viewport", "mobile");
    await expect(page.locator("[data-index-nav-panel]").first()).toHaveAttribute("data-index-nav-panel-viewport", "mobile");
    const mobileState = await page.locator("[data-index-nav-panel-scroll]").first().evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowY: getComputedStyle(element).overflowY,
      maxHeight: getComputedStyle(element).maxHeight,
    }));
    expect(mobileState.overflowY).toBe("visible");
    expect(mobileState.maxHeight).toBe("none");
    expect(mobileState.scrollHeight).toBeLessThanOrEqual(mobileState.clientHeight + 1);
    await expect(page.locator("[data-index-nav-proof-slot]")).toHaveCSS("overflow-y", "auto");

    await page.locator("[data-index-nav-mobile-control]").selectOption("internal-scroll");
    const internalMobileState = await page.locator("[data-index-nav-panel-scroll]").first().evaluate((element) => ({
      overflowY: getComputedStyle(element).overflowY,
      maxHeight: getComputedStyle(element).maxHeight,
    }));
    expect(internalMobileState.overflowY).toBe("auto");
    expect(internalMobileState.maxHeight).not.toBe("none");
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
