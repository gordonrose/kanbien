import { expect, test, type Page } from "@playwright/test";

import { expectCanonicalOverlayContainedInRenderSurface } from "../../support/helpers/canonicalOverlayGuards";
import { expectRouteSurfaceTruth } from "../../support/helpers/routeSurfaceTruth";

const displaySettingsCanonicalStates = [
  { refId: "DSR-001", label: "Desktop grouped payload baseline" },
  { refId: "DSR-002", label: "Dark theme and enlarged payload" },
  { refId: "DSR-003", label: "RTL mirrored payload" },
  { refId: "DSR-004", label: "Mobile bottom-sheet payload" },
  { refId: "DSR-005", label: "Reduced magnification and accent sweep" },
] as const;

function displaySettingsCanonicalRenderRoute(refId: string) {
  return `/design-system/canonical-renderings/display-settings/${encodeURIComponent(refId)}`;
}

async function gotoGeneratedDisplaySettingsCanonical(page: Page, refId: string) {
  await page.goto(displaySettingsCanonicalRenderRoute(refId));
  await page.locator("#context-nav-preview-shell").waitFor({ state: "visible" });
  await page.locator("#context-nav-canonical-current").waitFor({ state: "visible" });
  await page.locator("#accessibility-drawer").waitFor({ state: "visible" });
}

test("context-nav canonical frame anchors rail and content below the preview header stack", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const shell = page.locator("#context-nav-preview-shell");
  const topNav = page.locator("#context-nav-shell-top-nav");
  const subNav = page.locator("#context-nav-shell-sub-nav");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");
  const content = page.locator(".context-nav-preview-body");
  const breadcrumbNav = page.locator("#context-nav-preview-breadcrumb-nav");
  const searchShell = page.locator("#context-nav-preview-search-shell");

  await expect(shell).toBeVisible();
  await expect(topNav).toBeVisible();
  await expect(subNav).toBeVisible();
  await expect(contextNav).toBeVisible();
  await expect(content).toBeVisible();
  await expect(breadcrumbNav).toBeVisible();
  await expect(searchShell).toBeVisible();
  await expect(topNav).not.toHaveClass(/force-mobile-nav/);

  const topNavBox = await topNav.boundingBox();
  const subNavBox = await subNav.boundingBox();
  const contextNavBox = await contextNav.boundingBox();
  const contentBox = await content.boundingBox();
  const breadcrumbBox = await breadcrumbNav.boundingBox();
  const searchBox = await searchShell.boundingBox();

  expect(topNavBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();
  expect(contextNavBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(breadcrumbBox).not.toBeNull();
  expect(searchBox).not.toBeNull();

  if (!topNavBox || !subNavBox || !contextNavBox || !contentBox || !breadcrumbBox || !searchBox) {
    return;
  }

  expect(Math.round(contextNavBox.y)).toBeGreaterThanOrEqual(Math.round(subNavBox.y + subNavBox.height) - 1);
  expect(Math.round(contentBox.y)).toBeGreaterThanOrEqual(Math.round(subNavBox.y + subNavBox.height) - 1);
  expect(Math.round(breadcrumbBox.x + breadcrumbBox.width)).toBeLessThanOrEqual(Math.round(searchBox.x) - 8);
});

test("context-nav canonical review frame stays parked below the host review chrome", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const previewFrame = page.locator("#context-nav-preview-frame");
  const shell = page.locator("#context-nav-preview-shell");
  const hostTopNav = page.locator(".design-system-shell > .top-nav");

  await expect(previewFrame).toBeVisible();
  await expect(shell).toBeVisible();
  await expect(hostTopNav).toBeVisible();
  await expect(previewFrame).toHaveCSS("position", "sticky");

  await page.evaluate(() => {
    window.scrollTo(0, 480);
  });

  const frameBox = await previewFrame.boundingBox();
  const hostTopNavBox = await hostTopNav.boundingBox();

  expect(frameBox).not.toBeNull();
  expect(hostTopNavBox).not.toBeNull();

  if (!frameBox || !hostTopNavBox) {
    return;
  }

  expect(frameBox.y).toBeGreaterThanOrEqual(hostTopNavBox.y + hostTopNavBox.height + 32);
});

test("context-nav host shell on the component canonical route keeps the rail attached during page scroll", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const topNav = page.locator(".design-system-shell > .top-nav");
  const subNav = page.locator(".design-system-shell > .sub-nav");
  const contextNav = page.locator(".design-system-shell > .context-nav");

  await expect(topNav).toBeVisible();
  await expect(subNav).toBeVisible();
  await expect(contextNav).toBeVisible();

  await page.evaluate(() => {
    window.scrollTo(0, 320);
  });

  const topNavBox = await topNav.boundingBox();
  const subNavBox = await subNav.boundingBox();
  const contextNavBox = await contextNav.boundingBox();

  expect(topNavBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();
  expect(contextNavBox).not.toBeNull();

  if (!topNavBox || !subNavBox || !contextNavBox) {
    return;
  }

  expect(Math.round(topNavBox.y)).toBe(0);
  expect(Math.abs(
    Math.round(contextNavBox.y)
    - Math.max(
      Math.round(topNavBox.y + topNavBox.height),
      Math.round(subNavBox.y + subNavBox.height),
    ),
  )).toBeLessThanOrEqual(1.5);
});

