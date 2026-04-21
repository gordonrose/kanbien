import { expect, test, type Page } from "@playwright/test";

const topNavCanonicalStates = [
  {
    refId: "TRP-001",
    label: "desktop default",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001",
    screenshot: "trp-001-desktop-default.png",
  },
  {
    refId: "TRP-002",
    label: "desktop overflow",
    route:
      "/design-system/components/top-nav?width=880&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-002",
    screenshot: "trp-002-desktop-overflow.png",
  },
  {
    refId: "TRP-003",
    label: "desktop threshold before mobile",
    route:
      "/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-003",
    screenshot: "trp-003-threshold-before-mobile.png",
  },
  {
    refId: "TRP-004",
    label: "mobile shell closed",
    route:
      "/design-system/components/top-nav?width=560&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-004",
    screenshot: "trp-004-mobile-shell-closed.png",
  },
  {
    refId: "TRP-005",
    label: "mobile shell open",
    route:
      "/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-005",
    screenshot: "trp-005-mobile-shell-open.png",
  },
  {
    refId: "TRP-006",
    label: "desktop profile menu open",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-006",
    screenshot: "trp-006-profile-menu-open.png",
  },
  {
    refId: "TRP-007",
    label: "desktop overflow menu open",
    route:
      "/design-system/components/top-nav?width=880&fixture=standard&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-007",
    screenshot: "trp-007-overflow-menu-open.png",
  },
  {
    refId: "TRP-008",
    label: "rtl desktop",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-008",
    screenshot: "trp-008-rtl-desktop.png",
  },
  {
    refId: "TRP-009",
    label: "rtl mobile",
    route:
      "/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-009",
    screenshot: "trp-009-rtl-mobile.png",
  },
  {
    refId: "TRP-010",
    label: "magnified desktop",
    route:
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=TRP-010",
    screenshot: "trp-010-magnified-desktop.png",
  },
  {
    refId: "TRP-011",
    label: "long brand label",
    route:
      "/design-system/components/top-nav?width=1120&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-011",
    screenshot: "trp-011-long-brand-label.png",
  },
  {
    refId: "TRP-012",
    label: "long primary destination label",
    route:
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-012",
    screenshot: "trp-012-long-primary-label.png",
  },
  {
    refId: "TRP-013",
    label: "long profile trigger or menu label",
    route:
      "/design-system/components/top-nav?width=1120&fixture=long-labels&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-013",
    screenshot: "trp-013-long-profile-label.png",
  },
  {
    refId: "TRP-014A",
    label: "theme variant normal",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014A",
    screenshot: "trp-014a-theme-normal.png",
  },
  {
    refId: "TRP-014B",
    label: "theme variant dark",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=dark&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014B",
    screenshot: "trp-014b-theme-dark.png",
  },
  {
    refId: "TRP-014C",
    label: "theme variant desert",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=desert&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014C",
    screenshot: "trp-014c-theme-desert.png",
  },
  {
    refId: "TRP-015A",
    label: "primary-colour inheritance indigo",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-015A",
    screenshot: "trp-015a-accent-indigo.png",
  },
  {
    refId: "TRP-015B",
    label: "primary-colour inheritance violet",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%237c3aed&ref=TRP-015B",
    screenshot: "trp-015b-accent-violet.png",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  await page.goto(route);
  await page.locator("#top-nav-preview-frame").waitFor({ state: "visible" });
  await page.locator("#top-nav-canonical-current").waitFor({ state: "visible" });
}

test.describe("design-system top-nav canonical states", () => {
  for (const scenario of topNavCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoCanonicalState(page, scenario.route);

      const previewFrame = page.locator("#top-nav-preview-frame");
      await expect(previewFrame).toHaveScreenshot(scenario.screenshot, {
        maxDiffPixels: 700,
      });
    });
  }

  test("TRP-003 keeps desktop mode out of the 1 item plus More state", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-003",
    );

    const topNav = page.locator("#top-nav-preview-frame .top-nav");
    const visiblePrimaryLinks = page.locator("#top-nav-preview-frame #primary-nav-links .nav-link:not(.hidden)");
    const overflow = page.locator("#top-nav-preview-frame #primary-nav-overflow");

    await expect(topNav).not.toHaveClass(/force-mobile-nav/);
    const visibleLinkCount = await visiblePrimaryLinks.count();
    const overflowVisible = await overflow.isVisible();

    expect(overflowVisible && visibleLinkCount === 1).toBe(false);
  });

  test("TRP-010 reroutes pressure into overflow or mobile collapse before crowding", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=TRP-010",
    );

    const topNav = page.locator("#top-nav-preview-frame .top-nav");
    const overflow = page.locator("#top-nav-preview-frame #primary-nav-overflow");

    await expect(topNav).toBeVisible();
    const topNavClass = await topNav.getAttribute("class");
    const overflowVisible = await overflow.isVisible();
    const forcedMobile = (topNavClass ?? "").includes("force-mobile-nav");

    expect(overflowVisible || forcedMobile).toBe(true);
  });

  test("top-nav canonicals render on the dedicated canonical page without preview controls", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001",
    );

    await expect(page.locator("body")).toHaveAttribute("data-top-nav-surface", "canonical");
    await expect(page.locator("#top-nav-canonical-current")).toHaveText("TRP-001 - Desktop default");
    await expect(page.locator("#top-nav-preview-controls-title")).toHaveCount(0);
  });

  test("top-nav canonical theme and magnification stay scoped to the local render layout", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=dark&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014B",
    );

    const themeState = await page.evaluate(() => {
      const layout = document.querySelector("#top-nav-preview-frame")?.closest(".canonical-render-layout");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.layoutTheme).toBe("dark");

    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=TRP-010",
    );

    const magnificationState = await page.evaluate(() => {
      const canvas = document.querySelector("#top-nav-preview-frame .top-nav-preview-canvas");
      return {
        documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
        canvasScale: canvas instanceof HTMLElement ? canvas.style.getPropertyValue("--ui-scale") : "",
        canvasMagnification: canvas instanceof HTMLElement ? canvas.dataset.magnification ?? "" : "",
      };
    });

    expect(magnificationState.documentScale).toBe("");
    expect(magnificationState.canvasScale).toBe("1.5");
    expect(magnificationState.canvasMagnification).toBe("100");
  });

  test("top-nav canonical RTL direction is owned by the local render surface", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-008",
    );

    const directionState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      canvasDir: document.querySelector("#top-nav-preview-frame .top-nav-preview-canvas")?.getAttribute("dir"),
    }));

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.canvasDir).toBe("rtl");
  });
});
