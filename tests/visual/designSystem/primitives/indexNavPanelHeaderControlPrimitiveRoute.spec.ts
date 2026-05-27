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
      const buttonElement = element.querySelector("[data-index-nav-icon-button-control]");
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
});
