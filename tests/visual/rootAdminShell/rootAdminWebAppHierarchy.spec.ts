import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "2026-04-16T18:00:00.000Z",
};

const baseHierarchyTree = {
  rootFamilies: [
    {
      rootFamilyId: "root-admin",
      displayLabel: "Root Admin",
      routePrefix: "/root-admin",
      sortOrder: 1,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-16T18:00:00.000Z",
      modules: [
        {
          webAppModuleId: "module-admin-foundation",
          rootFamilyId: "root-admin",
          moduleKey: "admin-foundation",
          displayLabel: "Administration Foundation",
          status: "live",
          sortOrder: 1,
          createdAt: "2026-04-01T10:00:00.000Z",
          updatedAt: "2026-04-16T18:00:00.000Z",
          pages: [
            {
              webAppPageId: "page-admin-overview",
              rootFamilyId: "root-admin",
              webAppModuleId: "module-admin-foundation",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "overview",
              displayLabel: "Overview Dashboard",
              routeSegment: "overview",
              resolvedFullRoutePath: "/root-admin/overview",
              status: "live",
              sortOrder: 1,
              createdByRootAdminUserId: "root_user_001",
              bootstrapSource: null,
              createdAt: "2026-04-01T10:00:00.000Z",
              updatedAt: "2026-04-16T18:00:00.000Z",
              activeLocator: {
                webAppPageLocatorId: "locator-admin-overview",
                webAppPageId: "page-admin-overview",
                rootFamilyId: "root-admin",
                locatorType: "hash-state",
                canonicalLocator: "/root-admin#overview",
                routePath: "/root-admin",
                routeHash: "overview",
                normalizedLocatorKey: "/root-admin#overview",
                isActive: true,
                createdByRootAdminUserId: "root_user_001",
                createdAt: "2026-04-01T10:00:00.000Z",
                updatedAt: "2026-04-16T18:00:00.000Z",
              },
              children: [],
            },
            {
              webAppPageId: "page-admin-structure",
              rootFamilyId: "root-admin",
              webAppModuleId: "module-admin-foundation",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "structure",
              displayLabel:
                "Structure and governance workspace assumptions for enterprise operations and durable application administration",
              routeSegment: "structure",
              resolvedFullRoutePath: "/root-admin/structure",
              status: "review",
              sortOrder: 2,
              createdByRootAdminUserId: "root_user_001",
              bootstrapSource: null,
              createdAt: "2026-04-01T10:00:00.000Z",
              updatedAt: "2026-04-16T18:00:00.000Z",
              activeLocator: {
                webAppPageLocatorId: "locator-admin-structure",
                webAppPageId: "page-admin-structure",
                rootFamilyId: "root-admin",
                locatorType: "hash-state",
                canonicalLocator: "/root-admin#structure",
                routePath: "/root-admin",
                routeHash: "structure",
                normalizedLocatorKey: "/root-admin#structure",
                isActive: true,
                createdByRootAdminUserId: "root_user_001",
                createdAt: "2026-04-01T10:00:00.000Z",
                updatedAt: "2026-04-16T18:00:00.000Z",
              },
              children: [],
            },
          ],
          orphanedPages: [],
        },
      ],
    },
    {
      rootFamilyId: "design-system",
      displayLabel: "Design System",
      routePrefix: "/design-system",
      sortOrder: 2,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-16T18:00:00.000Z",
      modules: [
        {
          webAppModuleId: "module-patterns",
          rootFamilyId: "design-system",
          moduleKey: "patterns",
          displayLabel: "Patterns",
          status: "live",
          sortOrder: 1,
          createdAt: "2026-04-01T10:00:00.000Z",
          updatedAt: "2026-04-16T18:00:00.000Z",
          pages: [
            {
              webAppPageId: "page-patterns-hierarchy-tree",
              rootFamilyId: "design-system",
              webAppModuleId: "module-patterns",
              parentPageId: null,
              placementType: "module-root",
              pageKey: "hierarchy-tree",
              displayLabel: "Hierarchy Tree",
              routeSegment: "hierarchy-tree",
              resolvedFullRoutePath: "/design-system/patterns/hierarchy-tree",
              status: "live",
              sortOrder: 1,
              createdByRootAdminUserId: "root_user_001",
              bootstrapSource: null,
              createdAt: "2026-04-01T10:00:00.000Z",
              updatedAt: "2026-04-16T18:00:00.000Z",
              activeLocator: null,
              children: [],
            },
          ],
          orphanedPages: [],
        },
      ],
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createMockHierarchyTree() {
  return clone(baseHierarchyTree);
}

function findModule(tree, moduleId) {
  for (const rootFamily of tree.rootFamilies) {
    for (const module of rootFamily.modules ?? []) {
      if (module.webAppModuleId === moduleId) {
        return { rootFamily, module };
      }
    }
  }
  return null;
}

function findPageInNodes(nodes, pageId) {
  for (const page of nodes) {
    if (page.webAppPageId === pageId) {
      return page;
    }
    const nested = findPageInNodes(page.children ?? [], pageId);
    if (nested) {
      return nested;
    }
  }
  return null;
}

function findPage(tree, pageId) {
  for (const rootFamily of tree.rootFamilies) {
    for (const module of rootFamily.modules ?? []) {
      const page = findPageInNodes(module.pages ?? [], pageId);
      if (page) {
        return { rootFamily, module, page };
      }
    }
  }
  return null;
}

function removePageFromNodes(nodes, pageId) {
  const index = nodes.findIndex((page) => page.webAppPageId === pageId);
  if (index >= 0) {
    return nodes.splice(index, 1)[0];
  }

  for (const page of nodes) {
    const nested = removePageFromNodes(page.children ?? [], pageId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function removePage(tree, pageId) {
  for (const rootFamily of tree.rootFamilies) {
    for (const module of rootFamily.modules ?? []) {
      const removed = removePageFromNodes(module.pages ?? [], pageId);
      if (removed) {
        return removed;
      }
    }
  }

  return null;
}

async function bootstrapAuthenticatedHierarchy(page: Page, hash = "#web-app-hierarchy", search = "") {
  let currentHierarchyTree = createMockHierarchyTree();

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
        totalPages: 1,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(currentHierarchyTree),
    });
  });

  await page.route("**/v1/web-app-hierarchy/modules/*", async (route) => {
    const moduleId = route.request().url().split("/").at(-1);
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const record = findModule(currentHierarchyTree, moduleId ?? "");

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Module not found." }) });
      return;
    }

    if (payload.displayLabel) {
      record.module.displayLabel = payload.displayLabel;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(record.module),
    });
  });

  await page.route(/.*\/v1\/web-app-hierarchy\/pages\/[^/]+$/, async (route) => {
    const pageId = route.request().url().split("/").at(-1);
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const record = findPage(currentHierarchyTree, pageId ?? "");

    if (!record) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    if (payload.displayLabel) {
      record.page.displayLabel = payload.displayLabel;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(record.page),
    });
  });

  await page.route(/.*\/v1\/web-app-hierarchy\/pages\/[^/]+\/move$/, async (route) => {
    const segments = route.request().url().split("/");
    const pageId = segments.at(-2);
    const payload = JSON.parse(route.request().postData() ?? "{}");
    const removed = removePage(currentHierarchyTree, pageId ?? "");

    if (!removed) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Page not found." }) });
      return;
    }

    removed.rootFamilyId = payload.rootFamilyId;
    removed.webAppModuleId = payload.webAppModuleId;
    removed.parentPageId = payload.targetParentPageId ?? null;
    removed.placementType = payload.placementType;

    const targetModuleRecord = findModule(currentHierarchyTree, payload.webAppModuleId);
    if (!targetModuleRecord) {
      await route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "Module not found." }) });
      return;
    }

    if (payload.placementType === "orphaned") {
      targetModuleRecord.module.orphanedPages = targetModuleRecord.module.orphanedPages ?? [];
      targetModuleRecord.module.orphanedPages.push(removed);
    } else if (payload.targetParentPageId) {
      const parentRecord = findPage(currentHierarchyTree, payload.targetParentPageId);
      parentRecord?.page.children.push(removed);
    } else {
      targetModuleRecord.module.pages.push(removed);
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(removed),
    });
  });

  await page.goto(`/root-admin${search}${hash}`);
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-web-app-hierarchy").waitFor({ state: "visible" });
}