test("context-nav canonical rendered shell lets the sub-nav scroll away and reanchors the rail upward", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const content = page.locator(".context-nav-preview-body");
  const renderedTopNav = page.locator("#context-nav-shell-top-nav");
  const renderedSubNav = page.locator("#context-nav-shell-sub-nav");
  const renderedRail = page.locator("#context-nav-preview-shell > .context-nav");
  const nextLink = page.locator("#context-nav-canonical-next");

  await expect(content).toBeVisible();
  await expect(renderedTopNav).toBeVisible();
  await expect(renderedSubNav).toBeVisible();
  await expect(renderedRail).toBeVisible();
  await expect(nextLink).toBeVisible();

  const beforeScroll = await renderedSubNav.boundingBox();
  expect(beforeScroll).not.toBeNull();

  await page.evaluate(() => {
    const contentNode = document.querySelector(".context-nav-preview-content");
    if (contentNode instanceof HTMLElement) {
      contentNode.scrollTop = 220;
    }
  });

  const topNavBox = await renderedTopNav.boundingBox();
  const subNavBox = await renderedSubNav.boundingBox();
  const railBox = await renderedRail.boundingBox();

  expect(topNavBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();
  expect(railBox).not.toBeNull();

  if (!beforeScroll || !topNavBox || !subNavBox || !railBox) {
    return;
  }

  expect(subNavBox.y).toBeLessThan(beforeScroll.y);
  expect(Math.abs(
    Math.round(railBox.y)
    - Math.max(
      Math.round(topNavBox.y + topNavBox.height),
      Math.round(subNavBox.y + subNavBox.height),
    ),
  )).toBeLessThanOrEqual(1.5);
  await expect(nextLink).toBeInViewport();
});

test("context-nav canonical pages do not write host offset state onto the document root", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const initialOffset = await page.evaluate(() => (
    document.documentElement.style.getPropertyValue("--context-nav-top")
  ));

  expect(initialOffset).toBe("");

  await page.evaluate(() => {
    window.scrollTo(0, 420);
  });

  const scrolledOffset = await page.evaluate(() => (
    document.documentElement.style.getPropertyValue("--context-nav-top")
  ));

  expect(scrolledOffset).toBe("");
});

test("context-nav canonical layout width is scoped to the local render container", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const layoutState = await page.evaluate(() => {
    const layout = document.querySelector("#context-nav-preview-frame")?.closest(".canonical-render-layout");
    return {
      documentWidth: document.documentElement.style.getPropertyValue("--canonical-render-layout-width"),
      layoutWidth: layout instanceof HTMLElement ? layout.style.getPropertyValue("--canonical-render-layout-width") : "",
    };
  });

  expect(layoutState.documentWidth).toBe("");
  expect(layoutState.layoutWidth).toBe("1216px");
});

test("context-nav canonical theme and magnification stay scoped to the local render surface", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=accessibility&theme=dark&dir=ltr&zoom=100&accent=%237c3aed&ref=CDR-005",
  );

  const appearanceState = await page.evaluate(() => {
    const layout = document.querySelector("#context-nav-preview-frame")?.closest(".canonical-render-layout");
    const shell = document.getElementById("context-nav-preview-shell");
    return {
      documentTheme: document.documentElement.dataset.theme ?? "",
      documentScale: document.documentElement.style.getPropertyValue("--ui-scale"),
      introTheme: document.querySelector(".canonical-render-intro")?.closest("[data-theme-scope]")?.getAttribute("data-theme-scope") ?? "",
      layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
      shellTheme: shell instanceof HTMLElement ? shell.dataset.themeScope ?? "" : "",
      shellScale: shell instanceof HTMLElement ? shell.style.getPropertyValue("--ui-scale") : "",
      shellMagnification: shell instanceof HTMLElement ? shell.dataset.magnification ?? "" : "",
    };
  });

  expect(appearanceState.documentTheme).toBe("");
  expect(appearanceState.documentScale).toBe("");
  expect(appearanceState.introTheme).toBe("");
  expect(appearanceState.layoutTheme).toBe("");
  expect(appearanceState.shellTheme).toBe("dark");
  expect(appearanceState.shellScale).toBe("1.5");
  expect(appearanceState.shellMagnification).toBe("100");
});

test("context-nav canonical RTL direction is owned by the local render surface", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=CNR-008",
  );

  const directionState = await page.evaluate(() => ({
    documentDir: document.documentElement.getAttribute("dir"),
    shellDir: document.getElementById("context-nav-preview-shell")?.getAttribute("dir"),
  }));

  expect(directionState.documentDir).not.toBe("rtl");
  expect(directionState.shellDir).toBe("rtl");
});

