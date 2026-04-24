import { expect, test, type Page } from "@playwright/test";
import {
  expectGeneratedCanonicalShellContract,
  readDesignSystemTopNavContract,
} from "../../support/helpers/generatedCanonicalGuards";
import { expectCanonicalOverlayContainedInRenderSurface } from "../../support/helpers/canonicalOverlayGuards";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const canonicalStates = [
  {
    refId: "LDSL-001",
    label: "desktop closed baseline",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-001",
  },
  {
    refId: "LDSL-002",
    label: "desktop open split baseline",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
  },
  {
    refId: "LDSL-003",
    label: "independent scroll-lane pressure",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-003",
  },
  {
    refId: "LDSL-004",
    label: "mobile full-sheet overlay",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-004",
  },
  {
    refId: "LDSL-005",
    label: "mobile overlay beneath shell chrome",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-005",
  },
  {
    refId: "LDSL-006",
    label: "rtl desktop split review",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-006",
  },
  {
    refId: "LDSL-007",
    label: "magnified half-page split review",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-007",
  },
  {
    refId: "LDSL-008",
    label: "theme baseline dark",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-008",
  },
  {
    refId: "LDSL-009",
    label: "theme baseline desert",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-009",
  },
  {
    refId: "LDSL-010",
    label: "squashed split fallback review",
    route: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-010",
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
  await page.locator('#list-detail-split-layout-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system list-detail-split-layout canonical states", () => {
  test("launcher exposes the priority split-layout refs", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/list-detail-split-layout");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(10);
    await expect(page.getByRole("link", { name: /LDSL-001 Desktop closed baseline/ })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-001",
    );
    await expect(page.getByRole("link", { name: /LDSL-004 Mobile full-sheet overlay/ })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-004",
    );
    await expect(page.getByRole("link", { name: /LDSL-007 Magnified half-page split review/ })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-007",
    );
    await expect(page.getByRole("link", { name: /LDSL-010 Squashed split fallback review/ })).toHaveAttribute(
      "href",
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-010",
    );
  });

  test("launcher cards open the dedicated canonical rendering surface", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/list-detail-split-layout");

    await page.getByRole("link", { name: /LDSL-004 Mobile full-sheet overlay/i }).click();

    await expectRouteSurfaceTruth(page, {
      expectedPath: "/design-system/canonical-renderings/list-detail-split-layout/LDSL-004",
      surfaceLocator: "#list-detail-split-layout-preview-shell",
      waitForReadyLocator: '#list-detail-split-layout-preview-shell[data-render-status="ready"]',
      bodyAttribute: { name: "data-list-detail-split-layout-surface", value: "canonical" },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#list-detail-split-layout-canonical-current")).toContainText("LDSL-004");
  });

  test("dedicated render page uses the normalized design-system top nav shell", async ({ page }) => {
    const designSystemTopNavContract = await readDesignSystemTopNavContract(page);

    await expectGeneratedCanonicalShellContract(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
      designSystemTopNavContract,
    );
  });

  for (const scenario of canonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expectRouteSurfaceTruth(page, {
        expectedPath: scenario.route,
        surfaceLocator: "#list-detail-split-layout-preview-shell",
        waitForReadyLocator: '#list-detail-split-layout-preview-shell[data-render-status="ready"]',
        bodyAttribute: { name: "data-list-detail-split-layout-surface", value: "canonical" },
        fallbackHeading: /Design-System Route Families/i,
      });
      await expect(page.locator("#list-detail-split-layout-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#list-detail-split-layout-preview-layout")).toBeVisible();
    });
  }

  test("LDSL-001 keeps the closed state as a single list lane", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-001",
    );

    const closedState = await page.evaluate(() => {
      const layout = document.getElementById("list-detail-split-layout-preview-layout");
      const panel = document.getElementById("list-detail-split-layout-preview-panel");
      return {
        layoutColumns: layout instanceof HTMLElement ? getComputedStyle(layout).gridTemplateColumns : "",
        detailOpen: layout instanceof HTMLElement ? layout.classList.contains("detail-open") : true,
        panelHidden: panel instanceof HTMLElement ? panel.classList.contains("hidden") : false,
      };
    });

    expect(closedState.detailOpen).toBe(false);
    expect(closedState.panelHidden).toBe(true);
    expect(closedState.layoutColumns).not.toContain("  ");
  });

  test("LDSL-002 opens a pushed two-lane desktop split", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    const openState = await page.evaluate(() => {
      const layout = document.getElementById("list-detail-split-layout-preview-layout");
      const listColumn = document.getElementById("list-detail-split-layout-preview-list-column");
      const panel = document.getElementById("list-detail-split-layout-preview-panel");
      const selectedCard = document.querySelector('#list-detail-split-layout-preview-items [aria-pressed="true"]');
      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        detailOpen: layout instanceof HTMLElement ? layout.classList.contains("detail-open") : false,
        layoutColumns: layout instanceof HTMLElement ? getComputedStyle(layout).gridTemplateColumns : "",
        listRect: rect(listColumn),
        panelRect: rect(panel),
        selectedPressed: selectedCard instanceof HTMLElement ? selectedCard.getAttribute("aria-pressed") : "",
      };
    });

    expect(openState.detailOpen).toBe(true);
    expect(openState.layoutColumns).toContain("px");
    expect(openState.selectedPressed).toBe("true");
    expect(openState.listRect).not.toBeNull();
    expect(openState.panelRect).not.toBeNull();

    if (!openState.listRect || !openState.panelRect) {
      return;
    }

    expect(openState.panelRect.left).toBeGreaterThan(openState.listRect.left);
  });

  test("LDSL-002 auto-compensates for both frame width and full-screen width loss in the canonical page", async ({ page }) => {
    await page.setViewportSize({
      width: 960,
      height: 1400,
    });
    await page.goto("/design-system/canonical-renderings/list-detail-split-layout/LDSL-002");
    await page.locator('#list-detail-split-layout-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });

    const renderHonestyState = await page.evaluate(() => {
      const frame = document.getElementById("list-detail-split-layout-preview-frame");
      const shell = document.getElementById("list-detail-split-layout-preview-shell");
      const actionRow = document.querySelector(".list-page-detail-action-row");

      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        frameRect: rect(frame),
        shellRect: rect(shell),
        fitScale: frame instanceof HTMLElement
          ? Number.parseFloat(getComputedStyle(frame).getPropertyValue("--list-detail-split-layout-canonical-fit-scale"))
          : 1,
        viewportWidth: window.innerWidth,
        actionWrap: actionRow instanceof HTMLElement ? getComputedStyle(actionRow).flexWrap : "",
      };
    });

    expect(renderHonestyState.frameRect).not.toBeNull();
    expect(renderHonestyState.shellRect).not.toBeNull();

    if (!renderHonestyState.frameRect || !renderHonestyState.shellRect) {
      return;
    }

    expect(renderHonestyState.frameRect.width).toBeLessThan(1080);
    expect(renderHonestyState.fitScale).toBeGreaterThan(0);
    expect(renderHonestyState.fitScale).toBeLessThan(1);
    expect(renderHonestyState.frameRect.width).toBeLessThan(renderHonestyState.viewportWidth);
    expect(renderHonestyState.shellRect.width).toBeLessThanOrEqual(renderHonestyState.frameRect.width + 1);
    expect(renderHonestyState.actionWrap).toBe("nowrap");
  });

  test("LDSL-002 keeps visible spacing between stacked list cards", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    const cardSpacing = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("#list-detail-split-layout-preview-items .list-page-card"));
      if (cards.length < 2) {
        return null;
      }

      const first = cards[0];
      const second = cards[1];
      if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) {
        return null;
      }

      const firstRect = first.getBoundingClientRect();
      const secondRect = second.getBoundingClientRect();

      return {
        stackGap: Math.round(secondRect.top - firstRect.bottom),
      };
    });

    expect(cardSpacing).not.toBeNull();
    expect(cardSpacing?.stackGap).toBeGreaterThanOrEqual(12);
  });

  test("LDSL-002 does not advertise load-more behavior when the preview does not implement it", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    await expect(page.locator("#list-detail-split-layout-preview-status")).toBeHidden();
  });

  test("LDSL-002 keeps the header action row aligned with the copy block when the content is short", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    const headerState = await page.evaluate(() => {
      const copy = document.querySelector(".list-page-detail-copy");
      const controls = document.querySelector(".list-page-detail-controls");
      const actionRow = document.querySelector(".list-page-detail-action-row");

      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        copyRect: rect(copy),
        controlsRect: rect(controls),
        actionWrap: actionRow instanceof HTMLElement ? getComputedStyle(actionRow).flexWrap : "",
      };
    });

    expect(headerState.copyRect).not.toBeNull();
    expect(headerState.controlsRect).not.toBeNull();
    expect(headerState.actionWrap).toBe("nowrap");

    if (!headerState.copyRect || !headerState.controlsRect) {
      return;
    }

    expect(Math.abs(headerState.controlsRect.top - headerState.copyRect.top)).toBeLessThanOrEqual(8);
  });

  test("LDSL-002 keeps previous and next vertically aligned in the footer", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    const footerState = await page.evaluate(() => {
      const prev = document.getElementById("list-detail-split-layout-preview-prev");
      const next = document.getElementById("list-detail-split-layout-preview-next");

      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        prevRect: rect(prev),
        nextRect: rect(next),
      };
    });

    expect(footerState.prevRect).not.toBeNull();
    expect(footerState.nextRect).not.toBeNull();

    if (!footerState.prevRect || !footerState.nextRect) {
      return;
    }

    expect(Math.abs(footerState.prevRect.top - footerState.nextRect.top)).toBeLessThanOrEqual(2);
    expect(Math.abs(footerState.prevRect.bottom - footerState.nextRect.bottom)).toBeLessThanOrEqual(2);
  });

  test("LDSL-002 keeps the footer nav row vertically balanced inside the footer band", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
    );

    const footerBandState = await page.evaluate(() => {
      const panel = document.getElementById("list-detail-split-layout-preview-panel");
      const footer = document.querySelector(".list-page-detail-footer");
      const row = document.querySelector(".list-page-detail-nav-row");

      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        panelRect: rect(panel),
        footerRect: rect(footer),
        rowRect: rect(row),
      };
    });

    expect(footerBandState.panelRect).not.toBeNull();
    expect(footerBandState.footerRect).not.toBeNull();
    expect(footerBandState.rowRect).not.toBeNull();

    if (!footerBandState.panelRect || !footerBandState.footerRect || !footerBandState.rowRect) {
      return;
    }

    const topInset = footerBandState.rowRect.top - footerBandState.footerRect.top;
    const bottomInset = footerBandState.panelRect.bottom - footerBandState.rowRect.bottom;
    const footerCenter = (footerBandState.footerRect.top + footerBandState.panelRect.bottom) / 2;
    const rowCenter = (footerBandState.rowRect.top + footerBandState.rowRect.bottom) / 2;

    expect(Math.abs(rowCenter - footerCenter)).toBeLessThanOrEqual(4);
    expect(Math.abs(topInset - bottomInset)).toBeLessThanOrEqual(4);
  });

  test("LDSL-003 keeps list and detail lanes independently scrollable", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-003",
    );

    const scrollState = await page.evaluate(() => {
      const listColumn = document.getElementById("list-detail-split-layout-preview-list-column");
      const detailBody = document.getElementById("list-detail-split-layout-preview-body");

      if (!(listColumn instanceof HTMLElement) || !(detailBody instanceof HTMLElement)) {
        return null;
      }

      listColumn.scrollTop = 180;
      detailBody.scrollTop = 140;

      return {
        listOverflowY: getComputedStyle(listColumn).overflowY,
        detailOverflowY: getComputedStyle(detailBody).overflowY,
        listScrollTop: listColumn.scrollTop,
        detailScrollTop: detailBody.scrollTop,
        listScrollHeight: listColumn.scrollHeight,
        listClientHeight: listColumn.clientHeight,
        detailScrollHeight: detailBody.scrollHeight,
        detailClientHeight: detailBody.clientHeight,
      };
    });

    expect(scrollState).not.toBeNull();
    expect(["auto", "scroll"]).toContain(scrollState?.listOverflowY);
    expect(["auto", "scroll"]).toContain(scrollState?.detailOverflowY);
    expect(scrollState?.listScrollHeight).toBeGreaterThan(scrollState?.listClientHeight ?? 0);
    expect(scrollState?.detailScrollHeight).toBeGreaterThan(scrollState?.detailClientHeight ?? 0);
    expect(scrollState?.listScrollTop).toBeGreaterThan(0);
    expect(scrollState?.detailScrollTop).toBeGreaterThan(0);
  });

  test("LDSL-004 and LDSL-005 keep the mobile overlay inside the seam and beneath shell overlays", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-004",
    );

    const mobileOverlayState = await page.evaluate(() => {
      const shell = document.getElementById("list-detail-split-layout-preview-shell");
      const layout = document.getElementById("list-detail-split-layout-preview-layout");
      const panel = document.getElementById("list-detail-split-layout-preview-panel");

      return {
        viewportClass: shell instanceof HTMLElement ? shell.dataset.viewportClass ?? "" : "",
        detailOpen: layout instanceof HTMLElement ? layout.classList.contains("detail-open") : false,
        panelPosition: panel instanceof HTMLElement ? getComputedStyle(panel).position : "",
      };
    });

    expect(mobileOverlayState.viewportClass).toBe("mobile");
    expect(mobileOverlayState.detailOpen).toBe(true);
    expect(mobileOverlayState.panelPosition).toBe("absolute");
    await expectCanonicalOverlayContainedInRenderSurface(page, {
      label: "LDSL-004 mobile detail sheet",
      overlay: "#list-detail-split-layout-preview-panel",
      panel: "#list-detail-split-layout-preview-panel",
      hostSurface: "#list-detail-split-layout-preview-shell",
      renderFrame: "#list-detail-split-layout-preview-frame",
      below: ".list-detail-split-layout-preview-topbar",
      requirePanelWidthWithinHost: true,
    });

    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-005",
    );

    const layeringState = await page.evaluate(() => {
      const panel = document.getElementById("list-detail-split-layout-preview-panel");
      const drawer = document.getElementById("list-detail-split-layout-preview-drawer");
      const topbar = document.querySelector(".list-detail-split-layout-preview-topbar");
      const subbar = document.querySelector(".list-detail-split-layout-preview-subbar");

      return {
        panelZIndex: panel instanceof HTMLElement ? getComputedStyle(panel).zIndex : "",
        drawerZIndex: drawer instanceof HTMLElement ? getComputedStyle(drawer).zIndex : "",
        topbarZIndex: topbar instanceof HTMLElement ? getComputedStyle(topbar).zIndex : "",
        subbarZIndex: subbar instanceof HTMLElement ? getComputedStyle(subbar).zIndex : "",
        drawerVisible: drawer instanceof HTMLElement ? !drawer.classList.contains("hidden") : false,
      };
    });

    expect(layeringState.drawerVisible).toBe(true);
    expect(Number(layeringState.panelZIndex)).toBeLessThan(Number(layeringState.drawerZIndex));
    expect(Number(layeringState.panelZIndex)).toBeLessThan(Number(layeringState.topbarZIndex));
    expect(Number(layeringState.panelZIndex)).toBeLessThan(Number(layeringState.subbarZIndex));
    await expectCanonicalOverlayContainedInRenderSurface(page, {
      label: "LDSL-005 layered mobile detail sheet",
      overlay: "#list-detail-split-layout-preview-panel",
      panel: "#list-detail-split-layout-preview-panel",
      hostSurface: "#list-detail-split-layout-preview-shell",
      renderFrame: "#list-detail-split-layout-preview-frame",
      below: ".list-detail-split-layout-preview-topbar",
      requirePanelWidthWithinHost: true,
    });
  });

  test("LDSL-004 keeps the close affordance top-right while header actions drop below the copy block", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-004",
    );

    const mobileHeaderState = await page.evaluate(() => {
      const copy = document.querySelector(".list-page-detail-copy");
      const edit = document.querySelector(".list-page-detail-action-row > :nth-child(1)");
      const share = document.querySelector(".list-page-detail-action-row > :nth-child(2)");
      const close = document.getElementById("list-detail-split-layout-preview-close");

      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        copyRect: rect(copy),
        editRect: rect(edit),
        shareRect: rect(share),
        closeRect: rect(close),
      };
    });

    expect(mobileHeaderState.copyRect).not.toBeNull();
    expect(mobileHeaderState.editRect).not.toBeNull();
    expect(mobileHeaderState.shareRect).not.toBeNull();
    expect(mobileHeaderState.closeRect).not.toBeNull();

    if (!mobileHeaderState.copyRect || !mobileHeaderState.editRect || !mobileHeaderState.shareRect || !mobileHeaderState.closeRect) {
      return;
    }

    expect(mobileHeaderState.closeRect.top).toBeLessThanOrEqual(mobileHeaderState.copyRect.top + 8);
    expect(mobileHeaderState.closeRect.right).toBeGreaterThan(mobileHeaderState.shareRect.right);
    expect(mobileHeaderState.editRect.top).toBeGreaterThanOrEqual(mobileHeaderState.copyRect.bottom - 1);
    expect(mobileHeaderState.shareRect.top).toBeGreaterThanOrEqual(mobileHeaderState.copyRect.bottom - 1);
  });

  test("LDSL-006 mirrors the split relationship in RTL", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-006",
    );

    const rtlState = await page.evaluate(() => {
      const shell = document.getElementById("list-detail-split-layout-preview-shell");
      const listColumn = document.getElementById("list-detail-split-layout-preview-list-column");
      const panel = document.getElementById("list-detail-split-layout-preview-panel");
      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        surfaceDir: shell?.getAttribute("dir"),
        listRect: rect(listColumn),
        panelRect: rect(panel),
      };
    });

    expect(rtlState.surfaceDir).toBe("rtl");
    expect(rtlState.listRect).not.toBeNull();
    expect(rtlState.panelRect).not.toBeNull();

    if (!rtlState.listRect || !rtlState.panelRect) {
      return;
    }

    expect(rtlState.panelRect.left).toBeLessThan(rtlState.listRect.left);
  });

  test("LDSL-007 keeps magnification scoped to the local split-layout preview", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-007",
    );

    const magnificationState = await page.evaluate(() => {
      const shell = document.getElementById("list-detail-split-layout-preview-shell");
      const listColumn = document.getElementById("list-detail-split-layout-preview-list-column");
      const panel = document.getElementById("list-detail-split-layout-preview-panel");

      return {
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        shellScale: shell instanceof HTMLElement ? shell.style.getPropertyValue("--ui-scale") : "",
        shellMagnification: shell instanceof HTMLElement ? shell.dataset.magnification ?? "" : "",
        listWidth: listColumn instanceof HTMLElement ? Math.round(listColumn.getBoundingClientRect().width) : 0,
        panelWidth: panel instanceof HTMLElement ? Math.round(panel.getBoundingClientRect().width) : 0,
      };
    });

    expect(magnificationState.documentScale).toBe("");
    expect(magnificationState.shellScale).toBe("1.5");
    expect(magnificationState.shellMagnification).toBe("100");
    expect(magnificationState.listWidth).toBeGreaterThan(120);
    expect(magnificationState.panelWidth).toBeGreaterThan(120);
  });

  test("LDSL-010 falls back to overlay when a split-capable width becomes too squashed under zoom", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-010",
    );

    const fallbackState = await page.evaluate(() => {
      const shell = document.getElementById("list-detail-split-layout-preview-shell");
      const layout = document.getElementById("list-detail-split-layout-preview-layout");
      const panel = document.getElementById("list-detail-split-layout-preview-panel");

      return {
        viewportClass: shell instanceof HTMLElement ? shell.dataset.viewportClass ?? "" : "",
        layoutMode: shell instanceof HTMLElement ? shell.dataset.layoutMode ?? "" : "",
        detailOpen: layout instanceof HTMLElement ? layout.classList.contains("detail-open") : false,
        layoutColumns: layout instanceof HTMLElement ? getComputedStyle(layout).gridTemplateColumns : "",
        panelPosition: panel instanceof HTMLElement ? getComputedStyle(panel).position : "",
      };
    });

    expect(fallbackState.viewportClass).toBe("half-page");
    expect(fallbackState.layoutMode).toBe("overlay");
    expect(fallbackState.detailOpen).toBe(true);
    expect(fallbackState.panelPosition).toBe("absolute");
    expect(fallbackState.layoutColumns).not.toContain("  ");
    await expectCanonicalOverlayContainedInRenderSurface(page, {
      label: "LDSL-010 squashed split fallback overlay",
      overlay: "#list-detail-split-layout-preview-panel",
      panel: "#list-detail-split-layout-preview-panel",
      hostSurface: "#list-detail-split-layout-preview-shell",
      renderFrame: "#list-detail-split-layout-preview-frame",
      requirePanelWidthWithinHost: true,
    });
  });

  test("LDSL-008 and LDSL-009 keep theme scope local to the canonical surface", async ({ page }) => {
    for (const scenario of canonicalStates.filter((state) =>
      state.refId === "LDSL-008" || state.refId === "LDSL-009"
    )) {
      await gotoCanonicalState(page, scenario.route);

      const themeState = await page.evaluate(() => {
        const frame = document.querySelector("#list-detail-split-layout-preview-frame");
        const layout = frame?.closest(".canonical-render-layout");
        return {
          documentTheme: document.documentElement.dataset.theme ?? "",
          frameTheme: frame instanceof HTMLElement ? frame.dataset.themeScope ?? "" : "",
          layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
        };
      });

      expect(themeState.documentTheme).toBe("");
      expect(themeState.layoutTheme).toBe("");
      expect(themeState.frameTheme).toBe(
        scenario.refId === "LDSL-008" ? "dark" : "desert",
      );
    }
  });
});
