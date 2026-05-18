import { expect, test, type Page } from "@playwright/test";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const topNavCanonicalStates = [
  {
    refId: "TRP-001",
    label: "desktop default",
    screenshot: "trp-001-desktop-default.png",
  },
  {
    refId: "TRP-002",
    label: "desktop overflow",
    screenshot: "trp-002-desktop-overflow.png",
  },
  {
    refId: "TRP-003",
    label: "desktop threshold before mobile",
    screenshot: "trp-003-threshold-before-mobile.png",
  },
  {
    refId: "TRP-004",
    label: "mobile shell closed",
    screenshot: "trp-004-mobile-shell-closed.png",
  },
  {
    refId: "TRP-005",
    label: "mobile shell open",
    screenshot: "trp-005-mobile-shell-open.png",
  },
  {
    refId: "TRP-006",
    label: "desktop profile menu open",
    screenshot: "trp-006-profile-menu-open.png",
  },
  {
    refId: "TRP-007",
    label: "desktop overflow menu open",
    screenshot: "trp-007-overflow-menu-open.png",
  },
  {
    refId: "TRP-008",
    label: "rtl desktop",
    screenshot: "trp-008-rtl-desktop.png",
  },
  {
    refId: "TRP-009",
    label: "rtl mobile",
    screenshot: "trp-009-rtl-mobile.png",
  },
  {
    refId: "TRP-010",
    label: "magnified desktop",
    screenshot: "trp-010-magnified-desktop.png",
  },
  {
    refId: "TRP-011",
    label: "long brand label",
    screenshot: "trp-011-long-brand-label.png",
  },
  {
    refId: "TRP-012",
    label: "long primary destination label",
    screenshot: "trp-012-long-primary-label.png",
  },
  {
    refId: "TRP-013",
    label: "long profile trigger or menu label",
    screenshot: "trp-013-long-profile-label.png",
  },
  {
    refId: "TRP-014A",
    label: "theme variant normal",
    screenshot: "trp-014a-theme-normal.png",
  },
  {
    refId: "TRP-014B",
    label: "theme variant dark",
    screenshot: "trp-014b-theme-dark.png",
  },
  {
    refId: "TRP-014C",
    label: "theme variant desert",
    screenshot: "trp-014c-theme-desert.png",
  },
  {
    refId: "TRP-015A",
    label: "primary-colour inheritance indigo",
    screenshot: "trp-015a-accent-indigo.png",
  },
  {
    refId: "TRP-015B",
    label: "primary-colour inheritance violet",
    screenshot: "trp-015b-accent-violet.png",
  },
] as const;

function topNavCanonicalRenderRoute(refId: string) {
  return `/design-system/canonical-renderings/top-nav/${encodeURIComponent(refId)}`;
}

async function gotoCanonicalState(page: Page, route: string) {
  await page.goto(route);
  await page.locator("#top-nav-preview-frame").waitFor({ state: "visible" });
  await page.locator("#top-nav-canonical-current").waitFor({ state: "visible" });
}

async function settleGeneratedTopNavRender(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve());
        });
      }),
  );
}

async function gotoGeneratedCanonicalState(page: Page, refId: string) {
  await gotoCanonicalState(page, topNavCanonicalRenderRoute(refId));
  await settleGeneratedTopNavRender(page);
}

async function fulfillTopNavRenderWithMarkup(
  page: Page,
  refId: string,
  transform: (html: string) => string,
) {
  await page.route(`**${topNavCanonicalRenderRoute(refId)}`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: transform(await response.text()),
    });
  });
}

