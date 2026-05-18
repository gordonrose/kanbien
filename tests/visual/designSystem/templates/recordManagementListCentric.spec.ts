import { expect, test } from "@playwright/test";

test("record management shell keeps top navigation centered with search", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 600 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator(".top-nav .primary-nav-links")).toBeVisible();
  await expect(page.locator(".sub-nav .search-shell")).toBeVisible();

  const geometry = await page.evaluate(() => {
    const primaryNav = document.querySelector(".top-nav .primary-nav-links")?.getBoundingClientRect();
    const searchShell = document.querySelector(".sub-nav .search-shell")?.getBoundingClientRect();
    if (!primaryNav || !searchShell) {
      return null;
    }

    return {
      primaryNavCenter: Math.round(primaryNav.left + primaryNav.width / 2),
      searchShellCenter: Math.round(searchShell.left + searchShell.width / 2),
    };
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs((geometry?.primaryNavCenter ?? 0) - (geometry?.searchShellCenter ?? 0))).toBeLessThanOrEqual(1);
});

test("record management list-centric template renders the chat-derived record workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator(".sub-nav .search-input")).toBeVisible();
  await expect(page.locator(".breadcrumb-current")).toHaveAttribute("title", "Home > Templates > record_management_list_centric");
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
  await page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]").click();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='delivery']")).toContainText("current");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='delivery']")).toContainText("Managed Records");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='child-1']")).toContainText("18 records");
  await page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]").click();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger] small")).toHaveText("View");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger] strong")).toHaveText("Managed Records");
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-card").filter({ hasText: "Draft" })).toBeVisible();
  await expect(page.locator('[data-record-management-list-centric-mount] .floating-tab-card[data-tab-label="Ready for Review"]')).toHaveAttribute(
    "data-tab-attention",
    "true",
  );
  await page.locator("[data-record-management-list-centric-mount] .floating-tab-row").first().click();
  await expect
    .poll(async () => page.locator("[data-record-management-list-centric-mount] .floating-tab-list-panel").evaluate((panel) => {
      const columns = getComputedStyle(panel).gridTemplateColumns
        .split(" ")
        .map((value) => Number.parseFloat(value))
        .filter((value) => Number.isFinite(value));
      return columns.length >= 2 ? columns[1] / columns[0] : 0;
    }))
    .toBeGreaterThan(2.8);

  const geometry = await page.evaluate(() => {
    const subNav = document.querySelector(".sub-nav")?.getBoundingClientRect();
    const searchShell = document.querySelector(".sub-nav .search-shell")?.getBoundingClientRect();
    const primaryNavLinks = document.querySelector(".top-nav .primary-nav-links")?.getBoundingClientRect();
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

    return subNav && searchShell && primaryNavLinks && contextNav && filterPanel && filterHeader && chatToolbar && secondaryHeader && secondaryLayerTrigger && entityTrigger && shell && tabs && firstTab && lastTab && listPanel && firstRow && recordWorkspace
      ? {
          chatToolbarLeft: Math.round(chatToolbar.left),
          chatToolbarRight: Math.round(chatToolbar.right),
          chatToolbarTop: Math.round(chatToolbar.top),
          contextRight: Math.round(contextNav.right),
          primaryNavCenter: Math.round(primaryNavLinks.left + primaryNavLinks.width / 2),
          filterHeaderHeight: Math.round(filterHeader.height),
          filterLeft: Math.round(filterPanel.left),
          filterRight: Math.round(filterPanel.right),
          firstRowLeft: Math.round(firstRow.left),
          firstRowRight: Math.round(firstRow.right),
          firstTabLeft: Math.round(firstTab.left),
          lastTabRight: Math.round(lastTab.right),
          recordWorkspaceLeft: Math.round(recordWorkspace.left),
          recordWorkspaceRight: Math.round(recordWorkspace.right),
          searchShellCenter: Math.round(searchShell.left + searchShell.width / 2),
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
  expect(Math.abs((geometry?.primaryNavCenter ?? 0) - (geometry?.searchShellCenter ?? 0))).toBeLessThanOrEqual(1);
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

  await page.locator("[data-record-management-edit-control-style='approved']").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-record-management-edit-control-style", "approved");
  await page.locator("[data-record-management-edit-control-style='compact']").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-record-management-edit-control-style", "compact");

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

  await page.locator("[data-record-management-filter-card='date']").click();
  await expect(page.locator("[data-record-management-filter-drawer-title]")).toHaveText("Date");
  await expect(page.locator("[data-record-management-date-single-field]")).toBeVisible();
  await expect(page.locator("[data-record-management-date-single-button]")).toContainText("Choose date");
  await expect(page.locator("[data-record-management-date-range-field]")).toBeVisible();
  await expect(page.locator("[data-record-management-date-range-button]")).toContainText("Choose date range");

  await page.locator("[data-record-management-date-single-field] .form-field-label").click();
  await expect(page.locator("[data-record-management-date-single-panel]")).toBeVisible();
  await expect
    .poll(async () => page.locator("[data-record-management-filter-drawer]").evaluate((drawer) => getComputedStyle(drawer).overflowY))
    .toBe("visible");
  await expect
    .poll(async () => {
      const drawer = await page.locator("[data-record-management-filter-drawer]").boundingBox();
      const panel = await page.locator("[data-record-management-date-single-panel]").boundingBox();
      return Boolean(drawer && panel && panel.x >= drawer.x + drawer.width - 1);
    })
    .toBe(true);
  await page.locator("[data-record-management-date-single-day][data-date='2026-05-08']").click();
  await expect(page.locator("[data-record-management-date-single-button]")).toContainText("May 8, 2026");
  await expect(page.locator("[data-record-management-filter-count='date']")).toHaveText("1");
  await expect(page.locator("[data-record-management-filter-total]")).toHaveText("2 selected");

  await page.locator("[data-record-management-date-range-button]").click();
  await expect(page.locator("[data-record-management-date-range-panel]")).toBeVisible();
  await page.locator("[data-record-management-date-range-day][data-date='2026-05-12']").click();
  await expect(page.locator("[data-record-management-date-range-panel]")).toBeVisible();
  await page.locator("[data-record-management-date-range-day][data-date='2026-05-16']").click();
  await expect(page.locator("[data-record-management-date-range-button]")).toContainText("May 12, 2026 - May 16, 2026");
  await expect(page.locator("[data-record-management-filter-count='date']")).toHaveText("2");
  await expect(page.locator("[data-record-management-filter-total]")).toHaveText("3 selected");
  await expect(page.locator("[data-record-management-filter-drawer] .form-drawer-select-selected-chip").filter({ hasText: "Custom range" })).toBeVisible();

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
  await expect(page.locator("[data-record-management-region-panel='details']")).not.toContainText("Organization details");
  await expect(page.locator("[data-record-management-user-attribute-card='name']")).toContainText("Acme Operations");
  await expect(page.locator("[data-record-management-user-attribute-card='industry']")).toContainText("Technology");
  await expect(page.locator("[data-record-management-user-attribute-card='tier']")).toContainText("Strategic");
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Organization details");

  const initialDrawerHeader = await page.evaluate(() => {
    const header = document.querySelector("[data-chat-workspace-list-drawer] .chat-workspace-list-drawer-header");
    const close = document.querySelector("[data-chat-workspace-list-drawer-close]");
    if (!header || !close) {
      return null;
    }
    const headerRect = header.getBoundingClientRect();
    const closeRect = close.getBoundingClientRect();
    const styles = window.getComputedStyle(header);
    return {
      borderBottomStyle: styles.borderBottomStyle,
      closeRight: Math.round(closeRect.right),
      headerRight: Math.round(headerRect.right),
    };
  });

  expect(initialDrawerHeader).not.toBeNull();
  expect(initialDrawerHeader?.borderBottomStyle).toBe("solid");
  expect(Math.abs((initialDrawerHeader?.closeRight ?? 0) - (initialDrawerHeader?.headerRight ?? 0))).toBeLessThanOrEqual(1);

  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveText("Edit");
  await page.locator("#record-management-display-settings-button").click();
  await page.locator("[data-record-management-edit-control-style='approved']").click();
  await page.locator("#record-management-display-settings-close").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-record-management-edit-control-style", "approved");
  await page.locator("[data-record-management-drawer-edit]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-edit-mode", "true");
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveText("Done");
  await expect(page.locator("[data-record-management-editable-field] input[name='record-management-name']")).toBeVisible();
  await expect(page.locator("[data-record-management-editable-field] input[name='record-management-name']")).toBeFocused();
  await expect(page.locator("[data-record-management-editable-field] input[name='record-management-name']")).toHaveClass(/drawer-form-input/);
  await expect(page.locator("[data-record-management-editable-field] select[name='record-management-industry']")).toBeVisible();
  await expect(page.locator("[data-record-management-editable-field] select[name='record-management-tier']")).toBeVisible();
  await expect(page.locator("[data-record-management-user-attribute-card='name'] [data-record-management-readonly-value]")).toBeHidden();
  await page.locator("[data-record-management-drawer-edit]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-edit-mode", "false");

  await page.locator("[data-record-management-region-trigger='legal']").click();
  await expect(page.locator("[data-record-management-region-panel='legal']")).toContainText("Registration number");
  await expect(page.locator("[data-record-management-region-panel='legal']")).toContainText("VAT number");
  await expect(page.locator("[data-record-management-address-card='registeredAddress']")).toContainText("Registered address");
  await expect(page.locator("[data-record-management-address-card='registeredAddress']")).toContainText("18 Legal Row");
  await expect(page.locator("[data-record-management-address-card='registeredAddress']")).toContainText("Dublin 2");
  await expect(page.locator("[data-record-management-address-card='registeredAddress']")).toContainText("Ireland");

  await page.locator("[data-record-management-region-trigger='relationships']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Business units");
  await expect(page.locator("[data-record-management-drawer-region-description]")).toHaveText("Only direct child business units from the next layer down are shown here.");
  await expect(page.locator("[data-record-management-nested-trigger='business-units']")).toContainText("3 direct units");
  await expect(page.locator("[data-record-management-nested-panel='business-units']")).toContainText("North Region");

  await page.locator("[data-record-management-region-trigger='members']").click();
  await expect(page.locator("[data-record-management-nested-trigger='tenant-admins']")).toContainText("2 members");
  await expect(page.locator("[data-record-management-nested-panel='tenant-admins']")).toContainText("Jordan Reyes");
  await page.locator("[data-record-management-nested-trigger='business-unit-owners']").click();
  await expect(page.locator("[data-record-management-nested-panel='business-unit-owners']")).toContainText("Kim Anders");
  await page.locator("[data-record-management-nested-trigger='regular-members']").click();
  await expect(page.locator("[data-record-management-nested-panel='regular-members']")).toContainText("Priya Shah");

  await page.locator("[data-record-management-region-trigger='locations']").click();
  await expect(page.locator("[data-record-management-nested-trigger='locations-eu']")).toContainText("4 locations");
  await expect(page.locator("[data-record-management-nested-panel='locations-eu']")).toContainText("North Region HQ");
  await page.locator("[data-record-management-nested-trigger='locations-apac']").click();
  await expect(page.locator("[data-record-management-nested-panel='locations-apac']")).toContainText("Singapore hub");

  await page.locator("[data-record-management-region-trigger='branding']").click();
  await expect(page.locator("[data-record-management-region-panel='branding']")).toContainText("Primary colour");
  await expect(page.locator("[data-record-management-region-panel='branding']")).toContainText("#0f766e");
  await expect(page.locator("[data-record-management-region-panel='branding'] [data-record-management-nested-trigger='logos']")).toHaveCount(0);
  await expect(page.locator("[data-record-management-region-panel='branding'] [data-record-management-nested-trigger]")).toHaveCount(3);
  await expect(page.locator("[data-record-management-nested-trigger='logo-primary']")).toContainText("Primary mark");
  await expect(page.locator("[data-record-management-nested-panel='logo-primary'] [data-form-image-card]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='logo-primary'] [data-form-image-card-edit]")).toHaveAccessibleName("Edit logo asset for Primary mark");
  await expect(page.locator("[data-record-management-nested-panel='logo-primary'] [data-record-management-logo-edit-surface]")).toBeHidden();
  await page.locator("[data-record-management-nested-trigger='logo-square']").click();
  await expect(page.locator("[data-record-management-nested-panel='logo-square']")).toContainText("Square icon");
  await page.locator("[data-record-management-drawer-edit]").click();
  await expect(page.locator("[data-record-management-nested-panel='logo-square'] [data-record-management-logo-edit-surface]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='logo-square'] [data-form-upload-dropzone]")).toBeVisible();
  await page.locator("[data-record-management-drawer-edit]").click();

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
