import { expect, test, type Page } from "@playwright/test";

const route = "/design-system/default/tokens/choice-card-state-affordance";

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function previewGeometry(page: Page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll(".token-spec-choice-affordance-preview")).map((preview) => {
      if (!(preview instanceof HTMLElement)) {
        return { columns: 0, minHeight: 0 };
      }

      const styles = getComputedStyle(preview);
      return {
        columns: styles.gridTemplateColumns.split(" ").filter(Boolean).length,
        minHeight: preview.getBoundingClientRect().height,
      };
    });
  });
}

async function previewGlyphSemantics(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".token-spec-choice-affordance-glyph"))
      .slice(0, 4)
      .map((glyph) => (glyph instanceof HTMLElement ? glyph.dataset.tokenChoiceAffordanceGlyphSemantic : "")),
  );
}

async function previewTextLines(page: Page) {
  return page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        ".token-spec-choice-affordance-preview strong, .token-spec-choice-affordance-state",
      ),
    ).map((text) => {
      if (!(text instanceof HTMLElement)) {
        return 0;
      }
      const styles = getComputedStyle(text);
      const lineHeight = Number.parseFloat(styles.lineHeight) || text.getBoundingClientRect().height;
      return Math.round(text.getBoundingClientRect().height / lineHeight);
    }),
  );
}

async function firstOverflowingPreviewIndex(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".token-spec-choice-affordance-preview")).findIndex(
      (preview) => preview instanceof HTMLElement && preview.dataset.tokenChoiceAffordanceOverflow === "true",
    ),
  );
}

test.describe("choice card state affordance token route", () => {
  test("renders visible, hidden, priority selected, and not-on affordances", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Choice Card State Affordance Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--choice-card-state-affordance-visible-original")).toBeVisible();
    await expect(page.getByText("--choice-card-state-affordance-hidden-original")).toBeVisible();
    await expect(page.getByText("--choice-card-state-affordance-priority-selected-original")).toBeVisible();
    await expect(page.getByText("--choice-card-state-affordance-priority-not-on-original")).toBeVisible();
    await expect(page.getByText("visible-hidden").first()).toBeVisible();
    await expect(page.getByText("priority").first()).toBeVisible();
    await expect(page.getByText("State communication must remain color-independent").first()).toBeVisible();
    await expect.poll(() => previewGlyphSemantics(page)).toEqual([
      "visibility-on",
      "visibility-off",
      "selected-check",
      "not-selected-x",
    ]);
    await expect(page.locator(".token-spec-choice-affordance-glyph svg")).toHaveCount(12);
    await expect.poll(() => previewGeometry(page)).toContainEqual(expect.objectContaining({ columns: 3 }));
    await expect.poll(() => previewTextLines(page)).not.toContain(2);
    const overflowIndex = await firstOverflowingPreviewIndex(page);
    expect(overflowIndex).toBeGreaterThanOrEqual(0);
    await page.locator(".token-spec-choice-affordance-preview").nth(overflowIndex).hover();
    await expect(page.locator(".token-spec-choice-affordance-tooltip").nth(overflowIndex)).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });

  test("keeps mobile proof readable without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    await expect(page.getByRole("heading", { name: "Choice Card State Affordance Token", level: 1 })).toBeVisible();
    await expect(page.getByText("--choice-card-state-affordance-priority-not-on-desert")).toBeVisible();
    await expect.poll(() => horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});
