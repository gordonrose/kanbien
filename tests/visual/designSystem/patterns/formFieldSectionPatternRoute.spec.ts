import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/form-field-section";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function fieldBoxes(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-form-field-section-item]")).map((item) => {
      if (!(item instanceof HTMLElement)) {
        throw new Error("Missing form-field-section item.");
      }
      const box = item.getBoundingClientRect();
      return {
        id: item.dataset.formFieldSectionItem,
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        width: Math.round(box.width),
      };
    }),
  );
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
      !(actions instanceof HTMLElement) ||
      !(topNav instanceof HTMLElement)
    ) {
      throw new Error("Missing drawer overlay, search input, or top navigation for drawer geometry assertion.");
    }
    const stackBox = stack.getBoundingClientRect();
    const searchBox = searchInput.getBoundingClientRect();
    const searchPanelBox = searchPanel.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();
    const actionsBox = actions.getBoundingClientRect();
    const topNavBox = topNav.getBoundingClientRect();
    return {
      stackTop: Math.round(stackBox.top),
      stackHeight: Math.round(stackBox.height),
      searchHeight: Math.round(searchBox.height),
      searchPanelHeight: Math.round(searchPanelBox.height),
      footerBottom: Math.round(actionsBox.bottom),
      panelBottom: Math.round(panelBox.bottom),
      shellChromeBottom: Math.round(topNavBox.bottom),
    };
  });
}

test.describe("form-field-section pattern route", () => {
  test("desktop proves two-column placement, span-2 rows, and governed field containers", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Form Field Section Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-form-field-section]")).toHaveCount(1);
    await expect(page.locator("[data-field-container-control]")).toHaveCount(8);

    const boxes = await fieldBoxes(page);
    const entityName = boxes.find((box) => box.id === "entity-name");
    const stableKey = boxes.find((box) => box.id === "stable-key");
    const description = boxes.find((box) => box.id === "description");
    expect(entityName).toBeDefined();
    expect(stableKey).toBeDefined();
    expect(description).toBeDefined();
    expect(entityName?.top).toBe(stableKey?.top);
    expect(description?.width ?? 0).toBeGreaterThan((entityName?.width ?? 0) * 1.5);
    expect(page.locator("[data-form-field-section-item='description']")).toHaveAttribute(
      "data-form-field-section-span",
      "span-2",
    );

    const existingStatus = page.getByRole("radio", { name: "Existing" });
    const plannedStatus = page.getByRole("radio", { name: "Planned" });
    await expect(existingStatus).toBeChecked();
    await existingStatus.focus();
    await page.keyboard.press("ArrowRight");
    await expect(plannedStatus).toBeFocused();
    await expect(plannedStatus).toBeChecked();

    await page.getByRole("button", { name: /2 selected/ }).click();
    await expect(page.getByRole("searchbox", { name: "Search options" })).toBeFocused();
    await expect(page.locator("[data-drawer-select]")).toHaveAttribute("data-drawer-select-open", "true");
    await expect(page.locator("[data-panel-stack]")).toHaveCount(1);
    const desktopDrawer = await drawerOverlayMetrics(page);
    expect(Math.abs(desktopDrawer.stackTop - desktopDrawer.shellChromeBottom)).toBeLessThanOrEqual(2);
    expect(desktopDrawer.searchHeight).toBeLessThanOrEqual(72);
    expect(desktopDrawer.searchPanelHeight).toBeLessThanOrEqual(460);
    expect(Math.abs(desktopDrawer.footerBottom - desktopDrawer.panelBottom)).toBeLessThanOrEqual(2);
    await page.getByRole("button", { name: "Close selector" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile/narrow proof stacks fields, preserves drawer overlay, and exposes truncated text disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-form-field-section-control='widthPosture']").selectOption("narrow");
    await page.locator("[data-form-field-section-control='viewport']").selectOption("mobile");
    await page.locator("[data-form-field-section-control='textPressure']").selectOption("long");
    await page.locator("[data-form-field-section-control='direction']").selectOption("rtl");
    await page.locator("[data-form-field-section-control='theme']").selectOption("dark");

    const host = page.locator(".form-field-section-proof-host").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-form-field-section]")).toHaveAttribute("data-form-field-section-viewport", "mobile");

    const boxes = await fieldBoxes(page);
    const entityName = boxes.find((box) => box.id === "entity-name");
    const stableKey = boxes.find((box) => box.id === "stable-key");
    expect(entityName).toBeDefined();
    expect(stableKey).toBeDefined();
    expect(stableKey?.top ?? 0).toBeGreaterThan(entityName?.bottom ?? 0);

    await page.getByRole("checkbox", { name: /Owner with long governed label text/ }).focus();
    await expect(page.locator("[data-card-list-select-tooltip]").filter({ hasText: /Owner with long/ })).toBeVisible();

    await page.locator("[data-form-field-section-control='drawerOpen']").selectOption("true");
    await expect(page.locator("[data-drawer-select]")).toHaveAttribute("data-drawer-select-overlay", "page-shell");
    await expect(page.locator("[data-panel-stack]")).toHaveCSS("position", "fixed");
    const stackBox = await page.locator("[data-panel-stack]").boundingBox();
    expect(stackBox).not.toBeNull();
    expect(Math.round(stackBox?.x ?? -1)).toBe(0);
    expect(Math.round(stackBox?.y ?? -1)).toBeGreaterThan(0);
    expect(Math.round(stackBox?.width ?? 0)).toBe(390);
    expect(Math.round(stackBox?.height ?? 0)).toBeLessThan(844);
    const mobileDrawer = await drawerOverlayMetrics(page);
    expect(Math.abs(mobileDrawer.stackTop - mobileDrawer.shellChromeBottom)).toBeLessThanOrEqual(2);
    expect(mobileDrawer.searchHeight).toBeLessThanOrEqual(72);
    expect(mobileDrawer.searchPanelHeight).toBeLessThanOrEqual(460);
    expect(Math.abs(mobileDrawer.footerBottom - mobileDrawer.panelBottom)).toBeLessThanOrEqual(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
