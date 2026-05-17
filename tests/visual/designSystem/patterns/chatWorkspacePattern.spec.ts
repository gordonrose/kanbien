import { expect, test, type Page } from "@playwright/test";

const expectedEntityStatuses = {
  discovery: {
    "Product Discovery Package": ["Draft", "In Refinement", "Ready for Review", "Done"],
    "Chat Session": ["In Progress", "Paused", "Complete", "Archived"],
    Questions: ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
  },
  design: {
    "Architecture Questions": ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
    "Design Questions": ["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"],
  },
  delivery: {
    "Product Discovery Package": ["Draft", "In Refinement", "Ready for Review", "Done"],
    Epics: [
      "Draft",
      "Steering",
      "Blocked",
      "In Refinement",
      "Ready for Delivery",
      "In Delivery",
      "Ready for Review",
      "Ready for Deploy",
      "Deployed",
    ],
    Stories: ["Draft", "Blocked", "In Refinement", "Ready for Review", "Task Breakdown", "Ready for Delivery", "Ready for Deploy", "Deployed"],
    Tasks: ["Draft", "Blocked", "In Refinement", "Ready for Review", "Ready for Delivery", "Ready for Deploy", "Deployed"],
  },
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function gotoChatWorkspace(page: Page, url = "/design-system/patterns/chat-workspace") {
  await page.goto(url);
  await expect(page.locator("[data-chat-workspace-shell]")).toBeVisible();
}

async function expandWorkspace(page: Page, options: { dispatch?: boolean } = {}) {
  const shell = page.locator("[data-chat-workspace-shell]");
  if ((await shell.getAttribute("data-chat-workspace-expanded")) !== "true") {
    const toggle = page.locator("[data-chat-workspace-toggle]:visible").first();
    await toggle.scrollIntoViewIfNeeded();
    if (options.dispatch) {
      await toggle.dispatchEvent("click");
    } else {
      await toggle.click();
    }
  }
  await expect(shell).toHaveAttribute("data-chat-workspace-expanded", "true");
  await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "false");
  await page.waitForTimeout(240);
}

async function revealEntityTab(page: Page, name: string) {
  const workspace = page.locator("[data-chat-workspace-entity-workspace]");
  const tab = workspace.locator(".floating-tab-card").filter({ hasText: name }).first();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (await tab.count() > 0 && await tab.first().isVisible()) {
      return tab.first();
    }

    const next = workspace.locator(".floating-tab-scroll-button-right");
    if (!(await next.isVisible()) || await next.isDisabled()) {
      break;
    }

    await next.click({ trial: true }).catch(() => undefined);
    if (!(await next.isVisible()) || await next.isDisabled()) {
      break;
    }
    await next.click();
    await page.waitForTimeout(100);
  }

  await expect(tab).toBeVisible();
  return tab.first();
}

async function expectActiveEntityCategory(page: Page, name: string) {
  const trigger = page.locator("[data-chat-workspace-entity-selector-trigger]");
  if ((await page.locator("[data-chat-workspace-entity-workspace]").getAttribute("data-chat-workspace-entity-selector-open")) !== "true") {
    await trigger.click();
  }
  await expect(page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: new RegExp(`^${name}`) })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "false");
}

async function selectWorkspaceLayer(page: Page, layer: string) {
  await page.locator("[data-chat-workspace-layer-trigger]").click();
  await page.locator(`[data-chat-workspace-layer-option="${layer}"]`).click();
  await expect(page.locator("[data-chat-workspace-layer-trigger]")).toContainText(new RegExp(layer, "i"));
  await page.waitForTimeout(180);
}

async function auditEntityStatusPreview(page: Page) {
  for (const [layer, entities] of Object.entries(expectedEntityStatuses)) {
    await selectWorkspaceLayer(page, layer);
    const trigger = page.locator("[data-chat-workspace-entity-selector-trigger]");
    if ((await page.locator("[data-chat-workspace-entity-workspace]").getAttribute("data-chat-workspace-entity-selector-open")) !== "true") {
      await trigger.click();
    }

    for (const [entity, statuses] of Object.entries(entities)) {
      await page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: new RegExp(`^${escapeRegExp(entity)}`) }).click();
      const preview = await page.locator("[data-chat-workspace-entity-workspace] .floating-tab-card:not(.hidden)").evaluateAll((cards) =>
        cards
          .map((card) => ({
            label: card.getAttribute("data-tab-label") ?? "",
            count: Number(card.getAttribute("data-tab-count") ?? "0"),
          }))
          .filter((card) => card.label),
      );
      const labels = preview.map((card) => card.label);
      const duplicateLabels = labels.filter((label, index) => labels.indexOf(label) !== index);
      const statusTotal = preview.reduce((sum, card) => sum + card.count, 0);
      if ((await page.locator("[data-chat-workspace-entity-workspace]").getAttribute("data-chat-workspace-entity-selector-open")) !== "true") {
        await trigger.click();
      }
      const selectorCountText = await page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: new RegExp(`^${escapeRegExp(entity)}`) }).locator("small").textContent();
      const selectorCount = Number(selectorCountText?.match(/\d+/)?.[0] ?? Number.NaN);

      expect(labels, `${layer} / ${entity} status labels`).toEqual(statuses);
      expect(duplicateLabels, `${layer} / ${entity} duplicate labels`).toEqual([]);
      expect(selectorCount, `${layer} / ${entity} selector count`).toBe(statusTotal);
    }

    await page.keyboard.press("Escape");
  }
}