test("context-nav canonical frame drives top-nav and sub-nav responsiveness from the preview width", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-005",
  );

  const topNav = page.locator("#context-nav-shell-top-nav");
  const breadcrumbNav = page.locator("#context-nav-preview-breadcrumb-nav");
  const searchShell = page.locator("#context-nav-preview-search-shell");

  await expect(topNav).toBeVisible();
  await expect(searchShell).toBeVisible();
  await expect(topNav).toHaveClass(/force-mobile-nav/);
  await expect(breadcrumbNav).toBeHidden();
});

test("context-nav scroll state keeps the top and bottom stacks aligned with a visible divider", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=620&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-002",
  );

  const topItem = page.locator("#context-nav-preview-main-items .context-nav-item").first();
  const bottomItem = page.locator(".context-nav-bottom-group .context-nav-item").first();
  const divider = page.locator(".context-nav-stack-divider");

  await expect(topItem).toBeVisible();
  await expect(bottomItem).toBeVisible();
  await expect(divider).toBeVisible();

  const topBox = await topItem.boundingBox();
  const bottomBox = await bottomItem.boundingBox();
  const dividerBox = await divider.boundingBox();

  expect(topBox).not.toBeNull();
  expect(bottomBox).not.toBeNull();
  expect(dividerBox).not.toBeNull();

  if (!topBox || !bottomBox || !dividerBox) {
    return;
  }

  const topCenter = topBox.x + topBox.width / 2;
  const bottomCenter = bottomBox.x + bottomBox.width / 2;
  const dividerCenter = dividerBox.x + dividerBox.width / 2;

  expect(Math.abs(topCenter - bottomCenter)).toBeLessThanOrEqual(2);
  expect(Math.abs(topBox.width - bottomBox.width)).toBeLessThanOrEqual(1.5);
  expect(Math.abs(dividerCenter - topCenter)).toBeLessThanOrEqual(1.5);
});

test("context-nav short-height scroll-pressure state inherits the shared pressure-state rail treatment", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=460&stack=tall&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-004",
  );

  const shell = page.locator("#context-nav-preview-shell");
  const topVisibleItem = page.locator("#context-nav-preview-main-items .context-nav-item").first();
  const topStack = page.locator("#context-nav-preview-main-items");
  const bottomItem = page.locator(".context-nav-bottom-group .context-nav-item").first();
  const divider = page.locator(".context-nav-stack-divider");

  await expect(shell).toHaveAttribute("data-context-nav-scrollable", "true");
  await expect(topVisibleItem).toBeVisible();
  await expect(topStack).toHaveClass(/context-nav-main-scroll/);
  await expect(bottomItem).toBeVisible();
  await expect(divider).toBeVisible();

  const topVisibleBox = await topVisibleItem.boundingBox();
  const bottomBox = await bottomItem.boundingBox();

  expect(topVisibleBox).not.toBeNull();
  expect(bottomBox).not.toBeNull();

  if (!topVisibleBox || !bottomBox) {
    return;
  }

  expect(Math.abs(topVisibleBox.width - bottomBox.width)).toBeLessThanOrEqual(1.5);
});

test("context-nav mobile More menu opens as a full-width sheet above the bottom bar", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=560&height=760&stack=tall&labels=standard&open=more&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-006",
  );

  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");
  const moreMenu = page.locator("#context-nav-more-menu");

  await expect(contextNav).toBeVisible();
  await expect(moreMenu).toBeVisible();

  const navBox = await contextNav.boundingBox();
  const menuBox = await moreMenu.boundingBox();

  expect(navBox).not.toBeNull();
  expect(menuBox).not.toBeNull();

  if (!navBox || !menuBox) {
    return;
  }

  const navCenter = navBox.x + navBox.width / 2;
  const menuCenter = menuBox.x + menuBox.width / 2;

  expect(menuBox.width / navBox.width).toBeGreaterThanOrEqual(0.88);
  expect(Math.abs(menuCenter - navCenter)).toBeLessThanOrEqual(2);
});

test("context-nav RTL desktop keeps the shell in desktop mode with a narrow right-edge rail", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=CNR-008",
  );

  const shell = page.locator("#context-nav-preview-shell");
  const topNav = page.locator("#context-nav-shell-top-nav");
  const breadcrumbNav = page.locator("#context-nav-preview-breadcrumb-nav");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");
  const content = page.locator(".context-nav-preview-body");

  await expect(shell).toBeVisible();
  await expect(topNav).toBeVisible();
  await expect(breadcrumbNav).toBeVisible();
  await expect(topNav).not.toHaveClass(/force-mobile-nav/);

  const shellBox = await shell.boundingBox();
  const railBox = await contextNav.boundingBox();
  const contentBox = await content.boundingBox();

  expect(shellBox).not.toBeNull();
  expect(railBox).not.toBeNull();
  expect(contentBox).not.toBeNull();

  if (!shellBox || !railBox || !contentBox) {
    return;
  }

  expect(Math.abs((railBox.x + railBox.width) - (shellBox.x + shellBox.width))).toBeLessThanOrEqual(1.5);
  expect(railBox.width).toBeLessThanOrEqual(80);
  expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(railBox.x + 1);
});