test("root-admin hierarchy page renders GetTree inside the signed-off hierarchy-tree posture", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Web App Hierarchy");
  await expect(page.locator('.context-nav .context-nav-item[aria-current="page"] .context-nav-label')).toHaveText("Hierarchy");
  await expect(page.locator("#root-admin-web-app-hierarchy-detail-title")).toHaveText("Overview Dashboard");
  await expect(page.locator("#root-admin-web-app-hierarchy-drawer")).toBeVisible();
  await expect(page.locator(".hierarchy-tree-row")).toHaveCount(6);
  await expect(page.locator(".hierarchy-tree-row").first()).toContainText("Root Admin");
  await expect(page.locator("#shell-message")).toContainText("Opened Web App Hierarchy.");
});

test("root-admin hierarchy page preserves long-title tooltip reveal", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const longTitle = page.locator(".hierarchy-tree-title").filter({
    hasText: "Structure and governance workspace assumptions",
  });
  await longTitle.hover();

  const tooltip = page.locator("#shared-floating-tooltip");
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText("Structure and governance workspace assumptions");
});

test("root-admin hierarchy page uses the eye action for open selected and external link for new-tab route launch", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const structureRow = page.locator(".hierarchy-tree-row").filter({
    hasText: "Structure and governance workspace assumptions",
  }).first();

  await structureRow.hover();

  const openButton = structureRow.getByRole("button", {
    name: "Open Structure and governance workspace assumptions for enterprise operations and durable application administration",
  });
  const newTabLink = structureRow.getByRole("link", {
    name: "Open Structure and governance workspace assumptions for enterprise operations and durable application administration in a new tab",
  });

  await expect(openButton).toBeVisible();
  const openIconState = await openButton.evaluate((button) => {
    const svg = button.querySelector("svg");
    const outline = svg?.querySelector("path");
    const pupil = svg?.querySelector("circle");

    if (!(svg instanceof SVGElement) || !(outline instanceof SVGPathElement) || !(pupil instanceof SVGCircleElement)) {
      return null;
    }

    const outlineStyle = window.getComputedStyle(outline);
    const pupilStyle = window.getComputedStyle(pupil);

    return {
      outlineStroke: outlineStyle.stroke,
      outlineFill: outlineStyle.fill,
      pupilStroke: pupilStyle.stroke,
      pupilFill: pupilStyle.fill,
    };
  });

  expect(openIconState).not.toBeNull();
  expect(openIconState?.outlineFill).toBe("none");
  expect(openIconState?.pupilFill).toBe("none");
  expect(openIconState?.outlineStroke).not.toBe("none");
  expect(openIconState?.outlineStroke).not.toBe("transparent");
  expect(openIconState?.pupilStroke).not.toBe("none");
  expect(openIconState?.pupilStroke).not.toBe("transparent");
  await expect(newTabLink).toHaveAttribute("href", "/root-admin/structure");
  await expect(newTabLink).toHaveAttribute("target", "_blank");
  await expect(newTabLink).toHaveAttribute("rel", "noopener noreferrer");

  await openButton.click();
  await expect(page.locator("#root-admin-web-app-hierarchy-detail-title")).toHaveText(
    "Structure and governance workspace assumptions for enterprise operations and durable application administration",
  );
  await expect(page.locator("#shell-message")).toContainText(
    "Opened Structure and governance workspace assumptions for enterprise operations and durable application administration.",
  );
});

