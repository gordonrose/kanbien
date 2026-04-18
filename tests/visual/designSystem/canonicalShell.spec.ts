import { expect, test, type Page } from "@playwright/test";

const canonicalShellRoutes = [
  {
    label: "canonical index",
    route: "/design-system/canonicals",
    current: "Canonicals",
    expectCanonicalLink: false,
    homeHref: "/design-system",
  },
  {
    label: "top-nav canonical launcher",
    route: "/design-system/canonicals/top-nav",
    current: "Top Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
  },
  {
    label: "sub-nav canonical launcher",
    route: "/design-system/canonicals/sub-nav",
    current: "Sub Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
  },
  {
    label: "context-nav canonical launcher",
    route: "/design-system/canonicals/context-nav",
    current: "Context Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/patterns",
  },
  {
    label: "list-record-card canonical launcher",
    route: "/design-system/canonicals/list-record-card",
    current: "List Record Card",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
  },
  {
    label: "top-nav canonical render",
    route:
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001",
    current: "Top Nav",
    expectCanonicalLink: true,
    previewPagesSelector: "#top-nav-preview-frame .primary-nav-links",
    homeHref: "/design-system/components",
  },
  {
    label: "sub-nav canonical render",
    route:
      "/design-system/components/sub-nav?width=1560&state=full&search=inactive&theme=normal&dir=ltr&zoom=0&locale=standard&accent=%23635bff&ref=BCR-001",
    current: "Sub Nav",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
  },
  {
    label: "context-nav canonical render",
    route:
      "/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=CNR-001",
    current: "Context Nav",
    expectCanonicalLink: true,
    previewPagesSelector: "#context-nav-shell-primary-nav-links",
    homeHref: "/design-system/components",
  },
  {
    label: "list-record-card canonical render",
    route: "/design-system/components/list-record-card?ref=LRC-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
    current: "List Record Card",
    expectCanonicalLink: true,
    homeHref: "/design-system/components",
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
      await expect(activePrimaryLink).toHaveText("Patterns");
      await expect(activePrimaryLink).toHaveAttribute("href", "/design-system/patterns");
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

      if ("previewPagesSelector" in scenario && scenario.previewPagesSelector) {
        await expect(
          page.locator(scenario.previewPagesSelector).getByRole("link", { name: "Templates" }),
        ).toHaveAttribute("href", "/design-system/templates");
      }
    });
  }
});
