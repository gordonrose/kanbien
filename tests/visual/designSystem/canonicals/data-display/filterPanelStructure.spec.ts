import { expect, test } from "@playwright/test";

test.describe("design-system filter panel structure", () => {
  test("keeps the filter panel at its stable desktop overlay width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/filter-panel-structure");

    const geometry = await page.evaluate(() => {
      const canvas = document.querySelector(".token-filter-panel-structure-canvas");
      const shell = document.querySelector(".token-filter-panel-structure-shell");
      const listShell = document.querySelector(".token-list-page-structure-shell.token-filter-panel-structure-shell");
      const header = document.querySelector('[data-list-page-structure-header="first"]');
      const subheader = document.querySelector('[data-list-page-structure-header="second"]');
      const panel = document.querySelector("[data-filter-panel-structure-panel]");
      const titleSection = document.querySelector("[data-filter-panel-structure-title-section]");
      const titleMain = document.querySelector("[data-filter-panel-structure-title-main]");
      const titleAction = document.querySelector("[data-filter-panel-structure-title-action]");
      const scrollStack = document.querySelector("[data-filter-panel-structure-scroll-stack]");
      const filterSections = Array.from(document.querySelectorAll("[data-filter-panel-structure-filter-section]"));
      const cardSlots = Array.from(document.querySelectorAll("[data-filter-panel-structure-card-slot]"));
      const list = document.querySelector("[data-filter-panel-structure-list]");

      if (
        !(canvas instanceof HTMLElement)
        || !(shell instanceof HTMLElement)
        || !(listShell instanceof HTMLElement)
        || !(header instanceof HTMLElement)
        || !(subheader instanceof HTMLElement)
        || !(panel instanceof HTMLElement)
        || !(titleSection instanceof HTMLElement)
        || !(titleMain instanceof HTMLElement)
        || !(titleAction instanceof HTMLElement)
        || !(scrollStack instanceof HTMLElement)
        || filterSections.some((section) => !(section instanceof HTMLElement))
        || cardSlots.some((slot) => !(slot instanceof HTMLElement))
        || !(list instanceof HTMLElement)
      ) {
        return null;
      }

      const canvasBox = canvas.getBoundingClientRect();
      const shellBox = shell.getBoundingClientRect();
      const headerBox = header.getBoundingClientRect();
      const subheaderBox = subheader.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const titleBox = titleSection.getBoundingClientRect();
      const titleMainBox = titleMain.getBoundingClientRect();
      const titleActionBox = titleAction.getBoundingClientRect();
      const scrollStackBox = scrollStack.getBoundingClientRect();
      const filterSectionBoxes = filterSections.map((section) => section.getBoundingClientRect());
      const cardSlotBoxes = cardSlots.map((slot) => slot.getBoundingClientRect());
      const listBox = list.getBoundingClientRect();
      const canvasStyle = getComputedStyle(canvas);
      const panelStyle = getComputedStyle(panel);
      const headerStyle = getComputedStyle(header);
      const subheaderStyle = getComputedStyle(subheader);
      const titleStyle = getComputedStyle(titleSection);
      const titleMainStyle = getComputedStyle(titleMain);
      const titleActionStyle = getComputedStyle(titleAction);
      const cardSlotStyles = cardSlots.map((slot) => getComputedStyle(slot));
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const expectedFilterRowHeight = Math.max(rootFontSize * 5.25, window.innerHeight * 0.85 / 12);
      const paddingInlineStart = Number.parseFloat(canvasStyle.paddingInlineStart) || 0;
      const paddingInlineEnd = Number.parseFloat(canvasStyle.paddingInlineEnd) || 0;
      const paddingBlockStart = Number.parseFloat(canvasStyle.paddingBlockStart) || 0;
      const paddingBlockEnd = Number.parseFloat(canvasStyle.paddingBlockEnd) || 0;
      const gridLeft = canvasBox.left + paddingInlineStart;
      const gridHeight = canvasBox.height - paddingBlockStart - paddingBlockEnd;
      const expectedOverlayWidth = rootFontSize * 20;

      return {
        reusesListPageShell: shell === listShell,
        headerUsesListPageSeam: header.classList.contains("token-list-page-structure-header")
          && header.querySelectorAll(".token-list-page-structure-header-grid span").length === 24,
        subheaderUsesListPageSeam: subheader.classList.contains("token-list-page-structure-subheader")
          && subheader.querySelectorAll(".token-list-page-structure-nav-cell").length === 24,
        headerMatchesListSeamHeight: Math.abs(headerBox.height - subheaderBox.height) < 2,
        headerKeepsScopedTokenHeight: headerBox.height > rootFontSize,
        headerAboveCanvas: headerBox.bottom <= subheaderBox.top + 1 && subheaderBox.bottom <= canvasBox.top + 1,
        panelStartsAtShell: Math.abs(panelBox.left - shellBox.left) < 2 && Math.abs(panelBox.top - shellBox.top) < 2,
        panelMatchesOverlayWidth: Math.abs(panelBox.width - expectedOverlayWidth) < 2,
        panelOverlaysHeaderAndPage: panelBox.top <= headerBox.top + 1
          && panelBox.bottom >= canvasBox.bottom - 1
          && panelBox.right > listBox.left,
        panelFullHeight: Math.abs(panelBox.height - shellBox.height) < 2,
        panelIsAboveHeaders: Number.parseInt(panelStyle.zIndex, 10) > Number.parseInt(headerStyle.zIndex, 10)
          && Number.parseInt(panelStyle.zIndex, 10) > Number.parseInt(subheaderStyle.zIndex, 10),
        canvasHasNoPadding: paddingInlineStart === 0 && paddingInlineEnd === 0 && paddingBlockStart === 0 && paddingBlockEnd === 0,
        panelHasExpectedSections: panel.children.length === 2 && panel.firstElementChild === titleSection && panel.lastElementChild === scrollStack,
        panelHasNoBackgroundFill: panelStyle.backgroundColor === "rgba(0, 0, 0, 0)",
        titleStartsAtPanelTop: Math.abs(titleBox.top - panelBox.top) < 2,
        titleSpansPanelWidth: Math.abs(titleBox.left - panelBox.left) < 2 && Math.abs(titleBox.right - panelBox.right) < 2,
        titleHeightMatchesHeaderOne: Math.abs(titleBox.height - headerBox.height) < 2,
        titleDividerIsVisible: titleStyle.borderBlockEndStyle === "dashed" && Number.parseFloat(titleStyle.borderBlockEndWidth) > 0,
        titleHasNoBackgroundFill: titleStyle.backgroundColor === "rgba(0, 0, 0, 0)",
        titleMainIsThreeQuarters: Math.abs((titleMainBox.width / titleBox.width) - 0.75) < 0.02,
        titleActionIsOneQuarter: Math.abs((titleActionBox.width / titleBox.width) - 0.25) < 0.02,
        titleInternalDividerIsVisible: titleMainStyle.borderInlineEndStyle === "dashed" && Number.parseFloat(titleMainStyle.borderInlineEndWidth) > 0,
        titleLanesHaveNoBackgroundFill: titleMainStyle.backgroundColor === "rgba(0, 0, 0, 0)" && titleActionStyle.backgroundColor === "rgba(0, 0, 0, 0)",
        filterSectionCount: filterSections.length,
        filterSectionsKeepFilterRowHeight: filterSectionBoxes.every((box) => Math.abs(box.height - expectedFilterRowHeight) < 2),
        filterSectionsStackFromTop: filterSectionBoxes.every((box, index) => {
          const expectedTop = index === 0 ? scrollStackBox.top : filterSectionBoxes[index - 1]?.bottom;
          return typeof expectedTop === "number" && Math.abs(box.top - expectedTop) < 2;
        }),
        filterSectionsDoNotFillRemainingHeight:
          filterSectionBoxes[filterSectionBoxes.length - 1]?.bottom < panelBox.bottom - expectedFilterRowHeight,
        cardSlotCount: cardSlots.length,
        cardSlotsAreCentered: cardSlotBoxes.every((slotBox, index) => {
          const sectionBox = filterSectionBoxes[index];
          if (!sectionBox) {
            return false;
          }
          const slotCenterX = slotBox.left + slotBox.width / 2;
          const slotCenterY = slotBox.top + slotBox.height / 2;
          const sectionCenterX = sectionBox.left + sectionBox.width / 2;
          const sectionCenterY = sectionBox.top + sectionBox.height / 2;
          return Math.abs(slotCenterX - sectionCenterX) < 2 && Math.abs(slotCenterY - sectionCenterY) < 2;
        }),
        cardSlotsAreNearContainerEdges: cardSlotBoxes.every((slotBox, index) => {
          const sectionBox = filterSectionBoxes[index];
          if (!sectionBox) {
            return false;
          }
          return slotBox.width / sectionBox.width > 0.9 && slotBox.height / sectionBox.height > 0.76;
        }),
        cardSlotsHaveNoBackgroundFill: cardSlotStyles.every((style) => style.backgroundColor === "rgba(0, 0, 0, 0)"),
        listUsesPageWidthBehindOverlay: Math.abs(listBox.left - canvasBox.left) < 2 && Math.abs(listBox.right - canvasBox.right) < 2,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.reusesListPageShell).toBe(true);
    expect(geometry?.headerUsesListPageSeam).toBe(true);
    expect(geometry?.subheaderUsesListPageSeam).toBe(true);
    expect(geometry?.headerMatchesListSeamHeight).toBe(true);
    expect(geometry?.headerKeepsScopedTokenHeight).toBe(true);
    expect(geometry?.headerAboveCanvas).toBe(true);
    expect(geometry?.panelStartsAtShell).toBe(true);
    expect(geometry?.panelMatchesOverlayWidth).toBe(true);
    expect(geometry?.panelOverlaysHeaderAndPage).toBe(true);
    expect(geometry?.panelFullHeight).toBe(true);
    expect(geometry?.panelIsAboveHeaders).toBe(true);
    expect(geometry?.canvasHasNoPadding).toBe(true);
    expect(geometry?.panelHasExpectedSections).toBe(true);
    expect(geometry?.panelHasNoBackgroundFill).toBe(true);
    expect(geometry?.titleStartsAtPanelTop).toBe(true);
    expect(geometry?.titleSpansPanelWidth).toBe(true);
    expect(geometry?.titleHeightMatchesHeaderOne).toBe(true);
    expect(geometry?.titleDividerIsVisible).toBe(true);
    expect(geometry?.titleHasNoBackgroundFill).toBe(true);
    expect(geometry?.titleMainIsThreeQuarters).toBe(true);
    expect(geometry?.titleActionIsOneQuarter).toBe(true);
    expect(geometry?.titleInternalDividerIsVisible).toBe(true);
    expect(geometry?.titleLanesHaveNoBackgroundFill).toBe(true);
    expect(geometry?.filterSectionCount).toBe(5);
    expect(geometry?.filterSectionsKeepFilterRowHeight).toBe(true);
    expect(geometry?.filterSectionsStackFromTop).toBe(true);
    expect(geometry?.filterSectionsDoNotFillRemainingHeight).toBe(true);
    expect(geometry?.cardSlotCount).toBe(5);
    expect(geometry?.cardSlotsAreCentered).toBe(true);
    expect(geometry?.cardSlotsAreNearContainerEdges).toBe(true);
    expect(geometry?.cardSlotsHaveNoBackgroundFill).toBe(true);
    expect(geometry?.listUsesPageWidthBehindOverlay).toBe(true);
  });

  test("keeps the overlay width stable while the page resizes behind it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 844 });
    await page.goto("/design-system/tokens/filter-panel-structure");

    const widePanelWidth = await page.locator("[data-filter-panel-structure-panel]").evaluate((panel) => {
      return panel instanceof HTMLElement ? panel.getBoundingClientRect().width : 0;
    });

    await page.setViewportSize({ width: 900, height: 844 });

    const geometry = await page.evaluate((initialWidth) => {
      const panel = document.querySelector("[data-filter-panel-structure-panel]");
      const list = document.querySelector("[data-filter-panel-structure-list]");
      const header = document.querySelector('[data-list-page-structure-header="first"]');

      if (!(panel instanceof HTMLElement) || !(list instanceof HTMLElement) || !(header instanceof HTMLElement)) {
        return null;
      }

      const panelBox = panel.getBoundingClientRect();
      const listBox = list.getBoundingClientRect();
      const headerBox = header.getBoundingClientRect();

      return {
        panelOverlaysList: panelBox.right > listBox.left && panelBox.left <= listBox.left + 1,
        panelOverlaysHeader: panelBox.top <= headerBox.top + 1,
        panelIsNotFullWidth: panelBox.width < listBox.width,
        panelWidthStayedStable: Math.abs(panelBox.width - initialWidth) < 2,
      };
    }, widePanelWidth);

    expect(geometry).not.toBeNull();
    expect(geometry?.panelOverlaysList).toBe(true);
    expect(geometry?.panelOverlaysHeader).toBe(true);
    expect(geometry?.panelIsNotFullWidth).toBe(true);
    expect(geometry?.panelWidthStayedStable).toBe(true);
  });

  test("keeps filter row height from compressing in a short viewport", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 520 });
    await page.goto("/design-system/tokens/filter-panel-structure");

    const geometry = await page.evaluate(() => {
      const titleSection = document.querySelector("[data-filter-panel-structure-title-section]");
      const firstFilterSection = document.querySelector("[data-filter-panel-structure-filter-section]");
      const firstCardSlot = document.querySelector("[data-filter-panel-structure-card-slot]");
      const header = document.querySelector('[data-list-page-structure-header="first"]');

      if (
        !(titleSection instanceof HTMLElement)
        || !(firstFilterSection instanceof HTMLElement)
        || !(firstCardSlot instanceof HTMLElement)
        || !(header instanceof HTMLElement)
      ) {
        return null;
      }

      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const expectedMinimumRowHeight = rootFontSize * 5.25;
      const titleBox = titleSection.getBoundingClientRect();
      const filterBox = firstFilterSection.getBoundingClientRect();
      const cardBox = firstCardSlot.getBoundingClientRect();
      const headerBox = header.getBoundingClientRect();

      return {
        titleMatchesPageHeaderHeight: Math.abs(titleBox.height - headerBox.height) < 2,
        titleIsShorterThanFilterRows: titleBox.height < filterBox.height - 2,
        filterKeepsMinimumHeight: filterBox.height >= expectedMinimumRowHeight - 2,
        cardKeepsUsefulVerticalSpace: cardBox.height / filterBox.height > 0.82,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.titleMatchesPageHeaderHeight).toBe(true);
    expect(geometry?.titleIsShorterThanFilterRows).toBe(true);
    expect(geometry?.filterKeepsMinimumHeight).toBe(true);
    expect(geometry?.cardKeepsUsefulVerticalSpace).toBe(true);
  });

  test("keeps the filter panel readable in the reduced-width layout", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/design-system/tokens/filter-panel-structure?theme=dark&dir=rtl&zoom=100");

    await expect(page.locator("[data-filter-panel-structure-panel]")).toBeVisible();
    await expect(page.locator("[data-filter-panel-structure-list]")).toBeVisible();

    const mobileGeometry = await page.evaluate(() => {
      const panel = document.querySelector("[data-filter-panel-structure-panel]");
      const titleSection = document.querySelector("[data-filter-panel-structure-title-section]");
      const scrollStack = document.querySelector("[data-filter-panel-structure-scroll-stack]");
      const cardSlots = Array.from(document.querySelectorAll("[data-filter-panel-structure-card-slot]"));
      const list = document.querySelector("[data-filter-panel-structure-list]");

      if (
        !(panel instanceof HTMLElement)
        || !(titleSection instanceof HTMLElement)
        || !(scrollStack instanceof HTMLElement)
        || cardSlots.some((slot) => !(slot instanceof HTMLElement))
        || !(list instanceof HTMLElement)
      ) {
        return null;
      }

      const panelBox = panel.getBoundingClientRect();
      const titleBox = titleSection.getBoundingClientRect();
      const scrollStackBox = scrollStack.getBoundingClientRect();
      const listBox = list.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);

      return {
        panelInsideViewport: panelBox.left >= -1 && panelBox.right <= window.innerWidth + 1,
        listInsideViewport: listBox.left >= -1 && listBox.right <= window.innerWidth + 1,
        panelFullWidth: Math.abs(panelBox.width - listBox.width) < 2,
        listBelowPanel: listBox.top >= panelBox.bottom,
        titleInsidePanel: titleBox.left >= panelBox.left && titleBox.right <= panelBox.right && titleBox.top >= panelBox.top,
        scrollStackBelowTitle: scrollStackBox.top >= titleBox.bottom - 1,
        direction: panelStyle.direction,
        background: panelStyle.backgroundColor,
        childCount: panel.children.length,
        cardSlotCount: cardSlots.length,
      };
    });

    expect(mobileGeometry).not.toBeNull();
    expect(mobileGeometry?.panelInsideViewport).toBe(true);
    expect(mobileGeometry?.listInsideViewport).toBe(true);
    expect(mobileGeometry?.panelFullWidth).toBe(true);
    expect(mobileGeometry?.listBelowPanel).toBe(true);
    expect(mobileGeometry?.titleInsidePanel).toBe(true);
    expect(mobileGeometry?.scrollStackBelowTitle).toBe(true);
    expect(mobileGeometry?.direction).toBe("rtl");
    expect(mobileGeometry?.background).toBe("rgba(0, 0, 0, 0)");
    expect(mobileGeometry?.childCount).toBe(2);
    expect(mobileGeometry?.cardSlotCount).toBe(5);
  });

  test("switches card structure count and exposes filter panel scroll behavior", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/filter-panel-structure");

    const panel = page.locator("[data-filter-panel-structure-panel]");
    const titleSection = page.locator("[data-filter-panel-structure-title-section]");
    const scrollStack = page.locator("[data-filter-panel-structure-scroll-stack]");
    const cardSlots = page.locator("[data-filter-panel-structure-card-slot]");

    await expect(cardSlots).toHaveCount(5);
    await expect(panel).toHaveAttribute("data-filter-panel-structure-card-count", "5");

    await page.locator("#accessibility-button").click();
    await page.locator("[data-filter-panel-structure-card-count-option='0']").click();
    await expect(cardSlots).toHaveCount(0);
    await expect(panel).toHaveAttribute("data-filter-panel-structure-card-count", "0");
    await expect(page.locator("[data-filter-panel-structure-card-count-option='0']")).toHaveAttribute("aria-pressed", "true");

    await page.locator("[data-filter-panel-structure-card-count-option='20']").click();
    await expect(cardSlots).toHaveCount(20);
    await expect(panel).toHaveAttribute("data-filter-panel-structure-card-count", "20");
    await expect(page.locator("[data-filter-panel-structure-card-count-option='20']")).toHaveAttribute("aria-pressed", "true");

    const scrollState = await scrollStack.evaluate((node) => {
      if (!(node instanceof HTMLElement)) {
        return null;
      }

      const title = document.querySelector("[data-filter-panel-structure-title-section]");
      const titleTopBefore = title instanceof HTMLElement ? title.getBoundingClientRect().top : null;
      const before = node.scrollTop;
      node.scrollTop = node.scrollHeight;
      const titleTopAfter = title instanceof HTMLElement ? title.getBoundingClientRect().top : null;

      return {
        overflows: node.scrollHeight > node.clientHeight,
        canScroll: node.scrollTop > before,
        titleDoesNotMove: titleTopBefore !== null && titleTopAfter !== null && Math.abs(titleTopBefore - titleTopAfter) < 1,
      };
    });

    expect(scrollState).not.toBeNull();
    expect(scrollState?.overflows).toBe(true);
    expect(scrollState?.canScroll).toBe(true);
    expect(scrollState?.titleDoesNotMove).toBe(true);
    await expect(titleSection).toBeVisible();
  });
});