test.describe("design-system top-nav canonical states", () => {
  for (const scenario of topNavCanonicalStates) {
    test(`${scenario.refId} ${scenario.label}`, async ({ page }) => {
      await gotoGeneratedCanonicalState(page, scenario.refId);

      const previewFrame = page.locator("#top-nav-preview-frame");
      await expect(previewFrame).toHaveScreenshot(scenario.screenshot, {
        maxDiffPixels: 700,
      });
    });
  }

  test("TRP-003 keeps desktop mode out of the 1 item plus More state", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-003");

    const topNav = page.locator("#top-nav-preview-frame .top-nav");
    const visiblePrimaryLinks = page.locator("#top-nav-preview-frame #primary-nav-links .nav-link:not(.hidden)");
    const overflow = page.locator("#top-nav-preview-frame #primary-nav-overflow");

    await expect(topNav).not.toHaveClass(/force-mobile-nav/);
    const visibleLinkCount = await visiblePrimaryLinks.count();
    const overflowVisible = await overflow.isVisible();

    expect(overflowVisible && visibleLinkCount === 1).toBe(false);
  });

  test("TRP-010 avoids crowding under magnified long-label pressure", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-010");

    const topNav = page.locator("#top-nav-preview-frame .top-nav");

    await expect(topNav).toBeVisible();
    const geometry = await page.evaluate(() => {
      const topNavNode = document.querySelector("#top-nav-preview-frame .top-nav");
      const primaryNav = document.querySelector("#top-nav-preview-frame .primary-nav");
      const primaryLinks = Array.from(document.querySelectorAll("#top-nav-preview-frame #primary-nav-links .nav-link:not(.hidden)"));
      const overflow = document.querySelector("#top-nav-preview-frame #primary-nav-overflow");
      const utilities = document.querySelector("#top-nav-preview-frame .nav-utilities");
      const brand = document.querySelector("#top-nav-preview-frame .brand-lockup");

      const rectsOverlap = (left: DOMRect, right: DOMRect) => left.left < right.right && left.right > right.left;
      const collisionTargets = [utilities, brand]
        .filter((node): node is Element => node instanceof Element)
        .map((node) => node.getBoundingClientRect());
      const visibleControls = [
        ...primaryLinks,
        ...(overflow instanceof HTMLElement && !overflow.classList.contains("hidden")
          ? [overflow]
          : []),
      ];

      return {
        forcedMobile: topNavNode instanceof HTMLElement ? topNavNode.classList.contains("force-mobile-nav") : false,
        primaryFits: primaryNav instanceof HTMLElement ? primaryNav.scrollWidth <= primaryNav.clientWidth : true,
        hasControlCollision: visibleControls.some((control) => {
          const controlRect = control.getBoundingClientRect();
          return collisionTargets.some((targetRect) => rectsOverlap(controlRect, targetRect));
        }),
      };
    });

    expect(geometry.forcedMobile || (geometry.primaryFits && !geometry.hasControlCollision)).toBe(true);
  });

  test("TRP-007 generated route opens the overflow menu", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-007");

    const overflowButton = page.locator("#top-nav-preview-frame #preview-primary-nav-overflow-button");
    const overflowMenu = page.locator("#top-nav-preview-frame #preview-primary-nav-overflow-menu");

    await page.waitForTimeout(1500);

    await expect(overflowButton).toHaveAttribute("aria-expanded", "true");
    await expect(overflowMenu).toBeVisible();
    await expect(overflowMenu.getByRole("menuitem", { name: "Patterns" })).toBeVisible();
  });

  test("top-nav canonicals render on the dedicated canonical page without preview controls", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-001");

    await expect(page.locator("body")).toHaveAttribute("data-top-nav-surface", "canonical");
    await expect(page.locator("#top-nav-canonical-current")).toHaveText("TRP-001 - Desktop default");
    await expect(page.locator("#top-nav-preview-controls-title")).toHaveCount(0);
  });

  test("top-nav generated launcher links every reference to the dedicated render route", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/top-nav");

    await expect(page.locator(".canonical-launcher-button")).toHaveCount(topNavCanonicalStates.length);

    for (const scenario of topNavCanonicalStates) {
      await expect(
        page.locator(`.canonical-launcher-button[href="${topNavCanonicalRenderRoute(scenario.refId)}"]`),
        `${scenario.refId} should target its generated render route`,
      ).toHaveCount(1);
    }
  });

  test("top-nav generated route owns the canonical render surface", async ({ page }) => {
    await page.goto(topNavCanonicalRenderRoute("TRP-001"));

    await expectRouteSurfaceTruth(page, {
      expectedPath: topNavCanonicalRenderRoute("TRP-001"),
      surfaceLocator: "#top-nav-preview-frame",
      waitForReadyLocator: "#top-nav-preview-frame .top-nav",
      bodyAttribute: {
        name: "data-top-nav-surface",
        value: "canonical",
      },
      fallbackHeading: /Design-System Route Families/i,
    });
    await expect(page.locator("#top-nav-canonical-current")).toHaveText("TRP-001 - Desktop default");
  });

  test("top-nav canonical theme and magnification stay scoped to the local render surface", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-014B");

    const themeState = await page.evaluate(() => {
      const layout = document.querySelector("#top-nav-preview-frame")?.closest(".canonical-render-layout");
      const canvas = document.querySelector("#top-nav-preview-frame .top-nav-preview-canvas");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        introTheme: document.querySelector(".canonical-render-intro")?.closest("[data-theme-scope]")?.getAttribute("data-theme-scope") ?? "",
        layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
        canvasTheme: canvas instanceof HTMLElement ? canvas.dataset.themeScope ?? "" : "",
      };
    });

    expect(themeState.documentTheme).toBe("");
    expect(themeState.introTheme).toBe("");
    expect(themeState.layoutTheme).toBe("");
    expect(themeState.canvasTheme).toBe("dark");

    await gotoGeneratedCanonicalState(page, "TRP-014C");

    const desertThemeState = await page.evaluate(() => {
      const layout = document.querySelector("#top-nav-preview-frame")?.closest(".canonical-render-layout");
      const canvas = document.querySelector("#top-nav-preview-frame .top-nav-preview-canvas");
      return {
        documentTheme: document.documentElement.dataset.theme ?? "",
        introTheme: document.querySelector(".canonical-render-intro")?.closest("[data-theme-scope]")?.getAttribute("data-theme-scope") ?? "",
        layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
        canvasTheme: canvas instanceof HTMLElement ? canvas.dataset.themeScope ?? "" : "",
      };
    });

    expect(desertThemeState.documentTheme).toBe("");
    expect(desertThemeState.introTheme).toBe("");
    expect(desertThemeState.layoutTheme).toBe("");
    expect(desertThemeState.canvasTheme).toBe("desert");

    await gotoGeneratedCanonicalState(page, "TRP-010");

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

  test("TRP-014B dark theme applies readable local ink to visible top-nav strings", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-014B");

    const topNav = page.locator("#top-nav-preview-frame .top-nav");
    const brandName = topNav.locator(".brand-copy strong");
    const inactiveLink = topNav.getByRole("link", { name: "Foundations" });
    const activeLink = topNav.getByRole("link", { name: "Overview" });
    const profileName = topNav.locator(".profile-meta strong");

    await expect(topNav).toHaveCSS("color", "rgb(236, 240, 255)");
    await expect(brandName).toHaveCSS("color", "rgb(236, 240, 255)");
    await expect(inactiveLink).toHaveCSS("color", "rgb(180, 190, 216)");
    await expect(activeLink).toHaveCSS("color", "rgb(22, 27, 38)");
    await expect(profileName).toHaveCSS("color", "rgb(236, 240, 255)");
  });

  test("top-nav canonical RTL direction is owned by the local render surface", async ({ page }) => {
    await gotoGeneratedCanonicalState(page, "TRP-008");

    const directionState = await page.evaluate(() => ({
      documentDir: document.documentElement.getAttribute("dir"),
      canvasDir: document.querySelector("#top-nav-preview-frame .top-nav-preview-canvas")?.getAttribute("dir"),
    }));

    expect(directionState.documentDir).not.toBe("rtl");
    expect(directionState.canvasDir).toBe("rtl");
  });

  test("generated top-nav render tolerates an intentionally absent mobile nav menu", async ({ page }) => {
    await fulfillTopNavRenderWithMarkup(page, "TRP-005", (html) =>
      html
        .replace(/<button\s+id="preview-mobile-nav-button"[\s\S]*?<\/button>\s*/u, "")
        .replace(/<nav id="preview-mobile-nav-menu"[\s\S]*?<\/nav>\s*/u, ""),
    );

    await gotoGeneratedCanonicalState(page, "TRP-005");

    await expect(page.locator("#top-nav-preview-frame .top-nav")).toBeVisible();
    await expect(page.locator("#preview-mobile-nav-button")).toHaveCount(0);
    await expect(page.locator("#preview-mobile-nav-menu")).toHaveCount(0);
    await expect(page.locator("#top-nav-canonical-current")).toHaveText("TRP-005 - Mobile shell open");
  });

  test("generated top-nav render tolerates intentionally absent profile controls", async ({ page }) => {
    await fulfillTopNavRenderWithMarkup(page, "TRP-006", (html) =>
      html
        .replace(/<button\s+id="preview-profile-menu-button"[\s\S]*?<\/button>\s*/u, "")
        .replace(/<div\s+id="preview-profile-menu"[\s\S]*?<\/div>\s*/u, "")
        .replace(/<button\s+id="preview-mobile-profile-button"[\s\S]*?<\/button>\s*/u, "")
        .replace(/<div id="preview-mobile-profile-menu"[\s\S]*?<\/div>\s*/u, ""),
    );

    await gotoGeneratedCanonicalState(page, "TRP-006");

    await expect(page.locator("#top-nav-preview-frame .top-nav")).toBeVisible();
    await expect(page.locator("#preview-profile-menu-button")).toHaveCount(0);
    await expect(page.locator("#preview-profile-menu")).toHaveCount(0);
    await expect(page.locator("#preview-mobile-profile-button")).toHaveCount(0);
    await expect(page.locator("#top-nav-canonical-current")).toHaveText("TRP-006 - Profile menu open");
  });
});
