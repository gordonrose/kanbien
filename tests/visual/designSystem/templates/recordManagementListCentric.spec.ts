import { expect, test } from "@playwright/test";

test("record management list-centric template renders the chat-derived record workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator(".sub-nav .search-input")).toBeVisible();
  await expect(page.locator(".breadcrumb-current")).toHaveAttribute("data-tooltip", "Home > Templates > record_management_list_centric");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-shell]")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "true");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-entity-workspace]")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-layer-toolbar")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-history-dock")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-index]")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-chat-pane")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-chat-mount .build-work-panel-demo-panel")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-chat-mount .build-work-panel-demo-action-nav")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-new-conversation]")).toHaveAttribute("data-tooltip", "Create new");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-new-conversation]")).toHaveAttribute("aria-label", "Create new");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-header-tool='Upload']")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-header-tool='Export']")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-header-tool='Sort']")).toBeVisible();
  await expect(page.locator("#record-management-display-settings-button")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-joint-header] [data-chat-workspace-layer-trigger]")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]")).toContainText("Current");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger] small")).toHaveText("Status Type");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger] strong")).toHaveText("Managed Records");
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-card").filter({ hasText: "Draft" })).toBeVisible();
  await expect(page.locator('[data-record-management-list-centric-mount] .floating-tab-card[data-tab-label="Ready for Review"]')).toHaveAttribute(
    "data-tab-attention",
    "true",
  );

  const geometry = await page.evaluate(() => {
    const subNav = document.querySelector(".sub-nav")?.getBoundingClientRect();
    const contextNav = document.querySelector(".context-nav")?.getBoundingClientRect();
    const filterPanel = document.querySelector("[data-record-management-filter-panel]")?.getBoundingClientRect();
    const filterHeader = document.querySelector("[data-record-management-filter-panel] .record-management-filter-header")?.getBoundingClientRect();
    const chatToolbar = document.querySelector("[data-record-management-list-centric-mount] .chat-workspace-chat-mount .build-work-panel-demo-action-nav")?.getBoundingClientRect();
    const secondaryHeader = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-header]")?.getBoundingClientRect();
    const secondaryLayerTrigger = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]")?.getBoundingClientRect();
    const entityTrigger = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-entity-selector-trigger]")?.getBoundingClientRect();
    const shell = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-shell]")?.getBoundingClientRect();
    const tabs = document.querySelector("[data-record-management-list-centric-mount] .floating-tab-header")?.getBoundingClientRect();
    const tabCards = Array.from(document.querySelectorAll("[data-record-management-list-centric-mount] .floating-tab-header .floating-tab-card"))
      .map((card) => card.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    const firstTab = tabCards.at(0);
    const lastTab = tabCards.at(-1);
    const listPanel = document.querySelector("[data-record-management-list-centric-mount] .floating-tab-list-panel")?.getBoundingClientRect();
    const firstRow = document.querySelector("[data-record-management-list-centric-mount] .floating-tab-row")?.getBoundingClientRect();
    const recordWorkspace = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-entity-workspace]")?.getBoundingClientRect();

    return subNav && contextNav && filterPanel && filterHeader && chatToolbar && secondaryHeader && secondaryLayerTrigger && entityTrigger && shell && tabs && firstTab && lastTab && listPanel && firstRow && recordWorkspace
      ? {
          chatToolbarLeft: Math.round(chatToolbar.left),
          chatToolbarRight: Math.round(chatToolbar.right),
          chatToolbarTop: Math.round(chatToolbar.top),
          contextRight: Math.round(contextNav.right),
          filterHeaderHeight: Math.round(filterHeader.height),
          filterLeft: Math.round(filterPanel.left),
          filterRight: Math.round(filterPanel.right),
          firstRowLeft: Math.round(firstRow.left),
          firstRowRight: Math.round(firstRow.right),
          firstTabLeft: Math.round(firstTab.left),
          lastTabRight: Math.round(lastTab.right),
          recordWorkspaceLeft: Math.round(recordWorkspace.left),
          recordWorkspaceRight: Math.round(recordWorkspace.right),
          shellBottom: Math.round(shell.bottom),
          shellLeft: Math.round(shell.left),
          shellRight: Math.round(shell.right),
          shellTop: Math.round(shell.top),
          subNavBottom: Math.round(subNav.bottom),
          tabsBottom: Math.round(tabs.bottom),
          listPanelBottom: Math.round(listPanel.bottom),
          listPanelTop: Math.round(listPanel.top),
          secondaryHeaderHeight: Math.round(secondaryHeader.height),
          secondaryLayerRight: Math.round(secondaryLayerTrigger.right),
          entityTriggerLeft: Math.round(entityTrigger.left),
          viewportBottom: document.documentElement.clientHeight,
          viewportRight: document.documentElement.clientWidth,
        }
      : null;
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs((geometry?.shellTop ?? 0) - (geometry?.subNavBottom ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.filterLeft ?? 0) - (geometry?.contextRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.shellLeft ?? 0) - (geometry?.contextRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.shellRight ?? 0) - (geometry?.viewportRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.shellBottom ?? 0) - (geometry?.viewportBottom ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.recordWorkspaceLeft ?? 0) - (geometry?.contextRight ?? 0))).toBeLessThanOrEqual(1);
  expect((geometry?.chatToolbarLeft ?? 0)).toBeGreaterThanOrEqual((geometry?.recordWorkspaceRight ?? 0) - 1);
  expect(Math.abs((geometry?.chatToolbarRight ?? 0) - (geometry?.viewportRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.chatToolbarTop ?? 0) - (geometry?.shellTop ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.listPanelTop ?? 0) - (geometry?.tabsBottom ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.listPanelBottom ?? 0) - (geometry?.viewportBottom ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.filterHeaderHeight ?? 0) - (geometry?.secondaryHeaderHeight ?? 0))).toBeLessThanOrEqual(1);
  expect((geometry?.entityTriggerLeft ?? 0)).toBeGreaterThanOrEqual(geometry?.secondaryLayerRight ?? 0);
});

