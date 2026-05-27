import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/index-nav-item-control";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

test.describe("index nav item control primitive route", () => {
  test("desktop renders one-focus-target item controls and activation evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Control Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-index-nav-item-control]")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "Identity model with long governed label text" })).toHaveAttribute("aria-current", "true");
    await expect(page.getByRole("button", { name: "Compliance retention setup unavailable" })).toBeDisabled();

    await page.getByRole("button", { name: "Identity model with long governed label text" }).focus();
    await expect(page.locator("#index-nav-item-control-proof-0-tooltip")).toBeVisible();

    const fittingButton = page.getByRole("button", { name: "Identity", exact: true });
    await fittingButton.focus();
    await expect(fittingButton).not.toHaveAttribute("aria-describedby", /.+/);
    await expect(page.locator("#index-nav-item-control-proof-3-tooltip")).toBeHidden();

    const currentGeometry = await page.locator("#index-nav-item-control-proof-0").evaluate((element) => {
      const marker = element.querySelector(".ds-index-nav-item-control-current-marker");
      const content = element.querySelector(".ds-index-nav-item-control-content");
      const supporting = element.querySelector(".ds-index-nav-item-control-supporting");
      if (!(marker instanceof HTMLElement) || !(content instanceof HTMLElement) || !(supporting instanceof HTMLElement)) {
        return null;
      }

      const markerBox = marker.getBoundingClientRect();
      const contentBox = content.getBoundingClientRect();
      const supportingStyle = getComputedStyle(supporting);
      return {
        markerHeight: markerBox.height,
        contentHeight: contentBox.height,
        supportingFontSize: supportingStyle.fontSize,
        supportingFontWeight: supportingStyle.fontWeight,
        supportingOpacity: supportingStyle.opacity,
      };
    });

    expect(currentGeometry).not.toBeNull();
    expect(currentGeometry?.markerHeight ?? 0).toBeGreaterThanOrEqual((currentGeometry?.contentHeight ?? 1) - 1);
    expect(currentGeometry).toMatchObject({
      supportingFontSize: "12px",
      supportingFontWeight: "800",
      supportingOpacity: "1",
    });

    await page.getByRole("button", { name: "Workflow ownership and source authority posture" }).click();
    await expect(page.getByText("Activation log: dark-resting")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("mobile keeps item labels clipped within their host", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Control Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-index-nav-item-control]")).toHaveCount(4);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
