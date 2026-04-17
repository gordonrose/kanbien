import { expect, test, type Locator, type Page } from "@playwright/test";

const subNavCanonicalStates = [
  {
    refId: "SNR-001",
    label: "desktop default row",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-001",
    screenshot: "snr-001-desktop-default-row.png",
  },
  {
    refId: "SNR-002",
    label: "compressed desktop row",
    route:
      "/design-system/components/sub-nav?width=760&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-002",
    screenshot: "snr-002-compressed-desktop-row.png",
  },
  {
    refId: "SNR-003",
    label: "desktop active search",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=active&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-003",
    screenshot: "snr-003-desktop-active-search.png",
  },
  {
    refId: "SNR-004",
    label: "mobile fallback row",
    route:
      "/design-system/components/sub-nav?width=560&state=mobile&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-004",
    screenshot: "snr-004-mobile-fallback-row.png",
  },
  {
    refId: "SNR-005",
    label: "rtl full row",
    route:
      "/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=SNR-005",
    screenshot: "snr-005-rtl-full-row.png",
  },
  {
    refId: "SNR-006",
    label: "theme readability row",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=dark&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-006",
    screenshot: "snr-006-theme-readability-row.png",
  },
  {
    refId: "SNR-007",
    label: "magnified or long-content row",
    route:
      "/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=100&locale=long-latin&accent=%23635bff&ref=SNR-007",
    screenshot: "snr-007-magnified-long-content-row.png",
  },
  {
    refId: "SNR-008",
    label: "rtl reduced row",
    route:
      "/design-system/components/sub-nav?width=1120&state=reduced-page-minus-one&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=SNR-008",
    screenshot: "snr-008-rtl-reduced-row.png",
  },
  {
    refId: "BCR-002",
    label: "shallow home breadcrumb",
    route:
      "/design-system/components/sub-nav?width=1320&state=shallow&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=BCR-002",
    screenshot: "bcr-002-shallow-home-breadcrumb.png",
  },
  {
    refId: "BCR-003",
    label: "reduced breadcrumb without Page -1",
    route:
      "/design-system/components/sub-nav?width=760&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=BCR-003",
    screenshot: "bcr-003-reduced-without-page-minus-one.png",
  },
  {
    refId: "BCR-004",
    label: "reduced breadcrumb without middle segment",
    route:
      "/design-system/components/sub-nav?width=700&state=reduced-middle&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=BCR-004",
    screenshot: "bcr-004-reduced-without-middle-segment.png",
  },
  {
    refId: "BCR-005",
    label: "compact breadcrumb signpost",
    route:
      "/design-system/components/sub-nav?width=640&state=compact&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=BCR-005",
    screenshot: "bcr-005-compact-signpost.png",
  },
  {
    refId: "BCR-007",
    label: "long-label breadcrumb",
    route:
      "/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=long-latin&accent=%23635bff&ref=BCR-007",
    screenshot: "bcr-007-long-label-breadcrumb.png",
  },
  {
    refId: "BCR-009",
    label: "rtl reduced breadcrumb",
    route:
      "/design-system/components/sub-nav?width=1120&state=reduced-page-minus-one&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=BCR-009",
    screenshot: "bcr-009-rtl-reduced-breadcrumb.png",
  },
  {
    refId: "BCR-010",
    label: "rtl compact breadcrumb",
    route:
      "/design-system/components/sub-nav?width=760&state=compact&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=BCR-010",
    screenshot: "bcr-010-rtl-compact-breadcrumb.png",
  },
  {
    refId: "BCR-011",
    label: "ltr truncated breadcrumb labels with tooltip",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=long-latin-truncation&accent=%23635bff&ref=BCR-011",
    screenshot: "bcr-011-ltr-truncation-tooltip.png",
    hoverSelector: "#sub-nav-preview-current-label",
  },
  {
    refId: "BCR-012",
    label: "rtl truncated breadcrumb labels with tooltip",
    route:
      "/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl-long-truncation&accent=%23635bff&ref=BCR-012",
    screenshot: "bcr-012-rtl-truncation-tooltip.png",
    hoverSelector: "#sub-nav-preview-current-label",
  },
  {
    refId: "SSR-002",
    label: "desktop active search shell",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=active&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SSR-002",
    screenshot: "ssr-002-desktop-active-search-shell.png",
  },
  {
    refId: "SSR-003",
    label: "compressed desktop search shell",
    route:
      "/design-system/components/sub-nav?width=760&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SSR-003",
    screenshot: "ssr-003-compressed-desktop-search-shell.png",
  },
  {
    refId: "SSR-004",
    label: "mobile search shell",
    route:
      "/design-system/components/sub-nav?width=560&state=mobile&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SSR-004",
    screenshot: "ssr-004-mobile-search-shell.png",
  },
  {
    refId: "SSR-006",
    label: "theme readability search shell",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=dark&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SSR-006",
    screenshot: "ssr-006-theme-readability-search-shell.png",
  },
  {
    refId: "SSR-007",
    label: "magnified long-placeholder search shell",
    route:
      "/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=100&locale=long-latin&accent=%23635bff&ref=SSR-007",
    screenshot: "ssr-007-magnified-long-placeholder-search-shell.png",
  },
  {
    refId: "SSR-008",
    label: "localized long Latin search shell",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=long-latin&accent=%23635bff&ref=SSR-008",
    screenshot: "ssr-008-localized-long-latin-search-shell.png",
  },
  {
    refId: "SSR-009",
    label: "localized rtl search shell",
    route:
      "/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=SSR-009",
    screenshot: "ssr-009-localized-rtl-search-shell.png",
  },
  {
    refId: "SSR-010",
    label: "localized cjk search shell",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=cjk&accent=%23635bff&ref=SSR-010",
    screenshot: "ssr-010-localized-cjk-search-shell.png",
  },
  {
    refId: "SSR-011",
    label: "symbol-heavy search shell",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=symbols&accent=%23635bff&ref=SSR-011",
    screenshot: "ssr-011-symbol-heavy-search-shell.png",
  },
  {
    refId: "SSR-012",
    label: "rtl reduced search shell",
    route:
      "/design-system/components/sub-nav?width=1120&state=reduced-page-minus-one&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=SSR-012",
    screenshot: "ssr-012-rtl-reduced-search-shell.png",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  const resolvedRoute = new URL(route, "http://localhost");
  const requestedWidth = Number.parseInt(resolvedRoute.searchParams.get("width") ?? "0", 10);
  const viewportWidth = Math.max(requestedWidth + 320, 1440);

  await page.setViewportSize({
    width: viewportWidth,
    height: 1400,
  });
  await page.goto(route);
  await page.locator("#sub-nav-preview-frame").waitFor({ state: "visible" });
  await page.locator('#sub-nav-preview-shell[data-render-status="ready"]').waitFor({ state: "visible" });
}

async function hoverForTooltip(page: Page, selector: string) {
  const target = page.locator(selector);
  await target.hover();
  await page.locator("#shared-floating-tooltip").waitFor({ state: "visible" });
}

function frameLocator(page: Page): Locator {
  return page.locator("#sub-nav-preview-frame");
}

test.describe("design-system sub-nav canonical states", () => {
  for (const scenario of subNavCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      if (scenario.hoverSelector) {
        await hoverForTooltip(page, scenario.hoverSelector);
      }

      await expect(frameLocator(page)).toHaveScreenshot(scenario.screenshot, {
        maxDiffPixels: 700,
      });
    });
  }

  test("BCR-011 and BCR-012 keep tooltip reveal in the top overlay layer", async ({ page }) => {
    for (const scenario of subNavCanonicalStates.filter((state) => state.refId === "BCR-011" || state.refId === "BCR-012")) {
      await gotoCanonicalState(page, scenario.route);
      await hoverForTooltip(page, scenario.hoverSelector!);

      const tooltip = page.locator("#shared-floating-tooltip");
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveAttribute("aria-hidden", "false");
    }
  });

  test("sub-nav canonical layout width is scoped to the local render container", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-001",
    );

    const layoutState = await page.evaluate(() => {
      const layout = document.querySelector("#sub-nav-preview-frame")?.closest(".canonical-render-layout");
      return {
        documentWidth: document.documentElement.style.getPropertyValue("--canonical-render-layout-width"),
        layoutWidth: layout instanceof HTMLElement ? layout.style.getPropertyValue("--canonical-render-layout-width") : "",
      };
    });

    expect(layoutState.documentWidth).toBe("");
    expect(layoutState.layoutWidth).toBe("1656px");
  });

  test("sub-nav canonical theme and magnification stay scoped to the local render layout", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=dark&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=SNR-006",
    );

    const themeState = await page.evaluate(() => {
      const layout = document.querySelector("#sub-nav-preview-frame")?.closest(".canonical-render-layout");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.layoutTheme).toBe("dark");

    await gotoCanonicalState(
      page,
      "/design-system/components/sub-nav?width=880&state=reduced-page-minus-one&search=inactive&theme=normal&dir=ltr&zoom=100&locale=long-latin&accent=%23635bff&ref=SNR-007",
    );

    const magnificationState = await page.evaluate(() => {
      const shell = document.getElementById("sub-nav-preview-shell");
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

  test("sub-nav canonical RTL direction is owned by the local render surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/sub-nav?width=1920&state=full&search=inactive&theme=normal&dir=rtl&zoom=0&locale=rtl&accent=%23635bff&ref=SNR-005",
    );

    const directionState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      shellDir: document.getElementById("sub-nav-preview-shell")?.getAttribute("dir"),
    }));

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.shellDir).toBe("rtl");
  });
});
