import { expect, test, type Page } from "@playwright/test";

const sharedHeaderRoutes = [
  {
    route: "/design-system/tokens/list-page-structure",
    shellSelector: ".token-list-page-structure-shell",
    gridSelector: ".token-list-page-structure-header-grid",
  },
  {
    route: "/design-system/tokens/page-header",
    shellSelector: ".token-page-header-shell",
    gridSelector: ".token-page-header-grid",
  },
  {
    route: "/design-system/tokens/list-page-record-structure",
    shellSelector: ".token-list-page-structure-shell",
    gridSelector: ".token-list-page-structure-header-grid",
  },
  {
    route: "/design-system/tokens/entity-page-structure",
    shellSelector: ".token-entity-page-structure-shell",
    gridSelector: ".token-foundation-header-grid",
  },
  {
    route: "/design-system/tokens/nested-entity-record",
    shellSelector: ".token-nested-entity-record-shell",
    gridSelector: ".token-foundation-header-grid",
  },
  {
    route: "/design-system/tokens/filter-panel-structure",
    shellSelector: ".token-filter-panel-structure-shell",
    gridSelector: ".token-list-page-structure-header-grid",
  },
] as const;

async function measureHeaderAtWidth(page: Page, route: string, shellSelector: string, gridSelector: string, width: string) {
  await page.goto(route);
  await page.locator(shellSelector).evaluate((shell, targetWidth) => {
    if (!(shell instanceof HTMLElement)) {
      throw new Error("Expected the structure shell to be an HTMLElement.");
    }

    shell.style.inlineSize = targetWidth;
    shell.style.maxInlineSize = targetWidth;
  }, width);

  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));

  return page.locator(gridSelector).evaluate((grid) => {
    if (!(grid instanceof HTMLElement)) {
      throw new Error("Expected the structure header grid to be an HTMLElement.");
    }

    const gridBox = grid.getBoundingClientRect();
    const spans = Array.from(grid.querySelectorAll("span")).filter((node): node is HTMLElement => node instanceof HTMLElement);
    const visibleSpans = spans.filter((span) => getComputedStyle(span).display !== "none");
    const lastVisibleBox = visibleSpans[visibleSpans.length - 1]?.getBoundingClientRect();

    return {
      visibleLabels: visibleSpans.map((span) => span.textContent?.trim()),
      fillsInlineWidth: lastVisibleBox ? Math.abs(lastVisibleBox.right - gridBox.right) < 2 : false,
      visibleColumnCount: Number.parseInt(getComputedStyle(grid).getPropertyValue("--token-header-visible-columns"), 10),
    };
  });
}

