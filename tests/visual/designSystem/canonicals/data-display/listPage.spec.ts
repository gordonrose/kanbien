import { expect, test } from "@playwright/test";

test.describe("design-system list page", () => {
  test("recomposes the parent route from the signed-off child seam shapes", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const seamState = await page.evaluate(() => {
      const splitLayout = document.querySelector("[data-selectable-list-layout]");
      const firstCard = document.querySelector("[data-selectable-list-card]");
      const detailPanel = document.querySelector("[data-selectable-list-detail-panel]");

      return {
        splitSeam: splitLayout instanceof HTMLElement ? splitLayout.dataset.listPageChildSeam ?? "" : "",
        listSlot: document.querySelector("[data-list-detail-split-layout-slot='list']") instanceof HTMLElement,
        detailSlot: document.querySelector("[data-list-detail-split-layout-slot='detail']") instanceof HTMLElement,
        cardSeam: firstCard instanceof HTMLElement ? firstCard.dataset.listPageChildSeam ?? "" : "",
        cardTitleExists: firstCard?.querySelector("[data-list-record-card-slot='title']") instanceof HTMLElement,
        detailSeam: detailPanel instanceof HTMLElement ? detailPanel.dataset.listPageChildSeam ?? "" : "",
      };
    });

    expect(seamState.splitSeam).toBe("list-detail-split-layout");
    expect(seamState.listSlot).toBe(true);
    expect(seamState.detailSlot).toBe(true);
    expect(seamState.cardSeam).toBe("list-record-card");
    expect(seamState.cardTitleExists).toBe(true);
    expect(seamState.detailSeam).toBe("list-detail-panel");
  });

  test("can switch the list-page record item presentation from cards to compact rows", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listItemVariant=row");

    const itemsContainer = page.locator("[data-selectable-list-items]");
    const rowHeader = page.locator("[data-selectable-list-row-header]");
    const firstItem = page.locator("[data-selectable-list-card]").first();

    await expect(itemsContainer).toHaveAttribute("data-list-item-variant", "row");
    await expect(rowHeader).toBeVisible();
    await expect(rowHeader).toContainText("Selected View");
    await expect(rowHeader).toContainText(/\d+ records/);
    await expect(firstItem).toHaveClass(/list-page-record-row/);
    await expect(firstItem.locator(".list-page-record-row-title")).toHaveText("Title Field");
    await expect(firstItem.locator(".list-page-record-row-subtitle")).toHaveText("Subtitle Field");
    await expect(firstItem.locator(".list-page-record-row-meta")).toHaveText("Meta Field");

    const rowGeometry = await firstItem.evaluate((item) => {
      const row = item.getBoundingClientRect();
      const accent = item.querySelector(".list-page-record-row-accent")?.getBoundingClientRect();
      const copy = item.querySelector(".list-page-record-row-copy")?.getBoundingClientRect();
      const meta = item.querySelector(".list-page-record-row-meta")?.getBoundingClientRect();

      return {
        rowHeight: row.height,
        accentContained: Boolean(accent && accent.left >= row.left && accent.right <= row.right),
        copyBeforeMeta: Boolean(copy && meta && copy.right <= meta.left),
        metaContained: Boolean(meta && meta.right <= row.right),
      };
    });

    expect(rowGeometry.rowHeight).toBeGreaterThanOrEqual(70);
    expect(rowGeometry.accentContained).toBe(true);
    expect(rowGeometry.copyBeforeMeta).toBe(true);
    expect(rowGeometry.metaContained).toBe(true);

    await page.locator("#accessibility-button").click();
    await page.locator("[data-list-item-variant-option='card']").click();
    await expect(itemsContainer).toHaveAttribute("data-list-item-variant", "card");
    await expect(rowHeader).toBeHidden();
    await expect(firstItem).toHaveClass(/list-page-card/);
    await expect(page).not.toHaveURL(/listItemVariant=row/);

    await page.goto("/design-system/templates/list-page?listItemVariant=row&theme=dark&dir=rtl&zoom=100");
    const stressedRow = page.locator("[data-selectable-list-card]").first();
    const stressedGeometry = await stressedRow.evaluate((item) => {
      const row = item.getBoundingClientRect();
      const title = item.querySelector(".list-page-record-row-title")?.getBoundingClientRect();
      const subtitle = item.querySelector(".list-page-record-row-subtitle")?.getBoundingClientRect();
      const meta = item.querySelector(".list-page-record-row-meta")?.getBoundingClientRect();

      return {
        rowContainedHorizontally: row.left >= -1 && row.right <= window.innerWidth + 1,
        titleInside: Boolean(title && title.left >= row.left && title.right <= row.right),
        subtitleInside: Boolean(subtitle && subtitle.left >= row.left && subtitle.right <= row.right),
        metaInside: Boolean(meta && meta.left >= row.left && meta.right <= row.right),
      };
    });

    expect(stressedGeometry.rowContainedHorizontally).toBe(true);
    expect(stressedGeometry.titleInside).toBe(true);
    expect(stressedGeometry.subtitleInside).toBe(true);
    expect(stressedGeometry.metaInside).toBe(true);
  });

  test("can use an indexed detail drawer variant to switch record aspects", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    await expect(page.locator("[data-selectable-list-detail-index-layout]")).toHaveCount(0);
    await page.locator("#accessibility-button").click();
    await expect(page.locator("[data-drawer-variant-option='standard']")).toHaveClass(/active/);
    await page.locator("[data-drawer-variant-option='indexed']").click();
    await page.waitForURL(/drawerVariant=indexed/);
    await page.locator("#accessibility-button").click();
    await expect(page.locator("[data-drawer-variant-option='indexed']")).toHaveClass(/active/);

    await page.locator("[data-selectable-list-card]").first().click();

    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const indexLayout = page.locator("[data-selectable-list-detail-index-layout]");
    const detailsTab = page.locator("[data-selectable-list-detail-aspect-option='details']");
    const pictureTab = page.locator("[data-selectable-list-detail-aspect-option='picture']");
    const descriptionTab = page.locator("[data-selectable-list-detail-aspect-option='description']");
    const detailsPanel = page.locator("[data-selectable-list-detail-aspect='details']");
    const picturePanel = page.locator("[data-selectable-list-detail-aspect='picture']");
    const descriptionPanel = page.locator("[data-selectable-list-detail-aspect='description']");

    await expect(detailPanel).toBeVisible();
    await expect(indexLayout).toBeVisible();
    await expect(detailsTab).toHaveClass(/form-drawer-select-option/);
    await expect(detailsTab.locator(".form-drawer-select-option-toggle")).toHaveCount(0);
    await expect(detailsTab.locator(".form-drawer-select-option-copy")).toHaveCount(0);
    await expect(detailsTab.locator(".list-page-detail-index-label")).toHaveText("Details");
    await expect(detailsTab).toHaveAttribute("aria-selected", "true");
    await expect(detailsPanel).toBeVisible();
    await expect(picturePanel).toBeHidden();
    await expect(descriptionPanel).toBeHidden();
    await expect(detailsPanel.locator("[data-selectable-list-detail-field='tags']")).toContainText("Tag Field 1");

    await pictureTab.click();
    await expect(pictureTab).toHaveAttribute("aria-selected", "true");
    await expect(picturePanel).toBeVisible();
    await expect(picturePanel.locator("[data-selectable-list-detail-field='picture-initials']")).toHaveText("TF");
    await expect(detailsPanel).toBeHidden();

    await descriptionTab.click();
    await expect(descriptionTab).toHaveAttribute("aria-selected", "true");
    await expect(descriptionPanel).toBeVisible();
    await expect(descriptionPanel.locator("[data-selectable-list-detail-field='description']")).toContainText("Long Description Field.");

    const containment = await detailPanel.evaluate((panel) => {
      const tabs = panel.querySelector("[data-selectable-list-detail-index]");
      const activePanel = panel.querySelector("[data-selectable-list-detail-aspect='description']");
      if (!(panel instanceof HTMLElement) || !(tabs instanceof HTMLElement) || !(activePanel instanceof HTMLElement)) {
        return null;
      }

      const panelBox = panel.getBoundingClientRect();
      const tabsBox = tabs.getBoundingClientRect();
      const activeBox = activePanel.getBoundingClientRect();

      return {
        tabsInside: tabsBox.left >= panelBox.left && tabsBox.right <= panelBox.right,
        activeInside: activeBox.left >= panelBox.left && activeBox.right <= panelBox.right,
        bodyCanScroll: (() => {
          const body = panel.querySelector(".list-page-detail-body");
          return body instanceof HTMLElement && body.scrollHeight >= body.clientHeight;
        })(),
      };
    });

    expect(containment).not.toBeNull();
    expect(containment?.tabsInside).toBe(true);
    expect(containment?.activeInside).toBe(true);
    expect(containment?.bodyCanScroll).toBe(true);

    await page.goto("/design-system/templates/list-page?drawerVariant=indexed&theme=dark&dir=rtl&zoom=100");
    await page.locator("[data-selectable-list-card]").first().click();
    await page.locator("[data-selectable-list-detail-aspect-option='description']").click();

    const stressedContainment = await page.locator("[data-selectable-list-detail-panel]").evaluate((panel) => {
      const index = panel.querySelector("[data-selectable-list-detail-index]");
      const activePanel = panel.querySelector("[data-selectable-list-detail-aspect='description']");
      if (!(panel instanceof HTMLElement) || !(index instanceof HTMLElement) || !(activePanel instanceof HTMLElement)) {
        return null;
      }

      const panelBox = panel.getBoundingClientRect();
      const indexBox = index.getBoundingClientRect();
      const activeBox = activePanel.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);

      return {
        direction: panelStyle.direction,
        background: panelStyle.backgroundColor,
        indexInside: indexBox.left >= panelBox.left && indexBox.right <= panelBox.right,
        activeInside: activeBox.left >= panelBox.left && activeBox.right <= panelBox.right,
        panelHasSize: panelBox.width > 0 && panelBox.height > 0,
      };
    });

    expect(stressedContainment).not.toBeNull();
    expect(stressedContainment?.direction).toBe("rtl");
    expect(stressedContainment?.background).not.toBe("rgba(0, 0, 0, 0)");
    expect(stressedContainment?.indexInside).toBe(true);
    expect(stressedContainment?.activeInside).toBe(true);
    expect(stressedContainment?.panelHasSize).toBe(true);
  });

  test("reorders list records with drag-and-drop and keyboard movement", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listItemVariant=row");

    const items = page.locator("[data-selectable-list-card]");
    const firstItem = items.first();
    const thirdItem = items.nth(2);
    const thirdBox = await thirdItem.boundingBox();

    expect(thirdBox).not.toBeNull();
    await expect(firstItem).toHaveAttribute("draggable", "true");

    const dragAffordance = await page.evaluate(() => {
      const records = Array.from(document.querySelectorAll("[data-selectable-list-card]"));
      const source = records[0];
      const target = records[2];
      if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        return null;
      }

      const transfer = new DataTransfer();
      source.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      const targetBounds = target.getBoundingClientRect();
      target.dispatchEvent(new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientY: targetBounds.bottom - 2,
        dataTransfer: transfer,
      }));
      const marker = document.querySelector("[data-drag-drop-marker]");
      const sourceStyle = getComputedStyle(source);
      const markerBounds = marker instanceof HTMLElement ? marker.getBoundingClientRect() : null;
      const sourceBounds = source.getBoundingClientRect();
      const sourceOpacity = Number(sourceStyle.opacity);
      const sourceOutlined = sourceStyle.outlineStyle !== "none";
      source.dispatchEvent(new DragEvent("dragend", { bubbles: true, cancelable: true, dataTransfer: transfer }));

      return {
        markerVisible: markerBounds !== null && markerBounds.height > 0,
        markerAfterSource: markerBounds !== null && markerBounds.top > sourceBounds.bottom,
        sourceOpacity,
        sourceOutlined,
      };
    });

    expect(dragAffordance).not.toBeNull();
    expect(dragAffordance?.markerVisible).toBe(true);
    expect(dragAffordance?.markerAfterSource).toBe(true);
    expect(dragAffordance?.sourceOpacity).toBeGreaterThanOrEqual(0.85);
    expect(dragAffordance?.sourceOutlined).toBe(true);

    await firstItem.dragTo(thirdItem, {
      targetPosition: { x: 24, y: Math.max(1, (thirdBox?.height ?? 80) - 4) },
    });

    await expect(page.locator("[data-selectable-list-announcement]")).toContainText("Title Field moved to position 3.");
    await expect(items.nth(2).locator(".list-page-record-row-title")).toHaveText("Title Field");

    await items.nth(2).focus();
    await page.keyboard.press("Alt+ArrowUp");

    await expect(page.locator("[data-selectable-list-announcement]")).toContainText("Title Field moved to position 2.");
    await expect(items.nth(1).locator(".list-page-record-row-title")).toHaveText("Title Field");
  });

  test("shows a governed loading placeholder before initial list hydration when requested", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listLoading=initial");

    const loadingGroup = page.locator("[data-selectable-list-loading]");
    const itemsContainer = page.locator("[data-selectable-list-items]");

    await expect(loadingGroup).toBeVisible();
    await expect(loadingGroup).toContainText("Loading list items...");
    await expect(itemsContainer).toBeHidden();

    await expect(itemsContainer).toBeVisible();
    await expect(loadingGroup).toBeHidden();
  });

  test("shows an in-region initial load error with a retry path that restores the list", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listLoadError=initial");

    const errorState = page.locator("[data-selectable-list-initial-error-state]");
    const retry = page.locator("[data-selectable-list-initial-retry]");
    const itemsContainer = page.locator("[data-selectable-list-items]");
    const announcement = page.locator("[data-selectable-list-announcement]");

    await expect(errorState).toBeVisible();
    await expect(itemsContainer).toBeHidden();
    await expect(announcement).toHaveText("List items could not load.");

    await retry.click();

    await expect(errorState).toBeHidden();
    await expect(itemsContainer).toBeVisible();
  });

  test("shows a governed empty state with a neutral recovery action", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listState=empty");

    const emptyState = page.locator("[data-selectable-list-empty-state]");
    const itemsContainer = page.locator("[data-selectable-list-items]");
    const recoveryButton = page.locator("[data-selectable-list-empty-reset]");

    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText("No placeholder records yet");
    await expect(recoveryButton).toBeVisible();
    await expect(itemsContainer).toBeHidden();

    await recoveryButton.click();

    await expect(emptyState).toBeHidden();
    await expect(itemsContainer).toBeVisible();
  });

  test("shows a governed no-results state for the search query and clears back to the full list", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const searchInput = page.locator("#design-system-search");
    const noResultsState = page.locator("[data-selectable-list-no-results-state]");
    const itemsContainer = page.locator("[data-selectable-list-items]");
    const clearSearch = page.locator("[data-selectable-list-clear-search]");
    const announcement = page.locator("[data-selectable-list-announcement]");

    await searchInput.fill("no-results");
    await searchInput.press("Enter");

    await page.waitForURL("**/design-system/templates/list-page?q=no-results");
    await expect(noResultsState).toBeVisible();
    await expect(noResultsState).toContainText('"no-results"');
    await expect(itemsContainer).toBeHidden();
    await expect(announcement).toHaveText("No results found for no-results.");

    await clearSearch.click();

    await expect(noResultsState).toBeHidden();
    await expect(searchInput).toHaveValue("");
    await expect(itemsContainer).toBeVisible();
  });

  test("opens a create form variation inside the list drawer and saves a placeholder record", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?drawerMode=form&formIntent=create");

    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const formDrawer = page.locator("[data-selectable-list-form]");
    const titleInput = page.locator("[data-selectable-list-form-title]");

    await expect(detailPanel).toBeVisible();
    await expect(detailPanel).toHaveAttribute("data-list-drawer-shell-source", "list-drawer-shell");
    await expect(formDrawer).toBeVisible();
    await expect(formDrawer).toHaveAttribute("data-drawer-form", "");
    await expect(page.locator("#list-page-detail-title")).toHaveText("Create placeholder record");
    await expect(titleInput).toBeFocused();
    await expect(page.locator("[data-selectable-list-form-elements]")).toBeVisible();
    await expect(formDrawer.locator(".form-select-trigger")).toHaveText(/Ready for review/);
    await expect(formDrawer.locator(".form-date-trigger")).toHaveText(/May 4, 2026/);
    await expect(formDrawer.locator(".form-time-trigger")).toHaveText(/09:30/);
    await formDrawer.locator(".form-date-trigger").click();
    await expect(formDrawer.locator("[data-form-date-panel]")).toBeVisible();
    await formDrawer.locator(".form-time-trigger").click();
    await expect(formDrawer.locator("[data-form-date-panel]")).toBeHidden();
    await expect(formDrawer.locator("[data-form-time-panel]")).toBeVisible();
    await formDrawer.locator(".form-drawer-select-trigger").click();
    await expect(formDrawer.locator("[data-form-drawer-select-panel]")).toBeVisible();
    await expect(formDrawer.locator("[data-form-drawer-select-search]")).toBeFocused();
    await formDrawer.locator("[data-form-drawer-select-close]").click();
    await expect(formDrawer.locator("[data-form-drawer-select-panel]")).toBeHidden();
    await expect(formDrawer.locator('input[type="radio"]')).toHaveCount(2);
    await expect(formDrawer.locator('input[type="checkbox"]')).toHaveCount(3);
    await expect(formDrawer.locator(".form-upload-dropzone")).toBeVisible();

    await titleInput.fill("Created Placeholder Entry");
    await page.locator("[data-selectable-list-form-subtitle]").fill("Created subtitle");
    await page.locator("[data-selectable-list-form-description]").fill("Created drawer body");
    await page.locator("[data-selectable-list-form-tags]").fill("Created, Placeholder");
    await page.locator("[data-selectable-list-form-save]").click();

    await expect(formDrawer).toBeHidden();
    await expect(page.locator("[data-selectable-list-view-body]")).toBeVisible();
    await expect(page.locator("[data-selectable-list-card]").first()).toContainText("Created Placeholder Entry");
    await expect(page.locator("#list-page-detail-title")).toHaveText("Created Placeholder Entry");
    await expect(page.locator("[data-selectable-list-announcement]")).toHaveText("Created placeholder record Created Placeholder Entry.");
  });

  test("edits the selected record through the form drawer variation without leaving list context", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const firstItem = page.locator("[data-selectable-list-card]").first();
    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const formDrawer = page.locator("[data-selectable-list-form]");

    await firstItem.click();
    await expect(detailPanel).toBeVisible();
    await page.locator("[data-selectable-list-edit]").click();

    await expect(formDrawer).toBeVisible();
    await expect(page.locator("#list-page-detail-title")).toHaveText("Edit placeholder record");
    await expect(page.locator("[data-selectable-list-form-title]")).toHaveValue("Title Field");

    await page.locator("[data-selectable-list-form-title]").fill("Edited Placeholder Entry");
    await page.locator("[data-selectable-list-form-description]").fill("Edited drawer body");
    await page.locator("[data-selectable-list-form-save]").click();

    await expect(formDrawer).toBeHidden();
    await expect(firstItem).toContainText("Edited Placeholder Entry");
    await expect(page.locator("#list-page-detail-title")).toHaveText("Edited Placeholder Entry");
    await expect(detailPanel).toBeVisible();
  });

  test("keeps edit-form overflow inside the list drawer instead of exposing a page scrollbar", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 760 },
    });

    await page.goto("/design-system/templates/list-page");

    const firstItem = page.locator("[data-selectable-list-card]").first();
    const formDrawer = page.locator("[data-selectable-list-form]");

    await firstItem.click();
    await page.locator("[data-selectable-list-edit]").click();
    await expect(formDrawer).toBeVisible();

    const editScrollState = await page.evaluate(() => {
      const form = document.querySelector("[data-selectable-list-form]");
      const documentStyle = getComputedStyle(document.documentElement);

      return {
        documentScrollLocked: document.documentElement.classList.contains("list-page-document-scroll-locked"),
        documentOverflowY: documentStyle.overflowY,
        viewportHasReservedScrollbar: document.documentElement.clientWidth < window.innerWidth,
        formHasInternalOverflow:
          form instanceof HTMLElement ? form.scrollHeight > form.clientHeight + 1 : false,
      };
    });

    expect(editScrollState.documentScrollLocked).toBe(true);
    expect(editScrollState.documentOverflowY).toBe("hidden");
    expect(editScrollState.viewportHasReservedScrollbar).toBe(false);
    expect(editScrollState.formHasInternalOverflow).toBe(true);

    await formDrawer.locator(".form-date-trigger").click();
    await expect(formDrawer.locator("[data-form-date-panel]")).toBeVisible();

    const pickerScrollState = await page.evaluate(() => {
      const panel = document.querySelector("[data-form-date-panel]");
      const panelRect = panel instanceof HTMLElement ? panel.getBoundingClientRect() : null;

      return {
        documentScrollLocked: document.documentElement.classList.contains("list-page-document-scroll-locked"),
        documentOverflowY: getComputedStyle(document.documentElement).overflowY,
        viewportHasReservedScrollbar: document.documentElement.clientWidth < window.innerWidth,
        pickerWithinViewport:
          panelRect !== null
          && panelRect.top >= 0
          && panelRect.left >= 0
          && panelRect.right <= window.innerWidth + 1,
      };
    });

    expect(pickerScrollState.documentScrollLocked).toBe(true);
    expect(pickerScrollState.documentOverflowY).toBe("hidden");
    expect(pickerScrollState.viewportHasReservedScrollbar).toBe(false);
    expect(pickerScrollState.pickerWithinViewport).toBe(true);

    await page.locator("#list-page-detail-close").click();
    await expect(page.locator("[data-selectable-list-detail-panel]")).toBeHidden();

    await expect.poll(async () => (
      page.evaluate(() => document.documentElement.classList.contains("list-page-document-scroll-locked"))
    )).toBe(false);

    await page.close();
  });

  test("closes the drawer and returns focus to search when filtering removes the active record", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const searchInput = page.locator("#design-system-search");
    const secondItem = page.locator("[data-selectable-list-card]").nth(1);
    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const announcement = page.locator("[data-selectable-list-announcement]");

    await secondItem.click();
    await expect(detailPanel).toBeVisible();

    await searchInput.fill("Title Field");
    await searchInput.press("Enter");

    await page.waitForURL("**/design-system/templates/list-page?q=Title+Field");
    await expect(detailPanel).toBeHidden();
    await expect(searchInput).toBeFocused();
    await expect(announcement).toHaveText("Closed details because the active record is not in results for Title Field.");
  });

  test("uses primary fallback and omits secondary fields in the governed missing-attributes preview", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listState=missing-attributes");

    const items = page.locator("[data-selectable-list-card]");
    const firstItem = items.first();
    const secondItem = items.nth(1);
    const thirdItem = items.nth(2);

    await expect(firstItem.locator(".list-page-card-title")).toHaveText("Untitled record");
    await expect(firstItem.locator(".list-page-card-subtitle")).toBeHidden();
    await expect(firstItem.locator(".list-page-card-tags")).toBeHidden();

    await secondItem.click();

    await expect(page.locator("#list-page-detail-title")).toHaveText("Placeholder Item Two");
    await expect(page.locator("#list-page-detail-subtitle")).toBeHidden();
    await expect(page.locator("#list-page-detail-meta")).toBeHidden();
    await expect(page.locator("#list-page-detail-tags")).toBeHidden();

    await thirdItem.click();

    await expect(thirdItem.locator(".list-page-card-description")).toBeHidden();
    await expect(page.locator("#list-page-detail-description")).toBeHidden();
  });

  test("truncates compact list fields with tooltip recovery while keeping detail identity and body wrapped", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 760 },
    });

    await page.goto("/design-system/templates/list-page?listState=long-attributes");

    const firstItem = page.locator("[data-selectable-list-card]").first();
    const cardTitle = firstItem.locator(".list-page-card-title");
    const firstTag = firstItem.locator(".list-page-tag").first();

    await firstItem.click();

    await expect(cardTitle).toHaveAttribute(
      "data-tooltip",
      /intentionally extended title that should truncate cleanly in the list card/,
    );
    await expect(firstTag).toHaveAttribute(
      "data-tooltip",
      /Extremely long governed tag label for tooltip recovery/,
    );

    await expect(page.locator("#list-page-detail-meta")).toHaveAttribute(
      "data-tooltip",
      /Extremely long metadata label for the detail header/,
    );

    const detailWrapState = await page.evaluate(() => {
      const detailTitle = document.getElementById("list-page-detail-title");
      const detailDescription = document.getElementById("list-page-detail-description");

      if (!(detailTitle instanceof HTMLElement) || !(detailDescription instanceof HTMLElement)) {
        return null;
      }

      const titleStyle = getComputedStyle(detailTitle);
      const descriptionStyle = getComputedStyle(detailDescription);

      return {
        titleWhiteSpace: titleStyle.whiteSpace,
        titleTextOverflow: titleStyle.textOverflow,
        descriptionWhiteSpace: descriptionStyle.whiteSpace,
        descriptionTextOverflow: descriptionStyle.textOverflow,
        titleTooltip: detailTitle.dataset.tooltip ?? null,
      };
    });

    expect(detailWrapState).not.toBeNull();
    expect(detailWrapState?.titleWhiteSpace).not.toBe("nowrap");
    expect(detailWrapState?.descriptionWhiteSpace).not.toBe("nowrap");
    expect(detailWrapState?.titleTextOverflow).not.toBe("ellipsis");
    expect(detailWrapState?.descriptionTextOverflow).not.toBe("ellipsis");
    expect(detailWrapState?.titleTooltip).toBeNull();

    await page.close();
  });

  test("keeps the split layout readable under magnification and long-content pressure", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 760 },
    });

    await page.goto("/design-system/templates/list-page?listState=long-attributes&zoom=100");
    await page.locator("[data-selectable-list-card]").first().click();

    const magnifiedState = await page.evaluate(() => {
      const root = document.documentElement;
      const listColumn = document.querySelector("[data-selectable-list-column]");
      const detailPanel = document.querySelector("[data-selectable-list-detail-panel]");
      const detailBody = document.querySelector(".list-page-detail-body");
      const detailFooter = document.querySelector(".list-page-detail-footer");
      const closeButton = document.getElementById("list-page-detail-close");
      const prevButton = document.getElementById("list-page-detail-prev");
      const nextButton = document.getElementById("list-page-detail-next");
      const rect = (node: Element | null) =>
        node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        uiScale: root.style.getPropertyValue("--ui-scale"),
        listColumn: rect(listColumn),
        detailPanel: rect(detailPanel),
        detailBody: rect(detailBody),
        detailFooter: rect(detailFooter),
        closeButton: rect(closeButton),
        prevButton: rect(prevButton),
        nextButton: rect(nextButton),
        detailPanelOverflowY:
          detailPanel instanceof HTMLElement ? getComputedStyle(detailPanel).overflowY : null,
        detailPanelClientHeight:
          detailPanel instanceof HTMLElement ? detailPanel.clientHeight : null,
        detailPanelScrollHeight:
          detailPanel instanceof HTMLElement ? detailPanel.scrollHeight : null,
        detailBodyOverflowY:
          detailBody instanceof HTMLElement ? getComputedStyle(detailBody).overflowY : null,
      };
    });

    expect(magnifiedState.uiScale).toBe("1.5");
    expect(magnifiedState.listColumn).not.toBeNull();
    expect(magnifiedState.detailPanel).not.toBeNull();
    expect(magnifiedState.detailBody).not.toBeNull();
    expect(magnifiedState.detailFooter).not.toBeNull();
    expect(magnifiedState.closeButton).not.toBeNull();
    expect(magnifiedState.prevButton).not.toBeNull();
    expect(magnifiedState.nextButton).not.toBeNull();
    expect(["auto", "scroll"]).toContain(magnifiedState.detailPanelOverflowY);
    expect(["auto", "scroll"]).toContain(magnifiedState.detailBodyOverflowY);

    if (
      !magnifiedState.listColumn
      || !magnifiedState.detailPanel
      || !magnifiedState.detailBody
      || !magnifiedState.detailFooter
      || !magnifiedState.closeButton
      || !magnifiedState.prevButton
      || !magnifiedState.nextButton
    ) {
      await page.close();
      return;
    }

    expect(magnifiedState.listColumn.width).toBeGreaterThan(240);
    expect(magnifiedState.detailPanel.width).toBeGreaterThan(240);
    expect(magnifiedState.detailBody.height).toBeGreaterThan(120);
    expect(magnifiedState.closeButton.right).toBeLessThanOrEqual(magnifiedState.detailPanel.right + 1);
    expect(magnifiedState.closeButton.top).toBeGreaterThanOrEqual(magnifiedState.detailPanel.top - 1);
    expect(magnifiedState.detailPanelScrollHeight).toBeGreaterThan(magnifiedState.detailPanelClientHeight ?? 0);

    await page.locator("[data-selectable-list-detail-panel]").evaluate((node) => {
      if (node instanceof HTMLElement) {
        node.scrollTop = node.scrollHeight;
      }
    });

    await expect(page.locator(".list-page-detail-footer")).toBeInViewport();

    await page.close();
  });

  test("moves focus into the detail drawer on open and returns it to the originating card on close", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const firstItem = page.locator("[data-selectable-list-card]").first();
    const announcement = page.locator("[data-selectable-list-announcement]");

    await firstItem.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("#list-page-detail-title")).toBeFocused();
    await expect(announcement).toHaveText("Opened details for Title Field.");

    await page.keyboard.press("Escape");

    await expect(firstItem).toBeFocused();
    await expect(page.locator("[data-selectable-list-detail-panel]")).toBeHidden();
  });

  test("traps tab focus inside the mobile full-sheet detail drawer", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 560, height: 900 },
    });

    await page.goto("/design-system/templates/list-page");
    await page.locator("[data-selectable-list-card]").first().click();

    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const editButton = page.locator(".list-page-detail-action-button").first();
    const nextButton = page.locator("#list-page-detail-next");

    await expect(detailPanel).toHaveAttribute("role", "dialog");
    await expect(detailPanel).toHaveAttribute("aria-modal", "true");
    await expect(page.locator("#list-page-detail-title")).toBeFocused();

    await nextButton.focus();
    await page.keyboard.press("Tab");
    await expect(editButton).toBeFocused();

    await editButton.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(nextButton).toBeFocused();

    await page.close();
  });

  test("keeps the mobile drawer close affordance top-right while header actions sit below the copy block", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 560, height: 900 },
    });

    await page.goto("/design-system/templates/list-page");
    await page.locator("[data-selectable-list-card]").first().click();

    const mobileHeaderState = await page.evaluate(() => {
      const copy = document.querySelector(".list-page-detail-copy");
      const edit = document.querySelector(".list-page-detail-action-row > :nth-child(1)");
      const share = document.querySelector(".list-page-detail-action-row > :nth-child(2)");
      const close = document.getElementById("list-page-detail-close");

      const rect = (node: Element | null) => node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        copyRect: rect(copy),
        editRect: rect(edit),
        shareRect: rect(share),
        closeRect: rect(close),
      };
    });

    expect(mobileHeaderState.copyRect).not.toBeNull();
    expect(mobileHeaderState.editRect).not.toBeNull();
    expect(mobileHeaderState.shareRect).not.toBeNull();
    expect(mobileHeaderState.closeRect).not.toBeNull();

    if (!mobileHeaderState.copyRect || !mobileHeaderState.editRect || !mobileHeaderState.shareRect || !mobileHeaderState.closeRect) {
      await page.close();
      return;
    }

    expect(mobileHeaderState.closeRect.top).toBeLessThanOrEqual(mobileHeaderState.copyRect.top + 8);
    expect(mobileHeaderState.closeRect.right).toBeGreaterThan(mobileHeaderState.shareRect.right);
    expect(mobileHeaderState.editRect.top).toBeGreaterThanOrEqual(mobileHeaderState.copyRect.bottom - 1);
    expect(mobileHeaderState.shareRect.top).toBeGreaterThanOrEqual(mobileHeaderState.copyRect.bottom - 1);

    await page.close();
  });

  test("mirrors the desktop master-detail layout and card posture natively in RTL", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?dir=rtl");

    const firstItem = page.locator("[data-selectable-list-card]").first();
    await firstItem.click();

    const rtlState = await page.evaluate(() => {
      const listColumn = document.querySelector("[data-selectable-list-column]");
      const detailPanel = document.querySelector("[data-selectable-list-detail-panel]");
      const cardButton = document.querySelector("[data-selectable-list-card]");
      const cardTitle = document.querySelector(".list-page-card-title");
      const rect = (node: Element | null) =>
        node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        documentDir: document.documentElement.getAttribute("dir"),
        listColumn: rect(listColumn),
        detailPanel: rect(detailPanel),
        cardButtonTextAlign:
          cardButton instanceof HTMLElement ? getComputedStyle(cardButton).textAlign : null,
        cardTitleTextAlign:
          cardTitle instanceof HTMLElement ? getComputedStyle(cardTitle).textAlign : null,
      };
    });

    expect(rtlState.documentDir).toBe("rtl");
    expect(rtlState.listColumn).not.toBeNull();
    expect(rtlState.detailPanel).not.toBeNull();
    expect(rtlState.cardButtonTextAlign).toBe("start");
    expect(rtlState.cardTitleTextAlign).toBe("start");

    if (!rtlState.listColumn || !rtlState.detailPanel) {
      return;
    }

    expect(rtlState.detailPanel.left).toBeLessThan(rtlState.listColumn.left);
  });

  test("opens a split detail drawer on item click and closes it with the drawer close button", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const splitLayout = page.locator("[data-selectable-list-layout]");
    const firstItem = page.locator("[data-selectable-list-card]").first();
    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const detailClose = page.locator("#list-page-detail-close");

    await expect(detailPanel).toBeHidden();
    await expect(splitLayout).not.toHaveClass(/detail-open/);

    await firstItem.click();

    await expect(detailPanel).toBeVisible();
    await expect(detailPanel).toHaveAttribute("aria-hidden", "false");
    await expect(splitLayout).toHaveClass(/detail-open/);
    await expect(firstItem).toHaveAttribute("aria-pressed", "true");

    await detailClose.click();

    await expect(detailPanel).toBeHidden();
    await expect(detailPanel).toHaveAttribute("aria-hidden", "true");
    await expect(splitLayout).not.toHaveClass(/detail-open/);
    await expect(firstItem).toHaveAttribute("aria-pressed", "false");
  });

  test("mirrors drawer header actions and footer navigation order coherently in RTL", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?dir=rtl");

    await page.locator("[data-selectable-list-card]").first().click();

    const rtlControlState = await page.evaluate(() => {
      const actionButtons = Array.from(document.querySelectorAll(".list-page-detail-action-row button"));
      const prev = document.getElementById("list-page-detail-prev");
      const next = document.getElementById("list-page-detail-next");
      const copy = document.querySelector(".list-page-detail-copy");
      const controls = document.querySelector(".list-page-detail-controls");
      const rect = (node: Element | null) =>
        node instanceof HTMLElement ? node.getBoundingClientRect() : null;

      return {
        documentDir: document.documentElement.getAttribute("dir"),
        actionOrder: actionButtons.map((button) => ({
          label: button.textContent?.trim() ?? "",
          rect: rect(button),
        })),
        prev: rect(prev),
        next: rect(next),
        copy: rect(copy),
        controls: rect(controls),
      };
    });

    expect(rtlControlState.documentDir).toBe("rtl");
    expect(rtlControlState.actionOrder).toHaveLength(3);
    expect(rtlControlState.copy).not.toBeNull();
    expect(rtlControlState.controls).not.toBeNull();
    expect(rtlControlState.prev).not.toBeNull();
    expect(rtlControlState.next).not.toBeNull();

    const [edit, share, close] = rtlControlState.actionOrder;

    expect(edit.label).toBe("Edit");
    expect(share.label).toBe("Share");
    expect(close.label).toBe("×");

    if (
      !edit.rect
      || !share.rect
      || !close.rect
      || !rtlControlState.copy
      || !rtlControlState.controls
      || !rtlControlState.prev
      || !rtlControlState.next
    ) {
      return;
    }

    expect(rtlControlState.controls.left).toBeLessThan(rtlControlState.copy.left);
    expect(edit.rect.left).toBeGreaterThan(share.rect.left);
    expect(share.rect.left).toBeGreaterThan(close.rect.left);
    expect(rtlControlState.prev.left).toBeGreaterThan(rtlControlState.next.left);
  });

  test("lets the drawer navigate to previous and next list items", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const items = page.locator("[data-selectable-list-card]");
    const detailTitle = page.locator("#list-page-detail-title");
    const prevButton = page.locator("#list-page-detail-prev");
    const nextButton = page.locator("#list-page-detail-next");

    await items.nth(1).click();

    await expect(detailTitle).toHaveText("Placeholder Item Two");
    await expect(prevButton).toBeEnabled();
    await expect(nextButton).toBeEnabled();

    await nextButton.click();
    await expect(detailTitle).toHaveText("Placeholder Item Three");

    await prevButton.click();
    await expect(detailTitle).toHaveText("Placeholder Item Two");

    await items.first().click();
    await expect(prevButton).toBeDisabled();
  });

  test("uses next to load more items at the boundary", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 620 },
    });

    await page.goto("/design-system/templates/list-page");

    const items = page.locator("[data-selectable-list-card]");
    const nextButton = page.locator("#list-page-detail-next");
    const nextAnchor = page.locator("#list-page-detail-next-anchor");
    const detailTitle = page.locator("#list-page-detail-title");
    const announcement = page.locator("[data-selectable-list-announcement]");
    const initialCount = await items.count();

    await items.nth(initialCount - 1).click();
    await nextButton.click();

    await expect(page.locator("[data-selectable-list-loading]")).toContainText("Loading more items...");
    await expect(items).toHaveCount(initialCount + 6);
    await expect(announcement).toHaveText("Loaded 6 more list items.");
    await expect(detailTitle).toHaveText("Placeholder Item Four");
    await expect(nextButton).toBeEnabled();

    await nextButton.click();
    await expect(detailTitle).toHaveText(`Placeholder Item ${initialCount + 1}`);

    await page.close();
  });

  test("keeps loaded items visible and offers inline retry when append loading fails", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 620 },
    });

    await page.goto("/design-system/templates/list-page?listLoadError=append");

    const itemCards = page.locator("[data-selectable-list-card]");
    const appendError = page.locator("[data-selectable-list-append-error]");
    const appendRetry = page.locator("[data-selectable-list-append-retry]");
    const announcement = page.locator("[data-selectable-list-announcement]");
    const nextButton = page.locator("#list-page-detail-next");
    const initialCount = await itemCards.count();

    await itemCards.nth(initialCount - 1).click();
    await nextButton.click();

    await expect(appendError).toBeVisible();
    await expect(itemCards).toHaveCount(initialCount);
    await expect(announcement).toHaveText("Could not load more list items.");

    await appendRetry.click();

    await expect(appendError).toBeHidden();
    await expect(itemCards).toHaveCount(initialCount + 6);

    await page.close();
  });

  test("uses the lazy-load status link when no scroll affordance exists", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const listColumn = page.locator("[data-selectable-list-column]");
    const itemCards = page.locator("[data-selectable-list-card]");
    const statusAction = page.locator("[data-selectable-list-status-action]");
    const announcement = page.locator("[data-selectable-list-announcement]");

    await expect(statusAction).toHaveText("Scroll to load more placeholder items.");
    await expect(listColumn).not.toHaveAttribute("aria-busy", "true");

    const initialCount = await itemCards.count();

    await listColumn.evaluate((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      node.style.height = `${node.scrollHeight + 400}px`;
      node.style.maxHeight = "none";
      window.dispatchEvent(new Event("resize"));
    });

    await page.waitForTimeout(250);
    await expect(statusAction).toBeVisible();
    await expect(statusAction).toBeEnabled();
    await page.waitForTimeout(400);
    await expect(statusAction).toBeVisible();
    await expect(statusAction).toBeEnabled();

    await statusAction.click();

    await expect(itemCards).toHaveCount(initialCount + 6);
    await expect(announcement).toHaveText("Loaded 6 more list items.");
  });

  test("keeps the lazy-load status link usable with the side drawer open", async ({ page }) => {
    await page.goto("/design-system/templates/list-page");

    const listColumn = page.locator("[data-selectable-list-column]");
    const itemCards = page.locator("[data-selectable-list-card]");
    const firstItem = itemCards.first();
    const statusAction = page.locator("[data-selectable-list-status-action]");
    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const announcement = page.locator("[data-selectable-list-announcement]");

    const initialCount = await itemCards.count();

    await firstItem.click();
    await expect(detailPanel).toBeVisible();

    await listColumn.evaluate((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      node.style.height = `${node.scrollHeight + 400}px`;
      node.style.maxHeight = "none";
      window.dispatchEvent(new Event("resize"));
    });

    await page.waitForTimeout(250);
    await expect(statusAction).toBeVisible();
    await expect(statusAction).toBeEnabled();
    await page.waitForTimeout(400);
    await expect(statusAction).toBeVisible();
    await expect(statusAction).toBeEnabled();

    await statusAction.click();

    await expect(itemCards).toHaveCount(initialCount + 6);
    await expect(detailPanel).toBeVisible();
    await expect(announcement).toHaveText("Loaded 6 more list items.");
  });

  test("keeps the drawer open and offers local retry when detail content fails", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?detailError=1");

    const firstItem = page.locator("[data-selectable-list-card]").first();
    const detailPanel = page.locator("[data-selectable-list-detail-panel]");
    const detailError = page.locator("[data-selectable-list-detail-error]");
    const detailRetry = page.locator("[data-selectable-list-detail-retry]");
    const detailDescription = page.locator("#list-page-detail-description");
    const announcement = page.locator("[data-selectable-list-announcement]");

    await firstItem.click();

    await expect(detailPanel).toBeVisible();
    await expect(detailError).toBeVisible();
    await expect(detailDescription).toBeHidden();
    await expect(announcement).toHaveText("Detail content could not load for Title Field.");

    await detailRetry.click();

    await expect(detailError).toBeHidden();
    await expect(detailDescription).toBeVisible();
    await expect(detailDescription).toContainText("Long Description Field.");
  });

  test("keeps desktop list and detail surfaces independently scrollable", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 620 },
    });

    await page.goto("/design-system/templates/list-page");

    const firstItem = page.locator("[data-selectable-list-card]").first();

    await firstItem.click();

    const scrollState = await page.evaluate(() => {
      const listColumn = document.querySelector("[data-selectable-list-column]");
      const detailBody = document.querySelector(".list-page-detail-body");

      if (!(listColumn instanceof HTMLElement) || !(detailBody instanceof HTMLElement)) {
        return null;
      }

      listColumn.scrollTop = 180;
      detailBody.scrollTop = 120;

      return {
        listOverflowY: getComputedStyle(listColumn).overflowY,
        detailOverflowY: getComputedStyle(detailBody).overflowY,
        listScrollTop: listColumn.scrollTop,
        detailScrollTop: detailBody.scrollTop,
        listClientHeight: listColumn.clientHeight,
        detailClientHeight: detailBody.clientHeight,
      };
    });

    expect(scrollState).not.toBeNull();
    expect(["auto", "scroll"]).toContain(scrollState?.listOverflowY);
    expect(["auto", "scroll"]).toContain(scrollState?.detailOverflowY);
    expect(scrollState?.listClientHeight).toBeGreaterThan(0);
    expect(scrollState?.detailClientHeight).toBeGreaterThan(0);
    expect(scrollState?.listScrollTop).toBeGreaterThan(0);
    expect(scrollState?.detailScrollTop).toBeGreaterThan(0);

    await page.close();
  });

  test("lazy-loads additional list items from browser scroll while the desktop list is closed", async ({ page }) => {
    await page.goto("/design-system/templates/list-page?listItemVariant=row");

    const listColumn = page.locator("[data-selectable-list-column]");
    const itemCards = page.locator("[data-selectable-list-card]");
    const initialCount = await itemCards.count();

    expect(initialCount).toBeGreaterThanOrEqual(4);

    const closedState = await listColumn.evaluate((node) => {
      if (!(node instanceof HTMLElement)) {
        return null;
      }

      return {
        overflowY: getComputedStyle(node).overflowY,
        clientHeight: node.clientHeight,
      };
    });

    expect(closedState).not.toBeNull();
    expect(closedState?.overflowY).toBe("visible");
    expect(closedState?.clientHeight).toBeGreaterThan(0);

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      window.dispatchEvent(new Event("scroll"));
    });

    await expect(page.locator("[data-selectable-list-loading]")).toContainText("Loading more items...");
    await expect(itemCards).toHaveCount(initialCount + 6);
    await expect(page.locator("[data-selectable-list-status]")).toContainText("More placeholder items loaded");

    const lazyLoadPlacement = await page.evaluate(() => {
      const visibleItems = Array.from(document.querySelectorAll("[data-selectable-list-card]"))
        .filter((item) => item instanceof HTMLElement && !item.classList.contains("hidden"));
      const lastItem = visibleItems[visibleItems.length - 1];
      const status = document.querySelector("[data-selectable-list-status]");

      if (!(lastItem instanceof HTMLElement) || !(status instanceof HTMLElement)) {
        return null;
      }

      const lastItemBounds = lastItem.getBoundingClientRect();
      const statusBounds = status.getBoundingClientRect();

      return {
        statusAfterLastItem: statusBounds.top >= lastItemBounds.bottom,
        lastItemText: lastItem.textContent ?? "",
        statusText: status.textContent ?? "",
      };
    });

    expect(lazyLoadPlacement).not.toBeNull();
    expect(lazyLoadPlacement?.statusAfterLastItem).toBe(true);
    expect(lazyLoadPlacement?.lastItemText).toContain("Placeholder Item");
    expect(lazyLoadPlacement?.statusText).toContain("More placeholder items loaded");
  });

  test("uses a mobile overlay drawer that stays beneath shell menus and the design drawer", async ({ browser }) => {
    const page = await browser.newPage({
      viewport: { width: 560, height: 900 },
    });

    await page.goto("/design-system/templates/list-page");
    await page.locator("[data-selectable-list-card]").first().click();

    const mobileState = await page.evaluate(() => {
      const panel = document.getElementById("list-page-detail-panel");
      const designDrawer = document.getElementById("accessibility-drawer");
      const topNav = document.querySelector(".top-nav");
      const subNav = document.querySelector(".sub-nav");
      const layout = document.getElementById("list-page-split-layout");

      if (
        !(panel instanceof HTMLElement)
        || !(designDrawer instanceof HTMLElement)
        || !(topNav instanceof HTMLElement)
        || !(subNav instanceof HTMLElement)
        || !(layout instanceof HTMLElement)
      ) {
        return null;
      }

      const panelStyle = getComputedStyle(panel);
      const drawerStyle = getComputedStyle(designDrawer);

      return {
        panelPosition: panelStyle.position,
        panelZIndex: panelStyle.zIndex,
        designDrawerZIndex: drawerStyle.zIndex,
        topNavZIndex: getComputedStyle(topNav).zIndex,
        subNavZIndex: getComputedStyle(subNav).zIndex,
        layoutColumns: getComputedStyle(layout).gridTemplateColumns,
      };
    });

    expect(mobileState).not.toBeNull();
    expect(mobileState?.panelPosition).toBe("fixed");
    expect(mobileState?.layoutColumns).not.toMatch(/  /);
    expect(Number(mobileState?.panelZIndex)).toBeLessThan(Number(mobileState?.designDrawerZIndex));
    expect(Number(mobileState?.panelZIndex)).toBeLessThan(Number(mobileState?.subNavZIndex));
    expect(Number(mobileState?.panelZIndex)).toBeLessThan(Number(mobileState?.topNavZIndex));

    await page.close();
  });
});
