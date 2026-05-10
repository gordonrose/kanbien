import { Buffer } from "node:buffer";
import { expect, test, type Page } from "@playwright/test";

const tinyPngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);
const tinyPngDataUrl = `data:image/png;base64,${tinyPngBuffer.toString("base64")}`;

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "9999-04-16T18:00:00.000Z",
};

function createRootAdminTopNavTree() {
  return {
    rootFamilies: [
      {
        rootFamilyId: "root-admin",
        displayLabel: "Root Admin",
        routePrefix: "/root-admin",
        sortOrder: 1,
        createdAt: "2026-04-16T10:00:00.000Z",
        updatedAt: "2026-04-16T18:00:00.000Z",
        modules: [
          {
            webAppModuleId: "module-root-admin",
            rootFamilyId: "root-admin",
            moduleKey: "root-admin-shell",
            displayLabel: "Root Admin Shell",
            landingPageWebAppPageId: "page-overview",
            status: "live",
            sortOrder: 1,
            createdAt: "2026-04-16T10:00:00.000Z",
            updatedAt: "2026-04-16T18:00:00.000Z",
            pages: [
              {
                webAppPageId: "page-overview",
                pageKey: "overview",
                displayLabel: "Overview",
                resolvedFullRoutePath: "/root-admin",
                children: [],
              },
              {
                webAppPageId: "page-users",
                pageKey: "users",
                displayLabel: "Users",
                resolvedFullRoutePath: "/root-admin/users",
                children: [],
              },
              {
                webAppPageId: "page-roles",
                pageKey: "roles",
                displayLabel: "Roles",
                resolvedFullRoutePath: "/root-admin/roles",
                children: [],
              },
              {
                webAppPageId: "page-tenants",
                pageKey: "tenants",
                displayLabel: "Tenants",
                resolvedFullRoutePath: "/root-admin/tenants",
                children: [],
              },
              {
                webAppPageId: "page-tenant-admins",
                pageKey: "tenant-admins",
                displayLabel: "Tenant Admins",
                resolvedFullRoutePath: "/root-admin/tenant-admins",
                children: [],
              },
              {
                webAppPageId: "page-web-app-hierarchy",
                pageKey: "web-app-hierarchy",
                displayLabel: "Web App Hierarchy",
                resolvedFullRoutePath: "/root-admin/web-app-hierarchy",
                children: [],
              },
            ],
            orphanedPages: [],
          },
        ],
      },
    ],
  };
}

function createPageSettingsRecord(pageId: string) {
  const settingsByPageId: Record<string, { displayLabel: string; showInTopNav: boolean; topNavOrder: number | null }> = {
    "page-overview": { displayLabel: "Overview", showInTopNav: true, topNavOrder: 0 },
    "page-users": { displayLabel: "Users", showInTopNav: true, topNavOrder: 1 },
    "page-roles": { displayLabel: "Roles", showInTopNav: true, topNavOrder: 2 },
    "page-tenants": { displayLabel: "Tenants", showInTopNav: true, topNavOrder: 3 },
    "page-tenant-admins": { displayLabel: "Tenant Admins", showInTopNav: true, topNavOrder: 4 },
    "page-web-app-hierarchy": { displayLabel: "Web App Hierarchy", showInTopNav: true, topNavOrder: 5 },
  };

  const record = settingsByPageId[pageId];
  if (!record) {
    return null;
  }

  return {
    webAppPageId: pageId,
    rootFamilyId: "root-admin",
    displayLabel: record.displayLabel,
    hasStoredSettings: true,
    iconKey: "page-default",
    effectiveIconKey: "page-default",
    showInTopNav: record.showInTopNav,
    topNavOrder: record.topNavOrder,
    pageTemplateKey: null,
    effectivePageTemplateKey: null,
    contextNavItems: [],
    createdAt: "2026-04-16T10:00:00.000Z",
    updatedAt: "2026-04-16T18:00:00.000Z",
  };
}

