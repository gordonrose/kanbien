import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/index-nav-item-surface";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function tokenCards(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("[data-token-variant-id]")).map((element) => {
      const card = element as HTMLElement;
      const preview = card.querySelector(".token-spec-surface-card-preview") as HTMLElement | null;
      return {
        id: card.dataset.tokenVariantId,
        text: card.textContent ?? "",
        previewBackground: preview?.dataset.tokenPreviewBackground ?? "",
        previewForeground: preview?.dataset.tokenPreviewForeground ?? "",
        previewBorder: preview?.dataset.tokenPreviewBorder ?? "",
      };
    });
  });
}

test.describe("index nav item surface token route", () => {
  test("desktop renders state variants with source and usage evidence", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Surface Tokens", level: 1 })).toBeVisible();
    await expect(page.locator("[data-token-variant-id]")).toHaveCount(12);
    await expect(page.getByText("Current and disabled visual states must be paired with programmatic semantics")).toBeVisible();
    await expect(page.getByText("--primary-tinted-background-original")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);

    const cards = await tokenCards(page);
    expect(cards.find((card) => card.id === "index-nav-item-surface-current-original")).toMatchObject({
      previewBackground: "color-mix(in srgb, #635bff 12%, white)",
      previewForeground: "color-mix(in srgb, #635bff 48%, #111827)",
    });
    expect(cards.find((card) => card.id === "index-nav-item-surface-disabled-dark")?.text).toContain("disabled");
  });

  test("mobile keeps token cards readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Index Nav Item Surface Tokens", level: 1 })).toBeVisible();
    await expect(page.locator("[data-token-variant-id]")).toHaveCount(12);
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await expect(page.getByText("--index-nav-item-surface-current-desert")).toBeVisible();
  });
});