test("context-nav drawer close button uses the square icon-button treatment", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-007",
  );

  const closeButton = page.locator("#accessibility-close");

  await expect(closeButton).toBeVisible();

  const buttonBox = await closeButton.boundingBox();
  expect(buttonBox).not.toBeNull();

  if (!buttonBox) {
    return;
  }

  expect(Math.abs(buttonBox.width - buttonBox.height)).toBeLessThanOrEqual(1);
  await expect(closeButton).toHaveCSS("display", "grid");
});

test("context-nav CDR-001 desktop canonical opens the context-nav drawer as an overlay side panel", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CDR-001",
  );

  const drawer = page.locator("#accessibility-drawer");
  const content = page.locator(".context-nav-preview-body");
  const subNav = page.locator("#context-nav-shell-sub-nav");
  const currentCanonical = page.locator("#context-nav-canonical-current");

  await expect(drawer).toBeVisible();
  await expect(content).toBeVisible();
  await expect(subNav).toBeVisible();
  await expect(currentCanonical).toHaveText("CDR-001 - Desktop attached drawer open");
  await expectCanonicalOverlayContainedInRenderSurface(page, {
    label: "CDR-001 context-nav drawer",
    overlay: "#accessibility-drawer",
    panel: "#accessibility-drawer",
    hostSurface: "#context-nav-preview-shell",
    renderFrame: "#context-nav-preview-frame",
    below: ".canonical-render-intro",
    requirePanelWidthWithinHost: true,
  });

  const drawerBox = await drawer.boundingBox();
  const contentBox = await content.boundingBox();
  const subNavBox = await subNav.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();

  if (!drawerBox || !contentBox || !subNavBox) {
    return;
  }

  expect(drawerBox.width).toBeGreaterThan(240);
  expect(drawerBox.height).toBeGreaterThan(300);
  expect(drawerBox.y).toBeGreaterThanOrEqual(subNavBox.y + subNavBox.height - 0.5);
  expect(drawerBox.x).toBeLessThan(contentBox.x + contentBox.width - 24);
  expect(drawerBox.x + drawerBox.width).toBeGreaterThan(contentBox.x + 24);
});

test("context-nav CDR-001 desktop drawer stays below the rendered sub-nav after host-page scroll", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CDR-001",
  );

  const drawer = page.locator("#accessibility-drawer");
  const subNav = page.locator("#context-nav-shell-sub-nav");

  await expect(drawer).toBeVisible();
  await expect(subNav).toBeVisible();

  await page.evaluate(() => {
    window.scrollTo(0, 480);
  });

  const drawerBox = await drawer.boundingBox();
  const subNavBox = await subNav.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();

  if (!drawerBox || !subNavBox) {
    return;
  }

  expect(Math.abs(drawerBox.y - (subNavBox.y + subNavBox.height))).toBeLessThanOrEqual(1);
});

test("context-nav CDR-002 desktop canonical mirrors the context-nav drawer to the RTL right edge", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=CDR-002",
  );

  const drawer = page.locator("#accessibility-drawer");
  const rail = page.locator("#context-nav-preview-shell > .context-nav");
  const shell = page.locator("#context-nav-preview-shell");
  const currentCanonical = page.locator("#context-nav-canonical-current");

  await expect(drawer).toBeVisible();
  await expect(rail).toBeVisible();
  await expect(shell).toBeVisible();
  await expect(currentCanonical).toHaveText("CDR-002 - RTL right-edge attached drawer");

  const drawerBox = await drawer.boundingBox();
  const railBox = await rail.boundingBox();
  const shellBox = await shell.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(railBox).not.toBeNull();
  expect(shellBox).not.toBeNull();

  if (!drawerBox || !railBox || !shellBox) {
    return;
  }

  expect(Math.abs((railBox.x + railBox.width) - (shellBox.x + shellBox.width))).toBeLessThanOrEqual(1.5);
  expect(drawerBox.x + drawerBox.width).toBeLessThanOrEqual(railBox.x + 1.5);
  expect(drawerBox.x + drawerBox.width).toBeGreaterThan(railBox.x - 12);
});

test("context-nav mobile drawer fills the lane down to the bottom-nav edge", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-007",
  );

  const drawer = page.locator("#accessibility-drawer");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");

  await expect(drawer).toBeVisible();
  await expect(contextNav).toBeVisible();

  const drawerBox = await drawer.boundingBox();
  const navBox = await contextNav.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(navBox).not.toBeNull();

  if (!drawerBox || !navBox) {
    return;
  }

  expect(Math.abs(drawerBox.y + drawerBox.height - navBox.y)).toBeLessThanOrEqual(1.5);
});

