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
  await expect(page.locator("[data-record-management-region-trigger='details']")).toHaveCount(0);
  await expect(page.locator("[data-record-management-region-trigger='relationships']")).toHaveCount(0);
  const entityRegionOrder = await page.locator("[data-record-management-region-trigger]").evaluateAll((triggers) => (
    triggers.map((trigger) => trigger.getAttribute("data-record-management-region-trigger"))
  ));
  expect(entityRegionOrder).toEqual(["identity", "workflows", "views", "members", "legal", "locations", "branding"]);
  await expect(page.locator("[data-record-management-nested-trigger='primary-details']")).toContainText("Primary Details");
  await expect(page.locator("[data-record-management-nested-trigger='owning-feature']")).toContainText("Owning Feature");
  await expect(page.locator("[data-record-management-nested-trigger='source-authority-posture']")).toContainText("Source Authority Posture");
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
    const cards = section.closest(".record-management-nested-list-layout")?.querySelector(".record-management-nested-list-cards");
    const drawerRect = detailDrawer?.getBoundingClientRect();
    const cardsRect = cards?.getBoundingClientRect();
    return {
      collapsedDrawerShorterThanRail: drawerRect && cardsRect ? drawerRect.height < cardsRect.height : false,
      drawerHeight: drawerRect ? Math.round(drawerRect.height) : 0,
    };
  })).toMatchObject({
    collapsedDrawerShorterThanRail: true,
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
  const accessToggle = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Access'] [data-entity-management-section-toggle]");
  const accessBody = page.locator("[data-record-management-nested-panel='list-views'] [aria-label='Access'] [data-entity-management-section-body]");
  await expect(locationToggle).toHaveAttribute("aria-expanded", "false");
  await expect(accessToggle).toHaveAttribute("aria-expanded", "false");
  await expect(locationBody).toBeHidden();
  await expect(accessBody).toBeHidden();
  await locationToggle.click();
  await expect(locationToggle).toHaveAttribute("aria-expanded", "true");
  await expect(locationBody).toBeVisible();
  await expect(accessToggle).toHaveAttribute("aria-expanded", "false");
  await accessToggle.click();
  await expect(accessToggle).toHaveAttribute("aria-expanded", "true");
  await expect(accessBody).toBeVisible();
  await expect(locationToggle).toHaveAttribute("aria-expanded", "false");
  await expect(locationBody).toBeHidden();
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
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] .form-field-label")).toHaveText("Page template");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-summary]")).toHaveText("record_management_list_centric");
  await expect(page.locator("input[name='listViewsPageTemplate']")).toHaveValue("record_management_list_centric");
  await expect(page.locator("input[name='listViewsRouteName']")).toHaveValue("organization");
  await expect(page.locator("input[name='listViewsRouteName']")).toHaveAttribute("readonly", "");
  await expect(page.locator("input[name='listViewsRoutePreview']")).toHaveValue("/root-admin/organizations/:organizationId");
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-summary]")).toHaveText("Root Admin, Tenant Admin");
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
  await locationToggle.click();
  await expect(locationBody).toBeVisible();
  await expect(accessBody).toBeHidden();
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-option]")).toHaveCount(2);
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-option][data-value='record_management_page']")).toContainText("record_management_page");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-option][data-value='record_management_page']").click();
  await expect(page.locator("input[name='listViewsPageTemplate']")).toHaveValue("record_management_page");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsPageTemplate'] [data-form-drawer-select-close]").click();
  await accessToggle.click();
  await expect(accessBody).toBeVisible();
  await expect(locationBody).toBeHidden();
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
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-create-role]")).toContainText("Create new role");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-button]").click();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-panel]")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option]")).toHaveCount(4);
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-option][data-value='organizationOwner']").click();
  await expect(page.locator("input[name='listViewsRoles']")).toHaveValue("rootAdmin,tenantAdmin,organizationOwner");
  await page.locator("[data-record-management-nested-panel='list-views'] [data-entity-management-view-drawer-select='listViewsRoles'] [data-form-drawer-select-close]").click();
  await page.locator("[data-record-management-nested-trigger='detail-views']").click();
  await expect(page.locator("input[name='detailViewsRouteName']")).toHaveValue("organizationDetail");
  await expect(page.locator("input[name='detailViewsRoutePreview']")).toHaveValue("/root-admin/organizations/:organizationId/details");
  await page.locator("[data-record-management-nested-trigger='workflow-views']").click();
  await expect(page.locator("input[name='workflowViewsRouteName']")).toHaveValue("organizationWorkflow");
  await expect(page.locator("input[name='workflowViewsRoutePreview']")).toHaveValue("/root-admin/organizations/:organizationId/workflows");
  await page.locator("[data-record-management-region-trigger='identity']").click();
  await expect(page.locator("input[name='entityName']")).toHaveValue("Organization");
  await expect(page.locator("input[name='stableEntityKey']")).toHaveValue("organization");
  await expect(page.locator("input[name='stableEntityKey']")).toHaveAttribute("readonly", "");
  await expect(page.locator("textarea[name='plainLanguageDescription']")).toBeVisible();
  await expect(page.locator("textarea[name='entityPurpose']")).toBeVisible();
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
  await expect(page.locator("[data-record-management-evidence-button]:visible")).toHaveCount(0);
  await page.locator("[data-record-management-evidence-mode-toggle]").click();
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-evidence-button]:visible")).toHaveCount(4);
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
  await page.locator("[data-record-management-drawer-edit]").click();
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-record-management-evidence-button]:visible")).toHaveCount(0);
  await page.locator("[data-record-management-drawer-edit]").click();
  await page.locator("[data-record-management-evidence-mode-toggle]").click();
  await expect(page.locator("[data-record-management-evidence-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-record-management-drawer-edit]")).toHaveAttribute("aria-pressed", "false");
  await page.locator("[data-record-management-nested-trigger='owning-feature']").click();
  await expect(page.locator("input[name='featureStatus'][value='existing']")).toBeChecked();
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
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-summary]")).toHaveText("organizationCore");
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
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='organizationCore']")).toHaveClass(/active/);
  await page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='entityBuilder']").click();
  await expect(page.locator("[data-entity-management-owning-feature-key] input[name='owningFeatureKey']")).toHaveValue("entityBuilder");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-summary]")).toHaveText("entityBuilder");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-selected-count]")).toHaveText("1 selected");
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='organizationCore']")).not.toHaveClass(/active/);
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-option][data-value='entityBuilder']")).toHaveClass(/active/);
  await page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-close]").click();
  await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-panel]")).toBeHidden();
  await expect(page.locator("select[name='owningFeaturePosture']")).toHaveValue("implemented");
  await expect(page.locator("select[name='owningLayer']")).toHaveValue("feature");
  await page.locator("input[name='featureStatus'][value='planned']").check();
  await expect(page.locator("[data-entity-management-owning-feature-key]")).toBeHidden();
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
  await expect(primarySelect.locator("[data-form-select-option][data-value='relationships']")).toHaveCount(0);
  await primarySelect.locator("[data-form-select-option][data-value='views']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("views");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Views");
  await expect(page.locator("[data-record-management-region-panel='views']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='views'] .record-management-nested-list-layout")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-trigger='list-views']")).toContainText("List views");
  await expect(page.locator("[data-record-management-region-panel='views'] [data-record-management-nested-add]")).toHaveAccessibleName("Add another entity view");

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='members']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("members");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Members");
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeHidden();
  await expect(page.locator("[data-record-management-region-panel='members']")).toBeVisible();
  await expect(page.locator("[data-record-management-region-panel='identity']")).toBeHidden();

  await primarySelect.locator("[data-form-select-button]").click();
  await expect(primarySelect.locator("[data-form-select-listbox]")).toBeVisible();
  await primarySelect.locator("[data-form-select-option][data-value='identity']").click();
  await expect(primarySelect.locator("[data-form-select-value]")).toHaveValue("identity");
  await expect(primarySelect.locator("[data-form-select-current-label]")).toHaveText("Identity");
  await expect(page.locator("[data-record-management-region-panel='identity']")).toBeVisible();
  await expect(page.locator("[data-record-management-nested-trigger='primary-details']")).toBeVisible();

  const sublistGeometry = await page.locator(".entity-management-sublist .record-management-nested-list-cards").evaluate((cards) => {
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

  const scrollOwnership = await page.evaluate(() => {
    const template = document.querySelector("[data-record-management-entity-page-template]");
    const frame = document.querySelector("[data-record-management-entity-page-template] > .record-management-template-frame");
    const shell = document.querySelector("[data-record-management-list-centric-mount] .chat-workspace-shell");
    const panel = document.querySelector("[data-record-management-list-centric-mount] .floating-tab-list-panel");
    const drawer = document.querySelector("[data-record-management-list-centric-mount] [data-chat-workspace-list-drawer]");
    const templateStyle = template ? getComputedStyle(template) : null;
    const frameStyle = frame ? getComputedStyle(frame) : null;
    const shellStyle = shell ? getComputedStyle(shell) : null;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const drawerStyle = drawer ? getComputedStyle(drawer) : null;
    return {
      drawerOverflowY: drawerStyle?.overflowY ?? "",
      frameOverflowY: frameStyle?.overflowY ?? "",
      panelOverflowY: panelStyle?.overflowY ?? "",
      shellOverflowY: shellStyle?.overflowY ?? "",
      templateOverflowY: templateStyle?.overflowY ?? "",
    };
  });

  expect(scrollOwnership.templateOverflowY).toBe("hidden");
  expect(scrollOwnership.frameOverflowY).toBe("hidden");
  expect(scrollOwnership.shellOverflowY).toBe("hidden");
  expect(scrollOwnership.panelOverflowY).toBe("hidden");
  expect(scrollOwnership.drawerOverflowY).toBe("hidden");

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
