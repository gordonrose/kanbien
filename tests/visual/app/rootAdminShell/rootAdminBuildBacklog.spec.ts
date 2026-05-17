import { expect, test, type Page } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "9999-04-16T18:00:00.000Z",
};

function createRootAdminBuildTree() {
  return {
    rootFamilies: [
      {
        rootFamilyId: "root-admin",
        displayLabel: "Root Admin",
        routePrefix: "/root-admin",
        modules: [
          {
            webAppModuleId: "module-root-admin",
            rootFamilyId: "root-admin",
            moduleKey: "root-admin-shell",
            displayLabel: "Root Admin Shell",
            landingPageWebAppPageId: "page-overview",
            status: "live",
            sortOrder: 1,
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
            ],
            orphanedPages: [],
          },
          {
            webAppModuleId: "module-build",
            rootFamilyId: "root-admin",
            moduleKey: "build",
            displayLabel: "Build",
            landingPageWebAppPageId: "page-build-backlog",
            status: "live",
            sortOrder: 2,
            pages: [
              {
                webAppPageId: "page-build-backlog",
                pageKey: "build-backlog",
                displayLabel: "Backlog",
                resolvedFullRoutePath: "/root-admin/build/backlog",
                children: [],
              },
              {
                webAppPageId: "page-build-workspace",
                pageKey: "build-workspace",
                displayLabel: "Workspace",
                resolvedFullRoutePath: "/root-admin/build/workspace",
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
    "page-build-backlog": { displayLabel: "Build", showInTopNav: true, topNavOrder: 2 },
    "page-build-workspace": { displayLabel: "Workspace", showInTopNav: true, topNavOrder: 3 },
  };
  const record = settingsByPageId[pageId];

  return {
    webAppPageId: pageId,
    rootFamilyId: "root-admin",
    displayLabel: record?.displayLabel ?? "Page",
    hasStoredSettings: true,
    iconKey: "page-default",
    effectiveIconKey: "page-default",
    showInTopNav: record?.showInTopNav === true,
    topNavOrder: record?.topNavOrder ?? null,
    pageTemplateKey: null,
    effectivePageTemplateKey: null,
    contextNavItems: [],
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z",
  };
}

async function bootstrapAuthenticatedBuildBacklog(page: Page) {
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

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createRootAdminBuildTree()),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/pages\/([^/?]+)$/, async (route) => {
    const pageId = route.request().url().match(/\/pages\/([^/?]+)$/)?.[1] ?? "page-overview";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createPageSettingsRecord(decodeURIComponent(pageId))),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/root-admin\/pages\/[^/]+\/context-nav$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey: "build-backlog",
        items: [],
      }),
    });
  });

  await page.goto("/root-admin/build/backlog");
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-build-backlog").waitFor({ state: "visible" });
  await page.locator("#floating-tab-header").waitFor({ state: "visible" });
  await expect(page.locator("[data-build-work-panel-panel]")).not.toHaveClass(/is-open/);
}

async function bootstrapAuthenticatedBuildWorkspace(page: Page) {
  await bootstrapAuthenticatedBuildBacklog(page);
  await page.goto("/root-admin/build/workspace");
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator("#page-build-workspace").waitFor({ state: "attached" });
  await page.locator("#root-admin-conversation-panel-mount [data-root-admin-chat-workspace-mock]").waitFor({ state: "visible" });
}

