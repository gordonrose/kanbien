import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/drawer-select";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function focusRingFitsInside(locator: ReturnType<Page["locator"]>, boundarySelector: string) {
  return locator.evaluate((element, selector) => {
    const elementBox = element.getBoundingClientRect();
    const boundary = element.closest(selector);
    if (!(boundary instanceof HTMLElement)) {
      return false;
    }
    const boundaryBox = boundary.getBoundingClientRect();
    const styles = getComputedStyle(element);
    const outlineWidth = Number.parseFloat(styles.outlineWidth) || 0;
    const outlineOffset = Number.parseFloat(styles.outlineOffset) || 0;
    const focusInset = outlineWidth + Math.max(outlineOffset, 0);
    return (
      elementBox.top - focusInset >= boundaryBox.top &&
      elementBox.left - focusInset >= boundaryBox.left &&
      elementBox.right + focusInset <= boundaryBox.right &&
      elementBox.bottom + focusInset <= boundaryBox.bottom
    );
  }, boundarySelector);
}

async function drawerOverlayMetrics(page: Page) {
  return page.evaluate(() => {
    const stack = document.querySelector("[data-panel-stack]");
    const searchInput = document.querySelector("[data-search-field-control-input]");
    const searchPanel = document.querySelector("[data-searchable-selection-panel]");
    const panel = document.querySelector(".ds-drawer-select-panel");
    const actions = document.querySelector("[data-drawer-select-actions]");
    const topNav = document.querySelector(".top-nav");
    if (
      !(stack instanceof HTMLElement) ||
      !(searchInput instanceof HTMLElement) ||
      !(searchPanel instanceof HTMLElement) ||
      !(panel instanceof HTMLElement) ||
      !(actions instanceof HTMLElement)
    ) {
      throw new Error("Missing drawer overlay, search input, or searchable panel for drawer geometry assertion.");
    }
    const stackBox = stack.getBoundingClientRect();
    const searchBox = searchInput.getBoundingClientRect();
    const searchPanelBox = searchPanel.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();
    const actionsBox = actions.getBoundingClientRect();
    const topNavBox = topNav instanceof HTMLElement ? topNav.getBoundingClientRect() : null;
    return {
      stackTop: Math.round(stackBox.top),
      stackHeight: Math.round(stackBox.height),
      searchHeight: Math.round(searchBox.height),
      searchPanelHeight: Math.round(searchPanelBox.height),
      footerBottom: Math.round(actionsBox.bottom),
      panelBottom: Math.round(panelBox.bottom),
      shellChromeBottom: Math.round(topNavBox?.bottom ?? 64),
    };
  });
}