test.describe("design-system chat workspace pattern variant", () => {
  test("keeps expansion absent when the shell is not explicitly opted in", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await gotoChatWorkspace(page, "/design-system/patterns/chat-workspace?expansion=disabled");

    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expansion-enabled", "false");
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "false");
    await expect(page.locator("[data-chat-workspace-toggle]")).toHaveCount(0);
    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("[data-chat-workspace-secondary-list]")).toHaveCount(0);
    await expect(page.locator("[data-chat-workspace-chat-selector-toggle]")).toBeVisible();
  });

  test("renders right-docked chat by default and expands workspace beside it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await gotoChatWorkspace(page);

    await expect(page.getByRole("heading", { name: "Chat Workspace" })).toBeVisible();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "false");
    await expect(page.locator(".chat-workspace-chat-pane")).toBeVisible();
    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("[data-chat-workspace-joint-header]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-layer-toolbar]")).not.toBeVisible();
    await expect(page.locator(".chat-workspace-main-header")).toHaveCount(0);
    await expect(page.locator(".build-work-panel-demo-thread")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-history")).not.toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-action-nav")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode]")).toHaveCount(1);
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode=\"build\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-tools-toggle]")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-packet]")).toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-close]")).not.toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-header]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-index]")).toHaveCount(0);
    await expect(page.locator("[data-chat-workspace-secondary-list]")).toHaveCount(0);
    await expect(page.locator("[data-chat-workspace-chat-selector-toggle]")).toContainText("Chat");
    await expect(page.locator("[data-chat-workspace-chat-selector-toggle]")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("[data-chat-workspace-secondary-new-chat] [data-chat-workspace-new-conversation]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-new-chat] [data-chat-workspace-new-conversation]")).toHaveAttribute("data-tooltip", "Start new chat");
    await expect(page.locator("[data-chat-workspace-toggle]:visible")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("[data-chat-workspace-toggle]:visible")).toHaveClass(/icon-button/);
    await expect(page.locator("[data-chat-workspace-toggle]:visible")).toHaveAttribute("data-tooltip", "Expand workspace");

    const collapsedGeometry = await page.evaluate(() => {
      const shell = document.querySelector("[data-chat-workspace-shell]")?.getBoundingClientRect();
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      const header = document.querySelector("[data-chat-workspace-joint-header]")?.getBoundingClientRect();
      const secondary = document.querySelector("[data-chat-workspace-secondary-header]")?.getBoundingClientRect();
      const panel = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-panel")?.getBoundingClientRect();
      const rail = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav")?.getBoundingClientRect();
      const duration = shell
        ? getComputedStyle(document.querySelector("[data-chat-workspace-shell]") as Element)
            .transitionDuration.split(",")
            .map((value) => value.trim())
        : [];
      return shell && chat && workspace && header && secondary && panel && rail
        ? {
            shellTop: Math.round(shell.top),
            shellBottom: Math.round(shell.bottom),
            shellRight: Math.round(shell.right),
            chatRight: Math.round(chat.right),
            headerRight: Math.round(header.right),
            secondaryRight: Math.round(secondary.right),
            panelRight: Math.round(panel.right),
            railLeft: Math.round(rail.left),
            railTop: Math.round(rail.top),
            railBottom: Math.round(rail.bottom),
            shellWidth: Math.round(shell.width),
            workspaceWidth: Math.round(workspace.width),
            viewportRight: document.documentElement.clientWidth,
            duration,
          }
        : null;
    });

    expect(collapsedGeometry).not.toBeNull();
    expect(collapsedGeometry?.shellWidth ?? 0).toBeLessThanOrEqual(900);
    expect(collapsedGeometry?.chatRight ?? 0).toBeGreaterThan((collapsedGeometry?.viewportRight ?? 0) - 140);
    expect(collapsedGeometry?.headerRight ?? 0).toBeLessThanOrEqual(collapsedGeometry?.railLeft ?? 0);
    expect(collapsedGeometry?.secondaryRight ?? 0).toBeLessThanOrEqual(collapsedGeometry?.railLeft ?? 0);
    expect(collapsedGeometry?.panelRight ?? 0).toBeLessThanOrEqual(collapsedGeometry?.railLeft ?? 0);
    expect(Math.abs((collapsedGeometry?.railTop ?? 0) - (collapsedGeometry?.shellTop ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((collapsedGeometry?.railBottom ?? 0) - (collapsedGeometry?.shellBottom ?? 0))).toBeLessThanOrEqual(2);
    expect(collapsedGeometry?.duration).toContain("0.16s");

    await page.locator("[data-chat-workspace-chat-selector-toggle]").click();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-history-open", "true");
    await expect(page.locator("[data-chat-workspace-secondary-index]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-list]")).toHaveCount(0);
    await expect(page.locator("[data-chat-workspace-secondary-new-chat] [data-chat-workspace-new-conversation]")).toBeVisible();
    await expect(page.locator(".chat-workspace-history-dock .build-work-panel-demo-history")).toBeVisible();
    await expect(page.locator(".chat-workspace-history-dock [data-build-work-panel-new-conversation]")).not.toBeVisible();
    const collapsedIndexGeometry = await page.evaluate(() => {
      const history = document.querySelector(".chat-workspace-history-dock")?.getBoundingClientRect();
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const secondaryIndex = document.querySelector("[data-chat-workspace-secondary-index]")?.getBoundingClientRect();
      const newChat = document.querySelector("[data-chat-workspace-secondary-new-chat]")?.getBoundingClientRect();
      const secondary = document.querySelector("[data-chat-workspace-secondary-header]")?.getBoundingClientRect();
      const rail = document
        .querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav")
        ?.getBoundingClientRect();
      const secondaryStyle = document.querySelector("[data-chat-workspace-secondary-header]")
        ? getComputedStyle(document.querySelector("[data-chat-workspace-secondary-header]") as Element)
        : null;
      return history && chat && secondaryIndex && newChat && secondary && rail && secondaryStyle
        ? {
            historyLeft: Math.round(history.left),
            historyRight: Math.round(history.right),
            chatLeft: Math.round(chat.left),
            chatTop: Math.round(chat.top),
            secondaryTop: Math.round(secondary.top),
            secondaryIndexLeft: Math.round(secondaryIndex.left),
            secondaryIndexRight: Math.round(secondaryIndex.right),
            newChatLeft: Math.round(newChat.left),
            newChatRight: Math.round(newChat.right),
            secondaryRight: Math.round(secondary.right),
            secondaryBottom: Math.round(secondary.bottom),
            railLeft: Math.round(rail.left),
            secondaryBackground: secondaryStyle.backgroundColor,
          }
        : null;
    });
    expect(collapsedIndexGeometry).not.toBeNull();
    expect(collapsedIndexGeometry?.historyRight ?? 0).toBeLessThanOrEqual(collapsedIndexGeometry?.chatLeft ?? 0);
    expect(Math.abs((collapsedIndexGeometry?.secondaryIndexLeft ?? 0) - (collapsedIndexGeometry?.historyLeft ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((collapsedIndexGeometry?.secondaryIndexRight ?? 0) - (collapsedIndexGeometry?.historyRight ?? 0))).toBeLessThanOrEqual(2);
    expect(collapsedIndexGeometry?.newChatLeft ?? 0).toBeGreaterThan((collapsedIndexGeometry?.chatLeft ?? 0) + 160);
    expect(Math.abs((collapsedIndexGeometry?.newChatRight ?? 0) - (collapsedIndexGeometry?.secondaryRight ?? 0))).toBeLessThanOrEqual(2);
    expect(collapsedIndexGeometry?.secondaryRight ?? 0).toBeLessThanOrEqual(collapsedIndexGeometry?.railLeft ?? 0);
    expect(Math.abs((collapsedIndexGeometry?.chatTop ?? 0) - (collapsedIndexGeometry?.secondaryBottom ?? 0))).toBeLessThanOrEqual(2);
    expect(collapsedIndexGeometry?.secondaryBackground).not.toBe("rgba(0, 0, 0, 0)");
    await expect(page.locator("[data-chat-workspace-history-close]")).toHaveCount(0);
    await page.locator("[data-chat-workspace-chat-selector-toggle]").click();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-history-open", "false");

    await expandWorkspace(page);
    await expect(page.locator("[data-chat-workspace-toggle]:visible")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".chat-workspace-main")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-joint-header]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-joint-header]").getByRole("button", { name: "Collapse workspace" })).toBeVisible();
    await expect(page.locator("[data-chat-workspace-joint-header] [data-chat-workspace-toggle]")).toHaveClass(/icon-button/);
    await expect(page.locator("[data-chat-workspace-joint-header] [data-chat-workspace-toggle]")).toHaveAttribute("data-tooltip", "Collapse workspace");
    await expect(page.locator("[data-chat-workspace-joint-header] [data-chat-workspace-history-toggle]")).toHaveCount(0);
    await expect(page.locator("[data-chat-workspace-layer-trigger]")).toContainText("Discovery");
    await expect(page.locator("[data-chat-workspace-layer-toolbar]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool]")).toHaveCount(2);
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"conversations\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"questions\"]")).toHaveAttribute("data-tooltip", "Questions");
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-action-nav [data-build-work-panel-mode]")).toHaveCount(1);
    await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("tab", { name: "Queued" })).toHaveAttribute("aria-selected", "true");
    await expectActiveEntityCategory(page, "Questions");
    await expect(await revealEntityTab(page, "In Progress")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-category-toggle")).not.toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-index]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-new-chat] [data-chat-workspace-new-conversation]")).toBeVisible();
    const expandedHeaderAlignment = await page.evaluate(() => {
      const layer = document.querySelector("[data-chat-workspace-layer-trigger]")?.getBoundingClientRect();
      const chatSelector = document.querySelector("[data-chat-workspace-secondary-index] [data-chat-workspace-chat-selector-toggle]")?.getBoundingClientRect();
      return layer && chatSelector
        ? {
            layerLeft: Math.round(layer.left),
            chatSelectorLeft: Math.round(chatSelector.left),
          }
        : null;
    });
    expect(expandedHeaderAlignment).not.toBeNull();
    expect(Math.abs((expandedHeaderAlignment?.layerLeft ?? 0) - (expandedHeaderAlignment?.chatSelectorLeft ?? 0))).toBeLessThanOrEqual(2);
    const historyTooltipGeometry = await page.evaluate(() => {
      const row = document.querySelector(".chat-workspace-history-dock .build-work-panel-demo-history-row");
      row?.classList.add("is-tooltip-visible");
      const dock = document.querySelector(".chat-workspace-history-dock")?.getBoundingClientRect();
      const tooltip = document.querySelector(".chat-workspace-history-dock .build-work-panel-demo-history-item span")?.getBoundingClientRect();
      row?.classList.remove("is-tooltip-visible");
      return dock && tooltip
        ? {
            dockLeft: Math.round(dock.left),
            dockRight: Math.round(dock.right),
            tooltipLeft: Math.round(tooltip.left),
            tooltipRight: Math.round(tooltip.right),
          }
        : null;
    });
    expect(historyTooltipGeometry).not.toBeNull();
    expect(historyTooltipGeometry?.tooltipLeft ?? 0).toBeGreaterThanOrEqual(historyTooltipGeometry?.dockLeft ?? 0);
    expect(historyTooltipGeometry?.tooltipRight ?? 9999).toBeLessThanOrEqual(historyTooltipGeometry?.dockRight ?? 0);
    await expect(page.locator(".chat-workspace-history-dock .build-work-panel-demo-history-row").first()).toContainText("Discovery chat history");
    const workspaceOrder = await page.evaluate(() => {
      const listHeader = document.querySelector("[data-chat-workspace-secondary-list]")?.getBoundingClientRect();
      const workspace = document.querySelector("[data-chat-workspace-entity-workspace]");
      const tabHeader = workspace?.querySelector(".floating-tab-header")?.getBoundingClientRect();
      const panel = workspace?.querySelector(".floating-tab-list-panel")?.getBoundingClientRect();
      return listHeader && tabHeader && panel
        ? {
            listHeaderAboveTabs: listHeader.bottom <= tabHeader.top,
            tabsAboveList: tabHeader.bottom <= panel.top,
          }
        : null;
    });
    expect(workspaceOrder).not.toBeNull();
    expect(workspaceOrder?.listHeaderAboveTabs).toBe(true);
    expect(workspaceOrder?.tabsAboveList).toBe(true);
    await expect(page.locator("[data-chat-workspace-entity-selector-trigger]")).toHaveClass(/chat-workspace-entity-trigger-card/);
    await expect(page.locator("[data-chat-workspace-entity-trigger-icon]")).toBeVisible();
    await page.locator("[data-chat-workspace-entity-selector-trigger]").click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "true");
    await expect(page.locator("[data-chat-workspace-entity-selector-options]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option")).toHaveCount(3);
    await expect(page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option").first()).toContainText("13 entities");
    await expect(page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: /Chat Session/ })).toContainText("13 entities");
    const entitySelectorGeometry = await page.evaluate(() => {
      const workspace = document.querySelector("[data-chat-workspace-entity-workspace]")?.getBoundingClientRect();
      const selector = document.querySelector("[data-chat-workspace-entity-selector-options]")?.getBoundingClientRect();
      const trigger = document.querySelector("[data-chat-workspace-entity-selector-trigger]")?.getBoundingClientRect();
      const panel = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list-panel")?.getBoundingClientRect();
      return workspace && selector && trigger && panel
        ? {
            selectorLeft: Math.round(selector.left),
            selectorTop: Math.round(selector.top),
            triggerLeft: Math.round(trigger.left),
            triggerBottom: Math.round(trigger.bottom),
            workspaceRight: Math.round(workspace.right),
            panelTop: Math.round(panel.top),
          }
        : null;
    });
    expect(entitySelectorGeometry).not.toBeNull();
    expect(Math.abs((entitySelectorGeometry?.selectorLeft ?? 0) - (entitySelectorGeometry?.triggerLeft ?? 0))).toBeLessThanOrEqual(2);
    expect(entitySelectorGeometry?.selectorTop ?? 0).toBeGreaterThan(entitySelectorGeometry?.triggerBottom ?? 0);
    const entitySelectionBefore = await page.evaluate(() => {
      const panel = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list-panel")?.getBoundingClientRect();
      const list = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list")?.getBoundingClientRect();
      return panel && list
        ? {
            panelTop: Math.round(panel.top),
            listTop: Math.round(list.top),
          }
        : null;
    });
    await page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: /Product Discovery Package/ }).click();
    const entitySelectionFrames = [];
    for (let index = 0; index < 8; index += 1) {
      await page.evaluate(() => new Promise(requestAnimationFrame));
      entitySelectionFrames.push(await page.evaluate(() => {
        const header = document.querySelector("[data-chat-workspace-entity-workspace] #chat-workspace-entity-header");
        const panel = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list-panel")?.getBoundingClientRect();
        const list = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list")?.getBoundingClientRect();
        return panel && list
          ? {
            panelTop: Math.round(panel.top),
            listTop: Math.round(list.top),
            visibleCount: header?.getAttribute("data-floating-tab-visible-count") ?? "",
            overflowCount: header?.getAttribute("data-floating-tab-overflow-count") ?? "",
            visibleCardFlags: Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-card:not(.hidden)"))
              .map((card) => {
                const rect = card.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
              }),
          }
          : null;
      }));
    }
    const stableFrames = entitySelectionFrames.filter((frame): frame is {
      panelTop: number;
      listTop: number;
      visibleCount: string;
      overflowCount: string;
      visibleCardFlags: boolean[];
    } => frame !== null);
    const panelTops = stableFrames.map((frame) => frame.panelTop);
    const listTops = stableFrames.map((frame) => frame.listTop);
    const visibleCounts = new Set(stableFrames.map((frame) => frame.visibleCount));
    const overflowCounts = new Set(stableFrames.map((frame) => frame.overflowCount));
    const cardVisibilityFrames = new Set(stableFrames.map((frame) => JSON.stringify(frame.visibleCardFlags)));
    expect(entitySelectionBefore).not.toBeNull();
    expect(Math.max(...panelTops) - Math.min(...panelTops)).toBeLessThanOrEqual(1);
    expect(Math.max(...listTops) - Math.min(...listTops)).toBeLessThanOrEqual(1);
    expect(visibleCounts.size).toBe(1);
    expect(overflowCounts.size).toBe(1);
    expect(cardVisibilityFrames.size).toBe(1);
    expect(Math.abs(panelTops[0] - (entitySelectionBefore?.panelTop ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs(listTops[0] - (entitySelectionBefore?.listTop ?? 0))).toBeLessThanOrEqual(1);
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "false");
    await page.locator("[data-chat-workspace-entity-selector-trigger]").click();
    await expect(page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: /Product Discovery Package/ })).toHaveAttribute("aria-selected", "true");
    await page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: /Chat Session/ }).click();
    const chatSessionStatusLabels = await page.locator("[data-chat-workspace-entity-workspace] .floating-tab-card:not(.hidden)").evaluateAll((cards) =>
      cards
        .map((card) => card.getAttribute("data-tab-label"))
        .filter((label): label is string => Boolean(label)),
    );
    expect(chatSessionStatusLabels).toEqual(["In Progress", "Paused", "Complete", "Archived"]);
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "false");
    await page.locator("[data-chat-workspace-entity-selector-trigger]").click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "false");
    await page.locator("[data-chat-workspace-entity-selector-trigger]").click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "true");
    await page.locator("[data-chat-workspace-entity-workspace] .floating-tab-card").first().dispatchEvent("click");
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "false");
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row-marker")).toHaveCount(3);
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row-marker").first()).not.toBeVisible();
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row")).toHaveCount(3);
    await page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row").first().click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-drawer-open", "true");
    await expect(page.locator("[data-chat-workspace-list-drawer]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row").first()).toHaveAttribute("aria-pressed", "true");
    const drawerGeometry = await page.evaluate(() => {
      const panel = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list-panel")?.getBoundingClientRect();
      const list = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list")?.getBoundingClientRect();
      const drawer = document.querySelector("[data-chat-workspace-list-drawer]")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      const rows = Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-row"))
        .map((row) => row.getBoundingClientRect());
      return panel && list && drawer
        ? {
            panelWidth: Math.round(panel.width),
            panelHeight: Math.round(panel.height),
            panelTop: Math.round(panel.top),
            drawerTop: Math.round(drawer.top),
            listWidth: Math.round(list.width),
            listHeight: Math.round(list.height),
            drawerWidth: Math.round(drawer.width),
            drawerHeight: Math.round(drawer.height),
            workspaceBottom: workspace ? Math.round(workspace.bottom) : 0,
            panelBottom: Math.round(panel.bottom),
            drawerAfterList: drawer.left >= list.right,
            ratio: drawer.width / Math.max(1, list.width),
            maxRowHeight: Math.max(...rows.map((row) => row.height)),
            rowsBlockHeight: rows.length
              ? Math.round(Math.max(...rows.map((row) => row.bottom)) - Math.min(...rows.map((row) => row.top)))
              : 0,
          }
        : null;
    });
    expect(drawerGeometry).not.toBeNull();
    expect(drawerGeometry?.panelWidth ?? 0).toBeGreaterThan(300);
    expect(drawerGeometry?.drawerAfterList).toBe(true);
    expect(drawerGeometry?.ratio ?? 0).toBeGreaterThan(1.75);
    expect(drawerGeometry?.ratio ?? 0).toBeLessThan(2.25);
    expect(drawerGeometry?.panelHeight ?? 0).toBeGreaterThan(350);
    expect(drawerGeometry?.drawerHeight ?? 0).toBeGreaterThan((drawerGeometry?.panelHeight ?? 0) - 40);
    expect(Math.abs((drawerGeometry?.drawerHeight ?? 0) - (drawerGeometry?.listHeight ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((drawerGeometry?.drawerTop ?? 0) - ((drawerGeometry?.panelTop ?? 0) + 16))).toBeLessThanOrEqual(2);
    expect(Math.abs((drawerGeometry?.workspaceBottom ?? 0) - (drawerGeometry?.panelBottom ?? 0))).toBeLessThanOrEqual(24);
    expect(drawerGeometry?.maxRowHeight ?? 999).toBeLessThanOrEqual(92);
    expect(drawerGeometry?.rowsBlockHeight ?? 0).toBeLessThan((drawerGeometry?.listHeight ?? 0) - 80);
    await page.locator("[data-chat-workspace-list-drawer-close]").click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-drawer-open", "false");
    await expect(page.locator("[data-chat-workspace-list-drawer]")).not.toBeVisible();
    const closedListGeometry = await page.evaluate(() => {
      const header = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-header")?.getBoundingClientRect();
      const list = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list")?.getBoundingClientRect();
      const panel = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list-panel")?.getBoundingClientRect();
      const rows = Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-row"))
        .map((row) => row.getBoundingClientRect());
      return header && list && panel
        ? {
            gapAfterHeader: Math.round(list.top - header.bottom),
            spaceBelowList: Math.round(panel.bottom - list.bottom),
            maxRowHeight: Math.max(...rows.map((row) => row.height)),
            rowsBlockHeight: rows.length
              ? Math.round(Math.max(...rows.map((row) => row.bottom)) - Math.min(...rows.map((row) => row.top)))
              : 0,
          }
        : null;
    });
    expect(closedListGeometry).not.toBeNull();
    expect(closedListGeometry?.gapAfterHeader ?? 999).toBeLessThanOrEqual(56);
    expect(closedListGeometry?.spaceBelowList ?? 0).toBeGreaterThanOrEqual(24);
    expect(closedListGeometry?.maxRowHeight ?? 999).toBeLessThanOrEqual(92);
    expect(closedListGeometry?.rowsBlockHeight ?? 999).toBeLessThanOrEqual(240);
    await expect(page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-header")).toHaveAttribute("data-floating-tab-crowded", "true");

    const density = await page.locator("[data-chat-workspace-entity-workspace] #chat-workspace-entity-status-tabs").evaluate((scroller) => {
      const header = scroller.closest("#chat-workspace-entity-header");
      const visibleCards = Array.from(scroller.querySelectorAll(".floating-tab-card"))
        .filter((card) => card instanceof HTMLElement && getComputedStyle(card).display !== "none");

      return {
        visibleCount: visibleCards.length,
        slots: getComputedStyle(header ?? scroller).getPropertyValue("--floating-tab-visible-slots").trim(),
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(density.visibleCount).toBeGreaterThanOrEqual(1);
    expect(Number(density.slots)).toBeGreaterThanOrEqual(density.visibleCount);
    expect(density.pageOverflow).toBeLessThanOrEqual(2);

    const geometry = await page.evaluate(() => {
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      return chat && workspace
        ? {
            chatLeft: Math.round(chat.left),
            chatRight: Math.round(chat.right),
            workspaceRight: Math.round(workspace.right),
            workspaceWidth: Math.round(workspace.width),
          }
        : null;
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.workspaceRight ?? 0).toBeLessThanOrEqual(geometry?.chatLeft ?? 0);
    expect(Math.abs((geometry?.chatRight ?? 0) - (collapsedGeometry?.chatRight ?? 0))).toBeLessThanOrEqual(2);
    expect(geometry?.workspaceWidth ?? 0).toBeGreaterThan(400);
  });

  test("previews display settings drawer changes against the chat workspace shell", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await gotoChatWorkspace(page);

    const settingsButton = page.locator("[data-chat-workspace-settings-open]");
    await expect(settingsButton).toHaveClass(/context-nav-item/);
    await expect(settingsButton).toHaveAttribute("data-tooltip", "Display");
    await settingsButton.click();
    const drawer = page.locator("[data-chat-workspace-settings-drawer]");
    const shell = page.locator("[data-chat-workspace-shell]");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
    await expect(settingsButton).toHaveAttribute("aria-expanded", "true");

    await drawer.getByRole("button", { name: "Dark" }).click();
    await expect(shell).toHaveAttribute("data-theme-scope", "dark");
    await expect(page.locator("[data-chat-workspace-pattern]")).toHaveAttribute("data-demo-theme", "dark");

    await drawer.getByRole("button", { name: "135%" }).click();
    await expect(shell).toHaveCSS("transform", /matrix\(1\.35/);

    await drawer.getByRole("button", { name: "RTL" }).click();
    await expect(shell).toHaveAttribute("dir", "rtl");
    await expect(page.locator("[data-chat-workspace-pattern]")).toHaveAttribute("dir", "rtl");
    const rtlGeometry = await page.evaluate(() => {
      const navBox = document.querySelector(".context-nav")?.getBoundingClientRect();
      const drawerBox = document.querySelector("[data-chat-workspace-settings-drawer]")?.getBoundingClientRect();
      const chatBox = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      return navBox && drawerBox && chatBox
        ? {
            navRight: Math.round(navBox.right),
            drawerLeft: Math.round(drawerBox.left),
            drawerRight: Math.round(drawerBox.right),
            chatLeft: Math.round(chatBox.left),
          }
        : null;
    });
    expect(rtlGeometry).not.toBeNull();
    expect(Math.abs((rtlGeometry?.drawerLeft ?? 0) - (rtlGeometry?.navRight ?? 0))).toBeLessThanOrEqual(2);
    expect(rtlGeometry?.drawerRight ?? 9999).toBeLessThan(rtlGeometry?.chatLeft ?? 0);

    await drawer.getByRole("button", { name: "Close display settings" }).click();
    await expect(drawer).not.toBeVisible();
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
  });

  test("switches layer tabs and entity tabs without leaving the pattern surface", async ({ page }) => {
    await gotoChatWorkspace(page);
    await expandWorkspace(page);

    await page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row").first().click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-drawer-open", "true");
    await selectWorkspaceLayer(page, "design");
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"conversations\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool]")).toHaveCount(3);
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-drawer-open", "false");
    await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("tab", { name: "Queued" })).toHaveAttribute("aria-selected", "true");
    await expectActiveEntityCategory(page, "Architecture Questions");
    await expect(page.locator(".chat-workspace-history-dock .build-work-panel-demo-history-row").first()).toContainText("Product Discovery");
    await page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"design-questions\"]").click();
    await expectActiveEntityCategory(page, "Design Questions");
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"design-questions\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-card").filter({ hasText: "Blocked" }).first()).toHaveAttribute("data-tab-label", "Blocked");

    await selectWorkspaceLayer(page, "delivery");
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool]")).toHaveCount(4);
    await expectActiveEntityCategory(page, "Stories");
    await expect(page.locator(".chat-workspace-history-dock .build-work-panel-demo-history-row").first()).toContainText("Epics");
    await expect(page.locator("[data-chat-workspace-entity-workspace]").getByRole("tab", { name: "Draft" })).toHaveAttribute("aria-selected", "true");
    await page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"tasks\"]").click();
    await expectActiveEntityCategory(page, "Tasks");
    await expect(page.locator("[data-chat-workspace-layer-toolbar] [data-chat-workspace-tool=\"tasks\"]")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-card").filter({ hasText: "Ready for Delivery" }).first()).toHaveAttribute("data-tab-label", "Ready for Delivery");
    await expect(page.locator("[data-chat-workspace-entity-workspace] .floating-tab-row").first()).toContainText("Task");
  });

  test("keeps every entity preview status set and selector count honest", async ({ page }) => {
    await page.setViewportSize({ width: 1800, height: 1000 });
    await gotoChatWorkspace(page);
    await expandWorkspace(page);

    await auditEntityStatusPreview(page);
  });

  test("moves a list row to a new floating tab status by drag and drop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoChatWorkspace(page);
    await expandWorkspace(page);

    const dragResult = await page.evaluate(() => {
      const source = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-row");
      const target = Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-card"))
        .find((card) => card.getAttribute("data-tab-label") === "In Progress");
      if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        return null;
      }

      const transfer = new DataTransfer();
      source.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      target.dispatchEvent(new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: target.getBoundingClientRect().left + 12,
        clientY: target.getBoundingClientRect().top + 12,
        dataTransfer: transfer,
      }));
      const dropTarget = target.getAttribute("data-floating-tab-drop-target");
      target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      source.dispatchEvent(new DragEvent("dragend", { bubbles: true, cancelable: true, dataTransfer: transfer }));

      return {
        dropTarget,
        rows: Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-row strong"))
          .map((row) => row.textContent?.trim()),
        counts: Object.fromEntries(Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-card"))
          .map((card) => [card.getAttribute("data-tab-label"), card.getAttribute("data-tab-count")])),
        dragging: source.getAttribute("data-dragging"),
      };
    });

    expect(dragResult).not.toBeNull();
    expect(dragResult?.dropTarget).toBe("status");
    expect(dragResult?.rows).toEqual(["QU-002 - Queued follow-up", "QU-003 - Questions handoff"]);
    expect(dragResult?.counts.Queued).toBe("3");
    expect(dragResult?.counts["In Progress"]).toBe("4");
    expect(dragResult?.dragging).toBeNull();
  });

  test("shows shared reorder and status-drop affordances while dragging floating tab rows", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoChatWorkspace(page);
    await expandWorkspace(page);

    const reorderResult = await page.evaluate(() => {
      const list = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list");
      const rows = Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-row"));
      if (!(list instanceof HTMLElement) || !(rows[0] instanceof HTMLElement) || !(rows[1] instanceof HTMLElement)) {
        return null;
      }

      const transfer = new DataTransfer();
      rows[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      const targetBounds = rows[1].getBoundingClientRect();
      rows[1].dispatchEvent(new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: targetBounds.left + 12,
        clientY: targetBounds.bottom - 2,
        dataTransfer: transfer,
      }));

      const marker = list.querySelector("[data-drag-drop-marker]");
      const beforeDrop = {
        source: rows[0].classList.contains("drag-drop-source"),
        target: rows[1].getAttribute("data-floating-tab-row-drop-target"),
        sharedTarget: rows[1].getAttribute("data-drop-target"),
        marker: marker instanceof HTMLElement ? marker.dataset.dragDropMarkerLabel : "",
        sourceOpacity: Number(getComputedStyle(rows[0]).opacity),
        sourceOutlined: getComputedStyle(rows[0]).outlineStyle !== "none",
      };

      const markerBeforeTop = marker instanceof HTMLElement ? Math.round(marker.getBoundingClientRect().top) : null;
      marker?.dispatchEvent(new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: targetBounds.left + 12,
        clientY: marker instanceof HTMLElement ? marker.getBoundingClientRect().top + 2 : targetBounds.bottom - 2,
        dataTransfer: transfer,
      }));
      const stableMarker = list.querySelector("[data-drag-drop-marker]");
      const afterMarkerHover = {
        markerTop: stableMarker instanceof HTMLElement ? Math.round(stableMarker.getBoundingClientRect().top) : null,
        target: rows[1].getAttribute("data-floating-tab-row-drop-target"),
        sharedTarget: rows[1].getAttribute("data-drop-target"),
        markerCount: list.querySelectorAll("[data-drag-drop-marker]").length,
      };

      list.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      rows[0].dispatchEvent(new DragEvent("dragend", { bubbles: true, cancelable: true, dataTransfer: transfer }));

      return {
        beforeDrop,
        afterMarkerHover,
        markerBeforeTop,
        rows: Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-row strong"))
          .map((row) => row.textContent?.trim()),
        count: document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-card[data-tab-label=\"Queued\"]")
          ?.getAttribute("data-tab-count"),
        markerAfterDrop: Boolean(list.querySelector("[data-drag-drop-marker]")),
      };
    });

    expect(reorderResult).not.toBeNull();
    expect(reorderResult?.beforeDrop).toEqual({
      source: true,
      target: "after",
      sharedTarget: "after",
      marker: "Drop here",
      sourceOpacity: 0.9,
      sourceOutlined: true,
    });
    expect(reorderResult?.afterMarkerHover).toEqual({
      markerTop: reorderResult?.markerBeforeTop,
      target: "after",
      sharedTarget: "after",
      markerCount: 1,
    });
    expect(reorderResult?.rows).toEqual([
      "QU-002 - Queued follow-up",
      "QU-001 - Questions queued item",
      "QU-003 - Questions handoff",
    ]);
    expect(reorderResult?.count).toBe("4");
    expect(reorderResult?.markerAfterDrop).toBe(false);

    const statusOverlay = await page.evaluate(() => {
      const source = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-row");
      const target = Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-card"))
        .find((card) => card.getAttribute("data-tab-label") === "In Progress");
      if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
        return null;
      }

      const transfer = new DataTransfer();
      source.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      target.dispatchEvent(new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: target.getBoundingClientRect().left + 12,
        clientY: target.getBoundingClientRect().top + 12,
        dataTransfer: transfer,
      }));
      const overlay = target.querySelector(".floating-tab-card-drop-overlay");
      const result = {
        target: target.getAttribute("data-floating-tab-drop-target"),
        overlay: overlay?.textContent?.trim(),
        overlayDisplay: overlay instanceof Element ? window.getComputedStyle(overlay).display : "",
      };
      source.dispatchEvent(new DragEvent("dragend", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      return result;
    });

    expect(statusOverlay).not.toBeNull();
    expect(statusOverlay?.target).toBe("status");
    expect(statusOverlay?.overlay).toBe("Drop to move here");
    expect(statusOverlay?.overlayDisplay).toBe("grid");
  });

  test("keeps the governed chat controls interactive", async ({ page }) => {
    await page.setViewportSize({ width: 2048, height: 900 });
    await gotoChatWorkspace(page);

    const panel = page.locator(".chat-workspace-chat-pane [data-build-work-panel-panel]");
    await expandWorkspace(page);
    const historyOpenGeometry = await page.evaluate(() => {
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const chatColumn = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-chat-column")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      return chat && chatColumn && workspace
        ? {
            chatWidth: Math.round(chat.width),
            chatColumnWidth: Math.round(chatColumn.width),
            workspaceWidth: Math.round(workspace.width),
          }
        : null;
    });

    await page.locator("[data-chat-workspace-chat-selector-toggle]:visible").click();
    await expect(panel).toHaveAttribute("data-history-open", "false");
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-history-open", "false");
    await page.waitForTimeout(240);
    const historyHiddenGeometry = await page.evaluate(() => {
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const chatColumn = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-chat-column")?.getBoundingClientRect();
      const workspace = document.querySelector(".chat-workspace-main")?.getBoundingClientRect();
      const entityTrigger = document.querySelector("[data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger]")?.getBoundingClientRect();
      const listHeader = document.querySelector("[data-chat-workspace-secondary-list]")?.getBoundingClientRect();
      const chatHeader = document.querySelector("[data-chat-workspace-secondary-chat]")?.getBoundingClientRect();
      const chatTrigger = document.querySelector("[data-chat-workspace-secondary-chat] [data-chat-workspace-chat-selector-toggle]")?.getBoundingClientRect();
      const newChat = document.querySelector("[data-chat-workspace-secondary-new-chat]")?.getBoundingClientRect();
      return chat && chatColumn && workspace
        ? {
            chatWidth: Math.round(chat.width),
            chatColumnWidth: Math.round(chatColumn.width),
            workspaceWidth: Math.round(workspace.width),
            entityTriggerWidth: entityTrigger ? Math.round(entityTrigger.width) : 0,
            listRight: listHeader ? Math.round(listHeader.right) : 0,
            chatLeft: chatHeader ? Math.round(chatHeader.left) : 0,
            chatRight: chatHeader ? Math.round(chatHeader.right) : 0,
            chatTriggerRight: chatTrigger ? Math.round(chatTrigger.right) : 0,
            newChatLeft: newChat ? Math.round(newChat.left) : 0,
          }
        : null;
    });

    expect(historyOpenGeometry).not.toBeNull();
    expect(historyHiddenGeometry).not.toBeNull();
    expect(Math.abs((historyHiddenGeometry?.chatWidth ?? 0) - (historyOpenGeometry?.chatWidth ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((historyHiddenGeometry?.chatColumnWidth ?? 0) - (historyOpenGeometry?.chatColumnWidth ?? 0))).toBeLessThanOrEqual(4);
    expect(historyHiddenGeometry?.workspaceWidth ?? 0).toBeGreaterThan(historyOpenGeometry?.workspaceWidth ?? 0);
    expect(historyHiddenGeometry?.entityTriggerWidth ?? 0).toBeGreaterThan(140);
    expect(Math.abs((historyHiddenGeometry?.listRight ?? 0) - (historyHiddenGeometry?.chatLeft ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((historyHiddenGeometry?.chatRight ?? 0) - (historyHiddenGeometry?.newChatLeft ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((historyHiddenGeometry?.chatTriggerRight ?? 0) - (historyHiddenGeometry?.newChatLeft ?? 0))).toBeLessThanOrEqual(18);
    await expect(page.locator("[data-chat-workspace-secondary-chat] [data-chat-workspace-chat-selector-toggle]")).toBeVisible();
    await expect(page.locator("[data-chat-workspace-secondary-new-chat] [data-chat-workspace-new-conversation]")).toBeVisible();
    await page.locator("[data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger]").click();
    await expect(page.locator("[data-chat-workspace-entity-workspace]")).toHaveAttribute("data-chat-workspace-entity-selector-open", "true");
    await expect(page.locator("[data-chat-workspace-entity-selector-options]")).toBeVisible();
    await page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: /Chat Session/ }).click();
    await expectActiveEntityCategory(page, "Chat Session");
    await page.locator("[data-chat-workspace-secondary-list] [data-chat-workspace-entity-selector-trigger]").click();
    await page.locator("[data-chat-workspace-entity-selector-options]").getByRole("option", { name: /Questions/ }).click();
    await expectActiveEntityCategory(page, "Questions");
    const hiddenHistoryFrames = [];
    for (let index = 0; index < 8; index += 1) {
      await page.evaluate(() => new Promise(requestAnimationFrame));
      hiddenHistoryFrames.push(await page.evaluate(() => {
        const tabHeaderElement = document.querySelector("[data-chat-workspace-entity-workspace] #chat-workspace-entity-header");
        const tabHeader = tabHeaderElement?.getBoundingClientRect();
        const panel = document.querySelector("[data-chat-workspace-entity-workspace] .floating-tab-list-panel")?.getBoundingClientRect();
        const cards = Array.from(document.querySelectorAll("[data-chat-workspace-entity-workspace] .floating-tab-card:not(.hidden)"));
        return tabHeader && panel
          ? {
              tabHeight: Math.round(tabHeader.height),
              panelTop: Math.round(panel.top),
              crowded: tabHeaderElement instanceof Element ? tabHeaderElement.getAttribute("data-floating-tab-crowded") : null,
              cardHeights: cards.map((card) => Math.round(card.getBoundingClientRect().height)),
              metaDisplays: cards.map((card) => getComputedStyle(card.querySelector(".floating-tab-card-meta") as Element).display),
            }
          : null;
      }));
    }
    const stableHiddenHistoryFrames = hiddenHistoryFrames.filter((frame): frame is {
      tabHeight: number;
      panelTop: number;
      crowded: string | null;
      cardHeights: number[];
      metaDisplays: string[];
    } => frame !== null);
    expect(new Set(stableHiddenHistoryFrames.map((frame) => frame.tabHeight)).size).toBe(1);
    expect(new Set(stableHiddenHistoryFrames.map((frame) => frame.panelTop)).size).toBe(1);
    expect(new Set(stableHiddenHistoryFrames.map((frame) => frame.crowded)).size).toBe(1);
    expect(new Set(stableHiddenHistoryFrames.map((frame) => JSON.stringify(frame.cardHeights))).size).toBe(1);
    expect(stableHiddenHistoryFrames.every((frame) => {
      const [firstDisplay] = frame.metaDisplays;
      return frame.metaDisplays.every((display) => display === firstDisplay);
    })).toBe(true);

    await page.locator("[data-chat-workspace-toggle]:visible").first().click();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "false");
    await expect(page.locator("[data-chat-workspace-joint-header]")).toBeVisible();
    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-panel-header")).not.toBeVisible();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-chat-column")).toBeVisible();
    await page.waitForTimeout(240);
    const collapsedAfterHiddenHistoryGeometry = await page.evaluate(() => {
      const shell = document.querySelector("[data-chat-workspace-shell]")?.getBoundingClientRect();
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const panel = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-panel")?.getBoundingClientRect();
      const chatColumn = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-chat-column")?.getBoundingClientRect();
      return shell && chat && panel && chatColumn
        ? {
            shellWidth: Math.round(shell.width),
            shellRight: Math.round(shell.right),
            chatWidth: Math.round(chat.width),
            panelWidth: Math.round(panel.width),
            chatColumnWidth: Math.round(chatColumn.width),
            viewportRight: document.documentElement.clientWidth,
            pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          }
        : null;
    });
    expect(collapsedAfterHiddenHistoryGeometry).not.toBeNull();
    expect(collapsedAfterHiddenHistoryGeometry?.shellWidth ?? 0).toBeGreaterThan(700);
    expect(collapsedAfterHiddenHistoryGeometry?.chatWidth ?? 0).toBeGreaterThan(700);
    expect(collapsedAfterHiddenHistoryGeometry?.panelWidth ?? 0).toBeGreaterThan(650);
    expect(collapsedAfterHiddenHistoryGeometry?.chatColumnWidth ?? 0).toBeGreaterThan(650);
    expect(Math.abs((collapsedAfterHiddenHistoryGeometry?.shellRight ?? 0) - (collapsedAfterHiddenHistoryGeometry?.viewportRight ?? 0))).toBeLessThanOrEqual(32);
    expect(collapsedAfterHiddenHistoryGeometry?.pageOverflow ?? 0).toBeLessThanOrEqual(2);

    await page.locator("[data-chat-workspace-toggle]:visible").first().click();
    await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-expanded", "true");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-tools-toggle]").click();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-tools-menu]")).toHaveClass(/is-open/);
    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-tool-action='capture-logs']").click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-copy-status")).toContainText("capture logs selected");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-copy-message]").first().click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-copy-status")).toContainText("Message copied");

    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-message]").fill("Interactive test message");
    await page.locator(".chat-workspace-chat-pane [data-build-work-panel-message]").press("Enter");
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-message").last()).toContainText("Captured.");

    if ((await page.locator("[data-chat-workspace-shell]").getAttribute("data-chat-workspace-history-open")) === "false") {
      await page.locator("[data-chat-workspace-chat-selector-toggle]:visible").click();
      await expect(page.locator("[data-chat-workspace-shell]")).toHaveAttribute("data-chat-workspace-history-open", "true");
    }
    await page.locator("[data-chat-workspace-secondary-new-chat] [data-chat-workspace-new-conversation]").click();
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-packet]")).toHaveCount(0);
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-message")).toHaveCount(1);
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-message").first()).toContainText("New chat started");
    const newChatGeometry = await page.evaluate(() => {
      const chatColumn = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-chat-column")?.getBoundingClientRect();
      const input = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-input-area")?.getBoundingClientRect();
      const thread = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-thread")?.getBoundingClientRect();
      return chatColumn && input && thread
        ? {
            inputBottomGap: Math.round(chatColumn.bottom - input.bottom),
            threadBottom: Math.round(thread.bottom),
            inputTop: Math.round(input.top),
          }
        : null;
    });
    expect(newChatGeometry).not.toBeNull();
    expect(newChatGeometry?.inputBottomGap ?? 999).toBeLessThanOrEqual(2);
    expect(newChatGeometry?.threadBottom ?? 0).toBeLessThanOrEqual(newChatGeometry?.inputTop ?? 0);

    await page.locator("[data-chat-workspace-close]:visible").click();
    await expect(page.locator(".chat-workspace-chat-pane .build-work-panel-demo-panel")).not.toHaveClass(/is-open/);
    await expect(page.locator(".chat-workspace-chat-pane [data-build-work-panel-mode='build']")).toBeHidden();
  });

  test("keeps dark, RTL, magnified, and mobile states reachable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoChatWorkspace(page, "/design-system/patterns/chat-workspace?theme=dark&dir=rtl&scale=135");

    const shell = page.locator("[data-chat-workspace-shell]");
    await expect(shell).toHaveAttribute("data-theme-scope", "dark");
    await expect(shell).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".chat-workspace-chat-pane")).toBeVisible();
    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("[data-chat-workspace-toggle]:visible")).toHaveCount(0);

    const state = await page.evaluate(() => {
      const shell = document.querySelector("[data-chat-workspace-shell]");
      const chat = document.querySelector(".chat-workspace-chat-pane")?.getBoundingClientRect();
      const workspaceElement = document.querySelector(".chat-workspace-main");
      const workspace = workspaceElement?.getBoundingClientRect();
      const actionNav = document.querySelector(".chat-workspace-chat-pane .build-work-panel-demo-action-nav");
      return {
        actionNavHidden: actionNav ? getComputedStyle(actionNav).display === "none" : false,
        scale: shell instanceof HTMLElement ? getComputedStyle(shell).getPropertyValue("--ui-scale").trim() : "",
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        chatWidth: chat ? Math.round(chat.width) : 0,
        workspaceHidden: workspaceElement ? getComputedStyle(workspaceElement).visibility === "hidden" : false,
      };
    });

    await expect(page.locator(".chat-workspace-main")).toHaveAttribute("aria-hidden", "true");
    await expect(shell).toHaveAttribute("data-chat-workspace-expanded", "false");
    expect(state.actionNavHidden).toBe(true);
    expect(state.scale).toBe("1.35");
    expect(state.overflow).toBeLessThanOrEqual(2);
    expect(state.chatWidth).toBeGreaterThan(320);
    expect(state.workspaceHidden).toBe(true);
  });
});
