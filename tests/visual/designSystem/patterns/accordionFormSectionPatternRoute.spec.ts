import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/accordion-form-section";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function fieldBoxes(page: Page, selector: string) {
  return page.evaluate((rootSelector) => {
    const root = document.querySelector(rootSelector);
    if (!(root instanceof HTMLElement)) {
      throw new Error(`Missing field box root: ${rootSelector}`);
    }
    return Array.from(root.querySelectorAll("[data-form-field-section-item]")).map((item) => {
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
    });
  }, selector);
}

async function drawerOverlayMetrics(page: Page) {
  return page.evaluate(() => {
    const stack = document.querySelector("[data-panel-stack]");
    const boundary = stack?.closest("[data-drawer-overlay-boundary]");
    const panel = document.querySelector(".ds-drawer-select-panel");
    const actions = document.querySelector("[data-drawer-select-actions]");
    const searchInput = document.querySelector("[data-search-field-control-input]");
    const topNav = document.querySelector(".top-nav");
    if (
      !(stack instanceof HTMLElement) ||
      !(boundary instanceof HTMLElement) ||
      !(panel instanceof HTMLElement) ||
      !(actions instanceof HTMLElement) ||
      !(searchInput instanceof HTMLElement) ||
      !(topNav instanceof HTMLElement)
    ) {
      throw new Error("Missing drawer overlay geometry target.");
    }
    const stackBox = stack.getBoundingClientRect();
    const boundaryBox = boundary.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();
    const actionsBox = actions.getBoundingClientRect();
    const searchBox = searchInput.getBoundingClientRect();
    const topNavBox = topNav.getBoundingClientRect();
    return {
      stackTop: Math.round(stackBox.top),
      stackX: Math.round(stackBox.x),
      stackWidth: Math.round(stackBox.width),
      stackHeight: Math.round(stackBox.height),
      boundaryTop: Math.round(boundaryBox.top),
      boundaryX: Math.round(boundaryBox.x),
      boundaryWidth: Math.round(boundaryBox.width),
      boundaryHeight: Math.round(boundaryBox.height),
      panelBottom: Math.round(panelBox.bottom),
      footerBottom: Math.round(actionsBox.bottom),
      searchHeight: Math.round(searchBox.height),
      shellChromeBottom: Math.round(topNavBox.bottom),
    };
  });
}