test("context-nav CDR-003 mobile canonical keeps the context-nav drawer attached above the bottom bar", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CDR-003",
  );

  const drawer = page.locator("#accessibility-drawer");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");
  const shell = page.locator("#context-nav-preview-shell");
  const currentCanonical = page.locator("#context-nav-canonical-current");

  await expect(drawer).toBeVisible();
  await expect(contextNav).toBeVisible();
  await expect(shell).toBeVisible();
  await expect(currentCanonical).toHaveText("CDR-003 - Mobile bottom-sheet drawer open");

  const drawerBox = await drawer.boundingBox();
  const navBox = await contextNav.boundingBox();
  const shellBox = await shell.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(shellBox).not.toBeNull();

  if (!drawerBox || !navBox || !shellBox) {
    return;
  }

  expect(drawerBox.width).toBeGreaterThanOrEqual(navBox.width - 36);
  expect(Math.abs(drawerBox.y + drawerBox.height - navBox.y)).toBeLessThanOrEqual(1.5);
  expect(Math.abs(navBox.x - shellBox.x)).toBeLessThanOrEqual(1.5);
  expect(Math.abs((navBox.x + navBox.width) - (shellBox.x + shellBox.width))).toBeLessThanOrEqual(1.5);
});

test("context-nav CDR-004 mobile tall-stack canonical keeps the drawer attached above the bottom bar without collapsing the utility path", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=560&height=760&stack=tall&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CDR-004",
  );

  const drawer = page.locator("#accessibility-drawer");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");
  const shell = page.locator("#context-nav-preview-shell");
  const currentCanonical = page.locator("#context-nav-canonical-current");

  await expect(drawer).toBeVisible();
  await expect(contextNav).toBeVisible();
  await expect(shell).toHaveAttribute("data-context-nav-scrollable", "false");
  await expect(currentCanonical).toHaveText("CDR-004 - Mobile tall-stack utility path");

  const drawerBox = await drawer.boundingBox();
  const navBox = await contextNav.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(navBox).not.toBeNull();

  if (!drawerBox || !navBox) {
    return;
  }

  expect(drawerBox.width).toBeGreaterThanOrEqual(navBox.width - 36);
  expect(Math.abs(drawerBox.y + drawerBox.height - navBox.y)).toBeLessThanOrEqual(1.5);
});

test("context-nav CDR-005 dark theme with magnification keeps an opaque readable drawer surface", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=accessibility&theme=dark&dir=ltr&zoom=100&accent=%237c3aed&ref=CDR-005",
  );

  const drawer = page.locator("#accessibility-drawer");
  const closeButton = page.locator("#accessibility-close");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");
  const subNav = page.locator("#context-nav-preview-shell .sub-nav");
  const currentCanonical = page.locator("#context-nav-canonical-current");

  await expect(drawer).toBeVisible();
  await expect(closeButton).toBeVisible();
  await expect(contextNav).toBeVisible();
  await expect(subNav).toBeVisible();
  await expect(currentCanonical).toHaveText("CDR-005 - Dark theme with magnification");

  const appearanceState = await page.evaluate(() => {
    const drawerNode = document.getElementById("accessibility-drawer");
    const shell = document.getElementById("context-nav-preview-shell");
    const railNode = shell?.querySelector(":scope > .context-nav");
    const topNavNode = shell?.querySelector(":scope > .top-nav");
    const computed = drawerNode ? window.getComputedStyle(drawerNode) : null;
    const railComputed = railNode ? window.getComputedStyle(railNode) : null;
    const topNavComputed = topNavNode ? window.getComputedStyle(topNavNode) : null;
    return {
      backgroundColor: computed?.backgroundColor ?? "",
      shellScale: shell?.style.getPropertyValue("--ui-scale") ?? "",
      railTopBorderWidth: railComputed?.borderTopWidth ?? "",
      topNavLeftBorderWidth: topNavComputed?.borderLeftWidth ?? "",
    };
  });

  expect(appearanceState.backgroundColor).toBe("rgb(18, 26, 43)");
  expect(appearanceState.shellScale).toBe("1.5");
  expect(appearanceState.railTopBorderWidth).toBe("0px");
  expect(appearanceState.topNavLeftBorderWidth).toBe("0px");

  const closeButtonBox = await closeButton.boundingBox();
  const drawerBox = await drawer.boundingBox();
  const contextNavBox = await contextNav.boundingBox();
  const subNavBox = await subNav.boundingBox();

  expect(closeButtonBox).not.toBeNull();
  expect(drawerBox).not.toBeNull();
  expect(contextNavBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();

  if (!closeButtonBox || !drawerBox || !contextNavBox || !subNavBox) {
    return;
  }

  expect(Math.abs(closeButtonBox.width - closeButtonBox.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(drawerBox.y - contextNavBox.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(drawerBox.y - (subNavBox.y + subNavBox.height))).toBeLessThanOrEqual(1);
});

test("context-nav CDR-006 alternate-theme readability state keeps stable drawer geometry with long labels", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=accessibility&theme=desert&dir=ltr&zoom=50&accent=%230f766e&ref=CDR-006",
  );

  const drawer = page.locator("#accessibility-drawer");
  const closeButton = page.locator("#accessibility-close");
  const currentCanonical = page.locator("#context-nav-canonical-current");
  const drawerGroups = page.locator("#accessibility-drawer .accessibility-group");

  await expect(drawer).toBeVisible();
  await expect(closeButton).toBeVisible();
  await expect(currentCanonical).toHaveText("CDR-006 - Long-label readability and alternate theme");
  await expect(drawerGroups).toHaveCount(4);

  const appearanceState = await page.evaluate(() => {
    const drawerNode = document.getElementById("accessibility-drawer");
    const shell = document.getElementById("context-nav-preview-shell");
    const layout = document.querySelector("#context-nav-preview-frame")?.closest(".canonical-render-layout");
    const computed = drawerNode ? window.getComputedStyle(drawerNode) : null;
    return {
      backgroundColor: computed?.backgroundColor ?? "",
      introTheme: document.querySelector(".canonical-render-intro")?.closest("[data-theme-scope]")?.getAttribute("data-theme-scope") ?? "",
      layoutTheme: layout instanceof HTMLElement ? layout.dataset.themeScope ?? "" : "",
      shellTheme: shell instanceof HTMLElement ? shell.dataset.themeScope ?? "" : "",
      shellScale: shell?.style.getPropertyValue("--ui-scale") ?? "",
    };
  });

  expect(appearanceState.backgroundColor).toBe("rgb(255, 253, 247)");
  expect(appearanceState.introTheme).toBe("");
  expect(appearanceState.layoutTheme).toBe("");
  expect(appearanceState.shellTheme).toBe("desert");
  expect(appearanceState.shellScale).toBe("1.25");

  const drawerBox = await drawer.boundingBox();
  const closeButtonBox = await closeButton.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(closeButtonBox).not.toBeNull();

  if (!drawerBox || !closeButtonBox) {
    return;
  }

  expect(drawerBox.width).toBeGreaterThan(360);
  expect(Math.abs(closeButtonBox.width - closeButtonBox.height)).toBeLessThanOrEqual(1);
});

