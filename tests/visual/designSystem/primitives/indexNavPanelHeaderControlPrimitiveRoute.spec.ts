import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/index-nav-panel-header-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav panel header control primitive route", () => {
  test("renders fixed-height sticky header with governed icon-button action", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Panel Header Control Primitive", level: 1 })).toBeVisible();
    const header = page.locator("[data-index-nav-panel-header-control]").first();
    const button = page.getByRole("button", { name: "Add index item" });
    await expect(header).toBeVisible();
    await expect(button).toBeVisible();

    const geometry = await header.evaluate((element) => {
      const title = element.querySelector(".ds-index-nav-panel-header-control-title");
      const buttonElement = element.querySelector("[data-icon-button-control]");
      const headerBox = element.getBoundingClientRect();
      const titleBox = title?.getBoundingClientRect();
      const buttonBox = buttonElement?.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        height: headerBox.height,
        minHeight: style.minBlockSize,
        maxHeight: style.maxBlockSize,
        position: style.position,
        stickyTop: style.insetBlockStart,
        titleCenter: titleBox ? titleBox.top + titleBox.height / 2 : 0,
        buttonCenter: buttonBox ? buttonBox.top + buttonBox.height / 2 : 0,
        borderBottomWidth: style.borderBottomWidth,
        borderBottomStyle: style.borderBottomStyle,
        borderBottomColor: style.borderBottomColor,
      };
    });

    expect(geometry.height).toBeGreaterThanOrEqual(51);
    expect(geometry.height).toBeLessThanOrEqual(53);
    expect(geometry.minHeight).toBe("52px");
    expect(geometry.maxHeight).toBe("52px");
    expect(geometry.position).toBe("sticky");
    expect(geometry.stickyTop).toBe("0px");
    expect(geometry.borderBottomWidth).toBe("1px");
    expect(geometry.borderBottomStyle).toBe("solid");
    expect(geometry.borderBottomColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(Math.abs(geometry.titleCenter - geometry.buttonCenter)).toBeLessThanOrEqual(2);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("reveals full header title only when the title is truncated", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const truncatedTitle = page.locator("[data-index-nav-panel-header-control]").first().locator("[data-truncating-label]");
    await expect(truncatedTitle).toHaveAttribute("data-truncating-label-overflow", "true");
    await truncatedTitle.focus();
    await expect(truncatedTitle).toHaveAttribute("aria-expanded", "true");

    const tooltip = truncatedTitle.locator("[role='tooltip']");
    await expect(tooltip).toBeVisible();
    const tooltipGeometry = await tooltip.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        position: getComputedStyle(element).position,
      };
    });

    expect(tooltipGeometry.position).toBe("fixed");
    expect(tooltipGeometry.top).toBeGreaterThanOrEqual(0);
    expect(tooltipGeometry.left).toBeGreaterThanOrEqual(0);
    expect(tooltipGeometry.right).toBeLessThanOrEqual(tooltipGeometry.viewportWidth);
    expect(tooltipGeometry.bottom).toBeLessThanOrEqual(tooltipGeometry.viewportHeight);

    const fittingTitle = page
      .locator("[data-index-nav-panel-header-control]")
      .nth(1)
      .locator("[data-truncating-label]");
    await expect(fittingTitle).toHaveAttribute("data-truncating-label-overflow", "false");
    await fittingTitle.focus();
    await expect(fittingTitle).toHaveAttribute("aria-expanded", "false");
  });
});
