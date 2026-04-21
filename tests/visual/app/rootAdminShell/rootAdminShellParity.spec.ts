import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "2027-04-16T18:00:00.000Z",
};

async function bootstrapAuthenticatedOverview(page: Page) {
  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.route("**/v1/root-users**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        page: 1,
        pageSize: 25,
        totalPages: 0,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      }),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/[^/]+\/pages\/[^/]+\/context-nav$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey: "overview",
        items: [],
      }),
    });
  });

  await page.goto("/root-admin");
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator(".sub-nav").waitFor({ state: "visible" });
  await page.locator(".context-nav").waitFor({ state: "visible" });
}

async function collectStyles(page: Page, selector: string, properties: string[]) {
  return page.locator(selector).evaluate((node, props) => {
    const styles = window.getComputedStyle(node);
    return Object.fromEntries(props.map((prop) => [prop, styles.getPropertyValue(prop)]));
  }, properties);
}

test("root-admin authenticated shell uses the same shell stylesheet entrypoints and core computed styles as the signed-off page shell", async ({ page, context }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedOverview(page);

  const designSystemPage = await context.newPage();
  await designSystemPage.setViewportSize({ width: 1560, height: 1400 });
  await designSystemPage.goto("/design-system/templates/page-shell");
  await designSystemPage.locator(".design-system-shell > .top-nav").waitFor({ state: "visible" });

  const appStylesheetHrefs = await page.locator('link[rel="stylesheet"]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("href")).filter(Boolean),
  );

  expect(appStylesheetHrefs).toContain("/design-system/assets/styles.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/list-page-shared.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/hierarchy-tree-shared.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/form-template-shared.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/hierarchyTree.css");
  expect(appStylesheetHrefs).toContain("/root-admin/assets/login.css");
  expect(appStylesheetHrefs).not.toContain("/root-admin/assets/styles.css");

  await expect(page.locator("#shell-view.design-system-shell")).toHaveCount(1);
  await expect(page.locator(".sub-nav")).toHaveCount(1);
  await expect(page.locator(".sub-nav-row")).toHaveCount(0);
  await expect(page.locator(".context-nav .context-nav-main")).toHaveCount(1);
  await expect(page.locator(".context-nav .context-nav-main-items")).toHaveCount(0);
  await expect(page.locator("#root-admin-main.design-system-page-main")).toHaveCount(1);

  const shellComparisons = [
    {
      appSelector: "#shell-view > .top-nav",
      designSelector: ".design-system-shell > .top-nav",
      properties: ["padding-top", "padding-right", "padding-bottom", "padding-left", "gap", "border-bottom-width"],
    },
    {
      appSelector: "#shell-view > .sub-nav",
      designSelector: ".design-system-shell > .sub-nav",
      properties: ["padding-top", "padding-right", "padding-bottom", "padding-left", "gap", "border-bottom-width"],
    },
    {
      appSelector: "#shell-search-form.search-shell .search-shell-field",
      designSelector: ".design-system-shell > .sub-nav .search-shell .search-shell-field",
      properties: ["max-width", "border-radius", "padding-top", "padding-right", "padding-bottom", "padding-left"],
    },
    {
      appSelector: "#shell-search-input.search-input",
      designSelector: "#design-system-search.search-input",
      properties: ["min-height", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width"],
    },
    {
      appSelector: "#shell-view > .context-nav",
      designSelector: ".design-system-shell > .context-nav",
      properties: ["width", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-right-width"],
    },
    {
      appSelector: "#root-admin-main.design-system-page-main",
      designSelector: ".design-system-page-main",
      properties: ["margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left"],
    },
    {
      appSelector: ".context-nav-bottom-group .context-nav-mobile-overflow-target",
      designSelector: ".context-nav-bottom-group .context-nav-mobile-overflow-target",
      properties: ["min-height", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-radius"],
    },
  ] as const;

  for (const comparison of shellComparisons) {
    const appStyles = await collectStyles(page, comparison.appSelector, [...comparison.properties]);
    const designStyles = await collectStyles(designSystemPage, comparison.designSelector, [...comparison.properties]);
    expect(appStyles).toEqual(designStyles);
  }

  await designSystemPage.close();
});