function defaultContextNavProjectionStore() {
  return {
    users: [
      {
        webAppPageId: "page-users",
        shellPageKey: "users",
        displayLabel: "Users",
        resolvedFullRoutePath: "/root-admin/users",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 0,
      },
      {
        webAppPageId: "page-roles",
        shellPageKey: "roles",
        displayLabel: "Roles",
        resolvedFullRoutePath: "/root-admin/roles",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 1,
      },
      {
        webAppPageId: "page-tenants",
        shellPageKey: "tenants",
        displayLabel: "Tenants",
        resolvedFullRoutePath: "/root-admin/tenants",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 2,
      },
      {
        webAppPageId: "page-tenant-admins",
        shellPageKey: "tenant-admins",
        displayLabel: "Tenant Admins",
        resolvedFullRoutePath: "/root-admin/tenant-admins",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 3,
      },
      {
        webAppPageId: "page-web-app-hierarchy",
        shellPageKey: "web-app-hierarchy",
        displayLabel: "Web App Hierarchy",
        resolvedFullRoutePath: "/root-admin/web-app-hierarchy",
        iconKey: "page-default",
        effectiveIconKey: "page-default",
        sortOrder: 4,
      },
    ],
  };
}

function buildRootUsers(total = 30) {
  return Array.from({ length: total }, (_value, index) => {
    const number = index + 1;
    return {
      rootUserId: `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`,
      email: `root.user${number}@example.test`,
      firstName: "Root",
      lastName: `User ${number}`,
      anonymized: false,
      status: number % 6 === 0 ? "inactive" : "active",
      profilePictureAssetId: number === 1 ? "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" : null,
      profilePictureUrl: number === 1 ? tinyPngDataUrl : null,
      profilePictureAltText: number === 1 ? "Root User 1 profile portrait" : null,
      profilePictureDecorative: false,
      createdAt: `2026-03-${String(((number - 1) % 28) + 1).padStart(2, "0")}T10:00:00.000Z`,
      updatedAt: `2026-04-${String(((number - 1) % 17) + 1).padStart(2, "0")}T14:15:00.000Z`,
      deletedAt: null,
    };
  });
}

function buildTenants() {
  return [
    {
      tenantId: "10000000-0000-4000-8000-000000000001",
      bizId: "acme",
      name: "Acme Workspace",
      category: "customer",
      status: "live",
      createdAt: "2026-03-01T10:00:00.000Z",
      updatedAt: "2026-04-10T14:00:00.000Z",
      deletedAt: null,
    },
    {
      tenantId: "10000000-0000-4000-8000-000000000002",
      bizId: "demo-hub",
      name: "Demo Hub",
      category: "demo",
      status: "draft",
      createdAt: "2026-03-02T10:00:00.000Z",
      updatedAt: "2026-04-11T14:00:00.000Z",
      deletedAt: null,
    },
  ];
}

function buildTenantAdmins(): Record<string, Array<Record<string, string>>> {
  return {
    "10000000-0000-4000-8000-000000000001": [
      {
        tenantAdminId: "20000000-0000-4000-8000-000000000001",
        tenantId: "10000000-0000-4000-8000-000000000001",
        email: "admin.one@example.test",
        firstName: "Admin",
        lastName: "One",
        emailVerificationStatus: "pending",
        createdAt: "2026-03-03T10:00:00.000Z",
        updatedAt: "2026-04-12T14:00:00.000Z",
      },
    ],
    "10000000-0000-4000-8000-000000000002": [],
  };
}

