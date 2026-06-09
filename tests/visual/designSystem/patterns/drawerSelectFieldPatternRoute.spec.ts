import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/drawer-select-field";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function labelToTriggerGap(page: Page) {
  return page.evaluate(() => {
    const labelLine = document.querySelector(".ds-drawer-select-field .ds-field-row-control-label-line");
    const trigger = document.querySelector("[data-count-card-control]");
    if (!(labelLine instanceof HTMLElement) || !(trigger instanceof HTMLElement)) {
      throw new Error("Missing drawer-select field label or trigger for gap assertion.");
    }
    const labelBox = labelLine.getBoundingClientRect();
    const triggerBox = trigger.getBoundingClientRect();
    return Math.round(triggerBox.top - labelBox.bottom);
  });
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
      searchHeight: Math.round(searchBox.height),
      searchPanelHeight: Math.round(searchPanelBox.height),
      footerBottom: Math.round(actionsBox.bottom),
      panelBottom: Math.round(panelBox.bottom),
      shellChromeBottom: Math.round(topNavBox?.bottom ?? 64),
    };
  });
}

test.describe("drawer-select-field pattern route", () => {
  test("desktop composes a field row with drawer-select pending and apply behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Drawer Select Field Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-field-row-control]")).toHaveCount(1);
    await expect(page.locator("[data-drawer-select]")).toHaveCount(1);
    await expect.poll(() => labelToTriggerGap(page)).toBeLessThanOrEqual(8);

    await page.locator("[data-drawer-select-field-control='fixturePressure']").selectOption("long");
    await page.getByRole("button", { name: /2 selected/ }).click();
    await expect(page.getByRole("searchbox", { name: "Search options" })).toBeFocused();
    await page.getByRole("checkbox", { name: /Workflow routing/ }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByText(/Pending: .*workflow/)).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Workflow routing/ })).toBeFocused();
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect(page.getByText(/Committed: .*workflow/)).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("review controls prove error, disabled, narrow, RTL, theme, and page-shell overlay", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-drawer-select-field-control='labelLength']").selectOption("long");
    await page.locator("[data-drawer-select-field-control='fixturePressure']").selectOption("long");
    await page.locator("[data-drawer-select-field-control='reviewWidth']").selectOption("narrow");
    await page.locator("[data-drawer-select-field-control='direction']").selectOption("rtl");
    await page.locator("[data-drawer-select-field-control='theme']").selectOption("dark");
    await page.locator("[data-drawer-select-field-control='fieldState']").selectOption("error");

    const host = page.locator("[data-drawer-select-field-review-width]").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-field-row-control-message='error']")).toHaveText(
      "Review the drawer selection before continuing.",
    );

    await page.locator("[data-drawer-select-field-control='fieldState']").selectOption("disabled");
    await expect(page.locator("[data-count-card-control]")).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator("[data-count-card-control]")).toHaveAttribute("data-count-card-control-mode", "static");

    await page.locator("[data-drawer-select-field-control='fieldState']").selectOption("default");
    await page.locator("[data-drawer-select-field-control='mode']").selectOption("single");
    await page.locator("[data-drawer-select-field-control='viewport']").selectOption("mobile");
    await page.locator("[data-drawer-select-field-control='origin']").selectOption("left");
    await page.locator("[data-drawer-select-field-control='open']").selectOption("true");

    await expect(page.locator("[data-drawer-select]")).toHaveAttribute("data-drawer-select-overlay", "page-shell");
    await expect(page.locator("[data-panel-stack]")).toHaveCSS("position", "fixed");
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
    await page.getByRole("button", { name: "Close selector" }).click();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