test("root-admin hierarchy page shows the eye action across root, module, and page rows", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const rootRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Root Admin" }).first();
  await rootRow.hover();
  await expect(rootRow.getByRole("button", { name: "Open Root Admin" })).toBeVisible();
  await expect(rootRow.getByRole("link", { name: "Open Root Admin in a new tab" })).toHaveAttribute("href", "/root-admin");

  const moduleRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Administration Foundation" }).first();
  await moduleRow.hover();
  await expect(moduleRow.getByRole("button", { name: "Open Administration Foundation" })).toBeVisible();
  await expect(moduleRow.locator(".hierarchy-tree-inline-action")).toHaveCount(1);

  const pageRow = page.locator(".hierarchy-tree-row").filter({ hasText: "Overview Dashboard" }).first();
  await pageRow.hover();
  await expect(pageRow.getByRole("button", { name: "Open Overview Dashboard" })).toBeVisible();
  await expect(pageRow.getByRole("link", { name: "Open Overview Dashboard in a new tab" })).toHaveAttribute("href", "/root-admin/overview");
});

test("root-admin hierarchy page adopts full-screen drawer posture on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 960 });
  await bootstrapAuthenticatedHierarchy(page);

  const drawer = page.locator("#root-admin-web-app-hierarchy-drawer");
  await expect(drawer).toBeVisible();

  const drawerBox = await drawer.boundingBox();
  expect(drawerBox).not.toBeNull();
  expect(drawerBox?.x ?? 0).toBeLessThanOrEqual(1);
  expect(drawerBox?.width ?? 0).toBeGreaterThanOrEqual(558);
});

