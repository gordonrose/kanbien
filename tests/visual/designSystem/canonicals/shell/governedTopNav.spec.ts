import { expect, test, type Page } from "@playwright/test";

const appliedTreeResponse = {
  rootFamilies: [
    {
      rootFamilyId: "design-system",
      displayLabel: "Design System",
      routePrefix: "/design-system",
      sortOrder: 0,
      createdAt: "2026-04-21T00:00:00.000Z",
      updatedAt: "2026-04-21T00:00:00.000Z",
      modules: [
        {
          webAppModuleId: "module-design-system",
          rootFamilyId: "design-system",
          moduleKey: "design-system",
          displayLabel: "Design System",
          landingPageWebAppPageId: "page-overview",
          status: "active",
          sortOrder: 0,
          createdAt: "2026-04-21T00:00:00.000Z",
          updatedAt: "2026-04-21T00:00:00.000Z",
          pages: [
            {
              webAppPageId: "page-overview",
              rootFamilyId: "design-system",
              webAppModuleId: "module-design-system",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "design-system",
              displayLabel: "Overview",
              routeSegment: "",
              resolvedFullRoutePath: "/design-system",
              status: "active",
              sortOrder: 0,
              createdByRootAdminUserId: "root-user-1",
              bootstrapSource: null,
              topologyState: "applied",
              templateKey: "static-html-page",
              materializedAt: "2026-04-21T00:00:00.000Z",
              createdAt: "2026-04-21T00:00:00.000Z",
              updatedAt: "2026-04-21T00:00:00.000Z",
              activeLocator: null,
              children: [],
            },
            {
              webAppPageId: "page-components",
              rootFamilyId: "design-system",
              webAppModuleId: "module-design-system",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "design-system-components",
              displayLabel: "Components",
              routeSegment: "components",
              resolvedFullRoutePath: "/design-system/components",
              status: "active",
              sortOrder: 1,
              createdByRootAdminUserId: "root-user-1",
              bootstrapSource: null,
              topologyState: "applied",
              templateKey: "static-html-page",
              materializedAt: "2026-04-21T00:00:00.000Z",
              createdAt: "2026-04-21T00:00:00.000Z",
              updatedAt: "2026-04-21T00:00:00.000Z",
              activeLocator: null,
              children: [],
            },
            {
              webAppPageId: "page-patterns",
              rootFamilyId: "design-system",
              webAppModuleId: "module-design-system",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "design-system-patterns",
              displayLabel: "Patterns",
              routeSegment: "patterns",
              resolvedFullRoutePath: "/design-system/patterns",
              status: "active",
              sortOrder: 2,
              createdByRootAdminUserId: "root-user-1",
              bootstrapSource: null,
              topologyState: "applied",
              templateKey: "static-html-page",
              materializedAt: "2026-04-21T00:00:00.000Z",
              createdAt: "2026-04-21T00:00:00.000Z",
              updatedAt: "2026-04-21T00:00:00.000Z",
              activeLocator: null,
              children: [],
            },
            {
              webAppPageId: "page-canonicals",
              rootFamilyId: "design-system",
              webAppModuleId: "module-design-system",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "design-system-canonicals",
              displayLabel: "Canonicals",
              routeSegment: "canonicals",
              resolvedFullRoutePath: "/design-system/canonicals",
              status: "active",
              sortOrder: 3,
              createdByRootAdminUserId: "root-user-1",
              bootstrapSource: null,
              topologyState: "applied",
              templateKey: "static-html-page",
              materializedAt: "2026-04-21T00:00:00.000Z",
              createdAt: "2026-04-21T00:00:00.000Z",
              updatedAt: "2026-04-21T00:00:00.000Z",
              activeLocator: null,
              children: [],
            },
            {
              webAppPageId: "page-templates",
              rootFamilyId: "design-system",
              webAppModuleId: "module-design-system",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "design-system-templates",
              displayLabel: "Templates",
              routeSegment: "templates",
              resolvedFullRoutePath: "/design-system/templates",
              status: "active",
              sortOrder: 4,
              createdByRootAdminUserId: "root-user-1",
              bootstrapSource: null,
              topologyState: "applied",
              templateKey: "static-html-page",
              materializedAt: "2026-04-21T00:00:00.000Z",
              createdAt: "2026-04-21T00:00:00.000Z",
              updatedAt: "2026-04-21T00:00:00.000Z",
              activeLocator: null,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

const settingsByPageId = {
  "page-overview": { displayLabel: "Overview", showInTopNav: true, topNavOrder: 0 },
  "page-components": { displayLabel: "Components", showInTopNav: true, topNavOrder: 1 },
  "page-patterns": { displayLabel: "Patterns", showInTopNav: true, topNavOrder: 2 },
  "page-canonicals": { displayLabel: "Canonicals", showInTopNav: true, topNavOrder: 3 },
  "page-templates": { displayLabel: "Templates", showInTopNav: true, topNavOrder: 4 },
} as const;

async function mockGovernedTopNav(page: Page) {
  await page.route("**/v1/web-app-hierarchy/design-system/applied-tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(appliedTreeResponse),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/[^/]+$/, async (route) => {
    const url = new URL(route.request().url());
    const pageId = decodeURIComponent(url.pathname.split("/").at(-1) ?? "");
    const settings = settingsByPageId[pageId as keyof typeof settingsByPageId];

    if (!settings) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ code: "not_found", message: "Missing settings fixture." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        webAppPageId: pageId,
        parentPageId: null,
        rootFamilyId: "design-system",
        displayLabel: settings.displayLabel,
        hasStoredSettings: true,
        iconKey: null,
        effectiveIconKey: "page-default",
        showInTopNav: settings.showInTopNav,
        topNavOrder: settings.topNavOrder,
        pageTemplateKey: "static-html-page",
        effectivePageTemplateKey: "static-html-page",
        contextNavItems: [],
        createdAt: "2026-04-21T00:00:00.000Z",
        updatedAt: "2026-04-21T00:00:00.000Z",
      }),
    });
  });
}

test.describe("design-system governed top nav", () => {
  test("host shell includes governed top-nav pages such as canonicals", async ({ page }) => {
    await mockGovernedTopNav(page);
    await page.goto("/design-system/canonicals");

    const hostPrimaryNav = page.locator(".design-system-shell > .top-nav .primary-nav");
    await expect(hostPrimaryNav.getByRole("link", { name: "Canonicals" })).toHaveAttribute(
      "href",
      "/design-system/canonicals",
    );
    await expect(hostPrimaryNav.getByRole("link", { name: "Canonicals" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("governed host-nav hydration does not alter the preview top-nav primitive", async ({ page }) => {
    await mockGovernedTopNav(page);
    await page.goto(
      "/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001",
    );

    const hostPrimaryNav = page.locator(".design-system-shell > .top-nav .primary-nav");
    await expect(hostPrimaryNav.getByRole("link", { name: "Canonicals" })).toHaveAttribute(
      "href",
      "/design-system/canonicals",
    );

    const previewPrimaryNav = page.locator("#top-nav-preview-frame .primary-nav");
    await expect(previewPrimaryNav.getByRole("link", { name: "Canonicals" })).toHaveCount(0);
  });

  test("explicitly disabling overview removes it from the governed host shell", async ({ page }) => {
    await page.route("**/v1/web-app-hierarchy/design-system/applied-tree", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(appliedTreeResponse),
      });
    });

    await page.route(/.*\/v1\/web-app-page-settings\/pages\/[^/]+$/, async (route) => {
      const url = new URL(route.request().url());
      const pageId = decodeURIComponent(url.pathname.split("/").at(-1) ?? "");
      const settings = settingsByPageId[pageId as keyof typeof settingsByPageId];

      if (!settings) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ code: "not_found", message: "Missing settings fixture." }),
        });
        return;
      }

      const showInTopNav = pageId === "page-overview" ? false : settings.showInTopNav;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          webAppPageId: pageId,
          parentPageId: null,
          rootFamilyId: "design-system",
          displayLabel: settings.displayLabel,
          hasStoredSettings: true,
          iconKey: null,
          effectiveIconKey: "page-default",
          showInTopNav,
          topNavOrder: settings.topNavOrder,
          pageTemplateKey: "static-html-page",
          effectivePageTemplateKey: "static-html-page",
          contextNavItems: [],
          createdAt: "2026-04-21T00:00:00.000Z",
          updatedAt: "2026-04-21T00:00:00.000Z",
        }),
      });
    });

    await page.goto("/design-system/canonicals");

    const hostPrimaryNav = page.locator(".design-system-shell > .top-nav .primary-nav");
    await expect(hostPrimaryNav.getByRole("link", { name: "Overview" })).toHaveCount(0);
    await expect(hostPrimaryNav.getByRole("link", { name: "Canonicals" })).toHaveAttribute(
      "href",
      "/design-system/canonicals",
    );
  });
});
