import { expect, test } from "@playwright/test";

test("record management shell keeps top navigation centered with search", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 600 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator(".top-nav .primary-nav-links")).toBeVisible();
  await expect(page.locator(".sub-nav .search-shell")).toBeVisible();

  const geometry = await page.evaluate(() => {
    const primaryNav = document.querySelector(".top-nav .primary-nav-links")?.getBoundingClientRect();
    const subNav = document.querySelector(".sub-nav")?.getBoundingClientRect();
    const breadcrumb = document.querySelector(".sub-nav .breadcrumb-nav")?.getBoundingClientRect();
    const searchShell = document.querySelector(".sub-nav .search-shell")?.getBoundingClientRect();
    const isCompactSubNav = document.querySelector(".sub-nav")?.classList.contains("sub-nav-compact-layout") ?? false;
    if (!primaryNav || !subNav || !breadcrumb || !searchShell) {
      return null;
    }

    return {
      primaryNavCenter: Math.round(primaryNav.left + primaryNav.width / 2),
      subNavCenter: Math.round(subNav.left + subNav.width / 2),
      breadcrumbRight: Math.round(breadcrumb.right),
      searchShellLeft: Math.round(searchShell.left),
      searchShellRight: Math.round(searchShell.right),
      subNavRight: Math.round(subNav.right),
      searchShellCenter: Math.round(searchShell.left + searchShell.width / 2),
      isCompactSubNav,
    };
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs((geometry?.primaryNavCenter ?? 0) - (geometry?.subNavCenter ?? 0))).toBeLessThanOrEqual(1);
  if (geometry?.isCompactSubNav) {
    expect(geometry.searchShellLeft).toBeGreaterThanOrEqual(geometry.breadcrumbRight);
    expect(geometry.searchShellRight).toBeLessThanOrEqual(geometry.subNavRight);
  } else {
    expect(Math.abs((geometry?.primaryNavCenter ?? 0) - (geometry?.searchShellCenter ?? 0))).toBeLessThanOrEqual(1);
  }
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
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-new-conversation]")).toHaveCount(0);
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-header-tool]")).toHaveCount(0);
  await expect(page.locator("#record-management-display-settings-button")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-joint-header] [data-chat-workspace-layer-trigger]")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]")).toContainText("Current");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger]")).toHaveCount(0);
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-panel-count")).toContainText("6 records");
  await page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]").click();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='organization-current']")).toContainText("current");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='organization-current']")).toContainText("Organizations");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='deals']")).toContainText("6 records");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-option='owner']")).toContainText("Owners");
  await page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-list] [data-chat-workspace-layer-trigger]").click();
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-card").filter({ hasText: "Ready" })).toBeVisible();
  await expect(page.locator('[data-record-management-list-centric-mount] .floating-tab-card[data-tab-label="Needs review"]')).toHaveAttribute(
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

    return subNav && searchShell && primaryNavLinks && contextNav && filterPanel && filterHeader && chatToolbar && secondaryHeader && secondaryLayerTrigger && shell && tabs && firstTab && lastTab && listPanel && firstRow && recordWorkspace
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
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-header .floating-tab-card:not(.floating-tab-card-empty)")).toHaveCount(3);
});

test("record management filter rail opens adjacent selection drawers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator("[data-record-management-filter-panel]")).toBeVisible();
  await page.locator("[data-record-management-filter-card='owning_group']").click();
  await expect(page.locator("[data-record-management-filter-drawer]")).toBeVisible();
  await expect(page.locator("[data-record-management-filter-drawer-title]")).toHaveText("Org");

  await expect(page.locator("[data-record-management-filter-drawer] .form-drawer-select-option").first()).toBeVisible();
  await page.locator("[data-record-management-filter-option='owning_group']").first().click();
  await expect(page.locator("[data-record-management-filter-count='owning_group']")).toHaveText("1");
  await expect(page.locator("[data-record-management-filter-total]")).toHaveText("1 selected");
  await expect(page.locator("[data-record-management-filter-drawer] .form-drawer-select-selected-chip")).toHaveCount(1);

  await page.locator("[data-record-management-filter-card='next_review_date']").click();
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
  await expect(page.locator("[data-record-management-filter-count='next_review_date']")).toHaveText("1");
  await expect(page.locator("[data-record-management-filter-total]")).toHaveText("2 selected");

  await page.locator("[data-record-management-date-range-button]").click();
  await expect(page.locator("[data-record-management-date-range-panel]")).toBeVisible();
  await page.locator("[data-record-management-date-range-day][data-date='2026-05-12']").click();
  await expect(page.locator("[data-record-management-date-range-panel]")).toBeVisible();
  await page.locator("[data-record-management-date-range-day][data-date='2026-05-16']").click();
  await expect(page.locator("[data-record-management-date-range-button]")).toContainText("May 12, 2026 - May 16, 2026");
  await expect(page.locator("[data-record-management-filter-count='next_review_date']")).toHaveText("2");
  await expect(page.locator("[data-record-management-filter-total]")).toHaveText("3 selected");
  await expect(page.locator("[data-record-management-filter-drawer] .form-drawer-select-selected-chip").filter({ hasText: "Custom range" })).toBeVisible();

  await page.locator("[data-record-management-filter-toggle]").click();
  await expect(page.locator("[data-record-management-template-frame]")).toHaveAttribute("data-filter-expanded", "false");
});

test("record management omits empty primary capability chrome", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-new-chat]")).toHaveCount(0);
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-new-conversation]")).toHaveCount(0);
});

test("record management list drawer shows end-user and root entity attribute views", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/record_management_list_centric");

  await page.locator("[data-record-management-list-centric-mount] .floating-tab-list .floating-tab-row").first().click();

  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer]")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-list-drawer-header h4")).toHaveText("Northstar Operations");
  await expect(page.locator("[data-record-management-list-centric-mount] .record-management-status-badge")).toHaveText("Ready");
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

  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveAccessibleName("Toggle edit mode");
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveAttribute("aria-pressed", "false");
  await page.locator("#record-management-display-settings-button").click();
  await page.locator("[data-record-management-edit-control-style='approved']").click();
  await page.locator("#record-management-display-settings-close").click();
  await expect(page.locator("[data-record-management-list-centric-template]")).toHaveAttribute("data-record-management-edit-control-style", "approved");
  await page.locator("[data-record-management-drawer-edit]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-edit-mode", "true");
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-editable-field] input[name='record-management-name']")).toBeVisible();
  await expect(page.locator("[data-record-management-editable-field] input[name='record-management-name']")).toBeFocused();
  await expect(page.locator("[data-record-management-editable-field] input[name='record-management-name']")).toHaveClass(/drawer-form-input/);
  await expect(page.locator("[data-record-management-editable-field] select[name='record-management-industry']")).toBeVisible();
  await expect(page.locator("[data-record-management-editable-field] select[name='record-management-tier']")).toBeVisible();
  await expect(page.locator("[data-record-management-user-attribute-card='name'] [data-record-management-readonly-value]")).toBeHidden();
  await page.locator("[data-record-management-drawer-edit]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-edit-mode", "false");
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveAttribute("aria-pressed", "false");

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

