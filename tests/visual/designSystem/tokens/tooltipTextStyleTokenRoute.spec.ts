import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/tooltip-text-style";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function visibleTextOverflow(page: Page) {
  return page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".token-spec-page h1, .token-spec-page h2, .token-spec-page h3, .token-spec-page p, .token-spec-page code, .token-spec-page li, .token-spec-page dd, .token-spec-page dt",
      ),
    )
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element.offsetParent !== null)
      .map((element) => ({
        text: element.textContent?.trim().slice(0, 80) ?? "",
        overflow: element.scrollWidth - element.clientWidth,
      }))
      .filter((item) => item.overflow > 2);
  });
}

async function textStyleSample(page: Page) {
  return page.evaluate(() => {
    const sample = document.querySelector(".token-spec-text-style-sample");
    const preview = document.querySelector(".token-spec-text-style-preview");

    if (!(sample instanceof HTMLElement) || !(preview instanceof HTMLElement)) {
      return null;
    }

    const rect = sample.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();
    const style = getComputedStyle(sample);

    return {
      text: sample.textContent?.trim() ?? "",
      width: rect.width,
      height: rect.height,
      leftInset: rect.left - previewRect.left,
      rightInset: previewRect.right - rect.right,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      color: style.color,
      backgroundColor: style.backgroundColor,
    };
  });
}

test.describe("tooltip text style token route", () => {
  test("desktop renders governed tooltip disclosure typography with fallback stack visible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Tooltip Text Style Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(1);
    await expect(page.getByText("Font fallback rule")).toBeVisible();
    await expect(page.getByText("ui-sans-serif, system-ui, platform UI fonts")).toBeVisible();
    await expect(page.getByText("tooltip trigger behavior, placement, dismissal, and ARIA remain later-layer work")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const sample = await textStyleSample(page);

    expect(sample).not.toBeNull();
    expect(sample?.text).toBe("Organization label with long text that is fully available here.");
    expect(sample?.width).toBeGreaterThan(40);
    expect(sample?.width).toBeLessThanOrEqual(192);
    expect(sample?.height).toBeGreaterThan(12);
    expect(sample?.leftInset).toBeGreaterThanOrEqual(16);
    expect(sample?.rightInset).toBeGreaterThanOrEqual(16);
    expect(sample?.fontFamily).toContain("Inter");
    expect(sample?.fontFamily).toContain("system-ui");
    expect(sample?.fontSize).toBe("13px");
    expect(sample?.fontWeight).toBe("600");
    expect(sample?.lineHeight).toBe("17.55px");
    expect(sample?.letterSpacing).toBe("normal");
    expect(sample?.textTransform).toBe("none");
    expect(sample?.color).toBe("rgb(255, 255, 255)");
    expect(sample?.backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });

  test("mobile and rtl keep tooltip disclosure typography readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Tooltip Text Style Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(1);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const sample = await textStyleSample(page);
    expect(sample).not.toBeNull();
    expect(sample?.width).toBeLessThanOrEqual(192);
    expect(sample?.leftInset).toBeGreaterThanOrEqual(16);
    expect(sample?.rightInset).toBeGreaterThanOrEqual(16);
    expect(sample?.fontSize).toBe("13px");
    expect(sample?.fontWeight).toBe("600");

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