test("root-admin Build Backlog consumes the governed floating tab header seam on a path-backed page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await bootstrapAuthenticatedBuildBacklog(page);

  await expect(page).toHaveURL(/\/root-admin\/build\/backlog$/);
  await expect(page.locator("#breadcrumb-page-minus-one-link")).toHaveText("Build");
  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Backlog");
  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="build-backlog"]')).toHaveAttribute(
    "href",
    "/root-admin/build/backlog",
  );
  await expect(page.locator("#root-admin-build-backlog-title")).toHaveText("Backlog");
  await expect(page.locator("#page-build-backlog > .floating-tab-workspace")).toHaveAttribute(
    "data-floating-tab-canvas",
    "full",
  );

  const canvasGeometry = await page.locator("#page-build-backlog").evaluate((pageNode) => {
    const workspace = pageNode.querySelector(".floating-tab-workspace");
    const shell = pageNode.querySelector(".floating-tab-project-shell");
    const header = pageNode.querySelector("#floating-tab-header");
    if (!(workspace instanceof HTMLElement) || !(shell instanceof HTMLElement) || !(header instanceof HTMLElement)) {
      return null;
    }
    const pageRect = pageNode.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    return {
      pageWidth: pageRect.width,
      shellWidth: shellRect.width,
      headerWidth: headerRect.width,
      shellLeftOffset: shellRect.left - pageRect.left,
    };
  });

  expect(canvasGeometry).not.toBeNull();
  expect(canvasGeometry?.shellWidth).toBeGreaterThan(canvasGeometry!.pageWidth - 4);
  expect(canvasGeometry?.headerWidth).toBeGreaterThan(canvasGeometry!.pageWidth - 4);
  expect(Math.abs(canvasGeometry?.shellLeftOffset ?? 999)).toBeLessThan(2);

  const header = page.locator("#floating-tab-header");
  await expect(header).toHaveAttribute("data-floating-tab-category-switch", "true");
  await expect(header).toHaveAttribute("data-floating-tab-expandable", "true");
  await expect(header).toHaveAttribute("data-floating-tab-sub-tabs", "true");
  await expect(header).toHaveAttribute("data-floating-tab-attention", "true");
  await expect(header).toHaveAttribute("data-floating-tab-count", "10");
  await expect(header).toHaveAttribute("data-floating-tab-crowded", "true");
  await expect(page.locator("#floating-tab-workspace")).toHaveAttribute("data-floating-tab-seam-mount", "true");
  await expect(page.locator("#floating-tab-sub-tabs")).toBeVisible();
  await expect(page.locator(".floating-tab-card")).toHaveCount(12);
  await expect(page.locator(".floating-tab-card:not(.floating-tab-card-fixture-hidden)")).toHaveCount(10);
  await expect(page.locator(".floating-tab-attention-label").first()).toBeVisible();
  await expect(page.locator("#floating-tab-review")).not.toHaveAttribute("data-tooltip", /.+/);
  await expect(page.locator("#floating-tab-review .floating-tab-card-title")).not.toHaveAttribute("data-tooltip", /.+/);
  await expect(page.locator("#floating-tab-review .floating-tab-attention-label")).not.toHaveAttribute("data-tooltip", /.+/);
  await expect(page.locator("#floating-tab-header [title]")).toHaveCount(0);
  await page.setViewportSize({ width: 660, height: 840 });
  await page.locator("#floating-tab-header").waitFor({ state: "visible" });
  const truncatedTab = page.locator(".floating-tab-card[data-tooltip]").filter({ hasText: "Escalate" }).first();
  await expect(truncatedTab).toHaveAttribute("data-tooltip", /Escalated/);
  await truncatedTab.locator(".floating-tab-card-title[data-tooltip]").hover();
  await expect(page.locator("#shared-floating-tooltip")).toBeVisible();
  await expect(page.locator("#shared-floating-tooltip")).toHaveText("Escalated");
  await page.setViewportSize({ width: 1440, height: 1000 });
  const attentionSubTabAlignment = await page
    .locator(".floating-tab-sub-tab[data-sub-tab-attention='true']")
    .first()
    .evaluate((button) => {
      const label = button.querySelector("span");
      const count = button.querySelector("strong");
      const attention = button.querySelector("em");
      if (!(label instanceof HTMLElement) || !(count instanceof HTMLElement) || !(attention instanceof HTMLElement)) {
        return null;
      }
      const buttonRect = button.getBoundingClientRect();
      const buttonCenter = buttonRect.top + buttonRect.height / 2;
      return [label, count, attention].map((item) => {
        const rect = item.getBoundingClientRect();
        return Math.abs(rect.top + rect.height / 2 - buttonCenter);
      });
    });
  expect(attentionSubTabAlignment).not.toBeNull();
  expect(Math.max(...attentionSubTabAlignment!)).toBeLessThan(2);

  await page.locator("#floating-tab-category-toggle").click();
  await expect(page.locator("#floating-tab-category-drawer")).toBeVisible();
  await page.locator('button[data-floating-tab-category="priority"]').click();
  await expect(page.locator("#floating-tab-header")).toHaveAttribute("data-floating-tab-category", "priority");

  await page.locator("#display-settings-button").click();
  await expect(page.locator("#display-settings-drawer")).toBeVisible();
  const shellLayering = await page.locator("#display-settings-drawer").evaluate((drawer) => {
    const header = document.querySelector("#floating-tab-header");
    const nav = document.querySelector(".context-nav");
    if (!(drawer instanceof HTMLElement) || !(header instanceof HTMLElement) || !(nav instanceof HTMLElement)) {
      return null;
    }
    const drawerRect = drawer.getBoundingClientRect();
    const probeX = drawerRect.left + drawerRect.width - 12;
    const probeY = Math.max(drawerRect.top + 64, header.getBoundingClientRect().top + 24);
    const topElement = document.elementFromPoint(probeX, probeY);
    return {
      drawerZIndex: Number.parseInt(window.getComputedStyle(drawer).zIndex, 10),
      headerZIndex: Number.parseInt(window.getComputedStyle(header).zIndex, 10),
      navZIndex: Number.parseInt(window.getComputedStyle(nav).zIndex, 10),
      drawerOwnsProbe: drawer.contains(topElement),
    };
  });
  expect(shellLayering).not.toBeNull();
  expect(shellLayering?.navZIndex).toBeGreaterThanOrEqual(2147481000);
  expect(shellLayering?.drawerZIndex).toBeGreaterThanOrEqual(2147481001);
  expect(shellLayering?.drawerZIndex).toBeGreaterThan(shellLayering!.headerZIndex);
  expect(shellLayering?.navZIndex).toBeGreaterThan(shellLayering!.headerZIndex);
  expect(shellLayering?.drawerOwnsProbe).toBe(true);
  await page.locator("#display-settings-close").click();
  await expect(page.locator("#display-settings-drawer")).toBeHidden();

  await page.locator("#floating-tab-collapse-toggle").click();
  await expect(page.locator("#floating-tab-panel")).toBeHidden();
  await expect(page.locator("#floating-tab-collapsed-summary")).toBeVisible();
});

