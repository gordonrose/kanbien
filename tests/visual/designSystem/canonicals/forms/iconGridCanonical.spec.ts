import { expect, test, type Page } from "@playwright/test";

const iconGridCanonicalStates = [
  {
    refId: "IGR-001",
    label: "resting trigger with default governed selection",
    route: "/design-system/canonical-renderings/icon-grid/IGR-001",
  },
  {
    refId: "IGR-002",
    label: "open modal with the full approved icon catalog",
    route: "/design-system/canonical-renderings/icon-grid/IGR-002",
  },
  {
    refId: "IGR-003",
    label: "open modal narrowed to one search match",
    route: "/design-system/canonical-renderings/icon-grid/IGR-003",
  },
  {
    refId: "IGR-004",
    label: "trigger after choosing a different icon",
    route: "/design-system/canonical-renderings/icon-grid/IGR-004",
  },
  {
    refId: "IGR-005",
    label: "rtl open review with the same dense tooltip-first catalog",
    route: "/design-system/canonical-renderings/icon-grid/IGR-005",
  },
  {
    refId: "IGR-006",
    label: "dark mobile open review with user-role search narrowing",
    route: "/design-system/canonical-renderings/icon-grid/IGR-006",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  const resolvedRoute = new URL(route, "http://localhost");
  const requestedWidth = Number.parseInt(resolvedRoute.searchParams.get("width") ?? "0", 10);
  const viewportWidth = Math.max(requestedWidth + 360, 1280);

  await page.setViewportSize({
    width: viewportWidth,
    height: 1400,
  });
  await page.goto(route);
  await page.locator('#icon-grid-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system icon-grid canonical states", () => {
  test("launcher exposes the full IGR set on the dedicated child family", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/icon-grid");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(6);

    const launcherHrefs = await launcherButtons.evaluateAll((nodes) =>
      nodes.map((node) => (node instanceof HTMLAnchorElement ? node.getAttribute("href") : "")),
    );

    for (const href of launcherHrefs) {
      expect(href).toContain("/design-system/canonical-renderings/icon-grid/");
    }

    await expect(page.getByRole("link", { name: /IGR-002 Open modal with the full approved icon catalog/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /IGR-003 Open modal narrowed to one search match/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /IGR-006 Dark mobile open review with user-role search narrowing/i })).toBeVisible();
  });

  for (const scenario of iconGridCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-icon-grid-surface", "canonical");
      await expect(page.locator("#icon-grid-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#icon-grid-preview-trigger")).toBeVisible();
    });
  }

  test("IGR-002 opens the full icon catalog on the dedicated child route", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-002",
    );

    await expect(page.locator("[data-form-icon-grid-panel]")).toBeVisible();
    await expect(page.locator("[data-form-icon-grid-option]")).toHaveCount(60);
    await expect(page.locator("[data-form-icon-grid-empty]")).toBeHidden();
    await expect(page.locator("[data-form-icon-grid-search]")).toBeFocused();
  });

  test("IGR-002 keeps the search field and icon matrix stacked as one readable modal layout", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-002",
    );

    const layoutState = await page.evaluate(() => {
      const panel = document.querySelector<HTMLElement>(".form-icon-grid-panel");
      const header = document.querySelector<HTMLElement>(".form-icon-grid-header");
      const searchShell = document.querySelector<HTMLElement>(".form-icon-grid-search-shell");
      const optionList = document.querySelector<HTMLElement>(".form-icon-grid-option-list");
      const options = Array.from(document.querySelectorAll<HTMLElement>("[data-form-icon-grid-option]"));

      if (!panel || !header || !searchShell || !optionList || options.length === 0) {
        return null;
      }

      const panelRect = panel.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const searchRect = searchShell.getBoundingClientRect();
      const optionListRect = optionList.getBoundingClientRect();
      const firstRowTop = Math.round(options[0].getBoundingClientRect().top);
      const firstRowCount = options.filter((option) => Math.abs(Math.round(option.getBoundingClientRect().top) - firstRowTop) <= 1).length;
      const panelStyles = window.getComputedStyle(panel);
      const optionListStyles = window.getComputedStyle(optionList);

      return {
        headerBottom: headerRect.bottom,
        searchTop: searchRect.top,
        searchLeftInset: Math.round(searchRect.left - panelRect.left),
        searchRightInset: Math.round(panelRect.right - searchRect.right),
        optionListTop: optionListRect.top,
        optionListBottom: optionListRect.bottom,
        panelBottom: panelRect.bottom,
        optionListLeftInset: Math.round(optionListRect.left - panelRect.left),
        optionListRightInset: Math.round(panelRect.right - optionListRect.right),
        firstRowCount,
        panelOverflowY: panelStyles.overflowY,
        optionListOverflowY: optionListStyles.overflowY,
        optionListClientHeight: optionList.clientHeight,
        optionListScrollHeight: optionList.scrollHeight,
      };
    });

    expect(layoutState).not.toBeNull();
    expect((layoutState?.searchTop ?? 0) - (layoutState?.headerBottom ?? 0)).toBeGreaterThanOrEqual(8);
    expect((layoutState?.optionListTop ?? 0) - (layoutState?.searchTop ?? 0)).toBeGreaterThanOrEqual(56);
    expect(layoutState?.searchLeftInset ?? 999).toBeLessThanOrEqual(20);
    expect(layoutState?.searchRightInset ?? 999).toBeLessThanOrEqual(20);
    expect(layoutState?.optionListLeftInset ?? 999).toBeLessThanOrEqual(20);
    expect(layoutState?.optionListRightInset ?? 999).toBeLessThanOrEqual(20);
    expect(layoutState?.firstRowCount ?? 0).toBeGreaterThanOrEqual(5);
    expect(layoutState?.panelOverflowY).toBe("hidden");
    expect(layoutState?.optionListOverflowY).toBe("auto");
    expect(layoutState?.optionListScrollHeight ?? 0).toBeGreaterThanOrEqual(layoutState?.optionListClientHeight ?? 0);
    expect((layoutState?.panelBottom ?? 0) - (layoutState?.optionListBottom ?? 0)).toBeGreaterThanOrEqual(0);
  });

  test("IGR-003 and IGR-004 keep filtering and selected-trigger sync truthful", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-003",
    );

    await expect(page.locator("[data-form-icon-grid-panel]")).toBeVisible();
    await expect(page.locator("[data-form-icon-grid-search]")).toHaveValue("leader");
    await expect(page.locator("[data-form-icon-grid-option]")).toHaveCount(1);
    await expect(page.locator("[data-form-icon-grid-option='leader']")).toHaveAttribute("aria-label", /Leader/);

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-004",
    );

    await expect(page.locator("[data-form-icon-grid-panel]")).toBeHidden();
    await expect(page.locator("[data-form-icon-grid-value]")).toHaveValue("administrator");
    await expect(page.locator("[data-form-icon-grid-current-label]")).toHaveText("Administrator");
  });

  test("IGR-003 keeps the modal overlay inside the canonical render area", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-003",
    );

    const containmentState = await page.evaluate(() => {
      const intro = document.querySelector<HTMLElement>(".canonical-render-intro");
      const frame = document.querySelector<HTMLElement>("#icon-grid-preview-frame");
      const shell = document.querySelector<HTMLElement>("#icon-grid-preview-shell");
      const modal = document.querySelector<HTMLElement>(".form-icon-grid-modal:not(.hidden)");
      const panel = document.querySelector<HTMLElement>(".form-icon-grid-panel");

      if (!intro || !frame || !shell || !modal || !panel) {
        return null;
      }

      const introRect = intro.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const shellRect = shell.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      return {
        introBottom: introRect.bottom,
        frameTop: frameRect.top,
        frameBottom: frameRect.bottom,
        shellTop: shellRect.top,
        shellBottom: shellRect.bottom,
        modalTop: modalRect.top,
        modalBottom: modalRect.bottom,
        panelTop: panelRect.top,
        panelBottom: panelRect.bottom,
      };
    });

    expect(containmentState).not.toBeNull();
    expect(containmentState?.modalTop ?? 0).toBeGreaterThanOrEqual((containmentState?.shellTop ?? 0) - 1);
    expect(containmentState?.modalBottom ?? 0).toBeLessThanOrEqual((containmentState?.shellBottom ?? 0) + 1);
    expect(containmentState?.panelTop ?? 0).toBeGreaterThanOrEqual((containmentState?.frameTop ?? 0) - 1);
    expect(containmentState?.panelBottom ?? 0).toBeLessThanOrEqual((containmentState?.frameBottom ?? 0) + 1);
    expect(containmentState?.panelTop ?? 0).toBeGreaterThan(containmentState?.introBottom ?? 0);
  });

  test("IGR-005 and IGR-006 scope rtl and compact dark stress to the child route", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-005",
    );

    await expect(page.locator("#icon-grid-preview-shell")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-form-icon-grid-panel]")).toBeVisible();

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/icon-grid/IGR-006",
    );

    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
    await expect(page.locator("#icon-grid-preview-frame")).toHaveAttribute("data-theme-scope", "dark");
    await expect(page.locator("#icon-grid-preview-shell")).toHaveAttribute("data-form-mobile-view", "true");
    await expect(page.locator("[data-form-icon-grid-panel]")).toBeVisible();
    await expect(page.locator(".form-icon-grid-panel h2")).toHaveCSS("color", "rgb(236, 240, 255)");
    await expect(page.locator("[data-form-icon-grid-search]")).toHaveValue("user");
    await expect(page.locator("[data-form-icon-grid-option]")).toHaveCount(6);
  });
});