test("context-nav DSR-001 desktop canonical shows the real grouped display-settings payload with semantic active state", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-001");

  const currentCanonical = page.locator("#context-nav-canonical-current");
  const drawer = page.locator("#accessibility-drawer");
  const groups = page.locator("#accessibility-drawer .accessibility-group");
  const themeNormal = page.locator("#accessibility-drawer [data-theme-option='normal']");
  const magnificationZero = page.locator("#accessibility-drawer [data-magnification-option='0']");
  const accentIndigo = page.locator("#accessibility-drawer [data-accent='#635bff']");
  const directionLtr = page.locator("#accessibility-drawer [data-direction-option='ltr']");

  await expect(currentCanonical).toHaveText("DSR-001 - Desktop grouped payload baseline");
  await expect(drawer).toBeVisible();
  await expect(groups).toHaveCount(4);
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='theme-group']")).toHaveText("Theme");
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='magnification-group']")).toHaveText("Magnification");
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='accent-group']")).toHaveText("Primary Colour");
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='direction-group']")).toHaveText("Direction");
  await expect(themeNormal).toHaveAttribute("aria-pressed", "true");
  await expect(magnificationZero).toHaveAttribute("aria-pressed", "true");
  await expect(accentIndigo).toHaveAttribute("aria-pressed", "true");
  await expect(directionLtr).toHaveAttribute("aria-pressed", "true");
});

test("display-settings canonical launcher links every reference to the dedicated generated render route", async ({ page }) => {
  await page.goto("/design-system/canonical-renderings/display-settings");

  await expect(page.locator(".canonical-launcher-button")).toHaveCount(displaySettingsCanonicalStates.length);

  for (const state of displaySettingsCanonicalStates) {
    await expect(
      page.locator(`.canonical-launcher-button[href="${displaySettingsCanonicalRenderRoute(state.refId)}"]`),
      `${state.refId} should target its generated render route`,
    ).toHaveCount(1);
  }
});

test("display-settings generated route owns the context-nav render surface", async ({ page }) => {
  await page.goto(displaySettingsCanonicalRenderRoute("DSR-001"));

  await expectRouteSurfaceTruth(page, {
    expectedPath: displaySettingsCanonicalRenderRoute("DSR-001"),
    surfaceLocator: "#context-nav-preview-shell",
    waitForReadyLocator: "#accessibility-drawer",
    bodyAttribute: {
      name: "data-context-nav-surface",
      value: "canonical",
    },
    fallbackHeading: /Design-System Route Families/i,
  });
  await expect(page.locator("#context-nav-canonical-current")).toHaveText(
    "DSR-001 - Desktop grouped payload baseline",
  );
});