async function mockRootUsersRoutes(
  page: Page,
  options: { failInitialOnce?: boolean; uploadBytesStatus?: number; uploadBytesContentType?: string } = {},
) {
  let rootUsers = buildRootUsers();
  let tenants = buildTenants();
  const tenantAdminsByTenantId = buildTenantAdmins();
  let initialFailed = false;
  const contextNavByPageKey = defaultContextNavProjectionStore();

  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.route(/.*\/v1\/root-admin\/harness-chat\/conversations(?:\?.*)?$/, async (route) => {
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

  await page.route("**/v1/assets/upload-intents", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        asset: {
          assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          lifecycleStatus: "pending_upload",
          storageKey: "root/assets/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/upload.png",
        },
        uploadIntent: {
          uploadIntentId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          expiresAt: "2026-04-27T12:00:00.000Z",
        },
        uploadTarget: {
          mode: "local-filesystem",
          storageKey: "root/assets/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/upload.png",
          expiresAt: "2026-04-27T12:00:00.000Z",
        },
      }),
    });
  });

  await page.route("**/v1/assets/*/upload-bytes**", async (route) => {
    if (options.uploadBytesStatus && options.uploadBytesStatus !== 200) {
      await route.fulfill({
        status: options.uploadBytesStatus,
        contentType: options.uploadBytesContentType ?? "text/html",
        body: "Cannot POST /v1/assets/example/upload-bytes",
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        lifecycleStatus: "pending_upload",
      }),
    });
  });

  await page.route("**/v1/assets/*/complete", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        assetId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        lifecycleStatus: "ready",
        verifiedContentType: "image/png",
        contentVerificationStatus: "metadata_verified",
      }),
    });
  });

  await page.route("**/v1/root-users**", async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const rootUserId = pathSegments[2];
    const email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
    const emailPrefix = url.searchParams.get("emailPrefix")?.trim().toLowerCase() ?? "";
    const pageValue = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "25");

    if (method === "POST") {
      const body = route.request().postDataJSON();
      const created = {
        rootUserId: `00000000-0000-4000-8000-${String(rootUsers.length + 1).padStart(12, "0")}`,
        email: body.email,
        firstName: body.firstName ?? "",
        lastName: body.lastName ?? "",
        anonymized: false,
        status: "active",
        profilePictureAssetId: body.profilePictureAssetId ?? null,
        profilePictureUrl: body.profilePictureAssetId ? tinyPngDataUrl : null,
        profilePictureAltText: body.profilePictureAltText ?? null,
        profilePictureDecorative: Boolean(body.profilePictureDecorative),
        createdAt: "2026-04-27T10:00:00.000Z",
        updatedAt: "2026-04-27T10:00:00.000Z",
        deletedAt: null,
      };
      rootUsers = [created, ...rootUsers];
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(created) });
      return;
    }

    if (method === "PATCH" && rootUserId) {
      const body = route.request().postDataJSON();
      const existing = rootUsers.find((rootUser) => rootUser.rootUserId === rootUserId);
      const updated = { ...existing, ...body, updatedAt: "2026-04-27T11:00:00.000Z" };
      rootUsers = rootUsers.map((rootUser) => rootUser.rootUserId === rootUserId ? updated : rootUser);
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(updated) });
      return;
    }

    if (options.failInitialOnce && !initialFailed && !email && !emailPrefix && pageValue === 1) {
      initialFailed = true;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          code: "REQUEST_FAILED",
          message: "The request could not be completed.",
        }),
      });
      return;
    }

    if (email) {
      const match = rootUsers.find((rootUser) => rootUser.email === email);
      if (!match) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({
            code: "ROOT_USER_NOT_FOUND",
            message: "That root user could not be found.",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(match),
      });
      return;
    }

    const filtered = emailPrefix
      ? rootUsers.filter((rootUser) => rootUser.email.startsWith(emailPrefix))
      : rootUsers;
    const start = (pageValue - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items,
        page: pageValue,
        pageSize,
        totalPages,
        totalMatchingRecords: filtered.length,
        totalSearchableRecords: filtered.length,
      }),
    });
  });

  await page.route("**/v1/tenants**", async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const tenantId = pathSegments[2];
    const isAdminsRoute = pathSegments[3] === "admins";
    const tenantAdminId = pathSegments[4];

    if (isAdminsRoute && tenantId) {
      const tenantAdmins = tenantAdminsByTenantId[tenantId] ?? [];
      if (method === "POST") {
        const body = route.request().postDataJSON();
        const created = {
          tenantAdminId: `20000000-0000-4000-8000-${String(tenantAdmins.length + 1).padStart(12, "0")}`,
          tenantId,
          email: body.email,
          firstName: body.firstName ?? "",
          lastName: body.lastName ?? "",
          emailVerificationStatus: "pending",
          createdAt: "2026-04-27T10:00:00.000Z",
          updatedAt: "2026-04-27T10:00:00.000Z",
        };
        tenantAdminsByTenantId[tenantId] = [created, ...tenantAdmins];
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(created) });
        return;
      }
      if (method === "PATCH" && tenantAdminId) {
        const body = route.request().postDataJSON();
        const existing = tenantAdmins.find((admin) => admin.tenantAdminId === tenantAdminId);
        const updated = { ...existing, ...body, updatedAt: "2026-04-27T11:00:00.000Z" };
        tenantAdminsByTenantId[tenantId] = tenantAdmins.map((admin) =>
          admin.tenantAdminId === tenantAdminId ? updated : admin,
        );
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(updated) });
        return;
      }
      const emailPrefix = url.searchParams.get("emailPrefix")?.trim().toLowerCase() ?? "";
      const filtered = emailPrefix
        ? tenantAdmins.filter((admin) => admin.email.startsWith(emailPrefix))
        : tenantAdmins;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: filtered, page: 1, pageSize: 25, totalPages: 1 }),
      });
      return;
    }

    if (method === "POST") {
      const body = route.request().postDataJSON();
      const created = {
        tenantId: `10000000-0000-4000-8000-${String(tenants.length + 1).padStart(12, "0")}`,
        bizId: body.bizId,
        name: body.name,
        category: body.category,
        status: body.status ?? "draft",
        createdAt: "2026-04-27T10:00:00.000Z",
        updatedAt: "2026-04-27T10:00:00.000Z",
        deletedAt: null,
      };
      tenants = [created, ...tenants];
      tenantAdminsByTenantId[created.tenantId] = [];
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(created) });
      return;
    }

    if (method === "PATCH" && tenantId) {
      const body = route.request().postDataJSON();
      const existing = tenants.find((tenant) => tenant.tenantId === tenantId);
      const updated = { ...existing, ...body, updatedAt: "2026-04-27T11:00:00.000Z" };
      tenants = tenants.map((tenant) => tenant.tenantId === tenantId ? updated : tenant);
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(updated) });
      return;
    }

    const namePrefix = url.searchParams.get("namePrefix")?.trim().toLowerCase() ?? "";
    const bizIdPrefix = url.searchParams.get("bizIdPrefix")?.trim().toLowerCase() ?? "";
    const filtered = tenants.filter((tenant) =>
      (!namePrefix || tenant.name.toLowerCase().startsWith(namePrefix))
      && (!bizIdPrefix || tenant.bizId.toLowerCase().startsWith(bizIdPrefix)),
    );
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ items: filtered, page: 1, pageSize: 25, totalPages: 1 }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createRootAdminTopNavTree()),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/[^/]+$/, async (route) => {
    const pathSegments = route.request().url().split("/");
    const pageId = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] ?? "" : "";
    const settings = createPageSettingsRecord(pageId);
    if (!settings) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Page not found." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(settings),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/[^/]+\/pages\/[^/]+\/context-nav$/, async (route) => {
    const requestUrl = new URL(route.request().url());
    const pathSegments = requestUrl.pathname.split("/");
    const pageKey = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] ?? "overview" : "overview";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey: pageKey,
        items: contextNavByPageKey[pageKey as keyof typeof contextNavByPageKey] ?? [],
      }),
    });
  });
}