test.describe("shared structure header responsiveness", () => {
  for (const { route, shellSelector, gridSelector } of sharedHeaderRoutes) {
    test(`keeps ${route} on the shared one-column-at-a-time collapse`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await expect.poll(async () => {
        return measureHeaderAtWidth(page, route, shellSelector, gridSelector, "63rem");
      }).toMatchObject({
        visibleLabels: expect.arrayContaining(["13", "14", "15", "16", "17", "18", "19"]),
        fillsInlineWidth: true,
        visibleColumnCount: 24,
      });

      const steppedExpectations = [
        { width: "61rem", hidden: ["19"], visible: "18", count: 23 },
        { width: "59rem", hidden: ["18", "19"], visible: "17", count: 22 },
        { width: "57rem", hidden: ["17", "18", "19"], visible: "16", count: 21 },
        { width: "55rem", hidden: ["16", "17", "18", "19"], visible: "15", count: 20 },
        { width: "53rem", hidden: ["15", "16", "17", "18", "19"], visible: "14", count: 19 },
        { width: "51rem", hidden: ["14", "15", "16", "17", "18", "19"], visible: "13", count: 18 },
        { width: "49rem", hidden: ["13", "14", "15", "16", "17", "18", "19"], visible: "12", count: 17 },
      ];

      for (const expectation of steppedExpectations) {
        const measurement = await measureHeaderAtWidth(page, route, shellSelector, gridSelector, expectation.width);

        expect(measurement.visibleLabels).toContain(expectation.visible);
        for (const label of expectation.hidden) {
          expect(measurement.visibleLabels).not.toContain(label);
        }
        expect(measurement.fillsInlineWidth).toBe(true);
        expect(measurement.visibleColumnCount).toBe(expectation.count);
      }
    });
  }

  test("keeps page-header container overlay on top of the shared 24-column seam", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/page-header");

    const overlay = await page.locator(".token-page-header-grid").evaluate((grid) => {
      if (!(grid instanceof HTMLElement)) {
        throw new Error("Expected the page-header grid to be an HTMLElement.");
      }

      const gridBox = grid.getBoundingClientRect();
      const groups = Array.from(grid.querySelectorAll("[data-page-header-span]")).map((group) => {
        if (!(group instanceof HTMLElement)) {
          throw new Error("Expected page-header overlay groups to be HTMLElements.");
        }

        const box = group.getBoundingClientRect();
        return {
          span: group.dataset.pageHeaderSpan,
          left: box.left - gridBox.left,
          right: box.right - gridBox.left,
          top: box.top - gridBox.top,
          height: box.height,
        };
      });

      return {
        groupSpans: groups.map((group) => group.span),
        groupsShareTop: groups.every((group) => Math.abs(group.top) < 2),
        groupsOverlayHeaderHeight: groups.every((group) => Math.abs(group.height - gridBox.height) < 2),
        ordered: groups.every((group, index) => index === 0 || group.left >= groups[index - 1].right - 2),
      };
    });

    expect(overlay.groupSpans).toEqual(["1", "2", "3-5", "6-8", "9-19", "20", "21", "22", "23", "24"]);
    expect(overlay.groupsShareTop).toBe(true);
    expect(overlay.groupsOverlayHeaderHeight).toBe(true);
    expect(overlay.ordered).toBe(true);
  });

  test("keeps page-header overlay at shared Header 1 height without compressing the tab row", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const header = document.querySelector(".token-page-header");
      const grid = document.querySelector(".token-page-header-grid");
      const map = document.querySelector(".token-page-header-map");
      const firstSpan = grid?.querySelector(":scope > span");
      const firstGroup = document.querySelector("[data-page-header-span=\"1\"]");
      const subheader = document.querySelector(".token-list-page-structure-subheader");
      const navCell = document.querySelector(".token-list-page-structure-nav-cell");

      if (
        !(header instanceof HTMLElement)
        || !(grid instanceof HTMLElement)
        || !(map instanceof HTMLElement)
        || !(firstSpan instanceof HTMLElement)
        || !(firstGroup instanceof HTMLElement)
        || !(subheader instanceof HTMLElement)
        || !(navCell instanceof HTMLElement)
      ) {
        return null;
      }

      const headerBox = header.getBoundingClientRect();
      const gridBox = grid.getBoundingClientRect();
      const mapBox = map.getBoundingClientRect();
      const spanBox = firstSpan.getBoundingClientRect();
      const groupBox = firstGroup.getBoundingClientRect();
      const subheaderBox = subheader.getBoundingClientRect();
      const navCellBox = navCell.getBoundingClientRect();
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const expectedHeaderMax = window.innerHeight * 0.85 / 12;
      const expectedSubheaderMax = expectedHeaderMax;

      return {
        headerKeptSharedHeight: headerBox.height <= expectedHeaderMax + 2,
        gridMatchesSpanHeight: Math.abs(gridBox.height - spanBox.height) < 2,
        overlayMatchesGridHeight: Math.abs(mapBox.height - gridBox.height) < 2 && Math.abs(groupBox.height - gridBox.height) < 2,
        subheaderStartsAfterHeader: Math.abs(subheaderBox.top - headerBox.bottom) <= 2,
        subheaderKeepsSharedHeight: subheaderBox.height <= expectedSubheaderMax + 2,
        navCellKeepsUsefulHeight: navCellBox.height >= Math.min(rootFontSize * 2, expectedSubheaderMax - rootFontSize * 2),
        subheaderHasNoVerticalScroll: subheader.scrollHeight <= subheader.clientHeight + 1,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.headerKeptSharedHeight).toBe(true);
    expect(geometry?.gridMatchesSpanHeight).toBe(true);
    expect(geometry?.overlayMatchesGridHeight).toBe(true);
    expect(geometry?.subheaderStartsAfterHeader).toBe(true);
    expect(geometry?.subheaderKeepsSharedHeight).toBe(true);
    expect(geometry?.navCellKeepsUsefulHeight).toBe(true);
    expect(geometry?.subheaderHasNoVerticalScroll).toBe(true);
  });

  test("keeps the page-header scaffold compact at the reported tall desktop size", async ({ page }) => {
    await page.setViewportSize({ width: 1487, height: 1147 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const header = document.querySelector(".token-page-header");
      const grid = document.querySelector(".token-page-header-grid");
      const subheader = document.querySelector(".token-list-page-structure-subheader");
      const scroll = document.querySelector(".token-list-page-structure-subheader-scroll");
      const firstCell = document.querySelector(".token-list-page-structure-nav-cell");

      if (
        !(header instanceof HTMLElement)
        || !(grid instanceof HTMLElement)
        || !(subheader instanceof HTMLElement)
        || !(scroll instanceof HTMLElement)
        || !(firstCell instanceof HTMLElement)
      ) {
        return null;
      }

      const headerBox = header.getBoundingClientRect();
      const gridBox = grid.getBoundingClientRect();
      const subheaderBox = subheader.getBoundingClientRect();
      const scrollBox = scroll.getBoundingClientRect();
      const cellBox = firstCell.getBoundingClientRect();

      return {
        scaffoldRowsTouch: Math.abs(subheaderBox.top - headerBox.bottom) <= 2,
        tabRowMatchesHeaderScale: subheaderBox.height <= headerBox.height + 2,
        scrollLaneFitsCells: cellBox.height <= scrollBox.height,
        scrollLaneHasNoVerticalOverflow: scroll.scrollHeight <= scroll.clientHeight + 1,
        headerGridStaysSingleRow: gridBox.height <= headerBox.height,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.scaffoldRowsTouch).toBe(true);
    expect(geometry?.tabRowMatchesHeaderScale).toBe(true);
    expect(geometry?.scrollLaneFitsCells).toBe(true);
    expect(geometry?.scrollLaneHasNoVerticalOverflow).toBe(true);
    expect(geometry?.headerGridStaysSingleRow).toBe(true);
  });

  test("keeps the page-header tab row out of vertical scroll in a short viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1373, height: 413 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const subheader = document.querySelector(".token-list-page-structure-subheader");
      const scroll = document.querySelector(".token-list-page-structure-subheader-scroll");
      const firstCell = document.querySelector(".token-list-page-structure-nav-cell");

      if (!(subheader instanceof HTMLElement) || !(scroll instanceof HTMLElement) || !(firstCell instanceof HTMLElement)) {
        return null;
      }

      const subheaderBox = subheader.getBoundingClientRect();
      const scrollBox = scroll.getBoundingClientRect();
      const cellBox = firstCell.getBoundingClientRect();
      const scrollStyle = getComputedStyle(scroll);

      return {
        scrollLaneFitsCells: cellBox.height <= scrollBox.height,
        scrollLaneHasNoVerticalOverflow: scroll.scrollHeight <= scroll.clientHeight + 1,
        scrollLaneIsInsideSubheader: scrollBox.top >= subheaderBox.top && scrollBox.bottom <= subheaderBox.bottom,
        verticalOverflowHidden: scrollStyle.overflowY === "hidden",
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.scrollLaneFitsCells).toBe(true);
    expect(geometry?.scrollLaneHasNoVerticalOverflow).toBe(true);
    expect(geometry?.scrollLaneIsInsideSubheader).toBe(true);
    expect(geometry?.verticalOverflowHidden).toBe(true);
  });

  test("keeps page-header on desktop shell chrome at the former premature mobile breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 980, height: 900 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const primaryNav = document.querySelector(".primary-nav");
      const mobileButton = document.querySelector(".mobile-nav-button");
      const grid = document.querySelector(".token-page-header-grid");
      const subheader = document.querySelector(".token-list-page-structure-subheader");
      const scroll = document.querySelector(".token-list-page-structure-subheader-scroll");
      const firstCell = document.querySelector(".token-list-page-structure-nav-cell");
      const secondCell = document.querySelectorAll(".token-list-page-structure-nav-cell").item(1);

      if (
        !(primaryNav instanceof HTMLElement)
        || !(mobileButton instanceof HTMLElement)
        || !(grid instanceof HTMLElement)
        || !(subheader instanceof HTMLElement)
        || !(scroll instanceof HTMLElement)
        || !(firstCell instanceof HTMLElement)
        || !(secondCell instanceof HTMLElement)
      ) {
        return null;
      }

      const gridBox = grid.getBoundingClientRect();
      const visibleHeaderLabels = Array.from(grid.querySelectorAll(":scope > span"))
        .filter((span): span is HTMLElement => span instanceof HTMLElement && getComputedStyle(span).display !== "none")
        .map((span) => span.textContent?.trim());
      const visibleGroups = Array.from(grid.querySelectorAll("[data-page-header-span]"))
        .filter((group): group is HTMLElement => group instanceof HTMLElement && getComputedStyle(group).display !== "none")
        .map((group) => group.dataset.pageHeaderSpan);
      const scrollBox = scroll.getBoundingClientRect();
      const firstCellBox = firstCell.getBoundingClientRect();

      return {
        shellStaysDesktop: getComputedStyle(primaryNav).display !== "none" && getComputedStyle(mobileButton).display === "none",
        visibleHeaderLabels,
        visibleColumnCount: getComputedStyle(grid).getPropertyValue("--token-header-visible-columns").trim(),
        visibleGroups,
        headerKeepsContainerResponsiveCollapse: visibleHeaderLabels.length > 1
          && visibleHeaderLabels.includes("20")
          && gridBox.width > 0,
        tabHeaderDoesNotBecomeSingleCardCarousel: firstCellBox.width <= scrollBox.width / 4
          && scroll.scrollWidth <= scroll.clientWidth + 1,
        subheaderHasNoVerticalScroll: subheader.scrollHeight <= subheader.clientHeight + 1,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.shellStaysDesktop).toBe(true);
    expect(geometry?.headerKeepsContainerResponsiveCollapse).toBe(true);
    expect(geometry?.visibleColumnCount).not.toBe("1");
    expect(geometry?.visibleGroups).toContain("9-19");
    expect(geometry?.tabHeaderDoesNotBecomeSingleCardCarousel).toBe(true);
    expect(geometry?.subheaderHasNoVerticalScroll).toBe(true);
  });

  test("keeps page-header on desktop shell chrome at tablet width", async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 900 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const primaryNav = document.querySelector(".primary-nav");
      const mobileButton = document.querySelector(".mobile-nav-button");
      const contextNav = document.querySelector(".context-nav");
      const scroll = document.querySelector(".token-list-page-structure-subheader-scroll");
      const firstCell = document.querySelector(".token-list-page-structure-nav-cell");

      if (
        !(primaryNav instanceof HTMLElement)
        || !(mobileButton instanceof HTMLElement)
        || !(contextNav instanceof HTMLElement)
        || !(scroll instanceof HTMLElement)
        || !(firstCell instanceof HTMLElement)
      ) {
        return null;
      }

      const contextNavBox = contextNav.getBoundingClientRect();
      const scrollBox = scroll.getBoundingClientRect();
      const firstCellBox = firstCell.getBoundingClientRect();

      return {
        shellStaysDesktop: getComputedStyle(primaryNav).display !== "none" && getComputedStyle(mobileButton).display === "none",
        contextNavStaysSideRail: contextNavBox.left < 2 && contextNavBox.width < 100 && contextNavBox.height > window.innerHeight / 2,
        tabHeaderDoesNotBecomeSingleCardCarousel: firstCellBox.width <= scrollBox.width / 4
          && scroll.scrollWidth <= scroll.clientWidth + 1,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.shellStaysDesktop).toBe(true);
    expect(geometry?.contextNavStaysSideRail).toBe(true);
    expect(geometry?.tabHeaderDoesNotBecomeSingleCardCarousel).toBe(true);
  });

  test("switches page-header shell chrome only at the narrow mobile breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const primaryNav = document.querySelector(".primary-nav");
      const mobileButton = document.querySelector(".mobile-nav-button");
      const contextNav = document.querySelector(".context-nav");
      const scroll = document.querySelector(".token-list-page-structure-subheader-scroll");
      const firstCell = document.querySelector(".token-list-page-structure-nav-cell");

      if (
        !(primaryNav instanceof HTMLElement)
        || !(mobileButton instanceof HTMLElement)
        || !(contextNav instanceof HTMLElement)
        || !(scroll instanceof HTMLElement)
        || !(firstCell instanceof HTMLElement)
      ) {
        return null;
      }

      const contextNavBox = contextNav.getBoundingClientRect();
      const scrollBox = scroll.getBoundingClientRect();
      const firstCellBox = firstCell.getBoundingClientRect();

      return {
        shellIsMobile: getComputedStyle(primaryNav).display === "none" && getComputedStyle(mobileButton).display !== "none",
        contextNavIsBottomBar: Math.abs(contextNavBox.bottom - window.innerHeight) < 2 && contextNavBox.width > window.innerWidth - 4,
        tabHeaderUsesNarrowCarousel: getComputedStyle(scroll).overflowX === "auto" && firstCellBox.width >= scrollBox.width * 0.65,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.shellIsMobile).toBe(true);
    expect(geometry?.contextNavIsBottomBar).toBe(true);
    expect(geometry?.tabHeaderUsesNarrowCarousel).toBe(true);
  });

  test("removes stretched mobile gaps between page-header rows", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto("/design-system/tokens/page-header");

    const geometry = await page.evaluate(() => {
      const shell = document.querySelector(".token-page-header-shell");
      const header = document.querySelector(".token-page-header");
      const subheader = document.querySelector(".token-list-page-structure-subheader");
      const scroll = document.querySelector(".token-list-page-structure-subheader-scroll");
      const firstCell = document.querySelector(".token-list-page-structure-nav-cell");
      const canvas = document.querySelector(".token-list-page-structure-canvas");

      if (
        !(shell instanceof HTMLElement)
        || !(header instanceof HTMLElement)
        || !(subheader instanceof HTMLElement)
        || !(scroll instanceof HTMLElement)
        || !(firstCell instanceof HTMLElement)
        || !(canvas instanceof HTMLElement)
      ) {
        return null;
      }

      const headerBox = header.getBoundingClientRect();
      const subheaderBox = subheader.getBoundingClientRect();
      const scrollBox = scroll.getBoundingClientRect();
      const firstCellBox = firstCell.getBoundingClientRect();
      const canvasBox = canvas.getBoundingClientRect();

      return {
        shellAlignContent: getComputedStyle(shell).alignContent,
        headerToSubheaderGap: subheaderBox.top - headerBox.bottom,
        subheaderToCanvasGap: canvasBox.top - subheaderBox.bottom,
        tabScrollbarReserve: scrollBox.bottom - firstCellBox.bottom,
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.shellAlignContent).toBe("start");
    expect(geometry?.headerToSubheaderGap).toBeLessThanOrEqual(2);
    expect(geometry?.subheaderToCanvasGap).toBeLessThanOrEqual(2);
    expect(geometry?.tabScrollbarReserve).toBeGreaterThanOrEqual(12);
  });

  test("remaps the page-header overlay onto the collapsed visible header columns", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/page-header");
    await page.locator(".token-page-header-shell").evaluate((shell) => {
      if (!(shell instanceof HTMLElement)) {
        throw new Error("Expected the page-header shell to be an HTMLElement.");
      }

      shell.style.inlineSize = "41rem";
      shell.style.maxInlineSize = "41rem";
    });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));

    const overlay = await page.locator(".token-page-header-grid").evaluate((grid) => {
      if (!(grid instanceof HTMLElement)) {
        throw new Error("Expected the page-header grid to be an HTMLElement.");
      }

      const gridBox = grid.getBoundingClientRect();
      const visibleLabels = Array.from(grid.querySelectorAll(":scope > span"))
        .filter((span): span is HTMLElement => span instanceof HTMLElement && getComputedStyle(span).display !== "none")
        .map((span) => span.textContent?.trim());
      const groups = Array.from(grid.querySelectorAll("[data-page-header-span]")).map((group) => {
        if (!(group instanceof HTMLElement)) {
          throw new Error("Expected page-header overlay groups to be HTMLElements.");
        }

        const box = group.getBoundingClientRect();
        return {
          span: group.dataset.pageHeaderSpan,
          display: getComputedStyle(group).display,
          left: box.left - gridBox.left,
          right: box.right - gridBox.left,
        };
      });

      const visibleGroups = groups.filter((group) => group.display !== "none");
      const tailGroups = visibleGroups.filter((group) => ["20", "21", "22", "23", "24"].includes(group.span ?? ""));

      return {
        visibleColumnCount: getComputedStyle(grid).getPropertyValue("--token-header-visible-columns").trim(),
        visibleLabels,
        hiddenMiddle: groups.find((group) => group.span === "9-19")?.display === "none",
        tailGroupsOrdered: tailGroups.every((group, index) => index === 0 || group.left >= tailGroups[index - 1].right - 2),
        lastTailFillsGrid: Math.abs((tailGroups[tailGroups.length - 1]?.right ?? 0) - gridBox.width) < 2,
      };
    });

    expect(overlay.visibleColumnCount).toBe("13");
    expect(overlay.visibleLabels).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "20", "21", "22", "23", "24"]);
    expect(overlay.hiddenMiddle).toBe(true);
    expect(overlay.tailGroupsOrdered).toBe(true);
    expect(overlay.lastTailFillsGrid).toBe(true);
  });

  test("re-expands the nested entity record frame after viewport-driven width clamping", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/design-system/tokens/nested-entity-record");

    const measure = async () => page.evaluate(() => {
      const shell = document.querySelector("[data-nested-entity-record-frame-shell]");
      const frame = document.querySelector("[data-nested-entity-record-frame]");
      const parent = shell?.parentElement;

      if (!(shell instanceof HTMLElement) || !(frame instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
        return null;
      }

      const shellBox = shell.getBoundingClientRect();
      const frameBox = frame.getBoundingClientRect();
      const parentBox = parent.getBoundingClientRect();

      return {
        frameWidth: frameBox.width,
        parentWidth: parentBox.width,
        shellWidth: shellBox.width,
        tokenWidth: Number.parseInt(shell.dataset.nestedEntityRecordWidth ?? "0", 10),
      };
    });

    const wideStart = await measure();
    await page.setViewportSize({ width: 900, height: 900 });
    await page.waitForTimeout(100);
    const narrow = await measure();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(100);
    const wideAgain = await measure();

    expect(wideStart).not.toBeNull();
    expect(narrow).not.toBeNull();
    expect(wideAgain).not.toBeNull();
    expect(narrow?.frameWidth ?? 0).toBeLessThan((wideStart?.frameWidth ?? 0) - 200);
    expect(wideAgain?.frameWidth ?? 0).toBeGreaterThan((narrow?.frameWidth ?? 0) + 200);
    expect(Math.abs((wideAgain?.frameWidth ?? 0) - (wideStart?.frameWidth ?? 0))).toBeLessThanOrEqual(4);
    expect(wideAgain?.shellWidth ?? 0).toBeGreaterThan((wideAgain?.parentWidth ?? 0) - 40);
  });
});
