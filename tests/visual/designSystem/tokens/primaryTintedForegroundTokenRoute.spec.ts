import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/primary-tinted-foreground";

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

async function textSampleGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".token-spec-text-sample")).map((element) => {
      const sample = element as HTMLElement;
      const rect = sample.getBoundingClientRect();
      const style = getComputedStyle(sample);

      return {
        text: sample.textContent?.trim() ?? "",
        width: rect.width,
        height: rect.height,
        color: style.color,
        backgroundColor: style.backgroundColor,
      };
    });
  });
}

async function pairingRows(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-token-variant-id]")).map((card) => {
      const id = card.getAttribute("data-token-variant-id") ?? "";
      const text = card.textContent ?? "";

      return {
        id,
        hasBackgroundToken: text.includes("--primary-tinted-background-"),
        hasSourceToken: text.includes("--primary-color-source-"),
        hasFormula: text.includes("color-mix(in srgb") && text.includes("<--primary-color-source-"),
        hasForegroundValue:
          text.includes("#111827") ||
          text.includes("#f4f7fb") ||
          text.includes("#493327"),
        deniesStateMeaning: text.includes("selected") && text.includes("validation") && text.includes("link"),
      };
    });
  });
}

async function diagnosticStyles(page: Page) {
  return page.evaluate(() => {
    const source = document.querySelector("[data-token-diagnostic-role='source']");
    const tint = document.querySelector("[data-token-diagnostic-role='primary-tinted-background']");
    const foreground = document.querySelector("[data-token-diagnostic-role='primary-tinted-foreground']");

    if (!(source instanceof HTMLElement) || !(tint instanceof HTMLElement) || !(foreground instanceof HTMLElement)) {
      return null;
    }

    return {
      sourceBackground: getComputedStyle(source).backgroundColor,
      tintBackground: getComputedStyle(tint).backgroundColor,
      foregroundColor: getComputedStyle(foreground).color,
      foregroundBackground: getComputedStyle(foreground).backgroundColor,
    };
  });
}

test.describe("primary tinted foreground token route", () => {
  test("desktop renders readable foreground samples with background pairing visible", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Primary Tinted Foreground Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect(page.getByText("paired with a primary-tinted background variant")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Temporary primary source override", level: 2 })).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const samples = await textSampleGeometry(page);
    const rows = await pairingRows(page);

    expect(samples).toHaveLength(3);
    for (const sample of samples) {
      expect(sample.text).toBe("Primary label");
      expect(sample.width).toBeGreaterThan(80);
      expect(sample.height).toBeGreaterThanOrEqual(40);
      expect(sample.color).not.toBe("rgba(0, 0, 0, 0)");
    }

    expect(rows).toHaveLength(3);
    for (const row of rows) {
      expect(row.hasSourceToken, row.id).toBe(true);
      expect(row.hasBackgroundToken, row.id).toBe(true);
      expect(row.hasFormula, row.id).toBe(true);
      expect(row.hasForegroundValue, row.id).toBe(true);
      expect(row.deniesStateMeaning, row.id).toBe(true);
    }
  });

  test("temporary upstream HEX override updates rendered foreground chain without mutating signed formulas", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    const input = page.getByLabel("Preview primary HEX");
    const signedForegroundFormula = page
      .locator("[data-token-variant-id='primary-tinted-foreground-original'] .token-spec-definition-grid")
      .getByText("color-mix(in srgb, <--primary-color-source-original> 48%, #111827)")
      .first();
    const initialStyles = await diagnosticStyles(page);

    await expect(input).toHaveValue("#635bff");
    await expect(signedForegroundFormula).toBeVisible();
    expect(initialStyles).not.toBeNull();

    await input.fill("#2f855a");

    await expect(input).toHaveValue("#2f855a");
    await expect(page.getByText("Temporary preview only. Signed token values remain unchanged.")).toBeVisible();
    await expect(signedForegroundFormula).toBeVisible();

    const updatedStyles = await diagnosticStyles(page);

    expect(updatedStyles).not.toBeNull();
    expect(updatedStyles?.sourceBackground).not.toBe(initialStyles?.sourceBackground);
    expect(updatedStyles?.tintBackground).not.toBe(initialStyles?.tintBackground);
    expect(updatedStyles?.foregroundColor).not.toBe(initialStyles?.foregroundColor);
    expect(updatedStyles?.foregroundBackground).not.toBe(initialStyles?.foregroundBackground);

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(input).toHaveValue("#635bff");
    await expect(signedForegroundFormula).toBeVisible();
  });

  test("mobile and rtl keep foreground proof readable and navigation operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });

    await expect(page.getByRole("heading", { name: "Primary Tinted Foreground Tokens", level: 1 })).toBeVisible();
    await expect(page.locator(".token-spec-card")).toHaveCount(3);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect.poll(() => visibleTextOverflow(page)).toEqual([]);

    const mobileNavButton = page.locator(".mobile-nav-button");
    await mobileNavButton.click();
    await expect(mobileNavButton).toHaveAttribute("aria-expanded", "true");
  });
});
