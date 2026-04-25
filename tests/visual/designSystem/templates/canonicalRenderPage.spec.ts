import { expect, test } from "@playwright/test";

test.describe("design-system canonical render page template", () => {
  test("render drawer exposes five governed pattern options", async ({ page }) => {
    await page.goto("/design-system/templates/canonical-render-page");
    await page.locator("#render-settings-button").click();

    const patternSelect = page.locator("#render-settings-pattern");
    await expect(patternSelect).toBeVisible();

    const optionLabels = await patternSelect.locator("option").evaluateAll((nodes) =>
      nodes.map((node) => ({
        value: node.getAttribute("value"),
        label: node.textContent?.trim() ?? "",
      })),
    );

    expect(optionLabels).toEqual([
      { value: "sub-nav-row", label: "Sub-Nav Row" },
      { value: "breadcrumb", label: "Breadcrumb" },
      { value: "search-shell", label: "Search Shell" },
      { value: "list-record-card", label: "List Record Card" },
      { value: "list-detail-panel", label: "List Detail Panel" },
    ]);
  });

  test("changing the pattern selector repopulates the specimen lane", async ({ page }) => {
    await page.goto("/design-system/templates/canonical-render-page");
    await page.locator("#render-settings-button").click();
    await page.locator("#render-settings-pattern").evaluate((node) => {
      if (!(node instanceof HTMLSelectElement)) {
        return;
      }

      node.value = "list-detail-panel";
      node.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await expect(page.locator("#canonical-render-template-list-detail-panel-visual")).toBeVisible();
    await expect(page.locator("#crt-list-detail-panel-title")).toHaveText("Renewal strategy workspace");
    await expect(page.locator("#canonical-render-template-meta-specimen")).toContainText("List Detail Panel Review");

    await page.locator("#render-settings-pattern").evaluate((node) => {
      if (!(node instanceof HTMLSelectElement)) {
        return;
      }

      node.value = "breadcrumb";
      node.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await expect(page.locator("#canonical-render-template-sub-nav-visual")).toBeVisible();
    await expect(page.locator("#crt-sub-nav-breadcrumb-nav")).toBeVisible();
    await expect(page.locator("#crt-sub-nav-search-shell")).toBeHidden();
    await expect(page.locator("#crt-sub-nav-current-label")).toHaveText("Breadcrumb");
    await expect(page.locator("#canonical-render-template-meta-specimen")).toContainText("Breadcrumb Review");
  });

  test("render theme controls only theme the specimen lane, not the page chrome", async ({ page }) => {
    await page.goto("/design-system/templates/canonical-render-page");
    await page.locator("#render-settings-button").click();

    for (const theme of ["dark", "desert"]) {
      await page.locator(`[data-render-theme-option="${theme}"]`).click();

      const themeState = await page.evaluate(() => {
        const shell = document.getElementById("canonical-render-template-preview-shell");
        return {
          documentTheme: document.documentElement.dataset.theme ?? "",
          topNavTheme: document.querySelector(".design-system-shell > .top-nav")?.closest("[data-theme-scope]")?.getAttribute("data-theme-scope") ?? "",
          introTheme: document.querySelector(".canonical-render-intro")?.closest("[data-theme-scope]")?.getAttribute("data-theme-scope") ?? "",
          shellTheme: shell instanceof HTMLElement ? shell.dataset.themeScope ?? "" : "",
        };
      });

      expect(themeState.documentTheme).not.toBe(theme);
      expect(themeState.topNavTheme).toBe("");
      expect(themeState.introTheme).toBe("");
      expect(themeState.shellTheme).toBe(theme);
    }
  });
});