async function bootstrapUsersPage(
  page: Page,
  options: {
    failInitialOnce?: boolean;
    search?: string;
    uploadBytesStatus?: number;
    uploadBytesContentType?: string;
  } = {},
) {
  await mockRootUsersRoutes(page, options);
  const search = options.search ?? "";
  await page.goto(`/root-admin/users${search}`);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-users").waitFor({ state: "visible" });
  await page.locator('[data-selectable-list-card]').first().waitFor({ state: "visible" });
}

async function bootstrapDirectoryPage(page: Page, path: string, visiblePageSelector: string) {
  await mockRootUsersRoutes(page);
  await page.goto(path);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator(visiblePageSelector).waitFor({ state: "visible" });
  await page.locator(`${visiblePageSelector} [data-selectable-list-card]`).first().waitFor({ state: "visible" });
}

async function expectGovernedListItemsContainer(page: Page, visiblePageSelector: string) {
  const itemsContainer = page.locator(`${visiblePageSelector} [data-directory-items]`);
  await expect(itemsContainer).toHaveAttribute("data-selectable-list-items", "");
  return itemsContainer;
}

async function expectGovernedCardStackGap(page: Page, visiblePageSelector: string) {
  const itemsContainer = await expectGovernedListItemsContainer(page, visiblePageSelector);
  const firstCard = page.locator(`${visiblePageSelector} [data-selectable-list-card]`).nth(0);
  const secondCard = page.locator(`${visiblePageSelector} [data-selectable-list-card]`).nth(1);

  await expect(firstCard).toBeVisible();
  await expect(secondCard).toBeVisible();

  const stackGap = await itemsContainer.evaluate((node) => window.getComputedStyle(node).rowGap);
  expect(stackGap).toBe("16px");

  const firstBox = await firstCard.boundingBox();
  const secondBox = await secondCard.boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(Math.round((secondBox?.y ?? 0) - ((firstBox?.y ?? 0) + (firstBox?.height ?? 0)))).toBe(16);
}

