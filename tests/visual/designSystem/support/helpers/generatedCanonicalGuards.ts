import { expect, test, type Page } from "@playwright/test";

type GeneratedCanonicalRoute = {
  label: string;
  href: string;
};

export async function readDesignSystemTopNavContract(page: Page) {
  await page.goto("/design-system");
  await expect.poll(async () => readTopNavLabels(page)).not.toContain("Resources");

  return page.evaluate(() => {
    const topNav = document.querySelector(".design-system-shell > .top-nav");
    const labels = Array.from(topNav?.querySelectorAll(".primary-nav-links .nav-link") ?? [])
      .map((link) => link.textContent?.trim() ?? "");

    return {
      labels,
      primaryLinksId: topNav?.querySelector(".primary-nav-links")?.id ?? "",
      overflowId: topNav?.querySelector(".primary-nav-overflow")?.id ?? "",
      mobileButtonId: topNav?.querySelector(".mobile-nav-button")?.id ?? "",
    };
  });
}

async function readTopNavLabels(page: Page) {
  return page.locator(".design-system-shell > .top-nav .primary-nav-links .nav-link").evaluateAll((links) =>
    links.map((link) => link.textContent?.trim() ?? ""),
  );
}

export async function expectGeneratedCanonicalShellContract(
  page: Page,
  route: string,
  designSystemTopNavContract: Awaited<ReturnType<typeof readDesignSystemTopNavContract>>,
  options: { requireExactLabels?: boolean } = {},
) {
  const requireExactLabels = options.requireExactLabels ?? true;

  await test.step(`generated canonical shell contract: ${route}`, async () => {
    await page.goto(route);

    const shellNavState = await page.evaluate(() => {
      const topNav = document.querySelector(".design-system-shell > .top-nav");
      const labels = Array.from(topNav?.querySelectorAll(".primary-nav-links .nav-link") ?? [])
        .map((link) => link.textContent?.trim() ?? "");

      return {
        hasTopNav: topNav instanceof HTMLElement,
        labels,
        hasProfileButton: topNav?.querySelector(".profile-button") instanceof HTMLElement,
        primaryLinksId: topNav?.querySelector(".primary-nav-links")?.id ?? "",
        overflowId: topNav?.querySelector(".primary-nav-overflow")?.id ?? "",
        mobileButtonId: topNav?.querySelector(".mobile-nav-button")?.id ?? "",
      };
    });

    expect(shellNavState.hasTopNav).toBe(true);
    expect(shellNavState.hasProfileButton).toBe(true);
    expect(shellNavState.primaryLinksId).toBe(designSystemTopNavContract.primaryLinksId);
    expect(shellNavState.overflowId).toBe(designSystemTopNavContract.overflowId);
    expect(shellNavState.mobileButtonId).toBe(designSystemTopNavContract.mobileButtonId);
    if (requireExactLabels) {
      await expect.poll(async () => readTopNavLabels(page)).toEqual(designSystemTopNavContract.labels);
    } else {
      expect(shellNavState.labels.length).toBeGreaterThan(0);
      expect(shellNavState.labels).toContain("Canonical Renderings");
      expect(shellNavState.labels).not.toContain("Pages");
      expect(shellNavState.labels).not.toContain("Resources");
    }
  });
}

export async function expectCanonicalRenderIntroOutsideThemeScope(page: Page, route: string) {
  await test.step(`canonical render intro stays outside local theme scope: ${route}`, async () => {
    await page.goto(route);

    const intro = page.locator(".canonical-render-intro");
    if (await intro.count() === 0) {
      return;
    }

    await expect(intro).toBeVisible();

    const introThemeState = await page.evaluate(() => {
      const intro = document.querySelector(".canonical-render-intro");
      const themedAncestor = intro?.closest("[data-theme-scope]");

      return {
        introHasThemedAncestor: themedAncestor instanceof HTMLElement,
        themedAncestorClassName: themedAncestor instanceof HTMLElement ? themedAncestor.className : "",
      };
    });

    expect(introThemeState.introHasThemedAncestor, introThemeState.themedAncestorClassName).toBe(false);
  });
}

export async function collectGeneratedCanonicalFamilyRoutes(page: Page): Promise<GeneratedCanonicalRoute[]> {
  await page.goto("/design-system/canonical-renderings");

  return page.locator(".canonical-launcher-grid a").evaluateAll((links) =>
    links.map((link) => ({
      label: link.textContent?.replace(/\s+/g, " ").trim() ?? "",
      href: link.getAttribute("href") ?? "",
    })).filter((route) => route.href.startsWith("/design-system/canonical-renderings/")),
  );
}

export async function collectGeneratedCanonicalRenderRoutes(page: Page, familyHref: string): Promise<GeneratedCanonicalRoute[]> {
  await page.goto(familyHref);
  await expect(page.locator(".canonical-launcher-button").first()).toBeVisible();

  return page.locator(".canonical-launcher-button").evaluateAll((links) =>
    links.map((link) => ({
      label: link.textContent?.replace(/\s+/g, " ").trim() ?? "",
      href: link.getAttribute("href") ?? "",
    })).filter((route) => /^\/design-system\/canonical-renderings\/[^/]+\/[^/]+$/.test(route.href)),
  );
}
