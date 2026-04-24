import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";
import { expectCanonicalOverlayContainedInRenderSurface } from "../../support/helpers/canonicalOverlayGuards";

const timePickerCanonicalStates = [
  {
    refId: "TPR-001",
    label: "standalone resting trigger with closed panel",
    route: "/design-system/canonical-renderings/time-picker/TPR-001",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-002",
    label: "standalone picker open with hour and minute columns",
    route: "/design-system/canonical-renderings/time-picker/TPR-002",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-003",
    label: "standalone quick-pick completion with close and focus return",
    route: "/design-system/canonical-renderings/time-picker/TPR-003",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-004",
    label: "nested time picker open inside date range with time",
    route: "/design-system/canonical-renderings/time-picker/TPR-004",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-005",
    label: "nested minute completion with composed outer-label sync",
    route: "/design-system/canonical-renderings/time-picker/TPR-005",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-006",
    label: "mobile standalone open overlay",
    route: "/design-system/canonical-renderings/time-picker/TPR-006",
    viewport: { width: 430, height: 1400 },
  },
  {
    refId: "TPR-007",
    label: "rtl mobile open overlay",
    route: "/design-system/canonical-renderings/time-picker/TPR-007",
    viewport: { width: 430, height: 1400 },
  },
  {
    refId: "TPR-008",
    label: "dark-theme standalone open-state review",
    route: "/design-system/canonical-renderings/time-picker/TPR-008",
    viewport: { width: 1600, height: 1400 },
  },
  {
    refId: "TPR-009",
    label: "rtl and magnified open-state review",
    route: "/design-system/canonical-renderings/time-picker/TPR-009",
    viewport: { width: 1600, height: 1400 },
  },
] as const;

