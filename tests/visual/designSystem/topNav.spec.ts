import { expect, test, type Page } from "@playwright/test";

const topNavCanonicalStates = [
  {
    refId: "TRP-001",
    label: "desktop default",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-001-desktop-default.png",
  },
  {
    refId: "TRP-002",
    label: "desktop overflow",
    route:
      "/design-system/components/top-nav?width=880&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-002-desktop-overflow.png",
  },
  {
    refId: "TRP-003",
    label: "desktop threshold before mobile",
    route:
      "/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-003-threshold-before-mobile.png",
  },
  {
    refId: "TRP-004",
    label: "mobile shell closed",
    route:
      "/design-system/components/top-nav?width=560&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-004-mobile-shell-closed.png",
  },
  {
    refId: "TRP-005",
    label: "mobile shell open",
    route:
      "/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-005-mobile-shell-open.png",
  },
  {
    refId: "TRP-006",
    label: "desktop profile menu open",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-006-profile-menu-open.png",
  },
  {
    refId: "TRP-007",
    label: "desktop overflow menu open",
    route:
      "/design-system/components/top-nav?width=880&fixture=standard&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-007-overflow-menu-open.png",
  },
  {
    refId: "TRP-008",
    label: "rtl desktop",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff",
    screenshot: "trp-008-rtl-desktop.png",
  },
  {
    refId: "TRP-009",
    label: "rtl mobile",
    route:
      "/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=rtl&zoom=0&accent=%23635bff",
    screenshot: "trp-009-rtl-mobile.png",
  },
  {
    refId: "TRP-010",
    label: "magnified desktop",
    route:
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff",
    screenshot: "trp-010-magnified-desktop.png",
  },
  {
    refId: "TRP-011",
    label: "long brand label",
    route:
      "/design-system/components/top-nav?width=1120&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-011-long-brand-label.png",
  },
  {
    refId: "TRP-012",
    label: "long primary destination label",
    route:
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-012-long-primary-label.png",
  },
  {
    refId: "TRP-013",
    label: "long profile trigger or menu label",
    route:
      "/design-system/components/top-nav?width=1120&fixture=long-labels&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-013-long-profile-label.png",
  },
  {
    refId: "TRP-014A",
    label: "theme variant normal",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-014a-theme-normal.png",
  },
  {
    refId: "TRP-014B",
    label: "theme variant dark",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=dark&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-014b-theme-dark.png",
  },
  {
    refId: "TRP-014C",
    label: "theme variant desert",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=desert&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-014c-theme-desert.png",
  },
  {
    refId: "TRP-015A",
    label: "primary-colour inheritance indigo",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    screenshot: "trp-015a-accent-indigo.png",
  },
  {
    refId: "TRP-015B",
    label: "primary-colour inheritance violet",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%237c3aed",
    screenshot: "trp-015b-accent-violet.png",
  },
] as const;

async function gotoCanonicalState(page: Page, route: string) {
  await page.goto(route);
  await page.locator("#top-nav-preview-frame").waitFor({ state: "visible" });
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
      "/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
    );

    const topNav = page.locator(".top-nav");
    const visiblePrimaryLinks = page.locator("#primary-nav-links .nav-link:not(.hidden)");
    const overflow = page.locator("#primary-nav-overflow");

    await expect(topNav).not.toHaveClass(/force-mobile-nav/);
    const visibleLinkCount = await visiblePrimaryLinks.count();
    const overflowVisible = await overflow.isVisible();

    expect(overflowVisible && visibleLinkCount === 1).toBe(false);
  });

  test("TRP-010 reroutes pressure into overflow or mobile collapse before crowding", async ({ page }) => {
    await gotoCanonicalState(
      page,
      "/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff",
    );

    const topNav = page.locator(".top-nav");
    const overflow = page.locator("#primary-nav-overflow");

    await expect(topNav).toBeVisible();
    const topNavClass = await topNav.getAttribute("class");
    const overflowVisible = await overflow.isVisible();
    const forcedMobile = (topNavClass ?? "").includes("force-mobile-nav");

    expect(overflowVisible || forcedMobile).toBe(true);
  });
});
