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
  await expect(page.locator("[data-record-management-region-trigger='details']")).toHaveCount(0);
  await expect(page.locator("[data-record-management-nested-trigger='primary-details']")).toContainText("Primary Details");
  await expect(page.locator("[data-record-management-nested-trigger='owning-feature']")).toContainText("Owning Feature");
  await expect(page.locator("[data-record-management-nested-trigger='source-authority-posture']")).toContainText("Source Authority Posture");
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
  expect(scrollOwnership.drawerOverflowY).toBe("auto");

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
