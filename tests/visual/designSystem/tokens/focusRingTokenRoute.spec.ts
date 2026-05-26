import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/focus-ring";

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

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function focusSampleGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".token-spec-focus-sample")).map((element) => {
      const sample = element as HTMLElement;
      const before = sample.getBoundingClientRect();
      const style = getComputedStyle(sample);

      return {
        text: sample.textContent?.trim() ?? "",
        width: before.width,
        height: before.height,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
        outlineOffset: style.outlineOffset,
      };
    });
  });
}

async function focusSourceRows(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-token-variant-id]")).map((card) => {
      const id = card.getAttribute("data-token-variant-id") ?? "";
      const text = card.textContent ?? "";

      return {
        id,
        hasSourceToken: text.includes("--primary-color-source-"),
        hasSourceColor:
          text.includes("#635bff") ||
          text.includes("#8b87ff") ||
          text.includes("#9f5f24"),
      };
    });
  });
}

test.describe("focus ring token route", () => {
  test("desktop renders visible focus-ring samples without layout or text overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Focus Ring Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect(page.getByText("Each row is a reusable visible-focus decision")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const samples = await focusSampleGeometry(page);
    const sourceRows = await focusSourceRows(page);

    expect(samples).toHaveLength(3);
    for (const sample of samples) {
      expect(sample.text).toBe("Focusable control");
      expect(sample.width).toBeGreaterThan(100);
      expect(sample.height).toBeGreaterThanOrEqual(40);
      expect(sample.outlineStyle).not.toBe("none");
      expect(sample.outlineWidth).not.toBe("0px");
      expect(sample.outlineColor).not.toBe("rgba(0, 0, 0, 0)");
      expect(sample.outlineOffset).not.toBe("0px");
    }

    expect(sourceRows).toHaveLength(3);
    for (const row of sourceRows) {
      expect(row.hasSourceToken, row.id).toBe(true);
      expect(row.hasSourceColor, row.id).toBe(true);
    }
  });

  test("mobile and rtl keep focus-ring samples visible and navigation operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Focus Ring Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const samples = await focusSampleGeometry(page);

    expect(samples).toHaveLength(3);
    for (const sample of samples) {
      expect(sample.outlineStyle).not.toBe("none");
      expect(sample.outlineWidth).not.toBe("0px");
      expect(sample.outlineColor).not.toBe("rgba(0, 0, 0, 0)");
    }

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
