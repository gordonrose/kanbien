import { expect, test } from "@playwright/test";

test.describe("design-system search panel structure", () => {
  test("adds a fixed search row between title and scrolling results", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/search-panel");

    const geometry = await page.evaluate(() => {
      const panel = document.querySelector("[data-search-panel]");
      const titleSection = document.querySelector("[data-filter-panel-structure-title-section]");
      const searchSection = document.querySelector("[data-search-panel-query-section]");
      const searchSlot = document.querySelector("[data-search-panel-query-slot]");
      const scrollStack = document.querySelector("[data-filter-panel-structure-scroll-stack]");
      const firstResult = document.querySelector("[data-filter-panel-structure-filter-section]");

      if (
        !(panel instanceof HTMLElement)
        || !(titleSection instanceof HTMLElement)
        || !(searchSection instanceof HTMLElement)
        || !(searchSlot instanceof HTMLElement)
        || !(scrollStack instanceof HTMLElement)
        || !(firstResult instanceof HTMLElement)
      ) {
        return null;
      }

      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const expectedRowHeight = Math.max(rootFontSize * 5.25, window.innerHeight * 0.85 / 12);
      const panelBox = panel.getBoundingClientRect();
      const titleBox = titleSection.getBoundingClientRect();
      const searchBox = searchSection.getBoundingClientRect();
      const searchSlotBox = searchSlot.getBoundingClientRect();
      const scrollBox = scrollStack.getBoundingClientRect();
      const firstResultBox = firstResult.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);

      return {
        panelHasSearchMarker: panel.dataset.searchPanel === "",
        panelHasThreeFixedAreas: panel.children.length === 3
          && panel.children[0] === titleSection
          && panel.children[1] === searchSection
          && panel.children[2] === scrollStack,
        panelGridRows: panelStyle.gridTemplateRows.split(" ").length,
        titleAtPanelTop: Math.abs(titleBox.top - panelBox.top) < 2,
        searchBetweenTitleAndScroll: Math.abs(searchBox.top - titleBox.bottom) < 2
          && Math.abs(scrollBox.top - searchBox.bottom) < 2,
        firstResultStartsInsideScroll: Math.abs(firstResultBox.top - scrollBox.top) < 2,
        searchHeightMatchesRows: Math.abs(searchBox.height - expectedRowHeight) < 2,
        searchSlotCentered: Math.abs((searchSlotBox.left + searchSlotBox.width / 2) - (searchBox.left + searchBox.width / 2)) < 2
          && Math.abs((searchSlotBox.top + searchSlotBox.height / 2) - (searchBox.top + searchBox.height / 2)) < 2,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.panelHasSearchMarker).toBe(true);
    expect(geometry?.panelHasThreeFixedAreas).toBe(true);
    expect(geometry?.panelGridRows).toBe(3);
    expect(geometry?.titleAtPanelTop).toBe(true);
    expect(geometry?.searchBetweenTitleAndScroll).toBe(true);
    expect(geometry?.firstResultStartsInsideScroll).toBe(true);
    expect(geometry?.searchHeightMatchesRows).toBe(true);
    expect(geometry?.searchSlotCentered).toBe(true);
  });

  test("keeps the search row pinned while result structures scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/search-panel");

    await page.locator("#accessibility-button").click();
    await page.locator("[data-filter-panel-structure-card-count-option='20']").click();

    const scrollState = await page.locator("[data-filter-panel-structure-scroll-stack]").evaluate((scrollStack) => {
      if (!(scrollStack instanceof HTMLElement)) {
        return null;
      }

      const title = document.querySelector("[data-filter-panel-structure-title-section]");
      const search = document.querySelector("[data-search-panel-query-section]");

      if (!(title instanceof HTMLElement) || !(search instanceof HTMLElement)) {
        return null;
      }

      const titleTopBefore = title.getBoundingClientRect().top;
      const searchTopBefore = search.getBoundingClientRect().top;
      const before = scrollStack.scrollTop;
      scrollStack.scrollTop = scrollStack.scrollHeight;

      return {
        overflows: scrollStack.scrollHeight > scrollStack.clientHeight,
        canScroll: scrollStack.scrollTop > before,
        titleDoesNotMove: Math.abs(titleTopBefore - title.getBoundingClientRect().top) < 1,
        searchDoesNotMove: Math.abs(searchTopBefore - search.getBoundingClientRect().top) < 1,
      };
    });

    expect(scrollState).not.toBeNull();
    expect(scrollState?.overflows).toBe(true);
    expect(scrollState?.canScroll).toBe(true);
    expect(scrollState?.titleDoesNotMove).toBe(true);
    expect(scrollState?.searchDoesNotMove).toBe(true);
  });

  test("serves the route from the container structure launcher", async ({ page }) => {
    await page.goto("/design-system/tokens");

    const card = page.locator('a[href="/design-system/tokens/search-panel"]');

    await expect(page.locator("#token-layer-container-structure-title")).toHaveText("Container Structure");
    await expect(card).toContainText("search-panel");
    await expect(card).toContainText("Search Panel");
  });

  test("keeps route markup as a seam mount instead of copied panel anatomy", async ({ request }) => {
    const response = await request.get("/design-system/tokens/search-panel");
    const html = await response.text();

    expect(response.ok()).toBe(true);
    expect(html).toContain("data-search-panel-structure-mount");
    expect(html).not.toContain("data-search-panel-query-section");
    expect(html).not.toContain("data-search-panel-query-slot");
    expect(html).not.toContain("data-filter-panel-structure-scroll-stack");
  });
});