test.describe("root-admin root-users list page adoption", () => {
  test("desktop uses the signed-off split layout and footer next can cross the current page boundary", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(25);
    await expect(page.locator("#root-users-detail-panel")).toBeHidden();

    await page.locator('[data-selectable-list-card]').nth(24).click();
    await expect(page.locator("#root-users-detail-panel")).toBeVisible();
    await expect(page.locator("#root-users-detail-title")).toHaveText("Root User 25");

    await page.locator("#root-users-detail-next").click();

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(30);
    await expect(page.locator("#root-users-detail-title")).toHaveText("Root User 26");
    await expect(page.locator("#root-users-list-page")).toHaveClass(/detail-open/);
    const announcementState = await page.locator("#root-users-list-announcement").evaluate((node) => {
      const styles = window.getComputedStyle(node);
      return {
        className: node.className,
        position: styles.position,
        width: styles.width,
        height: styles.height,
        clip: styles.clip,
      };
    });
    expect(announcementState).toMatchObject({
      className: "visually-hidden",
      position: "absolute",
      width: "1px",
      height: "1px",
      clip: "rect(0px, 0px, 0px, 0px)",
    });

    const listBox = await page.locator("#page-users .list-page-list-column").boundingBox();
    const detailBox = await page.locator("#root-users-detail-panel").boundingBox();
    expect(listBox).not.toBeNull();
    expect(detailBox).not.toBeNull();
    expect((listBox?.x ?? 0)).toBeLessThan((detailBox?.x ?? 0) - 1);
    expect(Math.abs((listBox?.y ?? 0) - (detailBox?.y ?? 0))).toBeLessThanOrEqual(2);
  });

  test("root-user drawer header uses the image card identity summary and profile picture edits start at the top", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator('[data-selectable-list-card]').first().click();

    const headerCard = page.locator("#root-users-detail-panel [data-directory-detail-identity-card] [data-form-image-card]");
    await expect(headerCard).toBeVisible();
    await expect(headerCard.locator(".form-image-card-copy strong")).toHaveText("Root User 1");
    await expect(headerCard.locator(".form-image-card-copy span")).toHaveText("root.user1@example.test");
    await expect(headerCard.locator(".form-image-card-copy small")).toHaveText("Active");
    await expect(headerCard.locator("[data-form-image-card-image]")).toHaveAttribute("src", tinyPngDataUrl);
    await expect(headerCard.locator("[data-form-image-card-image]")).toHaveAttribute("alt", "Root User 1 profile portrait");

    await headerCard.locator("[data-form-image-card-media]").hover();
    await headerCard.locator("[data-form-image-card-edit]").click();

    const editForm = page.locator('#page-users [data-directory-form="edit"]');
    await expect(editForm).toBeVisible();
    await expect(editForm.locator("[data-directory-profile-picture]")).toBeVisible();
    await expect(editForm.locator("[data-directory-profile-picture]")).toHaveJSProperty("previousElementSibling", null);
    await expect(editForm.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-state", "complete");
  });

  test("directory list cards keep the governed list-page stack gap", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });

    await bootstrapDirectoryPage(page, "/root-admin/users", "#page-users");
    await expectGovernedCardStackGap(page, "#page-users");

    await bootstrapDirectoryPage(page, "/root-admin/tenants", "#page-tenants");
    await expectGovernedCardStackGap(page, "#page-tenants");

    await bootstrapDirectoryPage(page, "/root-admin/tenant-admins", "#page-tenant-admins");
    await expectGovernedListItemsContainer(page, "#page-tenant-admins");
  });

  test("desktop closed users list uses browser scroll and lazy-loads from the page bottom", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 900 });
    await bootstrapUsersPage(page);

    const listColumn = page.locator("#page-users .list-page-list-column");
    const itemCards = page.locator('[data-selectable-list-card]');
    const initialCount = await itemCards.count();

    const closedState = await listColumn.evaluate((node) => {
      if (!(node instanceof HTMLElement)) {
        return null;
      }

      return {
        overflowY: getComputedStyle(node).overflowY,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
      };
    });

    expect(closedState).not.toBeNull();
    expect(closedState?.overflowY).toBe("visible");

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      window.dispatchEvent(new Event("scroll"));
    });

    await expect(itemCards).toHaveCount(30);
    expect(initialCount).toBe(25);
  });

  test("shell search narrows the users page honestly, closes stale detail, and supports clear-search recovery", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator('[data-selectable-list-card]').first().click();
    await expect(page.locator("#root-users-detail-title")).toHaveText("Root User 1");

    const searchInput = page.locator("#shell-search-input");
    await searchInput.fill("missing.root@example.test");
    await searchInput.press("Enter");

    await expect(page.locator("#root-users-detail-panel")).toBeHidden();
    await expect(searchInput).toBeFocused();
    await expect(page.locator('#page-users [data-selectable-list-no-results-state]')).toBeVisible();
    await expect(page.locator("#shell-message")).toContainText("No visible root users matched");

    await page.locator('#page-users [data-selectable-list-clear-search]').click();

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(25);
    await expect(searchInput).toBeFocused();
    await expect(page.locator('#page-users [data-selectable-list-no-results-state]')).toBeHidden();
  });

  test("mobile selection becomes a full-sheet detail overlay that stays above the bottom bar", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 960 });
    await bootstrapUsersPage(page);

    await page.locator('[data-selectable-list-card]').first().click();

    const detailPanel = page.locator("#root-users-detail-panel");
    const bottomBar = page.locator(".context-nav");

    await expect(detailPanel).toBeVisible();
    await expect(detailPanel).toHaveAttribute("role", "dialog");
    await expect(page.locator("#root-users-detail-title")).toBeFocused();

    const detailBox = await detailPanel.boundingBox();
    const bottomBarBox = await bottomBar.boundingBox();
    expect(detailBox).not.toBeNull();
    expect(bottomBarBox).not.toBeNull();
    expect((detailBox?.y ?? 0) + (detailBox?.height ?? 0)).toBeLessThanOrEqual((bottomBarBox?.y ?? 0) + 1);
  });

  test("initial directory failures stay scoped to the list region and recover through the local retry action", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await mockRootUsersRoutes(page, { failInitialOnce: true });

    await page.goto("/root-admin/users");
    await page.locator("#shell-view").waitFor({ state: "visible" });
    await expect(page.locator('#page-users [data-selectable-list-initial-error-state]')).toBeVisible();

    await page.locator('#page-users [data-selectable-list-initial-retry]').click();

    await expect(page.locator('[data-selectable-list-card]')).toHaveCount(25);
    await expect(page.locator('#page-users [data-selectable-list-initial-error-state]')).toBeHidden();
  });

  test("rtl mirrors the adopted split relationship while keeping the users detail flow intact", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page, { search: "?lang=ar" });

    await page.locator('[data-selectable-list-card]').first().click();

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#root-users-detail-panel")).toBeVisible();

    const listBox = await page.locator("#page-users .list-page-list-column").boundingBox();
    const detailBox = await page.locator("#root-users-detail-panel").boundingBox();
    expect(listBox).not.toBeNull();
    expect(detailBox).not.toBeNull();
    expect((detailBox?.x ?? 0) + (detailBox?.width ?? 0)).toBeLessThanOrEqual((listBox?.x ?? 0) + 1);
  });

  test("magnified users detail review keeps the panel readable and the footer navigation recoverable", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator("#display-settings-button").click();
    await page.locator('[data-magnification-option="100"]').click();
    await page.locator('[data-selectable-list-card]').first().click();

    await expect(page.locator("#root-users-detail-panel")).toBeVisible();
    await expect(page.locator("#root-users-detail-close")).toBeVisible();
    await expect(page.locator("#root-users-detail-next")).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.style.getPropertyValue("--ui-scale")))
      .toBe("1.5");
  });

  test("TC-ROOT-USERS-E2E-002 and JY-ROOT-ADMIN-005 root users can be created, edited, listed, and reloaded from the governed drawer form", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator("#page-users [data-directory-create]").click();
    await page.locator('#page-users [data-directory-form="create"] input[name="email"]').fill("new.root@example.test");
    await page.locator('#page-users [data-directory-form="create"] input[name="firstName"]').fill("New");
    await page.locator('#page-users [data-directory-form="create"] input[name="lastName"]').fill("Root");
    await page.locator("#page-users [data-directory-form-save]").click();

    await expect(page.locator("#root-users-detail-title")).toHaveText("New Root");
    await expect(page.locator("#shell-message")).toContainText("Create root user saved");

    await page.locator("#root-users-detail-edit").click();
    await page.locator('#page-users [data-directory-form="edit"] input[name="firstName"]').fill("Edited");
    await page.locator("#page-users [data-directory-form-save]").click();

    await expect(page.locator("#root-users-detail-title")).toHaveText("Edited Root");
    await expect(page.locator("#page-users")).toContainText("Edited Root");

    await page.reload();
    await page.locator("#shell-view").waitFor({ state: "visible" });
    await page.locator("#page-users").waitFor({ state: "visible" });
    await expect(page.locator("#page-users")).toContainText("Edited Root");
    await expect(page.locator("#page-users")).toContainText("new.root@example.test");
  });

  test("root-user drawer form uploads and links a profile picture asset before save", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator("#page-users [data-directory-create]").click();
    const createForm = page.locator('#page-users [data-directory-form="create"]');
    await createForm.locator('input[name="email"]').fill("picture.root@example.test");
    await createForm.locator('input[name="firstName"]').fill("Picture");
    await createForm.locator('input[name="lastName"]').fill("Root");
    await createForm.locator('input[name="profilePictureAltText"]').fill("Picture Root profile portrait");
    await createForm.locator("[data-form-upload-input]").setInputFiles({
      name: "profile.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer,
    });

    await expect(createForm.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-state", "complete");
    await expect(createForm.locator("[data-form-upload-status-copy]")).toHaveText("Ready to save");
    await expect(createForm.locator("[data-form-upload-preview-image]")).toHaveJSProperty("naturalWidth", 1);
    await expect(createForm.locator("[data-form-upload-preview-image]")).toHaveAttribute("src", /^data:image\/png/);
    await expect(createForm.locator('input[name="profilePictureAssetId"]')).toHaveValue(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );

    await page.locator("#page-users [data-directory-form-save]").click();

    await expect(page.locator("#root-users-detail-title")).toHaveText("Picture Root");
    await expect(page.locator("#shell-message")).toContainText("Create root user saved");
  });

  test("root-user drawer form decorative profile pictures do not require alt text after a validation miss", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    await page.locator("#page-users [data-directory-create]").click();
    const createForm = page.locator('#page-users [data-directory-form="create"]');
    await createForm.locator('input[name="email"]').fill("decorative.root@example.test");
    await createForm.locator('input[name="firstName"]').fill("Decorative");
    await createForm.locator('input[name="lastName"]').fill("Root");
    await createForm.locator("[data-form-upload-input]").setInputFiles({
      name: "decorative-profile.png",
      mimeType: "image/png",
      buffer: tinyPngBuffer,
    });
    await expect(createForm.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-state", "complete");

    await page.locator("#page-users [data-directory-form-save]").click();
    await expect(page.locator("#shell-message")).toContainText("Add alt text or mark the profile picture as decorative.");
    await expect(createForm.locator('input[name="profilePictureAltText"]')).toHaveJSProperty("validationMessage", "");
    await createForm.locator(".form-toggle-row").click();
    await expect(createForm.locator('input[name="profilePictureDecorative"]')).toBeChecked();

    const saveRequest = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return request.method() === "POST" && url.pathname === "/v1/root-users";
    });
    await page.locator("#page-users [data-directory-form-save]").click();
    const request = await saveRequest;
    const payload = request.postDataJSON();

    expect(payload.profilePictureAssetId).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(payload.profilePictureDecorative).toBe(true);
    expect(payload.profilePictureAltText).toBeNull();
    await expect(page.locator("#root-users-detail-title")).toHaveText("Decorative Root");
  });

  test("root-user drawer form explains when the backend upload route is stale", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page, { uploadBytesStatus: 404, uploadBytesContentType: "text/html" });

    await page.locator("#page-users [data-directory-create]").click();
    const createForm = page.locator('#page-users [data-directory-form="create"]');
    await createForm.locator("[data-form-upload-input]").setInputFiles({
      name: "profile.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("profile"),
    });

    await expect(createForm.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-state", "error");
    await expect(page.locator("#shell-message")).toContainText(
      "The profile-picture upload route is not available. Restart the app server and try again.",
    );
  });

  test("root-user drawer form blocks oversized profile pictures before upload", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapUsersPage(page);

    let uploadIntentRequests = 0;
    page.on("request", (request) => {
      if (request.url().includes("/v1/assets/upload-intents")) {
        uploadIntentRequests += 1;
      }
    });

    await page.locator("#page-users [data-directory-create]").click();
    const createForm = page.locator('#page-users [data-directory-form="create"]');
    await createForm.locator("[data-form-upload-input]").setInputFiles({
      name: "large-profile.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.alloc((5 * 1024 * 1024) + 1),
    });

    await expect(createForm.locator("[data-form-upload-field]")).toHaveAttribute("data-form-upload-state", "error");
    await expect(createForm.locator("[data-form-upload-status-copy]")).toHaveText("Use an image up to 5 MB");
    await expect(page.locator("#shell-message")).toContainText("Use a profile picture up to 5 MB.");
    expect(uploadIntentRequests).toBe(0);
  });

  test("TC-TENANTS-E2E-002 and JY-ROOT-ADMIN-007 tenants can be created, edited, listed, and reloaded from the governed drawer form", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapDirectoryPage(page, "/root-admin/tenants", "#page-tenants");

    await expect(page.locator("#tenants-list-page")).toBeVisible();
    await page.locator("#page-tenants [data-directory-create]").click();
    await page.locator('#page-tenants [data-directory-form="create"] input[name="bizId"]').fill("launch-team");
    await page.locator('#page-tenants [data-directory-form="create"] input[name="name"]').fill("Launch Team");
    await page.locator('#page-tenants [data-directory-form="create"] select[name="category"]').selectOption("customer");
    await page.locator('#page-tenants [data-directory-form="create"] select[name="status"]').selectOption("live");
    await page.locator("#page-tenants [data-directory-form-save]").click();

    await expect(page.locator("#tenants-detail-title")).toHaveText("Launch Team");
    await expect(page.locator("#shell-message")).toContainText("Create tenant saved");

    await page.locator("#tenants-detail-edit").click();
    await page.locator('#page-tenants [data-directory-form="edit"] input[name="name"]').fill("Launch Team Edited");
    await page.locator("#page-tenants [data-directory-form-save]").click();

    await expect(page.locator("#tenants-detail-title")).toHaveText("Launch Team Edited");
    await expect(page.locator("#page-tenants")).toContainText("Launch Team Edited");

    await page.reload();
    await expect(page.locator("#page-tenants")).toBeVisible();
    await expect(page.locator("#tenants-list-page")).toBeVisible();
    await expect(page.locator("#page-tenants")).toContainText("Launch Team Edited");
    await expect(page.locator("#page-tenants")).toContainText("launch-team");
  });

  test("tenant admins can be created inside the selected tenant from the governed form workspace", async ({ page }) => {
    await page.setViewportSize({ width: 1560, height: 1400 });
    await bootstrapDirectoryPage(page, "/root-admin/tenant-admins", "#page-tenant-admins");

    await expect(page.locator("#tenant-admins-list-page")).toBeVisible();
    await expect(page.locator("#page-tenant-admins [data-directory-tenant-filter]")).toHaveValue(
      "10000000-0000-4000-8000-000000000001",
    );

    await page.locator("#page-tenant-admins [data-directory-create]").click();
    await page.locator('#page-tenant-admins [data-directory-form="create"] input[name="email"]').fill("new.admin@example.test");
    await page.locator('#page-tenant-admins [data-directory-form="create"] input[name="firstName"]').fill("New");
    await page.locator('#page-tenant-admins [data-directory-form="create"] input[name="lastName"]').fill("Admin");
    await page.locator("#page-tenant-admins [data-directory-form-save]").click();

    await expect(page.locator("#tenant-admins-detail-title")).toHaveText("New Admin");
    await expect(page.locator("#shell-message")).toContainText("Create tenant admin saved");
    await expect(page.locator("#page-tenant-admins")).toContainText("new.admin@example.test");

    await page.locator("#tenant-admins-detail-edit").click();
    await page.locator('#page-tenant-admins [data-directory-form="edit"] input[name="firstName"]').fill("Edited");
    await page.locator("#page-tenant-admins [data-directory-form-save]").click();

    await expect(page.locator("#tenant-admins-detail-title")).toHaveText("Edited Admin");
    await expect(page.locator("#page-tenant-admins")).toContainText("Edited Admin");
  });
});
