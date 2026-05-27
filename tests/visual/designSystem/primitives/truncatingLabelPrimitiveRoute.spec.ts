import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/primitives/truncating-label";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function labelGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-truncating-label]")).map((element) => {
      const label = element as HTMLElement;
      const text = label.querySelector("[data-truncating-label-text]") as HTMLElement | null;
      const tooltip = label.querySelector("[data-truncating-label-tooltip]") as HTMLElement | null;
      const rect = label.getBoundingClientRect();
      const textRect = text?.getBoundingClientRect();
      const tooltipStyle = tooltip ? getComputedStyle(tooltip) : null;

      return {
        accessibleName: label.getAttribute("aria-label"),
        describedBy: label.getAttribute("aria-describedby"),
        expanded: label.getAttribute("aria-expanded"),
        width: rect.width,
        height: rect.height,
        textWidth: textRect?.width ?? 0,
        textScrollWidth: text?.scrollWidth ?? 0,
        textClientWidth: text?.clientWidth ?? 0,
        textOverflow: text ? getComputedStyle(text).textOverflow : "",
        whiteSpace: text ? getComputedStyle(text).whiteSpace : "",
      tooltipId: tooltip?.id ?? "",
      tooltipRole: tooltip?.getAttribute("role") ?? "",
      tooltipVisibility: tooltipStyle?.visibility ?? "",
        tooltipOpacity: tooltipStyle?.opacity ?? "",
        display: getComputedStyle(label).display,
        minHeight: getComputedStyle(label).minHeight,
        heightStyle: getComputedStyle(label).height,
        tokenStyleData: label.getAttribute("data-truncating-label-style") ?? "",
        overflowState: label.dataset.truncatingLabelOverflow ?? "",
      };
    });
  });
}

test.describe("truncating label primitive route", () => {
  test("desktop truncates visible labels while preserving full accessible text and focus disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Truncating Label Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-truncating-label]")).toHaveCount(4);
    await expect(page.getByText("This primitive is not a button, menu, popover, field row, nav item, or app action.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const initial = await labelGeometry(page);
    expect(initial).toHaveLength(4);
    for (const label of initial.slice(0, 3)) {
      expect(label.width).toBeGreaterThanOrEqual(44);
      expect(label.height, JSON.stringify(label)).toBeGreaterThanOrEqual(44);
      expect(label.textScrollWidth).toBeGreaterThan(label.textClientWidth);
      expect(label.textOverflow).toBe("ellipsis");
      expect(label.whiteSpace).toBe("nowrap");
      expect(label.tooltipRole).toBe("tooltip");
      expect(label.describedBy).toBe(label.tooltipId);
      expect(label.overflowState).toBe("true");
      expect(label.expanded).toBe("false");
      expect(label.tooltipVisibility).toBe("hidden");
    }

    expect(initial[3].textScrollWidth).toBeLessThanOrEqual(initial[3].textClientWidth + 1);
    expect(initial[3].describedBy ?? "").toBe("");
    expect(initial[3].overflowState).toBe("false");

    const firstLabel = page.locator("[data-truncating-label]").first();
    await firstLabel.focus();
    await expect(firstLabel).toHaveAttribute("aria-expanded", "true");
    await expect(firstLabel.locator("[role='tooltip']")).toBeVisible();
    await expect(firstLabel).toHaveAttribute(
      "aria-label",
      "Organization label with long text that names the source authority model",
    );

    await page.keyboard.press("Escape");
    await expect(firstLabel).toHaveAttribute("aria-expanded", "false");

    const fittingLabel = page.locator("[data-truncating-label]").nth(3);
    await fittingLabel.focus();
    await expect(fittingLabel).toHaveAttribute("aria-expanded", "false");
    await expect(fittingLabel.locator("[role='tooltip']")).toBeHidden();
  });

  test("mobile rtl keeps targets contained and touch toggles disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Truncating Label Primitive", level: 1 })).toBeVisible();
    await expect(page.locator("[data-truncating-label]")).toHaveCount(4);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const labels = await labelGeometry(page);
    for (const label of labels.slice(0, 3)) {
      expect(label.width).toBeGreaterThanOrEqual(44);
      expect(label.height, JSON.stringify(label)).toBeGreaterThanOrEqual(44);
      expect(label.textScrollWidth).toBeGreaterThan(label.textClientWidth);
    }

    const firstLabel = page.locator("[data-truncating-label]").first();
    await firstLabel.click();
    await expect(firstLabel).toHaveAttribute("aria-expanded", "true");
    await expect(firstLabel.locator("[role='tooltip']")).toBeVisible();
    await firstLabel.click();
    await expect(firstLabel).toHaveAttribute("aria-expanded", "false");

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
