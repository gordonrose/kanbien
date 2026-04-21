import { expect, test, type Page } from "@playwright/test";

const canonicalShellRoutes = [
  {
    label: "canonical index",
    route: "/design-system/canonicals",
    current: "Canonicals",
    expectCanonicalLink: false,
    homeHref: "/design-system",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "top-nav canonical launcher",
    route: "/design-system/canonicals/top-nav",
    current: "Top Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "sub-nav canonical launcher",
    route: "/design-system/canonicals/sub-nav",
    current: "Sub Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "context-nav canonical launcher",
    route: "/design-system/canonicals/context-nav",
    current: "Context Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/patterns",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "page-shell-banner canonical launcher",
    route: "/design-system/canonicals/page-shell-banner",
    current: "Page-Shell Banner",
    expectCanonicalLink: true,
    homeHref: "/design-system/patterns",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "list-record-card canonical launcher",
    route: "/design-system/canonicals/list-record-card",
    current: "List Record Card",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "simple-select canonical launcher",
    route: "/design-system/canonicals/simple-select",
    current: "Simple Select",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    expectCollapsedHidden: true,
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "time-picker canonical launcher",
    route: "/design-system/canonicals/time-picker",
    current: "Time Picker",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "date-picker canonical launcher",
    route: "/design-system/canonicals/date-picker",
    current: "Date Picker",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "drawer-select canonical launcher",
    route: "/design-system/canonicals/drawer-select",
    current: "Drawer Select",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "choice-group canonical launcher",
    route: "/design-system/canonicals/choice-group",
    current: "Choice Group",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "top-nav canonical render",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001",
    current: "Top Nav",
    expectCanonicalLink: true,
    previewPagesSelector: "#top-nav-preview-frame .primary-nav-links",
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "sub-nav canonical render",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=BCR-001",
    current: "Sub Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "context-nav canonical render",
    route:
      "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
    current: "Context Nav",
    expectCanonicalLink: true,
    previewPagesSelector: "#context-nav-shell-primary-nav-links",
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "page-shell-banner canonical render",
    route: "/design-system/components/page-shell-banner?ref=PSBR-001&theme=normal&dir=ltr&zoom=0",
    current: "Page-Shell Banner Canonicals",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "list-record-card canonical render",
    route: "/design-system/components/list-record-card?ref=LRC-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
    current: "List Record Card",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Patterns",
    activePrimaryHref: "/design-system/patterns",
  },
  {
    label: "simple-select canonical render",
    route: "/design-system/components/simple-select?ref=SSR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0",
    current: "Simple Select",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    expectCollapsedHidden: true,
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "time-picker canonical render",
    route: "/design-system/components/time-picker?ref=TPR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0",
    current: "Time Picker",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "date-picker canonical render",
    route: "/design-system/components/date-picker?ref=DTPR-001&width=520&state=single-open&theme=normal&dir=ltr&zoom=0",
    current: "Date Picker",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "drawer-select canonical render",
    route: "/design-system/components/drawer-select?ref=DSR-001&width=940&state=collections-resting&theme=normal&dir=ltr&zoom=0",
    current: "Drawer Select",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
  {
    label: "choice-group canonical render",
    route: "/design-system/components/choice-group?ref=CGR-001&width=520&state=radio-baseline&theme=normal&dir=ltr&zoom=0",
    current: "Choice Group",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
    activePrimary: "Components",
    activePrimaryHref: "/design-system/components",
  },
] as const;

async function gotoRoute(page: Page, route: string) {
  await page.goto(route);
}

test.describe("design-system canonical shell navigation", () => {
  for (const scenario of canonicalShellRoutes) {
    test(`${scenario.label} keeps the approved primary-nav labels and governed breadcrumb home`, async ({ page }) => {
      await gotoRoute(page, scenario.route);

      const activePrimaryLink = page.locator(".design-system-shell > .top-nav .primary-nav .nav-link.active");
      await expect(activePrimaryLink).toHaveText(scenario.activePrimary);
      await expect(activePrimaryLink).toHaveAttribute("href", scenario.activePrimaryHref);
      await expect(
        page.locator(".design-system-shell > .top-nav .primary-nav").getByRole("link", { name: "Templates" }),
      ).toHaveAttribute("href", "/design-system/templates");
      await expect(
        page.locator(".design-system-shell > .top-nav .primary-nav").getByRole("link", { name: "Foundations" }),
      ).toHaveCount(0);
      await expect(
        page.locator(".design-system-shell > .top-nav .primary-nav").getByRole("link", { name: "Resources" }),
      ).toHaveCount(0);

      const breadcrumb = page.locator(".design-system-shell > .sub-nav .breadcrumb-list");
      await expect(breadcrumb.getByRole("link", { name: "Home" })).toHaveAttribute("href", scenario.homeHref);

      await expect(breadcrumb.getByText(scenario.current, { exact: true })).toBeVisible();

      if ("expectCollapsedHidden" in scenario && scenario.expectCollapsedHidden) {
        await expect(breadcrumb.locator("#breadcrumb-collapsed-item")).toHaveClass(/hidden/);
        await expect(breadcrumb.locator("#breadcrumb-separator-before-collapsed")).toHaveClass(/hidden/);
      }

      if ("previewPagesSelector" in scenario && scenario.previewPagesSelector) {
        await expect(
          page.locator(scenario.previewPagesSelector).getByRole("link", { name: "Templates" }),
        ).toHaveAttribute("href", "/design-system/templates");
      }
    });
  }

  test("legacy design-system detail routes mount the shared top-nav scaffold before shell binding", async ({ page }) => {
    for (const route of [
      "/design-system/patterns/list-detail-panel",
      "/design-system/patterns/list-record-card",
    ]) {
      await gotoRoute(page, route);

      const shellTopNav = page.locator(".design-system-shell > .top-nav");
      await expect(shellTopNav.locator("#primary-nav-links")).toHaveCount(1);
      await expect(shellTopNav.locator("#primary-nav-overflow")).toHaveCount(1);
      await expect(shellTopNav.locator("#primary-nav-overflow-button")).toHaveCount(1);
      await expect(shellTopNav.locator("#primary-nav-overflow-menu")).toHaveCount(1);
      await expect(page.locator(".design-system-shell > #mobile-nav-menu")).toHaveCount(1);
      await expect(page.locator(".design-system-shell > #mobile-nav-menu #mobile-profile-button")).toHaveCount(1);
      await expect(page.locator(".design-system-shell > #mobile-nav-menu #mobile-profile-menu")).toHaveCount(1);
      await expect(
        shellTopNav.locator(".primary-nav").getByRole("link", { name: "Foundations" }),
      ).toHaveCount(0);
      await expect(
        shellTopNav.locator(".primary-nav").getByRole("link", { name: "Resources" }),
      ).toHaveCount(0);
      await expect(
        shellTopNav.locator(".primary-nav").getByRole("link", { name: "Templates" }),
      ).toHaveAttribute("href", "/design-system/templates");
    }
  });
});