async function gotoCanonicalState(page: Page, route: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(route);
  await page.locator('#time-picker-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system time picker canonical states", () => {
  test("launcher exposes the full TPR set", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/time-picker");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(9);
    await expect(page.getByRole("link", { name: /TPR-002 Standalone picker open with hour and minute columns/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/time-picker/TPR-002",
    );
    await expect(page.getByRole("link", { name: /TPR-004 Nested time picker open inside date range with time/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/time-picker/TPR-004",
    );
    await expect(page.getByRole("link", { name: /TPR-006 Mobile standalone open overlay/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/time-picker/TPR-006",
    );
    await expect(page.getByRole("link", { name: /TPR-008 Dark-theme standalone open-state review/i })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/time-picker/TPR-008",
    );
  });

  test("launcher cards open the dedicated canonical rendering surface", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1400 });
    await page.goto("/design-system/canonical-renderings/time-picker");

    await page.getByRole("link", { name: /TPR-004 Nested time picker open inside date range with time/i }).click();

    await expectRouteSurfaceTruth(page, {
      expectedPath: "/design-system/canonical-renderings/time-picker/TPR-004",
      surfaceLocator: "#time-picker-preview-shell",
      waitForReadyLocator: '#time-picker-preview-shell[data-render-status="ready"]',
      bodyAttribute: { name: "data-time-picker-surface", value: "canonical" },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#time-picker-canonical-current")).toContainText("TPR-004");
    await expect(page.locator("#time-picker-range-host-panel")).toBeVisible();
    await expect(page.locator("#time-picker-nested-root [data-form-time-panel]")).toBeVisible();
  });

  for (const scenario of timePickerCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route, scenario.viewport);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#time-picker-preview-shell",
        waitForReadyLocator: '#time-picker-preview-shell[data-render-status="ready"]',
        bodyAttribute: { name: "data-time-picker-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });
      await expect(page.locator("#time-picker-preview-shell")).toHaveAttribute(
        "dir",
        scenario.refId === "TPR-007" || scenario.refId === "TPR-009" ? "rtl" : "ltr",
      );
    });
  }

  test("priority canonical states are true on first load", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/time-picker/TPR-004",
      { width: 1600, height: 1400 },
    );

    const standaloneRoot = page.locator("#time-picker-standalone-root");
    const standalonePanel = standaloneRoot.locator("[data-form-time-panel]");
    const rangeTimePanel = page.locator("#time-picker-range-host-panel");
    const nestedStartTimeRoot = page.locator("#time-picker-nested-root");
    const nestedStartTimePanel = nestedStartTimeRoot.locator("[data-form-time-panel]");

    await expect(rangeTimePanel).toBeVisible();
    await expect(nestedStartTimePanel).toBeVisible();
    await expect(standalonePanel).toBeHidden();

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/time-picker/TPR-006",
      { width: 430, height: 1400 },
    );

    await expect(standalonePanel).toBeVisible();
    await expectCanonicalOverlayContainedInRenderSurface(page, {
      label: "TPR-006 mobile time-picker overlay",
      overlay: standalonePanel,
      panel: standalonePanel,
      hostSurface: "#time-picker-preview-shell",
      renderFrame: "#time-picker-preview-frame",
      requirePanelWidthWithinHost: true,
    });

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/time-picker/TPR-008",
      { width: 1600, height: 1400 },
    );

    await expect(page.locator("#time-picker-preview-frame")).toHaveAttribute("data-theme-scope", "dark");
    await expect(standalonePanel).toBeVisible();
    await expect(standaloneRoot.locator('[data-form-time-hour="09"]')).toBeVisible();
    await expect(standaloneRoot.locator('[data-form-time-minute="30"]')).toBeVisible();
  });

  test("desktop and nested open time-picker states reserve enough field space for visible panels", async ({ page }) => {
    for (const referenceId of ["TPR-002", "TPR-004", "TPR-008", "TPR-009"] as const) {
      await gotoCanonicalState(page, `/design-system/canonical-renderings/time-picker/${referenceId}`, { width: 1600, height: 1400 });

      const reserve = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("#time-picker-preview-shell .form-field"))
          .map((field) => field instanceof HTMLElement ? field.style.getPropertyValue("--canonical-field-reserve") : "")
          .find((value) => value !== "") ?? "";
      });

      expect(reserve, `${referenceId} should reserve field space for its visible time panel`).not.toBe("");
      const visiblePanel = page.locator("[data-form-time-panel]:not(.hidden)").first();
      await expectCanonicalOverlayContainedInRenderSurface(page, {
        label: `${referenceId} visible time-picker panel`,
        overlay: visiblePanel,
        panel: visiblePanel,
        hostSurface: "#time-picker-preview-shell",
        renderFrame: "#time-picker-preview-frame",
      });
    }
  });

  test("TPR-006 and TPR-007 keep the mobile overlay local to the dedicated canonical frame", async ({ page }) => {
    for (const route of [
      "/design-system/canonical-renderings/time-picker/TPR-006",
      "/design-system/canonical-renderings/time-picker/TPR-007",
    ]) {
      await gotoCanonicalState(page, route, { width: 430, height: 1400 });

      const visiblePanel = page.locator("#time-picker-standalone-root [data-form-time-panel]");
      await expectCanonicalOverlayContainedInRenderSurface(page, {
        label: "visible mobile time-picker panel",
        overlay: visiblePanel,
        panel: visiblePanel,
        hostSurface: "#time-picker-preview-shell",
        renderFrame: "#time-picker-preview-frame",
        requirePanelWidthWithinHost: true,
      });
    }
  });

  test("TPR-008 and TPR-009 scope theme, direction, and magnification to the render surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/time-picker/TPR-008",
      { width: 1600, height: 1400 },
    );

    const darkThemeState = await page.evaluate(() => {
      const frame = document.querySelector("#time-picker-preview-frame");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        frameTheme: frame instanceof HTMLElement ? frame.dataset.themeScope ?? "" : "",
      };
    });

    expect(darkThemeState.documentTheme).toBe("");
    expect(darkThemeState.frameTheme).toBe("dark");

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/time-picker/TPR-009",
      { width: 1600, height: 1400 },
    );

    const scopedReviewState = await page.evaluate(() => {
      const shell = document.querySelector("#time-picker-preview-shell");
      const searchInput = document.querySelector(".search-input");
      return {
        documentDir: document.documentElement.getAttribute("dir"),
        shellDir: shell instanceof HTMLElement ? shell.getAttribute("dir") : null,
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        shellScale: shell instanceof HTMLElement ? shell.style.getPropertyValue("--ui-scale") : "",
        searchInputFontSize: searchInput ? window.getComputedStyle(searchInput).fontSize : null,
      };
    });

    expect(scopedReviewState.documentDir).not.toBe("rtl");
    expect(scopedReviewState.shellDir).toBe("rtl");
    expect(scopedReviewState.documentScale).toBe("");
    expect(scopedReviewState.shellScale).toBe("1.5");
    expect(scopedReviewState.searchInputFontSize).toBe("16px");
  });
});
