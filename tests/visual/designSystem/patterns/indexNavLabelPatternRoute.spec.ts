import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/patterns/index-nav-label";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function patternGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-index-nav-label]")).map((element) => {
      const pattern = element as HTMLElement;
      const primitive = pattern.querySelector("[data-truncating-label]") as HTMLElement | null;
      const text = pattern.querySelector("[data-truncating-label-text]") as HTMLElement | null;
      const tooltip = pattern.querySelector("[data-truncating-label-tooltip]") as HTMLElement | null;
      const patternRect = pattern.getBoundingClientRect();
      const primitiveRect = primitive?.getBoundingClientRect();

      return {
        slot: pattern.dataset.indexNavLabelSlot,
        patternWidth: patternRect.width,
        primitiveWidth: primitiveRect?.width ?? 0,
        primitiveHeight: primitiveRect?.height ?? 0,
        textScrollWidth: text?.scrollWidth ?? 0,
        textClientWidth: text?.clientWidth ?? 0,
        textOverflow: text ? getComputedStyle(text).textOverflow : "",
        tooltipRole: tooltip?.getAttribute("role") ?? "",
        describedBy: primitive?.getAttribute("aria-describedby") ?? "",
        tooltipId: tooltip?.id ?? "",
        expanded: primitive?.getAttribute("aria-expanded") ?? "",
        tokenStyleData: primitive?.getAttribute("data-truncating-label-style") ?? "",
        backgroundToken: (pattern.closest("[data-index-nav-label-proof-slot]") as HTMLElement | null)?.dataset.indexNavLabelBackgroundToken ?? "",
        backgroundValue: (pattern.closest("[data-index-nav-label-proof-slot]") as HTMLElement | null)?.dataset.indexNavLabelBackgroundValue ?? "",
        foregroundValue: (pattern.closest("[data-index-nav-label-proof-slot]") as HTMLElement | null)?.dataset.indexNavLabelForegroundValue ?? "",
      };
    });
  });
}

test.describe("index nav label pattern route", () => {
  test("desktop renders governed constrained labels through the truncating-label primitive", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Label Pattern", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Baseline Variants", level: 2 })).toBeVisible();
    await expect(page.locator("[data-index-nav-label-theme-control]")).toHaveValue("original");
    await expect(page.locator("[data-index-nav-label-background-control]")).toHaveValue("background-surface-original");
    await expect(page.locator("[data-index-nav-label]")).toHaveCount(3);
    await expect(page.locator("[data-truncating-label]")).toHaveCount(3);
    await expect(page.getByText("It does not own the nav list, selected state, count badge, route, or app action.")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const labels = await patternGeometry(page);
    expect(labels).toHaveLength(3);
    for (const label of labels) {
      expect(label.primitiveWidth).toBeGreaterThanOrEqual(44);
      expect(label.primitiveHeight, JSON.stringify(label)).toBeGreaterThanOrEqual(44);
      expect(label.textScrollWidth).toBeGreaterThan(label.textClientWidth);
      expect(label.textOverflow).toBe("ellipsis");
      expect(label.tooltipRole).toBe("tooltip");
      expect(label.describedBy).toBe(label.tooltipId);
      expect(label.expanded).toBe("false");
      expect(label.tokenStyleData).toContain("--primitive-label-font-family");
      expect(label.backgroundToken).toBe("--background-surface-original");
      expect(label.backgroundValue).toBe("#ffffff");
    }

    const firstPrimitive = page.locator("[data-truncating-label]").first();
    await firstPrimitive.focus();
    await expect(firstPrimitive).toHaveAttribute("aria-expanded", "true");
    await expect(firstPrimitive.locator("[role='tooltip']")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(firstPrimitive).toHaveAttribute("aria-expanded", "false");

    await page.locator("[data-index-nav-label-theme-control]").selectOption("dark");
    await expect(page.locator("[data-index-nav-label-background-control]")).toHaveValue("background-page-dark");
    await expect(page.locator("[data-index-nav-label-width-control]")).toHaveValue("11rem");
    const darkLabels = await patternGeometry(page);
    for (const label of darkLabels) {
      expect(label.backgroundToken).toBe("--background-page-dark");
      expect(label.backgroundValue).toBe("#101318");
      expect(label.foregroundValue).toBe("#f4f7fb");
      expect(label.tokenStyleData).toContain("--primitive-tooltip-background: #f8fafc");
    }
  });

  test("mobile rtl keeps labels contained and touch toggles full-text disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Index Nav Label Pattern", level: 1 })).toBeVisible();
    await expect(page.locator("[data-index-nav-label]")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    await page.locator("[data-index-nav-label-theme-control]").selectOption("desert");
    await page.locator("[data-index-nav-label-background-control]").selectOption("background-surface-desert");
    await page.locator("[data-index-nav-label-width-control]").selectOption("8rem");
    await expect(page.locator("[data-index-nav-label-width-control]")).toHaveValue("8rem");

    const labels = await patternGeometry(page);
    for (const label of labels) {
      expect(label.patternWidth).toBeGreaterThan(0);
      expect(label.primitiveWidth).toBeGreaterThanOrEqual(44);
      expect(label.primitiveHeight, JSON.stringify(label)).toBeGreaterThanOrEqual(44);
      expect(label.textScrollWidth).toBeGreaterThan(label.textClientWidth);
      expect(label.backgroundToken).toBe("--background-surface-desert");
      expect(label.tokenStyleData).toContain("--primitive-tooltip-background: #3b2a20");
    }

    const firstPrimitive = page.locator("[data-truncating-label]").first();
    await firstPrimitive.click();
    await expect(firstPrimitive).toHaveAttribute("aria-expanded", "true");
    await expect(firstPrimitive.locator("[role='tooltip']")).toBeVisible();
    await firstPrimitive.click();
    await expect(firstPrimitive).toHaveAttribute("aria-expanded", "false");
  });
});