test("generated display-settings canonical keeps its drawer inside the render frame", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-001");

  const currentCanonical = page.locator("#context-nav-canonical-current");
  const drawer = page.locator("#accessibility-drawer");

  await expect(currentCanonical).toHaveText("DSR-001 - Desktop grouped payload baseline");
  await expect(drawer).toBeVisible();
  await expectCanonicalOverlayContainedInRenderSurface(page, {
    label: "DSR-001 generated display-settings drawer",
    overlay: "#accessibility-drawer",
    panel: "#accessibility-drawer",
    hostSurface: "#context-nav-preview-shell",
    renderFrame: "#context-nav-preview-frame",
    below: ".canonical-render-intro",
    requirePanelWidthWithinHost: true,
  });
});

test("context-nav DSR-003 RTL canonical mirrors the display-settings payload with Arabic copy", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-003");

  const currentCanonical = page.locator("#context-nav-canonical-current");
  const drawer = page.locator("#accessibility-drawer");
  const shell = page.locator("#context-nav-preview-shell");

  await expect(currentCanonical).toHaveText("DSR-003 - RTL mirrored payload");
  await expect(drawer).toBeVisible();
  await expect(shell).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='title']")).toHaveText("إعدادات العرض");
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='theme-group']")).toHaveText("المظهر");
  await expect(page.locator("#accessibility-drawer [data-display-settings-copy='direction-group']")).toHaveText("الاتجاه");
  await expect(page.locator("#accessibility-drawer [data-direction-option='rtl']")).toHaveText("من اليمين إلى اليسار");
  await expect(page.locator("#accessibility-close")).toHaveAttribute("aria-label", "إغلاق إعدادات العرض");
});

test("context-nav DSR-002 dark theme canonical keeps the grouped display-settings payload readable under magnification", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-002");

  const currentCanonical = page.locator("#context-nav-canonical-current");
  const drawer = page.locator("#accessibility-drawer");
  const shell = page.locator("#context-nav-preview-shell");

  await expect(currentCanonical).toHaveText("DSR-002 - Dark theme and enlarged payload");
  await expect(drawer).toBeVisible();
  await expect(page.locator("#accessibility-drawer .accessibility-group")).toHaveCount(4);
  await expect(page.locator("#accessibility-drawer [data-theme-option='dark']")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#accessibility-drawer [data-magnification-option='100']")).toHaveAttribute("aria-pressed", "true");
  await expect(shell).toHaveAttribute("data-magnification", "100");

  const darkInkState = await page.evaluate(() => {
    const readColor = (selector: string) => {
      const node = document.querySelector(selector);
      return node instanceof HTMLElement ? window.getComputedStyle(node).color : "";
    };

    return {
      title: readColor("#accessibility-title"),
      eyebrow: readColor("#accessibility-drawer [data-display-settings-copy='eyebrow']"),
      themeLabel: readColor("#accessibility-drawer [data-display-settings-copy='theme-group']"),
      normalChip: readColor("#accessibility-drawer [data-theme-option='normal']"),
      darkChip: readColor("#accessibility-drawer [data-theme-option='dark']"),
      magnificationChip: readColor("#accessibility-drawer [data-magnification-option='100']"),
    };
  });

  expect(darkInkState.title).toBe("rgb(236, 240, 255)");
  expect(darkInkState.eyebrow).toBe("rgb(180, 190, 216)");
  expect(darkInkState.themeLabel).toBe("rgb(180, 190, 216)");
  expect(darkInkState.normalChip).toBe("rgb(180, 190, 216)");
  expect(darkInkState.darkChip).toBe("rgb(236, 240, 255)");
  expect(darkInkState.magnificationChip).toBe("rgb(236, 240, 255)");
});

test("context-nav DSR-004 mobile canonical keeps the full display-settings payload usable inside the bottom sheet", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-004");

  const currentCanonical = page.locator("#context-nav-canonical-current");
  const drawer = page.locator("#accessibility-drawer");
  const groups = page.locator("#accessibility-drawer .accessibility-group");
  const contextNav = page.locator("#context-nav-preview-shell > .context-nav");

  await expect(currentCanonical).toHaveText("DSR-004 - Mobile bottom-sheet payload");
  await expect(drawer).toBeVisible();
  await expect(groups).toHaveCount(4);

  const drawerBox = await drawer.boundingBox();
  const navBox = await contextNav.boundingBox();

  expect(drawerBox).not.toBeNull();
  expect(navBox).not.toBeNull();

  if (!drawerBox || !navBox) {
    return;
  }

  expect(drawerBox.width).toBeGreaterThanOrEqual(navBox.width - 36);
  expect(Math.abs(drawerBox.y + drawerBox.height - navBox.y)).toBeLessThanOrEqual(1.5);
});