test("record management entity page skeleton reuses the detail drawer as the page body", async ({ page }) => {
  test.setTimeout(150000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/design-system/templates/entity_management_page");

  await expect(page.locator(".breadcrumb-current")).toHaveAttribute("title", "Home > Templates > entity_management_page");
  await expect(page.locator("[data-record-management-entity-page-template]")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-shell]")).toBeVisible();
  await expect(page.locator("#record-management-display-settings-button")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer]")).toBeVisible();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-list-drawer-header h4")).toContainText("Northstar Operations");
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer-close]")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] .record-management-active-group-summary")).toBeHidden();
  await expect(page.locator("[data-record-management-region-trigger='identity']")).toContainText("Identity");
  await expect(page.locator("[data-record-management-region-trigger='workflows']")).toContainText("Workflows");
  await expect(page.locator("[data-record-management-region-trigger='views']")).toContainText("Views");
  await expect(page.locator("[data-record-management-region-trigger='relationships']")).toContainText("Relationships");
  await expect(page.locator("[data-record-management-region-trigger='attributes']")).toContainText("Attributes");
  await expect(page.locator("[data-record-management-region-trigger='catalogs']")).toContainText("Catalogs");
  await expect(page.locator("[data-record-management-region-trigger='placements']")).toContainText("Display");
  await expect(page.locator("[data-record-management-region-trigger='permissions']")).toContainText("Permissions");
  await expect(page.locator("[data-record-management-region-trigger='generation-model']")).toContainText("Generation Model");
  await expect(page.locator("[data-record-management-region-trigger='compliance-model']")).toContainText("Compliance Model");
  await expect(page.locator("[data-record-management-region-trigger='migration-model']")).toContainText("Migration Model");
  await expect(page.locator("[data-record-management-region-trigger='action-models-record']")).toContainText("Action Models - Record");
  await expect(page.locator("[data-record-management-region-trigger='action-models-entity-structure']")).toContainText("Action Models - Entity Structure");
  await expect(page.locator("[data-record-management-region-trigger='details']")).toHaveCount(0);
  const entityRegionOrder = await page.locator("[data-record-management-region-trigger]").evaluateAll((triggers) => (
    triggers.map((trigger) => trigger.getAttribute("data-record-management-region-trigger"))
  ));
  expect(entityRegionOrder).toEqual(["identity", "workflows", "views", "relationships", "attributes", "catalogs", "placements", "permissions", "generation-model", "compliance-model", "migration-model", "action-models-record", "action-models-entity-structure"]);
  await expect.poll(async () => page.locator("[data-record-management-entity-page-template] .record-management-region-index").evaluate((index) => {
    const entityActionTitle = index.querySelector("[data-record-management-region-trigger='action-models-entity-structure'] span");
    const titleStyle = entityActionTitle ? getComputedStyle(entityActionTitle) : null;
    return {
      actionEntityTitleWraps: titleStyle?.whiteSpace === "normal",
      overflowY: getComputedStyle(index).overflowY,
      scrollable: index.scrollHeight > index.clientHeight,
    };
  })).toMatchObject({
    actionEntityTitleWraps: true,
    overflowY: "auto",
    scrollable: true,
  });
  await expect(page.locator("[data-record-management-nested-trigger='primary-details']")).toContainText("Primary Details");
  await expect(page.locator("[data-record-management-nested-trigger='owning-feature']")).toContainText("Owning Feature");
  await expect(page.locator("[data-record-management-nested-trigger='source-authority-posture']")).toContainText("Source Authority Posture");
  await page.setViewportSize({ width: 1440, height: 720 });
  await expect.poll(async () => page.locator("[data-record-management-region-panel='identity'] .record-management-nested-list-drawer").evaluate((drawer) => {
    const style = getComputedStyle(drawer);
    drawer.scrollTop = 24;
    return {
      overflowY: style.overflowY,
      scrollMoved: drawer.scrollTop > 0,
      scrollable: drawer.scrollHeight > drawer.clientHeight,
    };
  })).toMatchObject({
    overflowY: "auto",
    scrollMoved: true,
    scrollable: true,
  });
  await page.locator("[data-record-management-region-trigger='action-models-entity-structure']").click();
  const actionModelSublist = page.locator("[data-record-management-region-panel='action-models-entity-structure'] .record-management-nested-list").first();
  const actionModelResizer = actionModelSublist.locator("[data-record-management-nested-resizer]");
  await expect(actionModelResizer).toBeVisible();
  const secondaryNavWidthBefore = await actionModelSublist.locator(".record-management-nested-list-cards").evaluate((cards) => cards.getBoundingClientRect().width);
  const resizerBox = await actionModelResizer.boundingBox();
  if (!resizerBox) {
    throw new Error("Expected the entity action-model secondary nav resizer to have a browser box.");
  }
  await page.mouse.move(resizerBox.x + resizerBox.width / 2, resizerBox.y + resizerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(resizerBox.x + resizerBox.width / 2 + 96, resizerBox.y + resizerBox.height / 2);
  await page.mouse.up();
  await expect.poll(async () => actionModelSublist.locator(".record-management-nested-list-cards").evaluate((cards) => cards.getBoundingClientRect().width)).toBeGreaterThan(secondaryNavWidthBefore + 60);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("[data-record-management-region-trigger='workflows']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Workflows");
  await expect(page.locator("[data-record-management-region-panel='workflows']")).toBeVisible();
  const workflowsLayout = page.locator("[data-record-management-region-panel='workflows'] .record-management-nested-list-layout");
  await expect(workflowsLayout).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='intake-workflow']")).toContainText("Intake");
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='review-workflow']")).toContainText("Review");
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='lifecycle-workflow']")).toContainText("Lifecycle");
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-add]")).toHaveAccessibleName("Add another entity workflow");
  await expect(page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [data-entity-management-workflow-copy='intakeWorkflow']")).toHaveAccessibleName("Copy workflow");
  await expect(page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [data-entity-management-workflow-delete='intakeWorkflow']")).toHaveAccessibleName("Delete workflow");
  await expect(page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [data-entity-management-workflow-copy='intakeWorkflow'] svg path")).toHaveCount(2);
  await expect(page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [data-entity-management-workflow-delete='intakeWorkflow'] svg path")).toHaveCount(5);
  await page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-add]").click();
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger]")).toHaveCount(4);
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='workflow-4']")).toContainText("Untitled workflow");
  await expect(page.locator("[data-entity-management-workflow-definition='workflow4'] input[name='workflow4WorkflowName']")).toHaveValue("");
  await expect(page.locator("[data-entity-management-workflow-definition='workflow4'] textarea[name='workflow4WorkflowDescription']")).toHaveValue("");
  await page.locator("[data-entity-management-workflow-definition='workflow4'] [aria-label='Workflow builder'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-entity-management-workflow-builder='workflow4'] [data-entity-management-workflow-status-row]")).toHaveCount(1);
  await expect(page.locator("[data-entity-management-workflow-builder='workflow4'] input[name='workflow4Status0Name']")).toHaveValue("Home");
  await page.locator("[data-entity-management-workflow-definition='workflow4'] [data-entity-management-workflow-delete='workflow4']").click();
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='workflow-4']")).toHaveCount(0);
  await expect(page.locator("[data-entity-management-workflow-definition='workflow4']")).toHaveCount(0);
  await page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='intake-workflow']").click();
  await page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [data-entity-management-workflow-copy='intakeWorkflow']").click();
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='workflow-4']")).toContainText("Untitled workflow");
  await expect(page.locator("[data-entity-management-workflow-definition='workflow4'] input[name='workflow4WorkflowName']")).toHaveValue("");
  await expect(page.locator("[data-entity-management-workflow-definition='workflow4'] textarea[name='workflow4WorkflowDescription']")).toHaveValue("");
  await page.locator("[data-entity-management-workflow-definition='workflow4'] [aria-label='Workflow builder'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-entity-management-workflow-builder='workflow4'] [data-entity-management-workflow-status-row]")).toHaveCount(1);
  await expect(page.locator("[data-entity-management-workflow-builder='workflow4'] input[name='workflow4Status0Name']")).toHaveValue("Home");
  await page.locator("[data-entity-management-workflow-definition='workflow4'] [aria-label='Workflow details'] [data-entity-management-section-toggle]").click();
  await page.locator("[data-entity-management-workflow-definition='workflow4'] input[name='workflow4WorkflowName']").fill("Copied workflow");
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='workflow-4'] strong")).toHaveText("Copied workflow");
  await page.locator("[data-entity-management-workflow-definition='workflow4'] [data-entity-management-workflow-delete='workflow4']").click();
  await expect(page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger]")).toHaveCount(3);
  await page.locator("[data-record-management-region-panel='workflows'] [data-record-management-nested-trigger='intake-workflow']").click();
  const workflowDetailsToggle = page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [aria-label='Workflow details'] [data-entity-management-section-toggle]");
  const workflowDetailsBody = page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [aria-label='Workflow details'] [data-entity-management-section-body]");
  await expect(workflowDetailsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(workflowDetailsBody).toBeHidden();
  await workflowDetailsToggle.click();
  await expect(workflowDetailsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(workflowDetailsBody).toBeVisible();
  await expect(page.locator("input[name='intakeWorkflowWorkflowName']")).toHaveValue("Intake");
  await expect(page.locator("textarea[name='intakeWorkflowWorkflowDescription']")).toHaveValue("First-step workflow for collecting required information before a record exists.");
  const workflowBuilderToggle = page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [aria-label='Workflow builder'] [data-entity-management-section-toggle]");
  const workflowBuilderBody = page.locator("[data-entity-management-workflow-definition='intakeWorkflow'] [aria-label='Workflow builder'] [data-entity-management-section-body]");
  await expect(workflowBuilderToggle).toHaveAttribute("aria-expanded", "false");
  await expect(workflowBuilderBody).toBeHidden();
  await workflowBuilderToggle.click();
  await expect(workflowDetailsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(workflowBuilderToggle).toHaveAttribute("aria-expanded", "true");
  await expect(workflowBuilderBody).toBeVisible();
  const intakeWorkflowBuilder = page.locator("[data-entity-management-workflow-builder='intakeWorkflow']");
  await expect(intakeWorkflowBuilder).toBeVisible();
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowIsSubworkflow']")).not.toBeChecked();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow']")).toBeHidden();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]")).toHaveCount(1);
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0Name']")).toHaveValue("Home");
  const homeStatusDetails = intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").first().locator("[data-entity-management-workflow-status-details]");
  await expect(homeStatusDetails).not.toHaveAttribute("open", "");
  await homeStatusDetails.locator("summary").click();
  await expect(homeStatusDetails).toHaveAttribute("open", "");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0LabelKey']")).toHaveValue("entity.organization.workflow.intakeWorkflow.status.home.label");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0LabelFallback']")).toHaveValue("Home");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0DescriptionKey']")).toHaveValue("entity.organization.workflow.intakeWorkflow.status.home.description");
  await expect(intakeWorkflowBuilder.locator("textarea[name='intakeWorkflowStatus0DescriptionFallback']")).toHaveValue("");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0TabEligible']")).toBeChecked();
  await intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0TabEligible']").uncheck();
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0TabEligible']")).not.toBeChecked();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus0ParentStatus']")).toBeHidden();
  await intakeWorkflowBuilder.locator("input[name='intakeWorkflowIsSubworkflow']").check();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow']")).toBeVisible();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow'] [data-form-drawer-select-summary]")).toHaveText("Review");
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus0ParentStatus']")).toBeVisible();
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0ParentStatus']")).toHaveValue("status-0");
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow'] [data-form-drawer-select-button]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow'] [data-form-drawer-select-option]")).toContainText(["Review", "Lifecycle"]);
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow'] [data-form-drawer-select-close]").click();
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus0ParentStatus'] [data-form-drawer-select-button]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus0ParentStatus'] [data-form-drawer-select-option]")).toContainText(["Home"]);
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus0ParentStatus'] [data-form-drawer-select-close]").click();
  await expect(intakeWorkflowBuilder.locator("[data-status-location='create'] .entity-management-workflow-location-badge")).toHaveText("Base");
  await expect(intakeWorkflowBuilder.locator("[data-status-location='create'] .entity-management-workflow-location-badge")).toHaveAttribute("aria-disabled", "true");
  await expect(intakeWorkflowBuilder.locator("[data-status-location='create'] [data-entity-management-workflow-status-remove]")).toHaveCount(0);
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus0LinksTo']")).toHaveValue("all");
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus0LinksTo'] [data-form-drawer-select-summary]")).toHaveText("All");
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus0LinksTo'] [data-form-drawer-select-button]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus0LinksTo'] [data-form-drawer-select-option]")).toHaveCount(2);
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus0LinksTo'] [data-form-drawer-select-option]")).toContainText(["All", "Home"]);
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus0LinksTo'] [data-form-drawer-select-close]").click();
  await intakeWorkflowBuilder.locator("[data-status-location='create'] [data-entity-management-workflow-status-add]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]")).toHaveCount(2);
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1Name']")).toHaveValue("Status 2");
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(1).locator("[data-entity-management-workflow-status-details] summary").click();
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1LabelKey']")).toHaveValue("entity.organization.workflow.intakeWorkflow.status.status2.label");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1LabelFallback']")).toHaveValue("Status 2");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1DescriptionKey']")).toHaveValue("entity.organization.workflow.intakeWorkflow.status.status2.description");
  await expect(intakeWorkflowBuilder.locator("textarea[name='intakeWorkflowStatus1DescriptionFallback']")).toHaveValue("");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1TabEligible']")).toBeChecked();
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1LinksTo']")).toHaveValue("all");
  await expect(intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus1ParentStatus']")).toHaveValue("status-0");
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus1ParentStatus']")).toBeVisible();
  await intakeWorkflowBuilder.locator("input[name='intakeWorkflowIsSubworkflow']").uncheck();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-select='intakeWorkflowParentWorkflow']")).toBeHidden();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-parent-status='intakeWorkflowStatus1ParentStatus']")).toBeHidden();
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus1LinksTo'] [data-form-drawer-select-button]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus1LinksTo'] [data-form-drawer-select-option]")).toContainText(["All", "Home", "Status 2"]);
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-links='intakeWorkflowStatus1LinksTo'] [data-form-drawer-select-close]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(1).locator("[data-entity-management-workflow-status-remove]")).toHaveAccessibleName("Remove workflow status");
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(1).locator("[data-entity-management-workflow-status-move='up']")).toBeDisabled();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(1).locator("[data-entity-management-workflow-status-move='down']")).toBeDisabled();
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(1).locator("[data-entity-management-workflow-status-add]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]")).toHaveCount(3);
  await intakeWorkflowBuilder.locator("input[name='intakeWorkflowStatus2Name']").fill("Status 3");
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(2).locator("[data-entity-management-workflow-status-move='up']").click();
  await expect.poll(async () => intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row] [data-entity-management-workflow-status-name]").evaluateAll((inputs) => (
    inputs.map((input) => input instanceof HTMLInputElement ? input.value : "")
  ))).toEqual(["Home", "Status 3", "Status 2"]);
  await intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").nth(1).locator("[data-entity-management-workflow-status-remove]").click();
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]")).toHaveCount(2);
  await expect.poll(async () => intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row] [data-entity-management-workflow-status-name]").evaluateAll((inputs) => (
    inputs.map((input) => input instanceof HTMLInputElement ? input.value : "")
  ))).toEqual(["Home", "Status 2"]);
  for (let statusCount = 0; statusCount < 4; statusCount += 1) {
    await intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]").last().locator("[data-entity-management-workflow-status-add]").click();
  }
  await expect(intakeWorkflowBuilder.locator("[data-entity-management-workflow-status-row]")).toHaveCount(6);
  await expect.poll(async () => intakeWorkflowBuilder.evaluate((node) => {
    const drawer = node.closest(".record-management-nested-list-drawer");
    const addButton = node.querySelector("[data-entity-management-workflow-status-row]:last-child [data-entity-management-workflow-status-add]");
    const addRect = addButton?.getBoundingClientRect();
    const drawerRect = drawer?.getBoundingClientRect();
    return {
      addButtonVisible: addRect && drawerRect ? addRect.bottom <= drawerRect.bottom && addRect.top >= drawerRect.top : false,
      drawerOverflowY: drawer ? getComputedStyle(drawer).overflowY : "",
      drawerScrollable: drawer ? drawer.scrollHeight > drawer.clientHeight : false,
    };
  })).toMatchObject({
    addButtonVisible: true,
    drawerOverflowY: "auto",
    drawerScrollable: true,
  });
  await page.locator("[data-record-management-region-trigger='views']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Views");
  await expect(page.locator("[data-record-management-drawer-region-description]")).toHaveText("Who can access this entity in the system, where they'll find it and how it will behave.");
  await expect(page.locator("[data-record-management-region-panel='views']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='views'] .record-management-nested-list-header")).toContainText("Who can access this entity in the system, where they'll find it and how it will behave.");
  const viewsLayout = page.locator("[data-record-management-region-panel='views'] .record-management-nested-list-layout");
  await expect(viewsLayout).toBeVisible();
  await expect(page.locator("[data-record-management-nested-trigger='list-views']")).toContainText("List views");
  await expect(page.locator("[data-record-management-nested-trigger='detail-views']")).toContainText("Detail views");
  await expect(page.locator("[data-record-management-nested-trigger='workflow-views']")).toContainText("Workflow views");
  await expect(page.locator("[data-record-management-region-panel='views'] [data-record-management-nested-add]")).toContainText("Add View");
  await expect(page.locator("[data-record-management-region-panel='views'] [data-record-management-nested-add] .record-management-nested-list-add-icon")).toBeVisible();
  await expect.poll(async () => page.locator("[data-record-management-region-panel='views'] [data-record-management-nested-add]").evaluate((card) => {
    const icon = card.querySelector(".record-management-nested-list-add-icon");
    const label = card.querySelector("strong");
    const siblingCard = card.parentElement?.querySelector("[data-record-management-nested-trigger='list-views']");
    if (!(card instanceof HTMLElement) || !(icon instanceof HTMLElement) || !(label instanceof HTMLElement)) {
      return null;
    }
    const cardRect = card.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    const siblingRect = siblingCard?.getBoundingClientRect();
    return {
      heightDelta: siblingRect ? Math.abs(Math.round(cardRect.height) - Math.round(siblingRect.height)) : null,
      iconCentered: Math.abs((iconRect.left + iconRect.width / 2) - (cardRect.left + cardRect.width / 2)) <= 1,
      iconSize: Math.round(iconRect.width),
      labelBelowIcon: labelRect.top > iconRect.bottom,
    };
  })).toMatchObject({
    heightDelta: 0,
    iconCentered: true,
    iconSize: 20,
    labelBelowIcon: true,
  });
  await expect(page.locator("[data-record-management-nested-panel='list-views']")).toContainText("Location");
  await expect(page.locator("[data-record-management-nested-panel='list-views']")).toContainText("Access");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] .record-management-nested-list-drawer-header")).toHaveCount(0);
  const viewDetailsToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='View details'] [data-entity-management-section-toggle]");
  const viewDetailsBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='View details'] [data-entity-management-section-body]");
  await expect(viewDetailsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(viewDetailsBody).toBeHidden();
  await expect.poll(async () => page.locator("[data-record-management-nested-panel='list-views'] [aria-label='View details']").evaluate((section) => {
    const detailDrawer = section.closest(".record-management-nested-list-drawer");
    const drawerRect = detailDrawer?.getBoundingClientRect();
    const openBodies = detailDrawer?.querySelectorAll("[data-entity-management-section-body]:not([hidden])").length ?? -1;
    return {
      collapsedDrawerHasNoOpenBodies: openBodies === 0,
      drawerHeight: drawerRect ? Math.round(drawerRect.height) : 0,
    };
  })).toMatchObject({
    collapsedDrawerHasNoOpenBodies: true,
  });
  await viewDetailsToggle.click();
  await expect(viewDetailsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(viewDetailsBody).toBeVisible();
  await expect(page.locator("input[name='listViewsViewName']")).toHaveValue("List views");
  await expect(page.locator("textarea[name='listViewsViewDescription']")).toHaveValue("Table, card, and search result presentations that help users scan entity records.");
  await expect(page.locator("[data-record-management-nested-trigger='list-views'] strong")).toHaveText(await page.locator("input[name='listViewsViewName']").inputValue());
  await expect(page.locator("[data-record-management-nested-trigger='list-views'] small")).toHaveAttribute("title", await page.locator("textarea[name='listViewsViewDescription']").inputValue());
  await expect(page.locator("[data-record-management-nested-trigger='list-views'] small")).toHaveText(await page.locator("textarea[name='listViewsViewDescription']").inputValue());
  await expect(page.locator("[data-record-management-nested-panel='list-views']")).not.toContainText("3 draft views");
  await expect.poll(async () => page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Access']").evaluate((section) => {
    const header = section.querySelector(".record-management-user-attribute-group-header h5");
    const style = getComputedStyle(section);
    const headerStyle = header ? getComputedStyle(header) : null;
    return {
      borderTopStyle: style.borderTopStyle,
      borderTopWidth: style.borderTopWidth,
      headerSize: headerStyle?.fontSize ?? "",
    };
  })).toMatchObject({
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    headerSize: "16px",
  });
  const locationToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Location'] [data-entity-management-section-toggle]");
  const locationBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Location'] [data-entity-management-section-body]");
  const workflowToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Workflow'] [data-entity-management-section-toggle]");
  const workflowBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Workflow'] [data-entity-management-section-body]");
  const accessToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Access'] [data-entity-management-section-toggle]");
  const accessBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Access'] [data-entity-management-section-body]");
  const globalSearchToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Global search'] [data-entity-management-section-toggle]");
  const globalSearchBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Global search'] [data-entity-management-section-body]");
  const filterBarToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-section-toggle]");
  const filterBarBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-section-body]");
  const primaryActionsToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-section-toggle]");
  const primaryActionsBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-section-body]");
  const secondaryActionsToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Secondary actions'] [data-entity-management-section-toggle]");
  const secondaryActionsBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Secondary actions'] [data-entity-management-section-body]");
  const viewDisplayToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Display'] [data-entity-management-section-toggle]");
  const viewDisplayBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Display'] [data-entity-management-section-body]");
  await expect(workflowToggle).toHaveAttribute("aria-expanded", "false");
  await expect(locationToggle).toHaveAttribute("aria-expanded", "false");
  await expect(accessToggle).toHaveAttribute("aria-expanded", "false");
  await expect(globalSearchToggle).toHaveAttribute("aria-expanded", "false");
  await expect(filterBarToggle).toHaveAttribute("aria-expanded", "false");
  await expect(primaryActionsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(secondaryActionsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(viewDisplayToggle).toHaveAttribute("aria-expanded", "false");
  await expect(workflowBody).toBeHidden();
  await expect(locationBody).toBeHidden();
  await expect(accessBody).toBeHidden();
  await expect(globalSearchBody).toBeHidden();
  await expect(filterBarBody).toBeHidden();
  await expect(primaryActionsBody).toBeHidden();
  await expect(secondaryActionsBody).toBeHidden();
  await expect(viewDisplayBody).toBeHidden();
  await workflowToggle.click();
  await expect(workflowToggle).toHaveAttribute("aria-expanded", "true");
  await expect(workflowBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsWorkflow'] [data-form-drawer-select-summary]")).toHaveText("Intake");
  await expect(page.locator("input[name='listViewsWorkflow']")).toHaveValue("intakeWorkflow");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-workflow-status-toggle]")).toHaveCount(3);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-workflow-status-toggle]").nth(0)).toContainText("Draft");
  await expect(page.locator("input[name='listViewsWorkflowVisibleStatuses']")).toHaveValue("draft,inRefinement,queued");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-workflow-status-toggle][data-status-value='queued']").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-workflow-status-toggle][data-status-value='queued']")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-workflow-status-toggle][data-status-value='queued']")).toContainText("Hidden");
  await expect(page.locator("input[name='listViewsWorkflowVisibleStatuses']")).toHaveValue("draft,inRefinement");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsWorkflow'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsWorkflow'] [data-form-drawer-select-option]")).toContainText(["Intake", "Review", "Lifecycle"]);
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsWorkflow'] [data-form-drawer-select-option][data-value='reviewWorkflow']").click();
  await expect(page.locator("input[name='listViewsWorkflow']")).toHaveValue("reviewWorkflow");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-workflow-status-toggle]")).toContainText(["Submitted", "Needs changes", "Approved"]);
  await expect(page.locator("input[name='listViewsWorkflowVisibleStatuses']")).toHaveValue("submitted,needsChanges,approved");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsWorkflow'] [data-form-drawer-select-close]").click();
  await locationToggle.click();
  await expect(workflowToggle).toHaveAttribute("aria-expanded", "false");
  await expect(workflowBody).toBeHidden();
  await expect(locationToggle).toHaveAttribute("aria-expanded", "true");
  await expect(locationBody).toBeVisible();
  await expect(accessToggle).toHaveAttribute("aria-expanded", "false");
  await accessToggle.click();
  await expect(accessToggle).toHaveAttribute("aria-expanded", "true");
  await expect(accessBody).toBeVisible();
  await expect(locationToggle).toHaveAttribute("aria-expanded", "false");
  await expect(locationBody).toBeHidden();
  await globalSearchToggle.click();
  await expect(accessBody).toBeHidden();
  await expect(globalSearchBody).toBeVisible();
  await expect(page.locator("input[name='listViewsGlobalSearchAttributes']")).toHaveValue("email");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Global search'] [data-entity-management-view-attribute-toggle]")).toHaveCount(1);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Global search'] [data-entity-management-view-attribute-toggle][data-attribute-key='email']")).toContainText("Priority 1");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Global search'] [data-entity-management-view-attribute-toggle][data-attribute-key='description']")).toHaveCount(0);
  await filterBarToggle.click();
  await expect(globalSearchBody).toBeHidden();
  await expect(filterBarBody).toBeVisible();
  await expect(page.locator("input[name='listViewsFilterBarItems']")).toHaveValue("email,parent:tenant");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-view-attribute-toggle]")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-view-attribute-toggle][data-attribute-key='email']")).toContainText("Priority 1");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-view-attribute-toggle][data-attribute-key='parent:tenant']")).toContainText("Priority 2");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-view-attribute-toggle][data-attribute-key='description']")).toHaveCount(0);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Filter bar'] [data-entity-management-view-attribute-toggle][data-attribute-key='parent:businessUnits']")).toHaveCount(0);
  await primaryActionsToggle.click();
  await expect(filterBarBody).toBeHidden();
  await expect(primaryActionsBody).toBeVisible();
  await expect(page.locator("input[name='listViewsPrimaryActions']")).toHaveValue("read,update");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle]")).toHaveCount(15);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle][data-capability-key='read']")).toContainText("Priority 1");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle][data-capability-key='update']")).toContainText("Priority 2");
  await page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle][data-capability-key='archive']").click();
  await expect(page.locator("input[name='listViewsPrimaryActions']")).toHaveValue("read,update,archive");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle][data-capability-key='archive']")).toContainText("Priority 3");
  await page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle][data-capability-key='read']").click();
  await expect(page.locator("input[name='listViewsPrimaryActions']")).toHaveValue("update,archive");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Primary actions'] [data-entity-management-view-action-toggle][data-capability-key='update']")).toContainText("Priority 1");
  await secondaryActionsToggle.click();
  await expect(primaryActionsBody).toBeHidden();
  await expect(secondaryActionsBody).toBeVisible();
  await expect(page.locator("input[name='listViewsSecondaryActions']")).toHaveValue("archive,export");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Secondary actions'] [data-entity-management-view-action-toggle][data-capability-key='archive']")).toContainText("Priority 1");
  await viewDisplayToggle.click();
  await expect(secondaryActionsBody).toBeHidden();
  await expect(viewDisplayBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] .form-field-label")).toHaveText("Page template");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-summary]")).toHaveText("record_management_list_centric");
  await expect(page.locator("input[name='listViewsPageTemplate']")).toHaveValue("record_management_list_centric");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='List display']")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display']")).toBeVisible();
  await expect(page.locator("input[name='listViewsListDisplayAttributes']")).toHaveValue("email,description,status");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='List display'] [data-entity-management-view-attribute-toggle]")).toHaveCount(6);
  await expect(page.locator("input[name='listViewsDrawerDisplayPlacements']")).toHaveValue("primaryDetails,operations");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle]")).toHaveCount(3);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='primaryDetails']")).toContainText("Visible");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='operations']")).toContainText("Visible");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='system']")).toContainText("Hidden");
  await page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='operations']").click();
  await expect(page.locator("input[name='listViewsDrawerDisplayPlacements']")).toHaveValue("primaryDetails");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='operations']")).toContainText("Hidden");
  await page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='system']").click();
  await expect(page.locator("input[name='listViewsDrawerDisplayPlacements']")).toHaveValue("primaryDetails,system");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display'] [data-entity-management-view-placement-toggle][data-placement-key='system']")).toContainText("Visible");
  await expect.poll(async () => page.locator("[data-record-management-region-panel='views'] .record-management-nested-list").evaluate((list) => {
    const cards = list.querySelector(".record-management-nested-list-cards");
    const detail = list.querySelector(".record-management-nested-list-drawer");
    const layout = list.querySelector(".record-management-nested-list-layout");
    const cardsStyle = cards ? getComputedStyle(cards) : null;
    const detailStyle = detail ? getComputedStyle(detail) : null;
    const layoutStyle = layout ? getComputedStyle(layout) : null;
    const drawerBody = document.querySelector(".chat-workspace-list-drawer-body");
    const primaryIndex = document.querySelector("[data-record-management-region-shell] .record-management-region-index");
    const regionShell = document.querySelector("[data-record-management-region-shell]");
    const cardsRect = cards?.getBoundingClientRect();
    const detailRect = detail?.getBoundingClientRect();
    const layoutRect = layout?.getBoundingClientRect();
    const drawerBodyRect = drawerBody?.getBoundingClientRect();
    const primaryIndexRect = primaryIndex?.getBoundingClientRect();
    const regionShellRect = regionShell?.getBoundingClientRect();
    return {
      cardsOverflowY: cardsStyle?.overflowY ?? "",
      cardsRailFillsLayout: cardsRect && layoutRect ? Math.abs(Math.round(cardsRect.height) - Math.round(layoutRect.height)) <= 1 : false,
      detailOverflowY: detailStyle?.overflowY ?? "",
      layoutOverflowY: layoutStyle?.overflowY ?? "",
      regionShellFillsDrawerBody: regionShellRect && drawerBodyRect ? Math.abs(Math.round(regionShellRect.height) - Math.round(drawerBodyRect.height)) <= 1 : false,
      primaryRailFillsShell: primaryIndexRect && regionShellRect ? Math.abs(Math.round(primaryIndexRect.height) - Math.round(regionShellRect.height)) <= 1 : false,
    };
  })).toMatchObject({
    cardsOverflowY: "auto",
    cardsRailFillsLayout: true,
    detailOverflowY: "auto",
    layoutOverflowY: "hidden",
    regionShellFillsDrawerBody: true,
    primaryRailFillsShell: true,
  });
  await expect(page.locator("select[name='listViewsApp']")).toHaveValue("root");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsModule'] [data-form-drawer-select-summary]")).toHaveText("Organization Core");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsParentPage'] .form-field-label")).toHaveText("Parent page");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsParentPage'] [data-form-drawer-select-summary]")).toHaveText("Root organizations");
  await expect(locationBody.locator("[data-entity-management-view-drawer-select='listViewsPageTemplate']")).toHaveCount(0);
  await expect(page.locator("input[name='listViewsRouteName']")).toHaveValue("organization");
  await expect(page.locator("input[name='listViewsRouteName']")).toHaveAttribute("readonly", "");
  await expect(page.locator("input[name='listViewsRoutePreview']")).toHaveValue("/root-admin/organizations/:organizationId");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-summary]")).toHaveText("LLM");
  await expect(page.locator("input[name='listViewsRoles']")).toHaveValue("llm");
  await expect.poll(async () => page.locator("[data-record-management-nested-panel='list-views'] .entity-management-access-drawer-row").evaluate((row) => {
    const fields = Array.from(row.querySelectorAll("[data-entity-management-view-drawer-select]"));
    const rects = fields.map((field) => field.getBoundingClientRect());
    return {
      fieldCount: fields.length,
      sameRow: rects.every((rect) => Math.abs(Math.round(rect.top) - Math.round(rects[0]?.top ?? 0)) <= 1),
    };
  })).toMatchObject({
    fieldCount: 3,
    sameRow: true,
  });
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-summary]")).toHaveText("Tenant");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] .form-field-label")).toHaveText("Boundary");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] .form-field-help")).toHaveText("This view only applies to records for this entity that have this shared relationship.");
  await expect(page.locator("input[name='listViewsRelationship']")).toHaveValue("tenant");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-form-drawer-select-summary]")).toHaveText("Not applicable");
  await expect(page.locator("input[name='listViewsObject']")).toHaveValue("notApplicable");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-form-drawer-select-summary]")).toHaveText("Not applicable");
  await expect(page.locator("input[name='listViewsObjectCapacity']")).toHaveValue("notApplicable");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-record-management-evidence-button]")).toHaveAttribute("aria-label", "Open evidence for Roles");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-record-management-evidence-button]")).toHaveAttribute("aria-label", "Open evidence for Boundary");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship']")).toHaveAttribute("data-evidence-element-name", "Boundary");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship']")).toHaveAttribute("data-evidence-element-value", "Tenant");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-record-management-evidence-button]")).toHaveAttribute("aria-label", "Open evidence for Object");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-record-management-evidence-button]")).toHaveAttribute("aria-label", "Open evidence for Object capacity");
  await expect(viewDisplayBody).toBeVisible();
  await expect(accessBody).toBeHidden();
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-option]")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-option][data-value='record_management_page']")).toContainText("record_management_page");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-option][data-value='record_management_page']").click();
  await expect(page.locator("input[name='listViewsPageTemplate']")).toHaveValue("record_management_page");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='List display']")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Drawer display']")).toBeVisible();
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-close]").click();
  await accessToggle.click();
  await expect(accessBody).toBeVisible();
  await expect(viewDisplayBody).toBeHidden();
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-form-drawer-select-option]")).toHaveCount(4);
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-form-drawer-select-option][data-value='deal']").click();
  await expect(page.locator("input[name='listViewsObject']")).toHaveValue("deal");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-form-drawer-select-option][data-value='task']").click();
  await expect(page.locator("input[name='listViewsObject']")).toHaveValue("task");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObject'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-form-drawer-select-option]")).toHaveCount(4);
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-form-drawer-select-option][data-value='owner']").click();
  await expect(page.locator("input[name='listViewsObjectCapacity']")).toHaveValue("owner");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-form-drawer-select-option][data-value='reader']").click();
  await expect(page.locator("input[name='listViewsObjectCapacity']")).toHaveValue("reader");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsObjectCapacity'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-option]")).toHaveCount(3);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-option][data-value='tenant']")).toContainText("Hardcoded entity");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-option][data-value='organization']").click();
  await expect(page.locator("input[name='listViewsRelationship']")).toHaveValue("tenant,organization");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-selected-count]")).toHaveText("2 selected");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRelationship'] [data-form-drawer-select-close]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-create-role]")).toHaveCount(0);
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-panel]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option]")).toHaveCount(1);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option][data-value='llm']")).toContainText("LLM");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option][data-value='organizationOwner']")).toHaveCount(0);
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-trigger='detail-views']").click();
  await expect(page.locator("input[name='detailViewsRouteName']")).toHaveValue("organizationDetail");
  await expect(page.locator("input[name='detailViewsRoutePreview']")).toHaveValue("/root-admin/organizations/:organizationId/details");
  await page.locator("[data-record-management-nested-trigger='workflow-views']").click();
  await expect(page.locator("input[name='workflowViewsRouteName']")).toHaveValue("organizationWorkflow");
  await expect(page.locator("input[name='workflowViewsRoutePreview']")).toHaveValue("/root-admin/organizations/:organizationId/workflows");
  await page.locator("[data-record-management-region-trigger='relationships']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Relationships");
  await expect(page.locator("[data-record-management-region-panel='relationships']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='relationships'] [data-record-management-nested-trigger='relationship-tenant']")).toContainText("Tenant");
  await expect(page.locator("[data-record-management-region-panel='relationships'] [data-record-management-nested-trigger='relationship-tenant']")).toContainText("parentRelation");
  await expect(page.locator("[data-record-management-region-panel='relationships'] [data-record-management-nested-trigger='relationship-businessUnits']")).toContainText("Business units");
  await expect(page.locator("[data-record-management-region-panel='relationships'] [data-record-management-nested-trigger='relationship-businessUnits']")).toContainText("childRelation");
  await expect(page.locator("[data-record-management-region-panel='relationships'] [data-record-management-nested-trigger='relationship-primaryLogo']")).toContainText("Primary logo");
  await page.locator("[data-record-management-region-panel='relationships'] [data-record-management-nested-trigger='relationship-businessUnits']").click();
  await expect(page.locator("[data-record-management-nested-panel='relationship-businessUnits'] [aria-label='Relationship metadata'] [data-entity-management-section-toggle]")).toHaveAttribute("aria-expanded", "false");
  await page.locator("[data-record-management-nested-panel='relationship-businessUnits'] [aria-label='Relationship metadata'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("input[name='businessUnitsRelationshipKey']")).toHaveValue("businessUnits");
  await expect(page.locator("input[name='businessUnitsRelationshipTargetEntityKey']")).toHaveValue("businessUnit");
  await expect(page.locator("input[name='businessUnitsRelationshipLabelKey']")).toHaveValue("entity.organization.relationship.businessUnits.label");
  await expect(page.locator("input[name='businessUnitsRelationshipLabelFallback']")).toHaveValue("Business units");
  await expect(page.locator("textarea[name='businessUnitsRelationshipDescriptionFallback']")).toHaveValue("Business units that belong to this organization.");
  await expect(page.locator("select[name='businessUnitsRelationshipCategory']")).toHaveValue("childRelation");
  await expect(page.locator("select[name='businessUnitsRelationshipCardinality']")).toHaveValue("oneToMany");
  await expect(page.locator("input[name='businessUnitsRelationshipRole']")).toHaveValue("businessUnits");
  await expect(page.locator("input[name='businessUnitsRelationshipInverseRole']")).toHaveValue("organization");
  await expect(page.locator("[data-record-management-nested-panel='relationship-businessUnits'] [data-record-management-evidence-button]").first()).toHaveAttribute("aria-label", "Open evidence for Relationship key");
  await page.locator("[data-record-management-nested-panel='relationship-businessUnits'] [aria-label='Relationship lookup recipe'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("select[name='businessUnitsRelationshipResolution']")).toHaveValue("inverseLookup");
  await expect(page.locator("input[name='businessUnitsRelationshipSourceAttributeKey']")).toHaveValue("none");
  await expect(page.locator("input[name='businessUnitsRelationshipInverseAttributeKey']")).toHaveValue("organizationId");
  await expect(page.locator("input[name='businessUnitsRelationshipJoinEntityKey']")).toHaveValue("none");
  await page.locator("[data-record-management-nested-panel='relationship-businessUnits'] [aria-label='Relationship boundaries'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("select[name='businessUnitsRelationshipTenantBoundary']")).toHaveValue("sameTenant");
  await expect(page.locator("select[name='businessUnitsRelationshipOrganizationBoundary']")).toHaveValue("sameOrganization");
  await expect(page.locator("select[name='businessUnitsRelationshipBusinessUnitBoundary']")).toHaveValue("notApplicable");
  await page.locator("[data-record-management-nested-panel='relationship-businessUnits'] [aria-label='Relationship lifecycle impact'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("select[name='businessUnitsRelationshipOnArchive']")).toHaveValue("cascadeArchive");
  await expect(page.locator("select[name='businessUnitsRelationshipOnDelete']")).toHaveValue("restrict");
  await expect(page.locator("select[name='businessUnitsRelationshipOnSupersede']")).toHaveValue("preserveHistorical");
  await page.locator("[data-record-management-nested-trigger='relationship-primaryLogo']").click();
  await page.locator("[data-record-management-nested-panel='relationship-primaryLogo'] [aria-label='Relationship lookup recipe'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("select[name='primaryLogoRelationshipResolution']")).toHaveValue("storedReference");
  await expect(page.locator("input[name='primaryLogoRelationshipSourceAttributeKey']")).toHaveValue("primaryLogoAssetId");
  await page.locator("[data-record-management-region-trigger='attributes']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Attributes");
  await expect(page.locator("[data-record-management-region-panel='attributes']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='attributes'] [data-record-management-nested-trigger='attribute-email']")).toContainText("Email");
  await expect(page.locator("[data-record-management-region-panel='attributes'] [data-record-management-nested-trigger='attribute-description']")).toContainText("Description");
  await expect(page.locator("[data-record-management-region-panel='attributes'] [data-record-management-nested-trigger='attribute-status']")).toContainText("Status");
  await expect(page.locator("[data-record-management-region-panel='attributes'] [data-record-management-nested-trigger='attribute-owner']")).toContainText("Owner");
  await expect(page.locator("[data-record-management-region-panel='attributes'] [data-record-management-nested-trigger='attribute-created-at']")).toContainText("Created at");
  await expect(page.locator("[data-record-management-region-panel='attributes'] [data-record-management-nested-trigger='attribute-updated-at']")).toContainText("Updated at");
  const attributeDetailsToggle = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Attribute details'] [data-entity-management-section-toggle]");
  const attributeDetailsBody = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Attribute details'] [data-entity-management-section-body]");
  const attributeStorageToggle = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Ownership and storage'] [data-entity-management-section-toggle]");
  const attributeStorageBody = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Ownership and storage'] [data-entity-management-section-body]");
  const attributeSearchToggle = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Search'] [data-entity-management-section-toggle]");
  const attributeSearchBody = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Search'] [data-entity-management-section-body]");
  const attributeValidationToggle = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Validation'] [data-entity-management-section-toggle]");
  const attributeValidationBody = page.locator("[data-record-management-nested-panel='attribute-email'] [aria-label='Validation'] [data-entity-management-section-body]");
  await expect(attributeDetailsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(attributeDetailsBody).toBeHidden();
  await expect(attributeStorageToggle).toHaveAttribute("aria-expanded", "false");
  await expect(attributeStorageBody).toBeHidden();
  await expect(attributeSearchToggle).toHaveAttribute("aria-expanded", "false");
  await expect(attributeSearchBody).toBeHidden();
  await expect(attributeValidationToggle).toHaveAttribute("aria-expanded", "false");
  await expect(attributeValidationBody).toBeHidden();
  await attributeDetailsToggle.click();
  await expect(attributeDetailsBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeKey']")).toHaveValue("email");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeLabelKey']")).toHaveValue("entity.rootUser.attribute.email.label");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeLabelFallback']")).toHaveValue("Email");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeDescriptionKey']")).toHaveValue("entity.rootUser.attribute.email.description");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] textarea[name='emailAttributeDescriptionFallback']")).toHaveValue("Primary email address used to identify and contact the user.");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeCategory']")).toHaveValue("identity");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeType']")).toHaveValue("email");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeType'] option")).toHaveCount(26);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeValueCardinality']")).toHaveValue("single");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems']").locator("..")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems']").locator("..")).toBeHidden();
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeValueCardinality']").selectOption("multiple");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems']").locator("..")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems']").locator("..")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems']")).toHaveValue("notApplicable");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems']")).toHaveValue("notApplicable");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems'] option")).toHaveCount(11);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems'] option")).toHaveCount(11);
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems']").selectOption("1");
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems']").selectOption("3");
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeValueCardinality']").selectOption("single");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems']").locator("..")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems']").locator("..")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMinItems']")).toHaveValue("notApplicable");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMaxItems']")).toHaveValue("notApplicable");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeRequired'][value='true']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSystemManaged'][value='false']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMutability']")).toHaveValue("updateable");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeMutability'] option")).toHaveCount(8);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributePrivacyClassification']")).toHaveValue("notSensitive");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-sensitive-privacy-category-field]")).toBeHidden();
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributePrivacyClassification']").selectOption("sensitive");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-sensitive-privacy-category-field]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSensitivePrivacyCategory']")).toHaveAttribute("required", "");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSensitivePrivacyCategory'] option")).toHaveCount(10);
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributePrivacyClassification']").selectOption("notSensitive");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-sensitive-privacy-category-field]")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSensitivePrivacyCategory']")).not.toHaveAttribute("required", "");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityClassification']")).toHaveValue("internal");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityClassification'] option")).toHaveCount(4);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-security-level-field]")).toBeHidden();
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityClassification']").selectOption("classified");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-security-level-field]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityLevel']")).toHaveAttribute("required", "");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityLevel']")).toHaveValue("level1");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityLevel'] option")).toHaveCount(10);
  await page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityClassification']").selectOption("internal");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-security-level-field]")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSecurityLevel']")).not.toHaveAttribute("required", "");
  await attributeSearchToggle.click();
  await expect(attributeDetailsBody).toBeHidden();
  await expect(attributeSearchBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSearchable']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSearchOperators']")).toHaveValue("exact,prefix,contains,sort");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-view-drawer-select='emailAttributeSearchOperators'] [data-form-drawer-select-summary]")).toHaveText("Exact, Prefix +2 more");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSearchStorageModel']")).toHaveValue("normalizedScalar");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSearchStorageModel'] option")).toHaveCount(7);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSearchIndexPosture']")).toHaveValue("required");
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-view-drawer-select='emailAttributeSearchOperators'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-view-drawer-select='emailAttributeSearchOperators'] [data-form-drawer-select-option]")).toHaveCount(7);
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-view-drawer-select='emailAttributeSearchOperators'] [data-form-drawer-select-option][data-value='fullText']").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSearchOperators']")).toHaveValue("exact,prefix,contains,sort,fullText");
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-view-drawer-select='emailAttributeSearchOperators'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSearchable']").uncheck();
  const searchConfigFields = page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-attribute-search-config-field]");
  await expect(searchConfigFields).toHaveCount(3);
  await expect(searchConfigFields.nth(0)).toBeHidden();
  await expect(searchConfigFields.nth(1)).toBeHidden();
  await expect(searchConfigFields.nth(2)).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSearchStorageModel']")).toHaveValue("notSearchable");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] select[name='emailAttributeSearchIndexPosture']")).toHaveValue("notApplicable");
  await attributeValidationToggle.click();
  await expect(attributeSearchBody).toBeHidden();
  await expect(attributeValidationBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='maxLength']")).toBeVisible();
  const firstRule = page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='maxLength']").first();
  await expect(firstRule.locator("[data-entity-management-validation-rule-key] [data-form-drawer-select-summary]")).toHaveText("maxLength");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1RuleKey']")).toHaveValue("maxLength");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentType']").locator("..")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentValue']").locator("..")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentType']")).toHaveValue("integer");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentValue']")).toHaveValue("120");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1MessageKey']")).toHaveValue("validation.maxLength");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] textarea[name='emailAttributeValidation1MessageFallback']")).toHaveValue("Must be 120 characters or fewer.");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='maxLength'] [data-entity-management-validation-rule-copy]")).toHaveAccessibleName("Copy validation rule");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='maxLength'] [data-entity-management-validation-rule-remove]")).toHaveAccessibleName("Remove validation rule");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='maxLength'] [data-entity-management-validation-rule-add]")).toHaveAccessibleName("Add validation rule");
  await firstRule.locator("[data-entity-management-validation-rule-key] [data-form-drawer-select-button]").click();
  await expect(firstRule.locator("[data-entity-management-validation-rule-key] [data-form-drawer-select-option]")).toHaveCount(49);
  await firstRule.locator("[data-entity-management-validation-rule-key] [data-form-drawer-select-option][data-value='emailFormat']").click();
  const updatedFirstRule = page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='emailFormat']").first();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1RuleKey']")).toHaveValue("emailFormat");
  await expect(updatedFirstRule.locator("[data-entity-management-validation-rule-key] [data-form-drawer-select-summary]")).toHaveText("emailFormat");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentType']")).toHaveValue("");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentValue']")).toHaveValue("");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentType']").locator("..")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1ArgumentValue']").locator("..")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation1MessageKey']")).toHaveValue("validation.emailFormat");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] textarea[name='emailAttributeValidation1MessageFallback']")).toHaveValue("Enter a valid email address.");
  await updatedFirstRule.locator("[data-entity-management-validation-rule-key] [data-form-drawer-select-close]").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='emailFormat']")).toBeVisible();
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='emailFormat'] [data-entity-management-validation-rule-copy]").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='emailFormat']")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation2RuleKey']")).toHaveValue("emailFormat");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation2ArgumentValue']").locator("..")).toBeHidden();
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='emailFormat']").nth(1).locator("[data-entity-management-validation-rule-add]").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule]")).toHaveCount(3);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation3RuleKey']")).toHaveValue("");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='rule-3'] [data-entity-management-validation-rule-key] [data-form-drawer-select-button]")).toBeFocused();
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='rule-3'] [data-entity-management-validation-rule-key] [data-form-drawer-select-button]").click();
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='rule-3'] [data-entity-management-validation-rule-key] [data-form-drawer-select-option][data-value='pattern']").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation3MessageKey']")).toHaveValue("validation.pattern");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] textarea[name='emailAttributeValidation3MessageFallback']")).toHaveValue("Enter text in the required format.");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation3ArgumentValue']").locator("..")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='pattern'] [data-entity-management-validation-rule-summary]")).toHaveText("pattern");
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='pattern'] [data-entity-management-validation-rule-key] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule='pattern'] [data-entity-management-validation-rule-remove]").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] [data-entity-management-validation-rule]")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeValidation2RuleKey']")).toHaveValue("emailFormat");
  await attributeStorageToggle.click();
  await expect(attributeValidationBody).toBeHidden();
  await expect(attributeStorageBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeOwningEntity']")).toHaveValue("Organization");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeOwningEntity']")).toHaveAttribute("readonly", "");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSupplyPosture'][value='user-supplied']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeSupplyPosture']:disabled")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeRequirementPosture'][value='required']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeDbLocation']")).toHaveValue("organizations");
  await expect(page.locator("[data-record-management-nested-panel='attribute-email'] input[name='emailAttributeDbName']")).toHaveValue("email");
  await page.locator("[data-record-management-nested-trigger='attribute-status']").click();
  await page.locator("[data-record-management-nested-panel='attribute-status'] [aria-label='Attribute details'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='attribute-status'] input[name='statusAttributeLabelFallback']")).toHaveValue("Status");
  await expect(page.locator("[data-record-management-nested-panel='attribute-status'] textarea[name='statusAttributeDescriptionFallback']")).toHaveValue("Lifecycle state or operational posture for the record.");
  await page.locator("[data-record-management-region-trigger='catalogs']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Catalogs");
  await expect(page.locator("[data-record-management-region-panel='catalogs']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-status']")).toContainText("Status catalog");
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-priority']")).toContainText("Priority catalog");
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-timezone']")).toContainText("Timezone catalog");
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-country-code']")).toContainText("Country code catalog");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [aria-label='Catalog details'] [data-entity-management-section-toggle]")).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogCatalogName']")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [aria-label='Catalog scope'] [data-entity-management-section-toggle]")).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [aria-label='Catalog options'] [data-entity-management-section-toggle]")).toHaveAttribute("aria-expanded", "false");
  await page.locator("[data-record-management-nested-panel='catalog-status'] [aria-label='Catalog details'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogCatalogName']")).toHaveValue("Status catalog");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] textarea[name='statusCatalogCatalogDescription']")).toHaveValue("Reusable status values for lifecycle and workflow-facing enum attributes.");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogCatalogScope'][value='entity']")).toBeHidden();
  await page.locator("[data-record-management-nested-panel='catalog-status'] [aria-label='Catalog scope'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogCatalogName']")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogCatalogScope'][value='entity']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [data-entity-management-catalog-copy]")).toHaveAccessibleName("Copy catalog");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [data-entity-management-catalog-delete]")).toHaveAccessibleName("Delete catalog");
  await page.locator("[data-record-management-nested-panel='catalog-status'] [aria-label='Catalog options'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption1Label']")).toHaveValue("Draft");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption1Value']")).toHaveValue("draft");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [data-entity-management-catalog-option-row]")).toHaveCount(3);
  await page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption1Label']").fill("Needs Review");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption1Value']")).toHaveValue("needs_review");
  await page.locator("[data-record-management-nested-panel='catalog-status'] [data-entity-management-catalog-option-row]").first().locator("[data-entity-management-catalog-option-add]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [data-entity-management-catalog-option-row]")).toHaveCount(4);
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption2Label']")).toHaveValue("Option 4");
  await page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption2Label']").fill("Escalated");
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption2Value']")).toHaveValue("escalated");
  await page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption2Label']").locator("..").locator("..").locator("[data-entity-management-catalog-option-move='down']").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption3Label']")).toHaveValue("Escalated");
  await page.locator("[data-record-management-nested-panel='catalog-status'] input[name='statusCatalogOption3Label']").locator("..").locator("..").locator("[data-entity-management-catalog-option-remove]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-status'] [data-entity-management-catalog-option-row]")).toHaveCount(3);
  await page.locator("[data-record-management-nested-trigger='catalog-timezone']").click();
  await page.locator("[data-record-management-nested-panel='catalog-timezone'] [aria-label='Catalog details'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-timezone'] input[name='timezoneCatalogCatalogName']")).toHaveValue("Timezone catalog");
  await expect(page.locator("[data-record-management-nested-panel='catalog-timezone'] textarea[name='timezoneCatalogCatalogDescription']")).toHaveValue("Global IANA timezone values used by scheduling, location, and user preference attributes.");
  await page.locator("[data-record-management-nested-panel='catalog-timezone'] [aria-label='Catalog options'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-timezone'] input[name='timezoneCatalogOption1Label']")).toHaveValue("UTC");
  await expect(page.locator("[data-record-management-nested-panel='catalog-timezone'] input[name='timezoneCatalogOption2Value']")).toHaveValue("Europe/Dublin");
  await expect(page.locator("[data-record-management-nested-panel='catalog-timezone'] [data-entity-management-catalog-option-row]")).toHaveCount(4);
  await page.locator("[data-record-management-nested-trigger='catalog-country-code']").click();
  await page.locator("[data-record-management-nested-panel='catalog-country-code'] [aria-label='Catalog details'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-country-code'] input[name='countryCodeCatalogCatalogName']")).toHaveValue("Country code catalog");
  await expect(page.locator("[data-record-management-nested-panel='catalog-country-code'] textarea[name='countryCodeCatalogCatalogDescription']")).toHaveValue("Global ISO 3166-1 alpha-2 country codes used by address and regional configuration attributes.");
  await page.locator("[data-record-management-nested-panel='catalog-country-code'] [aria-label='Catalog options'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-country-code'] input[name='countryCodeCatalogOption1Label']")).toHaveValue("Ireland");
  await expect(page.locator("[data-record-management-nested-panel='catalog-country-code'] input[name='countryCodeCatalogOption1Value']")).toHaveValue("IE");
  await expect(page.locator("[data-record-management-nested-panel='catalog-country-code'] [data-entity-management-catalog-option-row]")).toHaveCount(4);
  await page.locator("[data-record-management-nested-trigger='catalog-priority']").click();
  await page.locator("[data-record-management-nested-panel='catalog-priority'] [aria-label='Catalog scope'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-priority'] input[name='priorityCatalogCatalogScope'][value='global']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='catalog-priority'] [data-entity-management-catalog-impact]")).toContainText("Global catalog edits apply to every entity attribute that consumes this catalog across the platform.");
  await page.locator("[data-record-management-nested-panel='catalog-priority'] [data-entity-management-catalog-copy]").click();
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-5']")).toContainText("Untitled catalog");
  await page.locator("[data-record-management-nested-panel='catalog-5'] [aria-label='Catalog details'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-5'] input[name='catalog5CatalogName']")).toHaveValue("Priority catalog");
  await page.locator("[data-record-management-nested-panel='catalog-5'] [aria-label='Catalog scope'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-5'] input[name='catalog5CatalogScope'][value='global']")).toBeChecked();
  await page.locator("[data-record-management-nested-panel='catalog-5'] [aria-label='Catalog options'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-5'] input[name='catalog5Option1Label']")).toHaveValue("Low");
  await page.locator("[data-record-management-nested-panel='catalog-5'] [aria-label='Catalog details'] [data-entity-management-section-toggle]").click();
  await page.locator("[data-record-management-nested-panel='catalog-5'] input[name='catalog5CatalogName']").fill("Priority copy");
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-5']")).toContainText("Priority copy");
  await page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-add]").click();
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-6']")).toContainText("Untitled catalog");
  await page.locator("[data-record-management-nested-panel='catalog-6'] [aria-label='Catalog details'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-6'] input[name='catalog6CatalogName']")).toHaveValue("");
  await page.locator("[data-record-management-nested-panel='catalog-6'] [aria-label='Catalog scope'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-6'] input[name='catalog6CatalogScope'][value='entity']")).toBeChecked();
  await page.locator("[data-record-management-nested-panel='catalog-6'] [aria-label='Catalog options'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='catalog-6'] input[name='catalog6Option1Label']")).toHaveValue("Option 1");
  await page.locator("[data-record-management-nested-panel='catalog-6'] [data-entity-management-catalog-delete]").click();
  await expect(page.locator("[data-record-management-region-panel='catalogs'] [data-record-management-nested-trigger='catalog-6']")).toHaveCount(0);
  await page.locator("[data-record-management-region-trigger='placements']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Display");
  await expect(page.locator("[data-record-management-region-panel='placements']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='placements'] [data-record-management-nested-trigger='placement-primary-details']")).toContainText("Primary details");
  await expect(page.locator("[data-record-management-region-panel='placements'] [data-record-management-nested-trigger='placement-operations']")).toContainText("Operations");
  await expect(page.locator("[data-record-management-region-panel='placements'] [data-record-management-nested-trigger='placement-system']")).toContainText("System");
  const placementDetailsToggle = page.locator("[data-record-management-nested-panel='placement-primary-details'] [aria-label='Placement details'] [data-entity-management-section-toggle]");
  const placementSecondaryNavToggle = page.locator("[data-record-management-nested-panel='placement-primary-details'] [aria-label='Secondary nav'] [data-entity-management-section-toggle]");
  const placementAttributesToggle = page.locator("[data-record-management-nested-panel='placement-primary-details'] [aria-label='Attributes'] [data-entity-management-section-toggle]");
  const placementDetailsBody = page.locator("[data-record-management-nested-panel='placement-primary-details'] [aria-label='Placement details'] [data-entity-management-section-body]");
  const placementSecondaryNavBody = page.locator("[data-record-management-nested-panel='placement-primary-details'] [aria-label='Secondary nav'] [data-entity-management-section-body]");
  const placementAttributesBody = page.locator("[data-record-management-nested-panel='placement-primary-details'] [aria-label='Attributes'] [data-entity-management-section-body]");
  await expect(placementDetailsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(placementSecondaryNavToggle).toHaveAttribute("aria-expanded", "false");
  await expect(placementAttributesToggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsPlacementName']")).toBeHidden();
  await placementDetailsToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsPlacementName']")).toHaveValue("Primary details");
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] textarea[name='primaryDetailsPlacementDescription']")).toHaveValue("Default record drawer region for the most important identifying fields.");
  await placementSecondaryNavToggle.click();
  await expect(placementDetailsBody).toBeHidden();
  await expect(placementSecondaryNavBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsSecondaryNavEnabled']")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsSecondaryNavEntity']")).toHaveValue("team");
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("teamName,teamDescription,teamStatus");
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-view-drawer-select='primaryDetailsSecondaryNavEntity'] [data-form-drawer-select-summary]")).toHaveText("Team");
  await page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-view-drawer-select='primaryDetailsSecondaryNavEntity'] [data-form-drawer-select-button]").click();
  await page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-view-drawer-select='primaryDetailsSecondaryNavEntity'] [data-form-drawer-select-option][data-value='deal']").click();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsSecondaryNavEntity']")).toHaveValue("deal");
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("dealName,dealValue,dealStage");
  await page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-view-drawer-select='primaryDetailsSecondaryNavEntity'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsSecondaryNavEnabled']").uncheck();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-placement-secondary-nav-source]")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("email,description,status");
  await page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsSecondaryNavEnabled']").check();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-placement-secondary-nav-source]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("dealName,dealValue,dealStage");
  await placementAttributesToggle.click();
  await expect(placementSecondaryNavBody).toBeHidden();
  await expect(placementAttributesBody).toBeVisible();
  const primaryPlacementSections = page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-placement-attribute-section]");
  const firstPlacementSection = primaryPlacementSections.nth(0);
  const secondPlacementSection = primaryPlacementSections.nth(1);
  await expect(primaryPlacementSections).toHaveCount(2);
  await expect(firstPlacementSection.locator("input[name='primaryDetailsPlacementSection1Name']")).toHaveValue("Summary");
  await expect(secondPlacementSection.locator("input[name='primaryDetailsPlacementSection2Name']")).toHaveValue("Ownership");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-selector]")).toHaveAttribute("data-entity-management-attribute-source", "deal");
  await expect(firstPlacementSection.locator("input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("dealName,dealValue,dealStage");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle]")).toHaveCount(6);
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealName']")).toContainText("Priority 1");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealValue']")).toContainText("Priority 2");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealStage']")).toContainText("Priority 3");
  await expect(page.locator("[data-record-management-nested-panel='placement-primary-details'] [data-entity-management-view-attribute-toggle][data-attribute-key='email']")).toHaveCount(0);
  await firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealName']").click();
  await expect(firstPlacementSection.locator("input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("dealValue,dealStage");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealValue']")).toContainText("Priority 1");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealName']")).toContainText("Not on");
  await firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealOwner']").click();
  await expect(firstPlacementSection.locator("input[name='primaryDetailsPlacementSection1Attributes']")).toHaveValue("dealValue,dealStage,dealOwner");
  await expect(firstPlacementSection.locator("[data-entity-management-view-attribute-toggle][data-attribute-key='dealOwner']")).toContainText("Priority 3");
  await firstPlacementSection.locator("[data-entity-management-placement-section-add]").click();
  await expect(primaryPlacementSections).toHaveCount(3);
  await expect(primaryPlacementSections.nth(1).locator("input[name='primaryDetailsPlacementSection2Name']")).toHaveValue("Section 3");
  await expect(primaryPlacementSections.nth(1).locator("input[name='primaryDetailsPlacementSection2Attributes']")).toHaveValue("dealName,dealValue,dealStage");
  await primaryPlacementSections.nth(1).locator("input[name='primaryDetailsPlacementSection2Name']").fill("Commercial view");
  await primaryPlacementSections.nth(1).locator("[data-entity-management-placement-section-move='down']").click();
  await expect(primaryPlacementSections.nth(2).locator("input[name='primaryDetailsPlacementSection3Name']")).toHaveValue("Commercial view");
  await primaryPlacementSections.nth(2).locator("[data-entity-management-placement-section-remove]").click();
  await expect(primaryPlacementSections).toHaveCount(2);
  await page.locator("[data-record-management-nested-trigger='placement-operations']").click();
  await page.locator("[data-record-management-nested-panel='placement-operations'] [aria-label='Secondary nav'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='placement-operations'] input[name='operationsSecondaryNavEntity']")).toHaveValue("task");
  await page.locator("[data-record-management-nested-panel='placement-operations'] [aria-label='Attributes'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='placement-operations'] [data-entity-management-placement-attribute-section]").first().locator("[data-entity-management-view-attribute-selector]")).toHaveAttribute("data-entity-management-attribute-source", "task");
  await expect(page.locator("[data-record-management-nested-panel='placement-operations'] input[name='operationsPlacementSection1Attributes']")).toHaveValue("taskTitle,taskStatus,assignee");
  await page.locator("[data-record-management-nested-trigger='placement-system']").click();
  await page.locator("[data-record-management-nested-panel='placement-system'] [aria-label='Secondary nav'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='placement-system'] input[name='systemSecondaryNavEnabled']")).not.toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='placement-system'] [data-entity-management-placement-secondary-nav-source]")).toBeHidden();
  await page.locator("[data-record-management-region-trigger='permissions']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Permissions");
  await expect(page.locator("[data-record-management-region-panel='permissions']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-trigger='permission-role-llm']")).toContainText("LLM");
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-add]")).toHaveAccessibleName("Add another permission role");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-copy]")).toHaveAccessibleName("Copy permission role");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-delete]")).toHaveAccessibleName("Delete permission role");
  const permissionRoleToggle = page.locator("[data-record-management-nested-panel='permission-role-llm'] [aria-label='Role'] [data-entity-management-section-toggle]");
  const permissionRecordToggle = page.locator("[data-record-management-nested-panel='permission-role-llm'] [aria-label='Record capabilities'] [data-entity-management-section-toggle]");
  const permissionStructureToggle = page.locator("[data-record-management-nested-panel='permission-role-llm'] [aria-label='Entity structure capabilities'] [data-entity-management-section-toggle]");
  await expect(permissionRoleToggle).toHaveAttribute("aria-expanded", "false");
  await expect(permissionRecordToggle).toHaveAttribute("aria-expanded", "false");
  await expect(permissionStructureToggle).toHaveAttribute("aria-expanded", "false");
  await permissionRoleToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-view-drawer-select='llmPermissionPermissionRole'] [data-form-drawer-select-summary]")).toHaveText("LLM");
  await expect(page.locator("input[name='llmPermissionPermissionRole']")).toHaveValue("llm");
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-view-drawer-select='llmPermissionPermissionRole'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-view-drawer-select='llmPermissionPermissionRole'] [data-form-drawer-select-option]")).toContainText(["LLM", "Root Admin", "Tenant Admin"]);
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-view-drawer-select='llmPermissionPermissionRole'] [data-form-drawer-select-close]").click();
  await permissionRecordToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-family-toggle]")).toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle]")).toHaveCount(15);
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][data-capability-key='list']")).toContainText("Available");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][data-capability-key='list'] svg path")).toHaveCount(1);
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][data-capability-key='list']").click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][data-capability-key='list']")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][data-capability-key='list']")).toContainText("Unavailable");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][data-capability-key='list'] svg path")).toHaveCount(2);
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-bulk='select']").click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][aria-pressed='true']")).toHaveCount(15);
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-bulk='deselect']").click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-toggle][aria-pressed='false']")).toHaveCount(15);
  await permissionStructureToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='record'] [data-entity-management-permission-capability-list]")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-family-toggle]")).not.toBeChecked();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-list]")).toBeHidden();
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-family-toggle]").check();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-list]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle]")).toHaveCount(109);
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='capture_role_need']")).toContainText("Capture role need");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='add_permission_capability']")).toContainText("Add permission capability");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='create_placement']")).toContainText("Create placement");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='edit_view_display_model']")).toContainText("Edit view display model");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='show_view_drawer_placement']")).toContainText("Show view drawer placement");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='create_record_create_capability']")).toContainText("Create record create capability");
  await expect(page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-family='entityStructure'] [data-entity-management-permission-capability-toggle][data-capability-key='create_record_bulk_import_capability']")).toContainText("Create record bulk import capability");
  await page.locator("[data-record-management-nested-panel='permission-role-llm'] [data-entity-management-permission-copy]").click();
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-trigger='permission-role-2']")).toContainText("LLM");
  await page.locator("[data-record-management-nested-panel='permission-role-2'] [aria-label='Role'] [data-entity-management-section-toggle]").click();
  await page.locator("[data-record-management-nested-panel='permission-role-2'] [data-entity-management-view-drawer-select='permissionRole2PermissionRole'] [data-form-drawer-select-button]").click();
  await page.locator("[data-record-management-nested-panel='permission-role-2'] [data-entity-management-view-drawer-select='permissionRole2PermissionRole'] [data-form-drawer-select-option][data-value='rootAdmin']").click();
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-trigger='permission-role-2'] strong")).toHaveText("Root Admin");
  await page.locator("[data-record-management-nested-panel='permission-role-2'] [data-entity-management-view-drawer-select='permissionRole2PermissionRole'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-region-trigger='views']").click();
  await page.locator("[data-record-management-nested-trigger='list-views']").click();
  const permissionLimitedAccessToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Access'] [data-entity-management-section-toggle]");
  if (await permissionLimitedAccessToggle.getAttribute("aria-expanded") === "false") {
    await permissionLimitedAccessToggle.click();
  }
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option]")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option][data-value='llm']")).toContainText("LLM");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option][data-value='rootAdmin']")).toContainText("Root Admin");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option][data-value='rootAdmin']").click();
  await expect(page.locator("input[name='listViewsRoles']")).toHaveValue("llm,rootAdmin");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-region-trigger='permissions']").click();
  await page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-add]").click();
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-trigger='permission-role-3']")).toContainText("LLM");
  await page.locator("[data-record-management-nested-panel='permission-role-3'] [data-entity-management-permission-delete]").click();
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-trigger='permission-role-3']")).toHaveCount(0);
  await page.locator("[data-record-management-region-trigger='generation-model']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Generation Model");
  await expect(page.locator("[data-record-management-region-panel='generation-model']")).toBeVisible();
  const generationModeToggle = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Generation mode'] [data-entity-management-section-toggle]");
  const generationAllowedToggle = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Allowed outputs'] [data-entity-management-section-toggle]");
  const generationBlockedToggle = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Blocked outputs'] [data-entity-management-section-toggle]");
  const generationEvidenceToggle = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Evidence'] [data-entity-management-section-toggle]");
  const generationModeBody = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Generation mode'] [data-entity-management-section-body]");
  const generationAllowedBody = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Allowed outputs'] [data-entity-management-section-body]");
  const generationBlockedBody = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Blocked outputs'] [data-entity-management-section-body]");
  const generationEvidenceBody = page.locator("[data-record-management-region-panel='generation-model'] [aria-label='Evidence'] [data-entity-management-section-body]");
  await expect(generationModeToggle).toHaveAttribute("aria-expanded", "false");
  await expect(generationAllowedToggle).toHaveAttribute("aria-expanded", "false");
  await expect(generationBlockedToggle).toHaveAttribute("aria-expanded", "false");
  await expect(generationEvidenceToggle).toHaveAttribute("aria-expanded", "false");
  await expect(generationModeBody).toBeHidden();
  await expect.poll(async () => page.locator("[data-record-management-region-panel='generation-model'] [data-entity-management-view-section]").first().evaluate((section) => {
    const rect = section.getBoundingClientRect();
    return Math.round(rect.height);
  })).toBeLessThan(90);
  await generationModeToggle.click();
  await expect(generationModeBody).toBeVisible();
  await expect(page.locator("select[name='entityGenerationMode']")).toHaveValue("previewThenApply");
  await expect(page.locator("select[name='entityGenerationMode'] option")).toHaveCount(5);
  await expect(page.locator("input[name='entityGenerationDriftDetectionRequired']")).toBeChecked();
  await generationAllowedToggle.click();
  await expect(generationModeBody).toBeHidden();
  await expect(generationAllowedBody).toBeVisible();
  await expect(page.locator("input[name='entityGenerationAllowedOutputCategories']")).toHaveValue("docs,uiDefaults,designSystemPreview,validationConfig,searchConfig,capabilityMappingDraft,apiContractDraft,testDraft");
  await expect(page.locator("[data-record-management-region-panel='generation-model'] [data-entity-management-view-drawer-select='entityGenerationAllowedOutputCategories'] [data-form-drawer-select-summary]")).toHaveText("Docs, UI defaults +6 more");
  await generationBlockedToggle.click();
  await expect(generationAllowedBody).toBeHidden();
  await expect(generationBlockedBody).toBeVisible();
  await expect(page.locator("input[name='entityGenerationBlockedOutputCategories']")).toHaveValue("runtimeSource,databaseMigration,authorizationLogic,permissionGrant");
  await expect(page.locator("[data-record-management-region-panel='generation-model'] [data-entity-management-view-drawer-select='entityGenerationBlockedOutputCategories'] [data-form-drawer-select-summary]")).toHaveText("Runtime source, Database migration +2 more");
  await generationEvidenceToggle.click();
  await expect(generationBlockedBody).toBeHidden();
  await expect(generationEvidenceBody).toBeVisible();
  await expect(page.locator("textarea[name='entityGenerationEvidenceKeys']")).toHaveValue("[]");
  await page.locator("[data-record-management-region-trigger='compliance-model']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Compliance Model");
  await expect(page.locator("[data-record-management-region-panel='compliance-model']")).toBeVisible();
  const compliancePrivacyToggle = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Privacy and security'] [data-entity-management-section-toggle]");
  const complianceLifecycleToggle = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Lifecycle and export'] [data-entity-management-section-toggle]");
  const complianceEncryptionToggle = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Encryption posture'] [data-entity-management-section-toggle]");
  const complianceEvidenceToggle = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Evidence'] [data-entity-management-section-toggle]");
  const compliancePrivacyBody = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Privacy and security'] [data-entity-management-section-body]");
  const complianceLifecycleBody = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Lifecycle and export'] [data-entity-management-section-body]");
  const complianceEncryptionBody = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Encryption posture'] [data-entity-management-section-body]");
  const complianceEvidenceBody = page.locator("[data-record-management-region-panel='compliance-model'] [aria-label='Evidence'] [data-entity-management-section-body]");
  await expect(compliancePrivacyToggle).toHaveAttribute("aria-expanded", "false");
  await expect(complianceLifecycleToggle).toHaveAttribute("aria-expanded", "false");
  await expect(complianceEncryptionToggle).toHaveAttribute("aria-expanded", "false");
  await expect(complianceEvidenceToggle).toHaveAttribute("aria-expanded", "false");
  await expect(compliancePrivacyBody).toBeHidden();
  await expect.poll(async () => page.locator("[data-record-management-region-panel='compliance-model'] [data-entity-management-view-section]").first().evaluate((section) => {
    const rect = section.getBoundingClientRect();
    return Math.round(rect.height);
  })).toBeLessThan(90);
  await compliancePrivacyToggle.click();
  await expect(compliancePrivacyBody).toBeVisible();
  await expect(page.locator("select[name='entityCompliancePrivacyImpact']")).toHaveValue("containsSensitivePII");
  await expect(page.locator("input[name='entityComplianceSensitivePrivacyCategoriesPresent']")).toHaveValue("governmentIdentifiers");
  await expect(page.locator("[data-record-management-region-panel='compliance-model'] [data-entity-management-view-drawer-select='entityComplianceSensitivePrivacyCategoriesPresent'] [data-form-drawer-select-summary]")).toHaveText("Social Security numbers, passport numbers, driver's license numbers");
  await expect(page.locator("select[name='entityComplianceSecurityImpact']")).toHaveValue("restricted");
  await expect(page.locator("input[name='entityComplianceAuditRequired']")).toBeChecked();
  await complianceLifecycleToggle.click();
  await expect(compliancePrivacyBody).toBeHidden();
  await expect(complianceLifecycleBody).toBeVisible();
  await expect(page.locator("input[name='entityComplianceRetentionPolicyKey']")).toHaveValue("standardTenantRecordRetention");
  await expect(page.locator("select[name='entityComplianceDeletePosture']")).toHaveValue("softDeleteWithPendingDeletion");
  await expect(page.locator("input[name='entityComplianceLegalHoldSupported']")).toBeChecked();
  await expect(page.locator("select[name='entityComplianceExportPosture']")).toHaveValue("privacyReviewedExport");
  await expect(page.locator("select[name='entityComplianceCleanupPosture']")).toHaveValue("featureOwnedCleanup");
  await complianceEncryptionToggle.click();
  await expect(complianceLifecycleBody).toBeHidden();
  await expect(complianceEncryptionBody).toBeVisible();
  await expect(page.locator("select[name='entityComplianceEncryptionAtRest']")).toHaveValue("required");
  await expect(page.locator("select[name='entityComplianceEncryptionInTransit']")).toHaveValue("required");
  await expect(page.locator("select[name='entityComplianceEncryptionFieldLevel']")).toHaveValue("notRequired");
  await expect(page.locator("input[name='entityComplianceKeyManagementPolicyKey']")).toHaveValue("platformStandardKms");
  await expect(page.locator("textarea[name='entityComplianceEncryptionAttributeOverrides']")).toHaveValue("[]");
  await complianceEvidenceToggle.click();
  await expect(complianceEncryptionBody).toBeHidden();
  await expect(complianceEvidenceBody).toBeVisible();
  await expect(page.locator("textarea[name='entityComplianceEvidenceKeys']")).toHaveValue("[]");
  await page.locator("[data-record-management-region-trigger='migration-model']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Migration Model");
  await expect(page.locator("[data-record-management-region-panel='migration-model']")).toBeVisible();
  const migrationStatusToggle = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Migration status'] [data-entity-management-section-toggle]");
  const migrationTargetToggle = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Source and target'] [data-entity-management-section-toggle]");
  const migrationCompatibilityToggle = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Compatibility checks'] [data-entity-management-section-toggle]");
  const migrationBlockersToggle = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Blockers and evidence'] [data-entity-management-section-toggle]");
  const migrationStatusBody = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Migration status'] [data-entity-management-section-body]");
  const migrationTargetBody = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Source and target'] [data-entity-management-section-body]");
  const migrationCompatibilityBody = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Compatibility checks'] [data-entity-management-section-body]");
  const migrationBlockersBody = page.locator("[data-record-management-region-panel='migration-model'] [aria-label='Blockers and evidence'] [data-entity-management-section-body]");
  await expect(migrationStatusToggle).toHaveAttribute("aria-expanded", "false");
  await expect(migrationTargetToggle).toHaveAttribute("aria-expanded", "false");
  await expect(migrationCompatibilityToggle).toHaveAttribute("aria-expanded", "false");
  await expect(migrationBlockersToggle).toHaveAttribute("aria-expanded", "false");
  await expect(migrationStatusBody).toBeHidden();
  await expect.poll(async () => page.locator("[data-record-management-region-panel='migration-model'] [data-entity-management-view-section]").first().evaluate((section) => {
    const rect = section.getBoundingClientRect();
    return Math.round(rect.height);
  })).toBeLessThan(90);
  await migrationStatusToggle.click();
  await expect(migrationStatusBody).toBeVisible();
  await expect(page.locator("select[name='entityMigrationStatus']")).toHaveValue("notStarted");
  await expect(page.locator("select[name='entityMigrationStatus'] option")).toHaveCount(7);
  await expect(page.locator("select[name='entityMigrationCurrentSourcePosture']")).toHaveValue("repoArtifactsPrimary");
  await expect(page.locator("select[name='entityMigrationTargetSourcePosture']")).toHaveValue("persistentEntityDefinitionPrimary");
  await migrationTargetToggle.click();
  await expect(migrationStatusBody).toBeHidden();
  await expect(migrationTargetBody).toBeVisible();
  await expect(page.locator("textarea[name='entityMigrationCurrentArtifactKeys']")).toHaveValue("[]");
  await expect(page.locator("input[name='entityMigrationTargetPersistentRecordKey']")).toHaveValue("organization");
  await migrationCompatibilityToggle.click();
  await expect(migrationTargetBody).toBeHidden();
  await expect(migrationCompatibilityBody).toBeVisible();
  await expect(page.locator("input[name='entityMigrationCompatibilityChecksRequired']")).toHaveValue("apiContractParity,persistenceSchemaParity,dataDictionaryParity,permissionMappingParity");
  await expect(page.locator("[data-record-management-region-panel='migration-model'] [data-entity-management-view-drawer-select='entityMigrationCompatibilityChecksRequired'] [data-form-drawer-select-summary]")).toHaveText("API contract parity, Persistence schema parity +2 more");
  await page.locator("[data-record-management-region-panel='migration-model'] [data-entity-management-view-drawer-select='entityMigrationCompatibilityChecksRequired'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-region-panel='migration-model'] [data-entity-management-view-drawer-select='entityMigrationCompatibilityChecksRequired'] [data-form-drawer-select-option]")).toHaveCount(7);
  await page.locator("[data-record-management-region-panel='migration-model'] [data-entity-management-view-drawer-select='entityMigrationCompatibilityChecksRequired'] [data-form-drawer-select-option][data-value='runtimeBehaviorParity']").click();
  await expect(page.locator("input[name='entityMigrationCompatibilityChecksRequired']")).toHaveValue("apiContractParity,persistenceSchemaParity,dataDictionaryParity,permissionMappingParity,runtimeBehaviorParity");
  await page.locator("[data-record-management-region-panel='migration-model'] [data-entity-management-view-drawer-select='entityMigrationCompatibilityChecksRequired'] [data-form-drawer-select-close]").click();
  await migrationBlockersToggle.click();
  await expect(migrationCompatibilityBody).toBeHidden();
  await expect(migrationBlockersBody).toBeVisible();
  await expect(page.locator("textarea[name='entityMigrationBlockingIssues']")).toHaveValue("[]");
  await expect(page.locator("textarea[name='entityMigrationEvidenceKeys']")).toHaveValue("[]");
  await page.locator("[data-record-management-region-trigger='action-models-record']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Action Models - Record");
  await expect(page.locator("[data-record-management-region-panel='action-models-record']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='action-models-record'] [data-record-management-nested-trigger]")).toHaveCount(15);
  await expect(page.locator("[data-record-management-region-panel='action-models-record'] [data-record-management-nested-trigger='record-action-list']")).toContainText("List");
  await expect(page.locator("[data-record-management-region-panel='action-models-record'] [data-record-management-nested-trigger='record-action-bulk-import']")).toContainText("Bulk import");
  await expect(page.locator("[data-record-management-region-panel='action-models-record'] [data-record-management-nested-trigger='record-action-operational-status-transition']")).toContainText("Operational status transition");
  const actionModelToggle = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Action model'] [data-entity-management-section-toggle]");
  const requestBodyToggle = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Request body'] [data-entity-management-section-toggle]");
  const responseBodyToggle = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Response body'] [data-entity-management-section-toggle]");
  const successAuditToggle = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Success audit types'] [data-entity-management-section-toggle]");
  const errorAuditToggle = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Error audit types and messaging'] [data-entity-management-section-toggle]");
  const actionModelBody = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Action model'] [data-entity-management-section-body]");
  const requestBody = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Request body'] [data-entity-management-section-body]");
  const responseBody = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Response body'] [data-entity-management-section-body]");
  const successAuditBody = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Success audit types'] [data-entity-management-section-body]");
  const errorAuditBody = page.locator("[data-record-management-nested-panel='record-action-list'] [aria-label='Error audit types and messaging'] [data-entity-management-section-body]");
  await expect(actionModelToggle).toHaveAttribute("aria-expanded", "false");
  await expect(requestBodyToggle).toHaveAttribute("aria-expanded", "false");
  await expect(responseBodyToggle).toHaveAttribute("aria-expanded", "false");
  await expect(successAuditToggle).toHaveAttribute("aria-expanded", "false");
  await expect(errorAuditToggle).toHaveAttribute("aria-expanded", "false");
  await actionModelToggle.click();
  await expect(actionModelBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listActionKey']")).toHaveValue("list");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listActionFamily']")).toHaveValue("record");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listOwningLayer']")).toHaveValue("runtime");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listOwnerKey']")).toHaveValue("organization");
  await expect(actionModelBody.locator("input[name='listApiRoute']")).toHaveCount(0);
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listLabelKey']")).toHaveValue("entity.organization.action.list.label");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listDescriptionKey']")).toHaveValue("entity.organization.action.list.description");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listDescriptionFallback']")).toHaveValue("List record rows available to the actor.");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listExecutionMode']")).toHaveValue("sync");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listAuditRequired']")).toHaveValue("true");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listDefaultErrorKey']")).toHaveValue("entity.organization.action.list.failed");
  await requestBodyToggle.click();
  await expect(actionModelBody).toBeHidden();
  await expect(requestBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listApiRoute']")).toHaveValue("GET /v1/organizations");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listRequestBodyKey']")).toHaveValue("entity.organization.action.list.requestBody");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listRequestBodyFallback']")).toHaveValue("List request body for the organization record action.");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listRequestBodySchemaTemplate']")).toContainText('"actorContext"');
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listRequestBodySchemaTemplate']")).toHaveAttribute("rows", "6");
  await responseBodyToggle.click();
  await expect(requestBody).toBeHidden();
  await expect(responseBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] input[name='listResponseBodyKey']")).toHaveValue("entity.organization.action.list.responseBody");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listResponseBodyFallback']")).toHaveValue("List response body for the organization record action.");
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listResponseBodySchemaTemplate']")).toContainText('"outcome"');
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listResponseBodySchemaTemplate']")).toHaveAttribute("rows", "6");
  await successAuditToggle.click();
  await expect(responseBody).toBeHidden();
  await expect(successAuditBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] .entity-management-action-audit-card")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] .entity-management-action-audit-card").first()).toContainText("entity.organization.action.list.requested");
  await errorAuditToggle.click();
  await expect(successAuditBody).toBeHidden();
  await expect(errorAuditBody).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] [data-entity-management-action-error]")).toHaveCount(12);
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] [data-entity-management-action-error='notAuthorized']")).toContainText("entity.organization.action.list.notAuthorized");
  await page.locator("[data-record-management-nested-panel='record-action-list'] [data-entity-management-action-error='notAuthorized'] summary").click();
  await expect(page.locator("[data-record-management-nested-panel='record-action-list'] textarea[name='listnotAuthorizedLogTemplate']")).toHaveValue("actor={{actorId}} action=list owner=organization target={{targetId}} outcome=error error=notAuthorized request={{requestId}}");
  await page.locator("[data-record-management-nested-trigger='record-action-export']").click();
  await page.locator("[data-record-management-nested-panel='record-action-export'] [aria-label='Action model'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='record-action-export'] input[name='exportExecutionMode']")).toHaveValue("async");
  await expect(page.locator("[data-record-management-nested-panel='record-action-export'] [aria-label='Action model'] input[name='exportApiRoute']")).toHaveCount(0);
  await page.locator("[data-record-management-nested-panel='record-action-export'] [aria-label='Request body'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='record-action-export'] input[name='exportApiRoute']")).toHaveValue("POST /v1/organizations/export");
  await page.locator("[data-record-management-region-trigger='action-models-entity-structure']").click();
  await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Action Models - Entity Structure");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger]")).toHaveCount(109);
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-entity']")).toContainText("Create entity");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-update-source-authority']")).toContainText("Update source authority");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-attribute']")).toContainText("Create attribute");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-creation-flow']")).toContainText("Edit creation flow");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-collection-view']")).toContainText("Create collection view");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-relationship-definition']")).toContainText("Create relationship definition");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-catalog']")).toContainText("Create catalog");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-placement']")).toContainText("Create placement");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-reorder-placement']")).toContainText("Reorder placement");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-select-placement-attribute']")).toContainText("Select placement attribute");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-view-display-model']")).toContainText("Edit view display model");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-show-view-drawer-placement']")).toContainText("Show view drawer placement");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-authoring-guidance']")).toContainText("Edit authoring guidance");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-writing-guidance']")).toContainText("Edit writing guidance");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-question-guidance']")).toContainText("Edit question guidance");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-attach-entity-evidence']")).toContainText("Attach entity evidence");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-capture-role-need']")).toContainText("Capture role need");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-add-permission-capability']")).toContainText("Add permission capability");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-generation-model']")).toContainText("Edit generation model");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-privacy-posture']")).toContainText("Edit privacy posture");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-migration-model']")).toContainText("Edit migration model");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-edit-action-model']")).toContainText("Edit action model");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-record-list-capability']")).toContainText("Create record list capability");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-record-read-capability']")).toContainText("Create record read capability");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-record-create-capability']")).toContainText("Create record create capability");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-record-update-capability']")).toContainText("Create record update capability");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-record-bulk-import-capability']")).toContainText("Create record bulk import capability");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-record-status-transition-capability']")).toContainText("Create record status transition capability");
  const structureActionModelToggle = page.locator("[data-record-management-nested-panel='structure-action-create-entity'] [aria-label='Action model'] [data-entity-management-section-toggle]");
  const structureRequestBodyToggle = page.locator("[data-record-management-nested-panel='structure-action-create-entity'] [aria-label='Request body'] [data-entity-management-section-toggle]");
  const structureSuccessAuditToggle = page.locator("[data-record-management-nested-panel='structure-action-create-entity'] [aria-label='Success audit types'] [data-entity-management-section-toggle]");
  const structureErrorAuditToggle = page.locator("[data-record-management-nested-panel='structure-action-create-entity'] [aria-label='Error audit types and messaging'] [data-entity-management-section-toggle]");
  await structureActionModelToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityActionKey']")).toHaveValue("create_entity");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityActionFamily']")).toHaveValue("definition_lifecycle");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityOwningLayer']")).toHaveValue("platform");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityOwnerKey']")).toHaveValue("entity_definition");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityLabelKey']")).toHaveValue("entityDefinition.action.create_entity.label");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityDescriptionKey']")).toHaveValue("entityDefinition.action.create_entity.description");
  await structureRequestBodyToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityApiRoute']")).toHaveValue("POST /v1/entity-definitions");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] input[name='create_entityRequestBodyKey']")).toHaveValue("entityDefinition.action.create_entity.requestBody");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] textarea[name='create_entityRequestBodySchemaTemplate']")).toContainText('"ownerKey"');
  await structureSuccessAuditToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] .entity-management-action-audit-card").first()).toContainText("entityDefinition.action.create_entity.requested");
  await structureErrorAuditToggle.click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] [data-entity-management-action-error]")).toHaveCount(12);
  await expect(page.locator("[data-record-management-nested-panel='structure-action-create-entity'] [data-entity-management-action-error='conflict']")).toContainText("entityDefinition.action.create_entity.conflict");
  await page.locator("[data-record-management-nested-trigger='structure-action-edit-authoring-guidance']").click();
  await page.locator("[data-record-management-nested-panel='structure-action-edit-authoring-guidance'] [aria-label='Request body'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-edit-authoring-guidance'] input[name='edit_authoring_guidanceApiRoute']")).toHaveValue("PATCH /v1/entity-definitions/:entityId/fields/:fieldId/llm-guidance/authoring");
  await expect(page.locator("[data-record-management-nested-panel='structure-action-edit-authoring-guidance'] input[name='edit_authoring_guidanceRequestBodyKey']")).toHaveValue("entityDefinition.action.edit_authoring_guidance.requestBody");
  await page.locator("[data-record-management-nested-trigger='structure-action-attach-entity-evidence']").click();
  await page.locator("[data-record-management-nested-panel='structure-action-attach-entity-evidence'] [aria-label='Request body'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-attach-entity-evidence'] input[name='attach_entity_evidenceApiRoute']")).toHaveValue("POST /v1/entity-definitions/:entityId/evidence");
  await page.locator("[data-record-management-nested-trigger='structure-action-add-permission-capability']").click();
  await page.locator("[data-record-management-nested-panel='structure-action-add-permission-capability'] [aria-label='Request body'] [data-entity-management-section-toggle]").click();
  await expect(page.locator("[data-record-management-nested-panel='structure-action-add-permission-capability'] input[name='add_permission_capabilityApiRoute']")).toHaveValue("POST /v1/entity-definitions/:entityId/permissions/roles/:rolePermissionId/capabilities");
  await page.locator("[data-record-management-region-trigger='identity']").click();
  await expect(page.locator("input[name='entityName']")).toHaveValue("Organization");
  await expect(page.locator("input[name='stableEntityKey']")).toHaveValue("organization");
  await expect(page.locator("input[name='stableEntityKey']")).toHaveAttribute("readonly", "");
  await expect(page.locator("input[name='singularLabelKey']")).toHaveValue("entity.organization.label.singular");
  await expect(page.locator("input[name='singularLabelFallback']")).toHaveValue("Organization");
  await expect(page.locator("input[name='pluralLabelKey']")).toHaveValue("entity.organization.label.plural");
  await expect(page.locator("input[name='pluralLabelFallback']")).toHaveValue("Organizations");
  await expect(page.locator("input[name='descriptionKey']")).toHaveValue("entity.organization.description");
  await expect(page.locator("textarea[name='descriptionFallback']")).toHaveValue("An organization represents a company, department, partner, or other business structure that the platform manages, displays, and connects to related records.");
  await expect(page.locator("textarea[name='descriptionFallback']")).toHaveAttribute("rows", "1");
  await expect(page.locator("input[name='purposeKey']")).toHaveValue("entity.organization.purpose");
  await expect(page.locator("textarea[name='purposeFallback']")).toHaveValue("Organizations give the platform a stable business structure for ownership, reporting, relationships, permissions, and operational workflows.");
  await page.locator("#record-management-display-settings-button").click();
  await expect(page.locator("#record-management-display-settings-drawer")).toBeVisible();
  await page.locator("[data-record-management-theme-option='dark']").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator("[data-record-management-direction-option='rtl']").click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.locator("[data-record-management-magnification-option='50']").click();
  await expect(page.locator("[data-record-management-entity-page-template]")).toHaveAttribute("data-magnification", "50");
  await page.locator("[data-record-management-theme-option='normal']").click();
  await page.locator("[data-record-management-direction-option='ltr']").click();
  await page.locator("[data-record-management-magnification-option='0']").click();
  await page.locator("#record-management-display-settings-close").click();
  await expect(page.locator("#record-management-display-settings-drawer")).toBeHidden();
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveCount(0);
  await expect(page.locator("[data-record-management-ai-mode-toggle]")).toHaveAccessibleName("Toggle AI mode");
  await expect(page.locator("[data-record-management-ai-mode-toggle]")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-record-management-ai-button]:visible")).toHaveCount(0);
  await page.locator("[data-record-management-ai-mode-toggle]").click();
  await expect(page.locator("[data-record-management-ai-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-ai-button]:visible")).toHaveCount(10);
  await expect(page.locator("[data-evidence-element-name='Entity name'] [data-record-management-ai-button]")).toHaveAccessibleName("Open AI options for Entity name");
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "false");
  await page.locator("[data-record-management-nested-panel='primary-details'] [data-evidence-element-name='Description fallback'] [data-record-management-ai-button]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-ai-view", "true");
  await expect(page.locator("[data-record-management-ai-drawer] .chat-workspace-list-drawer-header p")).toHaveText("EntityDefinitionAuthoringGuidanceCatalog");
  await expect(page.locator("[data-record-management-ai-drawer] .chat-workspace-list-drawer-header h4")).toHaveText("Description fallback");
  await expect(page.locator("[data-record-management-ai-drawer] .record-management-status-badge")).toHaveText("entityIdentity.descriptionFallback");
  await expect.poll(async () => page.locator("[data-chat-workspace-list-drawer]").evaluate((drawer) => {
    const body = drawer.querySelector(".chat-workspace-list-drawer-body");
    const entityPanel = drawer.querySelector("[data-record-management-user-attribute-view]");
    const aiDrawer = drawer.querySelector("[data-record-management-ai-drawer]");
    if (!(body instanceof HTMLElement) || !(entityPanel instanceof HTMLElement) || !(aiDrawer instanceof HTMLElement)) {
      return null;
    }
    const bodyRect = body.getBoundingClientRect();
    const entityRect = entityPanel.getBoundingClientRect();
    const aiRect = aiDrawer.getBoundingClientRect();
    return {
      aiRightOfEntity: aiRect.left > entityRect.left,
      aiShare: Math.round((aiRect.width / bodyRect.width) * 100),
      aiScrolls: aiDrawer.scrollHeight > aiDrawer.clientHeight,
      entityShare: Math.round((entityRect.width / bodyRect.width) * 100),
      overflowY: getComputedStyle(aiDrawer).overflowY,
    };
  })).toMatchObject({
    aiRightOfEntity: true,
    aiShare: 49,
    aiScrolls: true,
    entityShare: 49,
    overflowY: "auto",
  });
  await expect(page.locator("[data-record-management-ai-drawer]")).toContainText("EntityDefinitionAuthoringGuidanceCatalog");
  await expect(page.locator("[data-record-management-ai-drawer]")).toContainText("recommendAndConfirm");
  await expect(page.locator("[data-record-management-ai-drawer]")).toContainText("deriveFromSourceTruth");
  await expect(page.locator("[data-record-management-ai-drawer]")).toContainText("what the entity represents");
  await expect(page.locator("[data-record-management-ai-drawer]")).toContainText("A managed organization record.");
  await expect(page.locator("[data-record-management-ai-drawer]")).toContainText("What kind of real-world thing should this entity represent for the people using the platform?");
  await page.locator("[data-record-management-ai-return]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-ai-view", "false");
  await expect(page.locator("[data-record-management-evidence-button]:visible")).toHaveCount(0);
  await page.locator("[data-record-management-evidence-mode-toggle]").click();
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-ai-mode-toggle]")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-record-management-ai-button]:visible")).toHaveCount(0);
  await expect(page.locator("[data-record-management-evidence-button]:visible")).toHaveCount(10);
  await page.locator("[data-evidence-element-name='Entity name'] [data-record-management-evidence-button]").click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-evidence-view", "true");
  await expect(page.locator("[data-record-management-evidence-drawer] .chat-workspace-list-drawer-header p")).toHaveText("Evidence");
  await expect(page.locator("[data-record-management-evidence-drawer] .chat-workspace-list-drawer-header h4")).toHaveText("Entity name");
  await expect(page.locator("[data-record-management-evidence-drawer] .record-management-status-badge")).toHaveText("Organization");
  await expect(page.locator("[data-record-management-region-trigger='identity']")).toBeHidden();
  await expect(page.locator("[data-record-management-nested-trigger='primary-details']")).toBeHidden();
  await expect(page.locator(".record-management-evidence-card")).toHaveCount(3);
  await expect(page.locator(".record-management-evidence-card").first()).toContainText("Generated by");
  await expect(page.locator(".record-management-evidence-card").first()).toContainText("human");
  await expect(page.locator(".record-management-evidence-card").first()).toContainText("derived_from_source_truth");
  await expect(page.locator(".record-management-evidence-card").first()).toContainText("docs/data-dictionary/organization.md");
  await expect(page.locator(".record-management-evidence-card").first()).toContainText("Existing data dictionary uses Organization as the canonical entity name.");
  await expect.poll(async () => page.locator("[data-chat-workspace-list-drawer]").evaluate((drawer) => {
    const body = drawer.querySelector(".chat-workspace-list-drawer-body");
    const entityPanel = drawer.querySelector("[data-record-management-user-attribute-view]");
    const evidenceDrawer = drawer.querySelector("[data-record-management-evidence-drawer]");
    if (!(body instanceof HTMLElement) || !(entityPanel instanceof HTMLElement) || !(evidenceDrawer instanceof HTMLElement)) {
      return null;
    }
    const bodyRect = body.getBoundingClientRect();
    const entityRect = entityPanel.getBoundingClientRect();
    const evidenceRect = evidenceDrawer.getBoundingClientRect();
    return {
      entityShare: Math.round((entityRect.width / bodyRect.width) * 100),
      evidenceShare: Math.round((evidenceRect.width / bodyRect.width) * 100),
    };
  })).toMatchObject({
    entityShare: 49,
    evidenceShare: 49,
  });
  await page.locator("[data-record-management-evidence-return]").first().click();
  await expect(page.locator("[data-chat-workspace-list-drawer]")).toHaveAttribute("data-record-management-evidence-view", "false");
  await expect(page.locator("[data-record-management-region-trigger='identity']")).toContainText("Identity");
  await page.locator("[data-record-management-ai-mode-toggle]").click();
  await expect(page.locator("[data-record-management-ai-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-record-management-evidence-button]:visible")).toHaveCount(0);
  await expect(page.locator("[data-record-management-ai-button]:visible")).toHaveCount(10);
  await page.locator("[data-record-management-ai-mode-toggle]").click();
  await page.locator("[data-record-management-evidence-mode-toggle]").click();
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-ai-mode-toggle]")).toHaveAttribute("aria-pressed", "false");
  await page.locator("[data-record-management-nested-trigger='owning-feature']").click();
  await expect(page.locator("input[name='featureStatus'][value='existing']")).toBeChecked();
  await expect.poll(async () => page.locator(".entity-management-identity-region").evaluate((group) => {
    const header = group.querySelector(".record-management-user-attribute-group-header");
    const nestedList = group.querySelector(".record-management-nested-list");
    if (!(header instanceof HTMLElement) || !(nestedList instanceof HTMLElement)) {
      return null;
    }
    const headerRect = header.getBoundingClientRect();
    const nestedRect = nestedList.getBoundingClientRect();
    return {
      headerCompact: Math.round(headerRect.height) < 70,
      nestedFollowsHeader: Math.round(nestedRect.top - headerRect.bottom) <= 16,
      rows: getComputedStyle(group).gridTemplateRows,
    };
  })).toMatchObject({
    headerCompact: true,
    nestedFollowsHeader: true,
  });
  await expect.poll(async () => page.locator("[data-record-management-nested-panel='owning-feature']").evaluate((panel) => {
    const drawer = panel.closest(".record-management-nested-list-drawer");
    const subpanel = panel.querySelector(".entity-management-subpanel");
    if (!(drawer instanceof HTMLElement) || !(subpanel instanceof HTMLElement)) {
      return null;
    }
    const drawerRect = drawer.getBoundingClientRect();
    const subpanelRect = subpanel.getBoundingClientRect();
    return {
      alignContent: getComputedStyle(drawer).alignContent,
      contentPinnedToTop: Math.round(subpanelRect.top - drawerRect.top) <= 16,
    };
  })).toMatchObject({
    alignContent: "start",
    contentPinnedToTop: true,
  });
  await expect.poll(async () => page.locator("[data-entity-management-feature-status]").first().evaluate((input) => {
    const group = input.closest(".form-choice-group");
    const legend = group?.querySelector(".form-choice-legend");
    const row = group?.querySelector(".form-choice-row");
    if (!(group instanceof HTMLElement) || !(legend instanceof HTMLElement) || !(row instanceof HTMLElement)) {
      return null;
    }
    const groupRect = group.getBoundingClientRect();
    const legendRect = legend.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const legendStyle = getComputedStyle(legend);
    return {
      legendInsideTopBorder: legendRect.top > groupRect.top,
      legendInsideInlineEdges: legendRect.left >= groupRect.left && legendRect.right <= groupRect.right,
      rowsBelowLegend: rowRect.top > legendRect.bottom,
      legendWidth: legendStyle.width,
    };
  })).toMatchObject({
    legendInsideTopBorder: true,
    legendInsideInlineEdges: true,
    rowsBelowLegend: true,
  });
  await expect(page.locator("[data-entity-management-owning-feature-key]")).toBeVisible();
  await expect(page.locator("[data-entity-management-owning-feature-key] input[name='owningFeatureKey']")).toHaveValue("");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-summary]")).toHaveText("Choose feature key");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-selected-count]")).toHaveText("0 selected");
  await expect(page.locator("[data-entity-management-owning-feature-derived-fields]")).toBeHidden();
  await page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-panel]")).toBeVisible();
  await expect.poll(async () => page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-panel]").evaluate((panel) => {
    const rect = panel.getBoundingClientRect();
    const fieldRect = panel.closest("[data-entity-management-owning-feature-key]")?.getBoundingClientRect();
    const style = getComputedStyle(panel);
    return {
      fixed: style.position === "fixed",
      rightGap: Math.round(document.documentElement.clientWidth - rect.right),
      narrowerThanPage: rect.width < document.documentElement.clientWidth / 2,
      opensAboveField: fieldRect ? rect.top < fieldRect.top : false,
    };
  })).toMatchObject({
    fixed: true,
    rightGap: 0,
    narrowerThanPage: true,
    opensAboveField: true,
  });
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option]")).toHaveCount(3);
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='organizationCore']")).not.toHaveClass(/active/);
  await page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='entityBuilder']").click();
  await expect(page.locator("[data-entity-management-owning-feature-key] input[name='owningFeatureKey']")).toHaveValue("entityBuilder");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-summary]")).toHaveText("entityBuilder");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-selected-count]")).toHaveText("1 selected");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='organizationCore']")).not.toHaveClass(/active/);
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='entityBuilder']")).toHaveClass(/active/);
  await page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-close]").click();
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-panel]")).toBeHidden();
  await expect(page.locator("[data-entity-management-owning-feature-derived-fields]")).toBeVisible();
  await expect(page.locator("select[name='owningFeaturePosture']")).toHaveValue("implemented");
  await expect(page.locator("select[name='owningLayer']")).toHaveValue("feature");
  await page.locator("input[name='featureStatus'][value='planned']").check();
  await expect(page.locator("[data-entity-management-owning-feature-key]")).toBeHidden();
  await expect(page.locator("[data-entity-management-owning-feature-derived-fields]")).toBeHidden();
  await page.locator("input[name='featureStatus'][value='existing']").check();
  await expect(page.locator("[data-entity-management-owning-feature-key]")).toBeVisible();
  await expect(page.locator("[data-entity-management-owning-feature-derived-fields]")).toBeVisible();
  await page.locator("[data-record-management-nested-trigger='source-authority-posture']").click();
  await expect(page.locator("input[name='currentAuthority'][value='repo_artifacts']")).toBeChecked();
  await expect(page.locator("input[name='currentAuthority']:disabled")).toHaveCount(5);
  await expect(page.locator("input[name='targetAuthority'][value='persistent_entity_definition']")).toBeChecked();
  await expect(page.locator("input[name='targetAuthority']:disabled")).toHaveCount(2);
  await expect(page.locator("input[name='markdownPosture'][value='source_independent_planning']")).toBeChecked();
  await expect(page.locator("input[name='markdownPosture']:disabled")).toHaveCount(5);
  await expect(page.locator("select[name='migrationStatus']")).toHaveValue("not_started");
  await expect(page.locator("select[name='migrationStatus']")).toBeDisabled();
  await expect(page.locator("[data-record-management-list-centric-mount] .chat-workspace-chat-pane")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] [data-chat-workspace-secondary-header]")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-header")).toBeHidden();
  await expect(page.locator("[data-record-management-list-centric-mount] .floating-tab-list")).toBeHidden();

  const geometry = await page.evaluate(() => {
    const contextNav = document.querySelector(".context-nav")?.getBoundingClientRect();
    const drawer = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer]")?.getBoundingClientRect();
    const shell = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-shell]")?.getBoundingClientRect();
    return contextNav && drawer && shell
      ? {
          drawerLeft: Math.round(drawer.left),
          drawerRight: Math.round(drawer.right),
          drawerTop: Math.round(drawer.top),
          drawerBottom: Math.round(drawer.bottom),
          shellLeft: Math.round(shell.left),
          shellRight: Math.round(shell.right),
          shellTop: Math.round(shell.top),
          shellBottom: Math.round(shell.bottom),
          contextRight: Math.round(contextNav.right),
          viewportBottom: document.documentElement.clientHeight,
          viewportRight: document.documentElement.clientWidth,
        }
      : null;
  });

  expect(geometry).not.toBeNull();
  expect(Math.abs((geometry?.shellLeft ?? 0) - (geometry?.contextRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.shellRight ?? 0) - (geometry?.viewportRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.drawerLeft ?? 0) - (geometry?.shellLeft ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.drawerRight ?? 0) - (geometry?.shellRight ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.drawerTop ?? 0) - (geometry?.shellTop ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((geometry?.drawerBottom ?? 0) - (geometry?.shellBottom ?? 0))).toBeLessThanOrEqual(1);
});

