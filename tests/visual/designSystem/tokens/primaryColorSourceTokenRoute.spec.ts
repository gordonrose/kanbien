import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/primary-color-source";

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

async function swatchGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".token-spec-swatch")).map((element) => {
      const swatch = element as HTMLElement;
      const rect = swatch.getBoundingClientRect();
      const style = getComputedStyle(swatch);

      return {
        width: rect.width,
        height: rect.height,
        backgroundColor: style.backgroundColor,
      };
    });
  });
}

async function diagnosticStyles(page: Page) {
  return page.evaluate(() => {
    const source = document.querySelector("[data-token-diagnostic-role='source']");
    const subtle = document.querySelector("[data-token-diagnostic-role='subtle']");
    const label = document.querySelector("[data-token-diagnostic-role='label']");
    const ring = document.querySelector("[data-token-diagnostic-role='ring']");

    if (
      !(source instanceof HTMLElement) ||
      !(subtle instanceof HTMLElement) ||
      !(label instanceof HTMLElement) ||
      !(ring instanceof HTMLElement)
    ) {
      return null;
    }

    return {
      sourceBackground: getComputedStyle(source).backgroundColor,
      subtleBackground: getComputedStyle(subtle).backgroundColor,
      labelColor: getComputedStyle(label).color,
      ringOutlineColor: getComputedStyle(ring).outlineColor,
      ringOutlineStyle: getComputedStyle(ring).outlineStyle,
    };
  });
}

test.describe("primary color source token route", () => {
  test("desktop renders source swatches without layout or text overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Primary Color Source Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect(page.getByText("Each row is an approved primary source-color decision")).toBeVisible();
    await expect(page.getByText("source-color readiness is not contrast, focus, or state readiness")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Temporary HEX override", level: 2 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const swatches = await swatchGeometry(page);

    expect(swatches).toHaveLength(3);
    for (const swatch of swatches) {
      expect(swatch.width).toBeGreaterThanOrEqual(80);
      expect(swatch.height).toBeGreaterThanOrEqual(80);
      expect(swatch.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    }
  });

  test("temporary HEX override updates diagnostic previews without changing signed token values", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    const input = page.getByLabel("Preview HEX");
    const signedOriginalValue = page
      .locator("[data-token-variant-id='primary-color-source-original'] .token-spec-definition-grid")
      .getByText("#635bff")
      .first();
    const initialStyles = await diagnosticStyles(page);

    await expect(input).toHaveValue("#635bff");
    await expect(signedOriginalValue).toBeVisible();
    expect(initialStyles).not.toBeNull();

    await input.fill("#2f855a");

    await expect(input).toHaveValue("#2f855a");
    await expect(page.getByText("Temporary preview only. Signed token values remain unchanged.")).toBeVisible();
    await expect(signedOriginalValue).toBeVisible();

    const updatedStyles = await diagnosticStyles(page);

    expect(updatedStyles).not.toBeNull();
    expect(updatedStyles?.sourceBackground).not.toBe(initialStyles?.sourceBackground);
    expect(updatedStyles?.subtleBackground).not.toBe(initialStyles?.subtleBackground);
    expect(updatedStyles?.labelColor).not.toBe(initialStyles?.labelColor);
    expect(updatedStyles?.ringOutlineStyle).not.toBe("none");

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(input).toHaveValue("#635bff");
    await expect(signedOriginalValue).toBeVisible();
  });

  test("mobile and rtl keep source-token proof readable and navigation operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Primary Color Source Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const swatches = await swatchGeometry(page);

    expect(swatches).toHaveLength(3);
    for (const swatch of swatches) {
      expect(swatch.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    }

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