test("root-admin hierarchy page supports desktop drawer width resizing", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const drawer = page.locator("#root-admin-web-app-hierarchy-drawer");

  const before = await drawer.boundingBox();
  expect(before).not.toBeNull();

  await page.evaluate(() => {
    const handle = document.getElementById("root-admin-web-app-hierarchy-resize");
    if (!(handle instanceof HTMLElement)) {
      return;
    }

    handle.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true,
      pointerId: 1,
      clientX: 448,
    }));

    window.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true,
      pointerId: 1,
      clientX: 588,
    }));

    window.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true,
      pointerId: 1,
      clientX: 588,
    }));
  });

  const after = await drawer.boundingBox();
  expect(after).not.toBeNull();
  expect((after?.width ?? 0) - (before?.width ?? 0)).toBeGreaterThan(100);
});

test("root-admin hierarchy page mirrors the hierarchy drawer correctly in rtl", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page, "#web-app-hierarchy", "?lang=ar");

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Web App Hierarchy");

  const firstExpandableRow = page
    .locator(".hierarchy-tree-row")
    .filter({ has: page.locator(".hierarchy-tree-expander") })
    .first();
  const geometry = await firstExpandableRow.evaluate((row) => {
    const expander = row.querySelector(".hierarchy-tree-expander");
    const actions = row.querySelector(".hierarchy-tree-row-actions");
    const content = row.querySelector(".hierarchy-tree-content");

    if (!(expander instanceof HTMLElement) || !(actions instanceof HTMLElement) || !(content instanceof HTMLElement)) {
      return null;
    }

    const expanderRect = expander.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    return {
      expanderCenter: expanderRect.left + (expanderRect.width / 2),
      actionsCenter: actionsRect.left + (actionsRect.width / 2),
      contentCenter: contentRect.left + (contentRect.width / 2),
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry?.expanderCenter ?? 0).toBeGreaterThan(geometry?.contentCenter ?? 0);
  expect(geometry?.actionsCenter ?? 0).toBeLessThan(geometry?.contentCenter ?? 0);
});

test("root-admin hierarchy page supports inline rename backed by the hierarchy builder api", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const rowLabel = page.locator(".hierarchy-tree-label-button", { hasText: "Overview Dashboard" }).first();
  await rowLabel.dblclick();

  const renameField = page.locator(".hierarchy-tree-inline-input");
  await expect(renameField).toBeVisible();
  await renameField.fill("Overview Workspace");
  await renameField.press("Enter");

  await expect(page.locator(".hierarchy-tree-row")).toContainText(["Overview Workspace"]);
  await expect(page.locator("#root-admin-web-app-hierarchy-detail-title")).toHaveText("Overview Workspace");
  await expect(page.locator("#shell-message")).toContainText("Renamed page to Overview Workspace.");
});

test("root-admin hierarchy page can send a page to the orphan pool", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedHierarchy(page);

  const row = page.locator(".hierarchy-tree-row", { hasText: "Overview Dashboard" }).first();
  await row.locator(".hierarchy-tree-menu-button").click();
  await page.getByRole("menuitem", { name: "Send to orphan pool" }).click();

  await expect(page.locator(".hierarchy-tree-row")).not.toContainText(["Overview Dashboard"]);
  await expect(page.locator("#shell-message")).toContainText("Moved Overview Dashboard to the orphan pool.");
});
