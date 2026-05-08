import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const canonicalStates = Array.from({ length: 24 }, (_, index) => {
  const refNumber = String(index + 1).padStart(3, "0");
  return {
    refId: `FTH-R-${refNumber}`,
    route: `/design-system/canonical-renderings/floating-tab-header/FTH-R-${refNumber}`,
  };
});

async function gotoFloatingTabCanonical(page: Page, route: string, width = 1440) {
  await page.setViewportSize({
    width: Math.max(width + 260, 760),
    height: 980,
  });
  await page.goto(route);
  await page.locator('#floating-tab-preview-frame[data-render-status="ready"]').waitFor({ state: "visible" });
}

async function boxFor(page: Page, selector: string) {
  return page.locator(selector).first().boundingBox();
}

test.describe("design-system floating tab header canonical states", () => {
  test("launcher exposes the full generated FTH reference set", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/floating-tab-header");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(24);
    await expect(page.getByRole("link", { name: /FTH-R-001 Roomy five-tab horizontal baseline/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/floating-tab-header/FTH-R-001",
    );
    await expect(page.getByRole("link", { name: /FTH-R-024 Vertical attention hover and clipping review/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/floating-tab-header/FTH-R-024",
    );
  });

  test("launcher cards open the dedicated canonical rendering surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/floating-tab-header");

    await page.getByRole("link", { name: /FTH-R-008 Category drawer open/i }).click();

    await expectRouteSurfaceTruth(page, {
      expectedPath: "/design-system/canonical-renderings/floating-tab-header/FTH-R-008",
      surfaceLocator: "#floating-tab-preview-frame",
      waitForReadyLocator: '#floating-tab-preview-frame[data-render-status="ready"]',
      bodyAttribute: { name: "data-floating-tab-header-surface", value: "canonical" },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#floating-tab-canonical-current")).toContainText("FTH-R-008");
    await expect(page.locator("#floating-tab-category-drawer")).toBeVisible();
  });

  for (const scenario of canonicalStates) {
    test(`${scenario.refId} renders on the dedicated canonical surface`, async ({ page }) => {
      await gotoFloatingTabCanonical(page, scenario.route);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#floating-tab-preview-frame",
        waitForReadyLocator: '#floating-tab-preview-frame[data-render-status="ready"]',
        bodyAttribute: { name: "data-floating-tab-header-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });
      await expect(page.locator("#floating-tab-canonical-current")).toContainText(scenario.refId);
    });
  }

  test("overflow summaries are side-aware and arrows match card height", async ({ page }) => {
    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-003");

    await expect(page.locator("#floating-tab-overflow-summary-left")).toBeHidden();
    await expect(page.locator("#floating-tab-overflow-summary-right")).toHaveText("3 more");
    await expect(page.locator("#floating-tab-scroll-right")).toBeVisible();

    const rightArrow = await boxFor(page, "#floating-tab-scroll-right");
    const firstCard = await boxFor(page, ".floating-tab-card:not(.floating-tab-card-overflow-hidden)");
    expect(rightArrow).not.toBeNull();
    expect(firstCard).not.toBeNull();
    expect(Math.abs((rightArrow?.height ?? 0) - (firstCard?.height ?? 0))).toBeLessThanOrEqual(2);

    const scrollbarState = await page.locator("#floating-tab-status-tabs").evaluate((node) => ({
      cssScrollbarWidth: getComputedStyle(node).scrollbarWidth,
      overflowX: getComputedStyle(node).overflowX,
    }));
    expect(scrollbarState.cssScrollbarWidth).toBe("none");
    expect(scrollbarState.overflowX).toBe("auto");

    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-004");
    await expect(page.locator("#floating-tab-overflow-summary-left")).toHaveText("1 more");
    await expect(page.locator("#floating-tab-overflow-summary-right")).toHaveText("3 more");

    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-005");
    await expect(page.locator("#floating-tab-overflow-summary-left")).toHaveText("3 more");
    await expect(page.locator("#floating-tab-overflow-summary-right")).toBeHidden();
    await expect(page.locator("#floating-tab-scroll-right")).toBeDisabled();
  });

  test("collapse hides only content while keeping the navigation header visible", async ({ page }) => {
    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-009");

    await expect(page.locator("#floating-tab-header")).toBeVisible();
    await expect(page.locator("#floating-tab-panel")).toBeHidden();
    await expect(page.locator("#floating-tab-collapsed-summary")).toBeVisible();
    await expect(page.locator("#floating-tab-sub-tabs")).toBeVisible();
  });

  test("vertical attention labels stay inside cards and controls stay grouped", async ({ page }) => {
    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-024", 420);

    const controlState = await page.evaluate(() => {
      const category = document.querySelector("#floating-tab-category-toggle")?.getBoundingClientRect();
      const collapse = document.querySelector("#floating-tab-collapse-toggle")?.getBoundingClientRect();
      return {
        sameColumn: category && collapse ? Math.abs(category.left - collapse.left) <= 2 : false,
        verticalGap: category && collapse ? collapse.top - category.bottom : Number.POSITIVE_INFINITY,
      };
    });
    expect(controlState.sameColumn).toBe(true);
    expect(controlState.verticalGap).toBeGreaterThanOrEqual(6);
    expect(controlState.verticalGap).toBeLessThanOrEqual(12);

    const attentionGeometry = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll(".floating-tab-card"));
      return cards
        .filter((card) => card instanceof HTMLElement && card.dataset.tabAttention === "true")
        .map((card) => {
          const cardBox = card.getBoundingClientRect();
          const label = card.querySelector(".floating-tab-attention-label");
          const labelBox = label?.getBoundingClientRect();
          return {
            labelInside:
              !!labelBox
              && labelBox.top >= cardBox.top
              && labelBox.bottom <= cardBox.bottom
              && labelBox.left >= cardBox.left
              && labelBox.right <= cardBox.right,
          };
        });
    });
    expect(attentionGeometry.length).toBeGreaterThan(0);
    expect(attentionGeometry.every((item) => item.labelInside)).toBe(true);
  });

  test("subtab attention state is visible and scoped below the active tab row", async ({ page }) => {
    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-011");

    await expect(page.locator(".floating-tab-sub-tab[data-sub-tab-attention='true']").first()).toBeVisible();
    await expect(page.locator(".floating-tab-sub-tab[data-sub-tab-attention='true'] em").first()).toBeVisible();

    const subTabPosition = await page.evaluate(() => {
      const headerRow = document.querySelector(".floating-tab-main-row")?.getBoundingClientRect();
      const subTabs = document.querySelector("#floating-tab-sub-tabs")?.getBoundingClientRect();
      return headerRow && subTabs ? subTabs.top >= headerRow.bottom : false;
    });
    expect(subTabPosition).toBe(true);
  });

  test("truncated labels expose shared tooltip data without native title attributes", async ({ page }) => {
    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-020");

    const tooltipState = await page.evaluate(() => {
      const tooltipAnchors = Array.from(document.querySelectorAll(".floating-tab-card-title[data-tooltip], .floating-tab-card-meta[data-tooltip]"));
      const nativeTitles = Array.from(document.querySelectorAll(".floating-tab-card-title[title], .floating-tab-card-meta[title]"));
      return {
        tooltipCount: tooltipAnchors.length,
        nativeTitleCount: nativeTitles.length,
      };
    });
    expect(tooltipState.tooltipCount).toBeGreaterThan(0);
    expect(tooltipState.nativeTitleCount).toBe(0);
  });

  test("direction, theme, and zoom stay scoped to the canonical specimen", async ({ page }) => {
    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-016");

    const rtlScope = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      frameDir: document.querySelector("#floating-tab-preview-frame")?.getAttribute("dir"),
    }));
    expect(rtlScope.documentDir).not.toBe("rtl");
    expect(rtlScope.frameDir).toBe("rtl");

    await gotoFloatingTabCanonical(page, "/design-system/canonical-renderings/floating-tab-header/FTH-R-014");

    const themeScope = await page.evaluate(() => ({
      documentTheme: document.documentElement.dataset.theme ?? "",
      frameTheme: document.querySelector("#floating-tab-preview-frame")?.getAttribute("data-theme-scope"),
    }));
    expect(themeScope.documentTheme).toBe("");
    expect(themeScope.frameTheme).toBe("dark");
  });
});