test("record management entity page uses mobile menu and swipeable sublist navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design-system/templates/entity_management_page");
  await page.waitForSelector("[data-record-management-region-panel='identity']");

  const initialRenderFootprint = await page.evaluate(() => ({
    controlCount: document.querySelectorAll("input, textarea, select, button").length,
    nodeCount: document.querySelectorAll("*").length,
    renderedNestedPanels: document.querySelectorAll("[data-record-management-nested-panel][data-entity-management-lazy-rendered='true']").length,
    renderedRegions: document.querySelectorAll("[data-record-management-region-panel][data-entity-management-lazy-rendered='true']").length,
  }));

  expect(initialRenderFootprint.renderedRegions).toBe(1);
  expect(initialRenderFootprint.renderedNestedPanels).toBe(1);
  expect(initialRenderFootprint.nodeCount).toBeLessThan(5000);
  expect(initialRenderFootprint.controlCount).toBeLessThan(1000);

  const mobileHeader = page.locator("[data-record-management-region-shell] .record-management-region-mobile-header");
  const primaryIndex = page.locator("[data-record-management-region-shell] .record-management-region-index");
  const primarySelect = mobileHeader.locator("[data-form-select]");

  await expect(mobileHeader).toBeVisible();
  await expect(primaryIndex).toBeHidden();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("identity");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Identity");
  await expect(primarySelect.locator("[data-form-select-button]")).toHaveCSS("min-height", "68px");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await expect(primarySelect.locator("[data-form-select-option][data-value='views']")).toContainText("Views");
  await expect(primarySelect.locator("[data-form-select-option][data-value='relationships']")).toContainText("Relationships");
  await expect(primarySelect.locator("[data-form-select-option][data-value='attributes']")).toContainText("Attributes");
  await expect(primarySelect.locator("[data-form-select-option][data-value='catalogs']")).toContainText("Catalogs");
  await expect(primarySelect.locator("[data-form-select-option][data-value='placements']")).toContainText("Display");
  await expect(primarySelect.locator("[data-form-select-option][data-value='permissions']")).toContainText("Permissions");
  await expect(primarySelect.locator("[data-form-select-option][data-value='generation-model']")).toContainText("Generation Model");
  await expect(primarySelect.locator("[data-form-select-option][data-value='compliance-model']")).toContainText("Compliance Model");
  await expect(primarySelect.locator("[data-form-select-option][data-value='migration-model']")).toContainText("Migration Model");
  await expect(primarySelect.locator("[data-form-select-option][data-value='action-models-record']")).toContainText("Action Models - Record");
  await expect(primarySelect.locator("[data-form-select-option][data-value='action-models-entity-structure']")).toContainText("Action Models - Entity Structure");
  await expect(primarySelect.locator("[data-form-select-option][data-value='members']")).toHaveCount(0);
  await expect(primarySelect.locator("[data-form-select-option][data-value='legal']")).toHaveCount(0);
  await expect(primarySelect.locator("[data-form-select-option][data-value='locations']")).toHaveCount(0);
  await expect(primarySelect.locator("[data-form-select-option][data-value='branding']")).toHaveCount(0);
  await primarySelect.locator("[data-form-select-option][data-value='views']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("views");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Views");
  await expect(page.locator("[data-record-management-region-panel='views']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='views'] .record-management-nested-list-layout")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-trigger='list-views']")).toContainText("List views");
  await expect(page.locator("[data-record-management-region-panel='views'] [data-record-management-nested-add]")).toHaveAccessibleName("Add another entity view");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='catalogs']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("catalogs");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Catalogs");
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeHidden();
  await expect(page.locator("[data-record-management-region-panel='catalogs']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='identity']")).toBeHidden();

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='placements']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("placements");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Display");
  await expect(page.locator("[data-record-management-region-panel='placements']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='placements'] [data-record-management-nested-trigger='placement-primary-details']")).toContainText("Primary details");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='permissions']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("permissions");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Permissions");
  await expect(page.locator("[data-record-management-region-panel='permissions']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='permissions'] [data-record-management-nested-trigger='permission-role-llm']")).toContainText("LLM");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='generation-model']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("generation-model");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Generation Model");
  await expect(page.locator("[data-record-management-region-panel='generation-model']")).toBeVisible();

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='compliance-model']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("compliance-model");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Compliance Model");
  await expect(page.locator("[data-record-management-region-panel='compliance-model']")).toBeVisible();

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='migration-model']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("migration-model");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Migration Model");
  await expect(page.locator("[data-record-management-region-panel='migration-model']")).toBeVisible();

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='action-models-record']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("action-models-record");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Action Models - Record");
  await expect(page.locator("[data-record-management-region-panel='action-models-record']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='action-models-record'] [data-record-management-nested-trigger='record-action-list']")).toContainText("List");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='action-models-entity-structure']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("action-models-entity-structure");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Action Models - Entity Structure");
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='action-models-entity-structure'] [data-record-management-nested-trigger='structure-action-create-entity']")).toContainText("Create entity");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='identity']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("identity");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Identity");
  await expect(page.locator("[data-record-management-region-panel='identity']")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-trigger='primary-details']")).toBeVisible();

  const sublistGeometry = await page.locator("[data-record-management-region-panel='identity'] .record-management-nested-list-cards").evaluate((cards) => {
    const cardRects = Array.from(cards.querySelectorAll(".record-management-nested-list-card"))
      .map((card) => card.getBoundingClientRect());
    const style = getComputedStyle(cards);
    return {
      autoFlow: style.gridAutoFlow,
      cardCount: cardRects.length,
      firstCardWidth: Math.round(cardRects[0]?.width ?? 0),
      clientWidth: Math.round(cards.clientWidth),
      scrollWidth: Math.round(cards.scrollWidth),
    };
  });

  expect(sublistGeometry.autoFlow).toBe("column");
  expect(sublistGeometry.cardCount).toBe(3);
  expect(sublistGeometry.scrollWidth).toBeGreaterThan(sublistGeometry.clientWidth);
  expect(sublistGeometry.firstCardWidth).toBeGreaterThan(Math.round(sublistGeometry.clientWidth * 0.6));

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='workflows']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("workflows");
  const workflowSublistGeometry = await page.locator("[data-record-management-region-panel='workflows'] .record-management-nested-list-cards").evaluate((cards) => {
    const cardRects = Array.from(cards.querySelectorAll(".record-management-nested-list-card"))
      .map((card) => card.getBoundingClientRect());
    const style = getComputedStyle(cards);
    return {
      autoFlow: style.gridAutoFlow,
      cardCount: cardRects.length,
      firstCardWidth: Math.round(cardRects[0]?.width ?? 0),
      clientWidth: Math.round(cards.clientWidth),
      scrollWidth: Math.round(cards.scrollWidth),
    };
  });

  expect(workflowSublistGeometry.autoFlow).toBe("column");
  expect(workflowSublistGeometry.cardCount).toBe(4);
  expect(workflowSublistGeometry.scrollWidth).toBeGreaterThan(workflowSublistGeometry.clientWidth);
  expect(workflowSublistGeometry.firstCardWidth).toBeGreaterThan(Math.round(workflowSublistGeometry.clientWidth * 0.6));

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='identity']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("identity");

  const scrollOwnership = await page.evaluate(() => {
    const template = document.querySelector("[data-record-management-entity-page-template]");
    const frame = document.querySelector("[data-record-management-entity-page-template] > .record-management-template-frame");
    const shell = document.querySelector("[data-record-management-list-centric-mount] .chat-workspace-shell");
    const panel = document.querySelector("[data-record-management-list-centric-mount] .floating-tab-list-panel");
    const drawer = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer]");
    const nestedDrawer = document.querySelector("[data-record-management-region-panel='identity'] .record-management-nested-list-drawer");
    const templateStyle = template ? getComputedStyle(template) : null;
    const frameStyle = frame ? getComputedStyle(frame) : null;
    const shellStyle = shell ? getComputedStyle(shell) : null;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const drawerStyle = drawer ? getComputedStyle(drawer) : null;
    const nestedDrawerStyle = nestedDrawer ? getComputedStyle(nestedDrawer) : null;
    return {
      drawerOverflowY: drawerStyle?.overflowY ?? "",
      frameOverflowY: frameStyle?.overflowY ?? "",
      nestedDrawerHeight: Math.round(nestedDrawer?.getBoundingClientRect().height ?? 0),
      nestedDrawerOverflowY: nestedDrawerStyle?.overflowY ?? "",
      nestedDrawerScrollHeight: nestedDrawer?.scrollHeight ?? 0,
      pageScrollHeight: document.documentElement.scrollHeight,
      panelOverflowY: panelStyle?.overflowY ?? "",
      shellOverflowY: shellStyle?.overflowY ?? "",
      templateOverflowY: templateStyle?.overflowY ?? "",
      viewportHeight: document.documentElement.clientHeight,
    };
  });

  expect(scrollOwnership.templateOverflowY).toBe("visible");
  expect(scrollOwnership.frameOverflowY).toBe("visible");
  expect(scrollOwnership.shellOverflowY).toBe("visible");
  expect(scrollOwnership.panelOverflowY).toBe("visible");
  expect(scrollOwnership.drawerOverflowY).toBe("visible");
  expect(scrollOwnership.nestedDrawerOverflowY).toBe("visible");
  expect(scrollOwnership.pageScrollHeight).toBeGreaterThan(scrollOwnership.viewportHeight);
  expect(scrollOwnership.nestedDrawerHeight).toBeGreaterThanOrEqual(scrollOwnership.nestedDrawerScrollHeight - 2);

  await page.locator("[data-record-management-evidence-mode-toggle]").click();
  await page.locator("[data-evidence-element-name='Entity name'] [data-record-management-evidence-button]").click();
  await expect(page.locator("[data-record-management-evidence-drawer]")).toBeVisible();
  const evidenceOverlayGeometry = await page.locator("[data-record-management-evidence-drawer]").evaluate((drawer) => {
    const body = drawer.closest(".chat-workspace-list-drawer-body");
    const rect = drawer.getBoundingClientRect();
    const bodyRect = body?.getBoundingClientRect();
    const style = getComputedStyle(drawer);
    const firstValue = drawer.querySelector(".record-management-evidence-card dd");
    const firstValueStyle = firstValue ? getComputedStyle(firstValue) : null;
    return {
      bodyHeight: Math.round(bodyRect?.height ?? 0),
      bodyLeft: Math.round(bodyRect?.left ?? 0),
      bodyTop: Math.round(bodyRect?.top ?? 0),
      bodyWidth: Math.round(bodyRect?.width ?? 0),
      height: Math.round(rect.height),
      left: Math.round(rect.left),
      position: style.position,
      top: Math.round(rect.top),
      valueWeight: firstValueStyle?.fontWeight ?? "",
      width: Math.round(rect.width),
    };
  });

  expect(evidenceOverlayGeometry.position).toBe("absolute");
  expect(evidenceOverlayGeometry.top).toBe(evidenceOverlayGeometry.bodyTop);
  expect(evidenceOverlayGeometry.left).toBe(evidenceOverlayGeometry.bodyLeft);
  expect(evidenceOverlayGeometry.width).toBe(evidenceOverlayGeometry.bodyWidth);
  expect(evidenceOverlayGeometry.height).toBe(evidenceOverlayGeometry.bodyHeight);
  expect(Number(evidenceOverlayGeometry.valueWeight)).toBeLessThanOrEqual(500);
  await expect(page.locator(".record-management-evidence-card")).toHaveCount(3);
  await expect(page.locator("[data-record-management-evidence-drawer] [data-record-management-evidence-return]")).toBeHidden();
  await expect(page.locator(".record-management-evidence-card").first()).toContainText("human");
  await expect(page.locator(".record-management-evidence-card").nth(1)).toContainText("system");
  await expect(page.locator(".record-management-evidence-card").nth(2)).toContainText("LLM");
});