test.describe("drawer-select pattern route", () => {
  test("desktop proves pending selection, cancel discard, and apply commit", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Drawer Select Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-count-card-control]")).toHaveCount(1);
    await expect(page.locator("[data-panel-stack]")).toHaveCount(1);
    await expect(page.locator("[data-searchable-selection-panel]")).toHaveCount(1);
    await expect(page.locator("[data-panel-header-control]")).toHaveCount(1);
    await expect(page.locator("[data-text-action-button-control]")).toHaveCount(2);
    await expect(page.getByText(/Committed: record-page, list-centric/)).toBeVisible();

    await page.getByRole("checkbox", { name: /Workflow routing/ }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByText(/Pending: .*workflow/)).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Workflow routing/ })).toBeFocused();
    await expect(page.getByText(/pending changed/)).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect(page.getByText(/Committed: record-page, list-centric/)).toBeVisible();
    await expect(page.getByText(/Pending: record-page, list-centric/)).toBeVisible();

    await page.getByRole("button", { name: /2 selected/ }).click();
    await expect(page.getByRole("searchbox", { name: "Search page templates" })).toBeFocused();
    await page.getByRole("checkbox", { name: /Workflow routing/ }).focus();
    await page.keyboard.press("Space");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect(page.getByText(/Committed: .*workflow/)).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile proves single mode, left placement, theme, close discard, and no-match state", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-drawer-select-control='open']").selectOption("false");
    await page.locator("[data-drawer-select-control='mode']").selectOption("single");
    await page.locator("[data-drawer-select-control='viewport']").selectOption("mobile");
    await page.locator("[data-drawer-select-control='origin']").selectOption("left");
    await page.locator("[data-drawer-select-control='theme']").selectOption("dark");
    await page.locator("[data-drawer-select-control='query']").selectOption("zzzz");
    await page.locator("[data-drawer-select-control='open']").selectOption("true");

    await expect(page.locator("[data-drawer-select]")).toHaveAttribute("data-drawer-select-mode", "single");
    await expect(page.locator("[data-drawer-select]")).toHaveAttribute("data-drawer-select-overlay", "page-shell");
    await expect(page.locator("[data-panel-stack]")).toHaveAttribute("data-panel-stack-origin", "left");
    await expect(page.locator("[data-panel-stack]")).toHaveAttribute("data-panel-stack-viewport", "mobile");
    await expect(page.locator("[data-panel-stack]")).toHaveCSS("position", "fixed");
    await expect(page.locator("[data-panel-surface-control]").first()).toHaveCSS("background-color", "rgb(23, 27, 34)");
    await expect(page.locator("[data-searchable-selection-panel]")).toHaveCSS("background-color", "rgb(23, 27, 34)");
    await expect(page.getByText("No available options match the current search.")).toBeVisible();

    const stackBox = await page.locator("[data-panel-stack]").boundingBox();
    expect(stackBox).not.toBeNull();
    expect(Math.round(stackBox?.x ?? -1)).toBe(0);
    expect(Math.round(stackBox?.y ?? -1)).toBeGreaterThan(0);
    expect(Math.round(stackBox?.width ?? 0)).toBe(390);
    expect(Math.round(stackBox?.height ?? 0)).toBeLessThan(844);
    const drawer = await drawerOverlayMetrics(page);
    expect(Math.abs(drawer.stackTop - drawer.shellChromeBottom)).toBeLessThanOrEqual(2);
    expect(drawer.searchHeight).toBeLessThanOrEqual(72);
    expect(drawer.searchPanelHeight).toBeLessThanOrEqual(460);
    expect(Math.abs(drawer.footerBottom - drawer.panelBottom)).toBeLessThanOrEqual(2);

    const headerTitle = page.locator("[data-panel-header-control] [data-truncating-label]").first();
    await headerTitle.focus();
    expect(await focusRingFitsInside(headerTitle, "[data-panel-header-control]")).toBe(true);

    const closeButton = page.getByRole("button", { name: "Close selector" });
    await closeButton.focus();
    expect(await focusRingFitsInside(closeButton, "[data-panel-header-control]")).toBe(true);
    await closeButton.click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);

    await page.locator("[data-drawer-select-control='query']").selectOption("workflow");
    await page.locator("[data-drawer-select-control='open']").selectOption("true");
    const search = page.getByRole("searchbox", { name: "Search page templates" });
    await search.focus();
    expect(await focusRingFitsInside(search, "[data-searchable-selection-panel]")).toBe(true);

    const workflowOption = page.locator("[data-card-list-select-option-value='workflow']");
    const workflowInput = workflowOption.locator("[data-card-list-select-input]");
    await workflowInput.focus();
    await expect(workflowOption.locator("[data-focus-instruction-disclosure]")).toBeVisible();
    expect(await focusRingFitsInside(workflowOption.locator(".ds-card-list-select-option-label"), "[data-scroll-region-control]")).toBe(true);
    await workflowInput.press("Space");
    await expect(page.getByText(/Pending: workflow/)).toBeVisible();
    await expect(workflowInput).toBeFocused();
    await page.getByRole("button", { name: "Close selector" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect(page.getByText(/Committed: record-page/)).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