test.describe("accordion-form-section pattern route", () => {
  test("desktop composes accordion-group and form-field-section without local field layout", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Accordion Form Section Pattern", level: 1 })).toBeVisible();
    await expect(page.locator(".design-system-shell")).toHaveCount(1);
    await expect(page.locator(".top-nav")).toHaveCSS("display", "grid");
    await expect(page.locator(".brand-mark")).toHaveCSS("display", "grid");
    await expect(page.locator("[data-accordion-form-section]")).toHaveCount(1);
    await expect(page.locator("[data-accordion-group]")).toHaveCount(1);
    await expect(page.locator("[data-form-field-section]")).toHaveCount(3);
    await expect(page.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#accordion-form-section-proof-accordion-identity-panel")).toBeVisible();

    const boxes = await fieldBoxes(page, "#accordion-form-section-proof-accordion-identity-panel");
    const entityName = boxes.find((box) => box.id === "entity-name");
    const stableKey = boxes.find((box) => box.id === "stable-key");
    const description = boxes.find((box) => box.id === "description");
    expect(entityName).toBeDefined();
    expect(stableKey).toBeDefined();
    expect(description).toBeDefined();
    expect(entityName?.top).toBe(stableKey?.top);
    expect(description?.width ?? 0).toBeGreaterThan((entityName?.width ?? 0) * 1.5);

    await page.getByRole("button", { name: "Workflows" }).click();
    await expect(page.getByRole("button", { name: "Workflows" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Identity" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#accordion-form-section-proof-accordion-identity-panel")).toBeHidden();
    await expect(page.locator("#accordion-form-section-proof-accordion-workflows-panel")).toBeVisible();

    const existingStatus = page.getByRole("radio", { name: "Existing" });
    const plannedStatus = page.getByRole("radio", { name: "Planned" });
    await expect(existingStatus).toBeChecked();
    await existingStatus.focus();
    await page.keyboard.press("ArrowRight");
    await expect(plannedStatus).toBeFocused();
    await expect(plannedStatus).toBeChecked();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("display section proves drawer overlay, card select composition, theme, RTL, and mobile stacking", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await page.locator("[data-accordion-form-section-control='widthPosture']").selectOption("narrow");
    await page.locator("[data-accordion-form-section-control='viewport']").selectOption("mobile");
    await page.locator("[data-accordion-form-section-control='direction']").selectOption("rtl");
    await page.locator("[data-accordion-form-section-control='theme']").selectOption("dark");
    await page.locator("[data-accordion-form-section-control='expandedSection']").selectOption("display");
    await page.locator(".accordion-form-section-proof-host").scrollIntoViewIfNeeded();

    const host = page.locator(".accordion-form-section-proof-host").first();
    await expect(host).toHaveAttribute("dir", "rtl");
    await expect(
      page.locator("#accordion-form-section-proof-accordion-display-panel [data-form-field-section]"),
    ).toHaveAttribute("data-form-field-section-viewport", "mobile");
    await expect(page.locator("[data-drawer-select-field]")).toBeVisible();
    await expect(page.locator("[data-card-list-select-field]")).toBeVisible();

    const mobileBoxes = await fieldBoxes(page, "#accordion-form-section-proof-accordion-display-panel");
    const drawerField = mobileBoxes.find((box) => box.id === "owning-feature");
    const cardField = mobileBoxes.find((box) => box.id === "priority-cards");
    expect(drawerField).toBeDefined();
    expect(cardField).toBeDefined();
    expect(cardField?.top ?? 0).toBeGreaterThan(drawerField?.bottom ?? 0);

    await page.locator("[data-accordion-form-section-control='drawerOpen']").selectOption("true");
    await expect(page.locator("[data-drawer-select]")).toHaveAttribute("data-drawer-select-overlay", "page-shell");
    await expect(page.locator("[data-panel-stack]")).toHaveCSS("position", "fixed");
    await expect(page.locator("[data-panel-stack]")).toHaveAttribute("data-panel-stack-overlay-boundary", "contained");
    await expect(page.getByRole("searchbox", { name: "Search options" })).toBeFocused();
    const drawer = await drawerOverlayMetrics(page);
    expect(Math.abs(drawer.stackX - drawer.boundaryX)).toBeLessThanOrEqual(2);
    expect(Math.abs(drawer.stackWidth - drawer.boundaryWidth)).toBeLessThanOrEqual(2);
    expect(Math.abs(drawer.stackTop - drawer.boundaryTop)).toBeLessThanOrEqual(2);
    expect(Math.abs(drawer.stackHeight - drawer.boundaryHeight)).toBeLessThanOrEqual(2);
    expect(drawer.searchHeight).toBeLessThanOrEqual(72);
    expect(Math.abs(drawer.footerBottom - drawer.panelBottom)).toBeLessThanOrEqual(2);

    await page.getByRole("button", { name: "Close selector" }).click();
    await expect(page.locator("[data-panel-stack]")).toHaveCount(0);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("desktop browser mobile review keeps drawer inside the proof viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await page.locator("[data-accordion-form-section-control='viewport']").selectOption("mobile");
    await page.locator("[data-accordion-form-section-control='expandedSection']").selectOption("display");
    await page.locator("[data-accordion-form-section-control='drawerOpen']").selectOption("true");

    const fit = await page.locator("[data-panel-stack]").evaluate((stack) => {
      const boundary = stack.closest("[data-drawer-overlay-boundary]");
      if (!(stack instanceof HTMLElement) || !(boundary instanceof HTMLElement)) {
        return { fits: false, stackWidth: 0, boundaryWidth: 0 };
      }

      const stackBox = stack.getBoundingClientRect();
      const boundaryBox = boundary.getBoundingClientRect();
      return {
        fits:
          Math.abs(stackBox.top - boundaryBox.top) <= 2 &&
          Math.abs(stackBox.left - boundaryBox.left) <= 2 &&
          Math.abs(stackBox.width - boundaryBox.width) <= 2 &&
          Math.abs(stackBox.height - boundaryBox.height) <= 2,
        stackWidth: Math.round(stackBox.width),
        boundaryWidth: Math.round(boundaryBox.width),
      };
    });

    expect(fit.fits).toBe(true);
    expect(fit.stackWidth).toBe(fit.boundaryWidth);
    expect(fit.stackWidth).toBeLessThan(500);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
