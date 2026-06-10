import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/index-nav";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function focusRingFitsInside(locator: ReturnType<Page["locator"]>, boundarySelector: string) {
  return locator.evaluate((element, selector) => {
    const boundary = element.closest(selector);
    if (!(element instanceof HTMLElement) || !(boundary instanceof HTMLElement)) {
      return false;
    }

    const elementBox = element.getBoundingClientRect();
    const boundaryBox = boundary.getBoundingClientRect();
    const style = getComputedStyle(element);
    const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
    const outlineOffset = Number.parseFloat(style.outlineOffset) || 0;
    const focusInset = outlineWidth + Math.max(outlineOffset, 0);

    return (
      elementBox.top - focusInset >= boundaryBox.top &&
      elementBox.left - focusInset >= boundaryBox.left &&
      elementBox.right + focusInset <= boundaryBox.right &&
      elementBox.bottom + focusInset <= boundaryBox.bottom
    );
  }, boundarySelector);
}

test.describe("index nav pattern route", () => {
  test("renders primary and secondary panels with add actions", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-index-nav]")).toHaveAttribute("data-index-nav-double-width", "true");
    await expect(page.locator("[data-index-nav-panel]")).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Add" })).toHaveCount(2);
    await expect(page.locator("[data-index-nav-panel]").first()).toHaveCSS("border-radius", "0px");
    await expect(page.locator("[data-index-nav-panel]").nth(1)).toHaveCSS("border-radius", "0px");
    await expect(page.locator("[data-index-nav-item-control]").first()).not.toHaveCSS("border-radius", "0px");
    await expect(page.locator("[data-icon-button-control]").first()).not.toHaveCSS("border-radius", "0px");

    const focusedPrimaryItem = page.getByRole("button", { name: "Workflow routing and operational handoff posture" });
    await focusedPrimaryItem.focus();
    expect(await focusRingFitsInside(focusedPrimaryItem, "[data-index-nav-panel]")).toBe(true);

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
      expect(state.gapAfterHeader ?? 0).toBeGreaterThanOrEqual(15);
      expect(state.gapAfterHeader ?? 0).toBeLessThanOrEqual(17);
    }

    await page.getByRole("button", { name: "Add" }).first().click();
    await expect(page.getByText(/Activation log: add/)).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("shows unclipped tooltips for truncated current and resting items", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    const currentItem = page.getByRole("button", { name: "Identity and source authority ownership model" });
    await currentItem.focus();
    const currentTooltipId = await currentItem.getAttribute("aria-describedby");
    expect(currentTooltipId).toBeTruthy();
    const currentTooltip = page.locator(`#${currentTooltipId}`);
    await expect(currentTooltip).toBeVisible();

    const currentTooltipBox = await currentTooltip.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    });
    expect(currentTooltipBox.left).toBeGreaterThanOrEqual(0);
    expect(currentTooltipBox.right).toBeLessThanOrEqual(currentTooltipBox.viewportWidth);
    expect(currentTooltipBox.top).toBeGreaterThanOrEqual(0);
    expect(currentTooltipBox.bottom).toBeLessThanOrEqual(currentTooltipBox.viewportHeight);

    const restingItem = page.getByRole("button", { name: "Workflow routing and operational handoff posture" });
    await restingItem.focus();
    const restingTooltipId = await restingItem.getAttribute("aria-describedby");
    expect(restingTooltipId).toBeTruthy();
    await expect(page.locator(`#${restingTooltipId}`)).toBeVisible();
  });

  test("shows unclipped tooltip for truncated panel header title after resize", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-index-nav-resize-control]").selectOption("on");
    const primaryPanel = page.locator("[data-index-nav-panel]").first();
    const resizeHandle = page.getByRole("separator", { name: "Resize Primary index" });
    await resizeHandle.focus();
    await page.keyboard.press("Home");
    await expect.poll(() => primaryPanel.evaluate((element) => Math.round(element.getBoundingClientRect().width))).toBe(160);

    const headerTitle = primaryPanel.locator("[data-index-nav-panel-header-control] [data-truncating-label]");
    await expect(headerTitle).toHaveAttribute("data-truncating-label-overflow", "true");
    await headerTitle.focus();
    await expect(headerTitle).toHaveAttribute("aria-expanded", "true");

    const tooltip = headerTitle.locator("[role='tooltip']");
    await expect(tooltip).toBeVisible();
    const tooltipBox = await tooltip.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        position: getComputedStyle(element).position,
      };
    });

    expect(tooltipBox.position).toBe("fixed");
    expect(tooltipBox.left).toBeGreaterThanOrEqual(0);
    expect(tooltipBox.right).toBeLessThanOrEqual(tooltipBox.viewportWidth);
    expect(tooltipBox.top).toBeGreaterThanOrEqual(0);
    expect(tooltipBox.bottom).toBeLessThanOrEqual(tooltipBox.viewportHeight);
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

  test("renders list-only chrome without panel headers or add buttons", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-index-nav-chrome-control]").selectOption("list-only");

    await expect(page.locator("[data-index-nav-panel-header-control]")).toHaveCount(0);
    await expect(page.locator("[data-icon-button-control]")).toHaveCount(0);
    await expect(page.locator("[data-index-nav-panel]").first()).toHaveAttribute("data-index-nav-panel-header-mode", "hidden");

    const listOnlyState = await page.locator("[data-index-nav-panel]").first().evaluate((panel) => {
      const panelBox = panel.getBoundingClientRect();
      const firstItem = panel.querySelector("[data-index-nav-item-control]");
      const firstItemBox = firstItem?.getBoundingClientRect();
      return {
        topGap: firstItemBox ? firstItemBox.top - panelBox.top : null,
        panelHeight: panelBox.height,
      };
    });

    expect(listOnlyState.topGap).not.toBeNull();
    expect(listOnlyState.topGap ?? 0).toBeLessThan(20);
    expect(listOnlyState.panelHeight).toBeGreaterThanOrEqual(500);
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
