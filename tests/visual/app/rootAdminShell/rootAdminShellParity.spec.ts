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

async function bootstrapUnauthenticatedRootAdmin(page: Page) {
  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      }),
    });
  });

  await page.goto("/root-admin");
  await page.locator("[data-login-template]").waitFor({ state: "visible" });
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
  expect(appStylesheetHrefs).not.toContain("/root-admin/assets/login.css");
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

test("root-admin login consumes the governed login template and switches into SSH challenge state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route("**/v1/root-auth/login/password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "SSH_CHALLENGE_REQUIRED",
        challengeId: "challenge_001",
        challengeText: "kanbien-root-admin-login-challenge",
        expiresAt: "2027-04-16T18:05:00.000Z",
        availableSshKeys: [
          {
            fingerprint: "SHA256:root-admin-key",
            label: "Root admin workstation",
          },
        ],
      }),
    });
  });

  await bootstrapUnauthenticatedRootAdmin(page);

  await expect(page.locator("#auth-view.login-template-stage")).toBeVisible();
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "password");
  await expect(page.locator("#login-form.login-template-form")).toBeVisible();
  await expect(page.locator(".auth-panel")).toHaveCount(0);

  await page.locator("#email").fill("root.admin@example.test");
  await page.locator("#password").fill("StrongPass1!");
  await page.locator("#login-form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });

  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "ssh-challenge");
  await expect(page.locator("#ssh-stage")).toBeVisible();
  await expect(page.locator("#ssh-key-choice-list")).toBeVisible();
  await expect(page.getByRole("radio", { name: /Root admin workstation/ })).toBeChecked();
  await expect(page.locator('input[name="sshKeyFingerprint"]:checked')).toHaveValue("SHA256:root-admin-key");
  await expect(page.locator(".login-template-key-fingerprint").first()).toHaveCSS("text-overflow", "ellipsis");
  await expect(page.locator(".login-template-key-fingerprint").first()).toHaveCSS("white-space", "nowrap");
  await expect(page.getByRole("link", { name: "Launch Helper" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download Helper Source" })).toHaveCount(0);
});

test("root-admin login keeps backend auth errors inside the login template", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.route("**/v1/root-auth/login/password", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "INVALID_CREDENTIALS",
        message: "Email or password is incorrect.",
      }),
    });
  });

  await bootstrapUnauthenticatedRootAdmin(page);
  await page.locator("#email").fill("root.admin@example.test");
  await page.locator("#password").fill("wrong-password");
  await page.locator("#login-form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });

  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "password");
  await expect(page.locator("#auth-message")).toContainText("Email or password is incorrect.");
  await expect(page.locator("#shell-view")).toBeHidden();
  await expect(page.locator("#expiry-overlay")).toBeHidden();

  await page.unroute("**/v1/root-auth/login/password");
  await page.route("**/v1/root-auth/login/password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "SSH_CHALLENGE_REQUIRED",
        challengeId: "challenge_001",
        challengeText: "kanbien-root-admin-login-challenge",
        expiresAt: "2027-04-16T18:05:00.000Z",
        availableSshKeys: [
          {
            fingerprint: "SHA256:root-admin-key",
            label: "Root admin workstation",
          },
        ],
      }),
    });
  });
  await page.route("http://127.0.0.1:8787/v1/root-auth/sign-login-challenge", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        publicKeyFingerprint: "SHA256:root-admin-key",
        signature: "signed-challenge",
      }),
    });
  });
  await page.route("**/v1/root-auth/browser/login/ssh", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "INVALID_SIGNATURE",
        message: "The SSH signature could not be verified.",
      }),
    });
  });

  await page.locator("#password").fill("StrongPass1!");
  await page.locator("#login-form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "ssh-challenge");

  await page.locator("#sign-submit").click();
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "ssh-challenge");
  await expect(page.locator("#auth-message")).toContainText("The SSH signature could not be verified.");
  await expect(page.locator("#shell-view")).toBeHidden();
  await expect(page.locator("#expiry-overlay")).toBeHidden();
});

test("root-admin users page keeps the same governed list-page header posture as the signed-off list-page route", async ({ page, context }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedOverview(page);
  await page.goto("/root-admin/users");
  await page.locator("#page-users").waitFor({ state: "visible" });

  const designSystemPage = await context.newPage();
  await designSystemPage.setViewportSize({ width: 1560, height: 1400 });
  await designSystemPage.goto("/design-system/templates/list-page");
  await designSystemPage.locator("#list-page-canvas-title").waitFor({ state: "visible" });

  await expect(page.locator("#page-users .component-catalog-section-header")).toHaveCount(1);
  await expect(page.locator("#root-users-page-title.component-catalog-section-title")).toHaveCount(1);
  await expect(page.locator("#page-users .component-catalog-meta")).toHaveCount(1);

  const comparisons = [
    {
      appSelector: "#page-users .component-catalog-section-header",
      designSelector: ".list-page-list-column .component-catalog-section-header",
      properties: ["display", "gap"],
    },
    {
      appSelector: "#root-users-page-title",
      designSelector: "#list-page-canvas-title",
      properties: ["font-size", "font-weight", "line-height", "letter-spacing", "color"],
    },
    {
      appSelector: "#page-users .component-catalog-meta",
      designSelector: ".list-page-list-column .component-catalog-meta",
      properties: ["font-size", "line-height", "color", "margin-top", "margin-bottom"],
    },
  ] as const;

  for (const comparison of comparisons) {
    const appStyles = await collectStyles(page, comparison.appSelector, [...comparison.properties]);
    const designStyles = await collectStyles(designSystemPage, comparison.designSelector, [...comparison.properties]);
    expect(appStyles).toEqual(designStyles);
  }

  await designSystemPage.close();
});
