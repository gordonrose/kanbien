import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { expectCanonicalOverlayContainedInRenderSurface } from "../../support/helpers/canonicalOverlayGuards";
import { expectThemedScopeForegroundContract } from "../../support/helpers/humanReviewGuards";

async function expectDrawerFormOverlayContained(
  page: Parameters<typeof expectCanonicalOverlayContainedInRenderSurface>[0],
  label: string,
  selector: string,
  hostSurface = "[data-drawer-form-preview-frame]",
) {
  await expectCanonicalOverlayContainedInRenderSurface(page, {
    label,
    overlay: selector,
    panel: selector,
    hostSurface,
    renderFrame: hostSurface,
    requirePanelWidthWithinHost: true,
  });
}

async function expectDrawerSelectContainedInDrawerLane(
  page: Parameters<typeof expectCanonicalOverlayContainedInRenderSurface>[0],
  label: string,
) {
  await expectDrawerFormOverlayContained(
    page,
    label,
    "[data-form-drawer-select-panel]",
    "[data-selectable-list-detail-panel]",
  );
}

test.describe("design-system drawer form", () => {
  test("uses the shared list drawer shell instead of reconstructing drawer markup", async ({ page }) => {
    const drawerFormHtml = await readFile("src/frontend/designSystem/components/drawer-form.html", "utf8");
    const listPageHtml = await readFile("src/frontend/designSystem/templates/list-page/index.html", "utf8");

    expect(drawerFormHtml).toContain('data-list-drawer-shell-template="split-layout"');
    expect(drawerFormHtml).toContain("/design-system/assets/listDrawerShell.mjs");
    expect(drawerFormHtml).not.toContain("<aside");
    expect(drawerFormHtml).not.toContain("list-page-detail-header");
    expect(drawerFormHtml).not.toContain("list-page-detail-footer");

    expect(listPageHtml).toContain('data-list-drawer-shell-template="panel"');
    expect(listPageHtml).toContain("/design-system/assets/listDrawerShell.mjs");

    await page.goto("/design-system/templates/list-page");
    await page.locator("[data-selectable-list-card]").first().click();
    await expect(page.locator("[data-selectable-list-detail-panel]")).toHaveAttribute("data-list-drawer-shell-source", "list-drawer-shell");
  });

  test("renders the shared drawer-form seam on its dedicated component surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form/DF-001");

    const drawerForm = page.locator("[data-drawer-form]");
    const previewLayout = page.locator("[data-drawer-form-preview-layout]");

    await expect(drawerForm).toBeVisible();
    await expect(previewLayout).toHaveAttribute("data-drawer-form-canonical-ref", "DF-001");
    await expect(previewLayout).toHaveAttribute("data-list-drawer-shell-source", "list-drawer-shell");
    await expect(page.locator("[data-selectable-list-detail-panel]")).toHaveAttribute("data-list-drawer-shell-source", "list-drawer-shell");
    await expect(page.locator("#drawer-form-canonical-current")).toHaveText("DF-001 - Desktop drawer-hosted form with approved control mix");
    await expect(page.locator("#drawer-form-canonical-match-list")).toHaveText("DF-001 - Desktop drawer-hosted form with approved control mix");
    await expect(page.locator("#drawer-form-canonical-circumstances")).toContainText("1080px review width | LTR | 0% magnification | normal theme");
    await expect(page.locator("#drawer-form-meta-state")).toHaveText("baseline | closed controls");
    await expect(page.locator("#drawer-form-meta-viewport")).toHaveText("Desktop drawer form lane");
    await expect(page.locator("#drawer-form-meta-notes")).toContainText("Baseline drawer-form body");
    await expect(page.locator("#drawer-form-canonical-prev")).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator("#drawer-form-canonical-next")).toHaveAttribute("href", "/design-system/canonical-renderings/drawer-form/DF-004");
    await expect(page.locator("#drawer-form-canonical-next")).toHaveAttribute("aria-disabled", "false");
    await expect(page.locator(".list-page-detail-panel")).toBeInViewport();
    await expect(drawerForm.locator(".drawer-form-section-title")).toHaveText("Primary details");
    await expect(drawerForm.locator(".form-select-trigger")).toHaveText(/Ready for review/);
    await expect(drawerForm.locator(".form-date-trigger")).toHaveText(/May 4, 2026/);
    await expect(drawerForm.locator(".form-time-trigger")).toHaveText(/09:30/);
    await expect(drawerForm.locator("[data-form-drawer-select-option]")).toHaveCount(4);
    await expect(drawerForm.locator('input[type="radio"]')).toHaveCount(2);
    await expect(drawerForm.locator('input[type="checkbox"]')).toHaveCount(3);
    await expect(drawerForm.locator(".form-upload-dropzone")).toBeVisible();

    const specimenGeometry = await page.evaluate(() => {
      const layout = document.querySelector("[data-drawer-form-preview-layout]");
      const list = document.querySelector(".list-page-list-column");
      const panel = document.querySelector(".list-page-detail-panel");
      const form = document.querySelector("[data-drawer-form]");

      if (!layout || !list || !panel || !form) {
        return null;
      }

      const layoutRect = layout.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const formRect = form.getBoundingClientRect();

      return {
        layoutDisplay: getComputedStyle(layout).display,
        listTop: listRect.top,
        panelTop: panelRect.top,
        listWidth: listRect.width,
        panelWidth: panelRect.width,
        formTop: formRect.top,
        layoutBottom: layoutRect.bottom,
      };
    });

    expect(specimenGeometry).not.toBeNull();
    expect(specimenGeometry?.layoutDisplay).toBe("grid");
    expect(Math.abs((specimenGeometry?.listTop ?? 0) - (specimenGeometry?.panelTop ?? 0))).toBeLessThan(2);
    expect(Math.abs((specimenGeometry?.listWidth ?? 0) - (specimenGeometry?.panelWidth ?? 0))).toBeLessThan(2);
    expect(specimenGeometry?.formTop ?? Number.POSITIVE_INFINITY).toBeLessThan(specimenGeometry?.layoutBottom ?? 0);

    await drawerForm.locator(".form-date-trigger").click();
    await expect(drawerForm.locator("[data-form-date-panel]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawerForm.locator("[data-form-date-panel]")).toBeHidden();

    await drawerForm.locator(".form-drawer-select-trigger").click();
    await expect(drawerForm.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expect(drawerForm.locator("[data-form-drawer-select-search]")).toBeFocused();
  });

  test("renders RTL and magnified drawer-form canonical states", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form/DF-004");

    const rtlLayout = page.locator("[data-drawer-form-preview-layout]");
    await expect(rtlLayout).toHaveAttribute("data-drawer-form-canonical-ref", "DF-004");
    await expect(page.locator("html")).not.toHaveAttribute("dir", "rtl");
    await expect(rtlLayout).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-drawer-form]")).toBeVisible();

    const direction = await rtlLayout.evaluate((node) => getComputedStyle(node).direction);
    expect(direction).toBe("rtl");

    const topNavDirection = await page.locator(".design-system-shell > .top-nav").evaluate((node) => getComputedStyle(node).direction);
    expect(topNavDirection).toBe("ltr");

    const rtlSplitState = await page.evaluate(() => {
      const listColumn = document.querySelector("[data-selectable-list-column]");
      const detailPanel = document.querySelector("[data-selectable-list-detail-panel]");
      const rect = (node: Element | null) =>
        node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        listColumn: rect(listColumn),
        detailPanel: rect(detailPanel),
      };
    });

    expect(rtlSplitState.listColumn).not.toBeNull();
    expect(rtlSplitState.detailPanel).not.toBeNull();
    if (rtlSplitState.listColumn && rtlSplitState.detailPanel) {
      expect(rtlSplitState.detailPanel.left).toBeLessThan(rtlSplitState.listColumn.left);
      expect(Math.abs(rtlSplitState.detailPanel.width - rtlSplitState.listColumn.width)).toBeLessThan(2);
    }

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-005");

    const zoomLayout = page.locator("[data-drawer-form-preview-layout]");
    await expect(zoomLayout).toHaveAttribute("data-drawer-form-canonical-ref", "DF-005");

    const scale = await zoomLayout.evaluate((node) => getComputedStyle(node).getPropertyValue("--ui-scale").trim());
    expect(scale).toBe("1.5");
    await expect(page.locator("[data-drawer-form]")).toBeVisible();
  });

  test("renders mobile, disabled, and error drawer-form states", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form/DF-008");

    const mobileLayout = page.locator("[data-drawer-form-preview-layout]");
    await expect(mobileLayout).toHaveAttribute("data-drawer-form-mobile-view", "true");
    await expect(page.locator(".list-page-list-column")).toBeHidden();

    const mobileOverflow = await mobileLayout.evaluate((node) => node.scrollWidth > node.clientWidth + 1);
    expect(mobileOverflow).toBe(false);

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-006");

    const disabledLayout = page.locator("[data-drawer-form-preview-layout]");
    const disabledForm = page.locator("[data-drawer-form]");
    await expect(disabledLayout).toHaveAttribute("data-drawer-form-disabled-mode", "true");
    await expect(disabledForm.locator('input[name="title"]')).toBeDisabled();
    await expect(disabledForm.locator("[data-form-date-button]")).toBeDisabled();
    await expect(page.locator(".list-page-detail-footer button").first()).toBeDisabled();

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-007");

    const errorLayout = page.locator("[data-drawer-form-preview-layout]");
    const errorForm = page.locator("[data-drawer-form]");
    await expect(errorLayout).toHaveAttribute("data-drawer-form-error-mode", "true");
    await expect(errorForm.locator(".drawer-form-status")).toContainText("Validation preview");

    const borderColor = await errorForm.locator('input[name="title"]').evaluate((node) => getComputedStyle(node).borderColor);
    expect(borderColor).not.toBe("rgb(223, 231, 243)");
  });

  test("opens drawer-form canonical overlay states", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form/DF-009");
    await expect(page.locator("[data-form-date-panel]")).toBeVisible();
    await expect(page.locator("[data-form-date-button]")).toHaveAttribute("aria-expanded", "true");
    await expectDrawerFormOverlayContained(page, "DF-009 date picker", "[data-form-date-panel]");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-010");
    await expect(page.locator("[data-form-time-panel]")).toBeVisible();
    await expect(page.locator("[data-form-time-button]")).toHaveAttribute("aria-expanded", "true");
    await expectDrawerFormOverlayContained(page, "DF-010 time picker", "[data-form-time-panel]");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-011");
    await expect(page.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expect(page.locator("[data-form-drawer-select-button]")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-form-drawer-select-search]")).toBeFocused();
    await expectDrawerSelectContainedInDrawerLane(page, "DF-011 drawer select");
  });

  test("covers high-risk combined drawer-form canonical states", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form/DF-012");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-drawer-form-mobile-view", "true");
    await expect(page.locator("[data-form-date-panel]")).toBeVisible();
    await expectDrawerFormOverlayContained(page, "DF-012 mobile date picker", "[data-form-date-panel]");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-013");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-drawer-form-mobile-view", "true");
    await expect(page.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expectDrawerSelectContainedInDrawerLane(page, "DF-013 mobile drawer select");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-014");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("dir", "rtl");
    await expectDrawerSelectContainedInDrawerLane(page, "DF-014 RTL drawer select");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-015");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-form-date-panel]")).toBeVisible();
    await expectDrawerFormOverlayContained(page, "DF-015 RTL date picker", "[data-form-date-panel]");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-016");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-drawer-form-error-mode", "true");
    await expect(page.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expect(page.locator("[data-drawer-form] .drawer-form-status")).toContainText("Validation preview");
    await expectDrawerSelectContainedInDrawerLane(page, "DF-016 error drawer select");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-017");
    await expect(page.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveCSS("--ui-scale", "1.5");
    await expectDrawerSelectContainedInDrawerLane(page, "DF-017 zoom drawer select");

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-018");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-drawer-form-mobile-view", "true");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-drawer-form-error-mode", "true");
  });

  test("covers themed drawer-form canonical states without theming the render-page chrome", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form/DF-019");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".canonical-render-intro")).not.toHaveAttribute("data-theme-scope", "dark");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-theme-scope", "dark");
    await expect(page.locator("[data-drawer-form]")).toBeVisible();

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-020");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "desert");
    await expect(page.locator("[data-drawer-form-preview-layout]")).toHaveAttribute("data-theme-scope", "desert");
    await expect(page.locator("[data-drawer-form]")).toBeVisible();

    await page.goto("/design-system/canonical-renderings/drawer-form/DF-021");
    const themedLayout = page.locator("[data-drawer-form-preview-layout]");
    await expect(themedLayout).toHaveAttribute("data-theme-scope", "dark");
    await expect(page.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expectDrawerSelectContainedInDrawerLane(page, "DF-021 dark drawer select");
    await expectThemedScopeForegroundContract(themedLayout, {
      expectedColor: "rgb(236, 240, 255)",
      label: "dark drawer-form",
      selectors: [
        { selector: ".list-page-detail-title", label: "drawer shell title" },
        { selector: ".drawer-form-section-title", label: "form section title" },
        { selector: "[data-form-drawer-select-panel] h4", label: "nested drawer title" },
        {
          selector: "[data-form-drawer-select-panel] .form-drawer-select-option:not(.active) strong",
          label: "nested drawer inactive option label",
        },
      ],
    });
  });

  test("exposes drawer-form canonical launcher links to the dedicated generated render surface", async ({ page }) => {
    await page.goto("/design-system/canonicals/drawer-form");

    const links = await page.locator(".canonical-launcher-button").evaluateAll((nodes) =>
      nodes.map((node) => node instanceof HTMLAnchorElement ? node.getAttribute("href") : null),
    );

    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-001");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-004");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-005");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-006");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-007");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-008");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-009");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-010");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-011");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-012");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-013");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-014");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-015");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-016");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-017");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-018");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-019");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-020");
    expect(links).toContain("/design-system/canonical-renderings/drawer-form/DF-021");
    expect(links).not.toContain("/design-system/templates/list-page?drawerMode=form&formIntent=create");
    expect(links).not.toContain("/design-system/templates/list-page?drawerMode=form&formIntent=edit");
  });

  test("generated canonical-renderings launcher includes drawer-form and opens the render route", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/drawer-form");

    await expect(page.locator("#canonical-renderings-family-title")).toHaveText("Drawer Form Canonical Renderings");
    await expect(page.locator('.canonical-launcher-button[href="/design-system/canonical-renderings/drawer-form/DF-001"]')).toBeVisible();

    await page.locator('.canonical-launcher-button[href="/design-system/canonical-renderings/drawer-form/DF-001"]').click();
    await expect(page).toHaveURL(/\/design-system\/canonical-renderings\/drawer-form\/DF-001$/);
    await expect(page.locator("[data-drawer-form]")).toBeVisible();
  });
});
