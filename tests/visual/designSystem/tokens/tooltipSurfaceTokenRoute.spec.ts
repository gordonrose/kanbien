import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/tooltip-surface";

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

async function tooltipSamples(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".token-spec-tooltip-sample")).map((element) => {
      const sample = element as HTMLElement;
      const preview = sample.closest(".token-spec-tooltip-preview") as HTMLElement | null;
      const rect = sample.getBoundingClientRect();
      const previewRect = preview?.getBoundingClientRect();
      const style = getComputedStyle(sample);

      return {
        text: sample.textContent?.trim() ?? "",
        width: rect.width,
        height: rect.height,
        previewWidth: previewRect?.width ?? 0,
        leftInset: previewRect ? rect.left - previewRect.left : 0,
        rightInset: previewRect ? previewRect.right - rect.right : 0,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        boxShadow: style.boxShadow,
        borderRadius: style.borderRadius,
        paddingInlineStart: style.paddingInlineStart,
        paddingInlineEnd: style.paddingInlineEnd,
      };
    });
  });
}

test.describe("tooltip surface token route", () => {
  test("desktop renders readable governed tooltip surfaces without approving behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Tooltip Surface Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect(page.getByText("Behavior and placement are not approved here.")).toBeVisible();
    await expect(
      page.getByText("Consumers must not treat this token as trigger behavior, hover/focus handling"),
    ).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const samples = await tooltipSamples(page);

    expect(samples).toHaveLength(3);
    for (const sample of samples) {
      expect(sample.text).toBe("Organization label with long text that is fully available here.");
      expect(sample.width).toBeGreaterThan(140);
      expect(sample.width).toBeLessThanOrEqual(288);
      expect(sample.height).toBeGreaterThan(30);
      expect(sample.leftInset).toBeGreaterThanOrEqual(16);
      expect(sample.rightInset).toBeGreaterThanOrEqual(16);
      expect(sample.color).not.toBe("rgba(0, 0, 0, 0)");
      expect(sample.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      expect(sample.borderColor).not.toBe("rgba(0, 0, 0, 0)");
      expect(sample.boxShadow).not.toBe("none");
      expect(sample.borderRadius).toBe("6px");
      expect(sample.paddingInlineStart).toBe("9.6px");
      expect(sample.paddingInlineEnd).toBe("9.6px");
    }
  });

  test("mobile and rtl keep tooltip surface samples contained and navigation operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Tooltip Surface Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const samples = await tooltipSamples(page);
    expect(samples).toHaveLength(3);
    for (const sample of samples) {
      expect(sample.width).toBeLessThanOrEqual(288);
      expect(sample.leftInset).toBeGreaterThanOrEqual(16);
      expect(sample.rightInset).toBeGreaterThanOrEqual(16);
    }

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