test("context-nav DSR-005 reduced magnification canonical keeps the low-end display-settings control reload-safe", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-005");

  const currentCanonical = page.locator("#context-nav-canonical-current");
  const shell = page.locator("#context-nav-preview-shell");
  const magnificationNegative = page.locator("#accessibility-drawer [data-magnification-option='-100']");
  const accentBlue = page.locator("#accessibility-drawer [data-accent='#2563eb']");

  await expect(currentCanonical).toHaveText("DSR-005 - Reduced magnification and accent sweep");
  await expect(magnificationNegative).toHaveAttribute("aria-pressed", "true");
  await expect(accentBlue).toHaveAttribute("aria-pressed", "true");
  await expect(shell).toHaveAttribute("data-magnification", "-100");
});

test("context-nav drawer keyboard open moves focus to the close control and Escape returns focus to the launcher", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const launcher = page.locator("#accessibility-button");
  const drawer = page.locator("#accessibility-drawer");
  const closeButton = page.locator("#accessibility-close");

  await expect(launcher).toBeVisible();
  await launcher.focus();
  await page.keyboard.press("Enter");

  await expect(drawer).toBeVisible();
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");

  await expect(drawer).toBeHidden();
  await expect(launcher).toBeFocused();
});

test("context-nav drawer outside-click close returns focus to the launcher", async ({ page }) => {
  await page.goto(
    "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
  );

  const launcher = page.locator("#accessibility-button");
  const drawer = page.locator("#accessibility-drawer");
  const closeButton = page.locator("#accessibility-close");
  const content = page.locator(".context-nav-preview-body");

  await expect(launcher).toBeVisible();
  await launcher.focus();
  await page.keyboard.press("Enter");

  await expect(drawer).toBeVisible();
  await expect(closeButton).toBeFocused();

  await content.click();

  await expect(drawer).toBeHidden();
  await expect(launcher).toBeFocused();
});

test("context-nav display-settings controls do not close the drawer when a setting is selected", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-001");

  const drawer = page.locator("#accessibility-drawer");
  const darkThemeButton = page.locator("#accessibility-drawer [data-theme-option='dark']");
  const rtlButton = page.locator("#accessibility-drawer [data-direction-option='rtl']");
  const reducedMagnificationButton = page.locator("#accessibility-drawer [data-magnification-option='-100']");

  await expect(drawer).toBeVisible();

  await darkThemeButton.click();
  await expect(drawer).toBeVisible();
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "true");

  await rtlButton.click();
  await expect(drawer).toBeVisible();
  await expect(rtlButton).toHaveAttribute("aria-pressed", "true");

  await reducedMagnificationButton.click();
  await expect(drawer).toBeVisible();
  await expect(reducedMagnificationButton).toHaveAttribute("aria-pressed", "true");
});

test("context-nav display-settings drawer uses the signed-off context-nav scrollbar styling", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-002");

  const scrollbarState = await page.evaluate(() => {
    const drawer = document.getElementById("accessibility-drawer");
    if (!(drawer instanceof HTMLElement)) {
      return null;
    }

    const computed = window.getComputedStyle(drawer);
    const track = window.getComputedStyle(drawer, "::-webkit-scrollbar-track");
    const thumb = window.getComputedStyle(drawer, "::-webkit-scrollbar-thumb");

    return {
      scrollbarWidth: computed.scrollbarWidth,
      scrollbarColor: computed.scrollbarColor,
      trackBackground: track.backgroundColor,
      thumbBackground: thumb.backgroundColor,
      thumbBorderRadius: thumb.borderRadius,
    };
  });

  expect(scrollbarState).not.toBeNull();

  if (!scrollbarState) {
    return;
  }

  expect(scrollbarState.scrollbarWidth).toBe("thin");
  expect(scrollbarState.scrollbarColor).not.toBe("auto");
  expect(scrollbarState.trackBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(scrollbarState.thumbBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(scrollbarState.thumbBorderRadius).toBe("999px");
});

test("design-system page scroll uses the signed-off context-nav scrollbar styling", async ({ page }) => {
  await gotoGeneratedDisplaySettingsCanonical(page, "DSR-002");

  const pageScrollbarState = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = window.getComputedStyle(root);
    const track = window.getComputedStyle(root, "::-webkit-scrollbar-track");
    const thumb = window.getComputedStyle(root, "::-webkit-scrollbar-thumb");

    return {
      scrollbarWidth: computed.scrollbarWidth,
      scrollbarColor: computed.scrollbarColor,
      trackBackground: track.backgroundColor,
      thumbBackground: thumb.backgroundColor,
      thumbBorderRadius: thumb.borderRadius,
    };
  });

  expect(pageScrollbarState.scrollbarWidth).toBe("thin");
  expect(pageScrollbarState.scrollbarColor).not.toBe("auto");
  expect(pageScrollbarState.trackBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(pageScrollbarState.thumbBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(pageScrollbarState.thumbBorderRadius).toBe("999px");
});