test("record management template exposes display drawer controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await page.locator("#record-management-display-settings-button").click();
  await expect(page.locator("#record-management-display-settings-drawer")).toBeVisible();

  await page.locator("[data-record-management-theme-option='dark']").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-shell]")).toHaveAttribute("data-theme-scope", "dark");

  await page.locator("[data-record-management-direction-option='rtl']").click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await page.locator("[data-record-management-magnification-option='100']").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-magnification", "100");

  await page.locator("[data-record-management-drawer-view='root']").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-record-management-drawer-view-mode", "root");
  await page.locator("[data-record-management-drawer-view='end_user']").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-record-management-drawer-view-mode", "end_user");

  await page.locator("[data-record-management-status-count='16']").click();
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-header .floating-tab-card:not(.floating-tab-card-empty)")).toHaveCount(16);
  await expect(page.locator("[data-record-management-list-centric-mount] #chat-workspace-entity-overflow-summary-right")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] #chat-workspace-entity-overflow-summary-right")).toContainText("more");
  await page.locator("[data-record-management-list-centric-mount] #chat-workspace-entity-scroll-right").click();
  await expect(page.locator("[data-record-management-list-centric-mount] #chat-workspace-entity-overflow-summary-left")).toBeVisible();

  await page.locator("[data-record-management-list-count='0']").click();
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-list .floating-tab-row")).toHaveCount(0);

  await page.locator("[data-record-management-list-count='100']").click();
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-list .floating-tab-row")).toHaveCount(100);
  await expect.poll(async () => page.locator("[data-record-management-list-centric-mount] .floating-tab-list-panel").evaluate((panel) => panel.scrollHeight > panel.clientHeight)).toBe(true);
});

test("record management filter rail opens adjacent selection drawers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator("[data-record-management-filter-panel]")).toBeVisible();
  await page.locator("[data-record-management-filter-card='status']").click();
  await expect(page.locator("[data-record-management-filter-drawer]")).toBeVisible();
  await expect(page.locator("[data-record-management-filter-drawer-title]")).toHaveText("Status");

  await expect(page.locator("[data-record-management-filter-drawer] .form-drawer-select-option").first()).toBeVisible();
  await page.locator("[data-record-management-filter-option='status']").first().click();
  await expect(page.locator("[data-record-management-filter-count='status']")).toHaveText("1");
  await expect(page.locator("[data-record-management-filter-total]")).toHaveText("1 selected");
  await expect(page.locator("[data-record-management-filter-drawer] .form-drawer-select-selected-chip")).toHaveCount(1);

  await page.locator("[data-record-management-filter-toggle]").click();
  await expect(page.locator("[data-record-management-template-frame]")).toHaveAttribute("data-filter-expanded", "false");
});

