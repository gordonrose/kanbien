import { expect, test, type Page } from "@playwright/test";

async function gotoBrochurePage(page: Page, viewport = { width: 1440, height: 1400 }) {
  await page.setViewportSize(viewport);
  await page.goto("/design-system/patterns/brochure-page");
  await page.locator("[data-brochure-preview]").waitFor({ state: "visible" });
}

async function getColumnCount(page: Page, selector: string) {
  return page.locator(selector).evaluate((node) =>
    getComputedStyle(node)
      .gridTemplateColumns.split(" ")
      .map((column) => column.trim())
      .filter(Boolean).length,
  );
}

test.describe("design-system brochure page pattern", () => {
  test("renders the requested desktop brochure sections with expected column rhythms", async ({ page }) => {
    await gotoBrochurePage(page);

    await expect(page.locator("[data-brochure-section='top-nav']")).toBeVisible();
    await expect(page.locator("[data-brochure-section='hero']")).toBeVisible();
    await expect(page.locator("[data-brochure-section='value-strip']")).toBeVisible();
    await expect(page.locator("[data-brochure-section='tile-mosaic']")).toBeVisible();
    await expect(page.locator("[data-brochure-section='media-band']")).toBeVisible();
    await expect(page.locator("[data-brochure-section='logo-bar']")).toBeVisible();
    await expect(page.locator("[data-brochure-section='footer']")).toBeVisible();

    await expect(page.locator(".brochure-hero-media img")).toHaveAttribute("src", /brochure-hero\.svg/);
    await expect(page.locator(".brochure-mosaic-tile img")).toHaveCount(5);
    await expect(page.locator(".brochure-site-nav .brand-mark")).toHaveText("K");
    await expect(page.locator(".brochure-site-nav .brand-copy")).toContainText("Kanbien");
    await expect(page.locator(".brochure-site-nav .nav-link")).toHaveCount(4);
    await expect(page.locator(".brochure-site-nav .profile-button")).toHaveCount(0);
    await expect(page.locator(".brochure-site-nav .nav-utilities")).toHaveCount(0);
    await expect(page.locator("#accessibility-button")).toBeVisible();
    await expect(page.locator("#accessibility-drawer")).toHaveAttribute("aria-hidden", "true");

    expect(await getColumnCount(page, ".brochure-value-strip")).toBe(4);
    expect(await getColumnCount(page, ".brochure-mosaic-grid")).toBe(4);
    expect(await getColumnCount(page, ".brochure-logo-bar")).toBe(5);
    expect(await getColumnCount(page, ".brochure-footer")).toBe(4);
  });

  test("uses a two-by-two featured mosaic tile beside four standard tiles", async ({ page }) => {
    await gotoBrochurePage(page);

    const mosaicState = await page.evaluate(() => {
      const grid = document.querySelector(".brochure-mosaic-grid");
      const featured = document.querySelector("[data-brochure-mosaic-tile='featured']");
      const standardTiles = Array.from(document.querySelectorAll("[data-brochure-mosaic-tile='standard']"));

      if (!(grid instanceof HTMLElement) || !(featured instanceof HTMLElement)) {
        return null;
      }

      const gridStyle = getComputedStyle(grid);
      const featuredStyle = getComputedStyle(featured);
      const featuredRect = featured.getBoundingClientRect();
      const standardRects = standardTiles
        .filter((tile): tile is HTMLElement => tile instanceof HTMLElement)
        .map((tile) => tile.getBoundingClientRect());
      const sortedStandardRects = [...standardRects].sort((left, right) =>
        Math.round(left.top) - Math.round(right.top) || Math.round(left.left) - Math.round(right.left),
      );

      return {
        layout: grid.dataset.brochureMosaicLayout ?? "",
        gridColumns: gridStyle.gridTemplateColumns.split(" ").filter(Boolean).length,
        gridGap: gridStyle.gap,
        gridLineHeight: gridStyle.lineHeight,
        featuredBorderRadius: featuredStyle.borderRadius,
        featuredBorderTopWidth: featuredStyle.borderTopWidth,
        featuredColumnStart: featuredStyle.gridColumnStart,
        featuredRowStart: featuredStyle.gridRowStart,
        standardCount: standardRects.length,
        standardLeftEdges: Array.from(new Set(standardRects.map((rect) => Math.round(rect.left)))).length,
        featuredToStandardGap: Math.round(sortedStandardRects[0]?.left ?? 0) - Math.round(featuredRect.right),
        standardHorizontalGap: Math.round(sortedStandardRects[1]?.left ?? 0) - Math.round(sortedStandardRects[0]?.right ?? 0),
        standardVerticalGap: Math.round(sortedStandardRects[2]?.top ?? 0) - Math.round(sortedStandardRects[0]?.bottom ?? 0),
        featuredWidth: Math.round(featuredRect.width),
        standardWidth: Math.round(standardRects[0]?.width ?? 0),
        featuredHeight: Math.round(featuredRect.height),
        standardHeight: Math.round(standardRects[0]?.height ?? 0),
      };
    });

    expect(mosaicState).not.toBeNull();
    expect(mosaicState?.layout).toBe("featured-plus-four");
    expect(mosaicState?.gridColumns).toBe(4);
    expect(mosaicState?.gridGap).toBe("0px");
    expect(mosaicState?.gridLineHeight).toBe("0px");
    expect(mosaicState?.featuredBorderRadius).toBe("0px");
    expect(mosaicState?.featuredBorderTopWidth).toBe("0px");
    expect(mosaicState?.featuredColumnStart).toBe("span 2");
    expect(mosaicState?.featuredRowStart).toBe("span 2");
    expect(mosaicState?.standardCount).toBe(4);
    expect(mosaicState?.standardLeftEdges).toBe(2);
    expect(Math.abs(mosaicState?.featuredToStandardGap ?? 0)).toBeLessThanOrEqual(1);
    expect(Math.abs(mosaicState?.standardHorizontalGap ?? 0)).toBeLessThanOrEqual(1);
    expect(Math.abs(mosaicState?.standardVerticalGap ?? 0)).toBeLessThanOrEqual(1);
    expect(mosaicState?.featuredWidth ?? 0).toBeGreaterThan((mosaicState?.standardWidth ?? 0) * 1.8);
    expect(mosaicState?.featuredHeight ?? 0).toBeGreaterThan((mosaicState?.standardHeight ?? 0) * 1.8);
  });

  test("uses square image canvases for the mosaic assets", async ({ request }) => {
    const assetPaths = [
      "/design-system/assets/brochure-tile-research.svg",
      "/design-system/assets/brochure-tile-platform.svg",
      "/design-system/assets/brochure-tile-trust.svg",
      "/design-system/assets/brochure-tile-growth.svg",
      "/design-system/assets/brochure-tile-campaign.svg",
    ];

    for (const assetPath of assetPaths) {
      const response = await request.get(assetPath);
      expect(response.ok()).toBe(true);

      const body = await response.text();
      expect(body).not.toMatch(/<rect width="(?:720|960)" height="(?:520|680)" rx=/);
    }
  });

  test("opens the display-settings drawer and applies runtime display controls", async ({ page }) => {
    await gotoBrochurePage(page);

    const drawerButton = page.locator("#accessibility-button");
    const drawer = page.locator("#accessibility-drawer");

    await drawerButton.click();
    await expect(drawerButton).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator("#accessibility-close")).toBeFocused();

    await expect(drawer.getByRole("group", { name: "Theme" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Magnification" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Primary colour" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Direction" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Brochure section rhythm" })).toBeVisible();
    await expect(drawer.getByRole("group", { name: "Brochure media emphasis" })).toHaveCount(0);
    await expect(drawer.getByRole("group", { name: "Brochure mosaic copy" })).toHaveCount(0);
    await expect(drawer.getByRole("group", { name: "Brochure font type" })).toHaveCount(0);
    await expect(drawer.getByRole("group", { name: "Brochure font weight" })).toHaveCount(0);
    await expect(drawer.getByLabel("Background colour")).toBeVisible();
    await expect(drawer.getByLabel("Font colour")).toBeVisible();
    await expect(drawer.getByLabel("Font size")).toHaveCount(0);
    await expect(drawer.getByLabel("Editable state")).toBeVisible();

    await drawer.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(drawer.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");

    await drawer.getByRole("button", { name: "+50%" }).click();
    await expect
      .poll(async () => page.locator("html").evaluate((node) => node.style.getPropertyValue("--ui-scale").trim()))
      .toBe("1.25");
    await expect(drawer.getByRole("button", { name: "+50%" })).toHaveAttribute("aria-pressed", "true");

    await drawer.getByRole("button", { name: "Right to left" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(drawer.locator("[data-direction-option='rtl']")).toHaveAttribute("aria-pressed", "true");

    const preview = page.locator("[data-brochure-preview]");
    await drawer.getByRole("button", { name: "Spacious" }).click();
    await expect(preview).toHaveAttribute("data-brochure-density", "spacious");
    await expect(drawer.locator("[data-brochure-density='spacious']")).toHaveAttribute("aria-pressed", "true");
    await expect
      .poll(async () => preview.evaluate((node) => getComputedStyle(node).getPropertyValue("--brochure-zone-gap").trim()))
      .not.toBe("");

    await drawer.getByLabel("Background colour").fill("#112233");
    await expect
      .poll(async () => preview.evaluate((node) => getComputedStyle(node).getPropertyValue("--brochure-background-color").trim()))
      .toBe("#112233");
    await expect(page.locator(".brochure-preview")).toHaveCSS("background-color", "rgb(17, 34, 51)");
    await expect(page.locator(".brochure-media-band")).toHaveCSS("background-color", "rgb(17, 34, 51)");
    await expect(page.locator(".brochure-mosaic")).toHaveCSS("background-color", "rgb(17, 34, 51)");

    await drawer.getByLabel("Font colour").fill("#ffeeaa");
    await expect
      .poll(async () => preview.evaluate((node) => getComputedStyle(node).getPropertyValue("--brochure-font-color").trim()))
      .toBe("#ffeeaa");

    await page.locator("#accessibility-close").click();
    await expect(drawer).toBeHidden();
    await expect(drawerButton).toBeFocused();
  });

  test("toggles editable state and opens the edit drawer from container and boundary handles", async ({ page }) => {
    await gotoBrochurePage(page);

    const displayDrawerButton = page.locator("#accessibility-button");
    const displayDrawer = page.locator("#accessibility-drawer");
    const preview = page.locator("[data-brochure-preview]");
    const hero = page.locator("[data-brochure-section='hero']");
    const heroEditButton = page.getByRole("button", { name: "Edit hero container" });
    const boundaryEditButton = page.getByRole("button", { name: "Edit boundary between hero and value highlights" });
    const editDrawer = page.locator("#brochure-edit-drawer");

    await expect(preview).toHaveAttribute("data-brochure-editable", "false");
    await expect(heroEditButton).toBeHidden();
    await expect(boundaryEditButton).toBeHidden();
    await expect(editDrawer).toHaveAttribute("aria-hidden", "true");

    await displayDrawerButton.click();
    await displayDrawer.getByLabel("Editable state").check();
    await expect(preview).toHaveAttribute("data-brochure-editable", "true");

    await hero.hover();
    await expect(heroEditButton).toBeVisible();
    await heroEditButton.click();
    await expect(displayDrawer).toBeHidden();
    await expect(editDrawer).toBeVisible();
    await expect(editDrawer).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator(".brochure-pattern-page")).toHaveAttribute("data-brochure-edit-drawer-open", "true");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-eyebrow]")).toHaveText("Brochure container");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-title]")).toHaveText("Edit Hero");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-copy]")).toContainText("Field-specific controls will be defined");

    const splitState = await page.evaluate(() => {
      const preview = document.querySelector("[data-brochure-preview]");
      const drawer = document.querySelector("#brochure-edit-drawer");
      const contextNav = document.querySelector(".design-system-shell > .context-nav");
      const topNav = document.querySelector(".design-system-shell > .top-nav");
      const subNav = document.querySelector(".design-system-shell > .sub-nav");
      if (!(preview instanceof HTMLElement) || !(drawer instanceof HTMLElement) || !(contextNav instanceof HTMLElement)) {
        return null;
      }

      const previewRect = preview.getBoundingClientRect();
      const drawerRect = drawer.getBoundingClientRect();
      const contextNavRect = contextNav.getBoundingClientRect();
      const shellHeaderBottom = Math.ceil(Math.max(
        topNav instanceof HTMLElement ? topNav.getBoundingClientRect().bottom : 0,
        subNav instanceof HTMLElement ? subNav.getBoundingClientRect().bottom : 0,
      ));
      return {
        previewLeft: Math.round(previewRect.left),
        drawerTop: Math.round(drawerRect.top),
        previewRight: Math.round(previewRect.right),
        drawerLeft: Math.round(drawerRect.left),
        drawerRight: Math.round(drawerRect.right),
        previewWidth: Math.round(previewRect.width),
        drawerWidth: Math.round(drawerRect.width),
        contextNavRight: Math.round(contextNavRect.right),
        shellHeaderBottom,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(splitState).not.toBeNull();
    expect(splitState?.previewLeft ?? 0).toBeGreaterThanOrEqual((splitState?.contextNavRight ?? 0) - 1);
    expect(splitState?.drawerTop ?? 0).toBeGreaterThanOrEqual((splitState?.shellHeaderBottom ?? 0) - 1);
    expect(splitState?.drawerLeft ?? 0).toBeGreaterThan(splitState?.previewRight ?? 0);
    expect(Math.abs((splitState?.drawerRight ?? 0) - (splitState?.viewportWidth ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((splitState?.drawerWidth ?? 0) - (splitState?.previewWidth ?? 0))).toBeLessThanOrEqual(90);

    await page.locator("#brochure-edit-drawer-close").click();
    await expect(editDrawer).toBeHidden();
    await expect(page.locator(".brochure-pattern-page")).toHaveAttribute("data-brochure-edit-drawer-open", "false");

    await boundaryEditButton.focus();
    await expect(boundaryEditButton).toBeVisible();
    await boundaryEditButton.click();
    await expect(editDrawer.locator("[data-brochure-edit-drawer-eyebrow]")).toHaveText("Brochure boundary");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-title]")).toHaveText("Edit Hero / value highlights boundary");
  });

  test("opens the edit drawer from text and image edit affordances", async ({ page }) => {
    await gotoBrochurePage(page);

    const displayDrawer = page.locator("#accessibility-drawer");
    const editDrawer = page.locator("#brochure-edit-drawer");
    const heroHeadline = page.locator(".brochure-hero-copy h2");
    const heroImage = page.locator(".brochure-hero-media img");

    await page.locator("#accessibility-button").click();
    await displayDrawer.getByLabel("Editable state").check();
    await page.locator("#accessibility-close").click();

    await heroHeadline.hover();
    await page.getByRole("button", { name: /Edit Hero headline text/ }).click();
    await expect(editDrawer.locator("[data-brochure-edit-drawer-eyebrow]")).toHaveText("Brochure text");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-title]")).toContainText("Edit Hero headline text");
    await page.locator("#brochure-edit-drawer-close").click();

    await heroImage.hover();
    await page.getByRole("button", { name: "Edit Hero image" }).click();
    await expect(editDrawer.locator("[data-brochure-edit-drawer-eyebrow]")).toHaveText("Brochure image");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-title]")).toHaveText("Edit Hero image");
  });

  test("opens the edit drawer from value bar icon affordances", async ({ page }) => {
    await gotoBrochurePage(page);

    const displayDrawer = page.locator("#accessibility-drawer");
    const editDrawer = page.locator("#brochure-edit-drawer");
    const firstValueIcon = page.locator(".brochure-value-icon").first();

    await page.locator("#accessibility-button").click();
    await displayDrawer.getByLabel("Editable state").check();
    await page.locator("#accessibility-close").click();

    await firstValueIcon.hover();
    await page.getByRole("button", { name: "Edit Value highlights icon" }).click();

    await expect(editDrawer.locator("[data-brochure-edit-drawer-eyebrow]")).toHaveText("Brochure icon");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-title]")).toHaveText("Edit Value highlights icon");
  });

  test("opens the edit drawer from a tile-level edit affordance", async ({ page }) => {
    await gotoBrochurePage(page);

    const displayDrawer = page.locator("#accessibility-drawer");
    const editDrawer = page.locator("#brochure-edit-drawer");
    const firstTile = page.locator(".brochure-mosaic-tile").first();
    const tileEditButton = page.getByRole("button", { name: "Edit research tile" });

    await page.locator("#accessibility-button").click();
    await displayDrawer.getByLabel("Editable state").check();
    await page.locator("#accessibility-close").click();

    await firstTile.hover();
    await expect(tileEditButton).toBeVisible();
    await tileEditButton.hover();
    await expect(tileEditButton).toHaveCSS("background-color", "rgb(99, 91, 255)");
    await tileEditButton.click();

    await expect(editDrawer.locator("[data-brochure-edit-drawer-eyebrow]")).toHaveText("Brochure tile");
    await expect(editDrawer.locator("[data-brochure-edit-drawer-title]")).toHaveText("Edit Research tile");
  });

  test("reveals mosaic paragraph content on keyboard focus", async ({ page }) => {
    await gotoBrochurePage(page);

    const firstTile = page.locator(".brochure-mosaic-tile").first();
    const reveal = firstTile.locator(".brochure-mosaic-copy");

    await expect(reveal).toHaveCSS("opacity", "0");
    await firstTile.focus();
    await expect(firstTile).toBeFocused();
    await expect(reveal).toHaveCSS("opacity", "1");
    await expect(reveal).toContainText("The featured tile spans two columns");
  });

  test("collapses to a one-column mobile flow without horizontal overflow", async ({ page }) => {
    await gotoBrochurePage(page, { width: 390, height: 1200 });

    expect(await getColumnCount(page, ".brochure-value-strip")).toBe(1);
    expect(await getColumnCount(page, ".brochure-mosaic-grid")).toBe(1);
    expect(await getColumnCount(page, ".brochure-logo-bar")).toBe(1);
    expect(await getColumnCount(page, ".brochure-footer")).toBe(1);

    const overflowState = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(overflowState.scrollWidth).toBeLessThanOrEqual(overflowState.clientWidth + 1);
  });

  test("keeps the pattern contained when reviewed in rtl", async ({ page }) => {
    await gotoBrochurePage(page, { width: 1280, height: 1200 });
    await page.locator("html").evaluate((node) => node.setAttribute("dir", "rtl"));

    const containment = await page.evaluate(() => {
      const preview = document.querySelector("[data-brochure-preview]");
      if (!(preview instanceof HTMLElement)) {
        return null;
      }

      const rect = preview.getBoundingClientRect();
      return {
        left: Math.floor(rect.left),
        right: Math.ceil(rect.right),
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(containment).not.toBeNull();
    expect(containment?.left).toBeGreaterThanOrEqual(0);
    expect(containment?.right).toBeLessThanOrEqual((containment?.viewportWidth ?? 0) + 1);
  });
});