test("root-admin Build Workspace consumes the chat workspace seam as an in-app proof route", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await bootstrapAuthenticatedBuildWorkspace(page);

  await expect(page).toHaveURL(/\/root-admin\/build\/workspace$/);
  await expect(page.locator("#breadcrumb-page-minus-one-link")).toHaveText("Build");
  await expect(page.locator("#breadcrumb-current-label")).toHaveText("Workspace");
  await expect(page.locator('#primary-nav-links .nav-link[data-page-link="build-workspace"]')).toHaveAttribute(
    "href",
    "/root-admin/build/workspace",
  );

  const mount = page.locator("#root-admin-conversation-panel-mount");
  const shell = mount.locator("[data-chat-workspace-shell]");
  await expect(page.locator("#page-build-workspace [data-chat-workspace-shell]")).toHaveCount(0);
  await expect(shell).toBeVisible();
  await expect(shell).toHaveAttribute(
    "data-chat-workspace-expanded",
    "true",
  );
  await expect(shell).toHaveAttribute("data-chat-workspace-history-open", "false");
  await expect(mount.locator("[data-chat-workspace-entity-workspace]")).toBeVisible();
  await expect(mount.locator("[data-build-work-panel-packet]")).toHaveCount(0);

  const geometry = await mount.evaluate((node) => {
    const mountRect = node.getBoundingClientRect();
    const shell = node.querySelector("[data-chat-workspace-shell]");
    const shellRect = shell?.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    return shellRect
      ? {
          mountBottomGap: Math.round(viewportHeight - mountRect.bottom),
          mountHeight: Math.round(mountRect.height),
          mountLeft: Math.round(mountRect.left),
          shellBottomGap: Math.round(viewportHeight - shellRect.bottom),
          shellHeight: Math.round(shellRect.height),
          shellLeft: Math.round(shellRect.left),
          shellRightGap: Math.round(viewportWidth - shellRect.right),
          shellWidth: Math.round(shellRect.width),
          viewportHeight,
          viewportWidth,
        }
      : null;
  });
  expect(geometry).not.toBeNull();
  expect(geometry?.mountBottomGap).toBeLessThanOrEqual(1);
  expect(geometry?.shellBottomGap).toBeLessThanOrEqual(1);
  expect(geometry?.shellHeight).toBeGreaterThan(geometry!.viewportHeight - 150);
  expect(geometry?.shellLeft).toBeLessThanOrEqual(80);
  expect(geometry?.shellRightGap).toBeLessThanOrEqual(1);
  expect(geometry?.shellWidth).toBeGreaterThan(geometry!.viewportWidth - 90);

  await page.locator("#display-settings-button").click();
  await page.locator('[data-theme-option="dark"]').click();
  await expect(shell).toHaveAttribute("data-theme-scope", "dark");
  const darkColors = await shell.evaluate((node) => {
    const shellStyle = getComputedStyle(node);
    const listPanel = node.querySelector(".floating-tab-list-panel");
    const listStyle = listPanel instanceof HTMLElement ? getComputedStyle(listPanel) : null;
    return {
      shellBackground: shellStyle.backgroundColor,
      listBackground: listStyle?.backgroundColor ?? "",
      text: shellStyle.color,
    };
  });
  expect(darkColors.shellBackground).toMatch(/rgb\(17, 24, 39\)|rgb\(15, 23, 42\)/);
  expect(darkColors.listBackground).toMatch(/rgb\(23, 32, 51\)|rgba\(23, 32, 51/);

  await mount.locator("[data-chat-workspace-chat-selector-toggle]").click();
  await expect(shell).toHaveAttribute("data-chat-workspace-history-open", "true");
  await expect(mount.locator("[data-chat-workspace-history-dock] .build-work-panel-demo-history")).toBeVisible();
  const workspaceToggle = mount.locator("[data-chat-workspace-toggle]").first();
  await workspaceToggle.click();
  await expect(shell).toHaveAttribute("data-chat-workspace-expanded", "false");
  await expect(shell).toHaveAttribute("data-chat-workspace-history-open", "false");
  await expect(mount.locator("[data-build-work-panel-panel]")).toHaveAttribute("data-history-open", "false");
  await expect(mount.locator("[data-chat-workspace-history-dock] .build-work-panel-demo-history")).toHaveCount(0);
  await expect(mount.locator(".chat-workspace-chat-pane .build-work-panel-demo-history")).toBeHidden();
  await workspaceToggle.click();
  await expect(shell).toHaveAttribute("data-chat-workspace-expanded", "true");
  await expect(shell).toHaveAttribute("data-chat-workspace-history-open", "true");

  const buildAction = mount.locator("[data-build-work-panel-build-action]");
  await buildAction.click();
  await expect(mount).toHaveAttribute("data-panel-open", "false");
  await expect(shell).toHaveAttribute("data-chat-workspace-panel-open", "false");
  await expect(shell).toBeVisible();
  await expect(mount.locator("[data-chat-workspace-main]")).toBeHidden();
  await expect(mount.locator("[data-chat-workspace-layer-toolbar]")).toBeHidden();
  await expect(mount.locator(".chat-workspace-chat-pane")).toBeVisible();
  await expect(buildAction).toBeVisible();
  await expect(mount.locator("[data-chat-workspace-entity-workspace]")).toBeHidden();
  await expect(mount.locator("[data-build-work-panel-panel]")).not.toHaveClass(/is-open/);
  const collapsedGeometry = await mount.evaluate((node) => {
    const mountRect = node.getBoundingClientRect();
    const shell = node.querySelector("[data-chat-workspace-shell]");
    const shellRect = shell?.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    return shellRect
      ? {
          mountRightGap: Math.round(viewportWidth - mountRect.right),
          mountWidth: Math.round(mountRect.width),
          shellLeft: Math.round(shellRect.left),
          shellRightGap: Math.round(viewportWidth - shellRect.right),
          shellWidth: Math.round(shellRect.width),
          viewportWidth,
        }
      : null;
  });
  expect(collapsedGeometry).not.toBeNull();
  expect(collapsedGeometry?.mountRightGap).toBeLessThanOrEqual(1);
  expect(collapsedGeometry?.mountWidth).toBeLessThanOrEqual(66);
  expect(collapsedGeometry?.shellRightGap).toBeLessThanOrEqual(1);
  expect(collapsedGeometry?.shellWidth).toBeLessThanOrEqual(66);
  expect(collapsedGeometry?.shellLeft).toBeGreaterThan(collapsedGeometry!.viewportWidth - 70);
  await buildAction.hover();
  const tooltipGeometry = await buildAction.evaluate((button) => {
    const shell = button.closest("[data-chat-workspace-shell]");
    const afterStyle = getComputedStyle(button, "::after");
    const buttonRect = button.getBoundingClientRect();
    const tooltipWidth = Number.parseFloat(afterStyle.width);
    const gap = Number.parseFloat(afterStyle.right);
    return {
      display: afterStyle.display,
      shellOverflow: shell instanceof HTMLElement ? getComputedStyle(shell).overflow : "",
      tooltipLeft: Math.round(buttonRect.left - gap - tooltipWidth),
    };
  });
  expect(tooltipGeometry.display).toBe("block");
  expect(tooltipGeometry.shellOverflow).toBe("visible");
  expect(tooltipGeometry.tooltipLeft).toBeGreaterThan(0);

  await buildAction.click();
  await expect(mount).toHaveAttribute("data-panel-open", "true");
  await expect(shell).toHaveAttribute("data-chat-workspace-panel-open", "true");
  await expect(shell).toHaveAttribute("data-chat-workspace-expanded", "false");
  await expect(shell).toHaveAttribute("data-chat-workspace-history-open", "false");
  await expect(mount.locator("[data-build-work-panel-panel]")).toHaveClass(/is-open/);
  await expect(mount.locator("[data-chat-workspace-layer-toolbar]")).toBeHidden();
  await expect(mount.locator("[data-chat-workspace-entity-workspace]")).toBeHidden();
  await expect(mount.locator(".chat-workspace-chat-pane")).toBeVisible();
  const reopenedGeometry = await shell.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      rightGap: Math.round(window.innerWidth - rect.right),
      width: Math.round(rect.width),
      viewportWidth: window.innerWidth,
    };
  });
  expect(reopenedGeometry.rightGap).toBeLessThanOrEqual(1);
  expect(reopenedGeometry.width).toBeGreaterThan(700);
  expect(reopenedGeometry.width).toBeLessThan(reopenedGeometry.viewportWidth - 300);
});