test("record management create action opens a draft record form", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  const draftCount = page.locator('[data-record-management-list-centric-mount] .floating-tab-card[data-tab-label="Draft"] .floating-tab-card-count');
  await expect(draftCount).toHaveText("5");

  await page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-new-conversation]").click();

  await expect(page.locator("[data-record-management-list-centric-mount] [data-record-management-drawer-form]")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-record-management-drawer-form] input[name='recordName']")).toBeFocused();
  await expect(draftCount).toHaveText("6");
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-list .floating-tab-row").first()).toHaveAttribute(
    "data-record-management-placeholder-record",
    /RM-/,
  );
});

test("record management list drawer shows end-user and root entity attribute views", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await page.locator("[data-record-management-list-centric-mount] .floating-tab-list .floating-tab-row").first().click();

  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer]")).toBeVisible();
  await expect(page.locator("[data-record-management-user-attribute-view]")).toBeVisible();
  await expect(page.locator("[data-record-management-region-trigger='details']")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("[data-record-management-region-panel='details']")).toContainText("Organization details");
  await expect(page.locator("[data-record-management-user-attribute-card='name']")).toContainText("Acme Operations");

  await page.locator("[data-record-management-region-trigger='legal']").click();
  await expect(page.locator("[data-record-management-user-attribute-card='legalProfile']")).toContainText("Acme Operations Ltd");

  await page.locator("[data-record-management-region-trigger='locations']").click();
  await expect(page.locator("[data-record-management-user-attribute-card='headquarters']")).toContainText("North Region HQ");

  await page.locator("[data-record-management-region-trigger='branding']").click();
  await expect(page.locator("[data-record-management-user-attribute-card='primaryLogo']")).toContainText("Primary logo ready");

  await page.locator("[data-record-management-region-trigger='relationships']").click();
  await expect(page.locator("[data-record-management-user-attribute-card='businessUnits']")).toContainText("North Region");
  await expect(page.locator("[data-record-management-user-attribute-card='members']")).toContainText("Jordan Reyes");

  await page.locator("[data-record-management-region-trigger='references']").click();
  await expect(page.locator("[data-record-management-user-attribute-card='industry']")).toContainText("Technology");
  await expect(page.locator("[data-record-management-user-attribute-card='tier']")).toContainText("Strategic");
  await expect(page.locator("[data-record-management-attribute-view]")).toBeHidden();

  await page.locator("#record-management-display-settings-button").click();
  await page.locator("[data-record-management-drawer-view='root']").click();

  await expect(page.locator("[data-record-management-attribute-view]")).toBeVisible();
  await expect(page.locator("[data-record-management-attribute-view]")).toContainText("Organization attributes placed for this drawer");
  await expect(page.locator("[data-record-management-attribute-view]")).toContainText("Identity");
  await expect(page.locator("[data-record-management-attribute-card='name']")).toContainText("drawerSection / readonlyText");
  await page.locator("[data-record-management-region-trigger='relationships']").click();
  await expect(page.locator("[data-record-management-attribute-view]")).toContainText("Structure");
  await expect(page.locator("[data-record-management-attribute-card='businessUnits']")).toContainText("relationshipPanel / relationshipList");
  await page.locator("[data-record-management-region-trigger='elsewhere']").click();
  await expect(page.locator("[data-record-management-attribute-card='systemLifecycleStatus']")).toContainText("listRow:statusBadge");
});

test("templates catalog links to the record management list-centric template", async ({ page }) => {
  await page.goto("/design-system/templates");

  await expect(page.getByRole("link", { name: /record_management_list_centric/ })).toHaveAttribute(
    "href",
    "/design-system/templates/record_management_list_centric",
  );
});
