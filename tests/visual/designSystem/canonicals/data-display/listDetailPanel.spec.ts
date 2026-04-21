import { expect, test, type Page } from "@playwright/test";

const listDetailPanelCanonicalStates = [
  {
    refId: "LDP-001",
    label: "desktop baseline populated panel",
    route: "/design-system/components/list-detail-panel?ref=LDP-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-002",
    label: "missing secondary fields",
    route: "/design-system/components/list-detail-panel?ref=LDP-002&width=760&state=missing&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-003",
    label: "local detail error state",
    route: "/design-system/components/list-detail-panel?ref=LDP-003&width=760&state=error&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-004",
    label: "terminal footer boundary",
    route: "/design-system/components/list-detail-panel?ref=LDP-004&width=760&state=boundary&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-005",
    label: "half-page long-content review",
    route: "/design-system/components/list-detail-panel?ref=LDP-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-006",
    label: "mobile narrow stack review",
    route: "/design-system/components/list-detail-panel?ref=LDP-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-007",
    label: "rtl half-page review",
    route: "/design-system/components/list-detail-panel?ref=LDP-007&width=520&state=long&theme=normal&dir=rtl&zoom=0",
  },
  {
    refId: "LDP-008",
    label: "magnified half-page review",
    route: "/design-system/components/list-detail-panel?ref=LDP-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
  },
  {
    refId: "LDP-009",
    label: "focus-entry close control review",
    route: "/design-system/components/list-detail-panel?ref=LDP-009&width=760&state=focus-close&theme=normal&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-010",
    label: "theme baseline dark",
    route: "/design-system/components/list-detail-panel?ref=LDP-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0",
  },
  {
    refId: "LDP-011",
    label: "theme baseline desert",
    route: "/design-system/components/list-detail-panel?ref=LDP-011&width=760&state=baseline&theme=desert&dir=ltr&zoom=0",
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
  await page.locator('#list-detail-panel-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

test.describe("design-system list-detail-panel canonical states", () => {
  test("launcher exposes baseline, long-content, mobile, and focus-entry refs", async ({ page }) => {
    await page.goto("/design-system/canonicals/list-detail-panel");

    const launcherButtons = page.locator(".canonical-launcher-button");
    await expect(launcherButtons).toHaveCount(11);
    await expect(page.getByRole("link", { name: /LDP-005 Half-page long-content review/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /LDP-006 Mobile narrow stack review/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /LDP-009 Focus-entry close control review/ })).toBeVisible();
  });

  for (const scenario of listDetailPanelCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      await expect(page.locator("body")).toHaveAttribute("data-list-detail-panel-surface", "canonical");
      await expect(page.locator("#list-detail-panel-canonical-current")).toContainText(scenario.refId);
      await expect(page.locator("#list-detail-panel-preview-panel")).toBeVisible();
    });
  }

  test("LDP-002 omits missing secondary fields without empty chrome", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-002&width=760&state=missing&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#list-detail-panel-preview-meta")).toBeHidden();
    await expect(page.locator("#list-detail-panel-preview-subtitle")).toBeHidden();
    await expect(page.locator("#list-detail-panel-preview-tags")).toBeHidden();
    await expect(page.locator("#list-detail-panel-preview-description")).toBeVisible();
  });

  test("LDP-003 keeps the local error state inside the panel body", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-003&width=760&state=error&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#list-detail-panel-preview-error")).toBeVisible();
    await expect(page.locator("#list-detail-panel-preview-description")).toBeHidden();
    await expect(page.locator("#list-detail-panel-preview-tags")).toBeHidden();
    await expect(page.locator("#list-detail-panel-preview-prev")).toBeEnabled();
    await expect(page.locator("#list-detail-panel-preview-next")).toBeEnabled();
  });

  test("LDP-004 exposes an honest terminal next hint", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-004&width=760&state=boundary&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#list-detail-panel-preview-prev")).toBeEnabled();
    await expect(page.locator("#list-detail-panel-preview-next")).toBeDisabled();
    await expect(page.locator("#list-detail-panel-preview-next-anchor")).toHaveAttribute("data-tooltip", "Last item");
  });

  test("LDP-005 and LDP-006 keep half-page and mobile widths honest", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
    );

    const halfPageState = await page.evaluate(() => {
      const shell = document.querySelector("#list-detail-panel-preview-shell");
      const panel = document.querySelector("#list-detail-panel-preview-panel");
      const detailBody = document.querySelector(".list-page-detail-body");
      const meta = document.getElementById("list-detail-panel-preview-meta");
      const title = document.getElementById("list-detail-panel-preview-title");

      return {
        shellWidth: shell instanceof HTMLElement ? Math.round(shell.getBoundingClientRect().width) : 0,
        viewportClass: shell instanceof HTMLElement ? shell.dataset.viewportClass ?? "" : "",
        metaTooltip: meta instanceof HTMLElement ? meta.dataset.tooltip ?? "" : "",
        titleTooltip: title instanceof HTMLElement ? title.dataset.tooltip ?? "" : "",
        panelClientHeight: panel instanceof HTMLElement ? panel.clientHeight : 0,
        bodyOverflowY: detailBody instanceof HTMLElement ? getComputedStyle(detailBody).overflowY : "",
        bodyScrollHeight: detailBody instanceof HTMLElement ? detailBody.scrollHeight : 0,
        bodyClientHeight: detailBody instanceof HTMLElement ? detailBody.clientHeight : 0,
      };
    });

    expect(halfPageState.shellWidth).toBeGreaterThan(450);
    expect(halfPageState.shellWidth).toBeLessThan(560);
    expect(halfPageState.viewportClass).toBe("half-page");
    expect(halfPageState.metaTooltip).toContain("Extremely long metadata label");
    expect(halfPageState.titleTooltip).toBe("");
    expect(["auto", "scroll"]).toContain(halfPageState.bodyOverflowY);
    expect(halfPageState.bodyScrollHeight).toBeGreaterThan(halfPageState.bodyClientHeight);
    expect(halfPageState.panelClientHeight).toBeGreaterThan(0);

    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
    );

    const mobileState = await page.evaluate(() => {
      const shell = document.querySelector("#list-detail-panel-preview-shell");
      const controls = document.querySelector(".list-page-detail-controls");
      const actionRow = document.querySelector(".list-page-detail-action-row");
      const header = document.querySelector(".list-page-detail-header");

      return {
        shellWidth: shell instanceof HTMLElement ? Math.round(shell.getBoundingClientRect().width) : 0,
        viewportClass: shell instanceof HTMLElement ? shell.dataset.viewportClass ?? "" : "",
        controlsWidth: controls instanceof HTMLElement ? Math.round(controls.getBoundingClientRect().width) : 0,
        actionRowJustify: actionRow instanceof HTMLElement ? getComputedStyle(actionRow).justifyContent : "",
        headerFlexDirection: header instanceof HTMLElement ? getComputedStyle(header).flexDirection : "",
      };
    });

    expect(mobileState.shellWidth).toBeLessThan(390);
    expect(mobileState.viewportClass).toBe("mobile");
    expect(mobileState.headerFlexDirection).toBe("column");
    expect(mobileState.controlsWidth).toBeGreaterThanOrEqual(280);
    expect(mobileState.actionRowJustify).toBe("flex-start");
  });

  test("LDP-006 keeps the mobile preview header compact instead of leaving a large dead zone", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
    );

    const compactHeaderState = await page.evaluate(() => {
      const copy = document.querySelector(".list-page-detail-copy");
      const subtitle = document.getElementById("list-detail-panel-preview-subtitle");
      const controls = document.querySelector(".list-page-detail-controls");

      const rect = (node: Element | null) =>
        node instanceof HTMLElement ? node.getBoundingClientRect() : null;
      const copyRect = rect(copy);
      const subtitleRect = rect(subtitle);
      const controlsRect = rect(controls);

      return {
        copyRect,
        subtitleRect,
        controlsRect,
        copyFlexGrow: copy instanceof HTMLElement ? getComputedStyle(copy).flexGrow : "",
      };
    });

    expect(compactHeaderState.copyRect).not.toBeNull();
    expect(compactHeaderState.subtitleRect).not.toBeNull();
    expect(compactHeaderState.controlsRect).not.toBeNull();
    expect(compactHeaderState.copyFlexGrow).toBe("0");

    if (!compactHeaderState.copyRect || !compactHeaderState.subtitleRect || !compactHeaderState.controlsRect) {
      return;
    }

    expect(compactHeaderState.controlsRect.top - compactHeaderState.subtitleRect.bottom).toBeLessThan(24);
  });

  test("LDP-007 keeps rtl direction scoped to the local canonical surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-007&width=520&state=long&theme=normal&dir=rtl&zoom=0",
    );

    const directionState = await page.evaluate(() => {
      const shell = document.querySelector("#list-detail-panel-preview-shell");
      const prev = document.getElementById("list-detail-panel-preview-prev");
      const next = document.getElementById("list-detail-panel-preview-next");
      const prevRect = prev instanceof HTMLElement ? prev.getBoundingClientRect() : null;
      const nextRect = next instanceof HTMLElement ? next.getBoundingClientRect() : null;

      return {
        documentDir: document.documentElement.getAttribute("dir"),
        surfaceDir: shell?.getAttribute("dir"),
        prevLeft: prevRect?.left ?? 0,
        nextLeft: nextRect?.left ?? 0,
      };
    });

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.surfaceDir).toBe("rtl");
    expect(directionState.prevLeft).toBeGreaterThan(directionState.nextLeft);
  });

  test("LDP-008 keeps magnification scoped to the local canonical surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
    );

    const magnificationState = await page.evaluate(() => {
      const shell = document.querySelector("#list-detail-panel-preview-shell");
      return {
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        shellScale: shell instanceof HTMLElement ? shell.style.getPropertyValue("--ui-scale") : "",
        shellMagnification: shell instanceof HTMLElement ? shell.dataset.magnification ?? "" : "",
      };
    });

    expect(magnificationState.documentScale).toBe("");
    expect(magnificationState.shellScale).toBe("1.5");
    expect(magnificationState.shellMagnification).toBe("100");
  });

  test("LDP-008 condenses an oversized header after the body starts scrolling", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
    );

    const beforeScroll = await page.evaluate(() => {
      const panel = document.getElementById("list-detail-panel-preview-panel");
      const header = document.querySelector(".list-page-detail-header");
      const subtitle = document.getElementById("list-detail-panel-preview-subtitle");

      return {
        headerHeight: header instanceof HTMLElement ? header.getBoundingClientRect().height : 0,
        panelOversized: panel instanceof HTMLElement ? panel.dataset.headerOversized ?? "" : "",
        panelCondensed: panel instanceof HTMLElement ? panel.dataset.headerCondensed ?? "" : "",
        subtitleDisplay: subtitle instanceof HTMLElement ? getComputedStyle(subtitle).display : "",
      };
    });

    expect(beforeScroll.panelOversized).toBe("true");
    expect(beforeScroll.panelCondensed).toBe("false");
    expect(beforeScroll.subtitleDisplay).not.toBe("none");

    await page.locator(".list-page-detail-body").evaluate((node) => {
      if (node instanceof HTMLElement) {
        node.scrollTop = 120;
        node.dispatchEvent(new Event("scroll"));
      }
    });

    await page.waitForFunction(() => {
      const panel = document.getElementById("list-detail-panel-preview-panel");
      return panel instanceof HTMLElement && panel.dataset.headerCondensed === "true";
    });

    const afterScroll = await page.evaluate(() => {
      const panel = document.getElementById("list-detail-panel-preview-panel");
      const header = document.querySelector(".list-page-detail-header");
      const subtitle = document.getElementById("list-detail-panel-preview-subtitle");

      return {
        headerHeight: header instanceof HTMLElement ? header.getBoundingClientRect().height : 0,
        panelCondensed: panel instanceof HTMLElement ? panel.dataset.headerCondensed ?? "" : "",
        subtitleDisplay: subtitle instanceof HTMLElement ? getComputedStyle(subtitle).display : "",
      };
    });

    expect(afterScroll.panelCondensed).toBe("true");
    expect(afterScroll.subtitleDisplay).toBe("none");
    expect(afterScroll.headerHeight).toBeLessThan(beforeScroll.headerHeight);
  });

  test("LDP-005 keeps header compaction stable while scrolling through long content", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
    );

    const scrollStates = await page.evaluate(async () => {
      const panel = document.getElementById("list-detail-panel-preview-panel");
      const body = document.querySelector(".list-page-detail-body");

      if (!(panel instanceof HTMLElement) || !(body instanceof HTMLElement)) {
        return [];
      }

      const observedStates = [panel.dataset.headerCondensed ?? ""];
      const scrollPositions = [6, 18, 36, 72, 120, 168];

      for (const nextScrollTop of scrollPositions) {
        body.scrollTop = nextScrollTop;
        body.dispatchEvent(new Event("scroll"));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        observedStates.push(panel.dataset.headerCondensed ?? "");
      }

      return observedStates;
    });

    expect(scrollStates.length).toBeGreaterThan(1);

    const transitionCount = scrollStates.reduce((count, state, index) => {
      if (index === 0) {
        return count;
      }

      return count + (state !== scrollStates[index - 1] ? 1 : 0);
    }, 0);

    expect(transitionCount).toBeLessThanOrEqual(1);
  });

  test("LDP-009 focuses the close control for direct focus-entry review", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/list-detail-panel?ref=LDP-009&width=760&state=focus-close&theme=normal&dir=ltr&zoom=0",
    );

    await expect(page.locator("#list-detail-panel-preview-close")).toBeFocused();
  });

  test("LDP-010 and LDP-011 keep theme scoped to the local canonical surface", async ({ page }) => {
    for (const scenario of listDetailPanelCanonicalStates.filter((state) =>
      state.refId === "LDP-010" || state.refId === "LDP-011"
    )) {
      await gotoCanonicalState(page, scenario.route);

      const themeState = await page.evaluate(() => {
        const layout = document.querySelector("#list-detail-panel-preview-frame")?.closest(".canonical-render-layout");
        return {
          documentTheme: document.documentElement.dataset.theme ?? "",
          layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
        };
      });

      expect(themeState.documentTheme).toBe("");
      expect(themeState.layoutTheme).toBe(
        scenario.refId === "LDP-010" ? "dark" : "desert",
      );
    }
  });
});
